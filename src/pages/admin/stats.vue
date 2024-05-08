<template>
  <main>

    <div class="container">
      <div class="row mb-3 no-gutters">
        <div class="col-md-8" id="top-left-section">
          <a href="#" @click.prevent="$refs.tutorialModal.show()" class="btn btn-tutorial btn-sm text-medium bg-white btn-action mt-1">
            <i class="fa fa-play mr-1"></i> Click to Watch Tutorial Video
          </a>
          <b-modal size="lg" ref="tutorialModal">
            <div slot="modal-header">
              <h5>Stats &amp; Analytics</h5>
            </div>
            <div>
              <video class="w-100" poster="/images/cover-stats-tutorial.jpg" controls>
                <source src="https://storage.googleapis.com/content.ezadtv.com/2024/01/09/659d9d9b922cb_Stats_Analytics.mov" type="video/mp4">
              </video>
            </div>
            <div slot="modal-footer">
              <button type="button" class="btn btn-primary" @click="$refs.tutorialModal.hide()">Done</button>
            </div>
          </b-modal>
        </div>
        <div class="col-md-4 d-flex justify-space-around" id="stats-date-range-container">
          <div class="col-md-11 d-flex flex-column">
            <label for="name" class="control-label mb-1" style="padding-left: 5px;"><i class="fa fa-calendar fa-fw"></i> Pick Date Range</label>
            <VueCtkDateTimePicker
              @input="() => {}"
              @validate="submitDateRange"
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
              input-size="sm"
              no-button-now
              noClearButton
              :right="true"
              style="padding-left: 5px;"
            />
          </div>
          <div>
            <a href="#" id="clear-custom-range-button" class="btn btn-xs date-range-action-button" @click="refreshStats" v-b-tooltip.hover title="Clear Search" style="margin-top: 25px; height: 34px;">
              <strong>X</strong>
            </a>
          </div>
        </div>
      </div>
      <div class="row" v-if="customResultsBanner === 'enabled' && !sectionsLoading.includes('customerActivities')">
        <div class="card-body">
          <h4 class="card-title text-center">Showing results between {{ fromDateFormatted }} and {{ toDateFormatted }}</h4>
        </div>
      </div>
      <div class="row numbers">
        <div class="col-12 d-flex align-items-center justify-content-center" v-if="sectionsLoading.includes('customerActivities')">
          <div class="spinner-border my-5"></div>
        </div>
        <div :class="stats.length > 1 ? 'col-md-6 col-lg-4' : 'col-12'" v-for="(stats, key) in sections" :key="`stats-${key}`">
          <div v-if="!sectionsLoading.includes('customerActivities')" class="card">
            <div class="card-body">
              <legend class="card-title">{{ key }}</legend>
              <no-permission-truevalue v-if="!displayReport(key) && $ezHasNoPermission('view_stats')" />
              <div v-else class="items">
                <div v-for="(stat, key) in stats" :key="`stat-${key}`">
                  <div class="label">{{ stat.name }}</div>
                  <div class="value">
                    {{stat.value}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-lists row">
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card viewed-items h-100">
            <div class="card-body">
              <template v-if="$ezHasNoPermission('view_stats')">
                <div class="card-title d-flex justify-content-between align-items-center my-n2">
                  <h5 class="flex-grow-1 text-nowrap mr-4 my-3"><strong>Popularly Viewed</strong></h5>
                </div>
                <no-permission-truevalue />
              </template>
              <template v-else>
                <div class="card-title d-flex justify-content-between align-items-center my-n2">
                  <h5 @click="showPopularFilters" class="flex-grow-1 text-nowrap mr-4 my-3"><strong>Popularly Viewed</strong></h5>
                  <v-select ref="popularfilterselect" :options="sortOptions" v-model="sortBy" :disabled="isProcessing" style="max-width: 200px;"></v-select>
                </div>
                <div v-if="sectionsLoading.includes('viewedItems')" class="col-12 d-flex align-items-center justify-content-center">
                  <div class="spinner-border my-5"></div>
                </div>
                <ul v-else class="list-group list-group-flush">
                  <admin-product-item :showViews="true" v-for="(item, index) in sortedArray" :product="item" :key="item.sku+'viewedItems'+index"></admin-product-item>
                </ul>
              </template>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card viewed-items h-100">
            <div class="card-body">
              <div class="card-title my-n2">
                <h5 class="my-3"><strong>{{customResultsBanner === 'enabled' ? 'Items Added to Cart' : 'Items Recently Added to Cart'}}</strong></h5>
              </div>
              <no-permission-truevalue v-if="$ezHasNoPermission('view_stats')" />
              <template v-else>
                <div v-if="sectionsLoading.includes('recentlyAdded')" class="col-12 d-flex align-items-center justify-content-center">
                  <div class="spinner-border my-5"></div>
                </div>
                <ul v-else class="list-group list-group-flush">
                  <admin-product-item v-for="(item, index) in recentlyAdded" :product="item" :key="item.sku+'recentlyAdded'+index"></admin-product-item>
                </ul>
              </template>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card viewed-items h-100">
            <div class="card-body">
              <div class="card-title my-n2">
                <h5 class="my-3"><strong>Abandoned Carts</strong></h5>
              </div>
              <no-permission-truevalue v-if="$ezHasNoPermission('view_stats')" />
              <template v-else>
                <div v-if="sectionsLoading.includes('abandonedCarts')" class="col-12 d-flex align-items-center justify-content-center">
                  <div class="spinner-border my-5"></div>
                </div>
                <ul v-else class="list-group list-group-flush">
                  <admin-product-item v-for="(item, index) in abandonedCarts" :product="item" :key="item.sku+'abandonedCarts'+index"></admin-product-item>
                </ul>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="info-lists row">
        <div class="col-md-6 col-lg-4 mb-4" v-if="mostAskedOutOfStockItems.length > 0">
          <div class="card viewed-items h-100">
            <div class="card-body">
              <div class="card-title my-n2">
                <h5 class="my-3"><strong>Most Asked Out of Stock Items</strong><i class="fa fa-info-circle done-check-info-icon pl-2" data-tooltip="This section displays a list of items that customers frequently request notifications for when they are out of stock. These notifications are triggered when customers use the 'Notify Me When It's Back' button on the product page. It helps you keep track of the products with high demand even when they are unavailable."></i></h5>
              </div>
              <no-permission-truevalue v-if="$ezHasNoPermission('view_stats')" />
              <template v-else>
                <div v-if="sectionsLoading.includes('mostAskedOutOfStockItems')" class="col-12 d-flex align-items-center justify-content-center">
                  <div class="spinner-border my-5"></div>
                </div>
                <ul v-else class="list-group list-group-flush">
                  <admin-product-item v-for="(item, index) in mostAskedOutOfStockItems" :product="item" :key="item.sku+'mostAskedOutOfStockItems'+index"></admin-product-item>
                </ul>
              </template>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-4 mb-4" v-if="mostViewedOutOfStockItems.length > 0">
          <div class="card viewed-items h-100">
            <div class="card-body">
              <div class="card-title my-n2">
                <h5 class="my-3"><strong>Most Viewed Out of Stock Items</strong><i class="fa fa-info-circle done-check-info-icon pl-2" data-tooltip="In this section, you can find a list of items that are frequently observed as out of stock when customers visit the product pages. This data gives you insights into which products experience high demand but may be unavailable at the moment."></i></h5>
              </div>
              <no-permission-truevalue v-if="$ezHasNoPermission('view_stats')" />
              <template v-else>
                <div v-if="sectionsLoading.includes('mostViewedOutOfStockItems')" class="col-12 d-flex align-items-center justify-content-center">
                  <div class="spinner-border my-5"></div>
                </div>
                <ul v-else class="list-group list-group-flush">
                  <admin-product-item :showViews="true" v-for="(item, index) in mostViewedOutOfStockItems" :product="item" :key="item.sku+'mostViewedOutOfStockItems'+index"></admin-product-item>
                </ul>
              </template>
            </div>
          </div>
        </div>
        <div class="col-md-12 col-lg-8 mb-4">
          <div class="card in-store-ping-items h-100">
            <div class="card-body">
              <template v-if="$ezHasNoPermission('view_stats')">
                <div class="card-title d-flex justify-content-between align-items-center my-n2">
                  <h5 class="flex-grow-1 text-nowrap mr-4 my-3"><strong>In-Store Pings</strong></h5>
                </div>
                <no-permission-truevalue />
              </template>
              <template v-else>
                <div class="card-title d-flex justify-content-between align-items-center my-n2">
                  <h5 class="flex-grow-1 text-nowrap mr-4 my-3"><strong>In-Store Pings</strong></h5>
                  <v-select class="border-radius-right-none" :options="periodOptions" v-model="inStorePingDuration" :disabled="isInStorePingsProcessing"></v-select>
                  <span class="in-store-ping-count"><b>{{totalPings}}</b></span>
                  <v-select class="ml-1" :options="locationsOptions" v-model="inStorePingLocation" :disabled="isInStorePingsProcessing"></v-select>
                </div>
                <div v-if="sectionsLoading.includes('inStorePingItems')" class="col-12 d-flex align-items-center justify-content-center">
                  <div class="spinner-border my-5"></div>
                </div>
                <ul v-else class="list-group list-group-flush">
                  <admin-product-item :showPings="true" :showFeatured="false" v-for="(item, index) in inStorePingItems" :product="item" :key="item.sku+'inStorePingItems'+index"></admin-product-item>
                </ul>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="row my-4">
        <div class="col-md-12">
          <div class="card pos-items">
            <div class="card-body p-0 p-sm-4">
              <div class="card-title">
                <h5><strong>Pos Items Recently Synced</strong></h5>
              </div>
              <no-permission-truevalue v-if="$ezHasNoPermission('view_stats')" />
              <div v-else class="d-none d-lg-block table-scroll">
                <table class="table customerLogins">
                  <thead>
                  <tr>
                    <th scope="col" width="1"></th>
                    <th scope="col" class="text-left">Name</th>
                    <th scope="col">Inventory</th>
                    <th scope="col">Price</th>
                    <th scope="col">Promo Price</th>
                    <th scope="col">Location</th>
                    <th scope="col">Last Synced</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, index) in recentlySynced" :key="item.sku+'recentlySynced'+index">
                    <td scope="row">
                      <div class="thumb">
                        <img :src="item.image_url" :alt="item.title" />
                      </div>
                    </td>
                    <td class="text-left">
                      <div class="title-truncate">{{ item.title }}</div>
                      <small class="text-muted">{{ item.sku }}</small>
                    </td>
                    <td>{{ item.num_inventory }}</td>
                    <td>${{ item.price }}</td>
                    <td><span v-if="item.promo_price">$</span>{{ item.promo_price }}</td>
                    <td>{{ item.location }}</td>
                    <td>{{ item.last_updated_by_business }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="sectionsLoading.includes('recentlySynced')" class="col-12 d-flex align-items-center justify-content-center">
                <div class="spinner-border my-5"></div>
              </div>
              <div v-else class="row small-gutters d-none">
                <div class="col-6 mb-3" v-for="item in recentlySynced" :key="item.sku">
                  <div class="card p-4 h-100">
                    <div class="mb-2 text-center flex-grow-1">
                      <div class="d-flex align-items-center justify-content-center image-container">
                        <img v-if="item.image_url" :src="item.image_url" :alt="item.title" class="mb-1" />
                      </div>
                      <div class="data">{{ item.title }}</div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between w-100 mb-1">
                      <b>Inventory</b><div class="data">{{ item.num_inventory }}</div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between w-100 mb-1">
                      <b>Price</b><div class="data">${{ item.price }}</div>
                    </div>
                    <div v-if="item.promo_price" class="d-flex align-items-center justify-content-between w-100 mb-1">
                      <b>Promo Price</b><div class="data">${{ item.promo_price }}</div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between w-100 mb-1">
                      <b>Location</b><div class="data">{{ item.price }}</div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between w-100 mb-1">
                      <b>Last Synced</b><div class="data">{{ item.price }}</div>
                    </div>
                  </div>
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
    import VSelect from '@alfsnd/vue-bootstrap-select';
    import AdminApiService from '@/api-services/admin.service';
    import HomePageApiService from '@/api-services/homepage.service';
    import ProductApiService from '@/api-services/product.service';
    import _ from 'lodash';
    import noPermissionTruevalue from "./settings/no-permission-truevalue";
    import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
    import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

    export default {
        name: 'AdminStats',
        components: {
          VSelect,
          noPermissionTruevalue,
          VueCtkDateTimePicker
        },
        data() {
          return {
            viewedItems: [],
            inStorePingItems: [],
            recentlyAdded: [],
            abandonedCarts: [],
            sortOptions: [
                {value: "price-desc", text: "Price High to Low"},
                {value: "price-asc", text: "Price Low to High"},
                {value: "popular", text: "Most Popular"},
                {value: "out-of-stock" , text:"Out of Stock"},
                {value: "low-stock" , text:"Low Stock"}
            ],
            sortBy: { text: 'Price High to Low', value: 'price-desc'},
            periodOptions: [
                {value: "last-week", text: "Last Week"},
                {value: "last-month", text: "Last Month"},
                {value: "last-three-months", text: "Last 3 Months"},
                {value: "last-six-months" , text:"Last 6 Months"},
                {value: "last-twelve-months" , text:"Last 12 Months"}
            ],
            isInStorePingsProcessing: false,
            inStorePingDuration: { text: 'Last Week', value: 'last-week'},
            inStorePingLocation: { text: 'Store Location', value: ''},
            mostAskedOutOfStockItems: [],
            mostViewedOutOfStockItems: [],
            isProcessing: false,
            sections: {},
            customerLogins: [],
            recentlySynced: [],
            sectionsLoading: [
              'customerActivities',
              'viewedItems',
              'inStorePingItems',
              'recentlyAdded',
              'abandonedCarts',
              'mostAskedOutOfStockItems',
              'mostViewedOutOfStockItems',
              'customerLogins',
              'recentlySynced',
            ],
            minDateRange: this.$store.state.businessDetails.created_at,
            maxDateRange: new Date().toString(),
            selectedDateRange: '',
            fromDateFormatted: '',
            toDateFormatted: '',
            refreshActionStatus: 'disabled',
            customResultsBanner: 'disabled'
          };
        },
        computed: {
          totalPings() {
            const sum = this.inStorePingItems.reduce((acc, item) => acc + item.ping_count, 0);
            return this.formatCount(sum);
          },
          locationsOptions() {
            let options = [{ text: 'Store Location', value: '' }];

            this.$store.state.businessDetails.about_us.locations.forEach(location => {
                options.push({
                    value: location.id,
                    text: location.name
                });
            });

            return options;
          },
          sortedArray() {
            let tempArray = [];
            switch(this.sortBy.value) {
              case 'price-desc':
                tempArray = _.orderBy(this.viewedItems, ['price', 'views'], ['desc', 'desc']);
                break;
              case 'price-asc':
                tempArray = _.orderBy(this.viewedItems, ['price', 'views'], ['asc', 'desc']);
                break;
              case 'popular':
                tempArray = _.orderBy(this.viewedItems, 'views', 'desc');
                break;
              case 'out-of-stock':
                tempArray = this.viewedItems.filter( x => Number(x.num_inventory) == 0);
                tempArray = _.orderBy(tempArray, 'views', 'desc');
                break;
              case 'low-stock':
                tempArray = this.viewedItems.filter( x => Number(x.num_inventory) > 0 && Number(x.num_inventory) < 5);
                tempArray = _.orderBy(tempArray, 'views', 'desc');
                break;
            }
            return tempArray;
          },
          settings() {
            return this.$store.state.settings;
          },
          e2ReportExemption() {
            return this.settings.e2ReportExemption && this.settings.e2ReportExemption === true || false;
          }
        },
        methods: {
          showPreloader(str) {
            document.getElementById('stats-date-range-container').classList.add('disabled-field');
            document.getElementById('clear-custom-range-button').classList.add('disabled-field');
            this.sectionsLoading.push(str);
          },
          hidePreloader(str) {
            document.getElementById('stats-date-range-container').classList.remove('disabled-field');
            document.getElementById('clear-custom-range-button').classList.remove('disabled-field');
            this.sectionsLoading.splice(this.sectionsLoading.indexOf(str), 1);
          },
          showPopularFilters() {
            console.log(this.$refs.popularfilterselect);
          },
          async fetchData(fromDate, toDate, onMount = null) {
            AdminApiService.customerActivities(fromDate, toDate).then(r => {
              this.hidePreloader('customerActivities');
              this.sections = r.data.sections;
            });
            AdminApiService.popularViewedItems(fromDate, toDate).then(r => {
              this.hidePreloader('viewedItems');
              this.viewedItems = r.data.items;
            });
            this.getInStorePingItems();
            AdminApiService.recentlyAddedItems(fromDate, toDate).then(r => {
              this.hidePreloader('recentlyAdded');
              this.recentlyAdded = r.data.items;
            });
            AdminApiService.abandonedCarts(fromDate, toDate).then(r => {
              this.hidePreloader('abandonedCarts');
              this.abandonedCarts = r.data.items;
            });
            AdminApiService.mostAskedOutOfStockItems(fromDate, toDate).then(r => {
              this.hidePreloader('mostAskedOutOfStockItems');
              this.mostAskedOutOfStockItems = r.data.items;
            });
            AdminApiService.mostViewedOutOfStockItems(fromDate, toDate).then(r => {
              this.hidePreloader('mostViewedOutOfStockItems');
              this.mostViewedOutOfStockItems = r.data.items;
            });
            if(onMount === true) {
              AdminApiService.recentCustomerLogins().then(r => {
                this.hidePreloader('customerLogins');
                this.customerLogins = r.data.items;
              });
              AdminApiService.itemsRecentlySynced().then(r => {
                this.hidePreloader('recentlySynced');
                this.recentlySynced = r.data.items;
              });
              await ProductApiService.getFavouriteProducts().then(response => {
              let allProducts = [];

              response.data.data.forEach(item => {
                  item.competitors = null;
                  item.similars = null;
                  item.videos = null;
                  allProducts.push(item);
              });

              this.$store.commit('addProductsRange', allProducts);
              this.$store.commit('setFavouriteProducts', allProducts);
            });
            }
          },
          getInStorePingItems() {
            AdminApiService.inStorePingItems(this.inStorePingDuration.value, this.inStorePingLocation.value).then(r => {
              this.hidePreloader('inStorePingItems');
              this.inStorePingItems = r.data.items;
            });
          },
          formatCount(count) {
            if (count < 1000) {
                return count.toString();
            } else {
                return (count / 1000).toFixed(1) + 'k';
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

            this.showPreloader('customerActivities');
            this.showPreloader('viewedItems');
            this.showPreloader('recentlyAdded');
            this.showPreloader('abandonedCarts');
            this.showPreloader('inStorePingItems');
            await this.fetchData(this.selectedDateRange.start, this.selectedDateRange.end).then(() => {
              this.fromDateFormatted = new Date(this.selectedDateRange.start).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
              this.toDateFormatted = new Date(this.selectedDateRange.end).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
              this.refreshActionStatus = 'enabled';
              this.customResultsBanner = 'enabled';
            });
          },
          async refreshStats() {
            if(this.refreshActionStatus === 'disabled') {
              return;
            }
            this.showPreloader('customerActivities');
            this.showPreloader('viewedItems');
            this.showPreloader('recentlyAdded');
            this.showPreloader('abandonedCarts');
            this.showPreloader('inStorePingItems');
            await this.fetchData('N/A', 'N/A').then(() => {
              this.selectedDateRange = '';
              this.fromDateFormatted = '';
              this.toDateFormatted = '';
              this.refreshActionStatus = 'disabled';
              this.customResultsBanner = 'disabled';
            });
          },
          displayReport(key) {
            // Only allowing this report for E2 store
            return this.e2ReportExemption && key == "Visitor Stats" || false;
          },
        },
        watch: {
          inStorePingDuration(newVal, oldVal) {
            this.showPreloader('inStorePingItems');
            this.getInStorePingItems();
          },
          inStorePingLocation(newVal, oldVal) {
            this.showPreloader('inStorePingItems');
            this.getInStorePingItems();
          }
        },
        async mounted() {
          if(!this.e2ReportExemption && this.$ezHasNoPermission('view_stats')) {
            this.sectionsLoading = [];
            return;
          } 
          if(!this.businessDetails) {
            let r = await HomePageApiService.getBusinessDetails();
            this.$store.commit('setBusinessDetails', r.data.data);
          }
          await this.fetchData('N/A', 'N/A', true);
        },
    };
</script>
<style lang="scss" scoped>
  .popular-items {
    padding: 0rem 1.25rem 1rem 1.25rem;
    justify-content: space-between;
    h5 {
      margin: 7px 0px 0px 0px;
    }
  }
  h5 {
    font-size: 1rem;
  }
  .title-truncate {
    max-width: 480px;
    white-space: normal;
  }
  th {
    text-align: center;
  }
  td {
    text-align: center;
  }
  .image-container {
    height: 60px;
    overflow: hidden;

    img {
      max-width: 100%;
      max-height: 100%;
      height: auto;
    }
  }
  .numbers {
    margin-bottom: 24px;

    @media (max-width: 767px) {
      margin-bottom: 12px;
    }

    > div {
      margin-bottom: 24px;

      @media (max-width: 767px) {
        margin-bottom: 16px;
      }
    }

    .value {
      font-size: 18px;
      font-weight: bold;
      line-height: 1.4;
      color: var(--primary);

      @media (max-width: 767px) {
        font-size: 16px;
      }
    }
    .diff {
      font-weight: bold;
      font-size: 17px;
      margin-left: 10px;
      &.positive {
        color: #04ad38;
      }
      &.negative {
        color: #ff4a4f;
      }
    }
    .label {
      font-size: 13px;
      color: #697680;
      white-space: nowrap;
    }
    .card {
      height: 100%;

      .card-title {
        margin-bottom: 0;
        font-size: 16px;
        font-weight: bold;

        @media (max-width: 767px) {
          font-size: 14px;
        }
      }

      .card-body {
        > .items {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          column-gap: 12px;
          row-gap: 12px;
        }
      }
    }
  }
  .padding-bottom-filter {
    padding-bottom: 12px;
  }
  .card {
    .card-title {
      padding-bottom: 8px;
      margin-bottom: -1px;
      position: relative;
      z-index: 1;
    }
  }
  .info-lists {
    .list-group {
      min-height: 100px;
      max-height: 400px;
      overflow-y: auto;

      .list-group-item {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
  .table.customerLogins > tbody > tr > td,
  .table.customerLogins > thead > tr > th {
    vertical-align: middle;
  }
  .table-scroll {
    max-height: 500px;
    overflow-y: scroll;
  }
  .thumb {
    padding: 2px;
    border: 1px solid #E8E8E8;
    border-radius: 4px;
    width: 50px;
    height: 50px;
    min-width: 50px;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-width: calc(100% - 4px);
      max-height: calc(100% - 4px);
      text-indent: -9999999px;
      overflow: hidden;
    }
  }
  .date-range-action-button {
    background-color: grey;
    border: 1px #CCC solid;
    color: white;
  }
  .btn.btn-secondary:active,
  .btn.btn-secondary:focus,
  .btn.btn-secondary:active:focus {
    background-color: var(--primary);
    border-color: var(--primary);
  }
  .disabled-field {
    pointer-events: none;
    opacity: 0.4;
  }
  .done-check-info-icon:hover::before,
  .done-check-info-icon:hover::after {
    position: absolute;
    top: -.25rem;
    left: 50%;
    transform: translateX(-50%) translateY(-100%);
  }

  .done-check-info-icon:hover::before {
    content: attr(data-tooltip);
    background: lightgrey;
    height: fit-content;
    width: 180px;
    border-radius: 0.3rem;
    box-shadow: 1px 1px 10px #333;
    padding: 0.5rem;
    font-family: sans-serif;
    font-size: 0.8rem;
  }
  @media (max-width: 1200px) {
    :deep(.v-select) {
      width: 36px !important;
      border: none !important;
      .v-select-toggle {
        text-indent: 999px;
        overflow: hidden;
        width: 36px !important;
        padding: 0 !important;
        height: 36px !important;
        background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB3aWR0aD0iOTcxLjk4NnB4IiBoZWlnaHQ9Ijk3MS45ODZweCIgdmlld0JveD0iMCAwIDk3MS45ODYgOTcxLjk4NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgOTcxLjk4NiA5NzEuOTg2OyIKCSB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBkPSJNMzcwLjIxNiw0NTkuM2MxMC4yLDExLjEsMTUuOCwyNS42LDE1LjgsNDAuNnY0NDJjMCwyNi42MDEsMzIuMSw0MC4xMDEsNTEuMSwyMS40bDEyMy4zLTE0MS4zCgkJYzE2LjUtMTkuOCwyNS42LTI5LjYwMSwyNS42LTQ5LjJWNTAwYzAtMTUsNS43LTI5LjUsMTUuOC00MC42MDFMOTU1LjYxNSw3NS41YzI2LjUtMjguOCw2LjEwMS03NS41LTMzLjEtNzUuNWgtODczCgkJYy0zOS4yLDAtNTkuNyw0Ni42LTMzLjEsNzUuNUwzNzAuMjE2LDQ1OS4zeiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=') !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: 16px !important;
      }
      .v-dropdown-container {
        width: 200px;
        right: 0;
      }
    }
  }
  @media (max-width: 992px) {
    .table-scroll {
      max-width: 100%;
      overflow-x: scroll;
    }
  }
  @media (max-width: 767px) {
    #top-left-section {
      margin-bottom: 20px;
    }
  }
  @media (max-width: 575px) {
    .pos-items {
      background: none;
      box-shadow: none;
      border: none;
    }
  }
  .in-store-ping-count {
    font-size: 15px;
    background: #fff;
    border: 1px solid #d3d9dfb0;
    padding: 6px;
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .border-radius-right-none {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
