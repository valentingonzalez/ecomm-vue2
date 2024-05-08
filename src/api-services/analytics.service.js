import Axios from 'axios';
import store from '@/store';

let token = localStorage.getItem('token') || sessionStorage.getItem('token');

export default {
  getPixel() {
    return Axios.get(`social/pixel`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  savePixel(data) {
    return Axios.post(`social/pixel`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Business-Slug': store.state.business_slug
      }
    });
  }
};
