<template>
  <div v-if="$ezHasNoPermission('pos_data_syncer')">
    <no-permission-truevalue page="POS Data Syncer"></no-permission-truevalue>
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <h1>POS Data Syncer</h1>
        <is-saved :param="saving" />
      </div>
    </div>
    <div class="settings-body">
      <div v-for="(store, index) in stores" :key="index" class="store-box mb-3">
        <h2 class="h3 mb-4">{{ store.name }} POS Info</h2>
        <p>
          <span v-for="(data, key, i) in store.data" :key="i" class="mr-3">
            <b>{{ key }}:</b> {{ data }}
          </span>
        </p>
        <div class="info-lists row my-4">
          <div class="col-md-4">
            <h5>Customers</h5>
            <div class="count">
              <ICountUp :endVal="store.customers" />
            </div>
          </div>
          <div class="col-md-4">
            <h5>Inventory</h5>
            <div class="count">
              <ICountUp :endVal="store.inventory" />
            </div>
          </div>
        </div>
        <h6 class="border-bottom border-gray pb-2">Product Settings</h6>
        <div class="row my-3">
          <div class="col-md-4 mb-4 mb-xl-0">
            Show Stock Level
            <div class="custom-control custom-switch">
              <input type="checkbox" v-model="store.showStockLevel" class="custom-control-input" :id="`stock-${index}`" @change="saveData(store)">
              <label
                class="custom-control-label" 
                :for="`stock-${index}`"
                v-html="store.showStockLevel ? 'Enabled' : 'Disabled'">
              </label>
            </div>
          </div>

          <div class="col-md-4 mb-4 mb-xl-0">
            Out of Stock Product
            <div class="custom-control custom-switch">
              <input type="checkbox" v-model="store.showOutOfStockSpecial" class="custom-control-input" :id="`outOfStockProduct-${index}`" @change="saveData(store)">
              <label
                class="custom-control-label" 
                :for="`outOfStockProduct-${index}`"
                v-html="store.showOutOfStockSpecial ? 'Special Order' : 'Hidden'">
              </label>
            </div>
          </div>

          <!-- <div class="col-md-4 mb-4  mb-lg-0">
            Show Competitors Level
            <div class="custom-control custom-switch">
              <input type="checkbox" v-model="store.showCompetitors" class="custom-control-input" :id="`competitors-${index}`" @change="saveData(store)">
              <label
                class="custom-control-label" 
                :for="`competitors-${index}`"
                v-html="store.showCompetitors ? 'Enabled' : 'Disabled'">
              </label>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import ICountUp from 'vue-countup-v2';
  import NoPermissionTruevalue from "./no-permission-truevalue";

  export default {
    name: 'PosDataSyncer',
    components: {
      ICountUp,
      NoPermissionTruevalue
    },
    data() {
      return {
        stores: [],
        saving: false
      };
    },
    computed: {
      slug() {
        return this.$store.state.business_slug;
      }
    },
    async mounted() {
      if(this.slug && !this.$ezHasNoPermission('pos_data_syncer')) {
        let response = await AdminService.getPosInfo();
        this.stores = response.data.stores;
      }
    },
    methods: {
      saveData(store) {
        let data = {
          storeId: store.storeId,
          showStockLevel: store.showStockLevel,
          showOutOfStockSpecial: store.showOutOfStockSpecial,
          showCompetitors: store.showCompetitors
        };
        this.saving = true;
        AdminService.savePosInfo(data).then(() => {
          this.saving = false;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .h3 {
    font-weight: 400;
  }
  .count {
    font-size: 34px;
    color: var(--primary);
  }
  .store-box:not(:last-child) {
    border-bottom: 1px solid #e5e5e5;
  }
</style>
