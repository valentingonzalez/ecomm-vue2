<template>
  <div class="position-relative widget-builder">
    <div class="handle">
      <svg width="9" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M3 12v3H0v-3h3zm6 0v3H6v-3h3zM3 6v3H0V6h3zm6 0v3H6V6h3zM3 0v3H0V0h3zm6 0v3H6V0h3z" fill="#BCBCBC" fill-rule="evenodd"/></svg>
    </div>
    <ProductSwiper
      :products="productList"
      :ai_prompt="ai_prompt"
      :ref="`swiper-${id}`"
      :id="id"
      :widget="widget"
      :editable="true"
      :showAddCart="false"
      :internalApi="false"
      :title="title"
      :loop="loop"
      :itemsToShow="4"
      :hidden="hidden"
      :master="master"
      :associatedLocations="associatedLocations"
      @updateHidden="updateHidden"
      @updateAssociatedLocations="updateAssociatedLocations"
      @updateTitle="updateTitle"
      @updateLoop="updateLoop"
      @updateAiPrompt ="updateAiPrompt"
      @remove="remove"
      @removeItem="removeItem"
      @onSelected="onAdd"
      @addMultipleProducts="addMultipleItems"
      @removeProductsFromFrontend="removeProductsFromFrontend"
      @generatedByAi="generatedByAi"
      @onReorder="onReorder" />

    <product-selection-modal ref="departmentsModal" :name="productModalName" :params="productModalParams" @addItems="addItems" />
  </div>
</template>

<script>
import productSelectionModal from '@/components/modals/product-selection';
import DepartmentsService from '@/api-services/departments.service';
import BrandsApiService from '@/api-services/brands.service';
import widgetsApiService from '@/api-services/widgets.service';
import { debounce } from 'debounce';
import ProductSwiper from '@/components/widgets/product-swiper.vue';

export default {
  name: 'ProductSwiperBuilder',
  props: {
    id: {
      default: null
    },
    value: {
      default: null
    },
    master: {
      default: false
    },
    widget: {
      default: ''
    }
  },
  components: {
    productSelectionModal,
    ProductSwiper
  },
  data() {
    return {
      selectedParentDepartment: 0,
      selectedDepartment: 0,
      selectedChildDepartment: 0,
      loading: false,
      productModalParams: {},
      productModalName: '',
      productList: [],
      title: '',
      loop: true,
      hidden: true,
      associatedLocations: null,
      ai: this.widget.ai || false,
      ai_prompt: this.widget.ai_prompt || '',
    };
  },
  created() {
    this.$store.state.searchResults = '';
    let data = this.value ? typeof this.value == 'string' ? JSON.parse(this.value) : this.value : [];
    this.productList = data.productList || [];
    this.title = data.title;
    this.loop = data.loop;
    this.hidden = data.hidden;
    this.associatedLocations = this.widget.associated_locations || null;
  },
  computed: {
    parentDepartments() {
      return this.$store.state.departments || null;
    },
    departments() {
      let ret = [];
      if(this.parentDepartments && this.parentDepartments.filter(e => e.dept_id == this.selectedParentDepartment)[0])
        ret = this.parentDepartments.filter(e => e.dept_id == this.selectedParentDepartment)[0].children || [];
      return [{dept_id: 0, name: 'All'}, ...ret];
    },
    childrenDepartments() {
      let ret = [];
      if(this.departments && this.departments.filter(e => e.dept_id == this.selectedDepartment)[0])
        ret = this.departments.filter(e => e.dept_id == this.selectedDepartment)[0].children || [];
      return [{dept_id: 0, name: 'All'}, ...ret];
    },
    brands() {
      return this.$store.state.brands || null;
    },
    products() {
      return this.$store.state.searchResults && this.$store.state.searchResults.products.data;
    },
    productCount() {
      return this.products && this.products.length;
    },
    brandSuggestions() {
      let temp = [{data: []}];
      if(this.$store.state.searchSuggestions) {
        temp[0].data = this.$store.state.searchSuggestions.brands && this.$store.state.searchSuggestions.brands.items;
      }
      return temp;
    }
  },
  methods: {
    reset() {
      this.productList = [];
      this.updateWidget();
    },
    generatedByAi(value) {
      this.ai = value;
      this.updateWidget();
    },
    addItems(items) {
      items = Object.prototype.toString.call(items) == '[object Array]' ? items : [items];
      this.productList.push(...items);
      if(items.length == 1) {
        if(this.$refs[`swiper-${this.id}`].loop) {
          if(this.$refs[`swiper-${this.id}`].currentPage < this.productList.length - (this.$refs[`swiper-${this.id}`].visibleItems - 1))
            this.$refs[`swiper-${this.id}`].currentPage = this.productList.length - (this.$refs[`swiper-${this.id}`].visibleItems - 1);
        } else {
          this.$refs[`swiper-${this.id}`].currentPage = this.$refs[`swiper-${this.id}`].lastPage;
        }
      }
      this.$swal({
        toast: true,
        position: 'top',
        type: 'success',
        html: `<div class="ml-2">Product${items.length > 1 ? 's' : ''} Added To Product Swiper</div>`,
        showConfirmButton: false,
        timer: 3000
      });
      this.updateWidget(true);
    },
    async addMultipleItems(items) {
      this.productList = [];
      this.addItems(items);
    },
    async onAdd(selected) {
      if(selected && selected.name) {
        switch(selected.name) {
          case 'products':
            if(this.productList.length && this.productList.some(element => element.id === selected.item.id)) {
              this.$swal({
                toast: true,
                position: 'top',
                type: 'error',
                html: `<div class="ml-2">This Product Was Already Added.</div>`,
                showConfirmButton: false,
                timer: 3000
              });
              return;
            }

            if(Array.isArray(this.productList)) {
              this.addItems(selected.item);
            } else {
              this.$swal({
                title: 'Add single Product',
                html: `If you select a product you'll lose all the selected department products.`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes'
              }).then((result) => {
                if (result.value) {
                  this.productList = [];
                  this.addItems(selected.item);
                }
              });
            }
            break;
          case 'departments':
            this.$swal({
              title: 'Random Products by Department',
              html: `If you select a Department you'll lose the products already added to the swiper.`,
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes'
            }).then((result) => {
              if (result.value) {
                this.productList = { dept_id: selected.item.dept_id };
                this.updateWidget(true);
              }
            });
            /*
            this.productModalName = selected.item.name;
            this.productModalParams = {
              dept_id: selected.item.dept_id
            };
            this.$refs.departmentsModal.show();*/
            break;
          case 'brands':
            this.$swal({
              title: 'Random Products by Brand',
              html: `If you select a Brand you'll lose the products already added to the swiper.`,
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes'
            }).then((result) => {
              if (result.value) {
                this.productList = { brand_id: selected.item.brand_id };
                this.updateWidget(true);
              }
            });
            /*
            this.productModalName = selected.item.brand_name;
            this.productModalParams = {
              brand_id: selected.item.brand_id
            };
            this.$refs.departmentsModal.show();*/
            break;
          default:
            break;
        }
        this.$refs[`swiper-${this.id}`].$refs.search.$refs.autocomplete.searchInput = '';
        this.$refs[`swiper-${this.id}`].$refs.search.key = '';
        this.$refs[`swiper-${this.id}`].$refs.search.$refs.autocomplete.internalValue = '';
      }
    },
    remove() {
      this.$swal({
        title: 'Remove Swiper',
        html: `Are you sure you want to remove this Product Swiper?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          this.$emit('remove', this.id);
        }
      });
    },
    updateTitle(value) {
      if(this.title != value) {
        this.title = value;
        this.updateWidget();
      }
    },
    updateLoop(value) {
      if(this.loop != value) {
        this.loop = value;
        this.updateWidget();
      }
    },
    updateAiPrompt(value) {
      this.ai_prompt = value;
    },
    updateHidden(value) {
      if(this.hidden != value) {
        this.hidden = value;
        this.updateWidget();
      }
    },
    updateAssociatedLocations(value) {
      if(this.associatedLocations != value) {
        this.associatedLocations = value;
        this.updateWidget();
      }
    },
    removeProductsFromFrontend() {
      this.productList = [];
      this.updateWidget();
    },
    async updateWidget(adding) {
      let productList = this.productList;
      if(Array.isArray(productList)){
        productList = productList.map((x) => { return {id: x.id, sku: x.sku}; });
      }
      let ob = {
        id: this.id,
        value: JSON.stringify({ title: this.title, loop: this.loop, hidden: this.hidden, productList: productList }),
        associated_locations: this.associatedLocations,
        ai: this.ai ? 1:0,
        ai_prompt: this.ai_prompt
      };
      this.widget.value = ob.value;
      await widgetsApiService.update(ob).then(() => {
      });
      this.$store.commit('updateWidget', ob);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
      this.$swal({
        toast: true,
        position: 'top',
        type: 'success',
        html: `<div class="ml-2">Widget successfully updated</div>`,
        showConfirmButton: false,
        timer: 3000
      });
    },
    removeItem(item) {
      const index = this.productList.findIndex(i => i.sku == item.sku);
      if(index !== -1) {
        this.productList.splice(index, 1);
        this.updateWidget();
      }
    },
    onReorder(list) {
      this.productList = list;
    },
    async searchByDepartment(id) {
      this.loading = true;
      await this.$store.dispatch('clearSearch');
      await this.$store.dispatch('search', { dept_id: id, search: '""' });
      this.loading = false;
    }
  },
  async mounted() {
    if(!this.parentDepartments) {
      let response = await DepartmentsService.getAllDepartments();
      this.$store.commit('saveDepartments', response.data.data.departments);
    }
    if(!this.brands) {
      let response = await BrandsApiService.getBrands(1, 500000000, null);
      this.$store.commit('saveBrands', response.data.data);
    }
    this.selectedParentDepartment = this.parentDepartments[0].dept_id;
  },
  watch: {
    async selectedParentDepartment() {
      this.selectedDepartment = 0;
      this.searchByDepartment(this.selectedParentDepartment);
    },
    async selectedDepartment(val) {
      this.selectedChildDepartment = 0;
      if(val != 0) {
        this.searchByDepartment(this.selectedDepartment);
      }
    },
    async selectedChildDepartment(val) {
      if(val != 0) {
        this.searchByDepartment(this.selectedChildDepartment);
      }
    },
    async selectedCategory(val) {
      await this.$store.dispatch('clearSearch');
      if(val == 'departments') {
        this.selectedDepartment = 0;
        this.selectedChildDepartment = 0;
        this.selectedParentDepartment = this.parentDepartments[0].dept_id;
        this.searchByDepartment(this.selectedParentDepartment);
      }
    },
    searchBrandKey: debounce(function(newQuery) {
      this.getBrandSuggestions(newQuery);
    }, 250),
  }
};
</script>

<style lang="scss" scoped>
  :deep(.swiper) {
    .swiper-button-prev,
    .swiper-button-next {
      width: 30px;
      height: 30px;
      background-size: 30px 30px;
    }
    .swiper-button-prev {
      left: -38px;
    }
    .swiper-button-next {
      right: -38px;
    }
  }
  .spinner-wrapper {
    min-height: 150px;
  }
</style>

