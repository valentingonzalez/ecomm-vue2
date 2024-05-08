<template>
  <div class="card p-3 p-md-4 mb-3">
    <div class="card-body p-0">
      <h6 class="card-title font-weight-bold">
        Redeem Promo Code
        <span class="badge badge-dark mr-2" v-for="(coupon, index) in redeemCoupons" :key="index">{{ coupon }}</span>
      </h6>
      <div class="d-flex flex-column flex-sm-row mt-2">
        <input v-model="coupon" type="text" class="form-control mr-0 mr-sm-3 mb-2 mb-sm-0" placeholder="Discount Coupon" aria-label="Discount Coupon">
        <button id="coupon" type="button" @click="redeemCoupon" class="btn btn-primary" :disabled="isSubmitting || coupon.length == 0">
          <span :class="{'d-none':!isSubmitting}" class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
          Redeem
        </button>
      </div>
    </div>
  </div>
</template>
<script>
  import OrderApiService from '@/api-services/order.service';

  export default {
    name: 'RedeemPromo',
    data() {
      return {
        'coupon': '',
        'isSubmitting': false,
      };
    },
    computed: {
      redeemCoupons() {
        return this.$store.state.cart.coupons.split(",");;
      },
    },
    methods: {
      redeemCoupon() {
        if(this.coupon.length < 3){
          this.$swal('Promo code should be greater than 3 characters', '', 'error');
          return;
        }

        this.isSubmitting = true;
        OrderApiService.redeemCoupon({
            coupon: this.coupon
        }).then((res) => {
          if (res.status === 200) {
            this.coupon = '';
            this.$store.dispatch("fetchCartItemsDetails");
            this.$swal(res.data.message, '', 'success');
          } else {
            this.coupon = '';
            this.$swal(res.data.message, '', 'error');
          }
          this.isSubmitting = false;
        }).catch((err) => {
          if (err.response) {
            this.$swal(err.response.data.message, '', 'error');
          }
          this.isSubmitting = false;
          this.coupon = '';
          
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
@media (max-width: 475px) {
  .btn {
      font-size: 12px;
      padding: 9px 15px;
      height: 33px;
  }
}
</style>
