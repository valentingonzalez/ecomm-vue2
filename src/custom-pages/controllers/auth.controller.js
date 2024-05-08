import Axios from 'axios';
import store from '@/store';

const AUTH_HEADER = 'Authorization';

export default {
  login(data) {
    this.setLocalStorageAuthData(data);
    this.setAuthHeader();
    store.commit('setActiveUser', data);
  },

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('master-login');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    // device id can be null in the state if you refresh while logged in and then log out.
    // this will force-set it again.
    this.initDeviceId();
    this.setAuthHeader(true);
  },

  setLocalStorageAuthData(data) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data));
  },

  setSessionStorageAuthData(data) {
    sessionStorage.setItem('token', data.access_token);
    sessionStorage.setItem('user', JSON.stringify(data));
  },

  setAuthHeader(unset = false) {
    if (unset) {
      delete Axios.defaults.headers[AUTH_HEADER];
      return;
    }
    Axios.defaults.headers[AUTH_HEADER] = `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`;
  },

  initStoreAuth() {
    const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));

    this.initDeviceId(); // init this no matter what so it's always available

    if (userData) {
      this.setAuthHeader();
      store.commit('setActiveUser', userData);
    } else {
      this.setAuthHeader(true);
    }
  },

  initDeviceId() {
    let device_id = localStorage.getItem('device_id');

    if (!device_id) {
      device_id = this.generateDeviceId();
    }

    store.commit('setDeviceId', device_id);
    localStorage.setItem('device_id', device_id);
  },

  checkLocalStorage() {
    const userData = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));

    if (userData) {
      this.setAuthHeader();
    }

    return userData;
  },

  updateUserInLocalStorage(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  },

  checkAuthStatus() {
    const userData = this.checkLocalStorage();

    if (!userData) {
      return false;
    }

    return store.state.activeUser;
  },

  generateDeviceId() {
    let text = '';
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
};
