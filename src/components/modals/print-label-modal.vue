<template>
    <div>
      <b-modal centered size="md" ref="shippingLabelPrint" id="shippingLabelPrint" hide-footer hide-header no-close-on-backdrop no-close-on-esc>
        <div class="position-relative">
          <button class="btn close-btn" @click="hideModalPrint" aria-label="Close">
            <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M.869.869a1.6 1.6 0 0 1 2.262 0L10 7.738l6.869-6.87a1.599 1.599 0 1 1 2.262 2.263L12.262 10l6.87 6.869a1.6 1.6 0 0 1-2.263 2.262L10 12.262l-6.869 6.87A1.6 1.6 0 0 1 .87 16.868L7.738 10 .868 3.131a1.6 1.6 0 0 1 0-2.262z" fill="#64748B"/></svg>
          </button>
        </div>
        <div>
          <div class="p-4">
            <div class="mt-5">
              <img width="100%" :src="label ? label.label : ''" id="labelImage" ref="labelImage" alt="Label">
            </div>
            <div class="d-flex justify-content-end">
              <button class="btn btn-primary mt-5" @click="printLabel">Print</button>
            </div>
          </div>
        </div>
        <div id="orderReceipt2">
          <div v-if="order" class="page-break-after d-block">
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
              </div>
            </div>
            <h6 class="mb-3">Business: {{ order.business_name }}</h6>
            <table class="table table-striped table-bordered mb-4 w-100">
              <thead style="background: #ECECEC;">
              <tr>
                <th scope="col"></th>
                <th class="text-center" width="100" scope="col">Qty</th>
                <th scope="col">Product Title</th>
                <th scope="col">SKU</th>
                <th scope="col">UPC</th>
                <th width="100" scope="col">Price</th>
              </tr>
              </thead>
              <tbody>
              <template v-for="parcel in order.parcels">
                <tr v-for="item in parcel.items" :key="item.id">
                  <td><img :src="item.image_url" height="100" :alt="item.title" /></td>
                  <th width="80" class="text-center" scope="row">{{ item.quantity }}</th>
                  <td>{{ item.title }}</td>
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
            <table v-if="order.refunds" class="table table-striped table-bordered mb-4 w-100">
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
                <td><img :src="refund.image_url" height="100" :alt="refund.title"></td>
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
          <img style="max-width: 100vh; max-height: 100vh;" class="mt-5 page-break-after d-block" :src="label ? label.label : ''" id="labelImage2" ref="labelImage2" alt="Label" />
        </div>
      </b-modal>
  
    </div>
  </template>
  <script>
  import moment from "moment-timezone";
  import AdminService from '../../api-services/admin.service';
  import VueBarcode from 'vue-barcode';
  
  export default {
    name: 'PrintLabelModal',
    components: {
      'barcode': VueBarcode
    },
    props: {
      label: {
        required: true
      },
      orderId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        order: null,
        loading: false,
        imagesCountInPrint: 0,
        loadedImages: 0,
        iframe: null
      };
    },
    methods: {
      async getOrderData() {
        try {
          this.$emit('setLoading', {id: this.label.id, load: true});
          await AdminService.getOrder(this.orderId).then(resp => {
            this.$emit('setLoading', {id: this.label.id, load: false});
            this.order = resp.data.order;
            this.order.date_purchased = moment.utc(this.order.date_purchased).local().format('MMM D, YYYY hh:mm A');
            this.order.formatted_issued_at = moment.utc(this.order.issued_at).local().format('MMM D, YYYY hh:mm A');
          });
        } catch (e) {
          this.$emit('setLoading', {id: this.label.id, load: false});
        }
      },
      hideModalPrint() {
        this.$refs.shippingLabelPrint.hide();
      },
      async showModalPrint() {
        await this.getOrderData();
        this.imagesCountInPrint = 0;
        this.loadedImages = 0;
        this.$refs.shippingLabelPrint.show();
      },
      printLabel() {
        this.iframe = document.createElement('iframe');
  
        // Make it hidden
        this.iframe.style.height = 0;
        this.iframe.style.visibility = 'hidden';
        this.iframe.style.width = 0;
  
        // Set the this.iframe's source
        this.iframe.setAttribute('srcdoc', '<html><head><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head><body></body></html>');
  
        document.body.appendChild(this.iframe);
        document.body.style.overflow = 'visible';
  
        this.iframe.addEventListener('load', () => {
          // Clone the image
          const receipt = document.getElementById('orderReceipt2').cloneNode(true);
          receipt.style.maxWidth = '100%';
          receipt.style.maxHeight = '100%';
          receipt.style.overflow = 'visible';
  
          // Append the receipt to the this.iframe's body
          this.iframe.contentDocument.body.style.textAlign = 'center';
          this.iframe.contentDocument.body.appendChild(receipt);
          let images = receipt.getElementsByTagName('img');
          this.imagesCountInPrint = images.length;
          // check if all images are loaded, only then print
          [].forEach.call( images, img => {
            if(img.complete)
              this.incrementCounter();
            else
              img.addEventListener('load', () => this.incrementCounter());
          } );
        });
      },
      incrementCounter() {
        let self = this;
        if (self.loadedImages < self.imagesCountInPrint) {
          this.loadedImages++;
        }
        if ( self.loadedImages === self.imagesCountInPrint ) {
          self.iframe.contentWindow.print();
          self.iframe.contentWindow.addEventListener('afterprint', function () {
            self.iframe.parentNode.removeChild(self.iframe);
          });
        }
      }
    }
  };
  </script>
  
  <style lang="scss" scoped>
    
    #orderReceipt2 {
      display: none;
    }
    @media print {
      #orderReceipt2 {
        display: block;
      }
      body {
        overflow: visible !important;
      }
      div { float: none !important; position: static !important; display: inline; 
              box-sizing: content-box !important;
        }
      * {
        page-break-after: always !important;
      }
    }
  
  </style>
  