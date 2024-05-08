import Axios from 'axios';

export default {
  subscribe(email, name = null) {
    return Axios.post(`add-subscriber`, { email, name });
  }
};
