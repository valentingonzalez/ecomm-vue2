<template>
  <div class="search-wrapper flex-grow-1 d-flex justify-content-center" @mouseenter="() => isSearching = true" @mouseleave="() => isSearching = false" :class="{'wide' : isSearching}">
    <div class="search d-flex align-items-center">
      <form @submit.prevent="toSearchPage">
        <vue-autosuggest
          id="search-nav-autosuggest"
          class="search-bar"
          ref="autocomplete"
          @input="getSuggestions"
          @focus="searchInputFocus"
          :suggestions="searchSuggestions"
          :inputProps="inputProps"
          :sectionConfigs="sectionConfigs"
          :renderSuggestion="renderSuggestion"
          :getSuggestionValue="getSuggestionValue"
        >
          <template slot="footer">
            <div class="search-suggestion-footer">
              None of the results match? <router-link to="brands" href="#" class="d-inline search-link">Click here</router-link>
            </div>
          </template>
        </vue-autosuggest>

        <button v-if="!isSearching || $store.state.settings.navigationLayout == 'secondary'" type="submit" class="btn-search-custom" aria-label="Search">
          <svg id="Capa_1" enable-background="new 0 0 515.558 515.558" height="20" viewBox="0 0 515.558 515.558" width="20" fill="#e31e24" xmlns="http://www.w3.org/2000/svg"><path d="m378.344 332.78c25.37-34.645 40.545-77.2 40.545-123.333 0-115.484-93.961-209.445-209.445-209.445s-209.444 93.961-209.444 209.445 93.961 209.445 209.445 209.445c46.133 0 88.692-15.177 123.337-40.547l137.212 137.212 45.564-45.564c0-.001-137.214-137.213-137.214-137.213zm-168.899 21.667c-79.958 0-145-65.042-145-145s65.042-145 145-145 145 65.042 145 145-65.043 145-145 145z"/></svg>
        </button>
        <button v-if="isSearching && $store.state.settings.navigationLayout != 'secondary'" type="button" @click="searchInputBlur" class="btn-search-custom close">
          <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg"><g stroke="#000" fill="none" fill-rule="evenodd" stroke-linecap="round"><path d="M1.701 1.793l8.648 8.648M10.35 1.793L1.7 10.441"/></g></svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import TrackerApiService from '@/api-services/tracker.service';
export default {
  name: "SearchField",
  props: {
    searchRounded: {
      type: Boolean,
      default: true,
    }
  },
  mounted() {
    if (!this.searchRounded) {
      this.inputProps.class = this.inputProps.class +' not-rounded';
    }
  },
  computed: {
    searchSuggestions() {
      if(this.$store.state.searchSuggestions) {
        let arr = this.$store.state.searchSuggestions;
        let temp = [];
        const products = arr.products && arr.products.items;
        const departments = arr.departments && arr.departments.items;
        const brands = arr.brands && arr.brands.items;
        products.length && temp.push({ name: 'products', data: products });
        departments.length && temp.push({ name: 'departments', data: departments });
        brands.length && temp.push({ name: 'brands', data: brands });
        return temp;
      }
      else
        return [];
    },
  },
  data() {
    return {
      isSearching: false,
      searchKey: '',
      inputProps: {
        id: 'search-nav',
        onInputChange: this.getSuggestions,
        placeholder: 'Enter what you\'re looking for',
        ariaLabel: 'Search',
        class: 'form-control comp-search',
        name: 'search',
        'aria-label': 'search',
        title: 'search',
        inputmode: 'search'
      },
      sectionConfigs: {
        default: {
          limit: 0,
          label: '',
          onSelected: () => {
            this.toSearchPage();
          }
        },
        products: {
          limit: 10,
          label: 'Products',
          onSelected: selected => {
            this.searchKey = "";
            this.$refs.autocomplete.searchInput = "";
            this.$router.push({
              name: 'products-id',
              params: {
                id: selected.item.sku,
                title: selected.item.title.replace(/[ /]/g, '+')
              }
            }).catch(err => console.log(err));
          }
        },
        departments: {
          limit: 2,
          label: "Departments",
          onSelected: selected => {
            this.$router.push({name: 'department-products', params: { id: selected.item.dept_id, title: selected.item.name }}).catch(err => console.log(err));
          }
        },
        brands: {
          limit: 2,
          label: "Brands",
          onSelected: selected => {
            this.searchKey = "";
            this.$refs.autocomplete.searchInput = "";
            this.$router.push(`/brands/${selected.item.brand_id }`).catch(err => console.log(err));
          }
        }
      },
    };
  },
  methods: {
    searchInputFocus() {
      let targetScroll = document.getElementById('search-nav').getBoundingClientRect().top - 10;
      this.isSearching = true;
      this.isMobile && window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    },
    shouldRenderSuggestions(size, loading) {
      return size >= 0 && !loading && this.searchKey;
    },
    searchInputBlur() {
      this.searchKey = '';
      this.isSearching = false;
      
      this.isMobile && window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    getSuggestions(text) {
      if(text == '' || text == undefined) return;
      this.searchKey = text;
      this.$store.dispatch("searchSuggestion", this.searchKey);
    },
    renderSuggestion(suggestion) {
      const item = suggestion.item;
      if (suggestion.name == 'products') {
        return (
          <div>
            <img class={{ avatar: true }} src={ item.image_url || '/images/default-img.svg' } alt={ item.original_title } />
            { item.original_title }
          </div>
      );
      } else if (suggestion.name == 'brands') {
        if (!this.$store.state.settings.products.useOriginalTitle) {
          return (
            <div>
              <img class={{ avatar: true }} src={ item.image } alt={ item.brand_name } />
              <span class="text-capitalize">{ item.brand_name }</span>
            </div>
        );
        } else {
          return (
            <div>
              <img class={{ avatar: true }} src={ item.image } alt={ item.original_brand } />
              <span>{ item.original_brand }</span>
            </div>
        );
        }
      } else if (suggestion.name == 'departments') {
        if(item.parent) {
          return (
            <div>
              <span class="text-capitalize">{ item.name }</span>
              <span style="color: grey;"> in </span>
              <span style="color: grey; font-size: 11px;">{ item.parent.name }</span>
            </div>
        );
        } else
          return (
            <div>
              <span style="text-transform: capitalize;">{ item.name }</span>
            </div>
      );
      }
    },
    getSuggestionValue(suggestion) {
      let { name, item } = suggestion;
      return name == 'products' ? item.title : item.name;
    },
    toSearchPage(id, type) {
      let showInStock = this.$store.state.settings.products.filterShowOutOfStock ? 0 : 1;
      let sortBy = this.$route.query.sort || this.$store.state.settings.products.defaultSorting;
      this.searchKey = this.searchKey || this.$refs.autocomplete.searchInput || '""';

      if (this.searchKey || (id && type)) {
        this.$store.dispatch("clearSearch");
        if (id) {
          const params = {
            search: "''",
            sort: sortBy,
            page: 1,
            in_stock_only: showInStock
          };
          if(type) {
            if (type === 'brand')
              params['brands[]'] = id;
            else
              params.dept_id = id;
          }
          this.$store.dispatch("search", params);
        } else {
          this.$store.dispatch("search", {
            search: this.searchKey,
            sort: sortBy,
            page: 1,
            in_stock_only: showInStock
          });
        }
        TrackerApiService.trackSearch(this.searchKey);
        const queryParams = {
          keyword: this.searchKey,
          limit: 48,
          sort: sortBy,
          in_stock_only: showInStock
        };
        if(this.$store.state.settings.products.showThreeFiveDays){
          queryParams.avail_35 = 1;
        }
        if(this.$store.state.settings.products.showThreeFiveDays){
          queryParams.avail_35 = 1;
        }
        if (id) {
          queryParams.keyword = "''";
          if (type === 'brand') {
            queryParams['brand_id'] = id;
          } else {
            queryParams['dept_id'] = id;
          }
        }
        this.$router.push({ name: "search", query: queryParams }).catch(err => console.log(err));
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.search-wrapper {
  position: relative;
  display: inline-flex;
  flex: 2;
  .search {
    width: 100%;
    max-width: 560px;
    position: relative;
    margin-right: auto;
    margin-left: 10px;
    height: 80px;
    .search-bar {
      width: 100%;
      .not-rounded {
        border-radius: 0px !important;
      }
    }
  }
}
.search .form-control {
  height: 80px !important;
}
.btn-search-custom {
  top: 4px;
  right: 4px;
  position: absolute;
  border: none;
  background: none;
  padding-left: 5px;
  background: #fff;
  border-radius: 50%;
  &:not(.close) svg * {
    stroke: var(--primary);
  }

  &.close {
    height: 36px;
    padding: 0;
    top: 1px;
    right: 1px;
    width: 38px;
    opacity: 1;
    svg {
      margin-top: -1px;
    }
  }
}
</style>
