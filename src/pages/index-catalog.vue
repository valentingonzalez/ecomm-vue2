<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <div class="business-details card" v-if="businessDetails">
            <div v-if="carousel" class="position-relative">
              <swiper ref="swiper" class="swiper" :options="swiperOptions">
                <swiper-slide
                  v-for="(slide, i) in carousel.data.images" :key="`carousel-${i}`">
                  <a v-if="slide.redirect_url" :href="slide.redirect_url" target="_blank" :aria-label="`To ${slide.redirect_url}`">
                    <img :src="slide.image" class="img-fluid w-100" alt="Slide Image" />
                  </a>
                  <img v-else :src="slide.image" class="img-fluid w-100">
                </swiper-slide>
              </swiper>
            </div>
            <div class="card-body" v-if="currentStore != null">
              <a :href="`tel:${currentStore.phone}`" class="phone text-reset">
                <svg class="mr-2" width="16" height="15" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" fill-rule="nonzero" d="M-998-18H442v50H-998z"/><path d="M12 9l-2 2-6-6 2-2-3-3-2 2c0 6.627 5.373 12 12 12l2-2-3-3z" stroke="#000" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
                {{ currentStore.phone }}
              </a>
              <div class="hours">
                <div v-for="(hours, day, i) in currentStore.hours" :key="`bt-${i}`">
                  <div v-if="day == today" class="today-info" :class="{'closed' : !isOpened(day, hours)}" variant="primary">
                    <svg class="clock" width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(-158.000000, -449.000000)" stroke="var(--primary)"><g transform="translate(159.000000, 449.000000)"><g transform="translate(0.000000, 1.000000)"><circle cx="7" cy="7" r="7"></circle><polyline points="4 4 7 7 12 7"></polyline><path d="M7,2 L7,3" id="Path"></path><path d="M7,12 L7,11" id="Path"></path><path d="M2,7 L3,7" id="Path"></path></g></g></g></g></svg>
                    <span v-if="isOpened(day, hours)">
                      Open Now!
                    </span>
                    <span v-else>
                      Closed. Opens at {{ hours.open | reduce }}
                    </span>
                  </div>
                </div>
                <div v-for="(hours, day, i) in currentStore.hours" :key="`h-${i}`">
                  <div class="hour d-flex" :class="{'font-weight-bold' : day == today}">
                    <div class="w-50">
                      {{ day | fullDayName }}
                    </div>
                    <div class="w-50">
                      <span v-if="hours.closed">
                        Closed
                      </span>
                      <span v-else>
                        {{ hours.open }} - {{ hours.close }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <div class="map-container my-2">
                  <GmapMap v-if="businessDetails"
                    ref="map"
                    :options="{
                      mapTypeControl: false,
                      zoomControl: false,
                      streetViewControl: false,
                      fullscreenControl: false
                    }"
                    :center="getCenter(businessDetails)"
                    style="height: 240px"
                    :zoom="16"></GmapMap>
                </div>

                <address v-if="$store.state.currentStore.address" class="address text-capitalize">
                  {{ $store.state.currentStore.address | lowerCase }},
                  {{ $store.state.currentStore.state | lowerCase }},
                  {{ $store.state.currentStore.city | lowerCase }}
                </address>
              </div>
              <summary-text v-if="businessDetails.description" class="description" :lines="4" :text="businessDetails.description" />
              <div class="social">
                <a :href="social.facebook" target="_blank" v-if="social.facebook" aria-label="Facebook">
                  <svg width="11" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M3.008 20v-8.945H0V7.5h3.008V4.687c0-1.484.416-2.636 1.25-3.457C5.09.41 6.198 0 7.578 0c1.12 0 2.031.052 2.734.156V3.32H8.437c-.703 0-1.184.157-1.445.47-.208.26-.312.676-.312 1.25V7.5H10l-.469 3.555H6.68V20H3.008z" fill="#e40416" fill-rule="nonzero"/></svg>
                </a>
                <a :href="social.twitter" target="_blank" v-if="social.twitter" aria-label="Twitter">
                  <svg width="20" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M17.93 4.937c.026.105.039.274.039.508 0 1.875-.456 3.685-1.367 5.43-.938 1.849-2.253 3.32-3.946 4.414-1.849 1.224-3.971 1.836-6.367 1.836-2.292 0-4.388-.612-6.289-1.836.286.026.612.04.977.04 1.9 0 3.606-.587 5.117-1.759-.912 0-1.712-.267-2.403-.8a4.08 4.08 0 01-1.425-2.012c.26.026.507.039.742.039.364 0 .729-.04 1.094-.117a4.133 4.133 0 01-2.344-1.446A3.932 3.932 0 01.82 6.656v-.078c.573.339 1.185.52 1.836.547a4.55 4.55 0 01-1.328-1.484A3.94 3.94 0 01.82 3.668c0-.716.196-1.4.586-2.05a11.31 11.31 0 003.73 3.046 11.354 11.354 0 004.708 1.25 5.693 5.693 0 01-.078-.937c0-.73.182-1.413.546-2.051.365-.638.86-1.14 1.485-1.504a3.962 3.962 0 012.031-.547c.599 0 1.152.117 1.66.352.508.234.957.546 1.348.937a8.345 8.345 0 002.617-.977c-.312.964-.911 1.72-1.797 2.266A8.81 8.81 0 0020 2.79a9.016 9.016 0 01-2.07 2.148z" fill="#e40416" fill-rule="nonzero"/></svg>
                </a>
                <a :href="social.instagram" target="_blank" v-if="social.instagram" aria-label="Instagram">
                  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M8.75 4.508c.807 0 1.556.202 2.246.605.69.404 1.237.95 1.64 1.64.404.691.606 1.44.606 2.247 0 .807-.202 1.556-.605 2.246a4.505 4.505 0 01-1.64 1.64 4.371 4.371 0 01-2.247.606 4.371 4.371 0 01-2.246-.605 4.505 4.505 0 01-1.64-1.64A4.371 4.371 0 014.257 9c0-.807.202-1.556.605-2.246.404-.69.95-1.237 1.64-1.64a4.371 4.371 0 012.247-.606zm0 7.422c.807 0 1.497-.287 2.07-.86.573-.573.86-1.263.86-2.07 0-.807-.287-1.497-.86-2.07a2.822 2.822 0 00-2.07-.86c-.807 0-1.497.287-2.07.86A2.822 2.822 0 005.82 9c0 .807.287 1.497.86 2.07.573.573 1.263.86 2.07.86zm5.742-7.618a1.217 1.217 0 01-.332.743.951.951 0 01-.723.312c-.286 0-.533-.104-.742-.312a1.014 1.014 0 01-.312-.743c0-.286.104-.533.312-.742.209-.208.456-.312.742-.312.287 0 .534.104.743.312.208.209.312.456.312.742zm2.969 1.055c.026.73.039 1.94.039 3.633s-.02 2.91-.059 3.652c-.039.743-.15 1.387-.332 1.934a4.553 4.553 0 01-1.074 1.7 4.553 4.553 0 01-1.7 1.073c-.546.183-1.19.293-1.933.332-.742.04-1.96.059-3.652.059-1.693 0-2.91-.02-3.652-.059-.743-.039-1.387-.162-1.934-.37a4.164 4.164 0 01-1.7-1.036 4.553 4.553 0 01-1.073-1.7c-.183-.546-.293-1.19-.332-1.933C.019 11.91 0 10.692 0 9c0-1.693.02-2.91.059-3.652.039-.743.15-1.387.332-1.934a4.553 4.553 0 011.074-1.7 4.553 4.553 0 011.7-1.073C3.71.458 4.354.348 5.097.309 5.84.269 7.058.25 8.75.25c1.693 0 2.91.02 3.652.059.742.039 1.387.15 1.934.332a4.553 4.553 0 011.7 1.074c.48.482.839 1.048 1.073 1.7.183.546.3 1.197.352 1.952zm-1.875 8.79c.156-.443.26-1.147.312-2.11.026-.573.04-1.38.04-2.422v-1.25c0-1.068-.014-1.875-.04-2.422-.052-.99-.156-1.693-.312-2.11a2.82 2.82 0 00-1.68-1.679c-.416-.156-1.12-.26-2.11-.312-.572-.026-1.38-.04-2.421-.04h-1.25c-1.042 0-1.849.014-2.422.04-.963.052-1.667.156-2.11.312a2.82 2.82 0 00-1.679 1.68c-.156.416-.26 1.12-.312 2.11a56.99 56.99 0 00-.04 2.421v1.25c0 1.042.014 1.849.04 2.422.052.963.156 1.667.312 2.11.339.807.898 1.366 1.68 1.679.442.156 1.146.26 2.11.312.572.026 1.38.04 2.421.04h1.25c1.068 0 1.875-.014 2.422-.04.99-.052 1.693-.156 2.11-.312.807-.339 1.366-.899 1.679-1.68z" fill="#e40416" fill-rule="nonzero"/></svg>
                </a>
                <a :href="social.youtube" target="_blank" v-if="social.youtube" aria-label="Youtube">
                  <svg width="22" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M21.484 2.844c.183.703.313 1.77.39 3.203L21.915 8l-.04 1.953c-.077 1.458-.207 2.54-.39 3.242-.13.443-.364.834-.703 1.172a2.708 2.708 0 01-1.21.703c-.678.183-2.266.313-4.766.39l-3.555.04-3.555-.04c-2.5-.077-4.088-.207-4.765-.39a2.708 2.708 0 01-1.211-.703 2.724 2.724 0 01-.703-1.172c-.183-.703-.313-1.784-.391-3.242L.585 8c0-.573.014-1.224.04-1.953.078-1.432.208-2.5.39-3.203.13-.469.365-.873.704-1.211A2.708 2.708 0 012.929.93C3.608.747 5.196.617 7.696.54L11.25.5l3.555.04c2.5.077 4.088.207 4.765.39.469.13.873.364 1.211.703.339.338.573.742.703 1.21zm-12.422 8.36L14.648 8 9.062 4.836v6.367z" fill="#e40416" fill-rule="nonzero"/></svg>
                </a>
                <a :href="social.pinterest" target="_blank" v-if="social.pinterest" aria-label="Pinterest">
                  <svg width="20" height="20" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M10,0 C4.5,0 0,4.5 0,10 C0,14.25 2.66666667,17.8333333 6.33333333,19.3333333 C6.25,18.5833333 6.16666667,17.3333333 6.33333333,16.5 C6.5,15.75 7.5,11.5 7.5,11.5 C7.5,11.5 7.25,10.8333333 7.25,10 C7.25,8.58333333 8.08333333,7.58333333 9.08333333,7.58333333 C9.91666667,7.58333333 10.3333333,8.25 10.3333333,9 C10.3333333,9.83333333 9.75,11.1666667 9.5,12.3333333 C9.25,13.3333333 10,14.1666667 11,14.1666667 C12.75,14.1666667 14.1666667,12.3333333 14.1666667,9.58333333 C14.1666667,7.16666667 12.4166667,5.5 10,5.5 C7.16666667,5.5 5.5,7.66666667 5.5,9.83333333 C5.5,10.6666667 5.83333333,11.5833333 6.25,12.0833333 C6.33333333,12.1666667 6.33333333,12.25 6.33333333,12.3333333 C6.25,12.6666667 6.08333333,13.3333333 6.08333333,13.5 C6,13.6666667 5.91666667,13.75 5.75,13.6666667 C4.5,13.0833333 3.75,11.25 3.75,9.83333333 C3.75,6.66666667 6.08333333,3.75 10.3333333,3.75 C13.8333333,3.75 16.5,6.25 16.5,9.5 C16.5,12.9166667 14.3333333,15.75 11.3333333,15.75 C10.3333333,15.75 9.33333333,15.25 9,14.5833333 C9,14.5833333 8.5,16.5 8.41666667,17 C8.16666667,17.8333333 7.58333333,18.9166667 7.16666667,19.5833333 C8,19.8333333 9,20 10,20 C15.5,20 20,15.5 20,10 C20,4.5 15.5,0 10,0 Z" id="pinterest" fill="#B02433" fill-rule="nonzero"></path></svg>
                </a>
              </div>

            </div>
          </div>
        </div>

        <div class="col-md-8">

          <div class="subscribe">
            <h4>Enter Your Email Address To Get Exclusive Deals!</h4>

            <div class="actions">
              <input @keypress.enter="subscribe" v-model="subscriberEmail" type="email" class="form-control" placeholder="Enter Email Here" />

              <button type="button" @click="subscribe()" class="btn btn-secondary" v-if="!subscriberLoader">Submit</button>
              <button type="button" class="btn btn-secondary" v-else aria-label="Submitting">
                <div class="spinner-border text-light" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </button>
            </div>
          </div>
          <div class="mt-4">
            <div v-if="loadingSpinner" class="spinner-border m-auto" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <!-- Item list -->
            <favourite-products-section v-else layout="grid" />
            <template v-if="!$store.state.favouriteProducts || !$store.state.favouriteProducts.length && (popularProducts && popularProducts.length > 0)">
              <popular-products-section layout="grid" />
            </template>
          </div>
        </div>
        <div v-if="!$store.state.settings.onlyFeatured">
          <template v-if="homePageProducts.departments">
            <div v-for="(products, department, index) in homePageProducts.departments" :key="`department-${index}`" class="d-none d-md-block mt-4 mb-2 col-12">
              <h4 class="font-weight-bold mt-md-0 mt-sm-3 mt-3 mb-3">{{ department }} Products</h4>
              <div class="row small-gutters">
                <div v-for="(item, index) in products" :key="`dept-product-${index}`" class="col-md-3 mb-2">
                  <ProductItem :item="item" />
                </div>
              </div>
            </div>
          </template>
          <template v-if="homePageProducts.brands">
            <div v-for="(products, brand, index) in homePageProducts.brands" :key="`brand-${index}`" class="d-none d-md-block mt-4">
              <h4 class="font-weight-bold mt-md-0 mt-sm-3 mt-3 mb-3">{{ brand }} Products</h4>
              <div class="row small-gutters">
                <div v-for="(item, index) in products" :key="'brand-product-' + index" class="col-md-3 mb-2">
                  <ProductItem :item="item" />
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import HomePageApiService from '@/api-services/homepage.service';
import ProductApiService from '@/api-services/product.service';
import SummaryText from '@/components/summary-text';

import SubscriberApiService from '@/api-services/subscriber.service';

export default {
  name: 'CatalogPage',
  data() {
    return {
      swiperOptions: {
        autoplay: {
          delay: 3500,
          disableOnInteraction: false
        },
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        draggable: true,
        allowTouchMove: true,
        navigation: {
          nextEl: '.swiper-next-bt',
          prevEl: '.swiper-prev-bt'
        }
      },
      loadingSpinner: true,
      homePageProducts: [],
      subscriberEmail: "",
      subscriberLoader: false,
      days: ['sun','mon','tue','wed','thu','fri','sat'],
      businessDetails: {},
      social: {},
      searchFilters: {
        sort: '',
      },
      sortOptions: [
        {value: "price-desc", text: "Price High to Low"},
        {value: "price-asc", text: "Price Low to High"},
        {value: "relevancy", text: "Relevancy"},
        {value: "latest", text: "New Arrivals"},
        {value: "title-asc", text: "Alphabetical"},
        { value: "manufacturer-no", text: "Manufacturer #" }
      ],
      sortby: { text: 'Price High to Low', value: 'price-desc'},
      keyPrefix: 'popular_product_',
      carousel: null,
      centerPoints: {},

    };
  },
  components: {
    SummaryText,
  },
  filters: {
    fullDayName(day) {
      let days = { 'mon': 'Monday', 'tue': 'Tuesday', 'wed': 'Wednesday','thu': 'Thursday','fri': 'Friday', 'sat': 'Saturday', 'sun': 'Sunday' };
      return days[day];
    },
    reduce(hours) {
      return hours.replace(':00','').replace(/ /g,'');
    }
  },
  computed: {
    now() {
      const currentPstTime = new Date().toLocaleString("en-US", {timeZone: this.$store.state.settings.timezone || "America/Los_Angeles"});
      const hour12 = new Date(currentPstTime).toLocaleString([], { hour: '2-digit', minute:'2-digit', hour12: true });

      return {
        day: new Date(currentPstTime).getDay(),
        hour: hour12.split(' ')[0],
        meridian: hour12.split(' ')[1]
      };
    },
    popularProducts() {
      return this.$store.state.popularProducts;
    },
    swiper() {
      return this.$refs.swiper;
    },
    today() {
      return this.days[this.now.day];
    },
    map() {
      return {
        map: this.$refs.map,
        address: `${this.businessDetails[0].address}, ${this.businessDetails[0].city}, ${this.businessDetails[0].state}, ${this.businessDetails[0].zip}`
      };
    },
    business() {
        return this.$store.state.businessDetails;
    },
    currentStore() {
      return this.$store.state.currentStore;
    },
  },
  methods: {
    getCenter(store) {
      return this.centerPoints[store.id] || {lng:0,lat:0};
    },
    goToPage(slide) {
      if(slide.redirect_url){
        window.open(slide.redirect_url);
      }
    },
    subscribe() {
      if (!this.subscriberEmail) return;

      this.subscriberLoader = true;

      SubscriberApiService.subscribe(this.subscriberEmail)
        .then(() => {
        this.subscriberLoader = false;
        this.$swal("Success", 'Thank you for subscribing! Be on the look out for amazing deals!', "success");
        this.subscriberEmail = null;
     })
    .catch((error) => {
        console.log('error in subscribe: ', error.response);
        const errorResponse = error.response && error.response.data && error.response.data.errors;
          this.subscriberLoader = false;

        if (errorResponse['email'] && errorResponse['email'].length
          && errorResponse['email'][0] === 'The email has already been taken.') {

            this.$swal("Error", 'This email has already been submitted.', "error");
        } else {
            this.$swal("Error", 'MMM... Something Went Wrong', "error");
        }

    });
    },
    isOpened(day, hours) {
      let hour = parseFloat(this.now.hour.replace(':', '.'));
      let open = parseFloat(hours.open.split(' ')[0].replace(':', '.'));
      let close = parseFloat(hours.close.split(' ')[0].replace(':', '.'));
      if(day != this.days[this.now.day]) {
        return false;
      }
      if(this.now.meridian.toLowerCase() === 'pm') {
        if(hour > close)
          return false;
      } else if(this.now.meridian.toLowerCase() === 'am') {
        if(hour < open)
          return false;
      }
      return true;
    },
    async addMarker(map, address, storeId) {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({'address': address}, (results, status) => {
        if (status === 'OK') {
          this.centerPoints[storeId] = results[0].geometry.location;
          map.setCenter(results[0].geometry.location);
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      });
    },
    doSort() {
      this.$store.dispatch('filter_popular_products', {
        sort: this.sortby.value
      });
      this.$forceUpdate();
    }
  },
  async mounted() {
    this.$ezSetTitle('');

    let resp = await HomePageApiService.getSections();
      for(var i = 0; i < resp.data.data.length; i++){
        if(resp.data.data[i].widget_type == 4){
          var carousel = resp.data.data[i];
        }
      }
      if(carousel){
        this.carousel = carousel;
      }

      let products = await HomePageApiService.getHomepageProducts();

      if(products.data.data.departments || products.data.data.brands){
        this.homePageProducts = products.data.data;
      }

      this.loadingSpinner = false;


      let productsResponse = await ProductApiService.getPopularProducts();
      let businessResponse = await HomePageApiService.getBusinessDetails();
      this.$store.commit('setBusinessDetails', businessResponse.data.data);
      this.social = {
        facebook: businessResponse.data.data.facebook_link,
        instagram: businessResponse.data.data.instagram_link,
        twitter: businessResponse.data.data.twitter_link,
        youtube: businessResponse.data.data.youtube_link,
        pinterest: businessResponse.data.data.pinterest_link
      };
      this.businessDetails = businessResponse.data.data.about_us.locations;
      if(this.businessDetails.description = businessResponse.data.data.about_us){
        this.businessDetails.description = businessResponse.data.data.about_us.description;
      }
      this.businessDetails.facebook_link = businessResponse.data.data.facebook_link;

      const allProducts = productsResponse.data.data;
      this.$store.commit('setPopularProducts', allProducts);

      let allSKUs = [];
      allProducts.forEach(item => {
          allSKUs.push(item.sku);
      });
      this.keyPrefix = 'popular_product_with_competitor_';
      this.$store.commit('setCurrentStore');

    setTimeout(() => {
      this.$gmapApiPromiseLazy().then(() => {
        setTimeout(() => {
          let store = this.$store.state.currentStore;
          if(this.$refs.map)
            this.addMarker(this.$refs.map.$mapObject, `${store.address},${store.city},${store.state}`);
        }, 1000);
      });
    }, 500);
    }
};
</script>

<style lang="scss" scoped>
  .swiper {
    .img {
      background-size: cover;
      height: 230px;
    }
  }

  .business-details {
    position: relative;

    .phone {
      font-size: 13px;
      display: flex;
      align-items: center;
      svg * {
        stroke: var(--primary);
      }
    }

    .hour {
      font-size: 13px;
      padding: 3px 0;
    }

    .description {
      font-size: 13px;
      h3 {
        font-size: 22px;
      }
    }

    .today-info {
      display: flex;
      align-items: center;
      line-height: 14px;
      margin: 15px 0 8px;
      font-size: 14px;
      color: #0aaf04;
      font-weight: bold;

      .clock g {
        stroke: #0aaf04;
      }

      .clock {
        margin-right: 8px;
      }

      .arrow {
        margin-left: 8px;
      }

      &.collapsed {
        .arrow {
          transform: rotate(180deg);
        }
      }

      &.closed {
        color: var(--primary);
        font-weight: normal;

        .clock g {
          stroke: var(--primary);
        }
      }
    }

    .address {
      background-image: url('data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjEycHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDEyIDE2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPGcgaWQ9IlJlZGVzaWduIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgICAgIDxnIGlkPSJQcm9kdWN0LUNhdGFsb2ciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNTkuMDAwMDAwLCAtOTMxLjAwMDAwMCkiIHN0cm9rZT0iIzJGMzU0MCI+CiAgICAgICAgICAgIDxnIGlkPSJHcm91cC0xMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU5LjAwMDAwMCwgOTI4LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9InBpbi0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEuNSw2IEMxMS41LDEwLjUgNiwxNS41IDYsMTUuNSBDNiwxNS41IDAuNSwxMC41IDAuNSw2IEMwLjUsMi45NjI0MzM4OCAyLjk2MjQzMzg4LDAuNSA2LDAuNSBDOS4wMzc1NjYxMiwwLjUgMTEuNSwyLjk2MjQzMzg4IDExLjUsNiBaIiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGN4PSI2IiBjeT0iNiIgcj0iMi41Ij48L2NpcmNsZT4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
      font-size: 13px;
      padding-left: 20px;
      background-position: 0 center;
      background-repeat: no-repeat;
      margin: 15px 0 20px;
    }

    .social {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      margin-top: 16px;

      a {
        margin: 0 15px;
      }

      svg * {
        fill: var(--primary);
      }
    }
  }

  .swiper-prev-bt,
  .swiper-next-bt {
    position: absolute;
    top: 50%;
    z-index: 1;
    margin-top: -6px;
    cursor: pointer;
  }

  .swiper-prev-bt {
    left: 10px;
  }

  .swiper-next-bt {
    right: 10px;
  }

  .scrolling-wrapper {
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
  }

  .subscribe {
    box-shadow: 0 14px 10px 0 rgba(34, 44, 73, 0.04);
    border-radius: 13px;
    padding: 24px;
    background: white;
    margin-bottom: 16px;

    h4 {
      font-weight: bold;
      margin-bottom: 16px;
    }

    .actions {
      display: flex;

      input {
        margin-right: 16px;
      }

      button {
        font-weight: bold;
        background: var(--primary);
        border-color: var(--primary);
        border-radius: 8px;
        transition: 200ms;

        &:focus,
        &:hover,
        &:active {
          transition: 200ms;
          background: var(--primary);
          border-color: var(--primary);
          opacity: 0.8;
        }

        .spinner-border {
          margin-top: -8px;
        }
      }
    }
  }

  @media (max-width: 767px) {
    .subscribe .subscribe-content {
      margin: 24px 0;
      padding: 20px 16px;

      h4 {
        font-size: 18px;
      }
    }
  }

  @media (max-width: 480px) {
    .subscribe .subscribe-content {
      h4 {
        text-align: center;
      }
    }
  }

</style>
