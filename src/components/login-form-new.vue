<template>
  <div>
    <b-form @submit.prevent="login">         
      <div class="row">        
        <div class="form-group col-12 col-md-6" :class="{'mb-2' : errorMsg}">
          <label for="number">Email / Mobile Number</label>
          <input v-model="emailPhone" id="emailPhone" @change="nextStep" type="text" class="phone-input form-control" placeholder="Enter your Email or Mobile">
            <span class="invalid-feedback d-block mb-2 mt-0 text-md-nowrap" v-if="errorMsg"> 
                {{ errorMsg }}
                <a @click="register" v-if="errorMsg.endsWith('is not associated to an account.')" class="font-weight-bold cursor-pointer">Sign Up</a>  
            </span>
        </div>
        <div v-if="step === 1" class="form-group col-12 col-md-6 mb-3 mb-md-1">
          <label for="number">Password</label>
          <input class="phone-input form-control" placeholder="Enter your password" disabled>
        </div>
        <div class="col-12 col-md-6">
            <auth-with-phone v-if="step === 2 && phone.length === 10" :newDesign="true" :phone.sync="phone" :code.sync="code" />
            <auth-with-email v-else-if="step === 2" :email.sync="email" :newDesign="true" :password.sync="password" />                
        </div>
        <div v-if="email && step === 2" class="col-12 d-flex w-100 align-items-center mb-3">
            <span class="cursor-pointer mr-2 mr-md-1" v-b-tooltip.hover title='A one-time login link is a link sent to your inbox that automatically logs you into your account without entering your password. How cool is that? :)'>
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M8 0.261963C3.57841 0.261963 0 3.83996 0 8.26196C0 12.6835 3.578 16.262 8 16.262C12.4216 16.262 16 12.684 16 8.26196C16 3.84043 12.422 0.261963 8 0.261963ZM8.82153 11.4376C8.82153 11.6904 8.45297 11.9431 8.00016 11.9431C7.52628 11.9431 7.18934 11.6904 7.18934 11.4376V7.42553C7.18934 7.13068 7.52631 6.93056 8.00016 6.93056C8.45297 6.93056 8.82153 7.13068 8.82153 7.42553V11.4376ZM8.00019 5.96184C7.51578 5.96184 7.13672 5.60381 7.13672 5.20362C7.13672 4.80346 7.51581 4.45596 8.00019 4.45596C8.47406 4.45596 8.85319 4.80346 8.85319 5.20362C8.85319 5.60381 8.47403 5.96184 8.00019 5.96184Z" fill="#F59E0B"/>
                </svg>
            </span>
            <p class="float-right m-0">
                Can't sign in? Get 
                <a @click="prepareMagicLink" class="text-blue cursor-pointer">
                    a one-time login link
                </a>
                in your email to log into your account!
            </p>
        </div>
        <div class="col-12 col-md-8"></div>        
        <div class="col-12 col-md-4">
            <button type="submit" class="btn btn-primary pull-right mb-2" :disabled="(this.password == '' && this.email == '') && (this.phone == '' && this.code == '') || signingIn">
                <div class="spinner-border spinner-border-sm" v-if="signingIn"></div>
                <span v-else>Login</span>
            </button>
        </div>        
      </div>      
    </b-form>
  </div>
</template>

<script>
  import AuthApiService from '@/api-services/auth.service';
  import AuthController from '@/controllers/auth.controller';

  export default {
    name: 'NewLoginForm',
    props: {
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
        emailPhone: '',
        phone: '',
        email: '',
        password: '',
        code: '',
        loginKeep: false,
        signingIn: false,
        isMaster: false,
        errorMsg: ''
      };
    },
    computed: {
      allowLogin() {
        if (this.phone) {
          const phone = this.phone.replace(/[^0-9]/g, '');
          if (phone && phone.length === 10) return true;
        } else if (this.email) {
          if (this.email && this.email.length >= 6) return true;
        }
        return false;
      }
    },
    methods: {
        checkEmailOrPhoneNumber(input) {
            // Regular expression for email validation
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Regular expression for phone number validation (supports various formats)
            var phoneRegex = /^\+?(\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
            if(input.substring(0, 2) == '+1') {
                input = input.substring(2);
            }
            if (emailRegex.test(input)) {
                return "Email";
            } else if (phoneRegex.test(input)) {
                return "Phone";
            } else {
                return "Invalid";
            }
        },
        async nextStep() {
            this.errorMsg = '';
            try {
                let res = this.checkEmailOrPhoneNumber(this.emailPhone);
                if(res != "Invalid") {
                    if (res == "Email") {
                        this.email = this.emailPhone;
                    } else if (res == "Phone") {
                        this.phone = this.emailPhone;
                    }
                } else {
                    this.errorMsg = 'Please enter a valid Email / Mobile Number (000 000 0000) / (abc@xyz.com)';
                    return;
                }

                this.errorMsg = '';
                if(this.phone && this.phone.length > 2 && this.phone.substring(0, 2) == '+1') {
                    this.phone = this.phone.substring(2);
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
                if(e && e.response && e.response.data && e.response.data.message ) {
                    this.errorMsg = e.response.data.message;
                } else {
                    this.$swal('Unsuccessful login. Please try again.', '', 'error');
                }
            }
        },
        async login() {
            if(!this.phone && !this.email) {
                this.errorMsg = 'Please enter a valid Email / Mobile Number (000 000 0000) / (abc@xyz.com)';
                return;
            }
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
            let params = {};
            if(this.email){
                params.email = this.email;
            }
            if(this.phone){
                params.phone = this.phone;
            }
            this.$router.push({ name: 'register', params: params }).catch(err => console.log(err));                
            localStorage.setItem('redirectToCartAfterlogin', true);
        },
        prepareMagicLink() {
            this.errorMsg = '';
            let res = this.checkEmailOrPhoneNumber(this.emailPhone);
            if(res == "Invalid" || res != "Email") {                
                this.errorMsg = 'Please provide a valid email address.';
                return;
            }
            // rechecking email in case it is changed in this component email input
            AuthApiService.verifyEmailOrPhone({ email: this.emailPhone }).then(response => {
                if(response.data.status == 'success') {
                AuthApiService.generateMagicLink(this.emailPhone).then(() => {
                    this.errorMsg = '';
                    this.$swal(`One-time login link sent to ${this.emailPhone} . Please close this tab and check your inbox!`, '', 'success');
                });
                }
            }).catch(error => {
                this.errorMsg = error.response.status === 422 ? 'Please provide a valid email address.' : error.response.data.message;
                this.$swal(this.errorMsg, '', 'error');
            });
        },
    },
    watch: {
        emailPhone() {
            this.step = 1;
            this.phone = '';
            this.email = '';
        }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/auth.scss';

  @media (min-width: 769px) {
    .text-md-nowrap{
        white-space: nowrap;
    }
  }  
</style>
