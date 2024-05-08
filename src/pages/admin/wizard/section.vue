<template>
  <div class="d-flex flex-column align-items-end">
    <div class="d-flex">
      <div class="steps text-nowrap mr-4" v-if="filteredSteps.length > 1">
        <h6 class="font-weight-bold">{{ section.title }}</h6>
        <div class="step flex-grow-1 pl-3 mb-3 py-2" v-for="(s, i) in filteredSteps" :key="`step-${s.id}`" :class="{ 'done' : (s.completed || currentStep == i + 1) }">
          <div class="label font-weight-bold text-uppercase text-tiny text-muted">
            Step {{ i + 1 }}
          </div>
          <div class="position-relative overflow-hidden" style="height: 20px;">
            <div class="title">{{ s.title }}</div>
          </div>
        </div>
      </div>
      <div class="py-4 card border-0 wizard-wrapper">
        <div class="px-4 border-bottom pb-2">
          <div class="d-flex justify-content-between mb-3">
            <div class="d-flex">
              <router-link to="/admin/wizard/setup" class="btn btn-sm btn-outline-secondary text-medium">
                <svg class="mr-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.70679 0.292787C5.89426 0.480314 5.99957 0.734622 5.99957 0.999786C5.99957 1.26495 5.89426 1.51926 5.70679 1.70679L2.41379 4.99979L5.70679 8.29279C5.88894 8.48139 5.98974 8.73399 5.98746 8.99619C5.98518 9.25838 5.88001 9.5092 5.6946 9.6946C5.5092 9.88001 5.25838 9.98518 4.99619 9.98746C4.73399 9.98974 4.48139 9.88894 4.29279 9.70679L0.292787 5.70679C0.105316 5.51926 0 5.26495 0 4.99979C0 4.73462 0.105316 4.48031 0.292787 4.29279L4.29279 0.292787C4.48031 0.105316 4.73462 0 4.99979 0C5.26495 0 5.51926 0.105316 5.70679 0.292787Z" fill="currentColor"/></svg>
                Go Back to Main Menu
              </router-link>
              <router-link v-if="isRedirectInRoute()" to="/admin/settings/fulfillment-options" class="btn btn-sm btn-outline-secondary text-medium ml-2">
                <svg class="mr-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.70679 0.292787C5.89426 0.480314 5.99957 0.734622 5.99957 0.999786C5.99957 1.26495 5.89426 1.51926 5.70679 1.70679L2.41379 4.99979L5.70679 8.29279C5.88894 8.48139 5.98974 8.73399 5.98746 8.99619C5.98518 9.25838 5.88001 9.5092 5.6946 9.6946C5.5092 9.88001 5.25838 9.98518 4.99619 9.98746C4.73399 9.98974 4.48139 9.88894 4.29279 9.70679L0.292787 5.70679C0.105316 5.51926 0 5.26495 0 4.99979C0 4.73462 0.105316 4.48031 0.292787 4.29279L4.29279 0.292787C4.48031 0.105316 4.73462 0 4.99979 0C5.26495 0 5.51926 0.105316 5.70679 0.292787Z" fill="currentColor"/></svg>
                Back to Fulfillment Options
              </router-link>
            </div>
            <div class="d-flex">
              <button class="btn btn-sm btn-secondary text-medium font-weight-normal mr-3" :disabled="currentStep == 1" @click="prevStep" v-if="filteredSteps.length > 1">
                <svg class="mr-4" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.70679 0.292787C5.89426 0.480314 5.99957 0.734622 5.99957 0.999786C5.99957 1.26495 5.89426 1.51926 5.70679 1.70679L2.41379 4.99979L5.70679 8.29279C5.88894 8.48139 5.98974 8.73399 5.98746 8.99619C5.98518 9.25838 5.88001 9.5092 5.6946 9.6946C5.5092 9.88001 5.25838 9.98518 4.99619 9.98746C4.73399 9.98974 4.48139 9.88894 4.29279 9.70679L0.292787 5.70679C0.105316 5.51926 0 5.26495 0 4.99979C0 4.73462 0.105316 4.48031 0.292787 4.29279L4.29279 0.292787C4.48031 0.105316 4.73462 0 4.99979 0C5.26495 0 5.51926 0.105316 5.70679 0.292787Z" fill="currentColor"/></svg>
                Previous
              </button>
              <button class="btn btn-sm btn-primary text-medium font-weight-normal" @click="nextStep" :disabled="saving">
                Save & {{ currentStep == filteredSteps.length ? 'Finish' : 'Next' }}
                <svg v-if="currentStep < filteredSteps.length" class="ml-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292787 9.70643C0.105316 9.5189 0 9.2646 0 8.99943C0 8.73427 0.105316 8.47996 0.292787 8.29243L3.58579 4.99943L0.292787 1.70643C0.110629 1.51783 0.00983372 1.26523 0.0121121 1.00303C0.0143906 0.740833 0.11956 0.49002 0.304968 0.304612C0.490376 0.119204 0.741189 0.014035 1.00339 0.0117566C1.26558 0.00947813 1.51818 0.110273 1.70679 0.292431L5.70679 4.29243C5.89426 4.47996 5.99957 4.73427 5.99957 4.99943C5.99957 5.2646 5.89426 5.5189 5.70679 5.70643L1.70679 9.70643C1.51926 9.8939 1.26495 9.99922 0.999786 9.99922C0.734622 9.99922 0.480314 9.8939 0.292787 9.70643Z" fill="currentColor"/></svg>
              </button>
            </div>
          </div>
          <div class="d-flex justify-content-between mb-2 align-items-center">
            <h4 class="font-weight-bold">{{ step.title }}</h4>
            <button class="btn btn-white btn-outline-secondary font-weight-normal text-medium p-3" v-if="false">
              <svg class="mr-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16ZM7.555 5.168C7.4044 5.06752 7.22935 5.00981 7.04852 5.00103C6.86769 4.99224 6.68786 5.03272 6.52823 5.11813C6.3686 5.20354 6.23516 5.33068 6.14213 5.48599C6.04909 5.6413 5.99997 5.81896 6 6V10C5.99997 10.181 6.04909 10.3587 6.14213 10.514C6.23516 10.6693 6.3686 10.7965 6.52823 10.8819C6.68786 10.9673 6.86769 11.0078 7.04852 10.999C7.22935 10.9902 7.4044 10.9325 7.555 10.832L10.555 8.832C10.692 8.74068 10.8043 8.61696 10.8819 8.47182C10.9596 8.32668 11.0002 8.16461 11.0002 8C11.0002 7.83539 10.9596 7.67332 10.8819 7.52818C10.8043 7.38304 10.692 7.25932 10.555 7.168L7.555 5.168Z" fill="#404040"/></svg>
              Click to watch tutorial video
            </button>
          </div>
          
            <p class="text-muted lead" v-if="isTaxPage()">
              The tax rate will display on the product details page and on the cart page. To add multiple tax rates or additional fees, please go to the <router-link to="/admin/settings/special-fees" class="text-prmiary text-medium" target='_blank'>
              Special Fees Feature
            </router-link>
            </p>  
            <p v-else class="text-muted lead">
              {{ step.description }}
            </p>
        </div>
        <div class="px-4 pt-4">
          <div class="contents position-relative">
            <div v-if="saving" class="position-absolute d-flex align-items-center justify-content-center w-100 h-100 loader">
              <div class="spinner-border"></div>
            </div>
            <router-view ref="routerView" />
          </div>
        </div>
      </div>
    </div>
    <p class="text-center mb-0 mt-3" :style="`${filteredSteps.length > 1 ? 'width: 980px' : 'width: 100%'}`">Click here to watch <router-link to="/admin/tutorials" target="_blank">Tutorial Videos</router-link></p> 
  </div>
</template>

<script>
  import WizardApiService from '@/api-services/wizard.service';

  export default {
    name: 'WizardFulfillmentSection',
    props: {
      id: {
        default: null
      }
    },
    data() {
      return {
        currentStep: 1,
        steps: [],
        saving: false
      };
    },
    computed: {
      sectionId() {
        return this.$route.matched[this.$route.matched.length - 1].props.id;
      },
      section() {
        return this.$store.state.adminWizardSteps.find(e => e.id == this.sectionId);
      },
      step() {
        return this.steps[this.currentStep - 1] || {};
      },
      filteredSteps() {
        return this.steps.filter(e => !e.hide);
      }
    },
    mounted() {
      this.$store.commit('setAdminWizardSelectedStore', []);
      this.steps = this.section.items;
      if(this.$route.query.step){
        this.currentStep = this.$route.query.step;
      }
      if (this.currentStep != 1) {
        this.pushStep();
      } else if(this.steps[this.currentStep - 1]) {
        WizardApiService.markItemStarted(this.steps[this.currentStep - 1].id);
      } else {
        // some one comes from direct url and step hidden or not found then redirect to setup-wizard
        this.$router.push({name: 'admin-wizard-setup'});
      }
    },
    methods: {
      prevStep() {
        this.currentStep--;
        this.pushStep();
      },
      nextStep() {
        this.saving = true;
        this.$refs.routerView.save().then(async resp => {
          if(resp && (resp === true || resp.status == '200')) {
            let resp = await WizardApiService.markItemCompleted(this.steps[this.currentStep - 1].id, this.$store.state.adminWizardSelectedStore);
            this.$store.commit('markWizardItemCompleted', { sectionId: this.sectionId, stepId: this.steps[this.currentStep - 1].id, percentage: resp.data.percentageCompletion});
            await WizardApiService.getWizardBusinesses().then(resp => {
              this.$store.commit('setAdminWizardBusinesses', resp.data.stores);
              this.$store.commit('setAdminWizardShowCongrats', resp.data.showCongats);
            });
            if(this.currentStep == this.filteredSteps.length) {
              this.$router.push({name: 'admin-wizard-setup'});
            } else {
              this.currentStep++;
              this.pushStep();
            }
          } else {
            this.saving = false;
          }
        });
      },
      async pushStep() {
        if(typeof this.steps[this.currentStep - 1] == 'undefined') {
          // some one comes from direct url and step hidden or not found then redirect to setup-wizard
          return this.$router.push({name: 'admin-wizard-setup'});
        }
        await WizardApiService.markItemStarted(this.steps[this.currentStep - 1].id);
        this.$store.commit('setAdminWizardSelectedStore', []);
        this.$router.push({ query: Object.assign({}, this.$route.query, { step: this.currentStep, store: undefined }) }).catch(() => {});
        this.saving = false;
      },
      isRedirectInRoute(){
        return this.$route.query.redirect && this.$router.getRoutes().findIndex(x => x.name == this.$route.query.redirect) > -1;
      },
      isTaxPage(){
        return this.section.title == "Tax Rate"; 
      },
      loadStep(step){
        this.currentStep = step;
        this.$router.push({ query: Object.assign({}, this.$route.query, { step: this.currentStep, store: undefined }) }).catch(() => {});
      }
    }
  };
</script>

<style scoped lang="scss">
  .loader {
    background: rgba(255, 255, 255, .8);
    z-index: 10;
  }
  .steps {
    gap: 20px;
    min-width: 180px;
    .step {
      border-left: 4px solid #E5E7EB;
      transition: all .3s;
      &.done {
        border-color: var(--brandPrimary);
        .title {
          font-weight: bold;
        }
      }
    }
  }
</style>
