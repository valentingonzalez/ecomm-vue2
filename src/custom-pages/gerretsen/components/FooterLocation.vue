<template>
  <div class="info-wrapper">
    <h5 class="d-block info-text">
      <template v-if="locations.length === 1">Location</template>
      <template v-else>Locations</template>
    </h5>
    <div v-for="(location, index) in locations" class="location mb-4" :key="index">
      <a target="_blank" :href="location.googleMapsUrl">
        <span class="d-block">{{ location.address }}</span>
        <span class="d-block">{{ location.city }}, {{ location.state }} {{ location.zip }}</span>
      </a>
      <a :href="'tel:'+location.phone">
        <span class="d-block">{{ location.phone }}</span>
      </a>
      <span class="d-block">
        <a target="_blank" :href="location.storeInfoUrl" class="font-weight-bold">
          Store Info
        </a>
        |
        <a target="_blank" :href="location.googleMapsUrl">
          Map
        </a>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "FooterLocation",
  data() {
    return {
      locations: this.$store.state.settings.footer.locations
    };
  },
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

  .location {
    color: #000;
    font-size: 16px;
    a {
      color: #0A5560;
    }
  }

  ul {
    padding-left: 0;
    margin-bottom: 0;
    li {
      padding-bottom: 20px;
    }
    li:last-child {
      padding-bottom: 0;
    }
  }
}
</style>
