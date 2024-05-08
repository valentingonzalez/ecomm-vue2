<template>
  <nav :class="`navbar p-0 navbar-light ${!showMobileMenu ? 'collapsed' : ''} ${settings.lightNav ? 'white' : ''} ${settings.navigationLayout ? settings.navigationLayout : ''}`" id="mainNav">
    <div class="container flex-column flex-lg-row justify-content-between">
      <ul class="navbar-nav flex-column flex-lg-row" :class="{ 'justify-content-end': settings.navigationLayout === 'secondary' }">
        <template v-if="navigation && navigation.length">
          <li v-if="settings.navigationLayout === 'secondary'" class="nav-item search-field-menu d-block d-lg-none">
            <SearchField :search-rounded="false" />
          </li>
          <li class="nav-item" v-for="(nav, index) in navigation" :key="`nav${index}`" :class="[nav.dropdown && 'b-nav-dropdown dropdown', settings.navigationLayout != 'secondary' ? nav.align || 'left' : 'right', (nav.target === 'departments' || nav.target === '/departments') ? 'nav-mega-menu' : '', { 'd-flex d-lg-none top-menu-secondary': settings.navigationLayout === 'secondary' && nav.show_in_header == 1 }]">
            <template v-if="!nav.dropdown && !nav.megamenu">
              <a v-if="nav.target && isUrl(nav.target)" :href="nav.target" :target="isLocalUrl(nav.target) ? '' : '_blank'" class="nav-link">
                {{ nav.override || nav.name }}
              </a>
              <router-link v-else :to="nav.target ? nav.target : !nav.dropdown ? `/${nav.name}` : '/' | parseUrl" class="nav-link" :class="[{ 'home': nav.target == '/' }]">
                {{ nav.override || nav.name }}
              </router-link>
            </template>
            <template v-else-if="nav.dropdown">
              <div @click="activeMenuMobile = activeMenuMobile === nav.id ? null : nav.id" class="nav-link" :class="{ 'expanded': activeMenuMobile === nav.id && settings.navigationLayout === 'secondary' }">
                <a v-if="settings.navigationLayout !== 'secondary'" :href="nav.target === 'departments' ? '/departments' : nav.target">
                  {{ nav.override || nav.name }}
                </a>
                <template v-else>
                  {{ nav.override || nav.name }}
                </template>
                <div>
                  <svg class="ml-1" width="10" height="6" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M-226-22h1440v1459H-226z"/><path d="M-226-24h1440v53H-226z"/><path d="M7.5 1.5l-3 3-3-3" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></svg>
                </div>
              </div>
              <div :class="[(nav.target === 'departments' || nav.target === '/departments') ? 'mega-menu--header' : 'dropdown-menu', activeMenuMobile === nav.id && 'show-mega-menu-mobile']">
                <ul>
                  <li class="d-flex" v-if="nav.dropdown.config && nav.dropdown.config.search">
                    <input type="text" placeholder="Search..." class="form-control search-input" v-model="departmentDropdownSearch">
                  </li>
                  <template v-for="(d, i) in nav.dropdown.items">
                    <li :key="i" @mouseover="setClassTimer(d.dept_id, d.children && d.children.length)" @mouseleave="clearMenuTimeout(d.children && d.children.length)" :class="[{ 'has-child': d.children && d.children.length }, { 'show-child-menu': selectedClass === d.dept_id }]" @click="selectedClass = selectedClass === d.dept_id ? null : d.dept_id">
                       <a v-if="d.target && isUrl(d.target)" :href="d.target" :target="settings.navigationLayout != 'secondary' ? '_blank' : false" class="dropdown-item">
                        {{ d.override || d.name || d.title }}
                      </a>
                      <router-link v-else :to="`${createUrl(d.target) || '/' + (d.name | parseUrl)}`" class="dropdown-item">
                        {{ d.override || d.name || d.title }}
                      </router-link>
                    </li>
                    <li class="mega-class-submenu" :key="i + '-submenu'" v-if="d.children && d.children.length">
                      <ul>
                        <li v-if="!hideDepartmentSubHeaders">
                          <template v-if="isTruevalue">
                            <a v-if="d.target && isUrl(d.target)" :href="d.target" :target="isLocalUrl(d.target) ? '' : '_blank'" class="dropdown-item">View all {{ d.override || d.name || d.title }}</a>
                            <router-link v-else :to="`${createUrl(d.target) || '/' + (d.name | parseUrl)}`" class="dropdown-item">View all {{ d.override || d.name || d.title }}</router-link>
                          </template>
                          <template v-else>
                            BAll Classes {{ d.override || d.name || d.title }}
                          </template>
                        </li>
                        <template v-for="(c, ci) in d.children">
                          <li :key="ci" @mouseover="setFinelineTimer(c.dept_id, c.children && c.children.length)" @mouseleave="clearMenuTimeout(c.children && c.children.length)" :class="[{ 'has-child': c.children && c.children.length }, { 'show-child-menu': selectedFineline === c.dept_id }]" @click="selectedFineline = selectedFineline === c.dept_id ? null : c.dept_id">
                            <a v-if="c.target && isUrl(c.target)" :href="c.target" target="_blank" class="dropdown-item">
                              {{ c.override || c.name || c.title }}
                            </a>
                            <router-link v-else :to="`${createUrl(c.target) || '/' + (c.name | parseUrl)}`" class="dropdown-item">{{c.name}}</router-link>
                          </li>
                          <li class="mega-fileline-submenu" :key="`fileline-submenu-${ci}`">
                            <ul>
                              <li v-if="!hideDepartmentSubHeaders">
                                All Filters {{ c.override || c.name || c.title }}
                              </li>
                              <li v-for="(f, fi) in c.children" :key="fi">
                                <a v-if="f.target && isUrl(f.target)" :href="f.target" target="_blank" class="dropdown-item">
                                  {{ f.override || f.name || f.title }}
                                </a>

                                <router-link v-else :to="`${createUrl(f.target) || '/' + (f.name | parseUrl)}`" class="dropdown-item">{{f.name}}</router-link>
                              </li>
                            </ul>
                          </li>
                        </template>
                      </ul>
                    </li>
                  </template>
                </ul>
              </div>
            </template>
            <MegaMenu v-else-if="nav.megamenu" :menu="nav.megamenu" :title="nav.override || nav.name" />
          </li>
          <li class="nav-item right b-nav-dropdown dropdown" v-if="settings.showPhoneInNavigation">
            <div class="nav-link">
              <span><i class="fa fa-phone mr-2"></i>{{$store.state.businessDetails.business_telephone}}</span>
            </div>
            <ul class="dropdown-menu" :style="{minWidth: '100%'}">
              <li>
                <a :href="`tel:+1${phoneNumber}`" class="dropdown-item"><i class="fa fa-phone mr-3"></i>Call</a>
              </li>
              <li v-if="!settings.emailNavLink">
                <a :href="`sms:+1${phoneNumber}`" class="dropdown-item"><i class="fa fa-comment mr-3"></i>Text</a>
              </li>
              <li v-else>
                <a :href="`mailto:${$store.state.businessDetails.contact_email}`" class="dropdown-item"><i class="fa fa-envelope mr-3"></i>Email</a>
              </li>
            </ul>
          </li>
          <li class="nav-item right" v-if="$store.state.storeLocations && $store.state.storeLocations.length && $store.state.storeLocations.length > 1 && settings.navigationLayout !== 'secondary'">
            <a class="nav-link location-bt py-0" href="#" @click.prevent="showLocationModal">
              <div class="small text-capitalize text-md-right d-lg-none d-xl-block">
                <div class="font-weight-bold" v-if="$store.state.currentStore">
                  {{ $store.state.currentStore.name }}
                  <div v-if="settings.showLocationPhoneInNav">{{ $store.state.currentStore.phone }}</div>
                </div>
                <span v-if="$store.state.currentStore" :class="`d-block ${settings.showLocationPhoneInNav?'':'mt-1'}`">Change Location</span>
              </div>
              <svg class="d-none d-lg-block d-xl-none location-pin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C161.896 0 85.333 76.563 85.333 170.667c0 28.25 7.063 56.26 20.49 81.104L246.667 506.5c1.875 3.396 5.448 5.5 9.333 5.5s7.458-2.104 9.333-5.5l140.896-254.813c13.375-24.76 20.438-52.771 20.438-81.021C426.667 76.563 350.104 0 256 0zm0 256c-47.052 0-85.333-38.281-85.333-85.333S208.948 85.334 256 85.334s85.333 38.281 85.333 85.333S303.052 256 256 256z"/></svg>
            </a>
          </li>
        </template>
        <template v-if="!$store.state.isBasicPlan">
          <template v-if="!activeUser">
            <li class="nav-item right d-flex d-lg-none top-menu-secondary">
              <router-link class="nav-link" to="/login">Sign In</router-link>
            </li>
            <li class="nav-item right d-flex d-lg-none top-menu-secondary">
              <router-link class="nav-link" to="/register">Sign Up</router-link>
            </li>
          </template>
          <template v-else>
            <li class="nav-item right d-flex d-lg-none top-menu-secondary">
              <router-link class="nav-link" to="/account">My Account</router-link>
            </li>
          </template>
          <li class="nav-item right d-flex d-lg-none top-menu-secondary">
            <router-link class="nav-link" to="/cart">Cart</router-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script>
let classTimer = null;
let finelineTimer = null;

import AuthApiService from '@/api-services/auth.service';
import AuthController from '@/controllers/auth.controller';
import SearchField from "@/custom-pages/gerretsen/components/SearchField";
import DepartmentsService from '@/api-services/departments.service';

export default {
  name: 'MainNav',
  props: {
    showMobileMenu: { default: false },
  },
  components: {
    SearchField
  },
  data() {
    return {
      loading: true,
      departmentDropdownSearch: '',
      activeMenuMobile: null,
      selectedClass: null,
      selectedFineline: null,
      menuTimeoutDelay: 200
    };
  },
  computed: {
    phoneNumber() {
      return this.$store.state.businessDetails.business_telephone ? this.$store.state.businessDetails.business_telephone.replace(/\D/g, '') : '';
    },
    settings() {
      return this.$store.state.settings;
    },
    hideDepartmentSubHeaders() {
      const s = this.$store.state.settings;
      return !!(s.departments && s.departments.hideHeadersInMenu);
    },
    logger() {
      return this.$root.$children[0].$refs.logger;
    },
    activeUser() {
      return this.$store.state.activeUser;
    },
    currentStore() {
      return this.$store.state.currentStore;
    },
    departmentList() {
      if (this.$store.state.fullDepartmentResults)
        return this.$store.state.fullDepartmentResults.departments;
      return [];
    },
    filteredDepartmentList() {
      if (this.departmentList.length) {
        return this.departmentList.filter(department => {
          return department.name.toLowerCase().includes(this.departmentDropdownSearch.toLowerCase());
        });
      }
      return [];
    },
    navigation() {
      let customNavigation = this.$store.state.customNavigation;
      if(this.currentStore && this.currentStore.id) {
        customNavigation = customNavigation.filter(x => !x.hide_on_locations || (x.hide_on_locations && !x.hide_on_locations.split(',').map(x => x*1).includes(this.currentStore.id)));
      }
      let finalNavigation = customNavigation.map(i => {
        let elem = [...this.navigationItems].filter(e => {
          return !i.sub_target && (e.target.toLowerCase() == i.target.toLowerCase());
        })[0];
        if(elem) {
          elem.name = i.name;
          elem.sub_target = i.sub_target;
          elem.align = i.align;
          elem.show_in_header = i.show_in_header;
          elem.hide = i.hide;
          if(elem.sub_target) {
            elem.dropdown = null;
          }
        }
        i.dropdown && i.dropdown.items.map(e => {
          e.target = e.link ? e.link : e.target;
        });
        let final = elem && elem || i;
        final.target = final.sub_target ? final.sub_target : final.target;
        // seeing "brands" as a target which screws up if you're not on the homepage
        if ( final.target === 'brands' || final.target === 'about-us' ) {
          final.target = '/' + final.target;
        }

        return final;
      });

      return finalNavigation;
    },
    navigationItems() {
      var showInStock = 1;

      if(this.settings.products.filterShowOutOfStock) {
        showInStock = 0;
      }
      // do not show sub-levels if the store does not have multilevel categories enabled
      const multiLevel = this.$store.state.businessDetails.use_multilevel_categories;
      const dRoute = 'department';
      let departments = this.filteredDepartmentList.map(e => {
        if(!multiLevel)
          e.children = [];
        if(e.children && e.children.length) {
          e.children.forEach(c => {
            if(c.children && c.children.length) {
              c.children.forEach(f => {
                f.target = `/${dRoute}/${this.$ezSlugify(f.name)}-${f.dept_id}?name=${encodeURIComponent(f.name)}&in_stock_only=${showInStock}`;
                return f;
              });
            }
            c.target = `/${dRoute}/${this.$ezSlugify(c.name)}-${c.dept_id}?name=${encodeURIComponent(c.name)}&in_stock_only=${showInStock}`;
            return c;
          });
        }
        e.target = `/${dRoute}/${this.$ezSlugify(e.name)}-${e.dept_id}?name=${encodeURIComponent(e.name)}&in_stock_only=${showInStock}`;
        return e;
      });

      return [
        { target: 'home' },
        {
          target: '/departments',
          dropdown: {
            items: departments,
            config: {
              "search": true,
              "width": 500
            }
          },
        },
        {
          override: this.$store.state.businessDetails.business_telephone,
          target: `tel:${this.$store.state.businessDetails.business_telephone}`
        },
        { target: "brands" },
        { target: "rentals" },
        { target: "about us" },
        { target: "contact us" }
      ];
    },
    isMegaDropdown() {
      return true;
    }
  },
  methods: {
    isLocalUrl(target) {
      return target.includes(window.location.host);
    },
    setClassTimer(classId, hasChildren) {
      if(hasChildren) {
        if(classId !== this.selectedClass) {
          classTimer = setTimeout(() => this.selectedClass = classId, this.menuTimeoutDelay);
        }
      } else {
        this.selectedClass = null;
      }
    },
    setFinelineTimer(finelineId, hasChildren) {
      if(hasChildren) {
        if(finelineId !== this.selectedFineline)
          finelineTimer = setTimeout(() => this.selectedFineline = finelineId, this.menuTimeoutDelay);
      } else {
        if(this.selectedFineline) this.selectedFineline = null;
      }
    },
    clearMenuTimeout(hasChildren) {
      if(hasChildren) {
        clearTimeout(classTimer);
        clearTimeout(finelineTimer);
      }
    },
    createUrl(target) {
      // skip encodeURI if URL begins with /d/ because it completely breaks department URLs
      // by double-encoding the query parameter, which already has encodeURIComponent
      return (target.startsWith('/d/') || target.startsWith('/department/')) ? target : encodeURI(target);
    },
    parseUrl(val) {
      return this.$options.filters.parseUrl(val);
    },
    isUrl(val) {
      return this.$options.filters.isUrl(val);
    },
    showLocationModal() {
      this.$parent.$emit('showLocationModal');
    },
    toggleMobileMenu() {
      this.$emit('toggleMobileMenu', this.showMobileMenu);
    },
    logout() {
      this.toggleMobileMenu();
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
          this.$swal('Unknown error while logging out', '', 'error');
          console.log('err', err);
        });
      AuthController.logout();
      this.$store.dispatch('logout');
      this.$router.push({ name: 'index' }).catch(err => console.log(err));
    }
  },
  async mounted() {
    if(this.$root.$children[0].isAdmin) {
      this.logger.addLogs({
        group: 'Navigation',
        global: true,
        data: [
          { label: 'products.filterShowOutOfStock', value: this.settings.products.filterShowOutOfStock },
          { label: 'showPhoneInNavigation', value: this.settings.showPhoneInNavigation },
          { label: 'emailNavLink', value: this.settings.emailNavLink }
        ]
      });
    }
    let ret = await DepartmentsService.getAllDepartments();
    this.$store.commit('saveDepartments', ret.data.data.departments);
    this.$store.commit('saveFullDepartments', ret.data.data);

    this.loading = false;
    let navItems = [...document.querySelectorAll('.nav-item.left')];
    if(navItems && navItems[navItems.length - 1]) {
      navItems[navItems.length - 1].classList.add('mr-0');
    }
  },
};
</script>

<style lang="scss">
#mainNav.secondary {
  .navbar-nav {
    @media(max-width: 991px) {
      .search-field-menu {
        margin-bottom: 0 !important;
      }
    }

    .search-wrapper {
      .search {
        margin: 0;
        max-width: 100%;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
input.form-control {
  margin-top: 16px;
}
.border-header {
  border-color: rgba(0, 0, 0, 0.08) !important;
}

#mainNav.secondary {
  border-bottom: 5px solid var(--primary);
  margin-bottom: 50px;
  padding-top: 8px !important;

  .navbar-nav {
    .nav-item.right {
      @media (max-width: 1240px) {
        margin-left: 16px;
      }
    }

    @media (min-width: 992px) {
      .b-nav-dropdown {
        > .dropdown-menu {
          min-width: 180px;
          max-width: 205px;
          white-space: wrap;
          background: #6C6F70;
          border: solid 1px #aeaeae;
          border-radius: 0;
          padding: 0;

          .dropdown-item {
            padding: 10px;
            white-space: normal;
            color: white !important;
            transition: 200ms;
            font-size: 1rem;

            &:hover,
            &:active {
              background: transparent;
              color: #d5d5d5 !important;
            }
          }
        }
      }
    }

    .nav-link {
      font-size: 17px;
      padding: 12px 0;

      @media (max-width: 1240px) {
        font-size: 14px;
      }

      color: white;

      > div {
        display: none;
      }
    }

    .nav-mega-menu {
      position: relative;

      .mega-menu--header {
        right: 0;
        border: 1px solid rgba(0,0,0,.15);
        border-radius: .25rem;
        background-color: #fff;

        ul {
          li {
            a {
              font-weight: normal;
              color: #212538;
            }
          }
        }
      }

      ul {
        width: 250px;

        li {
          a {
            &:hover {
              background: var(--primary);
              font-weight: normal;
              color: white;
            }
          }
        }
      }
    }

    @media (max-width: 991px) {
      .nav-item.top-menu-secondary {
        margin-top: 22px !important;
        margin-bottom: 8px !important;
        align-items: start;
        flex-direction: column;

        ~ .top-menu-secondary {
          margin-top: 0px !important;
        }

        &:last-child {
          margin-bottom: 40px !important;
        }

        &:not(:first-child):not(:last-child) {
          border-bottom: none !important;
        }

        .nav-link {
          font-weight: normal;
          font-size: 0.875rem;
          padding: 8px 0 !important;
          width: 100%;

        }

        .dropdown-menu {
          ul {
            li {
              a {
                opacity: 0.8;
                padding: 6px 0;
              }
            }
          }
        }
      }
    }
  }
}

nav.navbar {
  min-height: 46px;
  padding: 0 !important;
  color: var(--navigationLinkColor);
  width: 100%;
  border-top: 1px solid rgba(0,0,0,.07);
  .dropdown {
    border: 1px solid transparent;
  }
  &.hidden-nav {
    min-height: 0;
    border: none;
  }
  .b-nav-dropdown {
    display: flex;
    align-items: baseline;
    > .dropdown-menu {
      margin-top: 0;
      font-size: 14px;
      max-height: calc((var(--vh, 1vh) * 100) - 220px);
      overflow-y: auto;
      .dropdown-item {
        color: var(--text) !important;
        padding: 10px 20px;
        white-space: nowrap;
        &:hover {
          background: var(--primary);
          color: #fff !important;
        }
      }
    }
    &:hover {
      > .nav-link {
        color: var(--navigationLinkColor) !important;
      }
      > .dropdown-menu {
        @media (min-width: 992px) {
          display: block;
        }
      }
    }
  }

  .navbar-nav {
    width: 100%;
    li.nav-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      &:not(.right) {
        margin-right: 30px;
      }
      .nav-title {
        color: var(--navigationLinkColor) !important;
      }
      .caret svg {
        fill: var(--navigationLinkColor);
      }
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        border-bottom: 3px solid var(--navigationLinkColor);
        width: 100%;
        opacity: 0;
        transition: opacity 0.3s;
      }
      &.right {
        margin-left: auto;
        > .dropdown-menu {
          left: auto;
          right: 0;
        }
      }
      &.right ~ .nav-item.right {
        margin-left: 30px;
      }
      .nav-link {
        color: var(--navigationLinkColor);
        padding: 16px 0;
        font-size: var(--navigationFontSize);
        line-height: 1.3;
        letter-spacing: 0.5px;
        position: relative;
        display: flex;
        align-items: center;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          border-bottom: 3px solid var(--navigationLinkColor);
          width: 100%;
          opacity: 0;
          transition: opacity .3s;
        }
        &.router-link-active:not(.home)::after {
          opacity: 1;
        }
        &.nuxt-link-active {
          color: var(--navigationLinkColor);
          border-bottom: 3px solid var(--navigationLinkColor);
        }
        &.alt-link {
          color: var(--navigationLinkColor);
          text-transform: capitalize;
          display: flex;
          align-items: center;
          &::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            border-bottom: 3px solid var(--navigationLinkColor);
            width: 100%;
            opacity: 0;
            transition: opacity .3s;
          }
          &.router-link-active:not(.home),
          &.router-link-exact-active {
            &::after {
              opacity: 1;
            }
          }
          &.nuxt-link-active {
            color: var(--navigationLinkColor);
            border-bottom: 3px solid var(--navigationLinkColor);
          }
          &.alt-link {
            color: var(--navigationLinkColor);
            text-transform: capitalize;
          }
          &:focus,
          &:hover,
          &.router-link-exact-active,
          a {
            color: var(--navigationLinkColor) !important;
          }
          > a {
            display: flex;
          }
        }

        &:focus,
        &:hover,
        &.router-link-exact-active {
          color: var(--navigationLinkColor) !important;
        }

        > a {
          display: flex;
          color: var(--navigationLinkColor);
        }
      }
      a.nav-link:hover {
        color: var(--navigationLinkColor) !important;
      }
      .user-name {
        font-weight: bold;
        font-size: 14px;
      }
      .location-bt {
        line-height: 14px;

        span {
          opacity: 0.7;
          @media (max-width: 991px) {
            margin-top: 12px;
            display: block;
          }
        }

      }
    }
    .user-name {
      font-weight: bold;
      font-size: 14px;
    }
    .location-bt {
      line-height: 14px;
    }
    .b-nav-dropdown svg * {
      stroke: var(--navigationLinkColor);
    }
    .dropdown-menu {
      margin-top: -2px;
      max-height: calc(var(--vh, 1vh) * 100 - 200px);
      min-width: 435px;
      overflow-y: auto;
      font-size: 14px;
      position: absolute;

      > ul {
        list-style: none;
        padding: 0;
      }

      li {
        float: left;
        width: 100%;
      }

      input.form-control {
        display: flex;
        margin: 6px 16px;
        height: 40px;
        padding: 12px !important;
      }
    }

    @media (min-width: 992px) {
      .dropdown:hover {
        .dropdown-menu {
          display: block;
        }
      }
    }

    .nav-mega-menu {

      @media (min-width: 992px) {
        &:hover {
          .mega-menu--header {
            display: block !important;
          }
        }
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .mega-menu--header{
        display: none !important;
        background: #fff;
        position: absolute;
        top: 100%;
        margin-top: -2px;
        z-index: 10;
        border-radius: 8px;

        input.form-control {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          margin: 8px;
          height: 40px;
          padding: 12px!important;
          min-width: 264px;
          display: inline;

          @media (max-width: 991px) {
            max-width: unset;
          }
        }

        > ul {
          max-height: calc(var(--vh, 1vh) * 100 - 150px);
          min-height: 300px;
          overflow-y: auto;
        }

        a {
          padding: 8px 24px 8px 16px;
          font-size: 0.875rem;
          white-space: pre-wrap;
        }

        .has-child {
          > a {
            position: relative;

            &:after {
              content: '';
              position: absolute;
              width: 12px;
              height: 12px;
              top: calc(50% - 7px);
              right: 8px;
              background: url("data:image/svg+xml,%3Csvg data-v-60864b9f='' width='10' height='6' xmlns='http://www.w3.org/2000/svg' class='ml-1'%3E%3Cg data-v-60864b9f='' fill='none' fill-rule='evenodd'%3E%3Cpath data-v-60864b9f='' d='M-226-22h1440v1459H-226z'%3E%3C/path%3E%3Cpath data-v-60864b9f='' d='M-226-24h1440v53H-226z'%3E%3C/path%3E%3Cpath data-v-60864b9f='' d='M7.5 1.5l-3 3-3-3' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3C/path%3E%3C/g%3E%3C/svg%3E") no-repeat center;
              display: block;
              transform: rotate(-90deg);
              opacity: 0.4;
            }
          }
        }

        li.show-child-menu {
          + .mega-class-submenu,
          + .mega-fileline-submenu {
            display: block !important;
          }

          > a {
            color: var(--primary);
            font-weight: bold;
          }
        }

        li {

          a {
            &:hover {
              color: var(--primary);
            }

            &:active {
              background: none;
            }
          }
        }

        .mega-class-submenu {
          display: none !important;
          position: absolute;
          width: 630px;
          height: 100%;
          background: #fff;
          animation-name: menu-transition;
          animation-duration: 200ms;
          left: 280px;
          top: 0;
          right: 0;
          z-index: 2;

          li.heading {
            padding: 8px 16px;
            font-weight: bold;
            color: black;
          }

          > ul {
            overflow-y: auto;
          }

          ul {
            display: inline-block;
            list-style: none;
            width: 50%;
            margin: 0;
            padding: 0;
            height: 100%;
          }

          .mega-fileline-submenu {
            display: none !important;
            position: absolute;
            z-index: 1;
            left: 50%;
            top: 0;
            animation: menu-transition 200ms;
            background: transparent;
            height: 100%;
            width: 50%;

            &:hover > li{
              background: #f0f0f0;
            }

            ul {
              width: 100%;
              overflow-y: auto;
            }
          }

          @keyframes menu-transition {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          li {
            &:focus {
              background: #666;
            }
          }
        }
      }

      .mega-class-submenu:hover,
      .mega-fileline-submenu:hover {
        display: block !important;
      }
    }
  }
}
.location-pin {
  width: 18px;
  height: 18px;
  * {
    fill: var(--primary);
  }
}

@media (max-width: 991px) {
  #mainNav.secondary {
    .navbar-nav li.nav-item .user-name {
      padding: 14px 0 !important;
      line-height: 1;
    }

    .navbar-nav {
      ul {
        li {
          a {
            padding-right: 0;
            padding-left: 0;
          }
        }
      }
    }
  }

  nav.navbar {
    .navbar-nav {
      li.nav-item {
        &:not(.right) {
          margin-right: 20px;
        }
        &.right ~ .nav-item.right {
          margin-left: 20px;
        }
        .nav-link {
          padding: 14px 0 !important;
          font-size: 14px;

          &::after {
            border-bottom: none;
          }
        }
        .phone {
          > .phone-text {
            display: inline-block;
          }
        }
      }
    }
  }

  nav.navbar {
    top: 0;
    left: 0;
    width: calc(var(--vw, 1vw) * 100);
    height: calc(var(--vh, 1vh) * 100);
    z-index: 1;
    transition: opacity .3s;
    display: block;
    position: fixed;
    padding: 60px 7px 24px !important;

    > .container {
      height: 100%;
      overflow: auto;
      padding-bottom: 40px;
    }
    &.collapsed {
      opacity: 0;
      height: 0;
      min-height: 0;
      overflow: hidden;
      pointer-events: none;
    }
    .navbar-nav {
      li.nav-item {
        margin: 0 0 20px 0 !important;
        > * {
          font-size: 16px;
        }
        .nav-link {
          justify-content: space-between;

          svg {
            transform: scale(1.5);
          }
        }
        .nav-link,
        .nav-link a {
          font-size: 22px;
        }
        &.right {
          margin-left: 0;
        }
        &.right ~ .nav-item.right {
          margin-left: 0;
        }
        &.b-nav-dropdown {
          display: block;
          .dropdown-menu {
            position: static;
            background: transparent;
            min-width: 500px;
            border: none;
            padding: 0;
            li {
              float: none;
              width: 100%;
            }
            .dropdown-item {
              color: var(--navigationLinkColor) !important;
              padding: 10px;
              border-radius: 0;
              &:hover {
                color: #fff !important;
              }
            }
          }
          &::after {
            display: none;
          }
        }
      }

      .show-mega-menu-mobile {
        display: block !important;
      }
      .nav-mega-menu {
        li.show-child-menu + .mega-class-submenu,
        li.show-child-menu + .mega-fileline-submenu {
          max-height: 2000px !important;
        }

        .mega-menu--header {
          position: unset;
          width: 100%;
          &.show-mega-menu-mobile {
            display: block !important;
          }

          ul {
            li {
              a {
                padding-left: 8px;
                padding-right: 8px;
                display: inline-block;
                margin: 0;
                width: auto;
              }

              &.has-child {
                position: relative;

                &:after {
                  content: '';
                  position: absolute;
                  width: 12px;
                  height: 12px;
                  top: 12px;
                  right: 8px;
                  background: url("data:image/svg+xml,%3Csvg data-v-60864b9f='' width='10' height='6' xmlns='http://www.w3.org/2000/svg' class='ml-1'%3E%3Cg data-v-60864b9f='' fill='none' fill-rule='evenodd'%3E%3Cpath data-v-60864b9f='' d='M-226-22h1440v1459H-226z'%3E%3C/path%3E%3Cpath data-v-60864b9f='' d='M-226-24h1440v53H-226z'%3E%3C/path%3E%3Cpath data-v-60864b9f='' d='M7.5 1.5l-3 3-3-3' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3C/path%3E%3C/g%3E%3C/svg%3E") no-repeat center;
                  display: block;
                  opacity: 0.4;
                }

                a {
                  &:after {
                    display: none;
                  }
                }
              }
            }
          }

          .mega-class-submenu {
            position: unset;
            background: rgb(243, 243, 243);
            width: 100%;
            border-radius: 4px;
            max-height: 0;
            transition: max-height 200ms;
            overflow: hidden;
            border: 1px solid #E8E8E8;

            li.heading {
              padding: 0;
              font-size: 1rem;
              margin-bottom: 4px;
            }

            > ul {
              padding: 12px;
              width: 100%;
            }

            ul {
              min-height: 0;
            }

            .mega-fileline-submenu {
              position: unset;
              width: 100%;
              max-height: 0;
              transition: max-height 200ms;
              overflow: hidden;

              > ul {
                width: 100%;
                padding: 8px;
                background: rgb(231, 231, 231);
                border-radius: 4px;
              }
            }
          }
        }
      }
    }
  }

  #mainNav.secondary {
    background: #6c6f70;
    top: unset;

    .navbar-nav {
      ul {
        width: 100%;
        padding: 4px 0 14px;

        li {
          a {
            color: white;
            font-size: 14px;
            width: 100%;
          }
        }
      }


      .nav-link {
        display: flex;
        justify-content: space-between;
        line-height: 1;

        &.expanded {
          svg {
            transform: scale(1.6) rotate(0);
          }

          + .dropdown-menu {
            display: block;
          }
        }

        > div {
          display: inline-block;

          svg {
            transition: 200ms;
            transform: scale(1.6) rotate(-90deg);
            margin-bottom: 4px;

            * {
              stroke: #48494a;
            }
          }
        }
      }

      .nav-item {
        margin-bottom: 0 !important;

        &:not(:first-child):not(:last-child) {
          border-bottom: 1px solid #888 !important;
        }

        &.border-header {
          border: none !important;
        }

        .nav-link {
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
  }
}

@media (max-width: 576px) {
  nav.navbar {
    .navbar-nav {
      li.nav-item {
        &.right {
          margin-left: 0 !important;
        }
      }
    }
  }
}
</style>


<style v-if="settings.layout && settings.layout == 'secondary'" lang="scss">
#app {
  > .alert {
    border-bottom: 2px solid #fff !important;
  }
}
</style>
