<template>
  <div v-if="$ezHasNoPermission('manage_orders')" class="container d-flex align-items-center justify-content-center mt-3">
    <NoPermission :showContact="true" />
  </div>
  <div v-else-if="!isRecurringOrdersEnabled" class="container d-flex align-items-center justify-content-center mt-3">
    <div class="bg-white container d-flex justify-content-center align-items-center" style="height: 600px">
      <div class="text-center">
        <h2 class="font-weight-bold">Get in touch with your account manager to learn more about this now!</h2>
        <button v-b-modal.upgrade-modal class="btn btn-primary" type="button">Contact Me For More Info</button>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="pt-4">
      <div class="container">
        <h4 class="m-0 mb-3">Recurring Orders</h4>
        <p class="text-muted">
          Manage Your Customers' Recurring Orders Schedules
        </p>
        <div class="mt-md-4">
          <div :class="!isMobileWidth ? 'card' : ''">              
            <div v-if="!isMobileWidth" class="p-3 d-flex flex-column flex-md-row justify-content-end align-items-md-center">
              <b-form-datepicker
                placeholder="From Date"
                v-model="recurringOrders.filters.start_date"
                class="form-control datepicker m-1"
              >
              </b-form-datepicker>

              <b-form-datepicker
                placeholder="To Date"
                v-model="recurringOrders.filters.end_date"
                class="form-control datepicker m-1"
              >
              </b-form-datepicker>

              <button class="btn-action text-tiny m-1" @click="resetFilters()">
                Clear
              </button>
            </div>
            <div v-else>
              <div class="d-md-flex align-items-md-center" :class="pageWidth > 470 ? 'row justify-content-between pl-3 pr-3' : 'pt-2 pr-2'">
                <div class="mb-md-0" :style="{ ...(pageWidth > 470 ? { 'padding-right': '15px' } : { 'padding-right': '0px' }), flex: '1 0 0' }">
                  <b-form-datepicker 
                    :style="isMobileWidth && pageWidth < 576 ? { 'max-width': pageWidth - 40 + 'px !important' } : { 'max-width': pageWidth - 70 + 'px !important' }"
                    size="sm"
                    placeholder="From Date"
                    v-model="recurringOrders.filters.start_date"
                    class="form-control datepicker m-1">
                  </b-form-datepicker>
                </div>
                <div class="mb-md-0" :style="{ ...(pageWidth > 470 ? { 'padding-right': '15px' } : { 'padding-right': '0px' }), flex: '1 0 0' }">
                  <b-form-datepicker 
                    :style="isMobileWidth && pageWidth < 576 ? { 'max-width': pageWidth - 40 + 'px !important' } : { 'max-width': pageWidth - 70 + 'px !important' }"
                    size="sm"
                    placeholder="To Date"
                    v-model="recurringOrders.filters.end_date"
                    class="form-control datepicker m-1">
                  </b-form-datepicker>
                </div>
                <div class="mb-md-0">
                  <button class="btn btn-sm btn-action text-tiny m-1" @click="resetFilters()">
                    Clear
                  </button>
                </div>
              </div>
              <div class="row mt-3 d-flex justify-content-between align-items-center pb-1" style="padding-left: 20px; padding-right: 20px;">
                <div class="mb-md-0 mt-1" v-html="resultsText(recurringOrders)" />
                <div class="d-flex justify-content-end">
                  <div class="svg-container">
                    <svg class="svg-under cursor-pointer" @click="openMobileFiltersPanel" xmlns="http://www.w3.org/2000/svg" width="36" height="32" fill="none"><g filter="url(#a)"><rect width="32" height="28" x="2" y="1" fill="#fff" rx="4"/><path fill="#334155" fill-rule="evenodd" d="M12.4 9.4a.8.8 0 0 1 .8-.8h9.6a.8.8 0 0 1 .8.8v2.4a.8.8 0 0 1-.234.566L19.6 16.13V19a.8.8 0 0 1-.234.566l-1.6 1.6A.8.8 0 0 1 16.4 20.6v-4.469l-3.766-3.765a.8.8 0 0 1-.234-.566V9.4Z" clip-rule="evenodd"/><rect width="31" height="27" x="2.5" y="1.5" stroke="#CBD5E1" rx="3.5"/></g><defs><filter id="a" width="36" height="32" x="0" y="0" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="1"/><feGaussianBlur stdDeviation="1"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_971_131786"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_971_131786" result="shape"/></filter></defs></svg>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-wrapper text-center" :class="{'loading' : recurringOrders.loading}">
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
                    <h6 class="filter-heading">From Date</h6>
                    <div class="container">
                      <div class="row mb-3 ml-1" v-for="fds in fromDateSort" :key="fds.id">
                        <input
                          class="styled-radio"
                          :id="`fds-${fds.id}`"
                          :value="fds.value"
                          type="radio"
                          v-model="selectedFromDateSort"
                        />
                        <label class="ml-2 mb-0" :for="`fds-${fds.id}`">{{ fds.label }}</label>
                      </div>
                    </div>
                    <h6 class="filter-heading">To Date</h6>
                    <div class="container">
                      <div class="row mb-3 ml-1" v-for="tds in toDateSort" :key="tds.id">
                        <input
                          class="styled-radio"
                          :id="`tds-${tds.id}`"
                          :value="tds.value"
                          type="radio"
                          v-model="selectedToDateSort"
                        />
                        <label class="ml-2 mb-0" :for="`tds-${tds.id}`">{{ tds.label }}</label>
                      </div>
                    </div>
                    <h6 class="filter-heading">Setup Date</h6>
                    <div class="container">
                      <div class="row mb-3 ml-1" v-for="das in dateAddedSort" :key="das.id">
                        <input
                          class="styled-radio"
                          :id="`das-${das.id}`"
                          :value="das.value"
                          type="radio"
                          v-model="selectedDateAddedSort"
                        />
                        <label class="ml-2 mb-0" :for="`das-${das.id}`">{{ das.label }}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="spinner-wrapper">
                <div class="spinner-border" role="status"></div>
              </div>

              <vue-good-table class="p-0 m-0" @on-sort-change="onSortChange" styleClass="table" :columns="columns" :rows="recurringOrders.data">
                  <template slot="table-row" slot-scope="props">
                    <div class="row pl-2 pt-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-if="props.column.field == 'order_id' && isMobileWidth">
                      <div class="col-6 mobile-column-field d-flex justify-content-start ">Order #</div>
                      <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.row.order_id}}</div>
                    </div>
                    <div v-else-if="props.column.field == 'order_id' && !isMobileWidth">
                      <router-link :to="`/admin/order-details/${props.row.order_id}`">#{{props.row.order_id}}</router-link>
                    </div>
                    <div class="row pl-2 pt-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'start_date' && isMobileWidth">
                      <div class="col-6 mobile-column-field d-flex justify-content-start ">From Date</div>
                      <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.row.start_date}}</div>
                    </div>
                    <div class="row pl-2 pt-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'end_date' && isMobileWidth">
                      <div class="col-6 mobile-column-field d-flex justify-content-start ">To Date</div>
                      <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.row.end_date}}</div>
                    </div>
                    <div class="row pl-2 pt-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'date_added' && isMobileWidth">
                      <div class="col-6 mobile-column-field d-flex justify-content-start ">Setup Date</div>
                      <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.row.date_added}}</div>
                    </div>
                    <div class="row pl-2 pt-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'period' && isMobileWidth">
                      <div class="col-6 mobile-column-field d-flex justify-content-start ">Period (Days)</div>
                      <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.row.period}}</div>
                    </div>
                    <div class="row pl-2 pt-2 pb-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'status' && isMobileWidth">
                      <div class="col-6 mobile-column-field d-flex justify-content-start ">Status</div>
                      <div class="col-6 mobile-row-field d-flex justify-content-end" :class="pageWidth < 360 ? 'mt-4' : ''">
                        <span class="text-capitalize">{{ props.row.status }}</span>
                      </div>
                    </div>
                    <div class="row pl-2 pt-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'actions' && isMobileWidth">
                      <button
                        v-if="props.row.status == 'active'"                        
                        class="btn-action text-tiny ml-2"
                        @click="openCancelRecurringOrdersModal(props.row)">
                          <span class="text-danger">Cancel</span>
                        </button>
                    </div>
                                        
                    <button
                    v-else-if="props.column.field == 'actions' && !isMobileWidth && props.row.status == 'active'"                        
                    class="btn-action text-tiny ml-2"
                    @click="openCancelRecurringOrdersModal(props.row)">
                      <span class="text-danger">Cancel</span>
                    </button>
                    <span class="text-capitalize" v-else-if="!isMobileWidth">{{ props.formattedRow[props.column.field] }}</span>
                  </template> 
              </vue-good-table>

              <div v-if="recurringOrders.data" class="p-md-2 pl-md-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center" :class="!isMobileWidth ? 'p-3 border-top border-gray' : ''">
                <div v-if="!isMobileWidth" class="mb-2 mb-md-0" v-html="resultsText(recurringOrders)" />
                <VuePagination v-if="recurringOrders.pageCount && recurringOrders.pageCount > 1" :pages="recurringOrders.pageCount" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <b-modal v-model="showCancelRecurringOrderExecutionsModal" size="lg" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
        <template #modal-title>
          <div class="text-capitalize">Edit Order #{{selectedRecurringOrderMasterOrderId}} Recurring Orders</div>
        </template>
        <p>
          <i class="fa fa-info-circle done-check-info-icon mr-1"></i>
          Select the Recurring Order dates you want to cancel for this order.
          Click "Cancel All" if you want to cancel all Recurring Orders left for this order.
        </p>
        <div class="container d-flex justify-content-center executions-table">
          <table class="table text-center">
            <thead>
              <tr>
                <th>Recurring Order Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-for="item in selectedRecurringOrderExecutionDates" :key="item.id"
                  :class="{ 'disabled-row': item.order_id || item.is_cancelled_by_customer == 1 }">
                <td>{{ formatDate(item.execution_date) }}</td>
                <td>{{ item.status }}</td>
                <td>
                  <button v-if="item.status == 'Pending'" class="btn btn-sm btn-action text-tiny" @click="cancelExecution(selectedRecurringOrderMasterOrderId, item.id)">
                    <span class="text-danger">Cancel</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-end mt-2">
          <b-button variant="outline-danger" @click.prevent="closeUpdateExecutionsModal">Go Back</b-button>
          <b-button class="ml-3" variant="danger" @click.prevent="cancelRecurringOrder({order_id: selectedRecurringOrderMasterOrderId})">Cancel All</b-button>
        </div>
      </b-modal>
    </div>
  </div>
</template>
<script>
  import AdminService from '@/api-services/admin.service';
  import debounce from 'debounce';
  import NoPermission from '../settings/no-permission';
  import {VueGoodTable} from 'vue-good-table';
  import moment from 'moment-timezone';
  
  export default {
    name: "recurringOrders",
    components: {
      NoPermission,
      VueGoodTable
    },
    props: {
      orderId: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        recurringOrders: {
          data: [],
          pages: null,
          perPage: 10,
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
        loading: {},
        pageWidth: 0,
        // filters for mobile view
        isMobileFiltersPanelOpened: false,
        selectedFromDateSort: null,
        selectedToDateSort: null,
        selectedDateAddedSort: null,
        fromDateSort: [
          { id: 1, value: { field: 'start_date', type: 'desc' }, label: 'Newest to Oldest' },
          { id: 2, value: { field: 'start_date', type: 'asc' }, label: 'Oldest to Newest' }
        ],
        toDateSort: [
          { id: 1, value: { field: 'end_date', type: 'desc' }, label: 'Newest to Oldest' },
          { id: 2, value: { field: 'end_date', type: 'asc' }, label: 'Oldest to Newest' }
        ],
        dateAddedSort: [
          { id: 1, value: { field: 'date_added', type: 'desc' }, label: 'Newest to Oldest' },
          { id: 2, value: { field: 'date_added', type: 'asc' }, label: 'Oldest to Newest' }
        ],
        showCancelRecurringOrderExecutionsModal: false,
        selectedRecurringOrderExecutionDates: [],
        selectedRecurringOrderMasterOrderId: null
      };
    },
    computed: {
      showLocations() {
        return this.$store.state.storeLocations && this.$store.state.storeLocations.length && this.$store.state.storeLocations.length > 1;
      }, 
      columns() {
        let _self = this;
        return [
          { field: 'order_id', label: 'Order Id', html: true, sortable: false }, 
          { field: 'store_name', label: 'Store Name', html: true, sortable: false },          
          { field: 'next_execution_date', label: 'Next Recurring Order', html: true, sortable: true, formatFn: function(value) {return _self.formatDate(value);}},
          { field: 'start_date', label: 'Start Date', html: true, sortable: true, formatFn: function(value) {return _self.formatDate(value);}},
          { field: 'end_date', label: 'End Date', html: true, sortable: true, formatFn: function(value) {return _self.formatDate(value);} },
          { field: 'period', label: 'Period (Days)', html: true, sortable: false },          
          { field: 'date_added', label: 'Setup Date', html: true, sortable: true, formatFn: function(value) {return _self.formatDateTime(value);} },
          { field: 'status', label: 'Status', tdClass: row => `badge-${row.status}`, sortable: false },
          { field: 'actions', label: '', html: false, sortable: false }          
        ];
      },
      settings() {
        return this.$store.state.settings;
      },
      isRecurringOrdersEnabled() {
        return this.$store.state.businessDetails && typeof this.$store.state.businessDetails.enable_recurring_orders != "undefined" ? (this.$store.state.businessDetails.enable_recurring_orders * 1) : 0;        
      }, 
      subAccountSlug(){
        return this.$store.state.activeUser.data.customer.slug;
      },
      isMobileWidth() {
        return this.pageWidth < 769;
      },
      mobileRowWidth() {
        if (this.pageWidth < 577) {
          return `${this.pageWidth - 40}px`;
        } else {
          return `${this.pageWidth - 70}px`;
        }
      },
      mobileFirstRowWidth() {
        if (this.pageWidth < 577) {
          return `${this.pageWidth - 50}px`;
        } else {
          return `${this.pageWidth - 80}px`;
        }
      },
      rentalData(){
        let data = JSON.parse(JSON.stringify(this.rental));
        try {
          if(data.custom_info){
            data.custom_info = JSON.parse(data.custom_info);
          }
        } catch (error) {
          data.custom_info = null;          
        }
        return data;
      },
      today() {
        return moment().format('YYYY-MM-DD');
      },
    },
    methods: {
      storeName(store_id){
        return this.showLocations && store_id ? this.$store.state.storeLocations.find(x => x.business_id == store_id).name : '';
      },
      setLoading(data) {
        this.$set(this.loading, data.id, data.loading);
      },
      async cancelRecurringOrder(row) {
        this.$swal({
          title: "Are you sure you want to cancel all Recurring Orders for this order?",
          type: 'warning',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          showCancelButton: true,
        })
        .then(async (result) => {
          if (result.value) {
            await AdminService.cancelRecurringOrder(row.order_id, { is_cancelled_by_admin: 1 }).then(e => {
              this.getRecurringOrders();
              this.closeUpdateExecutionsModal();
              this.$swal('Success', e.data.message, 'success');
            }).catch(err => err.response);
          }
        });
      },
      async cancelExecution(masterOrderId, executionId) {
        const pendingExecutions = this.selectedRecurringOrderExecutionDates.filter(execution => execution.status === 'Pending');

        if (pendingExecutions.length === 1) {
          this.$swal({
            title: "Warning",
            text: "This would be the last execution remaining for this Recurring Order Scheme. Are you sure you want to cancel this Recurring Order?",
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
          }).then(async (result) => {
            if (result.value) {
              this.cancelRecurringOrder({order_id: masterOrderId});
              this.getRecurringOrders();
              this.closeUpdateExecutionsModal();
            }
          });
        } else {
          this.$swal({
            title: "Warning",
            text: "Are you sure you want to cancel this Recurring Order date?",
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
          }).then(async (result) => {
            if (result.value) {
              await AdminService.cancelRecurringOrderExecution(executionId).then(async () => {
                await AdminService.getRecurringOrderExecutions(masterOrderId).then(e => {
                  this.selectedRecurringOrderExecutionDates = e.data.recurring_orders_executions;
                  this.selectedRecurringOrderMasterOrderId = masterOrderId;
                }).catch(err => err.response);
                this.$swal('Success', e.data.message, 'success');
              }).catch(err => err.response);
            }
          });
        }
      },
      async openCancelRecurringOrdersModal(row) {
        await AdminService.getRecurringOrderExecutions(row.order_id).then(e => {
          this.selectedRecurringOrderExecutionDates = e.data.recurring_orders_executions;
          this.selectedRecurringOrderMasterOrderId = row.order_id;
        }).catch(err => err.response);
        this.showCancelRecurringOrderExecutionsModal = true;
      },
      closeUpdateExecutionsModal() {
        this.selectedRecurringOrderExecutionDates = [];
        this.showCancelRecurringOrderExecutionsModal = false;
        this.selectedRecurringOrderMasterOrderId = null;
      },
      resetFilters() {
        this.recurringOrders.filters = {};
      },
      resultsText(d) {
        let from = ((((Number(this.$route.query.page) - 1) * d.perPage) - d.perPage) + d.data.length + 1);
        let to = (( (Number(this.$route.query.page) || 1 ) * d.perPage) - d.perPage) + d.data.length;
        return d.count ? `Showing  ${d.loading ? '...' : `<b>${from > 0 ? from : 1}</b> to <b>${to}</b> of <b>${d.count}</b> results`}` : '';
      },
      onSortChange(params) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { dir: params['0'].type }) }).catch(() => {});
        this.$router.push({ query: Object.assign({}, this.$route.query, { sort: params['0'].field }) }).catch(() => {});
      },
      async getRecurringOrders(data = {}) {
        data.page = this.$route.query.page || 1;
        data.sort = this.recurringOrders.sort;
        data.dir = this.recurringOrders.dir;
        data.perPage = this.recurringOrders.perPage;
        for (const [key, value] of Object.entries(this.recurringOrders.filters)) {
          data[key] = value;
        }
  
        this.recurringOrders.loading = true;
        AdminService.getRecurringOrders(data).then(r => {
          r.data.recurring_orders.data.map(o => {
            o.status = o.end_date < this.today ? 'finished' : o.cancelled_at === null ? 'active' : 'cancelled';
            return o;
          });
          let recurring_orders = r.data.recurring_orders;
          this.recurringOrders.data = recurring_orders.data;
          this.recurringOrders.count = recurring_orders.count;
          this.recurringOrders.pageCount = Math.ceil(this.recurringOrders.count / this.recurringOrders.perPage);
          this.recurringOrders.loading = false;
          if (this.recurringOrders.data.length) {
            this.$emit('showMoreLabelsButton');
          }
        });
      },
      replaceByDefault(e) {
          e.target.src = this.defaultImage;
      },
      formatDateTime(dateTime){
        if(dateTime){
          return moment.utc(dateTime).local().format('MMM D, YYYY hh:mm A');
        }
        return '';
      },
      formatDate(date) {
        if(date){
          return moment(date).format('MMM DD, YYYY');
        }
        return '';
      },
      fromToDatesHandler(row,name){
        return moment(row[name]).isBefore(moment(row.date_added)) ? '-' : row[name];
      },
      makeToast(variant, title, content) {
        this.$swal({
          toast: true,
          position: 'top',
          text: content,
          showConfirmButton: false,
          timer: 3000,
          type: variant,
          title: title
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
        if(avoidClear != 'avoid_start_date_filter') {
          this.selectedFromDateSort = null;
        }
        if(avoidClear != 'avoid_end_date_filter') {
          this.selectedToDateSort = null;
        }
        if(avoidClear != 'avoid_date_added_filter') {
          this.selectedDateAddedSort = null;
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
      if(this.$ezHasNoPermission('manage_orders') || !this.isRecurringOrdersEnabled) return;
      this.clearAllSortingFilters();
      this.getRecurringOrders();
      this.pageWidth = window.innerWidth;
      window.addEventListener('resize', this.handleResize);
    },
    watch: {
      'recurringOrders.filters': {
        deep: true,
        handler: debounce(function() {
          this.getRecurringOrders();
        }, 500)
      },
      '$route.query.page'() {
        this.getRecurringOrders();
      },
      '$route.query.sort'(val) {
        this.recurringOrders.sort = val;
        this.getRecurringOrders();
      },
      '$route.query.dir'(val) {
        this.recurringOrders.dir = val;
        this.getRecurringOrders();
      },
      selectedFromDateSort(val) {
        if(val) {
          this.applySelectedSort(val, 'avoid_start_date_filter');
        }
      },
      selectedToDateSort(val) {
        if(val) {
          this.applySelectedSort(val, 'avoid_end_date_filter');
        }
      },
      selectedDateAddedSort(val) {
        if(val) {
          this.applySelectedSort(val, 'avoid_date_added_filter');
        }
      }
    }
  };
  </script>
  
  <style scoped lang="scss">
  .btn-claim {
    width: 489px;
    height: 48px;
    min-height: 48px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 6px;
    animation: anim-glow 1s ease infinite;
  }
  .product-image {
    min-width: 40px;
    width: 40px;
    height: 40px;
    object-fit: contain;
    padding: 2px;
  }
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
  
  .badge-cancelled {
    span {
      background: #FEE2E2;
      color: #B91C1C !important;
      &::before {
        background: #F87171;
      }
    }
  }
  .badge-active {
    span {
      background: #D1FAE5;
      color: #047857 !important;
      &::before {
        background: #34D399;
      }
    }
  }
  .badge-finished {
    span {
      background: #F8FAFC;
      color: #334155 !important;
      &::before {
        background: #64748B;
      }
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

  .separator {
    background: #F7F7F7;
    height: 30px;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
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
    padding-right: 3px !important;
  }

  .mobile-bottom-row {
    margin-left: 1px !important;
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
      td:nth-child(4) {
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
  .ft-17{
    font-size: 17px;
  }
  .c-label{
    font-size: 14px;
    font-weight: bold;
  }
  .executions-table {
    max-height: 350px;
    overflow-y: scroll;
  }
  </style>
  
  