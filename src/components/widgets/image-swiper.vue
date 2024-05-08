<template>
  <section class="position-relative image-swiper widget" :class="{'editable': editable}">
    <WidgetHeader name="Image Swiper" :id="id" @remove="remove" @updateHidden="updateHidden" :hidden="hidden" :master="master" @updateAssociatedLocations="updateAssociatedLocations" :associatedLocations="associatedLocations" v-if="editable" />
    <div class="d-flex align-items-center justify-between w-100 title-bar mb-3">
      <div class="flex-grow-1 d-flex align-items-center">
        <input v-if="editable" class="form-control mr-5" placeholder="Title for the swiper (optional)" v-model="intTitle" />
        <h5 class="mb-0" v-else-if="title" v-html="title" />
      </div>
      <button v-if="editable" :disabled="loading" @click="addItem" class="btn btn-outline-primary btn-sm d-flex align-items-center">
        <div class="spinner-border-sm spinner-border mr-3" v-if="loading"></div>
        Add{{loading ? 'ing' : ''}} item
      </button>
    </div>

    <div class="no-slides d-flex align-items-center justify-content-center cursor-pointer mb-3" v-if="!slides || !slides.length" @click="addItem">
      <div class="spinner-border spinner-border-sm mr-3" v-if="loading"></div>
      {{
        !loading && `Please, add a slide to activate the widget` || `Uploading image...`
      }}
    </div>
    <div v-if="loading" class="loading-wrapper mb-3">
      <div class="spinner-border"></div>
    </div>
    <div :ref="`imageSlider-${id}`" class="swiper-container align-items-stretch image-slider" :id="`imageSlider-${id}`" :class="{'d-none' : loading}">
      <draggable :ref="`pDraggable-${id}`" class="swiper-wrapper" :list="slides" :group="`imageSwiperGroup-${id}`" :disabled="!editable" @change="onReorder">
        <div class="swiper-slide h-auto" v-for="(item, index) in slides" :key="`imageswiper-${item.title}${index}`">
          <a :href="item.link" :target="$options.filters.isUrl(item.link) ? '_blank' : '_self'" :aria-label="`To ${item.link}`" class="h-100">
            <div class="card p-3 flex-grow-1">
              <div class="edit-buttons ml-3 position-absolute" v-if="editable">
                <a href="#" class="edit-bt" @click.prevent="editItem(item)" aria-label="Edit">
                  <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg"><path d="M10.99 4.307L7.691 1.012 8.02.684a2.33 2.33 0 113.298 3.295l-.328.328zm-1.06 1.06L7.743 7.553l-2.95 2.95c-.374.342-4.189 1.46-4.189 1.46a.43.43 0 01-.567-.567s1.117-3.815 1.46-4.188l2.95-2.95 2.19-2.188L9.93 5.366z" fill="#FFF" fill-rule="evenodd"/></svg>
                </a>
                <a href="#" class="remove-bt" @click.prevent="removeItem(item)" aria-label="Remove">
                  <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-8 -7)" fill-rule="nonzero" fill="none"><circle fill="#E2E2E3" cx="15" cy="15" r="15"/><path d="M21 13v8c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2v-8h12zm-3-6c.6 0 1 .4 1 1v2h3v2H8v-2h3V8c0-.6.4-1 1-1zm-1 2h-4v1h4V9z" fill="#90939A"/></g></svg>
                </a>
              </div>
              <!--<div class="image" :style="{backgroundImage: `url(${item.image})` || ''}"></div>-->
              <img class="img w-100" :class="isMiamiHomeCenter ? 'h-300px' : 'h-100'" :src="item.image" :alt="item.title" />
            </div>
            <div class="text-center mt-3 font-weight-bold" v-if="editable">{{ item.title }}</div>
            <h5 v-else class="font-weight-normal mt-3 text-center">
              {{ item.title }}
            </h5>
          </a>
        </div>
      </draggable>
    </div>
    <div :class="`swiper-button-prev image-swiper-${id}-prev`" slot="button-prev" />
    <div :class="`swiper-button-next image-swiper-${id}-next`" slot="button-next" />
  </section>
</template>

<script>
import draggable from 'vuedraggable';
import Swiper from 'swiper';
import { debounce } from 'debounce';

export default {
  name: 'ImageSwiper',
  props: {
    id: {
      default: null
    },
    slides: {
      default: null
    },
    editable: {
      default: false
    },
    title: {
      default: ''
    },
    autoPlay: {
      default: () => ({
        delay: 3500,
        disableOnInteraction: false
      })
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
  components: {
    draggable
  },
  data() {
    return {
      slide: [],
      intTitle: '',
      swiper: null,
      loading: false,
      uploadingImage: false,
      swiperOptions: {
        spaceBetween: 20,
        slidesPerView: 3,
        draggable: false,
        allowTouchMove: false,
        autoplay: this.editable ? false : this.autoPlay,
        navigation: {
          nextEl: `.image-swiper-${this.id}-next`,
          prevEl: `.image-swiper-${this.id}-prev`
        },
        slideNextClass: `.image-swiper-${this.id}-next`,
        slidePrevClass: `.image-swiper-${this.id}-next`,
        breakpoints: {
          320: {
            centeredSlides: true,
            spaceBetween: 0
          },
          480: {
            draggable: false,
            allowTouchMove: true,
            spaceBetween: 0,
            slidesPerView: 1
          },
          991: {
            slidesPerView: 2,
            spaceBetween: 20
          }
        }
      },
    };
  },
  created() {
    this.intTitle = this.title;
  },
  async mounted() {
    this.swiper = new Swiper(`#imageSlider-${this.id}`, this.swiperOptions);
  },
  methods: {
    stopAutoplay() {
      if(window.innerWidth > 576)
        this.swiper.autoplay.stop();
    },
    startAutoplay() {
      if(window.innerWidth > 576)
        this.swiper.autoplay.start();
    },
    onReorder() {
      this.$emit('onReorder', this.slides);
    },
    addItem() {
      this.$emit('addItem');
    },
    removeItem(item) {
      this.$emit('removeItem', item);
    },
    editItem(slide) {
      this.$emit('editItem', slide);
    },
    remove() {
      this.$emit('remove');
    },
    updateHidden(val) {
      this.$emit('updateHidden', val);
    },
    updateAssociatedLocations(val) {
      this.$emit('updateAssociatedLocations', val);
    },
    isMiamiHomeCenter() {
      return this.$root.$children[0].isMiamiHomeCenter;
    }
  },
  watch: {
    slides() {
      setTimeout(() => {
        this.swiper.update();
      }, 1);
    },
    intTitle: debounce(function(value) {
      this.$emit('updateTitle', value);
    }, 1500)
  }
};
</script>

<style lang="scss" scoped>
  .h-300px {
    height: 300px;
  }
  .image-slider .swiper-wrapper {
    padding-bottom: 20px;
  }
  .card {
    overflow: hidden;
  }
  :deep(.search-wrapper) {
    width: 300px;
    input {
      width: 100%;
      font-size: 14px;
    }
    .autosuggest__results {
      width: 400px;
      right: 0;
      .autosuggest__results_item {
        font-size: 14px;
      }
    }
    .search-suggestion-footer {
      display: none;
    }
  }
  .widget-title {
    font-weight: bold;
  }
 .swiper-slide {
    .swiper-slide {
      width: auto !important;
      height: 332px;
    }
    .image {
      height: 300px;
      background-size: cover;
      background-position: center;
    }
    .img {
      object-fit: contain;
    }
  }
  .swiper-button-disabled {
    opacity: 0;
  }

  .no-slides {
    border: 1px dashed #ef8c8c;
    background: #fff6f6;
    top: 20px;
    height: 250px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .loading-wrapper {
    top: 20px;
    height: 250px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media (max-width: 1500px) {
    .swiper-container.image-slider {
      margin-left: 40px !important;
      margin-right: 40px !important;
    }
  }
  @media (max-width: 576px) {
    h4 {
      font-size: 15px;
    }

    .widget-title {
      text-align: center;
    }

    .swiper-container.image-slider {
      margin: 0 16px !important;
    }

    .swiper-button-prev,
    .swiper-button-next {
      width: 32px;
    }

    .swiper-button-prev {
      left: -16px !important;
    }

    .swiper-button-next {
      right: -16px !important;
    }

    .swiper-slide {
      :deep(.card) {
        margin: 0 auto !important;
        .button-prev,
        .button-next {
          display: none;
        }
        :deep(.image) {
          border-right: 1px solid #f3f3f3;
          .badge.badge-danger {
            padding: 0;
            height: auto;
            background: none;
            color: #dc3545;
            letter-spacing: -.4px;
          }
          .small-text {
            font-size: 12px;
            text-transform: uppercase;
          }
          .add-to-cart {
            .q {
              min-width: 24px;
              height: 24px;
              svg {
                transform: scale(.9);
              }
            }
          }
          img.image {
            margin-bottom: 0;
            max-height: 110px;
          }
          h6 {
            font-size: 12px;
            margin-bottom: 36px;
          }
        }
      }
    }
  }
</style>

