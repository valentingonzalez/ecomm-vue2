<template>
    <div v-if="$ezHasNoPermission('manage_orders')" class="container d-flex align-items-center mt-3 justify-content-center">
      <NoPermission :showContact="true" />
    </div>
    <div v-else-if="!isAdvancedShippingEnabled" class="container d-flex align-items-center justify-content-center mt-3">
      <div class="bg-white container d-flex justify-content-center align-items-center" style="height: 600px">
        <div class="text-center">
          <h2 class="font-weight-bold">Get in touch with your account manager to learn more about this now!</h2>
          <button v-b-modal.upgrade-modal class="btn btn-primary" type="button">Contact Me For More Info</button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="pt-4">
        <div :class="{'container' : !panelView}">
          <h4 v-if="!panelView" class="m-0 mb-3">Shipping Labels</h4>
          <div class="mt-md-4">
            <div :class="!isMobileWidth && !panelView ? 'card' : ''">
              <div v-if="!isMobileWidth" class="p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <input type="text" v-model="shippingLabels.filters.search" class="m-1 form-control search-input"
                       placeholder="Tracking Code or Shipping ID" />
  
                <b-form-datepicker
                  placeholder="Select Date"
                  v-model="shippingLabels.filters.start_date"
                  class="form-control datepicker m-1">
                </b-form-datepicker>
  
                <b-form-datepicker
                  placeholder="Select Date"
                  v-model="shippingLabels.filters.end_date"
                  class="form-control datepicker m-1">
                </b-form-datepicker>
  
                <button class="btn-action text-tiny m-1" @click="resetFilters()">
                  Clear
                </button>
              </div>
              <div v-else class="pt-3">
                <div class="mb-md-0">
                    <input type="text" v-model="shippingLabels.filters.search" :style="isMobileWidth && pageWidth < 576 ? { 'max-width': pageWidth - 40 + 'px !important' } : { 'max-width': pageWidth - 70 + 'px !important' }" class="m-1 form-control search-input" placeholder="Tracking Code or Shipping ID" />
                </div>
                <div class="d-md-flex align-items-md-center" :class="pageWidth > 470 ? 'row p-3 justify-content-between' : 'pt-2 pr-2'">
                  <div class="mb-md-0" :style="{ ...(pageWidth > 470 ? { 'padding-right': '15px' } : { 'padding-right': '0px' }), flex: '1 0 0' }">
                    <b-form-datepicker 
                      :style="isMobileWidth && pageWidth < 576 ? { 'max-width': pageWidth - 40 + 'px !important' } : { 'max-width': pageWidth - 70 + 'px !important' }"
                      placeholder="From Date" 
                      size="sm" 
                      v-model="shippingLabels.filters.start_date"
                      class="form-control datepicker m-1"
                    >
                    </b-form-datepicker>
                  </div>
                  <div class="mb-md-0" :style="{ ...(pageWidth > 470 ? { 'padding-right': '15px' } : { 'padding-right': '0px' }), flex: '1 0 0' }">
                    <b-form-datepicker 
                      placeholder="To Date" 
                      size="sm" 
                      v-model="shippingLabels.filters.end_date" 
                      :style="isMobileWidth && pageWidth < 576 ? { 'max-width': pageWidth - 40 + 'px !important' } : { 'max-width': pageWidth - 70 + 'px !important' }"
                      class="form-control datepicker m-1"
                    >
                    </b-form-datepicker>
                  </div>
                  <div class="mb-md-0">
                    <button class="btn btn-sm btn-action text-tiny m-1" @click="resetFilters()">
                      Clear
                    </button>
                  </div>
                </div>

                <div class="row mt-2 d-flex justify-content-between align-items-center pb-1" style="padding-left: 21px; padding-right: 19px;">
                  <div class="mb-md-0 mt-1" v-html="resultsText(shippingLabels)" />
                  <div class="d-flex justify-content-end">
                    <div class="svg-container">
                      <svg class="svg-under cursor-pointer" @click="openMobileFiltersPanel" xmlns="http://www.w3.org/2000/svg" width="36" height="32" fill="none"><g filter="url(#a)"><rect width="32" height="28" x="2" y="1" fill="#fff" rx="4"/><path fill="#334155" fill-rule="evenodd" d="M12.4 9.4a.8.8 0 0 1 .8-.8h9.6a.8.8 0 0 1 .8.8v2.4a.8.8 0 0 1-.234.566L19.6 16.13V19a.8.8 0 0 1-.234.566l-1.6 1.6A.8.8 0 0 1 16.4 20.6v-4.469l-3.766-3.765a.8.8 0 0 1-.234-.566V9.4Z" clip-rule="evenodd"/><rect width="31" height="27" x="2.5" y="1.5" stroke="#CBD5E1" rx="3.5"/></g><defs><filter id="a" width="36" height="32" x="0" y="0" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="1"/><feGaussianBlur stdDeviation="1"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_971_131786"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_971_131786" result="shape"/></filter></defs></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div class="table-wrapper text-center" :class="{'loading' : shippingLabels.loading}">
                <div v-if="isMobileWidth" class="panel-container" :class="{ 'panel-open': isMobileFiltersPanelOpened }" @click.self="closeMobileFiltersPanel">
                  <div class="panel-content">
                    <div class="panel-header">
                      <h6 class="panel-heading">Filters</h6>
                      <button class="close-button" @click="closeMobileFiltersPanel">X</button>
                    </div>
                    <div class="spinner-wrapper">
                      <div class="spinner-border" role="status"></div>
                    </div>
                    <!-- Claimed section -->
                    <div class="filter-section">
                      <h6 class="filter-heading">Order ID</h6>
                      <div class="container ">
                        <div class="row mb-3 ml-1" v-for="oi in orderIdFilters" :key="oi.id">
                          <input
                            class="styled-radio"
                            :id="`oi-${oi.id}`"
                            :value="oi.value"
                            type="radio"
                            v-model="selectedOrderIdFilter"
                          />
                          <label class="ml-2 mb-0" :for="`oi-${oi.id}`">{{ oi.label }}</label>
                        </div>
                      </div>
                    </div>
                    <div class="filter-section">
                      <h6 class="filter-heading">Date Added</h6>
                      <div class="container">
                        <div class="row mb-3 ml-1" v-for="das in dateAddedSort" :key="das.id">
                          <input
                            class="styled-radio"
                            :id="`das-${das.id}`"
                            :value="das.value"
                            type="radio"
                            v-model="selectedDateAddedFilter"
                          />
                          <label class="ml-2 mb-0" :for="`das-${das.id}`">{{ das.label }}</label>
                        </div>
                      </div>
                    </div>
                    <div class="filter-section">
                      <h6 class="filter-heading">Date Updated</h6>
                      <div class="container">
                        <div class="row mb-3 ml-1" v-for="dus in dateUpdatedSort" :key="dus.id">
                          <input
                            class="styled-radio"
                            :id="`dus-${dus.id}`"
                            :value="dus.value"
                            type="radio"
                            v-model="selectedDateUpdatedFilter"
                          />
                          <label class="ml-2 mb-0" :for="`dus-${dus.id}`">{{ dus.label }}</label>
                        </div>
                      </div>
                    </div>
                    <div class="filter-section">
                      <h6 class="filter-heading">Cost</h6>
                      <div class="container">
                        <div class="row mb-3 ml-1" v-for="c in costSort" :key="c.id">
                          <input
                            class="styled-radio"
                            :id="`c-${c.id}`"
                            :value="c.value"
                            type="radio"
                            v-model="selectedCostFilter"
                          />
                          <label class="ml-2 mb-0" :for="`c-${c.id}`">{{ c.label }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="spinner-wrapper">
                  <div class="spinner-border" role="status"></div>
                </div>
  
                <vue-good-table class="p-0 m-0" @on-sort-change="onSortChange" styleClass="table" :columns="shippingLabelsColumns" :rows="shippingLabels.data">
                  <template slot="emptystate" v-if="orderId">
                    <button
                        :disabled="shippingLabels.loading"
                      class="btn-action text-tiny"
                      @click="$emit('showCreateLabelModel')">
                      Create Label
                    </button>
                  </template>
                  <template slot="table-row" slot-scope="props">
                    <div :style="{ width: mobileRowWidth, maxWidth: mobileFirstRowWidth, paddingRight: '10px', paddingLeft: '13px' }" v-if="props.column.field == 'order_id' && isMobileWidth">
                      <div class="row mb-2 pt-2 d-flex justify-content-between" :style="{ width: mobileRowWidth, maxWidth: mobileRowWidth }">
                        <div class="col-6 d-flex justify-content-start"><b>Order <router-link style="text-decoration: underline;" :to="`/admin/order-details/${props.row.order_id}`">#{{props.row.order_id}}</router-link></b></div>
                        <!--<div class="col-6 d-flex justify-content-end align-items-center">
                          <svg style="margin-right: 5px;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"><path stroke="#64748B" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 3v4h3m3 0A6 6 0 1 1 .999 7 6 6 0 0 1 13 7Z"/></svg>
                          <div v-html="props.row.created_at"></div>
                        </div> -->
                      </div>
                    </div>
                    <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'created_at' && isMobileWidth">
                      <div class="col-6 mobile-column-field d-flex justify-content-start">Created At</div>
                      <div class="col-6 mobile-row-field d-flex justify-content-end" :class="pageWidth < 300 ? 'mt-4' : ''">{{props.row.created_at}}</div>
                    </div>
                    <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'updated_at' && isMobileWidth">
                      <div class="col-6 mobile-column-field d-flex justify-content-start">Updated At</div>
                      <div class="col-6 mobile-row-field d-flex justify-content-end" :class="pageWidth < 300 ? 'mt-4' : ''">{{props.row.updated_at}}</div>
                    </div>
                    <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'status' && isMobileWidth">
                      <div class="col-6 mobile-column-field d-flex justify-content-start">Status</div>
                      <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.row.status}}</div>
                    </div>
                    <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'return_label' && isMobileWidth">
                      <div class="col-6 mobile-column-field d-flex justify-content-start">Return Label</div>
                      <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.row.return_label}}</div>
                    </div>
                    <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'refund_status' && isMobileWidth">
                      <div class="col-6 mobile-column-field d-flex justify-content-start">Refund Status</div>
                      <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.row.refund_status}}</div>
                    </div>
                    <div class="row pl-2 d-flex justify-content-between align-items-center" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'label' && isMobileWidth">
                      <div class="col-6 mobile-column-field d-flex justify-content-start">Shipping Label</div>
                      <div class="col-6 mobile-row-field d-flex justify-content-end">
                        <button
                          :disabled="loading[props.row.id] === true"
                          class="btn-sm btn-action text-tiny"
                          @click="showLabel(props.row)">
                          <span v-if="loading[props.row.id] === true"><i class="fa fa-spinner fa-spin"></i></span>
                          <span v-else>View</span>
                        </button>
                      </div>
                    </div>
                    <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'tracking_code' && isMobileWidth">
                      <div class="col-6 mobile-column-field d-flex justify-content-start">Tracking Code</div>
                      <div class="col-6 mobile-row-field d-flex justify-content-end" :class="pageWidth < 360 ? 'mt-4' : ''">{{props.row.tracking_code}}</div>
                    </div>
                    <div class="row pl-2 d-flex justify-content-between" :class="props.row['refund_status'] != null ? 'mobile-bottom-row' : ''" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'rate' && isMobileWidth">
                      <div class="col-6 mobile-column-field d-flex justify-content-start" :style="props.row['refund_status'] != null ? 'padding-left: 8px;' : ''">Cost</div>
                      <div class="col-6 mobile-row-field d-flex justify-content-end" :style="props.row['refund_status'] != null ? 'padding-right: 22px !important;' : ''">${{props.row.rate ? props.row.rate : '0'}}</div>
                    </div>
                    <div class="row d-flex justify-content-between align-items-center mobile-bottom-row" style="padding-left: 5px;" :style="{ width: mobileRowWidth, ...(props.row['refund_status'] == null ? { 'margin-bottom': '17px' } : {}) }" v-else-if="props.column.field == 'refund_request' && props.row['refund_status'] == null && isMobileWidth">
                      <div class="col-6 mobile-column-field d-flex justify-content-start" style="padding-left: 10px;" :style="props.row['refund_status'] != null ? 'margin-bottom: 20px;' : ''">Request Refund</div>
                      <div class="col-6 mobile-row-field d-flex justify-content-end" style="padding-right: 20px;">
                        <button
                          :disabled="requestingRefund == props.row['id']"
                          class="btn-action text-tiny btn-sm"
                          @click="requestRefund(props.row['id'])">
                          <div v-if="requestingRefund == props.row['id']" class="spinner spinner-border spinner-border-sm mr-2" />
                          Request Refund
                        </button>
                      </div>
                    </div>
                    <button
                      v-else-if="props.column.field == 'label' && !isMobileWidth"
                      :disabled="loading[props.row.id] === true"
                      class="btn-action text-tiny"
                      @click="showLabel(props.row)">
                      <span v-if="loading[props.row.id] === true"><i class="fa fa-spinner fa-spin"></i></span>
                      <span v-else>View</span>
                    </button>
                    <button
                      v-else-if="props.column.field == 'refund_request' && props.row['refund_status'] == null && !isMobileWidth"
                      :disabled="requestingRefund == props.row['id']"
                      class="btn-action text-tiny"
                      @click="requestRefund(props.row['id'])">
                      <div v-if="requestingRefund == props.row['id']" class="spinner spinner-border spinner-border-sm mr-2" />
                      Request Refund
                    </button>
                    <span v-else>{{ props.formattedRow[props.column.field] }}</span>
                  </template>
                </vue-good-table>
  
                <div class="p-md-2 pl-md-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center" :class="!isMobileWidth ? 'p-3 border-top border-gray' : ''">
                  <div v-if="!isMobileWidth" class="mb-2 mb-md-0" v-html="resultsText(shippingLabels)" />
                  <VuePagination v-if="shippingLabels.pageCount && shippingLabels.pageCount > 1" :pages="shippingLabels.pageCount" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PrintLabelModal ref="shippingLabelPrint" @setLoading="setLoading" :orderId="getOrderId" :label="label"/>
    </div>
  </template>
  
  <script>
  
  import AdminService from '@/api-services/admin.service';
  import debounce from 'debounce';
  import NoPermission from '../settings/no-permission';
  import {VueGoodTable} from 'vue-good-table';
  import PrintLabelModal from '@/components/modals/print-label-modal';
  import moment from 'moment';
  
  export default {
    name: "ShippingLabels",
    components: {
      NoPermission,
      VueGoodTable,
      PrintLabelModal
    },
    props: {
      orderId: {
        type: Number,
        default: null
      },
      panelView: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        shippingLabels: {
          data: [],
          pages: null,
          perPage: 6,
          pageCount: 1,
          count: '',
          filters: {},
          loading: false,
          sort: '',
          dir: ''
        },
        sortOptions: {
          enabled: true,
          multipleColumns: false,
          initialSortBy: { field: 'id', type: 'asc' }
        },
        bootstrapPaginationClasses: {
          ul: 'pagination justify-content-center',
          li: 'page-item',
          liActive: 'active',
          liDisable: 'disabled',
          button: 'page-link',
        },
        requestingRefund: null,
        label: null,
        loading: {},
        pageWidth: 0,
        // filters for mobile view
        isMobileFiltersPanelOpened: false,
        selectedOrderIdFilter: null,
        selectedDateAddedFilter: null,
        selectedDateUpdatedFilter: null,
        selectedCostFilter: null,
        orderIdFilters: [
          { id: 1, value: { field: 'order_id', type: 'desc' }, label: 'Highest to Lowest' },
          { id: 2, value: { field: 'order_id', type: 'asc' }, label: 'Lowest to Highest' }
        ],
        dateAddedSort: [
          { id: 1, value: { field: 'created_at', type: 'desc' }, label: 'Newest to Oldest' },
          { id: 2, value: { field: 'created_at', type: 'asc' }, label: 'Oldest to Newest' }
        ],
        dateUpdatedSort: [
          { id: 1, value: { field: 'updated_at', type: 'desc' }, label: 'Newest to Oldest' },
          { id: 2, value: { field: 'updated_at', type: 'asc' }, label: 'Oldest to Newest' }
        ],
        costSort: [
          { id: 1, value: { field: 'rate', type: 'desc' }, label: 'Highest to Lowest' },
          { id: 2, value: { field: 'rate', type: 'asc' }, label: 'Lowest to Highest' }
        ],
      };
    },
    computed: {
      getOrderId() {
        if (this.orderId) return this.orderId;
        if (this.label) {
          return this.label.order_id;
        }
        return 0;
      },
      shippingLabelsColumns() {
        return [
          { field: 'order_id', type: 'number', label: 'Order Id', sortable: true },
          { field: 'created_at', label: 'Date Added', html: true, sortable: true },
          { field: 'updated_at', label: 'Date Updated', html: true, sortable: true },
          { field: 'status', label: 'Status', html: true, sortable: false },
          { field: 'return_label', label: 'Return Label', html: true, sortable: false },
          { field: 'refund_status', label: 'Refund Status', html: true, sortable: false },
          { field: 'label', tdClass: 'text-center', label: 'Shipping Label', sortable: false, html: true },
          { field: 'tracking_code', label: 'Tracking Code', html: true, sortable: false },
          { field: 'rate', label: 'Cost', tdClass: 'text-center font-weight-bold', formatFn: value => `$${value ? value : 0}` },
          { field: 'refund_request', tdClass: 'text-center', label: 'Request Refund', sortable: false, html: true }
        ];
      },
      isAdvancedShippingEnabled() {
        return this.$store.state.businessDetails.advanced_shipping_enabled == 1;
      },
      isMobileWidth() {
        return this.pageWidth < 769;
      },
      mobileRowWidth() {
        if (this.pageWidth < 577) {
          return `${this.pageWidth - 30}px`;
        } else {
          return `${this.pageWidth - 60}px`;
        }
      },
      mobileFirstRowWidth() {
        if (this.pageWidth < 577) {
          return `${this.pageWidth - 50}px`;
        } else {
          return `${this.pageWidth - 80}px`;
        }
      },
    },
    methods: {
      setLoading(data) {
        this.$set(this.loading, data.id, data.load);
      },
      showLabel(label) {
        this.label = label;
        setTimeout(() => {
          this.$refs.shippingLabelPrint.showModalPrint();
        }, 200);
      },
      resetFilters() {
        this.shippingLabels.filters = {};
      },
      resultsText(d) {
        let from = ((((Number(this.$route.query.page) - 1) * d.perPage) - d.perPage) + d.data.length + 1);
        let to = ((Number(this.$route.query.page || 1) * d.perPage) - d.perPage) + d.data.length;
        return d.count ? `Showing  ${d.loading ? '...' : `<b>${from > 0 ? from : 1}</b> to <b>${to}</b> of <b>${d.count}</b> results`}` : '';
      },
      onSortChange(params) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { dir: params['0'].type }) }).catch(() => {});
        this.$router.push({ query: Object.assign({}, this.$route.query, { sort: params['0'].field }) }).catch(() => {});
      },
      async getShippingLabels(data = {}) {
  
        if (this.orderId) {
          data.orderId = this.orderId;
        }
        data.page = this.$route.query.page || 1;
        data.sort = this.shippingLabels.sort;
        data.dir = this.shippingLabels.dir;
        data.perPage = this.shippingLabels.perPage;
        for (const [key, value] of Object.entries(this.shippingLabels.filters)) {
          data[key] = value;
        }
  
        this.shippingLabels.loading = true;
        AdminService.getShippingLabels(data).then(r => {
          r.data.shippingLabels.map(o => {
            o.created_at_mobile = moment.utc(o.created_at).local().format('[<b>]MM/DD/YY [<span class="border-left text-muted" style="padding-left: 3px;">]hh:mm A[</span></b>]');
            o.return_label = o.return_label ? 'Yes' : 'No';
            return o;
          });
          this.shippingLabels.data = r.data.shippingLabels;
          this.shippingLabels.count = r.data.count;
          this.shippingLabels.pageCount = Math.ceil(this.shippingLabels.count / this.shippingLabels.perPage);
          this.shippingLabels.loading = false;
          if (this.shippingLabels.data.length) {
            this.$emit('showMoreLabelsButton');
          }
        });
      },
      requestRefund(id) {
        this.$swal({
          title: 'Request Refund',
          html: `Are you sure you want to Request Refund?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.value) {
            this.requestingRefund = id;
            AdminService.requestRefund(id).then(r => {
              this.requestingRefund = null;
              if (r.data.status === 'error') {
                this.$swal({
                  toast: true,
                  position: 'top',
                  title: `Error`,
                  html: r.data.message,
                  showConfirmButton: false,
                  timer: 5000,
                  type: 'error',
                });
              } else {
                for (let i=0; i<(this.shippingLabels.data.length-1); i++) {
                  if (this.shippingLabels.data[i].id == id) {
                    this.$set(this.shippingLabels.data, i, r.data.label);
                    break;
                  }
                }
                this.$swal({
                  toast: true,
                  position: 'top',
                  title: 'Success',
                  html: r.data.message,
                  showConfirmButton: false,
                  timer: 5000,
                  type: 'success',
                });
              }
            });
          }
        });        
      },
      handleResize() {
        this.pageWidth = window.innerWidth;
      },
      openMobileFiltersPanel() {
        this.isMobileFiltersPanelOpened = true;
        document.body.style.overflow = 'hidden';
      },
      closeMobileFiltersPanel() {
        this.isMobileFiltersPanelOpened = false;
        document.body.style.overflow = '';
      },
      clearAllSortingFilters(avoidClear = null) {
        if(avoidClear != 'avoid_order_id_filter') {
          this.selectedOrderIdFilter = null;
        }
        if(avoidClear != 'avoid_created_at_filter') {
          this.selectedDateAddedFilter = null;
        }
        if(avoidClear != 'avoid_updated_at_filter') {
          this.selectedDateUpdatedFilter = null;
        }
        if(avoidClear != 'avoid_cost_filter') {
          this.selectedCostFilter = null;
        }
      },
      applySelectedSort(val, avoidClear) {
        this.clearAllSortingFilters(avoidClear);
        const params = [{
          field: val.field,
          type: val.type
        }];
        this.onSortChange(params);
      }
    },
    mounted() {
      if(this.$ezHasNoPermission('manage_orders') || !this.isAdvancedShippingEnabled) return;
      this.clearAllSortingFilters();
      this.getShippingLabels();
      this.pageWidth = window.innerWidth;
      window.addEventListener('resize', this.handleResize);
    },
    watch: {
      'shippingLabels.filters': {
        deep: true,
        handler: debounce(function() {
          this.getShippingLabels();
        }, 500)
      },
      '$route.query.page'() {
        this.getShippingLabels();
      },
      '$route.query.sort'(val) {
        this.shippingLabels.sort = val;
        this.getShippingLabels();
      },
      '$route.query.dir'(val) {
        this.shippingLabels.dir = val;
        this.getShippingLabels();
      },
      selectedOrderIdFilter(val) {
        if(val) {
          this.applySelectedSort(val, 'avoid_order_id_filter');
        }
      },
      selectedDateAddedFilter(val) {
        if(val) {
          this.applySelectedSort(val, 'avoid_created_at_filter');
        }
      },
      selectedDateUpdatedFilter(val) {
        if(val) {
          this.applySelectedSort(val, 'avoid_updated_at_filter');
        }
      },
      selectedCostFilter(val) {
        if(val) {
          this.applySelectedSort(val, 'avoid_cost_filter');
        }
      },
    }
  };
  </script>
  
  <style scoped lang="scss">
  $pickup_bg: #FEE2E2;
  $delivery_bg: #FEF3C7;
  $shipping_bg: #D1FAE5;
  $special_bg: #DBEAFE;
  $pickup: #B91C1C;
  $delivery: #B45309;
  $shipping: #047857;
  $special: #1D4ED8;
  $pickup_s: #F87171;
  $delivery_s: #FBBF24;
  $shipping_s: #34D399;
  $special_s: #60A5FA;
  
  .table-wrapper {
    position: relative;
    min-height: 100px;
    max-width: 100%;
    :deep(.vgt-responsive) {
      overflow-x: scroll;
      max-width: 100%;
      tr {
        td.index,
        th.index {
          position: sticky;
          left: 0;
          background: #fff;
        }
        th.index {
          background: #F8FAFC;
          z-index: 2;
        }
      }
    }
    .spinner-wrapper {
      position: absolute;
      display: none;
      left: 50%;
      margin: -32px 0 0 -16px;
      z-index: 8;
      top: 50%;
      transform: translateY(-50%);
    }
    &.loading {
      .spinner-wrapper {
        display: block;
      }
      :deep(.table) {
        opacity: .5;
      }
      :deep(.panel-content) {
        opacity: .8;
        cursor: not-allowed;
      }
    }
  }
  
  .heading--button{
    width: 100%;
    h3 {
      display: inline-block;
    }
  
    button:disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }
  }
  
  .search-input {
    max-width: 385px;
    background: url('/icons/search.svg') 12px center no-repeat;
    padding-left: 40px !important;
    height: 36px;
  }
  
  .datepicker {
    max-width: 385px;
    height: 36px;
  }
  
  .filters {
    .filter {
      background: #F3F4F6;
      height: 20px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      color: #334155;
      font-size: 12px;
      border-radius: 20px;
      margin: 0 5px;
      &.pickup {
        background: $pickup_bg;
        color: $pickup;
        svg path { stroke: $pickup_s; }
      }
      &.delivery {
        background: $delivery_bg;
        color: $delivery;
        svg path { stroke: $delivery_s; }
      }
      &.shipping {
        background: $shipping_bg;
        color: $shipping;
        svg path { stroke: $shipping_s; }
      }
      &.special {
        background: $special_bg;
        color: $special;
        svg path { stroke: $special_s; }
      }
    }
    .clear-all {
      font-size: 14px;
      color: #64748B;
      margin-right: 10px;
    }
  }

  .mobile-column-field {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    color: #64748B;
  }
  .mobile-row-field {
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 20px;
    text-align: right;
    color: #334155;
  }

  .panel-container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    transition: transform 0.2s ease-out;
    transform: translateX(100%);
    z-index: 9999;
    overflow-y: auto;
  }

  .panel-open {
    transform: translateX(0);
  }

  .panel-content {
    position: absolute;
    top: 0;
    right: 0;
    width: 55%;
    height: 100%;
    background-color: #fff;
    z-index: 1;
    animation: slideInRight 0.3s forwards;
    overflow: hidden; 
    overflow-y: auto; 
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #dee2e6;
  }

  .panel-heading {
    margin: 0;
  }

  .close-button {
    border: none;
    background: none;
    font-size: 14px;
    cursor: pointer;
  }

  .filter-heading {
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 24px;


    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 16px;
    gap: 8px;


    background: #F1F5F9;

    flex: none;
    order: 0;
    flex-grow: 0;
  }

  .filter-actions {
    margin-top: 1rem;
    text-align: center;
  }

  .mobile-top-row {
    margin-left: -8px !important;
    border-top: 4px solid rgb(226, 232, 240);
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
  }

  .mobile-bottom-row {
    margin-left: -8px !important;
  }

  @media (max-width: 768px) {
    .table-wrapper {
      :deep(.vgt-responsive) {
        overflow-x: clip;
      }
    }
    :deep(table) {
      border-collapse: separate;
      border-spacing: 0 15px;
      td {
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
      }
      td:first-child {
        border-top: 2px solid rgb(226, 232, 240);
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
        border-bottom: 1px solid rgb(226, 232, 240);
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        padding: 0.2rem;
      }
      td:nth-child(7) {
        border-bottom: 1px solid rgb(226, 232, 240);
      }
      td:last-child {
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
        border-bottom: 2px solid rgb(226, 232, 240);
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
      }
    }
    :deep(th) {
      display: none;
    }
    :deep(td) {
      display: flex;
      width: 100%;
      padding: .5rem;
      .email {
        display: none;
        margin-left: 10px;
      }
    }
  }
  </style>
  
  