<template>
  <b-modal size="xl" class="modal-box" ref="productSelectionModal" v-if="params">
    <div slot="modal-header" class="d-flex align-items-center justify-content-between w-100">
      <h5 class="text-capitalize">Select Products in {{name}}</h5>
      <button type="button" class="btn btn-primary" :disabled="saving" @click="save">Save</button>
    </div>
    <div class="d-flex justify-content-between w-100 mb-2 align-items-center">
      <input class="form-control search-input" type="text" placeholder="Filter products..." v-model="searchQuery" />
      <div>
        <v-pagination
          class="m-0"
          v-if="pages > 1"
          v-model="currentPage"
          :page-count="pages"
          :classes="bootstrapPaginationClasses"
          :labels="paginationAnchorTexts"
          :limit="pages"
          @input="search"
        />
      </div>
    </div>
    <div v-if="loading" class="w-100 d-flex align-items-center justify-content-center">
      <div class="spinner-border"></div>
    </div>
    <div v-else-if="products" class="search-product row small-gutters">
      <div class="d-none">{{ selectedItems }}</div>
      <div v-for="item in products" :key="item.id" class="col-6 col-md-4 col-xl-2 mb-2">
        <ProductItem selectable :item="item" @onSelect="selectItem" :class="{'selected' : item.selected}" />
      </div>
    </div>
    <div slot="modal-footer">
      <button type="button" class="btn btn-primary" :disabled="saving" @click="save">Save</button>
    </div>
  </b-modal>
</template>

<script>
import SearchApiService from "@/api-services/search.service";
import { paginationConfig } from '@/config/modules';
import { debounce } from 'debounce';

export default {
  name: 'ProductSelectionModal',
  props: {
    params: {
      default: null
    },
    name: {
      default: ''
    }
  },
  data() {
    return {
      ...paginationConfig,
      saving: false,
      loading: false,
      products: null,
      selectedItems: [],
      currentPage: 1,
      pages: 1,
      searchQuery: null
    };
  },
  methods: {
    selectItem(item) {
      if(!item.selected)
        this.selectedItems.push(item);
      else
        this.selectedItems.splice(this.selectedItems.findIndex(e => e.id == item.id), 1);
      item.selected = !item.selected ? true : !item.selected;
    },
    save() {
      this.$emit('addItems', this.selectedItems);
      this.hide();
    },
    hide() {
      this.$refs.productSelectionModal.hide();
    },
    show() {
      this.products = null;
      this.$refs.productSelectionModal.show();
      this.searchQuery = null;
      this.loading = true;
      setTimeout(() => {
        this.search();
      }, 100);
    },
    search() {
      this.loading = true;
      SearchApiService.searchResults({...this.params, search: this.searchQuery || '""', limit: 60, page: this.currentPage, sort: 'title-asc'}).then(res => {
        this.pages = res.data.data.last_page;
        this.products = res.data.data.data;
        this.selectedItems.forEach(e => {
          if(this.products.find(i => i.id == e.id)) {
            this.products.find(i => i.id == e.id).selected = true;
          }
        });
        this.loading = false;
      });
    }
  },
  watch: {
    searchQuery: debounce(function() {
      this.search();
    }, 250),
  }
};
</script>

<style scoped lang="scss">
  .search-input {
    max-width: 400px;
  }
  .product-item-wrapper.selected {
    box-shadow: 0 0 0 2px var(--primary);
    border-radius: 13px;
  }
  .card {
    height: 160px;
    background: #F7F7F7;
    border: 1px solid #E2E2E7;
    box-shadow: none;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    img {
      pointer-events: none;
    }
    &::before {
      content: '';
      position: absolute;
      background: #FAFAFA;
      border: 1px solid #E2E2E7;
      border-radius: 18px;
      width: 18px;
      height: 18px;
      left: 8px;
      top: 8px;
    }
    &.selected {
      border-color: var(--primary);
      box-shadow: 0 0 0 1px var(--primary);
      cursor: default;
      &::before {
        border-color: var(--primary);
        box-shadow: inset 0 0 0 1px var(--primary);
      }
      &::after {
        content: '';
        position: absolute;
        background: var(--primary);
        border-radius: 10px;
        width: 10px;
        height: 10px;
        left: 12px;
        top: 12px;
      }
    }
  }
</style>

