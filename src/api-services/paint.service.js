import Axios from 'axios';
import EZAxios from "@/ezaxios";

export default {
  getColors(data = {}) {
    return Axios.post(`https://ecom-stage2.ezadlive.com/paints/colors`, data);
  },
  getCollections() {
    return Axios.get(`https://ecom-stage2.ezadlive.com/paints/categories`);
  },
  getFamilies() {
    return Axios.get(`https://ecom-stage2.ezadlive.com/paints/taxonomies`);
  },
  getCategories() {
    return EZAxios.get(`/paints/families`);
  },
  getProducts(params) {
    return EZAxios.get(`/paints/products?${new URLSearchParams(params).toString()}`);
  }
};
