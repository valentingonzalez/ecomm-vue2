<template>
  <section class="carousel-slider">
    <div class="container">
      <div class="carousel-header">
        <h5 class="section-title">
          <img class="icon-shape" src="/icons/tile-shape.png"/>
          Carousel
          <span class="edit">
            <a><img src="/images/edit.png" alt="Edit" /></a>
            <a><img src="/images/remove.png" alt="Remove" /></a>
          </span>
        </h5>
      </div>
      <div v-if="slides" class="carousel-slider-wrapper disable-drag">
        <swiper ref="carouselSlider" :options="carouselOptions">
          <swiper-slide v-for="(slide, index) in slides" :key="`carousel-${index}`">
            <img :src="slide.image" class="img-fluid" alt="Slide Image" />
          </swiper-slide>
          <div slot="pagination" class="swiper-pagination"/>
        </swiper>
        <div class="swiper-button-prev" slot="button-prev" @click="swiper.slidePrev" />
        <div class="swiper-button-next" slot="button-next" @click="swiper.slideNext" />
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'CarouselSection',
    data() {
      return {
        carouselOptions: {
          loop: true,
          slidesPerView: 1,
          draggable: true,
          allowTouchMove: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          }
        }
      };
    },
    computed: {
      slides() {
        let carouselSection = this.$store.state.homepage.find(x => x.widget_type === '4');
        return carouselSection.data;
      },
      swiper() {
        return this.$refs.carouselSlider.swiper;
      },
    }
  };
</script>

<style lang="scss" scoped>
  .carousel-header {
    margin-bottom: 15px;
    padding-left: 30px;

    .section-title {
      display: flex;
      align-items: center;
      margin-bottom: 0;

      .icon-shape {
        padding-right: 10px;
      }

      .edit {
        margin-left: 5px;

        a {
          margin: 0 3px;
        }
      }
    }
  }
</style>

