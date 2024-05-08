<template>
    <div v-if="$ezHasNoPermission('manage_promo_codes')">
        <no-permission-truevalue page="Promo Codes"></no-permission-truevalue>
    </div>
    <main v-else>
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="card-title d-flex justify-content-between align-items-center">
                <h5 class="mb-0"><strong>Promo Codes Redemption Details</strong></h5>
                <router-link class="btn btn-outline-primary mr-2" to="/admin/settings/promo-codes">
                    Back to Promo Codes
                </router-link>
            </div>
            <div class="card">
              <div class="card-body pb-0">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex">
                        <input type="text" v-model="customerFilter" class="form-control search-filter" placeholder="Search By Customer">
                        <select v-model="couponFilter" class="form-control ml-2 search-filter">
                            <option value="" disabled>Select Coupon</option>
                            <option v-for="coupon in coupons" :key="coupon.id" :value="coupon.id">{{ coupon.coupon }}</option>
                        </select>                        
                    </div> 
                    
                    <div class="d-flex align-items-center">
                        <div class="d-flex w-auto">
                            <label for="name" class="control-label mb-0 py-2" style="padding-left: 5px;"><i class="fa fa-calendar fa-fw"></i> </label>
                            <VueCtkDateTimePicker
                                @input="() => {}"
                                @validate="submitDateRange"
                                id="stats-date-range"
                                label="Pick Date Range"
                                v-model="selectedDateRange"
                                :range="true"
                                :min-date="minDateRange"
                                :max-date="maxDateRange"
                                :color="$store.state.settings.colors.primary"
                                :button-color="$store.state.settings.colors.primary"
                                :only-date="true"
                                :format="'YYYY-MM-DD hh:mm:ss'"
                                :formatted="'MM/DD/YYYY'"
                                input-size="sm"
                                no-button-now
                                noClearButton
                                :right="true"
                                style="padding-left: 5px;"
                            />
                        </div>
                        <button v-if="couponFilter || customerFilter || selectedDateRange" @click="clearFilters" class="btn btn-secondary btn-xs ml-2">Clear Filters</button>
                    </div>
                </div>                
                <div class="table-scroll row">
                  <table class="table mb-0">
                    <thead>
                        <tr>
                            <th role="columnheader" @click="sortData('id')" scope="col" aria-colindex="1" :aria-sort="sort == 'id' ? dir : 'none'" class="position-relative">
                                <div>Id</div>                                
                            </th>
                            <th role="columnheader" @click="sortData('coupon')" scope="col" aria-colindex="2" :aria-sort="sort == 'coupon' ? dir : 'none'" class="position-relative">
                                <div>Coupon</div>
                            </th>
                            <th role="columnheader" @click="sortData('customer')" scope="col" aria-colindex="3" :aria-sort="sort == 'customer' ? dir : 'none'" class="position-relative">
                                <div>Customer</div>                                
                            </th>
                            <th role="columnheader" @click="sortData('created_at')" scope="col" aria-colindex="4" :aria-sort="sort == 'created_at' ? dir : 'none'" class="position-relative">
                                <div>Used At</div>
                            </th>
                            <th role="columnheader" @click="sortData('active')" scope="col" aria-colindex="4" :aria-sort="sort == 'active' ? dir : 'none'" class="position-relative">
                                <div>Status</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loadingData">
                            <td class="spinner-wrapper mt-4 text-center" colspan="5">
                                <div class="spinner-border" role="status"></div>
                            </td>
                        </tr>
  
                        <template v-if="!loadingData && analytics && analytics.length">
                            <tr v-for="row in analytics" :key="'row-' + row.id">
                                <td>{{ row.id }}</td>
                                <td>{{ row.coupon }}</td>
                                <td>{{ ( !row.customer || !row.customer.trim() ? 'Guest User' : row.customer ) }}</td>
                                <td>{{ formatDate(row.created_at) }}</td>
                                <td>{{ row.active ? 'Active' : 'Inactive' }}</td>
                            </tr>
                        </template>
  
                        <tr v-else-if="!loadingData">
                            <td class="text-center" colspan="5">No analytics found</td>
                        </tr>
                    </tbody>
                    <tfoot v-if="!loadingData && analytics && analytics.length">
                        <tr>
                            <th colspan="5" class="text-right">
                                Total: <b>{{ analytics.length }}</b>
                            </th>
                        </tr>
                    </tfoot>
                  </table>
                </div>
                <div class="d-flex justify-content-end">
                  <div v-if="analytics.data && analytics.last_page">
                    <v-pagination :classes="bootstrapPaginationClasses" v-model="currentPage"
                                  :page-count="analytics.last_page" :labels="{ first: '<<', last: '>>' }"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </template>
  
<script>
  import AdminApiService from '@/api-services/admin.service';
  import {debounce} from "debounce";
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
  import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
  import moment from 'moment';
  
  export default {
    name: 'PromoCodesAnalytics',
    components: {
        VueCtkDateTimePicker
    },
    data() {
      return {
        coupons: [],
        analytics: [],
        additionalColumns: [],
        loadingData: false,
        fetchingSubscribers: false,
        bootstrapPaginationClasses: {
          ul: 'pagination justify-content-center',
          li: 'page-item',
          liActive: 'active',
          liDisable: 'disabled',
          button: 'page-link',
        },
        currentPage: 1,
        customerFilter: '',
        couponFilter: this.$route.query.coupon || '',
        minDateRange: this.$store.state.businessDetails.created_at,
        maxDateRange: new Date().toString(),
        selectedDateRange: '',
        sort: 'created_at',
        dir: 'desc'
      };
    },
    computed: {
      
    },
    async mounted() {
      await this.getAnalytics();
    },
    watch: {
        currentPage() {
            this.getAnalytics();
        },
        couponFilter: debounce(function(val) {
            if(!val) {
                this.$router.replace({query: {}});
            } else {
                this.$router.push({ query: Object.assign({}, this.$route.query, { coupon: val }) }).catch(() => {});
            }
            this.getAnalytics();
        }, 500),
        customerFilter: debounce(function() {
            this.getAnalytics();
        }, 500)      
    },
    methods: {
        sortData(col){
            if(this.sort == col) {
                this.dir = this.dir == 'asc' ? 'desc' : 'asc';
            } else {
                this.sort = col;
                this.dir = 'desc';
            }
            this.getAnalytics();
        },
        async getAnalytics() {
            this.loadingData = true;
            let filters = {
                sort: this.sort,
                dir: this.dir
            };
            if(this.couponFilter) {
                filters.coupon = this.couponFilter;
            }
            if(this.customerFilter) {
                filters.customer = this.customerFilter;
            }
            if(this.selectedDateRange.start && this.selectedDateRange.end) {
                filters.selectedDateRange = this.selectedDateRange;
            }
            await AdminApiService.getCouponsAnalytics(filters).then(response => {
                this.loadingData = false;
                this.analytics = response.data.data;
                this.coupons = response.data.coupons;
            })
            .catch(err => {
                this.loadingData = false;
                console.log(err);
            });
        },
        formatDate(value) {
            return value ? moment.utc(value).local().format('MMM D, YYYY hh:mm A'): '';
        },
        clearFilters(){
            this.customerFilter = '';
            this.couponFilter = '';
            if(this.selectedDateRange) {
                this.selectedDateRange = '';            
                this.getAnalytics();
            }
        },
        async submitDateRange() {
            if(!this.selectedDateRange.start && !this.selectedDateRange.end) {
              this.$swal({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 3000,
                type: 'error',
                title: 'Please select Start date and End date'
              });
              return;
            }

            if(this.selectedDateRange.start && !this.selectedDateRange.end) {
              this.$swal({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 3000,
                type: 'error',
                title: 'Please select End date'
              });
              return;
            }
            this.getAnalytics();
          }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .tabs {
    border-radius: 12px 12px 0 0;
    border-bottom: 1px solid #eceff1;
    padding-top: 2px;
  
    button {
      margin-right: 8px;
      padding: 8px 16px;
      border: none;
      font-size: 18px;
      background: none;
      opacity: 0.5;
  
      &.active {
        color: var(--primary);
        border-bottom: 2px solid var(--primary);
        font-weight: bold;
        opacity: 1;
      }
    }
    .count {
      border: 1px solid #E2E8F0;
      border-radius: 4px;
      line-height: 16px;
      align-items: center;
      justify-content: center;
      padding: 2px 3px;
      font-size: 12px;
    }
  }
  
  @media (max-width: 992px) {
    .table-scroll {
      max-width: 100%;
      overflow-x: scroll;
    }
  }
  .search-filter {
    background-image: url(https://storage.googleapis.com/content.ezadtv.com/2024/01/09/659da51d72139_search-icon.png);
    background-position-x: 8px;
    background-position-y: center;
    background-repeat: no-repeat;
    padding-left: 30px !important;
    max-width: 300px;
  }
  .show {
    .btn-outline-primary{
        &.dropdown-toggle {
            color: #fff;
            background-color: var(--primary);
            border-color: var(--primary);
        }
    }
  }

  table {
    display: flex;
    flex-flow: column;
    width: 100%;
}

thead {
    flex: 0 0 auto;
}

tbody {
    flex: 1 1 auto;
    display: block;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 450px;
}

tr {
    width: 100%;
    display: table;
    table-layout: fixed;
}

.table>thead>tr>[aria-sort] {
    cursor: pointer;
    background-image: none;
    background-repeat: no-repeat;
    background-size: 0.65em 1em;
}

.table>tfoot>tr>[aria-sort=none],.table>thead>tr>[aria-sort=none] {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='101' height='101' preserveAspectRatio='none'%3E%3Cpath opacity='.3' d='M51 1l25 23 24 22H1l25-22zm0 100l25-23 24-22H1l25 22z'/%3E%3C/svg%3E")
}

.table>tfoot>tr>[aria-sort=asc],.table>thead>tr>[aria-sort=asc] {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='101' height='101' preserveAspectRatio='none'%3E%3Cpath d='M51 1l25 23 24 22H1l25-22z'/%3E%3Cpath opacity='.3' d='M51 101l25-23 24-22H1l25 22z'/%3E%3C/svg%3E")
}

.table>tfoot>tr>[aria-sort=desc],.table>thead>tr>[aria-sort=desc] {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='101' height='101' preserveAspectRatio='none'%3E%3Cpath opacity='.3' d='M51 1l25 23 24 22H1l25-22z'/%3E%3Cpath d='M51 101l25-23 24-22H1l25 22z'/%3E%3C/svg%3E")
}
.table>thead>tr>[aria-sort]:not(.b-table-sort-icon-left) {
    background-position: left 0.375rem center;
    padding-left: calc(0.75rem + 0.65em);
}
</style>
  