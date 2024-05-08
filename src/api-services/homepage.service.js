import Axios from 'axios';
import EZAxios from '@/ezaxios';
import store from '@/store';

export default {
  getSections() {
    return Axios.get(`homepage-widgets`);
  },
  getHomepageProducts(){
    return Axios.get(`homepage-widgets-two`);
  },
  getPreferences() {
    return Promise.resolve({
      brands: true,
      departments: true,
      coupons: true,
      payment: true,
      stock: true
    });
  },
  getBusinessDetails() {
    return EZAxios.get(`business-details2`);
  },
  getBusinessAbout() {
    return Axios.get(`business-about-us`);
  },
  getAbout() {
    return Axios.get(`about-us`);
  },
  trackUserDetails(){
    let queryString = '';
    let activeUser = store.state.activeUser;
    if (!activeUser) {
      queryString = 'device_id=' + store.state.device_id;
    } else {
      queryString = 'customer_slug=' + activeUser.data.customer.slug;
    }
    return EZAxios.get(`track-visitor?${queryString}`);
  },
  getPromoPopUp() {
    return EZAxios.get(`homepage-promo-pop-up`);
  }
};
