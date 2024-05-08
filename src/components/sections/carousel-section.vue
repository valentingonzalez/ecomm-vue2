<template>
  <section class="carousel-slider">
    <div v-if="slides" class="container">
      <b-carousel controls ref="btCarousel" :interval="8000">
        <b-carousel-slide v-for="(slide, index) in slides" :key="'carousel-' + index">
          <a v-if="slide.redirect_url" :href="slide.redirect_url" slot="img" target="_blank" :aria-label="`To ${slide.redirect_url}`">
            <img class="d-block img-fluid w-100" alt="image slot" :src="slide.image" />
          </a>
          <div v-else slot="img">
            <img class="d-block img-fluid w-100" alt="image slot" :src="slide.image" />
          </div>
        </b-carousel-slide>
      </b-carousel>
    </div>
  </section>
</template>
<script>
export default {
  name: 'CarouselSection',
  computed: {
    slides() {
      if(this.$store.state.homepage)
        return this.$store.state.homepage.find(x => x.widget_type === '4').data.images;
      return [];
    }
  }
};
</script>
<style scoped lang="scss">
  .carousel {
    overflow: hidden;
    border-radius: 8px;

    img {
      margin-top: -50%;
    }
  }
</style>
