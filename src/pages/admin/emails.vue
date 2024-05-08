<template>
  <div v-if="$ezHasNoPermission('view_emails')" class="container d-flex align-items-center justify-content-center">
    <NoPermissionTruevalue />
  </div>
  <main v-else>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="tabs">
              <button :class="{ 'active': tab === 'customers' }" @click="tab = 'customers'">Customers <span class="count" v-if="customers.total">{{ customers.total }}</span></button>
              <button :class="{ 'active': tab === 'subscribers' }" @click="tab = 'subscribers'">Subscribers <span class="count" v-if="subscribers.total">{{ subscribers.total }}</span></button>
            </div>

            <div v-if="tab === 'subscribers'" class="card-body">
              <div class="card-title d-flex justify-content-between align-items-center">
                <h5 class="mb-0"><strong>Subscribers</strong></h5>

                <download-excel
                  :fetch="getAllSubscribers"
                >

                  <button type="button" class="btn btn-success btn-sm">
                    Export to Excel
                    <span v-if="fetchingSubscribers" class="spinner-border spinner-border-sm ml-2" role="status"
                          aria-hidden="true"></span>
                  </button>
                </download-excel>
              </div>
              <div class="table-scroll">
                <table class="table customerLogins">
                  <thead>
                  <tr>
                    <th scope="col">Email</th>
                    <th scope="col">Subscription Date</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-if="loadingSubscribersData">
                    <td class="spinner-wrapper mt-4">
                      <div class="spinner-border" role="status"></div>
                    </td>
                  </tr>

                  <template v-if="subscribers.data && subscribers.data.length">
                    <tr v-for="subscriber in subscribers.data" :key="'subscriber-' + subscriber.id">
                      <td>{{ subscriber.email }}</td>
                      <td>{{ subscriber.created_at }}</td>
                    </tr>
                  </template>

                  <tr v-else-if="!loadingSubscribersData">
                    <td>No subscribers found</td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="d-flex justify-content-end">
                <div v-if="subscribers.data && subscribers.last_page">
                  <v-pagination :classes="bootstrapPaginationClasses" v-model="currentSubscribersPage"
                                :page-count="subscribers.last_page" :labels="{ first: '<<', last: '>>' }"/>
                </div>
              </div>
            </div>

            <div v-else class="card-body">
              <div class="card-title d-flex justify-content-between align-items-center">
                <h5 class="mb-0"><strong>Customers</strong></h5>

                <div class="d-flex align-items-center">
                  <input type="text" name="search" v-model="customerSearch" class="form-control form-control-sm mr-2 h-36" placeholder="Search">
                  <download-excel
                    class="w-100"
                    :fetch="getAllCustomers"
                  >

                    <button type="button" class="btn btn-success btn-sm w-100">
                      Export to Excel

                      <span v-if="fetchingCustomers" class="spinner-border spinner-border-sm ml-2" role="status"
                            aria-hidden="true"></span>
                    </button>
                  </download-excel>
                </div>

              </div>
              <div class="table-scroll table-responsive">
                <table class="table customerLogins">
                  <thead>
                  <tr>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Email</th>
                    <th v-if="isMultiStore" scope="col">Store</th>
                    <th scope="col">Telephone</th>
                    <th scope="col">Receive Marketing Emails</th>
                    <th scope="col">Receive SMS</th>
                    <th scope="col">Date Added</th>
                    <th v-if="$store.state.settings.admin.showContractors" scope="col">A/R Account</th>
                    <th scope="col" v-for="col in additionalColumns" :key="'addlcol-' + col.key">
                      {{ col.header }}
                    </th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-if="loadingCustomersData">
                    <td class="spinner-wrapper mt-4 text-center" :colspan="6+ (($store.state.settings.admin.showContractors ? 1 : 0) + additionalColumns.length)">
                      <div class="spinner-border" role="status"></div>
                    </td>
                  </tr>

                  <template v-if="customers.data && customers.data.length && !loadingCustomersData">
                    <tr v-for="(customer, index) in customers.data" :key="'customer-' + index">
                      <td>{{ customer.first_name }}</td>
                      <td>{{ customer.last_name }}</td>
                      <td>{{ customer.email }}</td>
                      <td v-if="isMultiStore">{{ customer.business_name }}</td>
                      <td>{{ customer.telephone }}</td>
                      <td>{{ customer.receive_marketing == 1 ? 'yes' : 'no' }}</td>
                      <td>{{ customer.receive_sms == 1 ? 'yes' : 'no' }}</td>
                      <td>{{ customer.date_added }}</td>
                      <td v-if="$store.state.settings.admin.showContractors">
                        <a v-if="!customer.account_num" class="btn btn-secondary btn-sm py-1"
                           href="#" @click.prevent="openARList(customer)">Assign</a>
                        <span v-else>{{ customer.account_num }}</span>
                      </td>
                      <td v-for="col in additionalColumns" :key="'addlcol2-' + col.key"
                          v-html="renderCustomColumn(customer, col)"></td>
                      <td><i class="fa fa-pencil cursor-pointer" @click="showEditCustomer(index)"></i></td>
                    </tr>
                  </template>
                  <tr v-else-if="!loadingCustomersData">
                    <td>No customers found</td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="d-flex justify-content-end">
                <div v-if="customers.data && customers.last_page && !loadingCustomersData">
                  <v-pagination :classes="bootstrapPaginationClasses" v-model="currentCustomersPage"
                                :page-count="customers.last_page" :labels="{ first: '<<', last: '>>' }"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EditCustomer @updateCustomer="updateCustomerAfterUpdate" ref="editCustomer" :customer="currentCustomer" :additionalColumns="additionalColumns"/>

    <b-modal size="md" class="modal-box ar-modal" ref="assignArDialog" id="assignArDialog">
      <div slot="modal-header">
        <h5>Assign A/R Account</h5>
      </div>

      <input class="form-control mb-2" type="text" v-model="arAccountFilter"
             placeholder="Filter by account #, name, or email">

      <table class="table">
        <thead>
        <tr>
          <th>Account #</th>
          <th>Customer Name</th>
          <th>Assign</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="acct in arAccounts" :key="acct.id">
          <td>{{ acct.account_num }}</td>
          <td>{{ acct.customer_name }}</td>
          <td>
            <button type="button" class="btn btn-primary btn-sm" @click="assignARAccount(acct)">Assign</button>
          </td>
        </tr>
        </tbody>
      </table>

      <div slot="modal-footer">
        <button type="button" @click="$refs.assignArDialog.hide()" class="btn btn-outline-primary">Close</button>
      </div>
    </b-modal>
  </main>
</template>

<script>
import AdminApiService from '@/api-services/admin.service';
import NoPermissionTruevalue from './settings/no-permission-truevalue';
import Axios from 'axios';
import {debounce} from "debounce";
import AdminService from "@/api-services/admin.service";
import JsonExcel from 'vue-json-excel';
import EditCustomer from "../../components/modals/edit-customer";

export default {
  name: 'AdminEmails',
  components: {
    EditCustomer,
    NoPermissionTruevalue,
    downloadExcel: JsonExcel
  },
  data() {
    return {
      subscribers: [],
      customers: [],
      additionalColumns: [],
      loadingSubscribersData: false,
      loadingCustomersData: false,
      fetchingSubscribers: false,
      fetchingCustomers: false,
      bootstrapPaginationClasses: {
        ul: 'pagination justify-content-center',
        li: 'page-item',
        liActive: 'active',
        liDisable: 'disabled',
        button: 'page-link',
      },
      currentSubscribersPage: 1,
      currentCustomersPage: 1,
      currentCustomer: {},
      currentCustomerIndex: null,
      customerSearch: '',
      tab: 'customers',
      arAccountFilter: '',
      arAccounts: [],
      arAccountCustomer: null,
    };
  },
  computed: {
    isTruevalue() {
      return this.$root.$children[0].isTruevalue;
    },
    isMultiStore() {
      return this.$store.state.storeLocations && this.$store.state.storeLocations.length && this.$store.state.storeLocations.length > 1;
    },
  },
  async mounted() {
    if(this.$ezHasNoPermission('view_emails')) return;
    await this.getCustomers();
    await this.getSubscribers();

    window.ezcCustomersOnClick = href => {
      Axios.post(href).then(res => {
        if ( res.data.status === 'success' ) {
          // refresh current customers page
          this.getCustomers();
        } else {
          this.$swal('Error', res.data.message, 'error');
        }
      });
    };
  },
  watch: {
    currentSubscribersPage() {
      this.getSubscribers();
    },
    currentCustomersPage() {
      this.getCustomers();
    },
    customerSearch: debounce(function() {
      this.getCustomers();
    }, 500),
    arAccountFilter: debounce(function() {
      this.filterARAccounts();
    }, 500)
  },
  methods: {
    updateCustomerAfterUpdate(data) {
      this.$set(this.customers.data, this.currentCustomerIndex, data);
    },
    showEditCustomer(index) {
      this.currentCustomer = this.customers.data[index];
      this.currentCustomerIndex = index;
      setTimeout( () => {
        this.$refs.editCustomer.showModal();
      }, 500);
    },
    async openARList(customer) {
      this.arAccountCustomer = customer;
      this.arAccountFilter = customer.email;
      await this.filterARAccounts();
      this.$refs.assignArDialog.show();
    },
    async filterARAccounts() {
      const res = await AdminService.arAccountList(this.arAccountFilter);
      this.arAccounts = res.data.data;
    },
    async assignARAccount(acct) {
      if ( !this.arAccountCustomer ) {
        return;
      }

      const res = await AdminService.assignARAccount(this.arAccountCustomer.id, acct.id, true);
      if ( res.data.status === 'success' ) {
        this.$swal('Updated', 'A/R account was assigned to the customer.', 'success');
        this.$refs.assignArDialog.hide();
        this.arAccountCustomer.account_num = acct.account_num;
      } else {
        this.$swal('Error', res.data.message, 'error');
      }
    },

    async getAllSubscribers() {
      this.fetchingSubscribers = true;

      let allSubscribers = [];

      await AdminApiService.getEmailSubscribers().then(response => {
        this.fetchingSubscribers = false;
        allSubscribers = response.data.data.data;
      });

      return allSubscribers;
    },
    async getSubscribers() {
      this.loadingSubscribersData = true;

      await AdminApiService.getEmailSubscribers(this.currentSubscribersPage).then(response => {
        this.loadingSubscribersData = false;
        this.subscribers = response.data.data;
      })
        .catch(err => {
          this.loadingSubscribersData = false;
          console.log(err);
        });
    },
    async getAllCustomers() {
      this.fetchingCustomers = true;

      let allCustomers = [];

      await AdminApiService.getCustomers(null, null, "y").then(response => {
        this.fetchingCustomers = false;
        allCustomers = response.data.data.data;
      });

      return allCustomers;
    },
    async getCustomers() {
      this.loadingCustomersData = true;

      await AdminApiService.getCustomers(this.currentCustomersPage, this.customerSearch).then(response => {
        this.loadingCustomersData = false;
        this.customers = response.data.data;
        let additionalColumns = response.data.additionalColumns;
        if(!this.isTruevalue){
          // removing tvr number if not truevalue store
          let idx = additionalColumns.findIndex(x => x.key == "tvr_number" || x.header == "Tvr number");
          additionalColumns.splice(idx,1);
        }
        this.additionalColumns = additionalColumns;
      })
        .catch(err => {
          this.loadingCustomersData = false;
          console.log(err);
        });
    },
    renderCustomColumn(customer, col) {
      if ( !customer.custom_info ) {
        customer.custom_info = {};
      }
      const custom = customer.custom_info;
      if ( col.type === 'bool' ) {
        return custom[col.key] ? 'Yes' : 'No';
      } else if ( col.type === 'string' ) {
        return custom[col.key] || '';
      } else if ( col.type === 'dynamic' ) {
        return this.renderDynamicColumn(customer, col);
      } else {
        return '';
      }
    },
    renderDynamicColumn(customer, col) {
      if ( col.visibleIf ) {
        let condition_true = eval('(' + col.visibleIf + ')');
        if ( !condition_true ) {
          return '';
        }
      }

      if ( col.ifelse ) {
        let condition_true = eval('(' + col.ifelse.cond + ')');
        if ( condition_true ) {
          return this.renderWidget(customer, col.ifelse.then);
        } else {
          return this.renderWidget(customer, col.ifelse.else);
        }
      } else if ( col.content ) {
        return this.renderWidget(customer, col.content);
      }
    },
    renderWidget(customer, info) {
      if ( info.widget === 'label' ) {
        return info.text;
      } else if ( info.widget === 'button' ) {
        const href = info.href.replace('{id}', customer.id);
        return '<button type="button" class="btn btn-success btn-sm" ' +
          'onclick="window.ezcCustomersOnClick(\'' + href + '\')">' + info.text + '</button>';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tabs {
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid #eceff1;
  padding-top: 2px;

  button {
    margin-right: 8px;
    padding: 8px 16px;
    border: none;
    font-size: 18px;
    background: none;
    opacity: 0.5;

    &.active {
      color: var(--primary);
      border-bottom: 2px solid var(--primary);
      font-weight: bold;
      opacity: 1;
    }
  }
  .count {
    border: 1px solid #E2E8F0;
    border-radius: 4px;
    line-height: 16px;
    align-items: center;
    justify-content: center;
    padding: 2px 3px;
    font-size: 12px;
  }
}

@media (max-width: 992px) {
  .table-scroll {
    max-width: 100%;
    overflow-x: scroll;
  }
}
.h-36 {
  height: 36px !important;
}

</style>
