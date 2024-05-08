<template>
  <div class="admin-header">
    <upgrade-banner v-if="$store.state.isBasicPlan"></upgrade-banner>
    <header>
      <div class="container d-flex align-items-center justify-content-between">
        <div class="logo">
          <img src="/images/EZ-AD-dark.png" alt="Logo" />
        </div>
        <b-navbar toggleable="lg" type="light" class="px-0">
          <b-collapse is-nav>
            <b-navbar-nav>
              <b-nav-item @click="logout" class="justify-content-end logout-bt flex-grow-1 d-flex align-items-center mr-2">Log out</b-nav-item>
              <li class="nav-item">
                <router-link to="/" class="btn btn-sm btn-outline-primary">View as Customer</router-link>
              </li>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
    </header>
    <div class="nav-menu">
      <div class="container">
        <div class="menu-bar">
          <b-navbar toggleable="lg" type="light" class="p-0">
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav>
                <b-nav-item to="/admin/orders">
                  <svg class="mr-2" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.16667 4.66658H14.8333M3.16667 4.66658C2.72464 4.66658 2.30072 4.49099 1.98816 4.17843C1.67559 3.86587 1.5 3.44195 1.5 2.99992C1.5 2.55789 1.67559 2.13397 1.98816 1.82141C2.30072 1.50885 2.72464 1.33325 3.16667 1.33325H14.8333C15.2754 1.33325 15.6993 1.50885 16.0118 1.82141C16.3244 2.13397 16.5 2.55789 16.5 2.99992C16.5 3.44195 16.3244 3.86587 16.0118 4.17843C15.6993 4.49099 15.2754 4.66658 14.8333 4.66658M3.16667 4.66658V12.9999C3.16667 13.4419 3.34226 13.8659 3.65482 14.1784C3.96738 14.491 4.39131 14.6666 4.83333 14.6666H13.1667C13.6087 14.6666 14.0326 14.491 14.3452 14.1784C14.6577 13.8659 14.8333 13.4419 14.8333 12.9999V4.66658M7.33333 7.99992H10.6667" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Orders
                </b-nav-item>
                <b-nav-item to="/admin/stats" v-if="$store.state.settings.admin.showStats">
                  <svg class="mr-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.3333 4.66658V11.3333M7.99998 7.16658V11.3333M4.66665 9.66658V11.3333M2.99998 14.6666H13C13.442 14.6666 13.8659 14.491 14.1785 14.1784C14.4911 13.8659 14.6666 13.4419 14.6666 12.9999V2.99992C14.6666 2.55789 14.4911 2.13397 14.1785 1.82141C13.8659 1.50885 13.442 1.33325 13 1.33325H2.99998C2.55795 1.33325 2.13403 1.50885 1.82147 1.82141C1.50891 2.13397 1.33331 2.55789 1.33331 2.99992V12.9999C1.33331 13.4419 1.50891 13.8659 1.82147 14.1784C2.13403 14.491 2.55795 14.6666 2.99998 14.6666Z" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Stats
                </b-nav-item>
                <b-nav-item to="/admin/emails">
                  <svg class="mr-2" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  Emails
                </b-nav-item>
                <b-nav-item to="/admin/settings">
                  <svg class="mr-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.3958 3.5975C11.0408 2.13417 8.95917 2.13417 8.60417 3.5975C8.37417 4.54333 7.29083 4.99167 6.46083 4.485C5.17417 3.70167 3.7025 5.17417 4.48583 6.46C4.60359 6.65313 4.67407 6.87133 4.69156 7.09685C4.70904 7.32236 4.67303 7.54882 4.58645 7.75779C4.49988 7.96676 4.36518 8.15233 4.19333 8.29941C4.02148 8.44648 3.81733 8.5509 3.5975 8.60417C2.13417 8.95917 2.13417 11.0408 3.5975 11.3958C3.81714 11.4492 4.02107 11.5537 4.19273 11.7008C4.36438 11.8479 4.49892 12.0333 4.58539 12.2422C4.67187 12.451 4.70785 12.6773 4.6904 12.9027C4.67296 13.1281 4.60258 13.3461 4.485 13.5392C3.70167 14.8258 5.17417 16.2975 6.46 15.5142C6.65313 15.3964 6.87133 15.3259 7.09685 15.3084C7.32236 15.291 7.54882 15.327 7.75779 15.4135C7.96676 15.5001 8.15233 15.6348 8.29941 15.8067C8.44648 15.9785 8.5509 16.1827 8.60417 16.4025C8.95917 17.8658 11.0408 17.8658 11.3958 16.4025C11.4492 16.1829 11.5537 15.9789 11.7008 15.8073C11.8479 15.6356 12.0333 15.5011 12.2422 15.4146C12.451 15.3281 12.6773 15.2922 12.9027 15.3096C13.1281 15.327 13.3461 15.3974 13.5392 15.515C14.8258 16.2983 16.2975 14.8258 15.5142 13.54C15.3964 13.3469 15.3259 13.1287 15.3084 12.9032C15.291 12.6776 15.327 12.4512 15.4135 12.2422C15.5001 12.0332 15.6348 11.8477 15.8067 11.7006C15.9785 11.5535 16.1827 11.4491 16.4025 11.3958C17.8658 11.0408 17.8658 8.95917 16.4025 8.60417C16.1829 8.55075 15.9789 8.44627 15.8073 8.29921C15.6356 8.15215 15.5011 7.96666 15.4146 7.75782C15.3281 7.54897 15.2922 7.32267 15.3096 7.09731C15.327 6.87195 15.3974 6.65388 15.515 6.46083C16.2983 5.17417 14.8258 3.7025 13.54 4.48583C13.3469 4.60359 13.1287 4.67407 12.9032 4.69156C12.6776 4.70904 12.4512 4.67303 12.2422 4.58645C12.0332 4.49988 11.8477 4.36518 11.7006 4.19333C11.5535 4.02148 11.4491 3.81733 11.3958 3.5975Z" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678Z" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Website Settings
                </b-nav-item>
                <b-nav-item to="/admin/tutorials">
                  <svg class="mr-2" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Tutorials
                </b-nav-item>
                <b-nav-item @click="goToReleaseUpdatesPage">
                  <svg class="mr-1" width="20" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="2" fill="none" fill-rule="evenodd"><g id="time" transform="translate(1.000000, 1.000000)"><polyline id="Path" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" points="11 5 11 11 17 11"></polyline><path d="M0,11 C0,5.78208319 3.66599985,1.28217819 8.77617322,0.22729245 C13.8863466,-0.827593289 19.0344981,1.85283443 21.1007735,6.64419769 C23.1670489,11.4355609 21.5828295,17.0193236 17.3081752,20.0116448 C13.0335208,23.003966 7.24477447,22.5813884 3.45,19" id="Path" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><polygon id="Path" fill="#64748B" fill-rule="nonzero" points="3.46666667 23 1.8 18 6.8 18.2941176"></polygon></g></g></svg>
                  Release Updates
                </b-nav-item>
                <b-nav-item v-if="$store.state.settings.showAdvancedSetting" @click="goToSetup">
                  <svg class="mr-2" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  Advanced Settings
                </b-nav-item>
                <b-nav-item @click="logout" class="justify-content-end logout-bt flex-grow-1 d-lg-none">Log out</b-nav-item>
                <li class="nav-item d-lg-none">
                  <router-link to="/" class="btn-view">View as Customer</router-link>
                </li>
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
  name: 'AdminHeader',
  data () {
      return {
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
    .nav-link {
      display: flex;
      align-items: center;
      .icon {
        margin-right: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .nav-menu {
    background: #FFF;
    position: relative;
    z-index: 10;
    border-bottom: 2px solid #E2E8F0;
    .menu-bar {
      width: 100%;
      ul {
        li {
          a {
            height: 64px;
            cursor: pointer;
            color: #64748B;
            font-weight: 500;
            text-transform: capitalize;
            padding: 0 30px 0 0;
            &.router-link-active {
              cursor: default;
              color: var(--primary);
              svg * {
                stroke: var(--primary);
              }
              &::after {
                border-color: #fff;
                opacity: 1;
              }
            }
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
        padding: 15px 0;
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
          .nav-link {
            .icon {
              width: 40px;
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
</style>
