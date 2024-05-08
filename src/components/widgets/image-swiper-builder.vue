<template>
  <div class="position-relative widget-builder">
    <div class="handle">
      <svg width="9" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M3 12v3H0v-3h3zm6 0v3H6v-3h3zM3 6v3H0V6h3zm6 0v3H6V6h3zM3 0v3H0V0h3zm6 0v3H6V0h3z" fill="#BCBCBC" fill-rule="evenodd"/></svg>
    </div>
    <ImageSwiper
      :ref="`imageSwiper-${this.id}`"
      editable="true"
      :id="id"
      :title="title"
      :slides="slides"
      :hidden="hidden"
      :master="master"
      :associatedLocations="associatedLocations"
      @updateHidden="updateHidden"
      @updateTitle="updateTitle"
      @remove="remove"
      @removeItem="removeItem"
      @editItem="editItem"
      @addItem="addItem"
      @onReorder="onReorder"
      @updateAssociatedLocations="updateAssociatedLocations"
    />
    <ImageSwiperModal @saveImageSwiperSlide="saveImageSwiperSlide" ref="imageSwiperModal" />
  </div>
</template>

<script>
import widgetsApiService from '@/api-services/widgets.service';
import ImageSwiperModal from '@/components/modals/add-image-swiper-slide';

export default {
  name: 'ImageSwiperBuilder',
  props: {
    id: {
      default: null
    },
    value: {
      default: null
    },
    master: {
      default: false
    },
    widget: {
      default: null
    }
  },
  components: {
    ImageSwiperModal
  },
  data() {
    return {
      title: '',
      template:
      {
        id: 1,
        title: '',
        image: '',
        link: ''
      },
      slides: [],
      hidden: true,
      associatedLocations: null
    };
  },
  created() {
    let data = this.value ? typeof this.value == 'string' ? JSON.parse(this.value) : this.value : [];
    this.slides = data.slides || [];
    this.hidden = data.hidden;
    this.title = data.title;
    this.associatedLocations = this.widget.associated_locations || null;
  },
  methods: {
    remove() {
      this.$swal({
        title: 'Remove Swiper',
        html: `Are you sure you want to remove this Image Swiper?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          this.$emit('remove', this.id);
        }
      });
    },
    editItem(item) {
      this.$refs.imageSwiperModal.showModal(item);
    },
    removeItem(item) {
      this.$swal({
        title: 'Remove Image Slide',
        html: `Are you sure you want to remove <div class="font-weight-bold text-capitalize">${item.title}</div> from the Product Swiper?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          this.slides.splice(this.slides.findIndex(i => i.id == item.id), 1);
          this.updateWidget();
        }
      });
    },
    addItem() {
      this.$refs.imageSwiperModal.showModal();
    },
    updateHidden(value) {
      if(this.hidden != value) {
        this.hidden = value;
        this.updateWidget();
      }
    },
    updateAssociatedLocations(value) {
      if(this.associatedLocations != value) {
        this.associatedLocations = value;
        this.updateWidget();
      }
    },
    updateTitle(value) {
      if(this.title != value) {
        this.title = value;
        this.updateWidget();
      }
    },
    async updateWidget() {
      let ob = {
        id: this.id,
        value: JSON.stringify({ title: this.title, hidden: this.hidden, slides: this.slides }),
        associated_locations: this.associatedLocations
      };
      await widgetsApiService.update(ob).then(() => {
        /*if(adding)
          this.$refs[`imageSwiper-${this.id}`].swiper.slideTo(this.$refs[`imageSwiper-${this.id}`].swiper.slides.length + 1);*/
      });
      this.$store.commit('updateWidget', ob);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
      this.$swal({
        toast: true,
        position: 'top',
        type: 'success',
        html: `<div class="ml-2">Widget successfully updated</div>`,
        showConfirmButton: false,
        timer: 3000
      });
    },
    onReorder(slides) {
      this.slides = slides;
      this.updateWidget();
    },
    saveImageSwiperSlide(data) {
      // this is the best way I found for creating ids. Such an amateur :/
      if(data.id == null) {
        data.id = 0;
        let item = {...data},
            n    = {id: -1};
        if(this.slides.length)
          n = [...this.slides].reduce((p, c) => (p.id > c.id) ? p : c);
        item.id = n.id + 1;
        this.slides.push(item);
        this.updateWidget(true);
      } else {
        this.slides = this.slides.map(e => e.id == data.id ? data : e);
        this.updateWidget();
      }
      this.$refs.imageSwiperModal.hideModal();
    },
  }
};
</script>

<style lang="scss" scoped>
  :deep(.swiper) {
    .swiper-button-prev,
    .swiper-button-next {
      width: 30px;
      height: 30px;
      background-size: 30px 30px;
    }
    .swiper-button-prev {
      left: -38px;
    }
    .swiper-button-next {
      right: -38px;
    }
  }
  .spinner-wrapper {
    min-height: 150px;
  }
</style>

