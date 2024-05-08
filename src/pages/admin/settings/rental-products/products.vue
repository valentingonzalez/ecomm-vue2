<template>
  <div v-if="$ezHasNoPermission('manage_rental_categories')">
    <no-permission-truevalue page="Rental Categories"></no-permission-truevalue>
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="settings-header d-block">
      <div class="settings-header-info d-block">
        <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-12">
              <router-link to="/admin/settings/rental-products" class="d-flex align-items-center">
                <svg class="mr-2" width="8" height="12" xmlns="http://www.w3.org/2000/svg"><path d="M2.38 6.003l4.49-4.49a.65.65 0 00.191-.464.651.651 0 00-.191-.464L6.476.192A.651.651 0 006.012 0a.651.651 0 00-.464.192L.203 5.537a.651.651 0 00-.191.465c0 .177.067.342.191.466l5.34 5.34a.651.651 0 00.464.192c.176 0 .341-.068.465-.192l.393-.393a.657.657 0 000-.928L2.38 6.003z" fill="#000" fill-rule="nonzero"/></svg>
                Rental Products
              </router-link>
            <h1>{{categoryTitle}}</h1> 
            </div>
            <div class="col-lg-3 col-md-3 col-sm-12">
              <input type="text" class="form-control search-input" placeholder="Search Products" @input="() => searchingProducts = true" v-model="ProductsSearch">
            </div>
            <div class="col-lg-2 col-md-2 col-sm-12 custom-mt-1">
              <button @click.prevent="addProduct" class="btn btn-primary save-btn text-nowrap ml-2 ml-md-0">
                <span class="fa fa-plus mr-2"></span> Add Product
              </button>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-12 custom-mt-1">
              <button @click.prevent="removeProduct(0, true)" class="btn btn-outline-primary save-btn text-nowrap ml-2 ml-md-0">
                <svg class="mr-1" width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.667 5.5L15.8 17.642C15.7641 18.1466 15.5383 18.6188 15.1681 18.9636C14.7979 19.3083 14.3109 19.5 13.805 19.5H5.52899C5.02313 19.5 4.53606 19.3083 4.16588 18.9636C3.7957 18.6188 3.56991 18.1466 3.53399 17.642L2.66699 5.5M7.66699 9.5V15.5M11.667 9.5V15.5M12.667 5.5V2.5C12.667 2.23478 12.5616 1.98043 12.3741 1.79289C12.1866 1.60536 11.9322 1.5 11.667 1.5H7.66699C7.40178 1.5 7.14742 1.60536 6.95989 1.79289C6.77235 1.98043 6.66699 2.23478 6.66699 2.5V5.5M1.66699 5.5H17.667" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> 
                Remove All Products
              </button>
            </div>
            <!-- TO DO -- MOVE THIS MODAL TO REUSABLE COMPONENT -->
            <b-modal size="lg" ref="addProductModal" @hidden="resetProductModal" title="" centered hide-footer>
              <template v-slot:modal-header>
                <div class="modal-header">
                  <h5 class="modal-title">
                    <b>Add Product</b>
                  </h5>
                  <button type="button" class="close" @click="hideAddProductModal">×</button>
                </div>
              </template>
              <form @submit.prevent="handleFetchProductSubmit" class="p-3">
                <div class="form-group">
                  <label for="lookupSearchTerm" class="form-label"><b>Product Name/SKU</b></label>
                  <div class="input-group mb-2">
                    <input type="text" class="form-control" v-model="lookupSearchTerm" id="lookupSearchTerm" required :disabled="productLoading">
                    <div class="input-group-append">
                      <button type="submit" class="btn btn-danger" :disabled="productLoading">Look Up <div class="spinner-border spinner-border ml-2 btn-spinner wh-10px" v-if="productLoading"/></button>
                    </div>
                  </div>
                </div>
              </form>
              <div v-if="products && products.length" class="lookup-products-container m-3 border">
                <template v-for="product in products">
                  <div class="product-section row m-3" :key="product.id">
                    <div class="col-md-9 d-flex align-items-center pl-0">
                      <img :src="product.image_url || '/images/default-img.svg'" alt="Product Image" class="img-fluid" style="width: 100px; height: auto;" @error="handleBrokenImage">
                      <div>
                        <h4 class="mt-0 mb-1"><b>{{ product.title }}</b></h4>
                        <p>SKU: <span class="text-muted">{{ product.sku }}</span></p>
                      </div>
                    </div>
                    <div class="col-md-3 d-flex align-items-center justify-content-center">
                      <button class="btn btn-danger" @click="removeProduct(product.id)" :disabled="addingProductToCategory" v-if="productAlreadyAdded(product.category_ids)">
                        <svg class="mr-1 cursor-pointer" width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.667 5.5L15.8 17.642C15.7641 18.1466 15.5383 18.6188 15.1681 18.9636C14.7979 19.3083 14.3109 19.5 13.805 19.5H5.52899C5.02313 19.5 4.53606 19.3083 4.16588 18.9636C3.7957 18.6188 3.56991 18.1466 3.53399 17.642L2.66699 5.5M7.66699 9.5V15.5M11.667 9.5V15.5M12.667 5.5V2.5C12.667 2.23478 12.5616 1.98043 12.3741 1.79289C12.1866 1.60536 11.9322 1.5 11.667 1.5H7.66699C7.40178 1.5 7.14742 1.60536 6.95989 1.79289C6.77235 1.98043 6.66699 2.23478 6.66699 2.5V5.5M1.66699 5.5H17.667" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> 
                        Remove
                        <div class="spinner-border spinner-border ml-2 btn-spinner wh-10px" v-if="addingProductToCategoryId == product.id"/>
                      </button>
                      <button v-else class="btn btn-outline-primary" @click="addProductToCategory(product)" :disabled="addingProductToCategory">Add Product <div class="spinner-border spinner-border ml-2 btn-spinner wh-10px" v-if="addingProductToCategoryId == product.id"/></button>
                      <!-- <button class="btn btn-outline-primary" @click="addProductToCategory(product)" :disabled="addingProductToCategory">Add Product <div class="spinner-border spinner-border ml-2 btn-spinner wh-10px" v-if="addingProductToCategoryId == product.id"/></button> -->
                    </div>
                  </div>
                </template>
              </div>
              <div v-else-if="products && !products.length && !productLoading">
                <div class="text-center">No products found</div>
              </div>
            </b-modal>
        </div>
      </div>
    </div>
    <div class="settings-body">
      <div class="row mb-2">
        <div class="offset-md-8 col-md-3 col-sm-12">
          <VuePagination class="mb-2 mb-sm-0 ml-sm-3" v-if="rentalProducts && rentalProducts.last_page > 1" :pages="rentalProducts.last_page" />
        </div>
      </div>
      <div class="position-relative rental-products">
        <div v-if="searchingProducts" class="spinner-border spinner-border position-absolute mr-2" />
        <template v-if="rentalProducts.data && rentalProducts.data.length">
          <table class="table" :class="{'disabled': searchingProducts}">
              <thead class="border">
                <tr>
                  <th class="border-0" width="45%">Product</th>
                  <th class="border-0" width="20%">SKU</th>
                  <th class="border-0" width="20%">Price</th>
                  <th class="border-0"></th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="rentalProduct in rentalProducts.data" :key="rentalProduct.id">
                <td>
                  <img class="product-image" :src="rentalProduct.image_url || '/images/default-img.svg'" alt="Product Image" @error="handleBrokenImage" />
                  <div class="name text-capitalize text-wrap d-inline-block pl-2" :data-tooltip="rentalProduct.title">{{rentalProduct.title}}</div>
                </td>
                <td>
                  {{rentalProduct.sku}}
                </td>
                <td>
                  <div v-for="rate in filteredRates(rentalProduct)" :key="rate.header">
                    <template v-if="rate.price !='' && rate.price > 0">
                      <template v-if="!(rate.hideCurrencyPrefix && rate.hideCurrencyPrefix === true)">$</template>
                      {{ rate.price }}/{{rate.header}}
                    </template>
                  </div>
                </td>
                <td class="text-right">
                  <!-- <a href="javascript:void(0)" @click="toggleFeaturedProduct(rentalProduct)" class="mr-2 featured" :class="{ 'active': rentalProduct.is_featured }" aria-label="Add as Featured">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><title>Add as Featured</title><g stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><polygon points="12 2.489 15.09 8.751 22 9.755 17 14.629 18.18 21.511 12 18.261 5.82 21.511 7 14.629 2 9.755 8.91 8.751 12 2.489" :fill="rentalProduct.is_featured ? '#FFD700' : '#FFFFFF'" stroke="var(--brandPrimary)" stroke-miterlimit="10"></polygon></g></svg>
                  </a> -->
                  <a href="javascript:void(0)" @click.prevent="goToProductEditor(rentalProduct.sku)" class="small mr-3 ml-1" v-b-tooltip.hover title="Edit" aria-label="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="22" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </a>
                  <a href="javascript:void(0)" class="mr-1" title="Delete" aria-label="Delete" @click="removeProduct(rentalProduct.id)">
                    <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.667 5.5L15.8 17.642C15.7641 18.1466 15.5383 18.6188 15.1681 18.9636C14.7979 19.3083 14.3109 19.5 13.805 19.5H5.52899C5.02313 19.5 4.53606 19.3083 4.16588 18.9636C3.7957 18.6188 3.56991 18.1466 3.53399 17.642L2.66699 5.5M7.66699 9.5V15.5M11.667 9.5V15.5M12.667 5.5V2.5C12.667 2.23478 12.5616 1.98043 12.3741 1.79289C12.1866 1.60536 11.9322 1.5 11.667 1.5H7.66699C7.40178 1.5 7.14742 1.60536 6.95989 1.79289C6.77235 1.98043 6.66699 2.23478 6.66699 2.5V5.5M1.66699 5.5H17.667" stroke="var(--brandPrimary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> 
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <div class="text-center" v-else-if="!searchingProducts && (!rentalProducts.data || !rentalProducts.data.length) ">There are no products to show</div>
      </div>
    </div>
  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import NoPermissionTruevalue from "./../no-permission-truevalue";
  import { debounce } from 'debounce';

  export default {
    name: 'rentalProducts',
    components: {
      NoPermissionTruevalue
    },
    data() {
      return {
        rentalProducts: [],
        searchingProducts: false,
        ProductsSearch: '',
        watchProductsSearch: false,
        productsPage: 1,
        lookupSearchTerm: null,
        productLoading: false,
        products: null,
        addingProductToCategory: false,
        addingProductToCategoryId: null,
      };
    },
    computed: {
      categoryId() {
        return this.$route.params.category_id;
      },
      categoryTitle() {
        return this.$route.params.category_title;
      }
    },
    async mounted() {
      this.ProductsSearch = this.$route.query.search;
      this.fetchProducts();
    },
    methods: {
      handleBrokenImage(event) {
        event.target.src = '/images/default-img.svg';
      },
      goToProductEditor(sku) {
        this.searchingProducts = true;
        this.$router.push(`/admin/settings/product-editor?code=${sku}&type=sku&redirect_back=1`).catch(err => console.log(err));
      },
      fetchProducts() {
        this.searchingProducts = true;
        let params = {categoryId: this.categoryId, page: this.$route.query.page || 1, search: this.ProductsSearch};
        AdminService.getRentalProducts(params).then(res => {
          if(res.data.status == 'success') {
            this.rentalProducts = res.data.data;
          } else {
            this.$swal("Something went wrong", '', 'error');
          }
        }).catch(error => {
          this.$swal(this.getErrorMessage(error), '', 'error');
        }).finally(() => {
          this.searchingProducts = false;
        });
      },
      productAlreadyAdded(categoryIds) {
        return categoryIds.includes(this.categoryId.toString());
      },
      removeCategoryFromProduct(productId) {
        if(!this.products) return;
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.category_ids = product.category_ids.filter(categoryId => categoryId !== this.categoryId.toString());
            this.$set(this.products, this.products.indexOf(product), product);
        }
      },
      addCategoryToProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.category_ids.push(this.categoryId.toString());
            this.$set(this.products, this.products.indexOf(product), product);
        }
      },
      removeProduct(productId=0, removeAll=false) {
        const title = removeAll ? "Remove Products?" : "Remove Product?";
        const text = removeAll 
                                ? `Are you sure you want to remove all products from ${this.categoryTitle}?`
                                : `Are you sure you want to remove this product from ${this.categoryTitle}?`;
        const successMessage = removeAll ? "Products removed successfully" : "Product removed successfully";
        this.$swal({
          title,
          text,
          type: "warning",
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          showCancelButton: true,
        }).then((result) => {
          if(result.value) {
            this.searchingProducts = true;
            this.addingProductToCategoryId = productId;
            this.addingProductToCategory = true;
            AdminService.removeProductFromCategory({category_id: this.categoryId, product_id: productId, remove_all: removeAll}).then(res => {
              if(res.data.status == 'success') {
                this.successToast(successMessage);
                if(removeAll) {
                  this.rentalProducts.data = [];
                } else {
                  this.removeCategoryFromProduct(productId);
                  this.rentalProducts.data = this.rentalProducts.data.filter(product => product.id != productId);
                }
              } else {
                this.$swal("Something went wrong", '', 'error');
              }
            }).catch(error => {
              this.$swal(this.getErrorMessage(error), '', 'error');
            }).finally(() => {
              this.addingProductToCategory = false;
              this.addingProductToCategoryId = null;
              this.searchingProducts = false;
            });
          }
        });
      },
      gotoPage() {
        this.$router.push({ query: Object.assign({}, this.$route.query, { search: this.ProductsSearch, page: this.productsPage }) }).catch(err => console.log(err));
        this.fetchProducts();
      },
      getErrorMessage(error) {
        let errorMessage = "Something went wrong";
        
        if (error.response && error.response.data && error.response.data.errors) {
          
          let firstErrorKey = Object.keys(error.response.data.errors)[0];
          errorMessage = error.response.data.errors[firstErrorKey][0];
        }

        return errorMessage;
      },
      filteredRates(product) {
        const rental_rates = JSON.parse(product.rental_rates);
        return rental_rates != [] ? rental_rates.filter(rate => rate.price != '' && rate.price > 0) : null;
      },
       successToast(toastMessage) {
        this.$swal({
          toast: true,
          position: 'top',
          type: "success",
          html: `<div class="ml-2">${toastMessage}</div>`,
          showConfirmButton: false,
          timer: 3000
        });
      }, 
      resetProductModal() {
        this.lookupSearchTerm = null;
        this.addProductCategory = null;
        this.products = null;
      },
      hideAddProductModal() {
        this.$refs.addProductModal.hide();
      },
      handleFetchProductSubmit() {
        if(this.lookupSearchTerm.length <4) {
          this.$swal("Please enter at least 4 characters", '', 'error');
          return;
        }
        this.productLoading = true;
        AdminService.rentalProductsLookup(this.lookupSearchTerm).then(result => {
          this.productLoading = false;
          if(result.data.status === 'error') {
            this.$swal(result.data.message, '', 'error');
         } else {
            this.products = result.data.data;
          }
        }, error => {
          console.log('error', error);
        }).catch(error => {
          this.$swal(this.getErrorMessage(error), '', 'error');
        });
      }, 
      addProductToCategory(product) {
        const categoryId = this.categoryId;

        let formData = new FormData();
        formData.append("product_id", product.id);
        formData.append("category_id", categoryId);

        // this.hideAddProductModal();
        this.addingProductToCategory = true;
        this.addingProductToCategoryId = product.id;

        AdminService.addProductToCategory(formData).then(resp => {
          if(resp.data.status == 'success') {
            this.successToast("Product added successfully");
            this.addCategoryToProduct(product.id);
            this.rentalProducts.data.push(product);
          } else {
            this.$swal("Something went wrong", '', 'error');
          }
        }).catch(error => {
          this.$swal(this.getErrorMessage(error), '', 'error');
        }).finally(() => {
          this.addingProductToCategory = false;
          this.addingProductToCategoryId = null;
        });
      },
      toggleFeaturedProduct(product) {
        this.searchingProducts = true;
        AdminService.updateFeaturedRentalProduct({category_id: this.categoryId, product_id: product.id, is_featured: product.is_featured ? 0 : 1}).then(res => {
          if(res.data.status == 'success') {
            this.successToast("Product featured successfully");
            
            this.rentalProducts.data.map(rentalProduct => {
              if(rentalProduct.id == product.id) {
                rentalProduct.is_featured = !rentalProduct.is_featured;
              }
            });
          } else {
            this.$swal("Something went wrong", '', 'error');
          }
        }).catch(error => {
          this.$swal(this.getErrorMessage(error), '', 'error');
        }).finally(() => {
          this.searchingProducts = false;
        });
      },
      addProduct() {
        this.$refs.addProductModal.show();
      },
    },
    watch: {
      ProductsSearch: debounce(async function() {
        if(!this.watchProductsSearch) {
          this.watchProductsSearch = true;
          return;
        }
        this.productsPage = 1;
        this.gotoPage();
      }, 1500),
      '$route.query.page'() {
        this.fetchProducts();
      },
    }
  };
</script>

<style lang="scss" scoped>
  .search-input {
    background-image: url(data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPGcgaWQ9IlN5bWJvbHMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9IjAuNSI+CiAgICAgICAgPGcgaWQ9IlNlYXJjaC1iYXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01MzYuMDAwMDAwLCAtMTMuMDAwMDAwKSIgZmlsbD0iIzJGMzU0MCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IlNlYXJjaC1CYXIiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTU0OC41MDgxMTQsMjYuNzQwNTQ4MSBDNTQ4Ljg0OTc5MSwyNy4wODY0ODQgNTQ5LjQwMjA2NiwyNy4wODY0ODQgNTQ5Ljc0Mzc0MywyNi43NDA1NDgxIEM1NTAuMDg1NDE5LDI2LjM5NDYxMjMgNTUwLjA4NTQxOSwyNS44MzQ5ODQ2IDU0OS43NDM3NDMsMjUuNDg5MDQ4NyBMNTQ3LjA0NzQ3NSwyMi43OTQzMTI3IEM1NDcuODEwMDMzLDIxLjc3MjI4MTEgNTQ4LjI2MTQ3MiwyMC41MDQ0NzE5IDU0OC4yNjE0NzIsMTkuMTMxMjE1MyBDNTQ4LjI2MTQ3MiwxNS43NDUwMzg2IDU0NS41MTY2NDgsMTMgNTQyLjEzMDczNiwxMyBDNTM4Ljc0NDgyNCwxMyA1MzYsMTUuNzQ1MDM4NiA1MzYsMTkuMTMxMjE1MyBDNTM2LDIyLjUxNzM5MiA1MzguNzQ0ODI0LDI1LjI2MjQzMDYgNTQyLjEzMDczNiwyNS4yNjI0MzA2IEM1NDMuNTA5MDUyLDI1LjI2MjQzMDYgNTQ0Ljc4MTEzMywyNC44MDc1NTMxIDU0NS44MDUwNzIsMjQuMDM5NzE4MiBMNTQ4LjUwODExNCwyNi43NDA1NDgxIFogTTUzNy43NTE2MzksMTkuMTMxMjE1MyBDNTM3Ljc1MTYzOSwxNi43MTI1MTc3IDUzOS43MTIyMjcsMTQuNzUxNzc1OCA1NDIuMTMwNzM2LDE0Ljc1MTc3NTggQzU0NC41NDkyNDQsMTQuNzUxNzc1OCA1NDYuNTA5ODMzLDE2LjcxMjUxNzcgNTQ2LjUwOTgzMywxOS4xMzEyMTUzIEM1NDYuNTA5ODMzLDIxLjU0OTkxMyA1NDQuNTQ5MjQ0LDIzLjUxMDY1NDggNTQyLjEzMDczNiwyMy41MTA2NTQ4IEM1MzkuNzEyMjI3LDIzLjUxMDY1NDggNTM3Ljc1MTYzOSwyMS41NDk5MTMgNTM3Ljc1MTYzOSwxOS4xMzEyMTUzIFoiIGlkPSJMb3VwZS1JY29uIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=);
    background-repeat: no-repeat;
    background-position: left 10px center;
    font-size: 14px;
    padding-right: 32px !important;
    text-overflow: ellipsis;
    text-indent: 16px;
  }
  @media (max-width: 770px) {
    .custom-mt-1 {
      margin-top: 0.25rem !important;
    }
  }
  .rental-products {
    .spinner-border {
      top: 30px;
      left: 50%;
      transform: transitionX(-50%);
      z-index: 1;
    }
    td {
      vertical-align: middle;
      padding: .5rem;
    }
  }
  .product-image {
    max-width: 81px;
    max-height: 81px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 1px;
  }
  .modal-dialog .modal-header {
      padding: 1rem 1.5rem !important;
      color: #334155;
      border: none;
      background: transparent !important;
  }
  .modal-dialog .modal-header h5 {
      font-size: 28px;
      color: #000;
  }
  .modal-header .close {
      font-size: 1.5rem;
      font-weight: 500;
      line-height: 1;
      color: #161e2e;
      opacity: .5;
      position: absolute;
      right: 42px;
      font-size: 30px;
  }
  .modal-footer {
    border:none !important;
  }
  .product-section {
    border: 1px solid #dee2e6;
    padding: 16px;
    border-radius: 4px;
  }

  .product-section img {
    padding: 4px;
    background: #fff;
    widows: 120px;
  }

  .lookup-products-container{
    max-height: 500px;
    overflow-y: auto;
  }

  .wh-10px {
    width: 10px;
    height: 10px;
  }

  .featured {
    margin-right: 8px;
    border: none;
    background: none;
    
    svg {
      polygon {
        transition: 200ms;
      }
    }

    &:hover {
      &:not(.active) {
        fill-opacity: 0.5
      }
    }
    
    &:active,
    &.active {
      svg {
        polygon {
          transition: 200ms;
          fill: var(--primary);
          stroke: var(--primary);
        }
      }
    }
  }
</style>