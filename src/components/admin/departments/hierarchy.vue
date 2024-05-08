<template>
  <div>
    <WizardStoreList ref="storeList" :enableApplyToAll="true" :multiple="true" :selectedStore="selectedStores" @onSelect="pushStore" @onApplyToAll="onApplyToAll" class="border-bottom pb-4 mb-4" />
    <div class="d-flex justify-content-center pt-5" v-if="loading">
      <div class="spinner-border"></div>
    </div>
    <template v-else-if="selectedStores && selectedStores.length && settings.length">
      <template v-for="store in selectedStores">
        <div class="card p-4 card-alt mb-4" v-if="!applyToAll || stores.find(e => e.id == store).base" :key="store">
          <div class="border-bottom pb-3 text-center mb-4" v-if="!applyToAll">
            <h5 v-if="store && stores.find(e => e.id == store)">Store: <span class="text-primary">{{ stores.find(e => e.id == store).name }}</span></h5>
          </div>
          <div class="d-flex justify-content-between w-100">
            <div>
              <h6 class="text-muted text-uppercase mb-3">Select option</h6>
              <div class="card p-3 pr-4 mb-3">
                <div class="custom-control custom-radio">
                  <input :name="`departmentsOption-${store}`" type="radio" :value="3" v-model="settings.find(e => e.business_id == store).settingValue" class="custom-control-input" :id="`all-${store}`">
                  <label class="custom-control-label w-100 lead" :for="`all-${store}`">
                    Show Departments, Classes & Finelines
                  </label>
                </div>
              </div>
              <div class="card p-3 pr-4 mb-3">
                <div class="custom-control custom-radio">
                  <input :name="`departmentsOption-${store}`" type="radio" :value="2" v-model="settings.find(e => e.business_id == store).settingValue" class="custom-control-input" :id="`depsandclasses-${store}`">
                  <label class="custom-control-label w-100 lead" :for="`depsandclasses-${store}`">
                    Show Departments & Classes
                  </label>
                </div>
              </div>
              <div class="card p-3 pr-4 mb-3">
                <div class="custom-control custom-radio">
                  <input :name="`departmentsOption-${store}`" type="radio" :value="1" v-model="settings.find(e => e.business_id == store).settingValue" class="custom-control-input" :id="`deps-${store}`">
                  <label class="custom-control-label w-100 lead" :for="`deps-${store}`">
                    Show Only Departments
                  </label>
                </div>
              </div>
              <div class="card p-3 pr-4">
                <div class="custom-control custom-radio">
                  <input :name="`departmentsOption-${store}`" type="radio" :value="0" v-model="settings.find(e => e.business_id == store).settingValue" class="custom-control-input" :id="`none-${store}`">
                  <label class="custom-control-label w-100 lead" :for="`none-${store}`">
                    Disable Departments Entirely
                  </label>
                </div>
              </div>
            </div>
            <div class="d-flex flex-column">
              <h6 class="text-muted text-uppercase mb-3">Previews</h6>
              <img class="gif" :src="`/images/Gifs (${Math.abs(settings.find(e => e.business_id == store).settingValue - 4)}).png`" alt="Preview" />
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
  import WizardStoreList from '@/components/admin/wizard/wizard-store-list';
  import DepartmentsApiService from '@/api-services/departments.service';

  export default {
    name: 'WizardDepartmentsHierarchy',
    components: {
      WizardStoreList
    },
    props: {
      id: {
        default: null
      }
    },
    data() {
      return {
        loading: true,
        selectedStores: null,
        settings: []
      };
    },
    computed: {
      applyToAll() {
        return this.$refs.storeList ? this.$refs.storeList.applyToAll : false;
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
    },
    async mounted() {
      await DepartmentsApiService.getHierarchy().then(resp => this.settings = resp.data.data);
      this.selectedStores = this.applyToAll ? [String(this.stores[0].id)] : this.$route.query.store ? this.$route.query.store.split(',') : [String(this.stores[0].id)];
      this.loading = false;
    },
    methods: {
      pushStore(stores) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { store: String(stores) }) }).catch(() => {});
        this.selectStore(stores);
      },
      selectStore(stores) {
        this.selectedStores = stores;
      },
      async save() {
        return await DepartmentsApiService.setHierarchy({
          step_item_id: this.itemId,
          applyToAll: this.applyToAll,
          settings: this.settings.filter(e => this.selectedStores.includes(String(e.business_id)))
        });
      },
      onApplyToAll(val) {
        this.selectStore(val ? [String(this.stores[0].id)] : this.$route.query.store.split(',').map(e => String(e)));
      }
    }
  };
</script>

<style scoped lang="scss">
  .card-alt {
    border: 1px solid #E2E8F0;
    background: #f8fafc;
    border-radius: 10px;
  }
  .gif {
    max-width: 487px;
    border-radius: 14px;
  }
</style>