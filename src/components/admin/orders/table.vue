<template>
  <div>
    <div v-if="!hideHeader" class="d-flex flex-sm-row justify-content-between align-items-sm-center mt-3 mb-2" :style="isMobileWidth ? 'padding-right: 3px;' : ''">
      <div class="d-flex align-items-center justify-content-md-start">
        <h5 class="my-3 mr-3" :style="pageWidth < 322 ? 'max-width: 120px;' : ''">{{ title }}</h5>
        <a href="#" @click.prevent="$refs.tutorialModal.show()" class="btn btn-tutorial btn-sm text-medium bg-white btn-action">
          <svg :class="isMobileWidth ? '' : 'mr-2'" width="20" height="20" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9.63 7.53l2.663 1.777a.836.836 0 010 1.387L9.63 12.471a.833.833 0 01-1.296-.694V8.226A.833.833 0 019.63 7.53z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.93 12.87A7.5 7.5 0 103.07 7.13a7.5 7.5 0 0013.858 5.74z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{isMobileWidth ? '' : 'Watch Tutorials'}}
        </a>
        <b-modal size="lg" ref="tutorialModal">
          <div slot="modal-header">
            <h5>Basics of Ordering</h5>
          </div>
          <div>
            <video class="w-100" poster="/images/cover-basics-of-ordering.jpg" controls>
              <source src="https://storage.googleapis.com/content.ezadtv.com/2024/01/23/65afe5ff6f5d0_Basics_of_Ordering.mp4" type="video/mp4">
            </video>
          </div>
          <div slot="modal-footer">
            <button type="button" class="btn btn-primary" @click="$refs.tutorialModal.hide()">Done</button>
          </div>
        </b-modal>
      </div>
      <div>
        <button v-if="enableNewOrderNotification" class="btn-sm d-inline btn text-medium bg-light mr-2"  :class="notifyforOrders ? 'btn-primary' : 'btn-outline-primary'" @click="notifyforOrders=true" style="height:34px !important;" :style="pageWidth > 322 && pageWidth < 576 ? { 'margin-top': '10px !important' } : pageWidth < 322 ? 'margin-top: 23px !important; margin-left: 20px !important;' : ''">
          {{isMobileWidth ? '' : 'Notify of New Orders'}}
        </button>
        <button class="btn-sm d-inline btn btn-outline-primary text-medium bg-light" style="height:34px !important;" :style="pageWidth > 322 && pageWidth < 576 ? { 'margin-top': '10px !important' } : pageWidth < 322 ? 'margin-top: 23px !important; margin-left: 20px !important;' : ''" @click="$refs.downloadCSVModal.show()">
          <svg :class="isMobileWidth ? '' : 'mr-2'" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13.333v-10 10z" fill="currentColor"/><path d="M3.333 13.333v.834a2.5 2.5 0 002.5 2.5h8.334a2.5 2.5 0 002.5-2.5v-.834M13.333 10L10 13.333m0 0L6.667 10M10 13.333v-10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{isMobileWidth ? '' : 'Export Orders'}}
        </button>
      </div>
      <b-modal size="lg" ref="downloadCSVModal">
        <div slot="modal-header">
          <h5>Export Orders CSV File</h5>
        </div>
        <div class="row container">
          <div class="col-md-6">
            <b-form-group style="margin-bottom: 0px;">
              <template #label>
                <b>Select Order Types</b><br>
                <hr class="mt-2">
                <b-form-checkbox
                  v-model="orderFiltersForCSVAllSelected"
                  :indeterminate="orderFiltersIndeterminate"
                  aria-describedby="orderFiltersValues"
                  aria-controls="orderFiltersValues"
                  @change="toggleAllOrderFiltersForCsv"
                  class="mt-3"
                >
                  {{ orderFiltersForCSVAllSelected ? 'Un-select All' : 'Select All' }}
                </b-form-checkbox>
              </template>
              <template v-slot="{ ariaDescribedby }">
                <b-form-checkbox-group
                  id="orderFiltersValues"
                  v-model="orderFiltersForCSV"
                  :options="orderFiltersValues"
                  :aria-describedby="ariaDescribedby"
                  name="orderFiltersValues"
                  aria-label="Order filters"
                  stacked
                ></b-form-checkbox-group>
              </template>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b style="font-size: 16px; color: #444;">Select Date Range</b><br>
            <hr class="mt-2">
            <div class="d-flex justify-space-around" id="stats-date-range-container">
              <div class="mt-3" style="width: 100%;">
                <VueCtkDateTimePicker
                  @input="() => {}"
                  id="stats-date-range"
                  label="Click here to select a date range..."
                  v-model="selectedDateRange"
                  :range="true"
                  :min-date="minDateRange"
                  :max-date="maxDateRange"
                  :color="$store.state.settings.colors.primary"
                  :button-color="$store.state.settings.colors.primary"
                  :only-date="true"
                  :format="'YYYY-MM-DD hh:mm:ss'"
                  :formatted="'MM/DD/YYYY'"
                  input-size="md"
                  no-button-now
                  :right="true"
                />
              </div>
            </div>
          </div>
        </div>
        <div slot="modal-footer">
          <button type="button" class="btn btn-secondary mr-3" @click="$refs.downloadCSVModal.hide()">Close</button>
          <button type="button" class="btn btn-primary" @click="downloadOrderCSVFile" :disabled="isDownloading">
            <span v-if="isDownloading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
            <span v-if="!isDownloading">Download</span>
            <span v-else>Downloading...</span>
          </button>
        </div>
      </b-modal>
    </div>
    <div :class="!isMobileWidth ? 'card' : ''" v-if="orders && orders.data">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center" :class="!isMobileWidth ? 'p-3' : ''">
        <input type="text" v-model="orders.filter" class="form-control search-input" :style="isMobileWidth ? { 'max-width': mobileRowWidth + '!important' } : { 'max-width': '385px !important' }" @keyup="ordersSearch" placeholder="Search Orders By ID/Client Name" />
        <div class="filters mt-3 mt-md-0 d-flex flex-wrap" v-if="allFilters && allFilters.length && !isMobileWidth">
          <a class="clear-all text-decoration-none text-nowrap" href="#" @click.prevent="removeFilter">Clear All</a>
          <template v-for="filter in allFilters">
            <a v-if="filter" href="#" class="filter text-capitalize text-decoration-none mb-2 mb-md-0" :class="filter.name" :key="filter.name" @click.prevent="removeFilter(filter.type, filter.id)">
              {{ filter.name }}
              <svg class="ml-2" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 1L1 7M1 1L7 7L1 1Z" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </template>
        </div>
      </div>
      <div class="table-wrapper" :class="{'loading' : orders.loading}">
        <div class="spinner-wrapper">
          <div class="spinner-border" role="status"></div>
        </div>
        <div v-if="isMobileWidth" class="row mt-3 d-flex justify-content-between align-items-center">
          <div class="mb-md-0" style="margin-left: 20px;" v-html="resultsText(orders)" />
          <div class="d-flex justify-content-end">
            <div v-if="allFilters.length" class="ml-1 mr-1 row d-flex justify-content-end">
              <a @click.prevent="removeFilter" class="hover-link mr-2" style="margin-top: 6px !important;">Clear All Filters</a>
            </div>
            <div class="svg-container">
              <svg class="svg-under cursor-pointer" @click="openMobileFiltersPanel" xmlns="http://www.w3.org/2000/svg" width="36" height="32" fill="none"><g filter="url(#a)"><rect width="32" height="28" x="2" y="1" fill="#fff" rx="4"/><path fill="#334155" fill-rule="evenodd" d="M12.4 9.4a.8.8 0 0 1 .8-.8h9.6a.8.8 0 0 1 .8.8v2.4a.8.8 0 0 1-.234.566L19.6 16.13V19a.8.8 0 0 1-.234.566l-1.6 1.6A.8.8 0 0 1 16.4 20.6v-4.469l-3.766-3.765a.8.8 0 0 1-.234-.566V9.4Z" clip-rule="evenodd"/><rect width="31" height="27" x="2.5" y="1.5" stroke="#CBD5E1" rx="3.5"/></g><defs><filter id="a" width="36" height="32" x="0" y="0" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="1"/><feGaussianBlur stdDeviation="1"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_971_131786"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_971_131786" result="shape"/></filter></defs></svg>
              <svg v-if="allFilters.length" class="svg-overlap" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
                <circle cx="8" cy="8" r="8" fill="#334155" />
                <text x="50%" y="75%" text-anchor="middle" fill="white" style="font-size: 12px; font-weight: bold;">{{ allFilters.length }}</text>
              </svg>
            </div>
          </div>
        </div>
        <div v-if="isMobileWidth" class="panel-container" :class="{ 'panel-open': isMobileFiltersPanelOpened }" @click.self="closeMobileFiltersPanel">
          <div class="panel-content">
            <div class="panel-header">
              <h6 class="panel-heading">Filters ({{allFilters.length}})</h6>
              <button class="close-button" @click="closeMobileFiltersPanel">X</button>
            </div>
            <div v-if="allFilters.length" class="mb-2 ml-1 mr-1 row d-flex justify-content-end border-top" style="padding-top: 6px;">
              <a @click.prevent="removeFilter" class="hover-link mr-2">Clear All Filters</a>
            </div>
            <div class="spinner-wrapper">
              <div class="spinner-border" role="status"></div>
            </div>
            <div>
              <div v-if="$route.params.type == 'outstanding'" class="filter-section">
                <h6 class="filter-heading">Date</h6>
                <div class="container ">
                  <div class="row mb-3 ml-1" v-for="dp in datePurchasedFilters" :key="dp.id">
                    <input
                      class="styled-radio"
                      :id="`dp-${dp.id}`"
                      :value="dp.value"
                      type="radio"
                      v-model="selectedDatePurchasedFilter"
                    />
                    <label class="ml-2 mb-0" :for="`dp-${dp.id}`">{{ dp.label }}</label>
                  </div>
                </div>
              </div>
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
                <h6 class="filter-heading">Client Name</h6>
                <div class="container ">
                  <div class="row mb-3 ml-1" v-for="cn in clientNameFilters" :key="cn.id">
                    <input
                      class="styled-radio"
                      :id="`cn-${cn.id}`"
                      :value="cn.value"
                      type="radio"
                      v-model="selectedClientNameFilter"
                    />
                    <label class="ml-2 mb-0" :for="`cn-${cn.id}`">{{ cn.label }}</label>
                  </div>
                </div>
              </div>
              <div class="filter-section">
                <h6 class="filter-heading">Business</h6>
                <div v-if="locations.length > 1" class="container">
                  <div v-for="l in locations" :key="`olocation-${l.business_id}`" class="row mb-3 ml-1">
                    <input
                      :class="`styled-checkbox`"
                      :id="`${l.business_id}-olocation`"
                      :value="l.business_id"
                      type="checkbox"
                      v-model="orders.locations"
                    />
                    <label :for="`${l.business_id}-olocation`">{{ l.name }}</label>
                  </div>
                </div>
              </div>
              <!-- Customer Type section -->
              <div class="filter-section">
                <h6 class="filter-heading">Customer Type</h6>
                <div class="container">
                  <div class="row mb-3 ml-1" v-for="ct in customerTypeFilters" :key="ct.id">
                    <input
                      class="styled-checkbox"
                      :id="`ct-${ct.id}`"
                      :value="ct.value"
                      type="checkbox"
                      v-model="orders.customerType"
                    />
                    <label :for="`ct-${ct.id}`">{{ ct.label }}</label>
                  </div>
                </div>
              </div>
              <!-- Claimer section -->
              <div class="filter-section">
                <h6 class="filter-heading">Claimer</h6>
                <div class="container ">
                  <div class="row mb-3 ml-1" v-for="c in claimerFilters" :key="c.id">
                    <input
                      class="styled-radio"
                      :id="`c-${c.id}`"
                      :value="c.value"
                      type="radio"
                      v-model="selectedClaimerFilter"
                    />
                    <label class="ml-2 mb-0" :for="`c-${c.id}`">{{ c.label }}</label>
                  </div>
                </div>
              </div>
              <!-- Payment Type section -->
              <div class="filter-section">
                <h6 class="filter-heading">Payment Type</h6>
                <div class="container">
                  <div class="row mb-3 ml-1" v-for="pt in paymentTypeFilters" :key="pt.id">
                    <input
                      class="styled-checkbox"
                      :id="`pt-${pt.id}`"
                      :value="pt.value"
                      type="checkbox"
                      v-model="orders.paymentType"
                    />
                    <label :for="`pt-${pt.id}`">{{ pt.label }}</label>
                  </div>
                </div>
              </div>
              <!-- Items section -->
              <div class="filter-section">
                <h6 class="filter-heading">Items</h6>
                <div class="container ">
                  <div class="row mb-3 ml-1" v-for="ic in itemCountFilters" :key="ic.id">
                    <input
                      class="styled-radio"
                      :id="`ic-${ic.id}`"
                      :value="ic.value"
                      type="radio"
                      v-model="selectedItemCountFilter"
                    />
                    <label class="ml-2 mb-0" :for="`ic-${ic.id}`">{{ ic.label }}</label>
                  </div>
                </div>
              </div>
              <!-- Type section -->
              <div class="filter-section">
                <h6 class="filter-heading">Order Type</h6>
                <div class="container">
                  <div class="row mb-3 ml-1" v-for="ot in orderTypeFilters" :key="ot.id">
                    <input
                      class="styled-checkbox"
                      :id="`ot-${ot.id}`"
                      :value="ot.value"
                      type="checkbox"
                      v-model="orders.filters"
                    />
                    <label :for="`ot-${ot.id}`">{{ ot.label }}</label>
                  </div>
                </div>
              </div>
              <!-- Total section -->
              <div class="filter-section">
                <h6 class="filter-heading">Total</h6>
                <div class="container">
                  <div class="row mb-3 ml-1" v-for="t in totalFilters" :key="t.id">
                    <input
                      class="styled-radio"
                      :id="`t-${t.id}`"
                      :value="t.value"
                      type="radio"
                      v-model="selectedTotalFilter"
                    />
                    <label class="ml-2 mb-0" :for="`t-${t.id}`">{{ t.label }}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <vue-good-table :row-style-class="rowStyleClassFn" @on-sort-change="onSortChange" styleClass="table" :columns="ordersColumns" :rows="orders.data.orders">
          <slot name="column" slot="table-column" slot-scope="props" :props="props" />
          <slot name="row" slot="table-row" slot-scope="props" :props="props" />
          <slot name="empty" slot="table-empty" />
        </vue-good-table>
        <div class="p-md-2 pl-md-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center" :class="!isMobileWidth ? 'p-3 border-top border-gray' : ''">
          <div v-if="!isMobileWidth" class="mb-2 mb-md-0" v-html="resultsText(orders)" />
          <VuePagination v-if="orders.pageCount && orders.pageCount > 1" v-model="orders.currentPage" :pages="orders.pageCount" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table';
import AdminService from '@/api-services/admin.service';
import debounce from 'debounce';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import { formatDate } from '@/plugins/dateFormat';

export default {
  name: 'ordersTable',
  props: {
    title: {
      default: ''
    },
    sortOptions: {
      default: () => {return{ enabled: false };}
    },
    ordersColumns: {
      default: []
    },
    orders: {
      default: []
    },
    hideHeader: {
      default: false
    },
    id: {
      default: null
    },
    enableNewOrderNotification: {
      default: false
    },
  },
  components: {
    VueGoodTable,
    VueCtkDateTimePicker
  },
  data() {
    return {
      isDownloading: false,
      bootstrapPaginationClasses: {
        ul: 'pagination justify-content-center',
        li: 'page-item',
        liActive: 'active',
        liDisable: 'disabled',
        button: 'page-link',
      },
      checkBoxes: ['pickup', 'delivery', 'shipping', 'special'],
      tabIndex: 0,
      sortParams: {},
      minDateRange: this.$store.state.businessDetails.created_at,
      maxDateRange: new Date().toString(),
      selectedDateRange: {},
      orderFiltersValues: ['Outstanding', 'Ready', 'Completed', 'Cancelled'],
      orderFiltersForCSV: [],
      orderFiltersForCSVAllSelected: false,
      orderFiltersIndeterminate: false,
      pageWidth: 0,
      // filters for mobile view
      isMobileFiltersPanelOpened: false,
      selectedDatePurchasedFilter: null,
      selectedOrderIdFilter: null,
      selectedClientNameFilter: null,
      selectedClaimerFilter: null,
      selectedItemCountFilter: null,
      selectedTotalFilter: null,
      notifyforOrders: false,
      datePurchasedFilters: [
        { id: 1, value: { field: 'date_purchased', type: 'desc' }, label: 'Newest to Oldest' },
        { id: 2, value: { field: 'date_purchased', type: 'asc' }, label: 'Oldest to Newest' }
      ],
      orderIdFilters: [
        { id: 1, value: { field: 'id', type: 'desc' }, label: 'Highest to Lowest' },
        { id: 2, value: { field: 'id', type: 'asc' }, label: 'Lowest to Highest' }
      ],
      clientNameFilters: [
        { id: 1, value: { field: 'customer_name', type: 'desc' }, label: 'Highest to Lowest' },
        { id: 2, value: { field: 'customer_name', type: 'asc' }, label: 'Lowest to Highest' }
      ],
      customerTypeFilters: [
        { id: 1, value: 'regular' , label: 'Regular' },
        { id: 2, value: 'contractor' , label: 'Contractor' }
      ],
      claimerFilters: [
        { id: 1, value: { field: 'claimer', type: 'desc' }, label: 'Newest to Oldest' },
        { id: 2, value: { field: 'claimer', type: 'asc' }, label: 'Oldest to Newest' }
      ],
      paymentTypeFilters: [
        { id: 1, value: 'authonly', label: 'Credit card (Pre-auth)' },
        { id: 2, value: 'creditcard', label: 'Credit card (Charged)' },
        { id: 3, value: 'instore', label: 'Pay in Store/Person' },
        { id: 4, value: 'receivables', label: 'Account Receivables (Contractors)' }
      ],
      itemCountFilters: [
        { id: 1, value: { field: 'item_count', type: 'desc' }, label: 'Highest to Lowest' },
        { id: 2, value: { field: 'item_count', type: 'asc' }, label: 'Lowest to Highest' }
      ],
      orderTypeFilters: [
        { id: 1, value: 'pickup', label: 'Pickup' },
        { id: 2, value: 'delivery', label: 'Delivery' },
        { id: 3, value: 'shipping', label: 'Shipping' },
        { id: 4, value: 'special', label: 'Special' }
      ],
      totalFilters: [
        { id: 1, value: { field: 'total', type: 'desc' }, label: 'Highest to Lowest' },
        { id: 2, value: { field: 'total', type: 'asc' }, label: 'Lowest to Highest' }
      ],
    };
  },
  computed: {
    locations() {
      if(this.$store.state.businessDetails && this.$store.state.businessDetails.about_us)
        return this.$store.state.businessDetails.about_us.locations || [];
      return [];
    },
    allFilters() {
      return [
          ...this.orders.customerType.map(e => { return {type:'cust', name: e, id: e};}),
          ...this.orders.paymentType.map(e => { return {type:'pay', name: e, id: e};}),
          ...this.orders.filters.map(e => { return {type:'type', name: e, id: e};}),
          ...this.orders.locations.map(e => {
            if(this.locations.length) {
              return {type:'locations', id: e, name: this.locations.find(i => i.id == e).name || ''};
            }
          })];
    },
    company() {
      return this.$store.state.businessDetails.company;
    },
    oneMonthAgoInYYYYMMDD() {
      let currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() - 1);
      return currentDate.toISOString().slice(0, 10).toString();
    },
    nowInYYYYMMDD() {
      return new Date().toISOString().slice(0, 10).toString();
    },
    isMobileWidth() {
      return this.pageWidth < 769;
    },
    mobileRowWidth() {
      if (this.pageWidth < 576) {
        return `${this.pageWidth - 32}px`;
      } else {
        return `${this.pageWidth - 62}px`;
      }
    }
  },
  created() {
    if(this.$route.query.sort)
      this.orders.sort = this.$route.query.sort;
    if(this.$route.query.query)
      this.orders.query = this.$route.query.query;
    if(this.$route.query.dir)
      this.orders.dir = this.$route.query.dir;
    if(this.$route.query.locations)
      this.orders.locations = this.$route.query.locations.split(',');
    if(this.$route.query.status)
      this.orders.filters = this.$route.query.status.split(',');
    if(this.$route.query.customerType)
      this.orders.customerType = this.$route.query.customerType.split(',');
    if(this.$route.query.paymentType)
      this.orders.paymentType = this.$route.query.paymentType.split(',');
  },
  mounted() {
    this.clearAllSortingFilters();
    this.getOrders();
    this.selectedDateRange.start = this.oneMonthAgoInYYYYMMDD;
    this.selectedDateRange.end = this.nowInYYYYMMDD;
    this.pageWidth = window.innerWidth;
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    rowStyleClassFn(row) {
      return (row.parcel_types && row.parcel_types.includes('special')) ? 'special' : '';
    },
    onSortChange(params) {
      this.$router.push({ query: Object.assign({}, this.$route.query, { dir: params['0'].type }) }).catch(() => {});
      this.$router.push({ query: Object.assign({}, this.$route.query, { sort: params['0'].field }) }).catch(() => {});
      this.$emit(`sorting-function-${this.$route.params.type}`, params['0'].type, params['0'].field);
    },
    removeFilter(type, name) {
      this.$emit('removeFilter', type, name);
    },
    resultsText(p) {
      let d = p.data.orders;
      let from = ((((Number(this.$route.query.page) - 1) * p.perPage) - p.perPage) + d.length + 1);
      let to = this.$route.query.page == undefined ? ((p.currentPage * p.perPage) - p.perPage) + d.length : ((Number(this.$route.query.page) * p.perPage) - p.perPage) + d.length;
      return p.data.count ? `Showing  ${p.loading ? '...' : `<b>${from > 0 ? from : 1}</b> to <b>${to}</b> of <b>${p.data.count}</b> results`}` : '';
    },
    getOrders(data = {}) {
      data.page = this.$route.query.page || 1;
      data.sort = this.orders.sort;
      data.dir = this.orders.dir;
      data.perPage = this.orders.perPage;
      data.types = this.orders.filters ? this.orders.filters.join(',') : '';
      data.customerType = this.orders.customerType ? this.orders.customerType.join(',') : '';
      data.paymentType = this.orders.paymentType ? this.orders.paymentType.join(',') : '';
      data.locations = this.orders.locations ? this.orders.locations.join(',') : '';
      data.filter = this.orders.filter;
      this.$emit(`ordersFunction`, data, this.orders);
    },
    ordersSearch: debounce(function(val) {
      if(/[a-zA-Z0-9\b\0 ]/.test(String.fromCharCode(val.keyCode)) || val.keyCode == 91) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { filter: this.orders.filter || undefined }) }).catch(() => {});
        this.getOrders();
      }
    }, 500),
    downloadOrderCSVFile() {
      if(!this.orderFiltersForCSV.length) {
        this.$swal({
          title: 'Please select at least one order type',
          type: 'warning',
        });
        return;
      }
      if(!this.selectedDateRange) {
        this.$swal({
          title: 'Please select a date range',
          type: 'warning',
        });
        return;
      }
      if (this.selectedDateRange.start.length === 10) {
        this.selectedDateRange.start = this.selectedDateRange.start + ' 00:00:00';
      }
      if (this.selectedDateRange.end.length === 10) {
        this.selectedDateRange.end = this.selectedDateRange.end + ' 11:59:59';
      }

      this.isDownloading = true;
      AdminService.getOrderHistoryCSV(this.orderFiltersForCSV, this.selectedDateRange).then(res => {
        const blob = res.data;

        const pom = document.createElement('a');
        pom.href = URL.createObjectURL(blob);
        pom.setAttribute('download', 'orders_' + formatDate(new Date()) + '.csv');
        pom.click();

        this.isDownloading = false;
        this.$refs.downloadCSVModal.hide();
      });
    },
    toggleAllOrderFiltersForCsv(checked) {
      this.orderFiltersForCSV = checked ? this.orderFiltersValues.slice() : [];
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
      if(avoidClear != 'avoid_date_filter') {
        this.selectedDatePurchasedFilter = null;
      }
      if(avoidClear != 'avoid_order_filter') {
        this.selectedOrderIdFilter = null;
      }
      if(avoidClear != 'avoid_client_name_filter') {
        this.selectedClientNameFilter = null;
      }
      if(avoidClear != 'avoid_claimer_filter') {
        this.selectedClaimerFilter = null;
      }
      if(avoidClear != 'avoid_item_count_filter') {
        this.selectedItemCountFilter = null;
      }
      if(avoidClear != 'avoid_total_filter') {
        this.selectedTotalFilter = null;
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
  watch: {
    '$route.query.page'() {
      this.getOrders();
    },
    'orders.locations'(val) {
      if(val) {
        val = val.length ? val.join(',') : undefined;
        this.$router.push({ query: Object.assign({}, this.$route.query, { locations: val }) }).catch(() => {});
        this.getOrders();
      } 
    },
    'orders.filters'(val) {
      if(val) {
        val = val.length ? val.join(',') : undefined;
        this.$router.push({ query: Object.assign({}, this.$route.query, { status: val }) }).catch(() => {});
        this.getOrders();
      }
    },
    'orders.customerType'(val) {
      if(val) {
        val = val.length ? val.join(',') : undefined;
        this.$router.push({ query: Object.assign({}, this.$route.query, { customerType: val }) }).catch(() => {});
        this.getOrders();
      }
    },
    'orders.paymentType'(val) {
      if(val) {
        val = val.length ? val.join(',') : undefined;
        this.$router.push({ query: Object.assign({}, this.$route.query, { paymentType: val }) }).catch(() => {});
        this.getOrders();
      }
    },
    '$route.params.type'(val) {
      this.orders.filters = this.orders.customerType = this.orders.paymentType = this.orders.locations = [];
      if(val == this.id)
        this.getOrders();
    },
    selectedDatePurchasedFilter(val) {
      if(val) {
        this.applySelectedSort(val, 'avoid_date_filter');
      }
    },
    selectedOrderIdFilter(val) {
      if(val) {
        this.applySelectedSort(val, 'avoid_order_filter');
      }
    },
    selectedClientNameFilter(val) {
      if(val) {
        this.applySelectedSort(val, 'avoid_client_name_filter');
      }
    },
    selectedClaimerFilter(val) {
      if(val) {
        this.applySelectedSort(val, 'avoid_claimer_filter');
      }
    },
    selectedItemCountFilter(val) {
      if(val) {
        this.applySelectedSort(val, 'avoid_item_count_filter');
      }
    },
    selectedTotalFilter(val) {
      if(val) {
        this.applySelectedSort(val, 'avoid_total_filter');
      }
    },
    orderFiltersForCSV(newValue) {
      if (newValue.length === 0) {
        this.orderFiltersIndeterminate = false;
        this.orderFiltersForCSVAllSelected = false;
      } else if (newValue.length === this.orderFiltersValues.length) {
        this.orderFiltersIndeterminate = false;
        this.orderFiltersForCSVAllSelected = true;
      } else {
        this.orderFiltersIndeterminate = true;
        this.orderFiltersForCSVAllSelected = false;
      }
    }
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
        &.special {
          td:first-child {
            .badge {
              margin-left: -14px;
              padding: 4px 5px 4px 20px;
              box-shadow: 2px 2px 4px rgba(0,0,0,.1);
            }
          }
        }
        /*&.special {
          td:first-child {
            position: relative;
            padding-left: 20px;
          }
          td:last-child {
            position: relative;
          }
          td:first-child::before,
          td:last-child::after {
            content: '';
            width: 20px;
            height: 20px;
            background: var(--danger);
            top: 50%;
            margin-top: -10px;
            border-radius: 20px;
            position: absolute;
          }
          td:first-child::before {
            left: -10px;
          }
          td:last-child::after {
            right: -10px;
          }
        }*/
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
      :deep(.table)  {
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
    background: url('/icons/search.svg') 12px center no-repeat;
    padding-left: 40px !important;
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

  #stats-date-range {
    width: 315px;
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

  .hover-link {
    margin-top: 10px !important;
    color: #3B82F6; 
    font-size: 13px; 
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
  }

  .hover-link:hover {
    text-decoration: underline;
  }

  :deep(.left-modal) :deep(.modal-dialog) {
    margin-right: auto;
    margin-left: 0;
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  :deep(.custom-modal) :deep(.modal-dialog) {
    left: 0;
    transform: translateX(-100%);
    animation: slideInRight 0.3s forwards;
  }

  :deep(.custom-modal) :deep(.modal-content) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
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

.svg-container {
  position: relative;
  width: 16px;
  height: 16px;
  margin-right: 35px;
  margin-bottom: 15px;
}

.svg-overlap {
  position: absolute;
  top: -5px;
  left: 25px;
  z-index: 2;
}

  @media (max-width: 768px) {
    .table-wrapper {
      :deep(.vgt-responsive) {
        overflow-x: clip;
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
