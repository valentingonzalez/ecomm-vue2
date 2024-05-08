<template>
  <b-modal size="lg" class="modal-box" ref="featuredProductModal">
    <div slot="modal-header">
      <h5>Add Featured Product</h5>
    </div>
    <div class="d-block">
      <!--<label>Search For A Product</label>-->
      <label>Enter Product UPC or SKU</label>
      <b-input-group>
        <b-input placeholder="UPC or SKU" v-model="upc" />
        <b-input-group-append>
          <button type="button" class="btn btn-primary" style="height: auto" :disabled="productLoading" @click="searchProduct()">Search</button>
        </b-input-group-append>
      </b-input-group>
      
      <search-suggestions v-if="false" @onSelected="searchInputSelected" hideFooter="true" hideDepartments="true" hideBrands="true" placeholder="Product Name" />

      <div v-if="errorMsg" class="invalid-feedback d-block">{{ errorMsg }}</div>
      <div v-if="productFound" class="product-info mt-4">
        <h4> {{product.title}} </h4>
        <img :src="product.image_url" :alt="product.title | lowerCase" class="product-image img-fluid" />
        <b-form-group label="Select Store:" class="mb-2 mt-2">
          <b-form-checkbox-group
            id="store"
            v-model="selectedStores"
            :options="stores"
            name="store"
            value-field="business_id"
            text-field="business_name"
          ></b-form-checkbox-group>
        </b-form-group>
      </div>
    </div>
    <div slot="modal-footer">
      <button type="button" class="btn btn-primary" :disabled="productLoading || (!productFound)" @click="addFeaturedProduct()"> Add </button>
    </div>
  </b-modal>
</template>

<script>
import AdminApiService from '@/api-services/admin.service';
import searchSuggestions from '@/components/search-suggestions';

export default {
  name: 'FeaturedProductModal',
  data() {
    return {
      upc: '',
      errorMsg: '',
      productLoading: false,
      productFound: false,
      unhide: false,
      stores: [],
      pstores: [],
      product: [],
      selectedStores: []
    };
  },
  components: {
    searchSuggestions
  },
  methods: {
    hideModal() {
      this.resetParams();
      this.$refs.featuredProductModal.hide();
    },
    showModal() {
      this.resetParams();
      this.$refs.featuredProductModal.show();
    },
    resetParams() {
      this.upc =  '';
      this.errorMsg = '';
      this.productLoading = false,
      this.productFound = false,
      this.unhide = false,
      this.stores = [];
      this.pstores = [];
      this.product = [];
      this.selectedStores = [];
    },
    searchInputSelected(selection) {
      this.upc = selection.item.sku;
      this.searchProduct();
    },
    async searchProduct() {
      var self = this;
      self.errorMsg = '';
      self.productLoading = true;
      self.productFound = false;

      if (this.upc) {
        await AdminApiService.searchProduct(this.upc).then(response => {
          if(response.data.found != true) {
            self.errorMsg = 'No Product Found';
            self.productLoading = false;
          } else {
            self.stores = response.data.stores;
            self.pstores = response.data.pstores;
            self.product = response.data.product;
            self.selectedStores = response.data.selected;

            if(self.stores.length > 0) {
              if(self.product.hidden == 1) {
                self.unhideProduct();
              } else {
                self.productFound = true;
                self.productLoading = false;
              }
            } else {
              self.overrideDefault();
            }
          }
        });
      } else {
        this.errorMsg = 'Please enter the UPC';
      }
    },
    async addFeaturedProduct() {
      var self = this;
      self.errorMsg = '';
      self.productLoading = true;
      if (self.upc) {
        if(self.selectedStores.length == 0) {
          self.errorMsg = 'No Stores are selected';
          self.productLoading = false;
          return;
        }
        await AdminApiService.addFavouriteProduct(self.upc, self.selectedStores, self.unhide).then(response => {
          if (response.message == 'invalid_product') {
            self.errorMsg = 'Invalid Product';
          } else {
            self.$emit('fetchData');
            self.hideModal();
          }
          self.upc = '';
        });
      } else {
        this.errorMsg = 'Please enter the UPC';
      }
    },
    overrideDefault() {
      var self = this;
      this.$swal({
        title: 'No Inventory Found',
        text: "No inventory found, are you sure you want to add this?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!'
      }).then((result) => {
        if (result.value) {
          self.stores = self.pstores;
          self.productFound = true;
        }
        self.productLoading = false;
      });
    },
    unhideProduct() {
      var self = this;
      this.$swal({
        title: 'Product Hidden',
        text: "Product is currently hidden, do you want to unhide it?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Unhide it!'
      }).then((result) => {
        if (result.value) {
          self.unhide = true;
          self.productFound = true;
        }
        self.productLoading = false;
      });
    }
  }
};
</script>

<style scoped lang="scss">
  .product-image {
    height: 150px;
    width: 150px;
    float: right;
  }
</style>

