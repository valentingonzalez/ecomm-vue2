// Base behaviors that can be overridden in other .js files in plugins/custom.
// These custom files will be *directly injected* as script tags with index.php,
// so custom store code won't be compiled in for every site.

// EZCommerce Plugin namespace
window.EZCP = {};

// $this is the component it's called from.
// item is the item data.
// Currently used in pages/products/single.vue and components/product-item.vue
window.EZCP.getInventoryLevel = function($this, item) {
  return item.num_inventory;
};
