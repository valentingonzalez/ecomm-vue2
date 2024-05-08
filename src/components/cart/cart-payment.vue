<template>
  <section v-if="preferences.payment">
    <h4 class="mb-4">
      Payment Option
    </h4>
    <div class="row">
      <div class="col-md-6 mb-3">
        <div class="custom-control custom-radio">
          <input
            :id="`${type}_credit_card`"
            v-model="provider"
            type="radio"
            name="payment-option"
            value="credit-card"
            class="custom-control-input">
          <label class="custom-control-label" :for="`${type}_credit_card`">
            Credit Card
          </label>
        </div>

      </div>
      <div class="col-md-6 mb-3" style="display: none">

        <div class="custom-control custom-radio">
          <input
            :id="`${type}_paypal`"
            v-model="provider"
            type="radio"
            name="payment-option"
            value="paypal"
            class="custom-control-input">
          <label class="custom-control-label" :for="`${type}_paypal`">
            Paypal
          </label>
        </div>

      </div>
    </div>

    <!--
    <div class="row">
      <div class="col-md-6 mb-3">

        <div class="custom-control custom-radio">
          <input
            id="shipping_apple_pay"
            v-model="provider"
            type="radio"
            name="payment-option"
            value="apple-pay"
            class="custom-control-input">
          <label class="custom-control-label" for="shipping_apple_pay">
            Apple Pay
          </label>
        </div>

      </div>
      <div class="col-md-6 mb-3">

        <div class="custom-control custom-radio">
          <input
            id="shipping_google_wallet"
            v-model="provider"
            type="radio"
            name="payment-option"
            value="google-wallet"
            class="custom-control-input">
          <label class="custom-control-label" for="shipping_google_wallet">
            Google Wallet
          </label>
        </div>

      </div>
    </div>
    -->

    <div class="row justify-content-center mt-2" v-if="provider === 'credit-card'">
      <div class=" credit-card">
        <div class="col-md-6 mb-3">
          <input
            v-model="cardDetail.number"
            name="number"
            type="tel"
            class="form-control input-card"
            placeholder="Card Number"
            v-card-focus>
        </div>
        <div class="col-md-3 mb-3">
          <div class="months">
            <input
              v-model="cardDetail.expiry"
              name="expiry"
              type="tel"
              class="form-control"
              maxlength="7"
              placeholder="MM/YY"
              v-card-focus>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="code-cvc">
            <input
              v-model="cardDetail.cvc"
              name="cvc"
              type="number"
              class="form-control"
              placeholder="CVC" v-card-focus>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'cartPayment',
    props: ['type'],
    computed: {
      preferences() {
        return this.$store.state.preferences;
      }
    },
    data() {
      return {
        provider: '',
        cardDetail: {
          number: '',
          name: '',
          expiry: '',
          cvc: ''
        }
      };
    }
  };

</script>

