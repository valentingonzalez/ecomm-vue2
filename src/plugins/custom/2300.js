// assume EZCP already exists, this gets loaded AFTER base.js (if business ID matches filename)


const baseGetInventoryLevel = window.EZCP.getInventoryLevel;
window.EZCP.getInventoryLevel = function($this, item)
{
  if ($this.$store.state.currentStore && $this.$store.state.currentStore.name === 'Hills Flat Lumber - Colfax'
    && item.location !== '_ezdib') {
    return item.colfax_inventory;
  } else {
    return baseGetInventoryLevel($this, item);
  }
};
