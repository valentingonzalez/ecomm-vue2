<template>
  <div v-if="order" class="prepare-order">
    <b-alert show v-if="order.payment_type && order.payment_type.toLowerCase() == 'auth only'" variant="danger" class="alert-alt text-center py-2">
      We have authorized a charge for this order. Note that the authorization is only valid for 7 days.
      If you will be fulfilling this order, make sure to mark it as prepared to capture and finalize the payment.
      Marking an order as prepared will capture the payment if it is within the 7 day period.
      If it will take longer than 7 days to prepare (special orders), you may want to capture this payment in advance now,
      or use alternative payment options.
    </b-alert>
    <div class="container">
      <div class="py-4">
        <div :class="{'main card p-sm-4':initPage}">
          <div id="prepareOrder" v-if="initPage">
            <!-- HEADING -->
            <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-3">
              <div class="d-flex justify-content-between align-items-end mb-2">
                <div class="d-flex align-items-center">
                  <div class="mr-3">
                    <div class="text-tiny text-uppercase font-weight-bold text-muted">Order id: {{ order.id }}</div>
                    <h4 class="m-0">Prepare Order</h4>
                  </div>
                  <a href="#" class="notes-bt" :style="{ background: order.notes_count > 0 ? '#E86767' : '#FEF3C7'}" @click.prevent="$refs.notesList.show(order.id)" aria-label="Show Note">
                    <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7822 8.04647C13.7822 10.1279 13.7822 12.2093 13.7822 14.2907C13.7822 15.1459 13.2844 15.8173 12.4967 16.0197C12.3282 16.0598 12.1553 16.0789 11.9821 16.0768C8.59706 16.0801 5.21178 16.0801 1.82626 16.0768C0.733518 16.0786 0 15.3461 0 14.2591C0 10.1147 0 5.97033 0 1.82593C0 0.86094 0.578489 0.165103 1.50077 0.0176101C1.60781 0.00347238 1.71581 -0.00216745 1.82375 0.00074349C5.20855 0.00074349 8.59383 0.00074349 11.9796 0.00074349C13.0476 -0.000333101 13.7804 0.732826 13.7804 1.80296C13.7823 3.88437 13.7823 5.96578 13.7804 8.04719L13.7822 8.04647ZM12.6338 8.05724C12.6338 5.98181 12.6338 3.9065 12.6338 1.83131C12.6338 1.36479 12.421 1.14947 11.9573 1.14947H1.83738C1.36368 1.14803 1.15016 1.36335 1.15016 1.84136C1.15016 5.98025 1.15016 10.1192 1.15016 14.258C1.15016 14.7095 1.36978 14.9298 1.82052 14.9298H11.9581C12.4221 14.9298 12.6334 14.7163 12.6334 14.248C12.6339 12.1843 12.6334 10.1207 12.632 8.05724H12.6338Z" :fill="order.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.89194 8.61238C6.24024 8.61238 5.58854 8.61238 4.93685 8.61238C4.57224 8.61238 4.31027 8.37338 4.30776 8.04323C4.30525 7.71307 4.56757 7.46546 4.92823 7.4651C6.23737 7.46366 7.54674 7.46366 8.85636 7.4651C9.21809 7.4651 9.47648 7.7102 9.47396 8.04359C9.47145 8.37697 9.21307 8.61238 8.84703 8.61238C8.19533 8.61406 7.54363 8.61406 6.89194 8.61238Z" :fill="order.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.87049 5.16732C6.22453 5.16732 5.57858 5.16732 4.93262 5.16732C4.56981 5.16732 4.3082 4.92508 4.30641 4.59313C4.30461 4.26118 4.56874 4.01895 4.93047 4.01895C6.23362 4.01895 7.53666 4.01895 8.83958 4.01895C9.21566 4.01895 9.47656 4.26011 9.47261 4.59995C9.46902 4.93047 9.2092 5.16445 8.84137 5.16516C8.18537 5.16947 7.52793 5.16732 6.87049 5.16732Z" :fill="order.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.88483 12.0575C6.23888 12.0575 5.59292 12.0575 4.94697 12.0575C4.57196 12.0575 4.3064 11.816 4.3064 11.4812C4.30855 11.1532 4.57124 10.9113 4.93548 10.9109C6.24414 10.9095 7.55304 10.9095 8.86217 10.9109C9.18515 10.9109 9.43241 11.1187 9.46973 11.408C9.48805 11.5487 9.45359 11.6912 9.37301 11.8081C9.29242 11.9249 9.17142 12.0078 9.03335 12.0406C8.96308 12.0546 8.89142 12.0602 8.81983 12.0575C8.17555 12.0592 7.53055 12.0592 6.88483 12.0575Z" :fill="order.notes_count > 0 ? '#FFFFFF' : '#B45309'"/></svg>
                  </a>
                  <button v-b-modal.shippingLabels class="p-0 bg-transparent border-0" v-if="order && order.id && order.order_type == 'shipping' && isAdvancedShippingEnabled" aria-label="Show Shipping Labels">
                    <img src="/images/shipping.png" width="32" height="32" alt="Shipping" />
                  </button>
                  <a v-if="order.address" href="#" class="ml-2 notes-bt" @click.prevent="openCustomerMapsLink" :class="{disabled: fetchingMapLink}" aria-label="Customer Maps Link">
                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                  </a>
                </div>
                <div v-if="order.issued_at" class="d-md-none mb-0 mr-2 mr-md-4 text-right">
                  <div class="text-muted small"><span class="d-none d-md-inline">Order&nbsp;</span>Claimed by </div>
                  {{ order.issued_first }} {{ order.issued_last }}
                </div>
              </div>
              <button v-if="!order.issued_at" :disabled="claiming" class="btn-claim btn btn-sm btn-primary mr-2" @click="claimOrder">
                <span v-if="claiming" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
                Claim Order
              </button>
              <div class="d-flex flex-column flex-md-row align-items-md-center claim-order py-2 py-md-0">
                <div v-if="order.issued_at" class="d-none d-md-inline mb-0 mr-2 mr-md-4 text-right">
                  <div>
                    <span class="d-none d-md-inline">Order&nbsp;</span>Claimed by {{ order.issued_first }} {{ order.issued_last }}
                  </div>
                  <div class="text-muted">
                    on {{ order.formatted_issued_at }}
                  </div>
                </div>
                <div v-if="order.issued_at" class="d-flex">
                  <button v-if="showChargeCard" :disabled="bookingOrder || order.booked_date" class="btn btn-sm btn-primary p-2 mr-2 font-weight-bold d-none d-sm-block" @click="prepareStep">
                    <div v-if="order.booked_date">
                      <svg class="mr-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16ZM11.707 6.707C11.8892 6.5184 11.99 6.2658 11.9877 6.0036C11.9854 5.7414 11.8802 5.49059 11.6948 5.30518C11.5094 5.11977 11.2586 5.0146 10.9964 5.01233C10.7342 5.01005 10.4816 5.11084 10.293 5.293L7 8.586L5.707 7.293C5.5184 7.11084 5.2658 7.01005 5.0036 7.01233C4.7414 7.0146 4.49059 7.11977 4.30518 7.30518C4.11977 7.49059 4.0146 7.7414 4.01233 8.0036C4.01005 8.2658 4.11084 8.5184 4.293 8.707L6.293 10.707C6.48053 10.8945 6.73484 10.9998 7 10.9998C7.26516 10.9998 7.51947 10.8945 7.707 10.707L11.707 6.707Z" fill="#FCA5A5"/></svg>
                      Card Charged on {{ formatDate(order.booked_date) }}
                    </div>
                    <div v-else>
                      <div class="spinner-border spinner-border-sm mr-2" v-if="bookingOrder" />
                        Charge Card
                    </div>
                  </button>
                  <button v-if="order.issued_at" :disabled="claiming" class="btn btn-sm btn-primary p-2 mr-2" @click="claimOrder">
                    <span v-if="claiming" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
                    Reclaim Order
                  </button>
                  <button class="btn btn-sm p-2 btn-outline-primary" @click="() => $refs.cancelOrderModal.show()" :disabled="canceling || !order.issued_at">
                    <span v-if="canceling" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
            <!-- end HEADING -->

            <!-- ALERTS -->
            <b-alert v-if="order.order_notes" show variant="danger" class="alert-alt border">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" class="mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              Special Instructions: {{ order.order_notes }}
            </b-alert>
            <!-- end ALERTS -->

            <!-- TOP CARDS -->
            <div class="row mb-2">
              <div class="col-md-6">
                <div class="card card-alt h-100 customer-details px-md-4">
                  <div class="card-header d-flex justify-content-between align-items-center bg-transparent px-0 py-2">
                    <h6 class="m-0">Customer<span class="d-none d-md-inline">&nbsp;Details</span></h6>
                    <div class="d-flex">
                      <a class="btn btn-options rounded-circle" :href="`tel:${order.telephone}`" :aria-label="`Call ${order.telephone}`">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.39052 1.39052C1.14048 1.64057 1 1.97971 1 2.33333V3C1 8.52267 5.47733 13 11 13H11.6667C12.0203 13 12.3594 12.8595 12.6095 12.6095C12.8595 12.3594 13 12.0203 13 11.6667V9.48067C13 9.34069 12.956 9.20425 12.8742 9.0907C12.7923 8.97714 12.6768 8.89223 12.544 8.848L9.54867 7.84933C9.39644 7.79873 9.23107 7.80472 9.0829 7.86619C8.93473 7.92766 8.8137 8.0405 8.742 8.184L7.98867 9.68867C6.35631 8.95112 5.04888 7.64369 4.31133 6.01133L5.816 5.258C5.9595 5.1863 6.07234 5.06527 6.13381 4.9171C6.19528 4.76893 6.20127 4.60356 6.15067 4.45133L5.152 1.456C5.1078 1.3233 5.02299 1.20787 4.90957 1.12603C4.79615 1.0442 4.65986 1.00011 4.52 1H2.33333C1.97971 1 1.64057 1.14048 1.39052 1.39052Z" stroke="#64748B" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      </a>
                      <a class="btn btn-options rounded-circle ml-2" @click.prevent="showEmailModal" aria-label="Email">
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 3.33331L6.26 6.83998C6.47911 6.98617 6.7366 7.06418 7 7.06418C7.2634 7.06418 7.52089 6.98617 7.74 6.83998L13 3.33331M2.33333 10.6666H11.6667C12.0203 10.6666 12.3594 10.5262 12.6095 10.2761C12.8595 10.0261 13 9.68694 13 9.33331V2.66665C13 2.31302 12.8595 1.97389 12.6095 1.72384C12.3594 1.47379 12.0203 1.33331 11.6667 1.33331H2.33333C1.97971 1.33331 1.64057 1.47379 1.39052 1.72384C1.14048 1.97389 1 2.31302 1 2.66665V9.33331C1 9.68694 1.14048 10.0261 1.39052 10.2761C1.64057 10.5262 1.97971 10.6666 2.33333 10.6666Z" stroke="#64748B" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      </a>
                      <a v-if="showARButton" class="btn btn-options px-2 ml-2" href="#" @click.prevent="openARList">
                        Assign A/R Account
                      </a>
                      <a v-if="paymentInfo" class="btn btn-options px-2 ml-2" :class="highPaymentRiskLevel?'payment-warning':''" href="#" @click.prevent="openPaymentInfo">
                        {{ paymentInfo.type && paymentInfo.type == 'paypal' ? 'Paypal Info':'Stripe Info' }}
                      </a>
                    </div>
                  </div>
                  <div class="pb-3" style="font-weight: 500;">
                    <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
                      <div class="text-muted pr-4">Customer Name</div>
                      <div class="text-right">{{ order.first_name | capitalize }} {{ order.last_name | capitalize }}</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
                      <div class="text-muted pr-4">Customer Type</div>
                      <div class="text-right">{{ order.customer_type }}</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
                      <div class="text-muted pr-4">Email Address</div>
                      <div class="text-right"><a :href="`mailto:${order.email}`">{{ order.email }}</a></div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
                      <div class="text-muted pr-4">Phone Number</div>
                      <div class="text-right"><a class="text-dark" :href="`tel:${order.telephone}`">{{ order.telephone }}</a></div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
                      <div class="text-muted pr-4">{{ (order.order_type == 'shipping' ? 'Shipping Address' : order.order_type == 'delivery' ? 'Delivery Address' : 'Address') }}</div>
                      <div class="text-right">
                          {{ order.address ? fullAddress : 'No Address Submitted' }}
                      </div>
                    </div>
                    <div v-if="order.billing_address" class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
                      <div class="text-muted pr-4">Billing Address</div>
                      <div class="text-right">
                          {{ billingAddress }}
                      </div>
                    </div>
                    <div v-if="$store.state.hasTrueValueRewards && order.custom_info && order.custom_info.tvr_number" class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
                      <div class="text-muted pr-4">{{ $ezTVRName() }} #</div>
                      <div class="text-right">
                          {{ order.custom_info.tvr_number }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 mt-4 mt-md-0">
                <div class="card card-alt px-md-4 h-100 order-details">
                  <div class="card-header d-flex justify-content-between align-items-center bg-transparent px-0 py-2">
                    <h6 class="m-0">Order Details</h6>
                    <div class="text-tiny">
                      <span class="text-muted">Order date:</span> <b>{{ order.date_purchased }}</b>
                    </div>
                  </div>

                  <div class="pb-3" style="font-weight: 500;">
                    <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
                      <div class="text-muted">Order Type</div>
                      <div class="text-capitalize">{{ order.order_type }}</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
                      <div class="text-muted">Parcel Type</div>
                      <div class="text-capitalize">{{ parcelType }}</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
                      <div class="text-muted">Payment Type</div>
                      <div class="text-capitalize">{{ order.payment_type }}</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1" v-if="order.cc_last4">
                      <div class="text-muted">Card Details</div>
                      <div class="text-capitalize">* {{ order.cc_last4 }}</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1" v-if="order.custom_info && order.custom_info.loyality_lookup_field">
                      <div class="text-muted">Reward Member Lookup</div>
                      <div class="text-capitalize">{{ order.custom_info.loyality_lookup_field }}</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1" v-if="order.custom_info && order.custom_info.tax_exempt">
                      <div class="text-muted">Tax Exempt</div>
                      <div class="text-capitalize">{{ order.custom_info.tax_exempt ? 'Yes' : 'No' }}</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1" v-if="order.custom_info && order.custom_info.senior_citizen">
                      <div class="text-muted">Eligible for discount</div>
                      <div class="text-capitalize">{{ order.custom_info.senior_citizen ? 'Yes' : 'No' }}</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1" v-for="(value, key, index) in customFields" :key="index">

                      <div class="text-muted text-capitalize">{{ key }}</div>
                      <div class="text-capitalize">{{ displayValue(value) }}</div>
                    </div>
                    <!-- CHECK THIS OUT! -->
                    <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1" v-if="order.delivery_date">
                      <div class="text-muted text-capitalize">Delivery Date</div>
                      <div class="d-flex align-items-center">
                        <VueCtkDateTimePicker
                          id="deliveryPicker"
                          @input="onDeliveryDateChange"
                          v-model="order.delivery_date"
                          :no-weekends-days="!businessDetails.delivery_settings || !businessDetails.delivery_settings.delivery_on_weekends"
                          :color="$store.state.settings.colors.secondary"
                          :button-color="$store.state.settings.colors.primary"
                          :only-date="!businessDetails.delivery_settings || !businessDetails.delivery_settings.enable_time"
                          no-header
                          noClearButton
                          no-button-now
                          :minDate="today"
                          no-label
                          right
                          :format="dateFormat"
                          :formatted="dateFormatted"
                          :no-value-to-custom-elem="true"
                        >
                          <div class="text-primary cursor-pointer small">Change</div>
                        </VueCtkDateTimePicker>
                        <div class="flex-grow-1 ml-3">{{ order.delivery_date }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="highPaymentRiskLevel" class="row mb-4">
              <div class="col-md-12">
                <b-alert show variant="danger" class="alert-alt border payment-warning">
                  <svg class="mr-2" width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.4 6.99998C13.4 8.69736 12.7257 10.3252 11.5255 11.5255C10.3252 12.7257 8.69736 13.4 6.99998 13.4C5.30259 13.4 3.67472 12.7257 2.47449 11.5255C1.27426 10.3252 0.599976 8.69736 0.599976 6.99998C0.599976 5.30259 1.27426 3.67472 2.47449 2.47449C3.67472 1.27426 5.30259 0.599976 6.99998 0.599976C8.69736 0.599976 10.3252 1.27426 11.5255 2.47449C12.7257 3.67472 13.4 5.30259 13.4 6.99998ZM7.79998 3.79998C7.79998 4.01215 7.71569 4.21563 7.56566 4.36566C7.41563 4.51569 7.21215 4.59998 6.99998 4.59998C6.7878 4.59998 6.58432 4.51569 6.43429 4.36566C6.28426 4.21563 6.19998 4.01215 6.19998 3.79998C6.19998 3.5878 6.28426 3.38432 6.43429 3.23429C6.58432 3.08426 6.7878 2.99998 6.99998 2.99998C7.21215 2.99998 7.41563 3.08426 7.56566 3.23429C7.71569 3.38432 7.79998 3.5878 7.79998 3.79998ZM6.19998 6.19998C5.9878 6.19998 5.78432 6.28426 5.63429 6.43429C5.48426 6.58432 5.39998 6.7878 5.39998 6.99998C5.39998 7.21215 5.48426 7.41563 5.63429 7.56566C5.78432 7.71569 5.9878 7.79998 6.19998 7.79998V10.2C6.19998 10.4121 6.28426 10.6156 6.43429 10.7657C6.58432 10.9157 6.7878 11 6.99998 11H7.79998C8.01215 11 8.21563 10.9157 8.36566 10.7657C8.51569 10.6156 8.59998 10.4121 8.59998 10.2C8.59998 9.9878 8.51569 9.78432 8.36566 9.63429C8.21563 9.48426 8.01215 9.39997 7.79998 9.39997V6.99998C7.79998 6.7878 7.71569 6.58432 7.56566 6.43429C7.41563 6.28426 7.21215 6.19998 6.99998 6.19998H6.19998Z" fill="#DC2626"/></svg>
                  Stripe has determined that the risk with this transaction is elevated, proceed with caution to prevent chargebacks.
                </b-alert>
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-md-6">
                <b-alert show variant="info" class="alert-alt border">
                  <svg class="mr-2" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.4 6.99998C13.4 8.69736 12.7257 10.3252 11.5255 11.5255C10.3252 12.7257 8.69736 13.4 6.99998 13.4C5.30259 13.4 3.67472 12.7257 2.47449 11.5255C1.27426 10.3252 0.599976 8.69736 0.599976 6.99998C0.599976 5.30259 1.27426 3.67472 2.47449 2.47449C3.67472 1.27426 5.30259 0.599976 6.99998 0.599976C8.69736 0.599976 10.3252 1.27426 11.5255 2.47449C12.7257 3.67472 13.4 5.30259 13.4 6.99998ZM7.79998 3.79998C7.79998 4.01215 7.71569 4.21563 7.56566 4.36566C7.41563 4.51569 7.21215 4.59998 6.99998 4.59998C6.7878 4.59998 6.58432 4.51569 6.43429 4.36566C6.28426 4.21563 6.19998 4.01215 6.19998 3.79998C6.19998 3.5878 6.28426 3.38432 6.43429 3.23429C6.58432 3.08426 6.7878 2.99998 6.99998 2.99998C7.21215 2.99998 7.41563 3.08426 7.56566 3.23429C7.71569 3.38432 7.79998 3.5878 7.79998 3.79998ZM6.19998 6.19998C5.9878 6.19998 5.78432 6.28426 5.63429 6.43429C5.48426 6.58432 5.39998 6.7878 5.39998 6.99998C5.39998 7.21215 5.48426 7.41563 5.63429 7.56566C5.78432 7.71569 5.9878 7.79998 6.19998 7.79998V10.2C6.19998 10.4121 6.28426 10.6156 6.43429 10.7657C6.58432 10.9157 6.7878 11 6.99998 11H7.79998C8.01215 11 8.21563 10.9157 8.36566 10.7657C8.51569 10.6156 8.59998 10.4121 8.59998 10.2C8.59998 9.9878 8.51569 9.78432 8.36566 9.63429C8.21563 9.48426 8.01215 9.39997 7.79998 9.39997V6.99998C7.79998 6.7878 7.71569 6.58432 7.56566 6.43429C7.41563 6.28426 7.21215 6.19998 6.99998 6.19998H6.19998Z" fill="#2563EB"/></svg>
                  If there are any issues with the order please contact the customer via email or phone
                </b-alert>
              </div>
            </div>
            <!-- end TOP CARDS -->

          </div>
          <prepareOrderSteps v-if="!showVerifyId" ref="steps" :tabs="tabs" :order="order" :parcelType="parcelType" :loading="loading" @getOrder="getOrderData" />
          <prepareOrderVerifyId ref="verifyCustomer" :order="order" v-if="order && showVerifyId" />
        </div>
        <div class="d-flex justify-content-end text-danger mt-2 mb-n2" v-if="!order.issued_at">
          Please, claim the order if you want to continue.
        </div>
        <div v-if="!showVerifyId" class="mt-4 d-flex justify-content-end nav-buttons" :class="{'disabled':!order.issued_at}">
          <button v-if="prevStep" @click="addStep(prevStep)" class="px-3 btn btn-sm btn-outline-primary d-flex justify-content-between text-left mr-3">
            <svg class="mr-2" width="6" height="10" viewBox="0 0 6 10" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.70679 0.293031C5.89426 0.480558 5.99957 0.734866 5.99957 1.00003C5.99957 1.26519 5.89426 1.5195 5.70679 1.70703L2.41379 5.00003L5.70679 8.29303C5.88894 8.48163 5.98974 8.73423 5.98746 8.99643C5.98518 9.25863 5.88001 9.50944 5.6946 9.69485C5.5092 9.88026 5.25838 9.98543 4.99619 9.9877C4.73399 9.98998 4.48139 9.88919 4.29279 9.70703L0.292787 5.70703C0.105316 5.5195 0 5.26519 0 5.00003C0 4.73487 0.105316 4.48056 0.292787 4.29303L4.29279 0.293031C4.48031 0.10556 4.73462 0.000244141 4.99979 0.000244141C5.26495 0.000244141 5.51926 0.10556 5.70679 0.293031Z" fill="currentColor"/></svg>
            Previous
          </button>
          <button :class="{'disabled': nextButtonDisabled}" v-if="nextStep" @click="addStep(nextStep)" class="px-3 btn btn-sm btn-primary d-flex justify-content-between text-left">
            Next
            <svg class="ml-2" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.293 9.70692C0.105529 9.51939 0.000213623 9.26508 0.000213623 8.99992C0.000213623 8.73475 0.105529 8.48045 0.293 8.29292L3.586 4.99992L0.293 1.70692C0.110842 1.51832 0.0100473 1.26571 0.0123258 1.00352C0.0146042 0.741321 0.119773 0.490509 0.305182 0.305101C0.49059 0.119692 0.741402 0.0145233 1.0036 0.0122448C1.2658 0.00996641 1.5184 0.110761 1.707 0.292919L5.707 4.29292C5.89447 4.48045 5.99979 4.73475 5.99979 4.99992C5.99979 5.26508 5.89447 5.51939 5.707 5.70692L1.707 9.70692C1.51947 9.89439 1.26516 9.99971 1 9.99971C0.734836 9.99971 0.480528 9.89439 0.293 9.70692Z" fill="white"/></svg>
          </button>
          <!--<a :class="{'disabled': nextButtonDisabled}" v-if="nextStep" :href="addStep(prevStep)" class="px-3 btn btn-sm btn-primary d-flex justify-content-between text-left">
            Next
            <svg class="ml-2" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.293 9.70692C0.105529 9.51939 0.000213623 9.26508 0.000213623 8.99992C0.000213623 8.73475 0.105529 8.48045 0.293 8.29292L3.586 4.99992L0.293 1.70692C0.110842 1.51832 0.0100473 1.26571 0.0123258 1.00352C0.0146042 0.741321 0.119773 0.490509 0.305182 0.305101C0.49059 0.119692 0.741402 0.0145233 1.0036 0.0122448C1.2658 0.00996641 1.5184 0.110761 1.707 0.292919L5.707 4.29292C5.89447 4.48045 5.99979 4.73475 5.99979 4.99992C5.99979 5.26508 5.89447 5.51939 5.707 5.70692L1.707 9.70692C1.51947 9.89439 1.26516 9.99971 1 9.99971C0.734836 9.99971 0.480528 9.89439 0.293 9.70692Z" fill="white"/></svg>
          </a>-->
          <button v-else :class="{'disabled': nextButtonDisabled}" @click="finish" class="px-3 btn btn-sm btn-primary d-flex justify-content-between text-left">
            Finish
          </button>
        </div>
      </div>

      <!-- Modals -->
      <b-modal centered ref="cancelOrderModal" id="cancelOrderModal" ok-variant="danger" cancel-variant="action" ok-title="Cancel Order" @ok="cancelOrder" :ok-disabled="cancelledReason == 'Other' && manualCancellationReason.trim() == ''">
        <div slot="modal-header" class="d-flex">
          <svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="22" fill="none" viewBox="0 0 24 24" stroke="#EF4444"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <h5>Cancel Order</h5>
        </div>
        <div class="text-muted mb-2">
          Are you sure you want to cancel the order? This action cannot be undone.
        </div>
        <div class="alert text-left px-3 alert-warning text-medium">
          <template v-if="order.payment_type == 'Credit Card'">
            This transaction has been paid with a Credit Card, if you click Cancel Order you are refunding the Customer, <b>Stripe will not return your transaction fee</b>. This is Stripe’s policy and not EZ-AD’s.
          </template>
          <template v-else>
            Please Confirm before Canceling Order
          </template>
        </div>
        <div class="my-2">
          <label for="cancellation-reason-select">Cancellation Reason</label>
          <b-form-radio-group id="cancellation-reason-select" class="mb-0" v-model="cancelledReason">
            <div>
              <b-form-radio v-for="(reason, index) in cancellationReasons"
                class="mb-1"
                :key="`reason-${index}`"
                :value="reason">
                {{ reason }}
              </b-form-radio>
            </div>
          </b-form-radio-group>

          <input class="form-control m-2" type="text" v-if="cancelledReason == 'Other'" v-model="manualCancellationReason" placeholder="Cancellation Reason" />
        </div>
      </b-modal>

      <b-modal id="assignArDialog" ref="assignArDialog" size="md" class="modal-box ar-modal">
        <div slot="modal-header">
          <h5>Assign A/R Account</h5>
        </div>
        <input class="form-control mb-2" type="text" v-model="arAccountFilter" placeholder="Filter by account #, name, or email">
        <div class="table">
          <table class="table">
            <thead>
            <tr>
              <th>Account #</th>
              <th>Customer Name</th>
              <th>Assign</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="acct in arAccounts" :key="acct.id">
              <td>{{ acct.account_num }}</td>
              <td>{{ acct.customer_name }}</td>
              <td>
                <button type="button" class="btn btn-primary btn-sm" @click="assignARAccount(acct.id)">Assign</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div slot="modal-footer">
          <button type="button" @click="$refs.assignArDialog.hide()" class="btn btn-outline-primary">Close</button>
        </div>
      </b-modal>
      <b-modal ref="emailModal" size="lg" centered>
        <div slot="modal-header">
          <h5 class="modal-title">Send email</h5>
        </div>
        <form id="sendEmailForm" @submit.prevent="sendEmail" :class="{'disabled': sendingEmail}">
          <div class="form-group">
            <label for="subject">Subject</label>
            <input v-model="emailSubject" name="subject" type="text" class="form-control" placeholder="Email subject" />
          </div>
          <div class="form-group">
            <label for="body">Body</label>
            <textarea v-model="emailBody" class="form-control" rows="6" name="body" placeholder="Write the email body here"></textarea>
          </div>
        </form>
        <div slot="modal-footer">
          <button form="sendEmailForm" type="submit" class="btn btn-primary" :disabled="sendingEmail">
            <div v-if="sendingEmail" class="spinner-border spinner-border-sm mr-2" />
            Send
          </button>
        </div>
      </b-modal>
      <b-modal size="lg" ref="paymentInfoDialog" v-if="paymentInfo" centered>
        <div slot="modal-header">
          <h5 class="modal-title">
            {{ paymentInfo.type && paymentInfo.type == 'paypal' ? 'Paypal Information':'Stripe Information' }}
          </h5>
        </div>
        <div class="pb-3" v-if="paymentInfo.type && paymentInfo.type == 'paypal'" style="font-weight: 500;">
          <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <div class="text-muted pr-4">Status</div>
            <div class="text-right">{{ paymentInfo.status | capitalize }}</div>
          </div>
          <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <div class="text-muted pr-4">Transaction Id</div>
            <div class="text-right">{{ paymentInfo.id | capitalize }}</div>
          </div>
          <div v-if="paymentInfo.amount && paymentInfo.amount.value" class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <div class="text-muted pr-4">Amount</div>
            <div class="text-right">{{ paymentInfo.amount.value | upperCase }}</div>
          </div>
          <div v-if="paymentInfo.amount && paymentInfo.amount.currency_code" class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <div class="text-muted pr-4">Currency</div>
            <div class="text-right">{{ paymentInfo.amount.currency_code | upperCase }}</div>
          </div>
          <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <div class="text-muted pr-4">Invoice Id</div>
            <div class="text-right">{{ paymentInfo.invoice_id | upperCase }}</div>
          </div>
        </div>
        <div class="pb-3" v-else style="font-weight: 500;">
          <div v-if="paymentInfo.outcome" class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <h6 class="font-weight-bold pr-4">Risk Evaluation</h6>
          </div>
          <div v-if="paymentInfo.outcome" class="risk-factor mt-4">
            <span class="risk-count">0</span>
            <div class="strip strip-green"></div>
            <span class="risk-count count-5">5</span>
            <div class="strip strip-yellow"></div>
            <span class="risk-count count-65">65</span>
            <div class="strip strip-orange"></div>
            <span class="risk-count count-75">75</span>
            <div class="strip strip-red"></div>
            <span class="risk-count end">100</span>
            <div class="indicator" :style="{ left: indicatorPosition + '%' }">
              <span :style="{ backgroundColor: indicatorColor }">{{ riskValue }}</span>
              <span style="left: 40px;">{{ paymentInfo.outcome.risk_level | capitalize }}</span>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center text-small pt-4 pb-0">
            <h6 class="font-weight-bold pr-4">Customer Details</h6>
          </div>
          <div v-if="paymentInfo.customerInfo" class="d-flex justify-content-between align-items-center text-small pt-0 pb-1">
            <div class="text-muted pr-4">Name</div>
            <div class="text-right">{{ paymentInfo.customerInfo.name | capitalize }}</div>
          </div>
          <div v-if="paymentInfo.customerInfo" class="d-flex justify-content-between align-items-center text-small pt-1 pb-1">
            <div class="text-muted pr-4">Email</div>
            <div class="text-right">{{ paymentInfo.customerInfo.email }}</div>
          </div>
          <div class="d-flex justify-content-between align-items-center text-small pt-1 pb-1">
            <div class="text-muted pr-4">Address</div>
            <div class="text-right">{{ stripeCustomerAddress | upperCase }}</div>
          </div>
          <div class="d-flex justify-content-between align-items-center text-small pt-4 pb-0">
            <h6 class="font-weight-bold pr-4">Payment Details</h6>
          </div>
          <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <div class="text-muted pr-4">Status</div>
            <div class="text-right">{{ paymentInfo.status | capitalize }}</div>
          </div>
          <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <div class="text-muted pr-4">Currency</div>
            <div class="text-right">{{ paymentInfo.currency | upperCase }}</div>
          </div>
          <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1" v-if="paymentInfo.source">
            <div class="text-muted pr-4">Card Id</div>
            <div class="text-right">{{ paymentInfo.source.id }}</div>
          </div>
          <div v-if="paymentInfo.payment_method_details && paymentInfo.payment_method_details.card" class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <div class="text-muted pr-4">Card Number</div>
            <div class="text-right">**** {{ paymentInfo.payment_method_details.card.last4 }}</div>
          </div>
          <div v-if="paymentInfo.payment_method_details && paymentInfo.payment_method_details.card" class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <div class="text-muted pr-4">Expires</div>
            <div class="text-right">{{ paymentInfo.payment_method_details.card.exp_month }} / {{ paymentInfo.payment_method_details.card.exp_year }}</div>
          </div>
          <div v-if="paymentInfo.payment_method_details && paymentInfo.payment_method_details.card" class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <div class="text-muted pr-4">Fingerprint</div>
            <div class="text-right">{{ paymentInfo.payment_method_details.card.fingerprint }}</div>
          </div>
          <div v-if="paymentInfo.payment_method_details && paymentInfo.payment_method_details.card" class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <div class="text-muted pr-4">Card Type</div>
            <div class="text-right">{{ paymentInfo.payment_method_details.card.brand | capitalize }}</div>
          </div>
          <div v-if="paymentInfo.billing_details && paymentInfo.billing_details.address" class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <div class="text-muted pr-4">Postal Code</div>
            <div class="text-right">{{ paymentInfo.billing_details.address.postal_code }}</div>
          </div>
          <div v-if="paymentInfo.payment_method_details && paymentInfo.payment_method_details.card" class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <div class="text-muted pr-4">Origin</div>
            <div class="text-right">{{ paymentInfo.payment_method_details.card.country | upperCase }}</div>
          </div>
          <div v-if="paymentInfo.payment_method_details && paymentInfo.payment_method_details.card" class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <div class="text-muted pr-4">CVC Check</div>
            <div class="text-right badge" :class="getBadgeClass(paymentInfo.payment_method_details.card.checks.cvc_check)">{{ paymentInfo.payment_method_details.card.checks.cvc_check | upperCase }}</div>
          </div>
          <div v-if="paymentInfo.payment_method_details && paymentInfo.payment_method_details.card" class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
            <div class="text-muted pr-4">Zip Check</div>
            <div class="text-right badge" :class="getBadgeClass(paymentInfo.payment_method_details.card.checks.address_postal_code_check)">{{ paymentInfo.payment_method_details.card.checks.address_postal_code_check | upperCase }}</div>
          </div>
        </div>
        <div slot="modal-footer">
          <button type="button" @click="$refs.paymentInfoDialog.hide()" class="btn btn-outline-primary">Close</button>
        </div>
      </b-modal>
    </div>
    <NotesList ref="notesList" />
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
        <shipping-labels @showMoreLabelsButton="hasLabels = true" @showCreateLabelModel="showCreateLabelModel" :orderId="parseInt(orderId)"/>
      </div>
    </b-modal>
    <CreateLabelModal :customShipping="order.custom_shipping ? order.custom_shipping : null"
                      :show="false" :orderId="parseInt(orderId)" :orderAmount="order.total ? order.total : null" ref="createLabelModal"/>

  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import { debounce } from 'debounce';
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
  import prepareOrderSteps from '@/components/admin/prepare-order/steps';
  import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
  import moment from 'moment-timezone';
  import NotesList from '@/components/admin/orders/notesList';
  import ShippingLabels from "../../pages/admin/orders/shipping-labels";
  import CreateLabelModal from '@/components/modals/create-label-modal';
  import prepareOrderVerifyId from '@/components/admin/prepare-order/verify-id.vue';

  export default {
    name: 'AdminPrepareOrder',
    components: {
      VueCtkDateTimePicker,
      prepareOrderSteps,
      NotesList,
      ShippingLabels,
      CreateLabelModal,
      prepareOrderVerifyId
    },
    data() {
      return {
        nextButtonDisabled: false,
        activeTab: 0,
        order: null,
        parcelType: '',
        preparing: false,
        loading: false,
        orderId: null,
        parcelId: null,
        disableFirstTab: false,
        disableSecondTab: false,
        disableThirdTab: false,
        fields: ['checklist','sku', 'upc', 'image_url', 'quantity', 'title',  'brand_name', 'price', 'email_action'],
        canceling: false,
        shippingSlip: null,
        deliveryTime: null,
        subAccountSlug: null,
        reclaim: false,
        claiming: false,
        arAccountFilter: '',
        arAccounts: [],
        emailSubject: '',
        emailBody: '',
        sendingEmail: false,
        bookingOrder: false,
        fetchingMapLink: false,
        hasLabels: false,
        cancellationReasons: ["Customer Changed Mind", "Cancelled And Purchased In Store", "Customer Ordered Wrong Item", "Item Not Available", "Shipping Too High", "Other"],
        cancelledReason: '',
        manualCancellationReason: '',
        showVerifyId: false
      };
    },
    computed: {
      showARButton() {
        const info = JSON.parse(this.$store.state.businessDetails.account_field_info || "{}");
        const accountsEnabled = info.display || false;
        const hideOnPrepareOrder = info.hideOnPrepareOrder || false;
        return accountsEnabled && !hideOnPrepareOrder && this.$store.state.settings.admin.showContractors && !this.order.ar_account_num;
      },
      businessDetails() {
        return this.$store.state.businessDetails;
      },
      tabs() {
        let ret = [
          { step: 'evaluation', title: "evaluation" },
          { step: 'package', title: "Package" },
          { step: 'enterInPos', title: 'Enter in POS' },
          // { step: '#verifyCustomer', title: 'Verify Customer' },
          { step: 'markAsPrepared', title: 'Mark as Prepared' }
        ];
        if(!this.paymentInfo) {
          ret = ret.filter(item => item.step !== 'verifyCustomer');
        }
        !this.$store.state.settings.admin.hideSecondStep && ret.unshift({ step: 'prepareItems', title: 'Prepare Items' });
        return ret;
      },
      initPage() {
        return this.tabs[0] && (this.$route.query.step == this.tabs[0].step || this.$route.query.step == '#' || this.$route.query.step == '' || !this.$route.query.step);
      },
      customFields() {
        var customFields = {};
        var skippedKeys = ['order_notes'];

        if(this.order.custom_info) {
          Object.entries(this.order.custom_info).forEach(([key, value]) => {
            if(!skippedKeys.includes(key) && value != "") {
              if(typeof value === "boolean") {
                customFields[this.updateKey(key)] = !!value;
              } else {
                customFields[this.updateKey(key)] = value;
              }
            }
          });
        }
        return customFields;
      },
      today() {
        return new Date(Date.now()).toISOString().slice(0,10).replace(/-/g,"-");
      },
      dateFormat() {
        return this.businessDetails.delivery_settings && this.businessDetails.delivery_settings.enable_time ? 'YYYY-MM-DD HH:mm:ss a' : 'YYYY-MM-DD';
      },
      dateFormatted() {
        return this.businessDetails.delivery_settings && this.businessDetails.delivery_settings.enable_time ? 'ddd, MMM Do, YYYY, h a' : 'ddd, MMM Do, YYYY';
      },
      canMakeDoitbest() {
        if (this.parcelItems) {
          let doitBest = this.parcelItems.filter(x => x.brand_name == 'Do it Best');
          if (doitBest.length > 0) {
            return true;
          }
        }
        return false;
      },
      fullAddress() {
        let address_arr = [];
        let ret = '';
        this.order.city && address_arr.push(this.order.city);
        this.order.state && address_arr.push(this.order.state);
        this.order.zip && address_arr.push(this.order.zip);
        ret += this.order.address ? `${this.order.address}, ` : '';
        ret += this.order.address2 ? `${this.order.address2}, ` : '';
        ret += address_arr.join(', ');
        return ret;
      },
      billingAddress() {
        let address_arr = [];
        let ret = '';
        this.order.billing_city && address_arr.push(this.order.billing_city);
        this.order.billing_state && address_arr.push(this.order.billing_state);
        this.order.billing_zip && address_arr.push(this.order.billing_zip);
        ret += this.order.billing_address ? `${this.order.billing_address}, ` : '';
        ret += this.order.billing_address2 ? `${this.order.billing_address2}, ` : '';
        ret += address_arr.join(', ');
        return ret;
      },
      nextStep() {
        let currentIndex = this.tabs.indexOf(this.tabs.find(e => e.step == this.$route.query.step));
        currentIndex = currentIndex == -1 ? 0 : currentIndex;
        return this.tabs[currentIndex + 1] ? this.tabs[currentIndex + 1].step : undefined;
      },
      prevStep() {
        let currentIndex = this.tabs.indexOf(this.tabs.find(e => e.step == this.$route.query.step));
        return this.tabs[currentIndex - 1] ? this.tabs[currentIndex - 1].step : undefined;
      },
      paymentInfo() {
        return this.order.charge ? this.order.charge : null;
      },
      riskStripWidth() {
        return ((this.riskValue - 0) / (100 - 0)) * 100;
      },
      indicatorPosition() {
        return ((this.riskValue - 0) / (100 - 0)) * 100;
      },
      indicatorColor(){
        if(this.riskValue >= 0 && this.riskValue <= 5) {
          return "rgb(3, 157, 3)";
        }
        if(this.riskValue >= 6 && this.riskValue <= 65) {
          return "rgb(255, 196, 0)";
        }
        if(this.riskValue >= 65 && this.riskValue <= 75) {
          return "rgb(255, 115, 0)";
        }
        if(this.riskValue >= 75 && this.riskValue <= 100) {
          return "rgb(169, 33, 33)";
        }
        return '';
      },
      highPaymentRiskLevel() {
        return this.paymentInfo && this.paymentInfo.outcome && this.paymentInfo.outcome.risk_level
          && this.paymentInfo.outcome.risk_level != "normal" ? true : false;
      },
      riskValue() {
        if(this.paymentInfo && this.paymentInfo.outcome && this.paymentInfo.outcome.risk_score) {
          return this.paymentInfo.outcome.risk_score;
        }
        return 0;
      },
      stripeCustomerAddress() {
        if(this.paymentInfo && this.paymentInfo.billing_details && this.paymentInfo.billing_details.address) {
          return `${this.paymentInfo.billing_details.address.line1 ? this.paymentInfo.billing_details.address.line1 : '' }
          ${this.paymentInfo.billing_details.address.line2 ? ' - '+this.paymentInfo.billing_details.address.line2 : '' }
          ${this.paymentInfo.billing_details.address.city ? ', '+this.paymentInfo.billing_details.address.city : '' }
          ${this.paymentInfo.billing_details.address.state ? ', '+this.paymentInfo.billing_details.address.state : '' }
          ${this.paymentInfo.billing_details.address.postal_code ? ', '+this.paymentInfo.billing_details.address.postal_code : '' }
          ${this.paymentInfo.billing_details.address.country ? ', '+this.paymentInfo.billing_details.address.country : '' }`;
        }
        return '';
      },
      isAdvancedShippingEnabled() {
        return this.businessDetails.advanced_shipping_enabled == 1;
      },
      showChargeCard(){
        // booked_date shows the charge card date
        // Added a check to not show charge card button if cc_captured is 1 and booked_date not available bcs there are some orders with cc_captured 1 and booked_date null
        return (this.order.booked_date || this.order.transaction && this.order.transaction.cc_captured == 0);
      }
    },
    created() {
      this.subAccountSlug = this.$store.state.activeUser.data.customer.slug;
      let useParcelType = false;
      const s = this.$store.state.settings;
      if ( s.admin && s.admin.orders && s.admin.orders.useParcelType ) {
        useParcelType = true;
      }

      if (!this.$route.query || !this.$route.query.id) {
        this.goToOrders();
      } else {
        this.orderId = this.$route.query.id;
        this.parcelType = useParcelType ? this.$route.query.ptype : this.$route.query.type;
        this.parcelId = this.$route.query.parce_id;
      }
    },
    async mounted() {
      await this.getOrderData();
    },
    methods: {
      addStep(step) {
        const updatedQuery = { ...this.$route.query };
        updatedQuery.step = step;
        this.$router.push({ path: this.$route.path, query: updatedQuery });
      },
      finish() {
        if(this.order.charge && !this.order.customer_verify_date) {
          this.showVerifyId = true;
        } else {
          this.$router.push({path: "/admin/orders"}).catch(err => console.log(err));
        }
      },
      displayValue(value) {
      // Check if value is an object and has the 'text' property
      if (value && typeof value === 'object' && 'text' in value) {
        return value.text;
      }
      // Otherwise, return the value as is
      return value;
    },
      formatDate(value) {
        return value ? moment.utc(value).local().format('MMM D, YYYY hh:mm A'): '';
      },
      showEmailModal() {
        this.emailSubject = `${this.businessDetails.business_name} - Order #${this.orderId}`;
        this.emailBody = '';
        this.$refs.emailModal.show();
      },
      async sendEmail() {
        this.sendingEmail = true;
        await AdminService.sendEmailByOrderId({
          id: this.order.id,
          subject: this.emailSubject,
          body: this.emailBody
        });
        this.sendingEmail = false;
        this.$refs.emailModal.hide();
        this.$swal({
          type: 'success',
          title: 'Email sent',
          showConfirmButton: false,
          html: 'Your email has been sent!',
          timer: 3000
        });
      },
      async openARList() {
        await this.filterARAccounts();
        this.$refs.assignArDialog.show();
      },
      async filterARAccounts() {
        const res = await AdminService.arAccountList(this.arAccountFilter);
        this.arAccounts = res.data.data;
      },
      async assignARAccount(id) {
        const res = await AdminService.assignARAccount(this.orderId, id);
        if ( res.data.status === 'success' ) {
          this.order.ar_account_num = res.data.account_num;
          this.order.contractor = 1;
          this.$swal('Updated', 'A/R account was assigned to the customer.', 'success');
          this.$refs.assignArDialog.hide();
        } else {
          this.$swal('Error', res.data.message, 'error');
        }
      },
      async getOrderData() {
        try {
          this.loading = true;
          await AdminService.getOrder(this.orderId).then(resp => {
            this.loading = false;
            this.order = resp.data.order;
            this.order.date_purchased = moment.utc(this.order.date_purchased).local().format('MMM D, YYYY hh:mm A');
            this.order.formatted_issued_at = moment.utc(this.order.issued_at).local().format('MMM D, YYYY hh:mm A');
            if (this.order.order_type == 'doitbest') {
              AdminService.doItBestRSCOptions(this.order.id).then(r => this.RSCOptions = r.data.rscOptions);
              AdminService.doItBestShippingMethods(r => this.doItBestShippingMethods = r.data.services);
            }
            this.parcelType == 'special' && this.$delete(this.tabs, 1);
          });
        } catch (e) {
          this.loading = false;
        }
      },
      updateKey(key) {
        return key.replace(/_/g, " ");
      },
      onDeliveryDateChange(date) {
        AdminService.updateOrderDeliveryDate({ id: this.order.id, delivery_date: date });
      },
      shippingSlipLoaded() {
        window.print();
      },
      goToOrders(params = {}) {
        this.$router.push({name: `admin-orders-list`, params: params}).catch(err => console.log(err));
      },
      markAsPrepared() {
        AdminService.markPrepared(this.parcelId, this.deliveryTime, this.$store.state.activeUser.data.customer.id).then(response => {
          if (response.data.status == 'success') {
            this.showMsgBox();
          } else {
            this.$swal('Error', response.data.message, 'error');
            //this.makeToast('danger', 'Oops', 'Something went wrong, please try again later!');
          }
        });
      },
      async markAsSpecial(lineid, quantity) {
        try {
          let response = await AdminService.markItemSpecial(this.orderId, lineid, quantity);
          response = response.data;
          if (response.status == 'success') {
            this.showSpecialMsgBox();
          } else {
            this.makeToast('danger', 'Oops', 'Something went wrong, please try again later!');
          }
        } catch (e) {
            this.preparing = false;
            console.log('error in preparing order : ', e);
        }
      },
      showSpecialMsgBox() {
        this.$swal({
          title: 'Success',
          text: 'Item has been marked as special!',
          type: 'success',
        }).then(() => this.goToOrders('cancelled'));
      },
      async makeDoitBestParcel() {
        try {
          let response = await AdminService.doItBestPrepare(this.orderId).data;
          if (response.status == 'success')
            this.showDoitBestMsgBox();
          else
            this.makeToast('danger', 'Oops', 'Something went wrong, please try again later!');
        } catch (err) {
          this.preparing = false;
          this.makeToast('danger', 'Oops', err);
          console.log('error in making doitbest order: ', err);
        }
      },
      showDoitBestMsgBox() {
        this.$swal({
          title: 'Success',
          text: 'Doitbest order added',
          type: 'success'
        })
        .then(() => this.goToOrders());
      },
      async cancelOrder() {
        try {
          this.canceling = true;

          if(this.cancelledReason == "Other" && this.manualCancellationReason.trim() == "") {
            this.$swal('Error', "Please add cancellation reason!!", 'error');
            this.canceling = false;
            return;
          }

          const cancellationReason = this.cancelledReason == "Other" ? this.manualCancellationReason.trim() : this.cancelledReason;
          let response = await AdminService.cancelOrder(this.orderId, cancellationReason);
          response = response.data;
          this.canceling = false;
          if (response.status == 'success') {
            let dataLayerOb = {
              'event': 'refund',
              'ecommerce': {
                'transaction_id': this.orderId
              }
            };
            window.dataLayer.push(dataLayerOb);
            window.gtag && window.gtag('event', 'refund', dataLayerOb);
            this.showMsgBoxCancelSucces();
          } else {
            this.makeToast('error', 'Oops', 'Something went wrong, please try again later!');
          }
        } catch (e) {
          this.canceling = false;
          console.log('error in canceling order : ', e);
        }
      },
      makeToast(variant, title, content) {
        this.$swal({
          toast: true,
          position: 'top',
          text: content,
          showConfirmButton: false,
          timer: 3000,
          type: variant,
          title: title
        });
      },
      showMsgBoxCancelSucces() {
        this.$swal({
          title: 'Success',
          text: 'Order has been canceled!',
          type: 'success'
        })
        .then(() => this.goToOrders());
      },
      showMsgBox() {
        this.$swal({
          title: 'Success',
          text: "Order has been marked as prepared!",
          type: 'success'
        }).then(() => {
          this.goToOrders();
        });
      },
      async claimOrder() {
        this.claiming = true;
        AdminService.orderTaken(this.orderId, this.subAccountSlug).then(res => {
          this.order.issued_first = res.data.issued_first || 'Master';
          this.order.issued_last = res.data.issued_last || 'Account';
          this.order.issued_at = Date.now();
          this.order.formatted_issued_at = moment.utc(this.order.issued_at).local().format('MMM D, YYYY hh:mm A');
          this.claiming = false;
          this.reclaim = true;
        }).catch(() => {
          this.makeToast('error', 'Error', 'There was an error while trying to claim the order.');
          this.claiming = false;
        });
        // if (response.status == 'error') {
        //   this.makeToast('There was an error while trying to claim the order.');
        // }
      },
      async prepareStep() {
        this.bookingOrder = true;
        let res = await AdminService.prepareStep({id: this.order.id, step: 'booked'});
        if (res.data.status === "success") {
          this.order.booked_date = res.data.date;
          this.order.formatted_booked_date = moment.utc(this.order.booked_date).local().format('MMM D, YYYY hh:mm A');
        } else {
          this.$swal(res.data.message, '', 'error');
        }
        this.bookingOrder = false;
      },
      openPaymentInfo() {
        this.$refs.paymentInfoDialog.show();
      },
      getBadgeClass(value) {
        if(value == 'pass') {
          return "badge-success";
        } else if(value == 'fail') {
          return "badge-danger";
        } else {
          return "badge-warning";
        }
      },
      async openCustomerMapsLink() {
        this.fetchingMapLink = true;
        let resp = await AdminService.getMapsLink(this.order.id);
        this.fetchingMapLink = false;
        if(resp.data.status == 'success') {
          window.open(resp.data.url);
        }
      },
      showCreateLabelModel() {
        this.$refs.createLabelModal.showModal();
        this.$refs.shippingLabels.hide();
      },
    },
    filters: {
      toDollar(value) {
        return value.toFixed(2);
      }
    },
    watch: {
      '$route.query.step'() {
        this.nextButtonDisabled = false;
      },
      arAccountFilter: debounce(function() {
        this.filterARAccounts();
      }, 500)
    }
  };
</script>

<style scoped lang="scss">
  .badge {
    font-size: 13px;
  }
  .payment-warning {
    border-radius: 6px;
    animation: anim-glow 1s ease infinite;
    font-size: 16px;
  }
  :deep(#assignArDialog) {
    .modal-content {
      .modal-body {
        padding-bottom: 0 !important;
        .table {
          thead {
            position: sticky;
            top: -1px;
            z-index: 1;
            box-shadow: 0 1px 3px rgba(0,0,0,.07);
          }
          max-height: calc((var(--vh, 1vh) * 100) - 270px);
          overflow-y: auto;
          margin-bottom: 0;
          padding-bottom: 1rem;
        }
      }
    }
  }
  .btn-claim {
    width: 489px;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 6px;
    animation: anim-glow 1s ease infinite;
  }
  h5 {
    font-size: 18px;
  }
  .card-alt {
    color: #334155;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    .card-header {
      height: 50px;
    }
    .btn-options {
      color: #64748B;
      background: #F1F5F9;
      border: 1px solid #E2E8F0;
      max-height: 32px;
      height: 32px;
      &.rounded-circle {
        max-width: 32px;
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }
      svg {
        * {
          stroke: #64748B;
        }
      }
    }
  }

  .confirmation-footer {
    justify-content: space-between;
    .btn-default {
      border: 1px solid #E6E6E6;
    }
  }
  .wrapper-content {
    ul {
      padding-left: 0;
      li {
        list-style: none;
        margin: 20px 0;
        padding: 0 20px;
        a {
          background: #F6F7F8;
          mix-blend-mode: normal;
          border-radius: 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 30px 15px 0;
          position: relative;
          min-height: 105px;
          button {
            color: #000;
            border: 1px solid #E6E6E6;
            box-sizing: border-box;
            box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);
            border-radius: 5px;
            background: #fff;
          }
          span {
            display: flex;
            flex-direction: column;
            padding: 0 20px;
            flex: 1;
            h3 {
              font-size: 23px;
              line-height: 27px;
              margin-bottom: 0;
              color: var(--text);
            }
            p {
              font-size: 16px;
              line-height: 19px;
              margin-bottom: 0;
              color: #828282;
            }
          }
          button {
            flex: 1;
            max-width: 120px;
            white-space: nowrap;
            padding: 2px 0 !important;
            margin: 0 30px;
            img {
              margin-right: 8px;
            }
          }
          .check {
            position: absolute;
            top: 15px;
            right: -5px;
          }
        }
      }
    }
    .error-text {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 15px auto;
      width: 100%;
      font-size: 14px;
      line-height: 16px;
      color: #4D4D4D;
      img {
        margin-right: 5px;
      }
    }
  }
  .btn-badges {
    display: flex;
    justify-content: space-between;
    padding: 15px;
  }
  .success-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 330px;
    margin: 0 auto;
    padding: 50px 0 100px;
    .img-suc {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      align-items: center;
      h5 {
        font-size: 23px;
        line-height: 27px;
        text-align: center;
        color: var(--text);
        margin-top: 20px;
        margin-bottom: 15px;
        font-weight: 600;
      }
      p {
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        color: var(--text);
        margin-bottom: 24px;
      }
    }
    .btn-primary {
      font-size: 18px;
      line-height: 16px;
      text-align: center;
      color: #FFFFFF;
    }
  }
  .btn-prev {
    display: flex;
    border: 1px solid #E6E6E6;
    box-sizing: border-box;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    font-size: 16px;
    color: var(--text);
    line-height: 19px;
  }

  :deep(#deliveryPicker-wrapper) {
    width: auto;
    .datepicker.right {
      right: -160px;
      margin-top: 10px;
    }
  }

  td > .name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .make-do-it-best {
    font-size: 14px;
    line-height: 16px;
    border-radius: 5px;
    margin-bottom: 5px;
    padding: 6px;
    color: var(--text);
    border: 1px solid #E6E6E6;
    -webkit-box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);
    white-space: nowrap;
  }

  :deep(#cancelOrderModal .modal-dialog) {
    max-width: 416px;
  }

  @media (max-width: 992px) {
    .card.main {
      border: none;
    }
    .prepare-order {
      background: #fff;
      min-height: calc(var(--vh, 1vh) * 100);
    }
    .order-table {
      border: none !important;
      .total-custom {
        padding: 20px 0 0;
      }
    }
  }
  @media (max-width: 768px) {
    .btn-claim {
      width: 100%;
    }
    .wrapper-content {
      ul {
        li {
          a {
            button {
              margin: 0 !important;
            }
          }
        }
      }
    }
    .card.customer-details,
    .card.order-details {
      background: #fff;
      > div {
        padding: 10px !important;
      }
    }
    .claim-order {
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      .btn {
        padding: 0;
        border: 0;
        height: auto;
        font-size: 13px;
        line-height: normal;
      }
      .h6 {
        font-size: 13px;
        font-weight: normal;
      }
    }
  }

  @media print {
    #prepareOrder,
    .nav-buttons,
    footer {
      display: none !important;
    }
  }
  @media (max-width: 576px) {
    #prepareOrder > .card {
      border: none;
      background: none;
    }
  }


.risk-factor {
  width: 100%;
  height: 12px;
  background-color: #fff;
  position: relative;
  border-radius: 3px;
  margin-bottom: 20px;
  .risk-count{
    position: absolute;
    top: 15px;
    &.count-5{
      left: 5%;
    }
    &.count-65{
      left: 65%;
    }
    &.count-75{
      left: 75%;
    }
    &.end{
      right: 0;
    }
  }
}

.strip {
  height: 100%;
  width: 100%;
  position: absolute;
  &.strip-green {
    background-color: rgb(3, 157, 3);
    left: 0;
    width: 5%;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
  }

  &.strip-yellow {
    background-color: rgb(255, 196, 0);
    left: 5%;
    width: 60%;
  }

  &.strip-orange {
    background-color: rgb(255, 115, 0);
    left: 65%;
    width: 10%;
  }

  &.strip-red {
    background-color: rgb(169, 33, 33);
    left: 75%;
    width: 25%;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
  }
}


.indicator {
  position: absolute;
  top: -8px;
  background-color: transparent;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 5px 0 5px;
  border-color: #000000 transparent transparent transparent;
}

.indicator span {
  position: absolute;
  top: -35px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  border-radius: 50%;
  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}
</style>

