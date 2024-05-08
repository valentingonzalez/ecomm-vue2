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
      <template v-else-if="storeSetting">
        <div :class="storeSetting.settingValue ? 'pb-4 border-bottom' : ''" style="transition: padding .3s;">
          <div class="row">
            <div class="col-5 offset-1">
              <div class="card p-2 pr-3" :class="{'custom-radio-selected' : !storeSetting.settingValue }">
                <div class="custom-control custom-radio">
                  <input :name="`yesno-${store}`" type="radio" :value="0" class="custom-control-input" v-model="storeSetting.settingValue" :id="`yes-${store}`">
                  <label class="custom-control-label w-100 lead" :for="`yes-${store}`">
                    Yes
                  </label>
                </div>
              </div>
            </div>
            <div class="col-5">
              <div class="card p-2 pr-3" :class="{'custom-radio-selected' : storeSetting.settingValue }">
                <div class="custom-control custom-radio">
                  <input :name="`yesno-${store}`" type="radio" :value="1" class="custom-control-input" v-model="storeSetting.settingValue" :id="`no-${store}`">
                  <label class="custom-control-label w-100 lead" :for="`no-${store}`">
                    No <span class="text-muted">(Will Display More Settings)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <transition name="fadeHeight">
          <div v-if="storeSetting.settingValue">
            <div class="row my-4">
              <div class="col-6">
                <div class="card p-2 pr-3" :class="{'custom-radio-selected' : storeSetting.type == 'allowAllButExclude'}">
                  <div class="custom-control custom-control-top custom-radio">
                    <input :name="`option-${store}`" type="radio" value="allowAllButExclude" class="custom-control-input" v-model="storeSetting.type" :id="`allowExclude-${store}`">
                    <label class="custom-control-label w-100 lead" :for="`allowExclude-${store}`">
                      <div class="text" style="font-size: 18px">
                        <template v-if="settingsKey == 'hidePrice'">Hide Pricing on all but Exclude:</template>
                        <template v-else-if="settingsKey == 'disableOrdering'">Disable Ordering on all but Exclude:</template>
                        <template v-else-if="settingsKey == 'disableDelivery'">Disable Delivery on all but Exclude:</template>
                        <template v-else-if="settingsKey == 'hideQuantity'">Hide Quantity on all but Exclude:</template>
                        <template v-else-if="settingsKey == 'disableShipping'">Disable Shipping on all but Exclude:</template>
                        <template v-else>Allow All But Exclude:</template>
                      </div>
                      <div class="text-muted">
                        <template v-if="settingsKey == 'hidePrice'">Show pricing only on the selected departments. Check the box next to any department for which product pricing SHOULD be displayed.</template>
                        <template v-else-if="settingsKey == 'disableOrdering'">Disable Ordering on all departments except those checked</template>
                        <template v-else-if="settingsKey == 'disableDelivery'">Allow delivery only on selected departments</template>
                        <template v-else-if="settingsKey == 'hideQuantity'">Hide quantity on hand except on selected departments</template>
                        <template v-else-if="settingsKey == 'disableShipping'">Disable shipping on all departments except those checked</template>
                        <template v-else>By enabling this setting, all departments will show EXCEPT the following</template>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="card p-2 pr-3" :class="{'custom-radio-selected' : storeSetting.type == 'allowOnlyThese'}">
                  <div class="custom-control custom-control-top custom-radio">
                    <input :name="`option-${store}`" type="radio" value="allowOnlyThese" class="custom-control-input" v-model="storeSetting.type" :id="`allowInclude-${store}`">
                    <label class="custom-control-label w-100 lead" :for="`allowInclude-${store}`">
                      <div class="text" style="font-size: 18px">
                        <template v-if="settingsKey == 'hidePrice'">Hide Pricing for ONLY these:</template>
                        <template v-else-if="settingsKey == 'disableOrdering'">Disable Ordering for ONLY these:</template>
                        <template v-else-if="settingsKey == 'disableDelivery'">Disable Delivery for ONLY these:</template>
                        <template v-else-if="settingsKey == 'hideQuantity'">Hide Quantity for ONLY these:</template>
                        <template v-else-if="settingsKey == 'disableShipping'">Disable Shipping for ONLY these:</template>
                        <template v-else>Allow Only These:</template>
                      </div>
                      <div class="text-muted">
                        <template v-if="settingsKey == 'hidePrice'">Show pricing on all but the selected departments. Check the box next to any department for which product pricing SHOULD NOT be displayed.</template>
                        <template v-else-if="settingsKey == 'disableOrdering'">Allow Ordering on all departments except those checked</template>
                        <template v-else-if="settingsKey == 'disableDelivery'">Disable delivery only on selected departments</template>
                        <template v-else-if="settingsKey == 'hideQuantity'">Show quantity on hand except on selected departments</template>
                        <template v-else-if="settingsKey == 'disableShipping'">Allow shipping on all departments except those checked</template>
                        <template v-else>If you check this box, ONLY the departments listed below will show up on the site</template>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <input type="text" v-model="search" placeholder="Search department" class="form-control search mb-4 mw-100" />
            <h6 class="text-muted text-uppercase">
              Selected Departments <span v-if="this.selectedDepartments.length > 0">({{this.selectedDepartments.length}})</span>
            </h6>
            <div class="card-body overflow-auto h-auto scrollstyle px-1" style="max-height: 450px;" >
              <DepartmentSelectorCard v-for="d in filteredDepartments" class="mb-1" :layout="'simple'" :hideButton="false" :selectable="true" :key="`od-${d.dept_id}`" :ref="`od-${d.dept_id}`" :department="d" @onSelect="selectDepartment" :selectedStore="`${selectedStore}`"/>
            </div>

            <div class="message-module border-top border-bottom border-gray py-4 px-3 mb-4">
              <div class="row">
                <div class="col-md-6">
                  Replace With a Message
                  <div class="text-muted">
                    By enabling, you can replace how the messaging displays on the website to a user.
                  </div>
                  <textarea v-model="storeSetting.replaceWithText" class="w-100 border-gray border p-2" rows="4"></textarea>
                </div>
                <div class="col-md-6">
                  <div class="card d-flex align-items-center justify-content-center p-4">
                    <img src="/images/depts-text-example.png" alt="Replace With Message" width="372" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </template>
    </div>
    <div v-else class="d-flex justify-content-center mt-4 pt-4">
      <div class="spinner spinner-border"></div>
    </div>
  </div>
</template>

<script>
  import WizardStoreList from '@/components/admin/wizard/wizard-store-list';
  import DepartmentSelectorCard from '@/components/admin/departments/department-selector-card';
  import WizardApiService from '@/api-services/wizard.service';
  import DepartmentsApiService from '@/api-services/departments.service';

  export default {
    name: 'WizardDepartmentsGenericSettings',
    components: {
      WizardStoreList,
      DepartmentSelectorCard
    },
    props: {
      settingsKey: {
        default: null
      }
    },
    data() {
      return {
        loading: true,
        saving: false,
        departments: null,
        selectedStore: null,
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
        return this.$parent.$parent.currentStep;
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
      },
      storeSetting() {
        return this.settings.settings ? this.settings.settings.find(e => e.business_id == this.selectedStore) : [];
      }
    },
    async mounted() {
      // force update computed property
      await this.$forceUpdate();
      await WizardApiService.getSettings(this.itemId).then(e => this.settings = e.data.settings);
      this.settings.settings = this.settings.settings.map(e => ({ ...e, settingValue: e.settingValue || 0, type: e.type || 'allowAllButExclude' }));
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
            this.selectedDepartments = ob.dept_ids;
            setTimeout(() => this.selectedDepartments.forEach(e => {
              if(this.$refs[`od-${e}`] && this.$refs[`od-${e}`][0])
                this.$refs[`od-${e}`][0].selected = true;
            }), 10);
          }
        }
      },
      selectDepartment(d) {
        let arr = this.settings.settings.find(e => e.business_id == this.selectedStore).dept_ids;
        if(d.selected) {
          arr.push(d.dept.dept_id);
        } else {
          arr = arr.filter(e => e != d.dept.dept_id);
        }
        this.settings.settings.find(e => e.business_id == this.selectedStore).dept_ids = arr;
        this.selectedDepartments = arr;
      },
      async save() {
        let obj = { ...this.settings, step_item_id: this.itemId, settingKey: this.settingsKey };
        delete Object.assign(obj, {applyToAll: this.$refs.storeList.applyToAll})['apply_to_all'];
        let selected = obj.settings.find(e => e.business_id == this.selectedStore);
        if(selected && selected.settingValue == 1 && !selected.dept_ids.length) {
          this.$swal('', 'Please, select at least one department to continue', 'error');
          return { status: '400' };
        }
        return await DepartmentsApiService.postSettings(obj);
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
  .scrollstyle::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  .scrollstyle::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  .scrollstyle::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  .scrollstyle::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  .custom-radio-selected{
    background: #fee2e2;
    border-color: #d31931;
  }
</style>