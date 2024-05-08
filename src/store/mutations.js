import {updateGAUserId, updateStoreNumber} from "@/plugins/analytics";

function refreshCartItemCount(state) {
  const cartItems = state.cart.parcels;
  let count = 0;
  if (cartItems && cartItems.length) {
      const pickupItems = cartItems.find(item => {
          return item.type === 'pickup';
      });
      const specialParcels = cartItems.filter(item => {
        return item.type === 'special';
      });
      let specialItems = [];
      if (specialParcels && specialParcels.length) {
        specialParcels.forEach(parcel => {
          if (parcel.items && parcel.items.length) {
            specialItems = [...specialItems, ...parcel.items];
          }
        });
      }
      let items = [];
      if (specialItems && specialItems.length) {
        items = [...items, ...specialItems];
      }
      if (pickupItems && pickupItems.items) {
        items = [...items, ...pickupItems.items];
      }
      items.forEach(item => {
        count += item.quantity;
      });
  }
  state.cartItemCount = count;
  if(count == 0){
    state.cartTotals = 0;      
  }
}

export default {
  setPopularProducts(state, value) {
    state.popularProducts = value;
  },
  setFavouriteProducts(state, value) {
    state.favouriteProducts = value;
  },
  addProduct(state, item) {
    let found = state.products.find(x => x.id === item.id);

    if (!found) {
      state.products.push(item);
    }
  },
  addCartItem(state, value) {
    state.cart.push(value);
    refreshCartItemCount(state);
  },
  setCompetitors(state, { productId, data }) {
    let product = state.products.find(item => item.id === productId);

    product.competitors = data;
  },
  setSimilarProducts(state, { productId, data }) {
    let product = state.products.find(item => item.id === productId);

    product.similars = data;
  },
  setMultiCompetitors(state, competitorsList) {
    for (let sku in competitorsList) {
      let competitors = competitorsList[sku];
      let product = state.products.find(item => item.sku === sku);
      if(product)
        product.competitors = competitors;
    }
  },
  addProductsRange(state, products) {
    products.forEach((item) => {
      let found = state.products.find(x => x.id === item.id);

      if (!found) {
        state.products.push(item);
      }
    });
  },
  setProductVideos(state, { productId, data }) {
    let product = state.products.find(item => item.id === productId);

    product.videos = data;
  },
  removeCartItem(state, productId) {
    let index = state.cart.findIndex(item => item.id === productId);

    state.cart.splice(index, 1);
    refreshCartItemCount(state);
  },
  updateQty(state, { item, value }) {
    let product = state.cart.find(x => x.id === item.id);

    if (!product) {
      item.quantity = value;
      state.cart.push(item);
    } else {
      product.quantity = value;
    }
    refreshCartItemCount(state);
  },
  setCartItems(state, value) {
    state.cart = value;
    // whenever cart items are changd. discard paypal checkout
    state.paypalCheckoutOrder = null;    
    refreshCartItemCount(state);
  },
  setDeliveryFee(state, value) {
    state.deliveryFee = value;
  },
  setBusinessInfo(state, value) {
    state.businessInfo = value;
  },
  setBanner(state, value) {
    state.banner = value;
  },
  setHomepageSection(state, value) {
    state.homepage = value;
  },
  setBusinessDetails(state, value) {
    state.businessDetails = value;
    state.hasTrueValueRewards = value && value.truevalue_rewards === 1;

    state.docsTemplates.terms = `https://ezadtv.com/ecommerce/terms?store=${state.settings.businessName}&email=${value.contact_email}`;
  },
  setCoupons(state, value) {
    state.coupons = value;
  },
  setActiveUser(state, activeUser) {
    state.activeUser = activeUser;
  },
  setDeviceId(state, id) {
    updateGAUserId(id);
    state.device_id = id;
  },
  saveSearchSuggestions(state, data) {
    state.searchSuggestions = data;
  },
  saveSearchBrandProductSuggestions(state, data) {
    state.searchBrandProductSuggestions = data;
  },
  saveSearchResults(state, data) {
    state.searchResults = data;
  },
  saveRentals(state, data) {
    state.rentals = data;
  },
  saveFilterSearchResults(state, data) {
    if(state.searchResults) {
      state.searchResults.products = null;
      state.searchResults.products = data.products;
    }
  },
  saveDepartmentResults(state, data) {
    const skipAutoFormat = state.settings.departments && state.settings.departments.skipAutoFormat;
    if(data.parent_departments && data.parent_departments.length){
      for(let key of Object.keys(data.parent_departments)) {
        const d = data.parent_departments[key];
        if ( !d.noFmt && !skipAutoFormat ) {
          d.name = d.name.toLowerCase().replace(
            /(^|\s)([a-z])/g, (ss, a, b) => a + b.toUpperCase());
        }
      }
    }
    state.departmentResults = data;
  },
  saveDepartments(state, data) {
    state.departments = data;
  },
  saveFullDepartments(state, data) {
    if(data.parent_departments && data.parent_departments.length){
      for (let key of Object.keys(data.departments)) {
        const d = data.departments[key];
        if ( !d.noFmt && !state.settings.departments.skipAutoFormat ) {
          d.name = d.name.toLowerCase().replace(
            /(^|\s)([a-z])/g, (ss, a, b) => a + b.toUpperCase()
          );
        }
      }
    }
    state.fullDepartmentResults = data;
  },
  saveBrands(state, data) {
    state.brands = data;
  },
  saveBrand(state, data) {
    state.currentBrand = data;
  },
  removeCurrentBrand(state) {
    state.currentBrand = null;
  },
  setCurrentStore(state) {
    const businessInfo = state.businessDetails;
    if(businessInfo && businessInfo.about_us && businessInfo.about_us.locations) {
      const currentLocation = localStorage.getItem('selectedStore');
      let currentLocationDetails;
      if ( currentLocation === null ) {
          // use first location so things don't crash
          currentLocationDetails = businessInfo.about_us.locations[0];
      } else {
          currentLocationDetails = businessInfo.about_us.locations.find(loc => (loc.id === +currentLocation));
      }
      state.currentStore = currentLocationDetails;
      if ( currentLocationDetails && currentLocationDetails.store_number ) {
        updateStoreNumber(currentLocationDetails.store_number);
      }
    }
    return null;
  },
  setDocs(state, value) {
    state.docs = value;
    console.log(state.docs);
  },
  loadSettings(state, settings) {
    state.settings = settings;
    state.business_slug = settings.businessSlug;
  },
  addCustomPage(state, page) {
    state.customPages.push(page);
  },
  addNavigationGroup(state, nav) {
    state.customNavigationGroups.push(nav);
  },
  deleteNavigationGroup(state, id) {
    state.customNavigationGroups.splice(state.customNavigationGroups.findIndex(e => e.id == id), 1);
  },
  addNavigation(state, nav) {
    state.customNavigation.push(nav);
  },
  updateNavigation(state, nav) {
    state.customNavigation = state.customNavigation.map(e => {
      if(e.id == nav.id) return nav;
      return e;
    });
  },
  deleteNavigation(state, id) {
    state.customNavigation.splice(state.customNavigation.findIndex(e => e.id == id), 1);
  },
  updateCustomPage(state, page) {
    state.customPages = state.customPages.map(e => {
      if(e.id == page.id) return page;
      return e;
    });
  },
  setCacheValue(state, {key, data, expiresIn}) {
    state.timeBasedCache[key] = {
      data: JSON.stringify(data),
      expires: (new Date().getTime()) + expiresIn * 1000,
    };
  },
  expireCacheValues(state) {
    const now = new Date().getTime();
    Object.keys(state.timeBasedCache).forEach(k => {
      if ( state.timeBasedCache[k].expires < now ) {
        delete state.timeBasedCache[k];
      }
    });
  },
  saveWidgets(state, data) {
    state.widgets = data;
  },
  setRecentVieweditems(state, data) {
    state.recentVieweditems = data;
  },
  deleteWidget(state, id) {
    state.widgets.splice(state.widgets.findIndex(e => e.id == id), 1);
  },
  addWidget(state, widget) {
    state.widgets.push(widget);
  },
  updateWidget(state, widget) {
    state.widgets = state.widgets.map(e => {
      e.value = e.id == widget.id ? widget.value : e.value;
      return e;
    });
  },
  saveWidgetTypes(state, data) {
    state.widgetTypes = data.filter(e => !e.companies || JSON.parse(e.companies).includes(state.company) || JSON.parse(e.companies).includes('all'));
  },
  deleteWidgetType(state, id) {
    state.widgetTypes.splice(state.widgetTypes.findIndex(e => e.id == id), 1);
  },
  addTopBrandProducts(state, {products, sku}) {
    let Object = {
      'sku': sku,
      'products': products
    };
    state.topBrandProducts.push(Object);
  },
  setPartnerBusinessProductInventory(state, { data, sku }) {
    let products = state.products.map(({ sku: productSku, ...rest }) => {
      if (productSku === sku) {
        const {data: storesInventories} = data;
        return {
          partner_business_product_inventory: storesInventories,
          sku: productSku,
          ...rest
        };
      }
      return {
        sku: productSku,
        ...rest
      };
    });
    state.products = products;
  },
  setCartShippingAddress(state, payload) {
    state.cartShippingAddress = payload;
  },
  setCartShippingQuotes(state, payload) {
    state.cartShippingQuotes = payload;
  },
  setCartSelectedShippingQuote(state, payload) {
    state.cartSelectedShippingQuote = payload;
  },
  setActiveShippingCarriers(state, payload) {
    state.activeShippingCarriers = payload;
  },
  setAdminWizard(state, data) {
    state.adminWizard = data;
  },
  setAdminWizardSteps(state, data) {
    state.adminWizardSteps = data;
  },
  setAdminWizardBusinesses(state, data) {
    state.adminWizardBusinesses = data;
  },
  setAdminWizardShowCongrats(state, data) {
    state.adminWizardShowCongrats = data;
  },
  markWizardItemCompleted(state, {sectionId, stepId, percentage}) {
    if(state.adminWizardSteps.length) {
      state.adminWizardSteps.find(e => e.id == sectionId).items.find(e => e.id == stepId).completed = true;
      state.adminWizardSteps.find(e => e.id == sectionId).percentage = percentage;
    }
  },
  setAdminWizardSelectedStore(state, selectedStore) {
    state.adminWizardSelectedStore = selectedStore;
  },
  setPaypalCheckoutOrder(state, data) {
    state.paypalCheckoutOrder = data;
  },
  setCartStep(state, data) {
    state.cartStep = data;
  },
  setCartTotals(state, data) {
    state.cartTotals = data;
  },
  setColorFamilies(state, data) {
    state.paint.families = data;
  },
  setColorCollections(state, data) {
    state.paint.collections = data;
  },
  addColorFamily(state, data) {
    state.paint.colors = { ...state.paint.colors, ...data };
  },
  addPaintCategories(state, data) {
    state.paint.productCategories = data;
  },
  setFetchingCartItems(state, data) {
    state.fetchingCartItems = data;
  }
};
