<template>
  <div id="wrapper">
    <div class="container align-items-center justify-content-center d-flex">
      <div class="card card-primary mb-5">
        <div class="card-header">Create New Password</div>
        <div class="card-body flex-column">
          <b-form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="code">Verification code*</label>
              <input ref="code" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label for="password">New Password*</label>
              <input ref="password" type="password" class="form-control" />
              <label style="color: grey; font-size: 12px;">Password must be at least 6 characters long</label>
              <div v-if="errorMsg != ''" class="invalid-feedback mb-3 mt-0">{{ errorMsg }}</div>
            </div>
            <div class="form-group">
              <label for="confirmPassword">Re-enter Password*</label>
              <input ref="confirmPassword" type="password" class="form-control" />
            </div>
            <button type="submit" class="btn btn-primary w-100">Continue</button>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthApiService from "@/api-services/auth.service";
export default {
  name: "reset-password",
  data() {
    return {
      email: '',
      errorMsg: ''
    };
  },
  mounted() {
    this.$ezSetTitle('Reset Password');
    this.email = this.$route.params.email;
  },
  methods: {
    submitForm() {
      const code = this.$refs.code.value;
      const password = this.$refs.password.value;
      const confirmPassword = this.$refs.confirmPassword.value;

      if (!code) {
        this.$swal('Please enter verification code', '', 'error');
        return;
      }
      if (!password) {
        this.$swal('Please enter password', '', 'error');
        return;
      }
      if (!confirmPassword) {
        this.$swal('Please re-enter password', '', 'error');
        return;
      }
      if (password !== confirmPassword) {
        this.$swal('Password does not match', '', 'error');
        return;
      }
       AuthApiService.resetPassword(code, password, this.email).then(
        () => {
          this.errorMsg = '';
          this.$swal({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
            type: "success",
            title:
              "Password reset succesful! Please log in with your new password",
          });
          this.$router.push('/login').catch(err => console.log(err));
        },
        error => {
          if (error.response.data.message === 'You have entered an expired code. Please request for a new code.') {
          this.$swal({
            title: error.response.data.message
            }).then(() => {
              return this.$router.push('/login');
            });
          } else {
              this.$swal(error.response.data.message, '', 'error');
            }
          });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/auth.scss";
.invalid-feedback {
  display: block !important;
}
</style>
