<template>
  <main>
    <div class="container search-container" :class="{ 'secondary': $store.state.settings.navigationLayout == 'secondary' }">
      <template v-if="$store.state.settings.navigationLayout === 'secondary'">
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
            <li>
              <span>Search</span>
            </li>
          </ul>
        </div>

        <h1 class="mb-3 font-weight-bold">Searching for "{{ this.$route.query.keyword }}"</h1>
      </template>

      <div class="row">
        <div class="col-lg-3">
          <SearchDepartmentDropdownInput
            class="d-none d-md-block"
            v-if="$store.state.settings.products.showDepartmentDropdownInSearch"
          />
          <search-filters @hideFilters="hideFilters" :showFilters="showFilters" :departmentList="departmentList" :brandList="brandList"/>
        </div>

        <div class="col-lg-9">
          <search-results :sortOptions="$store.state.settings.products.sortOptions"
            :departmentList="departmentList"
            :brandList="brandList"
            :keyword="keyword"
            :deptId="deptId"
            :deptName="deptName"
            :trackClicks="true"
            :trackSearch="this.$route.query.keyword"
            @item-click="onItemClick">
            <template slot="filter-button">
              <button type="button" class="filters-toggle d-lg-none" @click.prevent="() => showFilters = true" aria-label="Toggle Filters">
                <svg width="23" height="23" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 7.79c.509 0 .921.413.921.921V22.08a.921.921 0 11-1.842 0V8.71c0-.508.412-.92.921-.92zM3.5 0c.509 0 .921.412.921.921v3.902h1.837a.742.742 0 110 1.483H.742a.742.742 0 010-1.483h1.837V.92C2.579.412 2.99 0 3.5 0zm16 12.242c.509 0 .921.412.921.921v8.916a.921.921 0 11-1.842 0v-8.916c0-.509.412-.921.921-.921zM19.5 0c.509 0 .921.412.921.921v8.353h1.837a.742.742 0 110 1.484h-5.516a.742.742 0 010-1.484h1.837V.921c0-.509.412-.921.921-.921zm-8 17.435c.509 0 .921.413.921.922v3.722a.921.921 0 11-1.842 0v-3.722c0-.51.412-.922.921-.922zM11.5 0c.509 0 .921.412.921.921v13.547h1.837a.742.742 0 110 1.484H8.742a.742.742 0 010-1.484h1.837V.92c0-.509.412-.921.921-.921z" fill="#ED672F" fill-rule="evenodd"/></svg>
              </button>
            </template>
          </search-results>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import SearchApiService from '@/api-services/search.service';
import SearchDepartmentDropdownInput from '@/components/search-department-dropdown-input';

export default {
  name: 'search',
  props: [
    'keyword', 'deptId', 'deptName'
  ],
  components: {
    SearchDepartmentDropdownInput,
  },
  data() {
    return {
      showFilters: false
    };
  },
  computed: {
    departmentList() {
      const capitalize = this.$options.filters.capitalize;
      const skipFmt = this.$store.state.settings.departments.skipAutoFormat;
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
  },
  methods: {
    hideFilters() {
      this.showFilters = false;
    },
    onItemClick(item) {
      const searchStr = this.$route.query.keyword;
      SearchApiService.trackSearchClick(searchStr, item.id, item.position);
    },
  }
};
</script>

<style scoped lang="scss">
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
    height: calc(100% - 180px) !important;
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
  }
</style>
