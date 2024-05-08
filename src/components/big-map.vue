<template>
  <div>
    <div v-if="mapInitialized && stores" id="dynamicMap" :class="{'list-view': listView, 'compact': compact}" class="position-relative">
      <div class="store-cards position-absolute" ref="storeCards">
        <div class="store-card m-0 card rounded-0 p-3 border-bottom-0 cursor-pointer" v-for="store in stores" :id="`storecard-${store.id}`" :key="`storecard-${store.id}`" @click="selectStore(store)" :class="{'selected' : selectedStore == store.id}">
          <div class="d-flex align-items-center justify-content-between">
            <h6 :title="store.name">{{ store.name }}</h6>
            <template v-if="store.distance">
              <a target="_blank" :href="myLocation && directionsUrl(store.coords) || '#'" class="d-flex justify-content-between align-items-center">
                <span class="distance d-flex align-items-center">
                  <svg class="mr-2 fill-primary" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M19.703 9.292l-9-9a.996.996 0 00-1.41 0l-9 9c-.39.39-.39 1.026 0 1.416l9 8.994v.006c.39.39 1.025.39 1.415 0l9-9a.997.997 0 00-.005-1.416zm-7.705 3.205v-2.5h-4v3h-2v-4c0-.554.445-1 1-1h5v-2.5l3.5 3.5-3.5 3.5z" fill="#000" fill-rule="nonzero"/></svg>
                  {{ store.distance }} mi 
                </span>
              </a>
            </template>
          </div>
          <address class="mb-1">
            <div>{{ store.address | street}}</div>
            <div>{{ store.city }}, {{ store.state }}</div>
            <div class="d-flex mt-1 align-items-center justify-content-between" v-if="store.phone || store.hours">
              <a class="d-inline-block" :href="`tel:${store.phone}`">{{store.phone}}</a>
              <div class="store-bt store-hours mt-1 ml-3" @click.stop="toggleSchedule(store)">
                <svg class="mr-1" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)" stroke="#ED672F" fill="none" fill-rule="evenodd"><path d="M7 0v2.545M14 7h-2.545M7 14v-2.545M0 7h2.545"/><circle stroke-linecap="square" cx="7" cy="7" r="7"/><path stroke-linecap="square" d="M4.455 3.182L7 7h2.545"/></g></svg>
                Store Hours
              </div>
            </div>
          </address>
          <ul class="store-schedule">
            <li v-for="(hour, key) in store.hours" :key="hour.day">
              <div class="day font-weight-bold text-uppercase">{{key}}</div>
              <div class="closed" v-if="hour.closed">Closed</div>
              <template v-else>
                <div class="hour" v-html="$options.filters.parseTime(hour.open)" />
                <div class="hour" v-html="$options.filters.parseTime(hour.close)" />
              </template>
            </li>
          </ul>
        </div>
      </div>
      <GmapMap :class="{'d-none' : hideMap}" tabindex="-1" v-if="stores && stores.length && mapInitialized" class="stores-map" id="map" ref="mapRef" :options="mapOptions" :center="getCenter(stores[0])">
        <GmapMarker v-for="store in stores" :key="`marker-${store.id}`" :position="store.coords" :icon="markerIcon" :clickable="true" @click="selectStore(store)" />
        <GmapInfoWindow :ref="infoWindow" :options="infoOptions" :position="infoWindowPos" @closeclick="infoWinOpen=false" :opened="infoWinOpen">
          <div class="storeName" v-if="selectedStore">
            {{ stores.find(e => e.id == selectedStore) ? stores.find(e => e.id == selectedStore).name : '' }}
          </div>
        </GmapInfoWindow>
      </GmapMap>
    </div>
    <div v-if="!hideSaveButton" class="d-flex align-items-center mt-3 justify-content-between">
      <div>
        <a class="d-md-none" @click.prevent="toggleMobileView" href="#">View {{listView && 'map' || 'list'}}</a>
      </div>
      <button type="button" class="btn btn-primary" @click="saveStore" :disabled="saving || !selectedStore">Select Location</button>
    </div>
  </div>
</template>


<script>
    import UserApiService from '@/api-services/user.service';
    import CartApiService from '@/api-services/cart.service';
    import AuthController from '@/controllers/auth.controller';

    const mapStyles = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "color": "#a8a8a4"
        },
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
    ];

    export default {
      name: 'BigMap',
      props: {
        compact: {
          default: false
        },
        hideSaveButton: {
          default: false
        },
        mapView: {
          default: false
        }
      },
      data() {
        return {
          saving: false,
          userInfo: AuthController.checkAuthStatus(),
          centerPoints: {},
          mapOptions: {
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
            disableDefaultUi: false,
            styles: mapStyles
          },
          infoWinOpen: false,
          infoOptions: {
            pixelOffset: {
              width: 0,
              height: -35
            }
          },
          infoWindowPos: {
            lat: 0,
            lng: 0
          },
          infoWindow: null,
          directionsService: null,
          directionsDisplay: null,
          myLocation: null,
          mapInitialized: false,
          bounds: null,
          hideMap: true,
          selectedStore: null,
          listView: !this.mapView,
          userCoords: null
        };
      },
      computed: {
        markerIcon() {
          let svg = window.btoa(`<svg width="57" height="67" xmlns="http://www.w3.org/2000/svg"><defs><filter x="-74.1%" y="-54.1%" width="248.1%" height="208.1%" filterUnits="objectBoundingBox"><feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="4" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" in="shadowBlurOuter1" result="shadowMatrixOuter1"/><feMerge><feMergeNode in="shadowMatrixOuter1"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#a)" transform="translate(15 15)" fill="none" fill-rule="evenodd"><circle fill="#FFF" cx="14.5" cy="14.5" r="8.5"/><path d="M13.5 0C6.055 0 0 6.012 0 13.4c0 9.17 12.082 22.63 12.595 23.2a1.223 1.223 0 001.809 0C14.918 36.03 27 22.57 27 13.4 27 6.012 20.944 0 13.5 0zm0 20.143c-3.746 0-6.793-3.025-6.793-6.743 0-3.718 3.047-6.741 6.792-6.741 3.747 0 6.792 3.023 6.792 6.74 0 3.719-3.047 6.742-6.792 6.742v.002z"
          fill="${this.$store.state.settings.colors.primary}" fill-rule="nonzero"/></g></svg>`);
          return `data:image/svg+xml;base64,${svg}`;
        },
        stores: {
          get() {
            return this.$store.state.storeLocations || [];
          },
          set(val) {
            return val;
          }
        },
        userReqCoords() {
          return (this.$store.state.businessDetails 
                  && this.$store.state.businessDetails.user_info 
                  && this.$store.state.businessDetails.user_info.lon 
                  && this.$store.state.businessDetails.user_info.lat 
                  ? this.$store.state.businessDetails.user_info : null);
        },
        settings() {
          return this.$store.state.settings;
        },
        autoSelectStore() {
          return this.settings.admin.autoSelectStore && this.settings.admin.autoSelectStore === true || false;
        },
      },
      filters: {
        street(address) {
          return address.split(',').splice(0, 1).join();
        },
        stateAndCountry(address) {
          return address.split(',').splice(1).join();
        },
        parseTime(time) {
          return time.replace(/^0+/, '').split(' ').map((e, i) => i == 1 ? `<b>${e}</b>` : e).join(' ');
        }
      },
      mounted() {
        this.selectedStore = localStorage.getItem('selectedStore');
        this.initialize();
      },
      methods: {
        async initialize() {
          this.$geolocation.watch = true;
          this.mapInitialized = true;
          setTimeout(() => {
            this.$gmapApiPromiseLazy().then(() => {
              this.bounds = new google.maps.LatLngBounds();
              this.stores.map(s => {
                s.coords = { lat: s.latitude, lng: s.longitude };
                this.bounds.extend(s.coords);
                return s;
              });
              if(this.$refs.mapRef) {
                this.$refs.mapRef.$mapObject.fitBounds(this.bounds);
                this.$refs.mapRef.$mapObject.setZoom(1);
              }
              setTimeout(() => {
                this.selectStore(this.stores.find(e => e.id == this.selectedStore) || this.stores[0]);
                this.hideMap = false;
              }, 50);
              if(this.$geolocation.coords) {
                this.userCoords = this.$geolocation.coords;
              } else if (this.userReqCoords) {
                this.userCoords = {
                  latitude: this.userReqCoords.lat,
                  longitude: this.userReqCoords.lon
                };
              }
              this.userCoords && this.tryGeolocation();
            });
          }, 300);
        },
        selectStore(store) {
          if(this.$refs.mapRef) {
            // if is not mobile, add an offset for longitude
            let offset = window.innerWidth > 767 ? .3 : 0;
            let map = this.$refs.mapRef.$mapObject;
            this.selectedStore = store.id;
            this.$emit('selectStore', store.id);
            this.infoWindowPos = store.coords;
            this.infoWinOpen = true;
            if(map.getZoom() < 10) map.setZoom(10);
            map.panTo({lng: store.coords.lng - offset, lat: store.coords.lat});
            this.$refs.storeCards.scrollTo({ top: document.getElementById(`storecard-${store.id}`).offsetTop, behavior: 'smooth' });
          }
        },
        directionsUrl(coords) {
          return `https://www.google.com/maps?saddr=${this.myLocation.lat()},${this.myLocation.lng()}&daddr=${coords.lat},${coords.lng}`;
        },
        tryGeolocation() {
          //let service = new google.maps.DistanceMatrixService();
          let destinations = this.stores.map(s => new google.maps.LatLng({ lat: s.latitude, lng: s.longitude }));
          this.myLocation = new google.maps.LatLng({ lat: this.userCoords.latitude, lng: this.userCoords.longitude });
          this.stores[0].name = `${this.stores[0].name} `;
          destinations.forEach((ll, i) => {
            try {
              this.stores[i].distance = Math.round(this.manhattanDist(this.myLocation, ll));
            } catch ( e ) {
              //
            }
          });
          if(this.autoSelectStore && !this.selectedStore) {
            let nearest = this.stores.reduce((prev, curr) => curr.distance < prev.distance ? curr : prev);
            if(nearest) {
              this.selectStore(nearest);
              this.saveStore(true);
            }
          }
          /*service.getDistanceMatrix({
            origins: [this.myLocation],
            destinations: destinations,
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.IMPERIAL
          }, (resp, status) => {
            if(status == 'OK') {
              this.stores[0].name = `${this.stores[0].name} `;
              resp.rows[0].elements.forEach((e, i) => this.stores[i].distance = e.distance.text);
            }
          });*/
        },
        manhattanDist(ll1, ll2) {
          // use 2 calls of great circle distance for north/south and east/west
          // create an intermediate LatLng with the latitude of the first one, and longitude
          // of the second one. this creates 2 lines.
          // manhattan makes a bit more sense as roads are usually laid out n/s/e/w
          const middle = new google.maps.LatLng({lat: ll1.lat(), lng: ll2.lng()});
          return this.greatCircleDistance(ll1, middle) + this.greatCircleDistance(middle, ll2);
        },
        greatCircleDistance(ll1, ll2) {
          const radius = 3959;
          const latFrom = ll1.lat() * Math.PI / 180;
          const lonFrom = ll1.lng() * Math.PI / 180;
          const latTo = ll2.lat() * Math.PI / 180;
          const lonTo = ll2.lng() * Math.PI / 180;

          const latDelta = latTo - latFrom;
          const lonDelta = lonTo - lonFrom;

          const angle = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(latDelta / 2), 2) +
            Math.cos(latFrom) * Math.cos(latTo) * Math.pow(Math.sin(lonDelta / 2), 2)));
          return angle * radius;
        },
        getCenter(store) {
          return this.centerPoints[store.id] || {lng:0,lat:0};
        },
        toggleSchedule(store) {
          [...document.getElementsByClassName(`store-card`)].forEach(e => e.getAttribute('id') != `storecard-${store.id}` && e.classList.remove('with-schedule'));
          document.getElementById(`storecard-${store.id}`).classList.toggle('with-schedule');
        },
        async saveStore(skipReload = false) {
          this.saving = true;
          if(this.userInfo) {
            this.$store.dispatch('fetchBusinessInfo');
            await UserApiService.saveStore({store: this.selectedStore});
          }
          this.$emit('onSave'); // {id: this.selectedStore, name: this.storeNames[this.selectedStore]}
          let prevSelected = localStorage.getItem('selectedStore');
          localStorage.setItem('selectedStore', this.selectedStore);
          localStorage.removeItem('showLocationPopup');
          this.$store.commit('setCurrentStore');
          if(!this.userInfo.is_admin && this.selectedStore != prevSelected) {
            await CartApiService.emptyCart().catch(() => {});
            this.$store.dispatch('fetchCartItemsDetails');
            if(!skipReload) {
              window.location.reload();
            }
          } else if (this.userInfo.is_admin) {
            window.location.reload();
          }
          this.saving = false;
        },
        toggleMobileView() {
          this.listView = !this.listView;
          this.$emit('onChangeView', this.listView);
        },
      }
    };
</script>

<style scoped lang="scss">
#dynamicMap {
    height: 600px;
    max-height: calc((var(--vh, 1vh) * 100) - 250px);
    min-height: 340px;
    width: 100%;
    .stores-list {
      z-index: 4;
    }
    .stores-map {
      height: 100%;
    }
    .store-cards {
      background: #fff;
      margin: 0 20px;
      top: 50%;
      transform: translateY(-50%);
      width: 400px;
      box-shadow: 5px 3px 15px rgba(0,0,0,.3);
      z-index: 10;
      max-height: calc(100% - 100px);
      overflow: auto;
      border-bottom: 4px solid var(--secondary);
      .store-card {
        position: relative;
        border-right: none !important;
        border-left: none !important;
        &.selected {
          box-shadow: inset 0 0 0 2px var(--primary);
          z-index: 1;
          + .store {
            border-top: 0;
          }
        }
        address {
          color: #4a4a4a;
          font-size: 13px;
        }
        .store-schedule {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 13px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 0;
          overflow: hidden;
          transition: height .3s;
          li {
            .closed {
              height: 38px;
              display: flex;
              align-items: center;
              font-size: 80%;
              text-transform: uppercase;
              font-weight: bold;
            }
            .hour {
              letter-spacing: -.5px;
              :deep(b) {
                font-size: 80%;
              }
            }
          }
        }
        &.with-schedule {
          .store-schedule {
            height: 70px;
          }
        }
      }
    }
    &.compact {
      max-height: 250px;
      .store-cards {
        height: 100%;
        top: 0;
        max-height: 100%;
        transform: none;
        margin: 0;
      }
    }
    :deep(.vue-map) {
      .gm-style {
        .gm-style-iw {
          border-radius: 2px;
          padding: 10px 15px !important;
          font-size: 18px !important;
          background: none;
          box-shadow: none;
          button {
            display: none !important;
          }
          .storeName {
            font-weight: bold;
            color: var(--primary);
            text-shadow:
            -1px -1px 0 #fff,
              1px -1px 0 #fff,
              -1px 1px 0 #fff,
              1px 1px 0 #fff;
          }
          .gm-style-iw-d {
            overflow: hidden !important;
          }
        }
        .gm-style-iw-t::after {
          display: none;
        }
      }
    }
  }

  @media (max-width: 767px) {
    #dynamicMap {
      .store-cards {
        margin: 0;
        width: 100%;
        transform: none;
        top: 0;
        height: 100%;
        max-height: 100%;
        .store-card:last-child {
          border-bottom: 1px solid #ccc !important;
        }
      }
      &:not(.list-view) {
        .store-cards {
          display: none;
        }
      }
      &.list-view {
        .stores-map {
          display: none;
        }
      }
    }
  }
  @media (max-width: 576px) {
    #dynamicMap {
        height: calc(100vh - 141px);
        max-height: calc(100vh - 260px);
      }
  }
</style>
