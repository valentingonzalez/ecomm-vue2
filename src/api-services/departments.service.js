import Axios from 'axios';
import store from '@/store';
import EZAxios from '@/ezaxios';
// /full-departments
export default {
  getDepartments (page, limit, dept_id) {
    let params = { page, limit };
    params.dept_id = dept_id && dept_id;
    return EZAxios.get (`departments`, {params});
  },
  getAllDepartments(maxDepth) {
    return EZAxios.get(`full-departments?depth=${maxDepth}`);
  },
  getDepartmentsWithAliases(storeId,showHiddenDept=0) {
    return EZAxios.get(`get-department-hierarchy-with-alias?partner=${storeId}&showHiddenDept=${showHiddenDept}`, { headers: { 'Business-Slug': store.state.business_slug } });
  },
  getAliases(searchTerm, type, partner) {
    return EZAxios.get(`v1/admin/department/aliases?partner=${partner}&search=${searchTerm}&type=${type}&access_token=${sessionStorage.getItem('token') || localStorage.getItem('token')}`, { headers: { 'Business-Slug': store.state.business_slug } });
  },
  getPreviousAliases(type, partner) {
    return EZAxios.get(`v1/admin/department/prev-aliases?partner=${partner}&type=${type}&access_token=${sessionStorage.getItem('token') || localStorage.getItem('token')}`, { headers: { 'Business-Slug': store.state.business_slug } });
  },
  addAlias(name, type, dept_id, partner) {
    return EZAxios.post(`v1/admin/department/add-alias`, {
      name: name,
      type: type,
      dept_id: dept_id,
      partner: partner,
      access_token: sessionStorage.getItem('token') || localStorage.getItem('token')
    },
    { headers: { 'Business-Slug': store.state.business_slug } });
  },
  removeAlias(alias_mapped_id, partner) {
    return EZAxios.post(`v1/admin/department/remove-alias`, {
      alias_mapped_id: alias_mapped_id,
      access_token: sessionStorage.getItem('token') || localStorage.getItem('token'),
      partner: partner,
    },
    { headers: { 'Business-Slug': store.state.business_slug } });
  },
  updateDepartmentHidden(dept_id, hidden, partner) {
    return EZAxios.post(`v1/admin/department/update-department-hidden`, {
      dept_id: dept_id,
      hidden: hidden,
      access_token: sessionStorage.getItem('token') || localStorage.getItem('token'),
      partner: partner,
    },
    { headers: { 'Business-Slug': store.state.business_slug } });
  },
  getDepartmentSettings(dept_id, partner) {
    return Axios.get(`v1/admin/department/department-settings?dept_id=${dept_id}&partner=${partner}`,{ headers: { 'Business-Slug': store.state.business_slug } });
  },
  saveDepartmentSettings(dept_id, settings, partner) {
    return EZAxios.post('v1/admin/department/save-department-settings', { dept_id: dept_id, settings: settings, partner: partner },
    { headers: { 'Business-Slug': store.state.business_slug } });
  },
  searchDepartmentsImages() {
    return EZAxios.get(`departments-images`);
  },
  setHierarchy(data) {
    return EZAxios.post(`admin/departments/set-hierarchy`, data,
      { headers: { 'Business-Slug': store.state.business_slug }
    });
  },
  setHidden(data) {
    return EZAxios.post(`admin/departments/set-hidden`, data,
      { headers: { 'Business-Slug': store.state.business_slug }
    });
  },
  getHierarchy() {
    return EZAxios.get(`admin/departments/get-hierarchy`);
  },
  getHierarchyWithAlias(id) {
    return EZAxios.get(`admin/departments-hierarchy-with-alias-flagged?business_id=${id}`);
  },
  renameMerge(data) {
    return EZAxios.post(`admin/departments/rename-merge`, data,
      { headers: { 'Business-Slug': store.state.business_slug }
    });
  },
  postSettings(data) {
    return EZAxios.post(`admin/departments/settings`, data,
      { headers: { 'Business-Slug': store.state.business_slug }
    });
  }
};
