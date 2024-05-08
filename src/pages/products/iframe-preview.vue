<template>
  <div>
    <ProductItem
      v-if="item"
      :item="item"
      :show-buy-button="true"
      :isIframe="true"
      :showAddCart="false"
      ></ProductItem>
  </div>
</template>

<script>
import ProductApiService from '@/api-services/product.service';
import ProductItem from '@/components/product-item';

export default {
  name: 'ProductItemIframePreview',
  components: {
    ProductItem
  },
  mounted() {
    let productId = this.$route.params.productId;
    ProductApiService.getProduct(productId)
      .then(res => {
        this.item = res.data.data;
      })
      .catch(err => console.log('err', err));
  },
  data() {
    return {
      item: null
    };
  }
};
</script>
<style scoped>

</style>
