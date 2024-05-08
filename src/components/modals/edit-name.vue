<template>
  <b-modal class="modal-box" ref="nameModal">
    <div slot="modal-header">
      <h5>Edit Name</h5>
      <span @click="hideModal">&times;</span>
    </div>
    <div class="d-block">
      First Name*
      <b-input
        v-model="firstNameOb"
        placeholder="Enter your first name"
      >
      </b-input>
    </div>
    <div class="d-block">
      Last Name*
      <b-input
        v-model="lastNameOb"
        placeholder="Enter your last name"
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
import AuthController from '@/controllers/auth.controller';

export default {
  name: 'EditName',
  props: ['first_name', 'last_name'],
  data() {
    return {
      firstNameOb: '',
      lastNameOb: ''
    };
  },
  methods: {
    change() {
      const payload = {firstName: this.firstNameOb, lastName: this.lastNameOb};
      this.$emit('changed', payload);
      UserApiService.saveName(payload).then(resp => {
        if(resp.status == 200) {
          AuthController.updateUserInLocalStorage(this.$store.state.activeUser);
          this.$swal({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            type: 'success',
            title: 'Name changed'
          });
        }
      });
      this.hideModal();
    },
    hideModal() {
      this.$refs.nameModal.hide();
    },
    showModal() {
      this.firstNameOb = this.first_name;
      this.lastNameOb = this.last_name;
      this.$refs.nameModal.show();
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/modal-common.scss'
</style>

