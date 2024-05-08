<template>
  <div class="product-details-box" :class="{ 'secondary': settings.navigationLayout === 'secondary' }">
    <!-- if is loading -->
    <div class="d-flex w-100 justify-content-center my-5" v-if="!product && !product404">
      <div class="spinner-border"></div>
    </div>
    <!-- else if no product was found -->
    <template v-else-if="product404">
      <div class="container">
        <div id="productDetails">
          <div class="d-flex flex-column justify-content-md-between align-items-md-center mb-3">
            <h1>Product Not Found</h1>
            <p>Sorry, this item was not found. Return to the <router-link to="/">home page</router-link>.</p>
          </div>
        </div>
      </div>
    </template>
    <!-- otherwise show the product -->
    <template v-else>
      <div class="alert alert-danger text-center" v-if="product.hidden">
        <b>Product Hidden!</b><span v-if="product.hidden_reason"> Reason: {{ product.hidden_reason }}</span>
      </div>
      <div class="container">
        <div id="productDetails">
          <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-3">
            <Breadcrumb :product="product" />
            <div class="align-self-end align-self-md-center mb-n2 mt-2 mt-sm-0 flex-shrink-0" v-if="$store.state.activeUser && $store.state.activeUser.is_admin">
              <button id="copyIframeBtn" type="button" @click="copyIframeToClipboard" class="btn btn-primary btn-xs">
                Copy Iframe
              </button>
              <button id="editProductBtn" type="button" @click="editProduct(product)" class="btn btn-primary btn-xs ml-2">
                Edit Product
              </button>
            </div>
            <div class="align-self-end align-self-md-center mt-2 mt-sm-0 flex-shrink-0" v-else>
              <ShareDropdown :productTitle="product.title" :productDescription="product.description" :productImage="selectedImage" />
            </div>
          </div>
          <div class="product-section px-md-3 py-md-4">
            <div class="row align-items-stretch" itemscope itemtype="http://schema.org/Product">
              <div class="col-md-5 d-flex flex-column">
                <div class="product-preview d-none d-md-flex align-items-center justify-content-center mb-3">
                  <img @mousemove="zoomImage($event)" @mouseleave="$refs.zoomer.classList.add('d-none')" @mouseenter="$refs.zoomer.classList.remove('d-none')" :src="selectedImage" alt="Product Preview" v-if="selectedImage" style="cursor: zoom-in;">
                  <img src="/images/default-img.svg" alt="Product Preview" v-else />
                </div>
                <div ref="zoomer" class="zoomer d-none" :style="{ backgroundImage: `url(${selectedImage})`}"></div>
                <div class="row small-gutters d-none d-md-flex" v-if="productImages.length > 1">
                  <div class="col-3 col-lg-2 mb-2" v-for="img in productImages" :key="img.id">
                    <div class="w-100 border p-1 cursor-pointer img-thumb" :class="{'selected' : selectedImage == img.url}" @click="selectImage(img.url)">
                      <img :src="img.url" alt="product image" class="w-100 h-100" style="object-fit: contain" @error="removeImage(img.id)" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-7 d-flex flex-column">
                <div>
                  <!-- If Product is rental -->
                  <div v-if="forRental" class="small text-primary">Rental Product</div>
                  <!-- Product Title -->
                  <h1 v-if="product" itemprop="name" class="prod-title my-2 mt-md-0"><strong v-if="product.brand_name && !settings.products.hideBrandFromTitle">{{ brandName }}</strong> {{ titleWithoutBrand | styleTitle }}</h1>
                  <div class="d-block d-md-none" id="product-preview-mobile">
                    <img class="img-fluid" :src="currentImage" alt="Product Image" />
                  </div>
                  <!-- Display product UPC,  SKU and Model Number -->
                  <div class="mt-n1 mb-2 text-muted">
                    <!-- Display Product SKU if available -->
                    <h2 class="mr-3" v-if="product.sku">SKU <b>#{{ product.sku }}</b></h2>
                    <!-- Display Product Model Number if available -->
                    <h2 class="mr-3" v-if="product.model_number">Model <b>#{{ product.model_number }}</b></h2>
                    <!-- Display Product UPC if available and hideUpc property is not set in settings -->
                    <h2 v-if="product.upc && !settings.products.hideUpc">UPC <b>#{{ product.upc }}</b></h2>
                  </div>

                  <!-- If headerDisclaimer field is set and length of it is greater than 0, then display product disclaimer -->
                  <div v-if="hasTextSetting(product, 'headerDisclaimer')" class="font-weight-bold"
                    v-html="product.settings.headerDisclaimer">
                  </div>

                  <!-- Display rental prices if available -->
                  <div v-if="forRental && filteredRates" class="row small-gutters">
                    <div class="col-md-3 text-center d-flex flex-column" v-for="rate in filteredRates" :key="rate.header">
                      <div class="card mb-2">
                        <div class="card-title border-bottom py-2">
                          <div class="font-weight-bold flex-grow-1 d-flex align-items-center justify-content-center">{{ rate.header }}</div>
                        </div>
                        <div class="h5 font-weight-normal text-primary" :style="{ color: settings.priceColor || ''}">
                          <template v-if="!(rate.hideCurrencyPrefix && rate.hideCurrencyPrefix === true)">$</template>
                          {{ rate.price }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Display banner to contact store for price if they has opted to keep the price hidden through Product Editor -->
                <div class="d-flex my-3" v-if="priceHidden(product)">
                  <div class="label">
                    {{ hiddenPriceText }}
                  </div>
                </div>
                <!-- Else if price is not hidden-->
                <div class="price-and-promo" v-else>
                  <div class="prices" v-if="!settings.products.hideReg && showPriceOutOfStock">
                    <!-- If product is not rental and also hideReg is not set in settings -->
                    <div v-if="!settings.products.hideReg  && !forRental" class="label d-flex">
                      <!-- If their is discount on single product, then promo_price would be set and we will display Sale Banner -->
                      <div v-if="product.promo_price && !product.online_price" class="has-promo mr-3">
                        <div class="label">
                          {{ promoLabel }}
                        </div>
                        <div class="font-weight-bold mr-3 price">
                          <span v-if="settings.products.currencyPrefix && !settings.products.hideReg">
                            {{settings.products.currencyPrefix}}
                          </span>
                          <span>
                            ${{(product.promo_price ? product.promo_price : product.price) | productPrice}}
                          </span>
                          <!-- Display Unit info if set -->
                          <span v-if="product.extra  && !settings.products.hideReg" itemprop="price"  class="mt-2 ml-2 font-weight-bold small">
                            {{ JSON.parse(product.extra).unit && JSON.parse(product.extra).unit }}
                          </span>
                        </div>
                      </div>
                      <div :style="{ color: settings.colors.priceColor ? settings.colors.priceColor : ''}">
                        <div v-if="fPackQty && allowCustomQtyOnFpackProducts" v-html="'Price listed is for a single item.'" />
                        <div v-else-if="fPackQty" v-html="'Price listed is for a single item. Must be ordered in multiples of ' + fPackQty" />
                        <div v-else v-html="regularPriceText" />
                        <div class="font-weight-bold price" :class="{'line-through' : product.promo_price}">
                          <span v-if="settings.products.currencyPrefix && !settings.products.hideReg">
                            {{settings.products.currencyPrefix}}
                          </span>
                          <span>
                            ${{product.price | productPrice}}
                          </span>
                          <!-- Display Unit info if set -->
                          <span v-if="product.extra  && !settings.products.hideReg" itemprop="price"  class="mt-2 ml-2 font-weight-bold small">
                            {{ JSON.parse(product.extra).unit && JSON.parse(product.extra).unit }}
                          </span>
                        </div>
                      </div>
                      </div>
                  </div>
                  <!-- Only show if promo message is set for the product, basically a bundle deal like 3 for $10 -->
                  <!-- This is showing "QUANTITY DISCOUNT" as header and promo message set through Product Editor -->
                  <div v-if="product.online_price" class="prices has-promo">
                    <div class="label">
                      Online Price
                    </div>
                    <div class="price">
                      ${{ product.online_price }}
                      <!-- Display Unit info if set -->
                      <span v-if="product.extra  && !settings.products.hideReg" itemprop="price"  class="mt-2 ml-2 font-weight-bold small">
                        {{ JSON.parse(product.extra).unit && JSON.parse(product.extra).unit }}
                      </span>
                    </div>
                  </div>
                  <div v-else-if="product.promo_message">
                    <!-- Promo Header -->
                    <!-- In case if its just general promo message and no promo price/quantity is actually involved, then dont show this -->
                    <div v-if="product.promo_quantity" class="label">
                      {{ promoQuantityHeader }}
                    </div>
                    <!-- Promo Message -->
                    <div class="promo-message">
                      {{ product.promo_message }}
                    </div>
                  </div>
                </div>
                
                <div v-if="payLaterEnabled" class="pp-message"></div>                      

                <!-- Rental Disclaimer-->
                <div v-if="forRental && rentalDisclaimerText" class="font-weight-bold" v-html="rentalDisclaimerText">
                </div>

                <div class="pt-4 pb-3 border-top border-gray">
                  <div class="d-flex" v-if="(locationInventory || explcitlyAllowedSpecialOrder) && !hideProductQuantity">
                    <svg v-if="!isSpecial" width="38" height="38" viewBox="0 0 50 50" class="text-primary mr-3" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fill-rule="evenodd"><path d="M49.025 49.18H.778A.773.773 0 010 48.412c0-.424.348-.769.778-.769h48.247c.43 0 .778.345.778.769a.773.773 0 01-.778.768z"/><path d="M3.89 49.18a.773.773 0 01-.777-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM45.912 49.18a.773.773 0 01-.778-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM48.247 15.37a.778.778 0 01-.739-.526L43.017 1.537H6.787L2.294 14.844a.78.78 0 01-.985.485.766.766 0 01-.492-.972L5.488.525A.777.777 0 016.224 0h37.353c.335 0 .632.212.738.525l4.669 13.832a.766.766 0 01-.492.972.784.784 0 01-.246.04z"/><path d="M15.563 10.758h-1.556a.773.773 0 01-.778-.768c0-.425.348-.769.778-.769h1.556a.774.774 0 00.779-.768.774.774 0 00-.779-.769c-1.287 0-2.334-1.034-2.334-2.305 0-1.271 1.047-2.305 2.334-2.305h1.557c.43 0 .778.344.778.768a.773.773 0 01-.778.769h-1.557a.774.774 0 00-.778.768c0 .424.35.769.778.769 1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305zM20.232 10.758a.773.773 0 01-.778-.768V3.842c0-.424.349-.768.778-.768.43 0 .779.344.779.768V9.99a.773.773 0 01-.779.768z"/><path d="M23.345 7.684h-3.113a.773.773 0 01-.778-.768c0-.424.349-.768.778-.768h3.113c.43 0 .778.344.778.768a.773.773 0 01-.778.768z"/><path d="M23.345 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768.43 0 .778.344.778.768V9.99a.773.773 0 01-.778.768zM28.014 10.758c-1.287 0-2.334-1.034-2.334-2.305V5.379c0-1.271 1.047-2.305 2.334-2.305 1.287 0 2.335 1.034 2.335 2.305v3.074c0 1.271-1.048 2.305-2.335 2.305zm0-6.147a.774.774 0 00-.778.768v3.074c0 .423.35.768.778.768a.774.774 0 00.778-.768V5.379a.774.774 0 00-.778-.768zM32.683 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768h1.556c1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305h-.778V9.99a.773.773 0 01-.778.768zm.778-4.61h.778a.774.774 0 00.779-.769.774.774 0 00-.779-.768h-.778v1.537zM3.89 19.98c-1.715 0-3.112-1.38-3.112-3.074V14.6c0-.424.349-.768.778-.768.43 0 .779.344.779.768v2.306c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M8.56 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M13.229 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M17.898 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M22.567 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M27.236 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M31.905 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M36.574 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M41.243 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M45.912 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537V14.6c0-.424.349-.768.779-.768.43 0 .778.344.778.768v2.306c0 1.695-1.397 3.074-3.113 3.074zM47.725 13.832H2.078a.773.773 0 01-.779-.768c0-.425.349-.769.779-.769h45.647c.43 0 .778.344.778.769a.773.773 0 01-.778.768zM41.243 49.18H30.349a.773.773 0 01-.779-.768V29.969c0-.424.349-.768.779-.768h10.894c.43 0 .778.344.778.768v18.443a.773.773 0 01-.778.768zm-10.116-1.537h9.338V30.738h-9.338v16.905zM27.236 41.496H8.56a.773.773 0 01-.778-.769V29.97c0-.424.348-.768.778-.768h18.676c.43 0 .778.344.778.768v10.758a.773.773 0 01-.778.769zM9.338 39.959h17.12v-9.221H9.338v9.221z"/><g><path d="M11.673 35.348a.78.78 0 01-.55-.225.761.761 0 010-1.086l1.556-1.537c.304-.3.796-.3 1.1 0 .304.3.304.786 0 1.086l-1.556 1.537a.78.78 0 01-.55.225z"/></g><g><path d="M13.229 37.654a.78.78 0 01-.55-.225.761.761 0 010-1.087l3.112-3.074c.304-.3.797-.3 1.1 0 .305.3.305.787 0 1.087l-3.112 3.074a.78.78 0 01-.55.225z"/></g><g><path d="M38.13 41.496a.824.824 0 01-.552-.223.802.802 0 01-.226-.546c0-.2.086-.4.226-.545.295-.285.817-.285 1.105 0 .14.146.225.345.225.545 0 .2-.085.4-.225.546a.825.825 0 01-.553.223z"/></g><g><path d="M38.908 7.684a.824.824 0 01-.552-.222.802.802 0 01-.226-.546c0-.208.086-.4.226-.546.296-.284.817-.284 1.105 0 .14.146.226.346.226.546 0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"/></g><g><path d="M10.894 7.684a.788.788 0 01-.552-.222.802.802 0 01-.226-.546c0-.2.086-.4.226-.546.288-.284.817-.284 1.105 0a.79.79 0 01.226.546c0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"/></g></g></svg>
                    <div>
                      <div itemprop="availability">
                        <div class="label" :class="{ 'text-danger' : isDoItBestBarbados }">
                          <template v-if="!isSpecial"><span v-html="inStockText" class="text-success" /><span v-if="inStockText">,</span> Available at</template>
                          <template v-else>{{ specialOrderWarning }}</template>
                        </div>
                        <template v-if="isDoItBestBarbados">
                          Sheraton Mall
                        </template>
                        <template v-else>
                        {{ currentStore.name }}
                        <span v-if="currentStore && currentStore.address">, {{ currentStore.address }}</span>
                        <span v-if="currentStore && currentStore.city">, {{ currentStore.city }}</span>
                        <span v-if="currentStore && currentStore.state">, {{ currentStore.state }}</span>
                        </template>
                      </div>
                      <div class="mt-3" v-if="isSpecial && !hideSecondSpecialWarning">
                        <div v-if="!disableOrdering" class="d-flex align-items-center" itemprop="availability">
                          <svg v-if="specialOrderWarning" class="mr-2 shop-location" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)" fill="none" fill-rule="evenodd"><path d="M10.124 8.998a2.046 2.046 0 01-1.942-2.043 2.045 2.045 0 11-4.091 0C4.09 8.085 3.175 9 2.045 9S0 8.147 0 6.545L3.273 0h9.818l3.273 6.545" stroke="#ED672F" stroke-width="1.636"/><path stroke="#ED672F" stroke-width="1.636" d="M2.455 9v7.364H9"/><path d="M18 10.636c0 2.537-4.09 6.628-4.09 6.628s-4.092-4.091-4.092-6.628c0-2.618 2.127-4.09 4.091-4.09 1.964 0 4.091 1.472 4.091 4.09z" stroke="#ED672F" stroke-width="1.636" stroke-linecap="square"/><circle fill="#ED672F" fill-rule="nonzero" cx="13.909" cy="10.636" r="1"/></g></svg>
                          <div class="label">{{ specialOrderWarning }}</div>
                        </div>
                        <template v-if="locationInventory > 0 && !disableOrdering && !isSpecial">
                          <template v-if="customPurchaseText !== false">
                            {{ customPurchaseText }}
                          </template>
                          <template v-else>
                            Purchase this product for
                            <!-- Showing Checkout types available-->
                            <span class="tabText" v-if="enabledTabs.shipping">shipping</span>
                            <span class="tabText" v-if="enabledTabs.delivery">local delivery</span>
                            <span class="tabText" v-if="enabledTabs.pickup">pickup</span>
                          </template>
                        </template>
                      </div>
                    </div>
                  </div>

                  <div>
                    <!-- If product is rental -->
                    <template v-if="forRental">
                      <span class="tabText">Pickup at
                        <strong>
                          <template v-if="currentStore">
                            {{ currentStore.name }}, {{ currentStore.address }}, {{ currentStore.city }}, {{ currentStore.state }}
                          </template>
                          <template v-else-if="businessInfo && businessInfo.locations && businessInfo.locations.length">
                            {{ businessInfo.locations[0].name }}, {{ businessInfo.locations[0].address }}, {{ businessInfo.locations[0].city }}, {{ businessInfo.locations[0].state }}
                          </template>
                        </strong>
                      </span>
                    </template>
                    <template v-else-if="!locationInventory">
                      <template v-if="specialOrdersDisallowed && settings.text.outOfStock && settings.text.outOfStock !== ''">
                        <b>{{ settings.text.outOfStock }}</b>
                      </template>
                      <!-- don't show if specialorderwarning is the same as the one we JUST printed out -->
                      <template v-else-if="!specialOrdersDisallowed
                                          && settings.text.specialOrderWarning
                                          && settings.text.specialOrderWarning !== ''
                                          && settings.text.specialOrderWarning !== specialOrderWarning">
                        {{ settings.text.specialOrderWarning }}
                      </template>
                    </template>
                  </div>

                  <!-- Display inventory disclaimer if set for product -->
                  <div v-if="hasTextSetting(product, 'inventoryDisclaimer')" class="small mt-1"
                    v-html="product.settings.inventoryDisclaimer">
                  </div>
                </div>

                <div class="mb-2" v-if="settings.text.extraProductMessage" v-html="settings.text.extraProductMessage" />

                <!-- If business has opted to show stock level and also product is not rental and
                hideQuantity is not set and showQtyInWidgets is set in project settings-->
                <div v-if="isQuantityTextVisible && !forRental" class="stock-text">
                  <!-- if the item settings have a message to show instead of quantity, prioritize that above all else -->
                  <template v-if="hasCustomQtyMessage">
                    <div class="font-weight-bold text-danger mr-5 mb-2">{{ customQtyText }}</div>
                  </template>

                  <!-- if the item is in stock, but below products.inventoryItemsMin, show "Only X Left" -->
                  <template v-else-if="showOnlyXLeft">
                    <div class="font-weight-bold text-danger mr-5 mb-2">{{ onlyXLeftText }}</div>
                  </template>

                  <!-- if the item's inventory is <= 0, we either show Out of Stock, or a special order message if
                      the item's vendor is in the whitelist (or show_oos_special=1 and it has ANY vendor) -->
                  <template v-else-if="locationInventory <= 0">
                    <!-- In case if special orders are allowed -->
                    <div class="d-flex align-items-center" v-if="specialOrdersDisallowed">
                      <div class="badge bg-danger p-2 text-white text-medium">
                        {{ outOfStockText }}
                      </div>
                      <NotifyBackInStock v-if="!hideNotifyMeOption" :productId="product.id" :productSku="product.sku" />
                    </div>
                    <div v-else class="mr-5" style="color: red;">
                      <!-- is this necessary if we already show special order warnings above this? -->
                      <div v-if="!specialOrderWarning" class="font-weight-bold">{{ specialOrderTitle }}</div>
                      <div v-if="!explcitlyAllowedSpecialOrder && settings.text.specialOrderText" class="my-2">
                        {{ settings.text.specialOrderText }}
                      </div>
                      <template v-if="settings.products.getQuoteSpecial && disableSpecialOrders">
                        <a :href="`mailto:${settings.products.getQuoteEmail}`">
                          <button type="button" class="btn btn-primary">Get Quote</button>
                        </a>
                      </template>
                    </div>
                    <div class="my-2" v-if="specialOrderTextByLocation"><i v-html="specialOrderTextByLocation"></i></div>
                  </template>

                  <!-- if we get here, the item is in stock, and it's above any "only x left" threshold, and there's
                      no custom quantity message. however, if the store doesn't want quantity to appear in
                      the product item widgets, this still won't show up. truevalue shows stock message up higher. -->
                  <template v-else-if="!isTruevalue && inStockText">
                    <!-- Display available inventory-->
                    <div class="mr-5 mb-2" v-html="inStockText"></div>

                  </template>

                  <!-- show all this crap regardless of quantity i guess? -->

                  <!-- Display onOrder if set -->
                  <span v-if="product.extra && JSON.parse(product.extra).onOrder">
                      On Order: {{JSON.parse(product.extra).onOrder}}
                    </span>

                  <!-- Display Lead time if set -->
                  <span v-if="showLeadTime">
                    Lead Time: <strong>{{ JSON.parse(product.extra).leadTime }} days </strong>
                    <small> (Lead time for QTY greater than available shown.)</small>
                  </span>

                  <!-- Display product location inside the store if available -->
                  <span v-if="validLocation && !settings.products.hideProductLocation">
                    In-Store Location: {{product.location}}
                  </span>
                  <!-- Display hyperlink for viewing other location inventory for this product -->
                  <div v-if="settings.products.showPartnerInventories">
                    <a href="#" class="my-2 d-inline-block" @click.prevent="getPartnerProductInventoryBySku(product.sku)">
                      Check Inventory at other locations
                    </a>
                    <b-modal size="md" class="modal-box" ref="InventoryAvailableAt" :lazy="false" :visible="false" hide-footer title="Inventory at other locations" @hidden="$refs.InventoryAvailableAt.hide()">
                      <div v-if="product.partner_business_product_inventory">
                        <div v-if="product.partner_business_product_inventory.length > 0 && product.partner_business_product_inventory.filter(x => x.num_inventory > 0).length > 0">
                          <div v-for="(store, i) in product.partner_business_product_inventory" :key="i">
                          <div class="mb-2 breadcrumb" v-if="store.num_inventory > 0">
                            <b class="mr-2">{{ store.num_inventory }}</b>
                            {{ getAvailabilityText(store.location) }}
                            <a class="ml-2" @click.prevent="switchStore({...store})" href="#">{{ store.business_name }}</a>
                          </div>
                          </div>
                        </div>
                        <div v-else>
                          This product is not available at any other location.
                        </div>
                      </div>
                      <div v-if="!product.partner_business_product_inventory" class="h-content-center">
                      <b-spinner  style="width: 1.4rem; height:1.4rem;" class="text-center"></b-spinner>
                      </div>
                    </b-modal>
                  </div>

                  <!-- Display the max quantity customer can order for this product in one order -->
                  <span v-if="!isTruevalue && product.extra && JSON.parse(product.extra).max_order_quantity">
                      {{ orderLimitText }}:
                      <strong>{{JSON.parse(product.extra).max_order_quantity}}</strong>
                    </span>
                </div>

                <!-- Product Change Quantity widget visible for non rental products -->
                <!-- Change is that instead of using whatever item quantity customer entered, now we would append it to existing quantity of that item in cart -->
                <div v-if="!forRental" class="quantity">
                  <div class="p-0 mb-3 size-dropdown" v-if="product.sizeCollection && product.sizeCollection.length > 0">
                    <!-- <select v-model="sizeSelected" @change="goToSizePage" class="form-control">
                      <option v-for="s in product.sizeCollection" :key="s.collection_key" :value="s" :disabled="s.selectable === false">{{ s.collection_key }}</option>
                    </select> -->
                    <v-select :options="sizeCollectionOptions" v-model="sizeSelected" @input="goToSizePage" />
                  </div>

                  <!-- Additional Check in placed to hide it if the product is marked as hidden or marked as unavailable for order both at product level or at department level -->
                  <product-change-quantity class="mb-3" v-if="isPurchasable" :qty="quantity" :cartItem="product" :special="isSpecial" :limit="locationInventory" :showRemoveItem="quantity > 0" :fPackQty="fPackQty" />

                  <!-- if  ordering is disabled from dept settings and replace message is given -->
                  <div v-else-if="product.settings.disableOrdering && product.settings.disableOrderingText && product.settings.disableOrderingText.length > 0" class="col-12 align-items-center force-left">
                    <p>{{product.settings.disableOrderingText}}</p>
                  </div>
                  <!-- display to user that this product is unavilable for order and only available in store -->
                  <div v-else-if="(product.extra && JSON.parse(product.extra).disable_order == true) && !hasTextSetting(product, 'inventoryDisclaimer')" class="col-12 align-items-center force-left">
                    <p>Product can only be purchased in store</p>
                  </div>
                </div>

                <!-- In case its a rental product, redirect to quote request form -->
                <router-link v-else-if="product" :class="{ disabled: disableRentalContactForm }"  :to="{ name: 'rental-form', params: {name: product.title, id: product.id}}" class="btn btn-primary text-center font-weight-bold mb-2">
                  {{ rentalContactText }}
                </router-link>

                <template v-if="!outOfStock && !hideFulfillmentOptions && isTruevalue">
                  <div v-if="checkoutTypes.length" class="label mt-4 mb-1">How to get it</div>
                  <div v-if="checkoutTypes.pickup" class="border-top">
                    <div class="py-3 d-flex align-items-center">
                      <div>
                        <svg width="38" height="38" viewBox="0 0 50 50" class="text-primary mr-3" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fill-rule="evenodd"><path d="M49.025 49.18H.778A.773.773 0 010 48.412c0-.424.348-.769.778-.769h48.247c.43 0 .778.345.778.769a.773.773 0 01-.778.768z"/><path d="M3.89 49.18a.773.773 0 01-.777-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM45.912 49.18a.773.773 0 01-.778-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM48.247 15.37a.778.778 0 01-.739-.526L43.017 1.537H6.787L2.294 14.844a.78.78 0 01-.985.485.766.766 0 01-.492-.972L5.488.525A.777.777 0 016.224 0h37.353c.335 0 .632.212.738.525l4.669 13.832a.766.766 0 01-.492.972.784.784 0 01-.246.04z"/><path d="M15.563 10.758h-1.556a.773.773 0 01-.778-.768c0-.425.348-.769.778-.769h1.556a.774.774 0 00.779-.768.774.774 0 00-.779-.769c-1.287 0-2.334-1.034-2.334-2.305 0-1.271 1.047-2.305 2.334-2.305h1.557c.43 0 .778.344.778.768a.773.773 0 01-.778.769h-1.557a.774.774 0 00-.778.768c0 .424.35.769.778.769 1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305zM20.232 10.758a.773.773 0 01-.778-.768V3.842c0-.424.349-.768.778-.768.43 0 .779.344.779.768V9.99a.773.773 0 01-.779.768z"/><path d="M23.345 7.684h-3.113a.773.773 0 01-.778-.768c0-.424.349-.768.778-.768h3.113c.43 0 .778.344.778.768a.773.773 0 01-.778.768z"/><path d="M23.345 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768.43 0 .778.344.778.768V9.99a.773.773 0 01-.778.768zM28.014 10.758c-1.287 0-2.334-1.034-2.334-2.305V5.379c0-1.271 1.047-2.305 2.334-2.305 1.287 0 2.335 1.034 2.335 2.305v3.074c0 1.271-1.048 2.305-2.335 2.305zm0-6.147a.774.774 0 00-.778.768v3.074c0 .423.35.768.778.768a.774.774 0 00.778-.768V5.379a.774.774 0 00-.778-.768zM32.683 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768h1.556c1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305h-.778V9.99a.773.773 0 01-.778.768zm.778-4.61h.778a.774.774 0 00.779-.769.774.774 0 00-.779-.768h-.778v1.537zM3.89 19.98c-1.715 0-3.112-1.38-3.112-3.074V14.6c0-.424.349-.768.778-.768.43 0 .779.344.779.768v2.306c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M8.56 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M13.229 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M17.898 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M22.567 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M27.236 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M31.905 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M36.574 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M41.243 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M45.912 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537V14.6c0-.424.349-.768.779-.768.43 0 .778.344.778.768v2.306c0 1.695-1.397 3.074-3.113 3.074zM47.725 13.832H2.078a.773.773 0 01-.779-.768c0-.425.349-.769.779-.769h45.647c.43 0 .778.344.778.769a.773.773 0 01-.778.768zM41.243 49.18H30.349a.773.773 0 01-.779-.768V29.969c0-.424.349-.768.779-.768h10.894c.43 0 .778.344.778.768v18.443a.773.773 0 01-.778.768zm-10.116-1.537h9.338V30.738h-9.338v16.905zM27.236 41.496H8.56a.773.773 0 01-.778-.769V29.97c0-.424.348-.768.778-.768h18.676c.43 0 .778.344.778.768v10.758a.773.773 0 01-.778.769zM9.338 39.959h17.12v-9.221H9.338v9.221z"/><g><path d="M11.673 35.348a.78.78 0 01-.55-.225.761.761 0 010-1.086l1.556-1.537c.304-.3.796-.3 1.1 0 .304.3.304.786 0 1.086l-1.556 1.537a.78.78 0 01-.55.225z"/></g><g><path d="M13.229 37.654a.78.78 0 01-.55-.225.761.761 0 010-1.087l3.112-3.074c.304-.3.797-.3 1.1 0 .305.3.305.787 0 1.087l-3.112 3.074a.78.78 0 01-.55.225z"/></g><g><path d="M38.13 41.496a.824.824 0 01-.552-.223.802.802 0 01-.226-.546c0-.2.086-.4.226-.545.295-.285.817-.285 1.105 0 .14.146.225.345.225.545 0 .2-.085.4-.225.546a.825.825 0 01-.553.223z"/></g><g><path d="M38.908 7.684a.824.824 0 01-.552-.222.802.802 0 01-.226-.546c0-.208.086-.4.226-.546.296-.284.817-.284 1.105 0 .14.146.226.346.226.546 0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"/></g><g><path d="M10.894 7.684a.788.788 0 01-.552-.222.802.802 0 01-.226-.546c0-.2.086-.4.226-.546.288-.284.817-.284 1.105 0a.79.79 0 01.226.546c0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"/></g></g></svg>
                      </div>
                      <div>
                        <div class="font-weight-bold">In-store Pickup</div>
                        <template v-if="!isSpecial">
                          <div>Pick up at {{ currentStore.name }}, {{ currentStore.zip }}</div>
                          <div class="text-small">{{ businessDetails.pickup_pdp_message }}</div>
                        </template>
                        <div v-else v-html="`Available for Special Order. Pickup In store in <b>${businessDetails.special_order_sla || '3-8 days'}</b>.` || settings.cart.specialOrderMessage" />
                      </div>
                    </div>
                  </div>
                  <div v-if="checkoutTypes.delivery && isDeliveryAllowed" class="py-3 d-flex align-items-center border-top">
                    <div>
                      <svg width="56" viewBox="0 0 88 48" class="text-primary mr-2 ml-n2" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fill-rule="evenodd"><path d="M13.438 25.943H1.225c-.6 0-1.085.48-1.085 1.076a1.08 1.08 0 001.085 1.076h12.213c.6 0 1.085-.481 1.085-1.076a1.08 1.08 0 00-1.085-1.076zM12.088 34.22h-1.257c-.6 0-1.085.48-1.085 1.076a1.08 1.08 0 001.085 1.076h1.257c.6 0 1.086-.481 1.086-1.076a1.08 1.08 0 00-1.086-1.076z"/><path d="M87.284 27.736L76.713 16.249H64.126V8.766H37.129a13.106 13.106 0 00-11.95-7.703c-7.218 0-13.092 5.822-13.092 12.979 0 6.66 5.09 12.158 11.614 12.89v7.289h-8.147c-.6 0-1.086.48-1.086 1.076a1.08 1.08 0 001.086 1.076H23.7v6.007h5.076a5.334 5.334 0 005.28 4.56 5.335 5.335 0 005.281-4.56h30.347a5.334 5.334 0 005.281 4.56 5.334 5.334 0 005.28-4.56h7.036V27.736h.002zM14.258 14.04c0-5.97 4.9-10.827 10.921-10.827 6.022 0 10.921 4.857 10.921 10.827s-4.9 10.826-10.92 10.826c-6.022 0-10.922-4.858-10.922-10.826zm19.799 30.745c-1.756 0-3.186-1.416-3.186-3.16 0-1.74 1.428-3.158 3.186-3.158 1.757 0 3.187 1.417 3.187 3.158 0 1.744-1.428 3.16-3.187 3.16zm27.898-4.559H39.203a5.34 5.34 0 00-10.288 0h-3.042V26.984c6.895-.361 12.398-6.02 12.398-12.944 0-1.079-.149-2.12-.398-3.122h24.083V40.227h-.001zm13.012 4.559c-1.757 0-3.187-1.416-3.187-3.16 0-1.74 1.429-3.158 3.187-3.158 1.757 0 3.187 1.417 3.187 3.158 0 1.744-1.43 3.16-3.187 3.16zm10.146-4.559h-5.002a5.34 5.34 0 00-10.288 0h-5.697V18.401h11.628l9.36 10.169v11.657h0z" fill-rule="nonzero"/><path d="M3.455 17.95h6.248c.6 0 1.086-.481 1.086-1.076a1.08 1.08 0 00-1.086-1.076H3.455c-.6 0-1.086.481-1.086 1.076a1.08 1.08 0 001.086 1.077z"/><path d="M24.977 15.596c.06.04.111.09.176.117.13.055.274.085.424.085h6.248c.6 0 1.086-.482 1.086-1.076a1.08 1.08 0 00-1.086-1.076h-5.163V5.43a1.08 1.08 0 00-1.085-1.076c-.6 0-1.086.481-1.086 1.076v9.292c0 .149.03.29.086.42.027.065.078.115.118.174.038.056.066.12.113.167.047.047.113.075.17.113z" /></g></svg>
                    </div>
                    <div>
                      <div class="font-weight-bold">Local Delivery</div>
                      <template v-if="deliveryLocations.length">
                        <span v-if="hideDeliveryLocationsModal">View Delivery Area</span>
                        <a v-else @click.prevent="$bvModal.show('delivery-locations-modal')" href="#">View Delivery Area</a>
                      </template>
                      <span v-else>Delivery</span>
                      for {{ currentStore.name }}, {{ currentStore.zip }}
                      <div class="text-small">{{ businessDetails.delivery_settings.delivery_pdp_message }}</div>
                    </div>
                  </div>
                  <!-- if delivery is disabled on from departments(Product Level) and Replace text is given then it will be shown -->
                  <div v-else-if="isDeliveryAllowed && product.settings.disableDeliveryText && product.settings.disableDeliveryText.length > 0" class="py-3 d-flex align-items-center border-top">
                      <div class="font-weight-bold">{{ product.settings.disableDeliveryText }}</div>
                  </div>
                  <div v-if="checkoutTypes.shipping && !product.settings.disableShipping" class="py-3 d-flex align-items-center border-top">
                    <div>
                      <svg width="40" height="33" viewBox="0 0 57 48" class="text-primary mr-3" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fill-rule="evenodd"><path d="M55.165 12.24H.875A.875.875 0 010 11.366V.874C0 .391.392 0 .876 0h54.289c.484 0 .876.391.876.874v10.492a.875.875 0 01-.876.874zM1.75 10.492H54.29V1.749H1.751v8.743z"/><path d="M50.787 47.213H5.254a.875.875 0 01-.876-.874V11.366c0-.483.392-.874.876-.874h45.533c.484 0 .875.391.875.874V46.34a.875.875 0 01-.875.874zM6.129 45.464h43.782V12.24H6.13v33.224z"/><path d="M34.15 24.48a.875.875 0 01-.57-.21l-5.56-4.758-5.56 4.758a.876.876 0 01-1.445-.663v-12.24a.875.875 0 011.751 0v10.339l4.685-4.01a.875.875 0 011.139 0l4.684 4.01v-10.34a.875.875 0 011.751 0v12.24a.875.875 0 01-.875.875zM45.533 41.967a.922.922 0 01-.622-.253.9.9 0 01-.254-.621c0-.228.096-.455.254-.62.333-.324.92-.324 1.244 0a.882.882 0 010 1.241.924.924 0 01-.622.253zM42.03 41.967a.922.922 0 01-.621-.253.9.9 0 01-.254-.621c0-.228.096-.455.254-.62.324-.324.919-.324 1.243 0a.92.92 0 01.254.62.903.903 0 01-.254.62.924.924 0 01-.622.254zM38.528 41.967a.904.904 0 01-.622-.253.916.916 0 01-.254-.621c0-.228.096-.455.254-.62.324-.324.91-.324 1.244 0a.92.92 0 01.254.62.92.92 0 01-.254.62.924.924 0 01-.622.254zM35.025 41.967a.922.922 0 01-.621-.253.916.916 0 01-.254-.621c0-.228.095-.455.254-.62.332-.324.919-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.62.908.908 0 01-.622.254zM31.523 41.967a.922.922 0 01-.622-.253.916.916 0 01-.254-.621c0-.228.096-.455.254-.62.324-.324.92-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.62.908.908 0 01-.621.254zM28.02 41.967a.922.922 0 01-.621-.253.916.916 0 01-.254-.621c0-.228.095-.455.254-.62a.918.918 0 011.243 0 .92.92 0 01.254.62.92.92 0 01-.254.62.924.924 0 01-.622.254zM24.518 41.967a.922.922 0 01-.622-.253.916.916 0 01-.254-.621c0-.228.096-.455.254-.62.324-.324.92-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.62.924.924 0 01-.621.254zM21.015 41.967a.922.922 0 01-.621-.253.9.9 0 01-.254-.621.9.9 0 01.254-.62c.324-.324.91-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.62.924.924 0 01-.622.254zM17.513 41.967a.922.922 0 01-.622-.253.916.916 0 01-.254-.621c0-.228.096-.455.254-.62.324-.324.91-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.62.924.924 0 01-.621.254zM14.01 41.967a.922.922 0 01-.622-.253.916.916 0 01-.253-.621c0-.228.095-.455.253-.62a.918.918 0 011.244 0 .92.92 0 01.254.62.92.92 0 01-.254.62.924.924 0 01-.622.254zM10.508 41.967a.922.922 0 01-.622-.253.878.878 0 01-.254-.621c0-.228.087-.455.254-.62.333-.324.92-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.62.924.924 0 01-.621.254zM42.03 38.47a.922.922 0 01-.621-.254.916.916 0 01-.254-.62.9.9 0 01.254-.621c.324-.324.919-.324 1.243 0a.903.903 0 01.254.62.92.92 0 01-.254.621.908.908 0 01-.622.254zM38.528 38.47a.922.922 0 01-.622-.254.916.916 0 01-.254-.62c0-.228.096-.455.254-.621.324-.324.91-.324 1.244 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.622.254zM35.025 38.47a.922.922 0 01-.621-.254.916.916 0 01-.254-.62c0-.228.095-.455.254-.621.324-.324.919-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.908.908 0 01-.622.254zM31.523 38.47a.922.922 0 01-.622-.254.916.916 0 01-.254-.62c0-.228.096-.455.254-.621.324-.324.92-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.908.908 0 01-.621.254zM28.02 38.47a.922.922 0 01-.621-.254.916.916 0 01-.254-.62c0-.228.095-.455.254-.621.324-.324.919-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.622.254zM24.518 38.47a.922.922 0 01-.622-.254.916.916 0 01-.254-.62c0-.228.096-.455.254-.621.324-.324.92-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.621.254zM21.015 38.47a.904.904 0 01-.621-.254.9.9 0 01-.254-.62c0-.228.095-.455.254-.621.324-.324.91-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.622.254zM17.513 38.47a.922.922 0 01-.622-.254.916.916 0 01-.254-.62c0-.228.096-.455.254-.621.324-.324.91-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.621.254zM14.01 38.47a.922.922 0 01-.622-.254.916.916 0 01-.253-.62c0-.228.095-.455.253-.621.325-.324.911-.324 1.244 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.622.254zM38.528 34.973a.889.889 0 01-.622-.254.916.916 0 01-.254-.62.9.9 0 01.254-.621c.315-.315.92-.324 1.244 0a.92.92 0 01.254.62.92.92 0 01-.254.621.908.908 0 01-.622.254zM35.025 34.973a.922.922 0 01-.621-.254.9.9 0 01-.254-.62c0-.228.095-.455.254-.621.324-.324.919-.324 1.243 0a.92.92 0 01.254.62.875.875 0 01-.263.621.887.887 0 01-.613.254zM31.523 34.973a.922.922 0 01-.622-.254.916.916 0 01-.254-.62.9.9 0 01.254-.621c.324-.324.92-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.621.254zM28.02 34.973a.922.922 0 01-.621-.254.916.916 0 01-.254-.62c0-.228.095-.455.254-.621.324-.324.919-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.622.254zM24.518 34.973a.922.922 0 01-.622-.254.916.916 0 01-.254-.62.9.9 0 01.254-.621.918.918 0 011.243 0 .92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.621.254zM21.015 34.973a.922.922 0 01-.621-.254.9.9 0 01-.254-.62c0-.228.095-.455.254-.621.324-.324.91-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.622.254zM17.513 34.973a.922.922 0 01-.622-.254.916.916 0 01-.254-.62c0-.228.096-.455.254-.621.324-.324.91-.324 1.243 0a.92.92 0 01.254.62.92.92 0 01-.254.621.924.924 0 01-.621.254zM35.025 31.475a.904.904 0 01-.621-.253.916.916 0 01-.254-.62c0-.228.095-.456.254-.622.332-.323.919-.323 1.243 0a.92.92 0 01.254.621.92.92 0 01-.254.62.908.908 0 01-.622.254zM31.523 31.475a.922.922 0 01-.622-.253.916.916 0 01-.254-.62c0-.228.096-.456.254-.622.324-.323.92-.323 1.243 0a.92.92 0 01.254.621.92.92 0 01-.254.62.924.924 0 01-.621.254zM28.02 31.475a.922.922 0 01-.621-.253.916.916 0 01-.254-.62c0-.228.095-.456.254-.622.324-.323.919-.323 1.243 0a.92.92 0 01.254.621.92.92 0 01-.254.62.924.924 0 01-.622.254zM24.518 31.475a.922.922 0 01-.622-.253.916.916 0 01-.254-.62c0-.228.096-.456.254-.622a.918.918 0 011.243 0 .92.92 0 01.254.621.92.92 0 01-.254.62.924.924 0 01-.621.254zM21.015 31.475a.922.922 0 01-.621-.253.9.9 0 01-.254-.62c0-.228.095-.456.254-.622.324-.323.919-.323 1.243 0a.92.92 0 01.254.621.92.92 0 01-.254.62.924.924 0 01-.622.254z"/></g></svg>
                    </div>
                    <div>
                      <div class="font-weight-bold">Shipping</div>
                    </div>
                  </div>
                  <!-- if Shipping is disabled on from departments(Product Level) and Replace text is given then it will be shown -->
                  <div v-else-if="product.settings.disableShipping && product.settings.disableShippingText && product.settings.disableShippingText.length > 0" class="py-3 d-flex align-items-center border-top">
                      <div class="font-weight-bold">{{ product.settings.disableShippingText }}</div>
                  </div>
                </template>
                <!-- Now showing ping option regardless of if its in-stock or not -->
                <div v-if="!hideInStorePingOption" class="pb-3 d-flex align-items-center">
                  <div v-if="!isInStorePingConfirmed" class="font-weight-bold mr-3">Will you be going in-store to purchase this product?</div>
                  <button class="btn btn-primary btn-xs" v-if="!isInStorePingConfirmed" @click="confirmInStorePing" :disabled="isConfirmingInStorePing">Yes!</button>
                  <div v-if="isInStorePingConfirmed" class="font-weight-bold mr-3">Thank you for certifying you will be purchasing this product in-store! <button class="btn btn-primary btn-xs" @click="cancelInStorePing" :disabled="isCancellingInStorePing">Cancel</button></div>
                </div>
              </div>
            </div>

            <!-- Show product description and product videos if available -->
            <div class="row d-flex flex-column-reverse flex-lg-row align-items-stretch pt-4 mt-2" ref="videoPlayer">
              <div class="col-12" :class="{'col-lg-6': settings.products.showDescription || product.description}" v-if="settings.products.showVideos && productVideos && productVideos.length">
                <div class="video-gallery border-top border-gray pt-4">
                  <div class="h5 font-weight-bold" aria-label="Videos">Videos</div>
                  <div>
                    <img v-if="!productVideos" src="/icons/loader.gif" class="loader mb-3" alt="Loading..." />
                    <p v-if="productVideos && !productVideos.length" class="video-wrapper">
                      Sorry, there are no videos for this product.
                    </p>
                    <div v-if="productVideos" class="video-wrapper">
                      <div class="row">
                        <div
                          v-for="video in productVideos" :key="'product_video_' + video.id"
                          class="col-xs-6 col-md-4 col-lg-6 video-wrapper my-2"
                          :class="{'col-sm-6': settings.products.showDescription}">
                          <a @click.prevent="changeVideo(video)" href="#" class="w-100">
                            <img :src="video.thumbnail" class="thumbnail w-100" alt="Video Thumbnail" />
                            <img src="/icons/play.png" alt="Play" class="play" />
                            <div class="video-title">
                              {{ video.name }}
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Disclaimers & Descriptions-->
              <div class="col-12" :class="{'col-lg-6': (productVideos && productVideos.length && settings.products.showVideos)}" v-if="settings.products.showDescription && product.description">
                <div class="border-top border-gray pt-4 pb-4">
                  <div class="h5 font-weight-bold" aria-label="Description">Description</div>
                  <div v-html="product.description"></div>
                  <p v-if="hasTextSetting(product, 'descriptionDisclaimer')" class="font-weight-bold" v-html="product.settings.descriptionDisclaimer">
                  </p>
                  <div class="mt-3 d-flex" v-if="product.warning_text != null">
                    <img v-if="product.warning_image" :src="product.warning_image" style="height: 60px; width: 61px;" alt="Warning" />
                    <p class="pt-0" style="line-height:16px" v-html="product.warning_text"></p>
                </div>
              </div>

              <div class="border-top border-gray pt-4 pb-4" v-if="settings.products.showSpecs != false && product.specs && product.specs.length > 0">
                <div class="h5 font-weight-bold" aria-label="Specifications">Specifications</div>
                <div v-for="spec in product.specs" :key="spec.label">
                  <b>{{ spec.label }}:</b> {{ spec.value }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Custom Suggesters From Product Suggester Admin Panel Section -->
          <div v-if="!forRental && showCustomSuggesters" class="mt-4 text-center text-md-left">
            <div class="w-100" v-for="(cs, index) in customSuggesterList" :key="index">
              <div class="w-100 mb-2">
                <h4>{{cs.value.title}}</h4>
                <div class="position-relative">
                  <img v-if="!customSuggesterList.length" src="/icons/loader.gif" class="loader">
                  <ProductSwiper :id="`custom-suggester-${index}`" v-if="showCustomSuggesters" :products="cs.value.productList" :showAddCart="true" :internalApi="false" />
                </div>
              </div>
            </div>
          </div>

          <!-- Similar Products section -->
          <div v-if="!forRental && settings.products.showSimilarProducts" class="mt-4 text-center text-md-left">
            <div class="w-100">
              <div v-if="similarProducts && similarProducts.length" class="w-100 mb-4">
                <h4>Customers Also Purchased</h4>
                <div class="position-relative">
                  <img v-if="!similarProducts.length" src="/icons/loader.gif" class="loader" alt="Loading..." />
                  <ProductSwiper id="similarProductsSwiper" v-if="similarProducts" :products="similarProducts" :showAddCart="false" :internalApi="true" />
                </div>
              </div>
            </div>
          </div>
          <!-- Top Product of brand section -->
          <div v-if="!forRental && showProductsFromBrand" class="mt-3">
            <div class="w-100">
              <div v-if="topProductsOfBrand && topProductsOfBrand.length && product.brand_id" class="w-100 mb-4 text-center text-md-left">
                <router-link :to="`/brands/${product.brand_id}?in_stock_only=1`">
                  <h4>More Products from {{product.brand_name}}</h4>
                </router-link>
                <div class="position-relative">
                  <img v-if="!topProductsOfBrand.length" src="/icons/loader.gif" class="loader" alt="Loading...">
                  <ProductSwiper id="brandsSwiper" v-if="topProductsOfBrand" :products="topProductsOfBrand" :showAddCart="false" :internalApi="true" />
                </div>
              </div>
            </div>
          </div>
          <!-- Products similar to {{current product title}} -->
          <div v-if="!forRental && showSimilarProducts" class="mt-3">
            <div class="w-100">
              <div v-if="similarWithProduct && similarWithProduct.length" class="w-100 mb-4 text-center text-md-left">
                <h4 v-if="product">Products similar to {{ product.title }}</h4>
                <div class="position-relative">
                  <img v-if="!similarWithProduct.length" src="/icons/loader.gif" class="loader" alt="Loading...">
                  <ProductSwiper id="similarProductsToSwiper" v-if="similarWithProduct" :products="similarWithProduct" :showAddCart="false" :internalApi="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <video-lightbox ref="lightbox"/>
      </div>
      <b-modal hide-footer id="delivery-locations-modal" title="Delivery Details" v-if="deliveryLocations">
         <b-table-lite outlined :items="deliveryLocations.map(location => { return { deliveryZipCodes: location.code, charge: location.fee === 0 ? 'FREE' : '$' + location.fee } })"></b-table-lite>
      </b-modal>
    </template>
    <VFooter v-if="settings.navigationLayout == 'secondary'"></VFooter>
  </div>
</template>

<script>
  import UserApiService from '@/api-services/user.service';
  import CartApiService from '@/api-services/cart.service';
  import ProductApiService from '@/api-services/product.service';
  import BrandsApiService from '@/api-services/brands.service';
  import TrackerApiService from '@/api-services/tracker.service';
  import SuggesterApiService from '@/api-services/suggester.service';
  const Breadcrumb = () => import('@/components/breadcrumb');
  const ShareDropdown = () => import('@/components/share-dropdown');
  const VFooter = () => import('../../custom-pages/gerretsen/components/Footer');
  const VSelect = () => import('@alfsnd/vue-bootstrap-select');
  const NotifyBackInStock = () => import('@/components/notify-back-in-stock');
  import {trackProductView} from "@/plugins/analytics";
  import { loadScript } from '@paypal/paypal-js';

  export default {
    name: 'SingleProductPage',
    components: {
      Breadcrumb,
      ShareDropdown,
      VFooter,
      VSelect,
      NotifyBackInStock
    },
    data() {
      return {
        loadedSimilarProducts: false,
        productVideos: null,
        productImages: null,
        similarProductsKeyPrefix: 'similar-product-',
        zoomerImages: null,
        currentImage: null,
        activeImage: 0,
        stopScroller: false,
        sizeSelected: null,
        selectedImage: null,
        product404: false,
        isInStorePingConfirmed: false,
        isConfirmingInStorePing: false,
        isCancellingInStorePing: false,
        // nonCustomerContactInfo: '',
        // nonCustomerContactInfoSent: false,
        showCustomSuggesters: false,
        customSuggesterList: []
      };
    },
    created() {
      if(this.$root.$children[0].isAdmin)
        this.logger.addLog('init', { label: 'created successfully!', readonly: true });
    },
    computed: {
      isTruevalue() {
        return this.$root.$children[0].isTruevalue;
      },
      outOfStock() {
        return this.locationInventory === 0 && !this.isSpecial;
      },
      explcitlyAllowedSpecialOrder() {
        return this.locationInventory === 0 && this.alwaysAllowSpecialOrder;
      },
      isSpecial() {
        return this.product.location == '_eztv' || this.product.location == '_ezorg' || this.product.location == '_ezdib' || this.product.location == '_ezemj' || this.explcitlyAllowedSpecialOrder;
      },
      fPackQty() {
        // In case if its an fpack item, quantity would be returned
        if(this.isSpecial && this.product.extra && JSON.parse(this.product.extra).fpack) {
          const fpackQty = parseInt(JSON.parse(this.product.extra).fpack);
          if(fpackQty) {
            return fpackQty;
          }
        }
        return 0;
      },
      isShippingAllowed() {
        if( (this.product.extra && JSON.parse(this.product.extra).disable_shipping == true) || (this.product.settings.disableShipping && this.product.settings.disableShipping == true) ){
          return false;
        }
        return true;
      },
      isDeliveryAllowed() {
        if( (this.product.extra && JSON.parse(this.product.extra).disable_delivery == true) || (this.product.settings.disableDelivery && this.product.settings.disableDelivery == true) ){
          return false;
        }
        return true;
      },
      isBasicPlan() {
        return this.$store.state.isBasicPlan;
      },
      deliveryLocations() {
        return this.forRental && this.allowRentalDeliveryLocations ? this.$store.state.businessDetails.rental_delivery_locations : this.$store.state.businessDetails.delivery_locations;
      },
      hideFulfillmentOptions() {
        return this.forRental && this.settings.rentals && this.settings.rentals.hideFulfillmentOptions
          && this.settings.rentals.hideFulfillmentOptions === true || false;
      },
      businessInfo() {
        return this.$store.state.businessInfo;
      },
      currentStore() {
        return this.$store.state.currentStore ? this.$store.state.currentStore : this.locations ? this.locations[0] : { name: '', address: '', city: '', state: '' };
      },
      locations() {
        return this.businessInfo && this.businessInfo.locations && this.businessInfo.locations.length ? this.businessInfo.locations : null;
      },
      checkoutTypes() {
        return {
          pickup: this.businessDetails.pickup_enabled,
          delivery: this.businessDetails.delivery_enabled,
          shipping: this.businessDetails.shipping_enabled && this.isShippingAllowed
        };
      },
      sizeCollectionOptions() {
        return this.product.sizeCollection.map(e => {
          e.text = e.collection_key;
          e.value = e.id;
          e.disabled = !e.selectable;
          return e;
        });
      },
      logger() {
        return this.$root.$children[0].$refs.logger;
      },
      isPurchasable() {
        return !(this.product.hidden || this.disableOrdering || !this.showPriceOutOfStock || this.disableSpecialOrders);
      },
      showLeadTime() {
        const leadTimeMax = this.settings.products.leadTimeMax || 10;
        return this.product.extra && JSON.parse(this.product.extra).leadTime && this.locationInventory < leadTimeMax;
      },
      customPurchaseText() {
        const t = this.product.settings.customPurchaseText || this.settings.text.customPurchaseText;
        return t ? t : false; // blank string is fine
      },
      showOnlyXLeft() {
        return !this.isSpecial && this.locationInventory >= 1 && this.locationInventory <= this.settings.products.inventoryItemsMin && !this.hideProductQuantity;
      },
      onlyXLeftText() {
        const text = this.settings.text.onlyXLeftText || 'Only ## Left';
        if(this.settings.products.showUnitInventory) {
          if(this.product.extra) {
            const ex = JSON.parse(this.product.extra);
            if(ex && ex.unit && ex.unit.toLowerCase() !== 'each' && ex.unit.toLowerCase() !== 'ea') {
              return text.replace("##", `${this.locationInventory} ${ex.unit}`);
            }
          }
        }
        return text.replace(`##`, this.locationInventory);
      },
      isQuantityTextVisible() {
        return this.businessDetails.show_stock_level && !this.settings.products.hideQuantity;
      },
      hasCustomQtyMessage() {
        if (this.isTruevalue && this.product.settings.qtyMessage === 'Special Order Available') {
          // TV has different special order UI handling, this ends up being a duplicate
          return false;
        }
        return this.product.settings.hideQuantity && this.product.settings.qtyMessage && this.product.settings.qtyMessage.length > 0;
      },
      customQtyText() {
        if ( !this.product.settings.qtyMessage ) {
          return '';
        }
        return this.product.settings.qtyMessage.replace(`##`, this.locationInventory);
      },
      alwaysShowProductLocation() {
        return this.settings.products.alwaysShowProductLocation || false;
      },
      inStockText() {
        // use a default message but let it be overriden by vendor-specific messages.
        // so e.g. airsupply can have text.vendorInStockText = {`2020`: `## Available in 3-5 days`}
        // for a custom message when an item in in-stock at the DIB warehouse.
        // this is 100% breaking things. editing the settings makes this a blank string so now
        // i am forcing this to check for HIDDEN instead of ''
        // if you change this back to '' it WILL BREAK SITES GUARANTEED. allendale & svendsens prove it.

        // Stores are complaining that RDC inventory is getting shown as In-stock, so hide it by default
        if (!this.isTruevalue && this.locationInventory > 0 && this.isSpecial) {
          return '';
        }

        if(this.hideProductQuantity) {
          return '';
        }

        if(this.settings.text.inStockText != 'HIDDEN') {
          let vMap = this.settings.text.vendorInStockText || {};
          let vId = this.product.vendor_id;
          let text = vId && vMap[vId] && vMap[vId].length > 0 ? vMap[vId] : this.settings.text.inStockText || '<b>##</b> In Stock';
          let cMap = this.settings.text.catalogInStockText || {};

          text = this.product.location && cMap[this.product.location] ? cMap[this.product.location] : text;
          if(this.settings.products.showUnitInventory) {
            if(this.product.extra) {
              const ex = JSON.parse(this.product.extra);
              if(ex && ex.unit && ex.unit.toLowerCase() !== 'each' && ex.unit.toLowerCase() !== 'ea') {
                return text.replace("##", `${this.locationInventory} ${ex.unit}`);
              }
            }
          }

          if(this.forRental && this.settings.rentals.rentalInStockText) {
            text = this.settings.rentals.rentalInStockText;
          }
          // Again checking text, may be vendorInStockText is hidden
          if(text == 'HIDDEN') {
            return '';
          }
          return text.replace("##", this.locationInventory);
        }
        return '';
      },
      hiddenPriceText() {
        const def = this.priceHidden(this.product) ? '' : 'Please contact us for price';
        return this.product.settings && this.product.settings.hidePriceText || this.settings.products.hiddenPriceText || def;
      },
      orderLimitText() {
        return this.isSpecial ? "Special Order limit" : "Order limit";
      },
      specialOrderTextByLocation() {
        let ret = this.settings.text.specialOrderTextByLocation
          && this.settings.text.specialOrderTextByLocation.find(e => e.id == localStorage.getItem('selectedStore'));
        return ret ? ret.text : '';
      },
      specialOrderTitle() {
        // try a specific special order title from the item first
        if ( this.product.settings && this.product.settings.specialOrderTitle
          && !this.settings.cart.hideVendorInSpecialOrder) {
          return this.product.settings.specialOrderTitle;
        }

        // then fall back to vendor-specific or default
        let text = this.settings.text.specialOrderTitle || 'Special Order';
        const vendorTextMap = this.settings.text.vendorSpecialOrderText || {};
        const vendorIdStr = "" + this.product.vendor_id;
        if ( vendorIdStr && vendorTextMap[vendorIdStr] && vendorTextMap[vendorIdStr].length > 0 ) {
          text = vendorTextMap[vendorIdStr];
        }
        return text;
      },
      validLocation() {
        return !this.product.location ? false : !/^_ez/.test(this.product.location);
      },
      regularPriceText() {
        if(!this.product.promo_price && this.productLabel) {
          return this.productLabel;
        }
        return this.settings.products.regularPriceText || 'Regular Price';
      },
      promoLabel() {
        return this.settings.products.singlePromoLabel || this.productLabel || 'Sale!';
      },
      productLabel() {
        // If a label has to be shown regardless of promo
        if ( this.product.extra ) {
          const props = JSON.parse(this.product.extra);
          if ( props && props.promoLabel && props.promoLabel != "" ) {
            return props.promoLabel;
          }
        }
        return false;
      },
      hideProductQuantity() {
        return this.product.extra && JSON.parse(this.product.extra).hide_quantity === true || false; 
      },
      promoQuantityHeader() {
        const hdr = this.settings.text.promoQuantityHeader;
        // ugly, but want to make it backwards compat for missing values while still allowing a blank option (use a dash)
        return !hdr || hdr.length === 0 ? 'Quantity discount' : hdr === '-' ? '' : hdr;
      },
      disableOrdering() {
        if (this.settings.disableOrdering) {
          if(this.$root.$children[0].isAdmin)
            this.logger.addLog('product', { label: 'Disable Ordering Setting Enabled', readonly: true });
          return true;
        }

        // If inventory is not available and product vendor is also not added in allowSpecialOrderVendors list
        if(this.locationInventory <= 0 && this.specialOrdersDisallowed) {
          return true;
        }

        // If store has disabled order for this product through Product Editor
        if(this.product.extra && JSON.parse(this.product.extra).disable_order == true) {
          if(this.$root.$children[0].isAdmin)
            this.logger.addLog('product', { label: 'Store Disabled Ordering Through Product Editor', readonly: true });
          return true;
        }

        if ( this.product.settings && this.product.settings.disableOrdering ) {
          if(this.$root.$children[0].isAdmin)
          this.logger.addLog('product', { label: 'Ordering disabled by department setting', readonly: true });
          return true;
        }

        return this.settings.products.disableOrdering || false;
      },
      product() {
        const p = this.$store.state.products.find(item => this.$route.params.slug ? item.slug === this.$route.params.slug : item.sku === this.$route.params.id);
        if (p && !p.settings) {
          p.settings = {};
        }
        return p || null;
      },
      vendorAllowed() {
        const allow = this.$store.state.allowSpecialOrderVendors;
        let allowVendor = allow.includes(this.product.vendor_id);
        if(allowVendor){
          if(this.$root.$children[0].isAdmin)
            this.logger.addLog('product', { label: 'Allow Special Order Through Vendor', value: this.product.vendor_id, readonly: true });
          return true;
        }
        return false;
      },
      similarProducts: {
        get() {
          const product = this.product;
          return product.similars || [];
        },
        set(val) {
          return val;
        }
      },
      topProductsOfBrand: {
        get() {
          if (this.product && this.product.brand_id) {
            const product =  this.$store.state.topBrandProducts.find(item => item.sku === (this.$route.params.id || this.product.sku));
            return product ? product.products.top_selling_products : [];
          }
          return [];
        },
        set(val) {
          return val;
        }
      },
      similarWithProduct: {
        get() {
          if (this.product && this.product.brand_id) {
            const product =  this.$store.state.topBrandProducts.find(item => item.sku === (this.$route.params.id || this.product.sku));
            return product ? product.products.similar_products : [];
          }
          return [];
        },
        set(val) {
          return val;
        }
      },
      popularProducts() {
        return this.$store.state.popularProducts;
      },
      favouriteProducts() {
        return this.$store.state.favouriteProducts;
      },
      popularProductsSwiper() {
        return this.$refs.popularProductsSlider.swiper;
      },
      similarProductsSwiper() {
        return this.$refs.similarProductsSwiper.swiper;
      },
      favouriteProductsSlider() {
        return this.$refs.favouriteProductsSlider.swiper;
      },
      alwaysAllowSpecialOrder() {
        return this.product.extra && JSON.parse(this.product.extra).always_allow_special_order === true || false;
      },
      specialOrdersDisallowed() {
        // outOfStock() is true if the inventory level is 0 or less,
        // AND this item's vendor is not in the list of allowed special order vendors as defined in settings,
        // AND (the business' `show out of stock as special` is false OR this item has no vendor)

        // so the item is considered `in stock` if it:
        // - has inventory
        // - or vendor is in the whitelist
        // - or show_oos_special is true AND item belongs to any vendor
        if(this.businessDetails.show_oos_special) {
          if(this.$root.$children[0].isAdmin)
            this.logger.addLog('product', { label: 'Show OOS Special Enabled', value: this.businessDetails.show_oos_special, readonly: true });
        }

        if (this.settings.products.disableSpecialOrdering) {
          return true;
        }

        if (this.alwaysAllowSpecialOrder) {
          return false;
        }

        // if vendor is allowed then this always returns false
        return parseInt(this.locationInventory) <= 0 && !this.vendorAllowed
          && (!this.businessDetails.show_oos_special || !this.product.vendor_id);
      },
      outOfStockText() {
        let text = this.settings.text.outOfStockText || 'Out of Stock';
        if(this.settings.text.outOfStockText){
          if(this.$root.$children[0].isAdmin)
            this.logger.addLog('product', { label: 'outOfStockText', value: this.settings.text.outOfStockText, readonly: true });
        }

        const vendorTextMap = this.settings.text.vendorOutOfStockText || {};
        const vendorIdStr = this.product.vendor_id;
        if(vendorIdStr && vendorTextMap[vendorIdStr] && vendorTextMap[vendorIdStr].length > 0) {
          text = vendorTextMap[vendorIdStr];
          this.$root.$children[0].isAdmin && this.logger.addLog('product', { label: 'vendorTextMap', value: text, readonly: true });
        }
        return text;
      },
      specialOrderWarning() {
        if(this.settings.text.customPurchaseTitle) {
          return this.settings.text.customPurchaseTitle;
        }

        // Not Required now
        /*if(this.product.settings.availableText) {
          return this.product.settings.availableText;
        }*/

        // for truevalue we don't want this because locationInventory can be > 0 with warehouse level.
        // also never do this if the location is _ez because it is NOT available in store in that case.
        if (!this.isTruevalue && this.locationInventory > 0 && !this.isSpecial) {
          return `Available ${this.settings.text.inStore}`;
        }

        if(this.product.settings.specialOrderWarning) {
          return this.product.settings.specialOrderWarning;
        } else if(this.product.settings.specialOrderTitle) {
          return this.product.settings.specialOrderTitle;
        }

        if(this.forRental) {
          if(this.$root.$children[0].isAdmin)
            this.logger.addLog('product', { label: 'Product Is Rental', readonly: true });
          return this.settings.text.forRental;
        } else {
          const specialOrderMssg = this.settings.text.specialOrderWarning || "SPECIAL ORDER FROM";
          if(this.$root.$children[0].isAdmin) {
            this.logger.addLog('settings', { label: 'text.specialOrderWarning', value: specialOrderMssg });
          }
          return specialOrderMssg;
        }
      },
      settings() {
        return this.$store.state.settings;
      },
      allowRentalDeliveryLocations() {
        return this.settings.rentals && this.settings.rentals.allowDeliveryLocations && this.settings.rentals.allowDeliveryLocations === true || false;
      },
      rentalDisclaimerText() {
        return this.settings.rentals && this.settings.rentals.disclaimer || "";
      },
      hideInStorePingOption() {
        return this.settings.admin && this.settings.admin.hideInStorePingOption && this.settings.admin.hideInStorePingOption === true || false;
      },
      quantity: {
        get() {
          const cartItems = this.$store.state.cart.parcels;
          if(cartItems && cartItems.length) {
            let pickupParcel = cartItems.find(item => item.type === 'pickup') || { items: [] };
            let specialParcels = cartItems.filter(item => item.type === 'special');
            let specialItems = [];
            if(specialParcels && specialParcels.length) {
              specialParcels.forEach(parcel => {
                specialItems = parcel.items && parcel.items.length ? [...specialItems, ...parcel.items] : [];
              });
            }
            let items = [...specialItems, ...pickupParcel.items];

            // sum the quantity in all matching items, items.find() just did the first one.
            return items.filter(it => it.store_product_id === this.product.id).reduce((sum, it) => sum + it.quantity, 0);
          }
          else return 0;
        },
        set(val) {
          return val;
        }
      },
      preferences() {
        return this.$store.state.preferences;
      },
      businessDetails() {
        return this.$store.state.businessDetails;
      },
      enabledTabs() {
        if(this.product && this.product.checkout_types) {
          const ct = this.product.checkout_types;
          return {
            pickup: ct.indexOf('pickup') >= 0,
            delivery: ct.indexOf('delivery') >= 0,
            shipping: ct.indexOf('shipping') >= 0
          };
        } else {
          // default to business details at first
          return {
            pickup: this.businessDetails.pickup_enabled,
            delivery: this.businessDetails.delivery_enabled,
            shipping: this.businessDetails.shipping_enabled && this.isShippingAllowed
          };
        }
      },
      forRental() {
        return this.product.is_rental;
      },
      filteredRates() {
        return this.product.rental_rates != [] ? this.product.rental_rates.filter(rate => rate.price != '' && rate.price > 0) : null;
      },
      locationInventory() {
        // see src/plugins/custom
        return EZCP.getInventoryLevel(this, this.product);
      },
      showPriceOutOfStock() {
        return this.settings.products.hidePriceOutOfStock ? !(this.product.vendor_id == 2020 && this.locationInventory < 1) : true;
      },
      disableSpecialOrders() {
        if(this.settings.products.disableSpecialOrdering == true && (this.locationInventory < 1 || this.isSpecial)) {
          if(this.$root.$children[0].isAdmin)
            this.logger.addLog('product', { label: 'products.disableSpecialOrdering', value: this.settings.products.disableSpecialOrdering });
          return true;
        }

        // In case if the product is not availabe at warehouse
        if(this.isTruevalue && this.isSpecial && this.locationInventory < 1 && !this.explcitlyAllowedSpecialOrder) {
          return true;
        }

        return false;
      },
      showProductsFromBrand() {
        return this.settings.products.showTopBrandProducts == undefined ? true : this.settings.products.showTopBrandProducts;
      },
      showSimilarProducts() {
        return this.settings.products.showSimilarProductsByProduct == undefined ? true : this.settings.products.showSimilarProductsByProduct;
      },
      mainImageAlt() {
        if(this.product.extra && JSON.parse(this.product.extra).main_img_alt != '') {
          return JSON.parse(this.product.extra).main_img_alt;
        } else {
          return this.product.title.toLowerCase();
        }
      },
      brandName() {
        return this.settings.brands.capitalize === false ? this.product.brand_name : this.$options.filters.upperCase(this.product.brand_name);
      },
      disableRentalContactForm() {
        return this.settings.rentals && this.settings.rentals.disableContactForm
          && this.settings.rentals.disableContactForm === true || false;
      },
      rentalContactText() {
        return this.settings.rentals && this.settings.rentals.rentalContactText || 'Click to Request a Quote';
      },
      titleWithoutBrand() {
        // if we are showing the brand name in the header, this returns the title without the
        // brand name in the front.
        const showBrandName = this.product.brand_name && !this.settings.products.hideBrandFromTitle;
        const useOriginalTitle = this.settings.products.useOriginalTitle && this.settings.products.useOriginalTitle === true || false;
        if ( showBrandName && !useOriginalTitle && this.product.title.toLowerCase().startsWith(this.product.brand_name.toLowerCase()) ) {
          return this.product.title.substring(this.product.brand_name.length);
        }
        return this.product.title;
      },
      userData() {
        return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      },
      hideNotifyMeOption() {
        return (this.$root.$children[0].isAdmin) || (this.settings.products.hideNotifyMeOption && this.settings.products.hideNotifyMeOption === true || false)
          || (this.isTruevalue && this.product.location == '_eztvwh');
      },
      hideSecondSpecialWarning() {
        // This check is specifically for Vue, to avoid showing special order warning twice
        // I think this is already handle in svelte
        return this.settings.products.hideSecondSpecialWarning && this.settings.products.hideSecondSpecialWarning === true || false;
      },
      allowCustomQtyOnFpackProducts(){
        // for custom qty on fpac for Papa's Hardware
        if(this.$store.state.currentStore && this.$store.state.currentStore.business_id  && this.$store.state.currentStore.business_id == 5104){
          return true;
        }
        return false;
      },
      isDoItBestBarbados() {
        if(this.$store.state.currentStore && this.$store.state.currentStore.business_id && this.$store.state.currentStore.business_id == 4290) {
          return true;
        }
        return false;
      },
      hideDeliveryLocationsModal() {
        return this.settings.products.hideDeliveryLocationsModal && this.settings.products.hideDeliveryLocationsModal === true || false;
      },
      payLaterEnabled(){
        return this.$store.state.businessDetails 
        && typeof this.$store.state.businessDetails.paypal_checkout_enabled != "undefined" 
        && (this.$store.state.businessDetails.paypal_checkout_enabled * 1)
        && typeof this.$store.state.businessDetails.paypal_paylater_enabled != "undefined" ? (this.$store.state.businessDetails.paypal_paylater_enabled * 1) : 0;        
      },
    },
    async mounted() {
      window.scrollTo(0, 0);
      await this.fetchData();

      if(this.product)
        this.$ezSetTitle(this.product.title);
      if(this.product.brand_id) {
        if(this.$root.$children[0].isAdmin) this.logger.addLog('product', { label: 'product has brand_id', readonly: true });
        await this.getTopBrandProducts(this.product.brand_id);
      }
      if(this.$root.$children[0].isAdmin) {
        this.getProductLogs();
        this.addAdminLogs();
      }

      trackProductView(this.product);
      await this.getInStorePingStatus();
      await this.getCustomSuggesters();
      this.renderPaypalMessage();
    },
    methods: {
      renderPaypalMessage(){
        setTimeout(() => {
          let price = this.product.promo_price ? this.product.promo_price : this.product.price;
          if(this.payLaterEnabled && price >= 30 && price <= 10000){
            loadScript({ 
              'client-id': this.$store.state.businessDetails.paypal_client_id,
              'intent': (this.$store.state.businessDetails.defer_cc_capture * 1) === 1 ? 'authorize' : 'capture',
              'commit': false,
              'components': 'messages',
            }).then((paypal) => {
              paypal
                .Messages({
                  amount: price,
                  placement: "product",
                  style: {
                    layout: "text",
                    logo: {
                      type: "inline",
                    },
                  },
                })
                .render('.pp-message');
            }).catch((e) => {
              console.log(e);
            });
          }        
        }, 1000);
      },
      removeImage(id) {
        if(this.productImages.length > 1)
          this.productImages = this.productImages.filter(e => e.id != id);
        if(this.productImages.findIndex(e => e.url == this.selectedImage) == -1) {
          this.selectedImage = this.productImages[0].url;
        }
      },
      zoomImage(evt) {
        // getBoundingClientReact gives us various information about the position of the element.
        var dimentions = evt.currentTarget.getBoundingClientRect();
        // Calculate the position of the cursor inside the element (in pixels).
        var x = evt.clientX - dimentions.left;
        var y = evt.clientY - dimentions.top;
        // Calculate the position of the cursor as a percentage of the total size of the element.
        var xpercent = Math.round(100 / (dimentions.width / x));
        var ypercent = Math.round(100 / (dimentions.height / y));
        // Update the background position of the image.

        this.$refs.zoomer.style.backgroundPosition = xpercent+'% ' + ypercent+'%';
      },
      getProductLogs() {
        if(this.product) {
          ProductApiService.getProductLogs({sku: this.product.sku}).then(response => {
            if(response.data.status == 'error') return;
            const cols = ['price', 'discontinued', 'hidden', 'num_inventory', 'dept_id', 'dept_name', 'last_updated'];

            this.logger.addLogs({
              group: 'Ecommerce',
              admin: true,
              data: [
                { label: 'UPC Id', value: this.product.upc_id },
                { label: 'Inventory', value: this.product.num_inventory },
                { label: 'Location', value: this.product.location },
                { label: 'Vendor Id', value: this.product.vendor_id },
                { label: 'Product id', value: this.product.product_id },
                { label: 'Model', value: this.product.model_number },
                { label: 'Allowed Checkout Types', value: this.product.checkout_types.join(',') },
                { label: 'Settings', value: this.product.settings, type: "button"},
                { label: 'Extra', value: this.product.extra ? JSON.parse(this.product.extra) : {}, type: "button"}
            ]});
            this.logger.addLog('Sync Stats', { label: 'Last Updated', value: response.data.logs.date_modified, admin: true });

            response.data.logs.steps.forEach(step => {
              Object.entries(step.data).forEach(([key, value]) => {
                if(cols.includes(key)) {
                  this.logger.addLog(step.message, { label: key, value: value, admin: true });
                }
              });
              this.logger.addLog(step.message, { label: 'Data', value: step.data, admin: true, type: 'button' });
              Object.keys(step.changed).length > 0 && this.logger.addLog(step.message, { label: 'Changed', value: step.changed, admin: true, type: 'button' });
              Object.keys(step.added).length > 0 && this.logger.addLog(step.message, { label: 'Added', value: step.added, admin: true, type: 'button' });
            });
          }).catch(() => console.log('Exception in product logs'));
        }
      },
      addAdminLogs() {
        this.logger.addLogs({
          group: 'Settings',
          data: [
            { label: 'products.hideReg', value: this.settings.products.hideReg },
            { label: 'text.specialOrderTextByLocation', value: this.settings.text.specialOrderTextByLocation }
          ]
        });
        this.logger.addLogs({
          group: 'Products',
          data: [
            { label: 'products.hidePrice', value: this.settings.products.hidePrice, type: 'boolean' },
            { label: 'products.hideUpc', value: this.settings.products.hideUpc, type: 'boolean' },
            { label: 'products.hideReg', value: this.settings.products.hideReg, type: 'boolean' },
            { label: 'products.regularPriceText', value: this.settings.products.regularPriceText },
            { label: 'products.currencyPrefix', value: this.settings.products.currencyPrefix },
            { label: 'products.getQuoteSpecial', value: this.settings.products.getQuoteSpecial },
            { label: 'products.getQuoteEmail', value: this.settings.products.getQuoteEmail },
            { label: 'products.hideProductLocation', value: this.settings.products.hideProductLocation, type: 'boolean' },
            { label: 'products.showDescription', value: this.settings.products.showDescription, type: 'boolean' },
            { label: 'products.showVideos', value: this.settings.products.showVideos, type: 'boolean' },
            { label: 'products.showSimilarProducts', value: this.settings.products.showSimilarProducts, type: 'boolean' },
            { label: 'products.leadTimeMax', value: this.settings.products.leadTimeMax },
            { label: 'products.inventoryItemsMin', value: this.settings.products.inventoryItemsMin },
            { label: 'products.disableOrdering', value: this.settings.products.disableOrdering, type: 'boolean' },
            { label: 'products.hidePriceOutOfStock', value: this.settings.products.hidePriceOutOfStock, type: 'boolean' },
            { label: 'products.disableSpecialOrdering', value: this.settings.products.disableSpecialOrdering, type: 'boolean' },
            { label: 'products.showTopBrandProducts', value: this.settings.products.showTopBrandProducts, type: 'boolean' },
            { label: 'products.showSimilarProductsByProduct', value: this.settings.products.showSimilarProductsByProduct, type: 'boolean' },
            { label: 'products.hideQuantity', value: this.settings.products.hideQuantity, type: 'boolean' }
          ]
        });

        this.product.vendor_id && this.logger.addLog('product', { label: 'VendorId', value: this.product.vendor_id, readonly: true });
        this.logger.addLog('product', { label: 'text.inStockText', value: this.settings.text.inStockText });
        this.logger.addLog('product', { label: 'Show Price Out Of Stock', value: this.showPriceOutOfStock });
        this.product.hidden && this.logger.addLog(`product`, { label: 'Product is marked as hidden', readonly: true });
        this.logger.addLog('product', { label: 'Stock Level', value: `${this.businessDetails.show_stock_level ? ``: `Not `}Showing`, readonly: true });
        this.locationInventory <= 0 && this.specialOrdersDisallowed && this.logger.addLog('product', { label: 'Product is either 0 qty or specialOrdersDisallowed', readonly: true });
      },
      goToSizePage() {
        if(this.sizeSelected.slug && (this.product.sku !== this.sizeSelected.sku)) {
          this.$router.push({ name: 'products-slug', params: {slug: this.sizeSelected.slug} });
        }
      },
      makeProductImages(im) {
        return im ? [{ id: 1, url: this.product.image_url}, ...im.map(e => ({ id: e.id, url: e.image, alt_tag: e.alt_tag }))] : [];
      },
      priceHidden(product) {
        return (product.extra && JSON.parse(product.extra).hide_price) || (this.settings && this.settings.products.hidePrice) || (product.settings && product.settings.hidePrice);
      },
      hasTextSetting(product, field) {
         if(product.settings && product.settings[field] && product.settings[field].length > 0){
           if(this.$root.$children[0].isAdmin)
            this.logger.addLog('product', { label: 'Has Text Settings For', value: field });
           return true;
         }
         return false;
      },
      changeVideo(video) {
        this.$refs.lightbox.changeVideo(video);
      },
      parseRentalRates(rates) {
        rates = JSON.parse(rates);
        return rates;
      },
      getAvailabilityText(location) {
        return location && /^_ez/.test(location) ? "Available for special order at" : "Available at";
      },
      copyIframeToClipboard() {
        let button = document.querySelector('#copyIframeBtn');
        let btnHTML = button.innerHTML;

        let iframe = `<iframe style="overflow: hidden;" src="${window.location.protocol}//${window.location.host}/product/shared/preview/${this.product.sku}?iframe=true" width="250" height="280"></iframe>`;
        let textArea = document.createElement('textarea');
        textArea.classList = 'shadow-elm';
        textArea.style.position = 'fixed';
        textArea.value = iframe;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        button.innerHTML = 'Copied!';
        setTimeout(() => button.innerHTML = btnHTML, 3000);
        document.body.removeChild(textArea);
      },
      editProduct(product) {
        const store = localStorage.getItem('selectedStore');
        window.open(`/admin/settings/product-editor?code=${product.sku}&type=sku&store=${store}`);
      },
      async getTopBrandProducts(brandId) {
        var sku = this.$route.params.id || this.product.sku;
        let isBrandId = this.$store.state.topBrandProducts.find(item => item.sku === sku);
        if(!isBrandId) {
          ProductApiService.getTopProductsOfBrand(brandId, sku).then(res => {
            let products = res.data.data;
            this.$store.commit('addTopBrandProducts', { products, sku });
          });
        }
      },
      async fetchData() {
        // redirect is not a function?
        //if (!this.$route.params.slug && !this.$route.params.id) return redirect('/');
        let params = this.$route.params;

        let products = this.$store.state.products;
        let product = products.find(item => (params.id && item.sku === params.id) || (params.slug && item.slug === params.slug));

        if(!products.length || !product || !product.breadcrumbs) {
          let response = params.slug ? await ProductApiService.getProductBySlug(escape(params.slug)).catch(() => {}) : await ProductApiService.getProduct(escape(params.id)).catch(() => {});
          if(!response) {
            this.product404 = true;
            return;
          }

          if(!product) {
            product = response.data.data;
            if(product.rental_rates) {
              product.rental_rates = this.parseRentalRates(product.rental_rates);
            }
            product.similars = null;
            product.videos = null;
            product.sizeCollection = response.data.data.collection;
            this.currentImage = product.image_url;
            this.$store.commit('addProduct', product);
          } else {
            product.breadcrumbs = response.data.data.breadcrumbs;
          }
        }
        TrackerApiService.trackProduct(product.sku);

        if(this.product) {
          if (this.product.sizeCollection && this.product.sizeCollection.length > 0) {
            this.sizeSelected = this.product.sizeCollection.find(x => x.slug == this.$route.params.slug);
          }
          this.productImages = this.makeProductImages(this.product.extra_images);
          this.selectedImage = this.productImages[0].url;
        }
        if (!this.popularProducts || !this.favouriteProducts) {
          ProductApiService.getPopularProducts(product.sku).then(response => {
            let allProducts = [];
            response.data.data.forEach(item => {
              item.similars = null;
              item.videos = null;
              allProducts.push(item);
            });

            this.$store.commit('addProductsRange', allProducts);
            this.$store.commit('setPopularProducts', allProducts);

            let allSKUs = [];
            allProducts.forEach(item => {
              allSKUs.push(item.sku);
            });
          });
        }
        if(!product.similars) {
          ProductApiService.getSimiliarProducts(product.upc).then(response => {
            let allSKUs = [];
            let similarProducts = {
              productId: product.id,
              data: response.data.data,
            };

            similarProducts.data.forEach(item => {
              allSKUs.push(item.upc);
            });
            this.$store.commit('setSimilarProducts', similarProducts);
          }).catch(() => {
            this.loadedSimilarProducts = true;
            this.similarProducts = [];
          });
        } else {
          this.similarProducts = product.similars;
        }
        if (!product.videos) {
          ProductApiService.getVideos(product.upc).then(response => {
            let payload = {productId: product.id, data: response.data.data};
            this.$store.commit('setProductVideos', payload);
            this.productVideos = payload.data;
          }).catch(() => {
              this.productVideos = [];
          });
        } else {
          this.productVideos = product.videos;
        }
      },
      selectImage(url) {
        this.selectedImage = url;
      },
      async getBrandNameById(brandId) {
        let response = await BrandsApiService.getBrandById(+brandId);
        response = response.data.data;
        return response.brand_name;
      },
      switchStore({business_id, slug, business_name}) {
        this.selectedStore = business_id;
        this.storeName = business_name;
        this.$swal({
          title: 'Switch Store',
          html: `Are you sure you want to switch locations? If you switch locations, you will lose your existing cart.`,
          type: 'warning',
          reverseButtons:true,
          showCancelButton: true,
          confirmButtonText: 'Yes'
        }).then(r => {
          if(r.value) {
            this.saveStore(slug);
          }
        });
        // const { path } = this.$router.history.current;
        // return `${website_domain.replace(/\/#/,"")}${path}`;
      },
      saveStore(newSlug) {
        const store = localStorage.getItem('selectedStore');
        if(this.userInfo) {
          this.$store.dispatch('fetchBusinessInfo');
          UserApiService.saveStore({store: this.selectedStore}).then(() => {
            if(this.selectedStore !== store) {
              this.emptyCartAndReload(newSlug);
            }
          });
        }
        this.$store.commit('setCurrentStore');
        // if userinfo exists we're already doing this
        if(!this.userInfo && this.selectedStore !== store) {
          this.emptyCartAndReload(newSlug);
        }
      },
      async emptyCartAndReload(newSlug) {
        localStorage.setItem('selectedStore', this.selectedStore);
        this.$emit('changed', { id: this.selectedStore, name: this.storeName });
        if(this.$store.state.cartItemCount > 0) {
          await CartApiService.emptyCart();
        }
        this.$store.dispatch('fetchCartItemsDetails');
        window.location = `/p/${newSlug}`;
      },
      async getPartnerProductInventoryBySku(sku) {
        this.$refs.InventoryAvailableAt.show();
        ProductApiService.getPartnerProductInventoryBySku(sku).then(({ data }) => this.$store.commit('setPartnerBusinessProductInventory', { sku, data }));
      },
      async getInStorePingStatus() {
        const productId = this.product.id;
        const customerId = this.userData ? parseInt(this.userData.data.id) : 0;
        await TrackerApiService.getInStorePingStatus(productId, customerId).then(res => {
          if(res.data.in_store_ping_status == true) {
            this.isInStorePingConfirmed = true;
          } else {
            this.isInStorePingConfirmed = false;
          }
        });
      },
      async confirmInStorePing() {
        if(this.userData && this.userData.is_admin) {
          this.$swal({
            title: "You can't ping products as an admin",
            type: 'warning',
          });
          return;
        }

        const inStorePingInfo = {
          product_id: this.product.id,
          product_url: window.location.href,
          customer_id: this.userData ? parseInt(this.userData.data.id) : 0
        };

        this.isConfirmingInStorePing = true;
        await TrackerApiService.saveInStorePingInfo(inStorePingInfo).then(res => {
          /*if(res.data.result == 'Already Pinged!') {
            this.$swal({
              title: 'You already pinged this product today!',
              type: 'warning',
            });
          }*/
          if(res.data.in_store_ping_saved == 'Ping successful!') {
            this.isConfirmingInStorePing = false;
            this.isInStorePingConfirmed = true;
          }}
        );
      },
      async cancelInStorePing() {
        const inStorePingInfo = {
          product_id: this.product.id,
          product_url: window.location.href,
          customer_id: this.userData ? parseInt(this.userData.data.id) : 0
        };

        this.isCancellingInStorePing = true;
        await TrackerApiService.cancelInStorePing(inStorePingInfo).then(res => {
          if(res.data.in_store_ping_result == 'Cancel successful!') {
            this.isCancellingInStorePing = false;
            this.isInStorePingConfirmed = false;
          }}
        );
      },
      async sendNonCustomerInfoForInStorePing() {
        this.nonCustomerContactInfoSent = true;

        const inStorePingContactInfo = {
          product_id: this.product.id,
          contact_info: this.nonCustomerContactInfo
        };

        await TrackerApiService.handleContactInfoForNonCustomerInStorePing(inStorePingContactInfo).then(res => {
          if(res.data.data.result == 'Already Pinged!') {
            this.$swal({
              title: 'You already pinged this product today!',
              type: 'warning',
            });
          }
          if(res.data.data.result == 'Ping successful!') {
            this.$swal({
              title: 'Thanks for letting us know!',
              type: 'success',
            });
          }}
        );
      },
      async getCustomSuggesters() {
        if(this.product){
          let identifiers = {
            deptId: this.product.dept_id,
            classId: this.product.class_id,
            finelineId: this.product.fineline_id,
            sku: this.product.sku
          };
          await SuggesterApiService.getSuggestersForSingleProductPage(identifiers).then(res => {
            if(res.data.suggesters_found_for_product.length) {
              this.showCustomSuggesters = true;
              this.customSuggesterList = res.data.suggesters_found_for_product;
            }
          });
        }        
      }
    }
  };
</script>


<style lang="scss" scoped>
  .text-muted {
    h2 {
      font-size: 0.875rem;
      display: inline-block;
    }
  }

  h1.prod-title {
    font-size: 2rem;
  }

  .force-left {
    padding-left: 0 !important;
  }

  .h-content-center{
  justify-content:center;
  display:flex;
  }

  :deep(.v-select) {
    height: 40px !important;
    width: auto !important;
    display: inline-flex;
    .v-select-toggle {
      height: 40px;
      padding-top: 9px;
      display: inline-flex;
    }
    .v-dropdown-item {
      &:not(.disabled) {
        font-weight: bold;
      }
      &.disabled {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &::after {
          content: 'Out of Stock';
        }
      }
    }
  }

  p {
    font-size: 14px;
    line-height: 22px;
  }
  .swiper-slide {
    width: auto !important;
    height: 300px;
  }

  .swiper-button-disabled {
    opacity: 0;
  }
  .label {
    text-transform: uppercase;
    font-size: 14px;
    font-weight: bold;
  }
  a.product-img-box {
    height: 70px;
    border: 1px solid lightgray;
    cursor: pointer;
    &.active {
      border: 2px solid var(--primary);
      cursor: default;
    }
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  .product-img-box-sm {
    width: 50px;
    height: 50px;
    border: 1px solid lightgray;
    &.active {
      border: 2px solid var(--primary);
    }
  }

  .product-details-box {
    &.secondary {
      padding-top: 16px;

      @media (max-height: 767px) {
        padding-top: 8px;
      }
    }
  }

  .price-and-promo {
    display: flex;

    > div {
      &:not(:last-child) {
        margin-right: 32px;
      }
    }

    @media(max-width: 767px) {
      flex-direction: column;

      > div {
        &:not(:last-child) {
          margin-top: 8px;
          margin-bottom: 8px;
          margin-right: 0;
        }
      }
    }
  }

  .prices {
    .price {
      font-size: 32px;
      font-weight: bold;

      @media (max-width: 767px) {
        font-size: 28px;
      }
    }
    .old-price {
      font-size: 18px;
      color: #797979;
    }
  }

  .has-promo {
    .price,
    .label {
      color: #de3131;
    }
  }
  .promo-message {
    font-size: 1rem;
    line-height: 1rem;
    font-weight: bold;
    color: var(--primary);
    padding: 6px 8px;
    margin-top: 8px;
    margin-bottom: 12px;
    position: relative;
    display: inline-block;

    &:after {
      content: '';
      width: 100%;
      height: 100%;
      border-radius: 4px;
      background: var(--primary);
      opacity: 0.1;
      position: absolute;
      top: 0;
      left: 0;
    }

    @media (max-width: 767px) {
      font-size: 0.875rem;
      margin-top: 4px;
    }
  }

  .quantity {
    display: inline-block;
  }

  @media (max-width: 480px) {
    .swiper-slide {
      width: 100% !important;
      > .card {
        width: 100% !important;
        max-width: 230px;
        margin: 0 auto !important;
      }
    }
    .swiper-button-next {
      right: 0;
    }
    .swiper-button-prev {
      left: 0;
    }
  }

  #productDetails {
    margin-top: 16px;
  }

  @keyframes fade-in {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }

  .pr-8 {
    padding-right: 84px;
  }

  ::v-deep .product-details-box {
    padding: 0 0 50px;
    min-height: calc((var(--vh, 1vh) * 100) - 327px);
  }
  .card.card-primary > .card-header {
    font-size: 18px;
  }
  .card.card-primary > p > button {
    background: transparent;
    border: none;
    color: #ed6730;
  }
  .card.card-description > .title {
    font-size: 14px;
    color: #979A9F;
  }
  .card.card-primary .shop-location {
    * {
      stroke: var(--primary);
    }
    circle {
      fill: var(--primary);
    }
  }

  .card.card-primary > p > button:focus {
    box-shadow: none;
    outline: none;
  }
  .card.card-primary > .card-body {
    font-size: 14px;
  }
  .card.card-primary > .card-body,
  .card.card-primary > .card-header {
    padding: 20px;
    @media screen and (max-width: 768px) {
      padding: 15px 12px;
    }
  }

  .card .card-body > h6 {
    font-size: 14px;
    margin-bottom: 15px;
    line-height: 16px;
    color: #222529;
  }

  .card .card-body {
    .stock-text {
      font-size: 14px;
      margin-bottom: 15px;
      line-height: 16px;
      color: #979A9F;
    }
    .purchase-info {
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 500;
      line-height: 16px;
      display: flex;
      align-items: center;
      padding-right: 10px;
      color: #000;
    }
  }

  .tabText:not(:last-child)::after {
    content: ', ';
  }
  .tabText:nth-last-child(2)::after {
    content: ' or '
  }

  .actions > div > input {
    width: 80px;
    margin-right: 15px;
    border-radius: 5px;
    border: 1px solid #00000020;
  }

  .card.card-primary {
    .card-body {
      .swiper-container {
        border: none !important;
      }
    }
  }

  .video-gallery {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 500px;

    > .row {
      margin-left: -10px;
      margin-right: -10px;
    }

    .video-wrapper {
      position: relative;
      padding-left: 10px;
      padding-right: 10px;
      align-items: center;
      justify-content: center;
      img.thumbnail {
        width: 100%;
        height: 100%;
        min-width: 200px;
        object-fit: cover;
        cursor: pointer;
      }

      img.play {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
      }

      .video-title {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.4);
        width: calc(100% - 20px);
        color: #fff;
        padding: 0 10px;
        left: 10px;
        bottom: 10px;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .product-section {
    background: #fff;
    border-radius: 3px;
    border: 1px solid #e9e9e9;
    .model {
      margin-top: 16px;
      margin-bottom: 11px;
    }

    .special span {
      margin-right: 8px;
    }
  }

  #productDetails .header-info > .w-40 {
    width: calc(40% - 4px);
  }

  #productDetails .header-info > .w-60 {
    width: calc(60% - 4px);
  }

  .product-preview {
    height: 400px;
    padding: 20px;
    border: 1px solid #ccc;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .product-image {
      flex: 1;
    }
  }
  .img-thumb {
    height: 60px;
    &.selected {
      border-color: var(--primary) !important;
    }
  }
  #product-preview-mobile {
    padding: 10px;
    background: #fff;
    margin-bottom: 16px;
    border: 1px solid #ccc;

    img {
      max-width: 100%;
      max-height: 40vh;
      margin: 0 auto;
      display: block;
    }
  }

  .shadow-elm {
    position: fixed;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    padding: 0;
    border: none;
    outline: none;
    box-shadow: none;
    background: transparent;
  }

  @media (max-width: 1199px) {
    .product-section {
      .box-element {
        .card {
          p {
            padding: 30px !important;
            font-size: 14px !important;
          }
        }
      }
    }
  }
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    #productDetails {
      .product-section {
        .w-40 {
          height: 100% !important;
        }
        .w-60 {
          h1 {
            font-size: 20px;
          }
          h2 {
            font-size: 20px;
          }
        }
        .model {
          display: flex;
          justify-content: space-between;

          span {
            margin-left: 0 !important;
            font-size: 13px;
          }
        }
      }
    }
  }
  @media (max-width: 992px) {

    .box-element {
      margin-top: 15px !important;
      height: unset !important;
      flex-direction: column;
      .w-50 {
        width: 100% !important;
      }
    }
    .w-60 {
      h1 {
        font-size: 1.2rem;
      }
      h2 {
        font-size: 1.2rem;
      }
    }
  }
  @media (max-width: 767px) {
    #productDetails {
      .header-info > .w-60 {
        display: flex !important;
        justify-content: flex-start !important;
      }
      .product-section {
        background: none;
        border: none;
      }
    }
    .card-primary {
      margin-top: 10px;
    }
    .product-description {
      padding: 0 !important;
    }
    .box-element {
      margin-top: 0 !important;
      height: unset !important;
    }
    .product-section .w-40 {
      height: 100% !important;
    }
    #productDetails .product-section .model {
      display: flex;
      justify-content: space-between;
      span {
        margin-left: 0 !important;
        font-size: 13px;
      }
    }
    .product-details-box {
      padding-bottom: 10px;
    }
  }
  @media (max-width: 576px) {
    a.product-img-box {
      height: 50px !important;
    }
    .pr-8 {
      padding-right: 0;
    }
    .justify-content-end {
      justify-content: flex-start !important;
    }
    #productDetails {
      .product-section {
        h1 {
          font-size: 20px;
          margin-bottom: 0;
        }
        h2 {
          font-size: 20px;
          margin-bottom: 0;
        }
        .model {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          span {
            margin-left: 0 !important;
            font-size: 13px;
          }
        }
      }

      h4 {
        font-size: 18px;
      }
      .product-description {
        .w-60 {
          padding: 0 !important;
        }

        .w-40 {
          padding: 0 !important;
        }
      }
    }
  }
  .zoomer {
    position: absolute;
    width: 600px;
    height: 400px;
    z-index: 10000;
    border: 1px solid #ccc;
    overflow: hidden;
    left: 100%;
    background-repeat: no-repeat;
    background-color: #fff;
    background-size: auto 1000px;
  }

  @media (max-width: 1110px) {
    .zoomer {
      width: 500px;
    }
  }
  @media (max-width: 900px) {
    .zoomer {
      width: 430px;
    }
  }
</style>
