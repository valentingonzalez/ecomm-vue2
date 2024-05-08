<template>
  <main>
    <div class="container settings">
      <a href="#" class="font-weight-bold mb-2 d-inline-block d-lg-none" @click.prevent="showMenu"><i class="fa fa-bars mr-2"></i> Show Settings Menu</a>

      <div class="row small-gutters">
        <div class="col-lg-2 d-lg-block sidebar pr-lg-1" @click.prevent="hideMenu" :class="{ 'visible' : menu }">
          <div class="sidebar-sticky h-100 pb-5">
            <div v-b-toggle.website-content class="collapse-bt">Website content</div>
            <b-collapse id="website-content" visible accordion role="tabpanel">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <router-link to="/admin/settings/ai-widgets-builder" class="nav-link">AI Widget Builder <div class="badge badge-danger ml-1" >new</div><VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('manage_ai_widgets')" name="lock" /></router-link>
                </li>
                <li v-if="gmcEnabled" class="nav-item">
                  <router-link to="/admin/settings/google-merchant-center" class="nav-link">Google Merchant Center<div class="badge badge-danger ml-1" >new</div></router-link>
                </li>
                <li class="nav-item" v-if="isTruevalue">
                  <router-link to="/admin/settings/marketing" class="nav-link">Marketing <div class="badge badge-danger ml-1" >new</div></router-link>
                </li>                
                <li v-if="$store.state.businessDetails && $store.state.businessDetails.discrepancy_enabled" class="nav-item">
                  <router-link to="/admin/settings/discrepancy-report" class="nav-link">Discrepancy Report<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('admin_account')" name="lock" /></router-link>
                </li>
                <li v-if="$store.state.businessDetails && $store.state.businessDetails.paint_enabled" class="nav-item">
                  <router-link to="/admin/brand-integrator/generate" class="nav-link">
                    Brand Integrator
                  </router-link>
                </li>
                <li v-if="$store.state.businessDetails && $store.state.businessDetails.can_show_synonyms" class="nav-item">
                  <router-link to="/admin/settings/search-synonyms" class="nav-link">Search Synonyms<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('admin_account')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/special-fees" class="nav-link">
                    Special Fees
                    <VueIcon v-if="$ezHasNoPermission('manage_special_fees')" name="lock" />
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/transactional-emails" class="nav-link">Transactional Emails<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('transactional_emails')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/header-and-footer" class="nav-link">Header and Footer<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('manage_header_and_footer')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/pages" class="nav-link">
                    Custom Pages
                    <VueIcon v-if="$ezHasNoPermission('manage_custom_pages')" name="lock" />
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/widgets" class="nav-link">Landing Page<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('edit_landing_page')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/brands-settings" class="nav-link">Brands Settings<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('edit_brands_settings')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/department-mapping" class="nav-link">Department Mapping<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('edit_department_mapping')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/product-editor" class="nav-link">Product Editor<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('edit_products')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/product-suggesters" class="nav-link">Product Suggesters</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/top-banner" class="nav-link">Top Banner<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('manage_header_and_footer')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/about-us" class="nav-link">About Us<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('edit_about_us')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/locations" class="nav-link">Locations<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('edit_locations')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/dynamic-forms" class="nav-link">User Inputs<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('edit_user_inputs')" name="lock" /></router-link>
                </li>                
              </ul>
            </b-collapse>
            <div v-b-toggle.integration class="collapse-bt">General settings</div>
            <b-collapse id="integration" visible accordion role="tabpanel">
              <ul class="nav flex-column">
                <li class="nav-item" v-if="showRentalsMenu()">
                  <router-link to="/admin/settings/rental-products" class="nav-link">Rental Products<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('manage_rental_categories')" name="lock" /><div class="badge badge-danger ml-1" >new</div></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/promo-codes" class="nav-link">Promo Codes<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('manage_promo_codes')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/report" class="nav-link">Data Report<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('consultation_report')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/fulfillment-options" class="nav-link">Fulfillment Options<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('edit_fulfillment_options')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/special-order-items" class="nav-link">Special Order Items<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('edit_fulfillment_options')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/social-media-accounts" class="nav-link">Social Media Accounts<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('manage_social_media')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/analytics-conversion-pixel" class="nav-link">Analytics Conversion Pixel<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('manage_conersion_pixel')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/bank" class="nav-link">{{$store.state.businessDetails.wizard_enabled ? 'Payment Options' : 'Bank Settings'}}<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('edit_bank_settings')" name="lock" /></router-link>
                </li>
               <!--
               belbron taking this out, stores think this actually ads their A/R accounts, its head ech for now.
               -->
                <li class="nav-item" v-if="showArAccounts">
                  <router-link to="/admin/settings/ar-accounts" class="nav-link">A/R Accounts<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('manage_ar_accounts')" name="lock" /></router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/settings/sub-accounts" class="nav-link">Sub Accounts<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('manage_sub_accounts')" name="lock" /></router-link>
                </li>
                <li class="nav-item" v-if="!isTruevalue">
                  <router-link to="/admin/settings/invoices" class="nav-link">Invoices<VueIcon class="ml-2 mt-n1" v-if="$ezHasNoPermission('view_invoices')" name="lock" /></router-link>
                </li>
              </ul>
            </b-collapse>
          </div>
        </div>
        <div class="position-static col-lg-10">
          <div class="content h-100">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>

  export default {
    name: 'AdminSettings',
    data() {
      return {
        menu: false
      };
    },
    computed: {
      showArAccounts() {
        const show = ['NCWK6BGXRLK44X6H', 'jLNYdkQ91o5x78Da'];
        return show.includes(this.$store.state.settings.businessSlug);
      },
      isTruevalue() {
        return this.$root.$children[0].isTruevalue;
      },
      gmcEnabled() {
        // if(localStorage.getItem('enableGMC') && localStorage.getItem('enableGMC') === 'true') {
        //   return true;
        // }
        // return false;
        return this.$store.state.businessDetails && this.$store.state.businessDetails.gmc_enabled;
      }
    },
    async mounted() {
    },
    methods: {
      showMenu() {
        this.menu = true;
      },
      hideMenu() {
        this.menu = false;
      },
      showRentalsMenu() {
        const selectedStoreId = parseInt(localStorage.getItem('selectedStore'), 10);
        const allowedIds = [8181, 8213, 5032, 5116, 8420, 6737];
        const isAllowed = !!allowedIds.find(id => id === selectedStoreId);
        return isAllowed;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .collapse-bt {
    padding: 15px 15px 0;
    font-weight: bold;
    display: block;
    cursor: pointer;
    position: relative;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid var(--text);
      right: 20px;
      top: 50%;
      margin-top: 2px;
      transform: rotate(180deg);
      transition: transform .2s;
    }
    &.collapsed::after {
      transform: rotate(0deg);
    }
  }

  .sidebar-sticky,
  .content {
    border: 1px solid #eaeaeb;
    background: #fff;
  }
  .sidebar-sticky {
    .nav {
      margin-top: 6px;

      .nav-item {
        .nav-link {
          color: #707070;
          &.router-link-exact-active,
          &.router-link-active {
            color: var(--primary);
            cursor: default;
          }
        }
      }
    }
  }

  @media (max-width: 991px) {
    .content.bg-white {
      background: none !important;
      border: none !important;
    }
    .sidebar {
      position: fixed;
      z-index: 35;
      padding: 0;
      height: calc((var(--vh, 1vh) * 100) - 47px);
      top: 46px;
      left: 0;
      pointer-events: none;
      transition: background .3s;
      .sidebar-sticky {
        transition: left .3s;
        background: #1f1f1f !important;
        border: none !important;
        overflow: auto;
        width: 300px;
        left: -300px;
        position: absolute;
        .collapse-bt {
          color: #fff;
          pointer-events: none;
          &::after {
            display: none;
          }
        }
        .nav {
          .nav-item {
            .nav-link {
              font-size: 14px;
              color: #fff;
              &.router-link-exact-active, &.nav-link.router-link-active {
                font-weight: bold;
                color: #fff;
              }
            }
          }
        }
      }
      &.visible {
        background: rgba(0,0,0,.8);
        pointer-events: all;
        .sidebar-sticky {
          left: 0;
        }
      }
    }
  }

  @media (max-width: 767px) {
    .sidebar-sticky,
    .content {
      border: none;
      background: none;
    }
  }
</style>
