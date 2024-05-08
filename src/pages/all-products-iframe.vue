<template>
  <div>
    <template v-for="e in widgets">
      <div class="container" v-if="e && e.widget_type_id == 2 && e.value.productList && !e.value.hidden" :key="e.id">
        <ProductSwiper v-if="e.widget_type_id == widgetId" :id="e.id" :products="e.value.productList" :widget="e" :autoPlay="5000" :title="e.value.title" :loop="e.value.loop" />
      </div>
      <div class="container" v-if="e && e.widget_type_id == 5 && e.value.slides && e.value.slides.length && !e.value.hidden" :key="e.id">
        <ImageSwiper v-if="e.widget_type_id == widgetId" :id="e.id" :title="e.value.title" :slides="e.value.slides" />
      </div>
      <div class="container" v-if="e && e.widget_type_id == 6 && !e.value.hidden" :key="e.id">
        <FeaturedProductsSwiper v-if="e.widget_type_id == widgetId" :id="e.id" :autoPlay="5000" :loop="e.value.loop" />
      </div>
      <div class="container" v-if="e && e.widget_type_id == 9 && !e.hidden && !e.value.hidden" :key="e.id">
        <BomSwiper v-if="e.widget_type_id == widgetId" :id="e.id" :products="e.value.productList" title="" :loop="e.value.loop" />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'AllProductIframe',
  data() {
    return {
      isIframe: true,
      widgetId: this.$route.params.widgetId
    };
  },
  computed: {
    widgets() {
      if(this.$store.state.widgets) {
        return this.$store.state.widgets.map(e => {
          e.value = e.value == '' || typeof e.value != 'string' ? e.value : JSON.parse(e.value);
          return e;
        }).sort((a, b) => (a.order > b.order) ? 1 : -1);
      }
      return null;
    }
  },
  methods: {}
};

</script>

<style scoped>
  .mr-40{
    margin-right: 40px;
  }
  .mt-10{
    margin-top: 10px;
  }
</style>