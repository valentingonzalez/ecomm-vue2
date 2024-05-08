<template>
  <div>
    <div class="mb-4">
      <div class="row">
        <div class="col-lg-6 col-sm-12">
          <label>First Name</label>
          <input type="text" v-model="subAccount.first_name" class="form-control" placeholder="First Name" :class="{ 'is-invalid': errors.first_name }" />
          <div v-if="errors.first_name" class="invalid-feedback">
            {{ errors.first_name }}
          </div>
        </div>
        <div class="col-lg-6 col-sm-12 mt-2 mt-lg-0">
          <label>Last Name</label>
          <input type="text" v-model="subAccount.last_name" class="form-control" placeholder="Last Name" :class="{ 'is-invalid': errors.last_name }" />
          <div v-if="errors.last_name" class="invalid-feedback">
            {{ errors.last_name }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6 col-sm-12 mt-2 mt-lg-3">
          <label>Email</label>
          <input type="email" v-model="subAccount.email" class="form-control" placeholder="Email" :class="{ 'is-invalid': errors.email }" />
          <div v-if="errors.email" class="invalid-feedback">
            {{ errors.email }}
          </div>
        </div>
        <div class="col-lg-6 col-sm-12 mt-2 mt-lg-3">
          <label>Phone Number</label>
          <input type="tel" v-model="subAccount.mobile_number" class="form-control" placeholder="Phone Number" :class="{ 'is-invalid': errors.mobile_number }" autocomplete="off" />
          <div v-if="errors.mobile_number" class="invalid-feedback">
            {{ errors.mobile_number }}
          </div>
        </div>
      </div>
      <div class="row" v-if="!slug">
        <div class="col-lg-6 col-sm-12 mt-2 mt-lg-3">
          <label>Password</label>
          <input type="password" v-model="subAccount.password" class="form-control" placeholder="password" :class="{ 'is-invalid': errors.password }" />
          <div v-if="errors.password" class="invalid-feedback">
            {{ errors.password }}
          </div>
        </div>
        <div class="col-lg-6 col-sm-12 mt-2 mt-lg-3">
          <label>Confirm Password</label>
          <input type="password" v-model="subAccount.confirm_password" class="form-control" placeholder="Confirm Password" :class="{ 'is-invalid': errors.confirm_password }" />
          <div v-if="errors.confirm_password" class="invalid-feedback">
            {{ errors.confirm_password }}
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3" v-if="slug && isChangingPassword">
      <div class="col-lg-6 col-sm-12 mt-2">
        <label>New Password</label>
        <input type="password" v-model="password.new_password" class="form-control" placeholder="New Password" :class="{ 'is-invalid': errors.new_password }" />
        <div v-if="errors.new_password" class="invalid-feedback">
          {{ errors.new_password }}
        </div>
      </div>
      <div class="col-lg-6 col-sm-12 mt-2">
        <label>Confirm Password</label>
        <input type="password" v-model="password.confirm_password" class="form-control" placeholder="Confirm Password" :class="{ 'is-invalid': errors.confirm_password }" />
        <div v-if="errors.confirm_password" class="invalid-feedback">
          {{ errors.confirm_password }}
        </div>
      </div>
    </div>
    <div class="row mt-3" v-if="slug && !isChangingPassword">
      <div class="col-lg-6 col-sm-12">
        <label>Password</label>
        <div>
          <button class="btn btn-outline-primary" id="btn-change-password" @click="showChangePasswordFields">
            Change Password
          </button>
          <button v-if="isChangingPassword" class="btn btn-outline-primary" id="btn-change-password" @click="handleClickChangePassword">
            Change Password
          </button>
        </div>
      </div>
    </div>
    <div class="mt-3 mb-3">
      <button v-if="isChangingPassword" class="btn btn-outline-primary" id="btn-change-password" @click="handleClickChangePassword">
        Change Password
      </button>
    </div>

    <div class="my-3" v-if="$store.state.storeLocations.length > 1">
      <label>Associated Stores</label>
      <div class="row">
        <div v-for="store in $store.state.storeLocations" :key="store.id" class="col-lg-3 col-sm-6">
          <input :id="`${store.id}-checkbox`" :value="store.id" type="checkbox" v-model="subAccount.associated_locations" class="styled-checkbox" :disabled="disableLocations"/>
          <label :for="`${store.id}-checkbox`">{{ store.name }}</label>
        </div>
      </div>
    </div>

    <div>
      <label class="font-weight-bold">Permissions</label>
      <div class="main-settings-container mb-3">
        <span class="text-muted font-weight-bold text-uppercase text-tiny" style="letter-spacing: .5px;">Main Settings</span>
        <div class="row">
          <template v-for="(value, key) in permissions.main_settings">
            <PermissionItem
              :key="`main-setting${key}`"
              :name="value"
              :isEnabled="getValueOfPermissionSetting(key)"
              :enable="setEnabled(key)"
              :class="{'col-lg-12' : key == 'admin_account'}"
              :disableAction="permissionSettingsEnabled.includes('admin_account') && key != 'admin_account'"
            />
            <div v-if="key == 'admin_account'" :key="`text-${key}`" class="col-12 mt-2">
              <b-alert variant="warning" show>
                <b>If above permission is enabled, all permissions below will automatically be enabled, except notification settings.</b>
              </b-alert>
            </div>
          </template>
        </div>
      </div>
      <div class="website-settings-container pt-2 mb-3">
        <span class="text-muted font-weight-bold text-uppercase text-tiny" style="letter-spacing: .5px;">Website Settings</span>
        <div class="row">
          <PermissionItem
            v-for="(value, key) in permissions.website_settings"
            :key="`website-setting${key}`"
            :name="value"
            :isEnabled="getValueOfPermissionSetting(key)"
            :enable="setEnabled(key)"
            :disableAction="permissionSettingsEnabled.includes('admin_account') && key != 'admin_account'"
          />
        </div>
      </div>
      <div class="website-settings-container pt-2 mb-3">
        <span class="text-muted font-weight-bold text-uppercase text-tiny" style="letter-spacing: .5px;">Notification Settings</span>
        <div class="row">
          <PermissionItem
            v-for="(value, key) in permissions.notification_settings"
            :key="`notification_setting${key}`"
            :name="value"
            :isEnabled="getValueOfPermissionSetting(key)"
            :enable="setEnabled(key)"
          />
        </div>

        <div class="alert alert-info mt-3">
          <b>{{ $store.state.businessDetails.business_name }}</b> has designated you on their employee ecommerce dashboard. 
          You will receive text messages regarding order and website updates. Messages may apply. 
          Text STOP to cancel. Message Frequency Varies. You can check out our terms of service by visiting:
          <a href="https://ezadtv.com/ecommerce/terms" target="_blank">https://ezadtv.com/ecommerce/terms</a>
          & our Privacy Policy 
          <a href="https://ezadtv.com/ecommerce/policy" target="_blank">https://ezadtv.com/ecommerce/policy</a>. For Help call 
          <a href="tel:888-580-5593">tel:888-580-5593</a> ext 4
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
import Axios from 'axios';
import PermissionItem from "@/components/admin/subaccounts/permission-item";
import AdminService from "@/api-services/admin.service";
import EZAxios from '@/ezaxios';

const INVALID_FEEDBACKS = {
  FIRST_NAME: "Please Enter First Name",
  LAST_NAME: "Please Enter Last Name",
  PASSWORD: "Invalid Password",
  CONFIRM_PASSWORD: "New Password Doesn't Match",
  EMAIL: "Invalid Email",
  MOBILE_NUMBER: "Please Enter Phone Number",
  NEW_PASSWORD: "Please Enter New Password"
};

const isValidEmail = email =>
/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
  String(email).toLowerCase()
);

export default {
  name: "SubAccount",
  components: {
    PermissionItem
  },
  data() {
    return {
      subAccount: {
        first_name: '',
        last_name: '',
        email: '',
        mobile_number: '',
        associated_locations: [],
        permissions: []
      },
      password: {
        new_password: '',
        confirm_password: ''
      },
      permissions: {
        main_settings: [],
        website_settings: [],
        notification_settings: []
      },
      permissionSettingsEnabled: [],
      isChangingPassword: false,
      errors: {},
      disableLocations: false
    };
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
    isTruevalue() {
      return this.$root.$children[0].isTruevalue;
    }
  },
  async created() {
    const responsePermissions = await EZAxios.get(`sub-accounts/permissions`);
    if(this.slug) {
      const responseSubAccounts = await Axios.get(`sub-accounts?slug=${this.slug}`);
      this.subAccount = responseSubAccounts.data['sub-accounts'][0];
    }
    this.permissions = {...responsePermissions.data.data};
    if(this.isTruevalue){
      delete this.permissions.main_settings['view_invoices'];
    }
    this.permissions.main_settings = Object.entries(this.permissions.main_settings)
    .sort((a,b) => a[0] === 'admin_account' ? -1 : b[0] === 'admin_account' ? 1 : 0)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    this.permissionSettingsEnabled = this.subAccount.permissions;
    //Make phone number optional for Hills Flat Lumber
    if(this.$store.state.currentStore && [2300,3307].includes(this.$store.state.currentStore.id)) {
      delete INVALID_FEEDBACKS.MOBILE_NUMBER;
    }
  },
  methods: {
    showChangePasswordFields() {
      this.isChangingPassword = true;
    },
    async handleClickChangePassword() {
      //--------validation of inputs---------------------
      if (this.password.new_password === '') {
        this.setError('new_password', INVALID_FEEDBACKS.NEW_PASSWORD);
        return;
      } else {
        this.clearError('new_password');
      }

      if (this.password.new_password !== this.password.confirm_password) {
        this.errors = { ...this.errors, confirm_password: INVALID_FEEDBACKS.CONFIRM_PASSWORD };
        this.confirmPassword = "";

        return;
      } else {
        this.clearError("confirmPassword");
      }
      let data = {
        slug: this.slug,
        oldPassword: this.password.old,
        newPassword: this.password.new_password
      };
      await AdminService.changeSubAccountPassword(data).then(
        res => {
          if (res.data.status === 'success') {
            this.$swal(res.data.message, '', 'success');
            this.isChangingPassword = false;
          } else {
            this.$swal('Something went wrong while changing password.', '', 'error');
          }
        }
      ).catch(res => {
        if (res.response.data.status === "error" || res.response.data.errors) {
          let errorMessages = "";
          Object.keys(res.response.data.errors).forEach(key => {
            errorMessages += res.response.data.errors[key][0] + "<br/>";
          });
          this.$swal(res.response.data.message, errorMessages, 'error');
        } else {
          this.$swal('Something went wrong while changing password.', '', 'error');
        }
      });
      this.clearError('confirm_password');
      this.clearError('new_password');
      this.password.new_password = '';
      this.password.confirm_password = '';
    },
    getValueOfPermissionSetting(key) {
      return this.permissionSettingsEnabled.includes(key);
    },
    setEnabled(key) {
      return () => {
        if (this.permissionSettingsEnabled.includes(key)) {
          this.permissionSettingsEnabled = this.permissionSettingsEnabled.filter(e => e !== key);
          if(key === 'admin_account') {
            Object.keys(this.permissions.main_settings).forEach(e => this.permissionSettingsEnabled = this.permissionSettingsEnabled.filter(i => i != e));
            Object.keys(this.permissions.website_settings).forEach(e => this.permissionSettingsEnabled = this.permissionSettingsEnabled.filter(i => i != e));
          }
        } else {
          this.permissionSettingsEnabled = [...this.permissionSettingsEnabled, key];
          if(key === 'admin_account') {
            this.permissionSettingsEnabled = [...this.permissionSettingsEnabled, ...Object.keys(this.permissions.main_settings), ...Object.keys(this.permissions.website_settings)];            
          }
        }        
      };
    },
    async saveAccount() {
      let errors = false;
      Object.keys(this.subAccount).forEach(e => {
        if(!this.subAccount[e] && Object.keys(INVALID_FEEDBACKS).indexOf(e.toUpperCase()) > -1) {
          errors = true;
          this.setError(e, INVALID_FEEDBACKS[e.toUpperCase()]);
        } else {
          this.clearError(e);
        }
      });
      if(errors) return;
      if (!isValidEmail(this.subAccount.email)) {
        this.setError('email', INVALID_FEEDBACKS.EMAIL);
        return;
      }
      let data = {
        first_name: this.subAccount.first_name,
        last_name: this.subAccount.last_name,
        email: this.subAccount.email,
        mobile_number: this.subAccount.mobile_number.replace(/\D/g, ""),
        password: this.slug ? '' : this.subAccount.password,
        associated_locations: [...this.subAccount.associated_locations] || [],
        permissions: this.permissionSettingsEnabled
      };
      if(this.slug) {
        data.slug = this.slug;
        if(data.permissions.includes('edit_carousel_ads'))
          data.permissions.splice(data.permissions.indexOf('edit_carousel_ads'), 1);
        if(data.permissions.includes('new_order_email'))
          data.permissions.splice(data.permissions.indexOf('new_order_email'), 1);
        if(data.permissions.includes('new_order_text'))
          data.permissions.splice(data.permissions.indexOf('new_order_text'), 1);
      }
      if(!data.slug) {
        if(this.subAccount.password !== this.subAccount.confirm_password) {
          this.errors = { ...this.errors, confirm_password: INVALID_FEEDBACKS.CONFIRM_PASSWORD };
          return;
        } else {
          this.clearError('confirm_password');
          data.password = this.subAccount.password;
        }
      }

      this.loading = true;
      this.$parent.loading = true;
      if(data.slug) {
        AdminService.updateSubAccount(data).then(res => this.handleResponse(res, 'updated')).catch(err => this.handleError(err));
      } else {
        AdminService.createSubAccount(data).then(res => this.handleResponse(res, 'created')).catch(err => this.handleError(err));
      }
    },
    handleResponse(res, str) {
      if (res.data.status === 'success') {
        this.$swal('Account Saved!', 'The sub account has been ' + str + '.', 'success');
      }
      else if (res.data.status === 'error') {
        let errorMessages = '';
        Object.keys(res.data.errors).forEach(key => errorMessages += `${res.data.errors[key][0]}<br>`);
        this.$swal(res.data.message, errorMessages, 'error');
      }
      else {
        this.$swal('Something went wrong while updating the sub account.', '', 'error');
      }
      this.loading = false;
      this.$parent.loading = false;
    },
    handleError(err) {
      let errors = err.response.data.errors;
      Object.keys(errors).forEach(e => {
        this.setError(e, errors[e][0]);
      });
      if(errors.permissions) {
        this.$swal('You have to add at least one permission', '', 'error');
      }
      this.loading = false;
      this.$parent.loading = false;
    },
    clearError(key) {
      this.errors = { ...this.errors, [key]: null };
    },
    setError(key, value) {
      this.errors = { ...this.errors, [key]: value };
    }
  },
  watch: {
    permissionSettingsEnabled(val) {
      // if brinkmanss
      if(val.includes('admin_account') && this.$store.state.currentStore && [1430, 5205, 5206, 5207, 7529].includes(this.$store.state.currentStore.id)) {
        this.disableLocations = true;
        this.subAccount.associated_locations = this.$store.state.storeLocations.map(e => e.id);
      } else {
        this.disableLocations = false;
      }
    }      
  }
};
</script>
