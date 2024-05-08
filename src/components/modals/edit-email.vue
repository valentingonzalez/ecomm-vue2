<template>
  <b-modal class="modal-box" ref="emailModal">
    <div slot="modal-header">
      <h5>Edit Email Address</h5>
      <span @click="hideModal">&times;</span>
    </div>
    <div class="d-block">
      Email Address
      <b-input v-model="emailOb" placeholder="Enter your new email address"></b-input>
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
  name: 'EditEmail',
  props: ['email'],
  data() {
    return {
      emailOb: ''
    };
  },
  methods: {
    change() {
      UserApiService.saveEmail({email: this.emailOb}).then(resp => {
        if(resp.status == 200) {
          this.$swal({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            type: 'success',
            title: 'Email changed'
          });
          this.$emit('changed', this.emailOb);
        } else {
          this.$swal(resp.data.message, '', 'error');
        }
      })
      .catch(err => {
        this.$swal("Unable to update email", '', 'error');
      });
      this.hideModal();
    },
    hideModal() {
      this.$refs.emailModal.hide();
    },
    showModal() {
      this.emailOb = this.email;
      this.$refs.emailModal.show();
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/modal-common.scss'
</style>

