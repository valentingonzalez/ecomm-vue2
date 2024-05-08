<template>
  <div>
    <div class="alert alert-danger">
      The First Transaction/Payout May Take Up To 14 Days To Process Due to Stripe’s Safety & Verification Policy.
      <br>
      <a target="_blank" href="https://stripe.com/docs/payouts#:~:text=When%20you%20start%20processing%20live,receiving%20your%20first%20successful%20payment">
        <b>Click Here To Read Stripe's Policy.</b>
      </a>
    </div>
    <PaymentOptions :ref="`payment-options`" />
  </div>
</template>

<script>
  import PaymentOptions from '@/components/admin/payment/payment-options';

  export default {
    name: 'WizardPaymentOptions',
    components: {
      PaymentOptions
    },
    methods: {
      async save() {
        return await this.$refs[`payment-options`].save();
      },
    }
  };
</script>
