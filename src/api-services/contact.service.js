import EZAxios from '../ezaxios';
import store from '@/store';

export default {
  sendContactInfo(info) {
    return EZAxios.post(`contact-customer`, info, {
      headers: { 'Business-Slug': store.state.business_slug }
    });
  }
};
