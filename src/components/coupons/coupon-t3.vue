<template>
  <div class="coupon d-flex flex-column" :style="{ backgroundColor: options.background_color || '#36813E' }">
    <div class="h-100">
      <div class="discount">{{ options.discount || '50%' }}</div>
      <a class="btn btn-white" @click="redeemCoupon">{{ options.button_title || 'Shop Now' }}</a>
    </div>
    <div class="h-100">
      <div>
        <div class="title">{{ options.coupon_title || 'Off All Garden Tools ' }}</div>
        <div class="bottom_text">{{ options.bottom_text || 'Ends November 1st' }}</div>
      </div>
    </div>
    <coupon-modal ref="couponModal" />
  </div>
</template>
<script>
  import AuthController from '@/controllers/auth.controller';
  import CouponModal from '@/components/modals/coupon.vue';

  export default {
    name: 'CouponType3',
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
    &::after,
    &::before {
      content: '';
      background: #fff;
      width: 11px;
      height: 22px;
      top: 50%;
      margin-top: -11px;
      position: absolute;
      z-index: 1;
    }
    &::before {
      left: 0;
      border-radius: 0 22px 22px 0;
    }
    &::after {
      right: 0;
      border-radius: 22px 0 0 22px;
    }
    > div {
      padding: 0 40px;
      display: flex;
      align-items: center;
      position: relative;
      &:nth-child(1)::after {
        content: '';
        border-bottom: 1px dashed #FFF;
        opacity: .7;
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        z-index: 1;
      }
    }
    .discount {
      font-size: 35px;
      font-weight: bold;
      flex: 1;
    }
    .title {
      font-size: 18px;
      font-weight: bold;
    }
    .bottom_text {
      font-size: 14px;
    }
  }
</style>