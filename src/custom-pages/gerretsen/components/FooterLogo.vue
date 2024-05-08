<template>
  <div class="text-center logo-wrapper d-flex flex-column">
    <div>
      <img style="width:150px;height: 150px" :src="settings.logo" alt="Footer Logo">
    </div>
    <span>A division of TAL Holdings LLC</span>
  </div>
</template>

<script>
export default {
  name: "FooterLogo",
  data() {
    return {
      settings: {
        logo: this.$store.state.settings.logo
      }
    };
  },
};
</script>

<style lang="scss" scoped>
.logo-wrapper {
  padding-bottom: 60px;
  img {
    margin-bottom: 20px;
  }
}
</style>
