<template>
  <div v-if="$ezHasNoPermission('view_invoices') || isTruevalue">
    <NoPermission />
  </div>
  <div v-else class="bg-white">
    <div class="settings-header flex-row align-items-center justify-content-between">
      <h1>Invoices</h1>
    </div>
    <div v-if="!loading && invoices && invoices.length > 0" class="table-scroll">
      <table class="table">
        <thead>
          <tr>
            <th class="px-4" scope="col">Invoice #</th>
            <th class="px-4" scope="col">Date Generated</th>
            <th class="px-4" scope="col">View</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in invoices" :key="invoice.id">
            <td class="px-4">{{ invoice.id }}</td>
            <td class="px-4">{{ formatDate(invoice.date) }}</td>
            <td class="px-4">
              <a :href="generateInvoiceLink(invoice.id, invoice.hash_code)" target="_blank">View Invoice</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="loading" class="loader-wrapper">
      <img src="/icons/loader.gif" class="loader" alt="Loading..." />
    </div>
    <div v-else class="text-center font-weight-bold mt-4">
      <h3>No Invoices Found</h3>
    </div>
    
  </div>
</template>

<script>
import AdminService from '@/api-services/admin.service';
import NoPermission from "@/pages/admin/settings/no-permission";
import moment from 'moment';

export default {
  name: "SubAccounts",
  components: {
    NoPermission
  },
  data() {
    return {
      loading: true,
      invoices: []
    };
  },
  mounted() {
    if (this.$ezHasNoPermission("view_invoices")) return;
      this.loadInvoices();
  },
  computed: {
    isTruevalue() {
      return this.$root.$children[0].isTruevalue;
    }
  },
  methods: {
    async loadInvoices() {
      AdminService.getInvoices().then(res => {
        this.invoices = res.data.invoices;
        this.loading = false;
      });
    },
    formatDate(value) {
      return value ? moment(String(value)).format('MMM Do, YYYY') : '';
    },
    generateInvoiceLink(id, hash) {
      return "https://ezadtv.com/live/invoice/" + id + "?h=" + hash;
    }
  }
};
</script>
