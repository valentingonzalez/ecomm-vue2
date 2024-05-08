<template>
  <section>
    <div class="container">
      <h5 class="section-title">
        <div class="move-handler"></div>
        Coupons &amp; Highlights
        <span class="edit">
          <a href="#" @click.prevent="showModal('couponWidgetModal', {widget: widget})" aria-label="Coupon Widget Modal">
            <img src="/images/edit.png" alt="Edit" />
          </a>
          <a href="#" @click.prevent="deleteWidget" aria-label="Delete Widget">
            <img src="/images/remove.png" alt="Remove" />
          </a>
        </span>
      </h5>
      <div class="coupons-slider">
        <div class="position-relative">
          <swiper ref="couponSlider" :options="swiperOptions" class="coupons">
            <swiper-slide>
              <div class="coupon-slide-wraper">
                <div class="add-coupon-slide" @click="showModal('couponWidgetModal', {widget: widget})">
                  <span>
                    <img src="/icons/plus.png" alt="Add" />
                    <h4>Add Coupon</h4>
                  </span>
                </div>
              </div>
            </swiper-slide>
            <swiper-slide v-for="(coupon, index) in coupons" :key="index">
              <div class="wrapper">
                <CouponType1 :coupon="coupon" v-if="coupon.style===1" />
                <CouponType2 :coupon="coupon" v-if="coupon.style===2" />
                <CouponType3 :coupon="coupon" v-if="coupon.style===3" />
                <div class="edit-icon">
                  <a href="#" @click.prevent="showModal('couponWidgetModal', {coupon_id:coupon.id, widget:widget})" aria-label="Coupon Widget Modal">
                    <img src="/images/edit.png" alt="Edit" />
                  </a>
                  <a href="#" @click.prevent="deleteCoupon({widget_id: widget.id, coupon_id: coupon.id})" aria-label="Delete Coupon">
                    <img src="/images/remove.png" alt="Remove" />
                  </a>
                </div>
              </div>
            </swiper-slide>
          </swiper>
          <div class="swiper-button-prev product-swiper-prev" slot="button-prev"></div>
          <div class="swiper-button-next product-swiper-next" slot="button-next"></div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  
  import CouponType1 from '@/components/coupons/coupon-t1.vue';
  import CouponType2 from '@/components/coupons/coupon-t2.vue';
  import CouponType3 from '@/components/coupons/coupon-t3.vue';
  
  import AdminWidgetApi from '@/api-services/widgets.service';
  
  export default {
    name: 'CouponSection',
    props: [
      'widget'
    ],
    components: {
      CouponType1,
      CouponType2,
      CouponType3
    },
    data() {
      return {
        swiperOptions: {
          spaceBetween: 20,
          slidesPerView: 3,
          draggable: true,
          autoplay: {
            delay: 3500,
            disableOnInteraction: false
          },
          allowTouchMove: false,
          navigation: {
            nextEl: '.product-swiper-next',
            prevEl: '.product-swiper-prev'
          },
          breakpoints: {
            991: {
              slidesPerView: 2
            },
            766: {
              slidesPerView: 1
            },
            320: {
              centeredSlides: true,
              spaceBetween: 0,
            },
            640: {
                allowTouchMove: true
            }
          }
        }
      };
    },
    computed: {
      swiper() {
        return this.$refs.couponSlider.swiper;
      },
      coupons() {
        return this.$store.state.coupons;
      }
    },
    methods: {
      showModal(ref, data) {
        this.$emit('showModal', {
          modal: 'couponWidgetModal',
          coupon_id: data ? data.coupon_id : null,
          widget: data ? data.widget : null
        });
      },
      deleteCoupon(options) {
        this.$swal({
          title: 'Success',
          text: 'Do you want to remove this coupon?',
          type: 'success',
          showCancelButton: true
        }).then(result => {
          if(result.value) {
            AdminWidgetApi.deleteCoupon({id: options.coupon_id});
            this.$store.dispatch('deleteDashboardCouponInWidget', options);
          }
        });
      },
      deleteWidget() {
        this.$swal({
          title: 'Success',
          text: 'Do you want to remove this widget?',
          type: 'success',
          showCancelButton: true
        }).then(result => {
          if(result.value) {
            AdminWidgetApi.deleteCouponWidget({id: this.widget.id});
            this.$store.dispatch('deleteDashboardWidget', this.widget);
          }
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .section-title {
    display: flex;
    align-items: center;
    .edit {
      margin-left: 5px;
      a {
        margin: 0 3px;
      }
    }
  }
  .coupon-slide-wraper {
    padding: 15px 0;
    .add-coupon-slide {
      border-radius: 5px;
      background: #3ece3e26;
      mix-blend-mode: normal;
      height: 170px;
      position: relative;
      cursor: pointer;
      .edit {
        position: absolute;
        top: 0;
        left: 0;
        margin-left: 5px;
        a {
          margin: 0 3px;
        }
      }
      span {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        position: relative;
        &::before {
          content: '';
          border: 1px dashed #3ECE3E;
          border-radius: 5px;
          position: absolute;
          width: 97%;
          height: 95%;
        }
        h4 {
          font-weight: bold;
          font-size: 16px;
          line-height: 19px;
          text-align: center;
          color: #3ECE3E;
        }
        img {
          width: 22px;
          height: auto;
        }
      }
    }
    .edit-icon {
      position: absolute;
      top: 4px;
      a {
        margin-right: 5px;
      }
    }
  }
  .wrapper {
    padding: 15px 0;
    &:hover .edit-icon {
      display: block;
    }
    .edit-icon {
      position: absolute;
      top: 0px;
      left: -10px;
      display: none;
      a {
        margin-right: 5px;
      }
    }
  }
  .coupon-3 {
    padding: 15px 0;
    .add-coupon-slide {
      border-radius: 5px;
      background: #36813E;
      mix-blend-mode: normal;
      height: 170px;
      position: relative;
      .coupon-type-head {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 22px 0;
        border-bottom: 1px dashed #fff;
        &::before {
          content: '';
          position: absolute;
          width: 30px;
          height: 30px;
          left: 0;
          border-radius: 50%;
          -webkit-transform: translateX(-50%);
          transform: translate(-50%, -50%);
          z-index: 1;
          top: 50%;
        }
        &::after {
          content: '';
          position: absolute;
          width: 30px;
          height: 30px;
          right: -30px;
          border-radius: 50%;
          -webkit-transform: translateX(-50%);
          transform: translate(-50%, -50%);
          z-index: 1;
          top: 50%;
        }
        h3 {
          color: #fff;
        }
        .btn-shop {
          background: #fff;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 14px;
          color: #000;
          &::before {
            border: none;
          }
        }
      }
      .brand {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        padding: 0 0 0 30px;
        margin-top: 15px;
        h5 {
          font-size: 18px;
          color: #fff;
          margin-bottom: 0;
          font-weight: 300;
        }
        p {
          font-size: 14px;
          color: #fff;
        }
      }
      .edit {
        position: absolute;
        top: 0;
        left: 0;
        margin-left: 5px;
        a {
          margin: 0 3px;
        }
      }
      span {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        position: relative;
        &::before {
          content: '';
          border: 1px dashed #3ECE3E;
          border-radius: 5px;
          position: absolute;
          width: 97%;
          height: 95%;
        }
        h4 {
          font-weight: bold;
          font-size: 16px;
          line-height: 19px;
          text-align: center;
          color: #3ECE3E;
        }
        img {
          width: 22px;
          height: auto;
        }
      }
    }
    .edit-icon {
      position: absolute;
      top: 4px;
      a {
        margin-right: 5px;
      }
    }
  }
.coupons-slider {
  .coupons.swiper-container {
    margin: 0;
  }
}
</style>
