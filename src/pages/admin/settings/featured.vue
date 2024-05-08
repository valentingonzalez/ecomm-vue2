<template>
  <div v-if="$ezHasNoPermission('manage_featured_products')">
    <no-permission-truevalue page="Featured Products"></no-permission-truevalue>
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="preloader"></div>
    <div class="settings-header">
      <div class="settings-header-info">
        <div>
          <h1>Featured Products</h1>
          
          <a href="#" @click.prevent="$refs.tutorialModal.show()" class="btn btn-tutorial btn-sm text-medium bg-white btn-action">
            <i class="fa fa-play mr-1"></i> Click to Watch Tutorial Video
          </a>
          <b-modal size="lg" ref="tutorialModal">
            <div slot="modal-header">
              <h5>Featured Products</h5>
            </div>
            <div>
              <video class="w-100" poster="/images/cover-featured-products.jpg" controls>
                <source src="https://storage.googleapis.com/content.ezadtv.com/2020/09/04/5f529330cd321_ecommerce_tutorial_featured_products.mov" type="video/mp4">
              </video>
            </div>
            <div slot="modal-footer">
              <button type="button" class="btn btn-primary" @click="$refs.tutorialModal.hide()">Done</button>
            </div>
          </b-modal>
        </div>
        <button @click="openFeaturedProductModal" type="button" class="btn btn-primary btn-sm">
          Add<span class="d-none d-sm-inline ml-1"> Featured Product</span>
        </button>
      </div>
    </div>
    <div class="settings-body">
      <div class="row small-gutters">
        <div class="col-sm-4">
          <b-form-select 
            size="lg"
            class="store"
            v-model="selectedStore"
            :options="storeLocations"
            value-field="business_id"
            text-field="business_name"
            @change="storeChanged" />
        </div>
        <div class="col-sm-8 mt-2 mt-sm-0">
          <input type="text" v-model="searchText" class="form-control" placeholder="Search...">
        </div>
      </div>
      <div>
        <div class="mt-5" v-if="loadingFeaturedProducts">
          <spinner size="medium" message="Loading featured products..." />
        </div>
        <draggable handle=".handle" class="row mt-3 small-gutters" v-else-if="featuredProducts && featuredProducts.length" :list="featuredProducts" @change="onReorder">
          <div class="col-6 col-md-4 col-xl-3 mb-2" v-for="(item, index) in featuredProducts" :key="index">
            <admin-featured-item @removeFeaturedProduct="removeFeaturedProduct" :item="item"></admin-featured-item>
          </div>
        </draggable>
        <div class="col-12 text-center" v-else>
          No products found
        </div>
      </div>
      <featured-product-modal @fetchData="fetchData" ref="featuredProductModal"></featured-product-modal>
    </div>
  </div>
</template>
<script>
import AdminApiService from '@/api-services/admin.service';
import ProductApiService from '@/api-services/product.service';
import draggable from 'vuedraggable';

import featuredProductModal from '@/components/modals/add-featured-product';

import Spinner from 'vue-simple-spinner';
import NoPermissionTruevalue from "./no-permission-truevalue";

export default {
  name: 'Featured',
  data() {
    return {
      searchText: '',
      loadingFeaturedProducts: false,
      storeLocations: [],
      selectedStore: '',
    };
  },
  components: {
    featuredProductModal,
    Spinner,
    NoPermissionTruevalue,
    draggable
  },
  computed: {
    featuredProducts() {
      if (this.searchText) {
        const products = this.$store.state.favouriteProducts.filter(product => {
          const title = product.title.toLowerCase();
          const searchText = this.searchText.toLowerCase();
          const upc = product.upc.toLowerCase();
          const sku = product.sku.toLowerCase();
          if(upc.includes(searchText, 0)){
            return upc.includes(searchText, 0);
          }else if(sku.includes(searchText, 0)){
            return sku.includes(searchText, 0);
          }else{
            return title.includes(searchText, 0);
          }
        });

        return products;
      } else {
        return this.$store.state.favouriteProducts;
      }
    }
  },
  async mounted() {
    if(this.$ezHasNoPermission('edit_department_mapping')) return;
    await this.getStores();
  },
  methods: {
    async getStores() {
      var self = this;
      this.loadingFeaturedProducts = true;

      await AdminApiService.getStoreLocations().then(response => {
        self.storeLocations = response.data.data;
        self.selectedStore = response.data.selected;
        self.storeChanged();
      });
    },
    async fetchData() {
      if(this.selectedStore == "") {return;}

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
    async storeChanged() {
      localStorage.setItem('selectedStore',this.selectedStore);
      this.fetchData();
    },
    async onReorder() {
      let newProductsOrder = [];
      this.featuredProducts.forEach(item => {
        newProductsOrder.push(item.id);
      });

      await AdminApiService.changeFavouriteProductsOrder({products: newProductsOrder}).then(res => {
        this.$swal({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
            type: "success",
            title: res.data.message
          });
      });
      
    }
  }
};
</script>

<style scoped lang="scss">
  h5 {
  font-size: 1rem;
  }
  
  .store {
    font-size: 1rem;
  }
</style>
