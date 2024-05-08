<template>
  <div class="cart-totals">
    <div v-if="settings.cart.taxDisclaimer" v-html="settings.cart.taxDisclaimer" class="small" />

    <div class="text-right flex-grow-1 d-flex flex-column" v-if="cart && totalItems > 0">
      <!-- (HEAD)
      <div class="mt-2 d-flex w-100" v-if="loggedInUser && cart.coupons">
        <span class="n">{{ cart.coupons }}</span>
      </div>
      <div class="mt-2 d-flex w-100 align-items-between justify-content-between total-item-line">
        <div class="label">Subtotal:</div>         
        <div>
          <span v-if="settings.products.currencyPrefix">{{settings.products.currencyPrefix}}</span><span class="n">${{ cart.subtotal | productPrice }}</span>
        </div>
      </div>
      <div class="mt-2 d-flex w-100 align-items-between justify-content-between total-item-line" v-if="cart.additional_fee && cart.additional_fee != '0.00'"> 
      -->
      <div class="mt-2" v-if="cart.coupons">Redeemed Coupons: <span class="n">{{ cart.coupons }}</span></div>
      <div class="mt-2 d-flex w-100 align-items-between justify-content-between total-item-line">        
        <div class="">Subtotal:</div>         
        <div>
          <span v-if="settings.products.currencyPrefix">{{settings.products.currencyPrefix}}</span><span class="n">${{ subtotal | productPrice }}</span>
        </div>
      </div>
      <div class="mt-2" v-if="anyAdditionalFees && !mergeAdditionalFeeWithSubtotal">
        <div class="cursor-pointer font-weight-bold" @click="showAdditionalFees = !showAdditionalFees">
          Additional Fees <i :class="{'rotate': showAdditionalFees}" class="fa fa-angle-down mx-1 transition"></i>
          ${{ cart.additional_fee | productPrice }}
        </div>
        <template v-if="showAdditionalFees">
          <div v-for="(fee, i) in additionalFees" :key="`fee-${i}`" class="my-1">
            {{ fee.message }}: ${{ fee.price_impact | productPrice }}
          </div>
        </template>
      </div>
      <div class="mt-2 d-flex w-100 align-items-between justify-content-between total-item-line" v-if="cart.special_order_fee && cart.special_order_fee != '0.00'"> 
        <div class="label">{{ specialOrderFeeText }}: </div>         
        <div>
          <span v-if="settings.products.currencyPrefix">{{settings.products.currencyPrefix}}</span><span class="n">${{ cart.special_order_fee | productPrice }}</span>
        </div>
      </div>
      <div class="mt-2 d-flex w-100 align-items-between justify-content-between total-item-line" v-if="!settings.cart.hideTax && cart.tax">Tax: <span v-if="settings.products.currencyPrefix">{{settings.products.currencyPrefix}}</span><span class="n">${{ cart.tax | productPrice }}</span></div>
        <div v-for="(taxRow, taxRowI) in otherTaxRows" :key="`taxRow-${taxRowI}`" class="mt-2">
          <div class="label">{{ taxRow.label }}:</div>         
          <div>
            <span v-if="settings.products.currencyPrefix">{{settings.products.currencyPrefix}}</span><span class="n">${{ taxRow.amount | productPrice }}</span>
          </div>         
        </div>
      <div class="mt-2 d-flex w-100 align-items-between justify-content-between total-item-line" v-if="typeName === 'shipping' && (activeShippingCarriers.length && shippingFee > 0 || !activeShippingCarriers.length && cart.shipping_fee > 0)">
        <div class="label">Shipping & Handling:</div>         
        <div>
          <span v-if="settings.products.currencyPrefix">
          {{settings.products.currencyPrefix}}</span>
          <span class="n">
            ${{ shippingFee | productPrice }}
          </span>
        </div>                 
      </div>
      <div class="mt-2 d-flex w-100 align-items-between justify-content-between total-item-line" v-if="typeName === 'shipping' && cart.discount_shipping && cart.discount_shipping != 0.00">
        <div class="label">Shipping Discount:</div>         
        <div>
          <span v-if="settings.products.currencyPrefix">{{settings.products.currencyPrefix}}</span><span class="n">${{ cart.discount_shipping | productPrice }}</span>
        </div>                 
      </div>
      <div v-if="typeName === 'delivery'"> <!-- removed && cart.delivery_fee check, wasn't showing this row -->
        <div class="mt-2 d-flex w-100 align-items-between justify-content-between total-item-line" v-if="step > 1 && (!deliveryFee || deliveryFee.error)">
          <div class="label">Delivery Charge:</div>         
          <div>
            <a v-if="deliveryLocations && deliveryLocations.length" href="#" @click.prevent="$refs.deliveryLocationsModal.show()">Add address to calculate</a>
          </div>                   
        </div>
        <div class="mt-2 d-flex w-100 align-items-between justify-content-between total-item-line" v-else-if="deliveryFee && !isNaN(deliveryFee)">
          <div class="label">Delivery Charge: <span v-if="settings.products.currencyPrefix">{{settings.products.currencyPrefix}}</span></div>         
          <div>
            <span v-if="deliveryFee === 0" class="n">FREE</span>
            <span v-else class="n">${{ deliveryFee | productPrice }}</span>
          </div>                   
        </div>
      </div>
      <div class="mt-2 d-flex w-100 align-items-between justify-content-between total-item-line" v-if="typeName === 'delivery' && cart.discount_delivery && cart.discount_delivery != 0.00">
          <div class="label">Delivery Discount:</div>         
          <div>
            <span v-if="settings.products.currencyPrefix">{{settings.products.currencyPrefix}}</span><span class="n">${{ cart.discount_delivery | productPrice }}</span>
          </div>
      </div>
      <div class="mt-2  d-flex w-100 align-items-between justify-content-between total-item-line" v-if="cart.discount && cart.discount != 0.00">
          <div class="label">{{ cart.discount_label || 'Discount' }}: </div>         
          <div>
            <span class="n">${{ cart.discount | productPrice }}</span>
          </div>
      </div>
      <div class="mt-2 d-flex w-100 align-items-between justify-content-between total-price">
        <div>Total:</div>         
        <div>
          <span v-if="settings.products.currencyPrefix">{{settings.products.currencyPrefix}}</span>
          <span class="n">
            ${{totals | productPrice }}
          </span>      
        </div>
      </div>
    </div>

    <b-modal hide-footer ref="deliveryLocationsModal" title="Delivery Details" v-if="deliveryLocations">
       <b-table-lite outlined hover @row-clicked="handleRowClicked" :tbody-tr-class="rowClass" :items="deliveryLocations.map(location => { return { deliveryZipCodes: location.code, charge: !location.fee ? 'FREE' : `$${location.fee}` } })"></b-table-lite>
    </b-modal>
  </div>
</template>

<script>
  import AuthController from '@/controllers/auth.controller';

  export default {
    name: 'cartTotals',
    props: ['typeName', 'zipcode', 'taxesCalculated'],
    data() {
      return {
        loggedInUser: AuthController.checkAuthStatus(),
        showAdditionalFees: false,
        useCustomShipping: false
      };
    },
    computed: {
      step(){
        return this.$store.state.cartStep;
      },
      cart() {
        return this.$store.state.cart;
      },
      settings() {
        return this.$store.state.settings;
      },
      deliveryLocations() {
        return this.$store.state.businessDetails.delivery_locations;
      },
      mergeAdditionalFeeWithSubtotal() {
        return this.settings.cart.mergeAdditionalFeeWithSubtotal && this.settings.cart.mergeAdditionalFeeWithSubtotal === true || false;
      },
      anyAdditionalFees() {
        return this.cart.additional_fee && this.cart.additional_fee != '0.00';
      },
      subtotal() {
        return this.mergeAdditionalFeeWithSubtotal && this.anyAdditionalFees ? Number(this.cart.subtotal) + Number(this.cart.additional_fee) : this.cart.subtotal;
      },
      deliveryFee() {
        if(this.settings.cart.hideDeliveryZipcode)
          return this.cart.delivery_fee;
        if(this.zipcode) {
          if(this.deliveryLocations.length) {
            let foundLoc = this.deliveryLocations.find(e => e.code == this.zipcode);
            if (foundLoc) {
              // if subtotal is >= threshold, use the threshold fee instead
              if ( foundLoc.minThreshold && foundLoc.thresholdFee ) {
                let subtotal = Number(this.cart.subtotal);
                if ( subtotal >= foundLoc.minThreshold ) {
                  return foundLoc.thresholdFee;
                }
              }
              return foundLoc.fee;
            } else {
              return { error: 'invalid-zipcode' };
            }
          } else {
            return this.cart.delivery_fee;
          }
        }
        return { error: 'no-zipcode' };
      },
      additionalFees() {
        return this.cart.additional_fee_details;
      },
      totals() {
        let tax = this.taxesCalculated ? Number(this.cart.tax) : 0;
        // let tax = this.loggedInUser ? (this.taxesCalculated ? Number(this.cart.tax) : 0) : 0;
        let subtotal = Number(this.cart.subtotal) + Number(this.cart.additional_fee) - Number(this.cart.discount);
        if ( this.cart.special_order_fee && this.cart.special_order_fee !== '0.00' ) {
          subtotal += Number(this.cart.special_order_fee);
        }
        if(this.typeName === 'pickup') {
          return subtotal + tax;
        }
        if(this.typeName === 'shipping') {
          return subtotal + tax + this.shippingFee - Number(this.cart.discount_shipping);
        }
        if(this.typeName === 'delivery') {
          return subtotal + tax + (Number(this.deliveryFee) || 0) - Number(this.cart.discount_delivery);
        }
        return subtotal;
      },
      otherTaxRows() {
        return this.cart.otherTaxRows || [];
      },
      totalItems() {
        return this.$store.state.cartItemCount;
      },
      specialOrderFeeText() {
        return this.settings.text.specialOrderFee || 'Special Order';
      },
      activeShippingCarriers() {
        return this.$store.state.activeShippingCarriers;
      },
      shippingFee() {
        if (this.activeShippingCarriers.length) {
          return parseFloat(this.$store.state.cartSelectedShippingQuote ? this.$store.state.cartSelectedShippingQuote.handling_fee : 0);
        }
        return this.cart.shipping_fee;
      }
    },
    mounted() {
      this.$store.commit('setCartTotals', this.totals);
    },
    watch: {
      totals (newVal) {
        this.$store.commit('setCartTotals', newVal);
      }
    },
    methods: {
      handleRowClicked(item, index, event) {
        // Access the row-clicked event here
        this.$emit('setDeliveryZipCode', item.deliveryZipCodes);
        this.$emit('checkZipcode');
        this.$refs.deliveryLocationsModal.hide();
      },
      rowClass(item, type) {
        if (!item || type !== 'row') return;
        if (type === 'row') {
          let rowClass = 'cursor-pointer';
          if (this.$parent.addressModel.delivery_postal_code == item.deliveryZipCodes) {
            rowClass = rowClass+' table-success';
          };
          return rowClass;
        };
      }
    }
  };

</script>

<style lang="scss" scoped>
  .total-item-line{
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    margin: 7px 0;
    .label{
      color: #64748B;
    }
  }
  .total-price {
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    border-top: 1px solid #E2E8F0;
    padding: 15px 0 0;
  }
  .row-cursor-pointer{
    cursor: pointer;
  }
</style>
