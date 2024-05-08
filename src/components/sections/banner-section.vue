<template>
  <section v-if="bg">
    <img :src="bg" class="w-100" alt="Banner Image" />
  </section>
</template>

<script>
export default {
  name: 'BannerSection',
  props: ['bg']
};
</script>

<style scoped>
  img {
    border-radius: 13px;
  }
</style>