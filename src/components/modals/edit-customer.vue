<template>
  <div>
    <b-modal centered ref="customerEditModal" id="customerEditModal" hide-footer>
      <div slot="modal-header" class="d-flex align-items-center">
        <div class="notes-bt mr-3">
          <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7822 8.04647C13.7822 10.1279 13.7822 12.2093 13.7822 14.2907C13.7822 15.1459 13.2844 15.8173 12.4967 16.0197C12.3282 16.0598 12.1553 16.0789 11.9821 16.0768C8.59706 16.0801 5.21178 16.0801 1.82626 16.0768C0.733518 16.0786 0 15.3461 0 14.2591C0 10.1147 0 5.97033 0 1.82593C0 0.86094 0.578489 0.165103 1.50077 0.0176101C1.60781 0.00347238 1.71581 -0.00216745 1.82375 0.00074349C5.20855 0.00074349 8.59383 0.00074349 11.9796 0.00074349C13.0476 -0.000333101 13.7804 0.732826 13.7804 1.80296C13.7823 3.88437 13.7823 5.96578 13.7804 8.04719L13.7822 8.04647ZM12.6338 8.05724C12.6338 5.98181 12.6338 3.9065 12.6338 1.83131C12.6338 1.36479 12.421 1.14947 11.9573 1.14947H1.83738C1.36368 1.14803 1.15016 1.36335 1.15016 1.84136C1.15016 5.98025 1.15016 10.1192 1.15016 14.258C1.15016 14.7095 1.36978 14.9298 1.82052 14.9298H11.9581C12.4221 14.9298 12.6334 14.7163 12.6334 14.248C12.6339 12.1843 12.6334 10.1207 12.632 8.05724H12.6338Z" fill="#B45309"/><path d="M6.89194 8.61235C6.24024 8.61235 5.58854 8.61235 4.93685 8.61235C4.57224 8.61235 4.31027 8.37335 4.30776 8.0432C4.30525 7.71304 4.56757 7.46542 4.92823 7.46507C6.23737 7.46363 7.54674 7.46363 8.85636 7.46507C9.21809 7.46507 9.47648 7.71017 9.47396 8.04355C9.47145 8.37694 9.21307 8.61235 8.84703 8.61235C8.19533 8.61403 7.54363 8.61403 6.89194 8.61235Z" fill="#B45309"/><path d="M6.87049 5.16729C6.22453 5.16729 5.57858 5.16729 4.93262 5.16729C4.56981 5.16729 4.3082 4.92505 4.30641 4.5931C4.30461 4.26115 4.56874 4.01892 4.93047 4.01892C6.23362 4.01892 7.53666 4.01892 8.83958 4.01892C9.21566 4.01892 9.47656 4.26008 9.47261 4.59992C9.46902 4.93044 9.2092 5.16441 8.84137 5.16513C8.18537 5.16944 7.52793 5.16729 6.87049 5.16729Z" fill="#B45309"/><path d="M6.88483 12.0574C6.23888 12.0574 5.59292 12.0574 4.94697 12.0574C4.57196 12.0574 4.3064 11.8159 4.3064 11.4811C4.30855 11.1531 4.57124 10.9112 4.93548 10.9109C6.24414 10.9094 7.55304 10.9094 8.86217 10.9109C9.18515 10.9109 9.43241 11.1186 9.46973 11.4079C9.48805 11.5486 9.45359 11.6912 9.37301 11.808C9.29242 11.9248 9.17142 12.0077 9.03335 12.0406C8.96308 12.0545 8.89142 12.0602 8.81983 12.0574C8.17555 12.0591 7.53055 12.0591 6.88483 12.0574Z" fill="#B45309"/></svg>
        </div>
        <div>
          <h5>Customer</h5>
        </div>
      </div>
      <form @submit.prevent=";" v-if="editCustomer">
        <div class="text-muted mb-2">
          <fieldset class="form-group">
            <legend>Store Address</legend>
            <div class="form-row">
              <div class="col-md-6 form-group">
                <label for="first_name">First Name</label>
                <input type="text" class="form-control" id="first_name" placeholder="John" v-model="editCustomer.first_name">
              </div>
              <div class="col-md-6 form-group">
                <label for="last_name">Last Name</label>
                <input type="text" class="form-control" id="last_name" placeholder="Doe" v-model="editCustomer.last_name">
              </div>
            </div>
            <div class="form-row">
              <div class="col-md-6 form-group">
                <label for="email">Email</label>
                <input type="text" class="form-control" id="email" placeholder="John Doe" v-model="editCustomer.email">
              </div>
              <div class="col-md-6 form-group">
                <label for="telephone">Telephone</label>
                <input type="text" class="form-control" id="telephone" placeholder="John Doe" v-model="editCustomer.telephone">
              </div>
            </div>
            <div class="form-row">
              <div class="col-md-12 form-group" v-if="accountField.display">
                <label for="account_number">{{ accountField.label }} (optional)</label>
                <input
                  v-model="editCustomer.account_num"
                  id="account_number"
                  type="text"
                  class="form-control">
                <small class="form-text text-muted">{{ accountField.help }}</small>
              </div>
            </div>
            <div class="form-row">
              <template v-for="(column, index) in additionalColumns">
                <div v-bind:key="index" v-if="column.type == 'bool'" class="col-md-12 form-group">
                  <b-form-checkbox v-model="editCustomer.custom_info[column.key]" :name="column.key" switch>
                    {{ column.header }}
                  </b-form-checkbox>
                </div>
                <div v-bind:key="index" v-else class="col-md-6 form-group">
                  <label :for="column.key">{{ column.header }}</label>
                  <input type="text" v-model="editCustomer.custom_info[column.key]" class="form-control" :id="column.key">
                </div>
              </template>
            </div>
            <b-alert
              :show="alert.show"
              :variant="alert.variant"
              dismissible
              @dismissed="alert.show = false">
              {{ alert.message }}
            </b-alert>
          </fieldset>
        </div>
        <div class="d-flex align-items-center justify-content-end mt-3">
          <button class="btn btn-action mr-2 px-4" :disabled="editing" @click="()=>$refs.customerEditModal.hide()">Cancel</button>
          <button class="btn btn-success px-4" @click="editCustomerSubmit()" :disabled="editing" type="submit">
            <div v-if="editing" class="spinner-border spinner-border-sm mr-2" />
            Save
          </button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import AdminApiService from '@/api-services/admin.service';
export default {
  name: "edit-customer",
  props: {
    customer: {
      type: Object,
      required: true
    },
    additionalColumns: {
      type: Array
    }
  },
  data() {
    return {
      editCustomer: null,
      editing: false,
      alert: {
        show: false,
        variant: 'error',
        message: ''
      }
    };
  },
  mounted() {
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
      return info;
    }
  },
  watch: {
    editCustomer: {
      deep: true,
      handler: function (val) {
        console.log(val);
      }
    }
  },
  methods: {
    showModal() {
      this.editCustomer = JSON.parse(JSON.stringify(this.customer));
      if (this.editCustomer.custom_info instanceof Array) {
        this.editCustomer.custom_info = {};
      }
      this.$refs.customerEditModal.show();
    },
    editCustomerSubmit() {
      this.editing = true;
      AdminApiService.updateCustomer(this.editCustomer, this.editCustomer.id).then(response => {
        response = response.data;
        if (response.status === 'success') {
          this.$emit('updateCustomer', response.data);
          this.$swal('Success', response.message, 'success');
          this.$refs.customerEditModal.hide();
        }
      }).catch(error => {
        let errors = error.response.data.errors;
        let firstError = errors[Object.keys(errors)[0]];
        this.alert.show = true;
        this.alert.variant = 'danger';
        this.alert.message = 'Error: ' + firstError;
      }).finally(() => {
        this.editing = false;
      });
    }
  }
};
</script>

<style scoped>

</style>
