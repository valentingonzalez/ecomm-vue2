<template>
    <div>
        <WizardStoreList ref="storeList" :enableApplyToAll="true" :multiple="true" :selectedStore="selectedStores" @onSelect="pushStore" @onApplyToAll="onApplyToAll" class="border-bottom pb-4 mb-4" :class="{'d-none': taskRunning}" />
        <div v-if="taskRunning">
            <div class="d-flex flex-column align-items-center justify-content-center my-auto" style="height: 400px;z-index: 20;">
                <div class="d-flex justify-content-center my-3">
                <div class="spinner-border"></div>
                </div>
                <div class="h4 font-weight-normal my-3">
                    Data Syncing in Progress
                </div>
                <div class="h6 font-weight-normal text-muted max-text-wd-500 text-center px-5">
                The page will refresh every 2 mins. You can exit this page and return later
                </div>
            </div>
        </div>
        <div v-else>
            <div class="d-flex justify-content-center pt-5" v-if="loading">
                <div class="spinner-border"></div>
            </div>
            <template v-else-if="selectedStores && selectedStores.length && settings && Object.keys(settings).length > 0">
                <template v-for="store in selectedStores">
                    <div class="card p-4 card-alt mb-4" v-if="!applyToAll || stores.find(e => e.id == store).base" :key="store">
                        <div class="border-bottom pb-3 text-center mb-4" v-if="!applyToAll">
                            <h5 v-if="store && stores.find(e => e.id == store)">Store: <span class="text-primary">{{ stores.find(e => e.id == store).name }}</span></h5>
                        </div>
                        <div class="d-flex flex-column justify-content-between w-100">
                            <h6 class="text-muted text-uppercase mb-3">Select brands</h6>
                            <div class="d-flex flex-row flex-wrap">
                                <div class="card px-3 pt-3 pb-2 mb-3 mr-3" v-for="(brand,idx) in brands" :key="`${idx}-${store}-${brand}`">
                                    <div class="custom-control custom-checkbox mb-1">
                                        <input :name="`brand-${store}-${brand}`" type="checkbox" value="1" v-model="settings[store][brand]" class="custom-control-input" :id="`all-${store}-${brand}`">
                                        <label class="custom-control-label w-100 lead text-capitalize" :for="`all-${store}-${brand}`">
                                            {{ brand.replaceAll("_", " ") }}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </template>
        </div>
    </div>
  </template>
  
  <script>
    import WizardStoreList from '@/components/admin/wizard/wizard-store-list';
    import AdminApiService from '@/api-services/admin.service';
  
    export default {
      name: 'WizardBrandsOptions',
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
            taskRunning: false,
            loading: true,
            selectedStores: null,
            settings: null,
            brands: [
                'coast_of_maine',
                'carhartt',
                'traeger',
                'weber',
                'leatherman',
                'kreg',
                'sodastream',
                'fillrite',
                'lilly_miller',
                'central'
            ]
        };
      },
      computed: {
        currentStep() {
          return (this.$parent.step ? this.$parent.step.order : null) || 1;
        },
        applyToAll: {
            get: function() {
                return this.$refs.storeList.applyToAll;
            },
            set: function(newValue) {
                this.$refs.storeList.applyToAll = newValue;
            }
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
        await this.checkStatus();
        await AdminApiService.getAuthorizedBrands().then(resp => {
            let brands = {};
            Object.keys(resp.data.brands).forEach((store_id) => {
                let brand = resp.data.brands[store_id];
                if(!brand){
                    brands[store_id] = {
                        coast_of_maine: false,
                        carhartt: false,
                        traeger: false,
                        weber: false,
                        leatherman: false,
                        kreg: false,
                        sodastream: false,
                        fillrite: false,
                        lilly_miller: false,
                        central: false,
                        store_id: store_id                    
                    };
                } else {
                    brands[store_id] = brand;
                }
            });
            this.settings = brands;
            this.applyToAll = resp.data.applyToAll;
            this.selectedStores = this.applyToAll ? [String(this.stores[0].id)] : this.$route.query.store ? this.$route.query.store.split(',') : [String(this.stores[0].id)];
        });
        this.loading = false;
        },
      methods: {
        async checkStatus() {
            let _self = this;
            try {
                let resp = await AdminApiService.checkBrandsSyncStatus();
                if(resp.status == "200") {
                    if(resp.data.running) { // running
                        this.taskRunning = true;
                        // check every 2 min
                        setTimeout(function() {
                            _self.checkStatus();
                        }, 120000); 
                    } else { 
                        this.taskRunning = false;
                    }
                } 
            } catch(e) {
                this.taskRunning = false;
            }
        },
        pushStore(stores) {
            this.$router.push({ query: Object.assign({}, this.$route.query, { store: String(stores) }) }).catch(() => {});
            this.selectStore(stores);
        },
        selectStore(stores) {
            this.selectedStores = stores;
        },
        async save() {
            return await AdminApiService.setAuthorizedBrands({
                step_item_id: this.itemId,
                applyToAll: this.applyToAll,
                settings: Object.values(this.settings).filter(e => this.selectedStores.includes(String(e.store_id)) || this.selectedStores.includes(Number(e.store_id)))
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
    .custom-checkbox > input.custom-control-input:checked ~ label.custom-control-label:after {
        width: 20px;
        height: 20px;
        left: -22px !important;
    }
</style>