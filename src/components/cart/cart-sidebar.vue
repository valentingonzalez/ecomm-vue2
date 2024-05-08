<template>
    <div class="cart-s" :class="{'visible': visible}">
        <div class="d-flex align-items-stretch justify-content-end h-100">       
            <div class="sidebar d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center my-4 px-4 px-md-5">
                    <h6 class="card-title font-weight-bold text-uppercase mb-0">Added to Cart</h6>
                    <button class="bg-transparent border-0 p-0" @click="hide">
                        <svg width="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="Icon-sc-1vqff2m-0 bTVdEh" focusable="false" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.692 17.621a.75.75 0 01-1.061 0L6.378 7.368a.75.75 0 011.06-1.06L17.692 16.56a.75.75 0 010 1.061z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M6.377 17.692a.75.75 0 010-1.061L16.63 6.378a.75.75 0 111.06 1.06L7.439 17.692a.75.75 0 01-1.061 0z"></path></svg>
                    </button>
                </div>
                <div v-if="fetchingCartItems" class="d-flex align-items-center justify-content-center my-5" style="min-height: 40vh;">
                    <div class="spinner-border"></div>
                </div>
                <div class="d-flex flex-column justify-content-between h-100 overflow-auto mt-0" v-else >
                    <CartItems 
                        :sideBarView="true" 
                        :hideItems="false" 
                        :hideTabs="true" 
                        :title="''" 
                        ref="cartItemNormal" 
                        v-if="cart && cart.parcels && cart.parcels.length" 
                        :items="cart.parcels"  />  
                    
                    <div class="px-4 px-md-5 pt-3 pb-4">
                        <div class="mb-3">
                            <h6 class="card-title font-weight-bold text-uppercase mb-1">Order Summary</h6>
                            <cart-totals ref="cartTotals" />
                        </div> 
                        <router-link to="/cart" class="btn btn-primary text-uppercase text-left d-flex align-items-center justify-content-center  mx-auto mx-sm-0 pull-right w-100">
                            <span class="mr-2">Checkout</span>
                            <img src="/icons/button-arrow.svg">
                        </router-link>
                        <button class="btn btn-secondary text-uppercase text-left d-flex align-items-center justify-content-center  mx-auto mx-sm-0 pull-right w-100 mt-2" @click="hide">
                            <span>Continue Shopping</span>
                        </button>
                    </div>
                </div>                 
            </div>
        </div>
      <div class="overlay" @click="hide"></div>
    </div>
  </template>
  
  <script>
  import CartItems from '@/components/cart/cart-items.vue';
  
    export default {
      name: 'CartSidebar',
      components: {
        CartItems
      },
      data() {
        return {
          visible: false,
          windowHeight: window.innerHeight,
        };
      },
      computed: {
        cart() {
            return this.$store.state.cart;
        },
        fetchingCartItems() {
            return this.$store.state.fetchingCartItems;
        },
        cartItemsAdded() {
            return this.cart && this.cart.parcels ? this.cart.parcels.length : 0; 
        }
      },
      mounted() {
        window.addEventListener('resize', () => {
          this.windowHeight = window.innerHeight;
        });
      },
      methods: {
        show() {
          if (this.windowHeight >= 550) {
            this.loading = false;
            this.visible = true;
            document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
          }  
        },
        hide() {
          this.visible = false;
          document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
        }
      },
      watch: {
        cartItemsAdded(newValue) {
            if (newValue === 0) {
                this.hide();
            }
        },
        windowHeight(newValue) {
            if (newValue < 550) {
                this.hide();
            }
        },
      }
    };
  </script>
 
 
<style scoped lang="scss">
.cart-s {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1050;
  pointer-events: none;
  .overlay {
    opacity: 0;
    z-index: -1;
    background-color: #000;
    transition: opacity .3s;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: fixed;
  }
  .sidebar {
    position: relative;
    width: 100%;
    max-width: 640px;
    right: -100%;
    background: #fff;
    transition: right .4s;
    z-index: 2;
  }
  &.visible {
    pointer-events: all;
    .overlay {
    opacity: 0.4;
      z-index: 1;
    }
    .sidebar {
      right: 0;
    }
  }
}
@media (max-width: 575px) {
  .cart-s {
    .sidebar {
      .title {
        font-size: 20px;
      }
    }
  }
}
</style>
