import Axios from 'axios';
import EZAxios from '@/ezaxios';

export default {
  register(data) {
    return EZAxios.post(`signup`, data);
  },
  verifyPassword(data) {
    data.access_token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return Axios.post(`verify-password`, data);
  },
  saveStore(data) {
    data.access_token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return Axios.post('save-customer-stores', data);
  },
  getDetails() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return Axios.get(`get-customer-details?access_token=${token}`);
  },
  saveName(data) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return Axios.post(`customer/name?access_token=${token}`, data);
  },
  saveEmail(data) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return Axios.post(`customer/email?access_token=${token}`, data);
  },
  changePassword(data) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return Axios.post(`customer/password?access_token=${token}`, data);
  },
  getCards() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return Axios.get(`customer-cards?access_token=${token}`);
  },
  addCard(newSource) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return Axios.post(`customer-cards/add?access_token=${token}`, { newSource });
  },
  removeCard(source) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return Axios.post(`customer-cards/delete?access_token=${token}`, { source });
  },
  setMarketingEmails(data) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return Axios.post(`customer/set-marketing?access_token=${token}`, data);
  },
  getStoreDistance(zipcode) {
    return Axios.get(`store-distance/${zipcode}`);
  }
};
