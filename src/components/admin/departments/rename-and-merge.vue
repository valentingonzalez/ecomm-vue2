<template>
  <div>
    <WizardStoreList :selectedStore="selectedStore" @onSelect="pushStore" class="border-bottom pb-4 mb-4" />
    <div class="card p-4 card-alt">
      <div class="border-bottom pb-3 text-center mb-4" v-if="stores.length > 1">
        <h5 class="font-weight-bold" v-if="store">Store Name: <span class="text-primary">{{ store.name }}</span></h5>
      </div>
      <div v-if="loading" class="d-flex justify-content-center py-5">
        <div class="spinner-border"></div>
      </div>
      <template v-else>
        <template v-if="selectedTab == 1">
          <div class="d-flex align-items-center justify-content-center" v-if="loading">
            <div class="spinner-border"></div>
          </div>
          <div class="mb-4" v-if="flaggedDepartments">
            <template v-if="flaggedDepartments.length">
              <div class="lead text-center mb-4">
                <div class="font-weight-bold">Flagged Departments <span class="text-primary">({{ flaggedDepartments.length }})</span></div>
              </div>
              <div class="card mb-4 p-4" v-for="(dept, i) in flaggedDepartments" :key="`flagged-${i}`">
                <h6 class="font-weight-bold">Enter Merged Department Name:</h6>
                <div class="border-bottom pb-3 mb-3">
                  <form class="row" @submit.prevent="renameDepartments(dept.name, i)">
                    <div class="col-md-7 d-flex">
                      <input class="form-control form-control-sm" type="text" v-model="dept.name" :key="`flaggedInput-${i}`" />
                      <button :disabled="!dept.departments.find(e => e.selected)" class="btn btn-primary btn-sm  ml-2 font-weight-normal text-nowrap" type="submit">
                        Rename Selected Text
                      </button>
                    </div>
                  </form>
                </div>
                <DepartmentSelectorCard v-for="(d, ii) in dept.departments" :class="{ 'mb-1' : ii < dept.departments.length - 1, 'border border-primary' : isRenamed(d.dept_id) }" :layout="'simple'" :hideButton="false" :allowCopy="!isRenamed(d.dept_id)" :selectable="true" :ref="`deptselector-${d.dept_id}`" :key="`od-${d.dept_id}`" :department="d" :forceExpand="forceExpand" :selectedStore="`${selectedStore}`" @onSelect="onSelectDepartment($event, d)" @onCopy="onCopy(dept, $event)" />
              </div>
            </template>
            <div v-else class="mb-4 text-center">
              <h6 class="font-weight-bold">Congratulations! EZ-AD did not find any departments that needed renaming or merging.</h6>
            </div>
          </div>          
        </template>
      </template>
    </div>
  </div>
</template>

<script>
  import WizardStoreList from '@/components/admin/wizard/wizard-store-list';
  import DepartmentSelectorCard from '@/components/admin/departments/department-selector-card';
  import DepartmentsApiService from '@/api-services/departments.service';

  export default {
    name: 'WizardDepartmentsRenameAndMerge',
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
        saving: false,
        selectedStore: null,
        departments: null,
        otherDepartments: null,
        forceExpand: false,
        renamedDepartments: [],
        bulkDepartments: [],
        allSelected: false,
        selectedTab: 1,
        flaggedDepartments: [],
        wellNamed: []
      };
    },
    computed: {
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
      remainingDepartments() {
        return this.wellNamed;
      }
    },
    async mounted() {
      this.selectedStore = this.$route.query.store || this.stores[0].id;
      this.selectStore(this.selectedStore);
    },
    methods: {
      renameDepartments(name, i) {
        let depts = this.flaggedDepartments[i].departments.filter(e => e.selected);
        let deptIds = depts.map(e => e.dept_id);
        if(!deptIds.length) return;
        depts.forEach(e => {
          if(this.isRenamed(e.dept_id)) {
            this.renamedDepartments.forEach(d => {
              d.dept_ids = d.dept_ids.filter(i => i != e.dept_id);
            });
          }
          e.alias = { name: name };
        });
        this.renamedDepartments.push({ name: name, dept_ids: deptIds });
        this.renamedDepartments = this.renamedDepartments.filter(e => e.dept_ids && e.dept_ids.length);
      },
      isRenamed(id) {
        return this.renamedDepartments.map( e => e.dept_ids).flat().some(e => e == id);
      },
      async save() {
        if(!this.renamedDepartments || !this.renamedDepartments.length)
          return true;
        this.saving = true;
        let data = {
          business_id: this.selectedStore,
          step_item_id: this.itemId,
          settings: this.renamedDepartments
        };
        return await DepartmentsApiService.renameMerge(data).then(() => { this.saving = false; return true; });
      },
      onCopy(dept, name) {
        dept.name = name;
      },
      selectDepartment() {
      },
      onSelectDepartment(args, dept) {
        dept.selected = args.selected;
      },
      pushStore(id) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { store: id }) }).catch(() => {});
        this.selectStore(id);
      },
      async selectStore(id) {
        this.loading = true;
        this.selectedStore = id;
        let resp = await DepartmentsApiService.getHierarchyWithAlias(this.selectedStore);
        this.flaggedDepartments = Object.entries(resp.data.data.flagged).map(e => ({ name: e[0], departments: e[1].map(d => ({ ...d, renamed: false, selected: false })) }));
        this.wellNamed = resp.data.data.wellNamed;
        this.loading = false;
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