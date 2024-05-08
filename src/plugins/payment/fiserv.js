import EZAxios from '@/ezaxios';

async function submitFiservForm(cart, slug)
{
  const st = cart.$store.state;

  const scriptUrl = st.fiserv_live === true
        ? 'https://www5.ipg-online.com/connect/gateway/processing'
        : 'https://test.ipg-online.com/connect/gateway/processing';

  const responseURL = EZAxios.defaults.baseURL + '/customer/orders/callback/fiserv';
  const businessSlug = st.business_slug;
  const toPrice = price => (Math.round(+(price) * 100) / 100).toFixed(2);

  // Copying this block from plugnpay
  let total = parseFloat(cart.cart.subtotal);
  if ( cart.cart.tax ) {
    total += parseFloat(cart.cart.tax);
  }
  
  if (cart.typeName === 'shipping' && cart.cart.shipping_fee > 0) {
    total += parseFloat(cart.cart.shipping_fee);
  } else if (cart.typeName === 'delivery' && cart.cart.delivery_fee > 0) {
    total += parseFloat(cart.cart.delivery_fee);
  }


  const result = await EZAxios.post(`get-fiserv-hash`, {amount: total, response_url: responseURL});
  if ( result.data.status === 'success' && result.data.hash ) {
    
    // create a fake form and submit it
    const form = document.createElement('form');
    form.setAttribute('action', scriptUrl);
    form.setAttribute('method', 'POST');

    const fields = {
      'txntype': 'sale',
      'timezone': result.data.timezone,
      'txndatetime': result.data.date,
      'storename': result.data.storename,
      'chargetotal': toPrice(total),
      'currency': result.data.currency,
      'mode': 'payonly',
      'paymentMethod': 'M',
      'responseFailURL': responseURL,
      'responseSuccessURL': responseURL,
      'language': 'en_US',
      'oid': st.cart.order_id,
      'comments': businessSlug + '__' + slug,
    };


    fields.hash_algorithm = 'SHA256';
    fields.hash = result.data.hash;

    Object.keys(fields).forEach(k => {
      const hidden = document.createElement('input');
      hidden.setAttribute('type', 'hidden');
      hidden.setAttribute('name', k);
      hidden.setAttribute('value', fields[k]);
      form.appendChild(hidden);
    });

    //console.log("form", form);
    
    document.body.appendChild(form);
    form.submit();
  }
}

export {
  submitFiservForm
};
