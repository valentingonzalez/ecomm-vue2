<template>
  <b-modal size="lg" class="modal-box tvr-modal" ref="tvrDialog" :title="modalTitle">

    <template v-if="layout === 'start'">
      <div class="row">
        <div class="col-sm-12 text-center">
          <p class="mb-1">If you think you have a {{ $ezTVRName() }} account already, try looking it up first.</p>
          <button class="btn btn-primary" type="button" @click="gotoLookup">
            Look up your {{ $ezTVRName() }} Number
          </button>
          <p class="mt-4 mb-1">Sign up for a new {{ $ezTVRName() }} account.</p>
          <button class="btn btn-primary" type="button" @click="gotoSignup">
            Sign up for {{ $ezTVRName() }}
          </button>
        </div>
      </div>
    </template>

    <template v-if="layout === 'lookup'">
      <p v-if="showNotFound"><strong>We could not find your Rewards Number with the information below.</strong></p>
      <p v-else><strong>All fields are required.</strong></p>

      <div class="row">
        <div class="col-sm-6">
          <label class="form-check-label">Last Name <span class="text-primary">*</span></label>
          <input :disabled="loading" v-model="tvrData.last_name" type="text" class="form-control p-2" required>
          <div ref="l_last_name" class="invalid-feedback">Please enter your last name.</div>
        </div>
        <div class="col-sm-6">
          <label class="form-check-label">E-mail Address <span class="text-primary">*</span></label>
          <input :disabled="loading" v-model="tvrData.email" type="text" class="form-control p-2" required>
          <div ref="l_email" class="invalid-feedback">Please enter your e-mail address.</div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-6">
          <label class="form-check-label">Phone Number <span class="text-primary">*</span></label>
          <input :disabled="loading" v-model="tvrData.telephone" type="text" class="form-control p-2" required>
          <div ref="l_telephone" class="invalid-feedback">Please enter your phone number.</div>
        </div>
        <div class="col-sm-6">
          <label class="form-check-label">Zip Code <span class="text-primary">*</span></label>
          <input :disabled="loading" v-model="tvrData.postal_code" type="text" class="form-control" name="postal_code" required>
          <div ref="l_postal_code" class="invalid-feedback">Please enter your zip code.</div>
        </div>
      </div>
    </template>

    <template v-if="layout === 'signup'">
      <p><strong>All fields are required unless noted otherwise.</strong></p>

      <div class="row">
        <div class="col-sm-6">
          <label class="form-check-label">First Name <span class="text-primary">*</span></label>
          <input :disabled="loading" v-model="tvrData.first_name" type="text" class="form-control p-2" required>
          <div ref="s_first_name" class="invalid-feedback">Please enter your first name.</div>
        </div>
        <div class="col-sm-6">
          <label class="form-check-label">Last Name <span class="text-primary">*</span></label>
          <input :disabled="loading" v-model="tvrData.last_name" type="text" class="form-control p-2" required>
          <div ref="s_last_name" class="invalid-feedback">Please enter your last name.</div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-6">
          <label class="form-check-label">Phone Number <span class="text-primary">*</span></label>
          <input :disabled="loading" v-model="tvrData.telephone" type="text" class="form-control p-2" required>
          <div ref="s_telephone" class="invalid-feedback">Please enter your phone number.</div>
        </div>
        <div class="col-sm-6">
          <label class="form-check-label">E-mail Address <span class="text-primary">*</span></label>
          <input :disabled="loading" v-model="tvrData.email" type="text" class="form-control p-2" required>
          <div ref="s_email" class="invalid-feedback">Please enter your e-mail address.</div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-6 col-xs-12">
          <label class="form-check-label">Address <span class="text-primary">*</span></label>
          <input :disabled="loading" v-model="tvrData.address" type="text" class="form-control" name="address" required>
          <div ref="s_address" class="invalid-feedback">Please enter your address.</div>
        </div>
        <div class="col-sm-6 col-xs-12">
          <label class="form-check-label">Address line 2 (optional)</label>
          <input :disabled="loading" v-model="tvrData.address2" type="text" class="form-control" name="address2">
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-5 col-xs-12">
          <label class="form-check-label">City <span class="text-primary">*</span></label>
          <input :disabled="loading" type="text" v-model="tvrData.city" class="form-control" name="city" required>
          <div ref="s_city" class="invalid-feedback">Please enter your city.</div>
        </div>
        <div class="col-sm-4 col-xs-12">
          <label class="form-check-label">State <span class="text-primary">*</span></label>
          <select :disabled="loading" v-model="tvrData.state" class="form-control" name="state">
            <option v-for="(state,key) in this.businessDetails.states" :value="key" :key="key">{{state}}</option>
          </select>
          <div ref="s_state" class="invalid-feedback">Please select your state.</div>
        </div>
        <div class="col-sm-3 col-xs-12">
          <label class="form-check-label">Zip Code <span class="text-primary">*</span></label>
          <input :disabled="loading" v-model="tvrData.postal_code" type="text" class="form-control" name="postal_code" required>
          <div ref="s_postal_code" class="invalid-feedback">Please enter your zip code.</div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-12">
          <label><strong>Receive Marketing Emails</strong><br>Don't miss our great deals!</label>
          <div class="custom-control custom-switch">
            <input :disabled="loading" type="checkbox" v-model="tvrData.receive_marketing" class="custom-control-input"
                   id="receive-marketing-tvr">
            <label class="custom-control-label" for="receive-marketing-tvr"
                   v-html="tvrData.receive_marketing ? 'Enabled' : 'Disabled'"></label>
          </div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-12">
          By signing up, you confirm that you have reviewed and agreed with the {{ $ezTVRName() }}
          <a target="_blank" href="https://www.truevalue.com/privacy-policy">privacy policy</a> and
          <a target="_blank" href="https://rewards.truevalue.com/terms.do">terms &amp; conditions</a>.
        </div>
      </div>
    </template>

    <div slot="modal-footer" class="d-flex align-items-center">
      <div v-if="loading" class="spinner-border mr-3"></div>

      <button type="button" @click="cancel" class="btn btn-outline-primary mr-3">Cancel</button>
      <button v-if="layout === 'signup'" :disabled="loading" type="button" @click="tvrSignup" class="btn btn-primary">
        Sign up
      </button>
      <button v-if="layout === 'lookup'" :disabled="loading" type="button" @click="tvrLookup" class="btn btn-primary">
        Look up
      </button>
    </div>
  </b-modal>
</template>

<script>
import CartApiService from "@/api-services/cart.service";

export default {
  name: 'TrueValueRewardsModal',
  props: {
    tvrData: {
      type: Object
    }
  },
  data() {
    return {
      modalTitle: this.$ezTVRName(),
      layout: 'start',
      loading: false,
      showNotFound: false,
    };
  },
  computed: {
    businessDetails() {
      return this.$store.state.businessDetails;
    }
  },
  methods: {
    showTvrModal(signup, notFoundError) {
      if ( signup ) {
        this.gotoSignup();
      } else {
        this.gotoLookup();
      }
      this.showNotFound = !!notFoundError;
      this.$refs.tvrDialog.show();
      this.$emit('shown');
    },
    hideTvrModal() {
      this.$refs.tvrDialog.hide();
      this.$emit('hidden');
    },
    gotoLookup() {
      this.layout = 'lookup';
      this.modalTitle = 'Look up your ' + this.$ezTVRName() + ' Number';
    },
    gotoSignup() {
      this.layout = 'signup';
      this.modalTitle = 'Sign up for ' + this.$ezTVRName();
    },
    cancel() {
      this.hideTvrModal();
      this.modalTitle = this.$ezTVRName();
    },
    async tvrSignup() {
      this.tvrData.address2 = this.tvrData.address2 || '';

      const s = this.tvrData;
      // HOW THE FUCK IS TELEPHONE UNDEFINED? WHAT THE FUCK VUEJS?????
      if ( !s.telephone ) {
        s.telephone = '';
      }
      s.telephone = s.telephone.replace(/[^0-9]/g, '');
      let err = false;
      if ( !s.first_name || s.first_name.length < 2 ) {
        this.$refs.s_first_name.classList.add('d-block');
        err = true;
      } else {
        this.$refs.s_first_name.classList.remove('d-block');
      }
      if ( !s.last_name || s.last_name.length < 2 ) {
        this.$refs.s_last_name.classList.add('d-block');
        err = true;
      } else {
        this.$refs.s_last_name.classList.remove('d-block');
      }
      if ( !s.telephone || s.telephone.length !== 10 ) {
        this.$refs.s_telephone.classList.add('d-block');
        err = true;
      } else {
        this.$refs.s_telephone.classList.remove('d-block');
      }
      if ( !s.email || s.email.length < 5 || !s.email.includes('@') ) {
        this.$refs.s_email.classList.add('d-block');
        err = true;
      } else {
        this.$refs.s_email.classList.remove('d-block');
      }
      if ( !s.address || s.address.length < 2 ) {
        this.$refs.s_address.classList.add('d-block');
        err = true;
      } else {
        this.$refs.s_address.classList.remove('d-block');
      }
      if ( !s.city || s.city.length < 2 ) {
        this.$refs.s_city.classList.add('d-block');
        err = true;
      } else {
        this.$refs.s_city.classList.remove('d-block');
      }
      if ( !s.state || s.state.length < 2 ) {
        this.$refs.s_state.classList.add('d-block');
        err = true;
      } else {
        this.$refs.s_state.classList.remove('d-block');
      }
      if ( !s.postal_code || s.postal_code.length !== 5 ) {
        this.$refs.s_postal_code.classList.add('d-block');
        err = true;
      } else {
        this.$refs.s_postal_code.classList.remove('d-block');
      }

      if ( err ) {
        return;
      }

      try {
        this.loading = true;
        let response = await CartApiService.doTvrSignup(this.tvrData);
        this.loading = false;
        if (response.data.status === 'success') {
          this.$swal('Success!',
            'You have been signed up for ' + this.$ezTVRName() + '. Your account number is ' + response.data.tvr_number + '.',
            'success');
          this.hideTvrModal();
          this.$emit('signup', response.data.tvr_number);
        } else {
          this.$swal('Error', response.data.message, 'error');
          this.$emit('error', response.data.message);
        }
      } catch ( e ) {
        this.loading = false;
        this.$swal('Error', 'Please check that all required fields are filled and valid.', 'error');
      }
    },
    async tvrLookup() {
      const s = this.tvrData;
      let err = false;
      s.telephone = (s.telephone || '').replace(/[^0-9]/g, '');
      if ( !s.last_name || s.last_name.length < 2 ) {
        this.$refs.l_last_name.classList.add('d-block');
        err = true;
      } else {
        this.$refs.l_last_name.classList.remove('d-block');
      }
      if ( !s.email || s.email.length < 5 || !s.email.includes('@') || !s.email.includes('.') ) {
        this.$refs.l_email.classList.add('d-block');
        err = true;
      } else {
        this.$refs.l_email.classList.remove('d-block');
      }
      if ( !s.telephone || s.telephone.length !== 10 ) {
        this.$refs.l_telephone.classList.add('d-block');
        err = true;
      } else {
        this.$refs.l_telephone.classList.remove('d-block');
      }
      if ( !s.postal_code || s.postal_code.length !== 5 ) {
        this.$refs.l_postal_code.classList.add('d-block');
        err = true;
      } else {
        this.$refs.l_postal_code.classList.remove('d-block');
      }

      if ( err ) {
        return;
      }

      try {
        this.loading = true;
        const result = await CartApiService.doTvrLookup({
          last_name: s.last_name,
          email: s.email,
          telephone: s.telephone,
          zip: s.postal_code
        });
        this.loading = false;

        if (result.data.status === 'success') {
          this.$swal('Success!', 'We found your ' + this.$ezTVRName() + ' number: ' + result.data.tvr_number, 'success');
          this.hideTvrModal();
          this.$emit('signup', result.data.tvr_number);
        } else {
          this.$swal('Error', result.data.message, 'error');
          this.$emit('error', result.data.message);
        }
      } catch (e) {
        this.loading = false;
        this.$swal('Error', 'Please check that all required fields are filled and valid.', 'error');
      }
    },
  }
};
</script>
