<template>
  <div id="app" :class="{ 'with-logger' : (this.$refs.logger && this.$refs.logger.opened) && $route.meta.layout != 'admin' && $route.meta.layout != 'froala' && isAdmin && !$route.query.wizard_step && !initWizard, 'truevalue-site': isTruevalue, 'page-preview' : $route.query.preview }">
    <div v-if="!$route.query.iframe && !loading">
      <AdminLayout v-if="this.$route.meta.layout == 'admin'">
        <router-view />
      </AdminLayout>
      <router-view v-else-if="$route.meta.layout == 'froala'" />
      <template v-else>
        <div v-if="$store.state.settings.buyingFromAlert.visible && $store.state.currentStore" :class="`alert text-${$store.state.settings.buyingFromAlert.textColor} alert-${$store.state.settings.buyingFromAlert.background} border-0 rounded-0 py-2 m-0 text-center`" role="alert" :style="{fontSize: `${$store.state.settings.buyingFromAlert.fontSize || 13}px`}">
          Buying from <b>{{ $store.state.currentStore.name }}</b>.
          {{ $store.state.currentStore.address }}, <a class="text-decoration-none" :href="`tel:${$store.state.currentStore.phone}`">{{ $store.state.currentStore.phone }}</a>
        </div>
        <AlertBanner v-if="$store.state.settings.homeAlert.visible" :options="$store.state.settings.homeAlert" :text="homeAlertText" />
        <CartSidebar ref="CartSidebar" />
        <DefaultLayout @showLocationModal="showLocationModal">
          <router-view :name="$store.state.settings.layout" :key="$route.fullPath"/>
        </DefaultLayout>
      </template>
      <promo-modal v-if="$route.query.promo && (stores.length == 1 || selectedStore)" />
    </div>
    <BlankLayout v-else></BlankLayout>
    <store-location-modal @buildWebsite="buildWebsite" ref="storeSelectionModal" :style="{visibility: modalVisibilityHack}" />
    <Logger ref="logger" @toggleLogger="toggleLogger" v-show="$route.meta.layout != 'admin' && $route.meta.layout != 'froala'" />
    <Wizard v-if="wizard && !loading" />
    <WizardModal ref="wizardModal" />
    <CookieBanner />
    <PromoPopup v-if="$route.name == 'index' && (stores.length == 1 || selectedStore)" />
  </div>
</template>

<script>

  import HomePageService from '@/api-services/homepage.service';
  import CartApiService from '@/api-services/cart.service';
  import CustomNavigationService from '@/api-services/custom-navigation.service';
  import { handleFakeGASession } from '@/plugins/analytics';
  import AlertBanner from '@/components/alert-banner';
  import PromoPopup from '@/components/modals/promo-popup';
  import CartSidebar from '@/components/cart/cart-sidebar';

  export default {
    name: 'App',
    components: {
      AlertBanner,
      PromoPopup,
      CartSidebar
    },
    data() {
      return {
        loading: true,
        stores: [],
        modalVisibilityHack: 'hidden',
        wizard: localStorage.wizard && this.$store.state.activeUser && this.$store.state.activeUser.is_admin,
      };
    },
    computed: {
      isTruevalue() {
        // NEVER EVER PUT RETURN TRUE HERE!!!!!!!!!!!!!!!!!!!!
        // USE .env.local AND SET VUE_APP_IS_TRUEVALUE=1 !!!!!!!!!!!!!!!1
        // People are forgetting to remove return true and fucking up the sites.
        return String(window.__EZ_IS_TRUEVALUE).toLowerCase() == 'true' || String(process.env.VUE_APP_IS_TRUEVALUE).toLowerCase() == 'true' || false;
      },
      isBenjaminMoore() {
        return String(window.__EZ_IS_BENJAMINMOORE).toLowerCase() == 'true' || String(process.env.VUE_APP_IS_BENJAMINMOORE).toLowerCase() == 'true' || false;
      },
      selectedStore: {
        get() {
          return localStorage.getItem('selectedStore') || null;
        },
        set(val) {
          return val;
        }
      },
      initWizard() {
        return this.$route.query.wizard;
      },
      logger() {
        return this.$refs.logger;
      },
      isAdmin() {
        return this.$store.state.activeUser && this.$store.state.activeUser.data && this.$store.state.activeUser.data.is_developer;
      },
      loggerOpened: {
        get() {
          return this.isAdmin ? this.$refs.logger ? this.$refs.logger.opened : false : false;
        },
        set(val) {
          return val;
        }
      },
      settings() {
        return this.$store.state.settings;
      },
      hideLocalAdNavLink() {
        return this.settings.localAd && this.settings.localAd.hideLocalAdNavLink
          && this.settings.localAd.hideLocalAdNavLink === true || false;
      },
      allowOverrideEvenBasicPlan() {
        return this.settings.homeAlert && this.settings.homeAlert.allowOverrideEvenBasicPlan && this.settings.homeAlert.allowOverrideEvenBasicPlan === true || false;
      },
      homeAlertText() {
        return this.$store.state.isBasicPlan && !this.allowOverrideEvenBasicPlan ? 'Welcome to our new site! Browse our selection of in-stock products below.' 
          : this.$store.state.settings.homeAlert.text;
      },
      cartItemCount() {
        return this.$store.state.cartItemCount || 0;
      },
      isMiamiHomeCenter() {
        if(this.$store.state.currentStore && this.$store.state.currentStore.business_id && [7335,7369,7370,7371].includes(this.$store.state.currentStore.business_id * 1)){
          return true;
        }
        return false;
      }
    },
    async created() {
      let tag = document.createElement('script');
      tag.setAttribute('src', 'https://platform.liquidus.net/slplatform.js');
      document.head.appendChild(tag);
      this.$store.dispatch('fetchBusinessInfo');
      this.addSettings();

      if(this.isAdmin) {
        this.$router.beforeEach(async (to, from, next) => {
          this.$refs.logger ? this.$refs.logger.clear() : null;
          next();
        });
      }
    },
    async mounted() {
      
      if(this.initWizard) {
        this.$refs.wizardModal.showModal();
      }
      !this.$store.state.departmentResults && this.$store.dispatch('departments');
      !this.$store.state.widgetTypes && this.$store.dispatch('widgetTypes');
      !this.$store.state.widgets && this.$store.dispatch('widgets');
      
      if(!window.__EZ_CUSTOM_NAV_GROUPS) {
        CustomNavigationService.getNavigationGroups().then(res => {
          this.$store.dispatch('customNavigationGroups', res.data.data);
        });
      } else {
        this.$store.dispatch('customNavigationGroups', window.__EZ_CUSTOM_NAV_GROUPS);
      }

      let customNavigation;
      if(window.__EZ_CUSTOM_NAV === undefined) {
        CustomNavigationService.getNavigation().then(res => {
          customNavigation = res.data.data;
          // Dispatch and store Navigation
          this.$store.dispatch('customNavigation', customNavigation);
        });
      } else {
        customNavigation = window.__EZ_CUSTOM_NAV;
        // Dispatch and store Navigation
        this.$store.dispatch('customNavigation', customNavigation);
      }

      if(customNavigation) {
        customNavigation = customNavigation.sort((a, b) => {
          return a.order - b.order || -1;
        });
      }

      // Dispatch and store all locations
      this.stores = this.$store.state.businessDetails.about_us.locations;
      this.$store.dispatch('storeLocations', this.stores);

      // For Truevalue stores, confirm if local ad is enabled, then add a new nav
      if(customNavigation && this.isTruevalue && !this.hideLocalAdNavLink && this.$store.state.businessDetails.truevalue_localad && this.$store.state.businessDetails.truevalue_localad == 1) {
        const localAdNav = {
          id: -1,
          name: 'Local Ad',
          target: '/local-ad',
          dropdown: null,
          align: 'left',
          show_in_header: 0,
          sub_target: null,
          real_name: null,
          order: 999
        };
        customNavigation.push(localAdNav);
        this.$store.commit('updateNavigation', customNavigation);
      }

      // // Dispatch and store Footer
      CustomNavigationService.getFooter().then(res => {
        let footer = res.data.data;
        this.$store.dispatch('footer', footer);
      });


      if(this.stores && this.stores.length == 1){
        localStorage.setItem('selectedStore',this.stores[0].id);
        this.selectedStore = this.stores[0].id;
      }
      if(!this.$route.query.iframe) { // has a error message when using blank layout
        localStorage.getItem('selectedStore') && this.$refs.storeSelectionModal && this.$refs.storeSelectionModal.hideModal();
      }

      this.$store.commit('setCurrentStore');


      await this.$store.dispatch('fetchCartItemsDetails');
      await this.buildWebsite();
      setTimeout(() => {
        this.modalVisibilityHack = 'visible';
      }, 300);

      this.$store.dispatch('trackUser');

      if(this.$route.path != '/') {
        this.loading = false;
      }

      handleFakeGASession();

      if(this.isAdmin)
        this.addLogs();
      this.loading = false;
    },
    methods: {
      addSettings() {
        const root = document.documentElement;
        const settings = this.$store.state.settings;
        const head = document.getElementsByTagName('head')[0];
        let link = document.createElement('link');
        let headerBgLight = this.lightBackground(settings.colors.header || '#fff');
        let navBgLight = this.lightBackground(settings.colors.navigation || '#fff');
        let linkLight = this.lightBackground(settings.colors.headerLinkColor || headerBgLight && settings.colors.primary || '#fff');
        
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = `https://fonts.googleapis.com/css2?family=${settings.font}:opsz,wght@9..40,400;9..40,700&display=swap`;
        head.appendChild(link);
        
        link.rel = 'icon';
        link.href = settings.favicon;
        head.appendChild(link);
        // all controlled from pages now, don't screw with title here
        //document.title = settings.businessName;
        let tvEditableNavBg = ['7335','7294'];
        let tvEditableNavText = ['7335'];

        Object.keys(settings.colors).forEach(e => root.style.setProperty(`--${e}`, this.parseColor(settings.colors[e]) || '#fff'));

        root.style.setProperty('--brandPrimary', this.isTruevalue ? '#D31931' : settings.colors.primary);
        root.style.setProperty('--navigation', !tvEditableNavBg.includes(localStorage.getItem('selectedStore')) && this.isTruevalue ? '#fff' : settings.colors.navigation);

        // root.style.setProperty('--headerLinkColor', settings.colors.headerLinkColor || headerBgLight && 'var(--primary)' || '#fff');
        root.style.setProperty('--headerLinkColor', this.isTruevalue ? '#000' : settings.colors.headerLinkColor || headerBgLight && 'var(--primary)' || '#fff');
        root.style.setProperty('--headerLinkColorInv', linkLight && '#000' || '#fff');
        root.style.setProperty('--headerText', this.isTruevalue ? '#000' : settings.colors.headerText || headerBgLight && 'var(--text)' || '#fff');
        root.style.setProperty('--navigationLinkColor', !tvEditableNavText.includes(localStorage.getItem('selectedStore')) && this.isTruevalue ? '#000' : navBgLight && 'var(--primary)' || '#fff');
        root.style.setProperty('--navigationText', navBgLight && 'var(--text)' || '#fff');
        root.style.setProperty('--navigationFontSize', settings.navigationFontSize || '14px');
        root.style.setProperty('--font', this.isTruevalue || !settings.font ? 'Helvetica,Arial,sans-serif' : settings.font);

        // only do this in dev on localhost
        if(process.env.NODE_ENV === 'development') {
          if(settings.customCss) {
            require(`@/custom-styles/${settings.customCss}`);
          }
        }
      },
      addLogs() {
        let settings = this.$store.state.settings;
        this.$refs.logger.addLogs({
          group: 'General',
          global: true,
          data: [
            { label: 'font', value: settings.font },
            { label: 'colors.primary', value: settings.colors.primary },
            { label: 'colors.header', value: settings.colors.header },
            { label: 'colors.headerText', value: settings.colors.headerText },
            { label: 'colors.navigation', value: settings.colors.navigation },
            { label: 'colors.headerLinkColor', value: settings.colors.headerLinkColor },
            { label: 'buyingFromAlert.textColor', value: settings.buyingFromAlert.textColor },
            { label: 'buyingFromAlert.background', value: settings.buyingFromAlert.background },
            { label: 'buyingFromAlert.fontSize', value: settings.buyingFromAlert.fontSize },
          ]
        });
      },
      toggleLogger() {
        this.loggerOpened = !this.loggerOpened;
      },
      showLocationModal() {
        if(this.$refs.storeSelectionModal)
          this.$refs.storeSelectionModal.showModal();
      },
      async buildWebsite() {
        if(this.isBenjaminMoore) {
          await this.$store.dispatch('setPaintCategories');
        }
        if(localStorage.getItem('showLocationPopup')){
          this.showLocationModal();
        } else if(localStorage.getItem('selectedStore') && this.stores.some(e => e.id == localStorage.getItem('selectedStore'))) {
          if(localStorage.getItem('emptyCart') && this.cartItemCount > 0) {
            this.$swal({
              title: "Switch Store?",
              text: `Are you sure you want to switch location to ${this.$refs.storeSelectionModal.storeNames[this.$refs.storeSelectionModal.selectedStore]}? If you switch locations, you will lose your existing cart.`,
              type: 'warning',
              confirmButtonText: 'Yes',
              cancelButtonText: 'Cancel',
              showCancelButton: true,
            }).then(async result => {
              if(result.value) {
                await CartApiService.emptyCart().then(() => {
                  this.$store.dispatch('fetchCartItemsDetails');
                }).catch(err => {
                  console.log(err);
                });
                localStorage.removeItem('emptyCart');
              } else {
                localStorage.removeItem('emptyCart');
                if(localStorage.getItem('prevSelectedStore')){
                  localStorage.setItem('selectedStore', localStorage.getItem('prevSelectedStore'));
                }
                window.location.reload();
              }
            });            
          } else {
            localStorage.removeItem('emptyCart');
          }
          try {
            let resp = await HomePageService.getSections();
            let response = resp.data.data;
            this.$store.commit('setHomepageSection', response);
            localStorage.setItem('homepage', JSON.stringify(response));
          } catch (err) {
            //console.log(err);
          }
        } else {
          localStorage.removeItem('homepage');
          localStorage.removeItem('selectedStore');

          this.showLocationModal();
        }
      },
      lightBackground(color) {
        var r, g, b, hsp;
        color = +(`0x${color.slice(1).replace(color.length < 5 && /./g, '$&$&')}`);
        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
        hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
        return hsp>127.5 ? true : false;
      },
      parseColor(color) {
      // Ifnot HEX return css color variable
        if(!color)
          return undefined;
        let re = /^#([0-9A-F]{3}){1,2}$/i;
        return re.test(color) ? color : `var(--${color})`;
      }
    },
    watch: {
      '$route'(to, from) {
        //this.setWizard();
        if(to.name === 'products-id' || to.name === 'products-slug') {
          localStorage.setItem('product_breadcrumbs', JSON.stringify({ from: from.name || 'index', fullPath: from.fullPath, params: from.params }));
        }
        this.loading = false;
      }
    },
  };
</script>


<style lang="scss">
  @import '@/assets/scss/app.scss';
  #app {
    transition: width .15s;
    width: 100%;
    &.with-logger {
      width: calc((var(--vw, 1vw) * 100) - 450px);
    }
    &.page-preview {
    border: 5px solid var(--danger);
    > div > div > .sticky-top {
      pointer-events: none;
    }
      &::after {
        content: 'Page Preview';
        position: fixed;
        border-radius: 20px;
        z-index: 2000000;
        transform: translateX(-50%);
        top: 30px;
        left: 50%;
        padding: 10px 24px;
        background: var(--danger);
        font-size: 24px;
        color: #fff;
      }
    }
  }
</style>
