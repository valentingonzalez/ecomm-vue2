<template>
  <div :class="{ 'truevalue-layout' : isTruevalue }">
    <AdminHeader />
    <slot />
    <MainFooter v-if="!$route.meta.hideFooter" :business="business" />
    <upgrade-modal></upgrade-modal>
    <FreeUpgradeModal ref="freeUpgrade"></FreeUpgradeModal>
  </div>
</template>

<script>
  import HomePageApiService from '@/api-services/homepage.service';
  import upgradeModal from '../components/admin/upgrade-modal.vue';
  import FreeUpgradeModal from '../components/modals/free-upgrade-modal.vue';
  import AdminHeader from '@/components/admin/admin-header.vue';

  export default {
    name: 'AdminLayout',
    data() {
      return {
        business: {
          facebook_link: '',
          twitter_link: '',
          instagram_link: '',
          youtube_link: '',
        },
        banner: {
          message: 'Limited Time Offer: Free Delivery to your Home',
          button_title: 'Shop Now',
          custom_uri: ''
        }
      };
    },
    computed: {
      isTruevalue() {
        return this.$root.$children[0].isTruevalue;
      },
      socialMedia() {
        return this.business.facebook_link || this.business.twitter_link || this.business.instagram_link || this.business.pinterest_link || this.business.youtube_link || this.business.linkedin_link;
      }
    },
    components: {
      upgradeModal,
      FreeUpgradeModal,
      AdminHeader
    },
    async mounted() {
      let resp = await HomePageApiService.getBusinessDetails();
      this.business = resp.data.data;
      this.$store.commit('setBusinessDetails', this.business);
      const shown_free_upgrade = window.localStorage.getItem('auto_show_free_upgrade');
      let currentDate = new Date();
      let oneWeekAgo = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
      // The date is more than one week in the past
      if(this.business.show_free_upgrade && (!shown_free_upgrade || new Date(shown_free_upgrade) < oneWeekAgo)){
          this.$refs.freeUpgrade.showModal();
          window.localStorage.setItem('auto_show_free_upgrade', new Date().toISOString());
      }
    }
  };
</script>

<style lang="scss" scoped>
  .banner {
    background-color: #4A90E2;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    .banner-container {
      display: flex;
      a {
        .btn {
          font-weight: 500;
        }
      }

      .edit {
        margin-left: 8px;

        a {
          margin: 0 3px;
          cursor: pointer;
        }
      }
    }
  }

  @media (max-width: 991px) {
    .banner {
      padding: 10px 0;
      font-size: 12px;
      flex-direction: row;

      a {
        margin-left: 10px;
      }
    }
  }

  @media (max-width: 576px) {
    .banner {
      flex-direction: column;
    }
    .banner-container {
      .btn-outline-white {
        font-size: 12px;
        line-height: 12px;
      }

      .edit {
        margin-top: 5px;

        img {
          width: 24px;
        }
      }
    }
  }
</style>

<style lang="scss">
  :root {
    --brandPrimary-darker: #bd1a2e;
  }
  .truevalue-layout {
    .admin-header header {
      background: var(--brandPrimary);
      .navbar-nav {
        .nav-link {
          color: white;
        }
      }
      .btn.btn-outline-primary {
        background: white !important;
      }
    }
    .nav-menu {
      background: #FFFFFF !important;

      .navbar-light {
        .nav-item {
          a {
            color: #212529 !important;
            opacity: 1 !important;
            font-weight: 500;

            svg {
              g {
                stroke: #212529;
              }
            }

            &.router-link-active {
              color: var(--brandPrimary) !important;
              svg {
                g {
                  stroke: var(--brandPrimary);
                }
              }
            }
          }
          .btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
          }
        }
      }
    }

    footer {
      svg * {
        fill: var(--brandPrimary) !important;
        transition: 200ms;

        &:hover {
          opacity: 0.7;
        }
      }

      a {
        color: var(--brandPrimary);

        &:hover {
          color: var(--brandPrimary-darker);
        }
      }
    }

    .btn {
      transition: 200ms;

      &.btn-primary {
        background-color: var(--brandPrimary) !important;
        border-color: var(--brandPrimary) !important;
        font-weight: bold;

        &:hover,
        &:active,
        &:focus {
          background-color: var(--brandPrimary-darker) !important;
          border-color: var(--brandPrimary-darker) !important;
        }
      }

      &.btn-outline-primary {
        color: var(--brandPrimary) !important;
        border-color: var(--brandPrimary) !important;

        &:hover,
        &:active,
        &:focus {
          color: var(--brandPrimary) !important;
          background-color: #f3ebec !important;
          border-color: var(--brandPrimary) !important;
        }
      }

      &.btn-secondary {
        background-color: #FEF2F2;
        border-color: #FEF2F2;
        color: var(--brandPrimary);
        font-weight: bold;

        &:not(:disabled):hover {
          background-color: #FEF2F2;
          border-color: #FEF2F2;
        }
        &.btn:hover,
        &.btn:active,
        &.btn:focus {
          background-color: #FEF2F2 !important;
          border-color: #FEF2F2 !important;
          color: var(--brandPrimary) !important;
          box-shadow: none !important;
        }
      }
    }

    .sidebar-sticky {
      .nav {
        .nav-item {
          .nav-link.router-link-active {
            font-weight: bold;
            color: var(--brandPrimary) !important;
            transition: color 200ms;

            &:hover,
            &:active {
              color: var(--brandPrimary-darker) !important;
            }
          }
        }
      }
    }

    .custom-control .custom-control-label.always-on {
      color: #223240 !important;
      &::before {
        background: #223240 !important;
      }
    }
    
    .custom-switch .custom-control-input:checked ~ label.custom-control-label::before {
      background: #223240 !important;
    }

    .count {
      color: #223240 !important;
      font-weight: 600;
    }

    input.custom-control-input:checked ~ .custom-control-label {
      color: #223240 !important;
    }

    .tree-view .tree-branch .tree-node .tree-node-icon {
      border-left-color: var(--brandPrimary) !important;
    }

    .dynamic-form .card .card-header button:not(.collapsed):before {
      border-left-color: transparent !important;
      border-top-color: var(--brandPrimary) !important;
    }

    .dynamic-form .card .card-header button:before {
      border-left-color: var(--brandPrimary) !important;
    }

    .card .card-body .product .featured-product span {
      &:hover,
      &.active {
        svg polygon {
          fill: #f9be2a !important;
          stroke: #f9be2a !important;
        }
      }
    }

    .page-item.active .page-link {
      background-color: var(--brandPrimary);
      border-color: var(--brandPrimary);
    }

    .page-link {
      color: var(--brandPrimary);
    }

    .numbers {
      .value {
        color: #1a1d21 !important;
      }
    }

    .tabs {
      button.active {
        color: var(--brandPrimary) !important;
        border-bottom-color: var(--brandPrimary) !important;
      }
    }

    @media (max-width: 991px) {
      .admin-header header {
        border-bottom: none !important;
      }
    }
  }

</style>
