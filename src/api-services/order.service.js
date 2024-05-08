import Axios from 'axios';
import EZAxios from '@/ezaxios';
import store from '@/store';
import {trackPurchase} from "@/plugins/analytics";

const auth = function() {
  let token = sessionStorage.getItem('token') || localStorage.getItem('token');
  return { 'Authorization': `Bearer ${token}` };
};

const slug = function() {
  return { 'Business-Slug': store.state.business_slug };
};

export default {
  getOrders() {
    let activeUser = store.state.activeUser;
    let queryString = activeUser ? 'customer_slug=' + activeUser.data.customer.slug : '';

    return Axios.get(`orders?${queryString}`);
  },
  getSavedOrders() {
    let activeUser = store.state.activeUser;
    let queryString = activeUser ? 'customer_slug=' + activeUser.data.customer.slug : '';

    return Axios.get(`orders-saved?${queryString}`);
  },
  getOrderDetails(id) {
    return Axios.get(`orders/order?param=${id}`);
  },
  async submitCustomerOrder(data) {
    data.device_id = store.state.device_id;
    const result = await EZAxios.post(`customer/orders/submit`, data);
    // just using purchase and not begin_checkout since i don't think the begin_checkout applies here.
    // checkout and cart are the same page right now.
    if ( result.data.status === 'success' && result.data.order ) {
      trackPurchase(result.data.order);
    }

    return result;
  },
  prePayment() {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return Axios.post('customer/orders/prepayment', {locale: locale});
  },
  redeemCoupon(data) {
    let activeUser = store.state.activeUser;
    if (!activeUser)
      data.device_id = store.state.device_id;
    else
      data.customer_slug = activeUser.data.customer.slug;

    return Axios.post(`redeem-coupon`, data);
  },
  verifyCouponsQualifications() {
    let activeUser = store.state.activeUser;
    let data = {};
    data.customer_slug = activeUser.data.customer.slug;

    return Axios.post(`redeemed-coupons-status`, data);
  },
  validateAddressOnCart(data) {
    return EZAxios.post(`customer/orders/validate-address`, data);
  },
  getActiveShippingCarriers() {
    return Axios.get(`/active-shipping-carriers`);
  },
  getAvailableCarriers() {
    return EZAxios.get(`/admin/shipping/getAvailableCarriers`);
  },
  getCarriers() {
    return EZAxios.get(`/admin/shipping/getCarriers`);
  },
  getShippingInfo(id) {
    return EZAxios.get(`/admin/shipping/${id}/info`);
  },
  addCarrier(carrier) {
    return EZAxios.post(`/admin/shipping/addCarrier`, carrier, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  deleteCarrier(id) {
    return EZAxios.post(`/admin/shipping/deleteCarrier`, { carrier_id: id }, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  getShippingLabelQuotes(id, data) {
    return EZAxios.post(`/admin/shipping/${id}/quotes`, data, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  getInsuranceRate(data) {
    return EZAxios.post(`admin/shipping/insurance-rate`, data, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  buyShippingLabel(data, orderId) {
    return EZAxios.post(`admin/shipping/${orderId}/buy`, data, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  validateAddress(data) {
    return EZAxios.post(`admin/shipping/validateAddress`, data, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  orderCallback(provider, o, c, data) {
    return EZAxios.post(`/customer/orders/callback/${provider}?o=${o}&b=${store.state.business_slug}&c=${c}`, data, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  getRecurringOrderDates(data) {
    return EZAxios.post(`recurring-order-dates`, data, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  authOrCapturePaypal(data) {
    return EZAxios.post(`/auth-capture-paypal`, data, {
      headers: {
        ...auth(), ...slug()
      },
    });
  },
  getMyRecurringOrders() {
    return EZAxios.post(`get-recurring-orders`, [], {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  validateMemberInfoOnCart(data) {
    return EZAxios.post(`orders/validate-info`, data);
  },
  logPaypalError(data) {
    return EZAxios.post(`log-paypal-error`, data);
  },
  cancelRecurringOrder(data) {
    return EZAxios.post(`cancel-recurring-order`, data, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  cancelAllRecurringOrders(data) {
    return EZAxios.post(`cancel-all-recurring-orders`, data, {
      headers: {
        ...auth(), ...slug()
      }
    });
  },
  checkFingerPrintStatus(data) {
    return EZAxios.post(`admin/check-fingerprint`, data,
      {
        headers: {
          ...auth(), ...slug()
        }
      });
  },
};
