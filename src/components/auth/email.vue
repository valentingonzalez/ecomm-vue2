<template>
  <div>
    <div class="form-group" :class="{'d-none' : newDesign}">
      <label for="email">Email Address Entered</label>
      <input id="email" type="email" :value="email" ref="email" @input="$emit('update:email', $event.target.value)" class="form-control" />
    </div>
    <div class="form-group" :class="{'mb-1' : newDesign}">
      <label for="password">
        Password
        <a @click="sendPasswordResetCode" v-if="!newDesign" aria-label="Forgot your password?" class="text-dark float-right">
          Forgot your password?
        </a>
      </label>
      <input id="password" type="password" :value="password" @input="$emit('update:password', $event.target.value)" class="form-control" placeholder="Enter your password" />
      <a v-if="newDesign" @click="sendPasswordResetCode" aria-label="Forgot your password?" class="text-dark float-right">
        Forgot your password?
      </a>
      <p class="float-right" v-if="!newDesign">
        Can't sign in?
        <a @click="prepareMagicLink" class="text-blue">
          Get a one-time login link in your email
        </a>
        to log into your account! <i class="fa fa-info-circle done-check-info-icon" data-tooltip='A one-time login link is a link sent to your inbox that automatically logs you into your account without entering your password. How cool is that? :)'></i>
      </p>
    </div>
  </div>
</template>

<script>
import AuthApiService from "@/api-services/auth.service";

export default {
  name: "AuthWithEmail",
  data() {
    return {
      errorMsg: '',
    };
  },
  props: {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    newDesign: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    sendPasswordResetCode() {
      AuthApiService.forgotPassword(this.$refs.email.value).then(() => {
        this.errorMsg = '';
        this.$router.push({ name: 'reset-password', params: { email: this.$refs.email.value } }).catch(err => console.log(err));                
        this.$swal({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 3000,
          type: 'success',
          title: `Password reset code sent to ${this.$refs.email.value}. Check your inbox!`
        });
      }).catch(error => {
        this.errorMsg = error.response.status === 422 ? 'Please provide a valid email address.' : error.response.data.message;
        this.$swal(this.errorMsg, '', 'error');
      });
    },
    prepareMagicLink() {
      this.errorMsg = '';
      // rechecking email in case it is changed in this component email input
      AuthApiService.verifyEmailOrPhone({ email: this.$refs.email.value }).then(response => {
        if(response.data.status == 'success') {
          AuthApiService.generateMagicLink(this.$refs.email.value).then(() => {
            this.errorMsg = '';
            this.$swal(`One-time login link sent to ${this.$refs.email.value} . Please close this tab and check your inbox!`, '', 'success');
          });
        }
      }).catch(error => {
        this.errorMsg = error.response.status === 422 ? 'Please provide a valid email address.' : error.response.data.message;
        this.$swal(this.errorMsg, '', 'error');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/auth.scss";
p {
  margin-top: 15px;
  font-weight: 400;
}

a:hover {
  cursor: pointer;
}

.done-check-info-icon {
  position: relative;
}

.done-check-info-icon:hover::before,
.done-check-info-icon:hover::after {
  position: absolute;
  top: -.25rem;
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
}

.done-check-info-icon:hover::before {
  content: attr(data-tooltip);
  background: lightgrey;
  height: fit-content;
  width: 180px;
  border-radius: 0.3rem;
  box-shadow: 1px 1px 10px #333;
  padding: 0.5rem;
  font-family: sans-serif;
  font-size: 0.8rem;
}
</style>
