<template>
  <div v-if="$store.state.settings.layout != 'catalog' && options">
    <div>
      <div class="d-flex flex-column flex-sm-row" :class="readOnly && wizard_enabled ? 'justify-content-between align-items-start align-items-sm-center' : 'flex-column justify-content-between align-items-start'">
        <div v-if="readOnly && wizard_enabled">
          <h5 class="mb-2 font-weight-bold">Shipping</h5>
          <div class="text-muted mr-0 mr-sm-5">
            You can offer shipping to anywhere in the USA & outside when you enable this option.
            Customers will be asked for their address, and a flat fee (per item) that is determined.
            You would be responsible for buying the shipping label on your own.
          </div>
        </div>
        <div v-if="stores.length == 1" class="custom-control custom-switch flex-column">
          <input type="checkbox" v-model="options.shipping_enabled" class="custom-control-input" id="shipping" @change="saveData">
          <label class="custom-control-label" for="shipping">{{options.shipping_enabled ? 'Enabled' : 'Disabled'}}</label>
        </div>        
        <button v-if="readOnly && wizard_enabled" class="btn btn-outline-primary btn-xs ml-0 ml-sm-3 mt-2 mt-sm-0" type="button" @click="configureSettings">
          Configure
        </button>
      </div>
    </div>
    <div v-if="stores.length > 1 && (configure || (!readOnly || !wizard_enabled))" class="d-flex justify-content-between align-items-center">
      <div class="custom-control custom-switch flex-column">
        <input type="checkbox" v-model="options.shipping_enabled" class="custom-control-input" id="shipping" @change="saveData">
        <label class="custom-control-label" for="shipping">{{options.shipping_enabled ? 'Enabled' : 'Disabled'}}</label>
      </div>
    </div>  
    <transition v-if="configure || (!readOnly || !wizard_enabled)" name="fadeHeight">
      <div class="overflow-hidden" :class="{ 'disabled': !options.shipping_enabled }">
        <div class="card p-4 mt-3">
          <div class="row">
            <div class="col-sm-6 col-lg-4 col-xl-3">
              <label><span :class="{'disabled-label':!options.shipping_enabled}">Special Order</span></label>
              <div class="custom-control custom-switch" :class="{'disabled' : !options.shipping_enabled}">
                <input type="checkbox" v-model="destinationBool" class="custom-control-input" id="specialOrder" @change="saveData">
                <label class="custom-control-label always-on" v-if="options.shipping_destination" for="specialOrder" v-html="`Ship to ${options.shipping_destination}`"></label>
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-sm-6 col-lg-4 col-xl-3">
              <label>First Item Price</label>
              <div class="input-group" style="width: 150px;">
                <div class="input-group-prepend">
                  <span class="input-group-text">$</span>
                </div>
                <input type="number" min="0" class="form-control" v-model="options.shipping_base_price" @change="saveData" oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null">
              </div>
            </div>
            <div class="col-sm-6 col-lg-4 col-xl-3">
              <label>Extra Items Price</label>
              <div class="input-group" style="width: 150px;">
                <div class="input-group-prepend">
                  <span class="input-group-text">$</span>
                </div>
                <input type="number" min="0" class="form-control" v-model="options.shipping_extra_price" @change="saveData" oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null">
              </div>
            </div>
            <div class="col-12 col-lg-6 mt-4 mt-xl-0">
              <label>Max Products for Extra Shipping Charge</label>
              <div class="input-group" style="width: 150px;">
                <input type="number" min="0" class="form-control" v-model="options.shipping_extra_max" @change="saveData" oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null">
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <FulfillmentOptionsAdvancedShipping :selectedStore="selectedStore" v-if="configure || (!readOnly || !wizard_enabled) && advancedShippingOptions.advanceshipping" :wizard_enabled="wizard_enabled" :options="advancedShippingOptions.advanceshipping" :disableRequest="advancedShippingOptions.disableRequest" :ref="`step-adv`" class="my-3" :autosave="autosave" @onSave="saveCallback" />

  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import HomePageService from '@/api-services/homepage.service';
  import FulfillmentOptionsAdvancedShipping from '@/components/admin/fulfillment-options/shipping-advanced';

  export default {
    name: 'fulfillmentOptionsShipping',
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
      applyToAll: {
        default: false                
      },
      selectedStore: {
        default: null                        
      },
      wizard_enabled:{
        default: false
      },
      advancedShippingOptions: {
        default: null                                
      },
      stores:{
        default: []
      }
    },
    data() {
      return {
        configure: false
      };
    },
    components: {
      FulfillmentOptionsAdvancedShipping
    },
    computed: {
      businessDetails() {
        return Object.entries(this.$store.state.businessDetails).length ? this.$store.state.businessDetails : null;
      },
      destinationBool: {
        get() {
          return this.options.shipping_destination == 'store' ? 0 : 1;
        },
        set(val) {
          this.options.shipping_destination = val == 1 ? 'house' : 'store';
          return val;
        }
      }
    },
    async mounted() {
      let r = await HomePageService.getBusinessDetails();
      this.$store.commit('setBusinessDetails', r.data.data);
    },
    methods: {
      configureSettings(){
        this.configure = true;
        this.$emit('closeSettings');
      },
      closeSettings(){
        this.configure = false;
      },
      saveData() {
        if(this.autosave)
          this.$emit('onSave');
          // this.save();
      },
      save(args = { applyToAll: 0 }) {
        let businessId = args.settings && args.settings[0].business_id || localStorage.getItem('selectedStore');
        let data = {
          ...args,
          settings: [{
            enabled: Boolean(this.options.shipping_enabled),
            destination: this.options.shipping_destination,
            base_price: this.options.shipping_base_price,
            extra_price: this.options.shipping_extra_price,
            extra_max: this.options.shipping_extra_max,
            business_id: businessId
          }]
        };

        this.$store.commit('setBusinessDetails', { ...this.businessDetails, ...data.settings[0], shipping_enabled: data.settings[0].enabled, shipping_destination: data.settings[0].destination });
        let callback = AdminService.updateFulfillmentShipping(data);
        this.$emit('onSave', callback);
        return callback;
      },
      saveCallback(callback) {
        this.$emit('onSave', callback);
      },
      disableAdvShipping(){
        let businessId = this.selectedStore || localStorage.getItem('selectedStore');
        let data = {
          applyToAll: this.applyToAll,
          settings: [{
            enabled: 0,
            business_id: businessId
          }]
        };
        this.$swal({
            title: "Are you sure?",
            html: `<div class="d-flex flex-column">
                      <h4>You want to Disable Advance Shipping for ${this.applyToAll ? 'all locations' : 'selected store'}</h4>
                    </div>`,
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
          })
          .then(async (result) => {
            if (result.value) {
              await AdminService.updateFulfillmentAdvancedShipping(data).then(e => {
                this.$swal('Advanced Shipping', e.data.message, 'warning');
              }).catch(err => err.response);
            }
          });
        
      },
      showError() {

      }
    },
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
    margin-bottom: 8px !important;
    border-radius: 5px;
    border: 1px solid #e8e8e8;
    box-shadow: 0 2px 6px rgba(34, 44, 73, 0.05);
    .card-header {
      padding: 0;
      border: none;
      border-bottom: 1px solid #e8e8e8;
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
