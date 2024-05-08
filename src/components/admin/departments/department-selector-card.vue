<template>
  <div v-if="department" class="card department" :class="{ 'expanded' : expanded, 'no-products': noProducts, 'hidden': department.hidden }">
    <div class="content">
      <div class="d-flex align-items-center px-3 p-1">
        <div class="custom-control custom-checkbox ml-n2" v-if="selectable">
          <input type="checkbox" class="custom-control-input" :id="`selected-${department.dept_id}`" v-model="selected" @change="onSelect"  />
          <label class="custom-control-label" :for="`selected-${department.dept_id}`" />
        </div>
        <div class="flex-grow-1">
          <div class="text-muted text-capitalize ft-12" v-if="breadcrumbs">
            {{ breadcrumbs }}
          </div>
          <div class="lead d-flex align-items-center font-sm ft-15">
            <div>
              <b v-if="(department.alias && department.alias.name)">
                {{ department.alias.name }}
                <small class="text-primary">({{ department.dept_name }})</small>
              </b>
              <b v-else>
                {{ department.dept_name || department.name }}
                <small class="text-muted small ft-12" v-if="layout == 'simple'">({{ department.source }})</small>                
              </b>              
            </div>
            <a href="#" v-if="allowCopy" class="text-dark ml-2 d-flex align-items-center" @click.prevent="onCopy" aria-label="Copy">
              <svg width="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
            </a>
            <a href="#" v-if="editButton" class="text-dark ml-2 d-flex align-items-center" @click.prevent="onEdit" aria-label="Edit">
              <svg width="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
            </a>
          </div>
        </div>
        <div class="lead ft-12">
          <b v-if="layout !== 'simple' && showProductsCount" class="mr-1">({{ `${department.products_count} ${(department.products_count > 1 ? 'Items' : 'Item')}` }})</b>
          <span class="small">{{ layout == 'simple' ? `${department.products_count} ${(department.products_count > 1 ? 'Items' : 'Item')}` : department.source }}</span>
        </div>
        <div class="custom-control custom-switch ml-3" style="width: 105px;" v-if="hideButton">
          <input v-model="department.hidden" type="checkbox" class="custom-control-input" :id="`d-hidden-${department.dept_id}`" @change="onHidden">
          <label class="custom-control-label" :for="`d-hidden-${department.dept_id}`" v-html="!department.hidden ? 'Hide' : 'Hidden'" />
        </div>
        <button aria-label="Toggle Expand" v-if="!loading" class="bg-transparent border-0 ml-2 toggle-bt" @click="toggleExpand(department.dept_id)">
          <svg width="12" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.25 0.875L7 7.125L0.75 0.875" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div v-else class="spinner-border spinner-border-sm ml-3"></div>
      </div>
      <div class="bottom d-flex align-items-center justify-content-center">
        <ProductSwiper v-if="products && products.length" :target="'_blank'" class="m-3 mb-0 pb-0 w-100" :itemsToShow="4" :products="products" :autoPlay="5000" :loop="true" :hidden="false" :showAddCart="false" />
        <div class="spinner-border" v-else-if="loading"></div>
        <div class="pb-4" v-else>No products were found...</div>
      </div>
    </div>
  </div>
</template>

<script>
  import ProductService from '@/api-services/product.service';

  export default {
    name: 'DepartmentSelectorCard',
    props: {
      hideButton: {
        default: true
      },
      department: {
        default: null
      },
      forceExpand: {
        default: false
      },
      selectable: {
        default: false
      },
      allowCopy: {
        default: false
      },
      editButton: {
        default: false
      },
      layout: {
        default: 'default'
      },
      showProductsCount: {
        default: false
      },
      selectedStore: {
        default: null
      },
    },
    data() {
      return {
        expanded: false,
        noProducts: false,
        loading: false,
        products: null,
        selected: false
      };
    },
    computed: {
      breadcrumbs() {
        let ret = this.department.grand_parent_name ? `${this.department.grand_parent_name} > ` : '';
        ret = this.department.parent_name ? ret + this.department.parent_name : '';
        return ret.toLowerCase();
      }
    },
    methods: {
      async toggleExpand() {
        if(!this.products || !this.products.length && !this.noProducts) {
          this.loading = true;
          let resp = await ProductService.getRandomProductsByStoreId({ dept_id: this.department.dept_id, limit: 4 },this.selectedStore);
          this.products = resp.data.data.data;
          if(!this.products.length)
            this.noProducts = !this.noProducts;
        }
        this.loading = false;
        this.expanded = !this.expanded;
      },
      onSelect() {
        this.$emit('onSelect', { dept: this.department, selected: this.selected });
      },
      onHidden() {
        this.$emit('onHidden', { dept: this.department, selected: this.selected });
      },
      onCopy() {
        this.$emit('onCopy', this.department.dept_name);
      },
      onEdit() {
        this.$emit('onEdit', this.department.dept_id);
      },
    },
    watch: {
      forceExpand(val) {
        this.expanded = !val;
        this.toggleExpand();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .department {
    transition: all .3s;
    &.hidden {
      background: var(--primary);
    }
    .content {
      position: relative;
      z-index: 1;
    }
    &::before {
      content: '';
      position: absolute;
      z-index: 0;
      pointer-events: none;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: #fff;
      border-radius: 6px;
      opacity: .87;
    }
    .bottom {
      overflow: hidden;
      height: 0;
      transition: height .3s;
    }
    .toggle-bt {
      transition: transform .3s;
    }
    &.expanded {
      .bottom {
        height: 390px;
      }
      &.no-products {
        .bottom {
          height: 70px;
        }
      }
      .toggle-bt {
        transform: rotate(180deg);
      }
    }
  }
  .custom-checkbox {
    height: 0;
  }
  .ft-15{
    font-size: 15px !important;
  }
  .ft-12{
    font-size: 12px !important;
  }
</style>