<template>
  <div style="border: none;">
    <h5 class="px-md-4 px-lg-5 py-3 border-gray border-bottom font-weight-bold" id="orders_header">
      My Orders
    </h5>
    <div class="order-container" id="orderContainer">
      <h5 class="px-md-4 px-lg-5 py-3 border-gray border-bottom font-weight-bold">
        Saved Carts
      </h5>
      <template v-if="!orders && !isSaving">
        <div class="page-loader">
          <img src="/icons/loader.gif" class="loader" alt="Loading..." />
        </div>
      </template>
      <div class="px-md-4 px-lg-5" v-else-if="orders.length === 0">
        <span>No carts found.</span>
      </div>
      <div class="px-md-4 px-lg-5" v-else>
        <b-table
          :items="orders"
          :fields="fields" responsive>
          <template v-slot:cell(actions)="data">
            <a href="#" v-if="data.item.status != 'Cart'" @click.prevent="updateCurrentCart(data.item)">Select Cart</a>
            <a href="#" class="text-success" v-if="data.item.status === 'Cart'" @click="alreadySelectedCart" >Current Cart</a>
          </template>
        </b-table>
      </div>
    </div>

  </div>
</template>
<script>
  import CartApiService from '@/api-services/cart.service';
  import OrderApiService from '@/api-services/order.service';

  export default {
    data() {
      return {
        orders: null,
        selectedOrder: null,
        printOrderReceipt: false,
        isSaving: false,
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
      this.currentUser = this.$store.state.activeUser.data.customer;
      let response = await OrderApiService.getSavedOrders();
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
      alreadySelectedCart() {
        this.$swal("This is already the current cart", '', "error");
      },
      async updateOrder() {
        this.orders = false;
        let response = await OrderApiService.getSavedOrders();
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
        this.$swal("Updated current cart", '', "success");
      },
      async updateCurrentCart(order) {
        this.orders = false;
        await CartApiService.updateCart(order.id);
        this.$store.dispatch('fetchCartItemsDetails');
        this.currentUser = this.$store.state.activeUser.data.customer;
        this.updateOrder();
      },
    }
  };
</script>
<style lang="scss">
  #customerSettingsNav {
    .router-link-active {
      font-weight: bold;
    }
  }
  
  .order-container {
    h4 {
      font-size: 20px;
      line-height: 23px;
      color: var(--text);
      padding: 18px 0;

    }

    table {
      width: 100%;

      thead {
        margin-top: 25px;
        line-height: 25px;
        border-bottom: 1px solid #EAEAEB;

        tr {
          th {
            font-weight: 600;
            font-size: 14px;
            line-height: 24px;
            color: var(--text);

          }
        }
      }

      tbody {
        tr {
          td {
            font-weight: 400;
            font-size: 14px;
            line-height: 24px;
            color: var(--text);
            border-bottom: 1px solid #EAEAEB;

            &:nth-of-type(5) {
              font-style: italic;
            }

            &:last-child {
              cursor: pointer;
              color: var(--primary);
              white-space: nowrap;
            }
          }
        }
      }
    }

    .modal-box {
      .modal-dialog {
        max-width: 1140px !important;

        .modal-header {

          background: transparent;

          div {
            color: #000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;

            h5 {
              margin-bottom: 0;
            }

            span {
              width: 20px;
              height: 20px;
              background: var(--primary);
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
              cursor: pointer;
            }
          }

        }

        .modal-footer {
          display: none;
        }
      }
    }
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
  
  .card-text {
    .card-text-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #EAEAEB;
      height: 45px;

      span {
        font-weight: 500;
        font-size: 14px;
        line-height: 36px;
        color: #ACACAC;
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
  }
</style>