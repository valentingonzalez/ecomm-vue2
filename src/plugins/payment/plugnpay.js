import EZAxios from '@/ezaxios';

function submitPlugnPayForm(cart, slug)
{
  const st = cart.$store.state;

  // create a fake form and submit it
  const form = document.createElement('form');
  form.setAttribute('action', st.plugnpay_host || 'https://pay1.plugnpay.com/pay/');
  form.setAttribute('method', 'POST');

  const businessSlug = st.business_slug;

  const fields = {
    'pt_gateway_account': st.plugnpay_username || 'pnpdemo2',
    //'pd_display_items': 'yes',
    'pb_response_url': EZAxios.defaults.baseURL + '/customer/orders/callback/plugnpay',
    'pb_transition_type': 'get',
    'pt_order_id': cart.cart.order_id,
    'pt_currency': st.plugnpay_currency || 'USD',
    // wanted to split with __ but underscores are stripped out. fucking plugnpay.
    // so instead use 8 random chars which hopefully never exist in a slug.
    'pb_remote_session': businessSlug + 'FQEXZNTB' + slug,
  };

  const toPrice = price => (Math.round(+(price) * 100) / 100).toFixed(2);

  /*
  let itemIndex = 1;
  cart.cart.parcels.forEach(parcel => {
    parcel.items.forEach(item => {
      fields['pt_item_identifier_' + itemIndex] = itemIndex + '_' + item.sku;
      fields['pt_item_cost_' + itemIndex] = toPrice(item.line_price / item.quantity);
      fields['pt_item_quantity_' + itemIndex] = item.quantity;
      fields['pt_item_description_' + itemIndex] = item.title;
      itemIndex++;
    });
  });
  */

  if ( cart.cart.special_order_fee && cart.cart.special_order_fee !== '0.00' ) {
    fields.pt_handling_amount = toPrice(cart.cart.special_order_fee);
  }
  if ( cart.cart.tax ) {
    fields.pt_tax_amount = toPrice(cart.cart.tax);
  }
  if ( cart.typeName === 'shipping' && cart.cart.shipping_fee > 0 ) {
    fields.pt_shipping_amount = toPrice(cart.cart.shipping_fee);
  } else if ( cart.typeName === 'delivery' && cart.cart.delivery_fee > 0 ) {
    fields.pt_shipping_amount = toPrice(cart.cart.delivery_fee);
  }

  fields.pt_subtotal = toPrice(cart.cart.subtotal);

  let total = parseFloat(cart.cart.subtotal);
  if ( cart.cart.tax ) {
    total += parseFloat(cart.cart.tax);
  }
  
  // i don't fucking know???? i guess if total == subtotal and we have a shipping amount then
  // recreate total because the entire fucking cart page is broken?
  // so i guess "total" doesn't work at all. so just rebuild the total using subtotal and tax+fulfillment.
  if (cart.typeName === 'shipping' && cart.cart.shipping_fee > 0) {
    total += parseFloat(cart.cart.shipping_fee);
  } else if (cart.typeName === 'delivery' && cart.cart.delivery_fee > 0) {
    total += parseFloat(cart.cart.delivery_fee);
  }

  fields.pt_transaction_amount = toPrice(total);

  Object.keys(fields).forEach(k => {
    const hidden = document.createElement('input');
    hidden.setAttribute('type', 'hidden');
    hidden.setAttribute('name', k);
    hidden.setAttribute('value', fields[k]);
    form.appendChild(hidden);
  });

  document.body.appendChild(form);
  form.submit();
}

export {
  submitPlugnPayForm
};
