import Axios from 'axios';

export default {
  getBanner() {
    return Axios.get(`home-banner`);
  }
};
