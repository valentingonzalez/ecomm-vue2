import EZAxios from '@/ezaxios';
import store from '@/store';

const auth = () => ({ 'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` });
const slug = () => ({ 'Business-Slug': store.state.business_slug });

export default {
  getSuggestersForSingleProductPage(ids) {
    return EZAxios.get(`product-suggester/get-suggesters-for-product?dept_id=${ids.deptId}&class_id=${ids.classId}&fineline_id=${ids.finelineId}&sku=${ids.sku}`, {
      headers: { 'Business-Slug': store.state.business_slug }
    });
  },
  getBusinessSuggesters() {
    return EZAxios.get(`admin/product-suggester/list-suggesters`, {
      headers: { ...auth(),  ...slug() }
    });
  },
  getSelectedSuggesterData(suggesterId) {
    return EZAxios.get(`admin/product-suggester/get-suggester-data?id=${suggesterId}`, {
      headers: { ...auth(),  ...slug() }
    });
  },
  createNewSuggester() {
    return EZAxios.post(`admin/product-suggester/create-suggester`, {
      headers: { ...auth(),  ...slug() }
    });
  },
  saveSuggester() {
    return EZAxios.post(`admin/product-suggester/save-suggester`, {
      headers: { ...auth(),  ...slug() }
    });
  },
  updateSuggesterSwiper(ob) {
    return EZAxios.post(`admin/product-suggester/update-suggester-swiper`, ob, {
      headers: { ...auth(),  ...slug() }
    });
  },
  updateSuggesterAdd(ob) {
    return EZAxios.post(`admin/product-suggester/update-suggester-add`, ob, {
      headers: { ...auth(),  ...slug() }
    });
  },
  updateSuggesterRemove(ob) {
    return EZAxios.post(`admin/product-suggester/update-suggester-remove`, ob, {
      headers: { ...auth(),  ...slug() }
    });
  },
  getSuggesterLocations(suggesterId) {
    return EZAxios.get(`admin/product-suggester/get-suggester-locations?id=${suggesterId}`, {
      headers: { ...auth(),  ...slug() }
    });
  },
  updateSuggesterLocations(ob) {
    return EZAxios.post(`admin/product-suggester/update-suggester-locations`, ob, {
      headers: { ...auth(),  ...slug() }
    });
  },
  updateSuggesterHidden(ob) {
    return EZAxios.post(`admin/product-suggester/update-suggester-hidden`, ob, {
      headers: { ...auth(),  ...slug() }
    });
  },
  deleteSuggester(ob) {
    return EZAxios.post(`admin/product-suggester/delete-suggester`, ob, {
      headers: { ...auth(),  ...slug() }
    });
  },
};