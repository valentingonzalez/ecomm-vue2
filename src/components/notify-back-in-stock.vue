<template>
  <div>
    <div class="row pl-4">
      <div class="badge bg-success p-2 text-white text-medium cursor-pointer" @click.prevent="toggleBackInStockNotifyModal">Notify Me When It's Back</div>
    </div>
    <b-modal v-model="showCustomerBackInStockNotifyModal" title="Receive a notification when this product is Back in Stock" size="md" no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="my-1 p-1">
        <span class="font-weight-bold">You will be notified via email at:</span>
        <br>
        <span class="font-italic">{{activeUser && activeUser.data.customer.email}}</span>
      </div>
      <div slot="modal-footer">
        <button @click.prevent="toggleBackInStockNotifyModal" class="btn btn-action px-3">Close</button>
        <button @click.prevent="saveNotificationData('customer')" class="btn btn-primary text-medium px-3 ml-2">
          Get Notified
        </button>
      </div>
    </b-modal>
    <b-modal v-model="showGuestBackInStockNotifyModal" title="Receive a notification when this product is Back in Stock" size="md" no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="my-1 p-1">
        <div class="row">
          <div class="col-12">
            <label for="email">Please enter your email address:</label>
            <input v-model="guestEmail" id="email" type="email" class="email-input form-control" placeholder="Enter Email">
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <button @click.prevent="toggleBackInStockNotifyModal" class="btn btn-action px-3">Close</button>
        <button @click.prevent="saveNotificationData('guest')" class="btn btn-primary text-medium px-3 ml-2">
          Get Notified
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import ProductApiService from '@/api-services/product.service';

export default {
  name: 'NotifyBackInStock',
  props: {
    productId: {
      type: Number,
      default: null
    },
    productSku: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      guestEmail: '',
      showCustomerBackInStockNotifyModal: false,
      showGuestBackInStockNotifyModal: false,
    };
  },
  computed: {
    activeUser() {
      return this.$store.state.activeUser;
    },
    deviceId() {
      return this.$store.state.device_id;
    }
  },
  methods: {
    toggleBackInStockNotifyModal() {
      this.clear();
      if (this.activeUser == null) {
        this.showGuestBackInStockNotifyModal = !this.showGuestBackInStockNotifyModal;
        return;
      }
      if (typeof this.activeUser.data.id == 'number') {
        this.showCustomerBackInStockNotifyModal = !this.showCustomerBackInStockNotifyModal;
      }
    },
    async saveNotificationData(customerMethod) {
      const data = {
        product_id: this.productId,
        sku: this.productSku,
        device_id: this.deviceId,
        customer_id: 0 // start as 0, will change if customerMethod is selected
      };

      // check customer
      if (customerMethod == 'customer') {
        data.customer_id = this.activeUser.data.id;
        data.customer_method = customerMethod;
      }

      // check guest
      if (customerMethod == 'guest') {
        if (!this.isValidEmail(this.guestEmail)) {
          this.$swal('Error', 'Please enter a correct email address', 'error');
          return;
        }
        data.guest_email = this.guestEmail;
      }

      await ProductApiService.saveItemBackInStockNotificationDetails(data).then(res => {
        this.showCustomerBackInStockNotifyModal = false; 
        this.showGuestBackInStockNotifyModal = false; 
        if (res.data.response == 'not valid') {
          this.$swal('Error', 'Your email address is not valid', 'error');
        }
        if (res.data.response == 'existent') {
          this.$swal('Error', 'You already have a notification set up for this product', 'error');
        }
        if (res.data.response == 'success') {
          let selectedEmail = this.guestEmail.length ? this.guestEmail : this.activeUser.data.customer.email;
          let successMsg = `Your notification for ${selectedEmail} has been successfully scheduled.`;
          this.$swal('Success', successMsg, 'success');
        }
      });
    },
    clear() {
      this.guestEmail = '';
    },
    isValidEmail(email) {
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        String(email).toLowerCase()
      );
    }
  }
};
</script>
