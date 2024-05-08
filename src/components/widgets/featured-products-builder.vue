<template>
  <div class="position-relative widget-builder">
    <div class="handle">
      <svg width="9" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M3 12v3H0v-3h3zm6 0v3H6v-3h3zM3 6v3H0V6h3zm6 0v3H6V6h3zM3 0v3H0V0h3zm6 0v3H6V0h3z" fill="#BCBCBC" fill-rule="evenodd"/></svg>
    </div>
    <FeaturedProductsSwiper
      :ref="`swiper-${id}`"
      :id="id"
      :loop="loop"
      :autoPlay="false"
      :editable="true"
      :showAddCart="false"
      :internalApi="false"
      :itemsToShow="4"
      :hidden="hidden"
      :master="master"
      @updateHidden="updateHidden"
      @updateLoop="updateLoop"
      @remove="remove" />
  </div>
</template>

<script>
import widgetsApiService from '@/api-services/widgets.service';
import FeaturedProductsSwiper from '@/components/widgets/featured-products-swiper.vue';

export default {
  name: 'FeaturedProducts',
  props: {
    id: {
      default: null
    },
    value: {
      default: null
    },
    master: {
      default: false
    }
  },
  components: {
    FeaturedProductsSwiper
  },
  data() {
    return {
      loop: true,
      hidden: true
    };
  },
  created() {
    let data = this.value ? typeof this.value == 'string' ? JSON.parse(this.value) : this.value : [];
    this.loop = data.loop;
    this.hidden = data.hidden;
  },
  methods: {
    updateLoop(value) {
      if(this.loop != value) {
        this.loop = value;
        this.updateWidget();
      }
    },
    updateHidden(value) {
      if(this.hidden != value) {
        this.hidden = value;
        this.updateWidget();
      }
    },
    async updateWidget() {
      let ob = { id: this.id, value: JSON.stringify({ hidden: this.hidden, loop: this.loop }) };
      await widgetsApiService.update(ob);
      this.$store.commit('updateWidget', ob);
      this.$swal({
        toast: true,
        position: 'top',
        type: 'success',
        html: `<div class="ml-2">Widget successfully updated</div>`,
        showConfirmButton: false,
        timer: 3000
      });
    },
    remove() {
      this.$swal({
        title: 'Remove Swiper',
        html: `Are you sure you want to remove this Featured Products Swiper?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          this.$emit('remove', this.id);
        }
      });
    }
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

