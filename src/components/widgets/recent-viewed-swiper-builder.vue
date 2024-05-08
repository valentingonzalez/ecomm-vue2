<template>
  <div class="position-relative widget-builder">
    <div class="handle">
      <svg width="9" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M3 12v3H0v-3h3zm6 0v3H6v-3h3zM3 6v3H0V6h3zm6 0v3H6V6h3zM3 0v3H0V0h3zm6 0v3H6V0h3z" fill="#BCBCBC" fill-rule="evenodd"/></svg>
    </div>
    <RecentlyViewed
      :ref="`swiper-${id}`"
      :id="id"
      :loop="loop"
      :autoPlay="false"
      :editable="true"
      :showAddCart="false"
      :internalApi="false"
      :itemsToShow="4"
      :title="title"
      :hidden="hidden"
      :master="master"
      :associatedLocations="associatedLocations"
      @updateHidden="updateHidden"
      @updateAssociatedLocations="updateAssociatedLocations"
      @updateLoop="updateLoop"
      @updateTitle="updateTitle"
      @remove="remove" />
  </div>
</template>

<script>
import widgetsApiService from '@/api-services/widgets.service';
import RecentlyViewed from '@/components/widgets/recent-viewed-swiper.vue';

export default {
  name: 'RecentViewed',
  components: {
    RecentlyViewed
  },
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
      loop: true,
      title: '',
      hidden: true,
      associatedLocations: null
    };
  },
  created() {
    let data = this.value ? typeof this.value == 'string' ? JSON.parse(this.value) : this.value : [];
    this.loop = data.loop;
    this.title = (data.title ? data.title : '');
    this.hidden = data.hidden;
    this.associatedLocations = this.widget.associated_locations || null;
  },
  methods: {
    updateLoop(value) {
      if(this.loop != value){
        this.loop = value;
        this.updateWidget();
      }
    },
    updateHidden(value) {
      if(this.hidden != value){
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
      if(this.title != value){
        this.title = value;
        this.updateWidget();
      }
    },
    async updateWidget() {
      let ob = { 
        id: this.id,
        value: JSON.stringify({ title: this.title, hidden: this.hidden, loop: this.loop }),
        associated_locations: this.associatedLocations
      };
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

