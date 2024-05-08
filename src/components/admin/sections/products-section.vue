<template>
  <section>
    <div class="container">
      <div class="card card-primary mb-0">
        <div class="card-header d-flex justify-content-start bg-white">
          <h5 class="section-title">
            <img class="icon-shape" src="/icons/tile-shape.png"/>
            Gardening Tools
            <span class="edit">
              <a><img src="/images/edit.png" alt="Edit" /></a>
              <a><img src="/images/remove.png" alt="Remove" /></a>
            </span>
          </h5>
        </div>
        <div class="card-body offer disable-drag">
          <swiper ref="productsSlider" :options="swiperOptions" class="products-slider">
            <swiper-slide>
              <div class="tools-product">
               <span>
                <img src="/icons/plus.png" alt="Add" />
                <h4>Add Product</h4>
              </span>
              </div>
            </swiper-slide>
            <swiper-slide
              v-for="item in options.data"
              :key="'offer-' + type + '-' + item.id">
              <ProductItem :item="item" :editable="true"/>
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
    name: 'ProductsSection',
    props: ['type'],
    data() {
      return {
        swiperOptions: {
          loop: true,
          slidesPerView: 'auto',
          spaceBetween: 10,
          draggable: true,
          allowTouchMove: true,
          centeredSlides: false
        }
      };
    },
    computed: {
      options() {
        return this.$store.state.homepage.find(x => x.widget_type === this.type);
      },
      swiper() {
        return this.$refs.productsSlider.swiper;
      },
    }
  };
</script>

<style lang="scss" scoped>
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

  .card-body {
    .products-slider {
      border-left: none;
      border-right: none;

      .tools-product {
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
    }

  }
</style>
