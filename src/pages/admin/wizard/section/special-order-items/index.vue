<template>
  <div>
    <WizardStoreList ref="storeList" :enableApplyToAll="true" :multiple="true" :selectedStore="selectedStores" @onSelect="pushStore" @onApplyToAll="onApplyToAll" class="border-bottom pb-4 mb-4" />
    <template v-if="(selectedStores && selectedStores.length)">
      <div v-for="store in selectedStores" class="card p-4 card-alt mb-4" :key="store">
        <transition name="fadeHeight">
          <div v-if="!applyToAll">
            <div class="border-bottom pb-3 text-center mb-4">
              <h5 v-if="store && stores.find(e => e.id == store)">Store: <span class="text-primary">{{ stores.find(e => e.id == store).name }}</span></h5>
            </div>
          </div>
        </transition>
        <FulfillmentOptionsSpecial :store="store" :specialOrder="getOrder(store)" :ref="`step-${store}`" class="mb-3" :autosave="false" @onSave="() => {}" />
      </div>
    </template>
  </div>
</template>

<script>
  import WizardStoreList from '@/components/admin/wizard/wizard-store-list';
  import FulfillmentOptionsSpecial from '@/components/admin/fulfillment-options/special';
  import AdminApiService from '@/api-services/admin.service';

  export default {
    name: 'WizardSpecialOrderItemsOptions',
    components: {
      WizardStoreList,
      FulfillmentOptionsSpecial
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
        specialOrders: []
      };
    },
    computed: {
      applyToAll() {
        return this.$refs.storeList.applyToAll;
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
      currentStep() {
        return this.$route.query.step || 1;
      },
      stores() {
        return this.$store.state.adminWizardBusinesses || [];
      }
    },
    async mounted() {
      await AdminApiService.getFulfillmentByKey('specialorder').then(e => this.specialOrders = e.data.data);
      this.specialOrders.forEach(e => {
        e.specialorder.special_order_sla_fields = e.specialorder.special_order_sla_fields;
      });
      this.selectedStores = this.applyToAll ? [String(this.stores[0].id)] : this.$route.query.store ? this.$route.query.store.split(',') : [String(this.stores[0].id)];
      this.loading = false;

    },
    methods: {
      async save() {
        let settings = [];
        this.selectedStores.forEach(store => {
          let sp = this.$refs[`step-${store}`][0];
          settings.push({
            business_id: store,
            enabled: sp.order.special_enabled,
            min: sp.order.special_order_sla_fields.min,
            max: sp.order.special_order_sla_fields.max, 
            disclaimer: sp.order.special_disclaimer
          });
        });
        return await AdminApiService.updateFulfillmentSpecialSettings({
          step_item_id: this.itemId,
          applyToAll: this.applyToAll,
          settings: settings
        });
      },
      getOrder(id) {
        return this.specialOrders.find(e => e.business_id == id).specialorder;
      },
      pushStore(stores) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { store: String(stores) }) }).catch(() => {});
        this.selectStore(stores);
      },
      selectStore(stores) {
        this.selectedStores = stores;
      },
      onApplyToAll(val) {
        this.selectStore(val ? [String(this.stores[0].id)] : this.$route.query.store.split(',').map(e => String(e)));
      }
    }
  };
</script>
<style lang="scss" scoped>
  .card-alt {
    border: 1px solid #E2E8F0;
    background: #f8fafc;
    border-radius: 10px;
    :deep(.main-container) {
      background: #fff;
    }
  }
</style>
