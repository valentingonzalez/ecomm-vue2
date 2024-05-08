<template>
  <div class="w-100 mb-2">
    <div :id="`${elem}`" class="w-100 mb-2"></div>  
    <div v-if="(cartTotals.toFixed(2) > 30 && cartTotals.toFixed(2) <= 10000) && payLaterEnabled" 
      data-pp-message
      data-pp-placement="cart"
      data-pp-style-layout="flex"
      data-pp-style-ratio="20x1"
      data-pp-style-color="white"
      :data-pp-amount="cartTotals.toFixed(2)">
    </div>
  </div>
</template>

<script>
  import { loadScript } from '@paypal/paypal-js';
  import OrderApiService from '@/api-services/order.service';
  import AuthController from '@/controllers/auth.controller';
  
  export default {
    name: 'PaypalCheckout',
    props: {
      elem: {
        default: "paypalCheckout"
      },      
    },
    data() {
      return {
        loggedInUser: AuthController.checkAuthStatus(),
        orderId: null,
        businessSlug: null,
        customerSlug: null,
        order: null,
        paypalData: null,
        paypalActions: null 
      };
    },
    computed: {
      paypalCheckoutOrder() {
        return this.$store.state.paypalCheckoutOrder;
      },
      cartTotals(){
        return this.$store.state.cartTotals;
      },
      paypalButtonHeight(){
        return window.innerWidth <= 475 ? 33 : 43;
      },
      payLaterEnabled(){
        return this.$store.state.businessDetails && typeof this.$store.state.businessDetails.paypal_paylater_enabled != "undefined" ? (this.$store.state.businessDetails.paypal_paylater_enabled * 1) : 0;        
      },
    },
    mounted() {
      this.orderId = null;
      this.businessSlug = null;
      this.customerSlug = null;
      this.renderPaypalCheckout();
    },
    methods: {
      renderPaypalCheckout(){
        setTimeout(() => {
          document.getElementById(this.elem).innerHTML = "";
          let components = ['buttons'];
          if(this.payLaterEnabled){
            components.push('messages');
          }
          loadScript({ 
            'client-id': this.$store.state.businessDetails.paypal_client_id,
            'intent': (this.$store.state.businessDetails.defer_cc_capture * 1) === 1 ? 'authorize' : 'capture',
            'commit': false,
            'components': components.join(','),
          }).then((paypal) => {
            var FUNDING_SOURCES = [
              paypal.FUNDING.PAYPAL,
            ];
            if(this.cartTotals.toFixed(2) > 30 && this.cartTotals.toFixed(2) <= 10000 && this.payLaterEnabled){
              FUNDING_SOURCES.push(paypal.FUNDING.PAYLATER);
            }
            
            // Loop over each payment method
            FUNDING_SOURCES.forEach((fundingSource) => {
              // Initialize the buttons
              var button = paypal.Buttons({
                fundingSource: fundingSource,
                createOrder: this.createPaypalOrder,
                onApprove: this.onPaypalApprove,
                onClick: this.validateOrderSubmit,
                onError: this.paypalError,
                style: {
                  layout:  'vertical',
                  color:   'blue',
                  shape:   'rect',
                  label:   'pay',
                  height: this.paypalButtonHeight,
                  disableMaxWidth: true
                }
              });
              // Check if the button is eligible
              if (button.isEligible()) {
                // Render the standalone button for that payment method
                button.render('#'+this.elem)
                .catch((error) => {
                    // alert('error in paypal render');
                    console.error("failed to render the PayPal Buttons", error);
                });
              }
            });
          }).catch((e) => {
            // alert('error in paypal');
            console.log(e);
          });
        }, 1000);
      },
      paypalError (err) {
        err = JSON.stringify(err);
        OrderApiService.logPaypalError({err: err});
        console.log(err,'error from paypal');
      },
      billingInfoAdded(){
        let billingAddErrorMsgs = {};
        if(this.$store.state.cartStep == 3 && (this.$parent.activeTab != 0 && !this.$parent.isSameBillingAddress) || (this.$parent.activeTab === 0 && (this.$parent.pickupPaymentOption == 'website' || this.$parent.businessDetails.pickup_payment == 'website'))) {
          Object.keys(this.$parent.billingAddress).forEach(e => {
            let el = document.getElementsByName(e)[0];
            if(el && el.hasAttribute('required') && !this.$parent.billingAddress[e]) {
              let label = e.charAt(0).toUpperCase() + e.slice(1);
              label = label.replaceAll("_"," ");
              billingAddErrorMsgs[e] = [`${label} is required`];
            }
          });
          this.$parent.billingAddressErrors = billingAddErrorMsgs;          
        }
        if(Object.keys(billingAddErrorMsgs).length > 0) {
            this.$parent.isSubmitting = false;
            let all = null;
            all = {...this.$parent.billingAddressErrors };
            let allErrors = Object.keys(all);
            if(allErrors.length > 1){
              allErrors = allErrors.filter(x => {
                  if(x && all[x]){
                      return x;
                  }
              });
            }
            
            if(allErrors.length == 1){
              this.$parent.$swal(all[allErrors[0]][0], '', 'error');
            }else{
              this.$parent.$swal(`Please fill the required Information`, '', 'error');
            }
            return false;
          }
        return true;
      },
      async validateOrderSubmit(data, actions){
        if(this.paypalCheckoutOrder && this.paypalCheckoutOrder.id && this.paypalCheckoutOrder.status == "APPROVED" && this.paypalCheckoutOrder.purchase_units[0].amount.value == this.cartTotals.toFixed(2)){
          // show review step here
          return actions.reject();
        }else{
          return actions.resolve();
        }        
      },
      async createPaypalOrder(data, actions) {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: this.cartTotals.toFixed(2),
                  breakdown: {
                      item_total: {value: this.cartTotals.toFixed(2), currency_code: 'USD'}
                  }
                },
                description: "Order from " + this.$store.state.currentStore.name
                // items: this.cartItems
              }
            ],
          });
      },
      orderUpdate(){
        if(this.paypalCheckoutOrder && this.paypalCheckoutOrder.status == "APPROVED"){
          let _self = this;        
          let updatedOrder = _self.$store.state.paypalCheckoutOrder;
          updatedOrder.purchase_units[0].amount = {
              currency_code: 'USD',
              value: _self.cartTotals.toFixed(2),
              breakdown: {
                  item_total: {value: _self.cartTotals.toFixed(2), currency_code: 'USD'}
              }              
          };
          _self.$store.commit('setPaypalCheckoutOrder', updatedOrder);
          return this.paypalActions.order.patch([{
            op: "replace", 
            path: `/purchase_units/@reference_id=='${this.$store.state.paypalCheckoutOrder.purchase_units[0].reference_id}'/amount`, 
            value:  updatedOrder.purchase_units[0].amount
          }]).catch(error => {
            // discard paypal checkout if update order fails
            _self.$store.commit('setPaypalCheckoutOrder', null);            
          });
        }
      },
      onPaypalApprove(data, actions) {
        this.$parent.isGuestCheckout = true;
        let _self = this;        
        return actions.order.get(data.orderID).then(function(order) {
          // Display order details to customer for confirmation
          _self.$store.commit('setPaypalCheckoutOrder', order);
          if(!_self.$parent.memberInfo.first_name)
            _self.$parent.memberInfo.first_name = order.payer.name.given_name;
          if(!_self.$parent.memberInfo.last_name)
            _self.$parent.memberInfo.last_name = order.payer.name.surname;
          if(!_self.$parent.memberInfo.email)
            _self.$parent.memberInfo.email = order.payer.email_address;
          var customerAddress = order.purchase_units[0].shipping.address;
          if(!_self.$parent.addressModel.address)
            _self.$parent.addressModel.address = customerAddress.address_line_1;
          if(!_self.$parent.billingAddress.address)
            _self.$parent.billingAddress.address = customerAddress.address_line_1;

          if(!_self.$parent.addressModel.address2 && customerAddress.address_line_2)
            _self.$parent.addressModel.address2 = customerAddress.address_line_2;
          if(!_self.$parent.billingAddress.address2 && customerAddress.address_line_2)
            _self.$parent.billingAddress.address2 = customerAddress.address_line_2;

          if(!_self.$parent.addressModel.postal_code)
            _self.$parent.addressModel.postal_code = customerAddress.postal_code;
          if(!_self.$parent.billingAddress.postal_code)
            _self.$parent.billingAddress.postal_code = customerAddress.postal_code;

          if(!_self.$parent.addressModel.city)
            _self.$parent.addressModel.city = customerAddress.admin_area_2;
          if(!_self.$parent.billingAddress.city)
            _self.$parent.billingAddress.city = customerAddress.admin_area_2;

          if(!_self.$parent.addressModel.state)
            _self.$parent.addressModel.state = customerAddress.admin_area_1;
          if(!_self.$parent.billingAddress.state)
            _self.$parent.billingAddress.state = customerAddress.admin_area_1;

          if(!_self.$parent.addressModel.country)
            _self.$parent.addressModel.country = "USA"; // for now
          if(!_self.$parent.billingAddress.country)
            _self.$parent.billingAddress.country = "USA"; // for now

          _self.$parent.pickupPaymentOption = "website"; // bcs payment is done from paypal
          _self.paypalData = data;
          _self.paypalActions = actions;
          if(_self.$store.state.cartStep == 3){
            _self.$parent.completeStep(3);  
          }else{
            _self.$store.commit('setCartStep', 2);  
          }
        });        
      }
    },
    watch: {
      cartTotals: {
        handler: function (val, oldVal) {
          if(oldVal && val && oldVal != val){
            this.renderPaypalCheckout();
          }
        },
        deep: true
      }
    }
  };

</script>


