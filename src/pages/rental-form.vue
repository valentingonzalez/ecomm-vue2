<template>
  <main>
    <div class="form-container my-4">
      <h1 class="h4 font-weight-bold text-center mb-4">
        Fill out the information below and a team member will be in touch!
      </h1>
      <p v-if="disclaimerTop" class="mb-1" v-html="parseHTML(disclaimerTop)"></p>
      <div class="card p-3">
        <form @submit.prevent="onSubmit" ref="form">
          <div class="row">
            <div class="col-md-12 mb-4">
              <label for="productName">Item</label>
              <input
                type="text"
                class="form-control"
                placeholder="Item name"
                id="productName"
                v-model="productName"
                readonly
                disabled
              />
            </div>
            <div class="col-md-12 mb-4">
              <template v-if="onlyDisplayLocation">
                <label for="locations">The pickup location for your rental equipment is</label>
                <span class="d-block" v-if="selectedLocation">
                  {{ selectedLocation.name }}, {{ selectedLocation.address }}, {{ selectedLocation.city }}, {{ selectedLocation.state }}
                </span>
              </template>
              <template v-else>
                <label for="locations">Which of our locations is most convenient for you?</label>
                <select v-if="locations.length > 1" class="form-control" id="locations" v-model="convenientLocation">
                  <option v-for="location in locations" :key="location.id" :value="location.id">
                    {{ location.name }}, {{ location.address }}, {{ location.city }}, {{ location.state }}
                  </option>
                </select> 
              </template>
            </div>
            <div class="col-md-6 mb-4">
              <label for="name">Your Name (required)</label>
              <input
                type="text"
                class="form-control"
                placeholder="Your Name"
                id="name"
                v-model="name"
                required
              />
            </div>
            <div class="col-md-6 mb-4">
              <label for="email">Your Email (required)</label>
              <input
                type="email"
                class="form-control"
                placeholder="Your Email"
                id="email"
                v-model="email"
                required
              />
            </div>
            <div class="col-md-6 mb-4">
              <label for="phone">Phone Number (required)</label>
              <input
                type="tel"
                class="form-control"
                placeholder="Phone Number"
                id="phone"
                v-model="phone"
                required
              />
            </div>
            <div class="col-md-6 mb-4">
              <label for="preferredContact">Preferred Method of Contact</label>
              <select class="form-control" id="preferredContact" v-model="preferredContact">
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>

            <div class="col-md-6 mb-4">
              <label for="rentalDates">Rental Dates</label>
              <date-range-picker
                class="d-block"
                ref="picker"
                :autoApply="true"
                :ranges="false"
                v-model="rentalDates"
                :minDate="new Date(new Date() - 86400000).toString()"
              >
              </date-range-picker>
              <div v-if="datesSelectionAlert" class="text-danger small">
                Please select the start and end date
              </div>
            </div>
            
            <template v-if="$store.state.businessDetails.custom_fields && $store.state.businessDetails.custom_fields.rental ">
              <custom-input-fields
                :customFields="$store.state.businessDetails.custom_fields.rental"
                :customInfo.sync="memberInfo.custom_info"
                outerClass="w-100"
                innerClass="col-sm-6 col-lg-12 mb-3"/>
            </template>
            
            <div class="col-md-12 mb-3">
              <label for="comments">Any Comments</label>
              <textarea
                class="form-control"
                id="comments"
                placeholder="Comments"
                rows="4"
                v-model="comments"
              />
            </div>
            <div class="col-md-12 mb-3" v-if="disclaimerBottom">
              <p v-html="disclaimerBottom"></p>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center align-items-md-end flex-column flex-md-row">
            <div>
              <div v-if="recaptchaAlert" class="text-danger small">
                Please, verify that you are human
              </div>
              <vue-recaptcha
                sitekey="6Le66-cUAAAAAGhK_FYzY6QPwIcNa5ejt_P6SEdQ"
                ref="recaptcha"
                @verify="onVerify"
                @expired="onExpired"
                :loadRecaptchaScript="true">
              </vue-recaptcha>
            </div>
            <button
              type="submit"
              :disabled="submitting"
              class="btn btn-primary font-weight-bold px-5 mt-3 mt-md-0"
            >
              <span
                v-if="submitting"
                class="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              ></span>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import DateRangePicker from "vue2-daterange-picker";
import VueRecaptcha from "vue-recaptcha";
import RentalApiService from "@/api-services/rental.service";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
    name: 'rental-form',
    components: {
        VueRecaptcha,
        DateRangePicker
    },
  mounted() {
    this.$ezSetTitle('Rental Form');

    if (this.userInfo) {
      this.memberInfo.first_name = this.userInfo.data.customer.first_name;
      this.memberInfo.last_name = this.userInfo.data.customer.last_name;
      this.memberInfo.telephone = this.userInfo.data.customer.telephone;
      this.memberInfo.email = this.userInfo.data.customer.email;
      this.memberInfo.receive_sms = this.userInfo.data.customer.receive_sms;
      this.memberInfo.receive_marketing = this.userInfo.data.customer.receive_marketing == 0 ? 0 : 1;
    }

    if(this.locations && this.locations.length === 1) {
      this.convenientLocation = this.locations[0].id;
      this.selectedLocation = this.locations[0];
    }
    if(this.locations && this.locations.length > 1) {
      this.checkLocationSettings();
    }

  },
  data() {
    return {
      name: "",
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
      email: "",
      phone: "",
      preferredContact: "email",
      bestTimeToCall: "morning",
      convenientLocation: 0,
      valid: false,
      rentalDates: {
        startDate: null,
        endDate: null
      },
      comments: "",
      recaptchaToken: "",
      recaptchaAlert: false,
      submitting: false,
      selectedLocation: null,
      datesSelectionAlert: false,
    };
  },
  computed: {
    productName() {
      return sessionStorage.rentalProductName;
    },
    productId() {
      return sessionStorage.rentalProductId;
    },
    locations() {
      return this.$store.state.storeLocations;
    },
    businessDetails: {
      get() {
        return this.$store.state.businessDetails;
      },
      set(val) {
        return val;
      }
    },
    settings() {
      return this.$store.state.settings;
    },
    disableLocationSelection() {
      return this.settings.rentals && this.settings.rentals.disableLocationSelection 
        && this.settings.rentals.disableLocationSelection === true || false;
    },
    onlyDisplayLocation() {
      return this.locations.length === 1 || this.disableLocationSelection;
    },
    disclaimerTop() {
      return this.settings.rentals && this.settings.rentals.submitFormDisclaimerTop || "";
    },
    disclaimerBottom() {
      return this.settings.rentals && this.settings.rentals.submitFormDisclaimerBottom || "";
    }
  },
  watch: {
    locations(newValue) {
      if(newValue.length == 1) {
        this.convenientLocation = newValue[0].id;
        this.selectedLocation = this.locations[0];
      } else {
        this.checkLocationSettings();
      }
    }
  },
  created() {
    if (this.$route.params.name) sessionStorage.rentalProductName = this.$route.params.name;
    if (this.$route.params.id) sessionStorage.rentalProductId = this.$route.params.id;
  },
  methods: {
    parseHTML(e) {
      return e.replace(/\n/g, '<br>');
    },
    parseDate(date) {
      if (!date) return "";
      var mm = date.getMonth() + 1;
      var dd = date.getDate();
      return `${date.getFullYear()}-${(mm > 9 ? "" : "0") + mm}-${(dd > 9 ? "" : "0") + dd}` || "";
    },
    validateRental(){
      if(!this.name || this.name.trim() == ''){
        this.$swal('Error', "Name is Required", 'error');        
        return false;
      }
      if(!this.email || this.email.trim() == ''){
        this.$swal('Error', "Email is Required", 'error');        
        return false;
      }
      if(!this.phone || this.phone.trim() == ''){
        this.$swal('Error', "Phone Number is Required", 'error');        
        return false;
      }
      if (!this.rentalDates.startDate || !this.rentalDates.endDate) {
        this.datesSelectionAlert = true;
        return false;
      }
      return true;
    },
    onSubmit() {
      this.datesSelectionAlert = false;
      if(!this.validateRental()){
        return;
      }
      if (!this.recaptchaToken) {
        this.recaptchaAlert = true;
        return;
      } else {
          this.submitting = true;
          let location = this.locations.filter(e => e.id == this.convenientLocation)[0];
          let obj = {
            name: this.name,
            product_id: this.productId,
            email: this.email,
            phone: this.phone,
            best_time_to_call: this.bestTimeToCall,
            preferred_contact: this.preferredContact,
            from_date: this.parseDate(this.rentalDates.startDate),
            to_date: this.parseDate(this.rentalDates.endDate),
            convenient_location: location.name + " / " + location.address,
            comments: this.comments,
            custom_info: JSON.stringify(this.memberInfo.custom_info),
            // we can send the recaptchaToken to the backend:
            recaptcha: this.recaptchaToken
          };
          RentalApiService.rentalFormSubmit(obj).then(response => {
            if (response.data.status == "success") {
              this.submitting = false;
              this.showConfirmationModal(response.data.message);
            }
          }).catch(err => {
            this.submitting = false;
            this.$refs.recaptcha.reset();
          });
      }
    },
    onVerify: function(response) {
      this.recaptchaToken = response;
      this.recaptchaAlert = false;
    },
    onExpired: function() {
      this.recaptchaVerified = false;
    },
    showConfirmationModal(message) {
      let timerInterval;
      this.$swal({
        title: message,
        html: "Redirecting to homepage in <b></b> seconds.",
        timer: 5000,
        icon: "success",
        onBeforeOpen: () => {
          this.$swal.showLoading();
          timerInterval = setInterval(() => {
            const content = this.$swal.getContent();
            if (content) {
              const b = content.querySelector("b");
              if (b) {
                b.textContent = Math.ceil(this.$swal.getTimerLeft() / 1000);
              }
            }
          }, 100);
        },
        onClose: () => {
          clearInterval(timerInterval);
          this.$router.push({ name: "index" }).catch(err => console.log(err));
        }
      });
    },
    checkLocationSettings() {
      if(this.locations && this.locations.length > 1 && this.disableLocationSelection) {
        const selectedStore = localStorage.getItem('selectedStore') || null;
        if(selectedStore) {
          this.convenientLocation = selectedStore;
          const index = this.locations.indexOf(this.locations.find(l => l.business_id == selectedStore));
          if(index != -1) {
            this.selectedLocation = this.locations[index];
          }
        }
      }
    }
  }
};
</script>

<style lang="scss">
  .b-form-timepicker{
    label{
      &.form-control{
        display: flex;
        align-items: center;
      }
    }
  }
</style>

<style scoped lang="scss">
main {
  label {
    font-size: 14px;
    font-weight: bold;
  }
  .form-container {
    max-width: 770px;
    margin: 0 auto;
  }
  textarea {
    resize: none;
    font-size: 14px;
  }
}
</style>
