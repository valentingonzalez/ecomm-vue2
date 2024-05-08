<template>
  <div v-if="options">
    <div>
      <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
        <div v-if="readOnly && wizard_enabled">
          <div class="d-flex">
            <h5 class="mb-2 font-weight-bold">In-Store Pick Up</h5>
          </div>
          <div class="text-muted mr-0 mr-sm-5">
            Click on Start to begin any section. We've ordered the list to put the most important first. Each section is designed to ask you some questions to help automate the settings of your E-Commerce site.
          </div>
        </div>
        <div v-if="stores.length == 1" class="custom-control custom-switch flex-column">
          <input type="checkbox" v-model="options.pickup_enabled" class="custom-control-input" id="pickUp" @change="saveData">
          <label class="custom-control-label" for="pickUp">{{ options.pickup_enabled ? 'Enabled' : 'Disabled' }}</label>
        </div>        
        <button v-if="readOnly && wizard_enabled" class="btn btn-outline-primary btn-xs ml-0 ml-sm-3 mt-2 mt-sm-0" :disabled="configureLoading" type="button" @click="configureSettings">
          <span v-if="configureLoading" class="spinner-border spinner-border-sm mr-2"></span>
          Configure
        </button>
      </div>
    </div>
    <slot v-if="configure || (!readOnly || !wizard_enabled)"></slot>
    <div v-if="stores.length > 1 && (configure || (!readOnly || !wizard_enabled))" class="d-flex justify-content-between align-items-center">
      <div class="custom-control custom-switch flex-column">
        <input type="checkbox" v-model="options.pickup_enabled" class="custom-control-input" id="pickUp" @change="saveData">
        <label class="custom-control-label" for="pickUp">{{ options.pickup_enabled ? 'Enabled' : 'Disabled' }}</label>
      </div>
    </div>        
    <transition v-if="configure || (!readOnly || !wizard_enabled)" name="fadeHeight">
      <div class="overflow-hidden" v-if="configure || options.pickup_enabled" :class="{ 'disabled': !options.pickup_enabled }">
        <div class="card p-4 mt-3">
          <div class="row">
            <div class="pickup-disclaimer col-md-6">
              <h6 class="font-weight-bold">In-Stock - Product Page Message</h6>
              <div class="mb-3 w-75">
                Set customer expectations about how quickly you will have their order ready for pickup.
                <br>
                Example: <i>Ready in 2 hours.</i>
              </div>
              <div class="border flex-grow-1">
                <div class="border-bottom font-weight-bold text-uppercase py-2 px-3">How to get it</div>
                <div class="py-2 px-3">
                  <div class="d-flex align-items-center">
                    <div class="mr-3 text-primary">
                      <svg width="38" height="38" viewBox="0 0 50 50" class="d-none d-sm-inline" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fill-rule="evenodd"><path d="M49.025 49.18H.778A.773.773 0 010 48.412c0-.424.348-.769.778-.769h48.247c.43 0 .778.345.778.769a.773.773 0 01-.778.768z"/><path d="M3.89 49.18a.773.773 0 01-.777-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM45.912 49.18a.773.773 0 01-.778-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM48.247 15.37a.778.778 0 01-.739-.526L43.017 1.537H6.787L2.294 14.844a.78.78 0 01-.985.485.766.766 0 01-.492-.972L5.488.525A.777.777 0 016.224 0h37.353c.335 0 .632.212.738.525l4.669 13.832a.766.766 0 01-.492.972.784.784 0 01-.246.04z"/><path d="M15.563 10.758h-1.556a.773.773 0 01-.778-.768c0-.425.348-.769.778-.769h1.556a.774.774 0 00.779-.768.774.774 0 00-.779-.769c-1.287 0-2.334-1.034-2.334-2.305 0-1.271 1.047-2.305 2.334-2.305h1.557c.43 0 .778.344.778.768a.773.773 0 01-.778.769h-1.557a.774.774 0 00-.778.768c0 .424.35.769.778.769 1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305zM20.232 10.758a.773.773 0 01-.778-.768V3.842c0-.424.349-.768.778-.768.43 0 .779.344.779.768V9.99a.773.773 0 01-.779.768z"/><path d="M23.345 7.684h-3.113a.773.773 0 01-.778-.768c0-.424.349-.768.778-.768h3.113c.43 0 .778.344.778.768a.773.773 0 01-.778.768z"/><path d="M23.345 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768.43 0 .778.344.778.768V9.99a.773.773 0 01-.778.768zM28.014 10.758c-1.287 0-2.334-1.034-2.334-2.305V5.379c0-1.271 1.047-2.305 2.334-2.305 1.287 0 2.335 1.034 2.335 2.305v3.074c0 1.271-1.048 2.305-2.335 2.305zm0-6.147a.774.774 0 00-.778.768v3.074c0 .423.35.768.778.768a.774.774 0 00.778-.768V5.379a.774.774 0 00-.778-.768zM32.683 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768h1.556c1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305h-.778V9.99a.773.773 0 01-.778.768zm.778-4.61h.778a.774.774 0 00.779-.769.774.774 0 00-.779-.768h-.778v1.537zM3.89 19.98c-1.715 0-3.112-1.38-3.112-3.074V14.6c0-.424.349-.768.778-.768.43 0 .779.344.779.768v2.306c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M8.56 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M13.229 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M17.898 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M22.567 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M27.236 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M31.905 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M36.574 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M41.243 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M45.912 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537V14.6c0-.424.349-.768.779-.768.43 0 .778.344.778.768v2.306c0 1.695-1.397 3.074-3.113 3.074zM47.725 13.832H2.078a.773.773 0 01-.779-.768c0-.425.349-.769.779-.769h45.647c.43 0 .778.344.778.769a.773.773 0 01-.778.768zM41.243 49.18H30.349a.773.773 0 01-.779-.768V29.969c0-.424.349-.768.779-.768h10.894c.43 0 .778.344.778.768v18.443a.773.773 0 01-.778.768zm-10.116-1.537h9.338V30.738h-9.338v16.905zM27.236 41.496H8.56a.773.773 0 01-.778-.769V29.97c0-.424.348-.768.778-.768h18.676c.43 0 .778.344.778.768v10.758a.773.773 0 01-.778.769zM9.338 39.959h17.12v-9.221H9.338v9.221z"/><g><path d="M11.673 35.348a.78.78 0 01-.55-.225.761.761 0 010-1.086l1.556-1.537c.304-.3.796-.3 1.1 0 .304.3.304.786 0 1.086l-1.556 1.537a.78.78 0 01-.55.225z"/></g><g><path d="M13.229 37.654a.78.78 0 01-.55-.225.761.761 0 010-1.087l3.112-3.074c.304-.3.797-.3 1.1 0 .305.3.305.787 0 1.087l-3.112 3.074a.78.78 0 01-.55.225z"/></g><g><path d="M38.13 41.496a.824.824 0 01-.552-.223.802.802 0 01-.226-.546c0-.2.086-.4.226-.545.295-.285.817-.285 1.105 0 .14.146.225.345.225.545 0 .2-.085.4-.225.546a.825.825 0 01-.553.223z"/></g><g><path d="M38.908 7.684a.824.824 0 01-.552-.222.802.802 0 01-.226-.546c0-.208.086-.4.226-.546.296-.284.817-.284 1.105 0 .14.146.226.346.226.546 0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"/></g><g><path d="M10.894 7.684a.788.788 0 01-.552-.222.802.802 0 01-.226-.546c0-.2.086-.4.226-.546.288-.284.817-.284 1.105 0a.79.79 0 01.226.546c0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"/></g></g></svg>
                    </div>
                    <div v-if="$store.state && $store.state.currentStore" class="flex-grow-1">
                      <h6 class="font-weight-bold mb-1">In-Store Pickup</h6>
                      Pick up at {{selectedStoreLoc.name}}, {{selectedStoreLoc.zip}}
                      <b-form-textarea v-model="options.pickup_pdp_message" placeholder="Optional message" class="mt-2" rows="1" max-rows="6" @blur="saveData" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pickup-disclaimer col-md-6">
              <h6 class="font-weight-bold">Pickup Disclaimer - Checkout Message</h6>
              Edit or remove default pickup disclaimer shown on checkout.
              <label class="mt-3 mt-xl-0" for="pickup-disclaimer">Pick Up Disclaimer</label>
              <b-form-textarea 
                :placeholder="`***Order Pick Up Disclaimer*** Please allow time for our team to pull your order. You will be notified when it is ready for pickup. If you show up prior to order confirmation, we may not have your order quite ready.`" 
                rows="4" max-rows="10" v-model="options.pickup_disclaimer" class="form-control" id="pickup-disclaimer" @change="saveData"></b-form-textarea>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import HomePageService from '@/api-services/homepage.service';
  import WizardApiService from '@/api-services/wizard.service';

  export default {
    name: 'fulfillmentOptionsPickup',
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
      wizard_enabled: {
        default: false
      },
      stores:{
        default: []
      },
      selectedStore: {
        default: null
      }
    },
    data() {
      return {
        configure: false,
        configureLoading: false,
      };
    },
    computed: {
      businessDetails() {
        return Object.entries(this.$store.state.businessDetails).length ? this.$store.state.businessDetails : null;
      },
      selectedStoreLoc() {
        if(!this.selectedStore) {
          return {};
        }
        const selectedLoc = this.$store.state.storeLocations.find(loc => loc.id === this.selectedStore);
        return selectedLoc ? selectedLoc:{};
      }
    },
    async mounted() {
      if(!this.businessDetails) {
        let r = await HomePageService.getBusinessDetails();
        this.$store.commit('setBusinessDetails', r.data.data);
      }
    },
    methods: {
      async configureSettings(){
        if(this.stores.length > 1) {
          this.configureLoading = true;
          var _self = this;
          await WizardApiService.getSettings(1).then(e => {
            _self.configureLoading = false;
            _self.configure = true;
            _self.$parent.applyToAll = e.data.settings.apply_to_all == 1;  
            setTimeout(() => {
              _self.$parent.$refs['storeListPickup'].applyToAll = e.data.settings.apply_to_all == 1;              
            }, 500); 
          });
        } else {
          this.configure = true;
        }

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
            enabled: Boolean(this.options.pickup_enabled),
            pickup_pdp_message: this.options.pickup_pdp_message,
            pickup_disclaimer: this.options.pickup_disclaimer,
            business_id: businessId
          }]
        };
        this.$store.commit('setBusinessDetails', { ...this.businessDetails, ...data.settings[0], pickup_enabled: data.settings[0].enabled });
        let callback = AdminService.updateFulfillmentPickup(data);
        this.$emit('onSave', callback);
        return callback;
      },
      showError() {

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
</style>