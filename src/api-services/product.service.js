import Axios from 'axios';
import Ezaxios from "@/ezaxios";
import store from '@/store';

export default {
  getProduct(param) {
    return Axios.get(`products/product?param=${param}`);
  },
  getProductBySlug(slug) {
    return Axios.get(`products/product?param=${slug}&field=slug`);
  },
  searchProducts(keyword) {
    return Axios.get(`products?search=${keyword}`);
  },
  getCompetitors(id) {
    return Axios.get(`products/${id}/competitors`);
  },
  getSimiliarProducts(upc) {
    return Axios.get(`products/${upc}/addons`);
  },
  getPopularProducts() {
    return Axios.get(`popular-products?date=2019-02-04`); // delete this, temporaly (API not working properly)
  },
  getVideos(upc) {
    return Axios.get(`products/${upc}/videos`);
  },
  getFavouriteProducts(admin = false) {
    return Axios.get(`favourite-products${ admin ? '?view_as_admin=true' : '' }`);
  },
  getRandomProducts(o) {
    let q = '';
    if(o.brand_id)
      q += `&brands[]=${o.brand_id}`;
    if(o.dept_id)
      q += `&dept_id=${o.dept_id}`;
    return Ezaxios.get(`products?search=%27%27${q}&limit=${o.limit}&sort=relevancy&page=1&in_stock_only=1&randomize=1`);
  },
  getRandomProductsByStoreId(o,StoreId) {
    let q = '';
    if(o.brand_id)
      q += `&brands[]=${o.brand_id}`;
    if(o.dept_id)
      q += `&dept_id=${o.dept_id}`;

    return Ezaxios.get(`products?search=%27%27${q}&limit=${o.limit}&sort=relevancy&page=1&in_stock_only=1&randomize=1`, {
      headers: {'Store-Id': StoreId}
    });
  },
  getProductImages(id) {
    return Axios.get(`products/${id}/images`);
  },
  getTopProductsOfBrand(brandId, sku) {
    return Axios.get(`top-selling/${brandId}/${sku}`);
  },
  getPartnerProductInventoryBySku(sku){
    return Axios.get(`partner-business-product-inventory/${sku}`);
  },
  getProductLogs(data) {
    return Axios.post(`admin/product/logs`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        'Business-Slug': store.state.business_slug
      }
    });
  },
  getWidgetProducts(data) {
    return Axios.post(`widget/getProducts`, data, {
      headers: {
        'Business-Slug': store.state.business_slug
      }
    });
  },
  getRecentViewedItems() {
    return Ezaxios.post(`products/get-recent`, { device_id: store.state.device_id }, {
      headers: {
        'Business-Slug': store.state.business_slug
      }
    });
  },
  getRecentViewedProductsData(data) {
    return Axios.post(`widget/get-recent-viewed-products-data`, data, {
      headers: {
        'Business-Slug': store.state.business_slug
      }
    });
  },
  saveItemBackInStockNotificationDetails(data) {
    return Ezaxios.post(`products/save-back-in-stock-details`, data, {
      headers: {
        'Business-Slug': store.state.business_slug
      }
    });
  }
};
