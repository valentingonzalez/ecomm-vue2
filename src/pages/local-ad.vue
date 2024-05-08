<template>
  <main>
    <div class="container">
      <div style="background-color: white" ref=iframeWrapper></div>
    </div>
  </main>
</template>

<script>

import Messenger from '@/plugins/messenger';
import HomePageService from '@/api-services/homepage.service';

export default {
  name: 'localAd',
  data() {
    return {
    };
  },
  computed: {
    businessDetails() {
      return Object.entries(this.$store.state.businessDetails).length ? this.$store.state.businessDetails : null;
    },
    storeUrl() {
      return window.location.origin;
    },
  },
  async mounted() {
    if(!this.businessDetails) {
      let r = await HomePageService.getBusinessDetails();
      this.$store.commit('setBusinessDetails', r.data.data);
    }
      let storeguid = this.businessDetails.truevalue_storeguid;
      if(this.businessDetails.about_us && this.businessDetails.about_us.locations)
      {
        let store = this.businessDetails.about_us.locations.find(e => e.id == Number(localStorage.getItem('selectedStore')));
        if(store && store.truevalue_storeguid){
          storeguid = store.truevalue_storeguid;
        }
      }
      // find location
    this.messenger = new Messenger(this.storeUrl, window.parent, this);

    setTimeout(() => {
      this.loadAdPage(storeguid);
    }, 1000);
  },
  methods: {
    loadAdPage(storeguid) {
      shoplocalPlatform.renderIframe(this.$refs.iframeWrapper, {
        country: 'us',
        storeid: '',
        storeRef: storeguid,
        language: 'en',
        configID: 'truevalue_full_config',
        fullExperience: {
          shoppinglist: false,
          coupons: false,
          hidesneakpeek: false
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>
