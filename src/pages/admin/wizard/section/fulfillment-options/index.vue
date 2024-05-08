<template>
  <div>
    <WizardStoreList v-if="currentStep != 3 && !adminScreen" class="border-bottom pb-3 pt-1 mb-4" :filter="currentStep == 3 && storesFilter" ref="storeList" :enableApplyToAll="true" :selectedStore="selectedStore" @onSelect="pushStore" @onApplyToAll="onApplyToAll" />
    <div>
      <transition name="fadeHeight" v-if="currentStep != 3 && !adminScreen">
        <div class="border-bottom pb-3 text-center mb-4" v-if="!applyToAll">
          <h5 v-if="selectedStore && stores.find(e => e.id == selectedStore)">Store: <span class="text-primary">{{ stores.find(e => e.id == selectedStore).name }}</span></h5>
        </div>
      </transition>
      <template v-if="currentStep == 1 || adminScreen">
        <FulfillmentOptionsPickup :selectedStore="selectedStore" :stores="stores" :options="selectedPickupOption" :ref="`step-1`" class="mb-3" :readOnly="adminScreen" :wizard_enabled="wizard_enabled" :autosave="adminScreen" @onSave="save(1)" @closeSettings="closeSettings(1)" >
          <WizardStoreList v-if="adminScreen" class="border-bottom pb-3 pt-1 mb-4" :filter="currentStep == 3 && storesFilter" ref="storeListPickup" :enableApplyToAll="true" :selectedStore="selectedStore" @onSelect="pushStore" @onApplyToAll="onApplyToAll" :childOf="`pickup`" />
          <transition name="fadeHeight" v-if="adminScreen">
            <div class="border-bottom pb-3 text-center mb-4" v-if="!applyToAll">
              <h5 v-if="selectedStore && stores.find(e => e.id == selectedStore)">Store: <span class="text-primary">{{ stores.find(e => e.id == selectedStore).name }}</span></h5>
            </div>
          </transition> 
        </FulfillmentOptionsPickup>
      </template>
      <div class="content" v-if="currentStep == 2 || adminScreen">
        <FulfillmentOptionsDelivery :selectedStore="selectedStore" :stores="stores" :options="selectedDeliveryOption" :ref="`step-2`" class="mb-3" :readOnly="adminScreen" :wizard_enabled="wizard_enabled" :autosave="adminScreen" @onSave="save(2)" @closeSettings="closeSettings(2)">
          <WizardStoreList v-if="adminScreen" class="border-bottom pb-3 pt-1 mb-4" :filter="currentStep == 3 && storesFilter" ref="storeListDelivery" :enableApplyToAll="true" :selectedStore="selectedStore" @onSelect="pushStore" @onApplyToAll="onApplyToAll" :childOf="`delivery`"/>
          <transition name="fadeHeight" v-if="adminScreen">
            <div class="border-bottom pb-3 text-center mb-4" v-if="!applyToAll">
              <h5 v-if="selectedStore && stores.find(e => e.id == selectedStore)">Store: <span class="text-primary">{{ stores.find(e => e.id == selectedStore).name }}</span></h5>
            </div>
          </transition>
        </FulfillmentOptionsDelivery>
      </div>
      <div class="content" v-if="currentStep == 3 || adminScreen">
        <FulfillmentOptionsShipping :stores="stores" :options="selectedShippingOption" :advancedShippingOptions="selectedAdvancedShippingOption" :selectedStore="selectedStore" :applyToAll="applyToAll" :ref="`step-3`" class="mb-3" :readOnly="adminScreen" :wizard_enabled="wizard_enabled" :autosave="adminScreen" @onSave="save(3)" @closeSettings="closeSettings(3)" />
      </div>
    </div>
  </div>
</template>

<script>
  import WizardStoreList from '@/components/admin/wizard/wizard-store-list';
  import FulfillmentOptionsPickup from '@/components/admin/fulfillment-options/pickup';
  import FulfillmentOptionsDelivery from '@/components/admin/fulfillment-options/delivery';
  import FulfillmentOptionsShipping from '@/components/admin/fulfillment-options/shipping';
  import AdminApiService from '@/api-services/admin.service';

  export default {
    name: 'WizardFulfillmentOptions',
    components: {
      WizardStoreList,
      FulfillmentOptionsPickup,
      FulfillmentOptionsDelivery,
      FulfillmentOptionsShipping
    },
    props: {
      id: {
        default: null
      },
      adminScreen: {
        default: false,
      },
      wizard_enabled:{
        default: false
      }
    },
    data() {
      return {
        selectedStore: null,
        pickupOptions: [],
        deliveryOptions: [],
        shippingOptions: [],
        advancedShippingOptions: [],
        applyToAll: true
      };
    },
    computed: {
      currentStep() {
        return this.$route.query.step || 1;
      },
      stores() {
        return this.$store.state.adminWizardBusinesses.filter(e => e.name.toLowerCase());
      },
      step() {
        return this.$store.state.adminWizardSteps.find(e => e.id == this.$route.meta.id);
      },
      itemId() {
        return this.step && this.step.items && this.step.items.length > 0 ? this.step.items[this.$route.query.step - 1 || 0].id : null;
      },
      selectedPickupOption() {
        return this.pickupOptions.find(e => e.business_id == this.selectedStore) && this.pickupOptions.find(e => e.business_id == this.selectedStore).pickup || [];
      },
      selectedDeliveryOption() {
        return this.deliveryOptions.find(e => e.business_id == this.selectedStore) && this.deliveryOptions.find(e => e.business_id == this.selectedStore).delivery || [];
      },
      selectedShippingOption() {
        return this.shippingOptions.find(e => e.business_id == this.selectedStore) && this.shippingOptions.find(e => e.business_id == this.selectedStore).shipping || [];
      },
      selectedAdvancedShippingOption() {
        return this.advancedShippingOptions.find(e => e.business_id == this.selectedStore) && this.advancedShippingOptions.find(e => e.business_id == this.selectedStore) || [];
      },
      storesFilter() {
        if(this.applyToAll){
          return this.selectedShippingOption.shipping_enabled ? this.stores.map(e => e.id) : [];
        }
        return this.shippingOptions.filter(e => e.shipping.shipping_enabled == 1).map(e => e.business_id);
      }
    },
    async mounted() {
      this.getPickUp();
      this.getDelivery();
      await this.getBasicShipping();
      await this.getAdvShipping();
      await AdminApiService.getAllPartnerBusinesses().then(resp => this.$store.commit('setAdminWizardBusinesses', resp.data.stores));
      this.selectedStore = this.$route.query.store || (this.stores.length > 0 && this.stores[0].id ? this.stores[0].id : localStorage.getItem('selectedStore'));
      this.selectStore(this.selectedStore);
    },
    methods: {
      getPickUp(){
        AdminApiService.getFulfillmentByKey('pickup').then(e => {
          this.pickupOptions = [...e.data.data].map(e => {
            e.pickup.pickup_enabled = Number(e.pickup.pickup_enabled);
            return e;
          });
        });        
      },
      getDelivery(){
        AdminApiService.getFulfillmentByKey('delivery').then(e => {
          this.deliveryOptions = [...e.data.data].map(e => {
            e.delivery.delivery_enabled = Number(e.delivery.delivery_enabled);
            e.delivery.delivery_fee = Number(e.delivery.delivery_fee);
            e.delivery.delivery_locations = e.delivery.delivery_locations ? e.delivery.delivery_locations.map(l => ({...l, fee: Number(l.fee)})) : [];
            e.delivery.rental_delivery_locations = e.delivery.rental_delivery_locations ? e.delivery.rental_delivery_locations.map(l => ({...l, fee: Number(l.fee)})) : null;
            e.delivery.delivery_settings = e.delivery.delivery_settings && typeof e.delivery.delivery_settings.delivery_disclaimer != "undefined" ? e.delivery.delivery_settings : {
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
            };
            return e;
          });
        });        
      },
      async getBasicShipping(){
        await AdminApiService.getFulfillmentByKey('shipping').then(e => {
          this.shippingOptions = [...e.data.data].map(e => {
            e.shipping.shipping_enabled = Number(e.shipping.shipping_enabled);
            e.shipping.shipping_base_price = Number(e.shipping.shipping_base_price);
            e.shipping.shipping_extra_max = Number(e.shipping.shipping_extra_max);
            e.shipping.shipping_extra_price = Number(e.shipping.shipping_extra_price);
            return e;
          });
        });        
      },
      async getAdvShipping(){
        await AdminApiService.getFulfillmentByKey('advanceshipping').then(e => {
          this.advancedShippingOptions = [...e.data.data].map(e => {
            e.advanceshipping.advanced_shipping_enabled = Number(e.advanceshipping.advanced_shipping_enabled);
            return e;
          });            
        });
      },
      async save(currentStep = 0) {
        if(currentStep == 0) {
          currentStep = this.currentStep;
        }
        if(currentStep == 1) {
          return await AdminApiService.updateFulfillmentPickup({
            step_item_id: this.itemId ? this.itemId : 1,
            applyToAll: this.applyToAll,
            settings: this.pickupOptions.map(e => ({ business_id: e.business_id, enabled: e.pickup.pickup_enabled, ...e.pickup }))
          }).then(() => {
            this.getPickUp();
            if(this.adminScreen) {
              this.$swal({
                toast: true,
                position: 'top',
                type: 'success',
                html: `<div class="ml-2">Settings successfully updated</div>`,
                showConfirmButton: false,
                timer: 3000
              });
            }
            return true;
          }).catch(err => {
            let errorMsg = Object.keys(err.response.data.error[0]).map(key => err.response.data.error[0][key]).join('<br />');
            this.$swal('Error', errorMsg, 'error');           
            return false;
          });
        } else if(currentStep == 2) {
          return await AdminApiService.updateFulfillmentDelivery({
            step_item_id: this.itemId ? this.itemId : 2,
            applyToAll: this.applyToAll,
            settings: this.deliveryOptions.map(e => ({ business_id: e.business_id, enabled: e.delivery.delivery_enabled, ...e.delivery }))
          }).then(() => {
            this.getDelivery();
            if(this.adminScreen) {
              this.$swal({
                toast: true,
                position: 'top',
                type: 'success',
                html: `<div class="ml-2">Settings successfully updated</div>`,
                showConfirmButton: false,
                timer: 3000
              });
            }
            return true;
          }).catch(err => {
            let errorMsg = Object.keys(err.response.data.error[0]).map(key => err.response.data.error[0][key]).join('<br />');
            this.$swal('Error', errorMsg, 'error');           
            this.getDelivery();
            return false;
          });
        } else if(currentStep == 3) {

          return await AdminApiService.updateFulfillmentShipping({
            step_item_id: this.itemId ? this.itemId : 3,
            // applyToAll: this.applyToAll,
            applyToAll: true, // applying to all for shipping and adv shipping right now
            settings: this.shippingOptions.map(e => ({
              business_id: e.business_id,
              enabled: Number(e.shipping.shipping_enabled),
              destination: e.shipping.shipping_destination,
              base_price: e.shipping.shipping_base_price,
              extra_price: e.shipping.shipping_extra_price,
              extra_max: Number(e.shipping.shipping_extra_max)
            }))
          }).then(async () => {
            await this.getBasicShipping();
            return await AdminApiService.updateFulfillmentAdvancedShipping({
              step_item_id: this.itemId,
              // applyToAll: this.applyToAll,
              applyToAll: true, // applying to all for adv shipping right now
              settings: this.advancedShippingOptions.map(e => ({
                business_id: e.business_id,
                enabled: Boolean(e.advanceshipping.advanced_shipping_enabled),
                default_product_weight: e.advanceshipping.default_product_weight,
                default_product_length: e.advanceshipping.default_product_length,
                default_product_width: e.advanceshipping.default_product_width,
                default_product_height: e.advanceshipping.default_product_height,
                additional_shipping_fee: e.advanceshipping.additional_shipping_fee,
                additional_shipping_fee_type: e.advanceshipping.additional_shipping_fee_type,
                advanced_shipping_settings: e.advanceshipping.advanced_shipping_settings || ''
              }))
            }).then(async e => {
              if(this.$refs['step-3'] && this.$refs['step-3'].$refs['step-adv'] && this.$refs['step-3'].$refs['step-adv'].enableChange){
                this.$swal('Advanced Shipping', e.data.message, 'warning');
              }
              await this.getAdvShipping();       
              if(this.adminScreen) {
                this.$swal({
                  toast: true,
                  position: 'top',
                  type: 'success',
                  html: `<div class="ml-2">Settings successfully updated</div>`,
                  showConfirmButton: false,
                  timer: 3000
                });
              }     
              return true;
            }).catch(err => {
              let errorMsg = Object.keys(err.response.data.error[0]).map(key => err.response.data.error[0][key]).join('<br />');
              this.$swal('Error', errorMsg, 'error');           
              return false;
            });
          }).catch(err => {
            let errorMsg = Object.keys(err.response.data.error[0]).map(key => err.response.data.error[0][key]).join('<br />');
            this.$swal('Error', errorMsg, 'error');           
            this.getBasicShipping();
            return false;
          });          
        }
      },
      pushStore(id) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { store: id }) }).catch(() => {});
        this.selectStore(id);
      },
      async selectStore(id) {
        this.loading = true;
        this.selectedStore = id;
        this.loading = false;
      },
      onApplyToAll(val, childOf) {
        this.applyToAll = val;
        let allowed = {
          'pickup': 1,
          'delivery': 2
        };
        if(this.adminScreen && childOf && allowed[childOf]) {          
          this.save(allowed[childOf]);
        }
      },
      closeSettings(except){
        var _self = this;
        [3,2,1].forEach(step => {
          if(step != except && _self.$refs[`step-${step}`])
            _self.$refs[`step-${step}`].closeSettings();
        });
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

