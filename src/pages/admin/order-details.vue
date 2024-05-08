<template>
  <div class="order-details-wrapper">
    <div id="orderDetails">
      <b-alert show v-if="((order.payment_type && order.payment_type.toLowerCase() == 'auth only') && (order.status && order.status !== 'cancelled'))" variant="danger" class="alert-alt text-center py-2">
        We have authorized a charge for this order. Note that the authorization is only valid for 7 days. 
        If you will be fulfilling this order, make sure to mark it as prepared to capture and finalize the payment. 
        Marking an order as prepared will capture the payment if it is within the 7 day period. 
        If it will take longer than 7 days to prepare (special orders), you may want to capture this payment in advance now, 
        or use alternative payment options.
      </b-alert>
      <div class="container">
        <div class="py-4">
          <div class="main card p-sm-4">
            <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-3">
              <div class="d-flex align-items-center">
                <h4 class="mb-0 mr-3">Order #{{ order.id }}</h4>
                <div class="h4 text-danger mb-0 mr-3" v-if="order.status == 'cancelled'">(cancelled)</div>
                <a href="#" class="notes-bt" :style="{ background: order.notes_count > 0 ? '#E86767' : '#FEF3C7'}" @click.prevent="$refs.notesList.show(order.id)" aria-label="Show note">
                  <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7822 8.04647C13.7822 10.1279 13.7822 12.2093 13.7822 14.2907C13.7822 15.1459 13.2844 15.8173 12.4967 16.0197C12.3282 16.0598 12.1553 16.0789 11.9821 16.0768C8.59706 16.0801 5.21178 16.0801 1.82626 16.0768C0.733518 16.0786 0 15.3461 0 14.2591C0 10.1147 0 5.97033 0 1.82593C0 0.86094 0.578489 0.165103 1.50077 0.0176101C1.60781 0.00347238 1.71581 -0.00216745 1.82375 0.00074349C5.20855 0.00074349 8.59383 0.00074349 11.9796 0.00074349C13.0476 -0.000333101 13.7804 0.732826 13.7804 1.80296C13.7823 3.88437 13.7823 5.96578 13.7804 8.04719L13.7822 8.04647ZM12.6338 8.05724C12.6338 5.98181 12.6338 3.9065 12.6338 1.83131C12.6338 1.36479 12.421 1.14947 11.9573 1.14947H1.83738C1.36368 1.14803 1.15016 1.36335 1.15016 1.84136C1.15016 5.98025 1.15016 10.1192 1.15016 14.258C1.15016 14.7095 1.36978 14.9298 1.82052 14.9298H11.9581C12.4221 14.9298 12.6334 14.7163 12.6334 14.248C12.6339 12.1843 12.6334 10.1207 12.632 8.05724H12.6338Z" :fill="order.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.89194 8.61238C6.24024 8.61238 5.58854 8.61238 4.93685 8.61238C4.57224 8.61238 4.31027 8.37338 4.30776 8.04323C4.30525 7.71307 4.56757 7.46546 4.92823 7.4651C6.23737 7.46366 7.54674 7.46366 8.85636 7.4651C9.21809 7.4651 9.47648 7.7102 9.47396 8.04359C9.47145 8.37697 9.21307 8.61238 8.84703 8.61238C8.19533 8.61406 7.54363 8.61406 6.89194 8.61238Z" :fill="order.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.87049 5.16732C6.22453 5.16732 5.57858 5.16732 4.93262 5.16732C4.56981 5.16732 4.3082 4.92508 4.30641 4.59313C4.30461 4.26118 4.56874 4.01895 4.93047 4.01895C6.23362 4.01895 7.53666 4.01895 8.83958 4.01895C9.21566 4.01895 9.47656 4.26011 9.47261 4.59995C9.46902 4.93047 9.2092 5.16445 8.84137 5.16516C8.18537 5.16947 7.52793 5.16732 6.87049 5.16732Z" :fill="order.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.88483 12.0575C6.23888 12.0575 5.59292 12.0575 4.94697 12.0575C4.57196 12.0575 4.3064 11.816 4.3064 11.4812C4.30855 11.1532 4.57124 10.9113 4.93548 10.9109C6.24414 10.9095 7.55304 10.9095 8.86217 10.9109C9.18515 10.9109 9.43241 11.1187 9.46973 11.408C9.48805 11.5487 9.45359 11.6912 9.37301 11.8081C9.29242 11.9249 9.17142 12.0078 9.03335 12.0406C8.96308 12.0546 8.89142 12.0602 8.81983 12.0575C8.17555 12.0592 7.53055 12.0592 6.88483 12.0575Z" :fill="order.notes_count > 0 ? '#FFFFFF' : '#B45309'"/></svg>
                </a>
                <button v-b-modal.shippingLabels class="p-0 bg-transparent border-0" v-if="order.id && order.order_type == 'shipping' && isAdvancedShippingEnabled" aria-label="Show Shipping Labels">
                  <img src="/images/shipping.png" width="32" height="32" alt="Shipping" />
                </button>
              </div>
              <div class="d-flex align-items-md-center py-2 py-md-0 justify-content-between">
                
                <div v-if="orderCompleted" class="d-md-inline mb-0 mr-3 mr-md-4">
                  <div>
                    <span class="d-md-inline">Order</span>
                    {{ completedLabel }}
                  </div>
                  <div class="text-muted">
                    on {{ formatDate(order.date_completed) }}
                  </div>
                </div>
                <div class="d-md-inline mb-0 mr-3 mr-md-4 text-md-right">
                  <div>
                    <span class="d-md-inline">Order&nbsp;</span>Claimed by {{ order.issued_first }} {{ order.issued_last }}
                  </div>
                  <div class="text-muted">
                    on {{ formatDate(order.issued_at) }}
                  </div>
                </div>
                <button v-if="order.status && order.status !== 'cancelled'" @click="() => $refs.cancelOrderModal.show()" class="btn-refund btn btn-primary btn-sm">Refund</button>
              </div>
            </div>
            <div v-if="order.order_notes" class="row px-3">
              <b-alert show variant="danger" style="width: 100%;">Special Instructions: {{ order.order_notes }}</b-alert>
            </div>
            <div v-if="order.transaction && order.transaction.in_store" class="row px-3">
              <b-alert show variant="danger" style="width: 100%;">
                <div style="text-align:center;font-size:72px">NOT PAID</div>
              </b-alert>
            </div>


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
                      <div class="text-muted pr-4">Address</div>
                      <div class="text-right">
                          {{ order.address ? fullAddress : (order.billing_address ? billingAddress : 'No Address Submitted') }}
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
                      <span class="text-muted">Order date:</span> <b>{{ formatDate(order.date_purchased) }}</b>
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
                    <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1" v-if="order.cancelled_reason">
                      <div class="text-muted">Cancellation Reason</div>
                      <div class="text-capitalize">{{ order.cancelled_reason }}</div>
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
                      <div class="text-capitalize">{{ value }}</div>
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
            <div class="d-flex mb-3 mb-md-n4 justify-content-between justify-content-md-end" style="z-index: 10;">
              <button :disabled="isShippingSlipPrint" @click="printShippingSlip" v-if="shippingSlip" class="btn btn-sm btn-outline-primary p-0 px-3 align-items-center d-flex mr-2">
                <svg v-if="!isShippingSlipPrint" class="mr-2" width="20" height="19" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="nonzero"><path d="M18.444 4.528h-2.12V.669a.667.667 0 00-.667-.666H4.343a.667.667 0 00-.666.666v3.859H1.556C.698 4.528 0 5.225 0 6.083v6.707c0 .858.698 1.556 1.556 1.556h2.12v3.579c0 .368.3.666.668.666h11.312a.667.667 0 00.667-.666v-3.58h2.121c.858 0 1.556-.697 1.556-1.555V6.083c0-.857-.698-1.555-1.556-1.555zM5.01 1.336h9.98v3.192H5.01V1.336zm9.98 15.922H5.01v-5.454h9.98v5.454zm3.677-4.468c0 .123-.1.223-.223.223h-2.12v-1.876a.667.667 0 00-.668-.667H4.344a.667.667 0 00-.667.667v1.876H1.556a.222.222 0 01-.223-.223V6.083c0-.122.1-.222.223-.222h16.888c.123 0 .223.1.223.222v6.707z"/><path d="M15.657 7.109H13.96a.667.667 0 000 1.333h1.697a.667.667 0 000-1.333zM12.889 14.915H7.11a.667.667 0 000 1.334h5.778a.667.667 0 000-1.334zM12.889 12.813H7.11a.667.667 0 000 1.333h5.778a.667.667 0 000-1.333z"/></g></svg>
                <span v-else class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                Print Shipping Label
              </button>
              <button @click="print" class="btn btn-sm btn-outline-primary p-0 px-3 align-items-center d-flex">
                <svg class="mr-2" width="20" height="19" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="nonzero"><path d="M18.444 4.528h-2.12V.669a.667.667 0 00-.667-.666H4.343a.667.667 0 00-.666.666v3.859H1.556C.698 4.528 0 5.225 0 6.083v6.707c0 .858.698 1.556 1.556 1.556h2.12v3.579c0 .368.3.666.668.666h11.312a.667.667 0 00.667-.666v-3.58h2.121c.858 0 1.556-.697 1.556-1.555V6.083c0-.857-.698-1.555-1.556-1.555zM5.01 1.336h9.98v3.192H5.01V1.336zm9.98 15.922H5.01v-5.454h9.98v5.454zm3.677-4.468c0 .123-.1.223-.223.223h-2.12v-1.876a.667.667 0 00-.668-.667H4.344a.667.667 0 00-.667.667v1.876H1.556a.222.222 0 01-.223-.223V6.083c0-.122.1-.222.223-.222h16.888c.123 0 .223.1.223.222v6.707z"/><path d="M15.657 7.109H13.96a.667.667 0 000 1.333h1.697a.667.667 0 000-1.333zM12.889 14.915H7.11a.667.667 0 000 1.334h5.778a.667.667 0 000-1.334zM12.889 12.813H7.11a.667.667 0 000 1.333h5.778a.667.667 0 000-1.333z"/></g></svg>
                Print Receipt
              </button>
            </div>

            <prepareOrderList :parcelType="parcelType" :order="order" :loading="loading" @getOrder="getOrder" :readonly="true" />
          </div>
        </div>
      </div>
    </div>
    <div id="orderReceipt">
      <template v-if="isShippingSlipPrint">
        <div class="d-flex justify-content-center my-4" v-if="shippingSlip">
          <img :src="shippingSlip" width="100%" @load="print" height="1000px" alt="Shipping Slip" />
        </div>
      </template>
      <template v-else>
        <div class="d-flex justify-content-center my-4">
          <img :src="$store.state.settings.logo" width="200" alt="Logo">
        </div>
        <div class="row" v-if="order.transaction && order.transaction.in_store">
          <div class="col-12">
            <span style="font-size:72px; color: #c00; font-weight: bold;">NOT PAID</span>
          </div>
        </div>
        <div class="row my-4">
          <div class="col-6">
            <div class="font-weight-bold">Billed To</div>
            <div>{{order.first_name}} {{order.last_name}}</div>
            <div v-if="order.order_type === 'shipping'">
              <div>{{ order.address }}</div>
              <div>{{ order.address2 || '' }}</div>
              {{ order.city }}, {{ order.state }} {{ order.zip }}
            </div>
            <div v-else-if="order.address == null && order.zip == null">
              No address submitted
            </div>
            <div v-else>
              <span v-if="order.address != null">{{ order.address }},</span> {{ order.zip }}
            </div>
          </div>
          <div class="col-6">
            <div class="font-weight-bold" v-if="order.cc_last4 || order.contractor">Payment Method:</div>
            <div v-if="order.cc_last4"><b>Credit Card</b> **** {{order.cc_last4}}</div>
            <div v-else-if="order.contractor"><b>House Account</b> {{order.ar_account_num}}</div>
            <div><b>Phone number: </b>{{order.telephone}}</div>

            <div v-if="$store.state.settings.admin.showContractors && order.contractor">
              <b>Contractor Account:</b> {{ order.ar_account_num }}
            </div>
            <div v-if="order.custom_info && order.custom_info.loyalty_id">
              <b>Loyalty ID:</b> {{order.custom_info.loyalty_id}}
            </div>
            <div v-if="$store.state.hasTrueValueRewards && order.custom_info && order.custom_info.tvr_number">
              <b>True Value Rewards #:</b> {{ order.custom_info.tvr_number }}
            </div>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6">
            <b>Order Number:</b> #{{ order.id }}
          </div>
          <div class="col-md-6">
            <b>Order Date:</b> {{order.date_added}}
          </div>
        </div>

        <h6 class="mb-3">Business: {{ order.business_name }}</h6>
        <prepareOrderList :parcelType="parcelType" :order="order" :loading="loading" @getOrder="getOrder" :readonly="true" :barcode="true" />
      </template>
    </div>
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

    <b-modal centered ref="cancelOrderModal" id="cancelOrderModal" ok-variant="danger" cancel-variant="action" ok-title="Refund" @ok="cancelOrder">
      <div slot="modal-header" class="d-flex">
        <svg xmlns="http://www.w3.org/2000/svg" class="mr-2" width="22" fill="none" viewBox="0 0 24 24" stroke="#EF4444"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <h5>Refund</h5>
      </div>
      <div class="text-muted mb-2">
        Are you sure you want to ask for a refund? This action cannot be undone.
      </div>
      <div class="alert text-left px-3 alert-warning text-medium">
        <template v-if="order.payment_type === 'Credit Card'">
          This transaction has been paid with a Credit Card, if you click on Refund you are refunding the Customer, <b>Stripe will not return your transaction fee</b>. This is Stripe’s policy and not EZ-AD’s.
        </template>
        <template v-else>
          Please Confirm before Canceling Order
        </template>
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
      <div v-else class="pb-3" style="font-weight: 500;">
        <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
          <h6 class="font-weight-bold pr-4">Risk Evaluation</h6>
        </div>
        <div class="risk-factor mt-4">
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
        <div class="d-flex justify-content-between align-items-center text-small pt-0 pb-1">
          <div class="text-muted pr-4">Name</div>
          <div class="text-right">{{ paymentInfo.customerInfo.name | capitalize }}</div>
        </div>
        <div class="d-flex justify-content-between align-items-center text-small pt-1 pb-1">
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
        <div v-if="paymentInfo.source" class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
          <div class="text-muted pr-4">Card Id</div>
          <div class="text-right">{{ paymentInfo.source.id }}</div>
        </div>
        <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
          <div class="text-muted pr-4">Card Number</div>
          <div class="text-right">**** {{ paymentInfo.payment_method_details.card.last4 }}</div>
        </div>
        <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
          <div class="text-muted pr-4">Expires</div>
          <div class="text-right">{{ paymentInfo.payment_method_details.card.exp_month }} / {{ paymentInfo.payment_method_details.card.exp_year }}</div>
        </div>
        <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
          <div class="text-muted pr-4">Fingerprint</div>
          <div class="text-right">{{ paymentInfo.payment_method_details.card.fingerprint }}</div>
        </div>
        <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
          <div class="text-muted pr-4">Card Type</div>
          <div class="text-right">{{ paymentInfo.payment_method_details.card.brand | capitalize }}</div>
        </div>
        <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
          <div class="text-muted pr-4">Postal Code</div>
          <div class="text-right">{{ paymentInfo.billing_details.address.postal_code }}</div>
        </div>
        <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
          <div class="text-muted pr-4">Origin</div>
          <div class="text-right">{{ paymentInfo.payment_method_details.card.country | upperCase }}</div>
        </div>
        <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
          <div class="text-muted pr-4">CVC Check</div>
          <div class="text-right badge" :class="getBadgeClass(paymentInfo.payment_method_details.card.checks.cvc_check)">{{ paymentInfo.payment_method_details.card.checks.cvc_check | upperCase }}</div>
        </div>
        <div class="d-flex justify-content-between align-items-center text-small pt-2 pb-1">
          <div class="text-muted pr-4">Zip Check</div>
          <div class="text-right badge" :class="getBadgeClass(paymentInfo.payment_method_details.card.checks.address_postal_code_check)">{{ paymentInfo.payment_method_details.card.checks.address_postal_code_check | upperCase }}</div>
        </div>
      </div>
      
      <div slot="modal-footer">
        <button type="button" @click="$refs.paymentInfoDialog.hide()" class="btn btn-outline-primary">Close</button>
      </div>
    </b-modal>

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
        <shipping-labels @showMoreLabelsButton="hasLabels = true" @showCreateLabelModel="showCreateLabelModel" :orderId="parseInt(this.$route.params.id)"/>
      </div>
    </b-modal>
    <CreateLabelModal :customShipping="order.custom_shipping ? order.custom_shipping : null"
                      :show="false" :orderId="parseInt(this.$route.params.id)" :orderAmount="order.total ? order.total : null" ref="createLabelModal"/>

  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import moment from 'moment';
  import prepareOrderList from '@/components/admin/prepare-order/list.vue';
  import NotesList from '@/components/admin/orders/notesList';
  import ShippingLabels from "../../pages/admin/orders/shipping-labels";
  import CreateLabelModal from '@/components/modals/create-label-modal';
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
  import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

  export default {
    name: 'AdminOrderDetails',
    components: {
      prepareOrderList,
      NotesList,
      CreateLabelModal,
      ShippingLabels,
      VueCtkDateTimePicker
    },
    props: ['id'],
    data() {
      return {
        order: {},
        taxes: 0,
        total: 0,
        subtotal: 0,
        isShippingSlipPrint: false,
        shippingSlip: null,
        canceling: false,
        subAccountSlug: null,
        orderId: null,
        parcelId: null,
        parcelType: '',
        loading: false,
        emailSubject: '',
        emailBody: '',
        sendingEmail: false,
        hasLabels: false
      };
    },
    computed: {
      businessDetails() {
        return this.$store.state.businessDetails;
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
      customFields() {
        let customFields = {};
        let skippedKeys = ['order_notes'];

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
      completedLabel(){
        if(this.order.order_type == 'pickup'){
          return "Picked Up";
        }
        if(this.order.order_type == 'shipping'){
          return "Shipped";
        }
        return "Completed";        
      },
      orderCompleted(){
        return this.order.date_completed && this.order.status == 'completed';
      },
      today() {
        return new Date(Date.now()).toISOString().slice(0,10).replace(/-/g,"-");
      },
      dateFormat() {
        return this.businessDetails.delivery_settings && this.businessDetails.delivery_settings.enable_time ? 'YYYY-MM-DD HH:mm:ss a' : 'YYYY-MM-DD';
      },
      dateFormatted() {
        return this.businessDetails.delivery_settings && this.businessDetails.delivery_settings.enable_time ? 'ddd, MMM Do, YYYY, h a' : 'ddd, MMM Do, YYYY';
      }
    },
    filters: {
      toFixed(val) {
        return val.toFixed(2);
      }
    },
    created() {
      this.subAccountSlug = this.$store.state.activeUser.data.customer.slug;
      let useParcelType = false;
      const s = this.$store.state.settings;
      if ( s.admin && s.admin.orders && s.admin.orders.useParcelType ) {
        useParcelType = true;
      }

      if(!this.$route.params.id) {
        this.goToOrders();
      } else {
        this.orderId = this.$route.params.id;
        this.parcelType = useParcelType ? this.$route.query.ptype : this.$route.query.type;
        this.parcelId = this.$route.query.parce_id;
      }
    },
    async mounted() {
      await this.getOrder();
    },
    methods: {
      showCreateLabelModel() {
        this.$refs.createLabelModal.showModal();
        this.$refs.shippingLabels.hide();
      },
      updateKey(key) {
        return key.replace(/_/g, " ");
      },
      formatDate(value) {
        return value ? moment.utc(value).local().format('MMM D, YYYY hh:mm A'): '';
      },
      async getOrder() {
        await AdminService.getOrder(this.$route.params.id).then(resp => {
          this.order = resp.data.order;
        });
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
      print() {
        window.print();
        this.isShippingSlipPrint = false;
      },
      printShippingSlip() {
        this.isShippingSlipPrint = true;
      },
      goToOrders(params = {}) {
        this.$router.push({name: `admin-orders-list`, params: params}).catch(err => console.log(err));
      },
      async cancelOrder() {
        try {
          this.canceling = true;
          let response = await AdminService.cancelOrder(this.$route.params.id);
          response = response.data;
          this.canceling = false;
          if (response.status == 'success') {
            this.$swal({
              title: 'Success',
              text: 'The customer has been refunded! This order has been moved to cancelled.',
              type: 'success'
            }).then(() => this.goToOrders({ type: 'cancelled' }));
          } else {
            this.makeToast('error', 'Oops', 'Something went wrong, please try again later!');
          }
        } catch (e) {
          this.canceling = false;
          console.log('error in canceling order : ', e);
        }
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
      onDeliveryDateChange(date) {
        AdminService.updateOrderDeliveryDate({ id: this.order.id, delivery_date: date });
      }
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

  .shipping, .special {
    color: var(--blue);
  }
  .pickup {
    color: var(--green);
  }
  .delivery {
    color: var(--orange);
  }
  .hl-tvr {
    color: #D31931;
    font-weight: bold;
  }
  .parcel:not(:last-child):after {
    content: ', ';
    margin-left: -4px;
  }
  .table th {
    border-top: none !important;
  }
  .btn.btn-outline-primary {
    svg * {
      fill: var(--primary);
    }
    &:hover,
    &:focus {
      svg * {
        fill: #fff;
      }
    }
  }
  .btn.btn-outline-secondary {
    svg * {
      fill: #6c757d;
    }
    &:hover,
    &:focus {
      svg * {
        fill: #fff;
      }
    }
  }

  #orderReceipt {
    display: none;
  }


  @media (max-width: 768px) {
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
      border: none;
      background: none;
      border-radius: 0;
    }
    .card.customer-details {
      border-bottom: 1px solid #ccc;
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

  @media (max-width: 576px) {
    #orderDetails > .card {
      border: none;
      background: none;
    }

  }
  @media print {
    #orderDetails {
      display: none;
    }
    #orderReceipt {
      display: block;
    }
  }



  @media (max-width: 992px) {
    .card.main {
      border: none;
    }
    .order-details-wrapper {
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
