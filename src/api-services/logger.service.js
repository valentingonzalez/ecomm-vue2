import Axios from 'axios';
import store from '@/store';
let env = 'remote';

const auth = function() {
  let token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return { 'Authorization': `Bearer ${token}` };
};
const slug = function() {
  return { 'Business-Slug': store.state.business_slug };
};
const axios = Axios.create({
  baseURL: env == 'local' ? 'http://localhost:3535/' : 'http://ecdevapi1.ezad.io/api/'
});
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export default {
  getSettings() {
    let store_id = store.state.businessDetails.about_us.locations[0].business_id;
    return axios.get(`business/site-settings/${store_id}`);
  },
  update(data) {
    let store_id = store.state.businessDetails.about_us.locations[0].business_id;
    data.key = data.key.replace('.', '-');
    return axios.patch(`business/update-site-settings/${store_id}`, { siteSettings: [data] }, {
      headers: {
        ...auth(), ...slug()
      }
    });
    /*return Axios.post(`admin/widget-type/update`, data, {
      headers: {
        Authorization: `Bearer ${(localStorage.getItem('token') || sessionStorage.getItem('token'))}`
      }
    });*/
  }
};
