<template>
  <div class="add-remove">
    <div v-if="invalidProductQuantity" class="notification small">
      {{errorMssg}}
    </div>
    <div class="change-quantity d-flex">
      <button type="button" class="btn action-bt btn-primary" :disabled="quantity <= 0 || stopAddingQuantity" @click="updateQty(Number(quantity) - subQty)">-</button>
      <input v-model="quantity" :disabled="stopAddingQuantity || isFPack" type="number" min="0" max="9999" maxlength="4" inputmode="numeric" pattern="[0-9]*" oninput="validity.valid||(value='');" class="form-control bg-white mx-1 text-center font-weight-bold" @keyup="validateQuantity" @blur="validateNumber" aria-label="Number of quantity" />
      <button type="button" class="btn action-bt btn-primary" :disabled="stopAddingQuantity" @click="updateQty(Number(quantity) + addQty)">+</button>

      <button :disabled="invalidProductQuantity || quantity == 0" class="btn btn-primary add-cart" @click="addItemToCart">
        <div v-if="updatingCart" class="spinner-border spinner-border-sm mr-2"></div>
        <div v-else class="mr-2">
          <i class="fa fa-shopping-cart fa-lg"></i>
        </div>
        Add<b class="text-nowrap">to cart</b>
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
  name: 'ProductChangeQuantity',
  props: {
    qty: {
      type: Number,
      default: 0
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
    fPackQty: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      invalidProductQuantity: false,
      errorMssg: '',
      quantity: 1,
      updatingCart: false,
    };
  },
  computed: {
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
    totalItems() {
      return Number(this.quantity) + Number(this.qty);
    },
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
    isFPack() {
      return this.fPackQty != 0;
    },
    allowCustomQtyOnFpackProducts(){
      // for custom qty on fpac for Papa's Hardware
      if(this.$store.state.currentStore && this.$store.state.currentStore.business_id  && this.$store.state.currentStore.business_id == 5104){
        return true;
      }
      return false;
    },
    cartSettings() {
      return this.$store.state.settings && this.$store.state.settings.cart ? this.$store.state.settings.cart : null;
    },
    useLegacyToastMsg(){
      if(this.cartSettings && this.cartSettings.useLegacyToastMsg){
        return true;
      }
      return false;
    }    
  },
  mounted() {
    this.setInitialQuantity();
  },
  methods: {
    updateQty(value) {
      if(value >= 0) {
        this.quantity = value;
        this.validateQuantity();
      }
    },
    validateNumber() {
      if(this.quantity == "") {
        this.quantity = 1;
      }
      this.validateQuantity();
    },
    setInitialQuantity() {
      this.quantity = 1;
      if(this.fPackQty) {
        this.quantity = this.fPackQty;
      }
    },
    validateQuantity() {
      // In case if their is limit on how many items can be purchased in a single order
      if(this.cartItem.extra && JSON.parse(this.cartItem.extra).max_order_quantity) {
        if ( this.totalItems > Number(JSON.parse(this.cartItem.extra).max_order_quantity)) {
          this.errorMssg = "Max allowed limit is " + Number(JSON.parse(this.cartItem.extra).max_order_quantity) + " , Please reduce quantity";
          this.invalidProductQuantity = true;
          return false;
        }
      }

      // Check if quantity is greater than product inventory
      if ( (this.totalItems > this.cartItem.num_inventory) && (!this.isSpecialOrderAllowed) ) {
        this.errorMssg = "Store has only " + this.cartItem.num_inventory + " in stock. Please reduce quantity";
        this.invalidProductQuantity = true;
        return false;
      }

      // If special & fpack item, qunatity should be in multiple of fpack
      if(this.fPackQty && !this.allowCustomQtyOnFpackProducts) {
        if ( this.totalItems  % this.fPackQty != 0 ) {
          this.errorMssg = "Must be ordered in multiple of " + this.fPackQty;
          this.invalidProductQuantity = true;
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

      CartApiService.removeItem(this.cartItem.store_product_id  || this.cartItem.id, Number(this.special))
      .then(() => {
        removeFromCart(this.cartItem, this.quantity);

        this.setInitialQuantity();
        this.$store.dispatch('fetchCartItemsDetails');
        this.$store.state.addingToCart = false;
        this.updatingCart = false;
        this.updateTotalItems();
      });
    },
    addItemToCart() {
      if(this.isAdmin) {
        this.$swal("You can't add products as Admin", '', 'error');
        return;
      }
      if(this.useLegacyToastMsg) {
        this.$swal({
          customClass: {
            container: 'add-to-cart-toast-container',
            popup: 'add-to-cart-toast',
          },
          toast: true,
          position: 'top',
          title: this.cartItem.title,
          html: `<img src="${this.cartItem.image_url || '/images/default-img.svg'}"><br>Product has been added to cart <a href="/cart" class="btn btn-outline-primary mt-3 mb-2">Go to checkout</a>`,
          showConfirmButton: false,
          timer: 5000
        });
      } else {
        this.$root.$children[0].$refs.CartSidebar.show();
      }

      if (this.totalItems == 0) {
        this.$store.state.addingToCart = true;
        this.updatingCart = true;
        CartApiService.removeItem(this.cartItem.store_product_id  || this.cartItem.id, Number(this.special))
        .then(() => {
          this.$store.dispatch('fetchCartItemsDetails');
          this.$store.state.addingToCart = false;
          this.updatingCart = false;
          this.setInitialQuantity();
          this.updateTotalItems();
        });
      } else {
        this.$store.state.addingToCart = true;
        this.updatingCart = true;
        CartApiService.addItem(this.cartItem, this.cartItem.store_product_id || this.cartItem.id, this.totalItems, Number(this.special))
        .then(res => {
          if (res.status === 200) {
            this.$store.dispatch('fetchCartItemsDetails');
            addToCart(this.cartItem, this.quantity);
          } else {
            this.$swal(res.data.message, '', 'error');
          }
          this.$store.state.addingToCart = false;
          this.updatingCart = false;
          this.setInitialQuantity();
          this.updateTotalItems();
        })
        .catch(err => {
          this.$swal('Error', Object.keys(err.response.data.errors).map(key => err.response.data.errors[key]).join('<br />'), 'error');
          this.$store.state.addingToCart = false;
          this.updatingCart = false;
        });
      }
    },
    updateTotalItems() {
      setTimeout(() => {
        this.validateQuantity();
      }, 1000);
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
  }

  .btn-remove {
    border: none;
    border-radius: 4px;
    padding: 3px 9px;
    margin-left: 8px;
    color: var(--primary);
    background: #f1f0f0;
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
