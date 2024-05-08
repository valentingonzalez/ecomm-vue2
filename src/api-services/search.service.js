import Axios from 'axios';
import store from '@/store';
import EZAxios from '@/ezaxios';

export default {
  searchSuggestions(keyword) {
    keyword = encodeURIComponent(keyword);
    return Axios.get(`get-suggestions?search=${keyword}`);
  },
  getSearchTermSuggestions(keyword) {
    keyword = encodeURIComponent(keyword);
    return EZAxios.get(`get-search-term-suggestions?search=${keyword}`);
  },
  searchResults(params) {
    if(window.location.search) {
      const m = window.location.search.match(/v2search=([0-9.]+)/);
      if ( m && m.length === 2 ) {
        params.v2search = m[1];
      }
      if(window.location.search.includes('use_dev=1')) {
        params.dev_index = '1';
      }
    }
    params.limit = params.limit || store.state.settings.products.itemsPerPage || 96;
    return EZAxios.get(`products`, { params });
  },
  nearbyStore(params) {
    return Axios.get(`nearby-stores`, { params });
  },
  trackSearchClick(search, id, index) {
    const params = { search, id, index };
    return Axios.post('search/click', params);
  },
};
