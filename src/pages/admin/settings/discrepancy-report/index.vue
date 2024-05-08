<template>
  <div class="h-100" v-if="$store.state.businessDetails && $store.state.businessDetails.discrepancy_enabled && !$ezHasNoPermission('admin_account')">
    <div class="settings-body">
      <div class="row">        
        <div class="col-12 col-xl-9">        
          <h5 class="font-weight-bold">Discrepancy Report</h5>
          <div class="row mx-0">
            <p class="lead text-muted">
              <span class="font-weight-normal">
                Find products that my cause IMAP issues or that may not be priced optimally in your store.Use this report to identify items that need to be changed through your POS system.  An option exists to download a csv file with items with resolved price discrepancies.
              </span>
            </p>
          </div>
        </div>
        <div class="col-12 col-xl-3 text-xl-right">
          <button class="btn-sm btn btn-outline-primary bg-white mt-2 text-nowrap" @click="downloadCsv" :disabled="isDownloading">
            <svg class="mr-2" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13.333v-10 10z" fill="currentColor"/><path d="M3.333 13.333v.834a2.5 2.5 0 002.5 2.5h8.334a2.5 2.5 0 002.5-2.5v-.834M13.333 10L10 13.333m0 0L6.667 10M10 13.333v-10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span v-if="isDownloading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
            <span v-if="!isDownloading">Export {{ processed ? 'Edited' : 'Current'}} Discrepancies</span>
            <span v-else>Downloading...</span>
          </button>
        </div>
      </div>        
      <div class="tabs">
        <div class="tab" :class="{ 'active' : !processed }" @click="processed = false">Current Discrepancies</div>
        <div class="tab" :class="{ 'active' : processed }" @click="processed = true">
          Previously Edited Discrepancies <span v-if="report" class="badge ml-2">{{ report.processedCount }}</span>
        </div>
      </div>
      <template v-if="products">
        <div :class="{'pe-none': loading}">
          <div class="border-bottom py-4 d-flex justify-content-between align-items-center">
            <div class="flex-grow-1">
              <input type="text" v-model="searchQuery" class="form-control search" placeholder="Search Products (Title,SKU,UPC)" />
            </div>
            <div>
              <div class="d-flex">
                <Treeselect v-model="selectedDepartment" :multiple="false" :options="departments" :normalizer="departmentNormalizer" placeholder="Select Department" class="position-relative" style="max-width: 270px;" />
                <Treeselect v-model="selectedBrand" :multiple="false" :options="brands" :normalizer="brandNormalizer" placeholder="Select Brand" class="ml-2 position-relative" style="max-width: 200px;" />
              </div>
            </div>
          </div>
          <div class="pt-4 pb-3 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between">
            <div>
              <DropdownSelect @onLoad="onLoadSortSelector" @onSelect="onSort" refs="sortSelector" :options="sortOptions" label="Sort by:" />
            </div>
            <div class="d-flex align-items-sm-center mt-2 mt-sm-0">
              <div class="font-weight-bold text-muted">
                <span class="d-none d-sm-inline">Show products </span>where POS price is:
              </div>
              <div class="d-flex align-items-center">              
                <div class="custom-control custom-radio ml-2">
                  <input name="pos" v-model="pos_higher" type="radio" value="true" class="custom-control-input" id="pos_high">
                  <label class="custom-control-label d-flex align-items-center" for="pos_high">
                    Higher
                  </label>
                </div>
                <div class="custom-control custom-radio ml-2">
                  <input name="pos" v-model="pos_higher" type="radio" value="false" class="custom-control-input" id="pos_low">
                  <label class="custom-control-label d-flex align-items-center" for="pos_low">
                    Lower
                  </label>
                </div>
                <div class="custom-control custom-radio ml-2">
                  <input name="pos" v-model="pos_higher" type="radio" value="both" class="custom-control-input" id="pos_both">
                  <label class="custom-control-label d-flex align-items-center" for="pos_both">
                    Both
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex mb-3 flex-xl-row flex-column">
            <div class="custom-control custom-switch custom-switch-sm my-xl-0 my-1">
              <input type="checkbox" v-model="inStockOnly" class="custom-control-input" id="instock-only">
              <label class="custom-control-label text-tiny" for="instock-only">
                Show only items in stock
              </label>
            </div>
            <div class="custom-control custom-switch custom-switch-sm my-xl-0 my-1 ml-0 ml-xl-3">
              <input type="checkbox" v-model="hideHidden" class="custom-control-input" id="hideHidden">
              <label class="custom-control-label text-tiny" for="hideHidden">
                Hide hidden items
              </label>
            </div>
            <div class="custom-control custom-switch custom-switch-sm my-xl-0 my-1 ml-0 ml-xl-3">
              <input type="checkbox" v-model="imapViolations" class="custom-control-input" id="imap-violations">
              <label class="custom-control-label text-tiny" for="imap-violations">
                Show IMAP violations only
              </label>
            </div>
            <div class="custom-control custom-switch custom-switch-sm my-xl-0 my-1 ml-0 ml-xl-3">
              <input type="checkbox" v-model="promoOnly" class="custom-control-input" id="promoOnly">
              <label class="custom-control-label text-tiny" for="promoOnly">
                Show promo products only
              </label>
            </div>

            <div class="position-relative custom-control custom-switch custom-switch-sm my-xl-0 my-1 ml-0 ml-xl-3" style="z-index: 10">
              <input type="checkbox" @input="showDiff($event)" class="custom-control-input" ref="applyDiff" id="applyDiff">
              <label class="custom-control-label text-tiny" for="applyDiff">
                Filter by Amount
              </label>
              <div class="applyDiff position-absolute bg-white border rounded p-3" v-if="showDiffPopup" style="">
                <i class="fa fa-close position-absolute cursor-pointer" @click="closeDiffPopup"></i>
                <div class="row align-items-center my-3">
                  <div class="col-12">
                    <label>Filter Discrepancy:</label>
                  </div>
                  <div class="col-8 pr-1">
                    <select class="form-control" :class="{'is-invalid' : diff_op_invalid}" v-model="diff_op">
                      <option value="">Select Operator</option>
                      <option value="greaterThan">Difference Greater Than</option>
                      <option value="lessThan">Difference Lower Than</option>
                      <option value="equal">Difference Equals</option>
                    </select>
                  </div>
                  <div class="col-4 pl-0">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-default">$</span>
                      </div>
                      <input type="text" class="form-control"  @keypress="onKeyPress" @paste.prevent="() => {}" :class="{'is-invalid' : diff_value_invalid}" v-model="diff_value">
                    </div>
                  </div>
                  <div class="col-12 d-flex justify-content-end mt-2">
                    <button class="btn btn-sm btn-secondary mr-1" @click="clearDiffPopup">
                      Clear
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" @click="applyDiffFilter">
                      <template v-if="loading && diff_value && diff_op">
                        <is-saved :param="(loading && diff_value && diff_op)" :savedText="''" :savingText="'Applying'" :toastMessage="'Applied'" />
                      </template>
                      <span v-else>Apply</span>
                    </button>
                  </div>
                </div>
              </div>       
            </div>   

          </div>
        </div>
        <div class="card flex-row justify-content-between align-items-center p-2 pl-4 mb-3" v-if="products.length">
          <div v-html="resultsText"></div>
          <VuePagination :class="{ 'disabled' : loading }" :pages="report.last_page" />
        </div>
        <div v-if="products.length" class="alert d-flex align-items-center justify-content-center" :class="`alert-${bulkMode ? 'success' : 'dark'}`">
          <div class="bulk-selector custom-control custom-switch">
            <input type="checkbox" v-model="bulkMode" class="custom-control-input" id="bulkMode">
            <label class="custom-control-label text-medium text-capitalize font-weight-normal" for="bulkMode">
              {{ bulkMode ? 'For Individual Item Updates, Turn Off Bulk Update Mode' : 'For Multiple Item Updates, Turn On Bulk Update Mode' }}
            </label>
          </div>
        </div>
        <transition v-if="products.length" name="fadeHeight">
          <div v-if="bulkMode" class="overflow-hidden">
            <div class="alert alert-danger d-flex align-items-center text-medium">
              <svg class="mr-3 ml-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L7 8.58579L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z" fill="#EF4444"/></svg>
              <div>
                You are in Bulk Update mode. Choose "Select All in Page" or check multiple items to change to a selected pricing level. Choose your desired pricing level; POS price or your wholesaler's price When ready, select "Add to CSV File"<br>
                <b>Notice:  Prices need to be changed in your POS system following your store's price change process. EZ-AD will update your website pricing on the next file sync.</b>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-end pt-3 pb-3">
              <div class="custom-control custom-checkbox text-nowrap mt-3">
                <input type="checkbox" class="custom-control-input" id="selectAll" v-model="allSelected" @change="toggleAll" />
                <label class="custom-control-label text-dark pl-1" for="selectAll">
                  Select All In Page <span class="text-primary" v-if="selectedProducts.length">({{ selectedProducts.length}} items selected)</span>
                </label>
              </div>
              <div class="d-flex">
                <template v-if="selectedProducts.length">
                  <button class="btn btn-sm text-tiny btn-custom" :class="{'activated' : appliedPosOnAll}" @click="changeSelectedPrice('pos_price')">
                    <svg v-if="appliedPosOnAll" class="mr-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L7 8.58579L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z" fill="#EF4444"/></svg>
                    POS Pricing for All Selected
                  </button>
                  <button class="btn btn-sm text-tiny ml-2 btn-custom" :class="{'activated' : appliedWSOnAll}" @click="changeSelectedPrice('wholesaler_price')">
                    <svg v-if="appliedWSOnAll" class="mr-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L7 8.58579L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z" fill="#EF4444"/></svg>
                    {{wholesellerName}} Price for All Selected
                  </button>
                  <button class="btn btn-primary btn-sm ml-2 font-weight-normal" @click="saveInt" :disabled="saving">
                    <div class="spinner-border spinner-border-sm mr-2" v-if="saving"></div>
                    Add to CSV File
                  </button>
                </template>
              </div>
            </div>
          </div>
        </transition>        
        <div class="position-relative d-report-panel" v-if="products.length">
          <div class="d-flex justify-content-center align-items-center w-100 h-100" v-if="loading" style="z-index: 1">
            <div class="spinner-border"></div>
          </div>
          <transition-group v-else name="list" tag="div" :duration="changingPrice ? 500 : 0">
            <DiscrepancyProduct @onChange="onChangePrice" :ref="`product-${product.sku}`"  @onSelect="onSelect" class="mb-3" v-for="product in products" :product="product" :selectable="bulkMode" :key="product.sku" :loading="product.loading || false" :class="{ 'disabled' : loading, 'animate': changingPrice }" />
          </transition-group>
        </div>
        <div v-else>
          <div class="d-flex justify-content-center w-100 mt-5" v-if="loading" style="z-index: 1">
            <div class="spinner-border"></div>
          </div>
          <div class="alert alert-warning lead mt-3" v-else>
            There are no price discrepancies to show.
          </div>
        </div>
        <div class="card flex-row justify-content-between align-items-center p-2 pl-4 mt-3" :class="{'pe-none': loading}" v-if="products.length">
          <div v-html="resultsText"></div>
          <VuePagination :class="{ 'disabled' : loading }" :pages="report.last_page" />
        </div>
      </template>
      <div v-else class="d-flex justify-content-center mt-4">
        <div class="spinner-border"></div>
      </div>
    </div>
  </div>
  <div v-else>
    <no-permission />
  </div>
</template>

<script>
  import NoPermission from '../no-permission';
  import DiscrepancyProduct from '@/components/admin/discrepancy-report/product';
  import DropdownSelect from '@/components/dropdown-select';
  import AdminService from '@/api-services/admin.service';
  import DepartmentsApiService from '@/api-services/departments.service';
  import BrandsApiService from '@/api-services/brands.service';
  import Treeselect from '@riophae/vue-treeselect';
  import { debounce } from 'debounce';
  import moment from 'moment-timezone';

  export default {
    name: 'DiscrepancyReport',
    components: {
      NoPermission,
      DiscrepancyProduct,
      DropdownSelect,
      Treeselect
    },
    data() {
      return {
        report: null,
        products: null,
        bootstrapPaginationClasses: {
          ul: 'pagination justify-content-center',
          li: 'page-item',
          liActive: 'active',
          liDisable: 'disabled',
          button: 'page-link',
        },
        limit: 100,
        loading: true,
        selectedDepartment: this.$route.query.dept_id || null,
        selectedBrand: this.$route.query.brand_id || null,
        processed: this.$route.query.processed == 'true',
        pos_higher: this.$route.query.pos_higher == 'both' ? 'both' : (this.$route.query.pos_higher != 'true' ? false : true),
        orderBy: this.$route.query.order_by || 'imap',
        searchQuery: this.$route.query.query || '',
        inStockOnly: typeof this.$route.query.inStockOnly == "undefined" ? true : (this.$route.query.inStockOnly == 'true'),
        hideHidden: typeof this.$route.query.hideHidden == "undefined" ? true : (this.$route.query.hideHidden == 'true'),
        imapViolations: this.$route.query.imapViolations == 'true' || false,
        promoOnly: this.$route.query.promoOnly == 'true' || false, 
        resetPage: false,
        resetAll: false,
        changingPrice: false,
        selectedProducts: [],
        sortOptions: [
          {
            label: 'IMAP Violations',
            value: 'imap'
          },
          {
            label: 'Last Synced | Latest',
            value: 'syncHigh'
          },
          {
            label: 'Last Synced | Oldest',
            value: 'syncLow'
          },
          {
            label: 'POS Price | Low to High',
            value: 'priceLow'
          },
          {
            label: 'POS Price | High to Low',
            value: 'priceHigh'
          }
        ],
        isDownloading: false,
        allSelected: false,
        bulkMode: false,
        saving: false,
        applyDiff: false,       
        diff_op: '',
        diff_value: '',
        diff_op_invalid: false,
        diff_value_invalid: false,
        showDiffPopup: false
      };
    },
    computed: {
      appliedPosOnAll(){
        return this.selectedProducts.map(e => e.settings).flat().filter(e => (e.selection != 'pos_price')).length == 0;        
      },
      appliedWSOnAll(){
        return this.selectedProducts.map(e => e.settings).flat().filter(e => (e.selection != 'wholesaler_price')).length == 0;        
      },
      step() {
        return this.$store.state.adminWizardSteps.find(e => e.id == this.$route.meta.id);
      },
      currentItem() {
        return this.$route.query.step || 1;
      },
      itemId() {
        return this.step.items[this.currentItem - 1].id;
      },
      stores() {
        return this.$store.state.adminWizardBusinesses || [];
      },
      brands() {
        return this.$store.state.brands || null;
      },
      resultsText() {
        if(!this.report)
          return '';
        let from = ((((this.report.current_page - 1) * this.limit) - this.limit) + this.products.length + 1);
        let to = ((this.report.current_page * this.limit) - this.limit) + this.products.length;
        return this.report.total ? `Showing <b>${from > 0 ? from : 1}</b> to <b>${to}</b> of <b>${this.report.total}</b> results` : '';
      },
      departments() {
        return this.$store.state.departments || null;
      },
      companyTrueValue() {
        return this.$store.state.businessDetails && this.$store.state.businessDetails.company && this.$store.state.businessDetails.company.toLowerCase().trim().includes('truevalue');
      },
      wholesellerName(){
        if(this.companyTrueValue){
          return 'True Value';
        }
        if(this.$store.state.businessDetails && this.$store.state.businessDetails.company && (this.$store.state.businessDetails.company.toLowerCase().trim().includes('doitbest') || this.$store.state.businessDetails.company.toLowerCase().trim().includes('dib'))){
          return "Do It Best";
        }
        return this.$store.state.businessDetails.company;
      }
    },
    async mounted() {
      if(!this.departments) {
        let ret = await DepartmentsApiService.getAllDepartments();
        this.$store.commit('saveDepartments', ret.data.data.departments);
        this.$store.commit('saveFullDepartments', ret.data.data);
      }
      if(!this.brands) {
        let response = await BrandsApiService.getBrands(1, 100000000);
        this.$store.commit('saveBrands', response.data.data.data);
      }
      this.getReport();
    },
    methods: {
      showDiff(e){
        if(!e.target.checked){
          if(this.diff_op && this.diff_value){
            this.applyDiff = true;
            this.showDiffPopup = true;
            e.target.checked = true;
            return;
          }
        }

        this.applyDiff = e.target.checked; 
        this.showDiffPopup = this.applyDiff;
      },
      toggleAll() {
        this.products.forEach(e => {
          this.$refs[`product-${e.sku}`][0].selected = this.allSelected;
          this.$refs[`product-${e.sku}`][0].onSelect();
        });
        if(!this.processed){
          if(!this.allSelected){
            this.products.forEach(e => e.discrepancy_details.forEach(i => i.last_selection = null));
          }else{
            this.changeSelectedPrice('pos_price');
          }
        }
      },
      onSelect(args) {
        if(args.selected) {
          this.selectedProducts = !this.selectedProducts.find(e => e.sku == args.sku) ? [...this.selectedProducts, args] : this.selectedProducts;
          if(this.selectedProducts.length == this.products.length)
            this.allSelected = true;
        } else {
          this.selectedProducts =  this.selectedProducts.filter(e => e.sku != args.sku);
          this.allSelected = this.selectedProducts.length == this.products.length;
        }
      },
      async saveInt() {
        if(this.selectedProducts.map(e => e.settings).flat().filter(e => !e.selection).length > 0){
          this.$swal('Error', 'Please select the prices', 'error');
          return;
        }
        this.saving = true;
        let settings = this.selectedProducts.map(e => e.settings).flat().filter(e => e.selection);
        await AdminService.processDiscrepancyReport({ settings: settings }).then(() => {
          this.saving = false;
          this.selectedProducts = [];
          this.allSelected = false;
          this.$swal({
            title: "Success",
            html: `<div class="d-flex flex-column">
                      <h6>${this.processed ? 'Products discrepancies updated' : 'Products moved to edited discrepancies'}</h6>
                    </div>`,
            type: 'success',
            confirmButtonText: 'OK',
            cancelButtonText: 'Export to CSV file',
            showCancelButton: true,
          })
          .then(async (result) => {
            if (!result.value) {
              this.downloadCsv();
            }
          });
          this.getReport();
        })
        .catch(() => {
          this.$swal('Error', 'Error while processing bulk', 'error');
          this.saving = false;
        });
      },
      changeSelectedPrice(type) {
        this.selectedProducts.forEach(product => {
          this.products.find(e => e.sku == product.sku).discrepancy_details.forEach(i => i.last_selection = type);
          product.settings.forEach(i => i.selection = type);;
        });
      },
      async onChangePrice(args) {
        if(this.bulkMode){
          let p = this.selectedProducts.find(e => e.sku == args.sku);
          let pd;
          if(p) pd = p.settings.find(e => e.discrepancyId == args.id);
          if(pd) pd.selection = args.selection;
          if(!this.$refs[`product-${args.sku}`][0].selected) {
            this.$refs[`product-${args.sku}`][0].selected = true;
            this.$refs[`product-${args.sku}`][0].onSelect();
          }
          return;
        }
        let product = this.products.find(e => e.sku == args.sku);
        product.loading = true;
        let resp = await AdminService.processDiscrepancyReport({settings: [{ discrepancyId: args.id, selection: args.selection}]});
        if(!product.discrepancy_details.find(x => x.id != args.id && x.last_selection == null) && !this.processed){
          this.$set( this.products.find(e => e.sku == args.sku), 'actionMsg', 'Product moved to edited discrepancies' );
        }
        product.loading = false;
        this.getReport();
        this.$swal({
          toast: true,
          position: 'top',
          type: 'success',
          html: `<div class="ml-2">${resp.data.message}</div>`,
          showConfirmButton: false,
          timer: 3000
        });
        product.loading = false;
        this.loading = false;
        this.changingPrice = false;
      },
      onLoadSortSelector(elm) {
        elm.selectOption(this.sortOptions.find(e => e.value == this.orderBy), true);
      },
      onSort(val, internal) {
        this.orderBy = val;
        if(!internal && this.report.current_page != 1) {
          this.resetPage = true;
        }
        this.$router.push({ query: { ...this.$route.query, order_by: val }}).catch(() => {});
      },
      applyDiffFilter(){
        if(this.diff_op == ''){
          this.diff_op_invalid = true;
          return;
        }
        if(!this.diff_value){
          this.diff_value_invalid = true;
          return;
        }
        this.diff_op_invalid = false;
        this.diff_value_invalid = false;
        this.getReport();
      },
      closeDiffPopup(){
        this.showDiffPopup = false;
        this.applyDiff = false;
        this.$refs.applyDiff.checked = false;
        this.clearDiffPopup();
        this.getReport();
      },
      clearDiffPopup(){
        this.diff_op = '';
        this.diff_value = '';
        this.diff_op_invalid = false;
        this.diff_value_invalid = false;
      },
      resetFilters() {
        this.products = [];
        this.selectedDepartment = null;
        this.selectedBrand = null;
        this.pos_higher = false;
        this.resetAll = true;
        this.resetAll = false;
        this.applyDiff = false;
        this.diff_op = '';
        this.diff_value = '';
        this.diff_op_invalid = false;
        this.diff_value_invalid = false;
      },
      getFiltersObj(){
        let filters = {};
        
        filters.search = this.$route.query.query || '';
        filters.dept_id = this.$route.query.dept_id || '';
        filters.brand_id = this.$route.query.brand_id || '';
        filters.page = this.$route.query.page || 1;
        filters.orderBy = this.$route.query.order_by || 'imap';
        if(this.$route.query.pos_higher != 'both'){
          filters.pos_higher = this.$route.query.pos_higher == 'true';
        }
        filters.processed = this.$route.query.processed == 'true';
        filters.instock_only = typeof this.$route.query.inStockOnly == "undefined" ? true : (this.$route.query.inStockOnly == 'true');
        filters.hide_hidden = typeof this.$route.query.hideHidden == "undefined" ? true : (this.$route.query.hideHidden == 'true');
        filters.imap_voilations = this.$route.query.imapViolations == 'true';
        filters.promo_only = this.$route.query.promoOnly == 'true';

        if(this.applyDiff && this.diff_op && (this.diff_value * 1) > 0){
          filters.diff = true;
          filters.diff_op = this.diff_op;
          filters.diff_value = this.diff_value;
        }

        return filters;
      },
      async getReport() {
        if(this.resetAll) return;
        if(this.resetPage) {
          this.resetPage = false;
          this.report.current_page = 1;
          return;
        }
        this.allSelected = false;
        this.selectedProducts = [];
        this.loading = true;
        
        let filters = this.getFiltersObj();

        let resp = await AdminService.getDiscrepancyReport({ ...filters, limit: this.limit });
        if(resp.data.report && resp.data.report.data && resp.data.report.data.length == 0 && (filters.page * 1) > 1){
          this.resetPage = false;
          this.report.current_page = 1;
          this.getReport();
          return;
        }
        this.report = resp.data.report;
        this.products = this.report.data;
        this.loading = false;
        this.showDiffPopup = false;
      },
      departmentNormalizer(node) {
        if(node.children && !node.children.length) delete node.children;
        let ret = { id: node.dept_id, label: node.name };
        if(node.children) ret.children = node.children;
        return ret;
      },
      brandNormalizer(node) {
        return { id: node.brand_id, label: node.brand_name };
      },
      downloadCsv() {
        this.isDownloading = true;
        let filters = this.getFiltersObj();
        AdminService.downloadDiscrepancyCsv(filters).then(res => {
          const blob = res.data;

          const pom = document.createElement('a');
          pom.href = URL.createObjectURL(blob);
          pom.setAttribute('download', `${this.processed ? 'edited-' : 'current-'}discrepancy-report-${moment(new Date()).format('MM-DD-YYYY')}.csv`);
          pom.click();

          this.isDownloading = false;
        });
      },
      onKeyPress(evt) {
        if(!/[0-9\./]+/.test(evt.key)) {
          evt.preventDefault();
        }
      }
    },
    watch: {
      '$route.query'() {
        this.getReport();
      },
      selectedDepartment(val) {
        if(this.report.current_page != 1)
          this.resetPage = true;
        this.$router.push({ query: { ...this.$route.query, dept_id: val }}).catch(() => {});
      },
      selectedBrand(val) {
        if(this.report.current_page != 1)
          this.resetPage = true;
        this.$router.push({ query: { ...this.$route.query, brand_id: val }}).catch(() => {});
      },
      'report.current_page'(val) {
        this.$router.push({ query: { ...this.$route.query, page: val }}).catch(() => {});
      },
      processed(val) {
        if(this.report.current_page != 1)
          this.resetPage = true;
        this.resetFilters();
        this.$router.push({ query: { ...this.$route.query, processed: val }}).catch(() => {});
      },
      pos_higher(val) {
        if(this.report && this.report.current_page != 1)
          this.resetPage = true;
        this.$router.push({ query: { ...this.$route.query, pos_higher: val }}).catch(() => {});
      },
      inStockOnly(val) {
        if(this.report.current_page != 1)
          this.resetPage = true;
        this.$router.push({ query: { ...this.$route.query, inStockOnly: val }}).catch(() => {});
      },
      hideHidden(val) {
        if(this.report.current_page != 1)
          this.resetPage = true;
        this.$router.push({ query: { ...this.$route.query, hideHidden: val }}).catch(() => {});
      },
      imapViolations(val) {
        if(this.report.current_page != 1)
          this.resetPage = true;
        this.$router.push({ query: { ...this.$route.query, imapViolations: val }}).catch(() => {});
      },
      promoOnly(val) {
        if(this.report.current_page != 1)
          this.resetPage = true;
        this.$router.push({ query: { ...this.$route.query, promoOnly: val }}).catch(() => {});
      },
      searchQuery: debounce(function() {
        if(this.report.current_page != 1)
          this.resetPage = true;
        this.$router.push({ query: { ...this.$route.query, query: this.searchQuery }}).catch(() => {});
      }, 500)
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/treeselect.scss';


  .applyDiff{
    width: 350px; 
    z-index: 10;
    top: 30px;
    right: 0;
    box-shadow: 0 0 14px 0px #8b8282;
    .fa-close{
      top: 5px;
      right: 5px;      
    }
  }

  .d-report-panel{
    min-height: 450px;
    height: 70vh;
    overflow: auto;
  }
  .tabs {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #E2E8F0;
    .tab {
      height: 68px;
      display: flex;
      align-items: center;
      margin-right: 38px;
      font-weight: bold;
      color: #64748B;
      margin-bottom: -1px;
      transition: all .2s;
      border-bottom: 2px solid transparent;
      .badge {
        background: #F1F5F9;
        color: #1E293B;
        border-radius: 10px;
        padding-left: 8px;
        padding-right: 8px;
        font-size: 12px;
        font-weight: normal;
      }
      &.active {
        color: var(--primary);
        border-bottom-color: var(--primary);
        .badge {
          background: var(--primary);
          color: #fff;
        }
      }
      &:not(.active) {
        cursor: pointer;
      }
    }
  }
  .form-control {
    height: 38px;  
  }

  /* base */
  .list {
    backface-visibility: hidden;
    z-index: 1;
  }

  /* moving */
  .list-move {
    transition: all 600ms ease-in-out 50ms;
  }

  /* appearing */
  .list-enter-active {
    transition: all 400ms ease-out;
  }

  /* disappearing */
  .list-leave-active {
    transition: all 200ms ease-in;
    z-index: 0;
    display: none;
  }

  /* appear at / disappear to */
  .list-enter,
  .list-leave-to {
    opacity: 0;
  }
  .pe-none{
    pointer-events: none !important;
    *,*::before,*::after{
      pointer-events: none !important;
    }
  }
  .btn-custom{
    background: #ffffff;
    color: #b91010;
    border-color: #b91010;
    &:hover,&:focus,&.activated {
      background: #fef2f2;
    }
  }
  .custom-switch-sm{
    .custom-control-label{
      padding-left: .75rem;
      padding-top: 0.15rem;

      &::before {
        border-radius: 1rem;
        height: 1.5rem;
        width: 2.5rem;
      }

      &::after {
        border-radius: .65rem;
        height: calc(1.5rem - 4px);
        width: calc(1.5rem - 4px);
      }
    }
    .custom-control-input:checked {
      ~ label.custom-control-label {
        &::after {
          -webkit-transform: translateX(1.05rem);
          transform: translateX(1.05rem);
        }
      }
    }
  }
</style>
