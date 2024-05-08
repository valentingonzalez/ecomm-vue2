<template>
  <main>
    <div class="container search-container">
      <div v-if="rentals && rentals.data.length" class="row">
        <div class="col-md-4 col-lg-3">
          <div class="card h-100">
            <div class="card-body pb-1">
              <ul class="list-unstyled p-0 m-0 filters">
                <li v-for="department in departments" :key="department.dept_id" class="pb-3 pb-md-4">
                  <a href="#" class="text-dark" @click.prevent="selectDepartment(department.dept_id)" :class="deptId == department.dept_id && 'active'">
                    <b>{{ department.dept_name }}</b>
                  </a>
                  <ul>
                    <li v-for="subDept in department.sub_dept" :key="subDept.sub_dept_id">
                      <a href="#" class="text-dark" @click.prevent="selectDepartment(department.dept_id, subDept.sub_dept_id)" :class="subDeptId == subDept.sub_dept_id && 'active'">
                        {{ subDept.sub_dept_name }}
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="mt-4 mt-md-0 col-md-8 col-lg-9" id="contents">
          <template v-if="department">
            <div class="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-3">
              <h5 class="font-weight-bold">
                {{ department.dept_name }}
                {{ subDepartment && `/ ${subDepartment.sub_dept_name}` }}
              </h5>
              <input type="text" class="form-control search-input" placeholder="Search..." v-model="searchText" />
            </div>
            <div class="preloader d-flex justify-content-center align-items-center w-100 mt-5" v-if="isLoading">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
            <div class="search-product row small-gutters" v-else-if="filteredProducts.length">
              <div v-for="(item, key) in filteredProducts" :key="key" class="col-6 col-lg-4 col-xl-3 search-product-item mb-2">
                <rental-item :item="item" />
              </div>
            </div>
            <div class="row justify-content-center" v-else>
              <span class="text-center">
                No products were found for this search
              </span>
            </div>
          </template>
          <div v-else-if="rentals">
            There are no rental products
          </div>
          <div v-else>
            <img src="/icons/loader.gif" class="loader" alt="Loading..." />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'rentals',
  data() {
    return {
      isLoading: false,
      searchText: ''
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth <= 576;
    },
    deptId() {
      return this.$route.query.deptId;
    },
    subDeptId() {
      return this.$route.query.subDeptId;
    },
    rentals() {
      return this.$store.state.rentals;
    },
    products() {
      return this.rentals && this.rentals.data;
    },
    departments() {
      return this.rentals && this.rentals.departments;
    },
    department() {
      return this.departments && this.departments.length && this.departments.filter(e => e.dept_id == this.deptId)[0];
    },
    subDepartment() {
      return this.department && this.department.sub_dept.filter(e => e.sub_dept_id == this.subDeptId)[0];
    },
    filteredProducts() {
      return this.products && this.products.filter(e => {
        if(this.subDeptId)
          return e.sub_dept_id == this.subDeptId;
        else {
          return e.dept_id == this.deptId;
        }
      }).filter(e => e.title.toLowerCase().includes(this.searchText.toLowerCase()))
      .sort((a, b) => a.title.localeCompare(b.title));
    }
  },
  created() {
    if(!this.$store.state.rentals)
      this.$store.dispatch('rentals');
  },
  mounted() {
    this.$ezSetTitle('Rentals');
    if(!this.deptId)
      if(this.departments && this.departments.length) {
        this.$router.replace({query: Object.assign({}, this.$route.query, {deptId: this.departments[0].dept_id})}).catch(err => console.log(err));
      }
  },
  watch: {
    departments(val) {
      if(val && val.length) {
        if(!this.deptId) {
          this.$router.replace({query: Object.assign({}, this.$route.query, {deptId: this.departments[0].dept_id})}).catch(err => console.log(err));
        } else {
          // Confirm if the dept_id exists in departments array
          const exists = this.departments.find(e => e.dept_id == this.deptId);
          if(exists === undefined) {
            this.$router.replace({query: Object.assign({}, this.$route.query, {deptId: this.departments[0].dept_id})}).catch(err => console.log(err));
          }
        }
      }
    }
  },
  methods: {
    selectDepartment(deptId, subDeptId) {
      this.$router.push({query: Object.assign({}, this.$route.query, {deptId: deptId, subDeptId: undefined})}).catch(err => console.log(err));
      if(subDeptId)
        this.$router.push({query: Object.assign({}, this.$route.query, {subDeptId: subDeptId})}).catch(err => console.log(err));

      this.isMobile && window.scrollTo({ top: document.getElementById('contents').offsetTop - 20, behavior: 'smooth' });
    }
  }
};
</script>

<style scoped lang="scss">
  .filters li {
    font-size: 15px;
    .active {
      color: var(--primary) !important;
    }
    a {
      display: flex;
      align-items: center;
      &:hover {
        text-decoration: none;
      }
      .img {
        width: 20px;
        display: flex;
        justify-content: center;
      }
    }
    ul {
      list-style: none;
      padding-left: .6rem;
      li {
        font-size: 13px;
        padding: 5px 0;
      }
    }
  }
  .search-input {
    max-width: 350px;
  }
</style>
