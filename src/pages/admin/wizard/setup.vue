<template>
  <div>
    <div class="py-4 card border-0 mt-4 wizard-wrapper">

      <template v-if="showCongats">
        <div class="congrats px-4 d-flex align-items-center flex-column py-4">
          <img src="/icons/congrats.png" width="96" alt="Congratulations!" />
          <h1 class="display-5 mt-5 text-uppercase font-weight-bold">Congratulations</h1>
          <div class="h5 font-weight-normal text-muted text-center mt-3">
            <p>
              You have completed all of the Setup Wizard Steps that are available!
            </p>
            <p>
              If we push out new setup steps we will be sure to email you!<br>
              You can come back to the wizard to restart the process and select other settings.
            </p>
          </div>
          <div class="row w-100 mt-4">
            <div class="col-md-6 offset-md-3">
              <button class="btn btn-primary w-100" @click="congrats">
                <span class="lead font-weight-normal m-0">
                  View setup steps
                </span>
              </button>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="px-4 border-bottom pb-2">
          <h4>Setup Wizard</h4>
          <p class="text-muted lead">
            Click on Start to begin any section. We've ordered the list to put the most important first. Each section is designed to ask you some questions to help automate the settings of your E-Commerce site.
          </p>
        </div>
        <div class="px-4 pb-2">
          <WizardStoreList :selectedStore="selectedStore" @onSelect="pushStore" :showPercentage="true" class="border-bottom py-4 mb-4" />
          <div class="text-muted lead text-uppercase mb-3 pt-4">
            <b>Pending</b>
          </div>
          <div v-if="loading" class="d-flex justify-content-center pt-4 w-100">
            <div class="spinner-border"></div>
          </div>
          <WizardOption v-else v-for="o in options.filter(e => !e.hide)" :queryParams="{ store: selectedStore }" :link="`section/${o.link}`" :title="o.title" :percentage="o.percentage" :sections="o.items" class="mb-3" :key="o.id" />
        </div>
      </template>
    </div>
    <p class="text-center mb-0 mt-3">Click here to watch <router-link to="/admin/tutorials" target="_blank">Tutorial Videos</router-link></p> 
  </div>
</template>

<script>
  import WizardOption from '@/components/admin/wizard/wizard-option';
  import WizardStoreList from '@/components/admin/wizard/wizard-store-list';
  import WizardApiService from '@/api-services/wizard.service';

  export default {
    name: 'WizardSetup',
    components: {
      WizardOption,
      WizardStoreList
    },
    data() {
      return {
        selectedStore: null,
        loading: false,
      };
    },
    computed: {
      options() {
        return this.$store.state.adminWizardSteps;
      },
      stores() {
        return this.$store.state.adminWizardBusinesses || [];
      },
      showCongats() {
        return this.$store.state.adminWizardShowCongrats;
      },
      completion() {
        return this.stores.reduce((a, b) => a + b.completion, 0) / this.stores.length;
      }
    },
    async mounted() {
      window.localStorage.wizardApplyToAll =  false;
      if(!this.stores || !this.stores.length)
        await WizardApiService.getWizardBusinesses().then(resp => {
          this.$store.commit('setAdminWizardBusinesses', resp.data.stores);
          this.$store.commit('setAdminWizardShowCongrats', resp.data.showCongats);

        });
      if(!this.$route.query.store)
        this.pushStore(this.stores[0].id);
      else
        this.selectStore(this.$route.query.store);
    },
    methods: {
      congrats() {
        this.showSteps = 1;
        this.$store.commit('setAdminWizardShowCongrats', false);
      },
      async pushStore(id) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { store: id }) }).catch(() => {});
        this.selectStore(id);
      },
      async selectStore(id) {
        this.loading = true;
        this.selectedStore = id;
        !this.$store.state.adminWizard && await WizardApiService.getWizard(id).then(async wizard => {
          this.$store.commit('setAdminWizard', wizard.data.wizard);
        });
        let resp = await WizardApiService.getSteps(this.$store.state.adminWizard.id, id);
        this.$store.commit('setAdminWizardSteps', resp.data.steps.map(e => ({ ...e, link: e.title.toLowerCase().replaceAll(' ', '-')})));
        this.loading = false;
      }
    },
    watch: {
    }
  };
</script>

<style scoped lang="scss">
  .text-muted {
    color: #475569 !important;
  }
  .congrats {
    p {
      line-height: 40px;
    }
  }
</style>