<template>
  <div class="item row">
    <div class="col-12 col-md-8 d-flex" :class="{'col-md-12' : compactView}">
      <div class="d-flex align-items-center justify-content-center h-d-100px-m-70px" v-if="!readonly && !sideBarView">
        <div class="custom-control custom-checkbox ml-n2">
          <input type="checkbox" class="custom-control-input" :aria-label="`Select ${item.title}`" :id="`selecteditem-${item.slug}`" v-model="selected" />
          <label style="height: 20px" class="custom-control-label" :for="`selecteditem-${item.slug}`">
            <span class="d-none">Select {{ item.title }}</span>
          </label>
        </div>
      </div>
      <div class="img-wrapper d-flex align-items-center justify-content-center mr-2 mr-sm-3" :class="{'compactView': compactView}">
        <img :src="item.image_url || '/images/default-img.svg'" class="img-fluid">
      </div>
      <div class="d-flex flex-column">
        <router-link class="name mb-1" :class="{'compactView': compactView}" :to="{ name: 'products-slug', params: { slug: item.slug } }">
        {{ item.title | styleTitle }}
        </router-link>
        <div>
          <div v-if="showAdditionalFees">
            <div v-for="(fee, i) in additionalFeeDetails" :key="`itemfee-${i}`" class="small mb-1">
              {{ fee.message }}:<span class="text-primary mx-1">${{ fee.price_impact | productPrice }}</span>
            </div>
          </div>
          <div v-if="settings.cart.showUnitPrice" class="price text-primary font-weight-bold">
            <span v-if="$store.state.settings.products.currencyPrefix">{{$store.state.settings.products.currencyPrefix}}</span>${{ item.price }}
            <span v-if="item.extra && JSON.parse(item.extra).unit" class="small">
              <span class="font-weight-bold small" :style="{ color: settings.colors.priceColor ? settings.colors.priceColor : ''}"> {{ JSON.parse(item.extra).unit }}</span>
            </span>
          </div>
          <div v-else class="price text-primary font-weight-bold" :class="{'compactView': compactView}">
            <span v-if="$store.state.settings.products.currencyPrefix">{{$store.state.settings.products.currencyPrefix}}</span>${{ item.price }}
            <span v-if="compactView" class="compactView-qty">X {{ item.quantity }}</span>
          </div>
          <div class="ml-2 font-weight-bold" v-if="readonly && !compactView">({{ item.quantity }})</div>
          <span class="font-weight-bold small badge badge-danger mb-2" v-if="special">Special Order</span>
        </div>      
      </div>
    </div> 
    <div class="info col-12 col-md-4">        
        <div v-if="!readonly" class="order-controls flex-row flex-md-column justify-content-between w-100">
          <change-quantity
            class="order-2 order-md-1"
            :qty="item.quantity"
            :special="special"
            :cart-item="item"
            :limit="item.num_inventory"
            :ui-limit="item.num_inventory"
            :showRemoveItem="item.quantity > 0" />
          <div class="d-flex flex-column order-1 order-md-2">
            <div v-if="item.extra && JSON.parse(item.extra).max_order_quantity" class="order-limit">
              Order limit: <strong>{{JSON.parse(item.extra).max_order_quantity}}</strong>
            </div>
            <div v-if="item.settings.disableDelivery && item.settings.disableDeliveryText && item.settings.disableDeliveryText.length > 0" class="text-small">
              <small><b class="text-danger">Delivery: </b>{{item.settings.disableDeliveryText}}</small> 
            </div>
            <div v-if="item.settings.disableShipping && item.settings.disableShippingText && item.settings.disableShippingText.length > 0" class="text-small">
              <small><b class="text-danger">Shipping: </b>{{item.settings.disableShippingText}}</small> 
            </div>
          </div> 
        </div>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'cartItem',
    props: {
     item: {
       required: true
     },
     readonly: {
       default: false
     },
     special: {
       default: false
     },
     compactView: {
       default: false
     },
     sideBarView: {
       default: false
     }
    },
    data() {
      return {
        selected: false
      };
    },
    computed: {
      settings() {
        return this.$store.state.settings;
      },
      showAdditionalFees() {
        return this.item.additional_fee && this.item.additional_fee != '0.00';
      },
      additionalFeeDetails() {
        return this.showAdditionalFees && this.item.additional_fee_details ? JSON.parse(this.item.additional_fee_details) : null;
      }
    },
    methods: {
      urlFriendly(value) {
        return this.$ezSlugify(value);
      }
    },
    watch: {
      selected() {
        this.$emit('onSelect', this.item.id, this.selected);
      }
    }
  };

</script>

<style lang="scss" scoped>  
  .item {
    display: flex;
    align-items: start;
    padding-top: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #E2E8F0;

    > div:last-child {
      width: 100%;
    }

    .img-wrapper {
      width: 100px;
      min-width: 100px;
      height: 100px;
      img {
        max-height: 90px;
        max-width: 90px;
      }
      &.compactView{
        width: 60px;
        min-width: 60px;
        height: 60px;
        img {
          max-height: 56px;
          max-width: 56px;
        }
      }
    }
    .name {
      color: #000000;
      font-size: 16px;
      text-overflow: ellipsis;
      display: block;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      font-weight: 700;
      &.compactView{
        font-size: 14px;
      }
    }

    .price {
      font-size: 19px;
      font-weight: 700;
      &.compactView{
        font-size: 14px;
        .compactView-qty{
          color: #000000;
          font-weight: 400;
        }
      }
    }

    .info {
      display: flex;
      justify-content: end;
      align-items: center;      

      :deep(.change-quantity) {
        justify-content: flex-end;
      }
    }

    &.small {
      .name {
        font-size: 14px;
      }
      .img-wrapper {
        width: 70px;
        height: 70px;
        min-width: 70px;
        img {
          max-width: 68px;
          max-height: 68px;
        }
      }
    }
  }

  .order-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .order-limit {
      font-size: 14px;
      margin-top: 8px;
      color: #64748B;
      strong {
        color: #1E293B;
      }
    }
  }

  .h-d-100px-m-70px{
    height: 100px;
  }

  @media (max-width: 575px) {
    .h-d-100px-m-70px{
      height: 70px;
    }
    :deep(.add-remove) {
      max-width: 190px;
    }
    .item {
      .img-wrapper {
        width: 70px;
        height: 70px;
        min-width: 70px;
        img {
          max-width: 68px;
          max-height: 68px;
        }
      }
      .name {
        font-size: 0.875rem;
        line-height: 1rem;
        font-weight: 500;
        margin-bottom: 6px;
      }
      .info {

        .price {
          margin-bottom: 6px;
        }

        :deep(.change-quantity) {
          .add-cart {
            b,
            div {
              display: none;
            }
          }

          input {
            max-width: 32px;
          }
        }
      }
    }
  }

  @media (max-width: 428px) {
    .item {
      &:not(:first-child) {
        padding-top: 10px;
      }

      &:not(:last-child) {
        padding-bottom: 10px;
      }
      .info {
        flex-direction: column;
        align-items: flex-start;

        :deep(.change-quantity) {
          justify-content: flex-start;
        }
      }
    }

    .order-controls {
      align-items: flex-start;
    }
  }
</style>
