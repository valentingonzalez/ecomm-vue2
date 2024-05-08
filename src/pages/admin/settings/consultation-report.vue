<template>
  <div v-if="$ezHasNoPermission('consultation_report')">
    <NoPermission />
  </div>
  <div v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <h1 class="h4 mb-0">Data Report</h1>
        <div>
          <b-form-select 
            v-if="storeLocations.length > 1"
            v-model="selectedStore" 
            :options="storeLocations"
            value-field="business_id" 
            text-field="name" 
            @change="storeChanged"/>
        </div>
      </div>
    </div>
    <div class="settings-body">
      <div class="w-100">
        <div class="row">
          <div class="col-sm-5 mt-2">
            <div class="info-tabs">
              <div>
                <span class="title">Business</span>
                <span class="title-heading" v-if="businessDetails">{{ businessDetails.name }}</span>
              </div>
              <div v-if="businessDetails">
                {{ businessDetails.address }} {{ businessDetails.city }} 
                {{ businessDetails.state }} {{ businessDetails.zip }}
              </div>
            </div>
          </div>

          <div class="col-sm-3 mt-2">
            <div class="info-tabs">
              <div class="title mb-2">Downloadable Files</div>
              <a href="#" class="d-flex font-weight-bold mb-1 text-primary align-items-center" @click.prevent="downloadReport('pos', 'a')">
                <div v-if="isDownloading('pos', 'a')" class="spinner-border spinner-border-sm"></div>
                <svg v-else width="24" class="text-primary ml-n1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <div class="ml-1">Pos Inventory</div>
              </a>
              <a href="#" class="d-flex font-weight-bold mb-1 text-primary align-items-center" @click.prevent="downloadReport('products', 'a')">
                <div v-if="isDownloading('products', 'a')" class="spinner-border spinner-border-sm"></div>
                <svg v-else width="24" class="text-primary ml-n1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <div class="ml-1">Ecommerce Table</div>
              </a>
            </div>
          </div>

          <div class="col-sm-4 mt-2">
            <div class="info-tabs">
              <div v-if="!grade || !stores.length" class="w-100 h-100 d-flex justify-content-center align-items-center">
                <div class="spinner-border"></div>
              </div>
              <template v-else>
                <div class="font-weight-bold">
                  <span>POS Grade: </span>
                  <span class="text-secondary lead"><b>{{ grade }}</b></span>
                </div>
                <template v-for="store in stores" >
                  <template v-if="store.storeId == selectedStore">
                    <div class="font-weight-bold" v-for="(data, key, i) in store.data" :key="i">
                      <span>{{ key }}: </span>
                      <span class="text-secondary lead"><b>{{ data }}</b></span>
                    </div>
                  </template>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="my-3 w-100">
        <b-tabs v-model="activeTab" content-class="mt-3">
          <b-tab :active="$route.params.type == '' || $route.params.type == 'overview'" title="Overview">
            <div class="d-flex justify-content-center mt-5" v-if="loadingReportData">
              <div class="spinner-border"></div>
            </div>
            <div class="row small-gutters" v-else>
              <div v-for="(report, index) in reports" :key="`report-${index}`" class="col-sm-3 my-2">
                <div class="card p-3 h-100" :class="boxColor(report)">
                  <div class="font-weight-bold text-center mb-2">{{ report.category }}</div>
                  <div class="d-flex">
                    <div class="d-flex flex-column flex-grow-1 align-items-center" v-for="(category, i) in report.data" :key="`category-${i}`" style="flex: 1;">
                      <div class="flex-grow-1 text-center">
                        <div class="text-black h3 font-weight-bold m-0">{{ category.count }}</div>
                        <div v-if="category.percentage">
                          {{ category.percentage }}%
                        </div>
                        <div v-else>-</div>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex mt-4 flex-grow-1">
                    <div class="d-flex flex-column align-items-center flex-grow-1 px-1" v-for="(category, i) in report.data" :key="`category2-${i}`" style="flex: 1;">
                      <div>
                        <div v-if="isDownloading(report.key, category.title)" class="spinner-border spinner-border-sm"></div>
                        <svg v-else width="24" class="text-primary cursor-pointer" @click="downloadReport(report.key, category.title)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <small class="text-center font-weight-bold mt-1" style="line-height: 14px;">
                        {{ category.label }}
                      </small>
                      <div v-if="report.pos" class="cursor-pointer text-primary mt-1">
                        <svg width="24" @click="openDetails(report.key, category.title, category.label)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </div>
                    </div>
                  </div>
                  <div v-if="report.disclaimer" class="mt-3 alert alert-warning mb-0 px-3 py-2">
                    <small>
                      {{ report.disclaimer }}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </b-tab>

          <b-tab :active="$route.params.type == 'details'" title="Details">
            <div v-if="selectedWidget" class="row my-2">
              <filter-item :filterVal="selectedWidget" @click.native="removeFilter()" class="mb-1 mx-3" />
            </div>
            <div class="row my-4">
              <div class="col-md-4 form-group">
                <label>Product Title Contains</label>
                <input v-model="queryFilters.title" type="text" placeholder="Product Title Contains" @blur="getProducts" class="form-control">
              </div>
              <div class="col-md-4 form-group">
                <label>Departments</label>
                <Treeselect @select="onSelectDepartment"  v-model="selectedDepartment" :multiple="false" :options="departments" :normalizer="normalizer" placeholder="Select department" />
              </div>
              <div class="col-md-2 form-group">
                <label>Price Range</label>
                <div class="d-flex justify-content-center">
                  <input v-model="queryFilters.minPrice" type="number" size="sm" placeholder="Min" class="form-control" @blur="getProducts">
                  <span class="m-2">-</span>
                  <input v-model="queryFilters.maxPrice" type="number" size="sm" placeholder="Max" class="form-control" @blur="getProducts">
                </div>
              </div>
              <div class="col-md-2 form-group">
                <label>Select Brand</label>
                <b-form-select 
                  class="form-control"
                  v-model="queryFilters.selectedBrand"
                  :options="brands"
                  value-field="brand_id"
                  text-field="brand_name" 
                  @change="getProducts">
            
                  <template #first>
                    <b-form-select-option :value="null" disabled>Select Brand</b-form-select-option>
                  </template>
                </b-form-select>
              </div>

            </div>

            <div class="row my-4">
              <div class="col-md-2 col-lg-2 mt-2 mt-md-0">
                <label>Has Image</label>
                <div class="d-flex">
                  <div class="custom-control custom-radio mr-3">
                    <input id="withImage" type="radio" v-model="queryFilters.image" value="y" name="image" class="custom-control-input" @change="getProducts">
                    <label class="custom-control-label" for="withImage">
                      Yes
                    </label>
                  </div>
                  <div class="custom-control custom-radio">
                    <input id="withoutImage" type="radio" v-model="queryFilters.image" value="n" name="image" class="custom-control-input" @change="getProducts">
                    <label class="custom-control-label" for="withoutImage">
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div class="col-md-2 col-lg-2 mt-2 mt-md-0">
                <label>Has Inventory</label>
                <div class="d-flex">
                  <div class="custom-control custom-radio mr-3">
                    <input id="withInventory" type="radio" v-model="queryFilters.inventory" value="yes" name="inventory" class="custom-control-input" @change="getProducts">
                    <label class="custom-control-label" for="withInventory">
                      Yes
                    </label>
                  </div>
                  <div class="custom-control custom-radio">
                    <input id="withoutInventory" type="radio" v-model="queryFilters.inventory" value="no" name="inventory" class="custom-control-input" @change="getProducts">
                    <label class="custom-control-label" for="withoutInventory">
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div class="col-md-1 col-lg-1 mt-2 mt-md-0">
                <label>Hidden</label>
                <div class="custom-control custom-switch">
                  <input type="checkbox" v-model="queryFilters.hidden" class="custom-control-input" id="hide-product" @change="getProducts">
                  <label
                    class="custom-control-label"
                    for="hide-product"
                    v-html="queryFilters.hidden ? 'Yes' : 'No'">
                  </label>
                </div>
              </div>

            </div>

            <div class="row">
              <div class="col-sm-6 mt-2 mt-md-0">
                <div class="title-heading">
                  {{ loadingProducts ? 'Loading...' : totalProducts == 0 ? 'There are no results to show' : `${totalProducts} Results Found` }}
                </div>
                <div class="count-alert mt-1" v-if="totalProducts > queryFilters.limit">
                  All results are not displayed, only {{ queryFilters.limit }} can be displayed
                </div>
              </div>

              <div class="col-sm-6 pt-3 mb-3 mb-sm-0">
                <button class="btn btn-outline-primary float-right mx-1" :disabled="allowUpdateImages" @click="showImageModel">
                  Replace Image(s)
                </button>
                <button class="btn btn-outline-primary float-right mx-1" :disabled="isDownloadingReport" @click="downloadSelectedProducts">
                  Export To CSV
                </button>
              </div>
            </div>

            <div class="mt-4 d-flex justify-content-between align-items-end w-100">
              <input class="form-control mr-2" type="text" placeholder="Filter by Name or SKU" style="max-width: 500px" v-model="searchQuery">
              <div>
                <label class="mr-2" for="inline-form-custom-select-pref">Sort by</label>
                <b-form-select class="form-control" v-model="queryFilters.orderBy" :options="orderOptions" @change="getProducts" style="min-width: 200px" />
              </div>
            </div>

            <div class="d-flex justify-content-center mt-5" v-if="loadingProducts">
              <div class="spinner-border"></div>
            </div>
            <div class="product-list mt-3" v-else-if="products && products.length">
              <div class="card p-3 flex-sm-row rounded-lg align-items-stretch mb-2" v-for="(p, i) in filteredProducts" :key="`p-${i}`">
                <div class="d-flex align-items-center">
                  <div class="custom-control custom-checkbox">
                    <input :id="`select-${i}`" type="checkbox" class="custom-control-input" v-model="selectedProducts" :value="p.id">
                    <label class="custom-control-label" :for="`select-${i}`">&nbsp;</label>
                  </div>
                  <div>
                    <div class="product-img mr-2 mr-sm-3">
                      <img class="w-100 h-100" :src="p.image_url" alt="image" />
                    </div>
                  </div>
                  <div class="main-info font-weight-bold d-flex flex-column justify-content-center">
                    <div class="text-uppercase">
                      <span class="text-muted">sku</span> #<span v-html="searchQuery ? p.sku.replace(new RegExp(searchQuery, 'i'), m => `<mark>${m}</mark>`) : p.sku"></span>
                    </div>
                    <router-link v-html="searchQuery ? p.title.replace(new RegExp(searchQuery, 'i'), m => `<mark>${m}</mark>`).toLowerCase() : p.title.toLowerCase()" class="lead title" v-b-tooltip.hover :title="p.title | lowerCase" :to="{ name: 'products-id', params: { id: p.sku, title: p.title.replace(/[ /]/g, '+') }}" target="_blank">
                    </router-link>
                    <div>
                      {{ p.num_inventory }} In Stock
                    </div>
                  </div>
                </div>
                <div class="d-flex flex-grow-1 mt-2 mt-sm-0">
                  <div class="d-flex mx-sm-3 align-items-center flex-grow-1 text-small">
                    <div class="secondary-info">
                      <div>Price: <b>${{ p.price }}</b></div>
                      <div>Cost:  <b>${{ p.cost }}</b></div>
                      <div>Fields: <b>{{ p.dept_name }}</b></div>
                      <div>Hidden: <b>{{ p.hidden == 1 ? 'Y' : 'N' }}</b></div>
                      <div v-if="p.hidden_reason">Hidden Reason: <b>{{ p.hidden_reason }}</b></div>
                    </div>
                  </div>
                  <div class="d-flex justify-content-end">
                    <div class="d-flex flex-column align-items-end">
                      <div class="flex-grow-1">
                        <router-link :to="{ name: 'product-editor', query: { type: 'sku', code: p.sku }}" class="btn btn-sm btn-outline-primary w-100 btn-action text-tiny" target="_blank">
                          Edit
                        </router-link>
                      </div>
                      <div class="font-weight-bold text-small">
                        <span class="text-muted">Updated:</span> {{ formatDate(p.last_synced) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>

    <product-image ref="imageModal" :selectedProducts="selectedProducts" :selectedProductTitles="selectedProductTitles" @imagesUpdated="imagesUpdated"/>
  </div>

</template>

<script>
  import NoPermission from './no-permission';
  import AdminApiService from '@/api-services/admin.service';
  import ProductImage from '@/components/modals/product-image.vue';
  import moment from 'moment';
  import FilterItem from '@/components/search/filter-item.vue';
  import DepartmentsService from '@/api-services/departments.service';
  import Treeselect from '@riophae/vue-treeselect';

  export default {
    name: 'ConsultationReport',
    components: { NoPermission, ProductImage, FilterItem, Treeselect },
    data() {
      return {
        loadingProducts: true,
        loadingReportData: true,
        isDownloadingReport: false,
        downloadedCategory: '',
        downloadedValue: '',
        selectedUPC: '',
        totalProducts: null,
        selectedWidget: null,
        grade: '',
        activeTab: 0,
        reports: {},
        brands:[],
        products: [],
        stores: [],
        searchQuery: '',
        queryFilters: {
          image: 'y',
          inventory: 'yes',
          hidden: false,
          title: '',
          minPrice: '',
          maxPrice: '',
          orderBy: 'priceHigh',
          upc: '',
          desc: '',
          brand: '',
          dept: '',
          class: '',
          fineline: '',
          selectedBrand: null,
          selectedDept: {},
          limit: 500
        },
        orderOptions: [
          { value: 'priceHigh', text: 'Price Highest' },
          { value: 'priceLow', text: 'Price Lowest' },
          { value: 'lastSynced', text: 'Last Synced' },
          { value: 'oldSynced', text: 'Oldest Synced' },
          { value: 'title', text: 'Title' },
        ],
        selectedProducts: [],
        allProductsSelected: false,
        indeterminate: false,
        selectedStore: localStorage.getItem('selectedStore'),
        selectedDepartment: null
      };
    },
    async mounted() {
      if(!this.departments) {
        let ret = await DepartmentsService.getAllDepartments();
        this.$store.commit('saveDepartments', ret.data.data.departments);
        this.$store.commit('saveFullDepartments', ret.data.data);
      };
      if(this.$ezHasNoPermission('consultation_report')) return;
      await this.getReport();
      await this.getPOSInfo();
      this.getProducts();
      await this.getBrands();
    },
    computed: {
      departments() {
        return this.$store.state.departments ? this.$store.state.departments.map(e => {
          e.type = 'department';
          if(e.children) e.children.map(i => {
            i.type = 'class';
            if(i.children) i.children.map(z => {
              z.type = 'fineline';
              return z;
            });
            return i;
          });
          return e;
        }) : null;
      },
      filteredProducts() {
        return this.products.filter(e => {
          let q = this.searchQuery.toLowerCase();
          if(!q) return e;
          return e.title.toLowerCase().includes(q) || e.sku.toLowerCase().includes(q);
        });
      },
      storeLocations() {
        return this.$store.state.storeLocations;
      },
      businessDetails() {
        return this.$store.state.currentStore;
      },
      allowUpdateImages() {
        return this.selectedProducts.length === 0;
      },
      selectedProductTitles() {
        return this.products.filter(product => {
          return this.selectedProducts.includes(product.id);
        });
      }
    },
    watch: {
      selectedDepartment() {
        if(!this.selectedDepartment) {
          this.queryFilters.selectedDept = {};
          this.getProducts();
        }
      },
      selectedProducts(newValue) {
        if (newValue.length === 0) {
          this.indeterminate = false;
          this.allProductsSelected = false;
        } else if (newValue.length === this.products.length) {
          this.indeterminate = false;
          this.allProductsSelected = true;
        } else {
          this.indeterminate = true;
          this.allProductsSelected = false;
        }
      },
      activeTab(val) {
        this.$router.push({ name: 'admin-consultation-report', params: { type: val == 0 ? 'overview' : val == 1 ? 'details' : '' } }).catch(() => {});
      }
    },
    methods: {
      normalizer(node) {
        if(node.children && !node.children.length) delete node.children;
        let ret = { id: node.dept_id, label: node.name };
        if(node.children) ret.children = node.children;
        return ret;
      },
      formatDate(value) {
        return value ? moment(String(value)).format('MM/DD/YY [\r\n] hh:mmA') : '';
      },
      async storeChanged() {
        localStorage.setItem('selectedStore',this.selectedStore);
        this.$store.dispatch("fetchBusinessInfo");
        this.$store.commit('setCurrentStore');
        this.getReport();
        this.removeFilter();
      },
      async getReport() {
        this.loadingReportData = true;

        await AdminApiService.getBusinessDataReport().then(response => {
          this.loadingReportData = false;
          this.reports = response.data.reports;
          this.grade = response.data.grade;
        });
      },
      async getBrands() {
        await AdminApiService.getConsultationBrands().then(response => {
          this.brands = response.data.brands;
        });
      },
      async getPOSInfo() {
        let response = await AdminApiService.getPosInfo();
        this.stores = response.data.stores;
      },
      getProducts() {
        this.loadingProducts = true;
        this.totalProducts = null;
        AdminApiService.getProducts(this.queryFilters).then(response => {
          this.loadingProducts = false;
          this.products = response.data.products.data;
          this.totalProducts = response.data.products.total;

          this.selectedProducts = [];
          this.allProductsSelected = false;
          this.indeterminate = false;
        });
      },
      onSelectDepartment(dept) {
        if(dept.type == 'department') {
          this.queryFilters.selectedDept = { dept: dept.dept_id };
        } else if(dept.type == 'class') {
          this.queryFilters.selectedDept = { class: dept.dept_id };
        } else if(dept.type == 'fineline') {
          this.queryFilters.selectedDept = { fineline: dept.dept_id };
        }
        this.getProducts();
      },
      openDetails(category, value, widget) {
        this.selectedWidget = widget;
        this.clearQueryFilters();
        this.queryFilters = { ...this.queryFilters, [category]:value };
        this.activeTab = 1;
        this.getProducts();
      },
      removeFilter() {
        this.selectedWidget = null;
        this.clearQueryFilters();
        this.getProducts();
      },
      clearQueryFilters() {
        this.queryFilters = { ...this.queryFilters, 
          image: 'y',
          upc: '',
          desc: '',
          brand: '',
          dept: '',
          class: '',
          fineline: ''
        };
      },
      downloadReport(category, value) {
        if(this.isDownloadingReport) return;
        
        this.isDownloadingReport = true;
        this.downloadedCategory = category;
        this.downloadedValue = value;

        const params = { category: category, value: value };

        AdminApiService.getExportData(params).then(res => {
          let data = res.data;
          let reportContent = "";
          let columns = "";
          data.columns.forEach(column => {
            columns += `${column},`;
          });
          reportContent += `${columns}\r\n`;

          data.report.forEach(e => {
            let row = '';
            let value = '';

            data.columns.forEach(column => {
              value = e[column] ? e[column].toString().trim()  : '';
              value = value.replace(/"/g, '""');
              value = value.replace(/(\r\n|\n|\r|\t)/gm, "");

              if(value.search(/("|,|\n)/g) >= 0) {
                value = `"${value}"`;
              }
              row += `${value},`;
            });

            reportContent += `${row}\r\n`;
          });
 
  
          var pom = document.createElement('a');
          var blob = new Blob([reportContent],{type: 'text/csv;charset=utf-8;'});
          var url = URL.createObjectURL(blob);
          pom.href = url;
          pom.setAttribute('download', data.fileName);
          pom.click();

          this.isDownloadingReport = false;
          this.downloadedCategory = "";
          this.downloadedValue = "";
        });
      },
      isDownloading(category, value) {
        return this.downloadedCategory === category && this.downloadedValue === value;
      },
      selectAllProducts(checked) {
        if(checked) {
          this.products.forEach(product => {
            this.selectedProducts.push(product['id']);
          });
        } else {
          this.selectedProducts = [];
        }
      },
      replaceImage(product) {
        this.selectedProducts = [];
        this.selectedProducts.push(product);
        this.showImageModel();
      },
      showImageModel() {
        this.$refs.imageModal.showModal();
      },
      imagesUpdated() {
        this.getReport();
        this.getProducts();
      },
      downloadSelectedProducts() {
        this.isDownloadingReport = true;
        
        const columns = ["upc", "sku", "title", "num_inventory", "image_url", "price", "cost", "brand_name", "dept_name", "promo_price", "promo_quantity", "promo_message", "class_name", "fineline_name", "last_synced"];
        let header = "";
        let reportContent = "";
        let value = "";

        columns.forEach(function (column) {
          header += column + ',';
        });
        reportContent += header + "\r\n";

        this.products.forEach(function (e) {
          let row = "";

          columns.forEach(function (column) {
            value = e[column] ? e[column].toString().trim()  : '';
              value = value.replace(/"/g, '""');
              value = value.replace(/(\r\n|\n|\r|\t)/gm, "");

              if (value.search(/("|,|\n)/g) >= 0) {
                value = '"' + value + '"';
              }
              row += value + ',';
          });

          reportContent += row + "\r\n";
        });

        var pom = document.createElement('a');
        var blob = new Blob([reportContent],{type: 'text/csv;charset=utf-8;'});
        var url = URL.createObjectURL(blob);
        pom.href = url;
        pom.setAttribute('download', "selected_products.csv");
        pom.click();

        this.isDownloadingReport = false;
      },
      boxColor(report) {
        if(report && report.pos && report.pos === true && report.data) {
          if(report.data[1] && report.data[1].percentage) {
            if(report.data[1].percentage > 90) return "box-red";
            else if(report.data[1].percentage > 75) return "box-lemon";
            else if(report.data[1].percentage > 50) return "box-khaki";
          }
        }
      }
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/treeselect.scss';
  :deep(.vue-treeselect) {
    .vue-treeselect__control {
      height: 43px;
    }
    .vue-treeselect__placeholder, .vue-treeselect__single-value {
      line-height: 43px;
    }
  }
  mark {
    padding: 0;
    background: #ffe24a;
  }
  .product-list {
    > .card {
      .product-img {
        width: 186px;
        height: 86px;
        img {
          object-fit: contain;
        }
      }
      .main-info {
        width: 300px;
        overflow: hidden;
        .title {
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
      .secondary-info > div {
        margin-bottom: -3px;
      }
    }
  }
  @media (max-width: 1199px) {
    .product-list {
      > .card {
        .product-img {
          width: 146px;
        }
        .main-info {
          width: 186px;
        }
      }
    }
  }
  @media (max-width: 575px) {
    .product-list {
      > .card {
        .product-img {
          border: 1px solid #ccc;
          width: 80px;
        }
        .main-info {
          width: auto;
        }
      }
    }
  }
  @media (max-width: 767px) {
  }
  .dept-fields {
    text-align: left;
    width: 130px;
  }
  .container {
    background: #FFFFFF;
  }
  .label {
    font-size: 13px;
    white-space: nowrap;
  }
  .title {
    font-size: 14px;
    font-weight: 600;
    display: block;
  }
  .title-heading {
    font-size: 20px;
    font-weight: 700;
  }
  .info-tabs {
    background: #FFFFFF;
    border: 1px solid #EBEFEF;
    box-sizing: border-box;
    box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.01);
    border-radius: 12px;
    padding: 16px;
    height: 100%;
  }
  .header-info {
    font-size: 14px;
    font-weight: bold;
  }
  .product-image {
    max-width: 64px;
    max-height: 64px;
  }

  .count-alert {
    background: #de2222;
    color: #FFFFFF;
    border-radius: 3px;
    padding: 2px 6px;
    width:fit-content
  }
  .btn-action {
    white-space: nowrap;
  }
  .dept-selector {
    border: 1px solid #E8E8E8;
    border-radius: .25rem;
    display: flex;
    align-items: center;
    
    > div {
      flex: 1;
    }

    @media (max-width: 1024px) {
      flex-direction: column;
    }
  }
  .nav-link {
    color: #acacac;
    padding: 16px 12px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 0;
    
    &:hover:not(.active) {
      color: var(--primary);
    }
    &.active {
      background-color: var(--primary);
      color: #fff;
      svg * {
        fill: #fff;
      }
    }
    svg * {
      fill: var(--primary);
    }
  }
  .tree-list {
    border-left: 1px solid #CBD1D2;
    padding-left: 16px;
    text-align: left;
  }

  .tree-list div {
    padding-left: 16px;
  }

  .tree-list span {
    position: relative;
    line-height: 13px;
    display: block;
    margin-bottom: 6px;
    font-size: 0.75rem;
  }

  .tree-list > span {
    font-weight: bold;
  }

  .tree-list span:before {
    content: '';
    height: 1px;
    background: #CBD1D2;
    position: absolute;
    right: 100%;
    bottom: 50%;
    margin-right: 8px;
  }

  .tree-list > span:before {
    width: 8px;
  }

  .tree-list > div > span:before {
    width:  24px;
  }

  .tree-list > div > div > span:before {
    width: 40px;
  }

  .image-container {
    display: flex;
    align-content: center;
    justify-content: center;

    img {
      max-height: 80px;
      max-width: 100%;
    }
  }

  .box-khaki {
    background-color: #F0E68C !important;
  }
  .box-lemon {
    background-color: #FFFF2B !important;
  }
  .box-red {
    background-color: #de2222 !important;
  }

  .box-khaki,
  .box-lemon {
    color: black;
    .stats-number {
      color: black;
    }
  }

  .box-red {
    color: #fff;
    .stats-number {
      color: #fff;
    }
  }

  .image-cont {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ccc;
    width: 100px;
    height: 100px;
    padding: 5px;
    img {
      max-height: 90px;
      max-width: 90px;
    }
  }
  .table-scroll {
    .table {
      tbody {
        display: block;
      }
      thead, tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed;/* even columns width , fix width of table too*/
      }
      
      .td-select {
        width: 23px;
        padding: 0;
        :deep(.custom-checkbox) {
          label.custom-control-label {
            height: 20px;
          }
        }
      }
      .td-image {
        width: 120px;
      }
      .td-qty {
        width: 55px;
      }
      .td-synced {
        width: 90px;
      }
      .td-hidden {
        width: 70px;
      }
      .td-actions {
        width: 80px;
      }
      /*
      .td-sku {
        width: 140px;
      }
      .td-price {
        width: 130px;
      }*/
    }
  }
  .m-row {
    border-bottom: 1px dotted #ccc;
    padding-top: 4px;
    padding-bottom: 4px;
  }
  @media (max-width: 475px) {
    :deep(.nav-tabs) {
      .nav-item {
        flex-grow: 1;
        text-align: center;
      }
    }
  }
</style>
