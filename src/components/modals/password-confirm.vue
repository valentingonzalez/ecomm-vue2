<template>
  <b-modal no-close-on-backdrop class="modal-box" ref="passwordModal">
    <div slot="modal-header">
      <h5>Verify It's You</h5>
      <span @click="hideModal">&times;</span>
    </div>
    <div class="d-block">
      Send a phone verification code
      <b-input
        placeholder="Enter the 4 digit code"
        type="number"
        v-model="code"
        disabled
      >
      </b-input>
      <div class="error-message" v-show="isValid">
        Verification code consists of 4 digits
      </div>
    </div>

    <div class="d-block mt-3 mb-3 text-center">
      OR
    </div>

    <div class="d-block">
      Enter your password
      <b-input
        placeholder="Enter your password"
        type="password"
        v-model="password"
      >
      </b-input>
      <div class="error-message" v-show="isValid">
        Password should contain at least 6 letters
      </div>
    </div>
    <div slot="modal-footer">
      <button
        type="button"
        class="btn btn-primary"
        @click="check">
        Continue
      </button>
    </div>
  </b-modal>
</template>

<script>
import UserApiService from '../../api-services/user.service';

export default {
  name: 'PasswordConfirm',
  data() {
    return {
      password: '',
      code: ''
    };
  },
  methods: {
    check() {
      if(this.isValid) {
        UserApiService.verifyPassword({ password: this.password })
          .then(() => {
            this.$emit('confirm', true);
          }, error => {
            console.log('error', error);
          })
          .catch(error => {
            console.log('error', error);
          });
      }
      else {
        this.password = '';
        this.$swal('Incorrect password', '', 'error');
      }
    },
    showModal() {
      this.$refs.passwordModal.show();
    },
    hideModal() {
      this.$refs.passwordModal.hide();
    },
  },
  computed: {
    isValid() {
      if(this.password.length == 0) 
        return false;
      else if(this.password.length < 8) 
        return false;
      else return true;
    }
  }
};
</script>

<style lang="scss">
  // @import '@/assets/scss/modal-common.scss';
  .error-message {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-size: 12px;
    color: #f00;
    text-align: center;
  }
</style>

