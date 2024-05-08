<template>
  <main>
    <template>
      <div class="container hero-wrapper" :class="{ 'secondary': $store.state.settings.navigationLayout == 'secondary' }">

        <div class="row">
          <div class="col-md-6 mt-1 mb-2">
            <div>
              <ul class="breadcrumb__wrapper mb-0">
                <li>
                  <a class="home-icon" :href="$store.state.settings.logoLink" aria-label="Home">
                    <img src="/images/breadcrumb-home.svg" alt="Home">
                  </a>
                </li>
                <li>
                  <span>Online Store</span>
                </li>
              </ul>

              <h3 class="title">Shop Our Products</h3>
              <div class="search d-flex">
                <search-suggestions @onFocus="searchInputFocus" @onBlur="searchInputBlur" @onSelected="searchInputSelected" @onSuggestion="onSuggestion" @onInputChange="onSearchInputChange" />
                <button type="button" @click="toSearchPage" class="btn-search-custom" aria-label="Search">
                  <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="search" transform="translate(1.000000, 1.000000)" stroke="#E31E24" stroke-width="2"><circle id="Oval" cx="6" cy="6" r="6"></circle><line x1="14" y1="14" x2="10.242" y2="10.242" id="Path"></line></g></g></svg>
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-6 d-flex justify-content-center">
            <img class="hero-image" src="/images/gerretsen/hero-avatar.png" alt="Hero Avatar">
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="department-selection">
              <h4>Shop by Department</h4>
              <div class="department-actions" v-click-outside="hideDropdown">
                <div class="department-input">
                  <div @click="showDepartmentDropdown = true">
                    Find a department
                  </div>

                  <ul class="dropdown-menu c-dropdown-menu" :style="showDepartmentDropdown ? 'display: block' : ''">
                    <li>
                      <input
                        type="text"
                        placeholder="Search..."
                        class="form-control search-input"
                        v-model="departmentDropdownSearch"
                      />
                    </li>
                    <li v-for="(d, i) in filteredDepartmentList" @click="goToDepartment(d)" :key="i">
                      {{ d.name }}
                    </li>
                  </ul>
                </div>

                <div class="divider"></div>

                <router-link to="/brands">
                  View All Brands
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="favourite-products-wrapper mt-5">
          <favourite-products-section />
      </div>

      <VFooter></VFooter>
    </template>
  </main>
</template>

<script>
import VFooter from './components/Footer';

import TrackerApiService from '@/api-services/tracker.service';
import searchSuggestions from '@/components/search-suggestions';

export default {
  name: 'IndexGerretsen',
  data() {
    return {
      departmentDropdownSearch: '',
      showDepartmentDropdown: false,
      searchKey: '',
      isSearching: false
    };
  },
  computed: {
    departmentList() {
      if(this.$store.state.departmentResults && this.$store.state.departmentResults.parent_departments)
        return this.$store.state.departmentResults.parent_departments;
      return [];
    },
    filteredDepartmentList() {
      return this.departmentList.filter(department => {
        return department.name.toLowerCase().includes(this.departmentDropdownSearch.toLowerCase());
      });
    },
  },
  components: {
    VFooter,
    searchSuggestions
  },
  methods: {
    toSearchPage(id, type) {
      let showInStock = this.$store.state.settings.products.filterShowOutOfStock ? 0 : 1;
      let sortBy = this.$route.query.sort || this.$store.state.settings.products.defaultSorting;
      
      this.searchKey = this.searchKey || '""';

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
    hideDropdown() {
      this.showDepartmentDropdown = false;
    },
    goToDepartment(department) {
      this.$router.push(department.target);
      this.hideDropdown();
    },
    searchInputFocus() {
      this.isSearching = true;
    },
    searchInputBlur() {
      this.isSearching = false;
    },
    onSuggestion(text) {
      if(text == '' || text == undefined) return;
        this.searchKey = text;
    },
    searchInputSelected(selected) {
      if(!selected) {
        this.toSearchPage();
        return;
      }
      switch(selected.name) {
        case 'products':
          this.searchKey = "";
          this.$router.push({
            name: 'products-id',
            params: {
              id: selected.item.sku,
              title: selected.item.title.replace(/[ /]/g, '+')
            }
          }).catch(err => console.log(err));
          break;
        case 'departments':
          this.$router.push({name: 'department-products', params: { id: selected.item.dept_id, title: selected.item.name }}).catch(err => console.log(err));
          break;
        case 'brands':
          this.searchKey = "";
          this.$router.push(`/brands/${selected.item.brand_id }`).catch(err => console.log(err));
          break;
        default:
          break;
      }
    },
    onSearchInputChange(searchKey) {
      this.searchKey = searchKey;
    }
  }
};
</script>

<style lang="scss">
.hero-wrapper {
  .search {
    position: relative;

    .form-control {
      border-radius: 8px;
    }

    .search-bar {
      width: 100%;

      input {
        border-radius: 40px !important;
        width: 100%;
      }
    }

    .btn-search-custom {
      border: none;
      background: none;
      position: absolute;
      right: 0;
      top: 0;
      padding: 8px 12px;
    }
  }
}
</style>

<style lang="scss" scoped>
.hero-wrapper {
  margin-bottom: 10px;
}

h3.title {
  padding-left: 0;
  font-weight: bold;
  margin-top: 12px;
  margin-bottom: 0;
  font-size: 40px;
}

.hero-image {
  border-radius: 100%;
  height: 250px;
  width: 250px;
}

.search {
  max-width: 564px;
  margin-top: 24px;
}

.department-selection {
  padding-left: 10px;
    
  h4 {
    font-weight: bold;
    font-size: 28px;
    margin-bottom: 0;
  }

  .department-actions {
    display: flex;
    align-items: center;

    .divider {
      height: 100px;
      border-left: 1px solid #d8d8d8;
      margin: 0 60px;
    }

    .department-input {
      position: relative;

      > div {
        width: 300px;
        background: white;
        padding: 12px;
        box-shadow: 0 0 30px 0 rgba(34, 44, 73, 0.04);
        border-radius: 8px;

        &:after {
          content: '';
          width: 12px;
          height: 12px;
          background: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='12px' height='8px' viewBox='0 0 12 8' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3EPath%3C/title%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='nav-down' fill='%23000000' fill-rule='nonzero'%3E%3Cpolygon id='Path' points='6 3.882 2.148 0.03 0.074 2.104 6 8.03 11.926 2.104 9.852 0.03'%3E%3C/polygon%3E%3C/g%3E%3C/g%3E%3C/svg%3E") no-repeat center;
          display: block;
          position: absolute;
          right: 12px;
          top: 16px;
        }

        &:hover {
          cursor: pointer;
        }
      }

      .dropdown-menu {
        width: 100%;
        max-height: 320px;
        overflow-y: auto;

        &:not(:first-child) {
          padding: 0;
        }

        li {
          padding: 8px;
          transition: 200ms;

          &:hover {
            cursor: pointer;
            background: #efefef;
          }
        }
      }
    }

    a {
      padding: 12px;
      background: black;
      color: white;
      border-radius: 6px;
      font-weight: bold;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
      transition: 200ms;
      white-space: nowrap;
      
      &:hover {
        text-decoration: none;
        box-shadow: 0 6px 6px rgba(0, 0, 0, 0.15);
      }
    }
  }
}

@media screen and (max-width: 767px) {
  .favourite-products-wrapper {
    width: 100%;
    overflow-x: hidden;
  }

  .department-selection {
    margin-top: 32px;
    padding-left: 0;
  }

  .search {
    max-width: 100%;
    margin-top: 16px;
    margin-bottom: 24px;
  }
}

@media screen and (max-width: 624px) {
  .department-selection {
    .department-actions {
      flex-direction: column;
      margin-top: 24px;
      align-items: flex-start;

      .department-input {
        width: 100%;

        > div {
          width: 100%;
        }
      }

      .divider {
        border-bottom: 1px solid #d8d8d8;
        margin: 40px 0;
        height: 0;
        width: 100%;
      }
    }
  }
}

</style>
