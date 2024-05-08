<template>
    <div class="card card-primary product-item">
        <div class="card-body">
            <div class="product">
                <div class="handle">
                  <svg width="9" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M3 12v3H0v-3h3zm6 0v3H6v-3h3zM3 6v3H0V6h3zm6 0v3H6V6h3zM3 0v3H0V0h3zm6 0v3H6V0h3z" fill="#BCBCBC" fill-rule="evenodd"/></svg>
                </div>
                <div class="featured-product">
                  <span @click="removeFeaturedProduct()" :class="{ 'active': featured }">
                    <tooltip class="d-none d-md-block" text="Remove Featured Product" style="z-index: 100;" />
                    <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-8 -7)" fill-rule="nonzero" fill="none"><circle fill="#E2E2E3" cx="15" cy="15" r="15"/><path d="M21 13v8c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2v-8h12zm-3-6c.6 0 1 .4 1 1v2h3v2H8v-2h3V8c0-.6.4-1 1-1zm-1 2h-4v1h4V9z" fill="#90939A"/></g></svg>
                  </span>
                </div>

                <div class="image-container">
                  <img
                  :src="internalApi ? (item.image || '/images/default-img.svg') : (item.image_url || '/images/default-img.svg')"
                  class="product-image img-fluid">
                </div>
                
                <h6>{{ item.title }}</h6>
                <div class="d-flex flex-column flex-sm-row justify-content-between info align-items-center">
                    <div class="standard-price" v-if="!priceHidden(item)">
                        <small v-if="!$store.state.settings.products.hideReg" class="font-weight-normal">reg.</small>&nbsp;${{ item.price | removeDecimals }}
                    </div>
                    <div v-if="businessDetails.show_stock_level && (!item.settings || !item.settings.hideQuantity)"
                         class="align-items-end justify-content-md-end d-flex text-md-right ml-md-3">
                        <template v-if="item.settings && item.settings.qtyMessage && item.settings.qtyMessage.length > 0">
                          <span class="font-weight-bold small text-danger">{{ item.settings.qtyMessage }}</span>
                        </template>
                        <template v-else-if="item.num_inventory >= 1 && item.num_inventory <= $store.state.settings.products.inventoryItemsMin">
                        <span class="font-weight-bold text-danger small" v-if="!outOfStock">Only {{ item.num_inventory }} Left</span>
                        <span class="font-weight-bold small" v-else>Out of Stock</span>
                        </template>
                        <template v-else-if="item.num_inventory <= 0">
                        <span class="font-weight-bold small out-of-stock" v-if="outOfStock">Out of Stock</span>
                        <span class="font-weight-bold small text-danger" v-else>Special Order</span>
                        </template>
                        <span v-else-if="$store.state.settings.products.showQtyInWidgets" class="font-weight-bold small text-muted">
                        <span>In Stock:</span> {{item.num_inventory}}
                        </span>
                        <span v-if="item.extra && JSON.parse(item.extra).onOrder" class="font-weight-bold small text-muted">On Order: {{JSON.parse(item.extra).onOrder}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import tooltip from '../../components/tooltip';

  export default {
    name: 'AdminFeaturedItem',
    props: {
      item: {
        type: Object,
        default: null
      },
      internalApi: {
        type: Boolean,
        default: false
      },
      addStartStopScroller: {
        type: Boolean,
        default: false
      },
      editable: {
        type: Boolean,
        default: false
      },
      showAddCart: {
        type: Boolean,
        default: true
      }
    },
    components: {
      tooltip
    },
    data() {
      return {
        loaded: false,
        overlayActive: false,
        quantity: 0,
        featured: true
      };
    },
    computed: {
      isAdmin() {
        return this.$store.state.activeUser && this.$store.state.activeUser.is_admin;
      },
      cart() {
        return this.$store.state.cart;
      },
      preferences() {
        return this.$store.state.preferences;
      },
      businessDetails() {
        return this.$store.state.businessDetails;
      },
      outOfStock() {
        // if vendor is allowed then this always returns false
        const allow = this.$store.state.allowSpecialOrderVendors;
        const isVendorAllowed = allow.includes(this.item.vendor_id);
        return parseInt(this.item.num_inventory) <= 0 && !isVendorAllowed
          && (!this.businessDetails.show_oos_special || !this.item.vendor_id);
      },
      addingToCart() {
          return this.$store.state.addingToCart;
      }
    },
    methods: {
        priceHidden(product) {
            return (product.extra && JSON.parse(product.extra).hide_price) || (product.settings && product.settings.hidePrice);
        },
      removeFeaturedProduct() {
        this.featured = false;

        this.$emit('removeFeaturedProduct', this.item);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .card {
    border: 1px solid #e8e8e8;
    box-shadow: 0 4px 10px 0 rgba(34, 44, 73, 0.04);
    border-radius: 8px;
    cursor: auto;
    height: 100%;

    .card-body {
      padding: 0;

      .product {
        position: relative;
        padding: 12px 12px 8px;
        justify-content: space-between;
        display: flex;
        flex-direction: column;
        height: 100%;

        .handle {
          cursor: move;
        }
        
        .featured-product {
          position: absolute;
          top: 8px;
          right: 8px;
          
          span {
            background: none;
            border: none;
            left: 0;
            position: relative;
            cursor: pointer;
            display: inline-block;

            svg {
                polygon {
                    transition: 200ms;
                }
            }

            &:hover {
              &:not(.active) {
                fill-opacity: 0.5
              }
            }

            &:hover,
            &.active {
                svg {
                    polygon {
                        transition: 200ms;
                        fill: var(--primary);
                        stroke: var(--primary);
                    }
                }
            }
          }
        }

        .image-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 140px;
          width: 100%;
          margin-bottom: 14px;

          img {
            max-height: 100%;
          }
        }
      }
    }
  }
</style>
