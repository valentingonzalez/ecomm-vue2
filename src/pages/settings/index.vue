<template>
  <div class="container mt-3">
    <div class="row bg-white border-gray border no-gutters">
      <div class="col-md-3 border-gray border-right" id="account_left_nav">
        <b-nav vertical class="pt-md-3 pb-3 pb-md-5 pl-md-4">
          <b-nav-text>
            <router-link :to="{ name: 'settings-account' }">Account Information</router-link>
          </b-nav-text>
          <b-nav-text>
            <router-link :to="{ name: 'settings-orders' }">My Orders</router-link>
          </b-nav-text>
          <b-nav-text v-if="isRecurringOrdersEnabled">
            <router-link :to="{ name: 'settings-recurring-orders' }">Recurring</router-link>
          </b-nav-text>
          <b-nav-text v-if="$store.state.businessDetails.save_cart">
            <router-link :to="{ name: 'settings-savedcarts' }">Saved Carts</router-link>
          </b-nav-text>
          <!-- <b-nav-text>
            <router-link :to="{ name: 'settings-payment' }">Payment methods</router-link>
          </b-nav-text> -->
          <b-nav-text class="cursor-pointer">
            <a @click="logout" href="#">Logout</a>
          </b-nav-text>
        </b-nav>
      </div>
      <div class="col-md-9 pt-0">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import AuthApiService from '@/api-services/auth.service';
import AuthController from '@/controllers/auth.controller';

export default {
  name: 'SettingsParentPage',
  mounted() {
    this.$ezSetTitle('My Account');
  },
  methods: {
     logout() {
          AuthApiService.logout()
          .then(res => {
            if(res.data.status == "success") {
              this.$swal({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 3000,
                type: 'success',
                title: 'signed out'
              });
            } else {
              this.$swal(res.data.message, '', 'error');
            }
          })
          .catch(err => {
            console.log(err);
            this.$swal('Unknown error while logging out', '', 'error');
          });
          AuthController.logout();
          this.$store.dispatch('logout');
          this.$router.push({ name: 'index' }).catch(err => console.log(err));
      },
  },
  computed: {
    settings() {
      return this.$store.state.settings;
    },
    isRecurringOrdersEnabled() {
      return this.$store.state.businessDetails && typeof this.$store.state.businessDetails.enable_recurring_orders != "undefined" ? (this.$store.state.businessDetails.enable_recurring_orders * 1) : 0;        
    },
  }
};
</script>

<style lang="scss">
  @media (max-width: 767px) {
    .bg-white {
      background: none !important;
    }
    [class*=border] {
      border: none !important;
    }
  }

  @media print {
    #account_left_nav {
      display: none !important;
    }
  }
</style>
