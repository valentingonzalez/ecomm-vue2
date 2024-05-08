<template>
  <div v-if="$store.state.settings.layout != 'catalog' && options">
    <div>
      <div v-if="!readOnly || !wizard_enabled" class="alert alert-warning d-flex mb-3">
        By enabling advanced shipping feature you will be charged ${{ ($store.state.businessDetails.advanced_shipping_fee || 75) }} monthly.
      </div>
      <div v-if="disableRequest && disableRequest.action == 'Disable'" class="alert alert-danger d-flex mb-3">
        We are looking into your request to disable Advanced Shipping. The support staff will get in touch with you shortly.
      </div>
      <div class="d-flex justify-content-between align-items-center">        
        <div v-if="readOnly && wizard_enabled">
          <h5 class="mb-2 font-weight-bold">Advanced Shipping</h5>
          <div class="text-muted mr-5">
            Similar to Basic Shipping but has advanced features such as Weight Based ordering, which will calculate upon checkout, Printing of Shipping Labels from major carriers, adding your shipping account numbers to UPS,Fedex,Post Office for further discounts. This option is more robust for accounts that want a more A-Z solution for shipping. Any product that does not meet the weight criteria will use the options of Basic Shipping.
          </div>
        </div>
        <div class="custom-control custom-switch flex-column">
          <input type="checkbox" v-model="options.advanced_shipping_enabled" class="custom-control-input" id="shipping-advanced" @change="saveData" @click="handleEnable">
          <label class="custom-control-label" for="shipping-advanced">{{options.advanced_shipping_enabled ? 'Enabled' : 'Disabled'}} Advanced Shipping</label>
        </div>
        <button v-if="readOnly && wizard_enabled" class="btn btn-outline-primary btn-xs ml-3" type="button" @click="configure = !configure">
          Configure
        </button>
      </div>
    </div>
    <transition v-if="configure || (!readOnly || !wizard_enabled)" name="fadeHeight">
      <div class="overflow-hidden" v-if="options.advanced_shipping_enabled">
        <template v-if="options.advanced_shipping_enabled">          
          <div class="mt-3">
            <label><span :class="{'disabled-label': !options.advanced_shipping_enabled}">Please Add Your Carrier Numbers!</span></label>
            <div>
              <button class="btn btn-primary" v-if="$store.state.businessDetails.stripe_account_id || $store.state.businessDetails.stripe_account_id_mig" @click="$refs.createLabelModal.showModal()" :disabled="!options.advanced_shipping_enabled">
                Manage Carriers
              </button>
              <div v-else>
                <small class="text-primary">connect your stripe account to add carriers</small>
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <CreateLabelModal ref="createLabelModal" :onlyAccounts="true" @updateSettings="loadAdvShipping"/>
          </div>
          <div class="row mt-4">
            <div class="col-sm-6 col-lg-4 col-xl-3 mt-2">
              <label>Default Weight (lbs)</label>
              <div class="input-group" style="width: 150px;">
                <input type="number" min="1" class="form-control" v-model="options.default_product_weight" @change="saveData" oninput="this.value = this.value.slice(0, 4)" :class="{'border border-danger' : this.errors.default_product_weight}" />
              </div>
            </div>
            <div class="col-sm-6 col-lg-4 col-xl-3 mt-2">
              <label>Default Height (in)</label>
              <div class="input-group" style="width: 150px;">
                <input type="number" min="1" class="form-control" v-model="options.default_product_height" @change="saveData" oninput="this.value = this.value.slice(0, 4)" :class="{'border border-danger' : this.errors.default_product_height}" />
              </div>
            </div>
            <div class="col-sm-6 col-lg-4 col-xl-3 mt-2">
              <label>Default Width (in)</label>
              <div class="input-group" style="width: 150px;">
                <input type="number" min="1" class="form-control" v-model="options.default_product_width" @change="saveData" oninput="this.value = this.value.slice(0, 4)" :class="{'border border-danger' : this.errors.default_product_width}" />
              </div>
            </div>
            <div class="col-sm-6 col-lg-4 col-xl-3 mt-2">
              <label>Default Length (in)</label>
              <div class="input-group" style="width: 150px;">
                <input type="number" min="1" class="form-control" v-model="options.default_product_length" @change="saveData" oninput="this.value = this.value.slice(0, 4)" :class="{'border border-danger' : this.errors.default_product_length}" />
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-12">
              <!-- <label><span>Additional Shipping Fee</span></label> -->
              <!-- <p>The below fee/percentage will automatically be added to the shipping cost returned by the carriers. This allows you to charge customers more for handling fees.</p> -->
              <label><span>Optional Handling Fee</span></label>
              <p>Enter a fixed amount or percentage for handling.  Leave at zero if no additional fee is required.</p>
              <div class="d-flex">
                <div class="custom-control custom-radio">
                  <input id="specialOrderFixed" v-model="options.additional_shipping_fee_type" type="radio" value="fixed" @change="saveData" class="custom-control-input">
                  <label class="custom-control-label" for="specialOrderFixed">
                    Fixed
                  </label>
                </div>
                <div class="custom-control custom-radio ml-2">
                  <input id="specialOrderPercentage" v-model="options.additional_shipping_fee_type" type="radio" value="percentage" @change="saveData" class="custom-control-input">
                  <label class="custom-control-label" for="specialOrderPercentage">
                    Percentage
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-sm-4 col-lg-3 col-xl-3">
              <input type="number" min="0" class="form-control" v-model="options.additional_shipping_fee" @change="saveData" :class="{'border border-danger' : this.errors.additional_shipping_fee}" oninput="this.value = this.value.slice(0, 4)" />
            </div>
          </div>
          <div class="row mt-4" v-if="advancedShippingSettings">
            <div class="col-sm-6">
              <div class="custom-control custom-checkbox ml-n1">
                <input type="checkbox" class="custom-control-input" :disabled="!options.advanced_shipping_enabled" id="customHandlingFees" v-model="showCustomHandlingFee">
                <label class="custom-control-label" :class="{'disabled-label':!options.advanced_shipping_enabled}" id="showCustomShippingFeeLabel" for="customHandlingFees">
                  Show Custom Shipping Fee
                </label>
              </div>
            </div>
          </div>
          <div class="carrier-services mt-4" v-if="showCustomHandlingFee && advancedShippingSettings">
            <div class="carrier mb-3" :key="carrier" v-for="(services, carrier) in advancedShippingSettings">
              <div class="card py-3 px-4 flex-row justify-content-between align-items-center" v-b-toggle="`accordion-${carrier}`">
                <div class="lead">
                  <img width="32" class="mr-2" :src="`/icons/carriers/${carrier.toLowerCase()}.png`" :srcset="`/icons/carriers/${carrier.toLowerCase()}@2x.png`" alt="Carrier" />
                  <b>{{ carrier }}</b>
                </div>
                <svg class="caret" width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.25 0.875L7 7.125L0.75 0.875" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>

              <b-collapse :id="`accordion-${carrier}`" visible accordion="main-accordion" role="tabpanel">
                <div class="card px-4 pt-4 pb-2 mt-3">
                  <div class="row text-uppercase text-muted font-weight-bold small px-4 mb-3">
                    <div class="col-md-4">Name</div>
                    <div class="col-auto">Enable</div>
                    <div class="col-md-3">Select Option</div>
                    <div class="col">Enter Amount</div>
                  </div>
                  <div class="card px-4 py-2 mb-2" :key="service" v-for="(data, service) in services">
                    <div class="row align-items-center">
                      <div class="col-md-4 font-weight-bold">
                        {{ service.split('_').join(' ') | styleTitle }}
                      </div>
                      <div class="col-md-1">
                        <div class="custom-control custom-switch">
                          <input type="checkbox" @change="saveData" v-model="advancedShippingSettings[carrier][service].enabled" class="custom-control-input" :id="`service-${carrier}-${service}-enabled`" />
                          <label class="custom-control-label" :for="`service-${carrier}-${service}-enabled`" />
                        </div>
                      </div>
                      <div class="col">
                        <div class="d-flex">
                          <div class="custom-control custom-radio">
                            <input :id="`service-${carrier}-${service}-fixed`" v-model="advancedShippingSettings[carrier][service].type" type="radio" value="fixed" @change="saveData" class="custom-control-input">
                            <label class="custom-control-label" :for="`service-${carrier}-${service}-fixed`">
                              Fixed
                            </label>
                          </div>
                          <div class="custom-control custom-radio ml-2">
                            <input :id="`service-${carrier}-${service}-percentage`" v-model="advancedShippingSettings[carrier][service].type" type="radio" value="percentage" @change="saveData"
                              class="custom-control-input">
                            <label class="custom-control-label" :for="`service-${carrier}-${service}-percentage`">
                              Percentage
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="col">
                        <input type="number" min="0" @input="advancedShippingSettings[carrier][service].fee.length > 3 ? advancedShippingSettings[carrier][service].fee = advancedShippingSettings[carrier][service].fee.slice(0, 3) : ''" @change="saveData" v-model="advancedShippingSettings[carrier][service].fee" class="form-control">
                      </div>
                    </div>
                  </div>
                </div>
              </b-collapse>
            </div>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import HomePageService from '@/api-services/homepage.service';
  import CreateLabelModal from '@/components/modals/create-label-modal';
  import AdminApiService from '@/api-services/admin.service';

  export default {
    name: 'fulfillmentOptionsShippingAdvanced',
    components: {
      CreateLabelModal
    },
    props: {
      autosave: {
        default: true
      },
      options: {
        default: null
      },
      readOnly: {
        default: null
      },
      wizard_enabled:{
        default: false
      },
      selectedStore: {
        default: null                        
      },
      disableRequest: {
        default: null                        
      }
    },
    data() {
      return {
        changingAdvanceShippingStatus: false,
        showCustomHandlingFee: false,
        errors: {},
        enableChange: false,
        configure: false
      };
    },
    computed: {
      businessDetails() {
        return Object.entries(this.$store.state.businessDetails).length ? this.$store.state.businessDetails : null;
      },
      adminName() {
        return this.$store.state.activeUser && this.$store.state.activeUser.data.admin_name || 'Master';
      },
      advancedShippingSettings() {
        return this.options.advanced_shipping_settings;
      }
    },
    async mounted() {
      if(!this.businessDetails) {
        let r = await HomePageService.getBusinessDetails();
        this.$store.commit('setBusinessDetails', r.data.data);
      }
      this.getCustomHandlingRatesStatus();
    },
    methods: {
      saveData() {
        if(this.autosave)
          this.$emit('onSave');
          // this.save();
      },
      handleEnable() {
        this.enableChange = !this.enableChange;
      },
      save(args = { applyToAll: 0 }) {
        let businessId = args.settings && args.settings[0].business_id || localStorage.getItem('selectedStore');
        let data = {
          ...args,
          settings: [{
            enabled: this.options.advanced_shipping_enabled,
            default_product_weight: this.options.default_product_weight,
            default_product_length: this.options.default_product_length,
            default_product_width: this.options.default_product_width,
            default_product_height: this.options.default_product_height,
            additional_shipping_fee: this.options.additional_shipping_fee,
            additional_shipping_fee_type: this.options.additional_shipping_fee_type,
            advanced_shipping_settings: this.options.advanced_shipping_settings,
            business_id: businessId
          }]
        };
        data.applyToAll = true; // applying to all for adv shipping right now
        // Mujtaba: unable to understand why we are updating state here
        // this.$store.commit('setBusinessDetails', { ...this.businessDetails, ...data.settings[0], shipping_enabled: data.settings[0].enabled, shipping_destination: data.settings[0].destination });
        let callback = AdminService.updateFulfillmentAdvancedShipping(data).then(async e => {
          if(this.enableChange) {
            this.$swal('Advanced Shipping', e.data.message, 'warning');
            this.options.advanced_shipping_enabled = !this.options.advanced_shipping_enabled;
            this.enableChange = !this.enableChange;
          } else {
            this.$emit('onSave', callback);            
          }
          if(!this.wizard_enabled){
            let r = await HomePageService.getBusinessDetails();
            this.$store.commit('setBusinessDetails', r.data.data);
          }
        }).catch(err => err.response);
        return callback;
      },
      getCustomHandlingRatesStatus() {
        try {
          for(const [key, value] of Object.entries(this.advancedShippingSettings)) {
            for(const [k, v] of Object.entries(value)) {
              key, k;
              if(value.fee !== '') {
                if(v.fee !== '') {
                  this.showCustomHandlingFee = true;
                }
              }
            };
          };
        } catch(e) {
        }
      },
      async getAdvShipping(){
        await AdminApiService.getFulfillmentByKey('advanceshipping').then(e => {
          if(e.data && e.data.data && e.data.data.length > 0){
            this.options.advanced_shipping_settings = e.data.data.find(x => x.business_id == this.selectedStore).advanceshipping.advanced_shipping_settings;
          }
        });
      },
      async loadAdvShipping(){
        await this.getAdvShipping();
      }
    },
    watch: { 
      options: function(newVal, oldVal) { // watch it
        if(newVal != oldVal){
          this.getCustomHandlingRatesStatus();
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .main-container {
    border: 1px solid #E2E8F0;
    background: #f8fafc;
    border-radius: 10px;
    h5 {
      font-size: 18px !important;
    }
  }
  .text-muted {
    color: #475569 !important;
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
  .shipping-message 
  {
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    padding: 16px;
    gap: 12px;

    /* Yellow / 50 */

    background: #FFFBEB;
    /* Yellow / 200 */

    border: 1px solid #FDE68A;
    border-radius: 6px;

    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #92400E;
  }

  #showCustomShippingFeeLabel {
  font-style: normal;
  font-weight: 600 !important;
  font-size: 14px !important;
  line-height: 20px !important;
  color: #000000;
}
.carrier-services {
  .card {
    overflow: hidden;
    box-shadow: none;
    .caret {
      transition: all .2s;
    }
    .not-collapsed {
      .caret {
        transform: rotate(180deg);
      }
    }
    .card-header {
      padding: 0;
      border: 1px solid #e8e8e8;
      button {
        border-radius: 5px 5px 0 0;
        background: white;
        font-weight: bold;
        text-transform: uppercase;
        justify-content: flex-start;
        border: none;
        &:before {
          content: '';
          width: 8px;
          height: 8px;
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          border-left: 4px solid var(--primary);
          margin-right: 8px;
        }
        &.collapsed {
          border-radius: 5px;
        }
        &:not(.collapsed) {
          &:before {
            border-top: 4px solid var(--primary);
            border-right: 4px solid transparent;
            border-left: 4px solid transparent;
            margin-top: 4px;
          }
        }
      }
    }
  }
  .service-row {
    background: #F8FAFC;
    border-radius: 4px;
    padding: 12px;
    align-items: center;
  }
}
.advanceShippingAlert {
  background: #DC262610;
  mix-blend-mode: normal;
  border-radius: 8px;
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 20px;
  color: #000000 !important;
  padding-top: 25px;
  padding-bottom: 25px;
}

</style>