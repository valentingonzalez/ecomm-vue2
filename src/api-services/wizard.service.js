import EZAxios from '@/ezaxios';
import store from '@/store';

// DO NOT ADD THE LET TOKEN UP HERE BECAUSE IT BREAKS THE ADMIN
// IT NEEDS TO BE IN EVERY FUNCTION OR ELSE IF THEY LOG OUT AND LOG BACK IN AGAIN THE TOKEN WILL
// NEVER GET UPDATED AND ALL THESE APIS WILL FAIL.

const auth = () => ({ 'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` });
const slug = () => ({ 'Business-Slug': store.state.business_slug });

export default {
  getWizard(id = null) {
    return EZAxios.get(`setup-wizard/get?id=${id}`, {
      headers: { ...auth(),  ...slug() }
    });
  },
  getWizardBusinesses() {
    return EZAxios.get(`setup-wizard/get-business`, {
      headers: { ...auth(),  ...slug() }
    });
  },
  getSteps(id, business_id) {
    return EZAxios.get(`setup-wizard/get-steps?business_id=${business_id}&id=${id}`, {
      headers: { ...auth(),  ...slug() }
    });
  },
  markItemCompleted(id, business_id) {
    let formData = new FormData();
    formData.append('id', id);
    formData.append('business_ids', business_id);
    return EZAxios.post(`setup-wizard/mark-item-completed`, formData, {
      headers: { ...auth(), ...slug(), 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  markItemStarted(id, business_id) {
    let formData = new FormData();
    formData.append('id', id);
    formData.append('business_id', business_id);
    return EZAxios.post(`setup-wizard/mark-item-started`, formData, {
      headers: { ...auth(), ...slug(), 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  getDepartmentsWithBad(storeId) {
    return EZAxios.get(`admin/departments-list-with-bad?business_id=${storeId}&showHiddenDept=1`, {
      headers: { ...auth(),  ...slug() }
    });
  },
  unsubscribe(hash) {
    return EZAxios.get(`setup-wizard/do-not-remind?hash=${hash}`, {
      headers: { ...auth(),  ...slug() }
    });
  },
  getDepartments(business_id, hidden = 0) {
    return EZAxios.get(`full-departments-wizard?business_id=${business_id}&showHiddenDept=${hidden}`, {
      headers: { ...auth(),  ...slug() }
    });
  },
  getSettings(id) {
    return EZAxios.get(`setup-wizard/settings?id=${id}`, {
      headers: { 
        ...auth(),  
        ...slug() 
      }
    });
  },

  // ONLY FOR TESTING
  flushItems() {
    return EZAxios.get(`setup-wizard/flush-completed-items`, {
      headers: { ...auth(),  ...slug() }
    });
  },
};
