<template>
  <main class="bg-white" v-if="brand">
    <div class="container py-3" :class="{ 'secondary': settings.navigationLayout == 'secondary' }">
      <nav aria-label="breadcrumb">
        <ul class="breadcrumb__wrapper category mb-4">
          <template v-if="settings.layout === 'gerretsen'">
            <li>
              <a class="home-icon" :href="$store.state.settings.logoLink"  aria-label="Home">
                <img src="/images/breadcrumb-home.svg" alt="Home">
              </a>
            </li>
            <li>
              <router-link to="/">
                Online Store
              </router-link>
            </li>
          </template>
          <template v-else>
            <li>
              <router-link to="/">
                <svg width="18px" height="15px" viewBox="0 0 18 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Artboard" transform="translate(-77.000000, -64.000000)" fill="#004955">
                      <path d="M86.0425152,67 L92.2323346,72.263 L92.2398489,72.29 L92.2398489,72.29 L92.243,72.329 L92.243,77.658 L92.2347469,77.770184 C92.212749,77.91572 92.1468173,78.045 92.0374484,78.157 L92.0374484,78.157 L91.9528774,78.233192 C91.835969,78.32356 91.7025543,78.369 91.5536263,78.369 L91.5536263,78.369 L87.4193234,78.369 L87.4193234,74.105 L84.6637678,74.105 L84.6637678,78.368 L80.5314041,78.368 L80.4222523,78.359592 C80.2808638,78.33716 80.1559815,78.2698 80.0466125,78.157 L80.0466125,78.157 L79.973312,78.069776 C79.8864373,77.9492 79.843,77.8116 79.843,77.658 L79.843,77.658 L79.843,72.329 L79.8439696,72.31475 L79.8439696,72.31475 L79.8478479,72.296 L79.8517262,72.2765 L79.8517262,72.2765 L79.8526958,72.263 L86.0425152,67 Z M86,64 L86.1602454,64.0081667 C86.4210556,64.0353889 86.6505,64.1306667 86.848,64.294 L86.848,64.294 L89.572,66.597 L89.572,64.395 L89.5783594,64.3196562 C89.5910625,64.24775 89.62275,64.18625 89.673,64.136 L89.673,64.136 L89.7266563,64.0915312 C89.78375,64.0535625 89.85125,64.035 89.93,64.035 L89.93,64.035 L92.074,64.035 L92.1485938,64.0412188 C92.21975,64.0536875 92.2805,64.085 92.33,64.136 L92.33,64.136 L92.3744688,64.1899687 C92.4124375,64.247625 92.431,64.31625 92.431,64.395 L92.431,64.395 L92.431,69.002 L94.876,71.057 L94.9253125,71.1063594 C94.9684375,71.159375 94.993,71.2235 94.999,71.3 L94.999,71.3 L94.998625,71.3734688 C94.991875,71.444625 94.966,71.50875 94.921,71.565 L94.921,71.565 L94.228,72.401 L94.1800469,72.4465313 C94.1284375,72.4873125 94.066,72.51375 93.994,72.525 L93.994,72.525 L93.96,72.525 L93.8912344,72.5201094 C93.82575,72.5103125 93.77025,72.48575 93.726,72.446 L93.726,72.446 L86,65.931 L78.274,72.446 L78.2070938,72.4847812 C78.1400625,72.5173125 78.07275,72.531 78.006,72.525 L78.006,72.525 L77.9368125,72.5087187 C77.8711875,72.4874375 77.81625,72.45125 77.772,72.401 L77.772,72.401 L77.08,71.565 L77.0409375,71.5061563 C77.0085,71.44475 76.99575,71.37575 77.001,71.3 L77.001,71.3 L77.0127656,71.2275781 C77.031,71.1591875 77.0685,71.10275 77.124,71.057 L77.124,71.057 L85.152,64.294 C85.39,64.098 85.673,64 86,64 L86,64 Z" id="breadcrumb-home"></path>
                    </g>
                  </g>
                </svg>
              </router-link>
            </li>
          </template>
          <li>
            <router-link to="/brands">Brands</router-link>
          </li>
          <li>
            <span>{{ brand.brand_name }}</span>
          </li>
        </ul>
      </nav>
      <h4>{{ brand.brand_name }}</h4>
      <div class="row">
        <div class="col-lg-12" v-if="carousel && carousel.length > 0">
          <!-- <hooper ref="carousel" :infiniteScroll="true" v-if="carousel && carousel.length" :itemsToShow="itemsToShow" :wheelControl="false" class="mx-auto h-auto">
            <slide v-for="slide in carousel" :key="slide" class="d-flex align-items-center justify-content-center overflow-hidden bg-dark border">
              <img class="img-fluid w-100" :src="slide" />
            </slide>
            <hooper-navigation slot="hooper-addons"></hooper-navigation>
          </hooper> -->
           <Carousel :id="'carousel_'+brand.brand_id" :slides="carousel" :class="'pb-0 rounded-13px bg-light'"  />          
        </div>
        <div class="col-lg-3">
          <div class="d-flex mt-3">
            <div class="mr-4" v-if="searchResults && searchResults.data && searchResults.data.length > 0">
              <h4 class="font-weight-bold">{{ brand.products_count }}</h4>
              <div class="text-muted">Products</div>
            </div>
            <div v-if="showBrandVideos">
              <h4 class="font-weight-bold">{{ brand.videos_count }}</h4>
              <div class="text-muted">Videos</div>
            </div>
          </div>
        </div>        
      </div>
      <b-tabs content-class="mt-4" class="mt-3 brand-mob">
        <b-tab title="PRODUCTS" active>
          <div class="row">
            <div class="col-lg-3">
              <search-filters :departmentList="departmentList" :brandList="brandList"/>
            </div>
            <div class="col-lg-9 search-results">
              <div class="mb-3 search-result-page">
                <div class="mb-2  d-sm-flex align-items-center w-100" v-if="searchResults && searchResults.data && searchResults.data.length > 0">
                  <div class="flex-grow-1">
                    <input type="text" autocomplete="off" v-model="searchText" placeholder="Search Products" aria-label="Search Products" name="searchKey" class="form-control search-input" />
                  </div>
                  <VuePagination class="pt-2 pt-sm-0 ml-sm-4" :pages="searchResults.last_page" />
                </div>
                <div class="d-flex align-items-center justify-content-end w-100">
                  <v-select class="ml-3" :options="sortOptions" v-model="selectedSortMethod" @input="sortBy" style="width: 150px;" />
                </div>
                <div class="d-sm-flex align-items-center w-100 mb-3">
                  <div class="d-flex flex-grow-1">
                    <!-- FILTER BUTTON (MOBILE ONLY) -->
                    <a href="#" class="filters-toggle d-lg-none mr-2" @click="() => showFilters = true" aria-label="Toggle Filters"></a>
                  </div>
                </div>
              </div>
              <div class="preloader d-flex justify-content-center align-items-center w-100 mt-5" v-if="isLoading">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <div v-if="searchResults && searchResults.total > 0" :style="{opacity: isLoading ? .6 : 1}" :class="{'disabled': isLoading}">
                <div class="search-product row small-gutters">
                  <div v-for="item in searchResults.data" :key="item.id" class="col-6 col-md-4 col-xl-3 mb-2 search-product-item mb-1 p-0 ">
                    <ProductItem :item="item" />
                  </div>
                </div>
              </div>
              <div style="justify-content: center" v-if="searchResults && searchResults.total === 0">
                <span class="text-center">
                  No products were found in this brand.
                </span>
              </div>
              <div class="d-sm-flex justify-content-end">
                <VuePagination class="mt-3" v-if="searchResults && searchResults.data && searchResults.data.length > 0" :pages="searchResults.last_page" />
                </div>
            </div>
          </div>
        </b-tab>
        <b-tab v-if="showBrandVideos" title="VIDEOS" :title-link-class="'pr-2'">
          <div class="gallery-wrapper">
            <div class="gallery">

              <img v-if="!brand.videos" src="/icons/loader.gif" class="loader" alt="Loading...">
              <template v-else>
                <div v-if="brand.videos.error">
                  {{ brand.videos.error }}
                </div>
                <div v-else v-for="(item, index) in brand.videos" :key="'brand-products-' + index">
                  <media-item :media="item" :video="true" @click.native="changeVideo(item)" />
                </div>
              </template>
            </div>
          </div>
        </b-tab>
      </b-tabs>
    </div>
    <video-lightbox ref="lightbox" />
  </main>
</template>
<script>
import { paginationConfig } from '@/config/modules';
import BrandsApiService from '@/api-services/brands.service';
import DepartmentsService from '@/api-services/departments.service';
import VSelect from '@alfsnd/vue-bootstrap-select';
import { debounce } from 'debounce';
// import { Hooper, Slide, Navigation as HooperNavigation } from 'hooper';
import 'hooper/dist/hooper.css';

export default {
  name: 'SingleBrandPage',
  components: {
    VSelect,
    // Hooper,
    // Slide,
    // HooperNavigation
  },
  data() {
    let id = String(this.$route.params.id);
    if ( id.includes('-') ) {
      id = id.split('-').pop();
    }
    return {
      ...paginationConfig,
      itemsToShow: 1,
      brand: null,
      isLoading: false,
      keyPrefix: 'product_index_' + Date.now() + '_',
      pages: 0,
      currentPage: 1,
      hasPromos: true,
      hasInStocks: true,
      perPage: 96,
      deptId: '',
      deptName: '',
      searchFilters: {
        search: "''",
        brands: [id],
        limit: 96,
        sort: 'price-desc',
        page: 1
      },
      sortOptions: [
        {value: "price-desc", text: "Price High to Low"},
        {value: "price-asc", text: "Price Low to High"},
        {value: "relevancy", text: "Relevancy"},
        {value: "latest", text: "New Arrivals"},
        { value: "manufacturer-no", text: "Manufacturer #" }
      ],
      ignoreFirstDoSort: true,
      searchText: null,
      showFilters: false,
      priceStart: null,
      priceEnd: null,
      isProcessing: false,
      showTypeLess: true,
      showGenderLess: true,
      showSizeLess: true,
      showColorLess: true,
      carousel: null
    };
  },
  computed: {
    settings() {
      return this.$store.state.settings;
    },
    showBrandVideos(){
      if(this.$store.state.currentStore && this.$store.state.currentStore.business_id  && this.$store.state.currentStore.business_id == 4533){
        return false;
      }
      return true;
    },
    logger() {
      return this.$root.$children[0].$refs.logger;
    },
    departmentList() {
      const capitalize = this.$options.filters.capitalize;
      const skipFmt = this.settings.departments.skipAutoFormat;
      if(this.$store.state.searchResults) {
        let ret = this.$store.state.searchResults.departments;
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
      return [];
    },
    selectedSortMethod: {
      get() {
        if(this.$route.query['sort'])
          return this.sortOptions.filter(e => e.value == this.$route.query['sort'])[0];
        return this.sortOptions[0];
      },
      set(val) {
        return val;
      }
    },
    searchResults() {
      return this.$store.state.searchResults ? this.$store.state.searchResults.products : null;
    },
    departments() {
      return this.$store.state.departmentResults;
    },
    // Get a department name by Id
    selectedDepartment() {
      if (this.departments && this.departments.parent_departments && this.$route.query['dept_id']) {
        let ret = this.departments.parent_departments.filter(e => e.dept_id == this.$route.query['dept_id'])[0];
        if(ret)
          return ret;
      }
      return {id: null, name: ''};
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
    data() {
      return {
        query: this.$route.query['keyword'] || "''",
        currentPage: 1,
        filters: {
          departments: {
            value: this.$route.query['dept_id'],
            displayValue: this.selectedDepartment.name,
            displayShortValue: this.selectedDepartment.dept_name
          },
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
          }
        },
        sort: this.selectedSortMethod
      };
    }
  },
  methods: {
    gotoPage() {
      window.scrollTo({top: 0, behavior: 'smooth'});
      this.$router.push({ query: Object.assign({}, this.$route.query, { page: this.currentPage }) }).catch(() => {});
    },
    sortBy(val) {
      this.$router.push({ query: Object.assign({}, this.$route.query, { sort: val.value }) }).catch(() => {});
    },
    async getSearch() {
      let id = String(this.$route.params.id);
      if ( id.includes('-') ) {
        id = id.split('-').pop();
      }
      const payload = {
        search: this.$route.query['query'] || '""',
        brands: [id],
        dept_id: this.$route.query['dept_id'],
        page: Number(this.$route.query['page']) || 1,
        start_price: this.$route.query['start_price'],
        end_price: this.$route.query['end_price'],
        sort: this.data.sort.value,
        promo: this.$route.query['promo'],
        clothing_gender: this.$route.query['clothing_gender'],
        clothing_size: this.$route.query['clothing_size'],
        color: this.$route.query['color'],
        clothing_type_kw: this.$route.query['clothing_type_kw'],
        in_stock_only: this.$route.query['in_stock_only']
      };
      const searchConfig = this.settings.search;
      if (searchConfig && searchConfig.checkboxFilters) {
        searchConfig.checkboxFilters.forEach(f => {
          if (this.$route.query[f.key] && f.checked) {
            Object.keys(f.checked).forEach(k => payload[k] = f.checked[k]);
          } else if (!this.$route.query[f.key] && f.unchecked) {
            Object.keys(f.unchecked).forEach(k => payload[k] = f.unchecked[k]);
          }
        });
      }

      this.isLoading = true;
      this.$store.dispatch('search', payload).then(() => {
        this.isLoading = false;
      });
      this.currentPage = Number(this.$route.query['page']) || 1;
    },
    urlFriendly(value) {
      return value.replace(/[ /]/g, '+');
    },
    changeVideo(video) {
      this.$refs.lightbox.changeVideo(video);
    }
  },
  async mounted() {
    if(this.$root.$children[0].isAdmin)
      this.logger.addLogs({
        group: 'Brand',
        data: [
          { label: 'search', value: JSON.stringify(this.settings.search) },
          { label: 'brands.sortOptions', value: this.settings.brands.sortOptions },
          { label: 'departments.skipAutoFormat', value: this.settings.departments.skipAutoFormat }
        ]
      });

    let id = String(this.$route.params.id);
    if ( id.includes('-') ) {
      id = id.split('-').pop();
    }
    let check = this.$store.state.currentBrand && this.$store.state.currentBrand.brand_id == id;
    if(!check) {
      let response = await BrandsApiService.getBrandById(id);
      if (!response) this.$router.push({ name: 'index' }).catch(() => {});

      this.$store.commit('saveBrand', response.data.data);
      this.sortOptions = this.settings.brands.sortOptions || this.sortOptions;
    }

    this.brand = this.$store.state.currentBrand;
    this.$ezSetTitle(this.brand.brand_name);

    if(this.$route.query.query) {
      this.searchText = this.$route.query.query;
      this.searchFilters.search = this.searchText;
    }

    this.searchText = this.$route.query.query || '';
    BrandsApiService.getVideos(id).then(response => {
      this.$set(this.brand, 'videos', response.data.data);
    }, error => {
      if(this.$root.$children[0].isAdmin)
        this.logger.addLog('Videos', { label: 'No video results from API', readonly: true });
      this.brand.videos = {error : error.response.data.message};
    });

    // Get and set departments to storage through API if empty
    if(!this.departments) {
      let departments_response = await DepartmentsService.getDepartments();
      this.$store.commit('saveDepartmentResults', departments_response.data.data);
    }
    if(!this.results) {
      this.getSearch();
    }
    let slides = [];
    this.brand.carousel.forEach((itm,idx) => {
      slides.push({
        "id":idx+1,
        "image":itm,
        "redirect_url":null,
        "sequence":idx+1,
        "imageMobile":itm          
      });
    });
    this.carousel = slides;
  },
  watch: {
    searchText: debounce(function () {
      this.searchFilters.search = this.searchText || "''";
      if(this.searchText && this.$route.query.query !== this.searchText) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { query: this.searchText }) }).catch(() => {});
      }
    }, 500)
  },
  beforeRouteUpdate(to, from, next) {
    // commenting this out fixed department links not working and doing shit like negative page numbers
    //if(from.query.dept_id != to.query.dept_id) {
      //this.currentPage = 0;
      //this.gotoPage();
      //return;
    //}
    next();
  }
};
</script>

<style scoped lang="scss">
  .preloader {
    position: absolute;
    z-index: 1;
    top: 100px;
  }
  .rounded-13px{
    border-radius: 13px;
  }
</style>
