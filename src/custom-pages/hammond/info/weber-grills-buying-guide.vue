<template>
  <div class="page-wrapper">
    <h1 class="page-title">Weber Grills Buying Guide</h1>
    <div class="responsive-frame mb-5">
      <img src="images/info_pages/banner_weber.png"/>
    </div>

    <div class="row mb-5">
      <div class="col-xs-12 col-lg-6 mb-sm-4">
        <div class="service-image">
          <img src="images/info_pages/george_buying.png"/>
        </div>
      </div>
      <div class="col-xs-12 col-lg-6">
        <div class="service-description">
          <h3>George Stephen Has an Idea</h3>
          <p>While a guy named George was making marine buoys at his job working for Weber Brothers Metal Works,
            he came up with the idea of a dome-shaped grill. It was 1952,
            and at the time the idea of a covered grill was pretty revolutionary!
            That first grill was called "George's Barbecue Kettle." Seven years later,
            George bought Weber Brothers and a new era of barbecuing was born.</p>
          <h3>From Innovation Leader to an American Fixture</h3>
          <p>Weber grills continued to innovate, using stainless steel construction,
            making Flavorizer® bars, and creating porcelain-enameled cooking grates. The first Genesis® grill was unveiled in 1985,
            followed by the Summit® series in the mid-1990s, and the portable Q® series in 2003. Over the years, Weber grills have become
            not just tools for cooking food, but grills that bring people together.</p>
        </div>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-12">
        <h2 class="service-title text-center">Genesis II Series</h2>
      </div>
      <div class="col-xs-12 col-lg-6">
        <div class="service-description">
          <h3>The Evolution of Gas Grilling</h3>
          <p>The Weber Genesis II series is built to gather family, friends, even the whole neighborhood, together.
            These grills are the newest addition to the Weber line, and we believe they're superior to every other grill in its class.
            Genesis II grills feature the latest in Weber technology, including the exclusive GS4 grilling system.
            Ranging in size from two to six stainless steel burners, there’s a Genesis II grill built for however many people you entertain.</p>
        </div>
      </div>
      <div class="col-xs-12 col-lg-6">
        <div class="service-image">
          <img src="images/info_pages/evolution_buying.png"/>
        </div>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-xs-12 col-lg-6 mb-sm-4">
        <div class="service-image">
          <img src="images/info_pages/george_buying.png"/>
        </div>
      </div>
      <div class="col-xs-12 col-lg-6">
        <div class="service-description">
          <h3>All Weber Genesis II grills feature:</h3>
          <ul>
            <li>The GS4 high performance grilling system, which includes Infinity Ignition and high performance burners, Flavorizer bars, and grease management system</li>
            <li>iGrill 3 technology, allowing you to monitor food right from your phone</li>
            <li>built-in lid thermometer</li>
            <li>stainless steel side tables and heat deflectors</li>
          </ul>
          <p>The LX S models feature closed cabinets, whereas the E models offer an open cart design.</p>
          <p>The lid, Flavorizer bars, and cooking grates on the LX S models are stainless steel, while on the E models they are porcelain-enameled.</p>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <iframe frameborder="0" allowfullscreen="1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title="YouTube video player" width="100%" height="360" src="https://www.youtube.com/embed/w_c5lSY9cIY?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A8080&amp;widgetid=1" id="widget2"></iframe>
    </div>

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
  </div>
</template>

<script>
  import ProductApiService from '@/api-services/product.service';

  export default {
    name: 'WeberGrillsBuyingGuide',
    data() {
      return {
        grillProducts: [],
        productsFetched: false
      };
    },
    methods: {
      stopAutoplay() {
        this.$refs.productsSwiper.swiper.autoplay.stop();
      },
      startAutoplay() {
        this.$refs.productsSwiper.swiper.autoplay.start();
      },
      async fetchData() {
        let products = this.$store.state.products;
        let product = products.find( item => item.upc === '077924002830');

        if (product == null) {
          await ProductApiService.getProduct('077924002830').then(response => {
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

        product = products.find( item => item.upc === '077924032356');

        if (product == null) {
          await ProductApiService.getProduct('077924032356').then(response => {
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

        // product = products.find( item => item.upc === '077924089909');

        // if (product == null) {
        //   await ProductApiService.getProduct('077924089909').then(response => {
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

        // product = products.find( item => item.upc === '077924083754');

        // if (product == null) {
        //   await ProductApiService.getProduct('077924083754').then(response => {
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

        // product = products.find( item => item.upc === '077924058516');

        // if (product == null) {
        //   await ProductApiService.getProduct('077924058516').then(response => {
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

        product = products.find( item => item.upc === '077924028465');

        if (product == null) {
          await ProductApiService.getProduct('077924028465').then(response => {
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

        // product = products.find( item => item.upc === '047362337139');

        // if (product == null) {
        //   await ProductApiService.getProduct('047362337139').then(response => {
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

        let allSKUs = [];
        this.grillProducts.forEach(item => {
          allSKUs.push(item.sku);
        });

        if (allSKUs.length) {
          ProductApiService.getCompetitorsForSKUList(allSKUs).then(
            response => {
              this.$store.commit('setMultiCompetitors', response.data.data);
            }
          );
        }

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
