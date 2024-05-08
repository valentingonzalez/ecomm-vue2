<template>
  <div v-if="$ezHasNoPermission('manage_ar_accounts')">
    <no-permission-truevalue page="A/R Account Billing"></no-permission-truevalue>
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <h1>A/R Account Billing</h1>
        <is-saved :param="saving" />
      </div>
    </div>
    <div class="settings-body">
      <div>
        <div>
          <p>
            Enable this option if you'd like to have your contractors purchase through your website
            and be billed to their A/R Account.
          </p>
          <p>
            Please remember, that when receiving an email about the transaction, we will include
            the A/R account number for you to update your POS system.
          </p>
        </div>

        <div class="pb-2 mt-4">
          Enable A/R Accounts
          <div class="custom-control custom-switch">
            <input type="checkbox" v-model="info.display" class="custom-control-input"
                  id="ar_accounts_display">
            <label
              class="custom-control-label"
              for="ar_accounts_display"
              v-html="info.display ? 'Enabled' : 'Disabled'">
            </label>
          </div>
        </div>

        <div class="pb-2 mt-4">
          Hide Field From Sign Up Page
          <div class="custom-control custom-switch">
            <input type="checkbox" v-model="info.hideOnRegister" class="custom-control-input"
                  id="ar_accounts_hide_on_registration">
            <label
              class="custom-control-label"
              for="ar_accounts_hide_on_registration"
              v-html="info.hideOnRegister ? 'Hidden' : 'Show'">
            </label>
          </div>
        </div>

        <div class="pb-2 mt-4">
          Hide From Prepare Order Screen
          <div class="custom-control custom-switch">
            <input type="checkbox" v-model="info.hideOnPrepareOrder" class="custom-control-input"
                  id="ar_accounts_hide_on_prepare_order">
            <label
              class="custom-control-label"
              for="ar_accounts_hide_on_prepare_order"
              v-html="info.hideOnPrepareOrder ? 'Hidden' : 'Show'">
            </label>
          </div>
        </div>

        <div class="pb-2 mt-4" v-if="info.display">
          Show Account Balance
          <div class="custom-control custom-switch">
            <input type="checkbox" v-model="info.showBalance" class="custom-control-input" id="ar_accounts_balance">
            <label class="custom-control-label" for="ar_accounts_balance" v-html="info.showBalance ? 'Enabled' : 'Disabled'"></label>
          </div>
        </div>

        <div class="pb-2 mt-4" v-if="info.display">
          <label class="label">Signup Form Label
            <i class="fa fa-question-circle" data-toggle="tooltip" data-placement="top" title="This is the label text displayed above the A/R account number field on the signup page."></i>
          </label>
          <input class="form-control" type="text" v-model="info.label" placeholder="" />
        </div>

        <div class="pb-2 mt-4" v-if="info.display">
          <label class="label">Signup Form Help Text
            <i class="fa fa-question-circle" data-toggle="tooltip" data-placement="top" title="This is the help text displayed under the A/R account number field."></i>
          </label>
          <input class="form-control" type="text" v-model="info.help" placeholder="" />
        </div>

        <div class="pb-2 mt-4">
          <button type="button" class="btn btn-primary" @click="saveData">Save</button>
        </div>

        <div class="pb-2 mt-4" v-if="info.display">
          <p><strong># of A/R Accounts: {{ count }}</strong></p>
          <p>To add more A/R accounts, please email an Excel file to
          <a href="mailto:kevin@ezadtv.com">kevin@ezadtv.com</a></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

  import AdminService from '@/api-services/admin.service';
  import NoPermissionTruevalue from "./no-permission-truevalue";

  export default {
    name: 'ARAccounts',
    components: {
      NoPermissionTruevalue
    },
    data() {
      return {
        info: {
          display: false,
          showBalance: false,
          hideOnRegister: false,
          hideOnPrepareOrder: false,
          label: 'Contractor Account Number',
          help: 'Enter your contractor account number if you have a registered account with this business.',
        },
        count: 0,
        saving: false
      };
    },
    async mounted() {
      if(this.$ezHasNoPermission('manage_ar_accounts')) return;

      const info = JSON.parse(this.$store.state.businessDetails.account_field_info || "{}");

      this.info.display = info.display || false;
      this.info.hideOnRegister = info.hideOnRegister || false;
      this.info.hideOnPrepareOrder = info.hideOnPrepareOrder || false;
      this.info.label = info.label || this.info.label;
      this.info.help = info.help || this.info.help;

      const res = await AdminService.countARAccounts();
      this.count = res.data.count;
    },
    methods: {
      async saveData() {
        this.saving = true;
        const res = await AdminService.saveAccountSettings(this.info);
        if ( res.data.status === 'success' ) {
          this.$swal("Success", 'Account settings saved!', "success");
        }
        this.saving = false;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .heading {
    height: 80px;
  }
  #socialInputs {
    input[type=text] {
      width: 100%;
    }
    .social-img {
      width: 100px;
      display: flex;
      justify-content: center;
      + .form-group {
        width: 290px;
      }
    }
  }
  .valid input {
    border-color: var(--secondary);
  }
  .form-group--error input {
    border-color: red;
  }
  @media (max-width: 500px) {
    #socialInputs {
      .social-img {
        width: 40px;
        display: none;
        img {
          width: 100%;
        }
      }
      .social-img + .form-group {
        flex: 1;
      }
    }
  }
</style>
