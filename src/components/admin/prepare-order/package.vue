<template>
  <div>
    <div id="package">
      <div class="card big bg-white border flex flex-sm-row mb-3">
        <div class="d-none d-sm-block">
          <div class="round-head mr-3 big success">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6667 19.6667H22.3333C23.0406 19.6667 23.7189 19.3857 24.219 18.8856C24.719 18.3855 25 17.7072 25 17V11.6667C25 10.9594 24.719 10.2811 24.219 9.78105C23.7189 9.28095 23.0406 9 22.3333 9H3.66667C2.95942 9 2.28115 9.28095 1.78105 9.78105C1.28095 10.2811 1 10.9594 1 11.6667V17C1 17.7072 1.28095 18.3855 1.78105 18.8856C2.28115 19.3857 2.95942 19.6667 3.66667 19.6667H6.33333M9 25H17C17.7072 25 18.3855 24.719 18.8856 24.219C19.3857 23.7189 19.6667 23.0406 19.6667 22.3333V17C19.6667 16.2928 19.3857 15.6145 18.8856 15.1144C18.3855 14.6143 17.7072 14.3333 17 14.3333H9C8.29276 14.3333 7.61448 14.6143 7.11438 15.1144C6.61428 15.6145 6.33333 16.2928 6.33333 17V22.3333C6.33333 23.0406 6.61428 23.7189 7.11438 24.219C7.61448 24.719 8.29276 25 9 25ZM19.6667 9V3.66667C19.6667 2.95942 19.3857 2.28115 18.8856 1.78105C18.3855 1.28095 17.7072 1 17 1H9C8.29276 1 7.61448 1.28095 7.11438 1.78105C6.61428 2.28115 6.33333 2.95942 6.33333 3.66667V9H19.6667Z" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </div>
        <div class="d-flex align-items-center w-100">
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between mb-2 mb-sm-0">
              <div class="d-flex">
                <div class="round-head mr-3 big success d-sm-none">
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6667 19.6667H22.3333C23.0406 19.6667 23.7189 19.3857 24.219 18.8856C24.719 18.3855 25 17.7072 25 17V11.6667C25 10.9594 24.719 10.2811 24.219 9.78105C23.7189 9.28095 23.0406 9 22.3333 9H3.66667C2.95942 9 2.28115 9.28095 1.78105 9.78105C1.28095 10.2811 1 10.9594 1 11.6667V17C1 17.7072 1.28095 18.3855 1.78105 18.8856C2.28115 19.3857 2.95942 19.6667 3.66667 19.6667H6.33333M9 25H17C17.7072 25 18.3855 24.719 18.8856 24.219C19.3857 23.7189 19.6667 23.0406 19.6667 22.3333V17C19.6667 16.2928 19.3857 15.6145 18.8856 15.1144C18.3855 14.6143 17.7072 14.3333 17 14.3333H9C8.29276 14.3333 7.61448 14.6143 7.11438 15.1144C6.61428 15.6145 6.33333 16.2928 6.33333 17V22.3333C6.33333 23.0406 6.61428 23.7189 7.11438 24.219C7.61448 24.719 8.29276 25 9 25ZM19.6667 9V3.66667C19.6667 2.95942 19.3857 2.28115 18.8856 1.78105C18.3855 1.28095 17.7072 1 17 1H9C8.29276 1 7.61448 1.28095 7.11438 1.78105C6.61428 2.28115 6.33333 2.95942 6.33333 3.66667V9H19.6667Z" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div>
                  <div class="text-tiny font-weight-bold text-muted text-uppercase">
                    Order ID: #{{ order.id }}
                  </div>
                  <h4 class="mb-1">Print Receipt</h4>
                </div>
              </div>
              <button :disabled="isPrinting" class="btn btn-success text-nowrap d-none d-sm-block" @click="print">
                <div class="spinner-border spinner-border-sm mr-2" v-if="isPrinting" />
                Print Receipt
              </button>
            </div>
            <div class="text-content text-muted lead">
              We provide you with a transaction receipt that you can print and add to the list of items you have gathered for the customer. This helps you and your team stay organized. You can also use this receipt to scan the order back into your POS system which is the next step
            </div>
            <button :disabled="isPrinting" class="btn btn-success text-nowrap d-sm-none mt-3" @click="print">
              <div class="spinner-border spinner-border-sm mr-2" v-if="isPrinting" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>

      <div class="card big bg-white border flex-column mb-3" v-if="parcelType == 'shipping' && isAdvancedShippingEnabled">
        <div class="d-flex flex flex-sm-row">
          <div class="d-none d-sm-block">
            <div class="round-head mr-3 big success">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="56" height="56" rx="28" fill="#ECFDF5"/><path d="M21.3333 21.3333H21.3467M21.3333 16H28C28.6827 16 29.3653 16.26 29.8853 16.7813L39.2187 26.1147C39.7186 26.6147 39.9994 27.2929 39.9994 28C39.9994 28.7071 39.7186 29.3853 39.2187 29.8853L29.8853 39.2187C29.3853 39.7186 28.7071 39.9994 28 39.9994C27.2929 39.9994 26.6147 39.7186 26.1147 39.2187L16.7813 29.8853C16.5333 29.638 16.3367 29.3442 16.2026 29.0206C16.0685 28.6971 15.9996 28.3502 16 28V21.3333C16 19.9188 16.5619 18.5623 17.5621 17.5621C18.5623 16.5619 19.9188 16 21.3333 16Z" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>        
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between mb-2 mb-sm-0 w-100">
              <div class="d-flex">
                <div class="round-head mr-3 big success d-sm-none">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="56" height="56" rx="28" fill="#ECFDF5"/><path d="M21.3333 21.3333H21.3467M21.3333 16H28C28.6827 16 29.3653 16.26 29.8853 16.7813L39.2187 26.1147C39.7186 26.6147 39.9994 27.2929 39.9994 28C39.9994 28.7071 39.7186 29.3853 39.2187 29.8853L29.8853 39.2187C29.3853 39.7186 28.7071 39.9994 28 39.9994C27.2929 39.9994 26.6147 39.7186 26.1147 39.2187L16.7813 29.8853C16.5333 29.638 16.3367 29.3442 16.2026 29.0206C16.0685 28.6971 15.9996 28.3502 16 28V21.3333C16 19.9188 16.5619 18.5623 17.5621 17.5621C18.5623 16.5619 19.9188 16 21.3333 16Z" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div>
                  <h4 v-if="!hasShippingLabels" class="mb-1">Create Shipping Label</h4>
                  <h4 v-else class="mb-1">Shipping Labels</h4>
                </div>
              </div>
              <button class="btn btn-success text-nowrap d-none d-sm-block" @click="$refs.createLabelModal.showModal()">Create Label</button>
            </div>
            <div class="text-content text-muted lead">
              Automatically generate a shipping label using different shipping carriers that you can update on the website settings fulfillment page. You can automatically print the shipping label and attach it to the package to send out quickly to the customer.
            </div>
            <button class="btn btn-success text-nowrap d-sm-none mt-3" v-b-modal.createLabelModal>Create Label</button>
          </div>
        </div> 
        <div v-if="hasShippingLabels" class="flex-grow-1">
          <shipping-labels :panelView="true" :orderId="parseInt(order.id)"/>
        </div>
      </div>

      <template v-if="parcelType != 'pickup' && parcelType != 'in-store'">
        <div class="card bg-white border flex flex-row mb-3" v-if="parcelType !== 'pickup' && parcelType !== 'delivery' && false">
          <div>
            <div class="round-head mr-3">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z" fill="white"/></svg>
            </div>
          </div>
          <div class="d-flex align-items-center w-100">
            <div class="flex-grow-1">
              <h5 class="mb-1">Shipping Label</h5>
              <div class="text-muted text-content">
                Print and paste this document on the outside of the box.
              </div>
            </div>
            <button class="btn btn-success" @click="shippingSlipPrint">Print</button>
          </div>
        </div>

        <div class="alert alert-alt alert-info" role="alert">
          <svg class="mr-2" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.4 6.99998C13.4 8.69736 12.7257 10.3252 11.5255 11.5255C10.3252 12.7257 8.69736 13.4 6.99998 13.4C5.30259 13.4 3.67472 12.7257 2.47449 11.5255C1.27426 10.3252 0.599976 8.69736 0.599976 6.99998C0.599976 5.30259 1.27426 3.67472 2.47449 2.47449C3.67472 1.27426 5.30259 0.599976 6.99998 0.599976C8.69736 0.599976 10.3252 1.27426 11.5255 2.47449C12.7257 3.67472 13.4 5.30259 13.4 6.99998ZM7.79998 3.79998C7.79998 4.01215 7.71569 4.21563 7.56566 4.36566C7.41563 4.51569 7.21215 4.59998 6.99998 4.59998C6.7878 4.59998 6.58432 4.51569 6.43429 4.36566C6.28426 4.21563 6.19998 4.01215 6.19998 3.79998C6.19998 3.5878 6.28426 3.38432 6.43429 3.23429C6.58432 3.08426 6.7878 2.99998 6.99998 2.99998C7.21215 2.99998 7.41563 3.08426 7.56566 3.23429C7.71569 3.38432 7.79998 3.5878 7.79998 3.79998ZM6.19998 6.19998C5.9878 6.19998 5.78432 6.28426 5.63429 6.43429C5.48426 6.58432 5.39998 6.7878 5.39998 6.99998C5.39998 7.21215 5.48426 7.41563 5.63429 7.56566C5.78432 7.71569 5.9878 7.79998 6.19998 7.79998V10.2C6.19998 10.4121 6.28426 10.6156 6.43429 10.7657C6.58432 10.9157 6.7878 11 6.99998 11H7.79998C8.01215 11 8.21563 10.9157 8.36566 10.7657C8.51569 10.6156 8.59998 10.4121 8.59998 10.2C8.59998 9.9878 8.51569 9.78432 8.36566 9.63429C8.21563 9.48426 8.01215 9.39997 7.79998 9.39997V6.99998C7.79998 6.7878 7.71569 6.58432 7.56566 6.43429C7.41563 6.28426 7.21215 6.19998 6.99998 6.19998H6.19998Z" fill="#2563EB"/>
          </svg>
          Please make sure you follow these steps
        </div>

        <div class="card bg-white border flex flex-row mb-3">
          <div>
            <div class="round-head mr-3">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z" fill="white"/></svg>
            </div>
          </div>
          <div>
            <h5 class="mb-1">Packing</h5>
            <div class="text-muted text-content">
              Protect the items with protective packing material, for example wrapping the products with bubble
              wrap or filling the box with peanuts. When completed, place the items into your box.
            </div>
          </div>
        </div>
        
        <div class="card bg-white border flex flex-row">
          <div>
            <div class="round-head mr-3">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z" fill="white"/></svg>
            </div>
          </div>
          <div>
            <h5 class="mb-1">Seal Your Package</h5>
            <div class="text-muted text-content">
              Close the small ends to form the bottom of your box, following with the larger ends. Seal the box with tape along all 3 seams on both ends of the box.
            </div>
          </div>
        </div>
      </template>
    </div>


    <!-- PRINT -->
    <div id="orderReceipt">
      <div v-if="isShippingSlipPrint">
        <div class="d-flex justify-content-center my-4" v-if="shippingSlip != null">
          <img :src="shippingSlip" @load="shippingSlipLoaded" width="100%" height="1000px" alt="Shipping Slip" />
        </div>
      </div>
      <div v-else>
        <div class="d-flex justify-content-center my-4">
          <img :src="$store.state.settings.logo" width="200" alt="Logo" />
        </div>
        <div class="row" v-if="order.transaction && order.transaction.in_store">
          <div class="col-12">
            <span style="font-size:72px; color: #c00; font-weight: bold;">NOT PAID</span>
          </div>
        </div>
        <div class="row my-4">
          <div class="col-6">
            <div class="font-weight-bold">Billed To</div>
            <div class="h3">{{order.first_name}} {{order.last_name}}</div>
            <b>Phone:</b>
            <div class="h5 font-weight-normal">{{order.telephone}}</div>
            <b>Email:</b>
            <div class="h5 font-weight-normal">{{order.email}}</div>
            <b>Address:</b>
            <div v-if="order.order_type === 'shipping'">
              {{ order.address }}
              <br>
              {{ order.address2 || '' }}
              <br>
              {{ order.city }}, {{ order.state }} {{ order.zip }}
            </div>
            <p v-else-if="order.address == null && order.zip == null">
              No address submitted
            </p>
            <p v-else>
              <span v-if="order.address != null">{{ order.address }},</span> {{ order.zip }}
            </p>
            <p v-if="order.custom_info && order.custom_info.loyality_lookup_field">
              <b>Reward Member Lookup:</b>{{order.custom_info.loyality_lookup_field}}
            </p>
            <p v-if="$store.state.settings.admin.showContractors && order.contractor">
              <b>Contractor Account:</b> {{ order.ar_account_num }}
            </p>
            <p v-if="order.custom_info && order.custom_info.loyalty_id">
              <b>Loyalty ID:</b> {{order.custom_info.loyalty_id}}
            </p>
          </div>
          <div class="col-6">
            <div class="font-weight-bold">Order:</div>
            <div class="h3">#{{order.id}}</div>
            <b>Date:</b>
            <div class="h5 font-weight-normal">{{order.date_added}}</div>
            <b v-if="order.cc_last4 || order.contractor">Payment Method:</b>
            <div v-if="order.cc_last4" class="h5 font-weight-normal"><b>Credit Card</b> **** {{order.cc_last4}}</div>
            <div v-else-if="order.contractor" class="h5 font-weight-normal"><b>House Account</b> {{order.ar_account_num}}</div>
            <div v-if="$store.state.hasTrueValueRewards && order.custom_info && order.custom_info.tvr_number">
              <b>{{ $ezTVRName() }} #:</b>
              <div class="h5 font-weight-normal">{{order.custom_info.tvr_number}}</div>
            </div>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6"></div>
          <div class="col-md-6"></div>
        </div>
        <h6 class="mb-3">Business: {{ order.business_name }}</h6>
        <table class="table table-striped table-bordered mb-4">
          <thead style="background: #ECECEC;">
          <tr>
            <th scope="col"></th>
            <th class="text-center" width="100" scope="col">Qty</th>
            <th scope="col">Product</th>
            <th scope="col">SKU</th>
            <th scope="col">UPC</th>
            <th width="100" scope="col">Price</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="parcel in order.parcels">
            <tr v-for="item in parcel.items" :key="item.id">
              <td><img :src="item.image_url" style="max-width:100px; max-height:100px" alt="Item Image" /></td>
              <th width="80" class="text-center" scope="row">{{ item.quantity }}</th>
              <td>
                <b>{{ item.title }}</b>
                <div v-if="$store.state.businessDetails.business_slug == 'AJS9JERT8GGSHXP3' && item.location">
                  In-Store Location: <b>{{ item.location }}</b>
                </div>
              </td>
              <td>{{ item.sku }}</td>
              <td>
                <barcode class="ml-n2 mt-n2" :value="item.upc" height="50" background="transparent" width="2.5" fontSize="18" textAlign="center" />
              </td>
              <td width="80">${{ item.price }}</td>
            </tr>
          </template>
          </tbody>
        </table>
        <div class="row pl-3" v-if="order.refunds">
          <h5><strong>Refunded Items</strong></h5>
        </div>
        <table v-if="order.refunds" class="table table-striped table-bordered mb-4">
          <thead style="background: #ECECEC;">
            <tr>
              <th scope="col">Image</th>
              <th class="text-center" width="100" scope="col">Qty</th>
              <th scope="col">Product Title</th>
              <th scope="col">SKU</th>
              <th scope="col">UPC</th>
              <th width="100" scope="col">Amount Refunded</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="refund in order.refunds" :key="refund.sku">
              <td><img :src="refund.image_url" height="100" alt="Refund image" /></td>
              <th width="80" class="text-center" scope="row">{{ refund.quantity_refunded }}</th>
              <td>{{ refund.title }}</td>
              <td>{{ refund.sku }}</td>
              <td>
                <barcode class="ml-n2 mt-n2" :value="refund.upc" height="50" background="transparent" width="2.5" fontSize="18" textAlign="center" />
              </td>
              <td width="80">${{ refund.amount_refunded }}</td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex flex-column align-items-end justify-content-end">
          <div v-if="order && order.invoice" class="d-inline-flex justify-content-end align-items-end">
            <b class="mr-3">Tax:</b>
            <div style="width: 88px;">${{order.invoice.tax_total}}</div>
          </div>
          <div v-if="order && order.invoice && order.invoice.shipping_total != '0.00'" class="d-inline-flex justify-content-end align-items-end">
            <b class="mr-3">Shipping:</b>
            <div style="width: 88px;">${{order.invoice.shipping_total}}</div>
          </div>
          <div v-if="order && order.invoice && order.invoice.special_order_fee != '0.00'" class="d-inline-flex justify-content-end align-items-end">
            <b class="mr-3">Special Order Fee:</b>
            <div style="width: 88px;">${{order.invoice.special_order_fee}}</div>
          </div>
          <div v-if="order && order.discount_availed && order.discount_availed != '0.00'" class="d-inline-flex justify-content-end align-items-end">
            <b class="mr-3">Discount:</b>
            <div style="width: 88px;">${{order.discount_availed}}</div>
          </div>
          <div v-if="order && order.invoice" class="d-inline-flex justify-content-end align-items-end">
            <b class="mr-3">Total:</b>
            <div style="width: 88px;">${{order.invoice.total}}</div>
          </div>
        </div>
      </div>
    </div>
    <CreateLabelModal :show="parcelType == 'shipping' && isAdvancedShippingEnabled && !hasShippingLabels" 
      :customShipping="order.custom_shipping" :orderId="order.id" 
      :orderAmount="order.total" @shippingSettings="setShippingSettings" ref="createLabelModal"/>
  </div>
</template>
<script>

import VueBarcode from 'vue-barcode';
import CreateLabelModal from '@/components/modals/create-label-modal';
import ShippingLabels from "@/pages/admin/orders/shipping-labels";

export default {
  name: 'prepareOrderPackage',
  props: ['order', 'parcelType'],
  components: {
    'barcode': VueBarcode,
    ShippingLabels,
    CreateLabelModal
  },
  data() {
    return {
      isShippingSlipPrint: false,
      isPrinting: false
    };
  },
  computed: {
    businessDetails() {
      return this.$store.state.businessDetails;
    },
    isAdvancedShippingEnabled() {
      return this.businessDetails.advanced_shipping_enabled == 1;
    },
    hasShippingLabels: {
      get() {
        return this.order && this.order.shipping_details && this.order.shipping_details.shipping_id ? true : false;
      },
      set(shipping_details) {
        this.order.shipping_details = shipping_details;
      }
    }
  },
  methods: {
    shippingSlipPrint() {
      this.isShippingSlipPrint = true;
      if (this.shippingSlip == null)
        AdminService.fulfillmentShippingSlip({order_id: this.orderId}).then(r => this.shippingSlip = r.data.message);
      else
        setTimeout(() => window.print(), 2000);
    },
    print() {
      this.isPrinting = true;
      this.isShippingSlipPrint = false;
      setTimeout(() => {
        window.print();
        this.isPrinting = false;
      }, 2000);
    },
    setShippingSettings(data) {
      this.hasShippingLabels = data;
    }
  }
};
</script>
<style lang="scss" scoped>
  #orderReceipt  {
    display: none;
  }
  #shippingLabelPrint {
    display: none;
  }
  #package {
    .card {
      padding: 16px 24px;
      &.big {
        padding: 32px;
      }
      .text-content {
        max-width: 830px;
      }
      .round-head {
        color: #fff;
        background: var(--primary);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        &.big {
          width: 56px;
          height: 56px;
        }
        &.success {
          background: #ECFDF5;
        }
      }
    }
  }
  @media (max-width: 768px) {
    .lead {
      font-size: 14px !important;
      font-weight: normal !important;
    }
  }

  @media print {
    #package,
    footer {
      display: none;
    }
    #orderReceipt  {
      display: block;
    }
  }
</style>
