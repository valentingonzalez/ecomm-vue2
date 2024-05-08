<template>
  <b-modal :size="dynamicMap ? 'xxl' : 'lg'" class="modal-box" ref="storeSelectionModal"
    :class="{'dynamic' : dynamicMap}"
    :no-close-on-backdrop="!store"
    :no-close-on-esc="!store"
    :lazy="false"
    :static="true"
    :visible="false"
  >
    <!-- i had to set visible=false because EVERY SINGLE TIME YOU REFRESHED IN ADMIN it would display -->
    <template #modal-header>
      <div class="d-flex align-items-center justify-content-between w-100">
        <h5 class="modal-title">Choose a store to see what’s in stock</h5>
        <div>
          <button type="button" class="btn btn-primary" @click="saveDynamicStore">Select Store</button>
        </div>
      </div>
    </template>
    <BigMap ref="dynamicMap" @onChangeView="e => listView = e" @onSave="hideModal" @selectStore="selectStore" :hideSaveButton="true" v-if="dynamicMap" />
    <div class="store-select-modal" v-else>
      <div v-for="s in stores" :key="s.id" class="store-block d-flex w-100 align-items-center" :class="{'active': selectedStore == s.id}" @click="selectedStore = s.id">
        <div class="checkmark d-none d-sm-block"></div>
        <div class="info">
          <span class="store-name">{{ s.name }}</span>
          <div class="store-content">
            <div class="store-address mb-2">
              {{ fullAddress(s) }}
            </div>
            <a :href="`tel:+1${s.phone}`" class="store-bt store-contact">
              <svg width="16" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M12 9l-2 2-6-6 2-2-3-3-2 2c0 6.627 5.373 12 12 12l2-2-3-3z" stroke="#ED6730" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{ s.phone }}
            </a>
            <div class="store-bt store-hours mt-1 ml-3">
              <svg class="mr-1" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)" stroke="#ED672F" fill="none" fill-rule="evenodd"><path d="M7 0v2.545M14 7h-2.545M7 14v-2.545M0 7h2.545"/><circle stroke-linecap="square" cx="7" cy="7" r="7"/><path stroke-linecap="square" d="M4.455 3.182L7 7h2.545"/></g></svg>
              Store Hours
              <div class="hours-tooltip">
                <ul>
                  <li v-for="hour in parseHours(s.hours)" :key="hour.day">
                    <div class="day">{{hour.day}}</div>
                    <div class="hours" v-if="hour.closed">Closed</div>
                    <div class="hours" v-else v-html="`${hour.open} - ${hour.close}`"></div>
                  </li>
                  </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="map-container">
          <GmapMap :ref="`map_${s.id}`" :options="{mapTypeControl: false}" :center="getCenter(s)" :zoom="16" v-show="modalVisible" class="flex-grow-1" />
        </div>
      </div>
    </div>
    <div slot="modal-footer" class="d-flex justify-content-between align-items-center w-100">
      <div>
        <a class="d-md-none" @click.prevent="toggleMobileView" href="#">View {{listView && 'map' || 'list'}}</a>
      </div>
      <button type="button" class="btn btn-primary" @click="saveDynamicStore">Select Store</button>
    </div>
  </b-modal>
</template>

<script>
    import UserApiService from '@/api-services/user.service';
    import CartApiService from '@/api-services/cart.service';
    import AuthController from '@/controllers/auth.controller';
    import BigMap from '@/components/big-map';

    export default {
      name: 'StoreLocation',
      components: {
        BigMap
      },
      data() {
        return {
          listView: true,
          selectedStore: null,
          store: localStorage.getItem('selectedStore'),
          userInfo: AuthController.checkAuthStatus(),
          modalVisible: false,
        };
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
      created() {
      },
      computed: {
        stores: {
          get() {
            return this.$store.state.storeLocations || [];
          },
          set(val) {
            return val;
          }
        },
        storeNames(){
          let names = {};
          this.stores.forEach((s, index) => {
            names[s.id] = s.name;
            if(!s.id) {
              s.id = index;
            }
          });
          return names;
        },
        centerPoints(){
          let centerPoints = {};
          this.stores.forEach((s, index) => {
            centerPoints[s.id] = {lat: 0, lng: 0};
            if(!s.id) {
              s.id = index;
            }
          });
          return centerPoints;
        },
        dynamicMap() {
          return this.stores.length > 1;
        },
        maps() {
          let maps = [];
          if(this.stores) {
            this.stores.forEach(store => {
              if(this.$refs[`map_${store.id}`]) {
                maps.push({
                  storeId: store.id,
                  map: this.$refs[`map_${store.id}`][0],
                  address: `${store.address}, ${store.city}, ${store.state}, ${store.zip}`
                });
              }
            });
            return maps;
          }
          return null;
        },
        cartItemCount() {
          return this.$store.state.cartItemCount || 0;
        }
      },
      async mounted() {
        this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
          if(bvEvent.type == 'hide' && modalId == '__BVID__37')
            this.selectedStore = localStorage.getItem('selectedStore');
        });        
        // do not do this in mounted(), only do it in showModal. google maps is expensive as fuck
        // if we make it constantly load even when nobody's looking at it. i don't care if the
        // modal takes 1-2 seconds to show the map, it saves a lot of money.
        //this.initializeMaps();

        // REMOVE LATER
        // on 2/16 this still wasn't removed, so i just commented it?
        // commenting this fixes the issue of maps still loading even before the modal opens.
        //this.showModal();
      },
      methods: {
        toggleMobileView() {
          this.$refs.dynamicMap.toggleMobileView();
        },
        showModal() {
          this.hideMap = true;
          this.store = localStorage.getItem('selectedStore');
          this.selectedStore = this.store;
          this.$refs.storeSelectionModal.show();
          if(!this.dynamicMap) {
            this.initializeMaps();
          } else if(this.$refs.dynamicMap) {
            this.$refs.dynamicMap.initialize();
          }
        },
        initializeMaps() {
          setTimeout(() => {
            this.$gmapApiPromiseLazy().then(() => {
              this.modalVisible = true; // do this after modal appears so map has dimensions
              setTimeout(() => {
                this.maps.forEach(map => {
                  this.addMarker(map.map.$mapObject, map.address, map.storeId);
                });
              }, 1000);
            });
          }, 400);
        },
        fullAddress(s) {
          return `${s.address}, ${s.city}, ${s.state}, ${s.zip}`;
        },
        async addMarker(map, address, storeId) {
          let geocoder = new google.maps.Geocoder();
          geocoder.geocode({'address': address}, (results, status) => {
            if (status === 'OK') {
              this.centerPoints[storeId] = results[0].geometry.location;
              map.setCenter(results[0].geometry.location);
            }
          });
        },
        getCenter(store) {
          return this.centerPoints[store.id] || {lng:0,lat:0};
        },
        hideModal() {
          this.selectedStore = localStorage.getItem('selectedStore');
          this.$refs.storeSelectionModal.hide();
        },
        saveDynamicStore() {
          if(this.cartItemCount > 0 && this.selectedStore != localStorage.getItem('selectedStore')){
            this.$swal({
              title: "Switch Store?",
              text: `Are you sure you want to switch location to ${this.storeNames[this.selectedStore]}? If you switch locations, you will lose your existing cart.`,
              type: 'warning',
              confirmButtonText: 'Yes',
              cancelButtonText: 'Cancel',
              showCancelButton: true,
            })
            .then((result) => {
              if (result.value) {
                this.saveDynamicStoreCB();
              }
            });
          } else{
            this.saveDynamicStoreCB();
          }         
        },
        saveDynamicStoreCB() {
          let query = Object.assign({}, this.$route.query);
            if (query.store) {
              delete query.store;
              this.$router.replace({ query });
            }
            if (query.storeid) {
              delete query.storeid;
              this.$router.replace({ query });
            }
            if (this.dynamicMap)
              this.$refs.dynamicMap.saveStore();
            else
              this.saveStore();
        },
        saveStore() {
          let prevSelected = localStorage.getItem('selectedStore');
          if(this.userInfo) {
            localStorage.setItem('selectedStore', this.selectedStore);
            localStorage.removeItem('showLocationPopup');
            this.$store.dispatch("fetchBusinessInfo");
            UserApiService.saveStore({store: this.selectedStore}).then(() => {
              if (this.selectedStore != prevSelected) {
                this.emptyCartAndReload();
              }
            });
            this.$emit('changed', {id: this.selectedStore, name: this.storeNames[this.selectedStore]});
          } else {
            localStorage.setItem('selectedStore', this.selectedStore);
            this.$emit('changed', {id: this.selectedStore, name: this.storeNames[this.selectedStore]});
          }
          localStorage.removeItem('showLocationPopup');
          this.$store.commit('setCurrentStore');
          this.hideModal();
          // if userinfo exists we're already doing this
          if (!this.userInfo && this.selectedStore != prevSelected) {
            this.emptyCartAndReload();
          }
        },
        async emptyCartAndReload() {
          await CartApiService.emptyCart().then(() => {
            this.$store.dispatch('fetchCartItemsDetails');
          }).catch(err => {
            console.log(err);
          }).finally(() => window.location.reload());
        },
        parseHours(obj) {
          console.log(obj);
          let arr = [];
          let days = {mon:'Monday',tue:'Tuesday',wed:'Wednesday',thu:'Thursday',fri:'Friday',sat:'Saturday',sun:'Sunday'};
          let temp = ['<span style="font-size: 10px; font-weight: 500">', '</span>'];
          if(obj) {
            Object.keys(obj).forEach(e => {
              if(obj[e].closed) {
                arr.push({ day: days[e], closed: true });
              } else {
                let open = obj[e].open.replace(/AM|PM/gi, m => temp[0] + m + temp[1]);
                let close = obj[e].close.replace(/AM|PM/gi, m => temp[0] + m + temp[1]);
                arr.push({ day: days[e], open: open, close: close });
              };
            });
          }
          return arr;
        },
        selectStore(store) {
          this.selectedStore = store;
        }
      }
  };
</script>

<style scoped lang="scss">
  #dynamicMap {
    height: 600px;
    max-height: calc((var(--vh, 1vh) * 100) - 250px);
    min-height: 340px;
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
  .store-select-modal .store-block {
    width: 100%;
    margin-bottom: 20px;
    padding-left: 30px;
    border-radius: 5px;
    border: 1px solid #e2e2e7;
    background: #fafafa;
    position: relative;
    cursor: pointer;
    .checkmark {
      border: 1px solid #e2e2e7;
      border-radius: 18px;
      width: 18px;
      height: 18px;
      background: #fff;
      position: relative;
      margin-right: 30px;
    }
    .info {
      flex: 1;
    }
    .map-container {
      display: flex;
      height: 133px;
      width: 250px;
      overflow: hidden;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
  .store-select-modal .store-block.active {
    border-color: var(--primary);
    box-shadow: 0 0 0 1px var(--primary), 0 20px 39px rgba(47, 53, 64, .1);
    background: #fff;
    cursor: auto;
    .checkmark {
      border: 2px solid var(--primary);
      &::after {
        content: '';
        left: 2px;
        top: 2px;
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background: var(--primary);
      }
    }
  }
  .store-select-modal .store-block:last-child{
    margin-bottom: 0;
  }
  .store-select-modal .store-name {
    font-size: 18px;
    font-weight: bold;
  }
  .store-select-modal .store-content {
    font-size: 12px;
  }
  .store-select-modal .store-content .store-address {
    flex:1;
    padding-right: 50px;
  }
  .store-bt {
    background-repeat: no-repeat;
    background-position: 0 center;
    display: inline-block;
    color: #176db7;
    font-size: 11px;
    font-weight: 500;
    svg * {
      stroke: #176db7;
    }
    &.store-hours {
      cursor: pointer;
      &:hover {
        .hours-tooltip {
          display: block;
        }
      }
    }
  }
  .hours-tooltip {
    color: var(--text);
    display: none;
    font-size: 11px;
    line-height: 13px;
    background: #fff;
    border: 1px solid #e2e2e7;
    padding: 10px;
    border-radius: 2px;
    position: absolute;
    top: 50%;
    margin-top: -38px;
    left: 50%;
    margin-left: -90px;
    z-index: 1;
    &::after, &::before {
      right: 100%;
      top: 50%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }
    &::after {
      border-color: rgba(255, 255, 255, 0);
      border-right-color: #ffffff;
      border-width: 4px;
      margin-top: -54px;
    }
    &::before {
      border-color: rgba(226, 226, 231, 0);
      border-right-color: #E2E2E7;
      border-width: 5px;
      margin-top: -55px;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        margin-bottom: 3px;
      }
    }
    .day {
      font-weight: 600;
    }
  }
  @media (max-width: 991px) {
    .store-select-modal .store-block {
      .map-container {
        width: 0;
        height: 0;
      }
    }
  }
  @media (max-width: 992px) {
    .store-select-modal .store-block {
      padding-top: 20px;
      padding-bottom: 20px;
    }
  }
  @media (max-width: 767px) {
    :deep(.modal-body), 
    :deep(.modal-header) {
      padding: 1rem !important;
    }

    .store-select-modal {
      max-height: calc(100vh - 194px);
      overflow: auto;
      padding: 2px;
      margin: -2px;
      .store-block {
        padding: 12px;
        margin-bottom: 10px;
        .store-name {
          font-size: 15px;
          line-height: 18px;
        }
      }
    }
  }

  @media (max-width: 576px) {
    .dynamic {
      :deep(.modal-content) {
        height: calc(var(--vh, 1vh) * 100 - 88px);
        .modal-body {
          padding: 0 !important;
        }
      }
    }
  }
</style>
