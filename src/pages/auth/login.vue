<template>
  <div id="wrapper">
    <div class="container d-flex justify-content-center">
      <div class="card card-primary mb-5">
        <div class="card-header">
          Log In
        </div>
        <div class="card-body flex-column">
          <login-form />
        </div>
      </div>
    </div>

    <VFooter v-if="$store.state.settings.navigationLayout == 'secondary'"></VFooter>
  </div>
</template>

<script>
    import LoginForm from '@/components/login-form.vue';
    import VFooter from '../../custom-pages/gerretsen/components/Footer';

    export default {
      name: 'LoginPage',
      components: { 
        LoginForm,
        VFooter
      },
      data() {
        return {
        };
      },
      mounted() {
        this.$ezSetTitle('Sign In');
      },
    };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/auth.scss';

  .btn-yellow {
    background-color: var(--primary) !important;
    border-color: var(--primary) !important;

    &:hover
    &:active,
    &:focus,
    &:active:focus {
      background-color: var(--primary) !important;
      border-color: var(--primary) !important;
    }
  }
</style>
