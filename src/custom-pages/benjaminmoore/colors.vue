<template>
  <main class="mt-0">
    <div class="bg-alt py-5">
      <div class="container">
        <ColorFamilies />
      </div>
    </div>
    <div class="container py-5">
      <ColorCollection />
    </div>
    <div class="bg-alt py-5">
      <div class="container">
        <ColorTools />
      </div>
    </div>
  </main>
</template>

<script>
  import ColorFamilies from '@/components/benjaminmoore/color-families';
  import ColorCollection from '@/components/benjaminmoore/color-collection';
  import ColorTools from '@/components/benjaminmoore/color-tools';

  export default {
    name: 'ColorsPage',
    components: {
      ColorFamilies,
      ColorCollection,
      ColorTools
    },
    data() {
      return {
      };
    },
    mounted() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
</script>

<style lang="scss" scoped>
  .color-tool {
    overflow: hidden;
    border-radius: 6px;
    .name {
      color: #fff;
    }
  }
</style>