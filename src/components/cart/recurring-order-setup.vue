<template>
  <div>
    <div class="d-flex justify-content-between align-items-start align-items-md-center flex-column flex-md-row">
      <div class="d-flex align-items-start">
        <div class="icon bg-primary p-2 d-flex align-items-center justify-content-center rounded mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M23.52 12.5C23.52 18.8521 18.3521 24.02 12 24.02C5.6479 24.02 0.47998 18.8521 0.47998 12.5C0.47998 12.1021 0.80206 11.78 1.19998 11.78C1.5979 11.78 1.91998 12.1021 1.91998 12.5C1.91998 18.0582 6.44182 22.58 12 22.58C17.5581 22.58 22.08 18.0582 22.08 12.5C22.08 6.94184 17.5581 2.42 12 2.42C9.32086 2.42 6.83374 3.46136 4.9627 5.3H7.67998C8.0779 5.3 8.39998 5.62208 8.39998 6.02C8.39998 6.41792 8.0779 6.74 7.67998 6.74H3.35998C2.96206 6.74 2.63998 6.41792 2.63998 6.02V1.7C2.63998 1.30208 2.96206 0.979996 3.35998 0.979996C3.7579 0.979996 4.07998 1.30208 4.07998 1.7V4.15616C6.20422 2.12864 8.99542 0.979996 12 0.979996C18.3521 0.979996 23.52 6.14792 23.52 12.5ZM18.48 9.62V16.1C18.48 16.4002 18.2937 16.6688 18.0132 16.7744L12.2532 18.9344C12.1716 18.9646 12.0857 18.98 12 18.98C11.9143 18.98 11.8284 18.9646 11.7468 18.9344L5.98678 16.7744C5.70622 16.6688 5.51998 16.4002 5.51998 16.1V9.62C5.51998 9.31976 5.70622 9.0512 5.98678 8.9456L11.7468 6.7856C11.91 6.72512 12.09 6.72512 12.2529 6.7856L18.0129 8.9456C18.2937 9.0512 18.48 9.31976 18.48 9.62ZM8.2903 9.62L12 11.0108L15.7097 9.62L12 8.2292L8.2903 9.62ZM6.95998 15.6008L11.28 17.2208V12.2792L6.95998 10.6592V15.6008ZM17.04 15.6008V10.6592L12.72 12.2792V17.2208L17.04 15.6008Z" fill="white"/>
          </svg>
        </div>
        <div class="d-flex">
          <label class="m-0" style="line-height: 20px;">
            <strong class="d-flex">Recurring Ordering</strong>
            Re Order this cart automatically over time on a schedule that you define!
          </label>
        </div> 
      </div>
      <div class="d-flex">
        <div class="custom-control custom-switch mt-2 pl-3 pl-md-4 ml-1 ml-md-0">
          <input id="recurring-orders" type="checkbox" v-model="isrecurringOrderSet" class="custom-control-input" @change="toggleRecurringOrder">
          <label class="custom-control-label text-capitalize ml-3" for="recurring-orders">{{isrecurringOrderSet ? 'Deactivate' : 'Activate'}} Recurring Order</label>
        </div>
      </div>
    </div>

    <div v-if="isrecurringOrderSet" class="d-flex justify-content-start justify-content-md-end mt-3 mt-md-2" style="margin-right: 1px;">
      <button class="btn btn-sm btn-outline-secondary" @click="toggleRecurringOrder">Modify Schedule</button>
    </div>

    <b-modal v-model="showRecurringOrderModal" title="Schedule Recurring Order" size="lg" no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="my-1 p-1">
        <span>Recurring orders are purchases that repeat automatically on a set schedule.</span> <br><br>
        <span class="font-weight-bold">Select the Recurring Orders period</span>
        <div class="row mt-3">
          <div class="col-md-4">
            <label class="mb-1" for="datepicker-start">Recurring Order Start Date</label>
            <b-form-datepicker id="datepicker-start" size="sm" v-model="recurringOrder.startDate" @input="clearPreviewDates"
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" :min="tomorrow">
            </b-form-datepicker>
          </div>
          <div class="col-md-4">
            <label class="mb-1" for="datepicker-end">Recurring Order End Date</label>
            <b-form-datepicker id="datepicker-end" size="sm" v-model="recurringOrder.endDate" @input="clearPreviewDates"
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" :min="recurringOrder.startDate ? recurringOrder.startDate : tomorrow">
            </b-form-datepicker>
          </div>
        </div>
      </div>
      <div class="mb-3 mt-4 p-1">
        <span class="mb-2 font-weight-bold">Select the frequency for your Recurring Orders:</span>
        <div class="d-flex px-2 mt-1">
          <b-form-radio-group id="period-order-period" v-model="recurringOrder.period" @change="clearPreviewDates">
            <div class="row ml-1">
              <b-form-radio class="p-2" value="1">Daily</b-form-radio>
              <b-form-radio class="p-2" v-if="interval > 6" value="7">Weekly</b-form-radio>
              <b-form-radio class="p-2" v-if="interval > 29" value="30">Monthly</b-form-radio>
              <b-form-radio class="py-2 pl-2 pr-0" value="Custom">Custom Number of Days</b-form-radio>
              <div class="d-flex col-3" v-if="recurringOrder.period == 'Custom'">
                <b-form-input v-model="recurringOrder.customPeriod" @change="clearPreviewDates" size="sm"
                  :state="orderRecurrenceCustomValue" placeholder="e.g. 10" min="1" step="1">
                </b-form-input>
              </div>
            </div>
          </b-form-radio-group>
        </div>
      </div>
      <div class="my-1 p-1">
        <span class="mb-1 font-weight-bold">Your initial order will be processed today, and subsequent recurring orders will be placed according to the specified schedule.</span>
        <div v-if="!recurringOrderDates" class="d-flex flex-column align-items-start my-2">
          <button type="button" :disabled="fetchingExecutionDates" class="btn btn-sm btn-outline-primary" @click="getRecurringOrderDates">
            <span v-if="fetchingExecutionDates" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
            Preview Recurring Order Dates
          </button>
        </div>
        <div v-if="recurringOrderDates && !fetchingExecutionDates" class="my-3">
          <template v-if="recurringOrderDates.length > 0">
            <ul class="mb-2 pl-3 col-md-6" style="max-height:250px; overflow-y: scroll;">
              <li class="mb-1" v-for="(executionDate, key) in recurringOrderDates" :key="key">{{ executionDate }}</li>
            </ul>
          </template>
          <h6 v-else class="text-center font-weight-bold my-2">No Dates found for this selection criteria</h6>
        </div>
        <div v-if="fetchingExecutionDates" class="d-flex justify-content-center align-items-center my-2 w-100 h-100">
          <div class="spinner-border"></div>
        </div>
      </div>
      <div slot="modal-footer">
        <button @click="closeModal" class="btn btn-action px-3">Close</button>
        <button @click="saveData" class="btn btn-primary text-medium px-3 ml-2">
          Save Recurring Order Settings
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import OrderApiService from '@/api-services/order.service';
  import moment from "moment";

  export default {
    name: 'RecurringOrders',
    data() {
      return {
        isRecurring: false,
        showRecurringOrderModal: false,
        recurringOrder: {
          startDate: null,
          endDate: null,
          period: 7,
          customPeriod: 1
        },
        recurringOrderDates: null,
        isrecurringOrderSet: false,
        fetchingExecutionDates: false,
        validationErrorMssg: ""
      };
    },
    computed: {
      orderRecurrenceCustomValue() {
        const customValue = this.recurringOrder.customPeriod;
        if (customValue === '' || customValue === null) {
          return null;
        }
        return (isNaN(customValue) || customValue < 1 || customValue > 365) ? false : true;
      },
      tomorrow() {
        return moment().add(1, 'days').format('YYYY-MM-DD');
      },
      defaultEndDate() {
        return moment().add(90, 'days').format('YYYY-MM-DD');
      },
      interval() {
        const start = moment(this.recurringOrder.startDate, 'YYYY-MM-DD');
        const end = moment(this.recurringOrder.endDate, 'YYYY-MM-DD');
        return end.diff(start, 'days');
      }
    },
    async mounted() {
      this.recurringOrder.startDate = this.tomorrow;
      this.recurringOrder.endDate = this.defaultEndDate;
    },
    methods: {
      toggleRecurringOrder() {
        if(this.isrecurringOrderSet == false) {
          this.$emit('save-recurring-order', null);
          this.clear();
          return;
        }
        this.showRecurringOrderModal = !this.showRecurringOrderModal;
      },
      performValidation() {
        this.validationErrorMssg = "";
        if (!this.recurringOrder.startDate || !this.recurringOrder.endDate) {
          this.validationErrorMssg = 'Please select start and end date.';
          return false;
        }

        if (this.recurringOrder.period == '') {
          this.validationErrorMssg = 'Please select the execution interval.';
          return false;
        }

        if (this.recurringOrder.period == 'Custom' && !this.recurringOrder.customPeriod) {
          this.validationErrorMssg = 'Please enter the interval to proceed.';
          return false;
        }

        if (this.recurringOrder.period == 'Custom' && this.recurringOrder.customPeriod > this.interval) {
          this.validationErrorMssg = 'Your Subscription Period Length does not allow this "Custom Number of Days" value.';
          return false;
        }
        return true;
      },
      async getRecurringOrderDates() {
        this.fetchingExecutionDates = true;
        const validationStatus = this.performValidation();
        if(!validationStatus) {
          this.$swal('Error', this.validationErrorMssg, 'error');
          this.fetchingExecutionDates = false;
          return;
        }

        await OrderApiService.getRecurringOrderDates(this.recurringOrder).then(res => {
          this.fetchingExecutionDates = false;
          if(res.data.status == "success") {
            this.recurringOrderDates = res.data.execution_dates;
          } else {
            this.$swal('Error', res.data.message, 'error');
          }
        }).catch(err => {
          this.$swal('Error', 'Unable to calculate the Recurring Order dates', 'error');
          this.fetchingExecutionDates = false;
        });
      },
      saveData() {
        const validationStatus = this.performValidation();
        if(!validationStatus) {
          this.$swal('Error', this.validationErrorMssg, 'error');
          return;
        }

        this.isrecurringOrderSet = true;
        this.$emit('save-recurring-order', { ...this.recurringOrder, ...{ executionDates: this.recurringOrderDates} });
        this.showRecurringOrderModal = false;
      },
      closeModal() {
        this.isRecurring = false;
        this.isrecurringOrderSet = false;
        this.showRecurringOrderModal = false;
        this.$emit('save-recurring-order', null);
        this.clear();
      },
      clear() {
        this.recurringOrder = {
          startDate: this.tomorrow,
          endDate: this.defaultEndDate,
          period: 7,
          customPeriod: 1
        };
        this.recurringOrderDates = null;
      },
      clearPreviewDates() {
        this.$emit('save-recurring-order', null);
        this.recurringOrderDates = null;
      }
    }
  };

</script>
