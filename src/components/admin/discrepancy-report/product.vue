<template>
  <div v-if="product && product.actionMsg && product.actionMsg != ''" class="d-flex align-items-center justify-content-center w-100">
   <p class="p-4 m-3 text-center bg-actionMsg" v-html="product.actionMsg"></p> 
  </div>
  <div class="product overflow-hidden" v-else-if="product" :class="{ 'disabled': loading, 'compact': compactView }">
    <div v-if="selectable" class="custom-control">
      <input type="checkbox" class="custom-control-input" :id="`selected-${product.sku}`" v-model="selected" @change="onSelect">
      <label class="custom-control-label" :for="`selected-${product.sku}`"></label>
    </div>
    
    <div class="px-4 align-items-sm-center" :class="{ 'py-4': !compactView }">
      <div class="d-flex flex-column flex-md-row align-items-md-center" :class="{ 'py-1': compactView }">
        <div class="main-img mr-4">
          <img :src="product.image_url" :alt="product.title" />
        </div>
        <div class="product-info mb-2 pb-2 pb-sm-0 mb-sm-0">
          <div class="font-weight-bold">
            <span class="text-muted">SKU</span> #{{ product.sku }}
          </div>
          <div class="font-weight-bold">
            <span class="text-muted">UPC</span> #{{ product.upc }}
          </div>
          <div class="title lead mb-2">
            <router-link class="text-info" :to="{ name: 'products-id', params: { id: product.sku, title: product.title.replace(/[ /]/g, '+') }}" target="_blank">
              <b>{{ product.title }}</b>
            </router-link>
          </div>
          <div class="font-weight-bold" v-if="stores.length > 1">
            <span class="text-muted">Available in:</span> {{ product.discrepancy_details.length }} store{{ product.discrepancy_details.length != 1 ? 's' : '' }}
          </div>
        </div>
      </div>

      <div v-for="prod in product.discrepancy_details" :key="prod.sku" class="border-top setting row align-items-center" :class="{ 'py-2 mt-4 pb-0 pt-4': !compactView, 'py-1': compactView}">
        <div :class="fromWizard ? 'col-md-5' : 'col-md-6'">
          <h4 class="font-weight-bold">{{ locations.find(e => e.value == prod.store_id).label }}</h4>
          <div class="info-text">
            <div class="mb-1" v-if="prod.num_inventory">
              <b>{{ prod.num_inventory }} in stock</b>
            </div>
            <div class="mb-1 font-weight-bold" v-if="prod.map_price">
              <span class="text-muted">IMAP price: </span>${{ prod.map_price }}
            </div>
            <div class="font-weight-bold" v-if="prod.last_synced">
              <span class="text-muted">Last sync: </span>{{ formatDate(prod.last_synced) }}
            </div>
          </div>
        </div>
        <div :class="fromWizard ? 'col-md-7' : 'col-md-6'">
          <div class="website-price text-center rounded overflow-hidden" :class="{ 'mb-2 p-2': !compactView }">
            <div v-if="prod.last_selection">
              Website Price: ${{prod[prod.last_selection]}} <template v-if="prod.promo_price">| <strong>Sale: <b>${{ prod.promo_price }}</b></strong></template>
              <div v-if="prod.map_price && prod[prod.last_selection] ? Number(prod.map_price) > Number(prod[prod.last_selection]) : false" class="text-danger small imap-voil-text">
                Below IMAP price!
              </div>
            </div>
            <div v-else>
              Website Price: ${{ prod.website_price }} <template v-if="prod.promo_price">| <strong>Sale: <b>${{ prod.promo_price }}</b></strong></template>
              <div v-if="prod.map_price ? Number(prod.map_price) > Number(prod.website_price) : false" class="text-danger small imap-voil-text">
                Below IMAP price!
              </div>
            </div>            
          </div>
          <div class="row small-gutters">
            <div class="price-selector" :class="prod.map_price ? 'col-md-4' : 'col-md-6'">
              <input v-model="prod.last_selection" type="radio" :id="`${prod.id}-pos_price`" :name="`${prod.id}-price_selector`" value="pos_price" @click="selectedId = prod.id" @change="onChange" />
              <label :for="`${prod.id}-pos_price`" class="mb-0 h-100" :class="{'py-1 z-out-1' : compactView }">
                <div class="d-flex align-items-center flex-xl-column align-items-xl-start">
                  <div class="d-flex flex-xl-column align-items-xl-start">
                    <div class="text-muted">{{ compactView ? 'POS' : 'POS Price' }}</div>
                    <div class="lead mr-2 mr-xl-0"><b>${{ prod.pos_price }}</b></div>
                  </div>
                  <div v-if="prod.map_price ? Number(prod.map_price) > Number(prod.pos_price) : false" class="text-danger small imap-voil-text">
                    Below IMAP price!
                  </div>
                </div>
              </label>
            </div>
            <div class="price-selector" :class="prod.map_price ? 'col-md-4' : 'col-md-6'">
              <input v-model="prod.last_selection" type="radio" :id="`${prod.id}-tv_price`" :name="`${prod.id}-price_selector`" value="wholesaler_price" @click="selectedId = prod.id" @change="onChange" />
              <label :for="`${prod.id}-tv_price`" class="mb-0 h-100" :class="{'py-1 z-out-1' : compactView }">
                <div class="d-flex align-items-center flex-xl-column align-items-xl-start">
                  <div class="d-flex flex-xl-column align-items-xl-start">
                    <div class="text-muted">{{ compactView ? wholesellerName : wholesellerName+' Price' }}</div>
                    <div class="lead mr-2 mr-xl-0"><b>${{ prod.wholesaler_price }}</b></div>
                    <div class="text-muted" v-if="companyTrueValue">(Level-1)</div>
                  </div>
                  <div v-if="prod.map_price ? Number(prod.map_price) > Number(prod.wholesaler_price) : false" class="text-danger small">
                    Below IMAP price!
                  </div>
                </div>
              </label>
            </div>
            <div class="price-selector col-md-4" v-if="prod.map_price">
              <input v-model="prod.last_selection" type="radio" :id="`${prod.id}-map_price`" :name="`${prod.id}-price_selector`" value="map_price" @click="selectedId = prod.id" @change="onChange" />
              <label :for="`${prod.id}-map_price`" class="mb-0 h-100" :class="{'py-1 z-out-1' : compactView }">
                <div class="d-flex align-items-center flex-xl-column align-items-xl-start">
                  <div class="d-flex flex-xl-column align-items-xl-start">
                    <div class="text-muted">{{ compactView ? 'IMAP' : 'IMAP Price' }}</div>
                    <div class="lead mr-2 mr-xl-0"><b>${{ prod.map_price }}</b></div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import moment from 'moment-timezone';

export default {
  name: 'DiscrepancyProduct',
  props: {
    product: {
      default: null
    },
    loading: {
      default: null
    },
    selectable: {
      default: false
    },
    compactView: {
      default: false
    },
    fromWizard: {
      default: false
    }
  },
  data() {
    return {
      value: null,
      selected: false,
      selectedId: null
    };
  },
  computed: {
    locations() {
      if(this.$store.state.businessDetails && this.$store.state.businessDetails.about_us && this.$store.state.businessDetails.about_us.locations && this.$store.state.businessDetails.about_us.locations.length)
        return this.$store.state.businessDetails.about_us.locations.map(e => ({ label: e.name, value: e.business_id })) || [];
      return [];
    },
    businessDetails() {
      return this.$store.state.businessDetails;
    },
    stores() {
      return this.$store.state.storeLocations || [];
    },
    company() {
      return this.businessDetails && this.businessDetails.original_company ? this.businessDetails.original_company.toLowerCase().trim() : null;
    },
    companyTrueValue() {
      return this.company && this.company.includes('truevalue');
    },
    wholesellerName() {
      if(!this.company) return null;
      return this.company.includes('truevalue') ? 'True Value' : this.company.includes('doitbest') ? 'Do It Best' : this.company.includes('orgill') ? 'Orgill' : "";
    }
  },
  mounted() {
  },
  methods: {
    onSelect() {
      this.$emit('onSelect', { sku: this.product.sku, selected: this.selected, settings: this.product.discrepancy_details.map(e => ({ discrepancyId: e.id, selection: e.last_selection })) });
    },
    formatDate(date) {
      return moment(date).format('MMM DD, YYYY');
    },
    onChange() {
      this.$emit('onChange', { sku: this.product.sku, id: this.selectedId, selection: this.product.discrepancy_details.find(e => e.id == this.selectedId).last_selection });
    }
  }
};
</script>

<style scoped lang="scss">
  .product {
    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.06);
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 0.25rem;
    position: relative;
    * {
      transition: all .1s;
    }
    .setting {
      .info-text {
        font-size: 15px;
      }
      .website-price {
        color: var(--primary);
        background: var(--primary);
        position: relative;
        div {
          position: relative;
          z-index: 1;
        }
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: #fff;
          opacity: .9;
        }
      }
      .price-selector {
        input[type=radio] {
          display: none;
          &:not(:disabled) ~ label {
            cursor: pointer;
          }
        }
        label {
          min-width: 150px;
          white-space: nowrap;
          border-radius: 10px;
          background: #fff;
          border: 1px solid #E2E8F0;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          padding: 8px;
          display: flex;
          transition: all .2s;
          &::before {
            content: '';
            min-width: 16px;
            width: 16px;
            height: 16px;
            background: #fff;
            border: 1px solid #CBD5E1;
            border-radius: 16px;
            margin-right: 10px;
            margin-top: 3px;
          }
        }
        input[type="radio"]:checked + label {
          cursor: default;
          background: #DBEAFE;
          border-color: #60A5FA;
          &::before {
            background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18V18ZM13.707 8.707C13.8892 8.5184 13.99 8.2658 13.9877 8.0036C13.9854 7.7414 13.8802 7.49059 13.6948 7.30518C13.5094 7.11977 13.2586 7.0146 12.9964 7.01233C12.7342 7.01005 12.4816 7.11084 12.293 7.293L9 10.586L7.707 9.293C7.5184 9.11084 7.2658 9.01005 7.0036 9.01233C6.7414 9.0146 6.49059 9.11977 6.30518 9.30518C6.11977 9.49059 6.0146 9.7414 6.01233 10.0036C6.01005 10.2658 6.11084 10.5184 6.293 10.707L8.293 12.707C8.48053 12.8945 8.73484 12.9998 9 12.9998C9.26516 12.9998 9.51947 12.8945 9.707 12.707L13.707 8.707V8.707Z' fill='%2310B981'/%3E%3C/svg%3E%0A");
            border-color: #10B981;
            background-position: -3px -3px;
          }
        }
      }
    }
    .custom-control {
      position: absolute;
      left: 20px;
      top: 20px;
      label.custom-control-label {
        &:before {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }
        &::after {
          background-image: url("data:image/svg+xml,%3Csvg width='10' height='8' viewBox='0 0 10 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9.21034 0.793031C9.39781 0.980558 9.50312 1.23487 9.50312 1.50003C9.50312 1.76519 9.39781 2.0195 9.21034 2.20703L4.21034 7.20703C4.02281 7.3945 3.7685 7.49982 3.50334 7.49982C3.23817 7.49982 2.98386 7.3945 2.79634 7.20703L0.796337 5.20703C0.614179 5.01843 0.513384 4.76583 0.515663 4.50363C0.517941 4.24143 0.62311 3.99062 0.808518 3.80521C0.993926 3.6198 1.24474 3.51463 1.50694 3.51236C1.76913 3.51008 2.02173 3.61087 2.21034 3.79303L3.50334 5.08603L7.79634 0.793031C7.98386 0.60556 8.23817 0.500244 8.50334 0.500244C8.7685 0.500244 9.02281 0.60556 9.21034 0.793031Z' fill='white'/%3E%3C/svg%3E%0A");
        }
      }
    }
    .main-img {
      width: 190px;
      min-width: 190px;
      height: 140px;
      img {
        object-fit: contain;
        width: 100%;
        height: 100%;
      }
    }
    .product-info {
      flex-grow: 1;
      .title {
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    &.compact {
      .main-img {
        height: 100px;
      }
      .setting {
        padding-top: 0;
        margin-top: 0;
        h4 {
          font-size: 20px;
          margin-bottom: 0;
        }
        .info-text {
          font-size: 13px;
          > div {
            margin: 0 !important;
          }
        }
        .website-price {
          font-size: 11px;
          margin-bottom: 5px;
        }
        .imap-voil-text {
          font-size: 11px;
        }
      }
    }


    @media (max-width: 1199px) {
      .product-info {
        padding-right: 30px;   
        margin-right: 30px;
      }
      .main-img {
        width: 120px;
        min-width: 120px;
        height: 120px;
        img {
          object-position: left;
        }
      }
    }
    @media (max-width: 575px) {
      .product-info {
        padding-right: 0;   
        margin-right: 0;
        border-right: none;
        border-bottom: 1px solid #E2E8F0;
      }
      .main-img {
        width: 120px;
        min-width: 120px;
        height: 80px;
        img {
          object-position: left;
        }
      }
    }
  }
  .bg-actionMsg{
    background: #F1FFF0;
    width: 75%;
    border-radius: 3px;
    color: #000000;
    font-size: 15px;
  }
  .imap-voil-text {
    color: red;
    font-weight: bold;
    -webkit-animation: flash-animation 1s infinite;  /* Safari 4+ */
    -moz-animation: flash-animation 1s infinite;  /* Fx 5+ */
    -o-animation: flash-animation 1s infinite;  /* Opera 12+ */
    animation: flash-animation 1s infinite;  /* IE 10+, Fx 29+ */
  }
  @-webkit-keyframes flash-animation {
    0% {
        opacity: 0.2;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0.2;
    }
  }
  .z-out-1{
    zoom: 0.85;
  }
</style>


