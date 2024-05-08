<template>
  <div>
    <b-form @submit.prevent="login">
      <template v-if="step === 1">
        <div class="form-group">
          <label for="number">Mobile Number</label>
          <input v-model="phone" id="number" type="tel" minlength="10" maxlength="12" @keypress="onlyNumber" class="phone-input form-control" placeholder="Enter your mobile number" :disabled="this.email != ''">
        </div>
        <div class="text-center">OR</div>
        <form @submit.prevent="nextStep">
          <div class="form-group">
            <label for="email">Email</label>
            <input v-model="email" id="email" type="email" class="email-input form-control" placeholder="Enter your email" :disabled="this.phone != ''">
          </div>
          <button type="submit" :disabled="!allowLogin" class="btn btn-primary w-100" :class="(errorMsg ? 'mb-3 mb-md-3' : 'mb-4 mb-md-5')">
            <div class="spinner-border spinner-border-sm" v-if="signingIn"></div>
            <span v-else>Next</span>
          </button>
          <span class="invalid-feedback d-block mb-3 mt-0 text-center" v-if="errorMsg"> {{ errorMsg }}</span>
        </form>
      </template>
      <div v-if="step === 2">
        <auth-with-phone v-if="phone && phone.length > 0" :phone.sync="phone" :code.sync="code" @resetStep="resetStep" />
        <auth-with-email v-else :email.sync="email" :password.sync="password" @resetStep="resetStep" />
        <button type="submit" class="btn btn-primary w-100 mb-2" :disabled="(this.password == '' && this.email == '') && (this.phone == '' && this.code == '') || signingIn">
          <div class="spinner-border spinner-border-sm" v-if="signingIn"></div>
          <span v-else>Sign In</span>
        </button>
        <div class="custom-control custom-checkbox my-4">
          <input id="cbRememberMe" type="checkbox" class="custom-control-input" v-model="loginKeep">
          <label class="custom-control-label" for="cbRememberMe">
            Keep me signed in
          </label>
        </div>
      </div>
      <template v-if="!simpleLayout">
        <hr>
        <p class="font-weight-normal">New to {{ $store.state.settings.businessName }}?</p>
        <router-link to="/register" class="btn btn-outline-primary w-100">
          Create a new account
        </router-link>
      </template>
      <template v-else-if="loginFromCart && step === 1">
        <div class="d-flex w-100 align-items-center justify-content-center" :class="minimizeMargins ? 'mb-0' : 'mb-4'">
          <a @click="register" class="text-primary font-weight-bold text-uppercase cursor-pointer text-decoration-none">
            Create a new account
          </a>
        </div> 
      </template>
    </b-form>
  </div>
</template>

<script>
  import AuthApiService from '@/api-services/auth.service';
  import AuthController from '@/controllers/auth.controller';

  export default {
    name: 'LoginForm',
    props: {
      simpleLayout: {
        type: Boolean,
        default: false
      },
      loginFromCart: {
        type: Boolean,
        default: false
      },
      minimizeMargins: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        step: 1,
        phone: '',
        email: '',
        password: '',
        code: '',
        loginKeep: false,
        signingIn: false,
        isMaster: false,
        errorMsg: '',
      };
    },
    computed: {
      allowLogin() {
        return this.checkEmailAndPhone();
      }
    },
    methods: {
      checkEmailAndPhone() {
        if (this.phone) {
          let phone = this.phone;
          if(phone.startsWith('+1')) {
            phone = phone.substring(2);
          }
          phone = phone.replace(/[^0-9]/g, '');
          if (phone && phone.length === 10) {
              return true;
          } else {
            this.errorMsg = 'Please enter a valid phone number.';
            return false;
          }
        } else if (this.email) {
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (this.email && this.email.length >= 6 && emailRegex.test(this.email)) {
            return true;
          } else {
            this.errorMsg = 'Please enter a valid email address.';
            return false;
          }
        }
        return false;
      },
      resetStep(){
        if(!this.email && !this.phone) {
          this.step = 1;
        } 
      },
      async nextStep() {
        try {
          let phone = this.phone;
          if(phone.startsWith('+1')) {
            this.phone = phone.substring(2);
          }
          this.phone = this.phone.replace(/[^0-9]/g, '');
          if (this.phone && this.phone.length === 10) {
            this.signingIn = true;
            const response = await AuthApiService.verifyEmailOrPhone({telephone: this.phone});
            if (response) {
              AuthApiService.sendOTP(this.phone);
              this.signingIn = false;
              this.step = 2;
            }
          } else if (this.email) {
            this.signingIn = true;
            const response = await AuthApiService.verifyEmailOrPhone({email: this.email});
            if (response) {
              if (response.data.master_login) {
                localStorage.setItem('master-login', 'true');
              }
              this.signingIn = false;
              this.step = 2;
            }
          }
        } catch (e) {
          this.signingIn = false;
          if(!this.simpleLayout)
            this.$router.push({name: 'register', params: { email: this.email, phone: this.phone }}).catch(err => console.log(err));
          else {
            this.signingIn = false;
             this.$swal( e && e.response && e.response.data && e.response.data.message ? e.response.data.message : 'Unsuccessful login. Please try again.', '', 'error');
          }
        }
      },
      async login() {
        if ( this.phone && this.phone.replace(/[^0-9]/g, '').length ) {
          if ( !this.code || !this.code.length ) {
            //this.$swal('Error', 'Please enter your verification code.', 'error');
            this.alert.show = true;
            this.alert.message = 'Please enter your verification code.';
            return;
          }
        }

        this.signingIn = true;
        await AuthApiService.login(
          {phone: this.phone.replace(/[^0-9]/g, ''), email: this.email},
          {code: this.code, password: this.password},
          this.$store.state.device_id
        ).then(response => {
          if(response.data.status === 'success') {
            this.signingIn = false;
            response.data.loginKeep = this.loginKeep;
            AuthController.login(response.data);
            this.$store.dispatch("fetchCartItemsDetails");
            if (response.data.is_admin) {
              if (this.$root.$children[0].initWizard) {
                this.$root.$children[0].$refs.wizardModal.startWizard();
              } else {
                let redirect = 'admin-orders';
                if ( this.$store.state.isBasicPlan ) {
                  redirect = 'admin-settings-about-us';
                }
                this.$router.push({name: redirect}).catch(err => console.log(err));
              }              
            } else {
              if(localStorage.getItem('pathToLoadAfterLogin')) {
                let redirect = localStorage.getItem('pathToLoadAfterLogin');
                localStorage.removeItem('pathToLoadAfterLogin');              
                this.$router.push(redirect);
              } else {
                this.$router.push({ name: 'cart' }).catch(err => console.log(err));                
              }
              setTimeout(function (){
                window.location.reload();
              }, 1000);
            }
          } else if(response.data.status === 'error') {
            this.signingIn = false;
            this.$swal(response.data.message, '', 'error');
          }
        }).catch(error => {
          this.signingIn = false;
          this.$swal(error.response.data.message, '', 'error');
          if(!this.loginFromCart) {
            window.location.reload();
          }
        });
        if(this.loginFromCart){
          localStorage.setItem('goToStep', 2);
          if(localStorage.getItem('cartStep')){
            localStorage.removeItem("cartStep");
          }
        }
        window.location.reload();
      },
      register(){
        this.$router.push({ name: 'register' }).catch(err => console.log(err));                
        localStorage.setItem('redirectToCartAfterlogin', true);
      },
      onlyNumber ($event) {
        //console.log($event.keyCode); //keyCodes value
        let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
        if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
            $event.preventDefault();
        }
      }
    },
    watch: {
      phone() {
        this.errorMsg = '';
        this.resetStep();
      },
      email() {
        this.errorMsg = '';
        this.resetStep();
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/auth.scss';
</style>
