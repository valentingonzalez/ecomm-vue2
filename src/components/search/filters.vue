<template>
  <div class="filterWrapper">
    <!-- FILTER BUTTON (MOBILE ONLY) -->
    <div class="card filters rounded-0" :class="{ 'visible' : showFilters }">
      <div class="card-body">
        <h5 class="mb-3">Filter Results</h5>        

        <a href="#" @click="hideFilters" class="d-lg-none filters-close-bt" aria-label="Hide Filters">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>e-remove</title><g stroke-linecap="round" stroke-linejoin="round" stroke-width="2" fill="#a0a0ba" stroke="#a0a0ba"><line fill="none" stroke="#a0a0ba" stroke-miterlimit="10" x1="19" y1="5" x2="5" y2="19"></line> <line fill="none" stroke="#a0a0ba" stroke-miterlimit="10" x1="19" y1="19" x2="5" y2="5"></line></g></svg>
        </a>
        <!-- Added filters -->
        <div class="filter-items">
          <template v-for="(item, key, index) in filters">
            <filter-item v-if="item.displayValue && key != 'inStockOnly' && key !='promo'" :key="index" :filterVal="item.displayValue" @click.native="removeFilter(item, key)" class="mb-2" />
          </template>
          <filter-item v-for="brand in selectedBrands" :filterVal="brand.brand_name" @click.native="removeFilter(brand.brand_id, 'brands')" :key="brand.brand_id" class="mb-2" />
        </div>
        <!-- Products with promos selection -->
        <div class="mb-2" v-if="hasPromos">
          <b-checkbox id="checkbox-1" name="promo-check" @input="selectPromo" v-model="booleanPromo" :aria-label="filters.promo.displayValue">
            {{ filters.promo.displayValue }}
          </b-checkbox>
        </div>
        <div :class="hasCheckboxFilters ? 'mb-2' : 'mb-3'" v-if="!removedInStockOnly && !settings.products.hideInStockCheckbox">
          <b-checkbox :disabled="removedInStockOnly" id="checkbox-2" name="in-stock-check" @input="selectedInStock" v-model="booleanInStock" :aria-label="settings.products.inStockProductRename || filters.inStockOnly.displayValue">
            {{ settings.products.inStockProductRename || filters.inStockOnly.displayValue }}
          </b-checkbox>
        </div>
        <template>
          <div :class="(index === checkboxFilters.length - 1) ? 'mb-3' : 'mb-2'" v-for="(cbf, index) in checkboxFilters" :key="cbf.key">
            <b-checkbox :id="'checkbox-'+cbf.key" :name="cbf.key" v-model="customCheckbox[cbf.key]">{{ cbf.label }}</b-checkbox>
          </div>
        </template>

        <div v-if="isMiamiHomeCenter && brandList && brandList.length && showBrandsFilter != 0" class="mb-3">
          <h6>Brands</h6>
          <ul class="p-0">
            <li class="none-style-list my-1 text-capitalize">
              <b-checkbox v-for="brand in brandList" :key="brand.brand_id" class="my-1" :value="brand.brand_id" v-model="brandsSelected" @change.native="selectBrand">
                {{ brand.brand_name }} ({{brand.matched_products}})
              </b-checkbox>
            </li>
          </ul>
        </div>

        <!-- PRICE FILTERS -->
        <div class="mb-3" style="max-width: 200px;">
          <h6>Price</h6>
          <ul class="p-0">
            <li v-for="price in priceRanges" :key="price.min" class="none-style-list price-range mb-1">
              <a href="#" tabindex="0" @click.prevent="selectPrice(price)">
                {{ price.displayValue }}
                <span class="item-counts"> {{ price.matched_products }} </span>
              </a>
            </li>
            <li class="none-style-list d-flex">
              <form @submit="selectPrice({start:priceStart,end:priceEnd})" class="d-flex">
                <input placeholder="min" type="number" size="sm" class="form-control price-range-select price-min" v-model="priceStart" aria-label="min price" />
                <span style="margin-top: 3px">-</span>
                <input placeholder="max" type="number" size="sm" class="form-control price-range-select price-max" v-model="priceEnd" aria-label="max price" />
                <button type="submit" class="btn btn-primary price-select-btn" aria-label="Select Price">
                  <VueIcon name="chevron-right" style="width: 8px;" class="ml-auto" />
                </button>
              </form>
            </li>
          </ul>
        </div>        

        <!-- DEPARTMENT FILTERS -->
        <div class="mb-3" v-if="departmentList && departmentList.length && departmentsHirarchy > 0" style="max-width: 400px;">
          <div class="d-flex flex-column mt-2 mb-1">
            <h6 class="m-0">
              <template v-if="settings.navigationLayout !== 'secondary'">
                Departments
              </template>
              <template v-else>
                {{ $route.params.title || 'Departments' }}
              </template>
            </h6>
            <div class="d-flex align-items-end flex-lg-column flex-xl-row mt-1 mb-1">
              <a class="mr-1 mr-lg-0 mr-xl-1" href="#" @click.prevent="collapseAllDepartments">Collapse All</a>
              <div class="d-lg-none d-xl-block">·</div>
              <a class="ml-1 ml-lg-0 ml-xl-1" href="#" @click.prevent="expandAllDepartments">Expand All</a>
            </div>
          </div>
          <tree-view
            ref="DepartmentsTreeview"
            :expandedSubDepartment="filters.expandedSubDepartment.value"
            :expandedDepartment="filters.expandedDepartment.value"
            nodeLabelProp="tree_name"
            nodeChildrenProp="sub_depts"
            :data="departmentList"
            :expanded="expandedDepartments"
            :departmentsHirarchy="departmentsHirarchy"
            @nodeSelected="selectDepartment"
          >
          </tree-view>
        </div>

        <!-- BRAND FILTERS -->
        <div v-if="!isMiamiHomeCenter && brandList && brandList.length && showBrandsFilter != 0" class="mb-3">
          <h6>Brands</h6>
          <ul class="p-0">
            <li class="none-style-list my-1 text-capitalize">
              <b-checkbox v-for="brand in brandList" :key="brand.brand_id" class="my-1" :value="brand.brand_id" v-model="brandsSelected" @change.native="selectBrand">
                {{ brand.brand_name }} ({{brand.matched_products}})
              </b-checkbox>
            </li>
          </ul>
        </div>

        <!-- OTHER FACETS FILTERS -->
        <div v-if="otherFacets" class="mb-3" style="max-width: 200px;">
          <div v-if="otherFacets.clothing_gender && otherFacets.clothing_gender.length != 0">
            <h6>Clothing Department</h6>
            <ul class="p-0">
              <div v-if="showGenderLess">
                  <li v-for="facet in otherFacets.clothing_gender.slice(0, 5)" :key="facet.key" class="none-style-list price-range mb-1" @click="selectFacet('clothing_gender', facet)">
                  {{ facet.key.charAt(0).toUpperCase() + facet.key.slice(1) }}
                  <span class="item-counts"> {{ facet.count }} </span>
                </li>
              </div>
              <div v-else>
                  <li v-for="facet in otherFacets.clothing_gender" :key="facet.key" class="none-style-list price-range mb-1" @click="selectFacet('clothing_gender', facet)">
                  {{ facet.key.charAt(0).toUpperCase() + facet.key.slice(1) }}
                  <span class="item-counts"> {{ facet.count }} </span>
                </li>
              </div>
              <li v-if="otherFacets.clothing_gender.length > 5" class="none-style-list price-range mb-1" @click="showGenderLess = !showGenderLess">
                <span v-if="showGenderLess">See more</span>
                <span v-else>See less</span>
              </li>
            </ul>
          </div>
          <div v-if="otherFacets.clothing_type_kw && otherFacets.clothing_type_kw.length != 0">
            <h6>Clothing Type</h6>
            <ul class="p-0">
              <div v-if="showTypeLess">
                <li v-for="facet in otherFacets.clothing_type_kw.slice(0, 5)" :key="facet.key" class="none-style-list price-range mb-1" @click="selectFacet('clothing_type_kw', facet)">
                  {{ facet.key.charAt(0).toUpperCase() + facet.key.slice(1) }}
                  <span class="item-counts"> {{ facet.count }} </span>
                </li>
              </div>
              <div v-else>
                <li v-for="facet in otherFacets.clothing_type_kw" :key="facet.key" class="none-style-list price-range mb-1" @click="selectFacet('clothing_type_kw', facet)">
                  {{ facet.key.charAt(0).toUpperCase() + facet.key.slice(1) }}
                  <span class="item-counts"> {{ facet.count }} </span>
                </li>
              </div>
              <li v-if="otherFacets.clothing_type_kw.length > 5" class="none-style-list price-range mb-1" @click="showTypeLess = !showTypeLess">
                <span v-if="showTypeLess">See more</span>
                <span v-else>See less</span>
              </li>
            </ul>
          </div>
          <div v-if="otherFacets.clothing_size && otherFacets.clothing_size.length != 0">
            <h6>Clothing Size</h6>
            <ul class="p-0">
              <div v-if="showSizeLess">
                <li v-for="facet in otherFacets.clothing_size.slice(0, 5)" :key="facet.key" class="none-style-list price-range mb-1" @click="selectFacet('clothing_size', facet)">
                  {{ facet.key.charAt(0).toUpperCase() + facet.key.slice(1) }}
                  <span class="item-counts"> {{ facet.count }} </span>
                </li>
              </div>
              <div v-else>
                <li v-for="facet in otherFacets.clothing_size" :key="facet.key" class="none-style-list price-range mb-1" @click="selectFacet('clothing_size', facet)">
                  {{ facet.key.charAt(0).toUpperCase() + facet.key.slice(1) }}
                  <span class="item-counts"> {{ facet.count }} </span>
                </li>
              </div>
              <li v-if="otherFacets.clothing_size.length > 5" class="none-style-list price-range mb-1" @click="showSizeLess = !showSizeLess">
                <span v-if="showSizeLess">See more</span>
                <span v-else>See less</span>
              </li>
            </ul>
          </div>
          <div v-if="otherFacets.size && otherFacets.size.length != 0">
            <h6>Size</h6>
            <ul class="p-0">
              <div v-if="showSizeLess">
                <li v-for="facet in otherFacets.size.slice(0, 5)" :key="facet.key" class="none-style-list price-range mb-1" @click="selectFacet('size', facet)">
                  {{ facet.key.charAt(0).toUpperCase() + facet.key.slice(1) }}
                  <span class="item-counts"> {{ facet.count }} </span>
                </li>
              </div>
              <div v-else>
                <li v-for="facet in otherFacets.size" :key="facet.key" class="none-style-list price-range mb-1" @click="selectFacet('size', facet)">
                  {{ facet.key.charAt(0).toUpperCase() + facet.key.slice(1) }}
                  <span class="item-counts"> {{ facet.count }} </span>
                </li>
              </div>
              <li v-if="otherFacets.size.length > 5" class="none-style-list price-range mb-1" @click="showSizeLess = !showSizeLess">
                <span v-if="showSizeLess">See more</span>
                <span v-else>See less</span>
              </li>
            </ul>
          </div>
          <div v-if="otherFacets.color && otherFacets.color.length != 0">
            <h6>Color</h6>
            <ul class="p-0">
              <div v-if="showColorLess">
                <li v-for="facet in otherFacets.color.slice(0, 5)" :key="facet.key" class="none-style-list price-range mb-1" @click="selectFacet('color', facet)">
                  {{ facet.key.charAt(0).toUpperCase() + facet.key.slice(1) }}
                  <span class="item-counts"> {{ facet.count }} </span>
                </li>
              </div>
              <div v-else>
                <li v-for="facet in otherFacets.color" :key="facet.key" class="none-style-list price-range mb-1" @click="selectFacet('color', facet)">
                  {{ facet.key.charAt(0).toUpperCase() + facet.key.slice(1) }}
                  <span class="item-counts"> {{ facet.count }} </span>
                </li>
              </div>
              <li v-if="otherFacets.color.length > 5" class="none-style-list price-range mb-1" @click="showColorLess = !showColorLess">
                <span v-if="showColorLess">See more</span>
                <span v-else>See less</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FilterItem from '@/components/search/filter-item.vue';
import TreeView from '@/components/tree-view.vue';
import BrandService from '@/api-services/brands.service';


export default {
  name: "SearchFilters",
  components: {
    FilterItem,
    TreeView
  },
  props: {
    departmentList: {
      type: Array
    },
    showFilters: {
      default: false
    },
    brandList: {
      type: Array
    },
  },
  data() {
    return {
      hasPromos: true,
      hasInStocks: true,
      priceStart: null,
      priceEnd: null,
      showTypeLess: true,
      showGenderLess: true,
      showSizeLess: true,
      showColorLess: true,
      showBrandsFilter: null,
      customCheckbox: {},
      brandsSelected: [],
      expandedDepartments: true,
      departmentsHirarchy: null
    };
  },
  computed: {
    settings() {
      return this.$store.state.settings;
    },
    logger() {
      return this.$root.$children[0].$refs.logger;
    },
    hasCheckboxFilters() {
      return this.checkboxFilters.length > 0;
    },
    checkboxFilters() {
      const search = this.settings.search;
      if (search && search.checkboxFilters) {
        return search.checkboxFilters;
      }
      return [];
    },
    filters() {
      return {
        departments: {
          value: this.$route.query['dept_id'],
          displayValue: this.selectedDepartment && this.selectedDepartment.dept_name
        },
        price: {
          value: this.selectedPriceRange.value,
          displayValue: this.selectedPriceRange.displayValue
        },
        promo: {
          value: this.$route.query['promo'],
          displayValue: 'Promo Products'
        },
        clothing_gender: {
          value: this.$route.query['clothing_gender'],
          displayValue: this.$options.filters.capitalize(this.$route.query['clothing_gender'])
        },
        clothing_size: {
          value: this.$route.query['clothing_size'],
          displayValue: this.$options.filters.capitalize(this.$route.query['clothing_size'])
        },
        size: {
          value: this.$route.query['size'],
          displayValue: this.$options.filters.capitalize(this.$route.query['size'])
        },
        color: {
          value: this.$route.query['color'],
          displayValue: this.$options.filters.capitalize(this.$route.query['color'])
        },
        clothing_type_kw: {
          value: this.$route.query['clothing_type_kw'],
          displayValue: this.$options.filters.capitalize(this.$route.query['clothing_type_kw'])
        },
        inStockOnly: {
          value:  this.$route.query['in_stock_only'],
          displayValue: 'In-Stock Products'
        },
        expandedDepartment: {
          value: this.$route.query['exdept'],
        },
        expandedSubDepartment: {
          value: this.$route.query['exsubdept'],
        },

      };
    },
    // Get the Selected Price
    selectedPriceRange() {
      let staq = this.$route.query['start_price'];
      let endq = this.$route.query['end_price'];
      let display = '';
      // if there are no price queries invoked on url
      if(staq == undefined && endq == undefined) return { value: false, displayValue: '' };
      if(staq && !endq)
        display = `more than $${staq}`;
      else if(!staq && endq)
        display = `less than $${endq}`;
      else
      display = `$${staq} - $${endq}`;
      return {
        value: {
          start: staq || 0,
          end: endq || 1000000
        },
        displayValue: display
      };
    },
    booleanPromo: {
      get() {
        return Boolean(Number(this.filters.promo.value));
      },
      set(val) {
        return val;
      }
    },
    priceRanges() {
      if(!this.$store.state.searchResults) return null;
      let textData = [[0, 50], [50, 150], [150, 250], [250, 500], [500, null]];
      return this.$store.state.searchResults.priceRanges.filter(e => e.matched_products > 0).map(e => {
        e.value = e.range;
        e.displayValue = textData[e.value][1] == null ? 'more than $500' : `$${textData[e.value][0]} - $${textData[e.value][1]}`;
        e.start = textData[e.value][0];
        e.end = textData[e.value][1];
        return e;
      });
    },
    otherFacets() {
      if(!this.$store.state.searchResults) return null;
      if (this.$store.state.searchResults.otherFacets != null) {
        return this.$store.state.searchResults.otherFacets;
      } else {
        return null;
      }
    },
    removedInStockOnly() {
      if(!this.$store.state.searchResults) return false;
        return this.$store.state.searchResults.removedInStockOnly;
    },
    booleanInStock: {
      get() {
        return Boolean(Number(this.filters.inStockOnly.value));
      },
      set(val) {
        return val;
      }
    },
    selectedBrands() {
      if(this.brandList && this.$route.query['brands']) {
        let brands = this.$route.query['brands'].toString().split(',');
        let selectedBrands = [];

        brands.forEach((brand) => {
          const brandDetails = this.brandList.find(item => {
            return item.brand_id == brand;
          });
          if(brandDetails) {
            selectedBrands.push(brandDetails);
          }
        });
        return selectedBrands;
      }
      return [];
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
    isMiamiHomeCenter() {
      return this.$root.$children[0].isMiamiHomeCenter;
    }
  },
  methods: {
    getDepartmentsHirarchy(){
      this.departmentsHirarchy = this.$store.state.businessDetails.departments_hierarchy_level;
    },
    addLogs() {
    },
    collapseAllDepartments() {
      this.expandedDepartments = false;
    },
    expandAllDepartments() {
      this.expandedDepartments = true;
    },
    capitalizeWord(keyword) {
      if (keyword != null && keyword != '') {
        return keyword.charAt(0).toUpperCase() + keyword.slice(1);
      }
    },
    selectBrand() {
      if(this.brandsSelected.length) {
        let brands = this.brandsSelected.join(",");
        this.$router.push({ query: Object.assign({}, this.$route.query, { brands: brands, page: 1 }) }).catch(err => console.log(err));
      } else {
        let newRouteQuery = {page: 1};
        Object.keys(this.$route.query).forEach(key => { if (key != 'brands') newRouteQuery[key] = this.$route.query[key]; });
        this.$router.replace({ query: newRouteQuery });
      }
    },
    selectPromo(value) {
      this.$router.push({ query: Object.assign({}, this.$route.query, { promo: Number(value), page: 1 }) }).catch(err => console.log(err));
    },
    selectedInStock(value) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { in_stock_only: Number(value), page: 1 }) }).catch(err => console.log(err));
    },
    // Select department from filters list
    selectDepartment() {
    },
    // Select a price from the list
    selectPrice(price) {
      const newQuery = Object.assign({}, this.$route.query,
        { start_price: price.start, end_price: price.end, page: 1 });
      this.$router.push({ query: newQuery }).catch(err => console.log(err));
    },
    // Select a facet from the list
    selectFacet(facetKey, facet) {
      this.$router.push({ query: Object.assign({}, this.$route.query, {[facetKey]: facet.key, page: 1}) }).catch(err => console.log(err));
    },
    // Remove a selected sidebar filter
    removeFilter(item, key) {
      let newRouteQuery = {page: 1};
      switch(key) {
        case 'departments':
          Object.keys(this.$route.query).forEach(key => { if (key != 'dept_id' && key != 'exsubdept' && key != "exdept") newRouteQuery[key] = this.$route.query[key]; });
          break;
        case 'promo':
          Object.keys(this.$route.query).forEach(key => { if (key != 'promo') newRouteQuery[key] = this.$route.query[key]; });
          break;
        case 'price':
          Object.keys(this.$route.query).forEach(key => { if (key != 'end_price' && key != 'start_price') newRouteQuery[key] = this.$route.query[key]; });
          break;
        case 'clothing_gender':
          Object.keys(this.$route.query).forEach(key => { if (key != 'clothing_gender') newRouteQuery[key] = this.$route.query[key]; });
          break;
        case 'clothing_size':
          Object.keys(this.$route.query).forEach(key => { if (key != 'clothing_size') newRouteQuery[key] = this.$route.query[key]; });
          break;
        case 'size':
          Object.keys(this.$route.query).forEach(key => { if (key != 'size') newRouteQuery[key] = this.$route.query[key]; });
          break;
        case 'color':
          Object.keys(this.$route.query).forEach(key => { if (key != 'color') newRouteQuery[key] = this.$route.query[key]; });
          break;
        case 'clothing_type_kw':
          Object.keys(this.$route.query).forEach(key => { if (key != 'clothing_type_kw') newRouteQuery[key] = this.$route.query[key]; });
          break;
        case 'inStockOnly':
          Object.keys(this.$route.query).forEach(key => { if (key != 'in_stock_only') newRouteQuery[key] = this.$route.query[key]; });
          break;
        case 'brands':
          Object.keys(this.$route.query).forEach(key => { 
            if (key == 'brands') {
              let brands = this.$route.query[key].toString().split(',');
              brands.forEach((brand, index) => {
                if(brand == item) {
                  brands.splice(index, 1);
                }
              }); 
              if(brands.length > 0)
                newRouteQuery[key] = brands.join(",");
            } else {
              newRouteQuery[key] = this.$route.query[key]; 
            }
          });
          break;
      }
      this.$router.replace({ query: newRouteQuery });
    },
    hideFilters() {
      this.$emit('hideFilters');
    }
  },
  async mounted() {
    this.dataFilters = this.filters;

    // handle setting customCheckbox values and watch for changes.
    this.checkboxFilters.forEach(cbf => {
      this.$set(this.customCheckbox, cbf.key, !!this.$route.query[cbf.key]);

      this.$watch('customCheckbox.' + cbf.key, (value) => {
        const o = {};
        o[cbf.key] = value ? 1 : 0;
        this.$router.push({ query: Object.assign({}, this.$route.query, o) }).catch(err => console.log(err));
      });
    });

    let response = await BrandService.getFilter();
    this.showBrandsFilter = response.data.data;

    if(this.$route.query['brands']) {
      this.brandsSelected = this.$route.query['brands'].toString().split(',');
    }
    this.addLogs();
    this.getDepartmentsHirarchy();
    if (this.$store.state.settings.departments.collapseDepartmentsOnSearch == true) {
      this.collapseAllDepartments();
    }
  },
  watch: {
    showFilters(val) {
      if(val)
        document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
      else
        document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
    }
  }
};
</script>

<style lang="scss" scoped>
  .filterWrapper {
    z-index: 2;
  }
  .filters-close-bt {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .promo-check {
    font-size: 16px;
  }

  li {
    font-size: 14px;
  }

  li.indent-2 {
    margin-left: 10px !important;
  }

  li.indent-2::before, li.indent-3::before {
    content: '↳';
    /* content: '\2713'; */
    margin-right: 5px;
  }

  li.indent-3 {
    margin-left: 20px !important;
  }
  .filters {
    margin: 0;
    opacity: 1;
    pointer-events: all;
    h5 {
      font-weight: bold;
      font-size: 18px;
    }

    h6 {
      font-weight: bold;
      text-transform: uppercase;
      font-size: 13px;
      margin-top: 24px;
    }

    .none-style-list {
      list-style: none;
    }
    .tree-view {
      font-size: 14px;
    }
    .price-range {
      color: var(--primary);
      cursor: pointer;
      font-weight: bold;
      &.selected {
        font-weight: 500;
      }
    }
    .price-range-select {
      padding: 0;
      font-size: 12px;
      height: 25px;
      text-align: center;
      max-width: 70px;
      &.price-min {
        margin-right: 5px;
      }
      &.price-max {
        margin-left: 5px;
      }
    }
    .price-select-btn {
      padding: 0px 8px;
      margin-left: 10px;
      height: 25px;
    }
    .item-counts {
      font-size: 11px;
      color: grey;
      &::before {
        content: '(';
      }
      &::after {
        content: ')';
      }
    }
  }

  .filter-items {
    > div {
      display: inline-block;
    }
  }

  @media (max-width: 991px) {
    .tree-view {
      column-count: 1;
    }
  }
  @media (max-width: 991px) {
    .filters {
      position: fixed;
      z-index: 10000;
      top: 100%;
      left: 0;
      overflow: auto;
      height: 100%;
      width: 100%;
      pointer-events: none;
      transition: .2s opacity;
      transition: 200ms;
      border-radius: 30px 30px 0 0;
      box-shadow: 1px -10px 60px 16px rgba(0, 0, 0, 0.2);
      .card-body {
        padding: 24px 16px;
      }
      &.visible {
        top: 0;
        pointer-events: all;
      }
    }
  }
</style>

