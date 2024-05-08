<template>
  <b-modal size="lg" class="modal-box" ref="wizardModal" centered hide-header hide-footer>
    <a href="#" class="close-bt" @click="hideModal" aria-label="Close">
      <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity=".3" stroke="#17678F" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"><path d="M15 1L1 15M15 15L1 1"/></g></svg>
    </a>
    <div class="d-flex align-items-stretch h-100">
      <div class="d-flex flex-column justify-content-center flex-grow-1 p-5">
        <div class="flex-grow-1 d-flex flex-column justify-content-center">
          <svg class="mb-3" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 9L1 25.5 4.5 29 21 12.5 17.5 9zM13.5 13l3.5 3.5" stroke="#1DB157" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity=".8" d="M24 18.5l.963 2.5L24 23.5l2.5-1 2.5 1-1-2.5 1-2.5-2.5 1-2.5-1z" stroke="#1DB157" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity=".6" d="M24 1l.963 2.5L24 6l2.5-1L29 6l-1-2.5L29 1l-2.5 1L24 1z" stroke="#1DB157" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path opacity=".3" d="M6.537 1L7.5 3.5 6.537 6l2.5-1 2.5 1-1-2.5 1-2.5-2.5 1-2.5-1z" stroke="#1DB157" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <h1 class="title">Welcome, to the  EZCommerce Wizard!</h1>
          <p v-if="showLogin">Please, login as admin. If you login as customer, you'll be redirected to the regular site.</p>
          <p v-else>Follow this walkthrough to understand and learn the different aspects of the site.</p>
        <login-form class="login-form" v-if="showLogin" :simpleLayout="true" />
        </div>
        <div v-if="!showLogin" class="d-flex justify-content-between">
          <button class="btn btn-outline-primary" @click="stopWizard">Skip</button>
          <button class="btn btn-primary" @click="startWizard">Start</button>
        </div>
      </div>
      <img src="/images/wizard-bg.svg" alt="Home" class="d-none d-md-block" />
    </div>
  </b-modal>
</template>

<script>
import LoginForm from '@/components/login-form.vue';

export default {
  name: 'WizardModal',
  components: {
    LoginForm
  },
  data() {
    return {
      showLogin: false
    };
  },
  methods: {
    hideModal() {
      this.$refs.wizardModal.hide();
    },
    showModal() {
      this.$refs.wizardModal.show();
    },
    startWizard() {
      if(!this.$root.$children[0].isAdmin) {
        this.showLogin = true;
      } else {
        this.showLogin = false;
        this.$root.$children[0].wizard = true;
        localStorage.setItem('wizard', true);
        this.$router.push({query: {wizard: undefined}});
        this.hideModal();
      }
    },
    stopWizard() {
      this.$root.$children[0].wizard = false;
      localStorage.removeItem('wizard');
      this.$router.push({query: {wizard: undefined}});
      this.hideModal();
    }
  }
};
</script>

<style lang="scss" scoped>
  :deep(.modal-content) {
    border-radius: 12px;
    margin-top: -50px;
    .close-bt {
      position: absolute;
      right: 14px;
      top: 14px;
    }
    .modal-body {
      padding: 0 !important;
      font-size: 18px;
      h1.title {
        font-weight: bold;
        font-size: 32px;
        color: #1DB157;
      }
    }
    @media (max-width: 768px) {
      height: calc(100vh - 20px);
      margin: 0;
    }
  }
  :deep(.modal-content), 
  :deep(.login-form) {
    .btn {
      font-weight: bold;
      text-transform: uppercase;
      font-size: 16px;
      border-radius: 8px;
      transition: all .1s;
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.1) !important;
      }
      &.btn-outline-primary {
        border: 1px solid rgba(29, 177, 87, 0.3);
        color: #1DB157;
        &:active,
        &:focus {
          background: #fff !important;
          border: 1px solid rgba(29, 177, 87, 0.3) !important;
          color: #1DB157 !important;
        }
        &:hover {
          background: #fff !important;
          border-color: rgba(29, 177, 87, 0.3) !important;
          color: #1DB157 !important;
        }
      }
      &.btn-primary {
        color: #fff;
        background: #1DB157;
        border: none;
        &:active,
        &:focus {
          background: #1DB157 !important;
        }
      }
    }
    input.form-control:focus {
      border-color: #1DB157 !important;
      box-shadow: 0 0 0 1px #1DB157 !important
    }
  }
</style>