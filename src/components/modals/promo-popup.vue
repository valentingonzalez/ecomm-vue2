<template>
  <b-modal class="modal-box" ref="modal" hide-header hide-footer centered>
    <a href="#" @click.prevent="hideModal" class="close-bt" aria-label="Close">
      <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13 1L1 13m12 0L1 1" stroke="#555" stroke-width="2" fill="none" fill-rule="evenodd" opacity=".3" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
    <div v-if="promo">
      <a :href="promo.popup_redirect_url" target="_blank">
        <div class="img-wrapper" v-if="promo.image">
          <img :src="promo.image" class="w-100" alt="">
        </div>
        <div v-if="!promo.hide_popup_text" class="content w-100 h-100 d-flex flex-column justify-content-center justify-content-sm-end p-4 p-sm-5">
          <div class="display-3 font-weight-bold mb-0" v-if="promo.name">
            {{ promo.name }}
          </div>
          <div class="h3 font-weight-bold" v-if="promo.description">
            {{ promo.description }}
          </div>
          <div class="lead d-none d-md-block" v-if="promo.disclaimer">
            {{ promo.disclaimer }}
          </div>
          <div class="d-flex mt-3 mt-md-5">
            <router-link :to="`/promotions/single/${promo.slug}`" class="btn btn-outline-secondary btn-lg font-weight-bold text-light">
              View Details
            </router-link>
          </div>
        </div>
      </a>
    </div>
  </b-modal>
</template>

<script>
import HomePageApiService from '@/api-services/homepage.service';

export default {
  name: 'PromoPopup',
  data() {
    return {
      promo: null
    };
  },
  computed: {
    discount() {
      if(!this.promo.discount) return null;
      return `${this.promo.discount_type == 'flat' ? '$' : ''}${parseFloat(this.promo.discount)}${this.promo.discount_type == 'percentage' ? '%' : ''} OFF`;
    },
    currentDateTime() {
      return new Date().getTime();
    },
    existingShownPromo() {
      return localStorage.getItem('promoPopUp') == null ? null : JSON.parse(localStorage.getItem('promoPopUp'));
    }
  },
  async mounted() {
    await this.checkPopupStats();
  },
  methods: {
    hideModal() {
      this.$refs.modal.hide();
    },
    async checkPopupStats() {
      if (!this.existingShownPromo || this.existingShownPromo.expiration < this.currentDateTime) {
        await this.showPromoPopup();
      }
    },
    async showPromoPopup() {
      await HomePageApiService.getPromoPopUp().then(res => {
        this.promo = res.data.coupon_widget_data;
        
        if(this.promo) {
          if(!this.existingShownPromo || (this.existingShownPromo && this.existingShownPromo.promo != this.promo.slug)) {
            this.$refs.modal.show();
          }

          const expirationTime = this.currentDateTime + (24 * 60 * 60 * 1000);
          localStorage.setItem('promoPopUp', JSON.stringify({ promo: this.promo.slug, expiration: expirationTime }));
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
  :deep(.modal) {
    padding: 15px;
    .modal-dialog {
      max-width: 863px !important;
      .modal-content {
        border-radius: 12px;
        overflow: hidden;
        .modal-body {
          padding: 0 !important;
          .close-bt {
            position: absolute;
            right: 20px;
            top: 20px;
            z-index: 20;
          }
          .img-wrapper {
            position: relative;
            &::after {
              content: '';
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
             // background: linear-gradient(240.78deg, rgba(0, 0, 0, 0) 11.86%, #000000 150.7%);
            }
          }
          .content {
            position: absolute;
            color: #fff;
            top: 0;
            left: 0;
            
            @media (max-width: 576px) {
              .h2 { font-size: 16px !important; }
              .display-3 { font-size: 28px; }
              .h3 { font-size: 20px; }
              .btn-lg {
                height: 43px;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
</style>