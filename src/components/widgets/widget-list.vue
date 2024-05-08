<template>
  <div>
    <draggable v-if="widgets && widgets.length" :list="widgets" handle=".handle" group="widgetsGroup" @end="onDrop" class="allWidgets">
      <div v-for="e in widgets" :key="e.id" :ref="`widgets-${e.id}`" class="wrapper">
        <CarouselBuilder v-if="e.widget_type_id == 1" :id="e.id" :value="e.value" :master="e.master" :widget="e" class="w" @update="updateWidget" @remove="removeWidget" />
        <ProductSwiperBuilder v-if="e.widget_type_id == 2" :id="e.id" :widget="e" :value="e.value" :master="e.master" class="w" @remove="removeWidget" />
        <TestimonialsBuilder v-if="e.widget_type_id == 3" :id="e.id" :value="e.value" :master="e.master" :widget="e" class="w" @remove="removeWidget" />
        <SubscriptionBuilder v-if="e.widget_type_id == 4" :id="e.id" :value="e.value" :master="e.master" :widget="e" class="w" @remove="removeWidget" />
        <ImageSwiperBuilder v-if="e.widget_type_id == 5" :id="e.id" :value="e.value" :master="e.master" :widget="e" class="w" @remove="removeWidget" />
        <FeaturedProductsBuilder v-if="e.widget_type_id == 6" :id="e.id" :value="e.value" :master="e.master" class="w" @remove="removeWidget" />
        <FroalaEditorBuilder @onEdit="onEditHTML" v-if="e.widget_type_id == 8" :id="e.id" :value="e.value" :master="e.master" class="w" @remove="removeWidget" />
        <ClassicHtmlEditorBuilder v-if="e.widget_type_id == 7" :id="e.id" :value="e.value" :master="e.master" :page="page" :widget="e" class="w" @remove="removeWidget" />
        <ShopByDepartmentBuilder v-if="e.widget_type_id == 9" :id="e.id" :value="e.value" :master="e.master" :widget="e" class="w" @remove="removeWidget" />
        <BmooreHeroBuilder v-if="e.widget_type_id == 10" :id="e.id" :value="e.value" :master="e.master" :widget="e" class="w" @remove="removeWidget" />
        <ColorOfTheYearBuilder v-if="e.widget_type_id == 11" :id="e.id" :master="e.master" :value="e.value" :widget="e" class="w" @remove="removeWidget" />
        <ServicesListBuilder v-if="e.widget_type_id == 14" :id="e.id" :master="e.master" :value="e.value" :widget="e" class="w" @remove="removeWidget" />
        <ColorGridBuilder v-if="e.widget_type_id == 15" :id="e.id" :master="e.master" :value="e.value" :widget="e" class="w" @remove="removeWidget" />
        <RecentViewedBuilder v-if="e && e.widget_type_id == 16" :id="e.id" :value="e.value" :master="e.master" :widget="e" class="w" @remove="removeWidget" />
      </div>
    </draggable>
    <div v-else-if="!widgets">
      Loading widgets
    </div>
    <div class="justify-content-center text-center" v-else-if="widgets && !widgets.length">
      <div class="h4" style="font-style: italic;">
        Start adding widgets to your custom page!
      </div>
      <button class="btn btn-primary btn-block save-btn mt-2" style="max-width: 450px;" type="button" @click="showAddWidgetModal">
        Add Widget
      </button>
    </div>
    <AddWidgetModal @onAdd="onAdd" ref="addWidgetModal" />
  </div>
</template>


<script>
  import draggable from 'vuedraggable';
  import AddWidgetModal from '@/components/modals/add-widget';
  import ProductSwiperBuilder from '@/components/widgets/product-swiper-builder';
  import CarouselBuilder from '@/components/widgets/carousel-builder';
  import TestimonialsBuilder from '@/components/widgets/testimonials-builder';
  import SubscriptionBuilder from '@/components/widgets/subscription-builder';
  import FroalaEditorBuilder from '@/components/froala/froala-editor-builder';
  import FeaturedProductsBuilder from '@/components/widgets/featured-products-builder';
  import ImageSwiperBuilder from '@/components/widgets/image-swiper-builder';
  import ClassicHtmlEditorBuilder from '@/components/widgets/classic-html-editor-builder';
  import ShopByDepartmentBuilder from '@/components/widgets/shop-by-department-builder';
  import BmooreHeroBuilder from '@/components/widgets/bmoore-hero-builder';
  import ColorOfTheYearBuilder from '@/components/widgets/color-of-the-year-builder';
  import ServicesListBuilder from '@/components/widgets/services-list-builder';
  import widgetsApiService from '@/api-services/widgets.service';
  import ColorGridBuilder from '@/components/widgets/color-grid-builder';
  import RecentViewedBuilder from '@/components/widgets/recent-viewed-swiper-builder';

  export default {
    name: 'WidgetList',
    props: {
      widgets: {
        default: []
      },
      page: {
        type: Object,
        default: () => ({})
      }
    },
    components: {
      draggable,
      AddWidgetModal,
      ProductSwiperBuilder,
      CarouselBuilder,
      TestimonialsBuilder,
      SubscriptionBuilder,
      FroalaEditorBuilder,
      FeaturedProductsBuilder,
      ImageSwiperBuilder,
      ClassicHtmlEditorBuilder,
      ShopByDepartmentBuilder,
      BmooreHeroBuilder,
      ColorOfTheYearBuilder,
      ServicesListBuilder,
      ColorGridBuilder,
      RecentViewedBuilder
    },
    computed: {
      isBenjaminMoore() {
        return this.$root.$children[0].isBenjaminMoore;
      },
    },
    mounted() {
      const widgetId = this.$route.query.widget_id ? this.$route.query.widget_id :  0;
      setTimeout(() => {
        if( widgetId && this.$refs[`widgets-${widgetId}`] ){
          this.$refs[`widgets-${widgetId}`][0].scrollIntoView(); 
        }
      }, 1500);
    },
    methods: {
      onDrop() {
        this.$emit('onReorder', this.widgets);
//        this.$emit('onReorder', { id: e.id, order: e.order});
      },
      onAdd(widget) {
        this.$emit('onAdd', widget);
      },
      showAddWidgetModal() {
        this.$refs.addWidgetModal.show();
      },
      async updateWidget(widget) {
        await widgetsApiService.update(widget);
        this.$swal({
          toast: true,
          position: 'top',
          type: 'success',
          html: `<div class="ml-2">Widget successfully updated</div>`,
          showConfirmButton: false,
          timer: 3000
        });
      },
      removeWidget(id) {
        widgetsApiService.delete(id);
        this.$store.commit('deleteWidget', id);
        this.$emit('onRemove', id);
        this.$swal({
          toast: true,
          position: 'top',
          type: 'success',
          html: `<div class="ml-2">Widget successfully removed</div>`,
          showConfirmButton: false,
          timer: 3000
        });
      },
      onEditHTML() {
        this.$emit('onEditHTML');
      }
    },
  };
</script>
