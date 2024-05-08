<template>
  <div v-if="$ezHasNoPermission('manage_orders') && !showRentals">
    <no-permission page="Orders"></no-permission>
  </div>
  <div v-else>
    <new-update></new-update>
    <div class="container d-flex mt-3" :style="isMobileWidth ? 'padding-right: 20px !important;' : ''">
      <div class="col-1 navigation-column" :class="{ 'nav-button-hidden': pageWidth >= 540 }">
        <button class="navigation-button previous" ref="prevButton" @click="navigateToPrevious()">&lt;</button>
      </div>
      <div class="col-10 px-0">
        <div class="navigation-links" ref="navContainer">
          <router-link class="tab" :to="{name: 'admin-orders-list'}"><span>Orders</span></router-link>
          <router-link class="tab ml-3" :to="{name: 'admin-orders-reconciliation'}"><span>Reconciliation</span></router-link>
          <router-link class="tab ml-3" :to="{name: 'admin-orders-shipping-labels'}"><span>Shipping Labels</span></router-link>
          <router-link class="tab ml-3" :to="{name: 'admin-orders-rentals'}"><span>Rentals</span></router-link>
          <router-link v-if="isRecurringOrdersEnabled" class="tab ml-3" :to="{name: 'admin-orders-recurring'}"><span>Recurring</span></router-link>
        </div>
      </div>
      <div v-if="pageWidth < 540" class="col-1 navigation-column">
        <button class="navigation-button next" ref="nextButton" @click="navigateToNext()">&gt;</button>
      </div>
    </div>
    <router-view ref="routerView"></router-view>
  </div>
</template>

<script>
import NoPermission from "../settings/no-permission";

export default {
  name: 'Orders',
  data() {
    return {
      loading: false,
      pageWidth: 0
    };
  },
  components: {
    NoPermission
  },
  computed: {  
    isMobileWidth() {
      return this.pageWidth < 769;
    },
    settings() {
      return this.$store.state.settings;
    },
    isRecurringOrdersEnabled() {
      return this.$store.state.businessDetails && typeof this.$store.state.businessDetails.enable_recurring_orders != "undefined" ? (this.$store.state.businessDetails.enable_recurring_orders * 1) : 0;        
    },
    isBasicPlan() {
      return this.$store.state.isBasicPlan;
    },
    showRentals(){
      if(this.isBasicPlan && this.$store.state.businessDetails && typeof this.$store.state.businessDetails.rentals_tab != 'undefined') {
        let showRentals = this.$store.state.businessDetails.rentals_tab;
        return (showRentals === '1' || showRentals === 1);
      }
      return false;
    },
  },
  mounted() {
    this.pageWidth = window.innerWidth;
    window.addEventListener('resize', this.handleResize);
    if(!this.$ezHasNoPermission('manage_orders')) {
      this.$refs.prevButton.style.opacity = 0.3;
      this.$refs.prevButton.style.cursor = 'not-allowed';
    }
  },
  methods: {
    saveAccount() {
      this.$refs.routerView.saveAccount();
    },
    handleResize() {
      this.pageWidth = window.innerWidth;
    },
    navigateToPrevious() {
      this.$refs.nextButton.style.opacity = 1;
      this.$refs.nextButton.style.cursor = 'pointer';
      const container = this.$refs.navContainer;
      container.scrollLeft -= container.offsetWidth;
      this.$refs.prevButton.style.opacity = 0.3;
      this.$refs.prevButton.style.cursor = 'not-allowed';
    },
    navigateToNext() {
      this.$refs.prevButton.style.opacity = 1;
      this.$refs.prevButton.style.cursor = 'pointer';
      const container = this.$refs.navContainer;
      container.scrollLeft += container.offsetWidth;
      this.$refs.nextButton.style.opacity = 0.3;
      this.$refs.nextButton.style.cursor = 'not-allowed';
    }
  }
};
</script>

<style scoped lang="scss">
  .tab {
    scroll-snap-stop: always;
    white-space: nowrap;
    color: #334155;
    padding: 6px 10px;
    background: #FFF;
    box-shadow: 0px 1px 2px rgba(0,0,0,.05);
    border-radius: 4px;
    position: relative;
    span {
      position: relative;
      z-index: 2;
    }
    &.router-link-exact-active,
    &.router-link-active {
      color: var(--primary);
      background: var(--primary);
      &::after {
        content: '';
        position: absolute;
        background: rgba(255,255,255,.9);
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .container {
    display: flex;
  }

  .navigation-column {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
  }

  .navigation-links {
    display: flex;
  }

  .navigation-button {
    position: absolute;
    top: 80%;
    transform: translateY(-50%);
    height: 40px;
    color: black;
    border: none;
    outline: none;
    font-size: 24px;
    cursor: pointer;
    background: white;
  }

  .nav-button-hidden {
    display: none;
  }

  .previous {
    left: 0;
    top: 18px;
  }

  .next {
    right: 0;
    top: 19px
  }

  @media (max-width: 540px) {
    .navigation-links {
      overflow: hidden;
    }

    .navigation-column {
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
  }
</style>