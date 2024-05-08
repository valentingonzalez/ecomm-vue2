import Axios from 'axios';
import EZAxios from '../ezaxios';
import store from '@/store';

export default {
  getRentalProducts() {
    return Axios.get(`rentals`, {
      headers: { business_slug: store.state.business_slug }
    });
  },
  rentalFormSubmit(data) {
    return EZAxios.post(`rental-form-submit`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        'Business-Slug': store.state.business_slug
      }
    });
  }
};
