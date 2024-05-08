<template>
  <b-modal size="md" class="modal-box" ref="addToOrderModal" hide-footer>
    <div slot="modal-header">
      <h5>Add Additional Item/Charges</h5>
    </div>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="type">Select A Type</label>
        <div class="d-flex">
          <b-form-radio class="mb-2 radio-special mr-2" name="type" value="charge" v-model="type" :class="{'checked' : type == 'charge'}">
            Add Charge
          </b-form-radio>
          <b-form-radio class="mb-2 radio-special" name="type" value="item" v-model="type" :class="{'checked' : type == 'item'}">
            Add Item
          </b-form-radio>
        </div>
      </div>
      <template v-if="type == 'charge'">
        <div class="form-group">
          <label for="chargeName">Name of Charge</label>
          <input id="chargeName" type="text" class="form-control" name="chargeName" placeholder="Name of Charge" v-model="charge.name" />
        </div>
        <div class="form-group">
          <label for="additionalChargeAmount">Total Additional Charge Amount</label>
          <input id="additionalChargeAmount" type="text" class="form-control" name="additionalChargeAmount" placeholder="Charge Amount" v-model="charge.amount" />
        </div>
      </template>
      <template v-else-if="type == 'item'">
        <div class="form-group">
          <label for="product">Enter Product</label>
          <search-suggestions
            ref="search"
            placeholder="Search For A Product"
            class="search-wrapper"
            :hide-brands="true"
            :hide-departments="true"
            :hide-footer="true"
            v-model="item.product" />
        </div>
        <div class="form-group">
          <label for="quantity">Quantity</label>
          <input id="quantity" type="text" class="form-control" name="quantity" placeholder="Quantity" v-model="item.quantity" />
        </div>
      </template>
      <div class="form-group pt-2" v-if="email">
        <b-form-checkbox class="mb-2" v-model="notify">
          Notify Customer At Email: <a :href="`mailto:${email}`">{{ email }}</a>
        </b-form-checkbox>
      </div>
      <div class="d-flex justify-content-between align-items-center pt-2">
        <div class="small">
          The additional charge WILL NOT be processed via credit card until you click Process Charges on the fullfilment page
        </div>
        <button type="submit" class="btn btn-primary btn-sm font-weight-bold text-nowrap ml-5 text-capitalize">Add {{ type }}</button>
      </div>
    </form>
  </b-modal>
</template>

<script>
import searchSuggestions from '@/components/search-suggestions';

export default {
  name: 'AddToOrderModal',
  props: {
    email: {
      default: null
    }
  },
  components: {
    searchSuggestions
  },
  data() {
    return {
      type: 'charge',
      notify: false,
      charge: {
        name: '',
        amount: ''
      },
      item: {
        product: null,
        quantity: null
      }
    };
  },
  methods: {
    hideModal() {
      this.$refs.addToOrderModal.hide();
    },
    showModal() {
      this.$refs.addToOrderModal.show();
    },
    onSubmit() {
      if(this.type == 'charge')
        this.$emit('onSubmit', this.type, this.charge, this.notify);
      else
        this.$emit('onSubmit', this.type, this.item, this.notify);
    }
  }
};
</script>

<style scoped lang="scss">
  label {
    font-weight: 500;
    margin-bottom: 5px;
  }
  .form-control {
    font-size: 14px;
  }
  .small {
    font-size: 12px;
  }
  .btn-sm {
    height: 40px;
    padding: 0 15px;
  }
  :deep(.custom-checkbox label.custom-control-label:before), 
  .custom-checkbox label.custom-control-label:after {
    width: 18px;
    height: 18px;
    left: -24px;
    border: 2px solid #E2E2E7;
    border-radius: 0;
    left: -24px;
  }
  :deep(.custom-checkbox > input.custom-control-input:checked ~ label.custom-control-label:after) {
    width: 18px;
    height: 18px;
    left: -24px !important;
  }
  :deep(input.custom-control-input:checked ~ .custom-control-label) {
    color: var(--text);
  }
  .radio-special {
    background: #fff;
    border: 1px solid #E6E6E6;
    box-shadow: 0 1px 1px 0 rgba(0,0,0,0.05);
    border-radius: 5px;
    display: flex;
    align-items: center;
    padding: 0;
    &.checked {
      background: var(--primary);
      border-color: var(--primary);
    }
  }
  :deep(.radio-special .custom-control-label) {
    height: 38px !important;
    padding: 0 10px 0 35px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
  :deep(.radio-special input.custom-control-input:checked ~ .custom-control-label) {
    color: #fff;
    cursor: default;
  }
  :deep(.radio-special label.custom-control-label:before) {
    left: 10px;
    width: 16px;
    height: 16px;
  }
  :deep(.radio-special .custom-control-input:checked ~ .custom-control-label::before) {
    border: 1px solid #fff;
    background: none;
  }
  :deep(.radio-special .custom-control-input:checked ~ .custom-control-label::after) {
    background: #fff;
    border: 2px solid var(--primary);
  }
  :deep(.radio-special label.custom-control-label:after) {
    left: 12px !important;
    width: 12px;
    height: 12px;
    border-width: 2px !important;
  }

  :deep(.search-bar) {
    font-size: 14px;
    input {
      font-size: 14px;
    }
  }
  @media (min-width: 576px) {
    :deep(.modal-dialog) {
      max-width: 554px;
    }
  }
</style>

