let analyticsStoreNumber = null;

function addToCart(item, qty)
{
  analyticsStoreNumber && window.dataLayer.push({storeNumber: analyticsStoreNumber});
  // fb pixel
  window.fbq && window.fbq('track', 'AddToCart', {currency: 'USD', value: item.price, quantity: qty});

  // ga4
  window.dataLayer.push({ecommerce: null});
  window.dataLayer.push({
    'event': 'add_to_cart',
    'ecommerce': {
      'items': [{
        'item_name': item.title, // Name or ID is required.
        'item_id': item.sku,
        'item_brand': item.brand_name,
        'price': item.price,
        'quantity': qty,
      }],
      'value': item.price * qty,
    }
  });
  // ga3
  window.dataLayer.push({ecommerce: null});
  window.dataLayer.push({
  'event': 'addToCart',
    'ecommerce': {
      'currencyCode': 'USD',
      'add': {
        'products': [{
          'name': item.title,
          'id': item.sku,
          'price': item.price,
          'brand': item.brand_name,
          'quantity': 1
        }]
      }
    }
  });

  window.gtag && window.gtag('event', 'add_to_cart', {
    currency: 'USD',
    items: [{
      item_id: item.sku,
      item_name: item.title,
      item_brand: item.brand_name,
      price: item.price,
      currency: 'USD',
      quantity: qty,
    }],
    value: item.price * qty
  });
}

function removeFromCart(item, qty)
{
  analyticsStoreNumber && window.dataLayer.push({storeNumber: analyticsStoreNumber});
  // fb pixel
  window.fbq && window.fbq('trackCustom', 'Remove From Cart', {currency: 'USD', value: item.price, quantity: qty});

  // ga4
  window.dataLayer.push({ecommerce: null});
  window.dataLayer.push({
    'event': 'remove_from_cart',
    'ecommerce': {
      'items': [{
        'item_name': item.title, // Name or ID is required.
        'item_id': item.sku,
        'item_brand': item.brand_name,
        'price': item.price,
        'quantity': qty,
      }],
      'value': item.price * qty,
    }
  });
  // ga3
  window.dataLayer.push({ecommerce: null});
  window.dataLayer.push({
    'event': 'removeFromCart',
    'ecommerce': {
      'currencyCode': 'USD',
      'remove': {
        'products': [{
          'name': item.title,
          'id': item.sku,
          'price': item.price,
          'brand': item.brand_name,
          'quantity': qty
        }]
      }
    }
  });

  window.gtag && window.gtag('event', 'remove_from_cart', {
    currency: 'USD',
    items: [{
      item_id: item.sku,
      item_name: item.title,
      item_brand: item.brand_name,
      price: item.price,
      currency: 'USD',
      quantity: qty,
    }],
    value: item.price * qty
  });
}

function trackPurchase(order)
{
  analyticsStoreNumber && window.dataLayer.push({storeNumber: analyticsStoreNumber});

  let items = [];
  order.parcels.forEach(e => {
    e.items.forEach(i => {
      items.push({
        // ga4
        'item_name': i.title,
        'item_id': i.sku,
        // ga3
        'name': i.title,
        'id': i.sku,
        // both
        'price': i.price,
        'quantity': i.quantity,
      });
    });
  });

  // fb pixel
  window.fbq && window.fbq('track', 'Purchase', { currency: 'USD', value: order.total, items: items });

  // ga4
  window.dataLayer.push({ecommerce: null});
  window.dataLayer.push({
    'event': 'purchase',
    'ecommerce': {
      'transaction_id': order.id,
      'affiliation': 'Online Store',
      'value': order.total,
      'tax': order.tax_total,
      'shipping': order.shipping_total,
      'currency': 'USD',
      'items': items,
    }
  });
  // ga3
  window.dataLayer.push({ecommerce: null});
  window.dataLayer.push({
    'event': 'purchase',
    'ecommerce': {
      'purchase': {
        'actionField': {
          'id': order.id,
          'affiliation': 'Online Store',
          'revenue': order.total,
          'tax': order.tax_total,
          'shipping': order.shipping_total
        },
        'products': items
      }
    }
  });

  window.gtag && window.gtag('event', 'purchase', {
    'transaction_id': order.id,
    'affiliation': 'Online Store',
    'value': order.total,
    'tax': order.tax_total,
    'shipping': order.shipping_total,
    'currency': 'USD',
    'items': items
  });
}

function trackProductClick(item)
{
  analyticsStoreNumber && window.dataLayer.push({storeNumber: analyticsStoreNumber});

  //window.fbq && window.fbq('track', 'ViewContent', { item_name: item.title, item_id: item.sku, item_brand: item.brand_name, price: item.price });
  // ga4
  window.dataLayer.push({ecommerce: null});
  window.dataLayer.push({
    'event': 'select_item',
    'ecommerce': {
      'items': [{
        'item_name': item.title, // Name or ID is required.
        'item_id': item.sku,
        'item_brand': item.brand_name,
        'price': item.price,
      }]
    }
  });
  // ga3
  window.dataLayer.push({ecommerce: null});
  window.dataLayer.push({
    'event': 'productClick',
    'ecommerce': {
      'click': {
        'actionField': {},
        'products': [{
          'name': item.title,
          'id': item.sku,
          'price': item.price,
          'brand': item.brand_name
        }]
      }
    }
  });

  window.gtag && window.gtag('event', 'select_item', {
    'items': [{
      'item_name': item.title, // Name or ID is required.
      'item_id': item.sku,
      'item_brand': item.brand_name,
      'price': item.price,
    }]
  });
}

function trackProductView(product)
{
  analyticsStoreNumber && window.dataLayer.push({storeNumber: analyticsStoreNumber});

  // ga4
  window.dataLayer.push({ecommerce: null});
  window.dataLayer.push({
    'event': 'view_item',
    'ecommerce': {
      'items': [{
        'item_name': product.title, // Name or ID is required.
        'item_id': product.sku,
        'item_brand': product.brand_name,
        'price': product.price,
      }],
      'value': product.price,
    },
  });

  // ga3
  window.dataLayer.push({ecommerce: null});
  window.dataLayer.push({
    'event': 'productView',
    'ecommerce': {
      'detail': {
        'products': [{
          'name': product.title,
          'id': product.sku,
          'price': product.price,
          'brand': product.brand_name
        }]
      }
    }
  });

  window.gtag && window.gtag('event', 'view_item', {
    items: [{
      'item_name': product.title, // Name or ID is required.
      'item_id': product.sku,
      'item_brand': product.brand_name,
      'price': product.price,
    }],
    value: product.price
  });
}

function updateStoreNumber(number) {
  analyticsStoreNumber = number;
  window.gtag && window.gtag('set', 'user_properties', {
    store_number: number,
  });
}

function updateGAUserId(userId) {
  window.gtag && window.gtag('set', 'user_id', userId);
}

function handleFakeGASession()
{
  /*
  if ( window.__EZ_TV_ECOM_PLAN === undefined ) {
    return;
  }

  const sessionTime = window.localStorage.getItem("tvSessionTime");
  const now = new Date().getTime();
  const halfHour = 1800 * 1000;
  if ( sessionTime === null || parseInt(sessionTime) < now - halfHour ) {
    // create a new session event
    window.dataLayer.push({
      event: 'session_start_fake'
    });
  }

  // always update this
  window.localStorage.setItem("tvSessionTime", "" + now);
   */
}

export {
  addToCart,
  removeFromCart,
  trackPurchase,
  trackProductClick,
  trackProductView,
  handleFakeGASession,
  updateStoreNumber,
  updateGAUserId,
};
