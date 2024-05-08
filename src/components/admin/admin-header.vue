<template>
  <div class="admin-header">
    <upgrade-banner v-if="$store.state.businessDetails && ['LEB'].includes($store.state.businessDetails.truevalue_ecommerce_plan)" @showUpgradeModal="showUpgradeModal" ></upgrade-banner>
    <header>
      <div class="container d-flex align-items-center justify-content-between">
        <div class="logo">
          <img :src="`/images/${ isTruevalue ? 'truevalue-logo.svg' : 'EZ-AD-dark.png' }`" alt="Logo" />
        </div>
        <div class="alert alert-warning alert-wizard mb-0 text-medium d-flex align-items-center my-2 py-2 pl-4" role="alert" v-if="$store.state.adminWizard && !$store.state.adminWizard.completed">
          <svg class="mr-3" width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.25706 1.59858C7.02167 0.239276 8.97875 0.239275 9.74336 1.59858L15.3237 11.5191C16.0736 12.8523 15.1102 14.4996 13.5805 14.4996H2.4199C0.890251 14.4996 -0.0731769 12.8523 0.676753 11.5191L6.25706 1.59858ZM9.00012 11.4998C9.00012 12.052 8.55241 12.4998 8.00012 12.4998C7.44784 12.4998 7.00012 12.052 7.00012 11.4998C7.00012 10.9475 7.44784 10.4998 8.00012 10.4998C8.55241 10.4998 9.00012 10.9475 9.00012 11.4998ZM8.00012 3.49976C7.44784 3.49976 7.00012 3.94747 7.00012 4.49976V7.49976C7.00012 8.05204 7.44784 8.49976 8.00012 8.49976C8.55241 8.49976 9.00012 8.05204 9.00012 7.49976V4.49976C9.00012 3.94747 8.55241 3.49976 8.00012 3.49976Z" fill="#FBBF24"/></svg>
          <div>
            New Actions Required on Your<br><router-link :to="`/admin/wizard${$store.state.adminWizard.is_wizard_begin ? '/setup' : ''}`" class="font-weight-bold">Setup Wizard</router-link>
          </div>
        </div>
        <b-navbar toggleable="lg" type="light" class="px-0">
          <template v-if="pageWidth < 991">
            <a v-if="isSvelte" :href="baseUrl" class="btn btn-xs btn-outline-primary" style="margin-right:50px;">View as Customer</a>
            <router-link v-else :to="isTruevalue ? '/home' : '/'" class="btn btn-xs btn-outline-primary" style="margin-right: 50px;">View as Customer</router-link>
          </template>
          <b-collapse is-nav>
            <b-navbar-nav>
              <b-nav-item @click="showContactUs" class="justify-content-end flex-grow-1 d-flex align-items-center">Contact Us</b-nav-item>
              <b-nav-item @click="logout" class="justify-content-end logout-bt flex-grow-1 d-flex align-items-center mr-2">Log out</b-nav-item>
              <li class="nav-item">
                <a v-if="isSvelte" :href="baseUrl" class="btn btn-sm btn-outline-primary">View as Customer</a>
                <router-link v-else :to="isTruevalue ? '/home' : '/'" class="btn btn-sm btn-outline-primary">View as Customer</router-link>
              </li>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
    </header>
    <div class="nav-menu">
      <div class="container">
        <div class="menu-bar">
          <b-navbar toggleable="lg" type="light" class="p-0 admin-nav">
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav>
                <b-nav-item to="/admin/orders">
                  <svg class="mr-1 orders-icon" width="17" height="14" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><path d="M14.333 4.333V13h-12V4.333M1 1h14.667v3.333H1zM7 7h2.667"/></g></svg>
                  Orders
                </b-nav-item>
                <b-nav-item to="/admin/stats" v-if="$store.state.settings.admin.showStats">
                  <svg class="mr-1 stats-icon" width="14" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Design" stroke="none" stroke-width="2" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="TrueValue-Template" transform="translate(-305.000000, -100.000000)" stroke="currentColor" stroke-width="1.6"><g id="Group-16" transform="translate(0.000000, 85.000000)"><g id="Group-7" transform="translate(32.000000, 14.000000)"><g id="Group-2-Copy-2" transform="translate(274.000000, 0.000000)"><g id="stats" transform="translate(0.000000, 2.000000)"><line x1="12.3333333" y1="11.6666667" x2="12.3333333" y2="4" id="Path"></line><line x1="8.33333333" y1="11.6666667" x2="8.33333333" y2="0" id="Path"></line><line x1="0.333333333" y1="11.6666667" x2="0.333333333" y2="6.66666667" id="Path"></line><line x1="4.33333333" y1="11.6666667" x2="4.33333333" y2="3.66666667" id="Path"></line></g></g></g></g></g></g></svg>
                  Stats
                </b-nav-item>
                <b-nav-item to="/admin/emails" v-if="!isTruevalue">
                  <svg class="mr-1 emails-icon" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  Emails
                </b-nav-item>
                <b-nav-item to="/admin/settings">
                  <svg class="mr-1 settings-icon" width="17" height="17" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)" stroke="currentColor" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.333" cy="7.333" r="2"/><path d="M12.267 9.333a1.1 1.1 0 0 0 .22 1.214l.04.04a1.333 1.333 0 1 1-1.887 1.886l-.04-.04a1.1 1.1 0 0 0-1.213-.22 1.1 1.1 0 0 0-.667 1.007v.113a1.333 1.333 0 1 1-2.667 0v-.06a1.1 1.1 0 0 0-.72-1.006 1.1 1.1 0 0 0-1.213.22l-.04.04a1.333 1.333 0 1 1-1.887-1.887l.04-.04a1.1 1.1 0 0 0 .22-1.213 1.1 1.1 0 0 0-1.006-.667h-.114a1.333 1.333 0 0 1 0-2.667h.06a1.1 1.1 0 0 0 1.007-.72 1.1 1.1 0 0 0-.22-1.213l-.04-.04a1.333 1.333 0 1 1 1.887-1.887l.04.04a1.1 1.1 0 0 0 1.213.22h.053A1.1 1.1 0 0 0 6 1.447v-.114a1.333 1.333 0 0 1 2.667 0v.06A1.1 1.1 0 0 0 9.333 2.4a1.1 1.1 0 0 0 1.214-.22l.04-.04a1.333 1.333 0 1 1 1.886 1.887l-.04.04a1.1 1.1 0 0 0-.22 1.213v.053A1.1 1.1 0 0 0 13.22 6h.113a1.333 1.333 0 1 1 0 2.667h-.06a1.1 1.1 0 0 0-1.006.666z"/></g></svg>
                  Website Settings
                </b-nav-item>
                <b-nav-item to="/admin/emails" v-if="isTruevalue">
                  <svg class="mr-1 customers-icon" width="15" height="14" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)" stroke="currentColor" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12v-1.333C9 9.194 7.993 8 6.75 8h-4.5C1.007 8 0 9.194 0 10.667V12"/><circle cx="4.5" cy="2.5" r="2.5"/><path d="M13 12v-1.363c0-1.242-.823-2.326-2-2.637M9 0c1.177.292 2 1.321 2 2.5S10.177 4.708 9 5"/></g></svg>
                  Customers
                </b-nav-item>
                <b-nav-item to="/admin/tutorials">
                  <svg class="mr-1 tutorials-icon" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Tutorials
                </b-nav-item>
                <b-nav-item @click="goToReleaseUpdatesPage">
                  <svg class="mr-1 releases-icon" width="20" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="2" fill="none" fill-rule="evenodd"><g id="time" transform="translate(1.000000, 1.000000)"><polyline id="Path" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" points="11 5 11 11 17 11"></polyline><path d="M0,11 C0,5.78208319 3.66599985,1.28217819 8.77617322,0.22729245 C13.8863466,-0.827593289 19.0344981,1.85283443 21.1007735,6.64419769 C23.1670489,11.4355609 21.5828295,17.0193236 17.3081752,20.0116448 C13.0335208,23.003966 7.24477447,22.5813884 3.45,19" id="Path" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><polygon id="Path" fill="#64748B" fill-rule="nonzero" points="3.46666667 23 1.8 18 6.8 18.2941176"></polygon></g></g></svg>
                  Release Updates
                </b-nav-item>
                <b-nav-item v-if="$store.state.settings.showAdvancedSetting" @click="goToSetup">
                  <svg class="mr-1 advanced-settings-icon" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  Advanced Settings
                </b-nav-item>
                <b-nav-item v-if="$store.state.adminWizard && isMobileWidth" :to="`/admin/wizard${$store.state.adminWizard.is_wizard_begin ? '/setup' : ''}`">
                  <svg class="mr-1 wizard-icon" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                  Setup Wizard
                </b-nav-item>
                <b-nav-item class="justify-content-end flex-grow-1 d-lg-none"><span @click="showContactUs">Contact Us</span></b-nav-item>
                <b-nav-item class="justify-content-end logout-bt flex-grow-1 d-lg-none"><span @click="logout" class="log-out-text">Log out</span></b-nav-item>
                <li v-if="pageWidth > 991" class="nav-item d-lg-none">
                  <a v-if="isSvelte" :href="baseUrl" class="btn-view">View as Customer</a>
                  <router-link v-else to="/home" class="btn-view">View as Customer</router-link>
                </li>
                <b-nav-item v-if="$store.state.adminWizard && !isMobileWidth" :to="`/admin/wizard${$store.state.adminWizard.is_wizard_begin ? '/setup' : ''}`" class="ml-auto mr-auto mr-lg-0">
                  <svg class="mr-1" width="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                  Setup Wizard
                </b-nav-item>
              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </div>
      </div>
    </div>

    <b-modal size="md" class="modal-box" ref="contactUsModal" id="free-upgrade-modal" centered hide-header hide-footer>
        <h5 class="modal-title center-title d-inline">Contact Us</h5>
        <a href="#" class="close-bt float-right" @click="hideModal">
          <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity=".3" stroke="#17678F" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"><path d="M15 1L1 15M15 15L1 1"/></g></svg>
        </a>
        <div class="d-flex flex-column align-items-center justify-content-between">
          <div class="d-flex flex-column align-items-center justify-content-center" style="min-height: 350px;">
            <div>
              <div class="my-4 text-center">        
                <h4>Need Help!</h4>
                <h5>You can contact us by email or phone</h5>
                <br>
                <a class="text-primary" href="tel:8885805593"><i class="fa fa-phone"></i> <span>888-580-5593</span></a>
                <br>
                <a class="text-primary" href="mailto:support@ezadtv.com"><i class="fa fa-envelope"></i> <span>support@ezadtv.com</span></a>
              </div>
            </div>
          </div>
        </div>

      </b-modal>
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
      noticeHidden: true,
      pageWidth: 0
    };
  },
  components: {
    UpgradeBanner
  },
  computed: {
    isTruevalue() {
      return this.$root.$children[0].isTruevalue;
    },
    isMobileWidth() {
      return this.pageWidth < 769;
    },
    isSvelte() {
      return window.__EZ_SVELTE || false;
    },
    baseUrl() {
      return window.location.protocol + '//' + window.location.host + (this.isTruevalue ? '/home' : '/');
    },
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
      }).catch(err => console.log(err));
    },
    showUpgradeModal(step){
      this.$root.$emit('showUpgradeModal', step);
    },
    showContactUs(){
      if(this.$refs.contactUsModal){
        this.$refs.contactUsModal.show();
      }  
    },
    hideModal() {
      this.$refs.contactUsModal.hide();
    },
    handleResize() {
      this.pageWidth = window.innerWidth;
    },  
  },
  async mounted() {
    const hide = window.localStorage.getItem('hideNpmUpgradeNotice');
    if ( hide === '1' ) {
      this.noticeHidden = true;
    }
    this.pageWidth = window.innerWidth;
    window.addEventListener('resize', this.handleResize);
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
    background: #fff;
    position: relative;
    z-index: 10;
    border-bottom: 2px solid #e2e8f0;

    .menu-bar {
      width: 100%;
      .navbar {
        border: none;
        background: none;
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
            padding: 0 30px 0 0;
            height: 64px;
            display: flex;
            align-items: center;
            line-height: 1;
            font-weight: 500;
            color: #64748b;
            //@media (min-width: 992px) and (max-width: 1199px) {
            //}

            svg {
              margin-right: 3px;
            }

            &:hover,
            &:focus,
            &.router-link-active {
              opacity: 1;
              color: #64748b;
            }
            &.router-link-active {
              cursor: default;
              color: var(--primary);
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
        padding: 3px;
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
                  height: 30px;
                  font-size: 18px;
                  margin: 12px;

                  svg {
                    transform: scale(0.9);
                    margin-top: 2px;
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
    .orders-icon{
      margin-left: 1px;
      margin-right: 17px !important;
    } 
    .stats-icon{
      margin-left: 2px;
      margin-right: 20px !important;
    } 
    .emails-icon{
      margin-left: -1px;
      margin-right: 16px !important;
    } 
    .settings-icon{
      margin-left: 1px;
      margin-right: 17px !important;
    } 
    .customers-icon {
      margin-left: 1px;
      margin-right: 19px !important;
    }
    .tutorials-icon {
      margin-left: -1px;
      margin-right: 16px !important;
    }
    .releases-icon {
      margin-left: -1px;
      margin-right: 17px !important;
    }
    .advanced-settings-icon {
      margin-left: -1px;
      margin-right: 17px !important;
    }
    .wizard-icon {
      margin-left: -1px;
      margin-right: 17px !important;
    }
    .log-out-text {
      color: #64748b;
    }
    .btn-view {
      border-radius: 5px;
      background: #fff;
      color: var(--text);
      opacity: 1 !important;
      font-size: 12px;
      align-items: normal;
      min-width: 160px;
      display: flex;
      height: 40px;
      justify-content: normal !important;
      padding: 0 !important;
      font-weight: bold;

      &:hover {
        color: #333;
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

  .alert-wizard {
    width: 344px;
    border-radius: 6px;
    position: relative;
    a {
      color: #1D4ED8 !important;
    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: #FBBF24;
      width: 3px;
      border-radius: 6px 0 0 6px;
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
