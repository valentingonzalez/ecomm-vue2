<template>
  <div>
    <h5 class="px-md-4 px-lg-5 py-3 font-weight-bold" id="orders_header">
      My Orders
    </h5>
    <template v-if="!orders">
      <div class="page-loader">
        <img src="/icons/loader.gif" class="loader" alt="Loading..." />
      </div>
    </template>
    <div class="px-md-4 px-lg-5" v-else-if="orders.length === 0">
      <span>No orders found.</span>
    </div>
    <div v-else class="px-md-4 px-lg-5">
      <b-table :items="orders" :fields="fields" class="d-none d-md-table orders-table">
        <template v-slot:cell(actions)="data">
          <a href="#" @click.prevent="viewOrder(data.item)">View Order</a>
        </template>
      </b-table>
      <div class="row small-gutters order-mobile d-md-none orders-table">
        <div class="col-sm-6" v-for="order in orders" :key="order.id">
          <div class="card p-4 mb-3">
            <div class="row small-gutters">
              <template v-for="column in fields">
                <div class="info-block col-6" :key="column.field" v-if="column.key == 'actions'">
                  <a class="btn btn-outline-primary" href="#" @click.prevent="viewOrder(order)">View Order</a>
                </div>
                <div class="info-block col-6 col-lg-4 mb-3" :key="column.key" v-else-if="order[column.key]">
                  <b>{{ column.label }}</b>
                  <div class="data" v-html="order[column.key]" :class="column.key == 'order_type' && `badge-${order[column.key]}`" />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal size="lg" class="modal-box order-modal" ref="orderDialog" id="orderDialog">
      <div slot="modal-header">
        <h5>Order Details</h5>
      </div>

      <div v-if="selectedOrder">
        <div class="row align-items-stretch">
          <div class="col-lg-6 order-1 order-lg-0">
            <b-card header="Order Summary" class="h-100">
              <b-card-text>
                <div class="card-text-line">
                  <span>Order Type</span>
                  <p class="process"> {{selectedOrder.order_type | capitalize}}</p>
                </div>
                <div class="card-text-line">
                  <span>Status</span>
                  <p class="process"> {{selectedOrder.status}}</p>
                </div>
                <div v-if="$store.state.hasTrueValueRewards && selectedOrder.tvr_number" class="card-text-line">
                  <span>True Value Rewards #</span>
                  <p class="process"> {{ selectedOrder.tvr_number }}</p>
                </div>
                <div class="card-text-line">
                  <span>Subtotal ({{selectedOrder.order_items_details.length}} {{selectedOrder.order_items_details.length > 1 ? 'items' : 'item'}})</span>
                  <p>${{selectedOrder.item_total}}</p>
                </div>
                <div v-if="['delivery', 'shipping'].includes(selectedOrder.order_type)" class="card-text-line">
                  <span v-if="selectedOrder.order_type == 'delivery'">Delivery Charge</span>
                  <span v-else>Shipping & Handling</span>
                  <p>${{selectedOrder.shipping_total}}</p>
                </div>
                <div class="card-text-line">
                  <span>Taxes</span>
                  <p>${{selectedOrder.tax_total}}</p>
                </div>
                <div class="card-text-line" v-if="selectedOrder.discount_availed && selectedOrder.discount_availed != '0.00'">
                  <span>Discount</span>
                  <p>${{selectedOrder.discount_availed}}</p>
                </div>
                <div class="card-text-line border-0">
                  <h4><b>Total</b></h4>
                  <h3><b>${{selectedOrder.total}}</b></h3>
                </div>
                <div class="payment-method" style="display:none">
                  <b-card>
                    <div class="avtar-img">
                      <img src="/icons/illustration.png" alt="Illustration" />
                    </div>
                    <b-card-text>
                      <div class="method">
                        <h5>Payment Method</h5>
                        <p>Credit Card</p>
                      </div>
                      <div class="method">
                        <h5>Credit Card</h5>
                        <p>**** **** **** 4923</p>
                      </div>
                      <div class="method">
                        <h5>Payment Status</h5>
                        <p>Processing</p>
                      </div>
                    </b-card-text>
                  </b-card>
                </div>
                <div class="payment-method" style="display:none">
                  <b-card>
                    <div class="avtar-img">
                      <img src="/icons/map.png" class="loader" alt="Loading..." />
                    </div>
                    <b-card-text>
                      <div class="method">
                        <h5>Delivery</h5>
                        <p>Free Delivery</p>
                      </div>
                      <div class="method">
                        <h5>Credit Card</h5>
                        <p>**** **** **** 4923</p>
                      </div>
                      <div class="method">
                        <h5>Deliver To</h5>
                        <p>19040 Soledad Canyon St, Suite 230<br/>
                          Santa Clarita, CA - California 91351</p>
                      </div>
                      <div class="method">
                        <h5>Delivery Status</h5>
                        <p>Waiting Payment</p>
                      </div>
                    </b-card-text>
                  </b-card>
                </div>
              </b-card-text>
            </b-card>
          </div>
          <div class="col-lg-6 mb-3 mb-lg-0">
            <b-card header="Products" class="h-100">
              <cart-item v-for="product in selectedOrder.order_items_details" :key="product.id" :item="product" :readonly="true" class="small" />
            </b-card>
          </div>
          <div class="col-lg-6" v-if="selectedOrderRefunds">
            <b-card header="Refunded Items" class="h-100 mt-2">
              <!-- <cart-item v-for="(refund, index) in selectedOrderRefunds" :key="index" :item="refund" :readonly="true" class="small"/> -->
              <b-row align-v="center" v-for="(refund, index) in selectedOrderRefunds" :key="index" class="mb-3">
                <b-col lg="4" sm="6" class="mr-2">
                  <div class="img-wrapper d-flex align-items-center justify-content-center">
                    <img :src="refund.image_url" class="img-fluid" :alt="refund.title" />
                  </div>
                </b-col>
                <b-col lg="6" sm="5">
                  <b-row class="mb-2" style="text-overflow: ellipsis; overflow: none;">
                    {{ refund.title }}
                  </b-row>
                  <b-row>
                    <b-col class="pl-0">
                      <span class="price text-primary font-weight-bold pl-0">${{ refund.amount_refunded }}</span>
                      <div class="font-weight-bold small">({{ refund.quantity_refunded }})</div>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-card>
          </div>
        </div>
      </div>

      <div slot="modal-footer">
        <button type="button" @click="printOrder" class="btn btn-outline-primary mr-3">Print</button>
        <button type="button" @click="hideDialog" class="btn btn-primary">Done</button>
      </div>
    </b-modal>
    <div id="printOrder" v-if="selectedOrder">
      <template>
        <div class="d-flex justify-content-center my-4">
          <img :src="$store.state.settings.logo" width="200" alt="Logo" />
        </div>
        <div class="row" v-if="selectedOrder.transaction && selectedOrder.transaction.in_store">
          <div class="col-12">
            <span style="font-size:72px; color: #c00; font-weight: bold;">NOT PAID</span>
          </div>
        </div>
        <div class="row my-4">
          <div class="col-6">
            <div class="font-weight-bold">Billed To</div>
            <div class="order_name">{{ currentUser.first_name }} {{ currentUser.last_name }}</div>
            <div v-if="selectedOrder.order_type === 'shipping'">
              <div>{{ selectedOrder.address }}</div>
              <div>{{ selectedOrder.address2 || '' }}</div>
              {{ selectedOrder.city }}, {{ selectedOrder.state }} {{ selectedOrder.zip }}
            </div>
            <div v-else-if="selectedOrder.address == null && selectedOrder.zip == null">
              No address submitted
            </div>
            <div v-else>
              <span v-if="selectedOrder.address != null">{{ selectedOrder.address }},</span> {{ selectedOrder.zip }}
            </div>
          </div>
          <div class="col-6">
            <div class="font-weight-bold">Payment Method</div>
            <div><b>Credit Card</b> **** {{ selectedOrder.cc_last4 }}</div>
            <div><b>Phone Number: </b>{{ currentUser.telephone }}</div>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6">
            <b>Order Number: </b>#{{ selectedOrder.id }}
          </div>
          <div class="col-md-6">
            <b>Order Date: </b> {{ selectedOrder.order_items_details[0].date_added }}
          </div>
        </div>
        <table class="table table-striped table-bordered mb-4">
          <thead>
            <tr>
              <th class="text-center" width="100" scope="col">Quantity</th>
              <th scope="col">Parcel</th>
              <th scope="col">Product Name</th>
              <th scope="col">Business</th>
              <th scope="col">SKU</th>
              <th width="100" scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            <template>
              <tr v-for="item in selectedOrder.order_items_details" :key="item.id">
                <th class="text-center" scope="row">{{ item.quantity }}</th>
                <td class="text-capitalize">{{ selectedOrder.order_type }}</td>
                <td class="text-capitalize">{{ item.title | lowerCase }}</td>
                <td>{{ selectedOrder.store_name }}</td>
                <td>{{ item.sku }}</td>
                <td>${{ item.price }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <h5 v-if="selectedOrderRefunds"><strong>Refunded Items</strong></h5>
        <table v-if="selectedOrderRefunds" class="table table-striped table-bordered mb-4">
          <thead>
            <tr>
              <th class="text-center" width="100" scope="col">Quantity</th>
              <th scope="col">Parcel</th>
              <th scope="col">Product Name</th>
              <th scope="col">Business</th>
              <th scope="col">SKU</th>
              <th scope="col" width="100">Refund Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, index) in selectedOrderRefunds" :key="index">
              <th class="text-center" scope="row">{{ r.quantity_refunded }}</th>
              <td class="text-capitalize">{{ selectedOrder.order_type }}</td>
              <td>{{ r.title }}</td>
              <td>{{ selectedOrder.store_name }}</td>
              <td>{{ r.sku }}</td>
              <td>${{ r.amount_refunded}}</td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex flex-column align-items-end justify-content-end">
          <div class="d-inline-flex justify-content-end align-items-end">
            <b class="mr-3">Tax:</b>
            <div style="width: 88px;">${{ selectedOrder.tax_total }}</div>
          </div>
          <div v-if="selectedOrder.shipping_total != '0.00'" class="d-inline-flex justify-content-end align-items-end">
            <b class="mr-3 text-capitalize">{{selectedOrder.order_type}}:</b>
            <div style="width: 88px;">${{ selectedOrder.shipping_total }}</div>
          </div>
          <div v-if="selectedOrder.special_order_fee && selectedOrder.special_order_fee != '0.00'" class="d-inline-flex justify-content-end align-items-end">
            <b class="mr-3">Special Order Fee:</b>
            <div style="width: 88px;">${{selectedOrder.special_order_fee}}</div>
          </div>
          <div v-if="selectedOrder.discount_availed && selectedOrder.discount_availed != '0.00'" class="d-inline-flex justify-content-end align-items-end">
            <b class="mr-3">Discount:</b>
            <div style="width: 88px;">${{ selectedOrder.discount_availed }}</div>
          </div>
          <div class="d-inline-flex justify-content-end align-items-end">
            <b class="mr-3">Total:</b>
            <div style="width: 88px;">${{ selectedOrder.total }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import OrderApiService from '@/api-services/order.service';

  export default {
    data() {
      return {
        orders: null,
        selectedOrder: null,
        selectedOrderRefunds: null,
        printOrderReceipt: false,
        currentUser: null,
        orderType: ['Pick up in store', 'Delivery', 'Shipping'],
        fields: [
          {key: "id", label: "Order #"},
          {key: "date", label: "Date"},
          {key: "shipTo", label: "Ship To"},
          {key: "total", label: "Total"},
          {key: "status", label: "Status"},
          {key: "actions", label: "", slot: "actions"}
        ]
      };
    },
    async mounted() {
      this.$ezSetTitle('My Orders');
      this.currentUser = this.$store.state.activeUser.data.customer;
      let response = await OrderApiService.getOrders();
      response = response.data.data;
      const orders = response.data;
      this.orders = orders.map(order => {
        return {
          id: order.id,
          date: new Date(order.createdAt.replace(/ /g, 'T')).toLocaleDateString(),
          shipTo: response.customer_details.first_name + ' ' + response.customer_details.last_name,
          total: '$' + order.total_price,
          status: order.status
        };
      });
    },
    methods: {
      async viewOrder(order) {
        const response = await OrderApiService.getOrderDetails(order.id);
        // console.log(response);
        this.selectedOrder = response.data.data;
        if (response.data.data.refunds) {
          this.selectedOrderRefunds = response.data.data.refunds;
        }
        this.$refs.orderDialog.show();
      },
      hideDialog() {
        this.$refs.orderDialog.hide();
      },
      printOrder() {
        this.$refs.orderDialog.hide();
        setTimeout(() => {
          window.print();
        }, 100);
      }
    }
  };
</script>
<style lang="scss">
  .img-wrapper {
    border: 1px solid #E8E8E8;
    border-radius: 4px;
    width: 70px;
    min-width: 70px;
    height: 70px;
    img {
      max-height: 70px;
      max-width: 70px;
    }
  }

  .price {
    font-size: 1.125rem;
  }

  #printOrder {
    display: none;
  }

  .card-header {
    background: transparent;
    display: flex;
  }

  .order_name {
    text-transform: capitalize;
  }

  .table th {
    border-top: none !important;
  }

  .refund_img {
    width: 100px;
    height: 100px;
  }

  .card-text {
    .card-text-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #EAEAEB;
      height: 45px;

      span {
        font-weight: 400;
        font-size: 14px;
        line-height: 36px;
        color: #6d6d6d;
      }

      .process {
        font-size: 14px;
        line-height: 36px;
        text-align: right;
        color: var(--primary);
      }

      p {
        font-size: 14px;
        line-height: 16px;
        color: var(--text);
        margin: 0;
      }

      h4 {
        font-weight: 500;
        font-size: 18px;
        line-height: 21px;
        color: var(--text);
        margin: 0;
      }

      h3 {
        font-size: 18px;
        line-height: 21px; /* identical to box height */
        font-weight: 600;
        color: var(--text);
        margin: 0;
      }
    }

    .payment-method {
      margin-top: 20px;

      .avtar-img {
        padding-right: 15px;
      }

      .card {
        .card-header {
          background: transparent;
          display: flex;
        }

        .card-body {
          display: flex;
          align-items: flex-start;

          .card-text {
            flex: 1;

            .method {
              display: flex;
              justify-content: space-between;
              align-items: center;

              h5 {
                font-weight: 500;
                font-size: 14px;
                line-height: 16px;
                color: #ACACAC;
              }

              p {
                font-size: 14px;
                line-height: 16px;
                color: var(--text);
                font-weight: 400;
              }
            }
          }
        }
      }
    }


  }
  @media (min-width: 992px) {
    .order-lg-0 {
      order: 0 !important;
    }
  }
  @media (max-width: 767px) {
    .payment-method {
      .card {
        .card-body {
          display: flex;
          align-items: center;
          flex-direction: column;
        }
      }
    }
  }

  @media print {

    #orderDialog {
      display: none;
      visibility: hidden;
    }

    #orderContainer {
      display: none;
      visibility: hidden;
    }

    #mainHeader {
      display: none;
      visibility: hidden;
    }

    #customerSettingsNav {
      display: none;
      visibility: hidden;
    }

    #printOrder {
      display: block;
    }

    .orders-table {
      display: none !important;
      visibility: hidden;
    }

    #orders_header {
      display: none !important;
    }
  }
</style>
