<template>
  <div class="position-relative widget-builder pl-4 pt-4">
    <SuggesterSwiper
      :products="productList"
      :ref="`swiper-${id}`"
      :id="id"
      :editable="editable"
      :locations="locations"
      :swiperEditable="swiperEditable"
      :showAddCart="false"
      :internalApi="false"
      :title="title"
      :loop="loop"
      :itemsToShow="4"
      :hidden="hidden"
      @goToEditSuggester="goToEditSuggester"
      @deleteSuggester="deleteSuggester"
      @updateHidden="updateHidden"
      @updateTitle="updateTitle"
      @updateLoop="updateLoop"
      @updateLocations="updateLocations"
      @removeItem="removeItem"
      @removeAllItems="removeAllItems"
      @onSelected="onAdd"
      @onReorder="onReorder"
    />
  </div>
</template>

<script>
import SuggesterSwiper from '@/components/admin/product-suggesters/suggester-swiper';
import DepartmentsService from '@/api-services/departments.service';
import SuggesterApiService from '@/api-services/suggester.service';

export default {
  name: 'SuggesterSwiperBuilder',
  props: {
    id: {
      default: null
    },
    value: {
      default: null
    },
    editable: {
      default: false
    },
    swiperEditable: {
      default: false
    },
    locations: {
      default: null
    }
  },
  components: {
    SuggesterSwiper
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
    };
  },
  async created() {
    this.$store.state.searchResults = '';
    let data = this.value ? typeof this.value == 'string' ? JSON.parse(this.value) : this.value : [];
    this.productList = data.productList || [];
    this.title = data.title;
    this.loop = data.loop;
    this.hidden = data.hidden;
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
  },
  methods: {
    getBusinessSuggesters() {
      this.$emit('getBusinessSuggesters');
    },
    goToEditSuggester(value) {
      this.$emit('goToEditSuggester', value);
    },
    deleteSuggester(id) {
      this.$emit('deleteSuggester', id);
    },
    reset() {
      this.productList = [];
      this.updateSuggesterSwiper();
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
        html: `<div class="ml-2">Product${items.length > 1 ? 's' : ''} added to product swiper</div>`,
        showConfirmButton: false,
        timer: 3000
      });
      this.updateSuggesterSwiper();
    },
    async onAdd(selected) {
      if(this.productList.some(element => element.id === selected.item.id)) {
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
      }
      this.$refs[`swiper-${this.id}`].$refs.search.$refs.autocomplete.searchInput = '';
    },
    updateTitle(value) {
      this.title = value;
      this.updateSuggesterSwiper();
    },
    updateLoop(value) {
      this.loop = value;
      this.updateSuggesterSwiper();
    },
    updateHidden(value) {
      this.hidden = value;
      this.updateSuggesterSwiper();
    },
    updateLocations(value) {
      this.$emit('updateLocations', value);
    },
    async updateSuggesterSwiper() {
      let ob = {
        id: this.id,
        value: JSON.stringify({ title: this.title, loop: this.loop, hidden: this.hidden, productList: this.productList })
      };
      await SuggesterApiService.updateSuggesterSwiper(ob);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    },
    removeItem(item) {
      this.productList.splice(this.productList.findIndex(i => i.id == item.id), 1);
      this.updateSuggesterSwiper();
    },
    removeAllItems() {
      this.productList = [];
      this.updateSuggesterSwiper();
    },
    onReorder(list) {
      this.productList = list;
      this.updateSuggesterSwiper();
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

