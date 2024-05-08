<template>
  <div>
    <a href="#" @click.prevent="skipToContent" class="skip-link">Skip to content</a>
    <div class="sticky-top">
      <MainHeader ref="mainHeader" @toggleMobileMenu="toggleMobileMenu" :showMobileMenu="showMobileMenu" id="mainHeader"/>
      <MainNav v-if="!hideMainNav" @toggleMobileMenu="toggleMobileMenu" :showMobileMenu="showMobileMenu" ref="mainNav" />
      <checkout-nav v-if="showCartNav" ref="mainNavCheckout" />
    </div>
    <main ref="mainContent">
      <slot />
    </main>
    <MainFooter :business="business" v-if="$store.state.settings.businessName !== 'Gerretsen Building Supply'" />
  </div>
</template>

<script>

export default {
  name: "DefaultLayout",
  data() {
    return {
      showMobileMenu: false,
      windowWidth: window.innerWidth
    };
  },
  computed: {
    business() {
      return this.$store.state.businessDetails;
    },
    cartTotals(){
      return this.$store.state.cartTotals;
    },
    cartStep(){
      return this.$store.state.cartStep;
    },
    showCartNav(){
      if (this.$route.path === '/cart' && this.cartTotals > 0) {
        return true;
      }
      return false;
    },
    hideMainNav(){
      if (this.$route.path === '/cart' && this.cartStep > 1 && this.cartTotals > 0 && this.windowWidth > 992) {
        return true;
      }
      return false;
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
  },
  methods: {
    skipToContent() {
      this.$refs.mainContent.setAttribute('tabindex', '-1');
      this.$refs.mainContent.focus();
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
      document.body.classList.toggle('overflow-hidden');
    },
    hideMobileMenu() {
      this.showMobileMenu = false;
      document.body.classList.remove('overflow-hidden');
    }
  },
  watch: {
    '$route'() {
      this.hideMobileMenu();
    }
  }
};
</script>

<style>
  .skip-link {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #000;
    color: #fff;
    padding: 5px;
    z-index: 100;
  }

  .skip-link:focus {
    top: 0;
  }

  .skip-link:not(:focus) {
    clip: rect(1px, 1px, 1px, 1px);
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
  }
</style>