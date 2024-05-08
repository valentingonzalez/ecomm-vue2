<template>   
    <div class="row w-100 justify-content-center mx-0">
      <div class="col-12 px-0 px-md-3">
        <div class="">
          <div v-if="showTitle == true" class="card-header">
            Payment
          </div> 
          <div class="" v-if="!loading">                  
            <div :class="{'mb-3 mt-2': customerCards.length}">
                  <div class="d-flex align-items-center justify-content-end" :class="{'justify-content-between': customerCards.length}">
                    <h6 v-if="customerCards.length">Select Card</h6>
                    <div class="d-flex card-title font-weight-bold mb-0">
                      <button :disabled="loading" v-if="customerCards.length && !addNewCard && saveCardEnabled"
                              type="button" @click="addNewCard=true;clearStripe()" class="btn btn-secondary btn-xs text-nowrap float-right">
                        Add Card
                      </button>
                    </div>
                  </div>
                  <template v-if="customerCards.length" >
                    <div v-for="(customerCard, index) in customerCards" :class="{'disabled' : removingCard == customerCard}" :key="index" class="d-flex my-3">
                      <h6 class="my-0 flex-grow-1">
                        <i class="fa" :class="customerCard.brand | cardType" ></i>
                        <span style="margin-left: 20px">
                          **** {{ customerCard.lastfour }}
                        </span>
                        <span style="margin-left: 40px">
                          exp {{ customerCard.exp_month }}/{{customerCard.exp_year}}
                        </span>
                      </h6>

                      <template v-if="removingCard != customerCard">
                        <button v-if="selectedCard == customerCard.id" type="button" disabled class="btn btn-default btn-xs mr-1">
                          <i class="fa fa-check mr-2"></i> Selected
                        </button>
                        <button v-else  @click="selectedCard = customerCard.id" type="button" class="btn btn-primary btn-xs mr-1">
                          Select
                        </button>
                      </template>
                      <div class="text-danger" v-else>
                        <span class="spinner-border spinner-border-sm mr-2"></span>
                        Removing card
                      </div>
                      <button @click="removeCard(customerCard)" v-if="removingCard != customerCard" type="button" class="btn btn-danger btn-xs pull-right">
                        <i class="fa fa-times"></i>
                      </button>
                    </div>
                  </template>
                  
                </div>
                <!-- <StripeElement v-if="stripeKey && (addNewCard || customerCards.length === 0)" ref="stElement"
                              class="stElement flex-grow-1" :class="{'border p-3' : customerCards.length}" type="card" :stripe="stripeKey"
                              :elOptions="elOptions" :elsOptions="elsOptions" @change="stripeChanged($event)">
                  <template slot-scope="slotProps">
                    <button v-if="saveCardEnabled" class="flex-grow-0 btn btn-xs btn-success ml-1"
                            :disabled="!cdcompleted || addingCard" @click="addCard(slotProps)">
                      <div class="spinner-border spinner-border-sm mr-2" v-if="addingCard" />
                      {{ addButtonText }}
                    </button>
                  </template>
                </StripeElement> -->

                <div v-show="stripeKey && (addNewCard || customerCards.length === 0)">
                  <div class="row">                    
                    <div class="col-12 mb-2">
                      <label>Credit card number</label>
                      <div class="form-control h-43 py-13" id="card-number"></div>
                    </div>
                    <div class="col-6 mb-2">
                      <label>Expiration</label>
                      <div class="form-control h-43 py-13" id="card-expiry"></div>
                    </div> 
                    <div class="col-6 mb-2">
                      <label v-b-tooltip.hover title="It is a three- or four-digit number printed on the back of your credit or debit card. It is used as a security measure to verify your identity when making online purchases.">
                        Security code
                        <svg class="mb-1" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                          <path d="M14.7084 8.5013C14.7084 12.2062 11.7049 15.2096 8.00002 15.2096C4.29511 15.2096 1.29169 12.2062 1.29169 8.5013C1.29169 4.79639 4.29511 1.79297 8.00002 1.79297C11.7049 1.79297 14.7084 4.79639 14.7084 8.5013Z" stroke="#737373" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="square"/>
                          <path d="M8 5.16797V9.16797" stroke="#737373" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="square"/>
                          <path d="M8.00004 12.5013C8.36823 12.5013 8.66671 12.2028 8.66671 11.8346C8.66671 11.4664 8.36823 11.168 8.00004 11.168C7.63185 11.168 7.33337 11.4664 7.33337 11.8346C7.33337 12.2028 7.63185 12.5013 8.00004 12.5013Z" fill="#737373"/>
                        </svg>
                      </label>
                      <div class="form-control h-43 py-13" id="card-cvc"></div>
                    </div>
                    <div class="col-12 mb-2">
                      <label>Name on card</label>
                      <input type="text" v-model="nameOnCard" @input="stripeChanged" class="form-control" />
                    </div>  
                    <div class="col-12">
                      <button v-if="saveCardEnabled" class="flex-grow-0 btn btn-xs btn-success ml-1"
                            :disabled="!cdcompleted || addingCard" @click="addCard()">
                        <div class="spinner-border spinner-border-sm mr-2" v-if="addingCard" />
                        {{ addButtonText }}
                      </button>
                    </div>                     
                  </div>
                </div>

                <div v-if="isAuthorizeNetSelected">
                  <button type="button"
                    :disabled="isAuthorizeNetPaymentDisabled"
                    class="flex-grow-0 btn w-100 btn-success ml-1 AcceptUI"
                    :data-billingAddressOptions="billingAddressOptions"
                    :data-apiLoginID="$store.state.authorize_net_login_id"
                    :data-clientKey="$store.state.authorize_net_client_key"
                    data-acceptUIFormBtnTxt="Submit"
                    data-acceptUIFormHeaderTxt="Card Information"
                    data-responseHandler="authorizeResponseHandler">
                    Pay Now
                  </button>
                  <div class="alert alert-primary text-center my-2" v-if="authorizeNetDataToSubmit">
                    Card Details Added, click <strong>Pay Now</strong> if you need to change
                  </div>
                </div>

                <div ref="card_errors" class="card-error text-center" role="alert" v-if="cardError.length > 0">
                  {{ cardError }}
                </div>
          </div>
          <div class="d-flex align-items-center justify-content-center w-100 py-3" v-else>
            <div class="spinner-border" />
          </div>
      </div>
    </div>
    
  </div>
</template>

<script>

  import UserApiService from '@/api-services/user.service';
  import AuthController from '@/controllers/auth.controller';
  import { createAdyenComponent } from '@/plugins/payment/adyen';
  import { createAuthorizeNetComponent } from '@/plugins/payment/authorizenet';
  import { submitPlugnPayForm } from "@/plugins/payment/plugnpay";
  import { submitFiservForm } from "@/plugins/payment/fiserv";
  import OrderApiService from '@/api-services/order.service';
  // import { StripeElement } from "vue-stripe-better-elements";

  let adyenComponent = null;
  let authorizeNetComponent = null;
  
  export default {
    name: 'PaymentModule',
    props: {
      customInfo: {
        default: {}
      },
      memberInfo: {
        default: {}
      },
      addressModel: {
        default: {}
      },
      isPaymentVisible: {
        default: false
      },
      isGuestCheckout: {
        default: true
      },
      typeName: {
        default: ''
      },
      showTitle: {
        type:Boolean,
        default: true
      },
      showCardProviders: {
        default: false
      },
      isSameBillingAddress: {
        type:Boolean,
        default: true
      },
      billingAddress: {
        default: {}
      },
      optInForRegister: {
        default: false
      }
    },
    components: {
    },
    data() {
      return {
        stripeKey: this.$store.state.stripe_publishable,
        loggedInUser: AuthController.checkAuthStatus(),
        customerCards: [],
        selectedCard: null,
        removingCard: false,
        addNewCard: null,
        saveCardForLater: true,
        cardError: '',
        adyenDataToSubmit: null,
        authorizeNetDataToSubmit: null,
        cdcompleted: false,
        addingCard: false,
        loading: true,
        noTrack: 0,
        elsOptions: {
          locale: 'en'
        },
        elOptions: {
          style: {
            base: {
              iconColor: this.$store.state.settings.colors.primary,
              color: this.$store.state.settings.colors.text || '#000',
              fontWeight: '500',
              fontFamily: 'Helvetica',
              fontSize: '14px',
              fontSmoothing: 'antialiased',
              ':-webkit-autofill': {
                color: '#666',
              },
              '::placeholder': {
                color: '#666',
              },
            },
            invalid: {
              iconColor: '#ff0000',
              color: '#ff0000',
            },
          },
        },
        cardNumber: null,
        cardExpiry: null,
        cardCvc: null,
        cardNumberComplete: false,
        cardExpiryComplete: false,
        cardCvcComplete: false,
        nameOnCard: ''
      };
    },
    computed: {
      saveCardEnabled() {
        return this.loggedInUser ? !this.$store.state.stripe_disable_save : false;
      },
      contractorNumber() {
        return this.$store.state.cart.ar_account_number || '';
      },
      addButtonText() {
        if ( this.addNewCard ) {
          return this.addingCard ? 'Adding' : 'Add';
        } else {
          return this.addingCard ? 'Saving' : 'Save';
        }
      },
      paymentProvider() {
        return this.$store.state.payment_provider;
      },
      isAuthorizeNetSelected() {
        return this.paymentProvider == "authorize_net";
      },
      isAuthorizeNetPaymentDisabled() {
        return this.loading;
      },
      billingAddressOptions() {
        return JSON.stringify({
          "show" : this.$store.state.authorize_net_show_billing_address,
          "required" : false
        });
      },
      stripeElements () {
        return this.$stripe.elements();
      }
    },
    filters: {
      cardType(type) {
        return `fa-cc-${type}`;
      }
    },
    async mounted() {
      this.renderStripe();      
      let prepayData = null;
      if(this.$store.state.payment_preparable) {
        try {
          const ppRes = await OrderApiService.prePayment();
          prepayData = ppRes.data;
        } catch(e) {
          console.error(e);
        }
      }
      if(this.$store.state.payment_provider === 'adyen')
        if(adyenComponent === null && prepayData !== null)
          adyenComponent = createAdyenComponent(this, prepayData);

      // Load Customer Existing Cards
      if(this.loggedInUser) {
        UserApiService.getCards().then((res) => {
          this.loading = false;
          if(res.status === 200) {
            this.customerCards = res.data.data;
            if(this.customerCards.length) {
              // Setting the first card as default
              this.selectedCard = this.customerCards[0].id;
            }
          }
        }).catch((err) => {
          console.log(err);
        });
      } else {
        this.loading = false;
      }
    },
    beforeDestroy () {
      this.nameOnCard = '';
      if(this.cardNumber)
        this.cardNumber.destroy();
      if(this.cardExpiry)
        this.cardExpiry.destroy();
      if(this.cardCvc)
        this.cardCvc.destroy();
    },
    watch: {
      loading(val) {
        if(val == false && this.$store.state.payment_provider === 'authorize_net') {
          setTimeout(() => {
            authorizeNetComponent = createAuthorizeNetComponent(this);
          }, 1000);
        }
      },
      selectedCard(id){
        let card = this.customerCards.find(x => x.id == id);
        this.$emit('selectedCard', card);
      },
      nameOnCard(){
        this.cardError = '';
      }
    },
    methods: {      
      // stripeChanged(e) {
      //   this.cdcompleted = e.complete;
      //   if ( e.complete ) {
      //     this.cardError = '';
      //   }
      // },
      // payByCard(slotProps) {
      //   slotProps.elements.createToken().then(console.log).catch(console.error);
      // },
      stripeChanged() {
        this.cdcompleted = this.cardNumberComplete && this.cardExpiryComplete && this.cardCvcComplete && this.nameOnCard;
        if ( this.cdcompleted ) {
          this.cardError = '';
        }
      },
      renderStripe(){
        if(this.stripeKey && (this.addNewCard || this.customerCards.length === 0)) {
          this.loading = false;
          // Style Object documentation here: https://stripe.com/docs/js/appendix/style
          const style = this.elOptions.style;
          setTimeout(() => {
            this.cardNumber = this.stripeElements.create('cardNumber', { showIcon: true, style, iconStyle: 'solid' });
            this.cardNumber.mount('#card-number');
            this.cardExpiry = this.stripeElements.create('cardExpiry', { style });
            this.cardExpiry.mount('#card-expiry');
            this.cardCvc = this.stripeElements.create('cardCvc', { style });
            this.cardCvc.mount('#card-cvc');
            let self = this;
            this.cardNumber.off("change").on('change', function(event) {
              self.cardNumberComplete = event.complete;
              self.stripeChanged();
            });
            this.cardExpiry.off("change").on('change', function(event) {
              self.cardExpiryComplete = event.complete;
              self.stripeChanged();
            });
            this.cardCvc.off("change").on('change', function(event) {
              self.cardCvcComplete = event.complete;
              self.stripeChanged();
            });
          }, 1000);
        }
      },
      clearStripe() {
        if(this.cardNumber){
          this.cardNumber.clear();
          this.cardNumberComplete = false;
        }
        if(this.cardExpiry) {
          this.cardExpiry.clear();
          this.cardExpiryComplete = false;
        }
        if(this.cardCvc) {
          this.cardCvc.clear();
          this.cardCvcComplete = false;
        }
        this.nameOnCard = '';
      },  
      pay(method) {
        this.$parent.isSubmitting = true;
        if(!this.isPaymentVisible || this.contractorNumber.length > 0) {
          this.cardError = '';
          this.$parent.isSubmitting = true;
          this.$emit('onSubmit', { custom_info: this.customInfo });
          return;
        }
        if(method === 'stripe' ) {
          this.payWithStripe();
        } else if (method === 'stripe_checkout') {
          this.payWithStripeCheckout();
        } else if(method === 'adyen') {
          this.payWithAdyen();
        } else if(method === 'plugnpay') {
          this.payWithPlugnplay();
        } else if(method === 'authorize_net') {
          this.payWithAuthorizeNet();
        } else if(method === 'fiserv') {
          this.payWithFiserv();
        }
      },
      async addCard() {
      // async addCard(slotProps) {
        // let card = slotProps.element;
        // card.update({disabled: true});
        this.stripeElements.update({disabled: true});
        //card.mount(this.$refs.card_element);
        this.addingCard = true;
        const { token, error } = await this.$stripe.createToken(this.cardNumber);
        // const {token, error} = await slotProps.elements.createToken(card);
        this.cardError = '';
        if (error) {
          this.cardError = error.message;
          this.stripeElements.update({disabled: false});
          // card.update({disabled: false});
          this.addingCard = false;
          return;
        }

        try {
          const res = await UserApiService.addCard(token.id);
          this.addingCard = false;
          if (res.data.status === 'success') {
            // add it as a selected card to this.customerCards
            this.customerCards.push(res.data.data);
            this.selectedCard = res.data.data.id;
            this.addNewCard = false;
            this.noTrack = 1;
            // card.clear();
            this.clearStripe();
          } else {
            this.cardError = res.data.message;
          }
        } catch(e) {
          this.cardError = e.response.data.message;
          this.addingCard = false;
        }

          this.stripeElements.update({disabled: false});
        // card.update({disabled: false});
      },
      async removeCard(card) {
        const result = await this.$swal({
          title: 'Remove Card?',
          html: 'Are you sure you want to remove this credit card?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes'
        });
        this.removingCard = card;
        if(result.value) {
          const res = await UserApiService.removeCard(card.id);
          if(res.data.status === 'success') {
            this.customerCards = this.customerCards.filter(c => c.id !== card.id);
            if(this.selectedCard === card.id) {
              if(this.customerCards.length > 0) {
                this.selectedCard = this.customerCards[0].id;
              } else {
                this.selectedCard = null;
              }
            }
          } else {
            this.$swal('Error', 'Card could not be removed. Please try again.', 'error');
          }
        }
        this.removingCard = false;
      },
      async payWithStripe() {
        // if there are no cards, submit this as a stripe_token and set no_track=1 because it's
        // assumed the customer doesn't want to save anything.
        // only worry is if someone clicks Add Card, enters a number, then checks out without
        // actually adding the card, it will ignore the entered number and use the selected card.
        if ( this.customerCards.length === 0 ) {
          // const card = this.$refs.stElement.element;
          if(!this.nameOnCard){
            this.cardError = 'Please enter name on card';
            this.$parent.isSubmitting = false;
            return;
          }
          const { token, error } = await this.$stripe.createToken(this.cardNumber, {
            name: this.nameOnCard,
            address_line1: this.addressModel.address ? this.addressModel.address : '',
            address_line2: this.addressModel.address2 ? this.addressModel.address2 : '',
            address_city: this.addressModel.city ? this.addressModel.city : '',
            address_state: this.addressModel.state ? this.addressModel.state : '',
            address_zip: this.addressModel.postal_code ? this.addressModel.postal_code : '', 
            address_country: this.addressModel.country ? this.addressModel.country : ''
          });
          // const {token, error} = await this.$refs.stElement.elements.createToken(card);
          this.cardError = '';
          if (error) {
            this.$parent.isSubmitting = false;
            this.cardError = error.message;
            // card.update({disabled: false});
            this.addingCard = false;
            return;
          }
          this.$emit('selectedCard', token.card);
          
          this.$emit('onSubmit', {
            provider: 'credit-card',
            cc_data: { stripe_token: token.id, no_track: this.noTrack },
            custom_info: this.customInfo
          });
          return;
        }

        this.$emit('onSubmit', {
          provider: 'credit-card',
          cc_data: { card_id: this.selectedCard },
          custom_info: this.customInfo
        });
      },
      async payWithStripeCheckout() {
        this.$emit('onSubmit', {
          provider: 'stripe_checkout',
          custom_info: this.customInfo
        });
      },
      async payWithAdyen() {
        if(!this.adyenDataToSubmit) {
          this.cardError = 'Card data not ready, please try again.';
          this.$parent.isSubmitting = false;
          return;
        }

        this.cardError = '';
        this.$parent.isSubmitting = true;
        this.$emit('onSubmit', { provider: 'credit-card', cc_data: { adyen_payment_method: this.adyenDataToSubmit }, custom_info: this.customInfo });
      },
      async payWithAuthorizeNet() {
        if(!this.authorizeNetDataToSubmit) {
          this.cardError = 'Card data not ready, please try again.';
          this.$parent.isSubmitting = false;
          return;
        }

        this.cardError = '';
        this.$parent.isSubmitting = true;
        this.$emit('onSubmit', { provider: 'credit-card', cc_data: { authorize_net_payment: this.authorizeNetDataToSubmit }, custom_info: this.customInfo });
      },
      async payWithPlugnplay() {
        // we need to submit some data first into temporary storage, then the callback from
        // plugnpay will use the temp data to finish submitting the order.
        try {
          this.$parent.isSubmitting = true;
          this.addressModel.zip = this.addressModel.postal_code;
          const res = await OrderApiService.submitCustomerOrder({
            type: this.typeName,
            member: this.memberInfo,
            address: this.addressModel,
            isGuestCheckout: this.isGuestCheckout,
            provider: 'plugnpay',
            custom_info: this.customInfo,
            custom_shipping: this.$store.state.cartSelectedShippingQuote
          });
          submitPlugnPayForm(this.$parent, res.customerSlug);
        } catch(err) {
          this.$parent.isSubmitting = false;
          this.$parent.$refs.cartMember.showErrors(err.response.data.errors);
        }
      },
      async payWithFiserv() {
        // we need to submit some data first into temporary storage, then the callback from
        // fiserv will use the temp data to finish submitting the order.

        // Dont want to change the flow for rest
        try {
          this.$parent.isSubmitting = true;
          let address = this.addressModel;
          if(this.isSameBillingAddress) {
            address = this.billingAddress;
          }

          address.zip = address.postal_code;
          var _self = this;
          await OrderApiService.submitCustomerOrder({
            type: this.typeName,
            member: this.memberInfo,
            address: address,
            isGuestCheckout: this.isGuestCheckout,
            optInForRegister: this.optInForRegister,
            provider: 'fiserv',
            custom_info: this.customInfo,
            custom_shipping: this.$store.state.cartSelectedShippingQuote
          }).then(res => {
            if(res.data.order) {
              if(!_self.isGuestCheckout || (_self.isGuestCheckout && _self.optInForRegister)){
                res.data.data.customer.customer_addresses = [_self.addressModel];
                AuthController.login(res.data);
                submitFiservForm(this.$parent, res.data.customerSlug);
              } else {
                submitFiservForm(this.$parent, res.data.customerSlug);
              }
            }
          });
        } catch(err) {
          console.log(err);
          this.$parent.isSubmitting = false;
          this.$parent.$refs.cartMember.showErrors(err.response.data.errors);
        }
      },      
      updateCard() {
        //let card = Stripe.get('card', this.stripeKey)
      },
      handleAuthorizeResponse(response) {
        // Handle the Authorize.net payment form response
        if (response.messages.resultCode === 'Error') {
          this.cardError = response.messages.message[0].text;
          this.$swal('Payment Error!', response.messages.message[0].text, 'error');
        } else {
          this.cardError = '';
          this.authorizeNetDataToSubmit = {...response.opaqueData, ...response.encryptedCardData };
        }
      }
    }
  };
</script>

<style scoped lang="scss">

.credit-cards {
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-bottom: 10px;
    justify-content: space-between;
    padding: 20px;
  }

:deep(.stElement) {
  display: flex;
  .StripeElement {
    flex-grow: 1;
    display: flex;
    align-items: center;
    .__PrivateStripeElement {
      flex-grow: 1;
    }
  }
  .btn.disabled, .btn:disabled{
    background-color: #808080e3 !important;
    border-color: #808080e3;
  }
}
div.card-error {
  color: #721c24;
  background-color: #f8d7da;
  font-size: 14px;
  position: relative;
  padding: .75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: .25rem;
  margin-top: 10px;
}
.h-43{
  height: 43px;
}
.py-13{
  padding-top: 13px !important;
  padding-bottom: 13px !important;
}
</style>
