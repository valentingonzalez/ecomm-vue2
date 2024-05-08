<template>
  <div class="coupon" :style="{backgroundImage: `url(${options.background_image || '/images/product-img.png'})`}">
    <div class="title">{{ options.coupon_title || 'We Offer Delivery!' }}</div>
    <div class="bottom_text">{{ options.bottom_text }}</div>
    <a class="btn btn-white" @click="redeemCoupon">{{ options.button_title || 'Get Coupon' }}</a>
    <coupon-modal ref="couponModal" />
  </div>
</template>
<script>
  import AuthController from '@/controllers/auth.controller';
  import CouponModal from '@/components/modals/coupon.vue';

  export default {
    name: 'CouponType2',
    components: {
      CouponModal
    },
    props:{
      coupon: {
        type: Object,
        default: function () {
          return {
            discount: '',
            coupon_title: '',
            button_title: '',
            background_color: '',
            background_image: '',
            style: 3,
            bottom_text: '',
            active: 1
          };
        }
      }
    },
    data: function() {
      return {
        options: this.coupon,
        userInfo: AuthController.checkAuthStatus()
      };
    },
    methods: {
      redeemCoupon() {
        if (this.userInfo) {
        } else {
          this.$refs.couponModal.showModal();
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .coupon {
      height: 170px;
      overflow: hidden;
      border-radius: 5px;
      position: relative;
      color: #fff;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;      
      .title {
        font-size: 18px;
        font-weight: bold;
        text-shadow: 0 2px 2px rgba(0,0,0,.3);
      }
      .bottom_text {
        font-size: 13px;
        text-shadow: 0 2px 2px rgba(0,0,0,.3);
      }
      .btn {
        margin-top: 10px;
      }
  }
</style>