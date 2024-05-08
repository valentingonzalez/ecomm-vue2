<template>
  <div class="info-wrapper">
    <h5 class="d-block info-text">
      About 
      
      <template v-if="$store.state.settings.businessName === 'Gerretsen Building Supply'">Gerretsen</template>
      <template v-else-if="$store.state.settings.businessName === 'Lake Chelan Building Supply'">LCBS</template>
      
    </h5>
    <ul class="text-muted">
      <li v-for="(link, index) in getLinks()" :key="index" class="d-block">
        <a :href="link.link" v-text="link.text" :aria-label="`To ${link.link}`" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FooterAboutInfo",
  computed: {
    host() {
      return this.$store.state.settings.logoLink;
    }
  },
  methods: {
    getLinks() {
      let links = [
        {
          text: 'Our Story',
          link: this.host+'our-story'
        },
        {
          text: 'Careers',
          link: this.host+'careers'
        },
        {
          text: 'Policies + Military Discount',
          link: this.host+'policies-military-discount/'
        }
      ];

      if (this.$store.state.settings.businessName === 'Gerretsen Building Supply') {
        links.push({
          text: 'Contact Us',
          link: this.host+'contact-us/'
        });
      }

      return links;
    }
  }
};
</script>

<style lang="scss" scoped>
.info-wrapper {

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
