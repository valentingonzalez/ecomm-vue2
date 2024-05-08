import Axios from 'axios';
import EZAxios from '@/ezaxios';

const makeFormData = obj => {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if(k.endsWith('[]') && Array.isArray(v)) {
      v.forEach(value => fd.append(k, String(value)));
    } else {
      fd.append(k, String(v));
    }
  });
  return fd;
};

export default {
  getAllTypes(data) {
    return EZAxios.get(`widget-type/get`, data, {
      headers: {
        Authorization: `Bearer ${(localStorage.getItem('token') || sessionStorage.getItem('token'))}`
      }
    });
  },
  createType(data) {
    return Axios.post(`admin/widget-type/create`, data, {
      headers: {
        Authorization: `Bearer ${(localStorage.getItem('token') || sessionStorage.getItem('token'))}`
      }
    });
  },
  updateType(data) {
    return Axios.post(`admin/widget-type/update`, makeFormData(data), {
      headers: {
        Authorization: `Bearer ${(localStorage.getItem('token') || sessionStorage.getItem('token'))}`
      }
    });
  },
  deleteType(data) {
    return Axios.post(`admin/widget-type/delete`, data, {
      headers: {
        Authorization: `Bearer ${(localStorage.getItem('token') || sessionStorage.getItem('token'))}`
      }
    });
  },

  get(data = {}) {
    return Axios.get(`/widget/get`, { params: data }, {
      headers: {
        Authorization: `Bearer ${(localStorage.getItem('token') || sessionStorage.getItem('token'))}`
      }
    });
  },
  getSingle(id) {
    return Axios.get(`/widget/${id}`, {
      headers: {
        Authorization: `Bearer ${(localStorage.getItem('token') || sessionStorage.getItem('token'))}`
      }
    });
  },
  create(data) {
    return Axios.post(`admin/widget/create`, data, {
      headers: {
        Authorization: `Bearer ${(localStorage.getItem('token') || sessionStorage.getItem('token'))}`
      }
    });
  },
  saveWidgetAsTemplate(data) {
    return Axios.post(`admin/widget/save`, data, {
      headers: {
        Authorization: `Bearer ${(localStorage.getItem('token') || sessionStorage.getItem('token'))}`
      }
    });
  },
  update(data) {
    return Axios.post(`admin/widget/update`, data, {
      headers: {
        Authorization: `Bearer ${(localStorage.getItem('token') || sessionStorage.getItem('token'))}`
      }
    });
  },
  delete(id) {
    return Axios.post(`admin/widget/delete`, {id: id}, {
      headers: {
        Authorization: `Bearer ${(localStorage.getItem('token') || sessionStorage.getItem('token'))}`
      }
    });
  },
  getDefaultIconsForDepartmentsWidget() {
    return EZAxios.get(`admin/widget/get-default-icons`, {
      headers: {
        Authorization: `Bearer ${(localStorage.getItem('token') || sessionStorage.getItem('token'))}`
      }
    });
  },
};
