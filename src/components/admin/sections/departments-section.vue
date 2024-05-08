<template>
  <section>
    <div class="container">
      <div class="card card-primary">
        <div class="card-header bg-white">
          <img class="icon-shape" src="/icons/tile-shape.png"/>
          Highlighted Departments
          <span class="edit-department">
            <a><img src="/images/edit.png" alt="Edit" /></a>
            <a><img src="/images/remove.png" alt="Remove" /></a>
          </span>
        </div>
        <div class="card-body d-block disable-drag">
          <swiper ref="departmentsSlider" :options="swiperOption" class="departments-slider">
            <swiper-slide>
              <div class="departments-product">
               <span>
                <img src="/icons/plus.png"/>
                <h4>Add Department</h4>
              </span>
              </div>
            </swiper-slide>
            <swiper-slide v-for="dep in departments" :key="'department-' + dep.dept_id">
              <router-link :to="{ name: 'search', query: { keyword: dep.dept_name } }">
                <div class="card card-primary card-reverse">
                   <span class="edit-dept">
                    <a><img src="/images/edit.png" alt="Edit" /></a>
                    <a><img src="/images/remove.png" alt="Remove" /></a>
                   </span>
                  <div class="card-header">
                    {{ dep.dept_name.toLowerCase() }}
                  </div>
                  <div class="card-body">
                    <img :src="dep.image_url" class="img-fluid" alt="Image" />
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
    data() {
      return {
        swiperOption: {
          loop: true,
          slidesPerView: 'auto',
          spaceBetween: 30,
          draggable: true,
          allowTouchMove: true,
          centeredSlides: false
        }
      };
    },
    computed: {
      departments() {
        let departmentsSection = this.$store.state.homepage.find(x => x.widget_type === '6');
        return departmentsSection.data;
      },
      swiper() {
        return this.$refs.departmentsSlider.swiper;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    margin-right: 5px;

    .edit {
      margin-left: 5px !important;

      a {
        margin: 0 5px !important;
      }
    }
  }

  .card-reverse {
    width: 240px;

    .card-header {
      text-transform: capitalize;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 55px;
      line-height: 23px;
      padding: 5px 10px 8px;
      white-space: normal;

    }

    .card-body {
      height: 250px;
      padding: 30px !important;
      display: flex;

      .departments-slider {
        border-left: none;
        border-right: none;
      }

      > img {
        max-height: 150px;
        margin: auto;
        display: block;
      }
    }
  }

  .card {
    position: relative;

    .card-header {
      display: flex;
      align-items: center;

      .icon-shape {
        padding-right: 10px;
      }

      .edit-department {
        margin-left: 5px;

        a {
          margin: 0 3px;
        }
      }
    }

    .edit-dept {
      position: absolute;
      top: 10px;
      left: 10px;

      a {
        margin: 0 3px;

        img {
          width: 25px;
          height: 25px;
        }
      }
    }
  }

  .departments-product {
    width: 230px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    background: var(--primary);
    mix-blend-mode: normal;
    position: relative;

    span {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      position: relative;

      &::before {
        content: '';
        border: 1px dashed var(--primary);
        border-radius: 5px;
        position: absolute;
        width: 97%;
        height: 97%;
      }

      h4 {
        font-weight: bold;
        font-size: 16px;
        line-height: 19px;
        text-align: center;
        color: var(--primary);
      }

      img {
        width: 22px;
        height: auto;
      }
    }
  }

</style>
