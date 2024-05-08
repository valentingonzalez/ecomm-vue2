<template>
  <div class="main position-relative">
    <h5 class="px-4 px-lg-5 py-3 border-gray border-bottom font-weight-bold mb-4">
      Account Information
    </h5>
    <div class="px-4 px-lg-5">
      <!-- can be moved later -->
      <div class="d-flex align-items-end justify-content-between border-bottom border-gray my-2 pt-2 pb-3" v-if="user.ar_account_id !== null && userAccountInfo.showBalance">
        <div>
          <div class="font-weight-bold">Account Balance</div>
          <div :class="{'blurry-text':!confirmed}">{{ user.ar_account_balance ? user.ar_account_balance : 0 }}</div>
        </div>
      </div>
      <div class="d-flex align-items-end justify-content-between border-bottom border-gray my-2 pt-2 pb-3">
        <div>
          <div class="font-weight-bold">Name</div>
          <div :class="{'blurry-text':!confirmed}">{{ user.first_name }} {{ user.last_name }}</div>
        </div>
        <button type="button" class="btn btn-outline-primary" @click="edit('name')">Edit</button>
      </div>
      <div class="d-flex align-items-end justify-content-between border-bottom border-gray my-2 pt-2 pb-3">
        <div>
          <div class="font-weight-bold">Email Address</div>
          <div :class="{'blurry-text':!confirmed}">{{ user.email }}</div>
        </div>
        <button type="button" class="btn btn-outline-primary" @click="edit('email')">Edit</button>
      </div>
      <div class="d-flex align-items-end justify-content-between border-bottom border-gray my-2 pt-2 pb-3">
        <div>
          <div class="font-weight-bold">Password</div>
          <div>
            You can change the password for accessing your account
          </div>
        </div>
        <button type="button" class="btn btn-outline-primary" @click="edit('password')">Edit</button>
      </div>
      <password-confirm ref="passwordConfirmModal" @confirm="passwordConfirm" />

      <div v-if="$store.state.hasTrueValueRewards && user.custom_info.tvr_number"
           class="d-flex align-items-end justify-content-between border-bottom border-gray my-2 pt-2 pb-3">
        <div>
          <div class="font-weight-bold">True Value Rewards #</div>
          <div>
            {{ user.custom_info.tvr_number }}
          </div>
        </div>
      </div>
    </div>
    <div class="m-5"></div>
    <edit-name ref="nameModal" :first_name="user.first_name" :last_name="user.last_name" @changed="nameUpdated" />
    <change-password ref="passwordModal" @changed="passwordUpdated" />
    <edit-email ref="emailModal" :email="user.email" @changed="emailUpdated" />
  </div>
</template>

<script>
import PasswordConfirm from "@/components/modals/password-confirm.vue";
import EditName from '@/components/modals/edit-name.vue';
import ChangePassword from '@/components/modals/change-password.vue';
import EditEmail from '@/components/modals/edit-email.vue';

export default {
  name: 'SettingsAccountPage',
  components: {
    PasswordConfirm,
    EditName,
    ChangePassword,
    EditEmail
  },
  data() {
    return {
      accountForm: {},
      confirmed: true
    };
  },
  mounted() {
    this.$ezSetTitle('My Account');
  },
  computed: {
    user() {
      return this.$store.state.activeUser.data.customer;
    },
    userAccountInfo() {
      const info = JSON.parse(this.$store.state.businessDetails.account_field_info || "{}");
      return info;
    }
  },
  methods: {
    edit(type) {
      if(this.confirmed) {
        switch (type) {
          case 'name': {
            this.$refs.nameModal.showModal();
            break;
          }
          case 'email': {
            this.$refs.emailModal.showModal();
            break;
          }
          case 'password': {
            this.$refs.passwordModal.showModal();
            break;
          }
        }
      } else {
        this.$refs.passwordConfirmModal.showModal();
      }
    },
    nameUpdated(obj) {
      this.user.first_name = obj.firstName;
      this.user.last_name = obj.lastName;
    },
    emailUpdated(email) {
      this.user.email = email;
    },
    passwordUpdated() {

    },
    passwordConfirm(value) {
      if(value) {
        this.confirmed = true;
      }
    }
  }
};
</script>

<style lang="scss">
  .account {
    border-bottom: 1px solid #eaeaeb;
    margin-top: 15px;
    margin-bottom: 15px;

    &__text {
      margin-right: auto;

      &--title {
        font-weight: 700;
      }

      &--value {
        margin-top: 4px;
        margin-bottom: 5px;
      }
    }

    &__button {
      margin-left: auto;

      .btn {
        border: 2px solid var(--primary);
        color: var(--primary);
      }
    }
  }

  .blurry-text {
    color: transparent;
    text-shadow: 0 0 4px rgba(0,0,0,0.6);
  }
</style>

