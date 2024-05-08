<template>
  <section v-if="popularProducts && popularProducts.length">
    <div class="mb-0">
      <h4 class="font-weight-bold mt-md-0 mt-3 mb-3">
        Popular Products
      </h4>
      <div v-if="layout && layout == 'grid'" class="row d-none d-md-flex small-gutters">
        <div v-for="(item, index) in popularProducts" :key="`favorite-product-${index}`" class="col-md-6 col-lg-4 mb-2">
          <product-item :item="item" />
        </div>
      </div>
      <product-swiper :products="popularProducts" :class="{'d-md-none' : layout && layout == 'grid'}" />
    </div>
  </section>
</template>

<script>
  export default {
    name: 'PopularProductsSection',
    props: ['type', 'layout'],
    computed: {
      options() {
        return this.$store.state.homepage.find(x => x.widget_type === this.type);
      },
      popularProducts() {
        return this.$store.state.popularProducts;
      },
    }
  };
</script>
