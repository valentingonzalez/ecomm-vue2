<template>
  <div v-if="$ezHasNoPermission('edit_bank_settings')">
    <no-permission-truevalue page="Bank Setup"></no-permission-truevalue>
  </div>
  <div v-else-if="businessDetails.wizard_enabled" class="py-4 card border-0 wizard-wrapper">
    <div class="px-4 border-bottom pb-2">
      <div class="d-flex justify-content-between mb-3">
        <div class="d-flex"> 
          <h4 class="font-weight-bold">Payment Options</h4>
        </div>
        <div class="d-flex">
          <button @click="save()" :disabled="saving" class="btn btn-sm btn-primary text-medium font-weight-normal">
            <is-saved v-if="saved" :param="saving" />
            <span v-else>Save</span>
          </button>
        </div>
      </div>
        <p class="text-muted lead">
          Settings for payment processing on your website.
        </p>
        <div class="alert alert-danger">
          The First Transaction/Payout May Take Up To 14 Days To Process Due to Stripe’s Safety & Verification Policy.
          <br>
          <a target="_blank" href="https://stripe.com/docs/payouts#:~:text=When%20you%20start%20processing%20live,receiving%20your%20first%20successful%20payment">
            <b>Click Here To Read Stripe’s Policy.</b>
          </a>
        </div>
    </div>
    <div class="px-4 pt-4">
      <div class="contents position-relative">
        <PaymentOptions :ref="`payment-options`" />
      </div>
    </div>
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <h1>Bank Setup</h1>
      </div>
    </div>
    <div class="settings-body">
      <div class="alert alert-danger">
        The First Transaction/Payout May Take Up To 14 Days To Process Due to Stripe’s Safety & Verification Policy.
        <br>
        <a target="_blank" href="https://stripe.com/docs/payouts#:~:text=When%20you%20start%20processing%20live,receiving%20your%20first%20successful%20payment">
          <b>Click Here To Read Stripe’s Policy.</b>
        </a>
      </div>
      <div class="border-bottom border-gray" v-if="!loaded">
        Loading banking information...
      </div>
      <div v-if="loaded">
        <div v-for="b in multi" :key="b.business.business_id" class="stripe-store">
          <h2 class="mt-4">{{ b.business.name }}</h2>
          <!-- report live status -->
          <div v-if="!b.is_live" class="alert alert-warning">
            Payment processing is currently in <strong>test mode</strong>.
          </div>
          <div v-if="b.is_live" class="alert alert-info">
            Payment processing is currently <strong>live</strong>.
          </div>

          <!-- show live switch and dashboard link if we have an account -->
          <div v-if="b.account_setup">
            <b-form-checkbox v-model="b.is_live" @input="switchLive(b)" name="check-button" switch>
              Enable Live Payment Processing
            </b-form-checkbox>
            <br>

            <div><button class="btn btn-primary" @click="dashboard(b)">View Stripe Dashboard</button></div>

            <!-- if we're migrated but still have an old account, allow them to view it -->
            <div v-if="b.has_old && !b.needs_migration">
              <br>
              <button class="btn btn-primary" @click="dashboardLegacy(b)">Legacy Stripe Dashboard</button>
            </div>

            <!-- if we need to move the account show a button to start that process -->
            <div v-if="b.needs_migration">
              <br>
              <button class="btn btn-info" @click="startConnectionNew(b)">
                Upgrade Stripe Integration
              </button>
            </div>
          </div>

          <!-- show connect button if we don't have an account -->
          <div v-if="!b.account_setup">
            <button class="btn btn-primary" @click="startConnectionNew(b)">
              Connect with Stripe
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
  /*
   * UI Spec
   *
   * For accounts still in test mode:
   *
   * We start out with needs_migration=whatever, is_live=false, and account_setup=false.
   * This means live mode is turned off, and they have not yet integrated their stripe account.
   * In this case, the UI needs to have a "Currently in test mode" label with a button to
   * "Connect with Stripe".
   *
   * After they connect and come back, the stripe_account_id in the business is updated to the
   * live ID and stripe_migrated is set to 1, but stripe_live is still set to 0. However, the UI
   * updates to allow for toggling between live and test mode.
   *
   * For accounts that have been set up and need migration:
   *
   * We start with needs_migration=true, account_setup=true, is_live=whatever.
   * They get a toggle for live/test mode, and a button to "Update Stripe Integration" or whatever.
   * This button sets them up through startConnectionNew, and when they return, needs_migration
   * will be false and is_live is however they left it.
   *
   * For accounts that are set up and migrated:
   *
   * We start with needs_migration=false, account_setup=true, is_live=whatever.
   * They get a toggle for live/test mode, and a button that opens dashboard.stripe.com.
   */
  import Ezaxios from '@/ezaxios';
  import NoPermissionTruevalue from './no-permission-truevalue';
  import PaymentOptions from '@/components/admin/payment/payment-options';

  export default {
    name: 'SettingsPaymentOptions',
    components: {
      PaymentOptions,
      NoPermissionTruevalue
    },
    data() {
      return {
        saved: false,
        saving: false,
        loaded: false,
        multi: []
      };
    },
    computed: {
      businessDetails() {
        return Object.entries(this.$store.state.businessDetails).length ? this.$store.state.businessDetails : null;
      }
    },
    async mounted() {
      if(this.$ezHasNoPermission('edit_bank_settings')) return;
      if(!this.businessDetails.wizard_enabled) {
        let response = await Ezaxios.get('admin/bank');
        let data = response.data.data;
        let partners = response.data.partners || [];

        // if a store doesn't have multi payment configured it will send nothing back in partners,
        // and thus partners here will only contain the main store's data.
        partners.unshift(data);
        partners.forEach(p => {
          this.multi.push(p);
        });
        this.loaded = true;
      }
    },
    methods: {
      async save() {
        this.saving = true;
        let result = await this.$refs[`payment-options`].save();
        if(typeof result == 'undefined'){
          this.saved = true;
        }
        setTimeout(() => {
          this.saving = false;
        },1000);
        setTimeout(() => {
          this.saved = false;
        },1500);
        return;
      },
      switchLive(b) {
        // use value and not this.is_live since the latter updates in the next tick.
        Ezaxios.post('admin/bank/live', {
          live: b.is_live,
          business_id: b.business.id,
        }).then(res => {
          if ( res.data.status === 'ok' ) {
            // update state immediately without needing a page reload
            // only do this if the one we're changing matches the selected store?
            this.$store.state.stripe_publishable = b.is_live ? b.public_keys.migrated_live : b.public_keys.legacy_test;
            this.$store.state.stripe_live = b.is_live;
          } else {
            alert('Error: ' + res.data.message);
          }
        });
      },
      startConnectionNew(b) {
        // pre-fill some data for stripe onboarding
        const base = Ezaxios.defaults.baseURL;
        let clientId;
        if ( base.includes('localhost') ) {
          // normally this would be legacy_test for test mode, but when running on localhost
          // and testing the connect procedures we want to use the migrated account.
          clientId = b.client_ids.migrated_test;
        } else {
          clientId = b.client_ids.migrated_live;
        }
        const params = {
          'redirect_uri': base + '/stripe/oauth',
          'client_id': clientId,
          'state': 'v2-' + b.state_key,
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
          if ( params[k].length > 0 ) {
            qs += k + '=' + encodeURIComponent(params[k]) + '&';
          }
        });

        window.location.href = 'https://connect.stripe.com/oauth/authorize?' + qs;
      },
      dashboard(b) {
        if ( b.needs_migration ) {
          this.dashboardLegacy(b);
        } else {
          this.dashboardNew();
        }
      },
      dashboardLegacy(b) {
        Ezaxios.get('admin/bank/login?business_id=' + b.business.id).then(response => {
          window.open(response.data.url, '_blank');
        });
      },
      dashboardNew() {
        window.open('https://dashboard.stripe.com/', '_blank');
      }
    }
  };  
</script>
