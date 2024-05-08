<template>
  <div class="product-item-wrapper h-100" :class="{ 'product-card': card }">
    <router-link :to="{name: 'products-slug', params: {slug: item.slug}}" class="card card-primary product-item" :class="isIframe ? 'pointer-events-none' : ''" @click.native="onItemClick($event, item.slug)" event :target="target">
      <div class="card-body p-0 h-100">
        <div class="product" :class="{'bom_hidden' : bom && bom_hidden}">
          <a class="btn btn-success btn-xs ml-auto d-flex align-items-center" v-if="showBuyButton" :href="getProductUrl()" onclick="window.open(this.href, '_blank');return false;">
            Buy
          </a>
          <template v-if="showAddCart && !isHidden && !disableOrdering && showPriceOutOfStock">
            <div tabindex="0" v-if="!editable" class="add-to-cart" @keydown.enter.prevent.stop="openQtyModal($event)" @click="openQtyModal($event)">
              <div v-if="!outOfStock">
                <span class="q" v-if="quantity > 0">
                  {{ quantity }}x
                </span>
                <span class="q empty" v-else>
                  <svg width="12" height="13" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><filter x="-9.5%" y="-4.8%" width="119%" height="119%" filterUnits="objectBoundingBox"><feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0.13236882 0 0 0 0 0.171002098 0 0 0 0 0.285297781 0 0 0 0.04 0" in="shadowBlurOuter1"/></filter><rect  x="0" y="0" width="42" height="42" rx="21"/></defs><g fill="none" fill-rule="evenodd"><g transform="translate(-14 -14)"><use fill="#000" filter="url(#a)" xlink:href="#b"/></g><g fill="#FFF"><path d="M5 0h2v12H5z"/><path d="M12 5v2H0V5z"/></g></g></svg>
                </span>
              </div>
            </div>
          </template>
          <div class="edit-buttons" v-if="editable">
            <a href="#" class="edit-bt" @click.prevent="() => {}" v-if="false" aria-label="Edit">
              <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg"><path d="M10.99 4.307L7.691 1.012 8.02.684a2.33 2.33 0 113.298 3.295l-.328.328zm-1.06 1.06L7.743 7.553l-2.95 2.95c-.374.342-4.189 1.46-4.189 1.46a.43.43 0 01-.567-.567s1.117-3.815 1.46-4.188l2.95-2.95 2.19-2.188L9.93 5.366z" fill="#FFF" fill-rule="evenodd"/></svg>
            </a>
            <a href="#" class="remove-bt" @click.prevent.stop="remove(item)" v-if="!bom" aria-label="Remove">
              <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-8 -7)" fill-rule="nonzero" fill="none"><circle fill="#E2E2E3" cx="15" cy="15" r="15"/><path d="M21 13v8c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2v-8h12zm-3-6c.6 0 1 .4 1 1v2h3v2H8v-2h3V8c0-.6.4-1 1-1zm-1 2h-4v1h4V9z" fill="#90939A"/></g></svg>
            </a>
            <a href="#" class="bt" @click.prevent="toggleBom(item)" v-if="bom" aria-label="Toggle">
              {{ bom_hidden && 'Show' || 'Hide' }}
            </a>
          </div>
          <!-- AQUI -->
          <template>
            <div v-if="item.offline_price && item.online_price" class="badge badge-danger" v-b-tooltip.hover :title="`Online price $${ item.online_price }`">
              <VClamp autoresize :max-lines="2">
                Online price ${{ item.online_price }}
              </VClamp>
            </div>
            <div v-else-if="item.promo_message" class="badge badge-danger" v-b-tooltip.hover :title="`${promoLabel} ${item.promo_message}`">
              <VClamp autoresize :max-lines="2">
                <template v-if="item.promo_quantity">{{ promoLabel }}</template>
                {{ item.promo_message }}
              </VClamp>
            </div>
            <div v-else-if="item.promo_price && !priceHidden(item)" class="badge badge-danger" v-b-tooltip.hover :title="promoLabel">
              <VClamp autoresize :max-lines="2">
                {{ promoLabel }}
              </VClamp>
            </div>
            <div v-else-if="productLabel && !priceHidden(item)" class="badge badge-danger" v-b-tooltip.hover :title="productLabel">
              <VClamp autoresize :max-lines="2">
                {{ productLabel }}
              </VClamp>
            </div>
          </template>




          <div v-if="!loaded" class="d-flex loader-wrapper align-items-center justify-content-center">
            <img src="/icons/loader.gif" class="loader" alt="Loading..." width="40" height="40">
          </div>
          <div class="d-flex" :class="{ 'flex-column h-100': !card }">
            <div class="product-image-wrapper">
              <img :src="internalApi ? (item.image || '/images/default-img.svg') : (item.image_url || '/images/default-img.svg')" :alt="item.title | lowerCase" @load="loaded = true" :class="{ 'd-none': !loaded }" @error="() => {item.image = item.image_url = '/images/default-img.svg'; loaded = true;}" class="product-image img-fluid" />
            </div>
            <div :class="{ 'flex-grow-1 d-flex flex-column': !card }">
              <div>
                <h6><strong v-if="item.brand_name && !settings.products.hideBrandFromTitle" class="text-uppercase">{{ item.brand_name }}</strong> {{ item.title | styleTitle }}</h6>
                <span class="sku" v-if="item.sku">SKU #: <strong>{{ item.sku }}</strong></span>
                <span class="sku" v-if="isMiamiHomeCenter && item.model_number">MFG #: <strong>{{ item.model_number }}</strong></span>
              </div>
              <div class="d-flex align-items-center align-items-sm-end justify-content-between info" :class="{ 'flex-grow-1 align-items-end': !card }">
                <div class="standard-price" v-if="!priceHidden(item) && !$store.state.settings.products.hideReg && showPriceOutOfStock">
                  <div v-if="!item.promo_message && item.promo_price && !priceHidden(item)"
                      class="font-weight-normal small d-none d-sm-block text-decoration-line-through"
                      :style="{ color: settings.colors.priceColor ? settings.colors.priceColor : ''}">
                      <span v-if="settings.products.currencyPrefix">{{settings.products.currencyPrefix}}</span>
                      <span v-else>$</span>
                      {{ item.offline_price && item.online_price ? item.offline_price : formattedPrice }}     
                  </div>
                  <span v-if="!item.promo_message && item.promo_price && !priceHidden(item)" class="mr-1" :style="{ color: settings.colors.promoPriceColor ? settings.colors.promoPriceColor : '#dc3545'}">
                    <span v-if="settings.products.currencyPrefix">{{settings.products.currencyPrefix}}</span>
                    <span v-else>$</span>
                  </span>
                  <span v-else class="mr-1" :style="{ color: settings.colors.priceColor ? settings.colors.priceColor : ''}">
                    <span v-if="settings.products.currencyPrefix">{{settings.products.currencyPrefix}}</span>
                    <span v-else>$</span>
                  </span>
                  <!-- keep whitespace collapsed here -->
                  <span v-if="!item.promo_message && item.promo_price && !priceHidden(item)" :style="{ color: settings.colors.promoPriceColor ? settings.colors.promoPriceColor : '#dc3545'}">{{ item.promo_price }}</span>              
                  <span v-else :style="{ color: settings.colors.priceColor ? settings.colors.priceColor : ''}">
                    {{ item.offline_price && item.online_price ? item.offline_price : formattedPrice }}
                  </span>
                  <span v-if="item.extra && JSON.parse(item.extra).unit" class="small">
                    <span v-if="!item.promo_message && item.promo_price && !priceHidden(item)" class="font-weight-bold small" :style="{ color: settings.colors.promoPriceColor ? settings.colors.promoPriceColor : '#dc3545'}"> {{ JSON.parse(item.extra).unit }}</span>
                    <span v-else class="font-weight-bold small" :style="{ color: settings.colors.priceColor ? settings.colors.priceColor : ''}"> {{ JSON.parse(item.extra).unit }}</span>
                  </span>
                </div>
                <div class="price-hidden-text mr-auto" v-else>{{ hiddenPriceText(item) }}</div>
                <template v-if="!card">
                  <div v-if="isQuantityTextVisible" class="flex-column align-items-end justify-content-sm-end d-flex text-sm-right ml-auto special-details">
                    <!-- if the item settings have a message to show instead of quantity, prioritize that above all else -->
                    <template v-if="hasCustomQtyMessage">
                      <span class="font-weight-bold small text-danger ml-2">{{ customQtyText }}</span>
                    </template>
                    <!-- if the item is in stock, but below products.inventoryItemsMin, show "Only X Left" -->
                    <template v-else-if="showOnlyXLeft">
                      <span class="font-weight-bold text-danger small">{{ onlyXLeftText }}</span>
                    </template>
                    <!-- if the item's inventory is <= 0, we either show Out of Stock, or a special order message if
                        the item's vendor is in the whitelist (or show_oos_special=1 and it has ANY vendor) -->
                    <template v-else-if="locationInventory <= 0">
                      <span class="font-weight-bold small out-of-stock text-nowrap ml-2" v-if="outOfStock">{{ outOfStockText }}</span>
                      <span class="font-weight-bold small text-danger ml-2" v-else>{{ specialOrderText }}</span>
                    </template>
                    <!-- if we get here, the item is in stock, and it's above any "only x left" threshold, and there's
                        no custom quantity message. however, if the store doesn't want quantity to appear in
                        the product item widgets, this still won't show up. -->
                    <div v-else-if="settings.products.showQtyInWidgets" class="font-weight-bold small text-muted">
                      <!-- this is an interesting case. since DIB normally has 0 inventory this doesn't happen UNLESS
                          the RSC info is configured in the DIB merge script.
                          how do we do this better?
                          should we have custom in-stock and special order messages based on vendor with
                          a fallback default?
                          -->
                      <span :class="inStockClasses" class="text-nowrap">{{ inStockText }}</span>
                    </div>
                    <div v-if="showOnOrderText" class="font-weight-bold small text-muted ml-2">On Order: {{ onOrder }}</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="businessDetails.show_competitors"
          class="bg-white" :class="{ 'd-none': item.competitors && !item.competitors.length }">
        <img v-if="!item.competitors || !item.competitors.length" src="/icons/loader.gif" class="loader" alt="Loading...">
        <div v-if="item.competitors && item.competitors.length" class="compare">
          <div>
            <span>Compare <br/>Price To</span>
          </div>
          <div v-for="(competitor, index) in item.competitors" :key="`competitors-item-${item.id}-${index}`">
            <span>${{ competitor.price | removeDecimals }}</span>
            <img class="mw-100" :src="competitor.logo" alt="Competitor" />
          </div>
        </div>
      </div>
    </router-link>
    <div v-if="overlayActive" class="overlay" @click="closeQtyModal">
      <div class="btn-group flex-column">
        <div ref="qty" v-click-outside="closeQtyModal" class="" role="group">
          <div v-if="fPackQty && !allowCustomQtyOnFpackProducts" class="font-weight-bold small text-danger p-1 d-none">
            Must be ordered in multiple of {{ this.fPackQty }}
          </div>
          <div class="d-flex align-items-center border-on-contrast">
            <button type="button" tabindex="0" class="btn btn-white qty-minus" :disabled="addingToCart || quantity === 0" @click.stop="updateQty($event, quantity - addQty)" @keydown.enter.prevent.stop="updateQty($event, quantity - addQty)" aria-label="Remove Item">
              <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M1.563 2.063a.563.563 0 010-1.126h7.875a.563.563 0 010 1.125H1.562z" fill="#275527" fill-rule="nonzero" stroke="#275527"/></svg>
            </button>
            <div class="input-group">
              <input tabindex="-1" v-model="quantity" type="text" class="form-control" min="1" readonly>
            </div>
            <button type="button" tabindex="0" class="btn btn-white qty-plus" :disabled="addingToCart || !canAddMore()" @click.stop="updateQty($event, quantity + addQty, true)" @keydown.enter.prevent.stop="updateQty($event, quantity + addQty, true)" aria-label="Add Item">
              <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M4.938 6.063H1.563a.563.563 0 010-1.125h3.375V1.563a.563.563 0 011.125 0v3.375h3.375a.563.563 0 010 1.125H6.062v3.375a.563.563 0 01-1.125 0V6.062h0z" fill="#275527" fill-rule="nonzero" stroke="#275527"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CartApiService from '@/api-services/cart.service';
  import SearchApiService from "@/api-services/search.service";
  import {addToCart, removeFromCart, trackProductClick} from "@/plugins/analytics";
  import VClamp from 'vue-clamp';

  export default {
    name: 'ProductItem',
    props: {
      item: {
        type: Object,
        default: null
      },
      showBuyButton: {
        type: Boolean,
        default: false
      },
      selectable: {
          type: Boolean,
          default: false
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
      },
      trackClicks: {
        type: Boolean,
        default: false
      },
      trackSearch: {
        type: String,
        default: ""
      },
      isIframe: {
        type: Boolean,
        default: false
      },
      hidePrice: {
        type: Boolean,
        default: false
      },
      hideInStock: {
        type: Boolean,
        default: false
      },
      bom: {
        type: Boolean,
        default: false
      },
      bom_hidden: {
        type: Boolean,
        default: false
      },
      target: {
        type: String,
        default: '_self'
      },
      card: {
        default: false
      }
    },
    components: {
      VClamp
    },
    data() {
      return {
        loaded: false,
        overlayActive: false,
        quantity: 0,
      };
    },
    mounted(){
      this.syncQty();

      // HACK BECAUSE THE ITEM RESPONSE IS DIFFERENT IN SOME APIS (i.e. addons)
      if(this.item.num_inventory === undefined) {
        this.item.num_inventory = this.item.inventory;
      }
    },
    computed: {
      promoLabel() {
        if ( this.settings.products.widgetPromoLabel ) {
          return this.settings.products.widgetPromoLabel;
        }
        if ( this.item.extra ) {
          const props = JSON.parse(this.item.extra);
          if ( props && props.clearance && props.clearance == "true" ) {
            return 'CLEARANCE';
          }
          if ( props && props.promoLabel && props.promoLabel != "" ) {
            return props.promoLabel;
          }
        }
        return 'SALE';
      },
      productLabel() {
        // If a label has to be shown regardless of promo
        if ( this.item.extra ) {
          const props = JSON.parse(this.item.extra);
          if ( props && props.promoLabel && props.promoLabel != "" ) {
            return props.promoLabel;
          }
        }
        return false;
      },
      onOrder() {
        if ( this.item.extra ) {
          const dec = JSON.parse(this.item.extra);
          if ( dec && dec.onOrder && Math.round(dec.onOrder) ) {
            return Math.round(dec.onOrder);
          }
        }
        return 0;
      },
      showOnOrderText() {
        if ( this.item.extra ) {
          const oo = JSON.parse(this.item.extra).onOrder;
          return oo && parseInt(oo) !== 0;
        }
        return false;
      },
      regText() {
        if ( this.item.settings && this.item.settings.regText ) {
          return this.item.settings.regText;
        }
        return 'reg.';
      },
      showOnlyXLeft() {
        return this.locationInventory >= 1
          && this.locationInventory <= this.settings.products.inventoryItemsMin && !this.hideProductQuantity;
      },
      onlyXLeftText() {
        const text = this.settings.text.onlyXLeftText || 'Only ## Left';
        if ( this.settings.products.showUnitInventory ) {
          if (this.item.extra) {
            const ex = JSON.parse(this.item.extra);
            if ( ex && ex.unit && ex.unit.toLowerCase() !== 'each' && ex.unit.toLowerCase() !== 'ea' ) {
              return text.replace("##", this.locationInventory + ' ' + ex.unit);
            }
          }
        }
        return text.replace("##", this.locationInventory);
      },
      isQuantityTextVisible() {
        if(this.hideInStock) return false;
        return this.businessDetails.show_stock_level && (!this.item.settings || !this.item.settings.hideQuantity);
      },
      hasCustomQtyMessage() {
        return this.item.settings && this.item.settings.qtyMessage && this.item.settings.qtyMessage.length > 0;
      },
      customQtyText() {
        if(!this.item.settings.qtyMessage) {
          return '';
        }
        return this.item.settings.qtyMessage.replace("##", this.locationInventory);
      },
      vendorAllowed() {
        const allow = this.$store.state.allowSpecialOrderVendors;
        return allow.includes(parseInt(this.item.vendor_id));
      },
      alwaysAllowSpecialOrder() {
        return this.item.extra && JSON.parse(this.item.extra).always_allow_special_order === true || false;
      },
      explcitlyAllowedSpecialOrder() {
        return this.locationInventory === 0 && this.alwaysAllowSpecialOrder;
      },
      isSpecial() {
        return this.item.location == '_eztv' || this.item.location == '_ezorg' || this.item.location == '_ezdib' || this.item.location == '_ezemj' || this.explcitlyAllowedSpecialOrder;
      },
      disableOrdering() {
        if (this.item.settings && this.item.settings.disableOrdering) {
          return true;
        }
        // If inventory is not available and product vendor is also not added in allowSpecialOrderVendors list
        if(this.locationInventory == 0 && !this.vendorAllowed && !this.alwaysAllowSpecialOrder) {
          return true;
        }
        // If store has disabled order for this product through Product Editor
        if(this.item.extra && JSON.parse(this.item.extra).disable_order == true) {
          return true;
        }

        // if out of stock and special orders are globally disabled, return true
        if ((this.locationInventory < 1 || this.isSpecial) && this.settings.products.disableSpecialOrdering) {
          return true;
        }

        return this.settings.products.disableOrdering || false;
      },
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
      settings() {
        return this.$store.state.settings;
      },
      outOfStock() {
        return parseInt(this.locationInventory) <= 0 && !this.isSpecial && !this.vendorAllowed;
      },
      isHidden() {
        return parseInt(this.item.hidden) == 1;
      },
      outOfStockText() {
        let text = this.settings.text.outOfStockText || 'Out of Stock';
        const vendorTextMap = this.settings.text.vendorOutOfStockText || {};
        const vendorIdStr = "" + this.item.vendor_id;
        if ( vendorIdStr && vendorTextMap[vendorIdStr] && vendorTextMap[vendorIdStr].length > 0 ) {
          text = vendorTextMap[vendorIdStr];
        }
        return text;
      },
      hideProductQuantity() {
        return this.item.extra && JSON.parse(this.item.extra).hide_quantity === true || false; 
      },
      inStockText() {
        // use a default message but let it be overriden by vendor-specific messages.
        // so e.g. airsupply can have text.vendorInStockText = {"2020": "## Available in 3-5 days"}
        // for a custom message when an item in in-stock at the DIB warehouse.
        // Stores are complaining that RDC inventory is getting shown as In-stock, so hide it by default
        if (!this.isTruevalue && this.locationInventory > 0 && this.isSpecial) {
          return '';
        }

        if(this.hideProductQuantity) {
          return '';
        }

        let text = this.settings.text.inStockText || `In Stock: ##`;
        const vendorTextMap = this.settings.text.vendorInStockText || {};
        const vendorIdStr = "" + this.item.vendor_id;
        if ( vendorIdStr && vendorTextMap[vendorIdStr] && vendorTextMap[vendorIdStr].length > 0 ) {
          text = vendorTextMap[vendorIdStr];
        }

        const catalogTextMap = this.settings.text.catalogInStockText || {};
        if ( this.item.location && catalogTextMap[this.item.location] ) {
          text = catalogTextMap[this.item.location];
        }
        if ( this.settings.products.showUnitInventory ) {
          if (this.item.extra) {
            const ex = JSON.parse(this.item.extra);
            if ( ex && ex.unit && ex.unit.toLowerCase() !== 'each' && ex.unit.toLowerCase() !== 'ea' ) {
              return text.replace("##", this.locationInventory + ' ' + ex.unit);
            }
          }
        }
        if(text == 'HIDDEN') {
          return '';
        }
        return text.replace("##", this.locationInventory);
      },
      inStockClasses() {
        let classes = '';
        const styles = this.settings.styles || {};
        const vendorTextMap = styles.vendorInStockClasses || {};
        const vendorIdStr = "" + this.item.vendor_id;
        if ( vendorIdStr && vendorTextMap[vendorIdStr] && vendorTextMap[vendorIdStr].length > 0 ) {
          classes = vendorTextMap[vendorIdStr];
        }

        const catalogTextMap = styles.catalogInStockClasses || {};
        if ( this.item.location && catalogTextMap[this.item.location] ) {
          classes = catalogTextMap[this.item.location];
        }

        return classes;
      },
      specialOrderText() {
        // try a specific special order title from the item first
        if ( this.item.settings && this.item.settings.specialOrderTitle
          && !this.settings.cart.hideVendorInSpecialOrder) {
          return this.item.settings.specialOrderTitle;
        }

        // then fall back to vendor-specific or default
        let text = this.settings.text.specialOrderTitle || 'Special Order';
        const vendorTextMap = this.settings.text.vendorSpecialOrderText || {};
        const vendorIdStr = "" + this.item.vendor_id;
        if ( vendorIdStr && vendorTextMap[vendorIdStr] && vendorTextMap[vendorIdStr].length > 0 ) {
          text = vendorTextMap[vendorIdStr];
        }
        return text;
      },
      addingToCart() {
          return this.$store.state.addingToCart;
      },
      formattedPrice() {
        return (Math.round(this.item.price * 100) / 100).toFixed(2);
      },
      locationInventory() {
        // see src/plugins/custom
        return EZCP.getInventoryLevel(this, this.item);
      },
      showPriceOutOfStock() {
        if(this.settings.products.hidePriceOutOfStock) {
          if((this.item.vendor_id == 2020 && this.locationInventory < 1 && this.item.location == '_ezdib') || (this.item.vendor_id == 2020 && this.locationInventory < 1)) {
            return false;
          }
        }
        return true;
      },
      imageAlt() {
        if (this.item.extra && JSON.parse(this.item.extra).main_img_alt) {
          return JSON.parse(this.item.extra).main_img_alt;
        } else {
          return null;
        }
      },
      fPackQty() {
        // In case if its an fpack item, quantity would be returned
        if(this.isSpecial && this.item.extra && JSON.parse(this.item.extra).fpack) {
          const qty = parseInt(JSON.parse(this.item.extra).fpack);
          if(qty) return qty;
        }
        return false;
      },
      addQty() {
        if(this.allowCustomQtyOnFpackProducts) {
          return this.fPackQty && this.quantity == 0 ? this.fPackQty : 1;
        }
        return this.fPackQty ? this.fPackQty : 1;
      },
      allowCustomQtyOnFpackProducts(){
        // for custom qty on fpac for Papa's Hardware
        if(this.$store.state.currentStore && this.$store.state.currentStore.business_id  && this.$store.state.currentStore.business_id == 5104){
          return true;
        }
        return false;
      },
      cartSettings() {
        return this.$store.state.settings && this.$store.state.settings.cart ? this.$store.state.settings.cart : null;
      },
      useLegacyToastMsg() {
        if(this.cartSettings && this.cartSettings.useLegacyToastMsg){
          return true;
        }
        return false;
      },
      parcels() {
        return this.cart.parcels;
      },
      cartItems() {
        return this.parcels && this.parcels[0] ? this.parcels[0] : null;
      },
      isMiamiHomeCenter() {
        return this.$root.$children[0].isMiamiHomeCenter;       
      }
    },
    methods: {
      syncQty() {
        this.quantity = 0;
        if(this.parcels){
          if(this.parcels[0]) {
            let items = this.parcels[0].items;
            [...items].forEach(item => {
              if(item.sku == this.item.sku) {
                this.quantity = item.quantity;
              }
            });
          }
        }
      },
      remove(item) {
        this.$emit('remove', item);
      },
      toggleBom(item) {
        this.$emit('toggleBom', item);
      },
      priceHidden(product) {
        if(this.hidePrice) return true;
        return (product.extra && JSON.parse(product.extra).hide_price) || (this.settings && this.settings.products.hidePrice) || (product.settings && product.settings.hidePrice);
      },
      hiddenPriceText(product) {
        const def = this.priceHidden(product) ? '' : 'Please contact us for price';
        return product.settings && product.settings.hidePriceText || this.settings.products.hiddenPriceText || def;
      },
      urlFriendly(value) {
        return this.$ezSlugify(value);
        //return value.replace(/[ /]/g, '+');
      },
      openQtyModal(evt) {
        if(this.isIframe) {
          return;
        }
        this.overlayActive = true;
        if (this.addStartStopScroller) {
          this.$emit('stop-autoplay');
        }
        evt.stopPropagation();
        evt.preventDefault();
        if(!this.quantity){
          this.updateQty(evt, this.quantity + this.addQty, true);
        }
      },
      closeQtyModal(event) {
        const path = event.path || (event.composedPath && event.composedPath());
        event.stopPropagation();
        if (path.includes(this.$refs.qty)) return;
        this.overlayActive = false;
        if (this.addStartStopScroller) {
          this.$emit('start-autoplay');
        }
      },
      canAddMore() {
        // In case if their is limit on how many items can be purchased in a single order
        if(this.item.extra && JSON.parse(this.item.extra).max_order_quantity) {
          if(this.quantity >= Number(JSON.parse(this.item.extra).max_order_quantity)) {
            return false;
          }
        }
        if(this.quantity < this.locationInventory) {
          return true;
        }
        if(this.$store.state.allowSpecialOrderVendors.includes(this.item.vendor_id)) {
          return true;
        }
        if(this.alwaysAllowSpecialOrder) {
          return true;
        }

        // if we are showing out of stock as special order and we have a vendor id, let them add
        return !!(this.businessDetails.show_oos_special && this.item.vendor_id);
      },
      updateQty(evt, value, adding = false) {
        if(this.isAdmin) {
          this.$swal("You can't add products as Admin", '', 'error');
          return;
        }
        this.$store.state.addingToCart = true;
        this.$emit('cart-update', this.item, value, this.quantity);
        this.quantity = value;
        if (value === 0) {
          this.overlayActive = false;
          this.removeFromCart(this.item.store_product_id || this.item.id);
        } else {
          this.addToCart(this.item, this.item.store_product_id  || this.item.id, value, adding);
        }
      },
      addToCart(item, id, quantity, adding = false) {
        CartApiService.addItem(item, id, quantity).then(res => {
          if(res.status === 200) {
            this.$store.dispatch('fetchCartItemsDetails');
            if(adding) {
              if(this.useLegacyToastMsg) {
                this.$swal({
                  customClass: {
                    container: 'add-to-cart-toast-container',
                    popup: 'add-to-cart-toast',
                  },
                  toast: true,
                  position: 'top',
                  title: this.item.title,
                  html: `<img src="${this.item.image_url || '/images/default-img.svg'}"><br>Product has been added to cart <a href="/cart" class="btn btn-outline-primary mt-3 mb-2">Go to checkout</a>`,
                  showConfirmButton: false,
                  timer: 5000,
                });
              } else {
                this.$root.$children[0].$refs.CartSidebar.show();
              }
              addToCart(this.item, 1);
            } else {
              removeFromCart(1);
            }
          } else {
            this.$swal(res.data.message, '', 'error');
          }
          this.$store.state.addingToCart = false;
        }).catch(() => {
          this.$swal('Add to Cart Error', '', 'error');
        });
      },
      removeFromCart(id) {
        CartApiService.removeItem(id).then(() => {
          this.$store.dispatch('fetchCartItemsDetails');
          this.$store.state.addingToCart = false;
        });
      },
      onItemClick(evt, slug) {
        if(this.selectable) {
          evt.preventDefault();
          evt.stopPropagation();
          this.$emit('onSelect', this.item);
          return;
        }
        this.$router.push({name: 'products-slug', params: {slug: slug}});
        // Need to do this here because for some strange reason, the item-click is NOT getting
        // propagated back to search-results after the first time. cart-update is fine though.
        if(this.trackClicks) {
          SearchApiService.trackSearchClick(this.trackSearch, this.item.id, this.item.position);
        }
        trackProductClick(this.item);
      },
      getProductUrl() {
        return window.location.protocol+'//'+window.location.host+'/products/'+this.item.sku+'/'+this.urlFriendly(this.item.title);
      },
    },
    watch: {
      cartItems() {
          this.syncQty();
      },
    }
  };
</script>
<style lang="scss" scoped>
  .text-decoration-line-through{
    text-decoration: line-through;
  }
  .cursor-move {
    cursor: move;
  }
  .product {
    display: flex;
    width: 100%;
    height: 100%;
    padding: 16px 12px;
    flex-direction: column;
    justify-content: space-between;
    &.bom_hidden {
      .loader-wrapper, h6, .info, .sku, .product-image-wrapper {
        opacity: .6;
      }
    }
    .sku {
      color: var(--text);
      margin-bottom: 4px;
      display: block;
      font-size: 0.8125rem;
    }

    .add-to-cart {
      position: absolute;
      top: 8px;
      right: 8px;

      .q {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;
        height: 32px;
        border-radius: 32px;
        font-size: 14px;
        font-weight: bold;
        border: 1px solid var(--primary);
        color: var(--primary);
        letter-spacing: -1px;
        cursor: pointer;
        &.empty {
          background-color: var(--primary);
        }
      }
    }

    .loader-wrapper {
      height: 150px;
      position: absolute;
      left: 0;
      right: 0;
      top: 24px;
    }

    .product-image-wrapper {
      height: 180px;
      padding-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img.product-image {
      display: block;
      max-height: 100%;
    }

    h6 {
      color: #000;
      max-height: 56px;
      margin-bottom: 6px;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex-shrink: 0;

      &:active,
      &:focus {
        text-decoration: none;
      }
    }

    .info {
      .out-of-stock {
        background: #dc3545;
        color: #fff !important;
        font-size: 11px;
        padding: 3px 3px 2px;
        border-radius: 3px;
      }
      .standard-price {
        font-size: 20px;
        font-weight: 700;
        font-style: normal;
        line-height: 20px;
        margin-bottom: -4px;
        &.items-left {
          font-size: 12px;
          line-height: 14px;
        }
        .small{
          font-size: 12px;
        }
      }
      .price-hidden-text {
        color: #333;
        font-size: 12px;
        font-weight: 600;
      }
    }
  }
  .card {
    border: none;
    box-shadow: 0 14px 10px 0 rgba(34,44,73, .04);
    border-radius: 13px;
    color: black;
    .card-body {
      .product {
        .edit-buttons {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          z-index: 10;
          a {
            width: 30px;
            height: 30px;
            border-radius: 30px;
            transform: scale(.85);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .edit-bt {
            background: var(--primary);
          }
          .remove-bt {
            background: #E2E2E3;
          }
        }
        .badge {
          white-space: normal;
          position: absolute;
          max-width: 130px !important;
          text-align: left;
        }
      }
    }
  }
  button.btn.qty-plus,
  button.btn.qty-minus {
    z-index: 1;
    background-position: 50%;
    background-repeat: no-repeat;
  }
  button.btn.qty-plus svg *,
  button.btn.qty-minus svg * {
    stroke: var(--primary);
  }
  .special-details {
    max-width: 100px;
  }
  .product-card {
    .product-image-wrapper {
      height: 50px;
      min-height: 50px;
      padding-bottom: 0;
      margin-right: 7px;
      min-width: 50px;
    }
    .product h6 {
      font-size: .9rem;
    }
  }
  @media screen and (max-width: 576px) {
    .product {
      .product-image-wrapper {
        height: 140px;
      }
      img.product-image {
        margin-bottom: 16px;
      }
      .info .standard-price {
        margin-bottom: 4px;
      }
    }
  }
</style>
