import Axios from 'axios';
import EZAxios from '../ezaxios';


export default {
  getNavigationGroups() {
    return Axios.get(`custom-nav`);
  },
  addNavigationGroup(data = {}) {
    if(data.hide)
      data.hide = Number(data.hide);
    return Axios.post(`admin/custom-nav`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      }
    });
  },
  updateNavigationGroup(data) {
    if(data.hide)
      data.hide = Number(data.hide);
    return Axios.post(`admin/update-custom-nav`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      }
    });
  },
  deleteNavigationGroup(id) {
    return Axios.post(`admin/delete-custom-nav`, {id: id}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      }
    });
  },
  getNavigation() {
    return Axios.get(`custom-navigation`);
  },
  postNavigation(data) {
    if(data.hide_on_locations && data.hide_on_locations.length > 0) {
      data.hide_on_locations = data.hide_on_locations.map(x => x.business_id).toString();
    } else {
      data.hide_on_locations = null;
    }
    return Axios.post(data.id ? `admin/update-custom-navigation` : `admin/custom-navigation`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      }
    });
  },
  updateNavigation(data) {
    return Axios.post(`admin/update-custom-navigation`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      }
    });
  },
  deleteNavigation(id) {
    return Axios.post(`admin/delete-custom-navigation`, {id: id}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      }
    });
  },
  getFooter() {
    return Axios.get(`custom-footer`);
  },
  postFooter(data) {
    return Axios.post(`admin/custom-footer`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      }
    });
  },
  updateFooter(data) {
    return Axios.post(`admin/update-custom-footer`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      }
    });
  },
  deleteFooter(data) {
    return Axios.post(`admin/delete-custom-footer`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      }
    });
  },
  getDocs() {
    return EZAxios.get(`business-terms`);
  },
  updateDocs(docs) {
    return EZAxios.post(`admin/business/terms`, docs, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      },
    });
  },
};
