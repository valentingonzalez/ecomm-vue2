<template>
  <div>
    <WizardStoreList :selectedStore="selectedStore" @onSelect="pushStore" class="border-bottom pb-4 mb-4" />
    <div class="nav nav-tabs">
      <div class="nav-item">
        <a class="nav-link" :class="{ 'active' : selectedTab == 1 }" href="#" @click.prevent="selectedTab = 1">
          Departments That Need Verification
        </a>
      </div>
      <div class="nav-item">
        <a class="nav-link" :class="{ 'active' : selectedTab == 2 }"  href="#" @click.prevent="selectedTab = 2">
          Departments That Passed Verification
        </a>
      </div>
      <div class="flex-grow-1 border-bottom"></div>
    </div>
    <div class="card p-4 card-alt">
      <div class="border-bottom pb-3 text-center mb-4" v-if="stores.length > 1">
        <h5 class="font-weight-bold" v-if="store">Store Name: <span class="text-primary">{{ store.name }}</span></h5>
      </div>
      <div class="d-flex align-items-center justify-content-between mb-4" :class="{ 'disabled' : loading }">
        <div class="d-flex align-items-center">
          <!--<input type="text" placeholder="Search by name" class="form-control search mr-3" />-->
          <div class="custom-control custom-checkbox text-nowrap">
            <input type="checkbox" class="custom-control-input" id="showHiddenDepartments" v-model="showHiddenDepartments" />
            <label class="custom-control-label" for="showHiddenDepartments">
              Show Hidden Departments
            </label>
          </div>
        </div>
        <template v-if="this.departments">
          <div class="d-flex" v-if="(selectedTab == 1 && filteredDepartments.length > 0) || (selectedTab == 2 && filteredOtherDepartments.length > 0)">
            <button type="button" class="btn bg-white border btn-sm" @click="collapseAll">
              Collapse All
            </button>
            <button type="button" class="btn bg-white border btn-sm ml-3" @click="expandAll">
              Expand All
            </button>
          </div>
        </template>
      </div>
      <div v-if="loading" class="d-flex justify-content-center py-5">
        <div class="spinner-border"></div>
      </div>
      <template v-else>
        <template v-if="selectedTab == 1">
          <div class="mb-4" v-if="filteredDepartments && filteredDepartments.length > 0">
            <h6 class="font-weight-bold">Departments that Need Verification ({{ filteredDepartments.length }})</h6>
            <!-- <p class="lead text-muted">
              We have detected some departments that look like they should not be displayed on the website. 
            </p> -->
            <p class="lead text-muted">
              Review these departments to confirm that they should not be displayed on the website.  Unhide any department that should be displayed. When complete, open the Departments That Passed Verification tab to review the recommended departments and hide any that should not be displayed. 
            </p>
            <div class="d-flex align-items-end justify-content-between mb-3 mt-1" v-if="filteredDepartments.length">
              <div class="custom-control custom-checkbox text-nowrap ml-2 mt-3">
                <input type="checkbox" class="custom-control-input" id="allSelected" v-model="allSelected" @change="toggleAll" />
                <label class="custom-control-label" for="allSelected">
                  Select All
                </label>
              </div>
              <div v-if="bulkDepartments.length">
                <button class="btn btn-sm btn-outline-secondary bg-white text-tiny text-gray" v-if="bulkDepartments.filter(e => e.hidden).length" @click.prevent="showSelectedDepartments">
                  Show Selected
                </button>
                <button class="btn btn-sm btn-outline-secondary bg-white text-tiny text-gray ml-2" v-if="bulkDepartments.filter(e => !e.hidden).length" @click.prevent="hideSelectedDepartments">
                  Hide Selected
                </button>
              </div>
            </div>
            <DepartmentSelectorCard :selectable="true" :showProductsCount="true" :ref="`deptselector-${department.dept_id}`" class="border-primary mb-1" v-for="department in filteredDepartments" :key="`od-${department.dept_id}`" :department="department" :forceExpand="forceExpand" :selectedStore="`${selectedStore}`" @onHidden="onHidden" @onSelect="onSelectDepartment" />
          </div>
          <div v-else class="mb-4 text-center">
            <h6 class="font-weight-bold">Congratulations! Based on our Verification Test, All of your department names seems correct!</h6>
          </div>
        </template>
        <template v-if="selectedTab == 2">
          <div v-if="filteredOtherDepartments && filteredOtherDepartments.length">
            <h6 class="font-weight-bold">Other Departments ({{ otherDepartments.length }})</h6>
            <p class="lead text-muted">
              The remaining departments seem to be well-named based on our Department Validator
            </p>
            <DepartmentSelectorCard v-for="department in filteredOtherDepartments" :showProductsCount="true" :key="`od-${department.dept_id}`" class="mb-3" :department="department" :forceExpand="forceExpand" :selectedStore="`${selectedStore}`" @onHidden="onHidden" />
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
  import WizardStoreList from '@/components/admin/wizard/wizard-store-list';
  import DepartmentSelectorCard from '@/components/admin/departments/department-selector-card';
  import WizardApiService from '@/api-services/wizard.service';
  import ProductService from '@/api-services/product.service';
  import DepartmentsApiService from '@/api-services/departments.service';

  export default {
    name: 'WizardDepartmentsDisplayed',
    components: {
      WizardStoreList,
      DepartmentSelectorCard
    },
    props: {
      id: {
        default: null
      }
    },
    data() {
      return {
        loading: true,
        selectedStore: null,
        departments: null,
        otherDepartments: null,
        forceExpand: false,
        selectedDepartments: [],
        bulkDepartments: [],
        showHiddenDepartments: false,
        allSelected: false,
        selectedTab: 1
      };
    },
    computed: {
      filteredDepartments() {
        return this.showHiddenDepartments ? this.departments : this.departments.filter(e => !e.hidden);
      },
      filteredOtherDepartments() {
        return this.showHiddenDepartments ? this.otherDepartments : this.otherDepartments.filter(e => !e.hidden);
      },
      step() {
        return this.$store.state.adminWizardSteps.find(e => e.id == this.$route.meta.id);
      },
      currentItem() {
        return this.$route.query.step || 1;
      },
      itemId() {
        return this.step.items[this.currentItem - 1].id;
      },
      stores() {
        return this.$store.state.adminWizardBusinesses || [];
      },
      store() {
        return this.stores.find(e => e.id == this.selectedStore);
      },
    },
    async mounted() {
      this.selectedStore = this.$route.query.store || this.stores[0].id;
      this.selectStore(this.selectedStore);
    },
    methods: {
      onHidden(args) {
        /*if(args.selected) {
          this.bulkDepartments.forEach(e => {
            this.departments.find(d => d.dept_id == e.dept_id).hidden = args.dept.hidden;
            this.selectDepartment(this.departments.find(d => d.dept_id == e.dept_id));
          });
          return;
        }*/
        this.selectDepartment(args.dept);
      },
      selectDepartment(department) {
        let dept = this.selectedDepartments.find(n => n.dept_id == department.dept_id);
        if(!dept)
          this.selectedDepartments.push({ dept_id: department.dept_id, hidden: department.hidden });
        else {
          dept.hidden = department.hidden;
        }
        this.bulkDepartments = this.bulkDepartments.map(e => e.dept_id == department.dept_id ? { dept_id: department.dept_id, hidden: department.hidden } : e);
        if(!this.showHiddenDepartments) {
          if(department.hidden) {
            this.bulkDepartments = this.bulkDepartments.filter(e => e.dept_id != department.dept_id);
          }
        }
      },
      onSelectDepartment(args) {
        if(args.selected) {
          this.bulkDepartments.push({ dept_id: args.dept.dept_id, hidden: args.dept.hidden });
          if(this.bulkDepartments.length == this.filteredDepartments.length)
            this.allSelected = true;
        } else {
          this.bulkDepartments = this.bulkDepartments.filter(e => e.dept_id != args.dept.dept_id);
          this.allSelected = this.bulkDepartments.length == this.filteredDepartments.length;
        }
      },
      hideSelectedDepartments() {
        this.bulkDepartments.forEach(e => {
          this.departments.find(d => d.dept_id == e.dept_id).hidden = true;
          this.selectDepartment(this.departments.find(d => d.dept_id == e.dept_id));
        });
      },
      showSelectedDepartments() {
        this.bulkDepartments.forEach(e => {
          this.departments.find(d => d.dept_id == e.dept_id).hidden = false;
          this.selectDepartment(this.departments.find(d => d.dept_id == e.dept_id));
        });
      },
      pushStore(id) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { store: id }) }).catch(() => {});
        this.selectStore(id);
      },
      async selectStore(id) {
        this.loading = true;
        this.selectedStore = id;
        let ret = await WizardApiService.getDepartmentsWithBad(this.selectedStore);
        this.departments = ret.data.data.flagged;
        this.otherDepartments = ret.data.data.other;
        this.loading = false;
      },
      async save() {
        if(this.selectedDepartments.length) {
          return await DepartmentsApiService.setHidden({
            business_id: this.selectedStore,
            step_item_id: this.itemId,
            settings: this.selectedDepartments
          });
        } else {
          return true;
        }
        
      },
      async toggleExpand(id) {
        let dept = this.departments.find(e => e.dept_id == id);
        dept.expanded = !dept.expanded;
        if(!dept.products || !dept.products.length) {
          dept.loading = true;
          let resp = await ProductService.getRandomProducts({ dept_id: id, limit: 4 });
          dept.products = resp.data.data.data;
        dept.loading = false;
        }
      },
      toggleAll() {
        let departments = this.showHiddenDepartments ? this.departments : this.filteredDepartments;
        departments.forEach(e => {
          this.$refs[`deptselector-${e.dept_id}`][0].selected = this.allSelected;
          this.$refs[`deptselector-${e.dept_id}`][0].onSelect();
        });
      },
      expandAll() {
        this.forceExpand = true;
      },
      collapseAll() {
        this.forceExpand = false;
      }
    },
    watch: {
      showHiddenDepartments(val) {
        if(val && this.allSelected) {
          setTimeout(() => {
            this.toggleAll();
          }, 10);
        }
        if(!val) {
          this.bulkDepartments = this.bulkDepartments.filter(e => !e.hidden);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .card-alt {
    border: 1px solid #E2E8F0;
    background: #f8fafc;
    border-radius: 10px;
  }
  .nav-tabs {
    border: 0;
    .nav-item {
      .nav-link {
        border-bottom: 1px solid #dee2e6;
        margin-bottom: 0;
        &.active {
          background: #f8fafc;
          border-bottom: none;
        }
      }
    }
    + .card {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-top: 0;
    }
  }
</style>