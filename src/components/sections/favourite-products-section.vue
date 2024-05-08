<template>
  <section v-if="favouriteProducts && favouriteProducts.length">
    <div class="mb-0" :class="{'container' : layout != 'grid'}">
      <h4 class="font-weight-bold mt-md-0 mt-3 mb-3">
        {{ $store.state.settings.text.featuredProductText || 'Featured Products' }}
      </h4>
      <div v-if="layout && layout == 'grid'" class="row d-none d-md-flex small-gutters">
        <div v-for="(item, index) in favouriteProducts" :key="`favorite-product-${index}`" class="col-md-6 col-lg-4 mb-2">
          <ProductItem :item="item" />
        </div>
      </div>
      <ProductSwiper :products="favouriteProducts" :class="{'d-md-none' : layout && layout == 'grid'}" />
    </div>
  </section>
</template>

<script>
import ProductApiService from '@/api-services/product.service';

export default {
  name: 'FavouriteProductsSection',
  props: ['layout'],
  computed: {
    options() {
      return this.$store.state.homepage.find(x => x.widget_type === this.type);
    },
    favouriteProducts() {
      return this.$store.state.favouriteProducts;
    }
  },
  async mounted() {
    if(!this.favouriteProducts || !this.favouriteProducts.length) {
      const response = await ProductApiService.getFavouriteProducts();

      let allProducts = [];

      response.data.data.forEach(item => {
        item.competitors = null;
        item.similars = null;
        item.videos = null;

        allProducts.push(item);
      });

      this.$store.commit('setFavouriteProducts', allProducts);

      let allSKUs = [];
      allProducts.forEach(item => {
        allSKUs.push(item.sku);
      });
    }
  }
};
</script>
