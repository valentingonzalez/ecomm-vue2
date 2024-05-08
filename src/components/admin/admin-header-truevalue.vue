<template>
  <div class="admin-header">
    <upgrade-banner v-if="$store.state.isBasicPlan"></upgrade-banner>
    <header>
      <div class="container d-flex align-items-center justify-content-between">
        <div class="logo">
          <img src="/images/truevalue-logo.svg" alt="Logo" />
        </div>
        <b-navbar toggleable="lg" type="light" class="px-0">
          <router-link v-if="pageWidth < 991" to="/home" class="btn btn-xs btn-outline-primary" style="margin-right: 50px;">View as Customer</router-link>
          <b-collapse is-nav>
            <b-navbar-nav>
              <b-nav-item @click="logout" class="justify-content-end logout-bt flex-grow-1 d-flex align-items-center mr-2">Log out</b-nav-item>
              <li class="nav-item">
                <router-link to="/home" class="btn btn-sm btn-outline-primary">View as Customer</router-link>
              </li>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
    </header>
    <div class="nav-menu">
      <div class="container">
        <div class="menu-bar">
          <b-navbar toggleable="lg" type="light" class="px-0 admin-nav">
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav>
                <b-nav-item to="/admin/settings">
                  <svg width="17" height="17" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)" stroke="#212529" stroke-width="1.333" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.333" cy="7.333" r="2"/><path d="M12.267 9.333a1.1 1.1 0 0 0 .22 1.214l.04.04a1.333 1.333 0 1 1-1.887 1.886l-.04-.04a1.1 1.1 0 0 0-1.213-.22 1.1 1.1 0 0 0-.667 1.007v.113a1.333 1.333 0 1 1-2.667 0v-.06a1.1 1.1 0 0 0-.72-1.006 1.1 1.1 0 0 0-1.213.22l-.04.04a1.333 1.333 0 1 1-1.887-1.887l.04-.04a1.1 1.1 0 0 0 .22-1.213 1.1 1.1 0 0 0-1.006-.667h-.114a1.333 1.333 0 0 1 0-2.667h.06a1.1 1.1 0 0 0 1.007-.72 1.1 1.1 0 0 0-.22-1.213l-.04-.04a1.333 1.333 0 1 1 1.887-1.887l.04.04a1.1 1.1 0 0 0 1.213.22h.053A1.1 1.1 0 0 0 6 1.447v-.114a1.333 1.333 0 0 1 2.667 0v.06A1.1 1.1 0 0 0 9.333 2.4a1.1 1.1 0 0 0 1.214-.22l.04-.04a1.333 1.333 0 1 1 1.886 1.887l-.04.04a1.1 1.1 0 0 0-.22 1.213v.053A1.1 1.1 0 0 0 13.22 6h.113a1.333 1.333 0 1 1 0 2.667h-.06a1.1 1.1 0 0 0-1.006.666z"/></g></svg>
                  Website Settings
                </b-nav-item>
                <b-nav-item to="/admin/orders">
                  <svg width="17" height="14" xmlns="http://www.w3.org/2000/svg"><g stroke="#212529" stroke-width="1.333" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><path d="M14.333 4.333V13h-12V4.333M1 1h14.667v3.333H1zM7 7h2.667"/></g></svg>
                  Orders
                </b-nav-item>
                <b-nav-item to="/admin/stats" v-if="$store.state.settings.admin.showStats">
                  <svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="TrueValue-Template" transform="translate(-305.000000, -100.000000)" stroke="#212529" stroke-width="1.33333333"><g id="Group-16" transform="translate(0.000000, 85.000000)"><g id="Group-7" transform="translate(32.000000, 14.000000)"><g id="Group-2-Copy-2" transform="translate(274.000000, 0.000000)"><g id="stats" transform="translate(0.000000, 2.000000)"><line x1="12.3333333" y1="11.6666667" x2="12.3333333" y2="4" id="Path"></line><line x1="8.33333333" y1="11.6666667" x2="8.33333333" y2="0" id="Path"></line><line x1="0.333333333" y1="11.6666667" x2="0.333333333" y2="6.66666667" id="Path"></line><line x1="4.33333333" y1="11.6666667" x2="4.33333333" y2="3.66666667" id="Path"></line></g></g></g></g></g></g></svg>
                  Stats
                </b-nav-item>
                <b-nav-item to="/admin/emails">
                  <svg width="15" height="14" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)" stroke="#212529" stroke-width="1.333" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12v-1.333C9 9.194 7.993 8 6.75 8h-4.5C1.007 8 0 9.194 0 10.667V12"/><circle cx="4.5" cy="2.5" r="2.5"/><path d="M13 12v-1.363c0-1.242-.823-2.326-2-2.637M9 0c1.177.292 2 1.321 2 2.5S10.177 4.708 9 5"/></g></svg>
                  Customers
                </b-nav-item>
                <b-nav-item v-if="$store.state.settings.showAdvancedSetting" @click="goToSetup">
                  <svg width="17px" height="15px" viewBox="0 0 24 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Rodrigo's-April-23rd---Admin-View" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round"><g id="advanced-settings" transform="translate(1.000000, 1.000000)" stroke="#FFFFFF" stroke-width="1.5"><line x1="3" y1="18" x2="3" y2="11" id="Path"></line><line x1="3" y1="8" x2="3" y2="0" id="Path"></line><line x1="11" y1="18" x2="11" y2="8" id="Path"></line><line x1="11" y1="5" x2="11" y2="0" id="Path"></line><line x1="19" y1="18" x2="19" y2="13" id="Path"></line><line x1="19" y1="10" x2="19" y2="0" id="Path"></line><line x1="0" y1="11" x2="6" y2="11" id="Path"></line><line x1="8" y1="5" x2="14" y2="5" id="Path"></line><line x1="16" y1="13" x2="22" y2="13" id="Path"></line></g></g></svg>
                  Advanced Settings
                </b-nav-item>
                <b-nav-item to="/admin/tutorials">
                  <svg class="mr-2" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Tutorials
                </b-nav-item>
                <b-nav-item @click="goToReleaseUpdatesPage">
                  <svg class="mr-2" width="20" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="time" transform="translate(1.000000, 1.000000)"><polyline id="Path" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" points="11 5 11 11 17 11"></polyline><path d="M0,11 C0,5.78208319 3.66599985,1.28217819 8.77617322,0.22729245 C13.8863466,-0.827593289 19.0344981,1.85283443 21.1007735,6.64419769 C23.1670489,11.4355609 21.5828295,17.0193236 17.3081752,20.0116448 C13.0335208,23.003966 7.24477447,22.5813884 3.45,19" id="Path" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><polygon id="Path" fill="#64748B" fill-rule="nonzero" points="3.46666667 23 1.8 18 6.8 18.2941176"></polygon></g></g></svg>
                  Release Updates
                </b-nav-item>
                <b-nav-item @click="logout" class="justify-content-end logout-bt flex-grow-1 d-lg-none">Log out</b-nav-item>
                <li v-if="pageWidth > 991" class="nav-item d-lg-none">
                  <router-link to="/home" class="btn-view">View as Customer</router-link>
                </li>
                <b-nav-item to="/admin/wizard" class="ml-auto">
                  <svg width="17" height="17" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)" stroke="#212529" stroke-width="1.333" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.333" cy="7.333" r="2"/><path d="M12.267 9.333a1.1 1.1 0 0 0 .22 1.214l.04.04a1.333 1.333 0 1 1-1.887 1.886l-.04-.04a1.1 1.1 0 0 0-1.213-.22 1.1 1.1 0 0 0-.667 1.007v.113a1.333 1.333 0 1 1-2.667 0v-.06a1.1 1.1 0 0 0-.72-1.006 1.1 1.1 0 0 0-1.213.22l-.04.04a1.333 1.333 0 1 1-1.887-1.887l.04-.04a1.1 1.1 0 0 0 .22-1.213 1.1 1.1 0 0 0-1.006-.667h-.114a1.333 1.333 0 0 1 0-2.667h.06a1.1 1.1 0 0 0 1.007-.72 1.1 1.1 0 0 0-.22-1.213l-.04-.04a1.333 1.333 0 1 1 1.887-1.887l.04.04a1.1 1.1 0 0 0 1.213.22h.053A1.1 1.1 0 0 0 6 1.447v-.114a1.333 1.333 0 0 1 2.667 0v.06A1.1 1.1 0 0 0 9.333 2.4a1.1 1.1 0 0 0 1.214-.22l.04-.04a1.333 1.333 0 1 1 1.886 1.887l-.04.04a1.1 1.1 0 0 0-.22 1.213v.053A1.1 1.1 0 0 0 13.22 6h.113a1.333 1.333 0 1 1 0 2.667h-.06a1.1 1.1 0 0 0-1.006.666z"/></g></svg>
                  Setup Wizard
                </b-nav-item>
              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthApiService from '@/api-services/auth.service';
import AdminApiService from '@/api-services/admin.service';
import AuthController from '@/controllers/auth.controller';

import UpgradeBanner from './upgrade-banner';

export default {
  name: 'AdminHeaderTrueValue',
  data () {
      return {
        noticeHidden: true,
      };
  },
  components: {
    UpgradeBanner
  },
  methods: {
    logout() {
      AuthApiService.logout()
        .then(res => {
          if(res.data.status == "success") {
            AuthController.logout();
            this.$store.dispatch('logout');
            this.$router.push({ name: 'index' });
          } else {
            this.$swal(res.data.message, '', 'error');
          }
        })
        .catch(err => {
          console.log(err);
          this.$swal('Unknown error while logging out', '', 'error');
        });
    },
    goToReleaseUpdatesPage() {
      this.$router.push({ path: '/admin/release-updates' });
    },
    goToSetup() {
      AdminApiService.getEcommerceSetupLink().then(response => {
        window.location = response.data.redir_url;
      }).catch(err => {
        console.log(err);
      });
    },
  },
  async mounted() {
    const hide = window.localStorage.getItem('hideNpmUpgradeNotice');
    if ( hide === '1' ) {
      this.noticeHidden = true;
    }
  },
};
</script>

<style lang="scss" scoped>
  @media print
  {
    .logo
    {
      display: none !important;
    }
  }
  header {
    .logo {
      display: flex;
      align-items: center;
    }
  }
  .navbar {
    z-index: 10;
  }
  .nav-menu {
    background: #2f2f2f;
    position: relative;
    z-index: 10;

    .menu-bar {
      width: 100%;

      .navbar {
        border: none;
        background: none;
        padding: 12px 0;
      }

      ul {
        padding: 0;
        margin: 0;
        width: 100%;

        li {
          list-style: none;
          display: flex;
          align-items: center;
          line-height: 1;

          a {
            cursor: pointer;
            color: #fff;
            opacity: .7;
            font-size: 0.875rem;
            font-weight: 400;
            text-transform: capitalize;
            padding: 0 30px 0 0;

            @media (min-width: 992px) and (max-width: 1199px) {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              line-height: 1;
              padding-top: 4px;
              padding-bottom: 4px;
              font-size: 0.8125rem;

              svg {
                margin: 0 0 4px 0 !important;
              }
            }

            svg {
              margin-right: 3px;
            }

            &:hover,
            &:focus,
            &.router-link-active {
              opacity: 1;
              color: #fff;
            }
            &.router-link-active {
              cursor: default;
              &::after {
                border-color: #fff;
                opacity: 1;
              }
            }
          }

          &.logout-bt a {
            color: rgba(255,255,255,.9);
            font-size: 14px;
            &:hover {
              color: #fff;
            }
          }
          .btn-view {
            border-radius: 5px;
            background: #fff;
            color: var(--text);
            opacity: 1 !important;
            font-size: 12px;
            align-items: center;
            min-width: 160px;
            display: flex;
            height: 40px;
            justify-content: center;
            padding: 0 8px;
            font-weight: bold;

            &:hover {
              color: #333;
            }
          }
        }
      }
    }
  }

  @media (max-width: 991px) {
    .admin-header {
      position: sticky;
      background: var(--background);
      top: 0;
      z-index: 10;
      header {
        padding: 3px 0;
        border-bottom: 1px solid #e3e3e6;
      }

      .nav-menu {
        > .container {
          padding: 0 !important;
        }

        .menu-bar {
          .navbar {
            padding: 0;

            button {
              position: absolute;
              top: -44px;
              right: 15px;
            }
          }

          .navbar-light {
            .navbar-toggler {
              border: none;
              padding-right: 8px;
            }
          }

          .navbar-collapse {
            ul {
              padding: 8px;

              li {

                a {
                  width: 100%;
                  font-size: 18px;
                  margin: 12px;

                  svg {
                    transform: scale(0.9);
                    margin-top: -4px;
                    margin-right: 4px;
                  }

                  &.btn-view {
                    margin-top: 16px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .banner {
      padding: 10px 0;
      font-size: 12px;
      flex-direction: column;

      a {
        margin-left: 10px;
      }
    }

  }

  .notice-banner {
    padding: 10px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    line-height: 1.3;
    font-size: 0.875rem;
    color: white;
    p {
      margin-bottom: 0;
    }
    a {
      display: inline;
    }
  }

  @media (max-width: 575px) {
    .notice-banner {
      flex-direction: column;
      text-align: center;
      padding: 8px;
      font-size: 0.8125rem;
    }
  }
</style>
