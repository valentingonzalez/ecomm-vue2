<template>
  <div>
    <div v-if="loading" class="d-flex p-4 justify-content-center" style="z-index:2;background:rgba(255,255,255,.7)">
      <b-spinner label="Spinning"></b-spinner>
    </div>
    <div v-else-if="!items || !items.length">
      There are no items on this order
    </div>
    <div v-else class="table">
      <template v-if="order.parcels">
        <div class="mb-3 d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            Items Summary
          </h5>
          <div class="d-flex justify-content-around align-items-end" v-if="$store.state.settings.admin.RSCOptions && order.order_type == 'doitbest'">
            <div>
              <label class="font-weight-bold small mb-0 mr-2" for="rscOptions">RSC Options</label>
              <select class="form-control text-small" id="rscOptions" v-model="selectedRSCoption">
                <option :value="null" disabled>Select an RSC option</option>
                <option v-for="(option, key) in RSCOptions" :key="key" :value="option.rsc">
                  {{option.rsc}} - {{ option.rsc_name }}
                </option>
              </select>
            </div>
            <div class="ml-3">
              <label class="font-weight-bold small mb-0 mr-2" for="shippingMethods">Shipping methods</label>
              <select class="form-control text-small" id="shippingMethods" v-model="selectedDoItBestShippingMethods">
                <option :value="null" disabled>Select an Shipping Method</option>
                <option v-for="(option, key) in doItBestShippingMethods" :key="key" :value="option">
                  {{option}}
                </option>
              </select>
            </div>
            <button type="button" class="btn btn-primary ml-3" @click="submitShipping">Send</button>
          </div>
        </div>
        <div class="border border-top-0 rounded-lg overflow-hidden">
          <vue-good-table styleClass="d-none d-md-table table mb-0" :rows="items" :columns="columns" :sortOptions="{enabled:false}" :row-style-class="rowStyleClassFn">
            <template slot="table-column" slot-scope="props">
              <div v-if="props.column.field == 'checkbox'">
                <!--<b-form-checkbox>&nbsp;</b-form-checkbox>-->
              </div>
            </template>
            <template slot="table-row" slot-scope="props">
              <div v-if="props.column.field == 'checkbox'">
                <!--<b-form-checkbox>&nbsp;</b-form-checkbox>-->
              </div>
              <div v-else-if="props.column.field == 'image_url'" class="w-100 d-flex justify-content-center">
                <div class="special-badge badge badge-danger text-uppercase mb-1" v-if="props.row.parcel_type == 'special'">Special</div>
                <img :src="props.row.image_url" style="max-width: 40px; max-height: 40px;" v-if="props.row.image_url" alt="Item Image" />
                <img v-else src="/images/default-img.svg" height="40" width="40" alt="Item Image" />
              </div>
              <div v-else-if="props.column.field == 'title'" class="name text-capitalize title-row" :data-tooltip="props.row.title">
                <router-link class="text-dark" :to="`/products/${props.row.sku}/${$ezSlugify(props.row.title)}`">{{ props.formattedRow[props.column.field] }}</router-link>
              </div>
              <div v-else-if="props.column.field == 'quantity'" class="name text-capitalize d-flex justify-content-center">
                <div class="btn-action quantity">
                  {{ props.row.quantity }}
                </div>
              </div>
              <div v-else-if="props.column.field == 'barcode'">
                <barcode class="ml-n2 mt-n2" :value="props.row.upc" height="50" background="transparent" width="2.5" fontSize="18" textAlign="center" />
              </div>
              <div v-else-if="props.column.field == 'adjust'">
                <a v-if="totalItems == 1 && props.row.quantity > 0" href="#" class="bt edit-bt" v-b-tooltip.hover title="This is the only item you have on this order so it can't be removed." aria-label="">
                  <svg class="mr-2" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.4 7.0001C13.4 8.69748 12.7257 10.3253 11.5255 11.5256C10.3252 12.7258 8.69736 13.4001 6.99998 13.4001C5.30259 13.4001 3.67472 12.7258 2.47449 11.5256C1.27426 10.3253 0.599976 8.69748 0.599976 7.0001C0.599976 5.30271 1.27426 3.67485 2.47449 2.47461C3.67472 1.27438 5.30259 0.600098 6.99998 0.600098C8.69736 0.600098 10.3252 1.27438 11.5255 2.47461C12.7257 3.67485 13.4 5.30271 13.4 7.0001ZM7.79998 3.8001C7.79998 4.01227 7.71569 4.21575 7.56566 4.36578C7.41563 4.51581 7.21215 4.6001 6.99998 4.6001C6.7878 4.6001 6.58432 4.51581 6.43429 4.36578C6.28426 4.21575 6.19998 4.01227 6.19998 3.8001C6.19998 3.58792 6.28426 3.38444 6.43429 3.23441C6.58432 3.08438 6.7878 3.0001 6.99998 3.0001C7.21215 3.0001 7.41563 3.08438 7.56566 3.23441C7.71569 3.38444 7.79998 3.58792 7.79998 3.8001ZM6.19998 6.2001C5.9878 6.2001 5.78432 6.28438 5.63429 6.43441C5.48426 6.58444 5.39998 6.78792 5.39998 7.0001C5.39998 7.21227 5.48426 7.41575 5.63429 7.56578C5.78432 7.71581 5.9878 7.8001 6.19998 7.8001V10.2001C6.19998 10.4123 6.28426 10.6158 6.43429 10.7658C6.58432 10.9158 6.7878 11.0001 6.99998 11.0001H7.79998C8.01215 11.0001 8.21563 10.9158 8.36566 10.7658C8.51569 10.6158 8.59998 10.4123 8.59998 10.2001C8.59998 9.98792 8.51569 9.78444 8.36566 9.63441C8.21563 9.48438 8.01215 9.4001 7.79998 9.4001V7.0001C7.79998 6.78792 7.71569 6.58444 7.56566 6.43441C7.41563 6.28438 7.21215 6.2001 6.99998 6.2001H6.19998Z" fill="#2563EB"/></svg>
                </a>
                <button :class="{'d-none' : totalItems == 1 && props.row.quantity > 0}" :disabled="totalItems == 1 || !order.issued_at || props.row.quantity < 1" class='btn-action text-tiny' @click.prevent="showAdjustQuantityModal(props.row.id)">
                  Adjust Quantity
                </button>
              </div>
              <span v-else>{{ props.formattedRow[props.column.field] }}</span>
            </template>
          </vue-good-table>

          <!-- MOBILE (CHECK) -->
          <div class="row small-gutters d-md-none" v-if="items">
            <div class="col-sm-6 mb-2" v-for="data in items" :key="data.code">
              <div class="card p-4 h-100">
                <div />
                <div class="mb-2 text-center flex-grow-1">
                  <img v-if="data.image_url != null" :src="data.image_url" style="max-width: 50px; max-height: 50px;" alt="Item image" />
                  <img v-else src="/images/default-img.svg" height="50" width="50" alt="Item image" />
                  <div class="data">{{ data.title }}</div>
                </div>
                <div class="d-flex align-items-center justify-content-between w-100 mb-1">
                  <b>Qty</b><div class="data">{{ data.quantity }}</div>
                </div>
                <div class="d-flex align-items-center justify-content-between w-100 mb-1">
                  <b>UPC</b><div class="data">{{ data.upc }}</div>
                </div>
                <div class="d-flex align-items-center justify-content-between w-100 mb-1">
                  <b>SKU</b><div class="data">{{ data.sku }}</div>
                </div>
                <div v-if="data.brand_name" class="d-flex align-items-center justify-content-between w-100 mb-1">
                  <b>Brand</b><div class="data">{{ data.brand_name }}</div>
                </div>
                <div class="d-flex align-items-center justify-content-between w-100 mb-1">
                  <b>Price</b><div class="data">${{ data.price }}</div>
                </div>
                <div class="d-flex flex-sm-column align-items-center justify-content-between w-100">
                  <template v-if="parcelType == 'special' || parcelType == 'doitbest'">
                    <a class="btn-outline-secondary btn-sm btn text-nowrap" href="https://www.membercatalog.com/" target="_blank"
                      v-if="data.vendor_name == 'DO IT BEST CORPORATION'">
                      Place an Order
                    </a>
                    <a class="btn-outline-secondary btn-sm btn text-nowrap" href="https://www.membersonline.com/" target="_blank"
                      v-else-if="data.vendor_name == 'True Value'">
                      Place an Order
                    </a>
                    <a class="email-button" :href="`mailto:${order.email}`" v-else>
                      <img class="mr-1" src="/icons/mail.png" alt="Email" /> Email
                    </a>
                  </template>
                  <!-- this button doesn't exist on desktop, maybe forgot to remove here? -->
                  <!-- <a v-else-if="$store.state.settings.cart.allowSpecialOrderVendors" class="btn-outline-secondary btn-sm btn text-nowrap" href="#" @click.prevent="markAsSpecial(data.id, data.quantity)">Mark As Special</a> -->
                  <a class="text-danger" href="#" @click.prevent="cancelItem(data)">
                    Cancel
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="total-custom p-3 d-flex flex-column flex-sm-row align-items-sm-center justify-content-end" v-if="items && items.length">
            <div class="ml-sm-4 d-flex flex-sm-column justify-content-between">
              {{ `Subtotal (${totalItems} item${totalItems > 1 ? 's' : ''})`}}:
              <span>${{order.item_total}}</span>
            </div>
            <div class="ml-sm-4 d-flex flex-sm-column justify-content-between" v-if="order.special_order_fee && order.special_order_fee != '0.00'">
              Special Order Fee:
              <span>${{order.special_order_fee}}</span>
            </div>
            <div class="ml-sm-4 d-flex flex-sm-column justify-content-between" v-if="order.additional_fee && order.additional_fee != '0.00'">
              Additional Fee:
              <span>${{order.additional_fee}}</span>
            </div>
            <div class="ml-sm-4 d-flex flex-sm-column justify-content-between" v-if="order.discount_availed && order.discount_availed != '0.00'">
              Discount:
              <span>${{order.discount_availed}}</span>
            </div>
            <div class="ml-sm-4 d-flex flex-sm-column justify-content-between text-uppercase" v-if="order.shipping_total && order.shipping_total != '0.00'">
              {{order.order_type}}: <span>${{order.shipping_total}}</span>
            </div>
            <div class="ml-sm-4 d-flex flex-sm-column justify-content-between">Taxes: <span>${{order.tax_total}}</span></div>
            <div class="ml-sm-4 d-flex flex-sm-column justify-content-between">Total: <span>${{order.total}}</span></div>
          </div>
          <!-- FINISH MOBILE -->
        </div>
      </template>
    </div>

    <!-- MODALS -->
    <b-modal ref="adjustQuantity">
      <div slot="modal-header">
        <h5>Adjust Quantity</h5>
        <div class="text-medium text-muted mt-1">{{ selectedItem.title }}</div>
      </div>
      <div class="alert text-left px-3 alert-warning text-medium">
        <template v-if="order.payment_type == 'Credit Card'">
          This transaction has been paid with a <b>Credit Card</b>, 
          if you click <b>Save Changes</b> & are decreasing the Quantity, <b>Customer</b>
          will be refunded an <b>Amount</b>, Stripe will not return your transaction 
          fee. This is <b>Stripe’s</b> policy and not <b>EZ-AD’s.</b>
        </template>
        <template v-else>
          Please Confirm with Customer Before Adjusting Quantity.
        </template>
      </div>
      <div role="group" class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">Quantity</div>
        </div>
        <div class="input-type-number">
          <button :disabled="adjusting || selectedItem.quantity <= minNum" class="btn btn-action btn-minus" @click="() => selectedItem.quantity -= selectedItem.quantity > minNum ? 1 : 0" aria-label="Remove Item">
            <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1H1H9Z" fill="#64748B"/><path d="M9 1H1" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button :disabled="adjusting || selectedItem.quantity >= selectedItem.maxQuantity" class="btn btn-action btn-plus" @click="() => selectedItem.quantity += 1" aria-label="Add Item">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 5H1H5Z" fill="#64748B"/><path d="M5 1V5M5 5V9M5 5H9M5 5H1" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <input min="1" class="form-control bg-white" v-model="selectedItem.quantity" type="number" readonly />
        </div>
      </div>
      <div slot="modal-footer">
        <button :disabled="adjusting" @click="() => $refs.adjustQuantity.hide()" class="btn btn-action text-medium px-3">Cancel</button>
        <button :disabled="adjusting" @click="adjustQuantity" class="btn btn-success text-medium px-3 ml-2">
          <div v-if="adjusting" class="spinner-border spinner-border-sm mr-2" />
          Save Changes
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { VueGoodTable } from 'vue-good-table';
  import AdminService from '@/api-services/admin.service';
  import VueBarcode from 'vue-barcode';

  export default {
    name: 'prepareOrderList',
    props: {
      parcelType: {
        default: null
      },
      order: {
        default: null
      },
      loading: {
        default: false
      },
      readonly: {
        default: false
      },
      barcode: {
        default: false
      }
    },
    components: {
      VueGoodTable,
      'barcode': VueBarcode,
    },
    data() {
      return {
        selectedItem: {},
        cancelItemQty: 0,
        selectedRSCoption: null,
        RSCOptions: [],
        doItBestShippingMethods: [],
        selectedDoItBestShippingMethods: null,
        adjusting: false
      };
    },
    computed: {
      minNum() {
        return this.items.filter(e => e.quantity > 0).length > 1 ? 0 : 1;
      },
      columns() {
        return [

          { field: 'image_url', label: '' },
          { field: 'title', label: 'Item name' },
          { field: 'quantity', label: 'Qty', tdClass: 'text-center', thClass: 'text-center' },
          { field: 'upc', label: 'Upc' },
          { field: 'sku', label: 'Sku' },
          { field: 'brand_name', label: 'Brand' },
          { field: 'price', label: 'Price', tdClass: 'font-weight-bold', formatFn: v => `$${v}` },
          { field: 'barcode', label: 'Barcode', hidden: !this.barcode },
          { field: 'adjust', tdClass:'text-right', label: '', hidden: this.readonly },
          
        ];
      },
      items() {
        return this.order.parcels ? 
                [].concat.apply([], this.order.parcels.map(e => e.items.map(i => ({...i, maxQuantity: i.quantity, parcel_type: e.parcel_type})))).filter(e => this.readonly ? e.quantity : true)
              : [];
      },
      totalItems() {
        let total = 0;
        this.items.forEach(e => total += Number(e.quantity));
        return total;
      },
    },
    methods: {
      rowStyleClassFn(row) {
        return !row.quantity ? 'disabled' : '';
      },
      submitShipping() {
        AdminService.doitBestSubmitShipment(this.order.id, this.selectedRSCoption, this.selectedDoItBestShippingMethods).then(response => {
          this.$swal({
            title: this.$options.filters.capitalize(response.data.status),
            text: response.data.message,
            type: response.data.status
          });
        }).catch(err => {
          this.$swal({
            title: 'Error',
            text: err.response.data.message,
            type: 'error'
          });
        });
      },
      showAdjustQuantityModal(id) {
        this.selectedItem = {...this.items.find(e => e.id == id)};
        this.$refs.adjustQuantity.show();
      },
      adjustQuantity() {
        let cancelItemQty = this.selectedItem.maxQuantity - this.selectedItem.quantity;
        if(cancelItemQty == 0) {
          this.$refs.adjustQuantity.hide();
          return;
        }
        this.adjusting = true;
        AdminService.cancelItem(this.order.id, this.selectedItem.id, cancelItemQty).then(response => {
          try {
            if (response.data.status == 'success') {
              this.$emit('getOrder');
              this.$refs.adjustQuantity.hide();
              let dataLayerOb = {
                'event': 'refund',
                'ecommerce': {
                  'transaction_id': this.order.id,
                  'items': [{
                    'item_name': this.selectedItem.title, // Name or ID is required.
                    'item_id': this.selectedItem.id,
                    'price': this.selectedItem.price,
                    'item_upc': this.selectedItem.upc,
                    'item_sku': this.selectedItem.sku,
                    'quantity': cancelItemQty || 1
                  }]
                }
              };
              window.dataLayer.push(dataLayerOb);
              window.gtag && window.gtag('event', 'refund', dataLayerOb);
            }
            this.adjusting = false;
          } catch (e) {
            this.adjusting = false;
            // console.log('error in adjusting order : ', e);
          }
        });
      },
      async cancelItem(data) {
        let lineid = data.id ? data.id : data.item.id;
        let item = data.item || data;
        let multiple = data.quantity > 1;
        let msg =
          multiple ?
          `Enter the quantity of item that should be cancelled. The customer will be notified.` :
          `Are you sure you want to cancel this item? The customer will be notified.`;
        this.$swal({
          title: `Cancel Item`,
          html: msg,
          input: multiple ? 'number' : false,
          inputAttributes: { min: 1, max: data.quantity },
          inputValue: data.quantity,
          type: 'warning',
          showCancelButton: true,
          cancelButtonText: 'Do Not Cancel',
          confirmButtonText: 'Cancel Item',
          preConfirm: result => {
            this.cancelItemQty = parseInt(result);
            return AdminService.cancelItem(this.orderId, lineid, this.cancelItemQty).then(response => {
              try {
                if (response.data.status == 'success') {
                  let dataLayerOb = {
                    'event': 'refund',
                    'ecommerce': {
                      'transaction_id': this.orderId,
                      'items': [{
                        'item_name': item.title, // Name or ID is required.
                        'item_id': item.id,
                        'price': item.price,
                        'item_upc': item.upc,
                        'item_sku': item.sku,
                        'quantity': this.cancelItemQty || 1
                      }]
                    }
                  };
                  window.dataLayer.push(dataLayerOb);
                  window.gtag && window.gtag('event', 'refund', dataLayerOb);
                  if(this.cancelItemQty)
                    data.quantity -= this.cancelItemQty;
                  else
                    data.quantity = 0;
                } else {
                  this.makeToast('danger', 'Oops', 'Something went wrong, please try again later!');
                }
              } catch (e) {
                this.preparing = false;
                // console.log('error in preparing order : ', e);
              }
            });
          },
          allowOutsideClick: () => !this.$swal.isLoading()
        }).then(result => {
          if (result.value) {
            this.$swal({
              title: 'Success',
              text: 'Item has been canceled!',
              type: 'success'
            });
            this.getOrderData();
          }
        });
      },
    }
  };
</script>

<style scoped lang="scss">
  .delivery-time {
    font-size: 32px !important;
  }

  [data-tooltip] {
    &::before {
      opacity: 0;
      transition: opacity .2s;
      pointer-events: none;
      content: attr(data-tooltip);
      position: absolute;
      background: #272727;
      color: #fff;
      font-size: 13px;
      white-space: nowrap;
      margin: -30px 0 0 -20px;
      padding: 2px 8px;
      border-radius: 3px;
    }
    &:hover {
      &::before {
        opacity: 1;
      }
    }
  }
  .table {
    :deep(td) {
      position: relative;
      vertical-align: middle;
    }
    .title-row {
      max-width: 570px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .total-custom {
      background: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      color: #64748B;
      font-size: 12px;

      > div {
        text-transform: uppercase;
        font-weight: bold;
        span {
          color: #334155;
          font-size: 14px;
          line-height: 16px;
        }
      }
    }
    .special-badge {
      position: absolute;
      left: 10px;
      top: 10px;
    }
    .quantity {
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      width: 32px;
      height: 32px;
      text-align: center;
      padding: 0 3px;
    }
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      h5 {
        font-size: 19px;
        line-height: 22px;
        color: #2F3540;
        margin-bottom: 0;
      }
      .purchase-type {
        display: flex;
        align-items: center;
        h6 {
          margin-bottom: 0;
          margin-right: 5px;
          font-size: 14px;
          line-height: 16px;
          color: #2F3540;
        }
        input[type="text"] {
          background: #FFFFFF;
          border: 1px solid #E6E6E6;
          box-sizing: border-box;
          box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);
          border-radius: 5px;
          padding-left: 5px;
        }
      }
      .table-date-range {
        display: flex;
        align-items: center;
        h6 {
          margin-bottom: 0;
          margin-right: 5px;
          font-size: 14px;
          line-height: 16px;
          color: #2F3540;
        }
        input[type="date"] {
          background: #FFFFFF;
          border: 1px solid #E6E6E6;
          box-sizing: border-box;
          box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);
          border-radius: 5px;
          padding-left: 5px;
        }
        span {
          margin: 0 5px;
        }
      }
    }
    .pagination-custom {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 15px;
      .pages {
        display: flex;
        flex: 0.5;
        align-items: center;
        h6 {
          margin-bottom: 0;
          margin-right: 5px;
          font-size: 14px;
          line-height: 16px;
          color: #2F3540;
        }
        input[type="text"] {
          background: #FFFFFF;
          border: 1px solid #E6E6E6;
          box-sizing: border-box;
          box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);
          border-radius: 5px;
          padding-left: 5px;
        }
        span {
          margin: 0 5px;
        }
      }
      .pagination {
        margin: 0;
        flex: 1;
        display: flex;
        justify-content: flex-start !important;
      }
    }
  }

  @media (max-width: 1400px) {
    .table {
      .title-row {
        max-width: 400px;
      }
    }
  }
  @media (max-width: 1250px) {
    .table {
      .title-row {
        max-width: 200px;
      }
    }
  }

</style>
