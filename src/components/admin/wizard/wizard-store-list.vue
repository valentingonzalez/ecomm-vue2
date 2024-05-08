<template>
  <div v-if="search || stores.length > 1">
    <div class="d-flex justify-content-center mt-n1 apply-to-all" :class="!applyToAll && 'border-bottom pb-3 mb-4'" v-if="enableApplyToAll">
      <div class="custom-control custom-switch">
        <input type="checkbox" v-model="applyToAll" class="custom-control-input" id="applyToAll" @change="handleApplytoAll($event)">
        <label class="custom-control-label text-capitalize font-weight-normal text text-medium" for="applyToAll">
          Apply Same Settings to All <span class="font-weight-bold text-primary ml-1">{{ stores.length }} Stores</span></label>
      </div>
    </div>
    <transition name="fadeHeight">
      <div v-if="!applyToAll">
        <div class="overflow-hidden">
          <input type="text" class="search form-control w-100 mw-100 mb-3" placeholder="Search Store" v-model="search" />
          <div class="d-flex align-items-start stores-wrapper">
            <div class="text-muted mt-1">Stores:</div>
            <div ref="storesWrapper" class="stores d-flex align-items-start flex-grow-1 overflow-hidden" :class="{ 'viewMore' : viewMore }">
              <div ref="stores" class="d-inline-flex align-items-center flex-wrap flex-grow-1">
                <template v-for="(store, i) in stores">
                  <div v-if="!store.hidden" :key="`store-${store.id}${i}`" class="text-nowrap store px-3 py-1 mb-2 ml-3" :class="{ 'selected' : selected(store.id) }" @click="onSelect(store.id)">
                    <svg class="mr-1" v-if="selected(store.id)" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 6.5L5 10.5L11 1.5" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    {{ store.name }}
                    <span class="percentage" v-if="showPercentage">
                      {{ store.completion }}%
                    </span>
                  </div>
                </template>
              </div>
              <div class="viewmore-btn px-3 mb-2 py-1 align-self-end cursor-pointer" @click="viewMore = !viewMore" v-if="hiddenStores > 0">
                {{ !viewMore ? `more` : 'less' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'WizardStoreList',
    props: {
      selectedStore: {
        default: null
      },
      multiple: {
        default: false
      },
      showPercentage: {
        default: false
      },
      disableSelection: {
        default: false
      },
      enableApplyToAll: {
        default: false
      },
      filter: {
        default: null
      },
      childOf: {
        default: null
      }
    },
    data() {
      return {
        viewMore: false,
        hiddenStores: 0,
        search: '',
        applyToAll: this.enableApplyToAll || (window.localStorage.wizardApplyToAll != undefined && window.localStorage.wizardApplyToAll == 'true' ? true : false)
      };
    },
    computed: {
      stores() {
        let ret = this.$store.state.adminWizardBusinesses.filter(e => e.name.toLowerCase().includes(this.search.toLowerCase()) || this.selected(e.id));
        ret = !this.filter || !this.filter.length ? ret : ret.filter(e => this.filter.includes(e.id));
        return ret;
      }
    },
    mounted() {
      this.filterStores();
    },
    methods: {
      selected(id) {
        this.$store.commit('setAdminWizardSelectedStore', this.selectedStore);
        return this.multiple ? Array.isArray(this.selectedStore) && (this.selectedStore.includes(String(id)) || this.selectedStore.includes(Number(id))) : id == this.selectedStore;
      },
      onSelect(id) {
        if(!this.disableSelection){
          if(this.multiple) {
            let selectedStore = [...this.selectedStore];
            selectedStore = selectedStore ? selectedStore : [];
            if(!selectedStore.includes(String(id)))
              selectedStore.push(String(id));
            else
              selectedStore = selectedStore.length > 1 ? selectedStore.filter(e => e != id) : selectedStore;
            this.$emit('onSelect', selectedStore);
          }
          else {
            this.$emit('onSelect', id);
          }
        }
        this.filterStores();
      },
      filterStores() {
        setTimeout(() => {
          this.hiddenStores = 0;
          [...document.querySelectorAll('.store')].forEach(e => {
            const containerRect = this.$refs.storesWrapper ? this.$refs.storesWrapper.getBoundingClientRect() : null;
            let currentStoreRect = e.getBoundingClientRect().top;
            if(containerRect && (currentStoreRect - containerRect.top) < 110) {
              return;
            }
            this.hiddenStores++;
          });
        }, 0);
      },
      handleApplytoAll(e) {
        this.$emit('onApplyToAll', this.applyToAll, this.childOf);
      }
    },
    watch: {
      applyToAll(val) {
        window.localStorage.wizardApplyToAll = val;
        this.$emit('onApplyToAll', val);
        this.filterStores();
      },
      filter() {
        this.filterStores();
      }
    }
  };
</script>

<style scoped lang="scss">
  .stores-wrapper {
    min-height: 37px;
    .stores {
      max-height: 105px;
      transition: all .5s;
      &.viewMore {
        max-height: 300px;
      }
      .store {
        background: #F1F5F9;
        border-radius: 12px;
        cursor: pointer;
        &.selected {
          background: #FEE2E2;
          color: #B91C1C;
          cursor: default;
        }
        .percentage {
          background: #fff;
          padding: 3px 6px;
          color: #059669;
          border-radius: 10px;
          font-size: 13px;
          font-weight: bold;
        }
      }
      .viewmore-btn {
        cursor: pointer;
        border-radius: 12px;
        background: #FEE2E2;
        color: #B91C1C;
      }
    }
  }
  .search {
    height: 38px;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }

  .apply-to-all {
    transition: all .2s;
  }
  .fadeHeight-enter-active,
  .fadeHeight-leave-active {
    transition: all .2s;
    max-height: 500px;
  }
  .fadeHeight-enter,
  .fadeHeight-leave-to {
    max-height: 0px;
    opacity: 0;
  }
</style>
