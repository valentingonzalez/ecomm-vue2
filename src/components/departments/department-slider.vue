<template>
  <div class="card-body offer">
    <swiper ref="departmentSlider" :options="swiperOptions" class="products-slider">
      <swiper-slide v-for="(children, i) in parent.childrens" :key="children.dept_id">
        <router-link :to="{ name: 'search', query: { keyword: children.name.toLowerCase() } }">
          <div class="col-md-12">
            <div class="product-card">
              <div class="product-img">
                <img :src="children.image_url" :alt="`Slider Image ${i}`" />
              </div>
              <div class="product-title">
                <h6 class="text-capitalize">{{children.name.toLowerCase()}}</h6>
              </div>
            </div>
          </div>
        </router-link>

      </swiper-slide>
    </swiper>

    <div class="swiper-button-prev" slot="button-prev" @click="swiper.slidePrev()"/>
    <div class="swiper-button-next" slot="button-next" @click="swiper.slideNext()"/>
  </div>
</template>

<script>
  export default {
    name: 'DepartmentSlider',
    props: {
      parent: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        swiperOptions: {
          loop: true,
          slidesPerView: 'auto',
          spaceBetween: 0,
          draggable: true,
          allowTouchMove: true,
        },
      };
    },
    computed: {
      swiper() {
        return this.$refs.departmentSlider.swiper;
      },
    }
  };
</script>

