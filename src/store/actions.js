import CartApiService from '@/api-services/cart.service';
import BannerApiService from '@/api-services/banner.service';
import SearchApiService from '@/api-services/search.service';
import RentalApiService from '@/api-services/rental.service';
import HomePageApiService from '@/api-services/homepage.service';
import DepartmentsService from '@/api-services/departments.service';
import WidgetsApiService from '@/api-services/widgets.service';
import AdminApiService from '@/api-services/admin.service';
import ProductApiService from '@/api-services/product.service';
import PaintService from '@/api-services/paint.service';

export default {
  fetchBanner({ commit }) {
    BannerApiService.getBanner().then((res) => {
      commit('setBanner', res.data.data);
    });
  },

  fetchCartItemsDetails({ state, commit }) {
    const activeUser = state.activeUser;
    if (activeUser && activeUser.is_admin) {
      return;
    }
    commit('setFetchingCartItems', true);
    return CartApiService.cartDetails().then((res) => {
      commit('setFetchingCartItems', false);
      commit('setCartItems', res.data.data);
      // needs to show 1st step when items are added or removed
      if(localStorage.getItem('cartStep')){
        localStorage.removeItem("cartStep");
      }
    });
  },

  async fetchBusinessInfo({state, commit}) {
    if(state.businessDetails) {
      commit('setBusinessInfo', state.businessDetails.about_us);
    } else {
      let res = await HomePageApiService.getBusinessDetails();
      commit('setBusinessDetails', res.data.data);
      if(res.data.data.business)
        commit('setBusinessInfo', res.data.data.business.about_us);
    }
  },

  async searchSuggestion(context, key) {
    const handleRes = (resData) => {
      resData.data.brands.items.map(e => {
        e.original_brand = e.brand_name;
        e.brand_name = e.brand_name.toLowerCase();
      });
      resData.data.departments.items.map(e => e.name = e.name.toLowerCase());
      resData.data.products.items.map(e => {
        e.original_title = e.title;
        e.title = e.title.toLowerCase();
      });
      resData.data.top_search_terms && resData.data.top_search_terms.items.map(e => {
        e.original_title = e.title;
        e.title = e.title.toLowerCase();
      });
      context.commit('saveSearchSuggestions', resData.data);
    };

    const cacheKey = "suggestions:" + key;
    const cachedValue = context.getters.getCachedValue(cacheKey);

    const triggerSearch = key.length > 2 ? true : false;

    if (cachedValue && triggerSearch) {
      handleRes(cachedValue);
      return Promise.resolve(cachedValue);
    }

    if(triggerSearch) {
      const sugg = await SearchApiService.searchSuggestions(key).then((res) => {
        return res;
      });

      const searchTermSugg = await SearchApiService.getSearchTermSuggestions(key).then((res) => {
        return res;
      });

      sugg.data.data.top_search_terms = searchTermSugg.data.data ? searchTermSugg.data.data.top_search_terms : null;
      context.commit('setCacheValue', {key: cacheKey, data: sugg.data, expiresIn: 60});
      handleRes(sugg.data);
    }
  },

  searchBrandProductSuggestion(context, key) {
    const handleRes = (resData) => {
      resData.data.map(e => {
        e.original_title = e.name;
        e.title = e.name.toLowerCase();
      });
      context.commit('saveSearchBrandProductSuggestions', resData.data);
    };

    const cacheKey = "brandProductSuggestions:" + key;
    const cachedValue = context.getters.getCachedValue(cacheKey);
    if ( cachedValue ) {
      handleRes(cachedValue);
      return Promise.resolve(cachedValue);
    }
    AdminApiService.searchBrandProducts(key).then((res) => {
      context.commit('setCacheValue', {key: cacheKey, data: res.data, expiresIn: 60});
      handleRes(res.data);
    });
  },

  search(context, params) {
    const handleRes = (resData) => {
      let products = resData.data;
      products.data.forEach((product) => {
        product.competitors = null;
      });
      context.commit('saveSearchResults', {
        products: products,
        departments_hierarchy: resData.departments_hierarchy,
        departments: resData.departments,
        brands: resData.brands.map(e => { e.brand_name = e.brand_name.toLowerCase(); return e; }),
        priceRanges: resData.price_ranges,
        otherFacets: resData.other_facets,
        removedInStockOnly: resData.removed_instock_only,
        topDepartments: resData.top_departments || null,
      });
    };

    // WHAT THE FUCK IS GOING ON HERE?????????????????
    // IS dept_id GETTING SET FUCKING AFTER THIS FUNCTION IS CALLED? HOLY FUCKING SHIT
    // FUCK THIS ENTIRE FUCKING PROJECT
    //params = JSON.parse(JSON.stringify(params));
    const cacheKey = "search:" + JSON.stringify(params);
    const cachedValue = context.getters.getCachedValue(cacheKey);
    //console.log('cacheKey=', cacheKey);
    //console.log('cachedValue=', cachedValue);
    if ( cachedValue ) {
      handleRes(cachedValue);
      return Promise.resolve(cachedValue);
    }
    return SearchApiService.searchResults(params).then((res) => {
      context.commit('setCacheValue', {key: cacheKey, data: res.data, expiresIn: 120});
      handleRes(res.data);
    });
  },

  rentals(context) {
    return RentalApiService.getRentalProducts().then(res => {
      context.commit('saveRentals', res.data);
    });
  },

  departments(context) {
    return DepartmentsService.getDepartments().then(res => {
      context.commit('saveDepartmentResults', res.data.data);
    });
  },

  clearSearch(context) {
    context.state.searchResults = null;
  },

  logout(context) {
    context.state.activeUser = null;
    localStorage.removeItem("cartStep");
    localStorage.removeItem("memberInfo");
    context.dispatch('fetchCartItemsDetails');
  },

  setPreferences(context) {
    HomePageApiService.getPreferences()
      .then(data => {
        context.state.preferences = data;
      });
  },

  storeLocations(context, stores) {
    context.state.storeLocations = stores;
  },
  customPages(context, pages) {
      context.state.customPages = pages;
  },
  footer(context, footer) {
      context.state.footer = JSON.parse(footer);
  },
  customNavigationGroups(context, nav) {
      context.state.customNavigationGroups = nav;
  },

  customNavigation(context, nav) {
      context.state.customNavigation = nav;
  },
  trackUser({ state }) {
    const activeUser = state.activeUser;
    if(activeUser && activeUser.is_admin) {
      return;
    }
    if (!localStorage.userTracked) {
      HomePageApiService.trackUserDetails().then((data) => {
        if(data.data.res == true) {
          localStorage.setItem('userTracked', data.data.res);
        }
      });
    }
  },
  widgets({commit}) {
    return WidgetsApiService.get({ skip_process_product_slider: true }).then(res => {
      commit('saveWidgets', res.data.widgets);
    });
  },
  widgetTypes({commit}) {
    return WidgetsApiService.getAllTypes().then(res => {
      commit('saveWidgetTypes', res.data.widget_types);
    });
  },
  async fetchShippingQuotes(context) {
    if (context.state.activeShippingCarriers.length == 0 || context.state.cartItemsRestricted || !context.state.cartShippingAddressValidated) {
      return;
    }
    context.state.cartFetchingShippingQuotes = true;
    await CartApiService.shippingQuotes({customerAddress: context.state.cartShippingAddress}).then(response => {
      response = response.data;
      if (response.status === 'success') {
        context.state.cartShippingQuotes = response.quotes;
        if (response.quotes.length) {
          if (context.state.cartSelectedShippingQuote) {
            let matched = false;
            context.state.cartShippingQuotes.forEach(quote => {
              if (quote.carrier == context.state.cartSelectedShippingQuote.carrier && quote.service == context.state.cartSelectedShippingQuote.service) {
                context.commit('setCartSelectedShippingQuote', quote);
                matched = true;
              }
            });
            setTimeout(() => {
              if (!matched) {
                context.commit('setCartSelectedShippingQuote', null);
              }
            }, 200);
          }
        }
        return Promise.resolve();
      }
    }).finally(() => {
      context.state.cartFetchingShippingQuotes = false;
    });
  },
  recentViewedItems({ commit }) {
    return ProductApiService.getRecentViewedItems().then(res => {
      commit('setRecentVieweditems', res.data.products);
    });
  },
  async setPaint({ commit }) {
    let res = await PaintService.getColors({ is_display: 1 });
    let colorEquivalence = {
      YEL: '#ffd400',
      ORA: '#F58C41',
      RED: '#ca2c2c',
      PUR: '#523c68',
      BLU: '#233872',
      GRE: '#006149',
      BRO: '#65594A',
      NEU: '#cdb99f',
      WHI: '#FFFFFF',
      GRA: '#b8bab6',
      BLA: '#323233',
      PIN: '#ff6fff'
    };
    let collectionThumbsEquivalence = {
      AC: 'https://storage.googleapis.com/content.ezadtv.com/2023/08/02/64cab1935e914_Frame_35998_1_.png',
      AF: '',
      ARB: '',
      BMC: 'https://storage.googleapis.com/content.ezadtv.com/2023/08/02/64cab342167b5_Frame_35998.png',
      CC: 'https://storage.googleapis.com/content.ezadtv.com/2023/08/02/64cab1c535273_Frame_36001.png',
      CP: 'https://storage.googleapis.com/content.ezadtv.com/2023/08/02/64cab18714d43_Frame_35998.png',
      CSP: 'https://storage.googleapis.com/content.ezadtv.com/2023/08/02/64cab1b6d7b08_Frame_35998_2_.png',
      CW: 'https://storage.googleapis.com/content.ezadtv.com/2023/08/02/64cab1cb187dd_Frame_36002.png',
      HC: 'https://storage.googleapis.com/content.ezadtv.com/2023/08/02/64cab1a41cb8b_Frame_36000.png',
      OC: 'https://storage.googleapis.com/content.ezadtv.com/2023/08/02/64cab1b1cf262_Frame_35999.png',
      VINYL: ''
    };
    let families = res.data.categories.colorFamilies.palettes.map(e => ({ ...e, hex: colorEquivalence[e.code]}));
    let collections = res.data.categories.colorCollections.palettes.map(e => ({ ...e, image: collectionThumbsEquivalence[e.code]})).filter(e => collectionThumbsEquivalence[e.code]);
    commit('setColorFamilies', families);
    commit('setColorCollections', collections);
  },
  async setColor({ commit }, data) {
    let res = await PaintService.getColors({ codes: data, is_display: 1 });
    commit('addColorFamily', { [data]: res.data.colors[0].colors });
  },
  setPaintCategories({ commit }) {
    return PaintService.getCategories().then(res => {
      let paintCategories = res.data.categories.map(e => ({ ...e, name: e.name, code: e.code, url: `/paint-products/${e.code}`, target: `/paint-products/${e.code}` }));
      commit('addPaintCategories', paintCategories);
    });
  }
};
