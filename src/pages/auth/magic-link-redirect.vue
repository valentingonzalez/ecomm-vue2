<template>
  <div class="container d-flex justify-content-center" style="max-width: 500px; margin-top: 20px;">
    <div v-if="redirectMsg != ''">{{redirectMsg}}</div>
    <b-alert
      :show="alert.show"
      variant="danger"
    >
      <p>{{ alert.message }}</p>
      <button class="btn container d-flex justify-content-center btn-primary"><router-link :to="{name: 'login'}">Back to login form</router-link></button>
    </b-alert>
  </div>
</template>

<script>
import AuthApiService from '@/api-services/auth.service';
import AuthController from '@/controllers/auth.controller';

export default {
  name: 'magic-link-redirect',
  data() {
    return {
      redirectMsg: '',
      magicLinkToken: '',
      email: '',
      alert: {
        show: false,
        message: ''
      },
      loginKeep: false,
    };
  },
  mounted() {
    this.magicLinkToken = this.$route.query.token;
    this.email = this.$route.query.email;
    this.activateMagicLink();
  },
  methods: {
    activateMagicLink() {
      this.redirectMsg = 'Redirecting...';
      AuthApiService.login({magicLinkToken: this.magicLinkToken, email: this.email}, _, this.$store.state.device_id).then(response => {
        if(response.data.status == 'success') {
          response.data.loginKeep = this.loginKeep;
          AuthController.login(response.data);
          this.$store.dispatch('fetchCartItemsDetails');
          if (response.data.is_admin) {
            if (this.$root.$children[0].initWizard) {
              this.$root.$children[0].$refs.wizardModal.startWizard();
              this.redirectMsg = '';
            } else {
              this.$router.push({ name: 'admin-orders' }).catch(err => console.log(err));
              this.redirectMsg = '';
            }
          } else {
            this.$router.push({ name: 'cart' }).catch(err => console.log(err));
            this.redirectMsg = '';
          }
        } else if(response.data.status == 'error') {
          this.alert.show = true;
          this.alert.variant = 'danger';
          this.alert.message = response.data.message || 'Unsuccessful login. Please try again.';
          this.redirectMsg = '';
        }
      }).catch(error => {
        this.alert.show = true;
        this.alert.variant = 'danger';
        this.alert.message = error.response.data.message || 'Unsuccessful login. Please try again.';
        this.redirectMsg = '';
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

a{
  text-decoration: none;
}
</style>
