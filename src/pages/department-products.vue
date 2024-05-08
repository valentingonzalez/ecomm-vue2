<template>
  <main>
    <div class="container search-container" :class="{ 'secondary': settings.navigationLayout == 'secondary' }">
      <template v-if="settings.navigationLayout === 'secondary'">
        <div class="mb-2">
          <ul class="breadcrumb__wrapper mb-0">
            <li>
              <a class="home-icon" :href="$store.state.settings.logoLink" aria-label="Home">
                <img src="/images/breadcrumb-home.svg" alt="Home" />
              </a>
            </li>
            <li>
              <router-link to="/">
                Online Store
              </router-link>
            </li>
            <template v-if="departmentsHirarchy > 0">              
              <template v-if="!selectedDepartment">
                <li>
                  <span>{{ deptName }}</span>
                </li>
              </template>
              <template v-else-if="!selectedSubDepartment && departmentsHirarchy > 1">
                <li>
                  <button type="button" @click="removeDepartmentFilter()">{{ deptName }}</button>
                </li>
                <li>
                  <span>{{ selectedDepartment }}</span>
                </li>
              </template>
              <template v-else-if="departmentsHirarchy > 2">
                <li>
                  <button type="button" @click="removeDepartmentFilter()">{{ deptName }}</button>
                </li>
                <li>
                  <button type="button" @click="removeDepartmentFilter(true)">{{ selectedDepartment }}</button>
                </li>
                <li>
                  <span>{{ selectedSubDepartment }}</span>
                </li>
              </template>
            </template>
          </ul>
        </div>

        <h1 class="mb-3 font-weight-bold">{{ selectedSubDepartment || selectedDepartment || deptName }}</h1>
      </template>

      <div class="row">
        <div class="col-lg-3">
          <SearchDepartmentDropdownInput
            v-if="settings.products.showDepartmentDropdownInSearch"
          />
          <search-filters @hideFilters="hideFilters" :showFilters="showFilters" :departmentList="departmentList" :brandList="brandList"/>
        </div>
        <div class="col-lg-9 search-results">
            <div class="mb-3 search-result-page">
              <div class="filters-controls d-flex flex-column flex-sm-row align-items-sm-center w-100">
                <div class="title">
                  <template v-if="settings.layout === 'gerretsen'">
                    <div v-if="loadingSearchResults || !searchResults">Loading...</div>
                    <div v-else-if="searchText">{{ searchResults && searchResults.total || 0 }} Results for "<b>{{searchText}}</b>" in "<b>{{ selectedSubDepartment || selectedDepartment || deptName }}</b>"</div>
                    <div v-else>{{ searchResults.total  }} Results in "<b>{{ selectedSubDepartment || selectedDepartment || deptName }}</b>"</div>
                  </template>
                  <template v-else>
                    <div v-if="loadingSearchResults || !searchResults">Loading...</div>
                    <div v-else-if="searchText">{{ searchResults && searchResults.total || 0 }} Results for "<b>{{searchText}}</b>" in "<b>{{ deptName }}</b>"</div>
                    <div v-else>{{ searchResults.total  }} Results in "<b>{{ deptName }}</b>"</div>
                  </template>
                </div>
                <div class="actions d-flex flex-grow-1 justify-content-sm-end justify-content-between">
                  <v-select aria-label="Sort Options" :options="sortOptions" v-model="selectedSortMethod" @input="sortBy" />
                  <button type="button" class="filters-toggle d-lg-none" @click.prevent="() => showFilters = true" aria-label="Toggle Filters">
                    <svg width="23" height="23" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 7.79c.509 0 .921.413.921.921V22.08a.921.921 0 11-1.842 0V8.71c0-.508.412-.92.921-.92zM3.5 0c.509 0 .921.412.921.921v3.902h1.837a.742.742 0 110 1.483H.742a.742.742 0 010-1.483h1.837V.92C2.579.412 2.99 0 3.5 0zm16 12.242c.509 0 .921.412.921.921v8.916a.921.921 0 11-1.842 0v-8.916c0-.509.412-.921.921-.921zM19.5 0c.509 0 .921.412.921.921v8.353h1.837a.742.742 0 110 1.484h-5.516a.742.742 0 010-1.484h1.837V.921c0-.509.412-.921.921-.921zm-8 17.435c.509 0 .921.413.921.922v3.722a.921.921 0 11-1.842 0v-3.722c0-.51.412-.922.921-.922zM11.5 0c.509 0 .921.412.921.921v13.547h1.837a.742.742 0 110 1.484H8.742a.742.742 0 010-1.484h1.837V.92c0-.509.412-.921.921-.921z" fill="#ED672F" fill-rule="evenodd"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="d-sm-flex align-items-center w-100 mb-2">
              <div style="flex: 1;">
                <input v-if="settings.navigationLayout !== 'secondary'" type="text" autocomplete="off" v-model="searchText" :placeholder="`Search Products in ${deptName}`" :aria-label="`Search Products in ${deptName}`" name="searchKey" class="form-control search-input mb-2" v-on:keyup.enter="doKeywordFilter(true)" />
                
                <search-input v-else></search-input>
              </div>
              <VuePagination v-if="searchResults" :pages="searchResults.last_page" class="pt-2 pt-sm-0 ml-sm-4" />
            </div>
          <div style="text-align: center; justify-content: center;" v-if="loadingSearchResults">
            <spinner size="large" message="Loading..." />
          </div>
          <div v-else-if="searchResults && searchResults.total > 0">
            <div class="search-product row small-gutters">
              <div
                v-for="item in searchResults.data"
                :key="item.id"
                class="col-6 col-md-4 col-xl-3 mb-2 search-product-item">
                <ProductItem :item="item" :notYetAvail="availableThreeFive" />
              </div>
            </div>
          </div>
          <div style="justify-content: center" v-if="searchResults && searchResults.total === 0">
            <span class="text-center">
              <h2 class="text-center mt-5">No products were found for this search query</h2>
            </span>
          </div>
          <div class="d-sm-flex justify-content-end mt-3">
            <VuePagination v-if="searchResults" :pages="searchResults.last_page" />
          </div>
        </div>
      </div>
    </div>

    <VFooter v-if="settings.navigationLayout == 'secondary'"></VFooter>
  </main>
</template>

<script>
  import Spinner from 'vue-simple-spinner';
  import { paginationConfig } from '@/config/modules';
  import debounce from 'debounce';
  import VSelect from '@alfsnd/vue-bootstrap-select';
  import VFooter from '../custom-pages/gerretsen/components/Footer';
  import SearchDepartmentDropdownInput from '@/components/search-department-dropdown-input';
  import SearchInput from '@/components/search/search-input';

  export default {
    name: 'DepartmentProducts',
    components: {
      Spinner,
      VSelect,
      VFooter,
      SearchDepartmentDropdownInput,
      SearchInput
    },
    data() {
      return {
        ...paginationConfig,
        pages: 0,
        currentPage: 1,
        hasPromos: true,
        hasInStocks: true,
        perPage: 96,
        deptId: '',
        deptName: '',
        loadingSearchResults: false,
        searchFilters: {
          search: "''",
          dept_id: this.deptId ? this.deptId : '',
          limit: 96,
          sort: 'relevancy',
          page: 1
        },
        sortOptions: [
          { value: "price-desc", text: "Price High to Low" },
          { value: "price-asc", text: "Price Low to High" },
          { value: "relevancy", text: "Relevancy" },
          { value: "latest", text: "New Arrivals" },
          { value: "manufacturer-no", text: "Manufacturer #" }
        ],
        ignoreFirstDoSort: true,
        searchText: null,
        showFilters: false,
        priceStart: null,
        priceEnd: null,
        showTypeLess: true,
        showGenderLess: true,
        showSizeLess: true,
        showColorLess: true,
        wasEnterHit: false,
        mountFinished: false,
        searchKey: ''
      };
    },
    computed: {
      departmentsHirarchy(){
        return this.$store.state.businessDetails.departments_hierarchy_level;
      },
      settings() {
        return this.$store.state.settings;
      },
      logger() {
        return this.$root.$children[0].$refs.logger;
      },
      departmentList() {
        const skipFmt = this.settings.departments.skipAutoFormat;
        if(this.$store.state.searchResults && this.$store.state.searchResults.departments && this.$store.state.searchResults.departments[0]) {
          const capitalize = this.$options.filters.capitalize;
          let ret = this.$store.state.searchResults.departments[0].sub_depts;
          ret.map(e => {
            e.dept_name = (e.noFmt || skipFmt) ? e.dept_name : capitalize(e.dept_name);
            e.tree_name = `${e.dept_name} (${e.count})`;
            if (e.sub_depts) {
              e.sub_depts.map(k => {
                k.dept_name = (k.noFmt || skipFmt) ? k.dept_name : capitalize(k.dept_name);
                k.tree_name = `${k.dept_name} (${k.count})`;
                if (k.sub_depts) {
                  k.sub_depts.map(z => {
                    z.dept_name = (z.noFmt || skipFmt) ? z.dept_name : capitalize(z.dept_name);
                    z.tree_name = `${z.dept_name} (${z.count})`;
                  });
                }
              });
            }
          });
          return ret;
        }
        return null;
      },
      brandList() {
        if (this.$store.state.searchResults && this.$store.state.searchResults.brands) {
          let brands = this.$store.state.searchResults.brands;
          return brands;
        }
        return null;
      },
      selectedBrands() {
        if(this.$route.query['brands']) {
          let brands = this.$route.query['brands'].toString().split(',');
          return brands;
        }
        return [];
      },
      selectedSortMethod: {
        get() {
          let s = this.settings.departments.defaultSorting;

          if(this.$route.query.sort) {
            s = this.$route.query.sort;
          }

          // console.log(s);
          const value = s && this.sortOptions.filter(e => e.value == s)[0] || this.sortOptions[0];
          // cloning because these objects were getting fucked up and all the values ended
          // up the same so sorting never worked.
          return JSON.parse(JSON.stringify(value));
        },
        set(val) {
          // i don't know if this is necessary but it WORKS so don't touch it.
          this.selectedSortMethod.value = val.value;
          this.selectedSortMethod.text = val.text;
          //return val;
        }
      },
      searchResults() {
        if (this.$store.state.searchResults) {
          return this.$store.state.searchResults.products;
        } else {
          return null;
        }
      },
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
      data() {
        return {
          query: this.$route.query['keyword'] || "''",
          currentPage: 1,
          filters: {
            price: {
              value: this.selectedPriceRange.value,
              displayValue: this.selectedPriceRange.displayValue
            },
            promo: {
              value: this.$route.query['promo'],
              displayValue: 'Promo Products'
            },
            inStockOnly: {
              value: this.$route.query['in_stock_only'],
              displayValue: 'In-Stock Products'
            },
            clothing_gender: {
              value: this.$route.query['clothing_gender'],
              displayValue: this.$options.filters.capitalize(this.$route.query['clothing_gender'])
            },
            clothing_size: {
              value: this.$route.query['clothing_size'],
              displayValue: this.$options.filters.capitalize(this.$route.query['clothing_size'])
            },
            color: {
              value: this.$route.query['color'],
              displayValue: this.$options.filters.capitalize(this.$route.query['color'])
            },
            clothing_type_kw: {
              value: this.$route.query['clothing_type_kw'],
              displayValue: this.$options.filters.capitalize(this.$route.query['clothing_type_kw'])
            },
            brands: {
              value: this.selectedBrands
            },
          },
          sort: this.selectedSortMethod
        };
      },
      booleanPromo: {
        get() {
          return Boolean(Number(this.data.filters.promo.value));
        },
        set(val) {
          return val;
        }
      },
      booleanInStock: {
        get() {
            return Boolean(Number(this.data.filters.inStockOnly.value));
        },
        set(val) {
            return val;
        }
      },
      availableThreeFive() {
        if (this.$route.query['avail_35'] || this.$route.query['tv_catalog']) {
          return true;
        } else {
          return false;
        }
      },
      selectedDepartment() {
        return this.departmentList && this.$route.query.exdept && this.departmentList.length === 1 ? this.departmentList[0].dept_name : null;
      },
      selectedSubDepartment() {
        return this.departmentList && this.$route.query.exsubdept && this.departmentList.length === 1 && this.departmentList[0].sub_depts.length === 1 ? this.departmentList[0].sub_depts[0].dept_name : null;
      }
    },
    watch: {
      searchText: debounce(function () {
        this.doKeywordFilter();
      }, 3000)
    },
    async mounted() {
      this.sortOptions = this.settings.departments.sortOptions || this.sortOptions;
      if ( typeof this.sortOptions === 'string' ) {
        this.sortOptions = JSON.parse(this.sortOptions);
      }
      this.searchFilters.sort = this.$store.state.settings.departments.defaultSorting || this.searchFilters.sort;

      if ( this.$route.params.slug ) {
        const parts = this.$route.params.slug.split('-');
        this.$route.params.id = parts.pop();
        this.$route.params.title = parts.join(' ');
      }
      this.deptName = this.$route.query.name || this.$route.params.title;
      // if we only have the title slug for a department name, pull it from PHP's value
      // so it looks nicer for search engines that index the content.
      if ( window.__EZ_DEPT_NAME && !this.$route.query.name ) {
        this.deptName = window.__EZ_DEPT_NAME;
      }
      this.searchFilters.dept_id = this.$route.params.id;

      if(this.$route.query.query) {
        this.searchText = this.$route.query.query;
        this.searchFilters.search = this.searchText;
      }

      this.$ezSetTitle(this.deptName);

      // since changing filters causes the route to update, the component is totally rebuilt.
      // so this can run every time the component is mounted. i think this ran every time anyway
      // since this.results was never defined.
      // it may get in a race with sortBy but the loadingSearchResults check will stop one.
      // sortBy does not recreate the component so this won't interfere there.
      await this.$store.dispatch("clearSearch");
      await this.getSearch();
      this.mountFinished = true;
      if(this.$root.$children[0].isAdmin)
        this.log();
    },
    async beforeRouteUpdate (to, from, next) {
      if ( to.params.slug ) {
        const parts = to.params.slug.split('-');
        to.params.id = parts.pop();
        to.params.title = parts.join(' ');
      }

      this.deptName = to.params.title;
      this.searchFilters.dept_id = to.params.id;
      // I don't think this makes sense here because it's getting called BEFORE the new query
      // parameters are visible, so it's loading the previous search results and not the current ones.
      //this.getSearch();
      next();
    },
    methods: {
      log() {
        if(this.$root.$children[0].isAdmin)
          this.logger.addLogs({
            group: 'General',
            data: [
              { label: 'search', value: JSON.stringify(this.settings.search) },
              { label: 'departments.sortOptions', value: this.settings.departments.sortOptions },
              { label: 'departments.defaultSorting', value: this.settings.departments.defaultSorting },
              { label: 'departments.skipAutoFormat', value: this.settings.departments.skipAutoFormat },
              { label: 'products.showDepartmentDropdownInSearch', value: this.settings.products.showDepartmentDropdownInSearch }
            ]
          });
      },
      doKeywordFilter(enter) {
        // if we hit enter the last time, don't refresh on the 3 second timeout
        if ( !enter && this.wasEnterHit ) {
          this.wasEnterHit = false;
          return;
        }
        if ( enter ) {
          this.wasEnterHit = true;
        }
        this.searchFilters.search = this.searchText || "''";
        //this.getSearch();

        const qreplace = {query: this.searchText};
        if(this.$route.query.query !== this.searchText){
          qreplace.page = 1;
        }

        this.$router.push({ query: Object.assign({}, this.$route.query, qreplace) }).catch(err => console.log(err));
      },
      hideFilters() {
        this.showFilters = false;
      },
      selectPromo(value) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { promo: Number(value) }) }).catch(err => console.log(err));
      },
      selectedInStock(value) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { in_stock_only: Number(value) }) }).catch(err => console.log(err));
      },
      selectPrice(price) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { start_price: price.start }) }).catch(err => console.log(err));
        this.$router.push({ query: Object.assign({}, this.$route.query, { end_price: price.end }) }).catch(err => console.log(err));
      },
      selectFacet(facetKey, facet) {
        this.$router.push({ query: Object.assign({}, this.$route.query, {[facetKey]: facet.key}) }).catch(err => console.log(err));
      },
      gotoPage() {
        window.scrollTo({top: 0, behavior: 'smooth'});
        this.$router.push({ query: Object.assign({}, this.$route.query, { page: this.currentPage }) }).catch(err => console.log(err));
      },
      sortBy() {
        if ( !this.mountFinished ) {
          console.log('tried calling sortBy before mount finished');
          return;
        }
        if ( this.searchFilters.sort !== this.selectedSortMethod.value ) {
          this.$router.push({ query: Object.assign({}, this.$route.query, { sort: this.selectedSortMethod.value }) }).catch(err => console.log(err));
          // this.searchFilters.sort = this.selectedSortMethod.value;
          // this.getSearch();
        }
      },
      async getSearch() {
        // if using a deptId with no keyword, make the server search all items in department
        this.searchFilters['start_price'] = this.data.filters.price.value.start;
        this.searchFilters['end_price'] = this.data.filters.price.value.end;
        this.searchFilters['promo'] = this.data.filters.promo.value;
        this.searchFilters['in_stock_only'] = this.data.filters.inStockOnly.value;
        this.searchFilters['clothing_gender'] = this.data.filters.clothing_gender.value;
        this.searchFilters['clothing_size'] = this.data.filters.clothing_size.value;
        this.searchFilters['color'] = this.data.filters.color.value;
        this.searchFilters['clothing_type_kw'] = this.data.filters.clothing_type_kw.value;
        this.searchFilters['page'] = Number(this.$route.query['page']) || 1;
        this.searchFilters['brands'] = this.data.filters.brands.value;
        this.searchFilters['dept_id'] = this.$route.params.id;

        if(this.$route.query.dept_id){
          this.searchFilters['sub_dept_id'] = this.$route.query.dept_id;
        }

        if(this.$route.query.sort){
          this.searchFilters['sort'] = this.$route.query.sort;
        }

        const searchConfig = this.settings.search;
        if ( searchConfig && searchConfig.checkboxFilters ) {
          searchConfig.checkboxFilters.forEach(f => {
            if ( this.$route.query[f.key] && f.checked ) {
              Object.keys(f.checked).forEach(k => this.searchFilters[k] = f.checked[k]);
            } else if ( !this.$route.query[f.key] && f.unchecked ) {
              Object.keys(f.unchecked).forEach(k => this.searchFilters[k] = f.unchecked[k]);
            }
          });
        }
        if(!this.loadingSearchResults){
          this.loadingSearchResults = true;
          await this.$store.dispatch('search', this.searchFilters);
          setTimeout(() => {
            this.loadingSearchResults = false;
            this.$forceUpdate();
            this.currentPage = Number(this.$route.query['page']) || 1;
          }, 200);
        }

      },
      removeFilter(item, key) {
        let newRouteQuery = {};
        switch(key) {
          case 'promo':
            Object.keys(this.$route.query).forEach(key => { if (key != 'promo') newRouteQuery[key] = this.$route.query[key]; });
            break;
          case 'price':
            Object.keys(this.$route.query).forEach(key => { if (key != 'end_price' && key != 'start_price') newRouteQuery[key] = this.$route.query[key]; });
            break;
          case 'inStockOnly':
            Object.keys(this.$route.query).forEach(key => { if (key != 'in_stock_only') newRouteQuery[key] = this.$route.query[key]; });
            break;
          case 'clothing_gender':
            Object.keys(this.$route.query).forEach(key => { if (key != 'clothing_gender') newRouteQuery[key] = this.$route.query[key]; });
            break;
          case 'clothing_size':
            Object.keys(this.$route.query).forEach(key => { if (key != 'clothing_size') newRouteQuery[key] = this.$route.query[key]; });
            break;
          case 'color':
            Object.keys(this.$route.query).forEach(key => { if (key != 'color') newRouteQuery[key] = this.$route.query[key]; });
            break;
          case 'clothing_type_kw':
            Object.keys(this.$route.query).forEach(key => { if (key != 'clothing_type_kw') newRouteQuery[key] = this.$route.query[key]; });
            break;
        }
        this.$router.replace({ query: newRouteQuery });
      },
      removeDepartmentFilter(subDepartment = false) {
        let newQuery = [];

        if (!subDepartment) {
          Object.keys(this.$route.query).forEach(key => { if (key != 'dept_id' && key != 'exdept' && key != 'exsubdept') newQuery[key] = this.$route.query[key]; });
        } else {
          Object.keys(this.$route.query).forEach(key => { if (key != 'exsubdept') newQuery[key] = this.$route.query[key]; });
        }

        this.$router.replace({ query: newQuery });
      }
    },
  };
</script>
<style scoped lang="scss">
  .search-input {
    background-image: url('data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPGcgaWQ9IlN5bWJvbHMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9IjAuNSI+CiAgICAgICAgPGcgaWQ9IlNlYXJjaC1iYXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01MzYuMDAwMDAwLCAtMTMuMDAwMDAwKSIgZmlsbD0iIzJGMzU0MCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IlNlYXJjaC1CYXIiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTU0OC41MDgxMTQsMjYuNzQwNTQ4MSBDNTQ4Ljg0OTc5MSwyNy4wODY0ODQgNTQ5LjQwMjA2NiwyNy4wODY0ODQgNTQ5Ljc0Mzc0MywyNi43NDA1NDgxIEM1NTAuMDg1NDE5LDI2LjM5NDYxMjMgNTUwLjA4NTQxOSwyNS44MzQ5ODQ2IDU0OS43NDM3NDMsMjUuNDg5MDQ4NyBMNTQ3LjA0NzQ3NSwyMi43OTQzMTI3IEM1NDcuODEwMDMzLDIxLjc3MjI4MTEgNTQ4LjI2MTQ3MiwyMC41MDQ0NzE5IDU0OC4yNjE0NzIsMTkuMTMxMjE1MyBDNTQ4LjI2MTQ3MiwxNS43NDUwMzg2IDU0NS41MTY2NDgsMTMgNTQyLjEzMDczNiwxMyBDNTM4Ljc0NDgyNCwxMyA1MzYsMTUuNzQ1MDM4NiA1MzYsMTkuMTMxMjE1MyBDNTM2LDIyLjUxNzM5MiA1MzguNzQ0ODI0LDI1LjI2MjQzMDYgNTQyLjEzMDczNiwyNS4yNjI0MzA2IEM1NDMuNTA5MDUyLDI1LjI2MjQzMDYgNTQ0Ljc4MTEzMywyNC44MDc1NTMxIDU0NS44MDUwNzIsMjQuMDM5NzE4MiBMNTQ4LjUwODExNCwyNi43NDA1NDgxIFogTTUzNy43NTE2MzksMTkuMTMxMjE1MyBDNTM3Ljc1MTYzOSwxNi43MTI1MTc3IDUzOS43MTIyMjcsMTQuNzUxNzc1OCA1NDIuMTMwNzM2LDE0Ljc1MTc3NTggQzU0NC41NDkyNDQsMTQuNzUxNzc1OCA1NDYuNTA5ODMzLDE2LjcxMjUxNzcgNTQ2LjUwOTgzMywxOS4xMzEyMTUzIEM1NDYuNTA5ODMzLDIxLjU0OTkxMyA1NDQuNTQ5MjQ0LDIzLjUxMDY1NDggNTQyLjEzMDczNiwyMy41MTA2NTQ4IEM1MzkuNzEyMjI3LDIzLjUxMDY1NDggNTM3Ljc1MTYzOSwyMS41NDk5MTMgNTM3Ljc1MTYzOSwxOS4xMzEyMTUzIFoiIGlkPSJMb3VwZS1JY29uIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=');
    background-repeat: no-repeat;
    background-position: right 14px center;
    max-width: 450px;
    font-size: 14px;
    padding-right: 32px !important;
    text-overflow: ellipsis;
  }
  .promo-check {
    font-size: 16px;
  }
  .none-style-list {
    list-style: none;
  }
  .tree-view {
    font-size: 12px;
  }
  .item-counts {
    font-size: 11px;
    color: grey;
  }
  .item-counts::before {
    content: '(';
  }
  .item-counts::after {
    content: ')';
  }
  .price-select-btn {
    padding: 0px 8px;
    margin-left: 10px;
    height: 25px;
  }
  .departments-list.active {
    color: #48ce3d;
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
  .v-select {
    width: 150px;
  }
  .search-product {
    display: flex;
    flex-wrap: wrap;
  }

  @media screen and (max-width: 767px) {
    .search-input {
      max-width: 100%;
    }
    .search-product-item {
      width: 50%;
    }
    .card {
      margin-top: 20px;
    }
    .search-result-page {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .search-result-content {
      text-align: center;
      justify-content: center !important;
      display: flex;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  @media screen and (max-width: 576px) {
    .search-product-item {
      width: 100%;
      padding: 0 15px;
    }
  }
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    .search-container .search-product-item {
      max-width: 33.33%;
      flex: unset;
    }
    .search-container .search-product .search-product-item .product h6 {
      font-size: 12px;
    }
    .product .info > div {
      font-size: 12px !important;
    }
    .search-container {
      margin-top: 30px;
    }
    .none-style-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      input {
        min-width: 30px;
        max-width: 50px;
      }
    }
  }
</style>
<style scoped lang="scss">
  h1 {
    font-size: 2.5rem;
  }
  .filter-container {
    padding: 10px 15px;
  }
  .spinner-border {
    border-top-color: #e74930;
    border-left-color: #e74930;
    border-bottom-color: #e74930;
  }
  .filters-close-bt {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .promo-check {
    font-size: 16px;
  }
  .none-style-list {
    list-style: none;
  }
  .price-range {
    color: #e74930;
    cursor: pointer;
  }
  .tree-view {
    font-size: 12px;
  }
  .item-counts {
    font-size: 11px;
    color: grey;
  }
  .item-counts::before {
    content: '(';
  }
  .item-counts::after {
    content: ')';
  }
  .price-range.selected {
    font-weight: 500;
  }
  .price-range-select {
    padding: 0;
    font-size: 12px;
    height: 25px;
    text-align: center;
    max-width: 70px;
  }
  .price-range-select.price-min {
    margin-right: 5px;
  }
  .price-range-select.price-max {
    margin-left: 5px;
  }
  .price-select-btn {
    padding: 0px 8px;
    margin-left: 10px;
    height: 25px;
  }
  .departments-list.active {
    color: #48ce3d;
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
  .v-select {
    width: 150px;
  }
  @media (max-width: 991px) {
    .tree-view {
      column-count: 2;
    }
  }
  @media screen and (max-width: 767px) {
    .search-product-item {
      width: 50%;
    }
    .card {
      margin-top: 20px;
    }
    .search-result-page {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .search-result-content {
      text-align: center;
      width: 100%;
      display: flex;
    }
  }
  .preloader {
    z-index: 1000;
    height: calc(100% - 182px)
  }
  @media screen and (max-width: 576px) {
    h1 {
      font-size: 1.5rem;
      text-align: center;
    }

    .search-product-item {
      width: 100%;
      padding: 0 15px;
    }
    .tree-view {
      column-count: 1;
    }
  }
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    .search-container .search-product-item {
      max-width: 33.33%;
      flex: unset;
    }
    .search-container .search-product .search-product-item .product h6 {
      font-size: 12px;
    }
    .product .info > div {
      font-size: 12px !important;
    }
    .search-container {
      margin-top: 30px;
    }
    .none-style-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      input {
        min-width: 30px;
        max-width: 50px;
      }
    }
  }
</style>
