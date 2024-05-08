<template>
  <b-modal class="modal-box" size="lg" ref="promoModal" hide-footer hide-header>
    <a href="#" @click.prevent="hideModal" class="close-bt" aria-label="Close">
      <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13 1L1 13m12 0L1 1" stroke="#555" stroke-width="2" fill="none" fill-rule="evenodd" opacity=".3" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
    <div class="d-block text-center d-flex justify-content-center flex-column w-100">
      <div class="mb-3">
        <div class="circle d-flex align-items-center justify-content-center mx-auto mb-3">
          <svg width="29" height="21" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><filter x="-3.2%" y="-2.5%" width="106.3%" height="110.1%" filterUnits="objectBoundingBox"><feOffset dy="16" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="4" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" in="shadowBlurOuter1"/></filter><filter x="-65.6%" y="-46.9%" width="231.2%" height="231.2%" filterUnits="objectBoundingBox" ><feOffset dy="12" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="12" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0.225203804 0 0 0 0 0.129660785 0 0 0 0 0.0629609416 0 0 0 0.1 0" in="shadowBlurOuter1"/></filter><linearGradient x1="0%" y1="21.667%" x2="100%" y2="107.427%" ><stop stop-color="#FDF2A2" offset="0%"/><stop stop-color="#EFDE8A" offset="23.596%"/><stop stop-color="#DDBA52" offset="61.449%"/><stop stop-color="#E7C654" offset="100%"/></linearGradient><circle  cx="32" cy="32" r="32"/><rect  x="0" y="0" width="631" height="475" rx="8"/></defs><g fill="none" fill-rule="evenodd"><path fill="#000" opacity=".7" d="M-787-407H813V593H-787z"/><g transform="translate(-302 -144)"><use fill="#000" filter="url(#a)" xlink:href="#b"/><use fill="url(#c)" xlink:href="#b"/></g><g><g transform="translate(-18.5 -22)"><use fill="#000" filter="url(#d)" xlink:href="#e"/><use fill="#FFF" xlink:href="#e"/></g><path stroke="#8C4F24" stroke-width="4" opacity=".78" stroke-linecap="round" stroke-linejoin="round" d="M2.045 10.364l8 8 16-16"/></g></g></svg>
        </div>
        <h3 class="font-weight-bold">
          Congratulations
        </h3>
        Your <b>15% OFF</b> Promo Is Now Applied!
      </div>
      <button class="mx-auto btn btn-primary" @click="hideModal">Start Shopping</button>
      <div class="mt-3" v-if="disclaimer">{{disclaimer}}</div>
    </div>
  </b-modal>
</template>

<script>
import OrderApiService from '@/api-services/order.service';

export default {
  name: 'PromoModal',
  data() {
    return {
      disclaimer: ''
    };
  },
  methods: {
    hideModal() {
      this.$refs.promoModal.hide();
    },
    showModal() {
      this.$refs.promoModal.show();
    }
  },
  mounted() {
    if(this.$route.query.promo) {
      OrderApiService.redeemCoupon({
        coupon: this.$route.query.promo
      }).then((res) => {
        if (res.status === 200) {
          this.disclaimer = res.data.disclaimer;
          this.showModal();
        }
      }).catch(() => {
        console.log("Error while automatically redeeming coupon");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  :deep(.modal-dialog) {
    max-width: 630px !important;
  }
  :deep(.modal-content) {
    border: none;
    min-height: 475px;
    background-image: url('/images/promo-stars.png'), linear-gradient(146deg, #FDF2A2 0%, #EFDE8A 24%, #DDBA52 61%, #E7C654 100%);
    background-repeat: no-repeat, no-repeat;
    background-position: center 80px, center center;
    background-size: 418px 113px, auto auto;
    box-shadow: 0 16px 8px 0 rgba(0,0,0,0.10);
    border-radius: 8px;
    font-size: 22px;
    .modal-body {
      display: flex;
      align-items: center;
    }
    .circle {
      width: 64px;
      height: 64px;
      border-radius: 64px;
      background: #fff;
    }
    h3 {
      font-size: 30px !important;
    }
    .btn {
      color: #000 !important;
      border: none !important;
      background-image: linear-gradient(-38deg, #F4DB71 0%, #FFFFFF 100%, #FFFFFF 100%) !important;
      box-shadow: 0 8px 6px 0 rgba(0,0,0,0.08) !important;
      font-size: 18px !important;
      font-weight: bold !important;
      border-radius: 8px !important;
      width: 279px;
      height: 54px !important;
    }
    .close-bt {
      position: absolute;
      top: 6px;
      right: 16px;
    }
  }
  @media (max-width: 576px) {
    :deep(.modal) {
      display: flex !important;
      align-items: center;
      justify-content: center;
    }
    :deep(.modal-content) {
      min-height: 345px;
      .btn {
        width: 100%;
      }
    }
  }
</style>

