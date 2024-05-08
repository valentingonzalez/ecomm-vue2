<template>

  <div class="container my-4">
    <h2 class="mb-3">Order Evaluation Guide: Considerations and Gentle Reminders</h2>

    <div class="card card-custom">
      <div class="card-body">
        <div class="card-header-custom">
          <h5>Order Review Insights: Key Considerations</h5>
          <p>For e-commerce store owners, prioritising security helps maintain customer trust. Not all orders need to
            meet every criterion, but here are key points to enhance your store's defence against fraud.</p>
          <div class="content-row mt-4">
            <div class="icon-container">
              <div class="icon-placeholder">
                <img src="/icons/svg-1.svg" alt="Home">
              </div>
            </div>
            <div class="text-container">
              <h2 class="title_head">Higher Dollar Amount</h2>
              <p>Orders over $1000, especially for high-value or bulk purchases, can be suspicious.</p>
            </div>
            <div :class="getBadgeClass(order)">
              <i class="badge-icon fa" :class="{ 'fa-times': order.total > 1000, 'fa-check': order.total <= 1000 }"></i>
              <span>{{ order.total >= 1000 ? 'Fail' : 'Pass' }}</span>
            </div>
          </div>
          <div class="content-row mt-4">
            <div class="icon-container">
              <div class="icon-placeholder">
                <img src="/icons/svg-2.svg" alt="Home">
              </div>
            </div>
            <div class="text-container">
              <h2 class="title_head">Purchase of premium brand</h2>
              <p>Premium product purchases may carry increased fraud risks. Please exercise caution.</p>
            </div>
            <div class="badge-pass">
              <i class="fa fa-check badge-icon"></i><span>Pass</span>
            </div>
          </div>
          <div class="content-row mt-4" v-if="order.payment_type == 'Credit Card' || order.payment_type == 'Auth Only'">
            <div class="icon-container">
              <div class="icon-placeholder">
                <img src="/icons/svg-2.svg" alt="Home">
              </div>
            </div>
            <div class="text-container">
              <h2 class="title_head">Multiple Usage of Card</h2>
              <p>A credit card number appears to be used by multiple customers. (This implies potential
                misuse)</p>
            </div>

            <div v-if="!fingerPrintChecked" class="badge-risk" style="width: 100px; height: 28px;">
              <span>analyzing...</span>
            </div>
            <div v-if="fingerPrintChecked"
              :class="{ 'badge-fail': isFingerPrintUsed, 'badge-pass': !isFingerPrintUsed }">
              <i class="fa badge-icon" :class="{ 'fa-times': isFingerPrintUsed, 'fa-check': !isFingerPrintUsed }">
              </i><span>{{ isFingerPrintUsed ? 'Fail' : 'Pass' }}</span>
            </div>
            <button v-if="isFingerPrintUsed && fingerPrintChecked" @click.prevent="showCustomersList()"
              class="btn btn-cust text-nowrap d-sm-block">
              View Customers
            </button>
          </div>
          <div class="content-row mt-4 d-none">
            <div class="icon-container">
              <div class="icon-placeholder">
                <img src="/icons/svg-7.svg" alt="Home">
              </div>
            </div>
            <div class="text-container">
              <h2 class="title_head">Email Verification</h2>
              <p>Is the email address a valid and deliverable address?</p>
            </div>
            <div class="badge-warning">
              <span class="dot"></span><span>Warning</span>
            </div>
          </div>
          <div class="content-row mt-4 d-none">
            <div class="icon-container">
              <div class="icon-placeholder">
                <img src="/icons/svg-8.svg" alt="Home">
              </div>
            </div>
            <div class="text-container">
              <h2 class="title_head">IP Geolocation</h2>
              <p>Does the customer's IP address location align with the billing address or shipping address?</p>
            </div>
            <div class="badge-warning">
              <span class="dot"></span><span>Warning</span>
            </div>
          </div>
          <div class="content-row mt-4 d-none">
            <div class="icon-container">
              <div class="icon-placeholder">
                <img src="/icons/svg-6.svg" alt="Home">
              </div>
            </div>
            <div class="text-container" style="width: 200%;">
              <h2 class="title_head">Customer Account</h2>
              <ul>
                <li>Is the customer a new account or an existing one?
                  <span class="badge-risk" style="float:inline-end"> New accounts can be riskier</span>
                </li>
                <li class="mt-4">Does the customer have a history of previous orders and good standing?
                  <span class="badge-pass" style="float:inline-end"> <i class="fa fa-check badge-icon"></i>Pass</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

        <div class="dotted-line"></div>

        <div>
          <h5>Reminder</h5>
          <p>Fraud Reminder: Verify sellers and review transactions carefully before purchasing online</p>
          <div class="content-row mt-4">
            <div class="icon-container">
              <div class="icon-placeholder">
                <img src="/icons/svg-3.svg" alt="Home">
              </div>
            </div>
            <div class="text-container">
              <h2 class="title_head">Sense of Urgency</h2>
              <p>When the customer requests an urgent order.</p>
            </div>
          </div>
          <div class="content-row mt-4">
            <div class="icon-container">
              <div class="icon-placeholder">
                <img src="/icons/svg-4.svg" alt="Home">
              </div>
            </div>
            <div class="text-container">
              <h2 class="title_head">Time-Sensitive Orders for Valuable Items</h2>
              <p>Customers ordering expensive items with expedited shipping for quick delivery.</p>
            </div>
          </div>
          <div class="content-row mt-4">
            <div class="icon-container">
              <div class="icon-placeholder">
                <img src="/icons/svg-5.svg" alt="Home">
              </div>
            </div>
            <div class="text-container">
              <h2 class="title_head">Reluctance to Visit the Store</h2>
              <p>Customer prefers contactless options or declines store visit.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
    <b-modal ref="customersList" size="lg">
      <div slot="modal-header">
        <h5>Customers List</h5>
        <br>
        <p>We've identified a list of customers whose orders share the same credit card number. This could be a sign of
          fraudulent activity, where someone might be using the same stolen card information for multiple purchases.</p>
      </div>
      <div class=" text-left px-3 text-medium">
        <div class="border-top-0 rounded-lg overflow-hidden">
          <div class="customer-grid">
            <!-- foarch -->
            <!-- add key -->
            <!-- index -->
            <div v-for="(customer, index) in customers" :key="`customer-${customer.id}`" class="customer-card">
              <h4>Customer {{ index + 1 }}</h4>
              <p><label>Name:</label> {{ customer.first_name }} {{ customer.last_name }}</p>
              <p><label>Email:</label> {{ customer.email }}</p>
              <p><label>Phone:</label> {{ customer.telephone }}</p>
            </div>

          </div>
          <!-- FINISH MOBILE -->
        </div>
      </div>

      <div slot="modal-footer">
        <button @click="() => $refs.customersList.hide()" class="btn btn-action text-medium px-3">Cancel</button>
      </div>
    </b-modal>
  </div>

</template>
<script>
  import OrderService from '@/api-services/order.service';

export default {
  name: 'prepareOrderEvaluation',
  props: ['order', 'parcelType'],

  data() {
    return {
      isShippingSlipPrint: false,
      isPrinting: false,
      isFingerPrintUsed: false,
      customers: {},
      fingerPrintChecked: false,
    };
  },
  mounted() {
    this.checkFingerPrint();
  },
  computed: {
    columns() {
      return [
        { field: 'first_name', label: 'First Name' },
        { field: 'last_name', label: 'Last Name' },
        { field: 'telephone', label: 'TELEPHONE' },
        { field: 'email', label: 'Email' },
      ];
    },
    businessDetails() {
      return this.$store.state.businessDetails;
    },
  },
  methods: {
    showCustomersList() {
      this.$refs.customersList.show();

    },
    getBadgeClass(order) {
      return order.total > 1000 ? 'badge-fail' : 'badge-pass';
    },
    async checkFingerPrint()
    {
      if(this.order.payment_type == 'Credit Card' || this.order.payment_type == 'Auth Only')
      {
        let res = await OrderService.checkFingerPrintStatus({ customer_id: this.order.customer_id });
        if(res.data.customers)
        {
          this.isFingerPrintUsed = true;
          this.customers = res.data.customers;
        }
        this.fingerPrintChecked = true;
      }
    }
  },
};

</script>
<style lang="scss" scoped>
.btn-cust{
  height: 28px;
    font-size: 13px;
    padding: 0px 13px;
    background-color: #F1F5F9;
    font-size: 14px;
      font-weight: bold;
}
.content-row {
  display: flex;
  align-items: flex-start;
  /* Align items to the top */
  gap: 10px;
  /* Spacing between icon and text */
}

.icon-container {
  flex-shrink: 0;
  /* Prevent the icon from shrinking */
}

.text-container {
  display: flex;
  flex-direction: column;
}

p {
  margin: 0;
}



.badge-fail {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 28px;
  background-color: #FEF2F2;
  color: #EF4444;
  padding: 2px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: bold;
  margin-left: auto;
}

.badge-pass {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 28px;
  background-color: #ECFDF5;
  color: #059669;
  padding: 2px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: bold;
  margin-left: auto;
}
.badge-risk {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 205px;
  height: 28px;
  background-color: #F1F5F9;
  color: #475569;
  padding: 2px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: bold;
  margin-left: auto;
}
.dot {
  height: 8px;
  width: 8px;
  background-color: #D97706;
  /* Dot color */
  border-radius: 50%;
  display: inline-block;
  margin-right: 0.5rem;
  /* Spacing between dot and text */
}
.badge-warning {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 95px;
  height: 28px;
  background-color: #FFF8DB;
  color: #D97706;
  padding: 2px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: bold;
  margin-left: auto;
}

.badge-icon {
  margin-right: 4px;
  /* Space between icon and text */
}

.title_head {
  font-size: 18px;
  font-weight: 500;
  color: #000000;

}

.card-custom {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 10px;
  position: relative;
}

.icon-badge {
  position: absolute;
  width: 22px;
  height: 22px;
  background: #DC2626;
  border-radius: 3000px;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-badge svg {
  width: 10px;
  height: 10px;
}

.dotted-line {
  width: 100%;
  height: 0;
  border-top: 2px dashed #D9D9D9;
  margin: 20px 0;
}
.customer-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 20px;
}

.customer-card {
  border: 1px solid #ccc;
  background-color: #F1F5F9;
  border-radius: 5px;
  padding: 15px;
  flex-basis: calc(50% - 40px);
  /* Assuming 20px padding */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px;
  max-width: calc(50% - 40px);
}

.customer-card h3 {
  padding-bottom: 5px;
  margin-bottom: 10px;
}

.customer-card p {
  margin: 5px 0;
  line-height: 1.5;
}

.customer-card label {
  font-weight: bold;
}

/* Responsive behavior */
@media (max-width: 600px) {
  .customer-card {
    flex-basis: calc(100% - 40px);
    /* Full width on smaller screens */
    max-width: calc(100% - 40px);
  }
}
</style>
