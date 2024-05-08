<template>
  <div>
    <div class="d-flex align-items-start justify-content-between flex-column flex-md-row">
      <div class="d-flex flex-column order-2 order-md-1 mb-2 mb-md-0">
        <h6 class="card-title font-weight-bold">
          Contact Information      
          <button v-if="reviewInfo" @click="$parent.goToStep(2)" class="btn btn-sm btn-primary p-1 text-tiny h-auto ml-2">Edit</button>
        </h6>
        <div class="" v-if="!reviewInfo && !loggedInUser && isGuestCheckout && showOptInForRegister">
          <div class="custom-control custom-checkbox">
            <input type="checkbox" v-model="allowForRegister" class="custom-control-input" id="optInForRegister" >
            <label class="custom-control-label" for="optInForRegister">Save my details for future</label>
          </div>        
        </div>
      </div>      
    </div>             
    <div class="row" :class="{'flex-column' : reviewInfo}">      
      <div :class="reviewInfo ? 'd-flex col-12 mb-2 align-items-center reviewInfo' : 'col-sm-6 col-lg-6 mb-3'">
        <label for="memberInfo-first-name" :class="{'w-150px': reviewInfo}">First Name</label>
        <div v-if="memberInfo && (reviewInfo || loggedInUser) && memberInfo.first_name && !editFirst">
          {{ memberInfo.first_name }}
          <i @click="editFirst = true" v-if="(!reviewInfo)" style="color: #4285F4;cursor: pointer" class="fa fa-pencil ml-2"></i>
        </div>
        <input v-else :disabled="isDisabled" id="memberInfo-first-name" @change="clearError('first_name')" placeholder="First Name" v-model="memberInfo.first_name" type="text" class="form-control p-2" :class="{'is-invalid':errors.first_name}">
        <div v-if="errors.first_name" class="invalid-feedback">
          {{errors['first_name'][0] | parseResponse}}
        </div>
      </div>
      <div :class="reviewInfo ? 'd-flex col-12 mb-2 align-items-center reviewInfo' : 'col-sm-6 col-lg-6 mb-3'">
        <label for="memberInfo-last-name" :class="{'w-150px': reviewInfo}">Last Name</label>
        <div v-if="memberInfo && (reviewInfo || loggedInUser) && memberInfo.last_name && !editLast">
          {{ memberInfo.last_name }}
          <i @click="editLast = true" v-if="(!reviewInfo)" style="color: #4285F4;cursor: pointer" class="fa fa-pencil ml-2"></i>
        </div>
        <input v-else :disabled="isDisabled" id="memberInfo-last-name" @change="clearError('last_name')" v-model="memberInfo.last_name" type="text" placeholder="Last Name" class="form-control p-2"
        :class="{'is-invalid':errors.last_name}">
        <div v-if="errors.last_name" class="invalid-feedback" :inner-html.prop="errors.last_name[0] | parseResponse"></div>
      </div>
      <div :class="reviewInfo ? 'd-flex col-12 mb-2 align-items-center reviewInfo' : 'col-sm-6 col-lg-6 mb-3'">
        <label for="memberInfo-phone-number" :class="{'w-150px': reviewInfo}">Phone Number</label>
        <div v-if="memberInfo && (reviewInfo || loggedInUser) && memberInfo.telephone && !editTelephone">
          {{ memberInfo.telephone }}
          <i @click="editTelephone = true" v-if="(!reviewInfo)" style="color: #4285F4;cursor: pointer" class="fa fa-pencil ml-2"></i>
        </div>
        <input v-else :disabled="isDisabled" id="memberInfo-phone-number"  @change="clearError('telephone')" @blur="validateMemberInfo" @keypress="onlyNumber" v-model="memberInfo.telephone" type="tel" placeholder="Phone Number" class="form-control p-2"
        :class="{'is-invalid':errors.telephone}">
        <div v-if="errors.telephone" class="invalid-feedback">
          <span v-if="checkValidationMsg(errors.telephone[0])">
            The phone number you entered is already associated with another account. Please <a class="text-underline font-weight-bold cursor-pointer" @click="$parent.$refs.loginModal.show()">Login</a> to your existing account.
          </span> 
          <span v-else> {{ errors.telephone[0] }} </span>
        </div>
      </div>
      <div :class="reviewInfo ? 'd-flex col-12 align-items-center reviewInfo' : 'col-sm-6 col-lg-6 mb-3'">
        <label for="memberInfo-email" :class="{'w-150px': reviewInfo}">Email</label>
        <div v-if="memberInfo && (reviewInfo || loggedInUser) && memberInfo.email && !editEmail">
          {{ memberInfo.email }}
          <i @click="editEmail = true" v-if="(!reviewInfo)" style="color: #4285F4;cursor: pointer" class="fa fa-pencil ml-2"></i>
        </div>
        <input v-else :disabled="isDisabled" id="memberInfo-email" @change="clearError('email')" @blur="validateMemberInfo" v-model="memberInfo.email" type="email" placeholder="Email" class="form-control p-2" :class="{'is-invalid':errors.email}">
        <div v-if="errors.email" class="invalid-feedback">
          <span v-if="checkValidationMsg(errors.email[0])">
            The email address you entered is already associated with another account. Please <a class="text-underline font-weight-bold cursor-pointer" @click="$parent.$refs.loginModal.show()">Login</a> to your existing account.
          </span> 
          <span v-else> {{ errors.email[0] }} </span>
        </div>
      </div>
      <div v-if="reviewInfo && editMode" class="d-flex col-8 mb-2 align-items-center reviewInfo">
        <button @click="saveInfo" class="btn btn-primary btn-sm">Save</button>
      </div>
      <div class="col-12 col-md-6 d-flex flex-column mb-2 mb-md-0" v-if="!reviewInfo && $store.state.businessDetails.sms_notifications_enabled">
        <label><strong>SMS Updates</strong></label>
        <div class="flex-grow-1 d-flex align-items-end">
          <div class="custom-control custom-switch">
            <input type="checkbox" v-model="memberInfo.receive_sms" class="custom-control-input" id="receive-sms">
            <label
              class="custom-control-label"
              for="receive-sms"
              v-html="memberInfo.receive_sms ? 'Enabled' : 'Disabled'">
            </label>
          </div>
        </div>
      </div>
      <!-- 5/20 removing for now per truevalue spreadsheet -->
      <div class="col-12 col-md-6" v-if="!reviewInfo && !isTruevalue">
        <label><strong>Receive Marketing Emails</strong><small class="small"> Don't miss our great deals!</small></label>
        <div class="custom-control custom-switch">
          <input type="checkbox" v-model="memberInfo.receive_marketing" class="custom-control-input" id="receive-marketing" @change="enableMarketingEmails">
          <label class="custom-control-label" for="receive-marketing" v-html="memberInfo.receive_marketing ? 'Enabled' : 'Disabled'"></label>
        </div>
      </div>
    </div>
    <template v-if="!reviewInfo && !userInfo">        
      <div v-if="!isGuestCheckout || (isGuestCheckout && optInForRegister)" class="row">
        <div class="col-sm-6 my-3">
          <label for="memberInfo-password">Password</label>
          <input :disabled="isDisabled" id="memberInfo-password" v-model="memberInfo.password" ref="password" type="password" placeholder="Password" class="form-control p-2" :class="{'is-invalid':errors.password}">
          <div v-if="errors.password" class="invalid-feedback">
            {{errors.password[0] | parseResponse}}
          </div>
        </div>
        <div class="col-sm-6 my-3">
          <label for="memberInfo-confirm-password">Confirm Password</label>
          <input v-model="memberInfo.confirmPassword" id="memberInfo-confirm-password" :disabled="isDisabled" ref="c_password" type="password" placeholder="Confirm Password" class="form-control p-2" :class="{'is-invalid': errors.c_password}">
          <div v-if="errors.c_password" class="invalid-feedback">
            {{errors.c_password[0] | parseResponse}}
          </div>
        </div>
        <div class="col-sm-6 col-lg-12 mb-3" v-if="accountField.display">
          <label for="account_number">{{ accountField.label }} (optional)</label>
          <input
            v-model="memberInfo.account_number"
            id="account_number"
            type="text"
            class="form-control">
          <small class="form-text text-muted">{{ accountField.help }}</small>
        </div>

          <template v-if="$store.state.businessDetails.custom_fields && $store.state.businessDetails.custom_fields.signup ">
              <custom-input-fields
                      :customFields="$store.state.businessDetails.custom_fields.signup"
                      :customInfo.sync="memberInfo.custom_info"
                      outerClass="w-100"
                      innerClass="col-sm-6 col-lg-12 mb-3"/>
          </template>

      </div>
      <div class="success-msg mt-3" v-if="registerSuccess">
        <img src="/images/check.png" class="img-fluid mr-2" alt="Account Created!" />Success! Your account has been created. You can now enter your Member Contact Info.
      </div>
      <b-alert
        class="mt-2"
        :show="alert.show"
        :variant="alert.variant"
        dismissible
        @dismissed="alert.show = false">
        {{ alert.message }}
      </b-alert>           
    </template>
  </div>
</template>

<script>
  import UserApiService from '../../api-services/user.service';
  import AuthApiService from '@/api-services/auth.service';
  import AuthController from '@/controllers/auth.controller';

  export default {
    name: 'cartMember',
    data() {
      return {
        loading: false,
        displayNewAccountSection: false,
        registerSuccess: false,
        editTelephone: false,
        editEmail:false,
        editLast: false,
        editFirst: false,
        allowForRegister: false,        
        memberInfo: {
          first_name: '',
          last_name: '',
          telephone: '',
          email: '',
          password: '',
          confirmPassword: '',
          account_number: '',
          receive_sms: true,
          receive_marketing: null,
          custom_info: {},

        },
        alert: {
          show: false,
          variant: 'success',
          message: 'Successfully registered! Please login.'
        },
        userInfo: AuthController.checkAuthStatus(),
        errors: {}
      };
    },
    props: {
      reviewInfo: {
        type: Boolean,
        default: false
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      isGuestCheckout: {
        type: Boolean,
        default: false
      },
      optInForRegister: {
        type: Boolean,
        default: false
      },
      showOptInForRegister: {
        type: Boolean,
        default: false
      },
      loggedInUser: null,
      memberInfoProp: null
    },
    filters: {
      parseResponse(val) {        
        return val;
      }
    },
    mounted() {
      if(this.memberInfoProp){
        this.memberInfo = this.memberInfoProp;
      }
      this.allowForRegister = this.optInForRegister;
    },
    watch: {
      allowForRegister: {
        handler(value) {
          this.$emit('allowForRegister', value);
        }
      },
      memberInfo: {
        deep: true,
        handler(value) {
          localStorage.setItem("memberInfo",JSON.stringify(value));
          this.$emit('memberInfoChanged', value);
        }
      }
    },
    computed: {
      editMode(){
        return this.editTelephone || this.editEmail || this.editLast || this.editFirst;
      },
      isTruevalue() {
        return this.$root.$children[0].isTruevalue;
      },
      accountField() {
        const infoJson = this.$store.state.businessDetails.account_field_info;
        if(!infoJson) {
          return { display: false };
        }
        const info = JSON.parse(infoJson);
        info.label = info.label || 'Contractor Account Number';
        info.help = info.help || 'Enter your contractor account number if you have a registered account with this business.';
        return info;
      }
    },
    methods: {
      checkValidationMsg(msg){
        if(msg.includes('log into')){
          return 'showDuplicateMsgWithLoginLink';
        }
      },
      validateMemberInfo(){
        this.$parent.validateMemberInfo();
      },
      saveInfo(){
        this.editTelephone = false;
        this.editEmail = false;
        this.editLast = false;
        this.editFirst = false;
      },
      clearError(index){
        delete this.errors[index];
      },
      async createAccount() {
        if(this.memberInfo.confirmPassword !== this.memberInfo.password) {
          this.errors = {"c_password":["Password doesn't match"]};
          return;
        }
        this.memberInfo.telephone = this.memberInfo.telephone.replace(/[^0-9]/g, '');
        this.memberInfo.device_id = this.$store.state.device_id;
        this.loading = true;
        UserApiService.register(this.memberInfo).then(res => {
            if(!res || res.data.status === 'error') {
              this.loading = false;
              this.alert.show = true;
              this.alert.variant = 'danger';
              if(res.data.message) {
                this.alert.message = res.data.message;
              } else {
                this.alert.message = 'Error occurred during sign up. Please check the fields again';
              }
            } else if(res.data.status === 'success') {
              AuthApiService.login({email: this.memberInfo.email}, {password: this.memberInfo.password}, this.$store.state.device_id).then(response => {
                  this.loading = false;
                  if(response.data.status == "success") {
                    let data = response.data;
                    data.access_token = response.data.access_token;
                    this.$swal({
                      toast: true,
                      position: 'top',
                      showConfirmButton: false,
                      timer: 3000,
                      type: 'success',
                      title: 'Thank you for registering!'
                    });
                    AuthController.login(data);
                    this.userInfo = AuthController.checkAuthStatus();
                    this.$emit('loggedIn', this.userInfo);
                  }
                });
            }
          }, err => {
            this.loading = false;
            this.showErrors(err.response.data.errors);
          });
      },
      clearFields() {
        this.memberInfo = {
            first_name: '',
            last_name: '',
            telephone: '',
            email: '',
            password: '',
            account_number: '',
            receive_sms: false,
            receive_marketing: false
        };
      },
      showErrors(fields) {
        // this.$swal(fields[Object.keys(fields)[0]][0], '', 'error');
        this.errors = fields;
      },
      async enableMarketingEmails() {
        if(this.loggedInUser) {
          var data = {
            receive_marketing: this.memberInfo.receive_marketing == true ? 1 : 0
          };
          var user = this.$store.state.activeUser;
          user.data.customer.receive_marketing = this.memberInfo.receive_marketing;
          this.$store.commit('setActiveUser', user);
          await UserApiService.setMarketingEmails(data);
        }
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

<style scoped lang="scss">
  :deep(label) {
    font-size: 14px !important;
  }
  .w-150px{
    width: 150px;
  }
  .reviewInfo{
    .form-control{
      height: 31px;
      width: auto;
    }
  }
</style>
