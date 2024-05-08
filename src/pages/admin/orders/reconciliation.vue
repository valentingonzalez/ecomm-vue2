<template>
  <div v-if="$ezHasNoPermission('manage_orders')" class="container d-flex align-items-center justify-content-center">
    <NoPermission />
  </div>
  <div v-else>
    <div class="pt-4">
      <div class="container">
        <h4 class="m-0 mb-3">Reconciliation</h4>
        <div class="mt-md-n5">
          <div class="d-flex justify-content-md-end mb-3" style="min-height: 40px;">
            <div v-if="selectedPayout">
              <b-input-group :prepend="`Deposit${selectedPayout.deposited ? 'ed' : 'ing'}`" class="dropdown-group">
                <b-dropdown v-if="payouts" :text="`${selectedPayout.arrival} (***${selectedPayout.accountLast4})`">
                  <b-dropdown-item-button v-for="payout in payouts" :key="`payout-${payout.id}`" @click="selectPayout(payout)">
                    <span>Deposit{{ payout.deposited ? 'ed' : 'ing' }}</span> on 
                    <span class="font-weight-bold">{{ payout.arrival }}</span>
                    <span>(***{{ payout.accountLast4 }})</span>
                  </b-dropdown-item-button>
                </b-dropdown>
              </b-input-group>
            </div>
          </div>
          <div class="table-wrapper" :class="{'loading' : orders.loading}">
            <div class="spinner-wrapper">
              <div class="spinner-border" role="status"></div>
            </div>
            <ordersTable v-if="orders" ref="ordersTable" :hideHeader="true" :ordersColumns="ordersColumns" :orders="orders" @ordersFunction="getOrders" :sortOptions="sortOptions">
              <template slot="column" slot-scope="props" :props="props">
                <div v-if="props.props.column.label == 'Business'">
                  <b-dropdown v-if="locations.length > 1" text="Business" class="m-md-2">               
                    <li v-for="l in locations" :key="`relocation-${l.business_id}`" class="mr-sm-4 w-33 w-sm-auto small pl-2">
                      <input :class="`styled-checkbox`" :id="`${l.business_id}-relocation`" :value="l.business_id" type="checkbox" v-model="orders.location" />
                      <label class="small font-weight-bold text-uppercase" :for="`${l.business_id}-relocation`">{{l.name}}</label>
                    </li>
                  </b-dropdown>
                  <template v-else>{{props.props.column.label}}</template>
                </div>
                <div v-else-if="props.props.column.label == 'CUST_TYPE'">
                  <b-dropdown text="CUST_TYPE" class="m-md-2">
                    <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                      <input class="styled-checkbox" id="regular-recust" value="regular" type="checkbox" v-model="orders.customerType" />
                      <label class="small font-weight-bold text-uppercase" for="regular-recust">Regular</label>
                    </li>
                    <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                      <input class="styled-checkbox" id="contractor-recust" value="contractor" type="checkbox" v-model="orders.customerType" />
                      <label class="small font-weight-bold text-uppercase" for="contractor-recust">Contractor</label>
                    </li>
                  </b-dropdown>
                </div>
                <div v-else-if="props.props.column.label == 'PAY_TYPE'">
                  <b-dropdown text="PAY_TYPE" class="m-md-2">
                    <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                      <input class="styled-checkbox" id="authonly-repay" value="authonly" type="checkbox" v-model="orders.paymentType" />
                      <label class="small font-weight-bold text-uppercase" for="authonly-repay">Credit card (Pre-auth)</label>
                    </li>
                    <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                      <input class="styled-checkbox" id="creditcard-repay" value="creditcard" type="checkbox" v-model="orders.paymentType" />
                      <label class="small font-weight-bold text-uppercase" for="creditcard-repay">Credit card (Charged)</label>
                    </li>
                    <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                      <input class="styled-checkbox" id="instore-repay" value="instore" type="checkbox" v-model="orders.paymentType" />
                      <label class="small font-weight-bold text-uppercase" for="instore-repay">Pay in Store/Person</label>
                    </li>
                    <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                      <input class="styled-checkbox" id="receivables-repay" value="receivables" type="checkbox" v-model="orders.paymentType" />
                      <label class="small font-weight-bold text-uppercase" for="receivables-repay">Account Recievables (Contractors)</label>
                    </li>
                  </b-dropdown>
                </div>
                <div v-else-if="props.props.column.label == 'Type'">
                  <b-dropdown text="Type" class="m-md-2">               
                    <li v-for="check in checkBoxes" :key="`retype-${check}`" class="mr-sm-4 w-33 w-sm-auto small pl-2">
                      <input :class="`styled-checkbox ${check}`" :id="`${check}-retype`" :value="check" type="checkbox" v-model="orders.filters" />
                      <label class="small font-weight-bold text-uppercase" :for="`${check}-retype`">{{check}}</label>
                    </li>
                  </b-dropdown>
                </div>
                <div v-else>{{props.props.column.label}}</div>
              </template>
              <template slot="row" slot-scope="props">
                <div :style="{ width: mobileRowWidth, maxWidth: mobileFirstRowWidth, paddingRight: '8px' }" v-if="props.props.column.field == 'id' && isMobileWidth">
                  <div class="row mb-2 pt-2 d-flex justify-content-between" style="padding-left: 13px;" :style="{ width: mobileRowWidth, maxWidth: mobileRowWidth }">
                    <div class="col-6 d-flex justify-content-start"><b>Order <router-link style="text-decoration: underline;" :to="`/admin/order-details/${props.props.row.id}`">#{{props.props.row.id}}</router-link></b></div>
                    <!--<div class="col-6 d-flex justify-content-end align-items-center">
                      <svg style="margin-right: 5px;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"><path stroke="#64748B" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 3v4h3m3 0A6 6 0 1 1 .999 7 6 6 0 0 1 13 7Z"/></svg>
                      <div v-html="props.row.created_at"></div>
                    </div> -->
                  </div>
                </div>
                <div class="row pl-2 d-flex justify-content-between" style="margin-left: 1px;" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'customer_name' && isMobileWidth">
                  <div v-html="props.props.row.customer_name_mobile"></div>
                </div>
                <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'business' && isMobileWidth">
                  <div class="col-6 mobile-column-field">Business</div>
                  <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.business_name}}</div>
                </div>
                <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'customer_type' && isMobileWidth">
                  <div class="col-6 mobile-column-field">Customer Type</div>
                  <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.customer_type}}</div>
                </div>
                <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'store_number' && isMobileWidth">
                  <div class="col-6 mobile-column-field">Store</div>
                  <div class="col-6 mobile-row-field d-flex justify-content-end" v-html="props.props.row.store_number"></div>
                </div>
                <div class="row d-flex justify-content-between mobile-bottom-row" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'claimer' && isMobileWidth">
                  <div class="col-6 mobile-column-field">Claimer</div>
                  <div class="col-6 mobile-row-field d-flex justify-content-end" v-html="props.props.row.claimer_mobile"></div>
                </div>
                <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'payment_type' && isMobileWidth">
                  <div class="col-6 mobile-column-field">Payment Type</div>
                  <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.payment_type}}</div>
                </div>
                <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'order_type' && isMobileWidth">
                  <div class="col-6 mobile-column-field">Order Type</div>
                  <div class="col-6 mobile-row-field d-flex justify-content-end" v-html="props.props.row.order_type_mobile"></div>
                </div>
                <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'total' && isMobileWidth">
                  <div class="col-6 mobile-column-field">Total</div>
                  <div class="col-6 mobile-row-field d-flex justify-content-end">${{props.props.row.total}}</div>
                </div>
                <span v-else-if="!isMobileWidth" v-html="props.props.formattedRow[props.props.column.field]"></span>
              </template>
            </ordersTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {paginationConfig} from '@/config/modules';
  import AdminService from '@/api-services/admin.service';
  import debounce from 'debounce';
  import NoPermission from '../settings/no-permission';
  import ordersTable from '@/components/admin/orders/table';
  import moment from 'moment';
    
  export default {
    name: 'OrderList',
    components: {
      NoPermission,
      ordersTable
    },
    data() {
      return {
        ...paginationConfig,
        isDownloading: false,
        payouts: null,
        selectedPayout: null,
        orders: {
          data: null,
          pages: null,
          currentPage: 1,
          perPage: 6,
          pageCount: 1,
          filter: '',
          filters: [],
          locations: [],
          loading: false,
          customerType: [],
          paymentType: [],
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
        checkBoxes: ['pickup', 'delivery', 'shipping', 'special'],
        pageWidth: 0
      };
    },
    computed: {
      locations() {
        if(this.$store.state.businessDetails && this.$store.state.businessDetails.about_us)
          return this.$store.state.businessDetails.about_us.locations || [];
        return [];
      },
      ordersColumns() {
        return [
          { field: 'id', tdClass: 'index', thClass: 'index', label: 'Order Id', type: 'number', formatFn: value => `#${value}` },
          { field: 'customer_name', label: 'Customer', html: true },
          { field: 'customer_type', label: 'CUST_TYPE', html: true, sortable: false },
          { field: 'business', label: 'Business', html: true, sortable: false },
          { field: 'store_number', label: 'Store', html: true },
          { field: 'payment_type', label: 'PAY_TYPE', html: true, sortable: false },
          { field: 'order_type', tdClass: row => `badge-${row.order_type}`, label: 'Type', sortable: false },
          { field: 'total', label: 'Total', tdClass: 'font-weight-bold', formatFn: value => `$${value}` },
          { field: 'claimer', label: 'Completed By', html: true, sortable: false },
        ];
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
    },
    mounted() {
      if(this.$ezHasNoPermission('manage_orders')) return;
      this.getPayouts();
      this.pageWidth = window.innerWidth;
      window.addEventListener('resize', this.handleResize);
    },
    methods: {
      handleResize() {
        this.pageWidth = window.innerWidth;
      },
      async getPayouts() {
        let payouts = await AdminService.getOrdersPayouts();
        this.payouts = payouts.data.transfers;
        if(!this.$route.query.id) {
          this.selectPayout(this.payouts[0]);
        } else {
          this.$refs.ordersTable.getOrders();
          this.selectedPayout = this.payouts.find(e => e.id == this.$route.query.id);
        }
      },
      search() {
        this.orders.loading = true;
        this.doSearch();
      },
      doSearch: debounce(function() {
        this.orders.currentPage = 1;
        //this.getOrders({ filter: this.orders.query });
      }, 500),
      selectPayout(payout) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { id: payout.id }) }).catch(err => console.log(err));
        this.selectedPayout = payout;
        this.$refs.ordersTable.getOrders();
      },
      async getOrders(data) {
        this.orders.loading = true;
        AdminService.getReconciliationOrders(this.$route.query.id, data).then(r => {
          r.data.orders.map(o => {
            o.order_type_mobile = `<span class="badge-${o.order_type}">${o.order_type}</span>`;
            o.customer_name_mobile = `<div style="font-weight: bold; font-size: 16px;">${o.first_name} ${o.last_name}</div><a style="text-decoration: underline;" href="mailto:${o.email}">${o.email}</a>`;
            o.date_purchased_mobile = moment.utc(o.date_purchased).local().format('[<b>]MM/DD/YY [<span class="border-left text-muted" style="padding-left: 3px;">]hh:mm A[</span></b>]');
            o.claimer_mobile =
              o.issued_first != null ? `${o.issued_first} ${o.issued_last}<span class="text-muted">${o.issued_at ? '&nbsp;<span class="border-right"></span>&nbsp;' + o.issued_at : ''}</span>` : `<span class="text-warning"> Unclaimed</span>`;
            o.customer_name = `<div>${o.first_name} ${o.last_name}</div><a class="small" href="mailto:${o.email}">${o.email}</a>`;
            o.business = `${o.business_name}<div class="small text-muted">Purchase: <span class="text-uppercase">${moment(String(o.date_purchased)).format('MMM/DD/YY')}</span></div>`;
            o.claimer = o.issued_first != null ? `${o.issued_first} ${o.issued_last}` : `<div class="text-warning">Unclaimed</div>`;
            return o;
          });
          this.orders.data = r.data;
          this.orders.pageCount = Math.ceil(this.orders.data.count / this.orders.perPage);
          this.orders.loading = false;
        });
      },
    },
    filters: {
    },
    watch: {
      'orders.currentPage'() {
        //this.$refs.ordersTable.getOrders();
      },
      '$route.query.sort'(val) {
        this.$refs.ordersTable.orders.sort = val;
        this.$refs.ordersTable.getOrders();
      },
      '$route.query.dir'(val) {
        this.$refs.ordersTable.orders.dir = val;
        this.$refs.ordersTable.getOrders();
      }
    }
  };
</script>

<style scoped lang="scss">

  .container {
    min-height: 600px;
  }

  .dropdown-group {
    .input-group-prepend .input-group-text{
      height: 38px;
      background: #F8FAFC !important;
      color: #64748B;
    }
    :deep(.dropdown-toggle) {
      height: 38px;
      font-size: 14px !important;
      background: #fff !important;
      color: #64748B !important;
      border: 1px solid #CBD5E1;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .input-group-text {
      font-size: 14px;
    }
    :deep(.dropdown-menu) {
      right: 0px !important;
      transform: none !important;
      left: auto !important;
      top: 40px !important;
      font-size: 14px !important;
      max-height: 300px !important;
      overflow-y: auto !important;
    }
  }
  :deep(.date) {
    font-size: 13px;
  }
  .table-wrapper {
    position: relative;
    min-height: 100px;
    .spinner-wrapper {
      position: absolute;
      display: none;
    }
    &.loading {
      .spinner-wrapper {
        display: block;
        left: 50%;
        margin-left: -16px;
        top: 50px;
      }
      :deep(.table) {
        opacity: .5;
      }
    }
  }
  .order-mobile {
    .info-block {
      font-size: 14px;
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

  .payout-card {
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 5px;
    min-width: 180px;
    max-width: 180px;
    display: flex;
    flex-direction: column;
    position: relative;
    &.selected {
      background: var(--primary);
      color: var(--headerLinkColorInv);
      cursor: default;
      &::after {
        left: 100%;
        top: 50%;
        border: solid transparent;
        content: "";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
        border-color: rgba(0, 0, 0, 0);
        border-left-color: var(--primary);
        border-width: 10px;
        margin-top: -10px;
      }
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
