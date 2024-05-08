<template>
  <div class="container page-wrapper pl-4 pr-4 pt-4">
    <h1 class="page-title">Discover The Best Grill You Will Ever Own (LP & Natural Gas)</h1>
    <div class="responsive-frame mb-4">
      <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/05/5f2b18482d0d1_banner.png"/>
    </div>
    <div class="row mb-5">
      <div class="content-block col-md-12">
        <h3>We Stock Both LP & Natural Gas Versions of Most Broil King Grills</h3>
        <p>Find out why Broil King is The BEST Gas Grill for 2019. Made in USA right in Huntington,
          Indiana and shipped factory direct to our store. We dare you to compare with our
          FREE Checklist against all competitor brands at all area stores.</p>
        <P>Our special gift to you if you decide to buy from us - Free Assembly,
          Free Cover & Free Propane Tank Fill with Every Broil King Gas Grill plus Delivery is available to Jackson,
          Vandercook Lake  & Brooklyn areas for an additional cost.</P>
      </div>
    </div>
    <!-- <div class="banner-main mb-4">
      <div class="row">
        <div @click="redirectToGrillPage" class="col-xs-12 col-lg-4 cursor-pointer">
          <div class="banner-wrapper">
            <div class="banner-image">
              <img src="images/info_pages/home-broil-king.png"/>
            </div>
            <div class="banner-info">
              <h3>Want The Best Grill?</h3>
              <p>Discover The Best & Last Grill You Will Ever Own</p>
              <a href="#">discover broil king</a>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-lg-4">
          <div class="banner-wrapper">
            <div class="banner-image">
              <img src="images/info_pages/percentage_broil_king.png"/>
            </div>
            <div class="banner-info">
              <h3>Want Free Stuff?</h3>
              <p>Get Free Assembly, Free Cover & Free Tank Fill</p>
              <a target="_blank" href="https://www.hammondhardware.com/pages/small-engine-repair-jackson-mi">Call Us {{currentStore.phone}}</a>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-lg-4">
          <div class="banner-wrapper border-0 banner-last">
            <div class="banner-image">
              <img src="images/info_pages/light_broil_king.png"/>
            </div>
            <div class="banner-info">
              <h3>Want Piece Of Mind?</h3>
              <p>Don't Make a $500 Grill Buying Mistake With This FREE Guide</p>
              <a target="_blank" href="https://www.hammondhardware.com/pages/ethanol-free-gas-jackson-mi">Get The Secret</a>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="row">
      <div v-if="productsFetched" class="w-100 mb-4">
        <div class="position-relative">
          <template>
            <swiper ref="similarProductsSwiper" class="products-slider" :options="{
              spaceBetween: 20,
              autoplay: {
                delay: 3500,
                disableOnInteraction: false
              },
              allowTouchMove: false,
              slidesPerView: 'auto',
              draggable: true,
              breakpoints: {
                320: {
                  centeredSlides: true,
                  spaceBetween: 0,
                },
                640: {
                    allowTouchMove: true
                },
              },
              navigation: {
                disabledClass: 'd-none',
                nextEl: '#similar-swiper-button-next',
                prevEl: '#similar-swiper-button-prev',
              }}">
              <swiper-slide v-for="(item, index) in grillProducts" :key="'similar-products-' + index">
                <ProductItem :item="item" :internal-api="false" :add-start-stop-scroller="true" @stop-autoplay="stopAutoplay" @start-autoplay="startAutoplay"/>
              </swiper-slide>
            </swiper>
            <div class="swiper-button-prev" id="similar-swiper-button-prev" slot="button-prev" />
            <div class="swiper-button-next" id="similar-swiper-button-next" slot="button-next" />
          </template>
        </div>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="pick-up-section">
          <div class="pickup-text">
            <div class="img-block">
               <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/05/5f2b186ee51e6_phone-call.png"/>
            </div>
            <span>
              <h4>Got Questions ?</h4>
              <h5>Click to Call us Now..!!</h5>
            </span>
          </div>
          <button @click="toAboutUsPage">Call us now <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/05/5f2b189a3cbf3_arrow-right1.png"/> </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ProductApiService from '@/api-services/product.service';
  export default {
    name: 'WelcomeToBroilKing',
    data() {
      return {
        grillProducts: [],
        productsFetched: false
      };
    },
    computed: {
      currentStore() {
        if (this.$store.state.businessDetails != null && this.$store.state.businessDetails.about_us != null) {
          return this.$store.state.businessDetails.about_us.locations[0];
        } else {
          return null;
        }
      },
    },
    methods: {
      stopAutoplay() {
        this.$refs.productsSwiper.swiper.autoplay.stop();
      },
      startAutoplay() {
        this.$refs.productsSwiper.swiper.autoplay.start();
      },
      redirectToGrillPage() {
        window.open('https://mailchi.mp/2c87425f7059/broil-king-grill-jackson-mi', '_blank');
      },
      async fetchData() {
        let products = this.$store.state.products;
        let product = products.find( item => item.upc === '062703211572');
        if (product == null) {
          await ProductApiService.getProduct('062703211572').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.grillProducts.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.grillProducts.push(product);
        }
        product = products.find( item => item.upc === '062703235875');
        if (product == null) {
          await ProductApiService.getProduct('062703235875').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.grillProducts.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.grillProducts.push(product);
        }
        // product = products.find( item => item.upc === '062703888446');
        // if (product == null) {
        //   await ProductApiService.getProduct('062703888446').then(response => {
        //     product = response.data.data;
        //     product.competitors = null;
        //     product.similars = null;
        //     product.videos = null;
        //     this.grillProducts.push(product);
        //     this.$store.commit('addProduct', product);
        //   });
        // } else {
        //   this.grillProducts.push(product);
        // }
        product = products.find( item => item.upc === '062703225647');
        if (product == null) {
          await ProductApiService.getProduct('062703225647').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.grillProducts.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.grillProducts.push(product);
        }
        // product = products.find( item => item.upc === '684678080603');
        // if (product == null) {
        //   await ProductApiService.getProduct('684678080603').then(response => {
        //     product = response.data.data;
        //     product.competitors = null;
        //     product.similars = null;
        //     product.videos = null;
        //     this.grillProducts.push(product);
        //     this.$store.commit('addProduct', product);
        //   });
        // } else {
        //   this.grillProducts.push(product);
        // }
        product = products.find( item => item.upc === '062703221571');
        if (product == null) {
          await ProductApiService.getProduct('062703221571').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.grillProducts.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.grillProducts.push(product);
        }
        let allSKUs = [];
        this.grillProducts.forEach(item => {
          allSKUs.push(item.sku);
        });
      },
      toAboutUsPage() {
        this.$router.push('/about-us');
      }
    },
    async mounted() {
      await this.fetchData();
      this.productsFetched = true;
    }
  };
</script>
<style scoped lang="scss">
  .page-wrapper {
    img {
      max-width: 100%;
    }
    .page-title {
      display: block;
      margin: 0 0 15px;
      font-weight: bold;
      font-size: 24px;
      line-height: 28px;
      color: #000000;
    }
    .responsive-frame {
      position: relative;
    }
    .content-block {
      h3 {
        display: block;
        margin: 0 0 15px;
        font-weight: 600;
        font-size: 18px;
        line-height: 21px;
        color: #000000;
      }
      p {
        color: #6C7173;
        font-size: 16px;
        line-height: 26px;
      }
    }
    .banner-main {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 35px 30px;
      @media (min-width: 992px) and (max-width: 1199px) {
        padding: 30px 20px;
      }
      @media (max-width: 767px) {
        padding: 15px;
      }
    }
    .banner-wrapper {
      display: inline-flex;
      align-items: center;
      border-right: 1px solid #F2F2F2;
      padding-right: 9px;
      @media (min-width: 992px) and (max-width: 1199px) {
        flex-direction: column;
        text-align: center;
        padding:0 10px;
      }
      @media (max-width: 991px) {
        width: 100%;
        border-bottom: 1px solid #F2F2F2;
        border-right: 0;
        padding-right: 0;
        padding-bottom: 20px;
        margin-bottom: 20px;
        &.banner-last {
          padding-bottom: 0;
          margin-bottom: 0;
        }
      }
      @media (max-width: 543px) {
        flex-direction: column;
        text-align: center;
      }
      .banner-image {
        margin-right: 20px;
        @media (min-width: 992px) and (max-width: 1199px) {
          margin: 0 0 20px 0;
        }
        @media (max-width: 543px) {
          margin: 0 0 20px 0;
        }
        img {
          max-height: 100px;
        }
      }
      .banner-info {
        flex: 1;
        text-align: left;
        @media (min-width: 992px) and (max-width: 1199px) {
          text-align: center;
        }
        @media (max-width: 543px) {
          text-align: center;
        }
        h3 {
          font-weight: 500;
          font-size: 24px;
          line-height: 28px;
          color: #000000;
          margin-bottom: 5px;
          @media (min-width: 1200px) {
            padding-right: 50px;
          }
        }
        p {
          margin: 10px 0 0;
          font-size: 16px;
          line-height: 26px;
          color: #6C7173;
        }
        a {
          display: block;
          margin-top: 10px;
          font-size: 14px;
          font-weight: bold;
          color: #088ACE;
        }
      }
    }
    .pick-up-section {
      background: url('https://storage.googleapis.com/content.ezadtv.com/2020/08/05/5f2b18eb5ef8a_bg-phone.png')no-repeat top center / cover;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px 50px;
      border-radius: 10px;
      @media (max-width: 767px) {
        flex-direction: column;
        justify-content: center;
      }
      @media (max-width: 543px) {
        padding: 20px 15px;
        text-align: center;
      }
      .pickup-text {
        display: flex;
        @media (max-width: 543px) {
          flex-flow: column nowrap;
          align-items: center;
        }
        .img-block {
          width: 58px;
          height: 58px;
        }
        span {
          margin-left: 30px;
          @media (max-width: 543px) {
            margin: 15px 0 0;
          }
          h4 {
            font-weight: bold;
            font-size: 24px;
            line-height: 28px;
            color: #FFFFFF;
            margin-bottom: 0;
            @media (max-width: 543px) {
              font-size: 20px;
            }
          }
          h5 {
            line-height: 28px;
            color: #FFFFFF;
            margin-bottom: 0;
            font-weight: normal;
          }
        }
      }
      button {
        width: 230px;
        border-radius: 25px;
        font-weight: bold;
        font-size: 18px;
        line-height: 50px;
        text-transform: uppercase;
        color: #000000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        @media (max-width: 767px) {
          margin-top: 15px;
          justify-content: center;
          img {
            margin-left: 20px;
          }
        }
      }
    }
    .product-item {
      display: flex;
      flex-flow: row wrap;
      flex:0 0 100%;
      max-width: 100%;
      .product-block {
        margin-bottom: 30px;
        .product-wrapper {
          background: #ffffff;
          padding: 30px;
          overflow: hidden;
          .product-description {
            text-align: left;
            padding-top: 10px;
            .product-title {
              font-weight: 600;
              font-size: 18px;
              line-height: 26px;
              color: #000000;
            }
            .product-text {
              font-size: 16px;
              line-height: 26px;
              color: #6C7173;
              margin: 8px 0 0;
            }
            .product-price {
              font-weight: bold;
              font-size: 24px;
              line-height: 28px;
              color: #DB0900;
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
  .swiper-slide {
    width: auto;
    height: 340px;
    > .discounted-item {
      margin: 0 !important;
    }
  }
  .swiper-button-disabled {
    opacity: 0;
  }
  @media (max-width: 766px) {
    .products-slider.swiper-container {
      margin: 0 !important;
    }
  }
  @media (max-width: 480px) {
    .swiper-wrapper {
      .swiper-slide {
        width: 100% !important;
        > .card {
          width: 100% !important;
          max-width: 230px;
          margin: 0 auto !important;
        }
      }
    }
    .swiper-button-next {
      right: 0;
    }
    .swiper-button-prev {
      left: 0;
    }
  }
</style>