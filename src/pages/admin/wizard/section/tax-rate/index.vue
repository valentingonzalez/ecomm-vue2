<template>
  <div>
    <WizardStoreList ref="storeList" :enableApplyToAll="true" :multiple="true" :selectedStore="selectedStores" @onSelect="pushStore" @onApplyToAll="onApplyToAll" class="border-bottom pb-4 mb-4" />
    <template v-if="(selectedStores && selectedStores.length && rates.length)">
      <div v-for="store in selectedStores" class="card p-4 card-alt mb-4" :key="store">
        <div class="border-bottom pb-3 text-center mb-4" v-if="!applyToAll">
          <h5 v-if="store && stores.find(e => e.id == store)">Store: <span class="text-primary">{{ stores.find(e => e.id == store).name }}</span></h5>
        </div>
        <div class="taxes d-flex flex-column align-items-center">
          <div v-if="loading" class="d-flex align-items-center justify-content-center">
            <div class="spinner-border my-2"></div>
          </div>
          <template>
            <div class="input-group">
              <div class="input-group-prepend mr-0">
                <span class="input-group-text justify-content-center" :id="`tax-details-${store}`">%</span>
              </div>
              <input type="number" class="form-control text-muted text-uppercase font-weight-bold" placeholder="Tax Details" v-model="rates.find(e => e.business_id == store).tax_rate" aria-label="Username" :aria-describedby="`tax-details-${store}`" @keypress="onKeyPress" @paste.prevent="() => {}" />
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import WizardStoreList from '@/components/admin/wizard/wizard-store-list';
  import TaxesApiService from '@/api-services/admin/taxes.service';

  export default {
    name: 'WizardTaxRate',
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
        rates: [],
        loading: true,
        selectedStores: null,
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
      await TaxesApiService.getTaxes().then(resp => this.rates = resp.data.rates);
      this.selectedStores = this.applyToAll ? [String(this.stores[0].id)] : this.$route.query.store ? this.$route.query.store.split(',') : [String(this.stores[0].id)];
      this.loading = false;
    },
    methods: {
      async save() {
        return await TaxesApiService.saveTaxes({
          step_item_id: this.itemId,
          applyToAll: this.applyToAll,
          settings: this.rates.map(e => ({ ...e, tax_rate: Number(e.tax_rate) }))
        }).catch(err => {
          this.$swal(err.response.data.error.tax_rate[0], '', 'error');
          return err.response;
        });
        //return await this.$refs[`step-${this.currentStep}`].save();
      },
      onKeyPress(evt) {
        if(!/[0-9\./]+/.test(evt.key)) {
          evt.preventDefault();
        }
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
  }
  .text-muted {
    color: #64748B !important;
  }
  .taxes {
    .input-group {
      max-width: 400px;
    }
    .input-group-text {
      width: 60px;
    }
    .form-control,
    .input-group-text {
      height: 50px !important;
      font-weight: bold !important;
      &[disabled] {
        opacity: 1 !important;
        background: #eee !important;
      }
    }
  }
</style>