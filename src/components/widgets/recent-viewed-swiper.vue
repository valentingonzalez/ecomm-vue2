<template>
  <div class="widget" v-if="editable || products && products.length > 0">
    <WidgetHeader name="Recently Viewed Products" :id="id" @remove="remove" @updateHidden="updateHidden" :hidden="hidden" :master="master" @updateAssociatedLocations="updateAssociatedLocations" :associatedLocations="associatedLocations" v-if="editable" />
    <div class="d-flex align-items-center justify-between w-100 title-bar mb-3">
      <div class="flex-grow-1 d-flex align-items-center justify-content-center justify-content-sm-start text-center text-sm-left">
        <input v-if="editable" class="form-control mr-5" placeholder="Title for the swiper (optional)" v-model="intTitle" />
        <h4 class="mb-0" v-else-if="title" v-html="title" />
        <h4 v-else class="mb-0">Recently Viewed Products</h4>
      </div>
      <div class="custom-control custom-switch ml-4" v-if="editable">
        <input type="checkbox" v-model="intLoop" class="custom-control-input" :id="`is-loop${id}`" @change="updateLoop">
        <label class="custom-control-label" :for="`is-loop${id}`">Loop</label>
      </div>
    </div>
    <div class="position-relative swiper" :class="{'editable': editable}" v-if="editable || loading || (products && products.length)">
      <div v-if="!loading && editable && (!products || (products && !products.length))" class="no-products">
        There are no recently viewed products.
      </div>
      <div v-if="loading" class="loading-wrapper">
        <div class="spinner-border"></div>
      </div>
      <div v-if="products && products.length" class="position-relative swiper-container overflow-visible" @mouseenter="pauseLoop" @mouseleave="doLoop">
        <div :ref="`featuredProductsSlider-${id}`" class="row small-gutters" :id="`featuredProductsSlider-${id}`" :class="{'d-none' : loading}">
          <div :class="`col-6 col-sm-${12 / visibleItems} mb-2 swiper-slide`" v-for="(item, index) in swiperProducts" :key="`productswiper-${item.title}${index}`">
            <product-item :item="item" :internal-api="internalApi" :add-start-stop-scroller="true" :show-add-cart="showAddCart" />
          </div>
        </div>
      </div>
      <template v-if="products && visibleItems < products.length">
        <div :class="`swiper-button-prev feat-product-swiper-${id}-prev`" @click="prevPage" v-if="loop || currentPage > 1" />
        <div :class="`swiper-button-next feat-product-swiper-${id}-next`" @click="nextPage" v-if="loop || currentPage < Math.ceil(products.length / visibleItems)" />
      </template>
    </div>
  </div>
</template>

<script>
import { debounce } from 'debounce';
import ProductApiService from '@/api-services/product.service';

export default {
  name: 'RecentViewedSwiper',
  props: {
    id: {
      default: null
    },
    internalApi: {
      default: false
    },
    showAddCart: {
      default: true
    },
    editable: {
      default: false
    },
    itemsToShow: {
      default: null
    },
    autoPlay: {
      default: null
    },
    loop: {
      default: false
    },
    master: {
      default: false
    },
    hidden: {
      default: true
    },
    title: {
      default: ""
    },
    associatedLocations: {
      default: null
    }    
  },
  data() {
    return {
      loading: true,
      windowWidth: window.innerWidth,
      currentPage: 1,
      oneByOne: this.loop,
      intLoop: true,
      intTitle: '',
      products: []
    };
  },
  created() {
    this.intTitle = this.title ? this.title : '';
    this.intLoop = this.loop;
    window.addEventListener('resize', () => this.windowWidth = window.innerWidth);
  },
  computed: {
    visibleItems() {
      return this.itemsToShow ? this.itemsToShow
           : this.windowWidth > 1200 ? 6
           : this.windowWidth > 992  ? 4
           : this.windowWidth > 768  ? 3
           : this.windowWidth > 577  ? 2
           :                           2;
    },
    options() {
      return this.$store.state.homepage.find(x => x.widget_type === this.type);
    },
    swiperProducts() {
      let ret = [];
      let start, end = 0;
      if(!this.oneByOne) {
        start = (this.currentPage - 1) * this.visibleItems;
        end = this.currentPage * this.visibleItems;
      } else {
        start = this.currentPage - 1;
        end = this.visibleItems + this.currentPage - 1;
      }
      ret = [...this.products].slice(start, end);
      if(this.loop && this.visibleItems < this.products.length) {
        ret = ret.concat([...this.products].slice(0, this.visibleItems - ret.length));
      }
      return ret;
    }
  },
  async mounted() {
    await this.$store.dispatch('recentViewedItems');
    
    if(this.$store.state.recentVieweditems && this.$store.state.recentVieweditems.length > 0) {
        this.loading = true;
        let randomProducts = await ProductApiService.getRecentViewedProductsData({ product_ids: this.$store.state.recentVieweditems });
        this.products = randomProducts.data.products;
    }
    this.loading = false;
    this.doLoop();
  },
  methods: {
    remove() {
      this.$emit('remove');
    },
    prevPage() {
      this.currentPage = this.currentPage > 1 ? this.currentPage : this.products.length + 1;
      this.currentPage = this.currentPage - 1;
      this.pauseLoop();
      this.doLoop();
    },
    nextPage() {
      let max = this.loop ? this.products.length : Math.ceil(this.products.length / this.visibleItems);
      this.currentPage = this.currentPage < max ? this.currentPage : 0;
      this.currentPage = this.currentPage + 1;
      this.pauseLoop();
      this.doLoop();
    },
    doLoop() {
      if(this.autoPlay && this.visibleItems < this.swiperProducts.length)
        this.loopInterval = setInterval(() => this.nextPage(), this.autoPlay);
    },
    pauseLoop() {
      this.autoPlay && clearInterval(this.loopInterval);
    },
    updateLoop() {
      this.currentPage = 1;
      this.oneByOne = this.intLoop;
      this.$emit('updateLoop', this.intLoop);
    },
    updateHidden(val) {
      this.$emit('updateHidden', val);
    },
    updateAssociatedLocations(val) {
      this.$emit('updateAssociatedLocations', val);
    }
  },
  watch: {
    visibleItems(val) {
      if(val >= this.swiperProducts.length) {
        this.currentPage = 1;
      }
    },
    intTitle: debounce(function(value) {
      this.$emit('updateTitle', value);
    }, 1500)
  }
};
</script>


<style lang="scss" scoped>
  .swiper {
    min-height: 340px;
  }
  .swiper.widget {
    min-height: 280px;
    margin-bottom: 30px;
    padding-bottom: 30px;
  }
  .swiper-container {
    overflow: visible;
    min-height: 332px;
  }
  .swiper-slide {
    animation: fadein .3s linear 1 normal forwards;
    opacity: 0;
    &:nth-child(2) {
      animation-delay: .05s;
    }
    &:nth-child(3) {
      animation-delay: .1s;
    }
    &:nth-child(4) {
      animation-delay: .15s;
    }
    &:nth-child(5) {
      animation-delay: .2s;
    }
    &:nth-child(6) {
      animation-delay: .25s;
    }
  }
  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .products-slider .swiper-wrapper {
    padding-bottom: 20px;
  }
  :deep(.draggable-item a.card) {
    cursor: move;
  }
  :deep(.search-wrapper) {
    width: 300px;
    input {
      width: 100%;
      font-size: 14px;
    }
    .autosuggest__results {
      width: 400px;
      right: 0;
      .autosuggest__results_item {
        font-size: 14px;
      }
    }
    .search-suggestion-footer {
      display: none;
    }
  }
  .widget-title {
    font-weight: bold;
  }
 .swiper-slide {
    width: auto !important;
    min-height: 332px;
height: auto;
  }
  .swiper-button-disabled {
    opacity: 0;
  }

  .no-products {
    border: 1px dashed #ef8c8c;
    background: #fff6f6;
    top: 20px;
    height: 250px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .loading-wrapper {
    top: 20px;
    height: 250px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media (max-width: 1500px) {
    .swiper-container {
      padding: 0 40px;
    }
  }
  @media (max-width: 575px) {
    .swiper {
      min-height: 288px;
    }
    .swiper-container {
      padding: 0 12px;
      height: 288px;
    }
    .swiper-button-prev,
    .swiper-button-next {
      width: 32px;
      top: calc(50% - 16px);
    }
    .widget-title {
      text-align: center;
    }
    .products-slider {
      margin: 0 -15px !important;
    }
    .swiper-slide {
      height: 288px;

      :deep(.card) {
        margin: 0 auto !important;
        border-radius: 0;
        .button-prev,
        .button-next {
          display: none;
        }
        :deep(.product) {
          border-right: 1px solid #f3f3f3;
          .badge.badge-danger {
            padding: 0;
            height: auto;
            background: none;
            color: #dc3545;
            letter-spacing: -.4px;
          }
          .small-text {
            font-size: 12px;
            text-transform: uppercase;
          }
          .add-to-cart {
            .q {
              min-width: 24px;
              height: 24px;
              svg {
                transform: scale(.9);
              }
            }
          }
          img.product-image {
            margin-bottom: 0;
            max-height: 110px;
          }
          h6 {
            font-size: 12px;
            margin-bottom: 36px;
          }
        }
      }
    }


    :deep(.product) {
      .badge {
        padding: 4px 4px;
        height: auto;
        margin-top: 1px;

        > span {
          margin-right: 4px;
        }
      }
    }
  }
</style>

