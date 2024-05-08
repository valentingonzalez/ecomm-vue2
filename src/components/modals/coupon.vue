<template>
  <b-modal no-close-on-backdrop class="modal-box" ref="couponModal">
    <div slot="modal-header">
      <h5>Login First</h5>
    </div>
    <div id="authorization">
      <router-link to="/login">Sign In</router-link>&nbsp;or&nbsp;<router-link to="/register">Sign Up</router-link>
    </div>
    <div slot="modal-footer">
    </div>
  </b-modal>
</template>

<script>

export default {
  name: 'CouponModal',
  methods: {
    hideModal() {
      this.$refs.couponModal.hide();
    },
    showModal() {
      this.$refs.couponModal.show();
    }
  }
};
</script>

<style lang="scss">
  // @import '@/assets/scss/modal-common.scss';
  .error-message {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-size: 12px;
    color: #f00;
    text-align: center;
  }
</style>

