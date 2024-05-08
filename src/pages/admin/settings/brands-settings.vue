<template>
  <div v-if="$ezHasNoPermission('edit_brands_settings')">
    <no-permission-truevalue page="Brands Settings"></no-permission-truevalue>
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <h1>Brands Settings</h1>
        <is-saved :param="saving" />
      </div>

      <p class="settings-description">Edit settings for the brands that display on your site</p>
    </div>
    <div class="settings-body">
      <div class="row">
        <div class="col-lg-4 col-sm-6 mb-4 mb-lg-0">
          Show Brands In Navigation
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" false-value="1" true-value="0" v-model="showBrandsInNav" id="show_brands_nav" @change="disableBrandsNav()">
            <label class="custom-control-label mt-2" for="show_brands_nav" v-html="showBrandsInNav == 1 ? 'Hide' : 'Show'"/>
          </div>
        </div>
        <div class="col-lg-4 col-sm-6 mb-4 mb-lg-0">
          Brands Filter in Search Results
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" v-model="showBrandsFilter" id="show_brands_filter" @change="updateBrandsSearchFilter()">
            <label class="custom-control-label mt-2" for="show_brands_filter" v-html="showBrandsFilter ? 'Enabled' : 'Disabled'"/>
          </div>
        </div>
        <div class="col-lg-4 col-sm-6">
          Show Brand Logos
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" v-model="showBrandLogos" id="show_brand_logos" @change="updateBrandsShowLogo()">
            <label class="custom-control-label mt-2" for="show_brand_logos" v-html="showBrandLogos ? 'Enabled' : 'Disabled'"/>
          </div>
        </div>
        
      </div>
    </div>

    <div class="settings-body">
      <div class="pt-0 pt-lg-3">
        <h6>Brands</h6>
      </div>
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <div v-if="stores && stores.length > 1">
            <select class="form-control w-auto" v-model="selectedStore" @change="getBrands" >
              <option v-for="s in stores" :key="s.id" :value="s.id">
                {{ s.name }}{{ s.partner_business == null || s.partner_business == s.id ? ' (primary)' : ''}}
              </option>
            </select>
          </div>
        </div>
        <b-dropdown v-if="!isLoading" id="bulk-actions-dropdown" dropleft text="Bulk Actions" class="">
          <b-dropdown-item @click="disableEnableAllBrands(true)">
            Disable All Brands
          </b-dropdown-item>
          <b-dropdown-item @click="disableEnableAllBrands(false)">
             Enable All Brands
          </b-dropdown-item>
        </b-dropdown>
        
      </div>
      <div class="d-flex flex-column flex-md-row pt-2 justify-content-between align-items-center heading pb-2">
        <input type="text" autocomplete="off" v-model="brandSearchText" aria-label="Search Brand" placeholder="Search Brand" name="searchKey" class="form-control search-input" />
        <VuePagination class="my-2" v-if="totalPages > 1" :pages="totalPages" />
      </div>
      <div class="pt-1 pt-lg-3">
        <div class="d-flex justify-content-center mt-4" v-if="isLoading">
          <div class="spinner-border"></div>
        </div>
        <template v-else-if="brands && brandsList.length">
          <div v-for="(brand, index) in brandsList" :key="brand.brand_id" class="brand d-flex pb-2 py-2 border-bottom justify-content-between align-items-center">
            <div class="d-flex align-items-start align-items-md-center flex-column mt-1">
              <div class="img-wrapper rounded border">
                <img :src="brand.custom_logo ? brand.custom_logo : brand.image" width="40" class="rounded" :alt="brand.altTextLogo" :ref="`brand-img-${index}`" />
                <br />
              </div>
              <a href="#" class="d-block alias-btn text-tiny mt-1" @click.prevent="changeBrandLogo(brand, index)">Change Logo</a>
            </div>
            <div class="d-flex align-items-start align-items-md-center flex-column mt-1 ml-1 ml-md-3">
              <div class="carousel-icon-wrapper" :class="{'bg-greyed' : !brand.carousel || (brand.carousel && brand.carousel.length == 0) }">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 26 15" fill="none">
                  <path d="M8.5 9L5 13.5V14H21V11.5L16.5 6L11.5 12L8.5 9Z" :fill="brand.carousel && brand.carousel.length > 0 ? '#000000' : '#94A3B8'"/>
                  <path d="M20 1H6C5.44772 1 5 1.44772 5 2V13C5 13.5523 5.44772 14 6 14H20C20.5523 14 21 13.5523 21 13V2C21 1.44772 20.5523 1 20 1Z" :stroke="brand.carousel && brand.carousel.length > 0 ? '#000000' : '#94A3B8'" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="square"/>
                  <path d="M1 1H2C2.55228 1 3 1.44772 3 2V13C3 13.5523 2.55228 14 2 14H1" :stroke="brand.carousel && brand.carousel.length > 0 ? '#000000' : '#94A3B8'" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="square"/>
                  <path d="M25 1H24C23.4477 1 23 1.44772 23 2V13C23 13.5523 23.4477 14 24 14H25" :stroke="brand.carousel && brand.carousel.length > 0 ? '#000000' : '#94A3B8'" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="square"/>
                  <path d="M11.0871 6.17393C11.9036 6.17393 12.5654 5.51209 12.5654 4.69567C12.5654 3.87925 11.9036 3.21741 11.0871 3.21741C10.2707 3.21741 9.60889 3.87925 9.60889 4.69567C9.60889 5.51209 10.2707 6.17393 11.0871 6.17393Z" :fill="brand.carousel && brand.carousel.length > 0 ? '#000000' : '#94A3B8'"/>
                </svg>
              </div>
              <div class="d-flex flex-row">
                <a class="d-flex alias-btn text-tiny mt-1" href="#" @click.prevent="showCarouselModal(brand)">{{brand.carousel && brand.carousel.length > 0 ? 'Edit' : 'Add Carousel'}}</a> 
                <span v-if="brand.carousel && brand.carousel.length > 0 " class="mx-1 text-tiny mt-1 ">-</span> 
                <a v-if="brand.carousel && brand.carousel.length > 0 " class="d-flex alias-btn text-tiny mt-1" href="#" @click.prevent="deleteCarousel(brand)">
                  <span v-if="brand.deletingCarousal">
                    <div class="spinner-border" style="width: 0.75rem; height: 0.75rem; "></div>
                    Deleting
                  </span>
                  <span v-else>Delete</span>
                </a>
              </div>
            </div>
            <div class="flex-grow-1 ml-md-3 title">
              <span class="mt-1 font-weight-bold">{{ brand.brand_name }}
                <br> <span class="mt-1 small" v-if="brand.alias">( Alias: {{brand.alias}} )</span>
                <br> <span class="mt-1 small">( Alt Text for Logo: {{brand.altTextLogo || brand.brand_name }} )</span>
              </span>
            </div>
            <div class="brand-options ml-n4 ml-md-0 d-flex flex-column flex-md-row align-items-end align-items-md-center justify-content-end">
              <div class="custom-control custom-switch mr-md-3" v-if="brand.hidden == 1">
                <input type="checkbox" class="custom-control-input" v-model="brand.products_hidden" false-value="1" true-value="0" :id="'prod-hidden'+brand.brand_id" @change="hideProductsFromBrand(brand.brand_id, brand.products_hidden)">
                <label class="custom-control-label" :for="'prod-hidden'+brand.brand_id" v-html="brand.products_hidden == 0 ? 'Show Products' : 'Hide Products'"/>
              </div>
              <div class="custom-control custom-switch">
                <input type="checkbox" class="custom-control-input" v-model="brand.hidden" false-value="1" true-value="0" :id="'hidden'+brand.brand_id" @change="updateBrandHidden(brand.brand_id, brand.hidden)">
                <label class="custom-control-label" :for="'hidden'+brand.brand_id" v-html="brand.hidden == 1 ? 'Disabled' : 'Enabled'"/>
              </div>
              <a class="ml-md-3" href="#" @click.prevent="assignAlias(brand)">Assign Alias</a>
            </div>
          </div>
        </template>
        <div v-else style="font-size: 22px">No records found for {{brandSearchText}}</div>
      </div>
    </div>
    <brand-alias ref="aliasModal" :currentBrand="currentBrand"/>
    <brand-carousel-modal ref="carouselModal" :brand="currentBrand" @onUpdateBrandCarousel="updateBrandCarousel"/>
    <brand-image ref="imageModal" :currentBrand="currentBrand" :brandIndex="brandIndex" @updateImage="updateImage"/>
  </div>
</template>

<script>
import BrandCarouselModal from '@/components/modals/brand-carousel.vue';
import AdminService from '@/api-services/admin.service';
import NoPermissionTruevalue from "./no-permission-truevalue";
import debounce from 'debounce';

export default {
  name: 'brands-settings',
  data () {
    return {
      showAllBrands: null,
      showBrandsFilter: null,
      showBrandLogos: null,
      showBrandsInNav: null,
      isLoading: false,
      brands: null,
      brandSearchText: null,
      currentBrand: null,
      brandIndex: null,
      saving: false,
      selectedStore: null,
      perPage: 10
    };
  },
  components: {
    NoPermissionTruevalue,
    BrandCarouselModal
  },
  computed: {
    stores() {
      if(this.$store.state.businessDetails && this.$store.state.businessDetails.about_us)
        return this.$store.state.businessDetails.about_us.locations;
      return null;
    },
    brandsList() {
      return this.brands && this.brands.brands ? this.brands.brands.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage): [];
    },
    totalPages() {
      if(!this.brands)
        return 0;
      return Math.ceil(this.brands.brands.length / this.perPage);
    },
    selectedStoreName(){
      return this.stores && this.selectedStore ? this.stores.find(x => x.id == this.selectedStore).name : null;
    },
    currentPage() {
      return this.$route.query.page || 1;
    }
  },
  methods: {
    async getBrands() {
      this.isLoading = true;
      let response = await AdminService.getBusinessBrands({
        page: this.currentPage,
        search: this.brandSearchText || null,
        partner: this.selectedStore
      });
      this.brands = response.data;
      this.showBrandsInNav = this.brands.enabled[0] ? this.brands.enabled[0].hide : false;
      this.showBrandsFilter = this.brands.filter[0] ? this.brands.filter[0] : false;
      this.showBrandLogos = this.brands.showBrandLogos;
      this.isLoading = false;
    },
    updateBrandsShowLogo(){
      this.saving = true;
      AdminService.setBrandsShowLogo(this.showBrandLogos).then(() => this.saving = false).catch(err => console.log(JSON.stringify(err)));
    },
    updateBrandsSearchFilter() {
      //update brand search filter
      this.saving = true;
      AdminService.setBrandsFilter(this.showBrandsFilter)
      .then(() => {
        this.saving = false;
      }).catch(err => {
        console.log(JSON.stringify(err));
      });
    },
    updateBrandHidden(id, hidden) {
      this.saving = true;
      AdminService.hideBrand({brand_id: id, hidden: hidden, partner: this.selectedStore}).then(() => {
        this.saving = false;
        AdminService.updateBrandES(id);
        return;
      }).catch(err => {
        console.log(JSON.stringify(err));
      });
    },
    hideProductsFromBrand(id, productsHidden) {
      this.saving = true;
      AdminService.hideProductsFromBrand(id, productsHidden)
      .then(() => {
        this.saving = false;
      }).catch(err => {
        console.log(JSON.stringify(err));
      });
    },
    disableEnableAllBrands(hidden) {
      this.$swal({
        title: "Are you sure?",
        text: `You want to ${hidden ? 'disable' : 'enable'} all brands${this.stores.length > 1 ? " for "+this.selectedStoreName : ''}!`,
        type: 'warning',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {              
          this.saving = true;
          AdminService.hideAllBrand({hidden: hidden, partner: this.selectedStore}).then(() => {
            this.saving = false;
            AdminService.updateAllBrandsES(this.selectedStore);
            this.getBrands();
            return;
          }).catch(err => {
            console.log(JSON.stringify(err));
          });
        }
      });      
    },
    disableBrandsNav(){
      this.saving = true;
      AdminService.disableBrandsNavigation(this.showBrandsInNav)
      .then(() => {
        this.saving = false;
      }).catch(err => {
        console.log(JSON.stringify(err));
      });
    },
    assignAlias(brand) {
      this.currentBrand = brand;
      this.$refs.aliasModal.showModal();
    },
    changeBrandLogo(brand, index) {
      this.currentBrand = brand;
      this.brandIndex = index;
      this.$refs.imageModal.showModal();
    },
    showCarouselModal(brand) {
      this.currentBrand = brand;
      setTimeout(() => {
        this.$refs.carouselModal.showModal();
      }, 10);
    },
    updateImage(data) {
      this.$refs[`brand-img-${data.index}`][0].src = data.newImage;
    },
    updateBrandCarousel(brand_id,slides = []){
      this.brands.brands.find(x => x.brand_id == brand_id).carousel = slides;
    },
    async deleteCarousel(brand){
      this.$swal({
        title: "Are you sure?",
        text: `You want to delete Carousel!`,
        type: 'warning',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
      })
      .then(async (result) => {
        if (result.value) {
          this.saving = true;
          this.brands.brands.find(x => x.brand_id == brand.brand_id).deletingCarousal = true;
          await AdminService.updateBrandCarousel({ brand_id: brand.brand_id, carousel: []}).then(() => {
            this.updateBrandCarousel(brand.brand_id, []);
            setTimeout(() => {
              this.$swal('Done', `Carousel deleted successfully`, 'success');  
            }, 10);
            this.saving = false;
            this.brands.brands.find(x => x.brand_id == brand.brand_id).deletingCarousal = false;
          }).catch(err => {
            console.log(JSON.stringify(err));
            this.saving = false;
            this.brands.brands.find(x => x.brand_id == brand.brand_id).deletingCarousal = false;
          });
        }
      });
      
    }
  },
  async mounted () {
    this.selectedStore = window.localStorage.selectedStore;
    await this.getBrands();
  },
  watch: {
    brandSearchText: debounce(function () {
      this.getBrands();
    }, 500)
  }
};
</script>

<style lang="scss">
  .search-input {
    max-width: 400px;
  }
  .brands-div {
    overflow: scroll;
    max-height: 600px;

    .brand-row {
      border: 1px solid lightgray;
      border-radius: 5px;
    }
  }
  .img-wrapper {
    width: 40px;
    height: 40px;
  }
  @media (max-width: 768px) {
    .brands-div {
      max-height: 100%;
      .brand-row {
        border: none;
        border-bottom: 1px solid lightgray;
        border-radius: 0;
      }
    }
  }
  .carousel-icon-wrapper{
    border: 1px solid #dee2e6;
    border-radius: 3px;
    padding: 0px 5px;
    width: 80px;
    text-align: center;
  }
  @media (max-width: 576px) {
    .brand {
      .title {
        width: 150px;
        line-height: 13px;
        margin-left: 3px;
      }
      .brand-options {
        align-self: flex-end;
        * {
          transform: scale(.9);
          transform-origin: 100% 50%;
        }
      }
    }
  }
  .bg-greyed{
    background: #F0F3F5;
  }
  #bulk-actions-dropdown{
    .btn-secondary {
        color: #fff;
        background-color: #6c757d;
        border-color: #6c757d;
    }
    .btn.btn-secondary:active, .btn.btn-secondary:focus, .btn.btn-secondary:active:focus, .btn.btn-secondary:active, .btn.btn-secondary:focus, .btn.btn-secondary:active:focus, .btn.btn-secondary:not(:disabled):hover{
      background-color: #5a6268ad !important;
      border-color: #5a6268ad !important;
    }
    .dropdown-item.active, .dropdown-item:active{
      color: #fff;
      background-color: #6c757d;
    }
  }
</style>
