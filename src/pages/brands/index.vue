<template>
  <main>
    <div class="container" :class="{ 'secondary': settings.navigationLayout == 'secondary' }">
      <h1 class="results-page-title">Brands</h1>

      <div class="search-summary">
        <p v-if="searchResults">{{ searchResults.length }} Results for <strong>Furniture</strong></p>
      </div>

      <div v-if="settings.layout === 'gerretsen'" class="mb-2">
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
          <li>
            <span>Brands</span>
          </li>
        </ul>
      </div>
      <div class="d-sm-flex align-items-center mb-3" :class="{ 'secondary': settings.navigationLayout == 'secondary' }">
        <div class="mr-sm-3" style="flex: 1;">
          <input type="text" autocomplete="off" v-model="searchText" aria-label="Search Brand" placeholder="Search Brand" name="searchKey" class="form-control search-input" />
        </div>
        <div class="pt-2 pt-sm-0">
          <VuePagination :pages="pages" />
        </div>
      </div>
      <div class="row small-gutters">
        <template v-if="isLoading">
          <img src="/icons/loader.gif" class="loader" alt="Loading...">
        </template>
        <template v-else>
          <div v-for="(item, i) in brands" :key="i" class="col-6 col-xl-3 col-md-4 mb-2">
            <router-link :to="{ name: 'brands-id', params: { id: $ezSlugify(item.brand_name) + '-' + item.brand_id, brand: item },query: {in_stock_only: inStockOnlyParam} }" class="h-100 w-100">
              <div class="card py-3 px-4 h-100">
                <div class="d-flex align-items-center justify-content-center mb-3" v-if="settings.brands.showImages || $store.state.businessDetails.show_brand_logos" style="height:70px;">
                  <img v-if="item.image" :src="item.image" :alt="item.altTextLogo || item.brand_name" :title="item.altTextLogo || item.brand_name" class="brand-image w-100 h-100" />
                  <svg v-else width="70" height="70" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle fill="#979797" cx="18.68" cy="25.169" r="3.539"/><rect stroke="#979797" stroke-width="4" x="2" y="2" width="66" height="66" rx="8"/><path d="M38.952 27.5c-.437.521-3.523 4.79-9.258 12.806-2.027-2.675-3.298-4.337-3.812-4.987-.772-.974-2.218-.818-2.78 0-.374.546-3.409 4.674-9.104 12.383h42.695C47.456 35.137 42.495 28.403 41.812 27.5c-.715-.928-2.206-.781-2.86 0z" fill="#979797"/></g></svg>
                </div>
                <div class="h6 font-weight-bold text-center mb-3 flex-grow-sm-1 align-items-center d-flex justify-content-center">{{ item.brand_name }}</div>
                <div class="d-flex justify-content-center flex-column flex-sm-row">
                  <div class="mb-2 mb-sm-0">
                    <div class="font-weight-bold text-center">{{ item.products_count }}</div>
                    <div class="text-center">Products</div>
                  </div>
                  <div class="border-sm-left border-gray ml-sm-4 pl-sm-4" v-if="item.videos_count">
                    <div class="font-weight-bold text-center">{{ item.videos_count }}</div>
                    <div class="text-center">Videos</div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </template>
      </div>
      <div class="d-sm-flex justify-content-end">
        <VuePagination :pages="pages" class="mt-3" />
      </div>
      <div v-if="total === 0 && (!brands || !brands.length)" style="width: 100%; text-align: center">
          <span style="font-size: 22px">No records found for {{searchText}}</span>
      </div>
    </div>

  </main>
</template>

<script>
  import {paginationConfig} from '@/config/modules';
  import BrandsApiService from '@/api-services/brands.service';
  import debounce from 'debounce';

  export default {
    name: 'BrandsPage',
    data() {
      return {
        ...paginationConfig,
        searchResults: null,
        pages: 0,
        currentPage: 1,
        perPage: 50,
        total: null,
        searchText: null,
        isLoading: false
      };
    },
    computed: {
      brands() {
        if (this.$store.state.brands) {
          this.setPaginationProperties();
          return this.$store.state.brands.data;
        }
        return null;
      },
      preferences() {
        return this.$store.state.preferences;
      },
      inStockOnlyParam() {
        if (this.$store.state.settings.products.filterShowOutOfStock) {
          return 0;
        }
        return 1;
      },
      logger() {
        return this.$root.$children[0].$refs.logger;
      },
      settings() {
        return this.$store.state.settings;
      }
    },
    methods: {
      async goToPage() {
        this.isLoading = true;
        window.scrollTo({top: 0, behavior: 'smooth'});
        this.$router.push({query: {page: this.currentPage, search: this.searchText}}).catch(err => console.log(err));
      },
      async loadResults() {
        this.isLoading = true;
        let sort = this.settings.brands.sortAlphabetical ? 'alphabetical' : null;
        let response = await BrandsApiService.getBrands(this.currentPage, this.perPage, this.searchText, sort);
        this.$store.commit('saveBrands', response.data.data);
        this.isLoading = false;
      },
      setPaginationProperties() {
        const brands = this.$store.state.brands;
        this.total = brands.total;
        this.currentPage = brands.current_page;
        this.pages = Math.ceil(this.total / this.perPage);
      }
    },
    async mounted() {
      
      if(this.$root.$children[0].isAdmin) {
        this.logger.addLog('Sort', { label: 'brands.sortAlphabetical', value: this.settings.brands.sortAlphabetical || '""' });
        this.logger.addLog('Sort', { label: 'brands.defaultSorting', value: this.settings.brands.defaultSorting || '""' });
        this.logger.addLog('Images', { label: 'brands.showImages', value: this.settings.brands.showImages || '""' });
        this.logger.addLog('Images', { label: 'businessDetails.show_brand_logos', value: this.$store.state.businessDetails.show_brand_logos || '""', readonly: true });
      }
      
      this.$ezSetTitle('Brands');
      if (!this.preferences.brands) {
        this.$router.push('/').catch(err => console.log(err));
      }
      if ( this.$route.query.search ) {
        this.searchText = this.$route.query.search;
      }
      if ( this.$route.query.page ) {
        // brands?page=123
        this.currentPage = parseInt(this.$route.query.page);
      } else if ( this.$route.params.page ) {
        // also allow /brands/page/123
        this.currentPage = parseInt(this.$route.params.page);
      }

      await this.loadResults();
    },
    watch: {
      searchText: debounce(function () {
        this.loadResults();
        //this.goToPage();
      }, 1000)
    }
  };
</script>


<style lang="scss" scoped>
  .h6 {
    text-transform: capitalize;
  }
  .search-input {
    background-image: url('data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPGcgaWQ9IlN5bWJvbHMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9IjAuNSI+CiAgICAgICAgPGcgaWQ9IlNlYXJjaC1iYXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01MzYuMDAwMDAwLCAtMTMuMDAwMDAwKSIgZmlsbD0iIzJGMzU0MCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IlNlYXJjaC1CYXIiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTU0OC41MDgxMTQsMjYuNzQwNTQ4MSBDNTQ4Ljg0OTc5MSwyNy4wODY0ODQgNTQ5LjQwMjA2NiwyNy4wODY0ODQgNTQ5Ljc0Mzc0MywyNi43NDA1NDgxIEM1NTAuMDg1NDE5LDI2LjM5NDYxMjMgNTUwLjA4NTQxOSwyNS44MzQ5ODQ2IDU0OS43NDM3NDMsMjUuNDg5MDQ4NyBMNTQ3LjA0NzQ3NSwyMi43OTQzMTI3IEM1NDcuODEwMDMzLDIxLjc3MjI4MTEgNTQ4LjI2MTQ3MiwyMC41MDQ0NzE5IDU0OC4yNjE0NzIsMTkuMTMxMjE1MyBDNTQ4LjI2MTQ3MiwxNS43NDUwMzg2IDU0NS41MTY2NDgsMTMgNTQyLjEzMDczNiwxMyBDNTM4Ljc0NDgyNCwxMyA1MzYsMTUuNzQ1MDM4NiA1MzYsMTkuMTMxMjE1MyBDNTM2LDIyLjUxNzM5MiA1MzguNzQ0ODI0LDI1LjI2MjQzMDYgNTQyLjEzMDczNiwyNS4yNjI0MzA2IEM1NDMuNTA5MDUyLDI1LjI2MjQzMDYgNTQ0Ljc4MTEzMywyNC44MDc1NTMxIDU0NS44MDUwNzIsMjQuMDM5NzE4MiBMNTQ4LjUwODExNCwyNi43NDA1NDgxIFogTTUzNy43NTE2MzksMTkuMTMxMjE1MyBDNTM3Ljc1MTYzOSwxNi43MTI1MTc3IDUzOS43MTIyMjcsMTQuNzUxNzc1OCA1NDIuMTMwNzM2LDE0Ljc1MTc3NTggQzU0NC41NDkyNDQsMTQuNzUxNzc1OCA1NDYuNTA5ODMzLDE2LjcxMjUxNzcgNTQ2LjUwOTgzMywxOS4xMzEyMTUzIEM1NDYuNTA5ODMzLDIxLjU0OTkxMyA1NDQuNTQ5MjQ0LDIzLjUxMDY1NDggNTQyLjEzMDczNiwyMy41MTA2NTQ4IEM1MzkuNzEyMjI3LDIzLjUxMDY1NDggNTM3Ljc1MTYzOSwyMS41NDk5MTMgNTM3Ljc1MTYzOSwxOS4xMzEyMTUzIFoiIGlkPSJMb3VwZS1JY29uIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=');
    background-repeat: no-repeat;
    background-position: right 10px center;
    max-width: 300px;
  }
  a {
    color: var(--text);
    &:hover {
      text-decoration: none;
      * {
        color: var(--primary) !important;
      }
    }
  }
  .brand-image {
    object-fit: contain;
  }
  @media screen and (max-width: 576px) {
    .search-input {
      max-width: initial;
    }
  }
</style>
