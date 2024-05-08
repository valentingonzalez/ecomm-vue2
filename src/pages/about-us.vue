<template>
  <main>
    <div v-if="isBenjaminMoore" class="banner d-flex align-items-center justify-content-center mb-5">
      About Us
    </div>
    <div class="container" :class="{ 'pt-3': isBenjaminMoore }">
      <h1 v-if="!isBenjaminMoore && aboutUsTitle && aboutUsTitle.length > 0" class="results-page-title">{{ aboutUsTitle }}</h1>
      <div v-if="dynamicMap" class="mb-3">
        <BigMap :compact="true" :mapView="true" v-if="$store.state.storeLocations && $store.state.storeLocations.length" />
      </div>
      <div class="row">
        <div v-if="content" :class="!dynamicMap ? 'col-md-7 col-lg-8' : 'col-12'">
          <div class="card">
            <div class="card-body">
              <HtmlWrapper v-if="content.froala && content.froala_data" :value="JSON.parse(JSON.parse(content.froala_data))" />
              <div v-else v-html="content.description"></div>
            </div>
          </div>
        </div>
        <div class="col-md-5 col-lg-4" v-if="!dynamicMap">
          <div class="card" v-for="loc in locations" :key="loc.name">
            <div class="card-header">
              <div class="d-flex align-items-center justify-content-between">
                <h1 class="h5 mb-0 mr-2 font-weight-bold">{{ loc.name }}</h1>
                <button v-if="loc.id != selectedStore && !$store.state.settings.aboutUsLocations" class="btn btn-primary btn-sm text-nowrap" @click="saveStore(loc.id)">
                  Select Store
                </button>
                <button v-else-if="!$store.state.settings.aboutUsLocations && $store.state.storeLocations.length > 1" class="btn btn-primary btn-sm text-nowrap" disabled>
                  Selected
                </button>
              </div>
            </div>
            <div class="card-body">
              <div v-if="mapsLoading" class="maps-loader d-flex align-items-center justify-content-center" style="height: 240px;">
                <div class="spinner-border text-primary" role="status">
                </div>
              </div>
              <GmapMap v-if="!$store.state.settings.aboutUsLocations" :ref="`map-${loc.id}`" class="map mb-3 d-none" :class="{'d-block': !mapsLoading}" :options="mapOptions" :center="getCenter(loc)" style="height: 240px" :zoom="16"></GmapMap>
              <GmapMap v-else :ref="`map-${loc.name}`" class="map mb-3 d-none" :class="{'d-block': !mapsLoading}" :options="mapOptions" :center="getCenter(loc)" style="height: 240px" :zoom="16"></GmapMap>


              <a :href="`https://www.google.com/maps/search/?api=1&query=${loc.address} ${loc.state} ${loc.city} ${loc.zip}`" class="mb-2 address cursor-pointer text-dark d-flex align-items-center">
                <div class="icon mr-2 d-flex align-items-center">
                  <svg width="14" height="18" viewBox="0 0 17 23" xmlns="http://www.w3.org/2000/svg"><path d="M8.5 0C3.813 0 0 3.737 0 8.33c0 5.7 7.607 14.068 7.93 14.421a.776.776 0 001.14 0C9.392 22.398 17 14.03 17 8.33 17 3.737 13.187 0 8.5 0zm0 12.52c-2.358 0-4.277-1.88-4.277-4.19 0-2.311 1.919-4.191 4.277-4.191s4.276 1.88 4.276 4.19c0 2.312-1.918 4.192-4.276 4.192z" fill="#ED672F" fill-rule="nonzero"/></svg>
                </div>
                <div class="d-inline">
                  <span class="text" v-if="fullAddress(loc).address">{{ fullAddress(loc).address }}</span>
                  <span class="text" v-if="fullAddress(loc).city">{{ fullAddress(loc).city }}</span>
                  <span class="text" v-if="fullAddress(loc).state">{{ fullAddress(loc).state }}</span>
                  <span class="text" v-if="fullAddress(loc).zip">{{ fullAddress(loc).zip }}</span>
                </div>
              </a>
              <a :href="`tel:${loc.phone}`" class="mb-2 phone text-dark d-flex align-items-center">
                <div class="icon mr-2 d-flex align-items-center">
                  <svg width="17" height="16" viewBox="0 0 19 18" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18.574 14.237l-2.934-2.786c-.585-.553-1.553-.536-2.157.038l-1.479 1.404-.291-.154c-.934-.492-2.212-1.165-3.556-2.442C6.808 9.017 6.099 7.8 5.58 6.914c-.055-.094-.107-.184-.159-.27l.992-.94.488-.465c.606-.575.622-1.494.04-2.048L4.005.404C3.423-.149 2.455-.132 1.85.443l-.827.79.023.02a4.486 4.486 0 00-.985 2.3c-.387 3.05 1.08 5.837 5.064 9.62 5.506 5.227 9.943 4.832 10.135 4.813a5.174 5.174 0 001.222-.291 4.838 4.838 0 001.198-.645l.018.016.838-.78c.604-.575.622-1.494.04-2.049z"
                      fill="#ED672F" fill-rule="nonzero"/>
                  </svg>
                </div>
                {{ loc.phone }}
              </a>
              <a v-if="$store.state.settings.aboutUsEmails" :href="`mailto:${loc.email}`" class="mb-2 text-dark d-flex align-items-center">
                <div class="icon mr-2 d-flex align-items-center">
                  <svg width="18px" height="15px" viewBox="0 0 18 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <path d="M16.2,0 L1.8,0 C0.81,0 0.009,0.81 0.009,1.8 L0,12.6 C0,13.59 0.81,14.4 1.8,14.4 L16.2,14.4 C17.19,14.4 18,13.59 18,12.6 L18,1.8 C18,0.81 17.19,0 16.2,0 Z M16.2,3.6 L9,8.1 L1.8,3.6 L1.8,1.8 L9,6.3 L16.2,1.8 L16.2,3.6 Z" id="mail" fill="#DB4A24" fill-rule="nonzero"></path>
                    </g>
                  </svg>
                </div>
                {{ loc.email }}
              </a>
              <div class="store-hours mt-3">
                <div class="font-weight-bold text-uppercase small">Store Hours</div>
                <div class="d-flex justify-content-between">
                  <div v-for="(hours, day) in loc.hours" :key="day.dayOfWeek">
                    <div class="pb-2">
                      <div class="small font-weight-bold">{{ day | upperCase }}</div>
                      <div class="time" v-if="!hours || hours.closed">Closed</div>
                      <div class="time" v-else>
                        <div class="mb-n1">{{ hours.open }}</div>
                        <div>{{ hours.close }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button v-if="!hideContactUsOption" v-b-modal.contactUsModal class="btn btn-primary mt-3" @click="() => contactInfo.store_id = loc.id">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isBenjaminMoore" class="bottom-banner d-flex align-items-center justify-content-center mt-5 py-5">
      <div class="container">
        <img class="w-100" src="https://storage.googleapis.com/content.ezadtv.com/2023/08/07/64d1682d5b92a_Group_36055.png" alt="About Us">
      </div>
    </div>
    <b-modal id="contactUsModal" ref="contactUsModal" size="md" hide-footer centered>
      <template #modal-title>
        Contact Us
      </template>
      <form @submit.prevent="onSubmitContact">
        <div class="form-row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="mb-1" for="">Name</label>
              <input v-model="contactInfo.name" class="form-control" type="text" placeholder="Your Name" required :disabled="isSubmitting" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="mb-1" for="">Email</label>
              <input v-model="contactInfo.email" class="form-control" type="email" placeholder="Your Email" required :disabled="isSubmitting" />
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="mb-1" for="">Subject</label>
          <input v-model="contactInfo.subject" class="form-control" type="text" placeholder="Subject for the email" required :disabled="isSubmitting" />
        </div>
        <div class="form-group">
          <label class="mb-1" for="">Message</label>
          <textarea v-model="contactInfo.description" class="form-control" placeholder="Write a message..." rows="4" required :disabled="isSubmitting"></textarea>
        </div>
        <div class="d-flex align-items-center justify-content-between flex-column flex-sm-row">
          <div>
            <VueRecaptcha sitekey="6Le66-cUAAAAAGhK_FYzY6QPwIcNa5ejt_P6SEdQ" class="recaptcha" ref="recaptcha" @verify="onVerify" @expired="onExpired" :loadRecaptchaScript="true" />
            <div v-if="recaptchaAlert" class="text-danger small">Please, verify that you are human</div>
          </div>
          <button class="btn btn-primary mt-2 mt-sm-0" type="submit" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
            Send
          </button>
        </div>
      </form>
    </b-modal>

    <VFooter v-if="$store.state.settings.navigationLayout == 'secondary'"></VFooter>
  </main>
</template>

<script>
import BigMap from '@/components/big-map';
import HomePageApiService from '@/api-services/homepage.service';
import UserApiService from '@/api-services/user.service';
import CartApiService from '@/api-services/cart.service';
import AuthController from '@/controllers/auth.controller';
import VFooter from '@/custom-pages/gerretsen/components/Footer';
import VueRecaptcha from 'vue-recaptcha';
import ContactApiService from '@/api-services/contact.service';

export default {
  name: 'AboutUs',
  data() {
    return {
      mapOptions: { mapTypeControl: false, zoomControl: false, streetViewControl: false, fullscreenControl: false },
      info: {},
      content: null,
      mapsLoading: true,
      business: {
        about_us: {
          locations: []
        }
      },
      selectedStore: null,
      centerPoints: {},
      userInfo: AuthController.checkAuthStatus(),
      recaptchaToken: "",
      recaptchaAlert: false,
      recaptchaVerified: false,
      contactInfo: {
        store_id: null,
        recaptcha: null,
        name: '',
        email: '',
        subject: '',
        description: '',
      },
      isSubmitting: false
    };
  },
  components: {
    VFooter,
    BigMap,
    VueRecaptcha
  },
  computed: {
    isBenjaminMoore() {
      return this.$root.$children[0].isBenjaminMoore;
    },
    dynamicMap() {
      return this.locations.length > 2;
    },
    locations() {
      let index = 1;
      return this.business.about_us.locations.map(e => {
        if(e.id === undefined) {
          e.id = index++;
        }
        if(e.hours) {
          Object.entries(e.hours).map(h => {
            h[1].close = (h[1].close[0] === '0' ? h[1].close.substring(1) : h[1].close).replace(':00', '');
            h[1].open = (h[1].open[0] === '0' ? h[1].open.substring(1) : h[1].open).replace(':00', '');
            return h;
          });
        }
        return e;
      });
    },
    aboutUsTitle() {
      if ( this.$store.state.settings.aboutUsTitleHidden ) {
        return '';
      }
      if ( this.$store.state.settings.aboutUsTitle ) {
        return this.$store.state.settings.aboutUsTitle;
      }
      return 'Store Info';
    },
    settings() {
      return this.$store.state.settings;
    },
    hideContactUsOption() {
      return this.settings.aboutUs && this.settings.aboutUs.hideContactUsOption && this.settings.aboutUs.hideContactUsOption === true || false;
    },
  },
  async mounted() {
    this.$ezSetTitle('Store Info');
    let resp = await HomePageApiService.getBusinessDetails();
    let contents = await HomePageApiService.getAbout();
    this.selectedStore = localStorage.getItem('selectedStore') || null;
    this.business = resp.data.data;
    this.content = contents.data.data;

    if(!this.dynamicMap) {
      if (this.$store.state.settings.aboutUsLocations) {
        let response = await HomePageApiService.getBusinessAbout();
        this.business.about_us.locations = response.data.data.locations;

        setTimeout(() => {
          this.$gmapApiPromiseLazy().then(() => {
            setTimeout(() => {
              this.mapsLoading = false;
              this.business.about_us.locations.forEach(loc => {
                if ( loc.latitude && loc.longitude ) {
                  this.addMarkerLatLng(this.$refs[`map-${loc.name}`][0].$mapObject, loc.latitude, loc.longitude);
                } else {
                  this.addMarker(this.$refs[`map-${loc.name}`][0].$mapObject, `${loc.address},${loc.city},${loc.state}`, loc.name);
                }
              });
            }, 1000);
          });
        }, 500);
      } else {
        setTimeout(() => {
          this.$gmapApiPromiseLazy().then(() => {
            setTimeout(() => {
              this.mapsLoading = false;
              this.business.about_us.locations.forEach(loc => {
                if ( loc.latitude && loc.longitude ) {
                  this.addMarkerLatLng(this.$refs[`map-${loc.id}`][0].$mapObject, loc.latitude, loc.longitude);
                } else {
                  this.addMarker(this.$refs[`map-${loc.id}`][0].$mapObject, `${loc.address},${loc.city},${loc.state}`, loc.name);
                }
              });
            }, 1000);
          });
        }, 500);
      }
    }
  },
  methods: {
    async addMarkerLatLng(map, lat, lng) {
      map.setCenter({lat, lng});
      // this was commented because it would overwrite existing markers if the store is on google already
      /*
      new google.maps.Marker({
        position: {lat, lng},
        map,
        title: this.business.business_name,
      });
       */
    },
    async addMarker(map, address, name) {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({'address': address}, (results, status) => {
        if (status === 'OK') {
          var locId = results[0].place_id;
          this.centerPoints[locId] = results[0].geometry.location;
          map.setCenter(results[0].geometry.location);
        } else if (this.$store.state.settings.locationData[name]) {
          var data = this.$store.state.settings.locationData[name];
          var loc = {
            lat: Number(data.lat),
            lng: Number(data.lon)
          };
          this.centerPoints[name] = loc;
          map.setCenter(loc);
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      });
    },
    fullAddress(loc) {
      return {
        address: loc.address,
        city: loc.city,
        state: loc.state,
        zip: loc.zip
      };
    },
    dayName(day) {
      const map = {
        sun: 'Sunday',
        mon: 'Monday',
        tue: 'Tuesday',
        wed: 'Wednesday',
        thu: 'Thursday',
        fri: 'Friday',
        sat: 'Saturday',
      };
      return map[day];
    },
    dayHours(hours) {
      return !hours || hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`;
    },
    getCenter(store) {
      return this.centerPoints[store.id] || {lng: 0, lat: 0};
    },
    saveStore(id) {
      // just set the top one by default if they didn't click
      this.selectedStore = id;
      if (!this.selectedStore) {
        this.selectedStore = this.stores[0].id;
      }

      if(this.userInfo) {
        localStorage.setItem('selectedStore', this.selectedStore);
        this.$store.commit('setCurrentStore');
        this.$store.dispatch("fetchBusinessInfo");
        UserApiService.saveStore({store: this.selectedStore}).then(resp => {
          if (resp.status == 200) {
            CartApiService.emptyCart().then(() => {
              this.$store.dispatch("fetchCartItemsDetails");
            });
            this.$swal({
              toast: true,
              position: 'top',
              showConfirmButton: false,
              timer: 3000,
              type: 'success',
              title: 'Location changed'
            });
          }
        });
      } else {
        localStorage.setItem('selectedStore', JSON.stringify(this.selectedStore));
        this.$store.commit('setCurrentStore');
        CartApiService.emptyCart().then(() => {
          this.$store.dispatch("fetchCartItemsDetails");
        });
      }
    },
    onVerify: function(response) {
      this.recaptchaToken = response;
      this.contactInfo.recaptcha = this.recaptchaToken;
      this.recaptchaAlert = false;
    },
    onExpired: function() {
      this.recaptchaVerified = false;
    },
    onSubmitContact() {
      if (!this.recaptchaToken) {
        this.recaptchaAlert = true;
        return;
      } else {
        this.isSubmitting = true;
        ContactApiService.sendContactInfo(this.contactInfo).then(resp => {
          if(resp.data.status == 'success') {
            this.$swal("Received!", 'Will be contacting you shortly!', "success");
            this.submitted = true;
            this.$refs.contactUsModal.hide();
          } else {
            this.$swal('Missing Field', resp.data.errors.message, 'error');
          }
          this.isSubmitting = false;
        });
      }
    }
  }
};
</script>

<style lang="scss">
.recaptcha {
  iframe {
    @media (max-width: 424px) {
      transform: scale(0.80);
    }
  }
}
</style>

<style lang="scss" scoped>
:deep(.image img),
:deep(.card-body img) {
  max-width: 100%;
}

.card {
  margin-bottom: 30px;

  .card-header {
    font-size: 20px;
    font-weight: bold;
    background: #fff;
  }

  .card-body {
    font-size: 14px;
    line-height: 22px;
    p{
      color: #040404;
    }
  }

  @media (max-width: 767px) {
    margin-bottom: 16px;
  }
}

.icon {
  width: 20px;

  svg * {
    fill: var(--primary);
  }
}

.address {
  .text:not(:last-child) {
    margin-right: 2px;

    &::after {
      content: ', ';
    }
  }
}

.down-arrow {
  * {
    stroke: var(--primary);
  }
}
.store-hours {
  .time {
    letter-spacing: -.4px;
    font-size: 13px;
  }
}
.banner {
  background: url('https://storage.googleapis.com/content.ezadtv.com/2023/08/07/64d167e093555_Frame_36235_1_.png');
  background-size: cover;
  height: 320px;
  font-size: 100px;
  font-weight: bold;
  color: #fff;
}
.bottom-banner {
  background: #444;
}
</style>
