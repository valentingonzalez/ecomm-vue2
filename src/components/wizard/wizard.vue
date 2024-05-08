<template>
  <div id="wizard">
    <div class="wizard-card" v-if="stepContent">
      <div class="d-flex w-100 justify-content-between">
        <div class="title" v-html="stepContent.name" />
        <a class="link" href="#" @click.prevent="stopWizard">Skip</a>
      </div>
      <div class="body">
        <video class="w-100 mt-3 mb-2 rounded" v-if="stepContent.video" controls="controls" :poster="stepContent.video.cover ? stepContent.video.cover : ''">
          <source :src="stepContent.video.url ? stepContent.video.url : stepContent.video" type="video/mp4">
        </video>
        <div v-html="stepContent.text" />
        <div class="d-flex align-items-center justify-content-between my-3">
          <div class="progress flex-grow-1">
            <div class="progress-bar" role="progressbar" :style="{width: `${progressbarWidth}%`}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <div class="small font-weight-bold ml-3">
            {{ currentStep || '0' }}/{{ totalSteps }}
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <button :disabled="loading" class="btn btn-outline-primary" v-if="currentStep > 1" @click="previousStep">
              <div v-if="loading" class="spinner-border spinner-border-sm mr-2" />Previous
            </button>
          </div>
          <div>
            <button :disabled="loading" class="btn btn-primary" @click="nextStep">
              <div v-if="loading" class="spinner-border spinner-border-sm mr-2" />
                {{ currentStep == totalSteps ? 'Complete' : 'Next'}}
              </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import json from './data.json';
  import jsonPlusPlan from './data-plus-plan.json';
  
  export default {
    name: 'Wizard',
    data() {
      return {
        stepContent: {},
        loading: false
      };
    },
    created() {
      if(this.$route.query.wizard) {
        localStorage.removeItem('wizard');
        this.$parent.wizard = false;
      }
      if(!this.currentStep) {
        let s = this.steps.findIndex(e => e.url == this.$route.path) + 1;
        s = s > 0 ? s : !this.currentStep ? 1 : this.currentStep;
        this.$router.push({ params: this.params, query: Object.assign({}, this.$route.query, { wizard_step: s }) }).catch(err => console.log(err));
      } else {
        this.goToStep();
      }
    },
    computed: {
      json() {
        return this.$store.state.isBasicPlan ? json : jsonPlusPlan;
      },
      currentStep() {
        return Number(this.$route.query.wizard_step);
      },
      step() {
        return this.steps[this.currentStep - 1];
      },
      steps() {
        return this.json.steps;
      },
      totalSteps() {
        return this.steps.length;
      },
      progressbarWidth() {
        return this.currentStep * 100 / this.steps.length;
      },
      params() {
        return this.step ? {...this.step.params} || {} : {};
      }
    },
    methods: {
      previousStep() {
        this.$router.push({ params: this.params, query: Object.assign({}, this.$route.query, { wizard_step: this.currentStep - 1 }) }).catch(err => console.log(err));
      },
      nextStep() {
        if(this.currentStep == this.totalSteps) {
          this.stopWizard();
        }
        this.$router.push({ params: this.params, query: Object.assign({}, this.$route.query, { wizard_step: this.currentStep + 1 }) }).catch(err => console.log(err));
      },
      async goToStep() {
        this.loading = true;
        if(this.step.url && this.$route.path != this.step.url) {
          await this.$router.push({ params: this.params, path: this.step.url, query: Object.assign({}, this.$route.query, { wizard_step: this.currentStep }) });
        } else {
          this.$router.replace({ params: Object.assign({}, this.$route.params, this.params), query: Object.assign({}, this.$route.query, { wizard_step: this.currentStep }) }).catch(err => {
            if (err.name !== 'NavigationDuplicated' && !err.message.includes('Avoided redundant navigation to current location')) {}
          });
        }
        this.loading = false;
        this.stepContent = this.step;
      },
      stopWizard() {
        localStorage.removeItem('wizard');
        this.$router.push({query: {wizard_step: undefined}});
        this.$parent.wizard = false;
      }
    },
    watch: {
      currentStep() {
        this.goToStep();
      }
    }
  };
</script>

<style scoped lang="scss">
  #wizard {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100000000000;
    color: #fff;
    /*pointer-events: none;
    * {
      pointer-events: all;
    }*/
    video {
      object-fit: fill;
    }
    .btn {
      font-weight: bold;
      text-transform: uppercase;
      &-primary,
      &-primary:hover {
        border: none;
        background: #1DB157 !important;
        color: #fff !important;
      }
      &-outline-primary,
      &-outline-primary:hover {
        background: none !important;
        border-color: #1DB157 !important;
        color: #1DB157 !important;
      }
    }
    .wizard-card {
      font-size: 16px;
      position: absolute;
      width: 528px;
      min-height: 196px;
      right: 24px;
      bottom: 24px;
      padding: 24px;

      background: rgba(13, 19, 31, 0.9);
      box-shadow: 0px 4px 2px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(14px);
      border-radius: 12px;
      .title {
        font-size: 24px;
        font-weight: bold;
      }
      :deep(a.link) {
        color: #1DB157 !important;
      }
      .progress {
        background: rgba(255,255,255,.2);
        border-radius: 8px;
        height: 8px;
        .progress-bar {
          background: #1DB157;
        }
      }
    }
    @media (max-width: 768px) {
      .wizard-card {
        max-width: calc(100% - 30px);
        right: 15px;
        left: 15px;
      }
    }
  }
</style>

