<template>
  <div v-if="$ezHasNoPermission('transactional_emails')">
    <no-permission-truevalue page="Transactional Emails"></no-permission-truevalue>
  </div>
  <div class="bg-white  h-100" v-else>
    <div v-if="currentPage === PAGES.MAIN">
      <div
        class="px-4 d-flex pt-4 pb-3 mb-3 border-bottom justify-content-between align-items-center heading"
        >
        <div>
            <h1 class="h4 mb-0">Transactional Emails</h1>
                <a @click="$refs.tutorialModal.show()" class="btn btn-tutorial btn-sm text-small bg-white btn-action mt-3">
                      <i class="fa fa-play mr-1"></i>
                      Click to Watch Tutorial Video
                    </a>
        </div>
        <b-modal size="lg" ref="tutorialModal">
          <div slot="modal-header">
            <h5>Transactional Emails</h5>
          </div>
          <div>
            <video class="w-100" poster="/images/cover-transactional-emails.png" controls>
              <source src="https://storage.googleapis.com/content.ezadtv.com/2024/01/09/659d9cc5cf510_Transactional_Emails.mov" type="video/mp4">
            </video>
          </div>
          <div slot="modal-footer">
            <button type="button" class="btn btn-primary" @click="$refs.tutorialModal.hide()">Done</button>
          </div>
        </b-modal>
        <div>
          <b-form-select
            v-if="storeLocations.length > 1"
            v-model="selectedStore"
            :options="storeLocations"
            value-field="business_id"
            text-field="name"
            @change="storeChanged"/>
        </div>
      </div>

      <div class="px-4 pb-2 mt-4">
        <div class="row">
          <div class="col-md-12">
            <b>New Order Emails</b>
          </div>
          <div class="col-md-12">
            <div class="email-input">
                  <div v-for="(email, i) in emailSettings.newOrderEmails" :key="i + '-email-'" class="email">
                    <span>{{ email }}</span>
                    <button @click="removeEmail(email)" class="remove" aria-label="Remove Email"></button>
                  </div>

                  <input v-model="newOrderEmail" type="text" placeholder="Add Email" @blur="addEmail" @keydown.enter.prevent.stop="addEmail" @keydown.188.prevent.stop="addEmail">
                </div>
          </div>
          <div class="col-md-12">
            <small>An email would be sent to these email addresses whenever new order is placed</small>
          </div>
        </div>
        <div class="row my-3">
          <div class="col-md-12">
            <b>Contact Email</b>
            <b-input placeholder="Contact Email" v-model="emailSettings.contactEmail" @blur="updateContactEmail" />
            <small>From Email Address: the email customers will reply to.</small>
          </div>
        </div>
      </div>
      <div class="px-4 pb-2 mt-4">
        <div v-if="!isLoading">
          <div class="row">
            <div class="col-lg-4 master-item" v-for="item in master" :key="`master-${item.key}`">
              <div class="inner-container">
                <div class="content">
                  <div class="name">{{ item.name }}</div>
                  <div class="description">{{ item.description }}</div>
                </div>
                <div v-if="!item.setup" class="button-group">
                  <div class="btn setup-btn" @click="setupEmail(item.key)">Set Up</div>
                </div>
                <div v-else-if="item.setup" class="button-group">
                  <div class="btn edit-btn" @click="editEmail(item.key)">Edit</div>
                  <div v-if="item.disabled" class="btn active-btn" @click="activateEmail(item.key)">
                    {{ keyToDisableOrActivate === item.key ? "Activating..." : "Active" }}
                  </div>
                  <div
                    v-else-if="!item.disabled"
                    class="btn disable-btn"
                    @click="disableEmail(item.key)"
                  >
                    {{ keyToDisableOrActivate === item.key ? "Disabling..." : "Disable" }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="loader-wrapper">
          <img src="/icons/loader.gif" class="loader" alt="Loading..." />
        </div>
      </div>
    </div>
    <div v-if="currentPage === PAGES.SAVE">
      <div
        class="px-4 d-flex pt-4 pb-3 mb-3 border-bottom justify-content-between align-items-center heading"
      >
        <div>
          <div class="back-button" @click="goBackToMain">
            <VueIcon name="arrow-left" class="mr-1" /><span>Transactional Emails</span>
          </div>
          <h1 class="h4 mb-0">
            {{
              currentEmailKey &&
              master.find(item => item.key == currentEmailKey) &&
              master.find(item => item.key == currentEmailKey).setup
                ? "Edit"
                : "Set Up"
            }}
          </h1>
        </div>
        <button class="btn btn-primary" @click="saveEmail">
          {{ isSaving ? "Saving..." : "Save" }}
        </button>
      </div>
      <div class="px-3 pb-2 mt-4">
        <div class="row">
          <div class="col-lg-4">
            <b-input placeholder="Email Address for Test Email" v-model="emailAddress" />
          </div>
          <div class="col-lg-2">
            <button class="btn btn-primary" @click="sendTestEmail">
              {{ isSendingEmail ? "Sending..." : "Send Test Email" }}
            </button>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-6">
            <label>Internal Name</label>
            <b-input placeholder="Internal Name" v-model="emailName" />
          </div>
          <div class="col-lg-6">
            <label>Email Type</label>
            <b-input placeholder="Email Type" v-model="emailType" disabled />
          </div>
          <div class="col-lg-6">
            <label>Subject</label>
            <b-input placeholder="Subject" v-model="emailSubject"  @focus="selectInput('emailSubject')"  />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <label>Message</label>
            <HtmlEditor v-model="emailBody"  @editor-focus="selectInput('emailBody')" />
          </div>
          <div class="col-12 mt-2" v-if="emailType == 'order_item_cancelled'">
            <p class="text-danger"><b>{{ VARIABLES.find(x => x.title == 'Refund Message').value }} :</b> You have received a partial refund of $XX. It will take 5-7 banking days for funds to be available for use.</p>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 mt-4">
            <h4>Variables</h4>
            <div>
              When clicking on a variable, the variable will automatically prefill where the
              selected cursor is located.
            </div>
            <div>
              <div
                class="btn variable-btn"
                v-for="variable in VARIABLES"
                :key="`variable-${variable.value}`"
                @click="insertVariable(variable.value)"
              >
                {{ variable.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminApiService from "@/api-services/admin.service";
import NoPermissionTruevalue from "./no-permission-truevalue";

const PAGES = Object.freeze({
  MAIN: "MAIN",
  SAVE: "SAVE"
});

const createVariable = (title, value) => ({title, value});

const VARIABLES = [
  createVariable("Customer First Name", "{{ order.first_name }}"),
  createVariable("Customer Last Name", "{{ order.last_name }}"),
  createVariable("Customer Email Address", "{{ order.email }}"),
  createVariable("Business Name", "{{ business.business_name }}"),
  createVariable("Business Contact Link", "{{ business.contact_link }}"),
  createVariable("Business Telephone", "{{ business.business_telephone }}"),
  createVariable("Business Address", "{{ business.business_address }}"),
  createVariable("Business City", "{{ business.business_city }}"),
  createVariable("Business State", "{{ business.business_state }}"),
  createVariable("Business Zip Code", "{{ business.business_zipcode }}"),
  createVariable("Parcel Delivery Estimated Minutes", "{{ parcel.delivery_est_min }}"),
  createVariable("Parcel Delivery Date Start", "{{ parcel.delivery_date_start|date('l, F j') }}"),
  createVariable("Product Name", "{{ item.product_name }}"),
  createVariable("Product Qty", "{{ item.product_qty }}"),
  createVariable("Refund Message", "{{ item.refund_msg }}")
];

export default {
  name: "SubAccounts",
  components: {
    NoPermissionTruevalue
  },

  data() {
    return {
      currentInput: null,
      PAGES,
      currentPage: PAGES.MAIN,
      isLoading: false,
      master: [],
      keyToDisableOrActivate: null,
      currentEmailKey: null,
      emailName: "",
      emailType: "",
      emailBody: "",
      emailSubject: "",
      emailAddress: "",
      selectedStore: localStorage.getItem('selectedStore'),
      isSaving: false,
      isSendingEmail: false,
      VARIABLES,
      newOrderEmail: "",
      emailSettings: {
        contactEmail: '',
        newOrderEmails: [],
      },
      emailsLoading: false
    };
  },
  computed: {
    storeLocations() {
      return this.$store.state.storeLocations;
    },
    isAdvancedShippingEnabled() {
      return this.$store.state.businessDetails.advanced_shipping_enabled == 1;
    },
  },
  async mounted() {
    if(this.$ezHasNoPermission('transactional_emails')) return;
    this.getEmailSettings();
    await this.getData();
    if(this.isAdvancedShippingEnabled) {
      this.VARIABLES.push(
        createVariable("Shipping Carrier", "{{ order.shipping_details.carrier }}"),
        createVariable("Shipping Tracking ID", "{{ order.shipping_details.tracking_code }}")
      );
    }
  },

  methods: {
    async storeChanged() {
      localStorage.setItem('selectedStore',this.selectedStore);
      this.getData();
      this.getEmailSettings();
    },
    async getData() {
      this.isLoading = true;

      await AdminApiService.getTransactionEmailsMaster().then(res => {
        this.master = res.data.master;
        this.isLoading = false;
      });
    },
    async getEmailSettings() {
      this.emailsLoading = true;
      this.newOrderEmail = "";

      await AdminApiService.getBusinessEmailSettings().then(res => {
        this.emailSettings = res.data.settings;
        this.emailsLoading = false;
      });
    },
    async saveEmail() {
      this.isSaving = true;
      const status = this.validate(false);
      if(status == "") {
        let data = {
          email_name: this.emailName,
          email_key: this.currentEmailKey,
          email_body: this.emailBody,
          email_subject: this.emailSubject
        };

        if(this.master.find(item => item.key == this.currentEmailKey).setup == false) {
          await AdminApiService.setupTransactionEmail(data).then(() => {
            this.$swal({
              toast: true,
              position: "top",
              showConfirmButton: false,
              timer: 3000,
              type: "success",
              title: 'Test email saved succesfully'
            });
          }).catch(() => {
            this.$swal({
              toast: true,
              position: "top",
              showConfirmButton: false,
              timer: 3000,
              type: "error",
              title: "Error while saving email"
            });
          });
        } else {
          await AdminApiService.editTransactionEmail(data).then(() => {
            this.$swal({
              toast: true,
              position: "top",
              showConfirmButton: false,
              timer: 3000,
              type: "success",
              title: 'Test email saved succesfully'
            });
          }).catch(() => {
            this.$swal({
              toast: true,
              position: "top",
              showConfirmButton: false,
              timer: 3000,
              type: "error",
              title: "Error while saving email"
            });
          });
        }
        await this.goBackToMain();
      } else {
        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "error",
          title: status
        });
      }
      this.isSaving = false;
    },
    async goBackToMain() {
      this.currentPage = PAGES.MAIN;
      this.currentEmailKey = null;

      await this.getData();
    },
    async sendTestEmail() {
      this.isSendingEmail = true;
      const status = this.validate(true);
      if(status == "") {
        this.emailBody = this.cleanNsbpFromVariables(this.emailBody);

        let data = {
          email_key: this.currentEmailKey,
          email_body: this.emailBody,
          email_subject: this.emailSubject,
          email_address: this.emailAddress
        };

        await AdminApiService.sendTestEmail(data).then(() => {
          this.$swal({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
            type: "success",
            title: 'Test email sent succesfully'
          });
        }).catch(() => {
          this.$swal({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
            type: "error",
            title: "Error while sending email"
          });
        });
      } else {
        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "error",
          title: status
        });
      }
      this.isSendingEmail = false;
    },
    validate(testEmail) {
      if(this.emailSubject == "") {
        return "Please enter Email Subject";
      }
      if(this.emailName == "") {
        return "Please enter internal email name";
      }
      if(testEmail && this.emailAddress == "") {
        return "Please enter email address";
      }
      return "";
    },
    cleanNsbpFromVariables(string) {
      const cleanedString = string.replace(/{{&nbsp;(.*?)&nbsp;}}/g, function(match, variableName) {
        return "{{ " + variableName.trim() + " }}";
      });
      return cleanedString;
    },
    activateEmail(key) {
      this.activateOrDisable(key, 0);
    },
    disableEmail(key) {
      this.activateOrDisable(key, 1);
    },
    setupEmail(key) {
      this.currentEmailKey = key;
      this.currentPage = PAGES.SAVE;

      let currentEmail = this.master.find(item => item.key == key);
      this.emailName = currentEmail.email_name;
      this.emailType = currentEmail.key;
      this.emailBody = currentEmail.email_body;
      this.emailSubject = currentEmail.email_subject;
      if(this.emailType != "order_item_cancelled") {
        this.VARIABLES = this.VARIABLES.filter(x => x.value != "{{ item.product_name }}");
        this.VARIABLES = this.VARIABLES.filter(x => x.value != "{{ item.product_qty }}");
        this.VARIABLES = this.VARIABLES.filter(x => x.value != "{{ item.refund_msg }}");
      } else {
        this.VARIABLES = VARIABLES;
      }
      window.scrollTo(0, 0);
    },
    editEmail(key) {
      this.currentEmailKey = key;
      this.currentPage = PAGES.SAVE;

      let currentEmail = this.master.find(item => item.key == key);
      this.emailName = currentEmail.email_name;
      this.emailType = key;
      this.emailBody = currentEmail.email_body;
      this.emailSubject = currentEmail.email_subject;
      if(this.emailType != "order_item_cancelled") {
        this.VARIABLES = this.VARIABLES.filter(x => x.value != "{{ item.product_name }}");
        this.VARIABLES = this.VARIABLES.filter(x => x.value != "{{ item.product_qty }}");
        this.VARIABLES = this.VARIABLES.filter(x => x.value != "{{ item.refund_msg }}");
      } else {
        this.VARIABLES = VARIABLES;
      }
      window.scrollTo(0, 0);
    },
    async activateOrDisable(key, value) {
      let data = {
        email_key: key,
        disabled: value
      };

      this.keyToDisableOrActivate = key;

      await AdminApiService.disableTransactionEmail(data).then(res => {
        if(res.data.status == 'success') {
          this.master.forEach(item => (item.key == key ? (item.disabled = !item.disabled) : null));
          this.$swal({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            type: 'success',
            title: res.data.message
          });
        }
      });

      this.keyToDisableOrActivate = null;
    },
    selectInput(inputName) {
      this.currentInput = inputName;
    },
    insertVariable(text) {
       if (this.currentInput) {
            this[this.currentInput] += text;
        }
      // this.insertTextAtCaret(text);
    },

    insertTextAtCaret(text) {
      let sel, range;
      if(window.getSelection) {
        sel = window.getSelection();
        if(sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(text));
        }
      } else if(document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
      }
    },
    updateBusinessEmailSettings() {
      this.emailsLoading = true;

      AdminApiService.updateBusinessEmailSettings(this.emailSettings).then(res => {
        this.emailsLoading = false;
        this.$swal({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          type: "success",
          title: res.data.message
        });
      });
    },
    removeEmail(email) {
      const emailIndex = this.emailSettings.newOrderEmails.indexOf(email);
      this.emailSettings.newOrderEmails.splice(emailIndex, 1);
      this.updateBusinessEmailSettings();
    },
    addEmail() {
      if(!this.newOrderEmail) return;
      this.emailSettings.newOrderEmails.push(this.newOrderEmail);
      this.newOrderEmail = "";
      this.updateBusinessEmailSettings();
    },
    updateContactEmail() {
      this.updateBusinessEmailSettings();
    }
  }
};
</script>

<style lang="scss" scoped>

label {
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 5px;
}

div.back-button {
  color: var(--primary);
  cursor: pointer;
}

div.master-item {
  padding: 10px 10px !important;

  .inner-container {
    background: #fafafa;
    border: 1px solid #e7e7e7;
    padding: 15px 15px !important;

    .content {
      height: 130px;

      .name {
        font-size: 20px;
        line-height: 24px;
      }

      .description {
        margin-top: 10px;
        font-size: 14px;
        line-height: 16px;
      }
    }

    .button-group {
      display: flex;
      justify-content: space-around;

      .btn {
        height: 36px;
      }

      .btn:hover {
        background: lightgrey;
      }

      .setup-btn {
        border: 1px solid #4a90e2;
        width: 75%;
        border-radius: 40px;
        color: #4a90e2;
      }

      .setup-btn:hover {
        background: #e5f1ff;
      }

      .edit-btn {
        border: 1px solid #d00218;
        width: 40%;
        border-radius: 40px;
        color: #d0021b;
      }

      .edit-btn:hover {
        background: #ffe9ec;
      }

      .active-btn {
        border: 1px solid #7ed321;
        width: 40%;
        border-radius: 40px;
        color: #7ed321;
      }

      .active-btn:hover {
        background: #f6ffeb;
      }

      .disable-btn {
        border: 1px solid #9b9b9b;
        width: 40%;
        border-radius: 40px;
        color: #9b9b9b;
      }

      .disable-btn:hover {
        background: #e7e7e7;
      }
    }
  }
}

.variable-btn {
  height: 30px;
  border: 1px solid #ff4d4d;
  border-radius: 40px;
  background: #ff4d4d;
  color: white;
  margin-top: 10px;
  margin-left: 0px;
  margin-right: 10px;
}

.area-reserved {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fdcbcb;
  font-size: 16px;
  height: 100px;
}

.email-input {
    border: 1px solid #DEE2E6;
    border-radius: 4px;
  }

  .email-input {
    display: inline-flex;
    flex-wrap: wrap;
    padding: 4px 4px 0;
    width: 100%;
    background: white;

    .email {
      background: #D9E8EE;
      border-radius: 4px;
      margin-right: 6px;
      display: flex;
      align-items: center;
      padding: 2px 2px 2px 6px;

      span {
        color: #0E4D66;
        font-size: 0.8125rem;
        margin-right: 2px;
      }

      .remove {
        border: none;
        background: url("data:image/svg+xml,%3Csvg width='8px' height='8px' viewBox='0 0 8 8' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3EGroup 6%3C/title%3E%3Cg id='Symbols' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Tag' transform='translate(-80.000000, -7.000000)'%3E%3Crect id='Rectangle' opacity='0.149999991' x='0' y='0' width='95' height='22' rx='4'%3E%3C/rect%3E%3Cg id='Group-6' opacity='0.5' transform='translate(81.500000, 8.500000)' stroke='%23035271' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5'%3E%3Cline x1='0' y1='0' x2='5' y2='5' id='Path'%3E%3C/line%3E%3Cline x1='5' y1='0' x2='0' y2='5' id='Path'%3E%3C/line%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E") no-repeat center;
        width: 8px;
        height: 8px;
        padding: 8px;
      }
    }

    .email,
    input {
      margin-bottom: 4px;
    }

    input {
      border: none;
      flex: 1;
    }
  }

@media (max-width: 900px) {
  .variable-btn {
    height: 35px;
  }
}
</style>
