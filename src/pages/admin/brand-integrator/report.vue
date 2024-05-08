<template>
  <div>
    <div class="py-4 px-3 card border-0 wizard-wrapper">
      <div class="d-flex flex-column pb-3">
        <div class="d-flex mb-2">
          <router-link v-if="this.store" class="btn btn-sm btn-outline-secondary text-medium " :to="`/admin/brand-integrator/generate?store=${this.store.id}`">
            <svg data-v-305c56d9="" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-3"><path data-v-305c56d9="" fill-rule="evenodd" clip-rule="evenodd" d="M5.70679 0.292787C5.89426 0.480314 5.99957 0.734622 5.99957 0.999786C5.99957 1.26495 5.89426 1.51926 5.70679 1.70679L2.41379 4.99979L5.70679 8.29279C5.88894 8.48139 5.98974 8.73399 5.98746 8.99619C5.98518 9.25838 5.88001 9.5092 5.6946 9.6946C5.5092 9.88001 5.25838 9.98518 4.99619 9.98746C4.73399 9.98974 4.48139 9.88894 4.29279 9.70679L0.292787 5.70679C0.105316 5.51926 0 5.26495 0 4.99979C0 4.73462 0.105316 4.48031 0.292787 4.29279L4.29279 0.292787C4.48031 0.105316 4.73462 0 4.99979 0C5.26495 0 5.51926 0.105316 5.70679 0.292787Z" fill="currentColor"></path></svg>
            Go Back
          </router-link> 
        </div>
        <h4 class="font-weight-bold">Brand Product Integrator</h4>
        <p class="brand-integrator-description">The Brand Product Integrator is a feature that helps you integrate their products with their brand. EZ-AD will automatically map your products based on title, code & model number to a specific brand’s catalog. The results will display on the “Suggested” tab. You will need to approve or reject products. When rejecting a product, it will allow you to search for a product that’s more fit.</p>
      </div>
      <div class="d-flex align-items-center p-3 bg-light">
          <label class="w-auto text-muted m-0 mr-3">Brand Product Integrator</label>
          <select class="form-control brand-select" v-model="brand_name">
            <option value="benjamin_moore">Benjamin Moore</option>
          </select>
      </div>
      <WizardStoreList :selectedStore="selectedStore" @onSelect="pushStore" :disableSelection="loading" class="border-bottom pb-4 mb-4 mt-3" />
      <div class="row mt-3">
        <div class="col-12 mb-3">
          <button class="btn btn-status mr-2" :class="{'active' : status == 'suggested'}" :disabled="loading" @click="loadReportByStatus('suggested')">
            <span>Suggested</span>
            <span v-if="report" class="count">{{report.suggested_count}}</span>
          </button>
          <button class="btn btn-status mx-2" :class="{'active' : status == 'approved'}" :disabled="loading" @click="loadReportByStatus('approved')">
            <span>Approved</span>
            <span v-if="report" class="count">{{report.approved_count}}</span>            
          </button>
          <button class="btn btn-status " :class="{'active' : status == 'rejected'}" :disabled="loading" @click="loadReportByStatus('rejected')">          
            <span>Rejected</span>
            <span v-if="report" class="count">{{report.rejected_count}}</span>            
          </button>
        </div>
        <div class="col-4">
          <input type="text" class="form-control" placeholder="Search Keyword" v-model="searchQuery" >
        </div>
        <div class="col-8 d-flex justify-content-end">
          <select v-model="orderBy" placeholder="Order By" :disabled="loading" class="form-control w-auto mr-3">
            <option v-if="status == 'approved'" value="approvedDesc">Order By: Last Approved | Latest</option>
            <option v-if="status == 'approved'" value="approvedAsc">Order By: Last Approved | Oldest</option>
            <option v-if="status == 'rejected'" value="rejectedDesc">Order By: Last Rejected | Latest</option>
            <option v-if="status == 'rejected'" value="rejectedAsc">Order By: Last Rejected | Oldest</option>
            <option value="scoreAsc">Order By: Score | Low to High</option>
            <option value="scoreDesc">Order By: Score | High to Low</option>
            <option value="titleAsc">Order By: Title | A-Z</option>
            <option value="titleDesc">Order By: Title | Z-A</option>
          </select>
        </div>
        <div v-if="report && anyChecked" class="col-12">          
          <div  class="py-3 mt-3 selectAllWrap d-flex align-items-center justify-content-center">
            <label class="my-0 mr-3 font-weight-bold">Are the selected products mapped correctly?</label>
            <button :disabled="bulk_approving" class="btn btn-sm btn-success btn-yes mr-2" @click="mapSelectedProducts()">
              <i class="fa fa-spin fa-spinner mr-1" v-if="bulk_approving"></i>
              <span v-if="bulk_approving">Saving</span>
              <span v-else>Yes</span>
            </button>
          </div>
        </div>

        <div v-if="!loading && report" class="col-12 mt-5">
          <div class="report-header d-flex flex-row align-items-center w-100 border-bottom">
            <div v-if="status == 'suggested' && report.data && report.data.length > 0" class="p-2 w-50px">
              <input type="checkbox" class="form-control w-auto h-auto" id="selectAllMappings" v-model="selectAllMappings" >
            </div>
            <div class="p-2 w-35 text-muted font-weight-bold">Your Product</div>
            <div class="p-2 w-35 text-muted font-weight-bold">Brand Product</div>
            <div class="p-2 w-action text-muted font-weight-bold">Action</div>
          </div>

          <TransitionGroup v-if="report.data && report.data.length > 0" tag="div" name="reportItem">
            <div v-for="(item,index) in report.data" :key="item.id" class="report-item d-flex flex-row align-items-start w-100 border-bottom py-2" :class="{ 'selected-item' : item.check }"> 
              <div v-if="item.actionMsg && item.actionMsg != ''" class="d-flex align-items-center justify-content-center w-100">
               <p class="p-4 m-3 text-center bg-actionMsg" v-html="item.actionMsg"></p> 
              </div>
              <template v-else>
                <div v-if="status == 'suggested'" class="p-2 w-50px">
                  <input type="checkbox" class="form-control w-auto h-auto" :id="'term'+index" v-model="item.check">
                </div>
                <div class="p-2 w-35">
                  <div class="product-info d-flex flex-row align-items-start">
                    <div class="d-flex">
                      <img :src="item.product_image ? item.product_image : '/images/default-product.png'" :alt="item.name" width="84" height="84" class="image-item mr-1" @click="previewImage(item.product_title,item.product_image)">
                    </div>
                    <div class="d-flex flex-column text-capitalize">
                      <a target="_blank" :href="item.product_url"><h6 class="mb-2">{{ item.product_title }}</h6></a>
                      <p class="text-muted mb-1">Dept: {{ item.product_dept_name }}</p>
                      <p class="text-muted mb-1">SKU: {{ item.product_sku }}</p>
                      <h5>${{ item.product_price }}</h5>
                    </div>
                  </div>
                </div>
                <div class="p-2 w-35">
                  <div class="product-info d-flex flex-row align-items-start">
                    <div class="d-flex">
                      <img :src="item.brand_image ? item.brand_image : '/images/default-product.png'" alt="Item Brand" width="84" height="84" class="image-item mr-1" @click="previewImage(item.brand_title,item.brand_image)">
                    </div>
                    <div class="d-flex flex-column text-capitalize">
                      <h6 class="mb-2">{{ item.brand_title }}</h6>
                      <p class="text-muted mb-1">Group: {{ item.brand_product_group }}</p>
                      <p class="text-muted mb-1">Family Name: {{ item.brand_product_family }}</p>
                      <p class="text-muted mb-1">Product Code: {{ item.brand_product_code }}</p>
                      <p class="text-muted mb-1" v-if="item.brand_url">Url: <a :href="item.brand_url">Product Link</a></p>
                    </div>
                  </div>
                </div>
                <div class="p-2 w-action">
                  <div class="d-flex py-2 align-items-center justify-content-center" v-if="item.loading">
                    <div >
                      <div class="spinner-border my-4"></div>
                    </div>
                  </div>
                  <div v-else-if="typeof item.showReviewOptions != 'undefined' && item.showReviewOptions == 1 || status != 'suggested'" class="d-flex flex-column">
                    <div class="d-flex flex-row mb-3 align-items-center">
                      <h6 class="d-inline-flex mr-2 mb-0">Map with suggested product?</h6>
                      <select class="form-control w-auto" :value="item.approved_date ? 'yes':'no' " @input="changeSelection($event,index)">
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div v-if="(typeof item.showReviewOptions != 'undefined' && item.showReviewOptions == 1) || status == 'suggested'" class="d-flex flex-column">
                      <label>Name, Code, Family, Group</label>
                      <SearchBrandProduct id="search-brand" @onFocus="searchInputFocus(index)" @onSelected="searchInputSelected" @onSuggestion="onSuggestion" @onInputChange="onSearchInputChange(index)" :index="index" />
                      <a class="text-danger cursor-pointer w-auto mt-1" v-if="status != 'rejected'" @click="mapProducts(index,0,1)">Reject, if you don’t see the product</a>
                      <a class="btn btn-sm btn-dark btn-cancel mt-1" @click="cancelManualMapping(index)">Cancel</a>

                    </div>
                    <div v-if="(typeof item.showReviewOptions == 'undefined' || !item.showReviewOptions) && status == 'approved'" class="d-flex flex-column">
                      <p class="text-success">Product Mapped Correctly</p>
                    </div>
                    <div v-if="(typeof item.showReviewOptions == 'undefined' || !item.showReviewOptions) && status == 'rejected'" class="d-flex flex-column">
                      <p class="text-muted">Product Mapping Rejected</p>
                      <a class="text-blue" @click="mapProducts(index,0)">Map Manually</a>
                    </div>                  
                  </div>
                  <div v-else class="d-flex flex-column">
                    <p><span class="text-muted">Confidence Score: </span>{{ item.match_score }}</p>
                    <h6 class="mb-2">Does this Map Correctly?</h6>
                    <div class="d-flex flex-row">
                      <button class="btn btn-sm btn-success btn-yes mr-2" @click="mapProducts(index,1)">Yes</button>
                      <button class="btn btn-sm btn-danger btn-no" @click="mapProducts(index,0)">No</button>
                    </div>
                  </div>
                  
                </div>                
              </template>
            </div>            
          </TransitionGroup>
          <b-modal 
            :lazy="false" 
            :visible="false" 
            id="showImageModal" 
            class="previewImageModal"
            ref="preivewImageModal"
            @hidden="clearPreviewImage"
            centered  
            hide-footer >
            <template #modal-header="{ close }">
              <h5 style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; text-transform: capitalize;">{{modal_image_title}}</h5>
              <button type="button" @click="close()" class="close" aria-label="Close">×</button>
            </template>
            <b-img-lazy class="d-flex m-auto preivewImage" :src="modal_image_path" />
          </b-modal>
          <div v-if="report.data && report.data.length > 0" class="d-flex align-items-center justify-content-center p-2">
            <v-pagination :class="{ 'disabled' : loading }" class="m-0" v-model="report.current_page" :page-count="report.last_page" :classes="bootstrapPaginationClasses" />
          </div>
          <div v-else class="d-flex align-items-center justify-content-center p-2">
            <p class="text-muted">No items in the list</p>
          </div>

        </div>
        <div class="col-12 my-auto" v-else-if="loading">
          <div class="my-5">
            <img src="/icons/loader.gif" class="loader py-3" alt="Loading..." />
          </div>
        </div>
        <div class="col-12 my-auto" v-else>
          <p class="my-5 text-center text-muted">
            No Report Found
          </p>
        </div>
      </div>     
    </div>
  </div>
</template>

<script>
  import WizardStoreList from '@/components/admin/wizard/wizard-store-list';
  import AdminApiService from '@/api-services/admin.service';
  import { paginationConfig } from '@/config/modules';
  import { debounce } from 'debounce';
  import SearchBrandProduct from '@/components/search-brand-products';

  export default {
    name: 'IntegratorReport',
    components: {
      WizardStoreList,
      SearchBrandProduct
    },
    data() {
      return {
        ...paginationConfig,
        loading: true,
        bulk_approving: false,
        report: null,
        selectedStore: null,
        bootstrapPaginationClasses: {
          ul: 'pagination justify-content-center',
          li: 'page-item',
          liActive: 'active',
          liDisable: 'disabled',
          button: 'page-link',
        },
        limit: 20,
        brand_name: this.$route.query.brand_name || 'benjamin_moore',
        searchQuery: this.$route.query.query || '',
        status: this.$route.query.status || null,
        resetPage: false,
        orderBy: 'scoreDesc',
        showImageModal: false,
        modal_image_title: '',
        modal_image_path: ''

      };
    },
    async mounted() {
      await AdminApiService.getAllPartnerBusinesses().then(resp => this.$store.commit('setAdminWizardBusinesses', resp.data.stores));
      // if store is in query and valid otherwise select base as default
      this.selectedStore = this.$route.query.store && this.stores.find(x => x.id == this.$route.query.store) ? this.$route.query.store : this.stores.find(x => x.base).id;
      this.selectStore(this.selectedStore);
      this.getReport();
    },
    computed: {      
      stores() {
        return this.$store.state.adminWizardBusinesses || [];
      },
      store() {
        return this.stores.find(e => e.id == this.selectedStore);
      },
      selectAllMappings: {
        get() {
            return this.report.data.find(x => !x.check) ? false : true;
        },
        set(newValue) {
            this.report.data.forEach((itm,idx) => {
                this.report.data[idx].check = newValue;
            });   
        }
      },
      anyChecked() {
        return this.report.data.find(x => x.check) ? true : false;
      }
    },
    methods: {
      previewImage(title,src){
        if(src && src != ''){
          this.modal_image_title = title;
          this.modal_image_path = src;
          this.showImageModal = true;
          this.$refs.preivewImageModal.show();
        }
      },
      clearPreviewImage(){
        this.showImageModal = false;
        this.modal_image_title = '';
        this.modal_image_path = '';
      },
      async selectStore(id) {
        this.selectedStore = id;
      },
      pushStore(id) {
        this.selectStore(id);
      },
      resetFilters() {
        this.report.data = [];
        this.brand_name = null;
        this.orderBy = null;
        this.status = null;
      },
      loadReportByStatus(status) {
        this.report.current_page = 1;
        if(status == 'approved') {
          this.orderBy = 'approvedDesc';
        } else if (status == 'rejected') {
          this.orderBy = 'rejectedDesc';
        } else {
          this.orderBy = 'scoreDesc';
        }
        this.status = status;
      },
      async getReport() {
        if(this.stores.findIndex(x => x.id == this.selectedStore) === -1 || this.stores.findIndex(x => x.id == this.$route.query.store) === -1) {
          return;
        }
        if(this.resetPage) {
          this.resetPage = false;
          this.report.current_page = 1;
          return;
        }
        if(!this.status || this.status == '') {
          this.status = 'suggested';
          return;
        }
        this.bulk_approving = false;
        this.loading = true;
        let filters = {};
        
        filters.brand = this.$route.query.brand_name || this.brand_name;
        filters.search = this.$route.query.query || '';
        filters.page = this.$route.query.page || 1;
        filters.status = this.$route.query.status || this.status;
        filters.business_id = this.$route.query.store || this.selectedStore;

        if(this.orderBy != ''){
          let orderBy = this.orderBy;
          orderBy = orderBy.replace("Asc", "");
          orderBy = orderBy.replace("Desc", "");
          filters.orderBy = orderBy;
          filters.sortBy = this.orderBy.includes("Asc") ? 'ASC' : 'DESC';
        }

        try {
          let resp = await AdminApiService.getBrandIntegratorReport({ ...filters, limit: this.limit });
          if(this.status == 'suggested') {
           resp.data.report.data.forEach((itm,idx) => {
            resp.data.report.data[idx].check = false;
           }); 
          }
          this.report = resp.data.report;
          this.loading = false;
        } catch(err) {
          if(err && err.response && err.response.data && err.response.data.error && err.response.data.error.report_status != 'done') {
            this.$swal('Error', `${err.response.data.error.message} for ${this.store.name}` || 'Something went wrong', 'error');
          }
          this.$router.push({ name: 'admin-brand-integrator-generate' });
        }

      },
      mapProducts(key, decision, byPass = false) {
        let params = {
          id: this.report.data[key].id,
          approve: decision ? 'yes' : 'no',
          bulk_mode: 0
        };
        if(!decision && !byPass) {
          this.$set( this.report.data[key], 'showReviewOptions', 1 );
        } else { // for no we have to show options first
          this.$swal({
            title: "Are you sure?",
            text: decision ? 'You want to approve this mapped product!' : 'You want to reject the mapping for this product',
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
          })
          .then((result) => {
            if (result.value) {              
              this.callMappingApi(params,key);
            }
          });
        }
      },
      updateCountsUI(decision,key) {
        let _self = this;
        if(_self.status == 'suggested') {
          _self.$set( _self.report.data[key], 'actionMsg', `Product moved to the <b>${decision == 'yes' ? 'Approved' : 'Rejected'}</b> Tab` );
          setTimeout(function() {
            if(_self.status == 'suggested'){
              _self.report.data.splice(key, 1);
            }
          },3000); // remove after 3 sec
          _self.report.suggested_count--;
          decision == 'yes' ? _self.report.approved_count++ : _self.report.rejected_count++;
        }
        if(_self.status == 'approved') {
          if(decision == 'no') {
            _self.$set( _self.report.data[key], 'actionMsg', 'Product moved to the <b>Rejected</b> Tab' );
            setTimeout(function() {
              if(_self.status == 'approved'){
                _self.report.data.splice(key, 1);
              }
            },3000); // remove after 3 sec
            _self.report.approved_count--;
            _self.report.rejected_count++;
          }else{
            _self.getReport();
          }
        }
        if(_self.status == 'rejected') {
          if(decision == 'yes') {
            _self.$set( _self.report.data[key], 'actionMsg', 'Product moved to the <b>Approved</b> Tab' );
            setTimeout(function() {
              if(_self.status == 'rejected'){
                _self.report.data.splice(key, 1);
              }
            },3000); // remove after 3 sec
            _self.report.approved_count++;
            _self.report.rejected_count--;
          }else{
            _self.getReport();
          }
        }
      },
      async callMappingApi(params,key, bulk_mode = false) {
        try {
          if(!bulk_mode) {
            this.$set( this.report.data[key], 'loading', true );
          }else{
            this.loading = true;
            this.bulk_approving = true;
          }
          let resp = await AdminApiService.approveRejectBrandMapping(params);
          if(bulk_mode){
            this.$swal('Done', `Product(s) mapped successfully`, resp.data.status);  
          }
          if(bulk_mode) {
            this.getReport();
          }else{            
            this.updateCountsUI(params.approve,key);
          }
        } catch(err) {
          if(err && err.response.status == 400 && err.response.data) {
            if(!bulk_mode) {
              this.$set( this.report.data[key], 'loading', false );
            }else{
              this.bulk_approving = true;
            }
            this.$swal('Error', Object.values(err.response.data.error).join('<br>'), 'error');
          }
        }
      },
      searchInputFocus(key) {
        document.getElementById(`search-brand-autosuggest-${key}`).getBoundingClientRect().top - 10;
        this.$set( this.report.data[key], 'isSearching', true );
      },
      onSuggestion(text) {
        if(text == '' || text == undefined) return;
          this.searchKey = text;
      },
      searchInputSelected(selected,key) {
        if(typeof key != 'undefined' && selected && selected.item && selected.item.id > 0) {
          let product_title = this.report.data[key].product_title;
          this.$swal({
            title: "Are you sure?",
            html: `<div class="d-flex flex-column">
                      <h4>You want to map</h4>
                      <ul class="p-0 mt-2 mb-0" style="list-style: none;">
                        <li class="font-weight-bold">${selected.item.name}</li>
                        <h4 class="my-2">with</h4>
                        <li class="font-weight-bold">${product_title}</li>
                      </ul>
                    </div>`,
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
          })
          .then(async (result) => {
            if (result.value) {

              let params = {
                id: this.report.data[key].id,
                approve: 'yes',
                bulk_mode: 0,
                brand_product_id: selected.item.id
              };
              this.callMappingApi(params,key);
            }
          });
        }
      },
      onSearchInputChange(searchKey,key) {
        this.$set( this.report.data[key], 'searchKey', searchKey );
      },
      changeSelection(e,key) {
          // approve works for rejected tab only
          if(e.target.value == 'yes' && this.status != 'approved') {
               this.$swal({
                title: "Are you sure?",
                text: `You want to approve this mapped product!`,
                type: 'warning',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                showCancelButton: true,
              })
              .then(async (result) => {
                if (result.value) {
                  let params = {
                    id: this.report.data[key].id,
                    approve: 'yes',
                    bulk_mode: 0,
                  };
                  this.callMappingApi(params,key);
                }else{
                  e.target.value = 'no';
                }
              });
          // reject works for approved tab only    
          }else if(this.status == 'approved') {
            this.$set( this.report.data[key], 'showReviewOptions', 1 );
          }
      },
      cancelManualMapping(key) {
        this.$set( this.report.data[key], 'showReviewOptions', 0 );
      },
      mapSelectedProducts() {
        if(this.report.data) {
          let ids = this.report.data.filter(itm => itm.check).map((obj) => obj.id);
          if(ids.length > 0) {
            this.$swal({
                title: "Are you sure?",
                text: `You want to map selected ${ids.length} Product(s)!`,
                type: 'warning',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                showCancelButton: true,
              })
              .then(async (result) => {
                if (result.value) {
                  let params = {
                    id: 0,
                    approve: 'yes',
                    bulk_mode: 1,
                    ids: ids
                  };
                  this.callMappingApi(params,-1,true);
                }else{
                  e.target.value = 'yes';
                }
              });
          }
        }
      }
    },
    watch: {
      '$route.query'() {
        this.getReport();        
      },
      'report.current_page'(val) {
        if(val > 0)
          this.$router.push({ query: { ...this.$route.query, page: val }}).catch(() => {});
      },
      selectedStore(val) {
        if(this.report && this.report.current_page != 1)
          this.resetPage = true;
        this.$router.push({ query: { ...this.$route.query, store: val }}).catch(() => {});
      },
      status(val) {
        this.$router.push({ query: { ...this.$route.query, status: val }}).catch(() => {});
      },
      orderBy() {
        this.getReport();        
      },
      brand_name(val) {
        this.$router.push({ query: { ...this.$route.query, brand_name: val }}).catch(() => {});
      },
      searchQuery: debounce(function(val) {
        if(this.report && this.report.current_page != 1)
        {
          this.resetPage = true;
        }
        this.$router.push({ query: { ...this.$route.query, query: val }}).catch(() => {});
      }, 500)
    }
  };
</script>

<style scoped lang="scss">
  .w-50px{
    width: 50px;
  }
  .w-35{
    width: 35%;    
  }
  .w-action{
    width:calc(30% - 50px);
  }
  .brand-select{
    width: 320px;
  }
  .btn-status{
    width: 125px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #64748B;
    font-weight: 600;
    font-size: 14px;
    border-radius: 6px;
    padding: 0;
    &:hover{
      opacity: 0.8;
    }
    .count{
      min-width: 20px;
      height: 20px;
      background: #64748B;
      border-radius: 15px;
      color: #ffffff !important;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 5px;
      padding: 5px;
    }
    &.active{
        background: #FEE2E2;
        color: #B91C1C;
      .count{
        background: #DC2626;
      }
    }
  }
  /* base */
  .reportItem {
    backface-visibility: hidden;
    z-index: 1;
  }

  /* moving */
  .reportItem-move {
    transition: all 600ms ease-in-out 50ms;
  }

  /* appearing */
  .reportItem-enter-active {
    transition: all 400ms ease-out;
  }

  /* disappearing */
  .reportItem-leave-active {
    transition: all 200ms ease-in;
    position: absolute;
    z-index: 0;
  }

  /* appear at / disappear to */
  .reportItem-enter,
  .reportItem-leave-to {
    opacity: 0;
  }

  .selected-item{
    background: #EEFFFC !important;
  }
  
  .selectAllWrap{
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 10px;
    label{
      font-size: 16px;
      color: #1E293B;
      font-weight: 500;
    }
  }
  .btn-no,.btn-yes,.btn-cancel{
    width: 65px;
    border-radius: 4px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 16px;
  }
  .btn-yes{
    background: #10B981;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  }
  .btn-no{
    background: #EF4444;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  }
  .brand-integrator-description{
    margin: 0;
    font-weight: 500;
    font-size: 18.5px;
    color: #7C7C7C;
    line-height: 27px;
  }
  .bg-actionMsg{
    background: #F1FFF0;
    width: 75%;
    border-radius: 3px;
    color: #000000;
    font-size: 15px;
  }
  .preivewImage{
    width: auto;
    max-height: 400px;
  }
  .image-item{
    object-fit: contain;
    cursor: pointer;
    &:hover{
      -moz-transform: scale(0.9);
      -webkit-transform: scale(0.9);
      -o-transform: scale(0.9);
      -ms-transform: scale(0.9);
      transform: scale(0.9);
      transition: transform 0.2s;
    }
  }  
</style>
