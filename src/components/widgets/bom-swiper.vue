<template>
  <div class="position-relative swiper widget" :class="{'editable': editable}" v-if="widgetProducts">
    <div class="title flex-grow-1 d-flex align-items-center mb-3">
      <h4 class="mb-0">{{ title }}</h4>
      <div class="edit-buttons ml-3" v-if="editable">
        <a href="#" class="remove-bt" @click.prevent="remove" aria-label="Remove">
          <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-8 -7)" fill-rule="nonzero" fill="none"><circle fill="#E2E2E3" cx="15" cy="15" r="15"/><path d="M21 13v8c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2v-8h12zm-3-6c.6 0 1 .4 1 1v2h3v2H8v-2h3V8c0-.6.4-1 1-1zm-1 2h-4v1h4V9z" fill="#90939A"/></g></svg>
        </a>
      </div>
    </div>
    <div v-if="title || editable" class="d-flex align-items-center justify-between w-100 title-bar mb-3">
      <div class="flex-grow-1 d-flex align-items-center justify-content-center justify-content-sm-start text-center text-sm-left">
      </div>
      <div class="custom-control custom-switch ml-4" v-if="editable">
        <input type="checkbox" v-model="intLoop" class="custom-control-input" id="is-loop" @change="updateLoop">
        <label class="custom-control-label" for="is-loop">Loop</label>
      </div>
    </div>
    <div v-if="loading" class="loading-wrapper">
      <div class="spinner-border"></div>
    </div>
    <div class="position-relative swiper-container" @mouseenter="pauseLoop" @mouseleave="doLoop">
      <draggable :ref="`pDraggable-${id}`" class="row small-gutters" :list="swiperProducts" :group="`productSwiperGroup-${id}`" :disabled="!editable" @change="onReorder">
        <div :class="`col-6 col-sm-${12 / visibleItems} mb-2 swiper-slide`" v-for="(item, index) in swiperProducts" :key="`productswiper-${item.title}${index}`">
          <ProductItem :class="{ 'draggable-item' : editable }" :bom="true" :bom_hidden="item.bom_hidden" @toggleBom="toggleBom" :editable="editable" :item="item" :internal-api="internalApi" :add-start-stop-scroller="true" :show-add-cart="showAddCart" />
        </div>
      </draggable>
      <template v-if="visibleItems < widgetProducts.length">
        <div :ref="`product-swiper-${id}-prev`" class="swiper-button-prev" @click="prevPage" v-if="loop || currentPage > 1" />
        <div :ref="`product-swiper-${id}-next`" class="swiper-button-next" @click="nextPage" v-if="loop || currentPage < Math.ceil(widgetProducts.length / visibleItems)" />
      </template>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { debounce } from 'debounce';

export default {
  name: 'BomSwiper',
  props: {
    id: {
      default: null
    },
    products: {
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
    title: {
      default: ''
    },
    itemsToShow: {
      default: null
    },
    loop: {
      default: true
    },
    autoPlay: {
      default: null
    }
  },
  components: {
    draggable
  },
  data() {
    return {
      testList: [],
      intTitle: '',
      intLoop: true,
      loading: false,
      windowWidth: window.innerWidth,
      currentPage: 1,
      oneByOne: this.loop,
      loopInterval: null
    };
  },
  created() {
    this.intTitle = this.title;
    this.intLoop = this.loop;
    window.addEventListener('resize', () => this.windowWidth = window.innerWidth);
  },
  computed: {
    widgetProducts() {
      if(!this.products) return null;
      return this.editable ? this.products : this.products.filter(e => !e.bom_hidden);
    },
    lastPage() {
      return Math.ceil(this.widgetProducts.length / this.visibleItems);
    },
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
      ret = [...this.widgetProducts].slice(start, end);
      if(this.loop && this.visibleItems < this.widgetProducts.length) {
        ret = ret.concat([...this.widgetProducts].slice(0, this.visibleItems - ret.length));
      };
      return ret;
    }
  },
  async mounted() {
    this.doLoop();
  },
  methods: {
    onReorder() {
      this.$emit('onReorder', this.widgetProducts);
    },
    onAdd(selected) {
      this.$emit('onSelected', selected);
    },  
    remove() {
      this.$emit('remove');
    },
    toggleBom(item) {
      this.$emit('toggleBom', item);
    },
    prevPage() {
      this.currentPage = this.currentPage > 1 ? this.currentPage : this.widgetProducts.length + 1;
      this.currentPage = this.currentPage - 1;
      this.pauseLoop();
      this.doLoop();
    },
    nextPage() {
      let max = this.loop ? this.widgetProducts.length : Math.ceil(this.widgetProducts.length / this.visibleItems);
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
    }
  },
  watch: {
    intTitle: debounce(function(value) {
      this.$emit('updateTitle', value);
    }, 1500),
    visibleItems(val) {
      if(val >= this.widgetProducts.length) {
        this.currentPage = 1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .swiper.widget {
    min-height: 280px;
    margin-bottom: 30px;
    padding-bottom: 30px;
  }
  .swiper-container {
    overflow: visible;
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
    height: 320px;
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
  @media (max-width: 576px) {
    .widget-title {
      text-align: center;
    }
    .products-slider {
      margin: 0 -15px !important;
    }
    .swiper-slide {
      height: 260px;
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
  }
</style>

