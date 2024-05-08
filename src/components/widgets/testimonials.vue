<template>
  <section class="testimonials widget" :class="{'editable': editable}">
    <WidgetHeader name="Testimonials" :id="id" @remove="remove" @updateHidden="updateHidden" :hidden="hidden" :master="master" @updateAssociatedLocations="updateAssociatedLocations" :associatedLocations="associatedLocations" v-if="editable" />
    <div class="d-flex align-items-center justify-between w-100 title-bar mb-4" v-if="title || editable">
      <div class="flex-grow-1 d-flex align-items-center">
        <input v-if="editable" class="form-control mr-5" placeholder="Title for Testimonials (optional)" v-model="intTitle" />
        <h4 class="mb-0" v-else-if="title" v-html="title"></h4>
      </div>
      <button v-if="editable" @click="addItem" class="btn btn-outline-primary btn-sm d-flex align-items-center">
        Add Testimonial
      </button>
    </div>

    <div v-if="!testimonials.length" class="no-testimonials cursor-pointer" @click="addItem">
      Please, add some testimonials to activate the widget
    </div>
    <swiper ref="testimonialsSlider" :options="swiperOptions" class="slider pb-4 px-5 px-md-0 h-100">
      <swiper-slide v-for="(testimonial, i) in testimonials" :key="`testimonial-${i}`" class="h-auto">
        <TestimonialItem :item="testimonial" @remove="removeItem" :editable="editable" @onChange="onChange" />
      </swiper-slide>
    </swiper>
    <template v-if="testimonials && testimonials.length > 3">
      <div :class="`swiper-button-prev testimonial-swiper-${id}-prev ml-4 ml-md-0`" slot="button-prev"></div>
      <div :class="`swiper-button-next testimonial-swiper-${id}-next mr-4 mr-md-0`" slot="button-next"></div>
    </template>
  </section>
</template>

<script>
import { debounce } from 'debounce';

export default {
  name: 'Testimonials',
  props: {
    title: {
      default: ''
    },
    editable: {
      default: false
    },
    testimonials: {
      default: null
    },
    id: {
      default: null
    },
    master: {
      default: false
    },
    hidden: {
      default: true
    },
    associatedLocations: {
      default: null
    }
  },
  data() {
    return {
      intTitle: '',
      swiperOptions: {
        spaceBetween: 10,
        slidesPerView: this.testimonials.length == 2 ? 2 : 3,
        centeredSlides: this.testimonials.length == 1,
        allowTouchMove: this.testimonials.length > 3,
        navigation: {
          nextEl: `.testimonial-swiper-${this.id}-next`,
          prevEl: `.testimonial-swiper-${this.id}-prev`
        },
        slideNextClass: `.testimonial-swiper-${this.id}-next`,
        slidePrevClass: `.testimonial-swiper-${this.id}-prev`,
        breakpoints: {
          1023: {
            slidesPerView: 2,
          },
          767: {
            slidesPerView: 1,
            spaceBetween: 30
          },
        }
      },
    };
  },
  created() {
    this.intTitle = this.title;
  },
  computed: {
    swiper() {
      return this.$refs.testimonialsSlider.swiper;
    }
  },
  methods: {
    remove() {
      this.$emit('remove');
    },
    addItem() {
      this.$emit('addItem');
    },
    removeItem(item) {
      this.$emit('removeItem', item);
    },
    onChange(item) {
      this.$emit('onChange', item);
    },
    updateHidden(val) {
      this.$emit('updateHidden', val);
    },
    updateAssociatedLocations(val) {
      this.$emit('updateAssociatedLocations', val);
    }
  },
  watch: {
    intTitle: debounce(function(value) {
      this.$emit('updateTitle', value);
    }, 1500),
    testimonials() {
      this.swiper.params.slidesPerView = this.testimonials.length == 2 ? 2 : 3;
      this.swiper.params.centeredSlides = this.testimonials.length == 1;
    }
  }
};
</script>

<style lang="scss">
  .testimonials {
    h4 {
      margin-bottom: 16px;
    }
    .slider {
      margin-top: 15px;
      min-height: 150px;
      .testimonial {
        padding: 24px;
        background: white;
        border-radius: 13px;
        box-shadow: 0 14px 10px 0 rgba(34, 44, 73, 0.04);
        .remove-bt {
          background: #E2E2E3;
          width: 30px;
          height: 30px;
          border-radius: 30px;
          transform: scale(0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: 50%;
          margin-left: -15px;
          top: -15px;
        }
        .message {
          font-size: 18px;
          line-height: 1.4;
          font-weight: normal;
          margin-bottom: 18px;
        }
      }
    }

    &.editable {
      .slider {
        padding: 15px 15px 0 5px;
      }
      .add-bt svg * {
        stroke: var(--primary);
      }
      .add-bt {
        top: 20px;
        width: 50px;
        height: calc(100% - 44px);
        position: absolute;
        right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      [contenteditable] {
        border: 1px dashed #dadada;
      }
      [contenteditable]:focus {
        border: 1px dashed var(--primary) !important;
        outline: none;
      }
    }

    .swiper-button-prev,
    .swiper-button-next {
      position: absolute;
      width: 24px;
    }

    .swiper-button-next {
      right: -16px;
    }

    .swiper-button-prev {
      left: -16px;
    }
  }
  .no-testimonials {
    border: 1px dashed #ef8c8c;
    background: #fff6f6;
    z-index: 2;
    height: calc(100% - 36px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 1023px) {
    .testimonials {
      .slider {
        .testimonial {
          opacity: 0.6;
        }

        .swiper-slide-active {
          .testimonial {
            opacity: 1;
          }
        }
      }
    }
  }
</style>