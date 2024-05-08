<template>
  <div v-if="$ezHasNoPermission('manage_orders')">
    <NoPermission />
  </div>
  <div v-else>
    <div class="pt-4">
      <div :class="!isMobileWidth ? 'container' : 'mobile-container'">
        <h4 class="m-0 mb-3">All Orders</h4>
        <div class="d-flex mt-3" :class="isMobileWidth ? 'pr-2' : ''">
          <div class="col-1 navigation-column" :class="{ 'nav-button-hidden': pageWidth >= 395 }">
            <button class="navigation-button previous" ref="prevButton" @click="navigateToPrevious()">&lt;</button>
          </div>
          <div class="col-10 px-0">
            <div class="navigation-links" ref="navContainer">
              <ul class="nav tabs" style="flex-wrap: nowrap;">
                <li class="nav-item">
                  <router-link to="outstanding" class="nav-link d-flex align-items-center" :class="{'active':$route.params.type=='outstanding'}">
                    Outstanding<span class="d-none d-sm-inline">&nbsp;Orders</span> <div v-if="outstandingOrders.data" class="d-none d-sm-block ml-2 count">{{ outstandingOrders.data.count }}</div>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="ready" class="nav-link d-flex align-items-center" :class="{'active':$route.params.type=='ready'}">
                    <span class="d-none d-sm-inline">Orders&nbsp;</span>Ready <div v-if="readyOrders.data" class="d-none d-sm-block ml-2 count">{{ readyOrders.data.count }}</div>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="completed" class="nav-link d-flex align-items-center" :class="{'active':$route.params.type=='completed'}">
                    Completed<span class="d-none d-sm-inline">&nbsp;Orders</span>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="cancelled" class="nav-link d-flex align-items-center" :class="{'active':$route.params.type=='cancelled'}">
                    Cancelled<span class="d-none d-sm-inline">&nbsp;Orders</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
          <div v-if="pageWidth < 395" class="col-1 navigation-column">
            <button class="navigation-button next" ref="nextButton" @click="navigateToNext()">&gt;</button>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <b-tabs nav-wrapper-class="d-none" lazy>
        <b-tab :active="$route.params.type == 'outstanding'" id="outstanding">
          <OrdersTable v-if="outstandingOrders" ref="outstandingOrdersTable" title="Outstanding Orders" :ordersColumns="outstandingOrdersColumns" :orders="outstandingOrders" :enableNewOrderNotification="enableNewOrderNotification" @ordersFunction="getOutstandingOrders" @sorting-function-outstanding="sortOutstanding" @removeFilter="removeOutstandingFilter" :sortOptions="sortOptions">
            <template slot="column" slot-scope="props" :props="props">
              <div v-if="props.props.column.label == 'Business'">
                <b-dropdown v-if="locations.length > 1" text="Business" class="m-md-2">
                  <li v-for="l in locations" :key="`olocation-${l.business_id}`" class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input :class="`styled-checkbox`" :id="`${l.business_id}-olocation`" :value="l.business_id" type="checkbox" v-model="outstandingOrders.locations" />
                    <label class="small font-weight-bold text-uppercase" :for="`${l.business_id}-olocation`">{{l.name}}</label>
                  </li>
                </b-dropdown>
                <template v-else>{{props.props.column.label}}</template>
              </div>
              <div v-else-if="props.props.column.label == 'CUST_TYPE'">
                <b-dropdown text="CUST_TYPE" class="m-md-2">
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="regular-ocust" value="regular" type="checkbox" v-model="outstandingOrders.customerType" />
                    <label class="small font-weight-bold text-uppercase" for="regular-ocust">Regular</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="contractor-ocust" value="contractor" type="checkbox" v-model="outstandingOrders.customerType" />
                    <label class="small font-weight-bold text-uppercase" for="contractor-ocust">Contractor</label>
                  </li>
                </b-dropdown>
              </div>
              <div v-else-if="props.props.column.label == 'PAY_TYPE'">
                <b-dropdown text="PAY_TYPE" class="m-md-2">
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="authonly-opay" value="authonly" type="checkbox" v-model="outstandingOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="authonly-opay">Credit card (Pre-auth)</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="creditcard-opay" value="creditcard" type="checkbox" v-model="outstandingOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="creditcard-opay">Credit card (Charged)</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="instore-opay" value="instore" type="checkbox" v-model="outstandingOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="instore-opay">Pay in Store/Person</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="receivables-opay" value="receivables" type="checkbox" v-model="outstandingOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="receivables-opay">Account Recievables (Contractors)</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="paypal_exp_checkout" value="paypal_exp_checkout" type="checkbox" v-model="outstandingOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="paypal_exp_checkout">Paypal Exp Checkout </label>
                  </li>
                </b-dropdown>
              </div>
              <div v-else-if="props.props.column.label == 'Type'">
                <b-dropdown text="Type" class="m-md-2">
                  <li v-for="check in checkBoxes" :key="`otype-${check}`" class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input :class="`styled-checkbox ${check}`" :id="`${check}-otype`" :value="check" type="checkbox" v-model="outstandingOrders.filters" />
                    <label class="small font-weight-bold text-uppercase" :for="`${check}-otype`">{{check}}</label>
                  </li>
                </b-dropdown>
              </div>
              <div v-else>{{props.props.column.label}}</div>
            </template>
            <template slot="row" slot-scope="props">
              <div :style="{ width: mobileFirstRowWidth, maxWidth: mobileFirstRowWidth, paddingLeft: '8px' }" v-if="props.props.column.field == 'id' && isMobileWidth">
                <div class="row mb-2 d-flex justify-content-between" :style="{ width: mobileRowWidth, maxWidth: mobileRowWidth }">
                  <div class="col-5"><b>Order <router-link style="text-decoration: underline;" :to="props.props.formattedRow['prepare_order']">#{{props.props.row.id}}</router-link></b></div>
                  <div class="col-7 d-flex justify-content-end align-items-center" :class="pageWidth < 330 ? 'mt-4' : ''" style="padding-right: 10px;">
                    <svg v-if="pageWidth > 335" style="margin-right: 10px;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"><path stroke="#64748B" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 3v4h3m3 0A6 6 0 1 1 .999 7 6 6 0 0 1 13 7Z"/></svg>
                    <div v-html="props.props.row.date_purchased_mobile"></div>
                  </div>
                </div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" style="margin-left: 1px;" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'customer_name' && isMobileWidth">
                <div v-html="props.props.row.customer_name_mobile"></div>
              </div>
              <div class="row pl-2 pt-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'business_name' && isMobileWidth">
                <div class="col-6 mobile-column-field">Business</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.business_name}}</div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'customer_type' && isMobileWidth">
                <div class="col-6 mobile-column-field">Customer Type</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.customer_type}}</div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'claimer' && isMobileWidth">
                <div class="col-6 mobile-column-field">Claimer</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end" :class="pageWidth < 360 ? 'mt-4' : ''" v-html="props.props.row.claimer_mobile"></div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'payment_type' && isMobileWidth">
                <div class="col-6 mobile-column-field">Payment Type</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.payment_type}}</div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'item_count' && isMobileWidth">
                <div class="col-6 mobile-column-field">Items</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.item_count}}</div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'order_type' && isMobileWidth">
                <div class="col-6 mobile-column-field">Type</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end" v-html="props.props.row.order_type_mobile"></div>
              </div>
              <div class="row pl-2 pb-1 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'total' && isMobileWidth">
                <div class="col-6 mobile-column-field">Total</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">${{props.props.row.total}}</div>
              </div>
              <div class="row pl-2 mb-1 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'prepare_order' && isMobileWidth">
                <div :class="{'col-1': isAdvancedShippingEnabled, 'col-6': !isAdvancedShippingEnabled}" @click="selectedOrder = props.props.row.id">
                  <a href="#" class="notes-bt" :style="{ background: props.props.row.notes_count > 0 ? '#E86767' : '#FEF3C7'}" @click.prevent="$refs.notesList.show(props.props.row.id)">
                    <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7822 8.04647C13.7822 10.1279 13.7822 12.2093 13.7822 14.2907C13.7822 15.1459 13.2844 15.8173 12.4967 16.0197C12.3282 16.0598 12.1553 16.0789 11.9821 16.0768C8.59706 16.0801 5.21178 16.0801 1.82626 16.0768C0.733518 16.0786 0 15.3461 0 14.2591C0 10.1147 0 5.97033 0 1.82593C0 0.86094 0.578489 0.165103 1.50077 0.0176101C1.60781 0.00347238 1.71581 -0.00216745 1.82375 0.00074349C5.20855 0.00074349 8.59383 0.00074349 11.9796 0.00074349C13.0476 -0.000333101 13.7804 0.732826 13.7804 1.80296C13.7823 3.88437 13.7823 5.96578 13.7804 8.04719L13.7822 8.04647ZM12.6338 8.05724C12.6338 5.98181 12.6338 3.9065 12.6338 1.83131C12.6338 1.36479 12.421 1.14947 11.9573 1.14947H1.83738C1.36368 1.14803 1.15016 1.36335 1.15016 1.84136C1.15016 5.98025 1.15016 10.1192 1.15016 14.258C1.15016 14.7095 1.36978 14.9298 1.82052 14.9298H11.9581C12.4221 14.9298 12.6334 14.7163 12.6334 14.248C12.6339 12.1843 12.6334 10.1207 12.632 8.05724H12.6338Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.89194 8.61238C6.24024 8.61238 5.58854 8.61238 4.93685 8.61238C4.57224 8.61238 4.31027 8.37338 4.30776 8.04323C4.30525 7.71307 4.56757 7.46546 4.92823 7.4651C6.23737 7.46366 7.54674 7.46366 8.85636 7.4651C9.21809 7.4651 9.47648 7.7102 9.47396 8.04359C9.47145 8.37697 9.21307 8.61238 8.84703 8.61238C8.19533 8.61406 7.54363 8.61406 6.89194 8.61238Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.87049 5.16732C6.22453 5.16732 5.57858 5.16732 4.93262 5.16732C4.56981 5.16732 4.3082 4.92508 4.30641 4.59313C4.30461 4.26118 4.56874 4.01895 4.93047 4.01895C6.23362 4.01895 7.53666 4.01895 8.83958 4.01895C9.21566 4.01895 9.47656 4.26011 9.47261 4.59995C9.46902 4.93047 9.2092 5.16445 8.84137 5.16516C8.18537 5.16947 7.52793 5.16732 6.87049 5.16732Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.88483 12.0575C6.23888 12.0575 5.59292 12.0575 4.94697 12.0575C4.57196 12.0575 4.3064 11.816 4.3064 11.4812C4.30855 11.1532 4.57124 10.9113 4.93548 10.9109C6.24414 10.9095 7.55304 10.9095 8.86217 10.9109C9.18515 10.9109 9.43241 11.1187 9.46973 11.408C9.48805 11.5487 9.45359 11.6912 9.37301 11.8081C9.29242 11.9249 9.17142 12.0078 9.03335 12.0406C8.96308 12.0546 8.89142 12.0602 8.81983 12.0575C8.17555 12.0592 7.53055 12.0592 6.88483 12.0575Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/></svg>
                  </a>
                </div>
                <div v-if="props.props.row.order_type == 'shipping' && isAdvancedShippingEnabled && isMobileWidth" class="col-5 d-flex justify-content-start">
                  <button v-b-modal.shippingLabels class="p-0 bg-transparent border-0" style="padding-top: 2px !important;" @click="() => selectedOrderForShipping = props.props.row">
                    <img src="/images/shipping.png" width="32" height="32"/>
                  </button>
                </div>
                <div class="col-5 d-flex justify-content-end" style="padding-right: 0px;">
                  <router-link :to="props.props.formattedRow[props.props.column.field]" class="btn-action text-tiny">
                    Prepare Order
                  </router-link>
                </div>
              </div>
              <div v-else-if="props.props.column.field == 'id' && !isMobileWidth">
                <router-link :to="props.props.formattedRow['prepare_order']">#{{props.props.row.id}}</router-link>
              </div>
              <router-link v-else-if="props.props.column.field == 'prepare_order'" :to="props.props.formattedRow[props.props.column.field]" class="btn-action text-tiny">
                Prepare Order
              </router-link>
              <div v-else-if="props.props.column.field == 'notes' && !isMobileWidth" @click="selectedOrder = props.props.row.id">
                <a href="#" class="notes-bt" :style="{ background: props.props.row.notes_count > 0 ? '#E86767' : '#FEF3C7'}" @click.prevent="$refs.notesList.show(props.props.row.id)" aria-label="Show Note">
                  <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7822 8.04647C13.7822 10.1279 13.7822 12.2093 13.7822 14.2907C13.7822 15.1459 13.2844 15.8173 12.4967 16.0197C12.3282 16.0598 12.1553 16.0789 11.9821 16.0768C8.59706 16.0801 5.21178 16.0801 1.82626 16.0768C0.733518 16.0786 0 15.3461 0 14.2591C0 10.1147 0 5.97033 0 1.82593C0 0.86094 0.578489 0.165103 1.50077 0.0176101C1.60781 0.00347238 1.71581 -0.00216745 1.82375 0.00074349C5.20855 0.00074349 8.59383 0.00074349 11.9796 0.00074349C13.0476 -0.000333101 13.7804 0.732826 13.7804 1.80296C13.7823 3.88437 13.7823 5.96578 13.7804 8.04719L13.7822 8.04647ZM12.6338 8.05724C12.6338 5.98181 12.6338 3.9065 12.6338 1.83131C12.6338 1.36479 12.421 1.14947 11.9573 1.14947H1.83738C1.36368 1.14803 1.15016 1.36335 1.15016 1.84136C1.15016 5.98025 1.15016 10.1192 1.15016 14.258C1.15016 14.7095 1.36978 14.9298 1.82052 14.9298H11.9581C12.4221 14.9298 12.6334 14.7163 12.6334 14.248C12.6339 12.1843 12.6334 10.1207 12.632 8.05724H12.6338Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.89194 8.61238C6.24024 8.61238 5.58854 8.61238 4.93685 8.61238C4.57224 8.61238 4.31027 8.37338 4.30776 8.04323C4.30525 7.71307 4.56757 7.46546 4.92823 7.4651C6.23737 7.46366 7.54674 7.46366 8.85636 7.4651C9.21809 7.4651 9.47648 7.7102 9.47396 8.04359C9.47145 8.37697 9.21307 8.61238 8.84703 8.61238C8.19533 8.61406 7.54363 8.61406 6.89194 8.61238Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.87049 5.16732C6.22453 5.16732 5.57858 5.16732 4.93262 5.16732C4.56981 5.16732 4.3082 4.92508 4.30641 4.59313C4.30461 4.26118 4.56874 4.01895 4.93047 4.01895C6.23362 4.01895 7.53666 4.01895 8.83958 4.01895C9.21566 4.01895 9.47656 4.26011 9.47261 4.59995C9.46902 4.93047 9.2092 5.16445 8.84137 5.16516C8.18537 5.16947 7.52793 5.16732 6.87049 5.16732Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.88483 12.0575C6.23888 12.0575 5.59292 12.0575 4.94697 12.0575C4.57196 12.0575 4.3064 11.816 4.3064 11.4812C4.30855 11.1532 4.57124 10.9113 4.93548 10.9109C6.24414 10.9095 7.55304 10.9095 8.86217 10.9109C9.18515 10.9109 9.43241 11.1187 9.46973 11.408C9.48805 11.5487 9.45359 11.6912 9.37301 11.8081C9.29242 11.9249 9.17142 12.0078 9.03335 12.0406C8.96308 12.0546 8.89142 12.0602 8.81983 12.0575C8.17555 12.0592 7.53055 12.0592 6.88483 12.0575Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/></svg>
                </a>
              </div>
              <div class="d-flex justify-content-center" v-else-if="props.props.column.field == 'shipping' && props.props.row.order_type == 'shipping' && isAdvancedShippingEnabled && !isMobileWidth">
                <button v-b-modal.shippingLabels class="p-0 bg-transparent border-0" @click="() => selectedOrderForShipping = props.props.row" aria-label="Show Shipping Labels">
                  <img src="/images/shipping.png" width="32" height="32" alt="Shipping" />
                </button>
              </div>
              <div v-else>
                <template v-if="!isMobileWidth">
                  <div class="td-label d-none">{{props.props.column.label}}</div>
                  <span class="text-wrap" v-html="props.props.formattedRow[props.props.column.field]"></span>
                </template>
              </div>
            </template>
          </OrdersTable>
        </b-tab>
        <b-tab :active="$route.params.type == 'ready'" id="ready">
          <OrdersTable v-if="readyOrders" ref="readyOrdersTable" title="Orders Ready" :ordersColumns="readyOrdersColumns" :orders="readyOrders" @ordersFunction="getReadyOrders" @sorting-function-ready="sortReady" @removeFilter="removeReadyFilter" :sortOptions="sortOptions">
            <template slot="column" slot-scope="props" :props="props">
              <div v-if="props.props.column.label == 'Business'">
                <b-dropdown v-if="locations.length > 1" text="Business" class="m-md-2">
                  <li v-for="l in locations" :key="`rlocation-${l.business_id}`" class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input :class="`styled-checkbox`" :id="`${l.business_id}-rlocation`" :value="l.business_id" type="checkbox" v-model="readyOrders.locations" />
                    <label class="small font-weight-bold text-uppercase" :for="`${l.business_id}-rlocation`">{{l.name}}</label>
                  </li>
                </b-dropdown>
                <template v-else>{{props.props.column.label}}</template>
              </div>
              <div v-else-if="props.props.column.label == 'CUST_TYPE'">
                <b-dropdown text="CUST_TYPE" class="m-md-2">
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="regular-rcust" value="regular" type="checkbox" v-model="readyOrders.customerType" />
                    <label class="small font-weight-bold text-uppercase" for="regular-rcust">Regular</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="contractor-rcust" value="contractor" type="checkbox" v-model="readyOrders.customerType" />
                    <label class="small font-weight-bold text-uppercase" for="contractor-rcust">Contractor</label>
                  </li>
                </b-dropdown>
              </div>
              <div v-else-if="props.props.column.label == 'PAY_TYPE'">
                <b-dropdown text="PAY_TYPE" class="m-md-2">
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="authonly-rpay" value="authonly" type="checkbox" v-model="readyOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="authonly-rpay">Credit card (Pre-auth)</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="creditcard-rpay" value="creditcard" type="checkbox" v-model="readyOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="creditcard-rpay">Credit card (Charged)</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="instore-rpay" value="instore" type="checkbox" v-model="readyOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="instore-rpay">Pay in Store/Person</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="receivables-rpay" value="receivables" type="checkbox" v-model="readyOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="receivables-rpay">Account Recievables (Contractors)</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="paypal_exp_checkout1" value="paypal_exp_checkout" type="checkbox" v-model="readyOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="paypal_exp_checkout1">Paypal Exp Checkout </label>
                  </li>
                </b-dropdown>
              </div>
              <div v-else-if="props.props.column.label == 'Type'">
                <b-dropdown text="Type" class="m-md-2">
                  <li v-for="check in checkBoxes" :key="`rtype-${check}`" class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input :class="`styled-checkbox ${check}`" :id="`${check}-rtype`" :value="check" type="checkbox" v-model="readyOrders.filters" />
                    <label class="small font-weight-bold text-uppercase" :for="`${check}-rtype`">{{check}}</label>
                  </li>
                </b-dropdown>
              </div>
              <div v-else>{{props.props.column.label}}</div>
            </template>
            <template slot="row" slot-scope="props">
              <div :style="{ width: mobileFirstRowWidth, maxWidth: mobileFirstRowWidth, paddingLeft: '12px', paddingTop: '10px', paddingBottom: '10px' }" v-if="props.props.column.field == 'id' && isMobileWidth">
                <div class="row d-flex justify-content-between" :style="{ width: mobileRowWidth, maxWidth: mobileRowWidth }">
                  <div class="col-5"><b>Order <router-link style="text-decoration: underline;" :to="`/admin/order-details/${props.props.row.id}`">#{{props.props.row.id}}</router-link></b></div>
                  <div class="col-7 d-flex justify-content-end align-items-center" :class="pageWidth < 330 ? 'mt-4' : ''" style="padding-right: 10px;">
                    <svg v-if="pageWidth > 335" style="margin-right: 10px;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"><path stroke="#64748B" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 3v4h3m3 0A6 6 0 1 1 .999 7 6 6 0 0 1 13 7Z"/></svg>
                    <div v-html="props.props.row.date_purchased_mobile"></div>
                  </div>
                </div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" style="margin-left: 1px;" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'customer_name' && isMobileWidth">
                <div v-html="props.props.row.customer_name_mobile"></div>
              </div>
              <div class="row pl-2 pt-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'business' && isMobileWidth">
                <div class="col-6 mobile-column-field">Business</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.business_name}}</div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'customer_type' && isMobileWidth">
                <div class="col-6 mobile-column-field">Customer Type</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.customer_type}}</div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'claimer' && isMobileWidth">
                <div class="col-6 mobile-column-field">Claimer</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end" v-html="props.props.row.claimer_mobile"></div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'payment_type' && isMobileWidth">
                <div class="col-6 mobile-column-field">Payment Type</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.payment_type}}</div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'item_count' && isMobileWidth">
                <div class="col-6 mobile-column-field">Items</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.item_count}}</div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'order_type' && isMobileWidth">
                <div class="col-6 mobile-column-field">Type</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end" v-html="props.props.row.order_type_mobile"></div>
              </div>
              <div class="row pl-2 pb-1 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'total' && isMobileWidth">
                <div class="col-6 mobile-column-field">Total</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">${{props.props.row.total}}</div>
              </div>
              <div v-else-if="props.props.column.field == 'id' && !isMobileWidth">
                <router-link :to="`/admin/order-details/${props.props.row.id}`">#{{props.props.row.id}}</router-link>
              </div>
              <div v-else-if="props.props.column.field == 'notes' && !isMobileWidth" @click="selectedOrder = props.props.row.id">
                <a href="#" class="notes-bt" :style="{ background: props.props.row.notes_count > 0 ? '#E86767' : '#FEF3C7'}" @click.prevent="$refs.notesList.show(props.props.row.id)" aria-label="Show Note">
                  <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7822 8.04647C13.7822 10.1279 13.7822 12.2093 13.7822 14.2907C13.7822 15.1459 13.2844 15.8173 12.4967 16.0197C12.3282 16.0598 12.1553 16.0789 11.9821 16.0768C8.59706 16.0801 5.21178 16.0801 1.82626 16.0768C0.733518 16.0786 0 15.3461 0 14.2591C0 10.1147 0 5.97033 0 1.82593C0 0.86094 0.578489 0.165103 1.50077 0.0176101C1.60781 0.00347238 1.71581 -0.00216745 1.82375 0.00074349C5.20855 0.00074349 8.59383 0.00074349 11.9796 0.00074349C13.0476 -0.000333101 13.7804 0.732826 13.7804 1.80296C13.7823 3.88437 13.7823 5.96578 13.7804 8.04719L13.7822 8.04647ZM12.6338 8.05724C12.6338 5.98181 12.6338 3.9065 12.6338 1.83131C12.6338 1.36479 12.421 1.14947 11.9573 1.14947H1.83738C1.36368 1.14803 1.15016 1.36335 1.15016 1.84136C1.15016 5.98025 1.15016 10.1192 1.15016 14.258C1.15016 14.7095 1.36978 14.9298 1.82052 14.9298H11.9581C12.4221 14.9298 12.6334 14.7163 12.6334 14.248C12.6339 12.1843 12.6334 10.1207 12.632 8.05724H12.6338Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.89194 8.61238C6.24024 8.61238 5.58854 8.61238 4.93685 8.61238C4.57224 8.61238 4.31027 8.37338 4.30776 8.04323C4.30525 7.71307 4.56757 7.46546 4.92823 7.4651C6.23737 7.46366 7.54674 7.46366 8.85636 7.4651C9.21809 7.4651 9.47648 7.7102 9.47396 8.04359C9.47145 8.37697 9.21307 8.61238 8.84703 8.61238C8.19533 8.61406 7.54363 8.61406 6.89194 8.61238Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.87049 5.16732C6.22453 5.16732 5.57858 5.16732 4.93262 5.16732C4.56981 5.16732 4.3082 4.92508 4.30641 4.59313C4.30461 4.26118 4.56874 4.01895 4.93047 4.01895C6.23362 4.01895 7.53666 4.01895 8.83958 4.01895C9.21566 4.01895 9.47656 4.26011 9.47261 4.59995C9.46902 4.93047 9.2092 5.16445 8.84137 5.16516C8.18537 5.16947 7.52793 5.16732 6.87049 5.16732Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.88483 12.0575C6.23888 12.0575 5.59292 12.0575 4.94697 12.0575C4.57196 12.0575 4.3064 11.816 4.3064 11.4812C4.30855 11.1532 4.57124 10.9113 4.93548 10.9109C6.24414 10.9095 7.55304 10.9095 8.86217 10.9109C9.18515 10.9109 9.43241 11.1187 9.46973 11.408C9.48805 11.5487 9.45359 11.6912 9.37301 11.8081C9.29242 11.9249 9.17142 12.0078 9.03335 12.0406C8.96308 12.0546 8.89142 12.0602 8.81983 12.0575C8.17555 12.0592 7.53055 12.0592 6.88483 12.0575Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/></svg>
                </a>
              </div>
              <div class="row pl-1 d-flex justify-content-between mobile-bottom-row" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'markAsComplete' && isMobileWidth">
                <div class="col-1 pl-1" v-if="props.props.row.payment_type == 'In Store'">
                  <button v-b-modal.inStoreDisclaimerModal class="p-0 bg-transparent border-0" @click="() => selectedDisclaimer = props.props.row.id">
                    <svg xmlns="http://www.w3.org/2000/svg" style="padding-top: 6px !important;" class="mx-2" width="22" fill="none" viewBox="0 0 24 24" stroke="#EF4444"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </button>
                </div>
                <div :class="{'col-1 pl-2': isAdvancedShippingEnabled, 'col-6': !isAdvancedShippingEnabled}" @click="selectedOrder = props.props.row.id">
                  <a href="#" class="notes-bt" :style="{ background: props.props.row.notes_count > 0 ? '#E86767' : '#FEF3C7'}" @click.prevent="$refs.notesList.show(props.props.row.id)">
                    <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7822 8.04647C13.7822 10.1279 13.7822 12.2093 13.7822 14.2907C13.7822 15.1459 13.2844 15.8173 12.4967 16.0197C12.3282 16.0598 12.1553 16.0789 11.9821 16.0768C8.59706 16.0801 5.21178 16.0801 1.82626 16.0768C0.733518 16.0786 0 15.3461 0 14.2591C0 10.1147 0 5.97033 0 1.82593C0 0.86094 0.578489 0.165103 1.50077 0.0176101C1.60781 0.00347238 1.71581 -0.00216745 1.82375 0.00074349C5.20855 0.00074349 8.59383 0.00074349 11.9796 0.00074349C13.0476 -0.000333101 13.7804 0.732826 13.7804 1.80296C13.7823 3.88437 13.7823 5.96578 13.7804 8.04719L13.7822 8.04647ZM12.6338 8.05724C12.6338 5.98181 12.6338 3.9065 12.6338 1.83131C12.6338 1.36479 12.421 1.14947 11.9573 1.14947H1.83738C1.36368 1.14803 1.15016 1.36335 1.15016 1.84136C1.15016 5.98025 1.15016 10.1192 1.15016 14.258C1.15016 14.7095 1.36978 14.9298 1.82052 14.9298H11.9581C12.4221 14.9298 12.6334 14.7163 12.6334 14.248C12.6339 12.1843 12.6334 10.1207 12.632 8.05724H12.6338Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.89194 8.61238C6.24024 8.61238 5.58854 8.61238 4.93685 8.61238C4.57224 8.61238 4.31027 8.37338 4.30776 8.04323C4.30525 7.71307 4.56757 7.46546 4.92823 7.4651C6.23737 7.46366 7.54674 7.46366 8.85636 7.4651C9.21809 7.4651 9.47648 7.7102 9.47396 8.04359C9.47145 8.37697 9.21307 8.61238 8.84703 8.61238C8.19533 8.61406 7.54363 8.61406 6.89194 8.61238Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.87049 5.16732C6.22453 5.16732 5.57858 5.16732 4.93262 5.16732C4.56981 5.16732 4.3082 4.92508 4.30641 4.59313C4.30461 4.26118 4.56874 4.01895 4.93047 4.01895C6.23362 4.01895 7.53666 4.01895 8.83958 4.01895C9.21566 4.01895 9.47656 4.26011 9.47261 4.59995C9.46902 4.93047 9.2092 5.16445 8.84137 5.16516C8.18537 5.16947 7.52793 5.16732 6.87049 5.16732Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.88483 12.0575C6.23888 12.0575 5.59292 12.0575 4.94697 12.0575C4.57196 12.0575 4.3064 11.816 4.3064 11.4812C4.30855 11.1532 4.57124 10.9113 4.93548 10.9109C6.24414 10.9095 7.55304 10.9095 8.86217 10.9109C9.18515 10.9109 9.43241 11.1187 9.46973 11.408C9.48805 11.5487 9.45359 11.6912 9.37301 11.8081C9.29242 11.9249 9.17142 12.0078 9.03335 12.0406C8.96308 12.0546 8.89142 12.0602 8.81983 12.0575C8.17555 12.0592 7.53055 12.0592 6.88483 12.0575Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/></svg>
                  </a>
                </div>
                <div v-if="props.props.row.order_type == 'shipping' && isAdvancedShippingEnabled && isMobileWidth" class="col-5 d-flex justify-content-start">
                  <button v-b-modal.shippingLabels class="p-0 bg-transparent border-0" style="padding-top: 2px !important;" @click="() => selectedOrderForShipping = props.props.row">
                    <img src="/images/shipping.png" width="32" height="32"/>
                  </button>
                </div>
                <div class="col-5 d-flex justify-content-end">
                  <button
                    :disabled="markingAsCompleted == props.props.row['id'] || (props.props.row.payment_type == 'In Store' && !props.props.row.disclaimer_confirmed)"
                    class="btn-action text-tiny"
                    @click="markAsComplete(props.props.row['id'])">
                      <div v-if="markingAsCompleted == props.props.row['id']" class="spinner spinner-border spinner-border-sm mr-2" />
                      Mark as {{pastTense(props.props.row.order_type)}}
                  </button>
                </div>
              </div>
              <button
                v-else-if="props.props.column.field == 'markAsComplete'"
                :disabled="markingAsCompleted == props.props.row['id'] || (props.props.row.payment_type == 'In Store' && !props.props.row.disclaimer_confirmed)"
                class="btn-action text-tiny"
                @click="markAsComplete(props.props.row['id'])">
                  <div v-if="markingAsCompleted == props.props.row['id']" class="spinner spinner-border spinner-border-sm mr-2" />
                  Mark as {{pastTense(props.props.row.order_type)}}
              </button>
              <div class="d-flex justify-content-center" v-else-if="props.props.column.field == 'in_store_disclaimer' && props.props.row.payment_type == 'In Store' && !isMobileWidth">
                <button v-b-modal.inStoreDisclaimerModal class="p-0 bg-transparent border-0" @click="() => selectedDisclaimer = props.props.row.id" aria-label="Show Disclaimer Modal">
                  <svg xmlns="http://www.w3.org/2000/svg" class="mx-2" width="22" fill="none" viewBox="0 0 24 24" stroke="#EF4444"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </button>
              </div>
              <div class="d-flex justify-content-center" v-else-if="props.props.column.field == 'shipping' && props.props.row.order_type == 'shipping' && isAdvancedShippingEnabled && !isMobileWidth">
                <button v-b-modal.shippingLabels class="p-0 bg-transparent border-0" @click="() => selectedOrderForShipping = props.props.row" aria-label="Show Shipping Labels">
                  <img src="/images/shipping.png" width="32" height="32" alt="Shipping" />
                </button>
              </div>
              <template v-else>
                <span v-html="props.props.formattedRow[props.props.column.field]"></span>
              </template>
            </template>
          </OrdersTable>
        </b-tab>
        <b-tab :active="$route.params.type == 'completed'" id="completed">
          <OrdersTable v-if="completedOrders" ref="completedOrdersTable" title="Completed Orders" :ordersColumns="completedOrdersColumns" :orders="completedOrders" @ordersFunction="getCompletedOrders" @sorting-function-completed="sortCompleted"  @removeFilter="removeCompletedFilter" :sortOptions="sortOptions">
            <template slot="column" slot-scope="props" :props="props">
              <div v-if="props.props.column.label == 'Business'">
                <b-dropdown v-if="locations.length > 1" text="Business" class="m-md-2">
                  <li v-for="l in locations" :key="`colocation-${l.business_id}`" class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input :class="`styled-checkbox`" :id="`${l.business_id}-colocation`" :value="l.business_id" type="checkbox" v-model="completedOrders.locations" />
                    <label class="small font-weight-bold text-uppercase" :for="`${l.business_id}-colocation`">{{l.name}}</label>
                  </li>
                </b-dropdown>
                <template v-else>{{props.props.column.label}}</template>
              </div>
              <div v-else-if="props.props.column.label == 'CUST_TYPE'">
                <b-dropdown text="CUST_TYPE" class="m-md-2">
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="regular-cocust" value="regular" type="checkbox" v-model="completedOrders.customerType" />
                    <label class="small font-weight-bold text-uppercase" for="regular-cocust">Regular</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="contractor-cocust" value="contractor" type="checkbox" v-model="completedOrders.customerType" />
                    <label class="small font-weight-bold text-uppercase" for="contractor-cocust">Contractor</label>
                  </li>
                </b-dropdown>
              </div>
              <div v-else-if="props.props.column.label == 'PAY_TYPE'">
                <b-dropdown text="PAY_TYPE" class="m-md-2">
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="authonly-copay" value="authonly" type="checkbox" v-model="completedOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="authonly-copay">Credit card (Pre-auth)</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="creditcard-copay" value="creditcard" type="checkbox" v-model="completedOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="creditcard-copay">Credit card (Charged)</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="instore-copay" value="instore" type="checkbox" v-model="completedOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="instore-copay">Pay in Store/Person</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="receivables-copay" value="receivables" type="checkbox" v-model="completedOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="receivables-copay">Account Recievables (Contractors)</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="paypal_exp_checkout2" value="paypal_exp_checkout" type="checkbox" v-model="completedOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="paypal_exp_checkout2">Paypal Exp Checkout </label>
                  </li>
                </b-dropdown>
              </div>
              <div v-else-if="props.props.column.label == 'Type'">
                <b-dropdown text="Type" class="m-md-2">
                  <li v-for="check in checkBoxes" :key="`cotype-${check}`" class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input :class="`styled-checkbox ${check}`" :id="`${check}-cotype`" :value="check" type="checkbox" v-model="completedOrders.filters" />
                    <label class="small font-weight-bold text-uppercase" :for="`${check}-cotype`">{{check}}</label>
                  </li>
                </b-dropdown>
              </div>
              <div v-else>{{props.props.column.label}}</div>
            </template>
            <template slot="row" slot-scope="props">
              <div :style="{ width: mobileFirstRowWidth, maxWidth: mobileFirstRowWidth, paddingLeft: '12px', paddingTop: '10px' }"  v-if="props.props.column.field == 'id' && isMobileWidth">
                <div class="row mb-2 d-flex justify-content-between" :style="{ width: mobileRowWidth, maxWidth: mobileRowWidth }">
                  <div class="col-5"><b>Order <router-link style="text-decoration: underline;" :to="`/admin/order-details/${props.props.row.id}`">#{{props.props.row.id}}</router-link></b></div>
                  <div class="col-7 d-flex justify-content-end align-items-center" :class="pageWidth < 330 ? 'mt-4' : ''" style="padding-right: 10px;">
                    <svg v-if="pageWidth > 335" style="margin-right: 10px;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"><path stroke="#64748B" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 3v4h3m3 0A6 6 0 1 1 .999 7 6 6 0 0 1 13 7Z"/></svg>
                    <div v-html="props.props.row.date_purchased_mobile"></div>
                  </div>
                </div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" style="margin-left: 1px;" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'customer_name' && isMobileWidth">
                <div v-html="props.props.row.customer_name_mobile"></div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'business' && isMobileWidth">
                <div class="col-6 mobile-column-field">Business</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.business_name}}</div>
              </div>
              <div class="row pl-2 pt-2 d-flex justify-content-betwee" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'customer_type' && isMobileWidth">
                <div class="col-6 mobile-column-field">Customer Type</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.customer_type}}</div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'store_number' && isMobileWidth">
                <div class="col-6 mobile-column-field">Store</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end" v-html="props.props.row.store_number"></div>
              </div>
              <div class="row pt-2 d-flex justify-content-between" style="padding-right: 8px !important; margin-left: -7px;" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'claimer' && isMobileWidth">
                <div class="col-6 mobile-column-field">Claimer</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end" v-html="props.props.row.claimer_mobile"></div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'payment_type' && isMobileWidth">
                <div class="col-6 mobile-column-field">Payment Type</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.payment_type}}</div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'item_count' && isMobileWidth">
                <div class="col-6 mobile-column-field">Items</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.item_count}}</div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'order_type' && isMobileWidth">
                <div class="col-6 mobile-column-field">Type</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end" v-html="props.props.row.order_type_mobile"></div>
              </div>
              <div class="row pl-2 pb-1 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'total' && isMobileWidth">
                <div class="col-6 mobile-column-field">Total</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">${{props.props.row.total}}</div>
              </div>
              <div class="row pl-3 pt-2 d-flex" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'notes' && isMobileWidth">
                <div :class="{'col-1': isAdvancedShippingEnabled, 'col-6': !isAdvancedShippingEnabled}" @click="selectedOrder = props.props.row.id">
                  <a href="#" class="notes-bt" :style="{ background: props.props.row.notes_count > 0 ? '#E86767' : '#FEF3C7'}" @click.prevent="$refs.notesList.show(props.props.row.id)">
                    <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7822 8.04647C13.7822 10.1279 13.7822 12.2093 13.7822 14.2907C13.7822 15.1459 13.2844 15.8173 12.4967 16.0197C12.3282 16.0598 12.1553 16.0789 11.9821 16.0768C8.59706 16.0801 5.21178 16.0801 1.82626 16.0768C0.733518 16.0786 0 15.3461 0 14.2591C0 10.1147 0 5.97033 0 1.82593C0 0.86094 0.578489 0.165103 1.50077 0.0176101C1.60781 0.00347238 1.71581 -0.00216745 1.82375 0.00074349C5.20855 0.00074349 8.59383 0.00074349 11.9796 0.00074349C13.0476 -0.000333101 13.7804 0.732826 13.7804 1.80296C13.7823 3.88437 13.7823 5.96578 13.7804 8.04719L13.7822 8.04647ZM12.6338 8.05724C12.6338 5.98181 12.6338 3.9065 12.6338 1.83131C12.6338 1.36479 12.421 1.14947 11.9573 1.14947H1.83738C1.36368 1.14803 1.15016 1.36335 1.15016 1.84136C1.15016 5.98025 1.15016 10.1192 1.15016 14.258C1.15016 14.7095 1.36978 14.9298 1.82052 14.9298H11.9581C12.4221 14.9298 12.6334 14.7163 12.6334 14.248C12.6339 12.1843 12.6334 10.1207 12.632 8.05724H12.6338Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.89194 8.61238C6.24024 8.61238 5.58854 8.61238 4.93685 8.61238C4.57224 8.61238 4.31027 8.37338 4.30776 8.04323C4.30525 7.71307 4.56757 7.46546 4.92823 7.4651C6.23737 7.46366 7.54674 7.46366 8.85636 7.4651C9.21809 7.4651 9.47648 7.7102 9.47396 8.04359C9.47145 8.37697 9.21307 8.61238 8.84703 8.61238C8.19533 8.61406 7.54363 8.61406 6.89194 8.61238Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.87049 5.16732C6.22453 5.16732 5.57858 5.16732 4.93262 5.16732C4.56981 5.16732 4.3082 4.92508 4.30641 4.59313C4.30461 4.26118 4.56874 4.01895 4.93047 4.01895C6.23362 4.01895 7.53666 4.01895 8.83958 4.01895C9.21566 4.01895 9.47656 4.26011 9.47261 4.59995C9.46902 4.93047 9.2092 5.16445 8.84137 5.16516C8.18537 5.16947 7.52793 5.16732 6.87049 5.16732Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.88483 12.0575C6.23888 12.0575 5.59292 12.0575 4.94697 12.0575C4.57196 12.0575 4.3064 11.816 4.3064 11.4812C4.30855 11.1532 4.57124 10.9113 4.93548 10.9109C6.24414 10.9095 7.55304 10.9095 8.86217 10.9109C9.18515 10.9109 9.43241 11.1187 9.46973 11.408C9.48805 11.5487 9.45359 11.6912 9.37301 11.8081C9.29242 11.9249 9.17142 12.0078 9.03335 12.0406C8.96308 12.0546 8.89142 12.0602 8.81983 12.0575C8.17555 12.0592 7.53055 12.0592 6.88483 12.0575Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/></svg>
                  </a>
                </div>
                <div v-if="props.props.row.order_type == 'shipping' && isAdvancedShippingEnabled && isMobileWidth" class="col-1 d-flex justify-content-start">
                  <button class="p-0 bg-transparent border-0 pl-2" style="padding-top: 2px !important;" @click.prevent="showReturnLabelModal(props.props.row)">
                    <img src="/images/shipping.png" width="32" height="32" style="transform: scaleX(-1)"/>
                  </button>
                </div>
              </div>
              <div v-else-if="props.props.column.field == 'id' && !isMobileWidth" class="d-flex flex-column justify-content-start align-items-start">
                <!--<div class="badge badge-danger text-uppercase mb-1" v-if="props.props.row.parcel_type.includes('special')">Special</div>-->
                <router-link :to="`/admin/order-details/${props.props.row.id}`">#{{props.props.row.id}}</router-link>
              </div>
              <div v-else-if="props.props.column.field == 'notes'" @click="selectedOrder = props.props.row.id">
                <a href="#" class="notes-bt" :style="{ background: props.props.row.notes_count > 0 ? '#E86767' : '#FEF3C7'}" @click.prevent="$refs.notesList.show(props.props.row.id)" aria-label="Show Note">
                  <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7822 8.04647C13.7822 10.1279 13.7822 12.2093 13.7822 14.2907C13.7822 15.1459 13.2844 15.8173 12.4967 16.0197C12.3282 16.0598 12.1553 16.0789 11.9821 16.0768C8.59706 16.0801 5.21178 16.0801 1.82626 16.0768C0.733518 16.0786 0 15.3461 0 14.2591C0 10.1147 0 5.97033 0 1.82593C0 0.86094 0.578489 0.165103 1.50077 0.0176101C1.60781 0.00347238 1.71581 -0.00216745 1.82375 0.00074349C5.20855 0.00074349 8.59383 0.00074349 11.9796 0.00074349C13.0476 -0.000333101 13.7804 0.732826 13.7804 1.80296C13.7823 3.88437 13.7823 5.96578 13.7804 8.04719L13.7822 8.04647ZM12.6338 8.05724C12.6338 5.98181 12.6338 3.9065 12.6338 1.83131C12.6338 1.36479 12.421 1.14947 11.9573 1.14947H1.83738C1.36368 1.14803 1.15016 1.36335 1.15016 1.84136C1.15016 5.98025 1.15016 10.1192 1.15016 14.258C1.15016 14.7095 1.36978 14.9298 1.82052 14.9298H11.9581C12.4221 14.9298 12.6334 14.7163 12.6334 14.248C12.6339 12.1843 12.6334 10.1207 12.632 8.05724H12.6338Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.89194 8.61238C6.24024 8.61238 5.58854 8.61238 4.93685 8.61238C4.57224 8.61238 4.31027 8.37338 4.30776 8.04323C4.30525 7.71307 4.56757 7.46546 4.92823 7.4651C6.23737 7.46366 7.54674 7.46366 8.85636 7.4651C9.21809 7.4651 9.47648 7.7102 9.47396 8.04359C9.47145 8.37697 9.21307 8.61238 8.84703 8.61238C8.19533 8.61406 7.54363 8.61406 6.89194 8.61238Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.87049 5.16732C6.22453 5.16732 5.57858 5.16732 4.93262 5.16732C4.56981 5.16732 4.3082 4.92508 4.30641 4.59313C4.30461 4.26118 4.56874 4.01895 4.93047 4.01895C6.23362 4.01895 7.53666 4.01895 8.83958 4.01895C9.21566 4.01895 9.47656 4.26011 9.47261 4.59995C9.46902 4.93047 9.2092 5.16445 8.84137 5.16516C8.18537 5.16947 7.52793 5.16732 6.87049 5.16732Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.88483 12.0575C6.23888 12.0575 5.59292 12.0575 4.94697 12.0575C4.57196 12.0575 4.3064 11.816 4.3064 11.4812C4.30855 11.1532 4.57124 10.9113 4.93548 10.9109C6.24414 10.9095 7.55304 10.9095 8.86217 10.9109C9.18515 10.9109 9.43241 11.1187 9.46973 11.408C9.48805 11.5487 9.45359 11.6912 9.37301 11.8081C9.29242 11.9249 9.17142 12.0078 9.03335 12.0406C8.96308 12.0546 8.89142 12.0602 8.81983 12.0575C8.17555 12.0592 7.53055 12.0592 6.88483 12.0575Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/></svg>
                </a>
              </div>
              <div class="d-flex justify-content-center" v-else-if="props.props.column.field == 'shipping' && props.props.row.order_type == 'shipping' && isAdvancedShippingEnabled && !isMobileWidth">
                <button class="p-0 bg-transparent border-0" @click.prevent="showReturnLabelModal(props.props.row)" aria-label="Show Shipping Labels">
                  <img src="/images/shipping.png" width="32" height="32" alt="Shipping" style="transform: scaleX(-1)" />
                </button>
              </div>
            </template>
          </OrdersTable>
        </b-tab>
        <b-tab :active="$route.params.type == 'cancelled'" id="cancelled">
          <OrdersTable v-if="cancelledOrders" ref="cancelledOrdersTable" title="Cancelled Orders" :ordersColumns="cancelledOrdersColumns" :orders="cancelledOrders" @ordersFunction="getCancelledOrders" @sorting-function-cancelled="sortCancelled"  @removeFilter="removeCancelledFilter" :sortOptions="sortOptions">
            <template slot="column" slot-scope="props" :props="props">
              <div v-if="props.props.column.label == 'Business'">
                <b-dropdown v-if="locations.length > 1" text="Business" class="m-md-2">
                  <li v-for="l in locations" :key="`colocation-${l.business_id}`" class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input :class="`styled-checkbox`" :id="`${l.business_id}-colocation`" :value="l.business_id" type="checkbox" v-model="cancelledOrders.locations" />
                    <label class="small font-weight-bold text-uppercase" :for="`${l.business_id}-colocation`">{{l.name}}</label>
                  </li>
                </b-dropdown>
                <template v-else>{{props.props.column.label}}</template>
              </div>
              <div v-else-if="props.props.column.label == 'CUST_TYPE'">
                <b-dropdown text="CUST_TYPE" class="m-md-2">
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="regular-cacust" value="regular" type="checkbox" v-model="cancelledOrders.customerType" />
                    <label class="small font-weight-bold text-uppercase" for="regular-cacust">Regular</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="contractor-cacust" value="contractor" type="checkbox" v-model="cancelledOrders.customerType" />
                    <label class="small font-weight-bold text-uppercase" for="contractor-cacust">Contractor</label>
                  </li>
                </b-dropdown>
              </div>
              <div v-else-if="props.props.column.label == 'PAY_TYPE'">
                <b-dropdown text="PAY_TYPE" class="m-md-2">
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="authonly-capay" value="authonly" type="checkbox" v-model="cancelledOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="authonly-capay">Credit card (Pre-auth)</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="creditcard-capay" value="creditcard" type="checkbox" v-model="cancelledOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="creditcard-capay">Credit card (Charged)</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="instore-capay" value="instore" type="checkbox" v-model="cancelledOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="instore-capay">Pay in Store/Person</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="receivables-capay" value="receivables" type="checkbox" v-model="cancelledOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="receivables-capay">Account Recievables (Contractors)</label>
                  </li>
                  <li class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input class="styled-checkbox" id="paypal_exp_checkout3" value="paypal_exp_checkout" type="checkbox" v-model="cancelledOrders.paymentType" />
                    <label class="small font-weight-bold text-uppercase" for="paypal_exp_checkout3">Paypal Exp Checkout </label>
                  </li>
                </b-dropdown>
              </div>
              <div v-else-if="props.props.column.label == 'Type'">
                <b-dropdown text="Type" class="m-md-2">
                  <li v-for="check in checkBoxes" :key="`catype-${check}`" class="mr-sm-4 w-33 w-sm-auto small pl-2">
                    <input :class="`styled-checkbox ${check}`" :id="`${check}-catype`" :value="check" type="checkbox" v-model="cancelledOrders.filters" />
                    <label class="small font-weight-bold text-uppercase" :for="`${check}-catype`">{{check}}</label>
                  </li>
                </b-dropdown>
              </div>
              <div v-else>{{props.props.column.label}}</div>
            </template>
            <template slot="row" slot-scope="props">
               <div :style="{ width: mobileFirstRowWidth, maxWidth: mobileFirstRowWidth, paddingLeft: '12px', paddingTop: '10px' }" v-if="props.props.column.field == 'id' && isMobileWidth">
                <div class="row mb-2 d-flex justify-content-between" :style="{ width: mobileRowWidth, maxWidth: mobileRowWidth }">
                  <div class="col-5"><b>Order <router-link style="text-decoration: underline;" :to="`/admin/order-details/${props.props.row.id}`">#{{props.props.row.id}}</router-link></b></div>
                  <div class="col-7 d-flex justify-content-end align-items-center" :class="pageWidth < 330 ? 'mt-4' : ''" style="padding-right: 10px;">
                    <svg v-if="pageWidth > 335" style="margin-right: 10px;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"><path stroke="#64748B" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 3v4h3m3 0A6 6 0 1 1 .999 7 6 6 0 0 1 13 7Z"/></svg>
                    <div v-html="props.props.row.date_purchased_mobile"></div>
                  </div>
                </div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" style="margin-left: 1px;" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'customer_name' && isMobileWidth">
                <div v-html="props.props.row.customer_name_mobile"></div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'business' && isMobileWidth">
                <div class="col-6 mobile-column-field">Business</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.business_name}}</div>
              </div>
              <div class="row pl-2 pt-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'customer_type' && isMobileWidth">
                <div class="col-6 mobile-column-field">Customer Type</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.customer_type}}</div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'store_number' && isMobileWidth">
                <div class="col-6 mobile-column-field">Store</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end" v-html="props.props.row.store_number"></div>
              </div>
              <div class="row pt-2 d-flex justify-content-between" style="padding-right: 8px !important; margin-left: -7px;"  :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'claimer' && isMobileWidth">
                <div class="col-6 mobile-column-field">Claimer</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end" v-html="props.props.row.claimer_mobile"></div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'payment_type' && isMobileWidth">
                <div class="col-6 mobile-column-field">Payment Type</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.payment_type}}</div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'item_count' && isMobileWidth">
                <div class="col-6 mobile-column-field">Items</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.props.row.item_count}}</div>
              </div>
              <div class="row pl-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'order_type' && isMobileWidth">
                <div class="col-6 mobile-column-field">Type</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end" v-html="props.props.row.order_type_mobile"></div>
              </div>
              <div class="row pl-2 pb-1 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.props.column.field == 'total' && isMobileWidth">
                <div class="col-6 mobile-column-field">Total</div>
                <div class="col-6 mobile-row-field d-flex justify-content-end">${{props.props.row.total}}</div>
              </div>
              <div v-else-if="props.props.column.field == 'notes' && isMobileWidth" class="pl-3 pt-2" @click="selectedOrder = props.props.row.id">
                <a href="#" class="notes-bt" :style="{ background: props.props.row.notes_count > 0 ? '#E86767' : '#FEF3C7'}" @click.prevent="$refs.notesList.show(props.props.row.id)">
                  <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7822 8.04647C13.7822 10.1279 13.7822 12.2093 13.7822 14.2907C13.7822 15.1459 13.2844 15.8173 12.4967 16.0197C12.3282 16.0598 12.1553 16.0789 11.9821 16.0768C8.59706 16.0801 5.21178 16.0801 1.82626 16.0768C0.733518 16.0786 0 15.3461 0 14.2591C0 10.1147 0 5.97033 0 1.82593C0 0.86094 0.578489 0.165103 1.50077 0.0176101C1.60781 0.00347238 1.71581 -0.00216745 1.82375 0.00074349C5.20855 0.00074349 8.59383 0.00074349 11.9796 0.00074349C13.0476 -0.000333101 13.7804 0.732826 13.7804 1.80296C13.7823 3.88437 13.7823 5.96578 13.7804 8.04719L13.7822 8.04647ZM12.6338 8.05724C12.6338 5.98181 12.6338 3.9065 12.6338 1.83131C12.6338 1.36479 12.421 1.14947 11.9573 1.14947H1.83738C1.36368 1.14803 1.15016 1.36335 1.15016 1.84136C1.15016 5.98025 1.15016 10.1192 1.15016 14.258C1.15016 14.7095 1.36978 14.9298 1.82052 14.9298H11.9581C12.4221 14.9298 12.6334 14.7163 12.6334 14.248C12.6339 12.1843 12.6334 10.1207 12.632 8.05724H12.6338Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.89194 8.61238C6.24024 8.61238 5.58854 8.61238 4.93685 8.61238C4.57224 8.61238 4.31027 8.37338 4.30776 8.04323C4.30525 7.71307 4.56757 7.46546 4.92823 7.4651C6.23737 7.46366 7.54674 7.46366 8.85636 7.4651C9.21809 7.4651 9.47648 7.7102 9.47396 8.04359C9.47145 8.37697 9.21307 8.61238 8.84703 8.61238C8.19533 8.61406 7.54363 8.61406 6.89194 8.61238Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.87049 5.16732C6.22453 5.16732 5.57858 5.16732 4.93262 5.16732C4.56981 5.16732 4.3082 4.92508 4.30641 4.59313C4.30461 4.26118 4.56874 4.01895 4.93047 4.01895C6.23362 4.01895 7.53666 4.01895 8.83958 4.01895C9.21566 4.01895 9.47656 4.26011 9.47261 4.59995C9.46902 4.93047 9.2092 5.16445 8.84137 5.16516C8.18537 5.16947 7.52793 5.16732 6.87049 5.16732Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.88483 12.0575C6.23888 12.0575 5.59292 12.0575 4.94697 12.0575C4.57196 12.0575 4.3064 11.816 4.3064 11.4812C4.30855 11.1532 4.57124 10.9113 4.93548 10.9109C6.24414 10.9095 7.55304 10.9095 8.86217 10.9109C9.18515 10.9109 9.43241 11.1187 9.46973 11.408C9.48805 11.5487 9.45359 11.6912 9.37301 11.8081C9.29242 11.9249 9.17142 12.0078 9.03335 12.0406C8.96308 12.0546 8.89142 12.0602 8.81983 12.0575C8.17555 12.0592 7.53055 12.0592 6.88483 12.0575Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/></svg>
                </a>
              </div>
              <div v-else-if="props.props.column.field == 'id' && !isMobileWidth">
                <router-link :to="`/admin/order-details/${props.props.row.id}`">#{{props.props.row.id}}</router-link>
              </div>
              <div v-else-if="props.props.column.field == 'notes' && !isMobileWidth" @click="selectedOrder = props.props.row.id">
                <a href="#" class="notes-bt" :style="{ background: props.props.row.notes_count > 0 ? '#E86767' : '#FEF3C7'}" @click.prevent="$refs.notesList.show(props.props.row.id)" aria-label="Show Note">
                  <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7822 8.04647C13.7822 10.1279 13.7822 12.2093 13.7822 14.2907C13.7822 15.1459 13.2844 15.8173 12.4967 16.0197C12.3282 16.0598 12.1553 16.0789 11.9821 16.0768C8.59706 16.0801 5.21178 16.0801 1.82626 16.0768C0.733518 16.0786 0 15.3461 0 14.2591C0 10.1147 0 5.97033 0 1.82593C0 0.86094 0.578489 0.165103 1.50077 0.0176101C1.60781 0.00347238 1.71581 -0.00216745 1.82375 0.00074349C5.20855 0.00074349 8.59383 0.00074349 11.9796 0.00074349C13.0476 -0.000333101 13.7804 0.732826 13.7804 1.80296C13.7823 3.88437 13.7823 5.96578 13.7804 8.04719L13.7822 8.04647ZM12.6338 8.05724C12.6338 5.98181 12.6338 3.9065 12.6338 1.83131C12.6338 1.36479 12.421 1.14947 11.9573 1.14947H1.83738C1.36368 1.14803 1.15016 1.36335 1.15016 1.84136C1.15016 5.98025 1.15016 10.1192 1.15016 14.258C1.15016 14.7095 1.36978 14.9298 1.82052 14.9298H11.9581C12.4221 14.9298 12.6334 14.7163 12.6334 14.248C12.6339 12.1843 12.6334 10.1207 12.632 8.05724H12.6338Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.89194 8.61238C6.24024 8.61238 5.58854 8.61238 4.93685 8.61238C4.57224 8.61238 4.31027 8.37338 4.30776 8.04323C4.30525 7.71307 4.56757 7.46546 4.92823 7.4651C6.23737 7.46366 7.54674 7.46366 8.85636 7.4651C9.21809 7.4651 9.47648 7.7102 9.47396 8.04359C9.47145 8.37697 9.21307 8.61238 8.84703 8.61238C8.19533 8.61406 7.54363 8.61406 6.89194 8.61238Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.87049 5.16732C6.22453 5.16732 5.57858 5.16732 4.93262 5.16732C4.56981 5.16732 4.3082 4.92508 4.30641 4.59313C4.30461 4.26118 4.56874 4.01895 4.93047 4.01895C6.23362 4.01895 7.53666 4.01895 8.83958 4.01895C9.21566 4.01895 9.47656 4.26011 9.47261 4.59995C9.46902 4.93047 9.2092 5.16445 8.84137 5.16516C8.18537 5.16947 7.52793 5.16732 6.87049 5.16732Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.88483 12.0575C6.23888 12.0575 5.59292 12.0575 4.94697 12.0575C4.57196 12.0575 4.3064 11.816 4.3064 11.4812C4.30855 11.1532 4.57124 10.9113 4.93548 10.9109C6.24414 10.9095 7.55304 10.9095 8.86217 10.9109C9.18515 10.9109 9.43241 11.1187 9.46973 11.408C9.48805 11.5487 9.45359 11.6912 9.37301 11.8081C9.29242 11.9249 9.17142 12.0078 9.03335 12.0406C8.96308 12.0546 8.89142 12.0602 8.81983 12.0575C8.17555 12.0592 7.53055 12.0592 6.88483 12.0575Z" :fill="props.props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/></svg>
                </a>
              </div>
              <router-link v-else-if="props.props.column.field == 'view_link' && !isMobileWidth" :to="props.props.formattedRow[props.props.column.field]" class="btn btn-outline-primary btn-sm">
                View Details
              </router-link>
              <template v-else>
                <span v-html="props.props.formattedRow[props.props.column.field]"></span>
              </template>
            </template>
          </OrdersTable>
        </b-tab>
      </b-tabs>
    </div>
    <b-modal ref="inStoreDisclaimerModal" id="inStoreDisclaimerModal" ok-variant="danger" ok-only ok-title="Confirm" @ok="confirmDisclaimer">
      <div slot="modal-header" class="d-flex">
        <svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="22" fill="none" viewBox="0 0 24 24" stroke="#EF4444"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <h5>In-Store Purchase</h5>
      </div>
      <div class="text-muted mb-2">
        Please make sure you have charged the customer before Marking it as Picked-Up.
      </div>
    </b-modal>
    <b-modal size="xl" ref="shippingLabels" id="shippingLabels" hide-footer>
      <div slot="modal-header" class="d-flex align-items-center justify-content-between w-100">
        <div class="d-flex align-items-center">
          <div class="notes-bt mr-3">
            <img src="/images/shipping.png" width="32" height="32" alt="Shipping" />
          </div>
          <h5>Shipping Labels</h5>
        </div>
        <button v-if="hasLabels" class="btn btn-primary" @click="showCreateLabelModel()">
          Add More Labels <i class="fa fa-plus ml-2 text-white"></i>
        </button>
      </div>
      <div class="text-muted mb-2">
        <shipping-labels @showMoreLabelsButton="hasLabels = true" @showCreateLabelModel="showCreateLabelModel" :orderId="selectedOrderForShipping ? selectedOrderForShipping.id : null"/>
      </div>
    </b-modal>
    <CreateLabelModal :customShipping="(selectedOrderForShipping && selectedOrderForShipping.custom_shipping) ? selectedOrderForShipping.custom_shipping : null"
                      :show="false" :orderId="selectedOrderForShipping ? selectedOrderForShipping.id : null" :orderAmount="selectedOrderForShipping ? selectedOrderForShipping.total : null" ref="createLabelModal"/>
                  
    <ReturnLabelModal v-if="selectedOrderForReturnLabel" :orderId="selectedOrderForReturnLabel.id" :orderAmount="selectedOrderForReturnLabel.total" ref="returnLabelModal"/>

    <NotesList ref="notesList" />

    <audio ref="audioPlayer" v-if="enableNewOrderNotification" src="https://storage.googleapis.com/content.ezadtv.com/2024/04/17/662012f6737ff_new_orders.mp3"></audio>
  </div>
</template>
<script>
import {paginationConfig} from '@/config/modules';
import AdminService from '@/api-services/admin.service';
import moment from 'moment-timezone';

import NoPermission from '../no-permission';
import OrdersTable from '@/components/admin/orders/table';
import NotesList from '@/components/admin/orders/notesList';
import ShippingLabels from "./shipping-labels";
import CreateLabelModal from '@/components/modals/create-label-modal';
import ReturnLabelModal from '@/components/modals/return-label-modal';

let d = {
  data: null,
  pages: null,
  currentPage: 1,
  perPage: 6,
  pageCount: 1,
  filter: '',
  filters: [],
  locations: [],
  loading: false,
  customerType: [],
  paymentType: [],
  sort: '',
  dir: ''
};

export default {
  components: {
    NoPermission,
    OrdersTable,
    NotesList,
    ShippingLabels,
    CreateLabelModal,
    ReturnLabelModal
  },
  data() {
    return {
      ...paginationConfig,
      isDownloading: false,
      markingAsCompleted: null,
      readyOrders: {...d},
      completedOrders: {...d},
      cancelledOrders: {...d},
      outstandingOrders: {...d},
      sortOptions: {
        enabled: true,
        multipleColumns: false,
        initialSortBy: { field: 'id', type: 'asc' }
      },
      bootstrapPaginationClasses: {
        ul: 'pagination justify-content-center',
        li: 'page-item',
        liActive: 'active',
        liDisable: 'disabled',
        button: 'page-link',
      },
      checkBoxes: ['pickup', 'delivery', 'shipping', 'special'],
      tabIndex: 0,
      selectedDisclaimer: null,
      selectedOrderForShipping: null,
      selectedOrderForReturnLabel: null,
      hasLabels: false,
      pageWidth: 0,
      allowPlayAudio: false
    };
  },
  computed: {
    locations() {
      if(this.$store.state.businessDetails && this.$store.state.businessDetails.about_us)
        return this.$store.state.businessDetails.about_us.locations || [];
      return [];
    },
    company() {
      return this.$store.state.businessDetails.company;
    },
    isAdvancedShippingEnabled() {
      return this.$store.state.businessDetails.advanced_shipping_enabled == 1;
    },
    outstandingOrdersColumns() {
      return [
        { field: 'date_purchased', label: 'Date', type: 'string' },
        { field: 'id', tdClass: 'index', thClass: 'index', label: 'Order Id', type: 'number', formatFn: v => `#${v}` },
        { field: 'customer_name', label: 'Client', html: true },
        { field: 'business_name', label: 'Business', html: true, sortable: false },
        { field: 'customer_type', label: 'CUST_TYPE', html: true, sortable: false },
        { field: 'claimer', label: 'Claimer', html: true },
        { field: 'payment_type', label: 'PAY_TYPE', html: true, sortable: false },
        { field: 'item_count', label: 'Items', type: 'number' },
        { field: 'order_type', tdClass: row => `badge-${row.order_type}`, label: 'Type', sortable: false },
        { field: 'total', label: 'Total', tdClass: 'font-weight-bold', formatFn: value => `$${value}` },
        { field: 'notes', label: '', tdClass: 'p-0', sortable: false },
        { field: 'shipping', label: '', tdClass: 'p-0', sortable: false },
        { field: 'prepare_order', thClass: 'text-right', tdClass:'text-right', label: '', sortable: false }
      ];
    },
    readyOrdersColumns() {
      return [
        { field: 'id', tdClass: 'index', thClass: 'index', label: 'Order Id', type: 'number', formatFn: v => `#${v}` },
        { field: 'customer_name', label: 'Client', html: true },
        { field: 'business', label: 'Business', html: true, sortable: false },
        { field: 'customer_type', label: 'CUST_TYPE', html: true, sortable: false },
        { field: 'claimer', label: 'Claimer', html: true },
        { field: 'payment_type', label: 'PAY_TYPE', html: true, sortable: false },
        { field: 'order_type', tdClass: row => `badge-${row.order_type}`, label: 'Type', sortable: false },
        { field: 'total', label: 'Total', tdClass: 'font-weight-bold', formatFn: value => `$${value}` },
        { field: 'notes', label: '', tdClass: 'p-0', sortable: false },
        { field: 'shipping', label: '', tdClass: 'p-0', sortable: false },
        { field: 'in_store_disclaimer', label: '', tdClass: 'p-0', sortable: false },
        { field: 'markAsComplete', tdClass: 'text-center', label: '', sortable: false, html: true }
      ];
    },
    completedOrdersColumns() {
      return [
        { field: 'id', tdClass: 'index', thClass: 'index', label: 'Order Id', type: 'number', formatFn: value => `#${value}` },
        { field: 'customer_name', label: 'Customer', html: true },
        { field: 'customer_type', label: 'CUST_TYPE', html: true, sortable: false },
        { field: 'business', label: 'Business', html: true, sortable: false },
        { field: 'store_number', label: 'Store', html: true },
        { field: 'payment_type', label: 'PAY_TYPE', html: true, sortable: false },
        { field: 'order_type', tdClass: row => `badge-${row.order_type}`, label: 'Type', sortable: false },
        { field: 'total', label: 'Total', tdClass: 'font-weight-bold', formatFn: value => `$${value}` },
        { field: 'notes', label: '', tdClass: 'p-0', sortable: false },
        { field: 'shipping', label: '', tdClass: 'p-0', sortable: false },
        { field: 'claimer', label: 'Completed By', html: true, sortable: false },
      ];
    },
    cancelledOrdersColumns() {
      return [
        { field: 'id', tdClass: 'index', thClass: 'index', label: 'Order Id', type: 'number', formatFn: value => `#${value}` },
        { field: 'customer_name', label: 'Customer', html: true },
        { field: 'customer_type', label: 'CUST_TYPE', html: true, sortable: false },
        { field: 'business', label: 'Business', html: true, sortable: false },
        { field: 'store_number', label: 'Store', html: true },
        { field: 'payment_type', label: 'PAY_TYPE', html: true, sortable: false },
        { field: 'order_type', tdClass: row => `badge-${row.order_type}`, label: 'Type', sortable: false },
        { field: 'total', label: 'Total', tdClass: 'font-weight-bold', formatFn: value => `$${value}` },
        { field: 'notes', label: '', tdClass: 'p-0', sortable: false },
        { field: 'shipping', label: '', tdClass: 'p-0', sortable: false },
        { field: 'claimer', label: 'Cancelled By', html: true, sortable: false },
      ];
    },
    isMobileWidth() {
      return this.pageWidth < 769;
    },
    mobileRowWidth() {
       if (this.pageWidth < 577) {
        return `${this.pageWidth - 40}px`;
      } else {
        return `${this.pageWidth - 70}px`;
      }
    },
    mobileFirstRowWidth() {
       if (this.pageWidth < 577) {
        return `${this.pageWidth - 50}px`;
      } else {
        return `${this.pageWidth - 80}px`;
      }
    },
    settings() {
      return this.$store.state.settings;
    },
    enableNewOrderNotification() {
      return this.settings.admin.enableNewOrderNotification && this.settings.admin.enableNewOrderNotification === true || false;
    }
  },
  mounted() {
    this.pageWidth = window.innerWidth;
    window.addEventListener('resize', this.handleResize);
    this.$refs.prevButton.style.opacity = 0.3;
    this.$refs.prevButton.style.cursor = 'not-allowed';
    this.getOrdersReadyCount();
    setInterval(() => this.refreshOrders(), 120000);
  },
  created() {
    if(this.$ezHasNoPermission('manage_orders')) return;
    !this.$route.params.type && this.$router.push({params: {type: 'outstanding'}});
  },
  methods: {
    handleResize() {
      this.pageWidth = window.innerWidth;
    },
    confirmDisclaimer() {
      this.readyOrders.data.orders.find(e => e.id == this.selectedDisclaimer).disclaimer_confirmed = true;
    },
    pastTense(val) {
      if(val == 'shipping') return 'Shipped';
      if(val == 'pickup') return 'Picked-Up';
      if(val == 'delivery') return 'Delivered';
    },
    async markAsComplete(id) {
      let el = this.readyOrders.data.orders.find(e => e.id == id);
      this.markingAsCompleted = id;
      let res = await AdminService.markOrderAsComplete(id);
      if (res.data.status === 'success') {
        this.$swal({
          toast: true,
          position: 'top',
          title: `Order Marked as Complete`,
          html: `This order is now in Completed orders list.`,
          showConfirmButton: false,
          timer: 5000,
          type: 'success',
        });

        this.$delete(this.readyOrders.data.orders, this.readyOrders.data.orders.indexOf(el));
        this.completedOrders.data.orders.unshift(el);
      } else if (res.data.status === 'error') {
        this.$swal('Error', res.data.message, 'error');
      }

      this.markingAsCompleted = null;
    },
    getOrders(data, ob) {
      ob.loading = true;
      return AdminService.getCompletedOrders(data).then(r => {
        r.data.orders.map(o => {
          o.order_type_mobile = `<span class="badge-${o.order_type}">${o.order_type}</span>`;
          o.customer_name_mobile = `<div style="font-weight: bold; font-size: 16px;">${o.first_name} ${o.last_name}</div><a style="text-decoration: underline;" href="mailto:${o.email}">${o.email}</a>`;
          o.date_purchased_mobile = moment.utc(o.date_purchased).local().format('[<b>]MM/DD/YY [<span class="border-left text-muted" style="padding-left: 3px;">]hh:mm A[</span></b>]');
          o.claimer_mobile =
            o.issued_first != null ? `${o.issued_first} ${o.issued_last}<span class="text-muted">${o.issued_at ? '&nbsp;<span class="border-right"></span>&nbsp;' + o.issued_at : ''}</span>` : `<span class="text-warning"> Unclaimed</span>`;
          o.disclaimer_confirmed = false;
          o.customer_name = `<div>${o.first_name} ${o.last_name}</div><a class="small" href="mailto:${o.email}">${o.email}</a>`;
          o.business = `${o.business_name}<div class="small text-muted">Purchase: <span class="text-uppercase">${moment(String(o.date_purchased)).format('MMM/DD/YY')}</span></div>`;
          o.view_link = `order-details/${o.id}`;
          o.claimer =
            o.issued_first != null ? `${o.issued_first} ${o.issued_last}<div class="small text-muted">${o.issued_at || ''}</div>` : `<div class="text-warning">Unclaimed</div>`;
          o.parcel_types = o.parcel_types.join(', ');
          return o;
        });
        ob.data = r.data;
        ob.pageCount = Math.ceil(ob.data.count / ob.perPage);
        ob.loading = false;
      });
    },
    getOutstandingOrders(data = {}) {
      this.outstandingOrders.loading = true;
      if(!data.dir) data.dir = 'desc';
      if(!data.sort) data.sort = 'date_purchased';
      return AdminService.getOutstandingOrders(data).then(r => {
        r.data.parcels.map(o => {
          o.order_type_mobile = `<span class="badge-${o.order_type}">${o.order_type}</span>`;
          o.customer_name_mobile = `<div style="font-weight: bold; font-size: 16px;">${o.first_name} ${o.last_name}</div><a style="text-decoration: underline;" href="mailto:${o.email}">${o.email}</a>`;
          o.date_purchased_mobile = moment.utc(o.date_purchased).local().format('[<b>]MM/DD/YY [<span class="border-left text-muted" style="padding-left: 3px;">]hh:mm A[</span></b>]');
          o.claimer_mobile =
            o.issued_first != null ? `${o.issued_first} ${o.issued_last}<span class="text-muted">${o.issued_at ? '&nbsp;<span class="border-right"></span>&nbsp;' + o.issued_at : ''}</span>` : `<span class="text-warning"> Unclaimed</span>`;
          o.customer_name = `<div>${o.first_name} ${o.last_name}</div><a class="small" href="mailto:${o.email}">${o.email}</a>`;
          o.order_time = o.date_purchased;
          o.date_purchased = moment.utc(o.date_purchased).local().format('MM/DD/YY [<div class="text-muted small">]hh:mm A[</div>]');
          o.prepare_order = `/admin/prepare-order?id=${o.id}&type=${o.order_type}&parce_id=${o.id}&ptype=${o.parcel_type}`;
          o.item_count = o.items.reduce((a, b) => a + (b.quantity || 0), 0);
          o.claimer =
            o.issued_first != null ? `${o.issued_first} ${o.issued_last}<div class="small text-muted">${o.issued_at || ''}</div>` : `<div class="text-warning">Unclaimed</div>`;
          return o;
        });
        this.outstandingOrders.data = r.data;
        this.outstandingOrders.data.orders = this.outstandingOrders.data.parcels;
        this.outstandingOrders.pageCount = Math.ceil(this.outstandingOrders.data.count / this.outstandingOrders.perPage);
        this.outstandingOrders.loading = false;
        let previousOutstandingOrderDate = window.localStorage.getItem('previousOutstandingOrderDate');
        if(this.enableNewOrderNotification && r.data.parcels.length > 0) {
          const latestOrderInfo = r.data.parcels.reduce((latestOrder, order) => {
            const previousOrderDate = new Date(order.order_time);
            const latestOrderDate = new Date(latestOrder.order_time);

            // Compare the dates and return the order with the latest date
            return previousOrderDate > latestOrderDate ? order : latestOrder;
          }, r.data.parcels[0]); // Initialize with the first order

          if (!previousOutstandingOrderDate) {            
            window.localStorage.setItem('previousOutstandingOrderDate', latestOrderInfo.order_time);
          } else {
            const previousOrderDate = new Date(previousOutstandingOrderDate);
            const latestOrderDate = new Date(latestOrderInfo.order_time);
            if (latestOrderDate > previousOrderDate) {
              window.localStorage.setItem('previousOutstandingOrderDate', latestOrderInfo.order_time);          
              this.playAudio();    
              this.$swal({
                title: `New Order Received`,
                html: `A new order has been received.`,
                showConfirmButton: true,
                type: 'success',
                customClass: {
                  container: 'add-to-cart-toast-container',
                  popup: 'add-to-cart-toast',
                },
              }).then(result => {
                this.allowPlayAudio = false;
              });
            }
          }
        }
      });
    },
    playAudio() {
      var self = this;
      self.allowPlayAudio = true;
      let counter = 0;
      const audio = this.$refs.audioPlayer;

      var i = setInterval(function() {
          if (self.allowPlayAudio) {
            audio.play().catch(function(error) {
              //console.error("Audio playback failed:", error);
            });
          }

          counter++;
          if(counter == 5) {
            clearInterval(i);
          }
      }, 30000);
    },
    removeOutstandingFilter(type, name) {
      this.removeFilter(this.outstandingOrders, type, name);
    },
    removeReadyFilter(type, name) {
      this.removeFilter(this.readyOrders, type, name);
    },
    removeCompletedFilter(type, name) {
      this.removeFilter(this.completedOrders, type, name);
    },
    removeCancelledFilter(type, name) {
      this.removeFilter(this.cancelledOrders, type, name);
    },
    removeFilter(o, type, name) {
      if(!name || !type) {
        o.customerType = [];
        o.paymentType = [];
        o.filters = [];
        o.locations = [];
      }
      if(type == 'cust')
        o.customerType = o.customerType.filter(e => e !== name);
      if(type == 'pay')
        o.paymentType = o.paymentType.filter(e => e !== name);
      if(type == 'type')
        o.filters = o.filters.filter(e => e !== name);
      if(type == 'locations')
        o.locations = o.locations.filter(e => e !== name);
    },
    getCompletedOrders(data = {}) {
      this.getOrders(data, this.completedOrders);
    },
    getReadyOrders(data = {}) {
      this.getOrders({...data, step: 'almost'}, this.readyOrders);
    },
    getCancelledOrders(data = {}) {
      this.getOrders({...data, cancelled: 1}, this.cancelledOrders);
    },
    getOrdersReadyCount() {
      this.getOrders({ page: 1, sort: "", dir: "", perPage: 6, types: "", customerType: "", paymentType: "", locations: "", filter: "", step: "almost" }, this.readyOrders);
    },
    refreshOrders() {
      const type = this.$route.params.type;
      if(this.$refs[`${type}OrdersTable`]) 
        this.$refs[`${type}OrdersTable`].getOrders();
      this.getOrdersReadyCount();
    },
    showCreateLabelModel() {
      this.$refs.createLabelModal.showModal();
      this.$refs.shippingLabels.hide();
    },
    showReturnLabelModal(order) {
      this.selectedOrderForReturnLabel = order;
      setTimeout(() => {
        this.$refs.returnLabelModal.showModal();  
      }, 100);
      
    },
    sortOutstanding(dir, sort) {
      this.outstandingOrders.dir = dir;
      this.outstandingOrders.sort = sort;
      this.$refs[`${this.$route.params.type}OrdersTable`].getOrders();
    },
    sortReady(dir, sort) {
      this.readyOrders.dir = dir;
      this.readyOrders.sort = sort;
      this.$refs[`${this.$route.params.type}OrdersTable`].getOrders();
    },
    sortCompleted(dir, sort) {
      this.completedOrders.dir = dir;
      this.completedOrders.sort = sort;
      this.$refs[`${this.$route.params.type}OrdersTable`].getOrders();
    },
    sortCancelled(dir, sort) {
      this.cancelledOrders.dir = dir;
      this.cancelledOrders.sort = sort;
      this.$refs[`${this.$route.params.type}OrdersTable`].getOrders();
    },
    navigateToPrevious() {
      this.$refs.nextButton.style.opacity = 1;
      this.$refs.nextButton.style.cursor = 'pointer';
      const container = this.$refs.navContainer;
      container.scrollLeft -= container.offsetWidth;
      this.$refs.prevButton.style.opacity = 0.3;
      this.$refs.prevButton.style.cursor = 'not-allowed';
    },
    navigateToNext() {
      this.$refs.prevButton.style.opacity = 1;
      this.$refs.prevButton.style.cursor = 'pointer';
      const container = this.$refs.navContainer;
      container.scrollLeft += container.offsetWidth;
      this.$refs.nextButton.style.opacity = 0.3;
      this.$refs.nextButton.style.cursor = 'not-allowed';
    }
  }
};
</script>

<style scoped lang="scss">

.navigation-column {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

.navigation-links {
  display: flex;
}

.navigation-button {
  position: absolute;
  top: 80%;
  transform: translateY(-50%);
  height: 40px;
  color: black;
  border: none;
  outline: none;
  font-size: 24px;
  cursor: pointer;
  background: white;
}

.nav-button-hidden {
  display: none;
}

.previous {
  left: 0;
  top: 18px;
}

.next {
  right: 0;
  top: 19px
}


@media (max-width: 540px) {
  .navigation-links {
  overflow: hidden;
}


  .navigation-column {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .col-1 {
    flex-basis: 100%;
  }

  .col-10 {
    flex-basis: 100%;
  }
}
:deep(.modal-content) {
  .modal-body {
    padding: 0 !important;
  }
  .container {
    padding: 0 !important;
  }
  .card {
    border: none;
  }
  .vgt-responsive {
    overflow: hidden;
  }
}

:deep(.tabs) {
  .nav-item {
    .nav-link {
      color: #64748B;
      position: relative;
      padding-left: 0;
      padding-right: 0;
      margin: 0 10px;
      cursor: pointer;
      &.active {
        color: var(--primary);
        cursor: default;
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          bottom: 0;
          left: 0;
          border-bottom: 2px solid var(--primary);
        }
      }
      .count {
        border: 1px solid #E2E8F0;
        border-radius: 4px;
        line-height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px 3px;
        font-size: 12px;
        color: #64748B;
      }
    }
    &:first-child .nav-link {
      margin-left: 0;
    }
    &:last-child .nav-link {
      margin-right: 0;
    }
  }
}
:deep(.dropdown-menu) {
  white-space: nowrap;
}
:deep(.date) {
  font-size: 13px;
}
.order-mobile {
  .info-block {
    font-size: 14px;
  }
}

.heading--button {
  width: 100%;
  h3 {
    display: inline-block;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
}

.badge-pickup {
  span {
    background: #FEE2E2;
    color: #B91C1C;
    &::before {
      background: #F87171;
    }
  }
  }
.badge-delivery {
  span {
    background: #FEF3C7;
    color: #B45309;
    &::before {
      background: #FBBF24;
    }
  }
}
.badge-shipping {
  span {
    background: #D1FAE5;
    color: #047857;
    &::before {
      background: #34D399;
    }
  }
}

.mobile-column-field {
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  color: #64748B;
}
.mobile-row-field {
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  text-align: right;
  color: #334155;
  padding-right: 3px !important;
}

.mobile-top-row {
  margin-left: -8px !important;
}

.mobile-bottom-row {
  margin-left: 0px !important;
  margin-bottom: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
}

@media (max-width: 768px) {
  .mobile-container {
    padding-right: 30px !important;
    padding-left: 24px !important;
    margin-left: 2px;
  }
  #outstanding {
    :deep(.vgt-responsive) {
      overflow-x: hidden;
    }
    :deep(table) {
        border-collapse: separate;
        border-spacing: 0 15px;
      td {
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
      }
      td:first-child {
        border-top: 2px solid rgb(226, 232, 240);
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        padding: 0.2rem;
      }
      td:nth-child(2) {
        border-bottom: 1px solid rgb(226, 232, 240);
      }
      td:nth-child(3) {
        border-bottom: 1px solid rgb(226, 232, 240);
      }
      td:last-child {
        border: 2px solid rgb(226, 232, 240);
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
      }
      tr {
        th:nth-child(1) {
          display: none !important;
        }
      }
    }
  }
  #ready {
    :deep(.vgt-responsive) {
      overflow-x: hidden;
    }
    :deep(table) {
        border-collapse: separate;
        border-spacing: 0 15px;
      td {
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
      }
      td:first-child {
        border-top: 2px solid rgb(226, 232, 240);
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
        border-bottom: 1px solid rgb(226, 232, 240);
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        padding: 0.2rem;
      }
      td:nth-child(2) {
        border-bottom: 1px solid rgb(226, 232, 240);
      }
      td:last-child {
        border: 2px solid rgb(226, 232, 240);
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
      }
      tr {
        th:nth-child(1) {
          display: none !important;
        }
      }
    }
  }
  #completed {
    :deep(.vgt-responsive) {
      overflow-x: hidden;
    }
    :deep(table) {
        border-collapse: separate;
        border-spacing: 0 15px;
      td {
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
      }
      td:first-child {
        border-top: 2px solid rgb(226, 232, 240);
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
        border-bottom: 1px solid rgb(226, 232, 240);
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        padding: 0.2rem;
      }
      td:nth-child(2) {
        border-bottom: 1px solid rgb(226, 232, 240);
      }
      td:nth-child(8) {
        border-bottom: 1px solid rgb(226, 232, 240);
      }
      td:last-child {
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
        border-bottom: 2px solid rgb(226, 232, 240);
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
      }
      tr {
        th:nth-child(1) {
          display: none !important;
        }
      }
    }
  }
  #cancelled {
    :deep(.vgt-responsive) {
      overflow-x: hidden;
    }
    :deep(table) {
        border-collapse: separate;
        border-spacing: 0 15px;
      td {
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
      }
      td:first-child {
        border-top: 2px solid rgb(226, 232, 240);
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
        border-bottom: 1px solid rgb(226, 232, 240);
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        padding: 0.2rem;
      }
      td:nth-child(2) {
        border-bottom: 1px solid rgb(226, 232, 240);
      }
      td:nth-child(8) {
        border-bottom: 1px solid rgb(226, 232, 240);
      }
      td:last-child {
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
        border-bottom: 2px solid rgb(226, 232, 240);
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
      }
      tr {
        th:nth-child(1) {
          display: none !important;
        }
      }
    }
  }
  :deep(th) {
    display: none;
  }
  :deep(td) {
    padding-top: 10px;
    padding-bottom:10px;
    display: flex;
    width: 100%;
    padding: .5rem;
    .email {
      display: none;
      margin-left: 10px;
    }
  }

}

@media (max-width: 575px) {
  .mobile-container {
    padding-right: 14px !important;
    padding-left: 15px !important;
    margin-left: 0px;
  }
}
</style>
