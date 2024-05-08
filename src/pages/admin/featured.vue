<template>
    <main>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="card-title d-flex justify-content-between align-items-center">
                        <h4 class="mb-0"><strong>Featured Products</strong></h4>

                        <button @click="openFeaturedProductModal" type="button" class="btn btn-primary btn-sm">
                            Add Featured Product
                        </button>
                    </div>

                    <div class="row mt-3">
                        <div class="col-12">
                            <input type="text" v-model="searchText" class="form-control mb-3" placeholder="Search...">
                        </div>
                    </div>
                    
                    <div class="row mt-3">
                        <div v-if="loadingFeaturedProducts" class="col-12 mb-4">
                            <spinner size="medium" message="Loading featured products..." />
                        </div>
                        <div v-else-if="featuredProducts && featuredProducts.length" v-for="item in featuredProducts" :key="item.sku" class="col-md-3 mb-4">
                            <admin-featured-item @removeFeaturedProduct="removeFeaturedProduct" :item="item"></admin-featured-item>
                        </div>
                        <div class="col-12 text-center" v-else>
                            No products found
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <featured-product-modal @fetchData="fetchData" ref="featuredProductModal"></featured-product-modal>
    </main>
</template>
<script>
import AdminApiService from '@/api-services/admin.service';
import ProductApiService from '@/api-services/product.service';

import featuredProductModal from '../../components/modals/add-featured-product';

import Spinner from 'vue-simple-spinner';

export default {
    name: 'Featured',
    data() {
        return {
            searchText: '',
            loadingFeaturedProducts: false
        };
    },
    components: {
        featuredProductModal,
        Spinner
    },
    computed: {
        featuredProducts() {
            if (this.searchText) {
                const products = this.$store.state.favouriteProducts.filter(product => {
                    const title = product.title.toLowerCase();
                    const searchText = this.searchText.toLowerCase();

                    return title.includes(searchText, 0);
                });

                return products;
            } else {
                return this.$store.state.favouriteProducts;
            }
        }
    },
    async mounted() {
        await this.fetchData();
    },
    methods: {
        async fetchData() {
            this.loadingFeaturedProducts = true;

            await ProductApiService.getFavouriteProducts().then(response => {
                let allProducts = [];

                response.data.data.forEach(item => {
                    item.competitors = null;
                    item.similars = null;
                    item.videos = null;

                    allProducts.push(item);
                });

                this.loadingFeaturedProducts = false;

                this.$store.commit('addProductsRange', allProducts);
                this.$store.commit('setFavouriteProducts', allProducts);
            });
        },
        async removeFeaturedProduct(product) {
            const productIndex = this.featuredProducts.indexOf(product);
            
            await AdminApiService.removeFavouriteProduct(product.upc).then(() => {
                this.featuredProducts.splice(productIndex, 1);
            });
        },
        openFeaturedProductModal() {
            this.$refs.featuredProductModal.showModal();
        },
    }
};
</script>

<style lang="scss">
  h5 {
    font-size: 1rem;
  }
</style>