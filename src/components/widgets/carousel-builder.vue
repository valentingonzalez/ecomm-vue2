<template>
  <div class="position-relative widget-builder">
    <div class="handle">
      <svg width="9" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M3 12v3H0v-3h3zm6 0v3H6v-3h3zM3 6v3H0V6h3zm6 0v3H6V6h3zM3 0v3H0V0h3zm6 0v3H6V0h3z" fill="#BCBCBC" fill-rule="evenodd"/></svg>
    </div>
    <Carousel
      :ref="`carousel-${id}`"
      :id="id"
      :title="title"
      :slides="slides"
      :responsive="responsive"
      :editable="true"
      :hidden="hidden"
      :master="master"
      :associatedLocations="associatedLocations"
      @remove="remove"
      @updateHidden="updateHidden"
      @updateAssociatedLocations="updateAssociatedLocations"
      @updateSlides="updateSlides"
      @removeItem="removeItem"
      @updateItem="updateItem"
      @onChange="onChange"
      @updateTitle="updateTitle"
      @updateResponsiveness="updateResponsiveness"
    />
    <CarouselModal ref="carouselModal" @updateItem="updateItem" />
  </div>
</template>

<script>
import CarouselModal from '@/components/modals/add-carousel-slide';
import Carousel from '@/components/widgets/carousel.vue';

export default {
  name: 'CarouselBuilder',
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
  data() {
    return {
      slides: [],
      responsive: false,
      saving: false,
      hidden: true,
      associatedLocations: null
    };
  },
  components: {
    CarouselModal,
    Carousel
  },
  created() {
    let data = this.value ? typeof this.value === 'string' ? JSON.parse(this.value) : this.value : [];
    this.slides = data.value || [];
    this.title = data.title;
    this.hidden = data.hidden;
    this.responsive = data.responsive || false;
    this.associatedLocations = this.widget.associated_locations || null;
  },
  methods: {
    remove() {
      this.$swal({
        title: 'Remove Carousel',
        html: `Are you sure you want to remove this Carousel?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if(result.value) {
          this.$emit('remove', this.id);
        }
      });
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
    updateSlides(slides) {
      if(this.slides != slides) {
        this.slides = slides;
        this.updateWidget();
      }
    },
    updateResponsiveness(value) {
      if(this.responsive != value) {
        this.responsive = value;
        this.updateWidget();
      }
    },
    updateTitle(value) {
      if(this.title != value) {
        this.title = value;
        this.updateWidget();
      }
    },
    updateWidget() {
      this.saving = true;
      this.$emit('update', { id: this.id, value: JSON.stringify({ title: this.title, value: this.slides, hidden: this.hidden, responsive: this.responsive}), associated_locations: this.associatedLocations });
      this.saving = false;
    },
    removeItem(item) {
      this.$swal({
        title: 'Remove Slide',
        html: `Are you sure you want to remove this Slide?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then(result => {
        if (result.value) {
          this.$swal({
            toast: true,
            position: 'top',
            type: 'success',
            html: `<div class="ml-2">Slide removed</div>`,
            showConfirmButton: false,
            timer: 3000
          });
          this.slides.splice(this.slides.findIndex(i => i.image == item.image), 1);
          this.slides = this.slides.map((e, i) => {
            e.id = `${this.id}${i}`;
            return e;
          });
          this.updateWidget();
        }
      });
    },
    updateItem(item) {
      if(!item.id) {
        item.id = `${this.id}${this.slides.length+1}`;
        this.slides.push(item);
        this.updateWidget(true);
      } else {
        this.slides = this.slides.map(e => e.id == item.id ? item : e);
        this.updateWidget(false);
      }
    },
    onChange() {
      this.updateWidget();
    }
  }
};
</script>

<style lang="scss" scoped>
  :deep(.carousel-slider) {
    .carousel-item {
      max-height: 300px;
    }
    .no-slides {
      height: 300px;
      border: 1px dashed #ef8c8c;
      background: #fff6f6;
      cursor: pointer;
    }
  }
</style>


