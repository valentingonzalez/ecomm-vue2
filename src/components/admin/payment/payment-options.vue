<template>
    <div>
      <WizardStoreList v-if="multi.length <= 1" ref="storeList" :enableApplyToAll="true" :multiple="true" :selectedStore="selectedStores" @onSelect="pushStore" @onApplyToAll="onApplyToAll" class="border-bottom pb-4 mb-4" />
      <template v-if="(selectedStores && selectedStores.length)">
        <div v-for="store in selectedStores" class="card p-4 card-alt mb-4" :key="store">
          <transition name="fadeHeight">
            <div v-if="!applyToAll">
              <div class="border-bottom pb-3 text-center mb-4">
                <h5 v-if="store && stores.find(e => e.id == store)">Store: <span class="text-primary">{{ stores.find(e => e.id == store).name }}</span></h5>
              </div>
            </div>
          </transition>
          <div>
            <div v-if="loading" class="d-flex align-items-center justify-content-center">
              <div class="spinner-border my-2"></div>
            </div>
            <template v-else-if="getOption(store) != null">
              
              <div class="card p-4 w-100">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 class="mb-2 font-weight-bold">Pay in Store</h5>
                    <div class="text-muted mr-5 lead">
                      Settings to allow your customers to pay in store.
                    </div>
                  </div>
                  <div class="custom-control custom-switch">
                    <input type="checkbox" v-model="getOption(store).store" class="custom-control-input" :id="`enableStore-${store}`">
                    <label class="custom-control-label" :for="`enableStore-${store}`" v-html="getOption(store).store ? 'Enabled' : 'Disabled'"></label>
                  </div>
                </div>
                <transition name="fadeHeight">
                  <div v-if="getOption(store).store">
                    <div class="border-top pt-3 mt-3">
                      <div class="custom-control custom-checkbox text-nowrap">
                        <input type="checkbox" class="custom-control-input" :id="`replaceStoreText-${store}`" v-model="getOption(store).storeReplaceTextBool" />
                        <label class="custom-control-label" :for="`replaceStoreText-${store}`">
                          Replace With a Message
                          <div class="text-muted">By enabling, you can replace how the messaging displays on the website to a user.</div>
                        </label>
                      </div>
                      <transition name="fadeHeight">
                        <div v-if="getOption(store).storeReplaceTextBool">
                          <textarea v-model="getOption(store).storeReplaceText" class="form-control mt-4" rows="4"></textarea>
                        </div>
                      </transition>  
                    </div>
                  </div>
                </transition>
              </div>
              <div class="card p-4 w-100 mt-4">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 class="mb-2 font-weight-bold">Pay on Website</h5>
                    <div class="text-muted mr-5 lead">
                      Settings to allow your customers to pay online.
                    </div>
                  </div>
                  <div class="custom-control custom-switch">
                    <input type="checkbox" v-model="getOption(store).website" class="custom-control-input" :id="`enableWebsite-${store}`">
                    <label class="custom-control-label" :for="`enableWebsite-${store}`" v-html="getOption(store).website ? 'Enabled' : 'Disabled'"></label>
                  </div>
                </div>
                <transition name="fadeHeight">
                  <div v-if="getOption(store).website">
                    <div class="border-top pt-3 mt-3">
                      <div class="card card-alt p-4 mb-4">
                        <div class="d-flex justify-content-between align-items-center">
                          <div class="d-flex align-items-center">
                            <img width="32" src="/icons/stripe.png" srcset="/icons/stripe@2x.png" alt="Stripe">
                            <h6 class="ml-2 mb-0 text-uppercase font-weight-bold">Stripe</h6>
                          </div>
                          <div v-if="(isMainBusiness(store) || multi.length > 1)" class="custom-control custom-switch">
                            <input type="checkbox" v-model="getOption(store).stripe_enabled" class="custom-control-input" :id="`enableStripe-${store}`">
                            <label class="custom-control-label" :for="`enableStripe-${store}`" v-html="getOption(store).stripe_enabled ? 'Enabled' : 'Disabled'"></label>
                          </div>
                          <div v-else>
                            <h6 class="mb-0 mt-2">All store locations share the Stripe account settings of the main business.</h6>
                          </div>
                        </div>
                        <transition name="fadeHeight">
                          <div v-if="getOption(store).stripe_enabled && (isMainBusiness(store) || multi.length > 1)">
                            <div class="border-top mt-3">
                              <div class="card p-4 mt-3">
                                <div v-for="(b, i) in multi.filter(e => e.business.id == store)" :key="`stripeInfo-${b.business.id}`" class="stripe-store" :class="applyToAll && i < multi.length - 1 ? 'mb-3 border-bottom pb-3' : ''">
                                  <h3 v-if="!applyToAll">{{ b.business.name }}</h3>
                                  <!-- report live status -->
                                  <div v-if="!isLiveMode(store)" class="alert alert-warning">
                                    Payment processing is currently in <strong>test mode</strong>.
                                  </div>
                                  <div v-if="isLiveMode(store)" class="alert alert-info">
                                    Payment processing is currently <strong>live</strong>.
                                  </div>

                                  <!-- show live switch and dashboard link if we have an account -->
                                  <div>
                                    <b-form-checkbox v-model="b.is_live" name="check-button" switch v-if="b.account_setup">
                                      Enable Live Payment Processing
                                    </b-form-checkbox>
                                    <div class="d-flex align-items-center justify-content-between mt-3">
                                      <button class="btn btn-primary" @click="startConnectionNew(b)" v-if="!b.account_setup">
                                        Connect to Stripe
                                      </button>
                                      <div class="d-flex" v-else>
                                        <button class="btn btn-primary" @click="dashboard(b)">
                                          View Stripe Dashboard
                                        </button>
                                        <button v-if="b.has_old && !b.needs_migration" class="btn btn-outline-primary ml-2" @click="dashboardLegacy(b)">
                                          Legacy Stripe Dashboard
                                        </button>
                                      </div>
                                      <div class="custom-control custom-switch">
                                        <input type="checkbox" v-model="getOption(b.business.id).advance_stripe_checkout" class="custom-control-input" :id="`advancedStripe-${b.business.id}`">
                                        <label class="custom-control-label custom-control-label-left" :for="`advancedStripe-${b.business.id}`">Stripe Checkout</label>
                                      </div>
                                    </div>
                                    <button class="btn btn-info" @click="startConnectionNew(b)" v-if="b.needs_migration && b.account_setup">
                                      Upgrade Stripe Integration
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>                          
                        </transition>
                      </div>

                      <div class="card card-alt p-4 mb-4">
                        <div class="d-flex justify-content-between align-items-center">
                          <div class="d-flex align-items-center">
                            <img height="30" src="/icons/paypal-o.png" srcset="/icons/paypal-o.png" alt="Stripe">
                            <h6 class="ml-2 mb-0 text-uppercase font-weight-bold">Express Checkout</h6>
                          </div>
                          <div class="custom-control custom-switch">
                            <input type="checkbox" v-model="getOption(store).paypal_checkout_enabled" class="custom-control-input" :id="`enablePaypal-${store}`">
                            <label class="custom-control-label" :for="`enablePaypal-${store}`" v-html="getOption(store).paypal_checkout_enabled ? 'Enabled' : 'Disabled'"></label>
                          </div>
                        </div>
                        <transition name="fadeHeight">
                          <div v-if="getOption(store).paypal_checkout_enabled">
                            <div class="border-top mt-3">
                              <div class="card p-4 mt-3">
                                <div v-for="(b, i) in options.filter(e => e.business_id == store)" :key="`paypal-${b.business_id}`" class="stripe-store" :class="applyToAll && i < options.length - 1 ? 'mb-3 border-bottom pb-3' : ''">
                                  <h3 v-if="applyToAll">{{ multi.filter(e => e.business.id == b.business_id).name }}</h3>
                                  <!-- <div class="custom-control custom-switch">
                                    <input type="checkbox" v-model="getOption(b.business_id).paypal_live" class="custom-control-input" id="paypal-live">
                                    <label class="custom-control-label" for="paypal-live">Enable Live Payment Processing</label>
                                  </div> -->                                                                    
                                  <a class="cursor-pointer mt-2 d-flex" @click="showModal"> Paypal Setup Guide</a> 
                                  <label class="mt-2">Paypal Client ID</label>
                                  <input type="text" v-model="getOption(b.business_id).paypal_client_id" class="form-control mb-2" :id="`paypal_client_id-${b.business_id}`">

                                  <label>Paypal Secret</label>
                                  <input type="text" v-model="getOption(b.business_id).paypal_secret" class="form-control" :id="`paypal_secret-${b.business_id}`">
                                  <div class="custom-control custom-switch mt-2">
                                    <input type="checkbox" v-model="getOption(b.business_id).paypal_paylater_enabled" class="custom-control-input" :id="`paypal-paylater-enabled-${b.business_id}`">
                                    <label class="custom-control-label" :for="`paypal-paylater-enabled-${b.business_id}`">Enable Pay Later</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </transition>
                      </div>
                      <div class="custom-control custom-checkbox text-nowrap border-top pt-4">
                        <input type="checkbox" class="custom-control-input" :id="`replaceWebsiteText-${store}`" v-model="getOption(store).websiteReplaceTextBool" />
                        <label class="custom-control-label" :for="`replaceWebsiteText-${store}`">
                          Replace With a Message
                          <div class="text-muted">By enabling, you can replace how the messaging displays on the website to a user.</div>
                        </label>
                      </div>
                      <transition name="fadeHeight">
                        <div v-if="getOption(store).websiteReplaceTextBool">
                          <textarea v-model="getOption(store).websiteReplaceText" class="form-control mt-4" rows="4"></textarea>
                        </div>
                      </transition>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
          </div>
        </div>
      </template>
      <b-modal size="md" class="modal-box" ref="paypalSetup" id="paypal-setup-modal" centered hide-header hide-footer>
        <h5 class="modal-title center-title d-inline"><b>Setup your PayPal account</b></h5>
        <a class="close-bt float-right" @click="hideModal">
          <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity=".3" stroke="#17678F" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"><path d="M15 1L1 15M15 15L1 1"/></g></svg>
        </a>
        <div class="d-flex flex-column mt-3">
          <b>Here's how to get your Client ID and Client Secret:</b> 
          <ol class="my-3">
            <li class="mb-1"><a href="https://developer.paypal.com/dashboard/" target="_blank">Log in to PayPal Dashboard</a> OR Sign Up.</li>
            <li class="mb-1">Ensure that you activate <b>Live Mode</b> from the navigation bar.</li>
            <li class="mb-1">Go to <b>Apps & Credentials</b> from the navigation bar.</li>
            <li class="mb-1">Copy the <b>Client ID</b> and <b>Client Secret</b> from your PayPal app.</li>
            <li class="mb-1">Insert your <b>Client ID</b> and <b>Client Secret</b> within the Payment Options under the PayPal section on your website's admin panel.</li>
            <li>Click on <b>Save</b>.</li>      
            <li class="mb-1">Go to <a href="https://www.paypal.com/businessmanage/preferences/website" target="_blank">Website Payment Preferences</a>.</li>            
            <li class="mb-1">Scroll down to <b>Contact telephone number</b>. </li>
            <li class="mb-1">And choose  <b>On (required field)</b>.</li>
          </ol>
        </div>
      </b-modal>
    </div>
</template>

<script>
  import WizardStoreList from '@/components/admin/wizard/wizard-store-list';
  import AdminApiService from '@/api-services/admin.service';
  import Ezaxios from '@/ezaxios';
  export default {
    name: 'paymentOptions',
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
        options: [],
        multi: []
      };
    },
    computed: {
      step() {
        return this.$store.state.adminWizardSteps.find(e => e.id == this.$route.meta.id);
      },
      currentItem() {
        return this.$route.query.step || 1;
      },
      itemId() {
        // 0 in case of website settings
        return this.step && this.step.items ? this.step.items[this.currentItem - 1].id : 0;
      },
      currentStep() {
        return this.$route.query.step || 1;
      },
      stores() {
        return this.businessDetails.wizard_enabled ? (this.$store.state.adminWizardBusinesses || []) : [{ id: window.localStorage.getItem('selectedStore')}];
      },
      applyToAll() {
        return this.multi.length > 1 ? false : this.$refs.storeList.applyToAll;
      },
      businessDetails() {
        return Object.entries(this.$store.state.businessDetails).length ? this.$store.state.businessDetails : null;
      },
    },
    async mounted() {
      await this.getBankInfo();
      await this.getSettings();
      this.selectedStores = this.businessDetails.wizard_enabled && this.stores.length > 0 ? (this.applyToAll && this.stores.length > 0 ? [String((this.stores.find(x => x.base) && this.stores.find(x => x.base).id ? this.stores.find(x => x.base).id : this.stores[0].id))] 
                            : 
                            this.$route.query.store ? 
                              this.$route.query.store.split(',') 
                              : 
                              [String((this.stores.find(x => x.base) && this.stores.find(x => x.base).id ? this.stores.find(x => x.base).id : this.stores[0].id))]) : [window.localStorage.getItem('selectedStore')];
      this.loading = false;
      if (this.multi.length > 1) {
        this.onApplyToAll(false);
      }
    },
    methods: {
      async getBankInfo(){
        return await Ezaxios.get('admin/bank').then(resp => {
          this.multi = [];
          let partners = resp.data.partners || [];
          partners.unshift(resp.data.data);
          partners.forEach(p => this.multi.push(p));          
        });
      },
      async getSettings(){
        return await AdminApiService.getFulfillmentByKey('payment').then(async e => {
          this.options = e.data.data;
          for (let index = 0; index < this.options.length; index++) {
            let e = this.options[index];
            e.payment.paypal_checkout_enabled = e.payment.paypal_checkout_enabled * 1;
            // e.payment.paypal_live = e.payment.paypal_live * 1;
            e.payment.paypal_paylater_enabled = e.payment.paypal_paylater_enabled * 1;            
            e.payment.paypal_live = 1;
            e.payment.business_id = e.business_id;
            e.payment = { 
              ...e.payment, 
              store: e.payment.pickup_payment == 'store' || e.payment.pickup_payment == 'both',
              website: e.payment.pickup_payment == 'website' || e.payment.pickup_payment == 'both',
              storeReplaceTextBool: Boolean(e.payment.storeReplaceText),
              websiteReplaceTextBool: Boolean(e.payment.websiteReplaceText)
            };
            if(this.isMainBusiness(e.business_id)) {
              await this.getBankInfo();
              let b = this.multi.find(x => x.business.id == e.business_id);
              this.$store.state.stripe_publishable = e.payment.stripe_live ? b.public_keys.migrated_live : b.public_keys.legacy_test;
              this.$store.state.stripe_live = e.payment.stripe_live;
            }   
          }        
        });
      },
      startConnectionNew(b) {
        // pre-fill some data for stripe onboarding
        const base = Ezaxios.defaults.baseURL;
        const clientId = base.includes('localhost') || base.includes('ecom-dev.ezadlive.com') ? b.client_ids.migrated_test : b.client_ids.migrated_live;
        const params = {
          'redirect_uri': `${base}/stripe/oauth`,
          'client_id': clientId,
          'state': `v2-${b.state_key}`,
          'response_type': 'code',
          'scope': 'read_write',
          'stripe_user[email]': b.business.email,
          'stripe_user[url]': '',
          'stripe_user[country]': 'US',
          'stripe_user[business_name]': b.business.name,
          'stripe_user[first_name]': '',
          'stripe_user[last_name]': '',
          'stripe_user[street_address]': b.business.address,
          'stripe_user[city]': b.business.city,
          'stripe_user[state]': b.business.state,
          'stripe_user[zip]': b.business.zip,
          'stripe_user[physical_product]': 'true',
          'stripe_user[currency]': 'usd',
        };
        let qs = '';
        Object.keys(params).forEach(k => {
          if(params[k].length > 0) qs += `${k}=${encodeURIComponent(params[k])}&`;
        });

        window.location.href = `https://connect.stripe.com/oauth/authorize?${qs}`;
      },

      switchLive(b) {
        Ezaxios.post('admin/bank/live', {
          live: b.is_live,
          business_id: b.business.id,
        }).then(res => {
          if(res.data.status === 'ok' || res.data.status === 'success') {
            this.$store.state.stripe_publishable = b.is_live ? b.public_keys.migrated_live : b.public_keys.legacy_test;
            this.$store.state.stripe_live = b.is_live;
          } else {
            alert(`Error: ${res.data.message}`);
          }
        });
      },
      dashboard(b) {
        if(b.needs_migration) {
          this.dashboardLegacy(b);
        } else {
          this.dashboardNew();
        }
      },
      dashboardLegacy(b) {
        Ezaxios.get(`admin/bank/login?business_id=${b.business.id}`).then(response => {
          window.open(response.data.url, '_blank');
        });
      },
      dashboardNew() {
        window.open('https://dashboard.stripe.com/', '_blank');
      },
      getOption(id) {
        return this.options.find(e => e.business_id == (id * 1)) ? this.options.find(e => e.business_id == (id * 1)).payment : null;
      },
      validatePaymentSettings(settings){
        let result = [];
        let multi = settings.length > 1;
        for (const itm of settings) {
          if(!itm.website && !itm.store){
            result = [`Please select at least one settings${multi ? ' for '+this.stores.find(x => x.id == itm.business_id).name : ''}`];
            break;
          }
          if(itm.website && !itm.stripe_enabled && !itm.paypal_checkout_enabled){
            result = [`Please select at least one payment provider${multi ? ' for '+this.stores.find(x => x.id == itm.business_id).name : ''}`];
            break;
          }
          if(itm.paypal_checkout_enabled && (!itm.paypal_secret || !itm.paypal_client_id)) {
            result = ['Please enter paypal keys'];
            break;
          }
        }
        return result;
      },
      async save() {
        let settings = this.options.map(e => ({ business_id: e.business_id, ...e.payment, stripe_live: this.getStripeLive(e.business_id) })).filter(e => this.applyToAll ? String(e.business_id) == String(this.stores[0].id) : (this.selectedStores.includes(String(e.business_id)) || this.selectedStores.includes(Number(e.business_id))) );
        let validate = this.validatePaymentSettings(settings);
        if(validate.length > 0){
          await this.$swal(validate.join('<br />'), '', 'error');      
          return false;
        }
        return await AdminApiService.updateFulfillmentPayment({
          step_item_id: this.itemId,
          applyToAll: this.applyToAll,
          settings: settings
        }).then(() => {
          this.getSettings();
          return true;
        }).catch( err => {
          let errorMsg = Object.keys(err.response.data.error[0]).map(key => err.response.data.error[0][key]).join('<br />');
          if(!this.applyToAll) {
            this.stores.forEach((itm,idx) => {
              errorMsg.replaceAll(`{${itm.id}}`, itm.name);
            }); 
          }
          this.$swal('Error', errorMsg, 'error');
          return false;
        });
      },
      getStripeLive(id){
        return this.multi.length > 1 ? this.multi.find(x => x.business.id == id).is_live : this.multi[0].is_live;
      },
      pushStore(stores) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { store: String(stores) }) }).catch(() => {});
        this.selectStore(stores);
      },
      selectStore(stores) {
        this.selectedStores = stores;
      },
      onApplyToAll(val) {
        let selected = null;
        let mainBusiness = [String(this.stores.find(x => x.base) && this.stores.find(x => x.base).id ? this.stores.find(x => x.base).id : this.stores[0].id)];
        if (val) {
          selected = mainBusiness;
        } else {
          selected = this.$route.query.store ? this.$route.query.store.split(',').map(e => String(e)) : (this.multi.length > 1 ? this.stores.map(x => x.id) : mainBusiness);
        }
        this.selectStore(selected);
      },
      showModal() {
        this.$refs.paypalSetup.show();             
      },
      hideModal() {
        this.$refs.paypalSetup.hide();
      },
      isMainBusiness(id){
        return this.stores.find(e => e.id == id) ? this.stores.find(e => e.id == id).base : false;
      },
      isLiveMode(store){
        return this.options.find(e => e.business_id == store) && this.options.find(e => e.business_id == store).payment ? this.options.find(e => e.business_id == store).payment.stripe_live : null;
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
  .fadeHeight-enter-active,
  .fadeHeight-leave-active {
    transition: all 0.2s;
    max-height: 500px;
  }
  .fadeHeight-enter,
  .fadeHeight-leave-to {
    opacity: 0;
    max-height: 0px;
  }
</style>