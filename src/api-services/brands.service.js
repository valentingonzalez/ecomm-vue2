import Axios from 'axios';
import EZAxios from '@/ezaxios';

export default {
  getBrands(page, limit, search, sort) {
    let params = { page, limit, sort };
    
    if (search)
      params.search = search;
    return EZAxios.get(`brands`, { params });
  },
  getBrandById(id) {
    return Axios.get(`brands/brand?param=${id}`);
  },
  getProducts(brand_id, page, limit, sort, searchQuery = '') {
    let params = {
      param: brand_id,
      page: page,
      limit: limit,
      search: searchQuery
    };
    if (sort)
      params.sort = sort;
    return Axios.get(`brand/products`, { params });
  },
  getImages(brand_id, page, limit) {
    let params = { param: brand_id, page, limit };
    return Axios.get(`brand/products`, { params });
  },
  getVideos(brand_id) {
    return Axios.get(`brands/${brand_id}/videos`);
  },
  getFilter() {
    return Axios.get(`brands/get-filter`);
  }
};
