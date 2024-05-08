<template>
  <div v-if="$ezHasNoPermission('edit_fulfillment_options')">
    <no-permission-truevalue page="Fulfillment Options"></no-permission-truevalue>
  </div>
  <div v-else>
    <div class="settings-header bg-white mb-3">
      <div class="settings-header-info">
        <h1>Fulfillment Options</h1>
        <is-saved :param="saving" />
      </div>
    </div>
    <div class="bg-white px-4 py-2" v-if="businessDetails">
      <div class="border-bottom pb-3 mb-3">
        <h5 class="font-weight-bold">
          General
        </h5>
        <div class="overflow-hidden">
          <div class="row">
            <div class="col-sm-6 col-lg-4 col-xl-3 mb-4 mb-md-0">
              <label class="mb-0">Users can save their cart</label>
              <div class="custom-control custom-switch mt-2">
                <input type="checkbox" v-model="save_cart" class="custom-control-input" id="cart" @change="saveData('cart')">
                <label class="custom-control-label" for="cart" v-html="save_cart ? 'Yes' : 'No'"></label>
              </div>
            </div>            
            <div class="col-sm-6 col-lg-4 col-xl-3">
                <label class="mb-0" for="taxRate">Tax Rate</label>
                <div class="input-group" style="width: 180px;">
                  <div class="d-flex align-items-start" v-if="stores.length > 1 && taxStepExists()">
                    <span class="input-group-text d-inline-flex mr-1">{{businessDetails.tax_rate}}%</span>
                    <router-link :to="`/admin/wizard/section/tax-rate?step=1&store=${$store.state.currentStore.business_id}&redirect=fulfillment-options`" class="btn btn-danger btn-sm d-inline-flex m-0">
                      Setup Tax
                    </router-link>                   
                  </div>
                  <template v-else>
                    <div class="input-group-prepend">
                      <span class="input-group-text">%</span>
                    </div>
                    <input type="number" id="taxRate" class="form-control" v-model="businessDetails.tax_rate" @change="saveData('tax')">
                  </template>
                </div>
            </div>
            <div class="col-sm-6 col-lg-4 col-xl-3" v-if="!businessDetails.wizard_enabled">
              <label><span :class="{'disabled-label':!businessDetails.pickup_enabled}">Payment Processing</span></label>
              <div class="d-flex mt-md-2 mt-n1 flex-column flex-md-row text-nowrap">
                <div class="custom-control custom-radio">
                  <input id="payInStore" type="radio" v-model="pickupPayment" value="store" @change="saveData('payment')" name="paymentProcessing" class="custom-control-input">
                  <label class="custom-control-label" for="payInStore">
                    Pay in Store
                  </label>
                </div>
                <div class="custom-control custom-radio ml-md-3">
                  <input id="payOnWebsite" type="radio" v-model="pickupPayment" value="website" @change="saveData('payment')" name="paymentProcessing" class="custom-control-input">
                  <label class="custom-control-label" for="payOnWebsite">
                    Pay on Website
                  </label>
                </div>
                <div class="custom-control custom-radio ml-md-3">
                  <input id="allowBoth" type="radio" v-model="pickupPayment" value="both" @change="saveData('payment')" name="paymentProcessing" class="custom-control-input">
                  <label class="custom-control-label" for="allowBoth">
                    Allow Both
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card p-4 mb-3 recurring-card">         
        <div class="d-flex">
          <h5 class="mb-2 font-weight-bold">Recurring Orders</h5>
        </div>
        <div class="text-muted mr-0 pr-0 pr-sm-5 mr-sm-5 mb-3 mb-sm-4">
          The recurring orders feature enables customers to automate the repurchase of specific products or services at regular intervals. This convenient feature streamlines the buying process for frequently purchased items, 
          <br class="d-none d-sm-block"> 
          ensuring timely replenishment and offering several advantages for both customers and businesses.
        </div>
        <div class="d-flex flex-column flex-sm-row">
          <button class="btn mr-0 mb-2 mb-sm-0 mr-sm-2" style="min-width: 135px;" :class="!enable_recurring_orders ? 'btn-primary' : 'btn-outline-primary'" @click="saveData('enable_recurring_orders')" :disabled="savingRecurring">
            <span v-if="savingRecurring" class="spinner-border spinner-border-sm mr-2"></span>
            {{ enable_recurring_orders ? 'Disabl' : 'Enabl' }}{{ savingRecurring ? 'ing' : 'e' }}
          </button>
          <a @click="$refs.tutorialModal.show()" class="btn btn-tutorial text-medium bg-white btn-action">
            <i class="fa fa-play mr-1"></i>
            Click to Watch Tutorial Video
          </a>
        </div>
      </div>
      <div v-if="$store.state.currentStore && $store.state.currentStore.business_id">       
        <WizardFulfillmentOptions :adminScreen="true" :wizard_enabled="businessDetails.wizard_enabled" /> 
      </div>
    </div>
    <b-modal size="lg" ref="tutorialModal">
      <div slot="modal-header">
        <h5>Recurring Orders</h5>
      </div>
      <div>
        <video class="w-100" controls>
          <source src="https://storage.googleapis.com/content.ezadtv.com/2023/12/28/658dbeba94edc_NEW_RECURRING_ORDERS.mp4" type="video/mp4">
        </video>
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-primary" @click="$refs.tutorialModal.hide()">Done</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import HomePageService from '@/api-services/homepage.service';
  import NoPermissionTruevalue from '@/pages/admin/settings/no-permission-truevalue';
  import WizardFulfillmentOptions from '@/pages/admin/wizard/section/fulfillment-options/index';

  export default {
    name: 'FulfillmentOptions',
    components: {
      NoPermissionTruevalue,
      WizardFulfillmentOptions
    },
    data() {
      return {
        saving: false,
        save_cart: false,
        paymentProcessing: false,
        pickupPayment: null,
        pickupOptions: {},
        deliveryOptions: {},
        shippingOptions: {},
        stores: [],
        editing: 'pickup',
        enable_recurring_orders: false,
        savingRecurring: false,
      };
    },
    computed: {
      businessDetails() {
        return Object.entries(this.$store.state.businessDetails).length ? this.$store.state.businessDetails : null;
      },
      advancedShippingOptions() {
        if(this.businessDetails){
          return {
            advanceshipping: {
              advanced_shipping_enabled: this.businessDetails.advanced_shipping_enabled,
              default_product_weight: this.businessDetails.default_product_weight,
              default_product_height: this.businessDetails.default_product_height,
              default_product_width: this.businessDetails.default_product_width,
              default_product_length: this.businessDetails.default_product_length,
              additional_shipping_fee: this.businessDetails.additional_shipping_fee,
              additional_shipping_fee_type: this.businessDetails.additional_shipping_fee_type,
              advanced_shipping_settings: this.businessDetails.advanced_shipping_settings
            },
            disableRequest: this.businessDetails.advanced_shipping_disableRequest
          };
        }else{
          return {};
        }
      }
    },
    async mounted() {
      try{
        await AdminService.getAllPartnerBusinesses().then(resp => this.stores = resp.data.stores);
      } catch(e) {
        this.stores = [];
      }      
      if(this.$ezHasNoPermission('edit_fulfillment_options')) return;
      
      await this.getSaveCart();
      await this.getRecurringOrderOptIn();
      
      if(!this.businessDetails)
        await HomePageService.getBusinessDetails();
      this.pickupPayment = this.businessDetails.pickup_payment;
      this.pickupOptions = {
        pickup_enabled: this.businessDetails.pickup_enabled,
        pickup_pdp_message: this.businessDetails.pickup_pdp_message,
        pickup_disclaimer: this.businessDetails.pickup_disclaimer
      };
      this.deliveryOptions = {
        delivery_enabled: this.businessDetails.delivery_enabled,
        delivery_fee: this.businessDetails.delivery_fee,
        delivery_locations: this.businessDetails.delivery_locations,
        delivery_locations2: this.businessDetails.delivery_locations2,
        delivery_payment: this.businessDetails.delivery_payment,
        delivery_settings: this.businessDetails.delivery_settings  && typeof this.businessDetails.delivery_settings.delivery_disclaimer != "undefined" ? this.businessDetails.delivery_settings : {
          delivery_disclaimer: "",
          time_ranges: [
            {"day":"mon","from":"","to":""},
            {"day":"tue","from":"","to":""},
            {"day":"wed","from":"","to":""},
            {"day":"thu","from":"","to":""},
            {"day":"fri","from":"","to":""},
            {"day":"sat","from":"","to":""},
            {"day":"sun","from":"","to":""}
          ]
        }
      };
      this.shippingOptions = {
        shipping_enabled: this.businessDetails.shipping_enabled,
        shipping_base_price: this.businessDetails.shipping_base_price,
        shipping_destination: this.businessDetails.shipping_destination,
        shipping_enabled: this.businessDetails.shipping_enabled,
        shipping_extra_max: this.businessDetails.shipping_extra_max,
        shipping_extra_price: this.businessDetails.shipping_extra_price
      };
    },    
    methods: {
      async getSaveCart() {
        await AdminService.getSaveCart().then(response => {
          if(response.data.save_cart)
            this.save_cart = response.data.save_cart;
        });
      },
      async getRecurringOrderOptIn() {
        await AdminService.getRecurringOrderOptIn().then(response => {
          this.enable_recurring_orders = response.data.enable_recurring_orders;
        });
      },
      saveCallback(callback) {
        this.saving = true;
        callback.then(() => this.saving = false).catch((e) => {
          this.saving = false;
        });
      },
      async saveData(type) {
        this.saving = true;
        switch(type) {
          case 'cart':
            await AdminService.saveCart(this.save_cart);
            break;
          case 'enable_recurring_orders':
            this.savingRecurring = true;
            await AdminService.saveRecurringOrderOptIn(this.enable_recurring_orders ? 0 : 1);
            await this.getRecurringOrderOptIn();
            this.savingRecurring = false;
            break;
          case 'tax':
            await AdminService.updateTaxRate({ rate: this.businessDetails.tax_rate });
            break;
          case 'payment':
            await AdminService.updateFulfillmentPayment({applyToAll: 0, settings: [{
              business_id: localStorage.getItem('selectedStore'),
              website: Number(this.pickupPayment == 'website' || this.pickupPayment == 'both'),
              store: Number(this.pickupPayment == 'store' || this.pickupPayment == 'both')
            }]});
            break;
        }
        this.saving = false;
      },
      taxStepExists(){
        return this.$store.state.currentStore && this.$store.state.currentStore.business_id && this.$store.state.businessDetails.wizard_enabled && this.$router.getRoutes().findIndex(x => x.path == '/admin/wizard/section/tax-rate') > -1;
      }
    }
  };
</script>

<style lang="scss" scoped>
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
  .content.h-100 {
    border: none !important;
  }

  .disabled-label {
    color: #ccc;
  }
  .custom-control-label.always-on {
    color: var(--primary) !important;
    &::before {
      color: #fff !important;
      border-color: var(--primary) !important;
      background-color: var(--primary) !important;
    }
  }
  .custom-control-input:disabled {
    ~ .custom-control-label {
      color: #ccc !important;
      &::before {
        background-color: #e9ecef !important;
      }
    }
  }
  .recurring-card{    
    background-image: url('https://storage.googleapis.com/content.ezadtv.com/2024/01/08/659c379f2a38b_Animation_1_.gif'), linear-gradient(110deg, rgba(226,232,240,1) 0%,rgba(248,250,252,1) 15%);
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: right;
    background-position-y: top;
    box-shadow: 0px 1px 2px 0px #0000000D;
    @media (max-width: 560px) {
      height: 600px;    
      background-position-y: bottom;
      .btn-tutorial {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        padding: 13px;
      }
    }
  }
</style>
