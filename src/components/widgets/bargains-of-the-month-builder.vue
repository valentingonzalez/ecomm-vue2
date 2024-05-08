<template>
  <div class="position-relative widget-builder" :class="{ 'hidden': hidden }">
    <div class="handle">
      <svg width="9" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M3 12v3H0v-3h3zm6 0v3H6v-3h3zM3 6v3H0V6h3zm6 0v3H6V6h3zM3 0v3H0V0h3zm6 0v3H6V0h3z" fill="#BCBCBC" fill-rule="evenodd"/></svg>
    </div>
    <div class="hiddenAlert" :class="{'hidden': !hidden}">
      This widget is inactive. Activate it by clicking <a class="ml-2" href="#" @click.prevent="show">here</a>
    </div>
    <BomSwiper
      v-if="productList.length"
      :products="productList"
      :ref="`swiper-${id}`"
      :id="id"
      :editable="true"
      :showAddCart="false"
      :internalApi="false"
      title="Bargains of the Month"
      :loop="loop"
      :itemsToShow="4"
      :hideGeneralOptions="true"
      @updateLoop="updateLoop"
      @remove="hide"
      @toggleBom="toggleBom"
      @onReorder="onReorder" />

  </div>
</template>

<script>
import widgetsApiService from '@/api-services/widgets.service';

export default {
  name: 'BargainsOfTheMonthBuilder',
  props: {
    id: {
      default: null
    },
    value: {
      default: null
    },
    hiddenProp: {
      default: 1
    }
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
      hidden: 1
    };
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
    async updateWidget() {
      let ob = {
        id: this.id,
        value: JSON.stringify({ loop: this.loop, productList: this.productList }),
        hidden: this.hidden
      };
      await widgetsApiService.update(ob);
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
    reset() {
      this.productList = [];
      this.updateWidget();
    },
    hide() {
      this.hidden = 1;
      this.updateWidget();
    },
    show() {
      this.hidden = 0;
      this.updateWidget();
    },
    updateLoop(value) {
      this.loop = value;
      this.updateWidget();
    },
    toggleBom(item) {
      this.productList.find(i => i.id == item.id).bom_hidden = this.productList.find(i => i.id == item.id).bom_hidden ? false : true;
      this.updateWidget();
    },
    onReorder(list) {
      this.productList = list;
      this.updateWidget();
    },
  },
  created() {
    this.$store.state.searchResults = '';
    let data = this.value ? typeof this.value == 'string' ? JSON.parse(this.value) : this.value : [];
    this.productList = data.productList || [];
    this.title = data.title;
    this.loop = data.loop;
    this.hidden = this.hiddenProp;
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
  .hiddenAlert {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    left: -30px;
    right: -30px;
    height: 100%;
    padding: 60px;
    background: rgba(255,255,255,.8);
    z-index: 2;
    transition: opacity .3s;
    &.hidden {
      opacity: 0;
      pointer-events: none;
    }
  }
</style>

