<template>
  <div class="container pt-3 pl-4 pr-4">
    <h2 class="page-title text-center">The Only Authorized Toro Service Center In Jackson, MI</h2>
    <div class="mb-4">
      <iframe frameborder="0" allowfullscreen="1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title="YouTube video player" width="100%" height="360" src="https://www.youtube.com/embed/TknP1V51RcQ?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A8080&amp;widgetid=1" id="widget2"></iframe>
    </div>
    <div class="row mb-4">
      <div class="col-12">
        <div class="dealer-info">
          <h3 class="text-center mb-0"><img class="authorized-icon mr-2" src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a06b291a7c_authorized_toro_icon.png"/>Jackson County's Authorized Toro Dealer For Toro Lawn Mowers & Snow Blowers </h3>
        </div>
      </div>
    </div>
    <div class="banner-main mb-5">
      <div class="row justify-content-between">
        <div @click="heroesRedirection" class="col-xs-12 col-lg-6 cursor-pointer">
          <div class="banner-wrapper">
            <div class="banner-image mb-3">
              <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a068c9e8bc_businessman_echo.png"/>
            </div>
            <div class="banner-info">
              <h3>Want Piece Of Mind?</h3>
              <p>Toro & Echo Factory Authorized Parts & Service. Factory Trained Technicians give you
                the security & piece of mind your equipment is fixed right</p>
            </div>
          </div>
        </div>
        <div @click="secretSauceRedirection"  class="col-xs-12 col-lg-6 cursor-pointer">
          <div class="banner-wrapper border-0 banner-two">
            <div class="banner-image mb-4">
              <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a064ca4b99_fuel_station_echo.png"/>
            </div>
            <div class="banner-info">
              <h3>The Secret Sauce?</h3>
              <p>See how regular pump gas ruins your equipment. Get better longevity & performance
                with Pure Gas. Your equipment will thank you!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-xs-12 col-lg-6">
        <div class="service-image">
          <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a0614323b7_toro_lawn_hero.jpg"/>
        </div>
      </div>
      <div class="col-xs-12 col-lg-6">
        <div class="service-description">
          <h3 class="text-left">
            Serving Vandercook Lake, Brooklyn & Jackson, MI
            <br>
            Delivery & Pickup Available
          </h3>
          <p>Every Toro Lawn Mower purchased from Hammond Hardware includes full concierge
            service!</p>
          <ul>
            <li><a>Free Assembly & Loading On Your Truck/Trailer</a></li>
            <li><a>Free Prep including Oil & Gas Plus Test Starting</a></li>
            <li><a> Delivery Available - Limited Area & Added Fee</a></li>
            <li><a> Preferred Warranty Service - Quick Turnaround</a></li>
          </ul>
          <p>Plus service after the sale which includes Factory Trained & Certified Service plus
            Genuine Toro Parts in stock Only at Hammond Hardware, Jackson!</p>
        </div>
      </div>
    </div>
    <!-- <div class="row">
      <div class="col-xs-12 col-lg-6">
        <div class="product-card-wrapper">
          <div class="card-image">
            <img src="images/info_pages/toro_mower.jpg"/>
          </div>
          <div class="card-info">
            <h3 class="cursor-pointer" @click="moveToMowersPage">Cut Above The Rest</h3>
            <p>Check out our complete inventory of Toro Lawn Mowers</p>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-lg-6">
        <div class="product-card-wrapper">
          <div class="card-image">
            <img src="images/info_pages/toro_snow_80x80.jpg"/>
          </div>
          <div class="card-info">
            <h3 class="cursor-pointer" @click="moveToExternalLink">Easy Start. Everytime.</h3>
            <p>See How Toro Snowblowers Make Winter Work Less Stressful.</p>
          </div>
        </div>
      </div>
    </div> -->
    <div v-if="!productsFetched" class="loader-wrapper">
      <img src="/icons/loader.gif" class="loader">
    </div>
    <div v-else class="row">
      <div class="w-100 mb-4">
        <div class="position-relative">
          <template>
            <swiper ref="similarProductsSwiper" class="products-slider" :options="swiperOptions">
              <swiper-slide v-for="(item, index) in sliderProducts" :key="'similar-products-' + index">
                <ProductItem :item="item" :internal-api="false" :add-start-stop-scroller="true" @stop-autoplay="stopAutoplay" @start-autoplay="startAutoplay"/>
              </swiper-slide>
            </swiper>
            <div class="swiper-button-prev" id="similar-swiper-button-prev" slot="button-prev" />
            <div class="swiper-button-next" id="similar-swiper-button-next" slot="button-next" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ProductApiService from '@/api-services/product.service';
//   import { playerConfig } from '@/config/modules';
  export default {
    name: 'ToroDealer',
    data() {
      return {
        sliderProducts: [],
        productsFetched: false,
        swiperOptions: {
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
          }
        }
      };
    },
    methods: {
      stopAutoplay() {
        this.$refs.productsSwiper.swiper.autoplay.stop();
      },
      startAutoplay() {
        this.$refs.productsSwiper.swiper.autoplay.start();
      },
      async fetchProducts() {
        let products = this.$store.state.products;
        let product = products.find( item => item.upc === '021038516172');
        if (product == null) {
          await ProductApiService.getProduct('021038516172').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.sliderProducts.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.sliderProducts.push(product);
        }
        let allSKUs = [];
        this.sliderProducts.forEach(item => {
          allSKUs.push(item.sku);
        });
        this.productsFetched = true;
      },
      moveToExternalLink() {
        window.open("https://401791.go.toro.com/s/showcase/168/toro/4174/", '_blank');
      },
      secretSauceRedirection() {
        this.$router.push("/get-the-secret");
      },
      heroesRedirection() {
        this.$router.push("/small-engine-repair");
      }
    },
    async mounted() {
      this.fetchProducts();
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
    .dealer-info {
      h3 {
        display: block;
        margin: 0 0 15px;
        font-size: 18px;
        font-weight: normal;
        line-height: 21px;
        color: #088ACE;
      }
      .authorized-icon {
        max-height: 20px;
        margin-right: 8px;
      }
    }
    .banner-main {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 50px 40px;
      @media (max-width: 767px) {
        padding: 15px;
      }
    }
    .banner-wrapper {
      display: inline-flex;
      align-items: center;
      border-right: 1px solid #F2F2F2;
      @media (max-width: 991px) {
        border-bottom: 1px solid #F2F2F2;
        border-right: 0;
        padding-bottom: 15px;
        margin-bottom: 15px;
        &.banner-two {
          padding: 0;
          margin: 0;
        }
      }
      @media (max-width: 543px) {
        flex-direction: column;
      }
      .banner-image {
        margin-right: 20px;
        @media (max-width: 543px) {
          margin-right: 0;
          margin-bottom: 20px;
        }
        img {
          max-height: 100px;
        }
      }
      .banner-info {
        flex: 1;
        text-align: left;
        padding-right: 20px;
        @media (max-width: 543px) {
          text-align: center;
          padding: 0;
        }
        h3 {
          font-weight: 600;
          font-size: 24px;
          line-height: 28px;
          color: #000000;
          margin-bottom: 5px;
        }
        p {
          margin: 0;
          font-size: 16px;
          line-height: 26px;
          color: #6C7173;
        }
      }
    }
    .service-description {
      @media (max-width: 991px) {
        margin-top: 20px;
      }
      h3 {
        display: block;
        margin: 0 0 15px;
        font-weight: bold;
        font-size: 18px;
        line-height: 21px;
        color: #000000;
      }
      p {
        margin: 0 0 15px;
        color: #6C7173;
        font-size: 16px;
        line-height: 26px;
      }
      ul {
        margin: 0 0 15px 20px;
        padding: 0;
        li {
          > a {
            font-size: 16px;
            line-height: 36px;
            font-weight: bold;
          }
        }
      }
      ul, a {
        color: #088ACE;
        font-weight: bold;
      }
    }
    .service-image {
      img {
        width: 100%;
      }
    }
    .product-card-wrapper {
      display: inline-flex;
      align-items: center;
      background: #ffffff;
      padding: 20px;
      @media (max-width: 991px) {
        width: 100%;
        margin-bottom: 20px;
      }
      @media (max-width: 543px) {
        flex-direction: column;
      }
      .card-image {
        margin-right: 20px;
        border:1px solid #E2E2E2;
        padding: 10px;
        @media (max-width: 543px) {
          margin-right: 0;
          margin-bottom: 20px;
        }
      }
      .card-info {
        flex: 1;
        text-align: left;
        padding-right: 20px;
        @media (max-width: 543px) {
          text-align: center;
          padding: 0;
        }
        h3 {
          font-weight: 600;
          font-size: 24px;
          line-height: 28px;
          color: #000000;
          margin-bottom: 5px;
        }
        p {
          margin: 0;
          font-size: 16px;
          line-height: 26px;
          color: #6C7173;
        }
      }
    }
  }
</style>