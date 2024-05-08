<template>
  <div id="wrapper">
    <div class="container d-flex justify-content-center">
      <div class="card card-primary mb-5">
        <div class="card-header" :class="{'shrink' : message}">
          Sign Up
          <div class="alt-message" v-if="message">{{ message }}</div>
        </div>
        <div class="card-body flex-column">
          <b-form @submit.prevent="signUp">
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group">
                  <label for="first-name">First Name <span class="text-danger">*</span></label>
                  <input
                    v-model="signUpForm.first_name"
                    id="first-name"
                    type="text"
                    class="form-control"
                    required
                    placeholder="Enter your first name">
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <label for="last-name">Last Name <span class="text-danger">*</span></label>
                  <input
                    v-model="signUpForm.last_name"
                    @blur="tvrLookup"
                    id="last-name"
                    type="text"
                    class="form-control"
                    required
                    placeholder="Enter your last name">
                </div>
              </div>
            </div>
            <div class="form-group" v-if="$store.state.settings.registrationOptions && $store.state.settings.registrationOptions.companyInput">
              <label for="company">Company (If Applicable)</label>
              <input
                v-model="signUpForm.company_name"
                id="company"
                type="text"
                class="form-control"
                placeholder="Enter your company name">
            </div>
            <div class="form-group">
              <label for="phone">Mobile phone <span class="text-danger">*</span></label>
              <input
                v-model="signUpForm.telephone"
                @blur="tvrLookup"
                id="phone"
                type="tel"
                class="form-control"
                required
                minlength="10"
                maxlength="12"
                @keypress="onlyNumber"
                placeholder="Enter your phone number">
            </div>
            <div class="form-group">
              <label for="email">Email Address <span class="text-danger">*</span></label>
              <input
                v-model="signUpForm.email"
                @blur="tvrLookup"
                id="email"
                type="email"
                class="form-control"
                required
                placeholder="Enter your email address">
            </div>
            <div class="form-group">
              <label for="password">Password <span class="text-danger">*</span></label>
              <input
                v-model="signUpForm.password"
                id="password"
                type="password"
                class="form-control"
                required
                pattern=".{6,}"
                title="Password must be at least 6 letters long"
                placeholder="Enter your password">
            </div>
            <div class="form-group">
              <label for="password-confirm">Confirm Password <span class="text-danger">*</span></label>
              <input
                v-model="signUpForm.passwordConfirm"
                id="password-confirm"
                type="password"
                class="form-control"
                required
                placeholder="Re-enter your password">
            </div>
            <div class="form-group" v-if="accountField.display && !accountField.hideOnRegister">
              <label for="account_number">{{ accountField.label }} (optional)</label>
              <input
                v-model="signUpForm.account_number"
                id="account_number"
                type="text"
                class="form-control">
              <small class="form-text text-muted">{{ accountField.help }}</small>
            </div>
            <template>
              <div class="form-group" :key="field.name" v-for="field in extraSignupFields">
                <label :for="field.name">{{ field.label }}</label>
                <input
                  :id="field.name"
                  v-model="signUpForm[field.name]"
                  :type="field.type"
                  class="form-control"
                  :required="field.required"
                  :placeholder="field.placeholder || ''">
              </div>
            </template>
            <template v-if="$store.state.businessDetails.custom_fields && $store.state.businessDetails.custom_fields.signup ">
              <custom-input-fields
                :customFields="$store.state.businessDetails.custom_fields.signup"
                :customInfo.sync="signUpForm.custom_info"
                :requiredStarShow=true
                innerClass="form-group"/>
            </template>
            <div class="form-group" v-if="$store.state.businessDetails.sms_notifications_enabled">
              <label for="receive-sms">Receive SMS Alerts</label>
              <b-form-checkbox v-model="signUpForm.receive_sms" id="receive-sms" switch>
                <b>{{ signUpForm.receive_sms ? 'Enabled' : 'Disabled' }}</b>
              </b-form-checkbox>
            </div>
            <div v-if="$store.state.hasTrueValueRewards" class="form-group">
              <label for="tvr_number">{{ $ezTVRName() }} Number</label>
              <input id="tvr_number" v-model="signUpForm.custom_info.tvr_number" type="text" class="form-control">
              <div class="mt-1 pb-4">
                <!-- open a modal to subscribe -->
                <a href="#" v-if="showTvrLink" @click.prevent="openTvrModal(false)" class="float-right">Forgot your rewards number?</a>
              </div>
              <div class="mt-1" v-if="showTvrLink">
                <div class="font-weight-bold">Not A Rewards Member?</div>
                <a href="#" @click.prevent="openTvrModal(true)">Sign Up for {{ $ezTVRName() }} now!</a>
              </div>
            </div>
            <b-alert
              :show="alert.show"
              :variant="alert.variant"
              dismissible
              @dismissed="alert.show = false">
              {{ alert.message }}
            </b-alert>
            <button class="btn btn-primary mb-3">
              Sign up
            </button>
            <p class="m-0">
              Already have an account?
              <router-link to="/login" class="text-primary">Log In</router-link>
            </p>
          </b-form>
        </div>
      </div>
    </div>

    <TrueValueRewardsModal v-if="$store.state.hasTrueValueRewards"
                           :tvr-data="signUpForm"
                           ref="tvrModal"
                           @signup="tvrSignup"></TrueValueRewardsModal>
  </div>
</template>

<script>
  import UserApiService from '@/api-services/user.service';
  import AuthApiService from '@/api-services/auth.service';
  import CartApiService from '@/api-services/cart.service';
  import AuthController from '@/controllers/auth.controller';
  import TrueValueRewardsModal from '@/components/modals/true-value-rewards';

  export default {
    name: 'SingUpPage',
    components: {
      TrueValueRewardsModal
    },
    data() {
      return {
        alert: {
          show: false,
          variant: 'success',
          message: 'Successfully registered! Please login.'
        },
        signUpForm: {
          first_name: '',
          last_name: '',
          telephone: '',
          company_name: '',
          email: '',
          password: '',
          account_number: '',
          passwordConfirm: '',
          receive_sms: true,
          custom_info: {},
        },
        message: '',
        extraSignupFields: [],
        showTvrLink: true,
      };
    },
    beforeMount() {
      const routeParams = this.$route.params;
      if (routeParams) {
        this.signUpForm.email = routeParams.email;
        this.signUpForm.telephone = routeParams.phone;
        this.message = routeParams.message;
      }
    },
    mounted() {
      this.$ezSetTitle('Sign Up');
      if ( this.$store.state.settings.signup && this.$store.state.settings.signup.extraFields ) {
        this.extraSignupFields = this.$store.state.settings.signup.extraFields;
      }
    },
    computed: {
      accountField() {
        const infoJson = this.$store.state.businessDetails.account_field_info;
        if ( !infoJson ) {
          return {display: false};
        }

        const info = JSON.parse(infoJson);
        info.label = info.label || 'Contractor Account Number';
        info.help = info.help || 'Enter your contractor account number if you have a registered account with this business.';
        info.hideOnRegister = info.hideOnRegister || false;
        return info;
      }
    },
    methods: {
      openTvrModal(signup) {
        this.$refs.tvrModal.showTvrModal(signup);
      },
      tvrSignup(number) {
        this.$set(this.signUpForm.custom_info, 'tvr_number', number);
        this.showTvrLink = false;
      },
      async tvrLookup() {
        const s = this.signUpForm;
        if ( this.$store.state.hasTrueValueRewards
          && s.last_name && s.last_name.length >= 2
          && s.email && s.email.length > 4
          && s.telephone && s.telephone.length === 10 ) {
          const result = await CartApiService.doTvrLookup({
            last_name: this.signUpForm.last_name,
            email: this.signUpForm.email,
            telephone: this.signUpForm.telephone
          });

          if (result.data.status === 'success') {
            this.$set(this.signUpForm.custom_info, 'tvr_number', result.data.tvr_number);
          }
        }
      },
      signUp() {
        if(this.signUpForm.password !== this.signUpForm.passwordConfirm) {
          this.alert.show = true;
          this.alert.variant = 'danger';
          this.alert.message = `Passwords don't match`;
          return;
        }

        if ( this.$store.state.hasTrueValueRewards && this.signUpForm.custom_info.tvr_number ) {
          // check TVR code if entered
          if ( !this.$ezCheckTVRCode(this.signUpForm.custom_info.tvr_number) ) {
            this.alert.show = true;
            this.alert.variant = 'danger';
            this.alert.message = "Please check your " + this.$ezTVRName() + " account number.";
            return;
          }
        }
        let phone = this.signUpForm.telephone;
          if(phone.startsWith('+1')) {
            this.signUpForm.telephone = phone.substring(2);
          }
        this.signUpForm.telephone = this.signUpForm.telephone.replace(/[^0-9]/g, '');

        UserApiService.register(this.signUpForm)
          .then((res) => {
            if(!res || res.data.status === 'error') {
              this.alert.show = true;
              this.alert.variant = 'danger';
              if ( res.data.message ) {
                this.alert.message = res.data.message;
              } else {
                this.alert.message = 'Error occurred during sign up. Please check the fields again';
              }
            } else if(res.data.status === 'success') {
              this.alert.show = true;
              this.alert.variant = 'success';
              this.alert.message = 'Successfully registered! You will be redirected shortly...';
              // setTimeout(() => this.$router.push({name: 'login'}), 2000).catch(err => console.log(err));
              AuthApiService.login({email: this.signUpForm.email}, {password: this.signUpForm.password}, this.$store.state.device_id)
                .then(response => {
                  if (response.data.status == "success") {
                    let data = response.data;
                    data.access_token = response.data.access_token;
                    this.$swal({
                      toast: true,
                      position: 'top',
                      showConfirmButton: false,
                      timer: 3000,
                      type: 'success',
                      title: 'Congratulations for registering!'
                    });
                    AuthController.login(data);
                    if(localStorage.getItem('redirectToCartAfterlogin')) {
                      localStorage.setItem('goToStep', 2);
                      localStorage.removeItem('redirectToCartAfterlogin');              
                      this.$router.push({ name: 'cart' }).catch(err => console.log(err));                
                    } else {
                      this.$router.push({name: 'index'}).catch(err => console.log(err));
                    }
                  }
                })
                .catch((error) => {
                  console.log('error while log in', error);
                  this.alert.show = true;
                  this.alert.variant = 'danger';
                  this.alert.message = 'Unsuccessful login. Please try again.';
                });
            }
          })
          .catch(error => {
            console.log('error while signing up', error);
            let errors = error.response.data.errors;
            let firstError = errors[Object.keys(errors)[0]];
            this.alert.show = true;
            this.alert.variant = 'danger';
            this.alert.message = 'Error: ' + firstError;
          });

      },
      onlyNumber ($event) {
        //console.log($event.keyCode); //keyCodes value
        let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
        if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
            $event.preventDefault();
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/auth.scss';
  .card-header.shrink {
    padding-top: 20px !important;
    padding-bottom: 10px !important;
  }
  .half {
    width: 50%;
    display: inline-block;
  }
  .alt-message {
    font-size: 13px;
    font-weight: normal;
  }
</style>
