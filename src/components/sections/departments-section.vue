<template>
  <section>
    <div class="container">
      <div class="card card-primary">
        <div class="card-header bg-white">
          Highlighted Departments
        </div>
        <div class="card-body d-block">
          <swiper ref="departmentsSlider" :options="swiperOption" class="departments-slider">
            <swiper-slide v-for="dep in departments" :key="`department-${dep.dept_id}`">
              <router-link :to="{ name: 'search', query: { keyword: dep.dept_name } }">
                <div class="card card-primary card-reverse">
                  <div class="card-header">
                    {{ dep.dept_name.toLowerCase() }}
                    <button class="btn btn-secondary px-0" type="button">Shop now</button>
                  </div>
                  <div class="card-body">
                    <img :src="dep.image_url" class="img-fluid" :alt="dep.dept_name" />
                  </div>
                </div>
              </router-link>
            </swiper-slide>
          </swiper>
          <div class="swiper-button-prev" slot="button-prev" @click="swiper.slidePrev()"></div>
          <div class="swiper-button-next" slot="button-next" @click="swiper.slideNext()"></div>
          </div>
        </div>
      </div>
  </section>
</template>

<script>
export default {
  name: 'DepartmentsSection',
  props: ['homepage'],
  data() {
    return {
      swiperOption: {
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 30,
        draggable: true,
        allowTouchMove: true,
        centeredSlides: true
      }
    };
  },
  computed: {
    departments() {
      let departmentsSection = this.homepage.find(x => x.widget_type === '6');
      return departmentsSection.data;
    },
    swiper() {
      return this.$refs.departmentsSlider.swiper;
    }
  }
};
</script>

<style lang="scss" scoped>
.swiper-slide {
  width: auto !important;
}
.card-reverse {
  width: 230px;
  -webkit-box-shadow: 0px 2px 17px 0px rgba(0,0,0,0.3);
  -moz-box-shadow: 0px 2px 17px 0px rgba(0,0,0,0.3);
  box-shadow: 0px 2px 17px 0px rgba(0,0,0,0.3);
  border-radius: 10px;

  .card-header {
    text-transform: capitalize;
    display: grid;
    // -webkit-line-clamp: 2;
    // -webkit-box-orient: vertical;
    grid-template-columns: 60% 40%;
    overflow: hidden;
    height: 70px;
    line-height: 18px;
    font-size: 14px;
    padding: 5px 10px 8px;
    white-space: normal;
    background-color: transparent;
    align-items: center;
    border-top: 5px solid rgba(233, 100, 0, 1);
    .btn {
      font-size: 9px;
      text-transform: uppercase;
      font-weight: bold;
      height: 30px;
      max-width: 80px;
      padding: 6px 0;
    }
  }

  .card-body {
    height: 147px;
    padding: 0px !important;
    display: flex;
    border: 1px solid #eee;
    margin: 15px;
    border-radius: 10px 10px 0px 0px;

    > img {
      max-height: 150px;
      margin: auto;
      display: block;
      box-sizing: content-box;
    }
  }
}

</style>
