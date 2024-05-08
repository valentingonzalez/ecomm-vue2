<template>
  <div>
    <h1 v-if="showTitle" class="display-4 mb-5 mt-3">Benjamin Moore Color Collections</h1>
    <div class="row">
      <div class="col-6 col-lg-4 mb-3" v-for="color in colorCollections" :key="color.name">
        <router-link :to="`/colors/collection/${color.code}`" class="d-flex flex-column mb-4 text-decoration-none">
          <img :src="color.image" :alt="color.name" />
          <h3 class="mt-3" v-html="color.name"></h3>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showTitle: {
      default: true
    }
  },
  data() {
    return {

    };
  },
  computed: {
    colorCollections() {
      return this.$store.state.paint.collections;
    }
  },
  mounted() {
    if(!this.colorCollections) {
      this.$store.dispatch('setPaint');
    }
  }
};
</script>
