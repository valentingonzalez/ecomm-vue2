<template>
  <div v-if="!loading">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Permissions</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in subAccounts" :key="item.name + 'subAccounts' + index">
          <td class="sub-account-name">{{ item.name }}</td>
          <td class="sub-account-permissions">{{ item.permissions }}</td>
          <td class="d-flex flex-column flex-sm-row justify-content-between">
            <router-link :to="`/admin/settings/sub-accounts/edit/${item.slug}`">Edit</router-link>
            <a href="#" @click.prevent="deleteSubAccount(item.slug)">Delete</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="loader-wrapper">
    <img src="/icons/loader.gif" class="loader" alt="Loading..." />
  </div>
</template>

<script>
  import EZAxios from '@/ezaxios';
  import AdminService from '@/api-services/admin.service';

  export default {
    name: "SubAccountsList",
    data() {
      return {
        subAccounts: [],
        originSubAccounts: {
          master: [],
          subAccounts: []
        },
        permissions: {
          mainSettings: [],
          websiteSettings: [],
          notificationSettings: []
        },
        loading: false
      };
    },
    mounted() {
      if (this.$ezHasNoPermission("manage_sub_accounts")) return;
      this.loadList();
    },
    methods: {
      async loadList() {
        let subAccountsForTable = [];
        this.subAccounts = [];
        this.loading = true;
        const responseSubAccounts = await EZAxios.get("sub-accounts");
        const responsePermissions = await EZAxios.get("sub-accounts/permissions");

        this.loading = false;
        this.originSubAccounts = { subAccounts: responseSubAccounts.data["sub-accounts"] ? responseSubAccounts.data["sub-accounts"] : [] };
        const permissionMainSettings = responsePermissions.data.data.main_settings;
        const permissionWebsiteSettings = responsePermissions.data.data.website_settings;
        const permissionNotificationSettings = responsePermissions.data.data.notification_settings;

        this.originSubAccounts.subAccounts.forEach(item => {
          const slug = item.slug;
          const name = `${item.first_name} ${item.last_name}`;
          const allPermissions = {
            ...permissionMainSettings,
            ...permissionWebsiteSettings,
            ...permissionNotificationSettings
          };
          const permissionNames = [];

          if (item.permissions && Array.isArray(item.permissions))
            item.permissions.forEach(permission => permissionNames.push(allPermissions[permission]));

          const permissions = permissionNames.filter(e => e).join(", ");

          subAccountsForTable.push({
            slug,
            name,
            permissions
          });
        });

        this.subAccounts = subAccountsForTable;

        this.permissions = {
          mainSettings: permissionMainSettings ? permissionMainSettings : [],
          websiteSettings: permissionWebsiteSettings ? permissionWebsiteSettings : [],
          notificationSettings: permissionNotificationSettings ? permissionNotificationSettings : []
        };
      },
      async deleteSubAccount(slug) {

      this.$swal({
        title: 'Delete Sub Account',
        text: "Are you sure that you want to delete the SubAccount?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then(async result => {
        if (result.value) {
          await AdminService.deleteSubAccount({ slug }).then(
            res => {
              if (res.data.status === "success")
                this.subAccounts = [...this.subAccounts.filter(item => item.slug !== slug)];
              else
                this.$swal('Something went wrong while deleting', '', 'error');
            },
            res => {
              if (res.response.data.status === "error") {
                this.$swal(res.response.data.message, '', 'error');
              } else {
                this.$swal('Something went wrong while deleting sub account.', '', 'error');
              }
            }
          );
        }
      });
    },
    }
  };
</script>


<style scoped lang="scss">
table {
  th {
    font-size: 14px;
    font-weight: 700;
    line-height: 17px;
  }
  td {
    &.sub-account-name {
      width: 25%;
      color: var(--primary);
      font-size: 14px;
      font-weight: 700;
      line-height: 17px;
    }

    &.sub-account-permissions {
      width: 60%;
      color: var(--text);
      font-size: 13px;
      font-weight: 400;
      line-height: 16px;
      white-space: pre-wrap;
    }

    &.sub-account-actions {
      width: 15%;
      color: var(--primary);
      font-size: 14px;
      font-weight: 400;
      line-height: 17px;
    }
  }
}

.table-scroll {
  max-height: 500px;
  overflow-y: auto;
}

label {
  height: 17px;
  color: var(--text);
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
}


@media (max-width: 992px) {
  .table-scroll {
    max-width: 100%;
    overflow-x: auto;
  }


  label {
    padding-top: 0.5rem;
  }
}

</style>
