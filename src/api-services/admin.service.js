import Axios from 'axios';
import EZAxios from '@/ezaxios';
import store from '@/store';

// DO NOT ADD THE LET TOKEN UP HERE BECAUSE IT BREAKS THE ADMIN
// IT NEEDS TO BE IN EVERY FUNCTION OR ELSE IF THEY LOG OUT AND LOG BACK IN AGAIN THE TOKEN WILL
// NEVER GET UPDATED AND ALL THESE APIS WILL FAIL.

const auth = function() {
  let token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return { 'Authorization': `Bearer ${token}` };
};

const slug = function() {
  return { 'Business-Slug': store.state.business_slug };
};
export default {
  saveAbout(data) {
    return Axios.post(`about-us/save`, data, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  updateFroala(data) {
    return Axios.post(`/admin/update-froala`, data, {
      headers: { ...auth(), ...slug() }
    });
  },
  uploadImage(data) {
    let formData = new FormData();
    formData.append('image', data);
    return EZAxios.post(`about-us/upload`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...auth(), ...slug()
      }
    });
  },
  uploadProductImage(data) {
    let formData = new FormData();
    formData.append('image', data);
    return Axios.post(`product-editor/upload`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...auth(), ...slug()
      }
    });
  },
  uploadImageFromUrl(data) {
    return EZAxios.post(`admin/upload-image-from-url`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(), ...slug()
      }
    });
  },
  getCarouselImages() {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return Axios.get(`carousel-widgets?access_token=${token}`);
  },
  getCarouselTemplates() {
    return EZAxios.get('carousel-widget-templates?include_tv=1');
  },
  updateCarousel(data) {
    return Axios.post('add-carousel-images', data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(), ...slug()
      }
    });
  },
  getPosInfo() {
    return Axios.get(`pos-settings/stores2`, {
      headers: {
        ...slug()
      }
    });
  },
  savePosInfo(data) {
    return Axios.post(`pos-settings/save`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(), ...slug()
      }
    });
  },
  getHomePageSettings() {
    return Axios.get(`home-page-settings/get-homepage-settings`, {
      headers: {
        ...slug()
      }
    });
  },
  getHomePageBrands() {
    return Axios.get(`home-page-settings/get-brands`, {
      headers: {
        ...slug()
      }
    });
  },
  getHomePageDepartments() {
    return Axios.get("home-page-settings/get-departments", {
      headers: {
        ...slug()
      }
    });
  },
  updateHomePageSettings(data) {
    let formData = new FormData();
    formData.append('products_per_category', data.products_per_category);
    formData.append('minimum_price', data.minimum_price);
    formData.append('departments', JSON.stringify(data.departments));
    formData.append('brands', JSON.stringify(data.brands));
    return Axios.post(`home-page-settings/update-homepage-settings`, formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...auth(), ...slug()
      }
    });
  },
  getProductData(data) {
    return EZAxios.post(`product-editor/get-product-data`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(), ...slug()
      }
    });
  },
  updateProductData(data) {
    return EZAxios.post(`product-editor/update-product`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(), ...slug()
      }
    });
  },
  deleteProductImage(data) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return Axios.post(`product-editor/delete-product-img`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  editImageAlt(data) {
    return Axios.post(`product-editor/edit-image-alt`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  getEditedProducts(data = {}) {
    let search = data.search ? `&search=${data.search}` : `&search=`;
    let filter = data.filter ? `&filter=${data.filter}` : '';
    let page = data.page || 1;
    return Axios.get(`product-editor/list?page=${page}${search}${filter}`, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  updateSocialLink(data) {
    return EZAxios.post(`social/update`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(), ...slug()
      }
    });
  },
  updateFulfillmentDelivery(data) {
    return EZAxios.post(`admin/fulfillment/delivery-settings`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(), ...slug()
      }
    });
  },
  updateFulfillmentShipping(data) {
    return EZAxios.post(`admin/fulfillment/shipping-settings`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(), ...slug()
      }
    });
  },
  updateFulfillmentAdvancedShipping(data) {
    return EZAxios.post(`admin/fulfillment/advance-shipping-settings`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(), ...slug()
      }
    });
  },
  updateFulfillmentPickup(data) {
    return EZAxios.post(`admin/fulfillment/pickup-settings`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(), ...slug()
      }
    });
  },
  updateFulfillmentPayment(data) {
    return EZAxios.post(`admin/fulfillment/payment-settings`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(), ...slug()
      }
    });
  },
  updateFulfillmentSpecial(data) {
    return Axios.post(`admin/fulfillment/special`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(), ...slug()
      }
    });
  },
  updateFulfillmentSpecialSettings(data) {
    return EZAxios.post(`admin/fulfillment/special-order-settings`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(), ...slug()
      }
    });
  },
  fulfillmentShippingSlip(data) {
    return Axios.post(`admin/fulfillment/shippingSlip`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(), ...slug()
      }
    });
  },
  getFulfillmentByKey(key) {
    return EZAxios.get(`admin/fulfillment/get-settings?key=${key}`, {
      headers: { ...auth() }
    });
  },
  getOutstandingOrders(data) {
    let params = [];
    for(let param in data) {
      params.push(`${param}=${data[param]}`);
    }
    let paramsString = params.length > 0 ? params.join('&') : '';
    return EZAxios.get(`admin/orders/outstanding?version=2&gmt=1&${paramsString}`, {
      headers: {
        ...auth()
      }
    });
  },
  orderTaken(orderId, accountSlug) {
    let formData = new FormData;
    formData.append('order_id', orderId);
    formData.append('sub_account_slug', accountSlug);

    return EZAxios.post(`admin/orders/order-taken`, formData , {
      headers: {
        ...auth()
      }
    });
  },
  getOrderHistoryCSV(orderFilters, dateRange){
    return EZAxios.get(`admin/orders/csv?order_filters=${orderFilters}&from_date=${dateRange.start}&to_date=${dateRange.end}`, {
      headers: {
        ...auth()
      },
      responseType: "blob"
    });
  },
  getCompleteOrdersHistory(){
    return EZAxios.get(`admin/orders/completed/history`, {
      headers: {
        'Content-Type': 'application/json',
        ...auth()
      }
    });
  },
  addOrderNote(id, data) {
    return EZAxios.post(`admin/orders/${id}/note`, data, {
      headers: {
        ...auth()
      },
    });
  },
  getOrderNotes(id) {
    return EZAxios.get(`admin/orders/${id}/notes`, {
      headers: {
        ...auth()
      },
    });
  },
  deleteOrderNote(order_id, id) {
    return EZAxios.delete(`admin/orders/${order_id}/note`, {
      headers: {
        ...auth()
      },
      data: {id: id}
    });
  },
  updateTaxRate(data) {
    return Axios.post(`admin/tax/rate`, data, {
      headers: {
        ...auth()
      },
    });
  },
  prepareStep(data) {
    return EZAxios.post(`admin/orders/${data.id}/prepareStep/${data.step}`, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  markOrderAsComplete(id) {
    return EZAxios.post(`admin/orders/${id}/markComplete`, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  getOrdersPayouts() {
    return EZAxios.get(`admin/orders/reconciliation`, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  getReconciliationOrders(id, data) {
    let params = [];
    for(let param in data) {
      params.push(`${param}=${data[param]}`);
    }
    let paramsString = params.length > 0 ? params.join('&') : '';
    return EZAxios.get(`admin/orders/reconciliation/${id}?${paramsString}`, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  getCompletedOrders(data = {}) {
    let params = [];
    for(let param in data) {
      params.push(`${param}=${data[param]}`);
    }
    let paramsString = params.length > 0 ? params.join('&') : '';
    return EZAxios.get(`admin/orders/completed?step=full&gmt=1&${paramsString}`, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  getOrder(id = '', itemIds) {
    let itemIds_param = itemIds ? `&itemIds=${itemIds}` : '';
    return EZAxios.get(`admin/orders/${id}?gmt=1${itemIds_param}`, {
      headers: {
        ...auth()
      },
    });
  },
  sendEmailByOrderId(params) {
    if(!params.id) return;
    return EZAxios.post(`admin/orders/${params.id}/email`, {
      subject: params.subject || 'No subject',
      body: params.body || 'No body'
    }, { headers: { ...auth() },
    });
  },
  markPrepared(id, deliveryTime, subAccountId) {
    return EZAxios.post(`admin/orders/${id}/markPrepared`, {"deliveryMinutes": deliveryTime, "subAccountId": subAccountId}, {
      headers: {
        ...auth()
      },
    });
  },
  markItemSpecial(id, lineid, qty) {
    return EZAxios.post(`admin/orders/${id}/makeItemSpecial/${lineid}`, {"qty": qty}, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  cancelOrder(id, cancelledReason = "") {
    return EZAxios.post(`admin/orders/${id}/cancel`, {"reason": cancelledReason}, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  updateOrderDeliveryDate(params) {
    return EZAxios.post(`admin/orders/${params.id}/updateDeliveryDate`, {delivery_date: params.delivery_date}, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  cancelItem(id, lineId, qty = 0) {
    return EZAxios.post(`admin/orders/${id}/cancelItem/${lineId}`, { qty }, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  doItBestPrepare(id) {
    return EZAxios.post(`admin/orders/${id}/doitbest/prepare`, {}, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  doItBestRSCOptions(id) {
    return EZAxios.get(`admin/orders/${id}/doitbest/rscOptions`, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  doItBestShippingMethods() {
    return EZAxios.get(`admin/orders/doitbest/shippingServices`, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  doitBestSubmitShipment(id, rsc, shippingService) {
    return EZAxios.post(`admin/orders/${id}/doitbest/send`,
      {
        "rsc": rsc,
        "shipping_service": shippingService
      },
      {
        headers: {
          ...auth(), ...slug()
        },
      }
    );
  },
  popularViewedItems(from_date, to_date) {
    return EZAxios.get(`admin/stats/popularViewedItems?from_date=${from_date}&to_date=${to_date}`, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  inStorePingItems(time_range, store_id) {
    return EZAxios.get(`admin/stats/inStorePingItems?time_range=${time_range}&store_id=${store_id}`, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  recentlyAddedItems(from_date, to_date) {
    return EZAxios.get(`admin/stats/recentlyAddedItems?from_date=${from_date}&to_date=${to_date}`, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  abandonedCarts(from_date, to_date) {
    return EZAxios.get(`admin/stats/abandonedCarts?from_date=${from_date}&to_date=${to_date}`, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  mostAskedOutOfStockItems(from_date, to_date) {
    return EZAxios.get(`admin/stats/mostAskedOutOfStockItems?from_date=${from_date}&to_date=${to_date}`, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  mostViewedOutOfStockItems(from_date, to_date) {
    return EZAxios.get(`admin/stats/mostViewedOutOfStockItems?from_date=${from_date}&to_date=${to_date}`, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  recentCustomerLogins() {
    return Axios.get(`admin/stats/recentCustomerLogins`, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  itemsRecentlySynced() {
    return Axios.get(`admin/stats/itemsRecentlySynced`, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  customerActivities(from_date, to_date) {
    return EZAxios.get(`admin/stats/activity?from_date=${from_date}&to_date=${to_date}`, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  getEmailSubscribers(page) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return Axios.get(`subscribers?access_token=${token}${page ? '&limit=10&page=' + page : ''}&order_by_column=created_at&order_by=desc`);
  },
  getCustomers(page, search, excel = null) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');

    let q = "order_by_column=date_added&order_by=desc";
    q += page ? "&limit=10&page=" + page  : "";
    q += search ? "&search=" + search : "";
    q += excel ? "&excel=" + excel : "";

    return Axios.get(`admin/customers?access_token=${token}&${q}`);
  },
  updateCustomer(data, id) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return EZAxios.post(`admin/customer/${id}?access_token=${token}`, data, {
      headers: {
        ...slug()
      }
    });
  },
  searchProduct(upc) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');

    const data = {
      access_token: token,
      upc: upc
    };

    return Axios.post(`admin/favourite-products/search`, data, {
      headers: {
        ...slug()
      }
    });
  },
  removeFavouriteProduct(upc) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');

    const data = {
      access_token: token,
      upc: upc
    };

    return Axios.post(`admin/favourite-products/remove`, data, {
      headers: {
        ...slug()
      }
    });
  },
  addFavouriteProduct(upc, stores, unhide) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');

    const data = {
      access_token: token,
      upc: upc,
      stores: stores,
      unhide: unhide
    };

    return Axios.post(`admin/favourite-products/add`, data, {
      headers: {
        ...slug()
      }
    });
  },
  getCouponsAdmin() {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return EZAxios.get('coupons-admin', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  getCouponsAnalytics(filters) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return EZAxios.post(`coupons-analytics`, filters, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  getCoupons() {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return Axios.get('coupons', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  addNewCoupon(data) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return Axios.post(`add-coupon`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  updateCoupon(data) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return Axios.post('update-coupon', data,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  deactivateCoupon(data) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return Axios.post('deactivate-coupon', data,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  getCouponWidgets() {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return Axios.get('coupon-widgets', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  getStoreLocations() {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');

    const data = {
      access_token: token
    };

    return Axios.get(`admin/favourite-products/stores`, data, {
      headers: {
        ...slug()
      }
    });
  },
  countARAccounts() {
    return Axios.get('admin/customers/totalAccounts', {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  saveAccountSettings(data) {
    return Axios.post('admin/customers/accountSettings', data, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  createSubAccount(data) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return EZAxios.post(`sub-accounts/create`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  updateSubAccount(data) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    data.sub_account_slug = data.slug;
    return EZAxios.post(`sub-accounts/update`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  changeSubAccountPassword(data) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    data.sub_account_slug = data.slug;
    data.old_password = data.oldPassword;
    data.new_password = data.newPassword;
    return EZAxios.post(`sub-accounts/change-password`, data,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  deleteSubAccount(data) {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    data.sub_account_slug = data.slug;

    return EZAxios.post(`sub-accounts/delete`, data,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  getBusinessBrands(data) {
    return EZAxios.post(`/admin/brands/get-business-brands`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  hideBrand(data) {
    return EZAxios.post(`/admin/brands/set-brand-hidden`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  hideAllBrand(data) {
    return EZAxios.post(`/admin/brands/set-all-brands-hidden`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  updateAllBrandsES(store_id) {
    const data = {
      store_id: store_id,
    };
    return Axios.post(`/admin/brands/update-all-brands`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  updateBrandES(brand_id) {
    const data = {
      brand_id: brand_id,
    };
    return Axios.post(`/admin/brands/update-brand`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  hideProductsFromBrand(brand_id, hidden) {
    const data = {
      brand_id: brand_id,
      hidden: hidden
    };

    return EZAxios.post(`/admin/brands/hide-brand-products`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  disableBrandsNavigation(hidden) {
    const data = {
      hidden: hidden
    };

    return EZAxios.post(`/admin/brands/hide-brands-nav`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  setBrandsShowLogo(showBrandLogos) {
    const data = {
      show_brand_logos: showBrandLogos
    };

    return EZAxios.post(`/admin/brands/set-brands-show-logo`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  setBrandsFilter(hidden) {
    const data = {
      hidden: hidden
    };

    return EZAxios.post(`/admin/brands/set-brands-filter`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  addBrandAlias(brand_id, alias, altTextLogo = "") {
    let data = {
      brand_id: brand_id,
      alias: alias,
      altTextLogo: altTextLogo
    };
    return EZAxios.post(`/admin/brands/add-brand-alias`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  deleteBrandAlias(brand_id) {
    let data = {
      brand_id: brand_id
    };
    return EZAxios.post(`/admin/brands/remove-brand-alias`, data, {
      'Content-Type': 'application/json',
      ...auth(),
      ...slug()
    });
  },
  updateBrandLogo(brand_id, new_image) {
    let data = {
      brand_id: brand_id,
      new_image: new_image
    };
    return EZAxios.post(`/admin/brands/update-brand-img`, data, {
      "Content-Type": "application/json",
      ...auth(),
      ...slug()
    });
  },
  getFormFields() {
    return Axios.get(`admin/forms/custom-fields`, {
      headers: {
        "Content-Type": "application/json",
        ...auth(),
        ...slug()
      }
    });
  },
  saveFormFields(data) {
    let formData = new FormData();
    formData.append("custom_fields", JSON.stringify(data));

    return Axios.post("admin/forms/custom-fields", formData, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  getSaveCart() {
    return Axios.get(`admin/forms/save-cart`, {
      headers: {
        "Content-Type": "application/json",
        ...auth(),
        ...slug()
      }
    });
  },
  saveCart(data) {
    let formData = new FormData();
    formData.append("save_cart", data ? "1" : "0");

    return Axios.post("admin/forms/save-cart", formData, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  saveRecurringOrderOptIn(data) {
    let formData = new FormData();
    formData.append("enable_recurring_orders", data);

    return EZAxios.post("admin/fulfillment/saveRecurringOrderOptIn", formData, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  getRecurringOrderOptIn() {
    return EZAxios.get(`admin/fulfillment/getRecurringOrderOptIn`, {
      headers: {
        "Content-Type": "application/json",
        ...auth(),
        ...slug()
      }
    });
  },
  getEcommerceSetupLink() {
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return Axios.get('admin/advanced/redirect-link', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Business-Slug': store.state.business_slug
        }
    });
  },
  sendUpgradeForm(formData) {
    return EZAxios.post("upgrade-request", formData, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  getTransactionEmailsMaster() {
    return EZAxios.get(`transaction-emails`, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  setupTransactionEmail(data) {
    return EZAxios.post(`transaction-emails/setup`, data, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },

  editTransactionEmail(data) {
    return EZAxios.post(`transaction-emails/edit`, data, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },

  disableTransactionEmail(data) {
    return EZAxios.post(`transaction-emails/disable`, data, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  sendTestEmail(data) {
    return EZAxios.post(`transaction-emails/test-email`, data, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  getBusinessEmailSettings() {
    return EZAxios.get(`transaction-emails/emails`, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  updateBusinessEmailSettings(data) {
    return EZAxios.post(`transaction-emails/emails`, data, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  getBusinessDataReport() {
    return Axios.get(`admin/consultation/report`, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  getBusinessDepartments() {
    return Axios.get(`admin/consultation/departments`, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  getConsultationBrands() {
    return Axios.get(`admin/consultation/brands`, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  getProducts(data) {
    return Axios.post(`admin/consultation/products`, data, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  getExportData(data) {
    return Axios.post(`admin/consultation/export`, data, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  updateProductImages(data) {
    return Axios.post(`admin/consultation/update-images`, data, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  uploadImageToLibrary(image, title) {
    let formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    return Axios.post(`admin/consultation/upload`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...auth(), ...slug()
      }
    });
  },
  getLibraryImages(searchTerm, page, limit) {
    let query = searchTerm ? `&search=${searchTerm}` : ``;
    return Axios.get(`admin/consultation/images?page=${page}&limit=${limit}${query}`, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  getSearchSynonyms() {
    return EZAxios.get(`search-synonyms`, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  updateSearchSynonyms(searchSynonyms) {
    return EZAxios.post(`update-search-synonyms`, searchSynonyms, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  changeFavouriteProductsOrder(data) {
    return Axios.post(`admin/favourite-products/reorder`, data, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  arAccountList(search) {
    return EZAxios.get(`admin/orders/ar-account-search?search=${search}`);
  },
  assignARAccount(orderId, accountId, isCustomer) {
    if ( isCustomer ) {
      return EZAxios.post(`admin/orders/assign-ar-account`, {customerId: orderId, accountId});
    } else {
      return EZAxios.post(`admin/orders/assign-ar-account`, {orderId, accountId});
    }
  },
  getBusinessSettings(data) {
    return Axios.post(`admin/settings/list`, data, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  updateBusinessSettings(data) {
    return Axios.post(`admin/settings/update`, data, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  updateSpecialSla(data) {
    return Axios.post(`admin/fulfillment/specialSla`, data, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  getMapsLink(orderId) {
    return Axios.get(`admin/orders/${orderId}/location`);
  },
  getInvoices() {
    return Axios.get(`admin/invoices`, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  getDiscrepancyReport(params) {
    return EZAxios.post(`admin/discrepancy/report`, params, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  processDiscrepancyReport(params) {
    return EZAxios.post(`admin/discrepancy/process`, params, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  contactStoreForShipping(data) {
    return Axios.post(`admin/fulfillment/contact`, data, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  enableAdvanceShipping(data) {
    return Axios.post(`admin/fulfillment/enableAdvanceShipping`, data, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  getShippingLabels(data) {
    let params = [];
    for(let param in data) {
      params.push(`${param}=${data[param]}`);
    }
    let paramsString = params.length > 0 ? params.join('&') : '';
    return EZAxios.get(`admin/shipping/labels?${paramsString}`, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  getRentals(data) {
    let params = [];
    for(let param in data) {
      params.push(`${param}=${data[param]}`);
    }
    let paramsString = params.length > 0 ? params.join('&') : '';
    return EZAxios.get(`admin/rentals?${paramsString}`, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  requestRefund(id) {
    return EZAxios.post(`admin/shipping/${id}/refund`, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  getAllPartnerBusinesses() {
    return EZAxios.get(`admin/settings/get-all-partner-businesses`, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  getWizardBusinesses() {
    return EZAxios.get(`setup-wizard/get-business`, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  checkBrandIntegratorReport(params) {
    return EZAxios.post(`admin/brand-integrator/check-report`, params, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  generateBrandIntegratorReport(params) {
    return EZAxios.post(`admin/brand-integrator/generate-report`, params, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  getBrandIntegratorReport(params) {
    return EZAxios.post(`admin/brand-integrator/get-report`, params, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  approveRejectBrandMapping(params) {
    return EZAxios.post(`admin/brand-integrator/approve`, params, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  searchBrandProducts(keyword) {
    return EZAxios.post(`admin/brand-integrator/get-brand-products`, { search: keyword }, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  getReleaseNotes(channelId, businessVersion) {
    return EZAxios.get(`admin/feature-release/get-release-notes?channel_id=${channelId}&business_version=${businessVersion}`, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  getReleaseNotesForModal(page, channelId, businessVersion) {
    return EZAxios.get(`admin/feature-release/get-release-notes-for-modal?page=${page}&channel_id=${channelId}&business_version=${businessVersion}`, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  getShowReleaseData(channelId, businessVersion) {
    return EZAxios.get(`admin/feature-release/get-show-release-data?channel_id=${channelId}&business_version=${businessVersion}`, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  changeReleaseSecondDraftStatus(data) {
    return EZAxios.post('admin/feature-release/change-release-second-draft-status', data, {
      headers: {
        ...auth(),
        ...slug()
      }
    });
  },
  downloadDiscrepancyCsv(params){
    return EZAxios.post(`admin/discrepancy/download`, params, {
      headers: {
        ...auth()
      },
      responseType: "blob"
    });
  },
  updateBrandCarousel(data) {
    return EZAxios.post(`admin/brands/update-brand-carousel`, data, {
      headers: {
      ...auth(),
      ...slug()
      }
    });
  },
  freeTrialUpgrade(data) {
    return EZAxios.post(`admin/settings/freeTrialupgrade`, data, {
      headers: {
      ...auth(),
      ...slug()
      }
    });
  },
  rentalUpdate(rentalId, accountSlug, status) {
    let formData = new FormData;
    formData.append('rental_id', rentalId);
    formData.append('sub_account_slug', accountSlug);

    return EZAxios.post(`admin/rentals/${status}`, formData , {
      headers: {
        ...auth()
      }
    });
  },
  addRentalOrderNote(id, data) {
    return EZAxios.post(`admin/rentals/${id}/note`, data, {
      headers: {
        ...auth()
      },
    });
  },
  getRentalOrderNotes(id) {
    return EZAxios.get(`admin/rentals/${id}/notes`, {
      headers: {
        ...auth()
      },
    });
  },
  deleteRentalOrderNote(rental_id, id) {
    return EZAxios.delete(`admin/rentals/${rental_id}/note`, {
      headers: {
        ...auth()
      },
      data: {id: id}
    });
  },
  getRecurringOrders(data) {
    return EZAxios.post(`admin/recurringorders`, data, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  cancelRecurringOrder(order_id, data) {
    return EZAxios.post(`admin/recurringorders/${order_id}/cancel`, data, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  addCustomImageForDepartment(data) {
    return EZAxios.post(`v1/admin/department/add-custom-image-for-department`, data, {
      headers: {
        ...auth()
      },
    });
  },
  deleteCustomImageForDepartment(data) {
    return EZAxios.post(`v1/admin/department/delete-custom-image-for-department`, data, {
      headers: {
        ...auth()
      },
    });
  },
  getSubAccount(){
    return EZAxios.get(`admin/gmc/getSubaccount`, {
      headers: { ...auth() }
    });
  },
  createUpdateSubAccount(data){
    return EZAxios.post(`admin/gmc/subAccount`, data, {
      headers: {
        ...auth()
      },
    });
  },
  requestInventoryVerification(){
    return EZAxios.post(`admin/gmc/requestInventoryVerification`, {}, {
      headers: {
        ...auth()
      },
    });
  },
  requestPhoneVerCode(data){
    return EZAxios.post(`admin/gmc/requestPhoneVerCode`, data, {
      headers: {
        ...auth()
      },
    });
  },
  verifyPhoneCode(data){
    return EZAxios.post(`admin/gmc/verifyPhoneCode`, data, {
      headers: {
        ...auth()
      },
    });
  },
  getAccountStatus(){
    return EZAxios.get(`admin/gmc/getAccountStatus`, {
      headers: { ...auth() }
    });
  },
  setAccountShippingSettings(data){
    return EZAxios.post(`admin/gmc/setAccountShippingSettings`, data, {
      headers: {
        ...auth()
      },
    });
  },
  updateSocialShareOptions(data) {
    return EZAxios.post(`social/update-share-options`, data, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  getRecurringOrderExecutions(master_order_id) {
    return EZAxios.get(`admin/recurringorders/${master_order_id}/get-executions`, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  cancelRecurringOrderExecution(execution_id) {
    return EZAxios.post(`admin/recurringorders/${execution_id}/cancel-execution`, {
      headers: {
        ...auth()
      },
    });
  },
  getAIWidgetsSettings() {
    return EZAxios.get(`admin/aiwidgets/status`, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  updateAIWidgetsSettings(data) {
    return EZAxios.post('admin/aiwidgets/update', data, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  checkAIWidgetsTaskStatus(data) {
    return EZAxios.post('admin/aiwidgets/task-status', data, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  getProductsThroughAI(data) {
    return EZAxios.post('admin/aiwidget/get-products', data, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  getRentalCategories(data = {}) {
    let filter = data.search ? `&filter=${data.filter}` : `&filter=`;
    return EZAxios.get(`/admin/rental-categories?${filter}`, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  getRentalCategories(data = {}) {
    let filter = data.search ? `&filter=${data.filter}` : `&filter=`;
    return EZAxios.get(`/admin/rental-categories?${filter}`, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  saveRentalCategory(data = {}) {
    return EZAxios.post(`/admin/rental-categories/store`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  deleteRentalCategory(id, removeOrMove="remove") {
    return EZAxios.delete(`/admin/rental-categories/${id}?remove_or_move=${removeOrMove}`, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  updateRentalCategory(data = {}) {
    return EZAxios.post(`/admin/rental-categories/update`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  addProductToCategory(data = {}) {
    return EZAxios.post(`/admin/rental-categories/add-product`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  getRentalProducts(data = {}) {
    let search = data.search ? `&search=${data.search}` : `&search=`;
    let limit = "&limit=15";
    let categoryId = data.categoryId ? `&category_id=${data.categoryId}` : `&category_id=`;
    let page = data.page || 1;
    return EZAxios.get(`/admin/rental-products?page=${page}${search}${limit}${categoryId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  removeProductFromCategory(data = {}) {
    return EZAxios.post(`/admin/rental-categories/remove-product`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  rentalProductsLookup(search_term) {
    return EZAxios.get(`/admin/rental-products/product-lookup?search_term=${search_term}`, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  updateFeaturedRentalProduct(data = {}) {
    return EZAxios.post(`/admin/rental-products/update-rental-featured-product`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  getRentalDefaultIcons() {
    return EZAxios.get(`/admin/rental-categories/rental-default-icons`, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(),
        ...slug()
      }
    });
  },
  getRentalsModuleSettings() {
    return EZAxios.get(`admin/rental/rentals-settings`, {
      headers: { ...auth() }
    });
  },
  enableDisableRentals(data) {
    return EZAxios.post(`admin/rental/rentals-settings`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...auth(), ...slug()
      }
    });
  },
  getRentalsCsvImportUrl() {
    return EZAxios.get(`admin/rental/get-import-rentals-csv-url`, {
      headers: { ...auth() }
    });
  },
  getAuthorizedBrands() {
    return EZAxios.get(`setup-wizard/get-authorized-brands`, {
      headers: { ...auth() }
    });
  },
  setAuthorizedBrands(data) {
    return EZAxios.post(`setup-wizard/set-authorized-brands`, data,
      { headers: { 'Business-Slug': store.state.business_slug }
    });
  },
  checkBrandsSyncStatus() {
    return EZAxios.get(`setup-wizard/check-brands-sync-status`, {
      headers: { ...auth() }
    });
  }
};
