<template>
  <div>
    <h5 class="px-md-4 px-lg-5 pb-3 pt-4 font-weight-bold border-gray border-bottom" id="orders_header">
      My Recurring Orders
    </h5>
    <template v-if="!recurring_orders">
      <div class="page-loader">
        <img src="/icons/loader.gif" class="loader" alt="Loading..." />
      </div>
    </template>
    <template v-else-if="recurring_orders.length === 0">
      <span>No Recurring Orders found.</span>
    </template>
    <div v-else class="px-md-4 px-lg-5">
      <b-table :items="recurring_orders" :fields="fields" class="d-none d-md-table orders-table">
        <template v-slot:cell(actions)="data">
          <a href="#" @click.prevent="viewOrder(data.item)">View Order</a>
          <a href="#" class="pl-5" @click.prevent="openCancelRecurringOrdersModal(data.item)">Cancel</a>
        </template>
      </b-table>
      <div class="row small-gutters order-mobile d-md-none orders-table">
        <div class="col-sm-6" v-for="order in recurring_orders" :key="order.id">
          <div class="card p-4 mb-3">
            <div class="row small-gutters">
              <template v-for="column in fields">
                <div class="info-block d-flex col-12" :key="column.field" v-if="column.key == 'actions'">
                  <a class="btn btn-outline-primary" href="#" @click.prevent="viewOrder(order)">View Order</a>
                  <a href="#" class="btn btn-outline-secondary ml-3" @click.prevent="openCancelRecurringOrdersModal(order)">Cancel</a>
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
    <b-modal centered size="lg" class="modal-box order-modal" ref="orderDialog" id="orderDialog">
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
        <button type="button" @click="hideDialog" class="btn btn-primary">Done</button>
      </div>
    </b-modal>
    <b-modal centered v-model="showCancelRecurringOrderExecutionsModal" size="lg" hide-footer no-close-on-esc no-close-on-backdrop hide-header-close>
      <template #modal-title>
        <div class="text-capitalize">Edit Order #{{selectedRecurringOrderMasterOrderId}} Recurring Orders</div>
      </template>
      <p>
        <i class="fa fa-info-circle done-check-info-icon mr-1"></i>
        Select the Recurring Order dates you want to cancel for this order.
        Click "Cancel All" if you want to cancel all Recurring Orders left for this order.
      </p>
      <div class="container d-flex justify-content-center executions-table">
        <table class="table text-center">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr v-for="item in selectedRecurringOrderExecutionDates" :key="item.id"
                :class="{ 'disabled-row': item.order_id || item.is_cancelled_by_customer == 1 }">
              <td>{{ item.execution_date }}</td>
              <td>{{ item.status == 'Done' ? 'Processed' : item.status }}</td>
              <td>
                <button v-if="item.status == 'Pending'" class="btn btn-xs btn-action text-tiny" @click="cancelExecution(item, selectedRecurringOrderMasterOrderId)">
                  <span class="text-danger">Cancel</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-end mt-2">
        <b-button variant="outline-danger" @click.prevent="closeUpdateExecutionsModal">Go Back</b-button>
        <b-button class="ml-3" variant="danger" @click.prevent="cancelAllRecurringOrders(selectedRecurringOrderMasterOrderId)">Cancel All</b-button>
      </div>
    </b-modal>
  </div>
</template>
<script>
  import OrderApiService from '@/api-services/order.service';
  import moment from 'moment-timezone';

  export default {
    data() {
      return {
        recurring_orders: null,
        selectedOrder: null,
        selectedOrderRefunds: null,
        printOrderReceipt: false,
        currentUser: null,
        fields: [
          {key: "parent_order_id", label: "Order #"},
          {key: "start_date", label: "Start Date"},
          {key: "end_date", label: "End Date"},
          {key: "period", label: "Period"},
          {key: "actions", label: "", slot: "actions"} 
        ],
        showCancelRecurringOrderExecutionsModal: false,
        selectedRecurringOrderExecutionDates: [],
        selectedRecurringOrderMasterOrderId: null
      };
    },
    async mounted() {
      this.$ezSetTitle('My Recurring Orders');
      this.currentUser = this.$store.state.activeUser.data.customer;
      this.getRecurringOrders();
    },
    computed: {
      settings() {
        return this.$store.state.settings;
      },
      isRecurringOrdersEnabled() {
        return this.$store.state.businessDetails && typeof this.$store.state.businessDetails.enable_recurring_orders != "undefined" ? (this.$store.state.businessDetails.enable_recurring_orders * 1) : 0;        
      }
    },
    methods: {
      formatDate(date) {
        return moment(date).format('MMM DD, YYYY');
      },
      async getRecurringOrders() {
        let response = await OrderApiService.getMyRecurringOrders();
        response = response.data;
        this.recurring_orders = response.recurring_orders.map(reOrder => {
          return {
            parent_order_id: reOrder.parent_order_id,
            start_date: new Date(reOrder.start_date.replace(/ /g, 'T')).toLocaleDateString(),
            end_date: new Date(reOrder.end_date.replace(/ /g, 'T')).toLocaleDateString(),
            period: reOrder.period,
            executions: reOrder.executions
          };
        });
      },
      async openCancelRecurringOrdersModal(row) {
        this.selectedRecurringOrderExecutionDates = row.executions;
        this.selectedRecurringOrderMasterOrderId = row.parent_order_id;
        this.showCancelRecurringOrderExecutionsModal = true;
      },
      closeUpdateExecutionsModal() {
        this.selectedRecurringOrderExecutionDates = [];
        this.showCancelRecurringOrderExecutionsModal = false;
        this.selectedRecurringOrderMasterOrderId = null;
      },
      async viewOrder(order) {
        const response = await OrderApiService.getOrderDetails(order.parent_order_id);
        this.selectedOrder = response.data.data;
        if (response.data.data.refunds) {
          this.selectedOrderRefunds = response.data.data.refunds;
        }
        this.$refs.orderDialog.show();
      },
      hideDialog() {
        this.$refs.orderDialog.hide();
      },
      async cancelExecution(exec, masterOrderId) {
        const pendingExecutions = this.selectedRecurringOrderExecutionDates.filter(execution => execution.status === 'Pending');

        if (pendingExecutions.length === 1) {
          this.$swal({
            title: "Warning",
            text: "This would be the last execution remaining for this Recurring Order Scheme. Are you sure you want to cancel this Recurring Order? This action can't be undone.",
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
          }).then(async (result) => {
            if (result.value) {
              this.cancelAllRecurringOrders(masterOrderId);
            }
          });
        } else {
          this.$swal({
            title: "Warning",
            text: "Are you sure you want to cancel this Recurring Order date? This action can't be undone.",
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
          }).then(async (result) => {
            if (result.value) {
              await OrderApiService.cancelRecurringOrder({recurring_order_id: exec.id}).then(e => {
                this.getRecurringOrders();
                this.selectedRecurringOrderExecutionDates.find(e => e.id == exec.id).status = 'Cancelled';
                this.$swal('Success', 'Your Recurring Order For ' + this.formatDate(exec.execution_date) + ' was cancelled', 'success');
              }).catch(err => err.response);
            }
          });
        }
      },
      async cancelAllRecurringOrders(parentOrderId) {
        this.$swal({
          title: "Are you sure you want to cancel this Recurring Order? This action can't be undone.",
          type: 'warning',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          showCancelButton: true,
        })
        .then(async (result) => {
          if (result.value) {
            await OrderApiService.cancelAllRecurringOrders({parent_order_id: parentOrderId, is_cancelled_by_customer: 1}).then(e => {
              this.getRecurringOrders();
              this.closeUpdateExecutionsModal();
              this.$swal('success', 'Your Recurring Order (Order #' + parentOrderId + ') was cancelled', 'success');
            }).catch(err => err.response);
          }
        });
      },
    }
  };
</script>
<style lang="scss">
  .rorder {
    display: inline-flex;
    margin-right: 10px;
    margin-bottom: 10px;
    background: none;
    border: 1px solid var(--primary); 
    color: var(--primary);
    border-radius: 4px;
    font-size: 13px;
    font-weight: bold;
    padding: 5px 10px;
    height: auto;
    align-items: center;
  }

  .rorder > :nth-child(1) {
    min-width: 85px;
    max-width: 85px;
  }

  .rorder > :nth-child(2) {
    min-width: 20px;
    max-width: 20px;
  }

  .remove-rorder {
    background-color: var(--primary);
    color: #fff;
  }
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

  .executions-table {
    max-height: 350px;
    overflow-y: scroll;
  }
</style>
