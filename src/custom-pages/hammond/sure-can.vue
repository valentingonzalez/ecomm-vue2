<template>
  <div class="container page-wrapper pt-4 pr-4 pl-4">
    <h1 class="page-title">SureCan - The World's Best Gas Can!</h1>
    <div class="responsive-frame mb-4">
      <img style="width: 100% !important;" src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a0a02375d3_surecan-header.jpg"/>
    </div>
    <div class="row mb-5">
      <div class="content-block col-md-6">
        <p>There's a lot to dislike about standard gas cans. When used, they tend to drip their smelly contents all over our beloved gas-powered machines. They can also be dangerous because of leaked fuel and explosive gas vapors.</p>
      </div>
      <div class="content-block col-md-6">
        <p>Fortunately, someone came up with a better idea! The SureCan was introduced in 2014, and immediately started winning awards for its creative innovation. One need only look at it to see how much different the SureCan is from its messy predecessors. From its smart design to its ease of use to its safety-conscious operation, the SureCan has revolutionized the portable gas container world!</p>
      </div>
    </div>
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
    <div class="row mb-5">
      <div class="col-xs-12 col-lg-6 mb-sm-4">
        <iframe frameborder="0" allowfullscreen="1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title="YouTube video player" width="100%" height="360" src="https://www.youtube.com/embed/BCqO-Afhi1I?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A8080&amp;widgetid=1" id="widget2"></iframe>
      </div>
      <div class="col-xs-12 col-lg-6">
        <iframe frameborder="0" allowfullscreen="1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title="YouTube video player" width="100%" height="360" src="https://www.youtube.com/embed/8A5sOQ8cnPw?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A8080&amp;widgetid=1" id="widget2"></iframe>
      </div>
    </div>
    <div class="row mb-5">
      <div class="content-block col-md-6">
        <p>The SureCan's most noticeable feature is the spout. Unlike gas cans with spouts at the top, the SureCan's is at the bottom. No need to tip the gas can over to get the gas pouring - gravity takes care of that for you! The spout also rotates and is flexible, allowing you to keep the SureCan upright while directing the stream into even the most difficult fueling locations.</p>
      </div>
      <div class="content-block col-md-6">
        <p>Another notable difference is the lack of a venting cap. Traditional gas cans require this little tab to be opened to prevent gas from coming out in a choppy, sloshing mess. Newer models tried to put the vent in through the outflowing stream, but that just made the outflow really slow. With the SureCan, the vent is automatically opened when the thumb trigger is pressed, and closed when it's released. The trigger lock ensures that there's no way to forget to close the vent - a frequent source of evaporation and dangerous fumes.</p>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-xs-12 col-lg-9 mb-sm-4">
        <div class="responsive-frame mb-4">
          <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a0a3663eef_surecan-pic.jpg"/>
        </div>
      </div>
      <div class="col-xs-12 col-lg-3 text-center">
        <div class="service-description">
          <h3 class="text-left">Features:</h3>
          <ul>
            <li>Spout at the bottom</li>
            <li>Self-venting system</li>
            <li>Easy, one-handed use</li>
            <li>Flexible spout</li>
            <li>Spill-free operation</li>
            <li>Childproof spout cap</li>
            <li>Thumb trigger w/ lock</li>
            <li>100% built in the USA</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row mb-5">
      <div class="content-block col-md-12">
        <p>With its innovative design, rugged build, and intelligently designed safety features, we can't recommend the SureCan highly enough. Order yours from doitbest.com, or pick one up at your local Do it Best store!</p>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-xs-12 col-lg-6 mb-sm-4">
        <div class="responsive-frame mb-4">
          <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a0a5dbfce8_surecan-pic-2.jpg"/>
        </div>
      </div>
      <div class="col-xs-12 col-lg-6">
        <div class="responsive-frame mb-4">
          <img src="https://storage.googleapis.com/content.ezadtv.com/2020/08/04/5f2a0a70622ab_surecan-pic-3.jpg"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ProductApiService from '@/api-services/product.service';
  export default {
    name: 'GetTheSecret',
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
        let product = products.find( item => item.upc === '858173006011');
        if (product == null) {
          await ProductApiService.getProduct('858173006011').then(response => {
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
        product = products.find( item => item.upc === '864209000205');
        if (product == null) {
          await ProductApiService.getProduct('864209000205').then(response => {
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
        product = products.find( item => item.upc === '864209000212');
        if (product == null) {
          await ProductApiService.getProduct('864209000212').then(response => {
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
    .content-block {
      h2 {
        display: block;
        margin: 0 0 15px;
        font-weight: bold;
        font-size: 24px;
        line-height: 28px;
        color: #000000;
      }
      h3 {
        display: block;
        margin: 0;
        font-weight: 600;
        font-size: 18px;
        line-height: 21px;
        color: #6C7173;
      }
      p {
        color: #6C7173;
        font-size: 16px;
        line-height: 26px;
      }
    }
    .serving-section {
      display: flex;
      justify-content: flex-start;
      flex-flow: column nowrap;
      h2 {
        display: block;
        margin: 0 0 15px;
        font-weight: bold;
        font-size: 24px;
        line-height: 28px;
        color: #000000;
      }
      > p {
        color: #6C7173;
        font-weight: normal;
        font-size: 16px;
        line-height: 26px;
      }
      .config-wrapper {
        ul {
          padding-left: 0;
          display: flex;
          margin: 0;
          @media (max-width: 991px) {
            flex-flow: wrap;
          }
          li {
            list-style: none;
            background: #ffffff;
            height: 50px;
            border-radius: 25px;
            padding: 0 20px;
            margin-right: 15px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            &:last-child {
              margin-right: 0;
            }
            @media (max-width: 991px) {
              margin-bottom: 10px;
            }
            @media (max-width: 767px) {
              line-height: normal;
              align-items: center;
              display: flex;
              padding: 8px 15px;
            }
            @media (max-width: 480px) {
              width: 100%;
              margin-right: 0;
              justify-content: center;
              &:last-child {
                margin-bottom: 0;
              }
            }
            a {
              font-weight: 500;
              font-size: 18px;
              line-height: 21px;
              text-align: center;
              color: #000000;
              text-decoration: none;
              @media (max-width: 767px) {
                font-size: 14px;
                line-height: normal;
              }
            }
          }
        }
        h5 {
          font-size: 18px;
          line-height: 26px;
          text-align: center;
          color: #6C7173;
        }
      }
    }
    .banner-main {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 55px 40px;
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
        margin-right: 25px;
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
        padding-right: 35px;
        @media (max-width: 543px) {
          text-align: center;
          padding: 0;
        }
        h3 {
          font-weight: 600;
          font-size: 24px;
          line-height: 28px;
          color: #000000;
          margin-bottom: 4px;
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
      display: flex;
      flex-flow: column nowrap;
      height: 100%;
      justify-content: left;
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
        font-weight: normal;
      }
      .service-text {
        color: #6C7173;
        font-size: 18px;
        line-height: 26px;
        font-weight: 500;
      }
      ul {
        &.service-list-block {
          margin-top: 20px;
          display: block;
          li {
            font-size: 18px;
            line-height: 21px;
            color: #000000;
            font-weight: 600;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
</style>