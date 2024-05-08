<template>
  <div class="info-wrapper">
    <span class="d-block info-text">Resources</span>
    <ul class="text-muted">
      <li v-for="(link, index) in getLinks()" :key="index" class="d-block">
        <a :href="link.link" v-text="link.text" :aria-label="`To ${link.link}`" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FooterResources",
  computed: {
    host() {
      return window.location.protocol+'//'+window.location.host;
    }
  },
  methods: {
    getLinks() {
      return [
        {
          text: 'Services',
          link: this.$store.state.settings.logoLink + 'services/'
        },
        {
          text: 'DIY Projects + Tips',
          link: this.$store.state.settings.logoLink + 'diy-projects/'
        },
        {
          text: 'Brand Directory',
          link: this.host+'/brands'
        },
        {
          text: 'Find a Pro',
          link: this.$store.state.settings.logoLink + 'find-a-pro/'
        },
        {
          text: 'Credit Application',
          link: this.$store.state.settings.logoLink + 'credit-application/'
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.info-wrapper {
  padding-bottom: 60px;

  .info-text {
    margin-bottom: 0;
    padding-bottom: 24px;
    font-size: 20px;
    font-weight: bold;
  }

  ul {
    padding-left: 0;
    margin-bottom: 0;

    li {
      padding-bottom: 10px;
      font-size: 16px;
      font-weight: 600;

      a {
        color: #0A5560;
      }
    }
    li:last-child {
      padding-bottom: 0;
    }
  }
}
</style>
