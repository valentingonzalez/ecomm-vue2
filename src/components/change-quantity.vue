<template>
  <div class="add-remove">
    <div v-if="invalidProductQuantity" class="notification small">
      {{errorMssg}}
    </div>
    <div class="change-quantity d-flex">
      <button type="button" class="btn action-bt btn-primary" aria-label="Subtract 1 from Quantity" :disabled="quantity <= 0 || stopAddingQuantity" @click="updateQty(Number(quantity) - subQty)">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" viewBox="0 0 10 2" fill="none">
        <path d="M9 1H1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <input v-model="quantity" :disabled="stopAddingQuantity || isFPack" type="number" min="0" max="9999" maxlength="4" inputmode="numeric" pattern="[0-9]*"
       oninput="validity.valid||(value='');" class="form-control bg-white mx-1 text-center font-weight-bold" @keyup="validateQuantity" @blur="validateNumber"/>
      <button type="button" class="btn action-bt btn-primary" aria-label="Add 1 to Quantity" :disabled="stopAddingQuantity" @click="updateQty(Number(quantity) + addQty, true)">
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 0C4.21217 0 4.41566 0.0842856 4.56569 0.234315C4.71571 0.384344 4.8 0.587827 4.8 0.8V3.2H7.2C7.41217 3.2 7.61566 3.28429 7.76569 3.43431C7.91571 3.58434 8 3.78783 8 4C8 4.21217 7.91571 4.41566 7.76569 4.56569C7.61566 4.71571 7.41217 4.8 7.2 4.8H4.8V7.2C4.8 7.41217 4.71571 7.61566 4.56569 7.76569C4.41566 7.91571 4.21217 8 4 8C3.78783 8 3.58434 7.91571 3.43431 7.76569C3.28429 7.61566 3.2 7.41217 3.2 7.2V4.8H0.8C0.587827 4.8 0.384344 4.71571 0.234315 4.56569C0.0842856 4.41566 0 4.21217 0 4C0 3.78783 0.0842856 3.58434 0.234315 3.43431C0.384344 3.28429 0.587827 3.2 0.8 3.2H3.2V0.8C3.2 0.587827 3.28429 0.384344 3.43431 0.234315C3.58434 0.0842856 3.78783 0 4 0Z" fill="white"/>
        </svg>
      </button>
      
      <button aria-label="Remove Item" v-if="showRemoveItem" @click="removeItem" class="btn-remove">
        <svg class="fill-primary" width="12" height="14" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="nonzero"><path d="M10.846 1.684H8.308v-.42C8.308.565 7.688 0 6.923 0H5.077c-.765 0-1.385.566-1.385 1.263v.421H1.154C.517 1.684 0 2.156 0 2.737v.842C0 3.81.207 4 .462 4h11.076c.255 0 .462-.188.462-.421v-.842c0-.582-.517-1.053-1.154-1.053zm-6.23-.42c0-.233.207-.422.46-.422h1.847c.255 0 .462.19.462.421v.421h-2.77v-.42zM1.137 4c-.078 0-.14.08-.137.176l.362 8.29c.033.86.61 1.534 1.312 1.534h6.652c.703 0 1.28-.673 1.312-1.533L11 4.176C11.004 4.08 10.94 4 10.863 4H1.137zm6.615 1.341c0-.296.196-.536.438-.536s.438.24.438.536v5.976c0 .297-.196.537-.438.537s-.438-.24-.438-.537V5.341zm-2.19 0c0-.296.196-.536.438-.536s.438.24.438.536v5.976c0 .297-.196.537-.438.537s-.438-.24-.438-.537V5.341zm-2.19 0c0-.296.196-.536.438-.536s.438.24.438.536v5.976c0 .297-.196.537-.438.537s-.438-.24-.438-.537V5.341z"/></g></svg>
      </button>
    </div>
  </div>
</template>


<script>
import CartApiService from '@/api-services/cart.service';
import {addToCart, removeFromCart} from "@/plugins/analytics";

export default {
  name: 'ChangeQuantity',
  props: {
    qty: {
      type: Number,
      default: 1
    },
    cartItem: {
      type: Object,
      default: null
    },
    max: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 1
    },
    // the number in the UI can NEVER go above this
    uiLimit: {
      type: Number,
      default: -1
    },
    special: {
      type: Boolean,
      default: false
    },
    showRemoveItem: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      invalidProductQuantity: false,
      errorMssg: '',
      quantity: this.qty,
      oldQuantity: this.qty,
      updatingCart: false,
    };
  },
  computed: {
    addQty() {
      if((this.fPackQty && !this.allowCustomQtyOnFpackProducts) || (this.fPackQty && this.allowCustomQtyOnFpackProducts && Number(this.quantity) == 0)) {
        return Number(this.quantity) % this.fPackQty == 0 ? this.fPackQty : this.fPackQty - (Number(this.quantity) % this.fPackQty);
      }
      return 1;
    },
    subQty() {
      if(this.fPackQty && !this.allowCustomQtyOnFpackProducts) {
        return Number(this.quantity) % this.fPackQty == 0 ? this.fPackQty : Number(this.quantity) % this.fPackQty;
      }
      return 1;
    },
    isAdmin() {
      return this.$store.state.activeUser && this.$store.state.activeUser.is_admin;
    },
    businessDetails() {
      return this.$store.state.businessDetails;
    },
    isSpecialOrderAllowed() {
      const allow = this.$store.state.allowSpecialOrderVendors;
      const isVendorAllowed = allow.includes(this.cartItem.vendor_id);
      if ( isVendorAllowed ) {
        return true;
      }
      // In case if this product is allowed special order from product editor
      const allowedSpecialOrder = this.cartItem.extra && JSON.parse(this.cartItem.extra).always_allow_special_order;
      if(allowedSpecialOrder === true) {
        return true;
      }
      // if we are showing out of stock as special order and we have a vendor id, let them add
      return !!(this.businessDetails.show_oos_special && this.cartItem.vendor_id);
    },
    addingToCart() {
      return this.$store.state.addingToCart;
    },
    stopAddingQuantity() {
      if((this.addingToCart) || (this.cartItem.num_inventory == 0 && (!this.isSpecialOrderAllowed))) {
        return true;
      } else {
        return false;
      }
    },
    fPackQty() {
      if(this.special && this.cartItem.extra && JSON.parse(this.cartItem.extra).fpack) {
        const qty = parseInt(JSON.parse(this.cartItem.extra).fpack);
        if(qty) {
          return qty;
        }
      }
      return 0;
    },
    isFPack() {
      return this.fPackQty != 0;
    },
    allowCustomQtyOnFpackProducts(){
      // for custom qty on fpac for Papa's Hardware
      if(this.$store.state.currentStore && this.$store.state.currentStore.business_id  && this.$store.state.currentStore.business_id == 5104){
        return true;
      }
      return false;
    }
  },
  mounted() {
    // console.log(this.cartItem);
  },
  methods: {
    updateQty(value, adding = false) {
      if(value >= 0) {
        let old = this.quantity;
        this.quantity = value;
        const status = this.validateQuantity();
        if(status && (this.quantity != this.oldQuantity)) {
          this.addItemToCart(adding);
        } else {
          this.quantity = old;
        }
      }
    },
    validateNumber() {
      if(this.quantity == "") {
        this.quantity = 1;
      }

      const status = this.validateQuantity();
      if(status && (this.quantity != this.oldQuantity)) {
        this.addItemToCart();
      }
    },
    validateQuantity() {
      // In case if their is limit on how many items can be purchased in a single order
      if(this.cartItem.extra && JSON.parse(this.cartItem.extra).max_order_quantity) {
        if ( this.quantity > Number(JSON.parse(this.cartItem.extra).max_order_quantity)) {
          this.errorMssg = "Max allowed limit is " + Number(JSON.parse(this.cartItem.extra).max_order_quantity);
          this.invalidProductQuantity = true;
          this.quantity = this.oldQuantity;
          return false;
        }
      }

      // Check if quantity is greater than product inventory
      if ( (this.quantity > this.cartItem.num_inventory) && (!this.isSpecialOrderAllowed) ) {
        this.errorMssg = "Store has only " + this.cartItem.num_inventory + " in stock.";
        this.invalidProductQuantity = true;
        this.quantity = this.oldQuantity;
        return false;
      }

      // If special & fpack item, qunatity should be in multiple of fpack
      if(this.fPackQty && !this.allowCustomQtyOnFpackProducts) {
        if ( this.quantity  % this.fPackQty != 0 ) {
          this.errorMssg = "Must be ordered in multiple of " + this.fPackQty;
          this.invalidProductQuantity = true;
          this.quantity = this.oldQuantity;
          return false;
        }
      }

      this.errorMssg = "";
      this.invalidProductQuantity = false;
      return true;

    },
    removeItem() {
      this.$store.state.addingToCart = true;
      this.updatingCart = true;

      CartApiService.removeItem(this.cartItem.store_product_id  || this.cartItem.id, Number(this.special)).then(() => {
        removeFromCart(this.cartItem, this.quantity);

        this.quantity = 0;
        this.validateQuantity();
        this.$store.dispatch('fetchCartItemsDetails');
        this.$store.dispatch('fetchShippingQuotes');
        this.$store.state.addingToCart = false;
        this.updatingCart = false;
      });
    },
    addItemToCart() {
      if(this.isAdmin) {
        this.$swal("You can't add products as Admin", '', 'error');
        return;
      }

      const oldQty = this.oldQuantity;
      const newQty = this.quantity;

      this.oldQuantity = this.quantity;
      // still allow value to be sent, but limit the number in the UI
      /*if (this.uiLimit >= 0 && (!this.isSpecialOrderAllowed)) {
        this.quantity = Math.min(this.uiLimit, this.quantity);
      }*/

      if(this.quantity == 0) {
        this.$store.state.addingToCart = true;
        this.updatingCart = true;
        CartApiService.removeItem(this.cartItem.store_product_id  || this.cartItem.id, Number(this.special))
        .then(() => {
          this.$store.dispatch('fetchCartItemsDetails');
          this.$store.dispatch('fetchShippingQuotes');
          this.$store.state.addingToCart = false;
          this.updatingCart = false;

          removeFromCart(this.cartItem, oldQty);
        });
      } else {
        this.$store.state.addingToCart = true;
        this.updatingCart = true;
        CartApiService.addItem(this.cartItem, this.cartItem.store_product_id || this.cartItem.id, this.quantity, Number(this.special))
        .then(res => {
          if (res.status === 200) {
            this.$store.dispatch('fetchCartItemsDetails');
            this.$store.dispatch('fetchShippingQuotes');
          } else {
            this.$swal(res.data.message, '', 'error');
            this.quantity = this.oldQuantity;
          }
          this.$store.state.addingToCart = false;
          this.updatingCart = false;
          if(!this.special) {
            this.updateQuantityAfterAdd();
          }

          if ( oldQty > newQty ) {
            removeFromCart(this.cartItem, Math.abs(newQty - oldQty));
          } else {
            addToCart(this.cartItem, Math.abs(newQty - oldQty));
          }
        })
        .catch(err => {
          this.$swal('Error', Object.keys(err.response.data.errors).map(key => err.response.data.errors[key]).join('<br />'), 'error');
          this.$store.state.addingToCart = false;
          this.quantity = this.oldQuantity;
          this.updatingCart = false;
        });
      }
    },
    updateQuantityAfterAdd() {
      setTimeout(() => {
        if(this.qty != this.quantity) {
          this.quantity = this.qty;
          this.oldQuantity = this.qty;
        }
      }, 1000);
    }
  },
  watch: {
    qty (newQuantity) {
      this.quantity = newQuantity;
      this.oldQuantity = newQuantity;
    }
  }
};
</script>

<style lang="scss" scoped>
  .add-remove {
    max-width: 278px;
  }

  .notification {
    border-radius: 5px;
    padding: 2px 7px;
    background: #fef2f3;
    border: 1px solid rgba(255, 0, 0, 0.1);
    color: red;
    width: 100%;
    margin-bottom: 4px;
    z-index: 2;
    line-height: 1.4;
    font-size: 12px;
    text-align: center;
    max-width: 156px;
  }

  .btn-remove {
    border: none;
    border-radius: 4px;
    padding: 3px 9px 5px;
    margin-left: 8px;
    color: var(--primary);
    background: #F1F5F9;
  }

  .change-quantity {
    position: relative;

    input {
      display: inline-block;
      padding: 0 5px !important;
      height: 30px;
      max-width: 50px;
      border-width: 1px;
      border-radius: 4px;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);

      &:focus {
        border-color: inherit !important;
        box-shadow: none !important;
      }
    }
    .action-bt {
      display: inline-flex;
      height: 30px;
      width: 30px;
      padding: 0;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 22px;
      > img {
        margin: auto;
      }
    }

    .add-cart {
      height: 30px;
      margin-left: 8px;
      font-weight: bold;
      padding: 8px;

      b {
        margin-left: 4px;
      }
    }
  }
</style>
