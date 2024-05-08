<template>
  <div class="d-flex flex-column align-items-center">
    <h5 class="font-weight-normal mt-5 mb-3">Are you sure you want to unsubscribe?</h5>
    <div class="lead" v-if="unsubscribed">
      You are now unsubscribed! You will be redirected to home page soon...
    </div>
    <div class="lead" v-else-if="error">
      There was an error triyng to unsubscribe, you will be redirected to home page soon...
    </div>
    <button v-else :disabled="loading" type="button" class="btn btn-primary" @click="unsubscribe">
      <div class="spinner-border spinner-border-sm mr-3" v-if="loading"></div>
      Unsubscribe
    </button>
  </div>
</template>

<script>
  import WizardApiService from '@/api-services/wizard.service';

  export default {
    name: 'WizardUnsubscribe',
    data() {
      return {
        loading: false,
        unsubscribed: false,
        error: false
      };
    },
    async mounted() {
      if(!this.$route.query || !this.$route.query.hash)
        this.$router.push('/').catch(err => console.log(err));
    },
    methods: {
      async unsubscribe() {
        this.loading = true;
        let resp = await WizardApiService.unsubscribe(this.$route.query.hash);
        if(resp && resp.data && resp.data.status == "success") {
          this.unsubscribed = true;
        } else {
          this.error = true;
        }
        this.loading = false;
        setTimeout(() => {
          this.$router.push('/').catch(err => console.log(err));
        }, 5000);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
