<template>
  <div class="w-100">
    <template v-if="searchResults">
      <h2 v-if="topDepartments && topDepartments.length && !isLoading" class="rel-dept-header">Relevant Departments</h2>
      <div class="search-dept row small-gutters" v-if="topDepartments && topDepartments.length && !isLoading">
        <div v-for="td in topDepartments" :key="`td-${td.id}`" class="col-sm-6 col-md-4 col-xl-3 mb-2 col-6">
          <!-- id, name, noFmt, image, route -->
          <div class="product-item-wrapper h-100">
            <router-link :to="{name: 'search', params: $route.params, query: getDeptParams(td)}"
                         class="card card-primary product-item">
              <div class="card-body p-0 h-100">
                <div class="dept-search-item">
                  <div class="product-image-wrapper d-none d-md-block text-center">
                    <img
                      :src="td.image"
                      :alt="td.name | lowerCase"
                      class="product-image img-fluid" />
                  </div>
                  <h6 v-if="td.noFmt">{{ td.name }}</h6>
                  <h6 v-else>{{ td.name | capitalize }}</h6>
                </div>
              </div>
            </router-link>
            </div>
        </div>
      </div>

      <div class="mb-3 search-result-page">
        <div class="filters-controls d-flex flex-column flex-sm-row align-items-sm-center w-100">
          <div class="title">
            <span>{{ searchResults.total }} Results</span>
            <span v-if="data.query != `''`">&nbsp;for "<b>{{ data.query }}</b>"</span>
            <span v-if="selectedDepartment && selectedDepartment.dept_name && searchResults.total">
              in <b>{{ selectedDepartment.dept_name }}</b>
            </span>
            <div v-if="removedInStockOnly" class="small text-danger">All products are out of stock</div>
            <SearchDepartmentDropdownInput class="d-block d-md-none" v-if="settings.products.showDepartmentDropdownInSearch" />
          </div>

          <div class="actions d-flex flex-grow-1 justify-content-sm-end justify-content-between">
            <v-select aria-label="Sort Options" :options="sortOpts" v-model="selectedSortMethod" @input="sortBy" />
            <slot name="filter-button"></slot>
          </div>
        </div>

        <div class="d-sm-flex align-items-center w-100 mt-2">
          <div v-if="settings.navigationLayout === 'secondary'" class="flex-grow-1 flex-shrink-0 mr-sm-4">
            <SearchInput />
          </div>
          <VuePagination class="pt-2 pt-sm-0" :pages="searchResults.last_page" />
        </div>
      </div>

      <div class="preloader d-flex justify-content-center align-items-center w-100 mt-5" v-if="isLoading">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div class="search-product row small-gutters" v-if="searchResults.total > 0 && !isLoading">
        <div v-for="item in searchResults.data" :key="item.id" class="col-sm-6 col-md-4 col-xl-3 mb-2">
          <ProductItem :item="item" @cart-update="onCartUpdate" :trackClicks="trackClicks" :trackSearch="trackSearch" />
        </div>
      </div>
      <div class="row" style="justify-content: center" v-if="searchResults.total == 0 && !isLoading">
        <span class="text-center">
          No products were found for this search
        </span>
      </div>
      <!-- PAGINATION -->
      <div class="d-sm-flex">
        <VuePagination class="pt-2" v-if="searchResults.total" :pages="searchResults.last_page" />
      </div>
    </template>
  </div>
</template>

<script>
import {paginationConfig} from '@/config/modules';
import VSelect from '@alfsnd/vue-bootstrap-select';
import SearchDepartmentDropdownInput from '@/components/search-department-dropdown-input';
import SearchInput from '@/components/search/search-input';

export default {
    name: 'SearchResults',
    props: [
      'keyword', 'deptId', 'deptName', 'departmentList', 'sortOptions', 'trackClicks', 'trackSearch', 'brandList'
    ],
    components: {
      VSelect,
      SearchDepartmentDropdownInput,
      SearchInput
    },
    data() {
      return {
        ...paginationConfig,
        currentPage: 1,
        isLoading: false,
        sortOpts: [
          {value: "relevancy", text: "Relevancy"},
          {value: "price-desc", text: "Price High to Low"},
          {value: "price-asc", text: "Price Low to High"},
          {value: "latest", text: "New Arrivals"},
          {value: "title-asc", text: "Alphabetical"},
          {value: "manufacturer-no", text: "Manufacturer #"},
        ]
      };
    },
    computed: {
      settings() {
        return this.$store.state.settings;
      },
      logger() {
        return this.$root.$children[0].logger;
      },
      searchResults: {
        get() {
          return this.$store.state.searchResults && this.$store.state.searchResults.products || null;
        },
        set(val) {
          this.results = val;
        }
      },
      topDepartments() {
        if ( this.$store.state.searchResults && this.$store.state.searchResults.topDepartments ) {
          return this.$store.state.searchResults.topDepartments;
        } else {
          return false;
        }
      },
      removedInStockOnly() {
        return !this.$store.state.searchResults && false || this.$store.state.searchResults.removedInStockOnly;
      },
      // Get a department name by Id
      selectedDepartment() {
        if(this.departmentList && this.$route.query['dept_id']) {
          let selectedId = Number(this.$route.query['dept_id']);
          function find(depts, id) {
            let found = null;
            depts.forEach(d => {
              if ( d.dept_id === id ) {
                found = d;
              } else if ( d.sub_depts && d.sub_depts.length ) {
                let f = find(d.sub_depts, id);
                if (f) {
                  found = f;
                }
              }
            });
            return found;
          }
          return find(this.departmentList, selectedId);
        }
        return {};
      },
      selectedBrands() {
        if(this.brandList && this.$route.query['brands']) {
          return this.$route.query['brands'].toString().split(',');
        }
        return [];
      },
      // Get a department name by Id
      selectedSortMethod: {
        get() {
          if(this.$route.query['sort'])
            return this.sortOpts.filter(e => e.value == this.$route.query['sort'])[0];
          return this.sortOpts[0];
        },
        set(val) {
          return val;
        }
      },
      data() {
        return {
          query: this.$route.query['keyword'] || "''",
          currentPage: 1,
          sort: this.selectedSortMethod
        };
      }
    },
    methods: {
      addLogs() {
        if(this.$root.$children[0].isAdmin)
          this.logger.addLogs({
            group: 'Search',
            data: [
              { label: 'products.capitalizeTitle', value: this.settings.products.capitalizeTitle, type: 'boolean' },
              { label: 'products.currencyPrefix', value: this.settings.products.currencyPrefix },
              { label: 'products.defaultSorting', value: this.settings.products.defaultSorting, plugin: { type: 'dropdown', data: this.sortOpts } },
              { label: 'products.disableOrdering', value: this.settings.products.disableOrdering, type: 'boolean' },
              { label: 'products.disableSpecialOrdering', value: this.settings.products.disableSpecialOrdering, type: 'boolean' },
              { label: 'products.filterShowOutOfStock', value: this.settings.products.filterShowOutOfStock, type: 'boolean' },
              { label: 'products.hideInStockCheckbox', value: this.settings.products.hideInStockCheckbox, type: 'boolean' },
              { label: 'products.hidePriceOutOfStock', value: this.settings.products.hidePriceOutOfStock, type: 'boolean' },
              { label: 'products.hideReg', value: this.settings.products.hideReg, type: 'boolean' },
              { label: 'products.inStockProductRename', value: this.settings.products.inStockProductRename, type: 'boolean' },
              { label: 'products.inventoryItemsMin', value: this.settings.products.inventoryItemsMin },
              { label: 'products.itemsPerPage', value: this.settings.products.itemsPerPage },
              { label: 'products.showDepartmentDropdownInSearch', value: this.settings.products.showDepartmentDropdownInSearch, type: 'boolean' },
              { label: 'products.showQtyInWidgets', value: this.settings.products.showQtyInWidgets, type: 'boolean' },
              { label: 'products.showThreeFiveDays', value: this.settings.products.showThreeFiveDays, type: 'boolean' },
              { label: 'products.sortOptions', value: JSON.stringify(this.settings.products.sortOptions) },
              { label: 'products.useOriginalTitle', value: this.settings.products.useOriginalTitle, type: 'boolean' },
              { label: 'search', value: JSON.stringify(this.settings.search) }
            ]
          });
      },
      sortBy(val) {
        if(this.$route.query.sort != val.value)
          this.$router.push({ query: Object.assign({}, this.$route.query, { sort: val.value }) }).catch(err => console.log(err));
      },
      gotoPage() {
        window.scrollTo({top: 0, behavior: 'smooth'});
        this.$router.push({ query: Object.assign({}, this.$route.query, { page: this.currentPage }) }).catch(err => console.log(err));
      },
      // Search function
      async getSearch() {
        const payload = {
          search: this.data.query,
          dept_id: this.$route.query['dept_id'],
          page: Number(this.$route.query['page']) || 1,
          start_price: this.$route.query['start_price'],
          end_price: this.$route.query['end_price'],
          sort: this.data.sort.value,
          promo: this.$route.query['promo'],
          promolabel: this.$route.query['promolabel'],
          clothing_gender: this.$route.query['clothing_gender'],
          clothing_size: this.$route.query['clothing_size'],
          color: this.$route.query['color'],
          clothing_type_kw: this.$route.query['clothing_type_kw'],
          in_stock_only: this.$route.query['in_stock_only']
        };

        // &x.extra_key=123 -> extra_key=123 sent to server
        Object.keys(this.$route.query).forEach(queryKey => {
          if ( queryKey.startsWith('x.') ) {
            payload[queryKey.substring(2)] = this.$route.query[queryKey];
          }
        });

        // add sku to search if we are using the route with id/title so it shows up first.
        if(this.$route.params.id && this.$route.params.title) {
          payload.sku = this.$route.params.id;
        }

        if(this.$route.query['brands']) {
          payload.brands = this.$route.query['brands'].toString().split(',');
        }

        const searchConfig = this.settings.search;
        if(searchConfig && searchConfig.checkboxFilters) {
          searchConfig.checkboxFilters.forEach(f => {
            if(this.$route.query[f.key] && f.checked) {
              Object.keys(f.checked).forEach(k => payload[k] = f.checked[k]);
            } else if(!this.$route.query[f.key] && f.unchecked) {
              Object.keys(f.unchecked).forEach(k => payload[k] = f.unchecked[k]);
            }
          });
        }
          this.currentPage = Number(this.$route.query['page']) || 1;

        this.isLoading = true;
        await this.$store.dispatch('search', payload);
        this.checkForSecondaryParam();
        this.isLoading = false;
      },
      onItemClick(item) {
        this.$emit('item-click', item);
      },
      onCartUpdate(item, newQty, oldQty) {
        if ( !oldQty && newQty > 0 ) {
          // if they added to cart, count it as a click.
          // we try and limit this to only trigger when it goes from 0 to 1, so adding a bunch
          // doesn't hit the tracker extra times.
          this.$emit('item-click', item);
        }
      },
      checkForSecondaryParam() {
        let s = this.$route.query.secondary;
        if(s) {
          if(!this.searchResults.data.length) {
            this.$route.query.keyword = s;
            this.$router.replace({...this.$router.currentRoute,query: { keyword: s, secondary: undefined }});
          } else if(this.searchResults.data.length == 1) {
            this.$router.push({name: 'products-slug', params: {slug: this.searchResults.data[0].slug}});
          }
        }
      },
      getDeptParams(td) {
        return {...this.$route.query, ...td.route};
      },
    },
    async mounted() {
      // if we have a dummy parameter and no keyword, set the keyword
      if(this.$route.params.dummy && !this.$route.query.keyword) {
        this.$route.query.keyword = this.$route.params.dummy.replace(/-/g, ' ');
      }

      // check if this is a "product" search.
      // we want the item with sku=params.id to be the first result
      if(this.$route.params.id && this.$route.params.title) {
        this.$route.query.keyword = this.$route.params.title.replace(/-/g, ' ');
        if(window.__EZ_PRODUCT_TITLE) {
          this.$ezSetTitle(`${window.__EZ_PRODUCT_TITLE} Near Me`);
        } else {
          this.$ezSetTitle(`${this.$route.query.keyword} Near Me`);
        }
      } else {
        this.$ezSetTitle(`${this.$route.query.keyword} Near Me`);
      }

      // Get search
      this.sortOpts = this.sortOptions && this.sortOptions.length ? this.sortOptions : this.sortOpts;
      if(typeof this.sortOpts === 'string') {
        this.sortOpts = JSON.parse(this.sortOpts);
      }

      this.getSearch();
      this.addLogs();
    },
  };
</script>

<style lang="scss" scoped>
h2.rel-dept-header {
  font-size: 1.2rem;
}
.search-dept {
  margin-bottom: 16px;
}
.dept-search-item {
  padding: 16px 12px;
  .product-image-wrapper {
    height: 180px;
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-height: 100%;
    }
  }
  h6 {
    text-align: center;
    &:hover {
      color: #176db7;
      text-decoration: underline;
    }
  }
}
.product-item-wrapper .card {
  border: none;
  box-shadow: 0 14px 10px 0 rgba(34,44,73, .04);
  border-radius: 13px;
}

@media screen and (max-width: 576px) {
  .dept-search-item {
    .product-image-wrapper {
      height: 140px;
    }
  }
}
</style>
