<template>
  <div v-if="$ezHasNoPermission('manage_conersion_pixel')">
    <no-permission-truevalue page="Analytics conversion pixel"></no-permission-truevalue>
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <h1>Analytics conversion pixel</h1>
        <is-saved :param="saving" />
      </div>
    </div>
    <div class="settings-body">
      <form id="socialInputs">
        <div class="d-flex align-items-center align-items-sm-end mb-4">
          <div class="social-img mr-3">
            <img src="/images/social-g-search-console.svg" height="50" alt="G Search Console" />
          </div>
          <div class="form-group mb-0 flex-grow-1">
            <label for="googleSearchConsole">Google Search Console</label>
            <textarea ref="googleSearchConsole" id="googleSearchConsole" placeholder="Google Search Console" rows="4" class="form-control" 
              v-model="googleSearchConsole"
              @blur="saveData"
            ></textarea>
          </div>
        </div>
        <div class="d-flex align-items-center align-items-sm-end mb-4">
          <div class="social-img mr-3">
            <img src="/images/social-g-analytics.svg" height="50" alt="G Analytics" />
          </div>
          <div class="form-group mb-0 flex-grow-1">
            <label for="googleAnalytics">Google Analytics</label>
            <textarea ref="googleAnalytics" id="googleAnalytics" placeholder="Google Analytics" rows="4" class="form-control" 
              v-model="googleAnalytics"
              @blur="saveData"
            ></textarea>
          </div>
        </div>
        <div class="d-flex align-items-center align-items-sm-end mb-4">
          <div class="social-img mr-3">
            <img src="/images/social-facebook.png" height="50" alt="Facebook" />
          </div>
          <div class="form-group mb-0 flex-grow-1">
            <label for="facebookPixel">Facebook Pixel</label>
            <textarea ref="facebookPixel" id="facebookPixel" placeholder="Facebook Pixel" rows="4" class="form-control" 
              v-model="facebookPixel"
              @blur="saveData"
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import AnalyticsService from '@/api-services/analytics.service';
  import NoPermissionTruevalue from "./no-permission-truevalue";

  export default {
    name: 'AnalyticsConversionPixel',
    components: {
      NoPermissionTruevalue
    },
    data() {
      return {
        googleSearchConsole: '',
        googleAnalytics: '',
        facebookPixel: '',
        saving: false
      };
    },
    mounted() {
      if(this.$ezHasNoPermission('manage_conersion_pixel')) return;

      window.onbeforeunload = this.saveData;
      window.onunload = this.saveData;
      this.getData();
    },
    methods: {
      async getData() {
        let pixel = await AnalyticsService.getPixel();
        pixel = pixel.data.data;
        this.googleSearchConsole = pixel.google_search_console;
        this.googleAnalytics = pixel.google_analytics;
        this.facebookPixel = pixel.facebook_pixel;
      },
      async saveData() {
        this.saving = true;
        await AnalyticsService.savePixel({
          google_search_console: this.googleSearchConsole,
          google_analytics: this.googleAnalytics,
          facebook_pixel: this.facebookPixel
        });
        this.saving = false;
      }
    },
    beforeRouteLeave(to, from, next) {
      this.saveData();
      next();
    },
    beforeDestroy() {
      window.removeEventListener('beforeunload', this.saveData);
      window.removeEventListener('unload', this.saveData);
    },
  };
</script>

<style lang="scss" scoped>
  
  textarea {
    resize: none;
  }

  @media (max-width: 500px) {
    #socialInputs {
      .social-img {
        width: 40px;
        display: none;
        img {
          width: 100%;
        }
      }
      .social-img + .form-group {
        flex: 1;
      }
    }
  }
</style>
