<template>
  <header class="main-header flex-column" ref="mainHeader" :class="`${settings.navigationLayout ? settings.navigationLayout : ''} ${getBusinessNameClass}`">
    <div class="container justify-content-between">
      <!-- Hamburger (mobile only) -->
      <a v-if="settings.navigationLayout !== 'secondary'" href="#" @click.prevent="toggleMobileMenu" class="d-block nav-icon d-lg-none" :class="{'opened': showMobileMenu}" :style="{marginTop: hamburguerMarginTop}" aria-label="Menu">
        <span></span>
      </a>
      <!-- Brand -->
      <div class="d-flex align-items-center">
        <a :href="settings.logoLink || '/'" class="brand text-white" aria-label="Home">
          <img class="brand-logo-image mr-md-3 mr-0 aa" :src="settings.logo || '/images/truevalue.svg'"
               :alt="settings.businessName" :style="logoStyle()">
        </a>
        <template v-if="isTruevalue && showLocationsDropdown">
          <a v-if="isMultiStore" @click.prevent="showLocationModal" href="#" class="text-logo align-items-center d-none d-md-flex">
            <strong>
              {{ $store.state.currentStore ? $store.state.currentStore.name : settings.businessName }}
              <i class="fa fa-caret-down text-blue"></i>
            </strong>
          </a>
          <span v-else class="text-logo d-none d-md-flex">
            <strong :style="{ color: settings.colors.storeColor ? settings.colors.storeColor : ''}">
              {{ $store.state.currentStore ? $store.state.currentStore.name : settings.businessName }}
            </strong>
          </span>
        </template>
      </div>
      <div class="search-wrapper flex-grow-1 justify-content-center align-items-center flex-column flex-md-row" @mouseenter="showSearch" @mouseleave="hideSearch" :class="[{ 'wide': isSearching }, { 'd-none d-lg-flex': settings.navigationLayout === 'secondary' }, { 'd-flex': settings.navigationLayout !== 'secondary' }]">
        <span class="text-logo align-items-center d-flex d-md-none mb-2">
          <!-- <img v-if="settings.logo" class="brand-logo-image mr-2" :src="settings.logo" :alt="settings.businessName" :style="logoStyle()"> -->
          <a v-if="isMultiStore" @click.prevent="showLocationModal" href="#" class="text-logo align-items-center">
            <strong>
              {{ $store.state.currentStore ? $store.state.currentStore.name : settings.businessName }}
              <i class="fa fa-caret-down text-blue"></i>
            </strong>
          </a>

          <span v-else class="text-logo">
            <strong>
              {{ $store.state.currentStore ? $store.state.currentStore.name : settings.businessName }}
            </strong>
          </span>
        </span>

        <div v-if="!settings.products.disableSearchBar" class="search d-flex">
          <form role="search" @submit.prevent="toSearchPage(null, null)">
            <search-suggestions-main-header id="search-header" @onFocus="searchInputFocus" @onBlur="searchInputBlur" @onSelected="searchInputSelected" @onSuggestion="onSuggestion" @onInputChange="onSearchInputChange" />
            <button type="submit" class="btn-search-custom" aria-label="Search">
              <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><filter x="-8.1%" y="-113.8%" width="116.2%" height="327.5%" filterUnits="objectBoundingBox"><feMorphology radius=".5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"/><feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="15" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0.13236882 0 0 0 0 0.171002098 0 0 0 0 0.285297781 0 0 0 0.04 0" in="shadowBlurOuter1"/></filter><rect  x="0" y="0" width="560" height="40" rx="20"/></defs><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M-884-28H556v1536H-884z"/><g transform="translate(-529 -11)"><use fill="#000" filter="url(#a)" xlink:href="#b"/><use stroke="#F0F0F0" fill="#FFF" xlink:href="#b"/></g><g stroke-width="2" transform="translate(1 1)" stroke="#F46526" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="6"/><path d="M14 14l-3.758-3.758"/></g></g></svg>
            </button>
          </form>
        </div>
      </div>
      <!-- User options -->
      <div v-if="$store.state.storeLocations && $store.state.storeLocations.length && $store.state.storeLocations.length > 1 && settings.navigationLayout === 'secondary' && $store.state.currentStore" class="nav-item right mr-4 d-inline-block d-lg-none">
        <a @click.prevent="showLocationModal" href="#" class="d-flex align-items-center secondary-location-dropdown" aria-label="Open Location Modal">
          <svg width="11px" height="14px" viewBox="0 0 11 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <path d="M4.71045312,13.7175391 C0.737460937,7.95787891 0,7.36676172 0,5.25 C0,2.35049609 2.35049609,0 5.25,0 C8.14950391,0 10.5,2.35049609 10.5,5.25 C10.5,7.36676172 9.76253906,7.95787891 5.78954687,13.7175391 C5.52882422,14.0941719 4.97114844,14.0941445 4.71045312,13.7175391 Z M5.25,7.4375 C6.45812891,7.4375 7.4375,6.45812891 7.4375,5.25 C7.4375,4.04187109 6.45812891,3.0625 5.25,3.0625 C4.04187109,3.0625 3.0625,4.04187109 3.0625,5.25 C3.0625,6.45812891 4.04187109,7.4375 5.25,7.4375 Z" id="Shape" fill="#565656" fill-rule="nonzero"></path>
            </g>
          </svg>
          <span class="d-none d-md-inline-block">You're shopping</span>
          <strong class="ml-0 ml-md-1">{{ $store.state.currentStore.name }}</strong>
          <svg class="ml-2 mr-0" width="10" height="6" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M-226-22h1440v1459H-226z"/><path d="M-226-24h1440v53H-226z"/><path d="M7.5 1.5l-3 3-3-3" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></svg>
        </a>
      </div>
      <nav class="navbar w-auto d-none d-lg-inline-block" v-if="settings.navigationLayout == 'secondary' && navigation">
        <ul class="navbar-nav flex-column flex-md-row">
          <li v-if="$store.state.storeLocations && $store.state.storeLocations.length && $store.state.storeLocations.length > 1 && settings.navigationLayout === 'secondary' && $store.state.currentStore" class="nav-item right">
            <a @click.prevent="showLocationModal" href="#" class="d-flex align-items-center secondary-location-dropdown" aria-label="Open Location Modal">
              <svg width="11px" height="14px" viewBox="0 0 11 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <path d="M4.71045312,13.7175391 C0.737460937,7.95787891 0,7.36676172 0,5.25 C0,2.35049609 2.35049609,0 5.25,0 C8.14950391,0 10.5,2.35049609 10.5,5.25 C10.5,7.36676172 9.76253906,7.95787891 5.78954687,13.7175391 C5.52882422,14.0941719 4.97114844,14.0941445 4.71045312,13.7175391 Z M5.25,7.4375 C6.45812891,7.4375 7.4375,6.45812891 7.4375,5.25 C7.4375,4.04187109 6.45812891,3.0625 5.25,3.0625 C4.04187109,3.0625 3.0625,4.04187109 3.0625,5.25 C3.0625,6.45812891 4.04187109,7.4375 5.25,7.4375 Z" id="Shape" fill="#565656" fill-rule="nonzero"></path>
                </g>
              </svg>
              <span>You're shopping</span>
              <strong class="ml-1">{{ $store.state.currentStore.name }}</strong>
              <svg class="ml-2 mr-0" width="10" height="6" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M-226-22h1440v1459H-226z"/><path d="M-226-24h1440v53H-226z"/><path d="M7.5 1.5l-3 3-3-3" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></svg>
            </a>
          </li>
          <li class="nav-item right" v-for="(nav, key) in navigation" :key="`nav${key}`" :class="[nav.dropdown && 'b-nav-dropdown dropdown']">
            <template v-if="!nav.dropdown">
              <a v-if="nav.target && isUrl(nav.target)" :href="nav.target" class="nav-link">
                <svg v-if="nav.name === 'Location'" width="11px" height="14px" viewBox="0 0 11 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g data-v-12689952="" id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path data-v-12689952="" d="M4.71045312,13.7175391 C0.737460937,7.95787891 0,7.36676172 0,5.25 C0,2.35049609 2.35049609,0 5.25,0 C8.14950391,0 10.5,2.35049609 10.5,5.25 C10.5,7.36676172 9.76253906,7.95787891 5.78954687,13.7175391 C5.52882422,14.0941719 4.97114844,14.0941445 4.71045312,13.7175391 Z M5.25,7.4375 C6.45812891,7.4375 7.4375,6.45812891 7.4375,5.25 C7.4375,4.04187109 6.45812891,3.0625 5.25,3.0625 C4.04187109,3.0625 3.0625,4.04187109 3.0625,5.25 C3.0625,6.45812891 4.04187109,7.4375 5.25,7.4375 Z" id="Shape" fill="#565656" fill-rule="nonzero"></path></g></svg>
                {{ nav.override || nav.name }}
              </a>
              <router-link v-else :to="nav.target ? nav.target : !nav.dropdown ? `/${nav.name}` : '/' | parseUrl" class="nav-link">
                {{ nav.override || nav.name }}
              </router-link>
            </template>
            <template v-else>
              <div class="nav-link">
                {{ nav.override || nav.name }}
                <div>
                  <svg class="ml-1" width="10" height="6" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M-226-22h1440v1459H-226z"/><path d="M-226-24h1440v53H-226z"/><path d="M7.5 1.5l-3 3-3-3" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></svg>
                </div>
              </div>
              <ul class="dropdown-menu" v-if="nav.dropdown" :style="{minWidth: '100px'}">
                <li class="d-flex d-md-flex" v-if="nav.dropdown.config && nav.dropdown.config.search">
                  <input type="text" placeholder="Search..." class="form-control search-input" v-model="departmentDropdownSearch">
                </li>
                <li v-for="(d, key) in nav.dropdown.items" :key="d.name+'-'+key">
                  <a v-if="d.target && isUrl(d.target)" :href="d.target" class="dropdown-item">
                    {{ d.override || d.name || d.title }}
                  </a>
                  <router-link v-else :to="`${d.target || '/' + (d.name | parseUrl)}`" class="dropdown-item">{{d.name}}</router-link>
                </li>
              </ul>
            </template>
          </li>
        </ul>
      </nav>

      <div id="logged-user" class="d-none d-lg-block mx-4" v-if="activeUser" v-click-outside="hideDropdown" @click.prevent="showDropDown = !showDropDown">
        <template v-if="settings.navigationLayout !== 'secondary'">
          <a href="#">
            <span class="d-none d-md-flex align-items-center">
              <svg class="mr-2" width="17" height="17" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)" stroke="#FFF" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="5.5" r="2.5"/><path d="M12.453 13.121a5.491 5.491 0 00-9.906 0"/><circle cx="7.5" cy="7.5" r="7.5"/></g></svg>
              {{ activeUser.data.customer.first_name ? (activeUser.data.customer.first_name + ' ' + activeUser.data.customer.last_name) : 'Admin' }}
              <svg class="ml-2" width="10" height="6" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 1L5 5l3.5-4" stroke="#FFF" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
          </a>
          <template v-if="activeUser && activeUser.is_admin" name="slide">
            <ul class="account-setting-dropdown" v-if="showDropDown">
              <li @click="hideDropdown">
                <router-link class="dropdown-item" to="/admin/orders">
                  Orders
                </router-link>
              </li>
              <li @click="hideDropdown">
                <router-link class="dropdown-item" to="/admin/emails">
                  Emails
                </router-link>
              </li>
              <li @click="hideDropdown">
                <router-link class="dropdown-item" to="/admin/featured">
                  Featured Products
                </router-link>
              </li>
              <li @click="hideDropdown">
                <router-link class="dropdown-item" to="/admin/settings">
                    Settings
                </router-link>
              </li>
              <li @click="hideDropdown">
                <a class="dropdown-item mr-4" @click="logout">
                  Logout
                </a>
              </li>
            </ul>
          </template>
          <template v-else name="slide">
            <ul class="account-setting-dropdown" v-if="showDropDown">
              <li @click="hideDropdown">
                <router-link class="dropdown-item" to="/account">
                  Account Info
                </router-link>
              </li>
              <li @click="hideDropdown">
                <router-link class="dropdown-item" to="/orders">
                  Orders
                </router-link>
              </li>
              <li @click="hideDropdown">
                <a class="dropdown-item mb-2 mr-4" @click="logout">
                  Logout
                </a>
              </li>
            </ul>
          </template>
        </template>

        <template v-else>
          <router-link to="/account">My Account</router-link>
        </template>
      </div>
      <div v-else-if="(!settings.registrationOptions || !settings.registrationOptions.hideFromHeader) && !allFulfillmentDisabled" id="authorization" class="d-lg-flex d-none">
        <div class="d-flex flex-lg-row align-items-center mx-4">
          <router-link class="text-uppercase font-weight-bold" to="/login">Sign In</router-link>
          <span class="my-n1 my-lg-0 mx-2 font-italic">or</span>
          <router-link class="text-uppercase font-weight-bold" to="/register">Sign Up</router-link>
        </div>
      </div>
      <!-- Cart / Admin (button) -->
      <router-link v-if="activeUser && activeUser.is_admin" to="/admin" class="btn btn-view btn-outline-primary">Admin <span class="d-none d-sm-inline ml-1">side</span></router-link>
      <a href="/cart" v-else-if="!settings.products.disableOrdering && !allFulfillmentDisabled" class="cart-btn cursor-pointer" :class="whileAdding?'adding':''">
        <svg :class="{'white' : isHeaderBlack}" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)" fill="none" fill-rule="evenodd"><circle fill="#000" fill-rule="nonzero" cx="4.235" cy="17.788" r="1"/><circle fill="#e31b23" fill-rule="nonzero" cx="16.094" cy="17.788" r="1"/><circle stroke="#e31e24" stroke-width="1.694" stroke-linecap="round" stroke-linejoin="round" cx="4" cy="17" r="1"/><circle stroke="#e31b23" stroke-width="1.694" stroke-linecap="round" stroke-linejoin="round" cx="16" cy="17" r="1"/><path d="M0 0h2.571v11.25c0 .966.768 1.75 1.715 1.75H18" stroke="#e31b23" stroke-width="1.694" stroke-linecap="round" stroke-linejoin="round"/><path stroke="#e31b23" stroke-width="1.694" stroke-linecap="round" stroke-linejoin="round" d="M3 3h14l-1.647 7H3"/></g></svg>
        <span v-if="cart" class="cart-badge badge badge-pill badge-danger" :class="{'badge-stroke':whileAdding, 'bg-white text-dark' : isHeaderBlack}">{{ cartAmount }}</span>
      </a> 
      <div v-else class="d-block d-md-none cart-placeholder"></div>
      <!-- Hamburger (mobile only) -->
      <a v-if="settings.navigationLayout === 'secondary'" href="#" @click.prevent="toggleMobileMenu" class="d-block nav-icon d-lg-none" :class="{'opened': showMobileMenu}" :style="{marginTop: hamburguerMarginTop}" aria-label="Menu">
        <span></span>
      </a>
    </div>

  </header>
</template>

<script>
import { debounce } from 'debounce';
import AuthApiService from '@/api-services/auth.service';
import AuthController from '@/controllers/auth.controller';
import TrackerApiService from '@/api-services/tracker.service';
import searchSuggestionsMainHeader from '@/components/search-suggestions-main-header';
import _ from 'lodash';

let searchHideDelay = null;

export default {
  name: 'Header',
  props: {
    showMobileMenu: { default: false }
  },
  components: {
    searchSuggestionsMainHeader
  },
  data() {
    return {
      departmentDropdownSearch: '',
      isSearching: false,
      searchKey: null,
      showDropDown: false,
      inputProps: {
        id: 'search',
        onInputChange: this.getSuggestions,
        placeholder: 'Enter what you\'re looking for',
        class: 'form-control',
        name: 'search',
        'aria-label': 'search',
        title: 'search',
        inputmode: 'search'
      },
      locations: this.$store.state.settings.footer.locations,
      sectionConfigs: {
        // default section handles pressing Enter with nothing selected.
        // after merging merged-project into SEO pressing Enter stopped working. had to add this.
        // doesn't appear to render a blank section so it should be ok.
        default: {
          limit: 0,
          label: '',
          onSelected: () => {
            this.toSearchPage();
          }
        },
        products: {
          limit: 10,
          label: 'Products',
          onSelected: selected => {
            this.searchKey = "";
            this.$refs.autocomplete.searchInput = "";
            this.$router.push({
              name: 'products-slug',
              params: {
                slug: selected.item.slug
              }
            }).catch(err => console.log(err));
          }
        },
        departments: {
          limit: 2,
          label: "Departments",
          onSelected: selected => {
            this.$router.push({
              //name: 'department-products',
              //params: { id: selected.item.dept_id, title: this.$ezSlugify(selected.item.name) },
              name: 'department-products-slug',
              params: { slug: this.$ezSlugify(selected.item.name) + '-' + selected.item.dept_id },
              query: { name: selected.item.name }
            }).catch(err => console.log(err));
          }
        },
        brands: {
          limit: 2,
          label: "Brands",
          onSelected: selected => {
            this.searchKey = "";
            this.$refs.autocomplete.searchInput = "";
            let showInStock = this.settings.products.filterShowOutOfStock ? '0' : '1';
            this.$router.push({
              name: 'brands-id',
              params: { id: this.$ezSlugify(selected.item.brand_name) + '-' + selected.item.brand_id },
              query: { in_stock_only: showInStock }
            }).catch(err => console.log(err));
          }
        }
      }
    };
  },
  mounted() {
    if (this.settings.navigationLayout === 'secondary') {
      let offset = this.updateMobileNavHeight;
      document.querySelector('.navbar').style.paddingTop = offset;
      document.querySelector('.navbar').style.top = 'unset !important';
    }
    if(this.$root.$children[0].isAdmin)
      this.logger.addLog('Header', { label: 'settings.navigationLayout', value: this.settings.navigationLayout, global: true });
  },
  computed: {
    isTruevalue() {
      return this.$root.$children[0].isTruevalue;
    },
    isMultiStore() {
      return this.$store.state.storeLocations && this.$store.state.storeLocations.length && this.$store.state.storeLocations.length > 1;
    },
    logger() {
      return this.$root.$children[0].$refs.logger;
    },
    settings() {
      return this.$store.state.settings;
    },
    getBusinessNameClass() {
      let name = this.settings.businessName;
      return _.camelCase(name);
    },
    navigation() {
      let customNavigation = this.$store.state.customNavigation;
      if(this.$store.state.currentStore && this.$store.state.currentStore.id) {
        customNavigation = customNavigation.filter(x => !x.hide_on_locations || (x.hide_on_locations && !x.hide_on_locations.split(',').map(x => x*1).includes(this.$store.state.currentStore.id)));
      }
      let finalNavigation = customNavigation;

      finalNavigation.forEach(n => {
        if (n.path === '/home') {
          n.path = '/';
          n.target = '/';
        }
      });

      this.createDepartmentTargets();

      return finalNavigation.filter(e => this.settings.navigationLayout == 'secondary' ? e.show_in_header == 1 : e);
    },
    departmentList() {
      if(this.$store.state.departmentResults)
        return this.$store.state.departmentResults.parent_departments;
      return [];
    },
    filteredDepartmentList() {
      if (this.departmentList && this.departmentList.length) {
        return this.departmentList.filter(department => {
          return department.name.toLowerCase().includes(this.departmentDropdownSearch.toLowerCase());
        });
      }

      return [];
    },
    hamburguerMarginTop() {
      return this.elmTop('mainHeader');
    },
    isMobile() {
      return window.innerWidth <= 576;
    },
    cart() {
      return this.$store.state.cart;
    },
    headerOffsetTop() {
      return this.$refs.mainHeader.offsetTop;
    },
    cartAmount() {
      return this.$store.state.cartItemCount;
    },
    activeUser() {
      return this.$store.state.activeUser;
    },
    whileAdding() {
      return this.$store.state.addingToCart;
    },
    updateMobileNavHeight() {
      let offset = this.elmTop('mainHeader');
      return offset;
    },
    businessDetails() {
      return this.$store.state.businessDetails;
    },
    allFulfillmentDisabled() {
      return !this.businessDetails.pickup_enabled && !this.businessDetails.delivery_enabled && !this.businessDetails.shipping_enabled;
    },
    showLocationsDropdown() {
    // This function checks if the location dropdown should be shown based on the settings object.
      // Check if the settings object and the locationSelector property exist in the header property
      if (this.settings && this.settings.header && this.settings.header.locationSelector) {
        // Get the value of the show property in the locationSelector object
        let showLocations = this.settings.header.locationSelector.show;
        // Check if the show property is an empty string, the string 'true', or a boolean true
        return (showLocations === '' || showLocations === 'true' || showLocations === true);
      }
      // If the settings object or the locationSelector property doesn't exist, show the location dropdown by default
      return true;
    },
    isHeaderBlack() {
      return this.$store.state.settings && this.$store.state.settings.colors && this.$store.state.settings.colors.header === '#000000';
    }
  },
  methods: {
    createDepartmentTargets() {
      var showInStock = this.settings.products.filterShowOutOfStock ? 0 : 1;

      this.filteredDepartmentList.map(e => {
        e.target = `/department/${e.dept_id}/${e.name.replace(/\//g, ' ')}?in_stock_only=` + showInStock;
        return e;
      });
    },
    showSearch() {
      clearTimeout(searchHideDelay);

      this.isSearching = true;
    },
    parseUrl(val) {
      return this.$options.filters.parseUrl(val);
    },
    hideSearch() {
      searchHideDelay = setTimeout(() => this.isSearching = false, 500);
    },
    elmTop(selector) {
      let arr = document.querySelectorAll(selector);
      if(this.showMobileMenu) {
        if(arr && arr.length) {
          let offset = arr.length == 1 ? arr[0].getBoundingClientRect().height : [...arr].reduce((a, b) => a.getBoundingClientRect().height + b.getBoundingClientRect().height);
          return `-${offset}px`;
        }
      }
      return 0;
    },
    isUrl(val) {
      return this.$options.filters.isUrl(val);
    },
    logoStyle() {
      var logoObj = {};
      if(!this.settings.logoMaxWidth && !this.settings.logoMaxHeight) {
        return {};
      }

      if(this.settings.logoMaxWidth){
        logoObj.maxWidth = this.settings.logoMaxWidth;
      }
      if(this.settings.logoMaxHeight){
        logoObj.maxHeight = this.settings.logoMaxHeight;
      }
      if ( !this.settings.logo ) {
        // force width and height in the common case of truevalue.svg
        logoObj.width = '180px';
        logoObj.height = '36px';
      }
      return logoObj;
    },
    toSearchPage(id, type, ai_suggestion = null) {      
      let showInStock = this.settings.products.filterShowOutOfStock ? 0 : 1;
      let sortBy = this.$route.query.sort || this.settings.products.defaultSorting;
      this.searchKey = this.searchKey || '""';
      if(ai_suggestion != null) {
        this.searchKey = ai_suggestion;
      }
      if (this.searchKey || (id && type)) {
        this.$store.dispatch("clearSearch");
        if(id) {
          const params = {
            search: "''",
            sort: sortBy,
            page: 1,
            in_stock_only: showInStock
          };
          if(type) {
            if (type === 'brand')
              params['brands[]'] = id;
            else
              params.dept_id = id;
          }
          this.$store.dispatch("search", params);
        } else {
          this.$store.dispatch("search", {
            search: this.searchKey,
            sort: sortBy,
            page: 1,
            in_stock_only: showInStock
          });
        }
        TrackerApiService.trackSearch(this.searchKey);
        const queryParams = {
          keyword: this.searchKey,
          limit: this.$store.state.settings.products.itemsPerPage || 96,
          sort: sortBy,
          in_stock_only: showInStock
        };
        if(this.settings.products.showThreeFiveDays){
          queryParams.avail_35 = 1;
        }
        if(this.settings.products.showThreeFiveDays){
          queryParams.avail_35 = 1;
        }
        if (id) {
          queryParams.keyword = "''";
          if (type === 'brand') {
            queryParams['brand_id'] = id;
          } else {
            queryParams['dept_id'] = id;
          }
        }
        let sreachRoute = {};
        if(this.searchKey == '""') {
          sreachRoute.path = '/search';  
        } else {
          sreachRoute.name = 'search'; // idk why but when searchKey is empty, it doesn't work with named route
        }      
        this.$router.push({
          ...sreachRoute,
          ...{ params: {dummy: this.$ezSlugify(this.searchKey)}, query: queryParams }
        }).catch(err => console.log(err));  
      }
    },
    hideDropdown() {
      this.showDropDown = false;
    },
    logout() {
      AuthApiService.logout()
      .then(res => {
        if (res.data.status == "success") {
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
        AuthController.logout();
        this.$store.dispatch('logout');
        this.$router.push({ name: 'index' }).catch(err => console.log(err));
      })
      .catch(() => {
        this.$swal('Unknown error while logging out', '', 'error');
      });
      AuthController.logout();
      this.$store.dispatch('logout');
      if (this.$router.currentRoute.name !== 'index') {
        this.$router.push({ name: 'index' });
      }
    },
    toggleMobileMenu() {
      this.$emit('toggleMobileMenu', this.showMobileMenu);
    },
    searchInputFocus() {
      let targetScroll = document.getElementById('search-header-autosuggest').getBoundingClientRect().top - 10;
      this.isSearching = true;
      this.isMobile && window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    },
    searchInputBlur() {
      this.hideSearch();
      this.isMobile && window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onSuggestion(text) {
      if(text == '' || text == undefined) return;
        this.searchKey = text;
    },
    searchInputSelected(selected) {
      if(!selected) {
        this.toSearchPage();
        return;
      }
      const showInStock = this.settings.products.filterShowOutOfStock ? '0' : '1';
      switch(selected.name) {
        case 'products':
          this.searchKey = "";
          this.$router.push({
            name: 'products-id',
            params: {
              id: selected.item.sku,
              title: selected.item.title.replace(/[ /]/g, '+')
            }
          }).catch(err => console.log(err));
          break;
        case 'departments':
          this.$router.push({
            name: 'department-products',
            params: { id: selected.item.dept_id, title: selected.item.name },
            query: { in_stock_only: showInStock }
          }).catch(err => console.log(err));
          break;
        case 'brands':
          this.searchKey = "";
          this.$router.push({
            name: 'brands-id',
            params: { id: this.$ezSlugify(selected.item.brand_name) + '-' + selected.item.brand_id },
            query: { in_stock_only: showInStock }
          }).catch(err => console.log(err));
          break;
        default:
          break;
      }
    },
    onSearchInputChange(searchKey) {
      this.searchKey = searchKey;
    },
    showLocationModal() {
      this.$parent.$emit('showLocationModal');
    }
  },
  watch: {
    searchKey: debounce(function() {
      //this.getSuggestions(newQuery);
    }, 250)
  }
};
</script>

<style lang="scss">
  .search-suggestion-footer {
    padding: 8px 16px;
    border-top: solid 1px #F0F0F0;
  }

  .search {

    form {
      position: relative;
      width: 100%;
    }

    .form-control {
      background: #FFFFFF;
      border: 1px solid #F0F0F0;
      box-shadow: 0 0 30px 0 rgba(34,44,73,0.04);
      height: 40px;
      font-size: 14px;
      padding-left: 15px;
      border-radius: 40px;
      &.not-rounded {
        border-radius: 5px !important;
      }

      @media (max-width: 767px) {
        font-size: 16px;
      }
    }

    .autosuggest__results {
      border-radius: 20px;
      background: #FFFFFF;
      border: 1px solid #F0F0F0;
      box-shadow: 0 0 30px 0 rgba(34,44,73,0.04);
      border-radius: .25rem;
      margin-top: 8px;

      .autosuggest__results_title {
        font-size: 14px;
        color: rgba(86,94,102,0.70);
        border-top-color: #F0F0F0;
      }

      .autosuggest__results_item {
        font-size: 14px;
      }
    }
  }

  .cart-placeholder {
    width: 40px;
    height: 40px;
  }

  .text-logo {
    position: relative;
    border: none;
    background: none;
    padding: 0;

    img {
      max-width: 60px;
      max-height: 60px;

      @media (max-width: 767px) {
        max-width: 88px;
      }
    }

    img + strong {
      font-size: 1rem;

      @media (max-width: 767px) {
        font-size: 1.3rem;
      }
    }

    strong {
      color: black;
      font-weight: bold;
      font-size: 1.3rem;
      line-height: 1.2;
      margin-top: 4px;

      @media (max-width: 767px) {
        font-size: 1.3rem;
        margin-top: 0;
      }

      @media (max-width: 375px) {
        font-size: 1rem;
      }
    }
  }

  .main-header.secondary {
    .autosuggest__results-container {
      display: none;
    }

    .wide {
      .autosuggest__results-container {
        display: block;
        top: -8px;
      }
    }

    .secondary-location-dropdown {
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 6px;
      font-size: 0.8125rem;
      transition: 200ms;
      margin-top: 3px;

      &:hover,
      &:active {
        background: rgba(255, 255, 255, 0.25);
        text-decoration: none;
      }
    }
  }

  @media (max-width: 767px) {
    nav.navbar.secondary {
      top: unset !important;
    }
    .search {
      .autosuggest__results {

        ul {
          &:first-child {
            max-height: 155px;
          }
        }

        .autosuggest__results_title {
          font-size: 13px;
        }

        .autosuggest__results_item {
          font-size: 13px;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
.main-header.secondary {
  .nav-icon {
    &:after,
    &:before,
    > span {
      background-color: #e31b23 !important;
      height: 3px;
      margin-top: 9px;
    }
  }

  .nav-item {
    svg {
      margin-right: 6px;
      width: 10px;
    }
  }
}

/*.main-header:not(.secondary) {
  .nav-icon {
    &.opened {
      &:before,
      &:after {
        height: 4px;
        margin: 8px 0;
        background: black;
      }
    }
  }
}*/

.nav-icon {
  width: 32px;
  transform: scale(.8);
  transition: margin-top .3s;
  margin-right: 12px;

  &:after,
  &:before,
  > span {
    content: '';
    display: block;
    height: 4px;
    margin: 5px 0;
    transition: all .2s ease-in-out;
    background-color: var(--headerLinkColor);
  }
  /*
  &.opened {
    top: 10px;
    &:before {
      transform: translateY(12px) rotate(135deg);
      background-color: var(--navigationLinkColor);
    }
    &:after {
      transform: translateY(-12px) rotate(-135deg);
      background-color: var(--navigationLinkColor);
    }
    span {
      transform: scale(0);
    }
  }*/
}
.main-header {
  font-size: 14px;
  background-color: var(--header);
  color: var(--headerText);
  display: flex;
  justify-content: center;

  @media (max-width: 767px) {
    .brand {
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        margin-right: 0;
      }

      strong {
        font-weight: 500;
        margin-top: 4px;
        font-size: 1rem;
      }
    }
  }

  > .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  &.secondary {
    a {
      text-decoration: none;
      transition: 200ms;

      &:hover,
      &:active {
        opacity: 0.8;
      }
    }
  }

  &:not(.secondary) {
    > .container {
      padding-top: 15px;
      padding-bottom: 15px;
    }

    @media (min-width: 768px) {
      .search-wrapper {
        margin: 0 24px;
      }
    }
  }

  a:not(.brand) {
    color: var(--headerLinkColor);
    display: flex;

    p {
      margin-right: 5px;
      margin-bottom: 0;
    }
  }

  .search-wrapper {
    position: relative;
    display: inline-flex;
    flex: 2;

    .search {
      width: 100%;
      max-width: 560px;
      position: relative;

      .search-bar {
        width: 100%;
      }
    }
  }

  .IZ-select__input:after {
    position: absolute;
    content: '\f002';
    display: block;
    color: #000;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
    font-family: FontAwesome;
  }

  .cart {
    padding: 6px 14px;
    font-size: 14px;
    line-height: 16px;
    font-weight: bold;
    color: #fff;
    img {
      margin-right: 3px !important;
    }
  }
  .cart-btn {
    transition: all .2s;
    position: relative;
    margin-right: 14px;
    .badge {
      background: var(--headerLinkColor);
      color: var(--headerLinkColorInv);
      position: absolute;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      top: -14px;
      right: -14px;
    }
    &.adding {
      transform: scale(1.05);
      transition: none;
      transition: all .1s;
      box-shadow: 0 13px 13px rgba(0,0,0,.1);
    }
    svg * {
      stroke: var(--headerLinkColor);
    }
    svg.white * {
      stroke: #fff;
    }
  }
  #logged-user {
    position: relative;
    a {
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      border: none;
      svg * {
        stroke: var(--headerLinkColor);
      }
      svg.white * {
        stroke: #fff;
      }
      &:focus {
        border: none;
      }
    }
    .account-setting-dropdown {
      position: absolute;
      top: 100%;
      right: unset;
      z-index: 1000;
      min-width: 10rem;
      padding: 0;
      margin-top: .125rem;
      list-style: none;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid rgba(0, 0, 0, 0.15);
      border-radius: 0.25rem;

      .dropdown-item {
        font-size: 14px;
        color: #212529;
        padding: 10px 14px;
        &:hover {
          background: var(--primary);
          color: #fff !important;
        }
      }
    }

  }
  .dropdown-item {
    cursor: pointer;
    padding: 10px;
    color: var(--primary);

    &:hover {
      background-color: var(--primary);
      color: #fff;
      > a {
        color: #fff;
      }
    }
    > a {
      text-decoration: none;
      color: var(--primary);
    }
  }
  .slide-enter-active,
  .slide-leave-active,
  .slide-move {
    transition: 1s cubic-bezier(0, 1, 0.5, 1);
    transition-property: opacity, transform;
  }
  .slide-enter {
    opacity: 0;
    transform: scaleY(0);
  }
  .slide-enter-to {
    opacity: 1;
    transform: scaleY(1);
    transform-origin: center top;
  }
  .slide-leave-to {
    opacity: 0;
    transform: scaleY(0.8);
    transform-origin: center top;
  }
  .btn-search-custom {
    padding: 8px;
    top: 0;
    right: 4px;
    position: absolute;
    border: none;
    background: none;
    padding-left: 5px;
    border-radius: 50%;
    &:not(.close) svg * {
      stroke: var(--primary);
    }
    &.close {
      height: 36px;
      padding: 0;
      top: 1px;
      right: 1px;
      width: 38px;
      opacity: 1;
      svg {
        margin-top: -1px;
      }
    }
  }
  .btn-view {
    background: rgba(255, 255, 255, 0.2);
  }
}
.break {
  flex-basis: 100%;
  width: 0;
  height: 0;
  overflow: hidden;
  order: 3;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;

  svg {
    width: 100%;
    max-width: 180px;
    margin-right: 12px;
  }

  > img {
    width: 100%;
    max-width: 180px;
    max-height: 180px;
  }
}

@media (min-width: 1600px) {
  .main-header {
    .search-wrapper {
      .search {
        max-width: 800px;
      }
    }
  }
}

@media (max-width: 767px) {
  .main-header {
    .search-wrapper {
      flex: 1 0 100%;
      order: 4;
      max-width: unset;
      margin-top: 12px;
      background: white;
      margin-left: -30px;
      margin-right: -30px;
      margin-bottom: -16px;
      padding: 8px;
      border-top: 1px solid #f0f0f0;

      .search {
        max-width: 100%;
      }
    }
    .search-suggestion-footer {
      font-size: 13px;
    }
  }
}

@media (max-width: 575px) {
  .main-header {
    .search-wrapper {
      margin-left: -15px;
      margin-right: -15px;
    }
  }
}

.main-header.secondary {
  height: 56px !important;

  > .container {
    justify-content: flex-end !important;
    position: relative;
  }
  .brand {
    position: absolute;
    z-index: 2;
    top: 56px;
    left: 30px;
  }
  .search-wrapper {
    order: 2;
    justify-content: flex-end !important;
    max-width: 41px;
    transition: all .3s;
    &:not(.wide) {
      :deep(.form-control) {
        border: none !important;
      }
    }
    &.wide {
      max-width: 400px;
    }
    &:hover {
      .autosuggest__results-container {
        display: block;
      }
    }
    .autosuggest__results-container {
      display: none;
      margin-top: -8px;
    }
    :deep(.search .form-control),
    :deep(.btn-search-custom) {
      background: none !important;
      color: #fff;
      border-color: #fff !important;
      box-shadow: none !important;
      border-radius: 40px;
      &:focus {
        border-color: #fff !important;
      }
      &.close {
        background: #000 !important;
      }
      svg * {
        background: #000 !important;
        fill: #000;
        stroke: #fff;
      }
    }
    .search-bar {
      min-height: 40px;
    }
  }
  .cart-btn {
    svg, .badge {
      display: none;
    }
    &::before {
      color: #fff;
      content: 'Cart';
    }
  }
  #authorization {
    margin-left: -5px;
    * {
      font-weight: normal !important;
      text-transform: none !important;;
      &:nth-child(2),
      &:nth-child(3) {
        display: none;
      }
    }
  }
  nav.navbar {
    top: unset !important;
    padding: 5px !important;
    background-color: var(--navigation);
    color: var(--navigationLinkColor);
    width: 100%;
    border-top: 1px solid rgba(0,0,0,.07);
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
          a {
            color: var(--navigationLinkColor) !important;
          }
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
          font-size: 14px;
          line-height: 14px;
          letter-spacing: 0.5px;
          position: relative;
          text-transform: capitalize;
          display: flex;
          align-items: center;
          a {
            color: var(--navigationLinkColor) !important;
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
          }

          &:focus,
          &:hover,
          &.router-link-exact-active {
            color: var(--navigationLinkColor) !important;
          }
        }
        a.nav-link:hover {
          color: var(--navigationLinkColor) !important;
        }
      }
      .user-name {
        font-weight: bold;
      }
      .location-bt {
        line-height: 14px;
      }
      .b-nav-dropdown svg * {
        stroke: var(--navigationLinkColor);
      }
      .dropdown-menu {
        margin-top: -2px;
        max-height: calc(100vh - 200px);
        min-width: 435px;
        overflow: auto;
        font-size: 14px;
        position: absolute;

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
      .dropdown:hover {
        .dropdown-menu {
          display: block;
        }
      }
    }
  }
}

.car-btn {
  span.cart-badge {
    background-color: #e31b23 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
}

@media (max-width: 375px) {
  .main-header {
    .cart {
      padding: 6px;
    }

    .btn-view {
      padding: 8px;
    }
  }
}

@media (max-width: 991px) {
  .main-header.secondary {
    border-bottom: 3px solid var(--primary);
    height: 75px !important;

    .cart-btn svg,
    .cart-btn .badge {
      display: inline-block;
      margin-right: 15px;
    }

    .cart-btn::before {
      display: none;
    }

    .cart-btn .badge {
      background-color: #e31b23;
      color: white;
    }

    .brand-logo-image {
      max-width: 52px;
    }

    .brand {
      top: -5px;
    }
  }

  .brand {
    z-index: 0;
    top: 0;
  }

  .cart-btn {
    color: #fff;
  }
  .cart-badge {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }

}

.secondary {
  &#mainHeader {
    @media (min-width: 992px) {
      .container {
        padding-top: 8px;
      }
    }
  }
}

.text-blue {
  color: #176db7;
  margin-left: 4px;
  font-size: 16px;
}

@media (max-width: 475px) {
  .brand-logo-image{
    max-width: 40vw !important;
  }
}

</style>
