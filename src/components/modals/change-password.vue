<template>
  <b-modal class="modal-box" ref="passwordModal">
    <div slot="modal-header">
      <h5>Change Password</h5>
      <span @click="hideModal">&times;</span>
    </div>
    <div class="d-block">
      Current Password*
      <b-input
        type="password"
        v-model="currentPass"
        placeholder="Enter your current password"
      >
      </b-input>
    </div>
    <div class="d-block">
      New Password*
      <b-input
        type="password"
        v-model="pass"
        placeholder="Enter your new password"
      >
      </b-input>
    </div>
    <div class="d-block">
      Confirm Password*
      <b-input
        type="password"
        v-model="passConfirm"
        placeholder="Confirm your password"
      >
      </b-input>
    </div>
    <div slot="modal-footer">
      <button
        type="button"
        class="btn btn-primary"
        @click="change">
        Save
      </button>
    </div>
  </b-modal>
</template>

<script>
import UserApiService from '@/api-services/user.service';
export default {
  name: 'ChangePassword',
    data() {
      return {
          currentPass: '',
          pass: '',
          passConfirm: ''
      };
    },
  methods: {
    change() {
      if ( this.pass !== this.passConfirm ) {
        this.$swal(`Passwords don't match`, '', 'error');
      } else {
        this.$emit('changed', this.pass);
        UserApiService.changePassword({oldPassword: this.currentPass, newPassword: this.pass})
        .then(() => {
          this.$swal({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            type: 'success',
            title: 'Password successfully changed'
          });
          this.hideModal();
        }, (err) => {
          this.$swal(err.response.data.message, '', 'error');
        });
      }
    },
    hideModal() {
      this.$refs.passwordModal.hide();
    },
    showModal() {
      this.$refs.passwordModal.show();
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/modal-common.scss'
</style>

