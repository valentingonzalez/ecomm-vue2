import Axios from 'axios';
import EZAxios from '@/ezaxios';
import store from '@/store';

export default {
  getAllPages() {
    return EZAxios.get(`custom-pages?skipBody=1`);
  },
  getPage(id) {
    return EZAxios.get(`custom-page/${id}`);
  },
  addPage(data = {}) {
    return Axios.post(`admin/custom-page`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  updatePage(data = {}) {
    return Axios.post(`admin/update-custom-page`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  deletePage(id) {
    return Axios.post(`/admin/custom-page/delete/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        'Business-Slug': store.state.business_slug
      }
    });
  }
};
