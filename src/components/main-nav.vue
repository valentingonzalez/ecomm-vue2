<template>
  <nav role="menubar" :class="`navbar p-0 navbar-light main-nav ${showLocations ? 'showLocations' : ''} ${!showMobileMenu ? 'collapsed' : ''} ${settings.lightNav ? 'white' : ''} ${settings.navigationLayout ? settings.navigationLayout : ''}`" id="mainNav">
    <div class="container px-4 pb-3 pb-lg-0 w-100 h-100 align-items-start">
      <div class="px-2 px-lg-0 w-100">
        <div class="d-flex justify-content-end mt-4 d-lg-none mb-n2 w-100">
          <a href="#" @click.prevent="toggleMobileMenu" style="z-index: 99999; color: var(--navigationLinkColor);" aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="32" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </a>
        </div>
        <ul class="navbar-nav flex-column flex-lg-row flex-wrap" role="menu" :class="{ 'justify-content-end': settings.navigationLayout === 'secondary' }">
          <template v-if="navigation && navigation.length">
            <li v-if="settings.navigationLayout === 'secondary'" class="nav-item search-field-menu d-block d-lg-none">
              <SearchField :search-rounded="false" />
            </li>
            <li class="nav-item" v-for="(nav, index) in navigation" role="menuitem" aria-haspopup="true" aria-expanded="true" :key="`nav${index}`" :class="[nav.dropdown && 'b-nav-dropdown dropdown', settings.navigationLayout != 'secondary' ? nav.align || 'left' : 'right', { 'd-flex d-lg-none top-menu-secondary': settings.navigationLayout === 'secondary' && nav.show_in_header == 1 },{'d-none' : (nav.target === 'departments' || nav.target === '/departments') && departmentsDisabled()},{'z-index-11' : (nav.target === 'departments' || nav.target === '/departments') && !departmentsDisabled()}]">
              <template v-if="!nav.dropdown && !nav.megamenu">
                <a v-if="nav.target && isUrl(nav.target)" :href="nav.target" :target="isLocalUrl(nav.target) ? '' : '_blank'" class="nav-link text-capitalize" :style="{fontSize: navFontSize}">
                  {{ nav.override || nav.name }}
                </a>
                <router-link v-else :to="nav.target ? nav.target : !nav.dropdown ? `/${nav.name}` : '/' | parseUrl" class="nav-link text-capitalize" :class="[{ 'home': nav.target == '/' }]" :style="{fontSize: navFontSize}">
                  {{ nav.override || nav.name }}
                </router-link>
              </template>
              <CustomDropdown :ref="`customDropdown-${index}`" v-else-if="nav.dropdown" :menu="nav.dropdown" :title="nav.override || nav.name" :target="nav.target" :search="(nav.target === 'departments' || nav.target === '/departments') && nav.dropdown.config && nav.dropdown.config.search" :style="{fontSize: navFontSize}">
                <li v-if="nav.target === 'departments' || nav.target === '/departments'" v-bind:tabindex="null" role="menuitem">
                  <router-link tabindex="0" to="/departments" class="py-2 px-lg-4 d-flex align-items-center justify-content-between">View all departments</router-link>
                </li>
              </CustomDropdown>
              <MegaMenu v-else-if="nav.megamenu" :menu="nav.megamenu" :title="nav.override || nav.name"  />
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
            <li class="nav-item right locations" v-if="showLocations">
              <a class="nav-link location-bt py-0" href="#" @click.prevent="showLocationModal">
                <div class="small text-capitalize text-md-right d-lg-none d-xl-block">
                  <div class="font-weight-bold" v-if="$store.state.currentStore">
                    {{ currentLocationName }}
                    <div class="mt-2 mt-md-0" v-if="settings.showLocationPhoneInNav">{{ $store.state.currentStore.phone }}</div>
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
            <li v-if="!settings.products.disableOrdering" class="nav-item right d-flex d-lg-none top-menu-secondary">
              <router-link class="nav-link" to="/cart">Cart</router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
  import AuthApiService from '@/api-services/auth.service';
  import AuthController from '@/controllers/auth.controller';
  import SearchField from "@/custom-pages/gerretsen/components/SearchField";
  import DepartmentsService from '@/api-services/departments.service';
  import CustomDropdown from '@/components/custom-dropdown';
  import MegaMenu from '@/components/mega-menu/menu';

  export default {
    name: 'MainNav',
    props: {
      showMobileMenu: { default: false },
    },
    components: {
      SearchField,
      CustomDropdown,
      MegaMenu
    },
    data() {
      return {
        loading: true,
        activeMenuMobile: null,
        selectedClass: null,
        selectedFineline: null,
        menuTimeoutDelay: 200
      };
    },
    computed: {
      // This function checks if the location dropdown should be shown in the navigation bar based on the settings object.
      showLocationsDropdownInNav() {
        // Check if the settings object and the locationSelector property exist in the navStyle property
        if (this.settings && this.settings.navStyle && this.settings.navStyle.locationSelector && typeof this.settings.navStyle.locationSelector.show != "undefined") {
          // Get the value of the show property in the locationSelector object
          let showLocations = this.settings.navStyle.locationSelector.show;
          // Check if the show property is an empty string, the string 'true', or a boolean true
          return (showLocations === '' || showLocations === 'true' || showLocations === true);
        }
        // If the settings object or the locationSelector property doesn't exist, show the location dropdown in the navigation bar by default
        return true;
      },
      showLocations() {
        return this.$store.state.storeLocations && this.$store.state.storeLocations.length && this.$store.state.storeLocations.length > 1 && this.settings.navigationLayout !== 'secondary' && this.showLocationsDropdownInNav;
      },
      isTruevalue() {
        return this.$root.$children[0].isTruevalue;
      },
      isAdmin() {
        return this.$root.$children[0].isAdmin;
      },
      phoneNumber() {
        return this.$store.state.businessDetails.business_telephone ? this.$store.state.businessDetails.business_telephone.replace(/\D/g, '') : '';
      },
      settings() {
        return this.$store.state.settings;
      },
      hideDepartmentSubHeaders() {
        return !!(this.settings.departments && this.settings.departments.hideHeadersInMenu);
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
        return this.$store.state.fullDepartmentResults ? this.$store.state.fullDepartmentResults.departments : [];
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
            elem.megamenu = i.megamenu;
            if(elem.sub_target) {
              elem.dropdown = null;
            }
          }
          i.dropdown && i.dropdown.items.forEach(e => e.target = e.link ? e.link : e.target);
          let final = elem && elem || i;
          final.target = final.sub_target ? final.sub_target : final.target;
          // seeing "brands" as a target which screws up if you're not on the homepage
          if(final.target === 'brands' || final.target === 'about-us') {
            final.target = `/${final.target}`;
          }
          if(final.target == '/paint-products') {
            let products = this.$store.state.paint && this.$store.state.paint.productCategories ? this.$store.state.paint.productCategories : [];
            final.dropdown = { items: [ ...products, { name: 'Browse Full Catalog', target: '/search' }] };
          }
          return final;
        });

        return finalNavigation.sort((a,b) => a.order > b.order ? 1 : b.order > a.order ? -1 : 0).sort((a,b) => a.align > b.align ? 1 : b.align > a.align ? -1 : 0);
      },
      navigationItems() {
        var showInStock = 1;
        if(this.settings.products.filterShowOutOfStock) {
          showInStock = 0;
        }
        // Mujtaba: use_multilevel_categories of businesses table is depreciated
        // Mujtaba: now we are using departments_hierarchy_level column for departments UI settings
        // const multiLevel = this.$store.state.businessDetails.use_multilevel_categories;

        let departments = this.departmentList.map(e => {
          let dRoute = 'department';
          // if(!multiLevel)
          //   e.children = [];
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

        let items = [
          { target: 'home' },
          {
            override: this.$store.state.businessDetails.business_telephone,
            target: `tel:${this.$store.state.businessDetails.business_telephone}`
          },
          { target: "brands" },
          { target: "rentals" },
          { target: "about us" },
          { target: "contact us" }
        ];
        if(departments && departments.length){
          items.splice(1,0,{
            target: '/departments',
            dropdown: {
              items: departments,
              config: {
                "search": true,
                "width": 500
              }
            },
          });
        }
        return items;
      },
      isMegaDropdown() {
        return true;
      },
      // This function gets the name of the current location based on the settings object and removes any text specified in the settings.
      currentLocationName() {
        // Check if the settings object, the navStyle property, the locationSelector property, and the removeText property exist
        if(this.settings && this.settings.navStyle && this.settings.navStyle.locationSelector && this.settings.navStyle.locationSelector.removeText) {
          // Replace the specified text with an empty string and return the modified current location name
          return this.$store.state.currentStore.name.replace(this.settings.navStyle.locationSelector.removeText,"");
        }
        // If the settings object or any of the required properties don't exist, return the current location name as is
        return this.$store.state.currentStore.name;
      },
      navFontSize(){
        if(this.settings && this.settings.navStyle && this.settings.navStyle.links && this.settings.navStyle.links.fontSize){
          return `${this.settings.navStyle.links.fontSize}px !important`;
        }
        return '';
      }
    },
    methods: {
      departmentsDisabled() {
        return this.$store.state.businessDetails.departments_hierarchy_level == 0;
      },
      isLocalUrl(target) {
        return target.includes(window.location.host);
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
      parsePhone(num) {
        return num ? num.replace(/\D/g, '') : '';
      },
      logout() {
        this.toggleMobileMenu();
        AuthApiService.logout().then(res => {
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
        }).catch(err => {
          this.$swal('Unknown error while logging out', '', 'error');
          console.log('err', err);
        });
        AuthController.logout();
        this.$store.dispatch('logout');
        this.$router.push({ name: 'index' }).catch(err => console.log(err));
      }
    },
    async mounted() {
      if(this.isAdmin)
        this.logger.addLogs({
          group: 'Navigation',
          global: true,
          data: [
            { label: 'products.filterShowOutOfStock', value: this.settings.products.filterShowOutOfStock },
            { label: 'showPhoneInNavigation', value: this.settings.showPhoneInNavigation },
            { label: 'emailNavLink', value: this.settings.emailNavLink }
          ]
        });

      if(!this.$store.state.paint.productCategories) {
        await this.$store.dispatch('setPaintCategories');
      }
      // only load top level departments with google=1 to reduce dom size
      await DepartmentsService.getAllDepartments(window.__EZ_PREGEN ? 1 : 0).then((ret) => {
        this.$store.commit('saveDepartments', ret.data.data.departments);
        this.$store.commit('saveFullDepartments', ret.data.data);

        let navItems = [...document.querySelectorAll('.nav-item.left')];
        if(navItems && navItems[navItems.length - 1]) {
          navItems[navItems.length - 1].classList.add('mr-0');
        }
      });
      this.loading = false;
    },
    watch: {
      showMobileMenu() {
        Object.entries(this.$refs).forEach(ob => {
          if(ob[0].substring(0, 14) == 'customDropdown') {
            if(ob[1][0])
              ob[1][0].reset();
          }
        });
      }
    }
  };
</script>


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
        color: white;
        font-size: 17px;
        padding: 12px 0;
        @media (max-width: 1240px) {
          font-size: 14px;
        }
        > div {
          display: none;
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
    background: var(--navigation);
    min-height: 46px;
    padding: 0 !important;
    color: var(--navigationLinkColor);
    width: 100%;
    border-top: 1px solid rgba(0,0,0,.07);
    > .container {
      overflow: visible;
    }
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
      cursor: default !important;
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
      gap: 0 1.2rem;
      li.nav-item {
        display: flex;
        align-items: center;
        cursor: pointer;
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
          margin-left: 0;
        }
        .nav-link {
          color: var(--navigationLinkColor);
          padding: 16px 0;
          font-size: var(--navigationFontSize);
          line-height: 1.3;
          letter-spacing: 0.2px;
          position: relative;
          display: flex;
          align-items: center;
          > a {
            color: var(--navigationLinkColor) !important;
          }
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
          &.router-link-exact-active::after {
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
          > a {
            display: flex;
          }
        }
        a.nav-link:hover {
          color: var(--navigationLinkColor);
        }
        .user-name {
          font-weight: bold;
          font-size: 14px;
        }
        .location-bt {
          line-height: 14px;

          span {
            @media (max-width: 991px) {
              margin-top: 12px;
              display: block;
              text-align: left;
              opacity: 0.7;
              font-size: 16px;
              text-transform: capitalize;
              font-weight: normal;
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
      > .container {
        overflow: auto;
      }
      top: 0;
      left: 0;
      width: calc(var(--vw, 1vw) * 100);
      height: calc(var(--vh, 1vh) * 100);
      z-index: 1;
      transition: opacity .3s;
      display: block;
      position: fixed;
      z-index: 10;
      &.collapsed {
        opacity: 0;
        height: 0;
        min-height: 0;
        overflow: hidden;
        pointer-events: none;
      }
      &.showLocations {
        .navbar-nav {
          margin-top: -40px;
        }
      }
      .navbar-nav {
        li.nav-item {
          margin: 0 0 20px 0 !important;
          > * {
            font-size: 16px;
          }
          &:not(.right) {
            margin-right: 20px;
          }
          .phone {
            > .phone-text {
              display: inline-block;
            }
          }
          .nav-link {
            justify-content: space-between;
            padding: 14px 0 !important;
            font-size: 22px;
            svg {
              transform: scale(1.5);
            }
            a {
              font-size: 22px;
            }
            &::after {
              border-bottom: none;
            }
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

    .locations {
      order: -2;
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
  .z-index-11{
    z-index: 11;
  }
</style>


<style v-if="settings.layout && settings.layout == 'secondary'" lang="scss">
#app {
  > .alert {
    border-bottom: 2px solid #fff !important;
  }
}
</style>
