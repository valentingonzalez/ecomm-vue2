<template>
  <div>
    <WizardStoreList ref="storeList" :enableApplyToAll="true" :selectedStore="selectedStore" @onSelect="pushStore" class="border-bottom pb-4 mb-4" />
    <div class="card p-4 card-alt" v-if="departments">
      <transition name="fadeHeight">
        <div class="border-bottom pb-3 text-center mb-4" v-if="stores.length > 1 && !$refs.storeList.applyToAll">
          <h5 class="font-weight-bold" v-if="store">Store Name: <span class="text-primary">{{ store.name }}</span></h5>
        </div>
      </transition>
      <div v-if="loading" class="d-flex justify-content-center py-5">
        <div class="spinner-border"></div>
      </div>
      <template v-else>
        <div :class="settingValue ? 'pb-4 border-bottom' : ''" style="transition: padding .3s;">
          <div class="row">
            <div class="col-5 offset-1">
              <div class="card p-2 pr-3">
                <div class="custom-control custom-radio">
                  <input :name="`yesno-${store}`" type="radio" :value="0" class="custom-control-input" v-model="settingValue" :id="`yes-${store}`">
                  <label class="custom-control-label w-100 lead" :for="`yes-${store}`">
                    Yes
                  </label>
                </div>
              </div>
            </div>
            <div class="col-5">
              <div class="card p-2 pr-3">
                <div class="custom-control custom-radio">
                  <input :name="`yesno-${store}`" type="radio" :value="1" class="custom-control-input" v-model="settingValue" :id="`no-${store}`">
                  <label class="custom-control-label w-100 lead" :for="`no-${store}`">
                    No <span class="text-muted">(Will Display More Settings)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <transition name="fadeHeight">
          <div v-if="settingValue">
            <div class="row my-4">
              <div class="col-6">
                <div class="card p-2 pr-3">
                  <div class="custom-control custom-control-top custom-radio">
                    <input :name="`option-${store}`" type="radio" value="allowAllButExclude" class="custom-control-input" v-model="type" :id="`allowExclude-${store}`">
                    <label class="custom-control-label w-100 lead" :for="`allowExclude-${store}`">
                      <div class="text" style="font-size: 18px">Allow All But Exclude:</div>
                      <div class="text-muted">
                        By enabling this setting, all departments will show EXCEPT the following
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="card p-2 pr-3">
                  <div class="custom-control custom-control-top custom-radio">
                    <input :name="`option-${store}`" type="radio" value="allowOnlyThese" class="custom-control-input" v-model="type" :id="`allowInclude-${store}`">
                    <label class="custom-control-label w-100 lead" :for="`allowInclude-${store}`">
                      <div class="text" style="font-size: 18px">Allow Only These:</div>
                      <div class="text-muted">
                        If you check this box, ONLY the departments listed below will show up on the site
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <input type="text" v-model="search" placeholder="Search department" class="form-control search mb-3 mw-100" />
            <DepartmentSelectorCard v-for="d in filteredDepartments" class="mb-3" :layout="'simple'" :hideButton="false" :selectable="true" :key="`od-${d.dept_id}`" :ref="`od-${d.dept_id}`" :department="d" :selectedStore="`${selectedStore}`" @onSelect="selectDepartment"/>
          </div>
        </transition>
      </template>
    </div>
  </div>
</template>

<script>
  import WizardStoreList from '@/components/admin/wizard/wizard-store-list';
  import DepartmentSelectorCard from '@/components/admin/departments/department-selector-card';
  import WizardApiService from '@/api-services/wizard.service';
  import DepartmentsApiService from '@/api-services/departments.service';

  export default {
    name: 'WizardDepartmentsShowPricing',
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
        departments: null,
        selectedStore: null,
        type: 'allowOnlyThese',
        settingValue: 0,
        selectedDepartments: [],
        settings: null,
        search: ''
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
      filteredDepartments: {
        get() {
          return this.departments.filter(e => e.dept_name.toLowerCase().includes(this.search.toLowerCase()));
        }
      }
    },
    async mounted() {
      await WizardApiService.getSettings(this.itemId).then(e => this.settings = e.data.settings);
      this.selectedStore = this.$route.query.store || this.stores[0].id;
      this.selectStore(this.selectedStore);
    },
    methods: {
      pushStore(id) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { store: id }) }).catch(() => {});
        this.selectStore(id);
      },
      async selectStore(id) {
        this.loading = true;
        this.selectedStore = id;
        this.selectedDepartments = [];
        await WizardApiService.getDepartments(id).then(resp => this.departments = resp.data.data.departments);
        this.loading = false;
        if(this.settings && Object.entries(this.settings).length) {
          let ob = this.settings.settings.find(e => e.business_id == id);
          if(ob) {
            this.settingValue = ob.settingValue;
            this.selectedDepartments = ob.dept_ids;
            this.type = ob.type;
            setTimeout(() => this.selectedDepartments.forEach(e => {
              if(this.$refs[`od-${e}`] && this.$refs[`od-${e}`][0])
                this.$refs[`od-${e}`][0].selected = true;
            }), 10);
          }
        }
      },
      selectDepartment(d) {
        if(d.selected) {
          this.selectedDepartments.push(d.dept.dept_id);
        } else {
          this.selectedDepartments = this.selectedDepartments.filter(e => e != d.dept.dept_id);
        }
      },
      async save() {
        return await DepartmentsApiService.postSettings({
          settingKey: 'hidePrice',
          step_item_id: this.itemId,
          applyToAll: this.$refs.storeList.applyToAll,
          settings: [{
            business_id: this.$refs.storeList.applyToAll ? this.stores[0].id : this.store.id,
            settingValue: this.settingValue,
            type: this.type,
            dept_ids: this.selectedDepartments,
            replaceWithText: null
          }]
        });
      }
    },
    watch: {
      search() {
        setTimeout(() => {
          this.selectedDepartments.forEach(e => {
            if(this.$refs[`od-${e}`] && this.$refs[`od-${e}`][0]) this.$refs[`od-${e}`][0].selected = true;
          });
        }, 0);
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
  .fadeHeight-enter-active,
  .fadeHeight-leave-active {
    transition: all 0.2s;
    max-height: 500px;
  }
  .fadeHeight-enter,
  .fadeHeight-leave-to
  {
    opacity: 0;
    max-height: 0px;
  }
</style>