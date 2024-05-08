export default {
  cartTotal: state => {
    const cartItems = state.cart.parcels;
    if (cartItems && cartItems.length) {
        const pickupItems = cartItems.find(item => {
            return item.type === 'pickup';
        });
        const specialParcels = cartItems.filter(item => {
          return item.type === 'special';
        });
        let specialItems = [];
        if (specialParcels && specialParcels.length) {
          specialParcels.forEach(parcel => {
            if (parcel.items && parcel.items.length) {
              specialItems = [...specialItems, ...parcel.items];
            }
          });
        }
        let count = 0;
        let items = [];
        if (specialItems && specialItems.length) {
          items = [...items, ...specialItems];
        }
        if (pickupItems && pickupItems.items) {
          items = [...items, ...pickupItems.items];
        }
        items.forEach(item => {
          count += item.quantity;
        });
        items.forEach(item => {
          count += item.quantity;
        });
        return count;
    }
    return 0;
  },
  getCachedValue: (state) => (key) => {
    const value = state.timeBasedCache[key];
    const now = new Date().getTime();
    if ( value && value.expires > now ) {
      return JSON.parse(value.data);
    }
    return false;
  }
};
