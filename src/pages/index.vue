<template>
  <div>
    <HomeBenjaminMoore v-if="isBenjaminMoore" />
    <HomeMain v-else />
  </div>
</template>

<script>
  import HomeBenjaminMoore from '@/pages/home-benjaminmoore';
  import HomeMain from '@/pages/home';
  export default {
    name: 'LandingPage',
    components: {
      HomeBenjaminMoore,
      HomeMain
    },
    computed: {
      isBenjaminMoore() {
        return String(window.__EZ_IS_BENJAMINMOORE).toLowerCase() == 'true' || String(process.env.VUE_APP_IS_BENJAMINMOORE).toLowerCase() == 'true' || false;
      },
    }
  };
</script>
