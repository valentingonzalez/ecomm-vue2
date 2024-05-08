<template>
  <section v-if="similarProducts && similarProducts.length">
    <div class="container">
      <div class="mb-0">
        <h4>Customers also purchased</h4>
        <ProductSwiper :products="favouriteProducts" :showAddCart="false" :internalApi="true" />
      </div>
    </div>
  </section>
</template>

<script>
import ProductApiService from '@/api-services/product.service';

export default {
  name: 'SimilarProductsSection',
  props: ['type', 'productSku', 'productId'],
  computed: {
    similarProducts() {
      return this.$store.state.products.find(item => item.sku === this.productSku).similars;
    }
  },
  async mounted() {
    if (!this.similarProducts) {
      ProductApiService.getSimiliarProducts(this.productSku).then(response => {
        let similarProducts = [];
        response.data.data.forEach(item => {
          item.competitors = null;
          item.similars = null;
          item.videos = null;
          similarProducts.push(item);
        });
        this.$store.commit('addProductsRange', similarProducts);
        this.$store.commit('setSimilarProducts', { productId: this.productId, data: response.data.data });
        let allSKUs = [];
        similarProducts.forEach(item => {
          allSKUs.push(item.sku);
        });
      });
    }
  }
};
</script>