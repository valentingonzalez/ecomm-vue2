import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router/index';
import store from '@/store';
import Axios from 'axios';
import EZAxios from '@/ezaxios';
import Hotjar from 'vue-hotjar';
import GlobalSettings from '@/GlobalSettings';
import AuthController from '@/controllers/auth.controller';
import CustomPagesService from '@/api-services/custom-pages.service';
import HomePageService from './api-services/homepage.service';
import CartApiService from './api-services/cart.service';
import WizardApiService from './api-services/wizard.service';
import * as YimoVueEditor from 'yimo-vue-editor';
import { requireAuth } from '@/plugins/requireAuth';
import * as VueMenu from '@hscmap/vue-menu';
import { StripePlugin } from '@vue-stripe/vue-stripe';

require('@/plugins');

// Enable custom plugins to load from src/plugins/custom/ when in test mode (yarn serve).
// This should be a map of business slug to business ID, while files in custom/ are named
// like BUSINESS_ID.js
// When deployed live, the .js files will be embedded as script tags in the HTML so other
// stores' plugins will not be loaded.
const enablePlugins = {
  "G6Z9cAQv4qtm2300": "2300"
};

if(window.dataLayer === undefined) {
  window.dataLayer = [];
}

Axios.interceptors.request.use(
  request => {
    const storeId = localStorage.getItem('selectedStore') || sessionStorage.getItem('selectedStore');

    if(storeId) {
      request.headers['Store-Id'] = storeId;
    }
    if(store.state.device_id) {
      request.headers['Device-Id'] = store.state.device_id;
    }
    return request;
  }
);

Axios.interceptors.response.use (response => response, error => {
    if(error.response && error.response.status === 401 && AuthController.checkAuthStatus()) {
      AuthController.logout(false);
    }
    throw error;
  }
);

EZAxios.interceptors.request.use(request => {
    const storeId = localStorage.getItem('selectedStore') || sessionStorage.getItem('selectedStore');
    if(storeId) {
      request.headers['Store-Id'] = storeId;
    }
    if(store.state.device_id) {
      request.headers['Device-Id'] = store.state.device_id;
    }
    return request;
  }
);

EZAxios.interceptors.response.use (response => response,
  error => {
    if(error.response && error.response.status === 401 && AuthController.checkAuthStatus()) {
      AuthController.logout(false);
    }
    throw error;
  }
);

// if settings is embedded we can use that and save an http request
let settingsPromise;
let useDynamicPlugins = true;
if(window.__EZ_STORE_SETTINGS) {
  // an already-resolved promise with fake response data
  settingsPromise = Promise.resolve({data: window.__EZ_STORE_SETTINGS});
  useDynamicPlugins = false;
} else {
  settingsPromise = Axios({url: GlobalSettings + '?k=' + Math.random(), baseURL: '/'});
}

settingsPromise.then(response => {
  store.commit('loadSettings', response.data);
  // only run in test, when __EZ_STORE_SETTINGS does not exist
  if(useDynamicPlugins) {
    require("@/plugins/custom/base");
    if(enablePlugins[response.data.businessSlug]) {
      require("@/plugins/custom/" + enablePlugins[response.data.businessSlug]);
    }
  }

  if ( window.__EZ_BACKEND_HOST ) {
    Axios.defaults.baseURL = window.__EZ_BACKEND_HOST.legacy;
    EZAxios.defaults.baseURL = window.__EZ_BACKEND_HOST.modern;
  } else {
    Axios.defaults.baseURL = process.env.VUE_APP_USE_LOCAL_API ? process.env.VUE_APP_LOCAL_API_BASE : 'https://api.ezadtv.com';
    EZAxios.defaults.baseURL = process.env.VUE_APP_USE_LOCAL_NEWAPI ? process.env.VUE_APP_LOCAL_NEWAPI_BASE : 'https://ecomapi.ezadtv.com';
  }

  if(store.state.settings.cart && store.state.settings.cart.allowSpecialOrderVendors) {
    let asov = store.state.settings.cart.allowSpecialOrderVendors;
    store.state.allowSpecialOrderVendors = !Array.isArray(asov) ? [asov] : asov;
  }

  // Add some global filters
  Vue.filter('lowerCase', function (value) {
    return value ? value.toLowerCase() : '';
  });
  Vue.filter('upperCase', function(value) {
    return value ? value.toUpperCase() : '';
  });
  Vue.filter('capitalize', function (value) {
    if(!value) return '';
    value = value.toString().toLowerCase();
    return value.charAt(0).toUpperCase() + value.slice(1);
  });
  Vue.filter('removeDecimals', function (value) {
    return Number(value).toString();
  });
  Vue.filter('parseUrl', function(val) {
    return val ? val.replace(/ /g, '-').toLowerCase() : '';
  });
  Vue.filter('isUrl', function(val) {
    var pattern = new RegExp('(^tel?:)|(^http[s]?:\/{2})|(^www)|(data:image?)');
    return pattern.test(val);
  });
  Vue.filter('styleTitle', function(title) {
    if(!store.state.settings.products.capitalizeTitle && !store.state.settings.products.useOriginalTitle) {
      return title ? title.toLowerCase()
              .split(' ')
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(' ') : '';
    } else if(store.state.settings.products.useOriginalTitle && !store.state.settings.products.capitalizeTitle) {
      return title;
    } else {
      return title ? title.toUpperCase() : '';
    }
  });

  const slugify = function(title) {
    return title.toLowerCase()
      .replace(/\//g, ' ')
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9_ -]/g, '')
      .replace(/\s+/g, '-');
  };

  Vue.filter('slugify', slugify);
  Vue.use({
    install: (V) => {
      V.prototype.$ezCheckTVRCode = function(code) {
        // must start with 3,4,5,6 and be 10 digits
        return typeof code === 'string' && /^[3-6]\d{9}$/.test(code);
      };
      V.prototype.$ezSlugify = slugify;
      V.prototype.$ezSetTitle = function(title) {
        const settings = this.$store.state.settings;
        document.title = (title ? (title + ' | ') : '') + settings.businessName;
      };
      V.prototype.$ezHasNoPermission = function(key) {

        // temporary allowed for rental categories
        const selectedStoreId = parseInt(localStorage.getItem('selectedStore'), 10);
        const renalAllowedIds = [8181, 8213, 5032, 5116, 8420, 6737];
        const isRentalAllowed = !!renalAllowedIds.find(id => id === selectedStoreId);
        if(key == 'manage_rental_categories' && !isRentalAllowed) {
          return true;
        }
        const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        // const master = userData.data.customer.is_master;

        let basicPlan = false;

        if(window.__EZ_TV_ECOM_PLAN === 'LEB' || window.__EZ_TV_ECOM_PLAN === 'E2P') { // injected via index.php
          basicPlan = true;
        }

        let basicPermissions = [
          "view_emails",
          "edit_landing_page",
          "edit_brands_settings",
          "edit_department_mapping",
          "edit_products",
          "manage_featured_products",
          "edit_about_us",
          "edit_locations",
          "edit_user_inputs",
          "manage_social_media",
          "manage_conersion_pixel",
          "manage_ar_accounts",
          "new_order_emails",
          "new_order_texts",
          "rental_emails",
          'manage_header_and_footer',
          'manage_custom_pages',
          'manage_sub_accounts',
          'manage_rental_categories',
          "manage_ai_widgets"
        ];

        if(window.__EZ_TV_ECOM_PLAN === 'E2P') {
          basicPermissions.push("consultation_report");
        }

        let permissions = [];
        if(userData && userData.data && userData.data.customer && userData.data.customer.permissions) {
            permissions = basicPlan ? basicPermissions : userData.data.customer.permissions;
        } else {
            permissions = basicPlan ? basicPermissions : [];
        }

        return !permissions || (permissions && !permissions.includes(key));
      };
      V.prototype.$ezTVRName = function() {
        return window.__EZ_TVR_NAME || 'True Value Rewards';
      };
    }
  });


  Vue.use(VueMenu);

  Axios.defaults.headers.Accept = 'application/json';
  Axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
  Axios.defaults.headers['Business-Slug'] = store.state.settings.businessSlug;
  EZAxios.defaults.headers.Accept = 'application/json';
  EZAxios.defaults.headers['Access-Control-Allow-Origin'] = '*';
  EZAxios.defaults.headers['Business-Slug'] = store.state.settings.businessSlug;

  if(window.__EZ_DEV) {
    Axios.defaults.headers['Ez-Devmode'] = 'true';
    EZAxios.defaults.headers['Ez-Devmode'] = 'true';
  }

  YimoVueEditor.E.customConfig = {};

  Vue.use(YimoVueEditor.instance, {
    config: {
      uploadImgUrl: 'https://api.ezadtv.com/about-us/upload',
      uploadImgFileName: 'image',
      uploadHeaders: {
        'Authorization': `Bearer ${ sessionStorage.getItem('token') || localStorage.getItem('token') }`
      },
      jsFilter: false,
      printLog: false,
      lang: YimoVueEditor.E.langs.en,
      colors: {
        '#ffffff': 'No color',
        '#000000': '',
        '#ec1346': '',
        '#e74818': '',
        '#fc804a': '',
        '#ffb700': '',
        '#ffff8f': '',
        '#802242': '',
        '#fc6c64': '',
        '#ffb586': '',
        '#fbdcfe': '',
        '#fdb9fd': '',
        '#377b06': '',
        '#74c23d': '',
        '#c2d421': '',
        '#c9e175': '',
        '#e9f6c6': '',
        '#153766': '',
        '#4e6db1': '',
        '#1741e8': '',
        '#91b1fd': '',
        '#22ddca': '',
        '#50085d': '',
        '#5d54a0': '',
        '#721ce3': '',
        '#5965a6': '',
        '#b7b6e7': '',
        '#4b1200': '',
        '#ae6337': '',
        '#ce9a7e': '',
        '#fec685': '',
        '#ffeedc': ''
      },
      menus: [
        'source',
        '|',
        'bold',
        'underline',
        'italic',
        'strikethrough',
        'forecolor',
        'bgcolor',
        '|',
        'quote',
        'fontsize',
        'head',
        'unorderlist',
        'orderlist',
        'alignleft',
        'aligncenter',
        'alignright',
        '|',
        'link',
        'unlink',
        'table',
        '|',
        'img',
        'video',
        'location',
        'insertcode',
        '|',
        'undo',
        'redo',
        'fullscreen'
      ]
    },
    uploadHandler: (type, resTxt) => {
      if(type == 'success') {
        var res = JSON.parse(resTxt);
        if(res.status !== 'ok')
          return null;
        return res.url;
      } else if(type === 'error') {
        //todo toast
      } else if(type === 'timeout') {
        //todo toast
      }
      return 'upload failed__';
    }
  });

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var selectedStoreNumber = urlParams.get('store');
  const selectedStoreId = urlParams.get('storeid');
  const setStorelocation = function(storeId) {
    localStorage.setItem('selectedStore', storeId);
    localStorage.removeItem('showLocationPopup');
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('store') || urlParams.has('storeid')) {
      urlParams.delete('store');
      urlParams.delete('storeid');
      const remParams = urlParams.toString();
      const newUrl = `${window.location.origin}${window.location.pathname}${remParams ? '?'+remParams : ''}`;
      window.location.href = newUrl;
    }
  };
  if(selectedStoreNumber || selectedStoreId) {
    HomePageService.getBusinessDetails().then(response => {
      const locations = response.data.data.about_us.locations;
      store.commit('setBusinessDetails', response.data.data);

      if(locations && locations.length > 1) {
        let location = selectedStoreNumber ? locations.find(location => location.store_number == selectedStoreNumber) : locations.find(location => location.business_id == selectedStoreId);
        if(!location && selectedStoreNumber){
            // remove all after dash in store number and check
          selectedStoreNumber = selectedStoreNumber.split("-")[0];
          location = locations.find(location => location.store_number == selectedStoreNumber);
          if(!location){
            // remove leading zeros from store number and check
            selectedStoreNumber = selectedStoreNumber * 1;
            location = locations.find(location => location.store_number == selectedStoreNumber);
          }

          if(!location){
            // check for business id
            location = locations.find(location => location.business_id == selectedStoreNumber);
          }
        }
        if(location) {
          const storeId = location.id;
          if(localStorage.getItem('selectedStore') && localStorage.getItem('selectedStore') != storeId) {
            localStorage.setItem('prevSelectedStore', localStorage.getItem('selectedStore'));
            localStorage.setItem('emptyCart', true);
            setStorelocation(storeId);
          } else {
            setStorelocation(storeId);
          }
          Axios.interceptors.request.use(
            request => {
              if(storeId) {
                request.headers['Store-Id'] = storeId;
              }
              return request;
            }
          );
          EZAxios.interceptors.request.use(
            request => {
              if(storeId) {
                request.headers['Store-Id'] = storeId;
              }
              return request;
            }
          );
        } else {
          localStorage.setItem('showLocationPopup', true);
        }
      }
    });
  }

  return Axios.get('payment-settings');
}).then(async response => {
  const d = response.data;
  store.state.payment_provider = d.payment_provider;
  store.state.payment_preparable = d.payment_preparable;
  if(d.payment_provider === 'stripe') {
    store.state.stripe_publishable = d.publishable_key;
    store.state.stripe_live = d.is_live;
    store.state.stripe_account_id = d.account_id;
    store.state.stripe_disable_save = d.disable_save_card;
  } else if(d.payment_provider === 'adyen') {
    store.state.adyen_origin_key = d.origin_key;
    store.state.adyen_environment = d.environment;
  } else if(d.payment_provider === 'plugnpay') {
    store.state.plugnpay_host = d.host;
    store.state.plugnpay_username = d.username;
    store.state.plugnpay_currency = d.currency;
  } else if(d.payment_provider === 'authorize_net') {
    store.state.authorize_net_live = d.is_live;
    store.state.authorize_net_login_id = d.login_id;
    store.state.authorize_net_client_key = d.client_key;
    store.state.authorize_net_show_billing_address = d.show_biling_address;
  } else if(d.payment_provider === 'fiserv') {
    store.state.fiserv_live = d.is_live;
  }


  let businessDetails = await HomePageService.getBusinessDetails();
  businessDetails = businessDetails.data.data;
  store.commit('setBusinessDetails', businessDetails);

  // set a store from URL. if it's bad it'll get cleared out right after.
  // used by SSR to skip the store selector popup.
  let m = window.location.search.match(/selectedStore=(\d+)/);
  if(m) {
    window.localStorage.setItem('selectedStore', m[1]);
  }

  // clear corrupt store id
  let curStore = window.localStorage.getItem('selectedStore');

  if(window.__EZ_VALID_STORES && window.__EZ_VALID_STORES.length > 0) {
    if(window.__EZ_VALID_STORES.indexOf(curStore) === -1) {
      window.localStorage.removeItem('selectedStore');
    }
  } else {
    if(curStore === '0') {
      window.localStorage.removeItem('selectedStore');
    }
  }



  let routes = store.state.settings.navigation || [];
  let layout = store.state.settings.layout;
  routes.map(e => {
    let path = e.target && !Vue.filter('isUrl')(e.target) ? e.target : e.name.replace(/ /g, '-').toLowerCase();
    let folder = e.custom ? 'custom-pages': 'pages';
    folder = typeof e.custom == 'string' ? `${folder}/${e.custom}` : folder;
    e.path = `/${path}`;
    e.components = {default:() => import(`@/${folder}/${path}.vue`),catalog:() => import(`@/${folder}/${path}.vue`)};
    if(e.dropdown) {
      e.dropdown.items = e.dropdown.items.map(d => {
        let path = d.target && !Vue.filter('isUrl')(d.target) ? d.target : d.name.replace(/ /g, '-').toLowerCase();
        d.path = `/${path}`.replace(/\/\//g, "/");
        d.components = {default:() => import(`@/${`${folder}/${path}`.replace(/\/+/g, '\/')}.vue`),catalog:() => import(`@/${`${folder}/${path}`.replace(/\/+/g, '\/')}.vue`)};
        d.custom = d.custom || e.custom;
        return d;
      });
    }
    // send props if defined inside props object
    if(e.props) {
      let p = e.props;
      e.props = { default: p, catalog: p };
    }
    return e;
  });
  routes.forEach(e => {
    if(e.dropdown) {
      if(typeof e.custom == 'string') {
        e.dropdown.items.forEach(i => {
          router.addRoute(i);
        });
      }
    }
    router.addRoute(e);
  });


  if(store.state.settings.customLayout) {
    router.options.routes.map(e => {
      if(e.components)
        e.components[layout] = e.name == 'index' ? () => import(`@/custom-pages/${layout}/index.vue`) : e.components.default;
    });
  }

  if(window.__EZ_IS_TRUEVALUE || process.env.VUE_APP_IS_TRUEVALUE || false) {
    Vue.use (Hotjar, { id: '2823502', isProduction: true });
  }

  Vue.config.productionTip = false;

  // clean cache every 15s. not sure if any lag would happen if a ton of stuff had to get cleaned,
  // so keep it short.
  setInterval(() => store.commit('expireCacheValues'), 15000);

//http://localhost:8080/admin/wizard/section/departments?step=2&store=21
 // Add routes for Admin Wizard if wizard is enabled
  if(store.state.activeUser && store.state.activeUser.is_admin && store.state.businessDetails.wizard_enabled) {
    if(!store.state.adminWizard) {
      await WizardApiService.getWizardBusinesses().then(resp => {
          store.commit('setAdminWizardBusinesses', resp.data.stores);
        }).then(async () => {
        await WizardApiService.getWizard(store.state.adminWizardBusinesses.find(e => e.base == true).id).then(async wizard => {
          store.commit('setAdminWizard', wizard.data.wizard);
          await WizardApiService.getSteps(store.state.adminWizard.id, store.state.adminWizardBusinesses[0].id).then(resp => {
            store.commit('setAdminWizardSteps', resp.data.steps.map(e => ({ ...e, link: e.title.toLowerCase().replaceAll(' ', '-')})));
            let steps = store.state.adminWizardSteps;
            if(steps) {
              steps.forEach(s => {
                router.addRoute('admin-wizard-section', {
                  path: `/admin/wizard/section/${s.link}`,
                  name: `admin-wizard-${s.link}`,
                  components: {
                    default: () => import(/* webpackChunkName: "page-[request]" */ `@/pages/admin/wizard/section/${s.link}/index.vue`),
                    catalog: () => import(/* webpackChunkName: "page-[request]" */ `@/pages/admin/wizard/section/${s.link}/index.vue`)
                  },
                  props: { id: s.id },
                  meta: { layout: 'admin', permission: 'admin', id: s.id },
                  beforeEnter: requireAuth
                });
              });
              CustomPagesService.getAllPages().then(customPages => {
                // Add Custom Pages to router
                store.dispatch('customPages', customPages.data.data);
                let customPagesRoutes = customPages.data.data.map(e => {
                  return {
                    name: e.link,
                    path: `/${e.link}`,
                    components: {default:() => import(`@/custom-pages/blank.vue`), catalog:() => import(`@/custom-pages/blank.vue`)},
                    props: {
                      default: { id: e.id },
                      catalog: { id: e.id }
                    }
                  };
                });
                customPagesRoutes.forEach(customPage => router.addRoute(customPage));
                mountApp();
              });
            };
          });
        });
      }).catch(() => {
        CustomPagesService.getAllPages().then(customPages => {
          // Add Custom Pages to router
          store.dispatch('customPages', customPages.data.data);
          let customPagesRoutes = customPages.data.data.map(e => {
            return {
              name: e.link,
              path: `/${e.link}`,
              components: {default:() => import(`@/custom-pages/blank.vue`), catalog:() => import(`@/custom-pages/blank.vue`)},
              props: {
                default: { id: e.id },
                catalog: { id: e.id }
              }
            };
          });
          customPagesRoutes.forEach(customPage => router.addRoute(customPage));
          mountApp();
        });
      });
    }
  } else {
    if(!store.state.businessDetails.wizard_enabled){
      [
        { link: "fulfillment-options" },
        { link: "payment-options" },
      ].forEach(s => {
          router.addRoute('admin-wizard-section', {
            path: `/admin/wizard/section/${s.link}`,
            name: `admin-wizard-${s.link}`,
            components: {
              default: () => import(/* webpackChunkName: "page-[request]" */ `@/pages/admin/wizard/section/${s.link}/index.vue`),
              catalog: () => import(/* webpackChunkName: "page-[request]" */ `@/pages/admin/wizard/section/${s.link}/index.vue`)
            },
            props: { id: s.id },
            meta: { layout: 'admin', permission: 'admin', id: s.id },
            beforeEnter: requireAuth
          });
        });
    }
    CustomPagesService.getAllPages().then(customPages => {
      // Add Custom Pages to router
      store.dispatch('customPages', customPages.data.data);
      let customPagesRoutes = customPages.data.data.map(e => {
        return {
          name: e.link,
          path: `/${e.link}`,
          components: {default:() => import(`@/custom-pages/blank.vue`), catalog:() => import(`@/custom-pages/blank.vue`)},
          props: {
            default: { id: e.id },
            catalog: { id: e.id }
          }
        };
      });
      customPagesRoutes.forEach(customPage => router.addRoute(customPage));
      mountApp();
    });
  }
  const options = {
    pk: store.state.stripe_publishable,
    stripeAccount: store.state.stripe_account_id,
    apiVersion: "2023-10-16",
    locale: "auto",
  };

  Vue.use(StripePlugin, options);
});


function mountApp() {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
}
