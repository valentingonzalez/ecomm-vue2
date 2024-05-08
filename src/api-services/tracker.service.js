import Axios from 'axios';
import EZAxios from '@/ezaxios';
import store from '@/store';

export default {
  trackProduct(sku) {
    return EZAxios.post(`products/track`, {sku: sku, device_id: store.state.device_id}, {
      headers: { 'Business-Slug': store.state.business_slug }
    });
  },
  trackSearch(keyword) {
    let activeUser = store.state.activeUser;
    if ((activeUser && activeUser.is_admin) || (keyword == "" )) {
      return;
    }

    let data = {
      search: keyword
    };

    if (!activeUser) {
      data.device_id = store.state.device_id;
    } else {
      data.customer_slug = activeUser.data.customer.slug;
    }

    return Axios.post(`track-search`, data, {
      headers: {
        'Business-Slug': store.state.business_slug
      }
    });
  },
  getInStorePingStatus(productId, customerId) {
    return EZAxios.get(`get-in-store-ping-status?product_id=${productId}&customer_id=${customerId}`, {
      headers: { 'Business-Slug': store.state.business_slug }
    });
  },
  saveInStorePingInfo(data) {
    return EZAxios.post(`save-in-store-ping`, data, {
      headers: { 'Business-Slug': store.state.business_slug }
    });
  },
  cancelInStorePing(data) {
    return EZAxios.post(`cancel-in-store-ping`, data, {
      headers: { 'Business-Slug': store.state.business_slug }
    });
  },
  handleContactInfoForNonCustomerInStorePing(data) {
    return EZAxios.post(`in-store-ping-non-customer-info`, data, {
      headers: { 'Business-Slug': store.state.business_slug }
    });
  },
};
