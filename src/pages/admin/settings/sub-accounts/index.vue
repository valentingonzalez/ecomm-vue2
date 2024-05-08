<template>
  <div v-if="$ezHasNoPermission('manage_sub_accounts')">
    <no-permission-truevalue page="Sub Accounts"></no-permission-truevalue>
  </div>
  <div class="bg-white h-100" v-else>
    <div class="settings-header flex-row align-items-center justify-content-between">
      <div v-if="page == 'edit' || page == 'new'">
        <router-link to="/admin/settings/sub-accounts" class="d-flex align-items-center">
          <svg class="mr-2" width="8" height="12" xmlns="http://www.w3.org/2000/svg"><path d="M2.38 6.003l4.49-4.49a.65.65 0 00.191-.464.651.651 0 00-.191-.464L6.476.192A.651.651 0 006.012 0a.651.651 0 00-.464.192L.203 5.537a.651.651 0 00-.191.465c0 .177.067.342.191.466l5.34 5.34a.651.651 0 00.464.192c.176 0 .341-.068.465-.192l.393-.393a.657.657 0 000-.928L2.38 6.003z" fill="#000" fill-rule="nonzero"/></svg>
          Sub Accounts
        </router-link>
        <h1>{{page == 'edit' ? 'Edit' : 'New'}} Account</h1>
      </div>
      <h1 v-else>Sub Accounts</h1>
      <div>
        <button :disabled="loading" v-if="page == 'edit' || page == 'new'" class="btn btn-primary" @click="saveAccount">Save</button>
        <router-link v-else class="btn btn-primary" to="/admin/settings/sub-accounts/new">Create New Account</router-link>
      </div>
    </div>
    <div class="settings-body">
      <router-view ref="routerView"></router-view>
    </div>
  </div>
</template>

<script>
import NoPermissionTruevalue from '../no-permission-truevalue';

export default {
  name: "SubAccounts",
  data() {
    return {
      loading: false
    };
  },
  computed: {
    page() {
      return  this.$route.name == 'admin-settings-sub-accounts-edit' ? 'edit' :
              this.$route.name == 'admin-settings-sub-accounts-new' ? 'new' : '';
    },
  },
  components: {
    NoPermissionTruevalue
  },
  methods: {
    saveAccount() {
      this.$refs.routerView.saveAccount();
    }
  }
};
</script>
