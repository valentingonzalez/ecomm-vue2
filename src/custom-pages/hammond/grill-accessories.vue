<template>
  <div class="container page-wrapper pt-3 pl-4 pr-4">
    <h1 class="page-title">Tongs</h1>
    <div v-if="!tongsFetched" class="loader-wrapper">
      <img src="/icons/loader.gif" class="loader">
    </div>
    <div v-else class="row">
      <div class="w-100 mb-4">
        <div class="position-relative">
          <template>
            <swiper ref="similarProductsSwiper" class="products-slider" :options="swiperOptions">
              <swiper-slide v-for="(item, index) in tongs" :key="'similar-products-' + index">
                <ProductItem :item="item" :internal-api="false" :add-start-stop-scroller="true" @stop-autoplay="stopAutoplay" @start-autoplay="startAutoplay"/>
              </swiper-slide>
            </swiper>
            <div class="swiper-button-prev" id="similar-swiper-button-prev" slot="button-prev" />
            <div class="swiper-button-next" id="similar-swiper-button-next" slot="button-next" />
          </template>
        </div>
      </div>
    </div>
    <h1 class="page-title">Woks</h1>
    <div v-if="!woksFetched" class="loader-wrapper">
      <img src="/icons/loader.gif" class="loader">
    </div>
    <div v-else class="row">
      <div class="w-100 mb-4">
        <div class="position-relative">
          <template>
            <swiper ref="similarProductsSwiper" class="products-slider" :options="swiperOptions">
              <swiper-slide v-for="(item, index) in woks" :key="'similar-products-' + index">
                <ProductItem :item="item" :internal-api="false" :add-start-stop-scroller="true" @stop-autoplay="stopAutoplay" @start-autoplay="startAutoplay"/>
              </swiper-slide>
            </swiper>
            <div class="swiper-button-prev" id="similar-swiper-button-prev" slot="button-prev" />
            <div class="swiper-button-next" id="similar-swiper-button-next" slot="button-next" />
          </template>
        </div>
      </div>
    </div>
    <h1 class="page-title">Injectors</h1>
    <div v-if="!injectorsFetched" class="loader-wrapper">
      <img src="/icons/loader.gif" class="loader">
    </div>
    <div v-else class="row">
      <div class="w-100 mb-4">
        <div class="position-relative">
          <template>
            <swiper ref="similarProductsSwiper" class="products-slider" :options="swiperOptions">
              <swiper-slide v-for="(item, index) in injectors" :key="'similar-products-' + index">
                <ProductItem :item="item" :internal-api="false" :add-start-stop-scroller="true" @stop-autoplay="stopAutoplay" @start-autoplay="startAutoplay"/>
              </swiper-slide>
            </swiper>
            <div class="swiper-button-prev" id="similar-swiper-button-prev" slot="button-prev" />
            <div class="swiper-button-next" id="similar-swiper-button-next" slot="button-next" />
          </template>
        </div>
      </div>
    </div>
    <h1 class="page-title">Racks & cookers</h1>
    <div v-if="!rackAndCookersFetched" class="loader-wrapper">
      <img src="/icons/loader.gif" class="loader">
    </div>
    <div v-else class="row">
      <div class="w-100 mb-4">
        <div class="position-relative">
          <template>
            <swiper ref="similarProductsSwiper" class="products-slider" :options="swiperOptions">
              <swiper-slide v-for="(item, index) in rackAndCookers" :key="'similar-products-' + index">
                <ProductItem :item="item" :internal-api="false" :add-start-stop-scroller="true" @stop-autoplay="stopAutoplay" @start-autoplay="startAutoplay"/>
              </swiper-slide>
            </swiper>
            <div class="swiper-button-prev" id="similar-swiper-button-prev" slot="button-prev" />
            <div class="swiper-button-next" id="similar-swiper-button-next" slot="button-next" />
          </template>
        </div>
      </div>
    </div>
    <h1 class="page-title">Thermometers</h1>
    <div v-if="!thermometersFetched" class="loader-wrapper">
      <img src="/icons/loader.gif" class="loader">
    </div>
    <div v-else class="row">
      <div class="w-100 mb-4">
        <div class="position-relative">
          <template>
            <swiper ref="similarProductsSwiper" class="products-slider" :options="swiperOptions">
              <swiper-slide v-for="(item, index) in thermometers" :key="'similar-products-' + index">
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
  export default {
    name: 'WeberGrillsBuyingGuide',
    data() {
      return {
        tongs: [],
        tongsFetched: false,
        woks: [],
        woksFetched: false,
        injectors: [],
        injectorsFetched: false,
        rackAndCookers: [],
        rackAndCookersFetched: false,
        thermometers: [],
        thermometersFetched: false,
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
      async fetchTongs() {
        let products = this.$store.state.products;
        let product = products.find( item => item.upc === '060162643125');
        if (product == null) {
          await ProductApiService.getProduct('060162643125').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.tongs.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.tongs.push(product);
        }
        product = products.find( item => item.upc === '077924022388');
        if (product == null) {
          await ProductApiService.getProduct('077924022388').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.tongs.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.tongs.push(product);
        }
        product = products.find( item => item.upc === '060162640322');
        if (product == null) {
          await ProductApiService.getProduct('060162640322').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.tongs.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.tongs.push(product);
        }
        product = products.find( item => item.upc === '077924011801');
        if (product == null) {
          await ProductApiService.getProduct('077924011801').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.tongs.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.tongs.push(product);
        }
        product = products.find( item => item.upc === '077924011382');
        if (product == null) {
          await ProductApiService.getProduct('077924011382').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.tongs.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.tongs.push(product);
        }
        product = products.find( item => item.upc === '077924011795');
        if (product == null) {
          await ProductApiService.getProduct('077924011795').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.tongs.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.tongs.push(product);
        }
        let allSKUs = [];
        this.tongs.forEach(item => {
          allSKUs.push(item.sku);
        });
        this.tongsFetched = true;
      },
      async fetchWoks() {
        let products = this.$store.state.products;
        let product = products.find( item => item.sku === '0556894');
        if (product == null) {
          await ProductApiService.getProduct('0556894').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.woks.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.woks.push(product);
        }
        product = products.find( item => item.sku === '69470');
        if (product == null) {
          await ProductApiService.getProduct('69470').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.woks.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.woks.push(product);
        }
        product = products.find( item => item.sku === '69818');
        if (product == null) {
          await ProductApiService.getProduct('69818').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.woks.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.woks.push(product);
        }
        product = products.find( item => item.sku === '7422');
        if (product == null) {
          await ProductApiService.getProduct('7422').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.woks.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.woks.push(product);
        }
        let allSKUs = [];
        this.woks.forEach(item => {
          allSKUs.push(item.sku);
        });
        this.woksFetched = true;
      },
      async fetchInjectors() {
        let products = this.$store.state.products;
        let product = products.find( item => item.sku === '61495');
        if (product == null) {
          await ProductApiService.getProduct('61495').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.injectors.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.injectors.push(product);
        }
        product = products.find( item => item.sku === '6645048');
        if (product == null) {
          await ProductApiService.getProduct('6645048').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.injectors.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.injectors.push(product);
        }
        product = products.find( item => item.sku === '583839');
        if (product == null) {
          await ProductApiService.getProduct('583839').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.injectors.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.injectors.push(product);
        }
        product = products.find( item => item.sku === '573150');
        if (product == null) {
          await ProductApiService.getProduct('573150').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.injectors.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.injectors.push(product);
        }
        product = products.find( item => item.sku === '786849');
        if (product == null) {
          await ProductApiService.getProduct('786849').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.injectors.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.injectors.push(product);
        }
        let allSKUs = [];
        this.injectors.forEach(item => {
          allSKUs.push(item.sku);
        });
        this.injectorsFetched = true;
      },
      async fetchRackAndCookers() {
        let products = this.$store.state.products;
        let product = products.find( item => item.upc === '060162626029');
        if (product == null) {
          await ProductApiService.getProduct('060162626029').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.rackAndCookers.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.rackAndCookers.push(product);
        }
        product = products.find( item => item.upc === '077924010835');
        if (product == null) {
          await ProductApiService.getProduct('077924010835').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.rackAndCookers.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.rackAndCookers.push(product);
        }
        product = products.find( item => item.upc === '077924021374');
        if (product == null) {
          await ProductApiService.getProduct('077924021374').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.rackAndCookers.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.rackAndCookers.push(product);
        }
        product = products.find( item => item.upc === '077924032943');
        if (product == null) {
          await ProductApiService.getProduct('077924032943').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.rackAndCookers.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.rackAndCookers.push(product);
        }
        product = products.find( item => item.upc === '060162642333');
        if (product == null) {
          await ProductApiService.getProduct('060162642333').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.rackAndCookers.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.rackAndCookers.push(product);
        }
        product = products.find( item => item.upc === '060162641527');
        if (product == null) {
          await ProductApiService.getProduct('060162641527').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.rackAndCookers.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.rackAndCookers.push(product);
        }
        product = products.find( item => item.upc === '077924074059');
        if (product == null) {
          await ProductApiService.getProduct('077924074059').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.rackAndCookers.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.rackAndCookers.push(product);
        }
        product = products.find( item => item.upc === '077924074066');
        if (product == null) {
          await ProductApiService.getProduct('077924074066').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.rackAndCookers.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.rackAndCookers.push(product);
        }
        let allSKUs = [];
        this.rackAndCookers.forEach(item => {
          allSKUs.push(item.sku);
        });
        this.rackAndCookersFetched = true;
      },
      async fetchThermometers() {
        let products = this.$store.state.products;
        let product = products.find( item => item.upc === '077784351208');
        if (product == null) {
          await ProductApiService.getProduct('077784351208').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.thermometers.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.thermometers.push(product);
        }
        product = products.find( item => item.upc === '077924019517');
        if (product == null) {
          await ProductApiService.getProduct('077924019517').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.thermometers.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.thermometers.push(product);
        }
        product = products.find( item => item.upc === '060162611353');
        if (product == null) {
          await ProductApiService.getProduct('060162611353').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.thermometers.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.thermometers.push(product);
        }
        product = products.find( item => item.upc === '077924052132');
        if (product == null) {
          await ProductApiService.getProduct('077924052132').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.thermometers.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.thermometers.push(product);
        }
        product = products.find( item => item.upc === '072397002783');
        if (product == null) {
          await ProductApiService.getProduct('072397002783').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.thermometers.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.thermometers.push(product);
        }
        product = products.find( item => item.upc === '077924019005');
        if (product == null) {
          await ProductApiService.getProduct('077924019005').then(response => {
            product = response.data.data;
            product.competitors = null;
            product.similars = null;
            product.videos = null;
            this.thermometers.push(product);
            this.$store.commit('addProduct', product);
          });
        } else {
          this.thermometers.push(product);
        }
        let allSKUs = [];
        this.thermometers.forEach(item => {
          allSKUs.push(item.sku);
        });
        this.thermometersFetched = true;
      }
    },
    async mounted() {
      this.fetchTongs();
      this.fetchWoks();
      this.fetchInjectors();
      this.fetchRackAndCookers();
      this.fetchThermometers();
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
    .service-title {
      font-weight: bold;
      font-size: 24px;
      line-height: 28px;
      color: #000000;
      margin-bottom: 50px;
    }
    .service-description {
      display: flex;
      flex-flow: column nowrap;
      height: 100%;
      justify-content: center;
      align-items: flex-start;
      h2 {
        font-weight: bold;
        font-size: 24px;
        line-height: 28px;
        color: #000000;
        margin-bottom: 10px;
      }
      h3 {
        display: block;
        margin: 0 0 15px;
        font-weight: 600;
        font-size: 18px;
        line-height: 21px;
        color: #000000;
      }
      p {
        margin: 0 0 15px;
        color: #6C7173;
        font-size: 16px;
        line-height: 26px;
        font-weight: normal;
      }
      .service-text {
        color: #6C7173;
        font-size: 18px;
        line-height: 26px;
        font-weight: 500;
      }
      ul {
        margin: 0 0 15px 20px;
        padding: 0;
        li {
          font-weight: normal;
          font-size: 16px;
          line-height: 26px;
          color: #6C7173;
          margin-bottom: 10px;
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