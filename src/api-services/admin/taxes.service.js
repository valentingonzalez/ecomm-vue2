import EZAxios from '@/ezaxios';
import store from '@/store';

// DO NOT ADD THE LET TOKEN UP HERE BECAUSE IT BREAKS THE ADMIN
// IT NEEDS TO BE IN EVERY FUNCTION OR ELSE IF THEY LOG OUT AND LOG BACK IN AGAIN THE TOKEN WILL
// NEVER GET UPDATED AND ALL THESE APIS WILL FAIL.

const auth = () => ({ 'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` });
const slug = () => ({ 'Business-Slug': store.state.business_slug });

export default {
  getTaxes(ids = null) {
    let param = ids ? `?business_ids=${ids}` : '';
    return EZAxios.get(`admin/tax${param}`, {
      headers: { ...auth(), ...slug() }
    });
  },
  saveTaxes(data) {
    return EZAxios.post(`admin/tax/save`, data, {
      headers: { ...auth(), ...slug() }
    });
  }
};
