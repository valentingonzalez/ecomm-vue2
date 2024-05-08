<template>
  <div class="position-relative swiper widget" :class="{'editable': editable}">
    <WidgetHeader name="Product Swiper" :id="id" @remove="remove" @updateHidden="updateHidden" @updateLoop="updateLoop" :hidden="hidden" :loop="loop" :master="master" :ai="widget.ai" v-if="editable" />
    <div v-if="gettingProductsThroughAI">
      <div class="d-flex progress-item mb-3">
        <div class="ai-thinker currentWrting">
          <svg class="star1" xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
            <path d="M9.5565 0.5C8.35782 7.01114 7.38609 7.98282 0.875 9.1815C7.38614 10.3802 8.35782 11.3519 9.5565 17.863C10.7552 11.3519 11.7269 10.3802 18.238 9.1815C11.7269 7.98282 10.7551 7.01114 9.5565 0.5Z" fill="white"/>
          </svg>
          <svg class="star2" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M5.83359 0.816406C5.07135 4.95723 4.45327 5.57525 0.3125 6.3375C4.45327 7.0998 5.07135 7.71783 5.83359 11.8586C6.59584 7.71783 7.21392 7.09975 11.3546 6.3375C7.21381 5.57525 6.59589 4.95723 5.83359 0.816406Z" fill="white"/>
          </svg>
        </div>
        <div class="ai-progress-detail ml-3 d-flex align-items-center justify-content-center writing w-25" >
          <p class="mb-0 mx-3 typingEffect"> AI is generating Products! </p>
        </div>
      </div>
      <div class="w-100 d-flex pl-5">              
          <div class="w-25 mr-2 product-skeleton skeleton-box"></div>
          <div class="w-25 mx-2 product-skeleton skeleton-box"></div>
          <div class="w-25 mx-2 product-skeleton skeleton-box"></div>
          <div class="w-25 ml-2 product-skeleton skeleton-box"></div>
      </div>
    </div>
    <div v-else>
    <div class="row" v-if="widget && !generateThrough">
      <div class="col-md-6 ">
        <div class="card gradient-background">
          <div class="card-body bg-white gradient-card-body">
            <h5 class="text-dark font-weight-bold">Generate Through AI</h5>
            <p class="text-muted">Let AI generate product suggestions based on trends and preferences.</p>
            <hr>
          <p @click="generateThroughAI(true)" class="text-danger text-right mt-2 mb-n3 cursor-pointer">Generate Through Al <span style="font-size:30px">→</span></p>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="text-dark font-weight-bold">Add Products Manually</h5>
            <p class="text-muted">Manually add your products for personalized control and customization.</p>
            <hr>
            <p @click="generateThroughAI(false)" class="text-danger text-right mt-2 mb-n3 cursor-pointer">Add Manually <span style="font-size:30px">→</span></p>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="(title || editable) && generateThrough">
          <div :class="{'d-flex': editableFromAiBuilder,'col-md-4': generateThrough == 'ai' ? (stores && stores.length > 1) : (stores && stores.length > 1),'col-md-6': generateThrough == 'ai' ? !(stores && stores.length > 1) : !(stores && stores.length > 1)}">
          <label v-if="editable">Title</label>
          <input v-if="editable" class="form-control mr-5" placeholder="Enter Name" v-model="intTitle" />
          <h4 class="mb-0" v-else-if="title" v-html="title" />
          <div v-if="editableFromAiBuilder" class="edit-buttons ml-3">
            <a href="#" class="remove-bt" @click.prevent="remove" aria-label="Remove">
              <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-8 -7)" fill-rule="nonzero" fill="none"><circle fill="#E2E2E3" cx="15" cy="15" r="15"/><path d="M21 13v8c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2v-8h12zm-3-6c.6 0 1 .4 1 1v2h3v2H8v-2h3V8c0-.6.4-1 1-1zm-1 2h-4v1h4V9z" fill="#90939A"/></g></svg>
            </a>
          </div>
        </div>
        <div v-if="editable && generateThrough == 'manually'" :class="(stores && stores.length > 1) ? 'col-md-4':'col-md-6'">
          <label>Add a Product, Department or Brand</label>
          <search-suggestions
            departmentsLabel="Departments (Random)"
            brandsLabel="Brands (Random)"
            ref="search"
            placeholder="Search"
            @onSelected="onAdd" class="search-wrapper" style="width:100%"/>
        </div>
        <div v-if="stores && stores.length > 1 && editable" :class="generateThrough == 'ai' ? 'col-md-4':'col-md-4' ">
          <div>
            <label>Show on Locations</label>
            <multiselect
              v-model="selectedLocations"
              :options="stores"
              :multiple="true"
              placeholder="All"
              label="name"  
              @input="updateAssociatedLocations"
              track-by="id">
            </multiselect>
          </div>
        </div>
        <div v-if="generateThrough == 'ai' && editable" :class="(stores && stores.length > 1) ? 'col-md-4':'col-md-6'">
          <label>Number of Products</label>
          <select class="form-control" v-model="numberOfProductsToGenerate">
            <option :val="e" v-for="e in [6,12]" :key="`random-${e}`">{{e}}</option>
          </select>
        </div>
        <div class="col-md-12" v-if="editable && generateThrough == 'ai'">
          <label class="mt-2">Provide Further Instructions to the Al</label>
          <div class="input-group mb-3">
            <input type="text" v-model="aiInstructions" class="form-control" placeholder="Provide Instructions" aria-label="Search">
            <button class="btn btn-dark" @click="generateProductsThroughAI" :disabled="!aiInstructions">Generate Products</button>
          </div>
        </div>
      </div>
    <div v-if="!loading && editable && (!filteredProducts || (filteredProducts && !filteredProducts.length)) && generateThrough" class="no-products">
      Please, add some products to activate the swiper
    </div>
    <div v-if="selectedDepartment && editable" class="mb-1">
      Showing <b>{{this.randomProductsAmount}}</b> random products in <b>{{ selectedDepartment.text }}</b>
    </div>
    <div v-if="selectedBrand && editable" class="mb-1">
      Showing <b>{{this.randomProductsAmount}}</b> random products in <b>{{ selectedBrand.text }}</b>
    </div>
    <div class="position-relative swiper-container" v-if="filteredProducts && filteredProducts.length" @mouseenter="pauseLoop" @mouseleave="doLoop">
      <div v-if="loading" class="loading-wrapper">
        <div class="spinner-border"></div>
      </div>
      <template v-if="visibleItems < filteredProducts.length">
        <div tabindex="0" :ref="`product-swiper-${id}-prev`" class="swiper-button-prev" @click="prevPage" @keydown.enter.prevent.stop="prevPage" v-if="showPrevPage" />
      </template>
      <draggable :ref="`pDraggable-${id}`" class="row small-gutters" :list="swiperProducts" :group="`productSwiperGroup-${id}`" :disabled="!editable || departmentRandomArray.length" @change="onReorder">
        <div tabindex="-1" :class="`col-6 sss col-sm-${12 / visibleItems} mb-2 swiper-slide`" v-for="(item, index) in swiperProducts" :key="`productswiper-${item.title}${index}`">
          <product-item :target="target" :class="{'draggable-item' : editable && !departmentRandomArray.length && !brandRandomArray.length}" @remove="removeItem" :editable="editable && !departmentRandomArray.length && !brandRandomArray.length" :item="item" :internal-api="internalApi" :add-start-stop-scroller="true" :show-add-cart="showAddCart" />
        </div>
      </draggable>
      <template v-if="visibleItems < filteredProducts.length">
        <div tabindex="0" :ref="`product-swiper-${id}-next`" class="swiper-button-next" @click="nextPage" @keydown.enter.prevent.stop="nextPage" v-if="showNextPage" />
      </template>
    </div>
    <div class="text-right mt-4" v-if="editable && generateThrough">
      <button data-v-6ccfe8f8="" class="btn btn-outline-dark btn-sm align-items-center" @click="cancelWidgetType"> Reconfigure </button>
    </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import searchSuggestions from '@/components/search-suggestions';
import ProductApiService from '@/api-services/product.service';
import AdminService from '@/api-services/admin.service';
import Multiselect from 'vue-multiselect';
import { debounce } from 'debounce';

export default {
  name: 'ProductSwiper',
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
    },
    master: {
      default: false
    },
    hidden: {
      default: true
    },
    target: {
      default: '_self'
    },
    widget: {
      default: ''
    },
    associatedLocations: {
      default: null
    },
    ai_prompt: {
      default: ''
    },
    editableFromAiBuilder: {
      default: false
    }
  },
  components: {
    draggable,
    searchSuggestions,
    Multiselect
  },
  data() {
    return {
      testList: [],
      intTitle: '',
      intHidden: true,
      loading: false,
      departmentRandomArray: [],
      brandRandomArray: [],
      productRandomArray: [],
      selectedDepartment: null,
      selectedBrand: null,
      randomProductsAmount: 10,
      windowWidth: window.innerWidth,
      currentPage: 1,
      oneByOne: this.loop,
      loopInterval: null,
      generateThrough: "",
      selectedLocations: this.associatedLocations,
      numberOfProductsToGenerate: 6,
      aiInstructions: this.ai_prompt,
      gettingProductsThroughAI: false
    };
  },
  created() {
    this.intTitle = this.title;
    this.intHidden = this.hidden;
    window.addEventListener('resize', () => this.windowWidth = window.innerWidth);
  },
  computed: {
    stores() {
      const st = this.$store.state.storeLocations || [];
      return st.map(e => {
        const { name, id } = {...e};
        return Object.assign({}, { id, name });
      });
    },
    showPrevPage() {
      if((this.loop && !this.editable) || this.currentPage > 1) {
        return true;
      }
      return false;
    },
    showNextPage() {
      if((this.loop && !this.editable) || !this.swiperProducts.some(e => e.id === this.filteredProducts[this.filteredProducts.length - 1].id)) {
        return true;
      }
      return false;
    },
    lastPage() {
      return Math.ceil(this.products.length / this.visibleItems);
    },
    visibleItems() {
      return this.itemsToShow ? this.itemsToShow
           : this.windowWidth > 1200 ? 6
           : this.windowWidth > 992  ? 4
           : this.windowWidth > 768  ? 3
           : this.windowWidth > 577  ? 2
           :                           2;
    },
    departmentList() {
      if(this.$store.state.departmentResults && this.$store.state.departmentResults.parent_departments) {
        let ret = this.$store.state.departmentResults.parent_departments;

        return ret.map(e => {
          const { name: text, dept_id: value } = {...e};
          return Object.assign({}, { text, value });
        });
      }
      return [];
    },
    brandList() {
      if(this.$store.state.brands) {
        let ret = this.$store.state.brands.data;
        return ret.map(e => {
          const { brand_name: text, brand_id: value } = {...e};
          return Object.assign({}, { text, value });
        });
      }
      return [];
    },
    filteredProducts: {
      get() {
        let ret = [];
        if(!Array.isArray(this.products)) {
          if(this.products.dept_id) {
            ret = this.departmentRandomArray;
          } else if(this.products.brand_id) {
            ret = this.brandRandomArray;
          }
        } else {
          this.checkDepartments(null);
          ret = this.productRandomArray;
        }

        return ret;
      },
      set(val) {
        return val;
      }
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

      ret = [...this.filteredProducts].slice(start, end);

      if(this.loop && this.visibleItems < this.filteredProducts.length) {
        ret = ret.concat([...this.filteredProducts].slice(0, this.visibleItems - ret.length));
      }
      return ret;
    }
  },
  async mounted() {
    this.refreshSwiperProducts();
    this.doLoop();
    this.generateThrough = '';
    if(this.widget.value.productList && Array.isArray(this.widget.value.productList) && this.widget.value.productList.length) {
      this.generateThrough = this.widget.ai ? 'ai':'manually';
    }
    if(this.widget.value.productList && typeof this.widget.value.productList == 'object' && this.widget.value.productList != null) {
      this.generateThrough = this.widget.ai ? 'ai':'manually';
    }
  },
  methods: {
    generateProductsThroughAI() {
      this.gettingProductsThroughAI = true;
      let params = {product_count: this.numberOfProductsToGenerate, instructions: this.aiInstructions};
      AdminService.getProductsThroughAI(params).then(res => {
        if(res.data.status == 'success') {
          this.$emit("addMultipleProducts", res.data.products);
          this.$emit("updateAiPrompt", this.aiInstructions);
        } else {
          const errorMessage = res.data.message || `<div>No products were found based on the given instructions.<br><br><p style='font-size:20px'>Example: Focus on Hardware Tool, Give me some lights and kitchen items.<p></div>`;
          this.$swal(errorMessage, '', 'error');
        }
      }).catch(error => {
        this.$swal(this.getErrorMessage(error), '', 'error');
      }).finally(() => {
        this.gettingProductsThroughAI = false;
      });
    },
    generateThroughAI(throughAI) {
      this.generateThrough = throughAI ? 'ai':'manually';
      this.widget.ai = throughAI;
      this.$emit("generatedByAi", throughAI);
    },
    cancelWidgetType() {
      this.$swal({
        title: 'Are you sure?',
        html: `Changes will be lost`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          this.generateThrough = '';
          this.widget.ai = 0;
          this.$emit("removeProductsFromFrontend");
        }
      });
    },
    refreshSwiperProducts(){
      this.checkDepartments(this.products);
    },
    async checkDepartments(val) {
      if(!val) {
        this.departmentRandomArray = [];
        this.brandRandomArray = [];
        this.selectedDepartment = null;
        return;
      }     
      if(!Array.isArray(val)) {
        if(val.dept_id && !this.loading) {
          this.loading = true;
          let randomProducts = await ProductApiService.getRandomProducts({dept_id: val.dept_id, limit: this.randomProductsAmount});
          this.selectedDepartment = this.departmentList.find(e => e.value == val.dept_id);
          this.departmentRandomArray = randomProducts.data.data.data;
          this.loading = false;
        } else if(val.brand_id && !this.loading) {
          this.loading = true;
          let randomProducts = await ProductApiService.getRandomProducts({brand_id: val.brand_id, limit: this.randomProductsAmount});
          this.selectedBrand = this.brandList.find(e => e.value == val.brand_id);
          this.brandRandomArray = randomProducts.data.data.data;
          this.loading = false;
        }
        return;
      }
      if(this.widget && this.widget.widget_type_id && !this.loading){
        this.loading = true;
        let randomProducts = await ProductApiService.getWidgetProducts({widget_type_id: this.widget.widget_type_id, value: JSON.stringify(this.widget.value)});
        this.productRandomArray = JSON.parse(randomProducts.data.products.value).productList;
        this.loading = false;
        return;
      }
      this.productRandomArray = this.products;
    },
    onReorder(e) {
      let movedElement = e.moved.element;

      if(!this.loop) {
        let oldIndex = e.moved.oldIndex;
        let newIndex = e.moved.newIndex;
        this.filteredProducts.splice(oldIndex + (this.currentPage - 1) * this.itemsToShow, 1);
        this.filteredProducts.splice(newIndex + (this.currentPage - 1) * this.itemsToShow, 0, movedElement);
      } else {
        let oldIndex = e.moved.oldIndex + this.currentPage - 1;
        let newIndex = e.moved.newIndex + this.currentPage - 1;
        this.filteredProducts.splice(oldIndex, 1);
        this.filteredProducts.splice(newIndex, 0, movedElement);
      }

      this.$emit('onReorder', this.filteredProducts);
    },
    onAdd(selected) {
      this.$emit('onSelected', selected);
    },
    removeItem(item) {
      this.$swal({
        title: 'Remove Product',
        html: `Are you sure you want to remove <div class="font-weight-bold text-capitalize">${item.title}</div> from the Product Swiper?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          this.$emit('removeItem', item);
          if(!this.loop && !this.swiperProducts.length) {
            this.currentPage = this.currentPage - 1;
          }
          if(this.loop && !this.showNextPage) {
            this.currentPage = this.currentPage - 1;
          }
          if(this.currentPage < 1) {
            this.currentPage = 1;
          }
        }
      });
    },
    remove() {
      this.$emit('remove', this.id);
    },
    prevPage() {
      this.currentPage = this.currentPage > 1 ? this.currentPage : this.filteredProducts.length + 1;
      this.currentPage = this.currentPage - 1;
      this.pauseLoop();
      this.doLoop();
    },
    nextPage() {
      let max = this.loop ? this.filteredProducts.length : Math.ceil(this.filteredProducts.length / this.visibleItems);
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
    updateHidden(val) {
      this.$emit('updateHidden', val);
    },
    updateLoop(val) {
      this.$emit('updateLoop', val);
    },
    updateAssociatedLocations() {
      this.$emit('updateAssociatedLocations', this.selectedLocations);
    }
  },
  watch: {
    intTitle: debounce(function(value) {
      this.$emit('updateTitle', value);
    }, 1500),
    randomProductsAmount() {
      this.checkDepartments(this.products);
    },
    products(val) {
      this.checkDepartments(val);
    },
    visibleItems(val) {
      if(val >= this.filteredProducts.length) {
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
    height: 340px; /* fixed to help CLS */
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
      width: 100%;
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
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 100;
    width: 100%;
    height: 100%;
    top: 0;
    background: rgba(255,255,255,.5);
  }
  @media (max-width: 1500px) {
    .swiper-container {
      padding: 0 40px;
    }
  }
  @media (max-width: 575px) {
    .swiper-container {
      padding: 0 12px;
    }
    .widget-title {
      text-align: center;
    }
    .products-slider {
      margin: 0 -15px !important;
    }
    .swiper-slide {
      height: 280px;
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
  .gradient-background {
    background: linear-gradient(
      rgba(95, 71, 240, 1),  /* Start color */
      rgba(251, 92, 207, 1), /* Middle color */
      rgba(255, 190, 113, 1) /* End color */
    ) !important
  }
  .gradient-card-body {
    margin: 2px;
    border-radius: 4px;
  }
  .ai-thinker {
    background: linear-gradient(300deg,#1d1a1e,#452ca6,#e036a8);
    background-size: 180% 180%;
    animation: gradient-animation 3s ease infinite;
    height: 50px;
    min-width: 50px;
    width: 50px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .ai-progress-detail {
    align-items: start;
    justify-content: start;
    background: #F1F5F9;
    width: 50px;
    height: 70px;
    box-sizing: content-box;
    border-radius: 18.43px;
    border-top-left-radius: 0px !important;
    -webkit-transition: width 0.3s linear;
    -moz-transition: width 0.3s linear;
    -o-transition: width 0.3s linear;
    transition: width 0.3s linear;

    &.writing {
      background: transparent;
      background-image: linear-gradient(white, white), 
                      linear-gradient(to right, #5F47F0, #FB5CCF, #FFBE71);
      background-origin: border-box;
      background-clip: content-box, border-box;
      border: double 1px transparent;        
      animation: border-gradient-animation 0.75s ease-in-out infinite;
    }
    &.expanded{
      width: auto;
    }
    p{
      font-size: 16.13px;
    }
  }
  @keyframes border-gradient-animation {
    0% {
      background-image: linear-gradient(white, white), 
                      linear-gradient(to right, #5F47F0, #FB5CCF, #FFBE71);
    }
    25% {
      background-image: linear-gradient(white, white), 
                      linear-gradient(to right, #5F47F0, #FFBE71, #FB5CCF);
    }
    50% {
      background-image: linear-gradient(white, white), 
                      linear-gradient(to right, #FFBE71, #5F47F0, #FB5CCF);
    }
    75% {
      background-image: linear-gradient(white, white), 
                      linear-gradient(to right, #FB5CCF, #FFBE71, #5F47F0);
    }
    100% {
      background-image: linear-gradient(white, white), 
                      linear-gradient(to right, #5F47F0, #FB5CCF, #FFBE71);
    }
  }
  .product-skeleton {
    height: 373px;
    width: 25%;
    background-color: #ddd;
    border-radius: 14px;
  }
  .skeleton-box {
    background: linear-gradient(90deg, #F0EFF0 25%, #e0e0e0 50%, #EBEBEA 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  .widget-info-skeleton h3 {
    content: ' ';
    width: 250px;
    height: 24px;
    background-color: #ddd;
    margin: 10px 0;
    border-radius: 50px;
  }
  .widget-info-skeleton span {
    width: 300px;
    height: 17px;
    display: inline-block;
    background-color: #ddd;
    border-radius: 50px;
  }

  .widget-info-skeleton-p {
    width: 330px;
    background-color: #ddd;
    height: 23px;
    line-height: 140%;
    border-radius: 50px;
  }
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
</style>