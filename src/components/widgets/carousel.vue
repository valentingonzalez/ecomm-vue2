<template>
  <section class="carousel-slider widget" :class="{'editable': editable}">
    <WidgetHeader name="Carousel" :id="id" @remove="remove" @updateHidden="updateHidden" :hidden="hidden" :master="master" @updateAssociatedLocations="updateAssociatedLocations" :associatedLocations="associatedLocations" v-if="editable" />
    <div class="d-flex align-items-center justify-between w-100 title-bar mb-2" v-if="editable || title">
      <div class="flex-grow-1 d-flex align-items-center">
        <input v-if="editable" class="form-control mr-4" placeholder="Title for the carousel (optional)" v-model="intTitle" />
        <h4 class="mb-0" v-else-if="title" v-html="title" />
      </div>
      <button v-if="editable" :disabled="loading" @click="showSlideModal" class="btn btn-outline-primary btn-sm d-flex align-items-center">
        <div class="spinner-border-sm spinner-border mr-3" v-if="loading"></div>
        Add{{loading ? 'ing' : ''}} slide
      </button>
    </div>
    <div class="no-slides d-flex align-items-center justify-content-center" v-if="!slides || !slides.length" @click="showSlideModal">
      <div class="spinner-border spinner-border-sm mr-3" v-if="loading"></div>
      {{ !loading && `Please, add a slide to activate the widget` || `Uploading image...` }}
    </div>
    
    <b-carousel v-else :controls="slides.length > 1" :ref="`btCarousel-${id}`" :interval="editable ? 0 : interval">
      <button :style="editable ? 'left: 74px; top: 6.5px;' : ''" class="pause-bt d-flex align-items-center justify-content-center bg-white rounded-circle position-absolute border-0 m-3" @click="pauseCarousel" :aria-label="interval ? 'Pause Carousel' : 'Play Carousel'">
        <img v-if="interval" src="https://storage.googleapis.com/content.ezadtv.com/2024/02/02/65bd6af2b1957_svg2.svg" alt="Pause">
        <img v-else src="https://storage.googleapis.com/content.ezadtv.com/2024/02/02/65bd6ab80c473_svg1.svg" alt="Play">
      </button>
      <b-carousel-slide v-for="(slide, i) in slides" :key="`carousel-${i}`">
        <div class="w-100 position-relative" slot="img">
          <a href="#" class="bt edit-bt" @click.prevent="showSlideModal(slide)" v-if="editable" v-b-tooltip.hover title="Edit Slide" aria-label="Edit Slide">
            <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg"><path d="M10.99 4.307L7.691 1.012 8.02.684a2.33 2.33 0 113.298 3.295l-.328.328zm-1.06 1.06L7.743 7.553l-2.95 2.95c-.374.342-4.189 1.46-4.189 1.46a.43.43 0 01-.567-.567s1.117-3.815 1.46-4.188l2.95-2.95 2.19-2.188L9.93 5.366z" fill="#FFF" fill-rule="evenodd"/></svg>
          </a>
          <a href="#" class="bt remove-bt" @click.prevent="removeItem(slide)" v-if="editable" v-b-tooltip.hover title="Remove Slide" aria-label="Remove Slide">
            <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-8 -7)" fill-rule="nonzero" fill="none"><circle fill="#E2E2E3" cx="15" cy="15" r="15"/><path d="M21 13v8c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2v-8h12zm-3-6c.6 0 1 .4 1 1v2h3v2H8v-2h3V8c0-.6.4-1 1-1zm-1 2h-4v1h4V9z" fill="#90939A"/></g></svg>
          </a>
          <form @submit.prevent="onChange" class="url-input-wrapper d-flex" ref="urlInputWrapper" v-if="editable" :class="{'visible':editingLink}">
            <input ref="urlInput" type="text" placeholder="add a url to point to" class="form-control url-input mr-2" v-model="slide.redirect_url" />
            <button type="submit" class="btn btn-primary">Save</button>
            <a href="#" class="close-bt position-absolute" @click.prevent="hideLinkEditor(slide)" aria-label="Hide Link Editor">
              <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13 1L1 13m12 0L1 1" stroke="#FFF" stroke-width="2" fill="none" fill-rule="evenodd" opacity="1" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </form>
          <template v-if="!responsive">
            <a v-if="slide.redirect_url" :href="slide.redirect_url" target="_blank" :aria-label="`To ${slide.redirect_url}`">
              <img :alt="`Carousel image ${i + 1}`"
                   :src="screenWidth <= 480 ? (slide.imageMobile || slide.image) : slide.image"
                   :width="screenWidth <= 480 ? (slide.widthMobile || slide.width) : slide.width"
                   :height="screenWidth <= 480 ? (slide.heightMobile || slide.height) : slide.height"
                   class="d-block img-fluid w-100">
            </a>
            <img v-else :alt="`Carousel image ${i + 1}`"
                 :src="screenWidth <= 480 ? (slide.imageMobile || slide.image) : slide.image"
                 :width="screenWidth <= 480 ? (slide.widthMobile || slide.width) : slide.width"
                 :height="screenWidth <= 480 ? (slide.heightMobile || slide.height) : slide.height"
                 class="d-block img-fluid w-100" :style="imageStyle">
          </template>
        </div>
      </b-carousel-slide>
    </b-carousel>
    <div class="mt-5" v-if="editable && slides.length">
      <div class="h6">Change slides order:</div>
      <draggable tag="ul" :list="slides" class="slide-thumbs mt-1" @change="onReorder">
        <li class="slide-thumb mr-2" v-for="(slide, i) in slides" :key="`slide-thumb-${i}`" :style="{backgroundImage: `url('${slide.image}')`}" @click="goToSlide(i)" />
      </draggable>
    </div>
  </section>
</template>
<script>
import { debounce } from 'debounce';
import draggable from 'vuedraggable';

export default {
  name: 'ImageCarousel',
  props: {
    id: {
      default: null
    },
    editable: {
      default: false
    },
    slides: {
      default: []
    },
    title: {
      default: ''
    },
    responsive: {
      default: false
    },
    hidden: {
      default: false
    },
    master: {
      default: false
    },
    imageStyle: {
      default: ''
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
      loading: false,
      editingLink: false,
      prevUrl: '',
      intTitle: '',
      intResponsive: false,
      screenWidth: window.innerWidth,
      interval: 6500
    };
  },
  created() {
    this.intTitle = this.title;
    this.intResponsive = this.responsive;
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
    });
  },
  computed: {
    carousel() {
      return this.$refs[`btCarousel-${this.id}`];
    }
  },
  methods: {
    pauseCarousel() {
      if(this.interval == 0) {
        this.carousel.next();
      }
      this.interval = this.interval == 0 ? 6500 : 0;
    },
    goToSlide(index) {
      this.carousel.setSlide(index);
    },
    onReorder(a) {
      let slides = this.slides.map((e, i) => {
        e.sequence = i;
        return e;
      });
      this.goToSlide(a.moved.newIndex);
      this.$emit('updateSlides', slides);
    },
    showSlideModal(slide = null) {
      this.$parent.$refs.carouselModal.search = '';
      this.$parent.$refs.carouselModal.showModal(slide);
    },
    preventNav(evt) {
      if (!this.loading) return;
      evt.preventDefault();
      evt.returnValue = '';
    },
    showLinkEditor(slide) {
      this.editingLink = true;
      this.prevUrl = slide.redirect_url;
    },
    hideLinkEditor(slide) {
      this.editingLink = false;
      setTimeout(() => {
        slide.redirect_url = this.prevUrl;
        this.prevUrl = '';
      }, 300);
    },
    remove() {
      this.$emit('remove');
    },
    removeItem(slide) {
      this.$emit('removeItem', slide);
    },
    updateItem(data) {
      this.$emit('updateItem', data);
    },
    updateHidden(val) {
      this.$emit('updateHidden', val);
    },
    updateAssociatedLocations(val) {
      this.$emit('updateAssociatedLocations', val);
    },
    onChange() {
      this.editingLink = false;
      this.$emit('onChange');
    },
  },
  beforeMount() {
    window.addEventListener('beforeunload', this.preventNav);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.preventNav);
  },
  watch: {
    intTitle: debounce(function(value) {
      this.$emit('updateTitle', value);
    }, 1500)
  }
};
</script>
<style lang="scss" scoped>
  .carousel {
    overflow: hidden;
    border-radius: 13px;
    :deep(.carousel-control-next),
    :deep(.carousel-control-prev) {
      filter: drop-shadow(0px 0px 2px rgba(0,0,0,.8));
      outline: dotted 2px transparent !important;
      width: 10%;
      margin: 4px;
      &:focus-visible {
        .carousel-control-next-icon,
        .carousel-control-prev-icon{
          outline: 2px solid var(--primary) !important;
          border-radius: 50%;
          box-shadow: 0px 0px 10px 4px rgb(0 0 0);
        }
      }
    }
    .pause-bt {
      z-index: 10;
      width: 26px;
      height: 26px;
      box-shadow: 0 2px 2px rgba(0,0,0,.3);
    }
    @media (max-width: 575px) {
      border-radius: 6px;
    }

    a.bt {
      width: 30px;
      height: 30px;
      border-radius: 30px;
      transform: scale(.85);
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 20px;
    }

    .remove-bt {
      background: #E2E2E3;
      left: 54px;
      z-index: 3;
    }
    .edit-bt {
      background: var(--primary);
      left: 20px;
      z-index: 3;
      svg {
        * {
          fill: #fff;
        }
      }
    }
    .no-slides {
      height: 300px;
      border: 1px dashed #ef8c8c;
      background: #fff6f6;
      cursor: pointer;
    }
    .slide-img {
      min-width: 100%;
      height: 480px;
      background-size: cover;
      background-position: center;
    }
    .url-input-wrapper {
      transition: opacity .3s;
      opacity: 0;
      background: rgba(0,0,0,.8);
      width: 100%;
      height: 100%;
      z-index: 1000;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      .close-bt {
        top: 15px;
        right: 15px;
      }
      &.visible {
        opacity: 1;
        pointer-events: all;
      }
    }
    .url-input {
      max-width: 400px;
      text-align: center;
    }
  }
  .slide-thumbs {
    list-style: none;
    display: flex;
    padding: 0;
    width: 100%;
    overflow: auto;
    .slide-thumb {
      border: 1px solid #ccc;
      width: 80px;
      min-width: 80px;
      height: 40px;
      cursor: move;
      background-size: cover;
      background-position: center;
    }
  }

  @media (max-width: 991px) {
    .carousel {
      .slide-img {
        min-height: 332px;
        height: auto;
      }
    }
  }
</style>
