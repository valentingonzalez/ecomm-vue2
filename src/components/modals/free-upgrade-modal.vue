<template>
  <b-modal size="md" class="modal-box" ref="freeUpgradeModal" id="free-upgrade-modal" no-close-on-backdrop centered hide-header hide-footer>
    <h5 class="modal-title center-title d-inline">Free Trial Upgrade</h5>
    <a href="#" class="close-bt float-right" @click="hideModal">
      <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity=".3" stroke="#17678F" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"><path d="M15 1L1 15M15 15L1 1"/></g></svg>
    </a>
    <div class="d-flex flex-column align-items-center justify-content-between" style="min-height: 400px;">
      <div class="d-flex flex-column align-items-center justify-content-center w-100" style="min-height: 350px;">
        <div v-if="loading" class="d-flex spinner-border mt-2"></div>
        <div class="w-100" v-else>
          <div class="my-4 text-center" v-if="currentStep == 0">        
            <h5>Take advantage of our online ordering options and get more sales! </h5>
            <br>
            <br>
            <h4>For the next 3 months, get a FREE upgrade to "Buy Online & Pickup in Store."</h4>
          </div>
          <div class="my-4 text-center" v-if="currentStep == 1">        
            <b>You're one step away from unlocking all the benefits of our "Buy Online & Pickup in Store" feature, FREE for 3 months!</b>
            <br>
            <br>
            <p class="m-0">Once you begin your free trial, you will have 90 days to try it out and see how it works for you, an EZAD Representative will contact you 5 days prior to your trial expiration and on the day of the trial expiration as well to verify if you wish to continue using the upgraded plan on regular pricing, in case the EZAD representative is not able to get a hold of you or if you wish to discontinue using the upgraded plan, the site will automatically be downgraded back to your base plan</p>
            <br>
            <b>Take advantage of this 3 months free upgrade today and start increasing your sales!</b>
          </div>
           <div class="my-4 p-4" v-if="currentStep == 2">        
            <form @submit.prevent="submitForm">
              <label :class="{'m-0':nameValidation}">Name: <span class="text-danger">*</span></label>
              <label class="d-flex text-danger text-tiny m-0" v-if="nameValidation">{{nameValidation}}</label>
              <input type="text" class="form-control mb-3" v-model="name" placeholder="Enter your name">
              <label :class="{'m-0':phoneValidation}">Phone: <span class="text-danger">*</span></label>
              <label class="d-flex text-danger text-tiny m-0" v-if="phoneValidation">{{phoneValidation}}</label>
              <input type="tel" class="form-control mb-3" v-model="phone" @keypress="onKeyPress" @input="acceptNumber" @paste.prevent="() => {}" placeholder="Enter your phone">
            </form>
          </div>                           
        </div>
      </div>
      <b-button @click="nextStep()" class="font-weight-bold" variant="primary">
        <span v-if="currentStep == 0">Next!</span>
        <span v-if="currentStep == 1">Upgrade</span>
        <span v-if="currentStep == 2">
          <span v-if="submitting" class="spinner-border mr-2" style="width: 0.75rem; height: 0.75rem; "></span>
          <span>{{submitting ? 'Submitting' : 'Submit'}}</span>
        </span>
        <span></span>
      </b-button>
    </div>

  </b-modal>
</template>

<script>
import AdminService from '@/api-services/admin.service';
import HomePageApiService from '@/api-services/homepage.service';

export default {
  name: 'FreeUpgradeModal',
  components: {
  },
  data() {
    return {
      loading: false,
      submitting: false,
      currentStep: 1,
      name: '',
      phone: '',
      nameValidation: '',
      phoneValidation: '',
      sign: ''
    };
  },
  mounted() {
    this.currentStep = 1;
    this.$root.$on('showUpgradeModal', data => {
        this.showModal(data);
    });
  },
  methods: {
    clearModal(step = 0){
      this.currentStep = step;
      this.name = '';
      this.sign = '';
      this.nameValidation = '';
      this.phoneValidation = '';
      if(this.$refs.signaturePad){
        this.$refs.signaturePad.clearSignature();
      }
    },
    clearSign(){
      if(this.$refs.signaturePad){
        this.$refs.signaturePad.clearSignature();
      }
    },
    showModal(step = 0) {
      if(this.$refs.freeUpgradeModal){
        this.$refs.freeUpgradeModal.show();
        this.clearModal(step);
      }      
    },
    hideModal() {
      this.$refs.freeUpgradeModal.hide();
    },
    validateStep(){
      if(this.currentStep < 2){
        return true;
      }
      if(!this.name || this.name.length < 3 || this.name.trim().length < 3){
        this.nameValidation = 'Name is required and must of min 3 characters!';
        return false;
      }
      if(!this.phone || this.phone.trim().length != 14){
        this.phoneValidation = 'Phone is required and must of 10 digits!';
        return false;
      }
      return true;
    },
    async nextStep(){
      if(!this.validateStep()){
        return;
      }
      if(this.currentStep < 2){
        this.loading = true;
        var _self = this;
        setTimeout(function () {
          _self.currentStep++;
          _self.loading = false;
        },500);
      }else{
        this.submitting = true;
        let response = await AdminService.freeTrialUpgrade({
          name: this.name, 
          phone: this.phone 
        }).then(async e => {
          this.clearModal();
          this.submitting = false;
          this.$refs.freeUpgradeModal.hide();
          this.$swal({
            title: "Congratulations!",
            html: `<div class="d-flex flex-column align-items-center">
                      <h4>You have successfully upgraded your plan to “Buy Online, Pickup In-Store” free for 3 months with exciting new benefits, including:</h4>
                        <ul class="p-0 mb-2 text-left" style="width: 225px">
                          <li>Online Ordering Through Stripe</li>
                          <li>Level 2 Customer Support</li>
                          <li>Custom Pages</li>
                          <li>Advanced Statistics</li>
                          <li>Fulfillment</li>
                          <li>Order Management</li>
                        </ul>
                        <b>Changes will be reflected on your site within the next 24 hours, and you will receive a confirmation email once the upgrade is in effect.</b>
                        <b>Schedule a training session with an EZ-AD Onboarding Specialist now to get the most out of your new plan</b>
                        <a class="text-primary mt-2" href="https://ezadtv.com/schedule/334?business_id=${'asdasd'}&type=training" target="_blank">Schedule a Training Session!</a>
                    </div>`,
            type: 'success',
            width: '600px'
          });
          let resp = await HomePageApiService.getBusinessDetails();
          this.$store.commit('setBusinessDetails', resp.data.data);
        }).catch(err => {
          this.$swal('Error', "Something went wrong.Try again later!", 'error');
          this.submitting = false;
        });
      }
    },
    onKeyPress(evt) {
      if(!/[0-9\/]+/.test(evt.key)) {
        evt.preventDefault();
      }
    },
    acceptNumber() {
        var x = this.phone.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        this.phone = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    }
  }
};
</script>

<style lang="scss" scoped>
  
</style>