import Axios from 'axios';
import store from '@/store';

export default {
  calculateTaxes(address,order_type){
    let data = {
      address: address.address,
      address2: address.address2,
      zip: address.postal_code,
      city: address.city,
      state: address.state,
      country: address.country,
      order_type: order_type
    };

    let activeUser = store.state.activeUser;
    if (!activeUser)
      data.device_id = store.state.device_id;
    else
      data.customer_slug = activeUser.data.customer.slug;

    data.country = data.country == "USA" ? "US" : data.country;
    return Axios.post(`calculate-taxes`, data);
  },
  assignAddress(address, type) {
    let data = {
      address: address.address,
      address2: address.address2,
      zip: address.postal_code,
      city: address.city,
      state: address.state,
      country: address.country,
      order_type: type
    };

    let activeUser = store.state.activeUser;
    if (!activeUser)
      data.device_id = store.state.device_id;
    else
      data.customer_slug = activeUser.data.customer.slug;

    data.country = data.country == "USA" ? "US" : data.country;
    return Axios.post(`assign-address`, data);
  },
  addItem(item, id, qty, special = -1) {
    let activeUser = store.state.activeUser;
    let data = {
      store_product_id: id,
      quantity: qty,
      special: special
    };
    if (!activeUser) {
      data.device_id = store.state.device_id;
    } else {
      data.customer_slug = activeUser.data.customer.slug;
    }

    return Axios.post(`add-to-cart`, data);
  },
  removeItem(id, special = -1) {
    let activeUser = store.state.activeUser;
    let q = activeUser ? `customer_slug=${activeUser.data.customer.slug}` : `device_id=${store.state.device_id}`;
    q += '&special_order=' + special;
    return Axios.delete(`remove-cart-item?store_product_id=${id}&${q}`);
  },
  cartDetails() {
    let activeUser = store.state.activeUser;
    let q = activeUser ? `customer_slug=${activeUser.data.customer.slug}` : `device_id=${store.state.device_id}`;
    return Axios.get(`cart-parcels?${q}`);
  },
  itemsCount() {
    let activeUser = store.state.activeUser;
    let q = activeUser ? `customer_slug=${activeUser.data.customer.slug}` : `device_id=${store.state.device_id}`;
    return Axios.get(`count-cart-items?${q}`);
  },
  emptyCart() {
    let activeUser = store.state.activeUser;
    let order_id = store.state.cart.order_id;
    let q = activeUser ? `customer_slug=${activeUser.data.customer.slug}` : `device_id=${store.state.device_id}`;
    if (order_id) {
      q += `&order_id=${order_id}`;
    }
    return Axios.get(`empty-cart?${q}`);
  },
  saveCart() {
    let cart = store.state.cart;
    let activeUser = store.state.activeUser;
    let q = activeUser ? `customer_slug=${activeUser.data.customer.slug}` : `device_id=${store.state.device_id}`;

    return Axios.post(`save-cart?${q}`, cart);
  },
  updateCart(id) {
    let data = {};
    data.id = id;
    let activeUser = store.state.activeUser;
    let q = activeUser ? `customer_slug=${activeUser.data.customer.slug}` : `device_id=${store.state.device_id}`;
    return Axios.post(`update-current-cart?${q}`, data);
  },
  checkActiveCoupons() {
    return Axios.get(`check-active-coupons`);
  },
  doTvrSignup(data) {
    return Axios.post(`truevalue/rewards-signup`, data);
  },
  doTvrLookup(data) {
    return Axios.post(`truevalue/rewards-lookup`, data);
  },
  shippingQuotes(data) {
    let activeUser = store.state.activeUser;
    let q = activeUser ? `customer_slug=${activeUser.data.customer.slug}` : `device_id=${store.state.device_id}`;
    return Axios.post(`shipping-quotes?${q}`, data);
  }
};
