<template>
  <div class="coupon">
    <div class="row">
      <div class="col-6 image" :style="{backgroundImage: `url(${options.background_image || '/images/product-img.png'})`}">
        <a class="btn btn-white" @click="redeemCoupon">{{ options.button_title || 'Get Coupon' }}</a>
      </div>
      <div class="col-6 info" :style="{ backgroundColor: options.background_color || '#3BC43B'}">
          <div class="discount">{{ options.discount || '$10.00' }}</div>
          <div class="title">{{ options.coupon_title || 'Lawn Care Products' }}</div>
          <div class="bottom_text">{{ options.bottom_text || 'Use in Store' }}</div>
      </div>
    </div>
    <coupon-modal ref="couponModal" />
  </div>
</template>
<script>
  import AuthController from '@/controllers/auth.controller';
  import CouponModal from '@/components/modals/coupon.vue';

  export default {
    name: 'CouponType1',
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
      width: 22px;
      height: 11px;
      left: 50%;
      margin-left: -11px;
      position: absolute;
      z-index: 1;
    }
    &::before {
      top: 0;
      border-radius: 0 0 22px 22px;
    }
    &::after {
      bottom: 0;
      border-radius: 22px 22px 0 0;
    }
    .row {
      height: 100%;
      margin: 0;
    }
    .image {
      background-size: cover;
      background-position: 50% 50%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      position: relative;
      &::after {
        content: '';
        border-right: 2px dashed #FFF;
        position: absolute;
        top: 0;
        right: -1px;
        height: 100%;
        z-index: 1;
      }
      .btn {
        margin-bottom: 20px;
      }
    }
    .info {
      display: flex;
      flex-direction: column;
      padding: 20px 15px 20px 25px;
      .discount {
        font-size: 32px;
        font-weight: bold;
      }
      .title {
        font-size: 14px;
        font-weight: bold;
      }
      .bottom_text {
        font-size: 13px;
        position: absolute;
        bottom: 22px;
      }
    }
  }
</style>
