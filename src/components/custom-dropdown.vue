<template>
  <div ref="dropdown" tabindex="0" class="c-dropdown h-100" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" @keypress="onKeyPress" @focusout="onBlur" @keydown="onKeyDown">
    <div tabindex="-1" class="h-100 d-flex align-items-center main-link justify-content-between cursor-pointer" @click="navigate('main')">
      <router-link tabindex="-1" class="nav-link text-capitalize" v-if="(target && !isMobile)" :to="target" :style="{fontSize: navFontSize}">{{ title }}</router-link>
      <div class="nav-link text-capitalize" v-else>{{ title }}</div>
      <div>
        <svg class="ml-1 caret" width="10" height="6" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path data-v-37000717="" d="M-226-22h1440v1459H-226z"></path><path data-v-37000717="" d="M-226-24h1440v53H-226z"></path><path data-v-37000717="" d="M7.5 1.5l-3 3-3-3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></g></svg>
      </div>
    </div>
    <template v-if="filteredMenu.children">
      <div v-if="!isMobile" class="c-dropdown-menu" ref="firstMenu" :class="{ 'visible' : isVisible }">
        <div class="ul ul-1 border">
          <ul class="p-0 pt-2 pb-3" ref="ul1" role="menu">
            <slot></slot>
            <li class="p-3 text" v-if="search && !filteredMenu.children.length">
              there are no results for {{ searchQuery }}...
            </li>
            <li v-for="(item, i) in filteredMenu.children" :tabindex="`${i+1}`" role="menuitem" aria-haspopup="true" aria-expanded="true"  :key="`item-${i}`" @keydown.enter.prevent.stop="openMenu(item.dept_id)" @mouseenter="openMenu(item.dept_id)" @focus="openMenuFocus(item.dept_id)">
              <router-link v-bind:tabindex="null" v-if="!isUrl(item.target)" :to="item.target" class="text-capitalize py-2 px-md-4 d-md-flex d-inline-flex align-items-center justify-content-between">
                <span v-html="parseName(item.name)"></span>
                <svg class="ml-3 caret" v-if="item.children && item.children.length" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292787 9.70692C0.105316 9.51939 0 9.26508 0 8.99992C0 8.73475 0.105316 8.48045 0.292787 8.29292L3.58579 4.99992L0.292787 1.70692C0.110629 1.51832 0.00983372 1.26571 0.0121121 1.00352C0.0143906 0.741321 0.11956 0.490509 0.304968 0.305101C0.490376 0.119692 0.741189 0.0145233 1.00339 0.0122448C1.26558 0.00996641 1.51818 0.110761 1.70679 0.292919L5.70679 4.29292C5.89426 4.48045 5.99957 4.73475 5.99957 4.99992C5.99957 5.26508 5.89426 5.51939 5.70679 5.70692L1.70679 9.70692C1.51926 9.89439 1.26495 9.99971 0.999786 9.99971C0.734622 9.99971 0.480314 9.89439 0.292787 9.70692Z" fill="currentColor"/></svg>
              </router-link>
              <a v-else v-bind:tabindex="null" :href="item.target" class="text-capitalize py-2 px-md-4 d-md-flex d-inline-flex align-items-center justify-content-between" target="_blank">
                <span v-html="parseName(item.name)"></span>
                <svg class="ml-3 caret" v-if="item.children && item.children.length" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292787 9.70692C0.105316 9.51939 0 9.26508 0 8.99992C0 8.73475 0.105316 8.48045 0.292787 8.29292L3.58579 4.99992L0.292787 1.70692C0.110629 1.51832 0.00983372 1.26571 0.0121121 1.00352C0.0143906 0.741321 0.11956 0.490509 0.304968 0.305101C0.490376 0.119692 0.741189 0.0145233 1.00339 0.0122448C1.26558 0.00996641 1.51818 0.110761 1.70679 0.292919L5.70679 4.29292C5.89426 4.48045 5.99957 4.73475 5.99957 4.99992C5.99957 5.26508 5.89426 5.51939 5.70679 5.70692L1.70679 9.70692C1.51926 9.89439 1.26495 9.99971 0.999786 9.99971C0.734622 9.99971 0.480314 9.89439 0.292787 9.70692Z" fill="currentColor"/></svg>
              </a>
              <div class="c-dropdown-menu" tabindex="-1" v-if="item.children && item.children.length" :ref="`menu-${item.dept_id}`" :class="{ 'visible' : currentMenu == item.dept_id }" @focusout="onMenuBlur" @mouseleave="onMenuBlur">
                <div class="ul ul-2" tabindex="-1" :style="{ height: `${targetHeight}px` }">
                  <ul class="p-0 pt-2 pb-3" ref="ul2" tabindex="-1" role="menu">
                    <li v-for="(child, j) in item.children" :tabindex="`${j+1}`" role="menuitem" aria-haspopup="true" aria-expanded="true"  :key="`child-${j}`" @keydown.enter.prevent.stop="openSubmenu(child.dept_id)" @mouseenter="openSubmenu(child.dept_id)" @focus="openSubmenuFocus(child.dept_id)">
                      <router-link v-bind:tabindex="null" :to="child.target" @focus="openSubmenuFocus(child.dept_id)" class="text-capitalize py-2 px-lg-4 d-flex align-items-center justify-content-between">
                        <span v-html="parseName(child.name)"></span>
                        <svg class="ml-3 caret" v-if="child.children && child.children.length" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292787 9.70692C0.105316 9.51939 0 9.26508 0 8.99992C0 8.73475 0.105316 8.48045 0.292787 8.29292L3.58579 4.99992L0.292787 1.70692C0.110629 1.51832 0.00983372 1.26571 0.0121121 1.00352C0.0143906 0.741321 0.11956 0.490509 0.304968 0.305101C0.490376 0.119692 0.741189 0.0145233 1.00339 0.0122448C1.26558 0.00996641 1.51818 0.110761 1.70679 0.292919L5.70679 4.29292C5.89426 4.48045 5.99957 4.73475 5.99957 4.99992C5.99957 5.26508 5.89426 5.51939 5.70679 5.70692L1.70679 9.70692C1.51926 9.89439 1.26495 9.99971 0.999786 9.99971C0.734622 9.99971 0.480314 9.89439 0.292787 9.70692Z" fill="currentColor"/></svg>
                      </router-link>
                      <div class="c-dropdown-menu" :ref="`submenu-${child.dept_id}`" v-if="child.children && child.children.length" :class="{ 'visible' : currentSubmenu == child.dept_id }" @focusout="onSubmenuBlur" @mouseleave="onSubmenuBlur">
                        <div class="ul ul-3" :style="{ height: `${targetHeight}px` }">
                          <ul class="p-0 pt-2 pb-3" ref="ul3" role="menu">
                            <li v-for="(ch, k) in child.children" :tabindex="`${k+1}`" :key="`child-${k}`" role="menuitem">
                              <router-link v-bind:tabindex="null" :to="ch.target" class="text-capitalize py-2 px-lg-4 d-flex align-items-center justify-content-between">
                                <span v-html="parseName(ch.name)"></span>
                              </router-link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-else ref="mobileMenus-wrap">
        <div v-for="(menu, i) in mobileMenus" :key="`mobileMenu-${i}`" :ref="`mobileMenu-${menu.dept_id || 'main'}`" :id="`mobileMenu-${menu.dept_id || 'main'}`" class="c-dropdown-menu">
          <a href="#" class="d-flex align-items-center text font-weight-bold text-uppercase" @click="goBack(menu.dept_id || 'main')" @keydown.enter.prevent.stop="goBack(menu.dept_id || 'main',$event)">
            <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" width="16" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            Back
          </a>
          <div class="ul">
            <ul class="p-0 pt-2 pb-3">
              <li class="border-bottom mt-2 mb-4">
                <template v-if="menu.dept_id">
                  <template v-if="menu.target">
                    <router-link v-if="!isUrl(menu.target)" :to="menu.target" class="text-uppercase d-inline-block font-weight-bold mb-2">
                      {{ parseName(menu.name) }}
                    </router-link>
                    <a v-else :href="item.target" class="text-uppercase d-inline-block font-weight-bold mb-2" target="_blank">
                      <span v-html="parseName(menu.name)"></span>
                    </a>
                  </template>
                  <div v-else>
                    {{ parseName(menu.name) }}
                  </div>
                </template>
                <template v-else>
                  <template v-if="target">
                    <router-link v-if="!isUrl(target)" :to="target" class="text-uppercase d-inline-block font-weight-bold mb-2">
                      {{ parseName(title) }}
                    </router-link>
                    <a v-else :href="target" class="text-uppercase d-inline-block font-weight-bold mb-2" target="_blank">
                      <span v-html="parseName(title)"></span>
                    </a>
                  </template>
                  <div tabindex="0" v-else>
                    {{ parseName(title) }}
                  </div>
                </template>
              </li>

              <li v-for="(child, i) in menu.children" :key="`child-${i}`" class="mt-2 mb-4">
                <template v-if="child.target && (!child.children || !child.children.length)">
                  <router-link v-if="!isUrl(child.target)" :to="child.target" class="text-capitalize py-2 px-lg-4 d-flex align-items-center justify-content-between">
                    <span v-html="parseName(child.name)"></span>
                    <svg class="ml-3 caret" v-if="child.children && child.children.length" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292787 9.70692C0.105316 9.51939 0 9.26508 0 8.99992C0 8.73475 0.105316 8.48045 0.292787 8.29292L3.58579 4.99992L0.292787 1.70692C0.110629 1.51832 0.00983372 1.26571 0.0121121 1.00352C0.0143906 0.741321 0.11956 0.490509 0.304968 0.305101C0.490376 0.119692 0.741189 0.0145233 1.00339 0.0122448C1.26558 0.00996641 1.51818 0.110761 1.70679 0.292919L5.70679 4.29292C5.89426 4.48045 5.99957 4.73475 5.99957 4.99992C5.99957 5.26508 5.89426 5.51939 5.70679 5.70692L1.70679 9.70692C1.51926 9.89439 1.26495 9.99971 0.999786 9.99971C0.734622 9.99971 0.480314 9.89439 0.292787 9.70692Z" fill="currentColor"/></svg>
                  </router-link>
                  <a v-else :href="child.target" class="text-capitalize py-2 px-lg-4" target="_blank">
                    <span v-html="parseName(child.name)"></span>
                  </a>
                </template>
                <div v-else tabindex="0" class="text-capitalize w-100 py-2 px-md-4 d-md-flex d-inline-flex align-items-center justify-content-between cursor-pointer text-wrap" @click="navigate(child.dept_id, $event)" @keydown.enter.prevent.stop="navigate(child.dept_id, $event)">
                  <span v-html="parseName(child.name)"></span>
                  <div>
                    <svg class="ml-3 mr-1 mr-lg-0 caret" v-if="child.children && child.children.length" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292787 9.70692C0.105316 9.51939 0 9.26508 0 8.99992C0 8.73475 0.105316 8.48045 0.292787 8.29292L3.58579 4.99992L0.292787 1.70692C0.110629 1.51832 0.00983372 1.26571 0.0121121 1.00352C0.0143906 0.741321 0.11956 0.490509 0.304968 0.305101C0.490376 0.119692 0.741189 0.0145233 1.00339 0.0122448C1.26558 0.00996641 1.51818 0.110761 1.70679 0.292919L5.70679 4.29292C5.89426 4.48045 5.99957 4.73475 5.99957 4.99992C5.99957 5.26508 5.89426 5.51939 5.70679 5.70692L1.70679 9.70692C1.51926 9.89439 1.26495 9.99971 0.999786 9.99971C0.734622 9.99971 0.480314 9.89439 0.292787 9.70692Z" fill="currentColor"/></svg>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>

import debounce from 'debounce';
export default {
  name: 'CustomDropdown',
  props: {
    menu: {
      default: null
    },
    title: {
      default: ''
    },
    target: {
      default: null
    },
    search: {
      default: false
    }
  },
  data() {
    return {
      targetHeight: 0,
      searchQuery: '',
      isMobile: window.innerWidth <= 991,
      mobileMenus: [],
      isVisible: false,
      currentMenu: null,
      currentSubmenu: null
    };
  },
  computed: {
    filteredMenu() {
      let m = this.menu;
      m.children = m.items.map(e => {
        e.name = e.title ? e.title : e.name ? e.name : '';
        return e;
      });
      return { config: m.config, children: m.children.filter(e => e.name && e.name.toLowerCase().includes(this.searchQuery.toLowerCase())) };
    },
    settings() {
      return this.$store.state.settings;
    },
    navFontSize(){
      if(this.settings && this.settings.navStyle && this.settings.navStyle.links && this.settings.navStyle.links.fontSize){
        return `${this.settings.navStyle.links.fontSize}px !important`;
      }
      return '';
    }
  },
  mounted() {
    window.addEventListener('resize', () => this.resizeDropdown());
    this.resizeDropdown();
  },
  methods: {
    reset() {
      Object.entries(this.$refs).forEach(ob => {
        let obj = Array.isArray(ob[1]) ? ob[1][0] : ob[1];
        if(obj)
          obj.classList.remove('active');
      });
    },
    findChildren(obj, id) {
      let ret = [];
      const iterate = (obj, id) => {
        Object.keys(obj).forEach(key => {
          if(key == 'dept_id' && obj[key] == id) {
            ret = obj;
          }
          if(typeof obj[key] === 'object' && !ret.length) {
            iterate(obj[key], id);
          }
        });
      };
      iterate(obj, id);
      return ret;
    },
    navigate(id, $event) {
      let arr = [];      
      if(id == 'main') {
        arr = this.filteredMenu;
        
      } else {
        arr = this.findChildren(this.filteredMenu, id);
      }
      if(arr) {
        this.mobileMenus.push(arr);
        if(this.isMobile) {
          setTimeout(() => {
            this.$refs[`mobileMenu-${id}`][0].classList.add('active');
            if($event && $event.which == 13) {
              this.$refs[`mobileMenu-${id}`][0].querySelector('a').focus();
            }
          }, 100);
        }
      }
    },
    goBack(id,$event = null) {
      this.$refs[`mobileMenu-${id}`][0].classList.remove('active');
      setTimeout(() => this.mobileMenus.pop(), 100);
      setTimeout(() => {
        if($event && $event.which == 13 && id != 'main') {
          this.$refs[`mobileMenus-wrap`].lastElementChild.querySelector('a').focus();
        }
      }, 200);
    },
    resizeDropdown() {
      this.isMobile = window.innerWidth <= 991;
      this.targetHeight = this.$refs.dropdown && this.$refs.dropdown.querySelector('.c-dropdown-menu .ul') && this.$refs.dropdown.querySelector('.c-dropdown-menu .ul').clientHeight || 0;
    },
    onMouseEnter() {
      this.isVisible = true;
    },
    onMouseLeave() {
      this.isVisible = false;
    },
    onKeyPress(evt) {
      if(evt.which == 13) {
        if(!this.isVisible && this.isMobile){
          this.navigate('main', evt);
        }
        this.isVisible = !this.isVisible;
      }
    },
    onBlur(evt) {
      if(!evt.currentTarget.contains(evt.relatedTarget)) {
        this.isVisible = false;
        this.currentMenu = null;
        this.currentSubmenu = null;
      }
    },
    onMenuBlur(evt) {
      if(!evt.currentTarget.contains(evt.relatedTarget)) {
        this.currentMenu = null;
        this.currentSubmenu = null;
      }
    },
    onSubmenuBlur(evt) {
      if(!evt.currentTarget.contains(evt.relatedTarget)) {
        this.currentSubmenu = null;
      }
    },
    onKeyDown(event) {
      const key = event.key;

      if (key === "ArrowRight" && !this.isMobile) {
        // Handle right arrow key press
        // Navigate to the next menu item or submenu
        event.preventDefault();
        this.navigateRight();
      } 
      else if (key === "ArrowLeft" && !this.isMobile) {
        // Handle left arrow key press
        // Navigate to the previous menu item or submenu
        event.preventDefault();
        this.navigateLeft();
      } 
       
      if (key === "ArrowDown") {
        // Handle down arrow key press
        // Navigate to the next menu item or submenu
        event.preventDefault();
        this.navigateDown();
      } else if (key === "ArrowUp") {
        // Handle up arrow key press
        // Navigate to the previous menu item or submenu
        event.preventDefault();
        this.navigateUp();
      }
    },
    navigateRight() {
      const currentMenuItem = document.activeElement;     
      if (currentMenuItem.parentElement 
      && currentMenuItem.parentElement.querySelector('.c-dropdown-menu')
      && currentMenuItem.parentElement.querySelector('.c-dropdown-menu').querySelector('li:first-child')
      ) {
        currentMenuItem.parentElement.querySelector('.c-dropdown-menu').querySelector('li:first-child').focus();
        currentMenuItem.parentElement.querySelector('.c-dropdown-menu').querySelector('li:first-child>a').focus();
      } 
    },
    navigateLeft() {
      var element = document.activeElement;
      var closestDropdownMenu = null;
      this.closeMenu();
      while (element) {
        if (element.classList.contains('c-dropdown-menu') && element.classList.contains('visible')) {
          closestDropdownMenu = element;
          break;
        }
        
        element = element.parentElement;
      }
      if (closestDropdownMenu && closestDropdownMenu.parentElement && closestDropdownMenu.parentElement.firstChild && closestDropdownMenu.parentElement.firstChild.nodeName === 'A') {
        closestDropdownMenu.parentElement.firstChild.focus();
      }
    },
    navigateDown() {
      const currentMenuItem = document.activeElement;      
      if(this.isMobile){
        if (currentMenuItem.parentElement && currentMenuItem.parentElement.nextElementSibling && currentMenuItem.parentElement.nextElementSibling.firstChild) {
          // If the current menu item has a submenu, open it and focus the first submenu item
          currentMenuItem.parentElement.nextElementSibling.firstChild.focus();
        }
      }else{
        if (currentMenuItem.classList.contains('c-dropdown') && currentMenuItem.classList.contains('h-100')) {
          if (currentMenuItem 
          && currentMenuItem.querySelector('li:first-child')
          ) {
            currentMenuItem.querySelector('li:first-child').focus();
            currentMenuItem.querySelector('li:first-child>a').focus();
          } 
        }else if (currentMenuItem.parentElement && currentMenuItem.parentElement.nextElementSibling && currentMenuItem.parentElement.nextElementSibling.firstChild) {
          // If the current menu item has a submenu, open it and focus the first submenu item
          currentMenuItem.parentElement.nextElementSibling.focus();
          currentMenuItem.parentElement.nextElementSibling.querySelector('a').focus();
        }
      }
    },
    navigateUp() {
      const currentMenuItem = document.activeElement;
      if(this.isMobile) {
        if(currentMenuItem.parentElement && currentMenuItem.parentElement.previousElementSibling && currentMenuItem.parentElement.previousElementSibling.firstChild) {
          // If the current menu item has a submenu, open it and focus the first submenu item
          currentMenuItem.parentElement.previousElementSibling.firstChild.focus();
        }
      } else {
        if(currentMenuItem.parentElement && currentMenuItem.parentElement.previousElementSibling && currentMenuItem.parentElement.previousElementSibling.firstChild) {
          // If the current menu item has a submenu, open it and focus the first submenu item
          currentMenuItem.parentElement.previousElementSibling.focus();
          currentMenuItem.parentElement.previousElementSibling.querySelector('a').focus();
        }
      }    
    },
    closeMenu() {
      if(this.currentSubmenu) {
        this.currentSubmenu = null;
      } else if(this.currentMenu) {
        this.currentMenu = null;
      }
    },
    openMenu: debounce(function(id) {
      this.currentMenu = id;
      this.resizeDropdown();
    }, 200),
    openSubmenu: debounce(function(id) {
      this.currentSubmenu = id;
      this.resizeDropdown();
    }, 200),
    openMenuFocus: function(id) {
      this.currentMenu = id;
      this.resizeDropdown();
    },
    openSubmenuFocus: function(id) {
      this.currentSubmenu = id;
      this.resizeDropdown();
    },
    parseName(name) {
      return this.$store.state.settings.departments.skipAutoFormat ? name : name.toLowerCase().charAt(0).toUpperCase() + name.toLowerCase().slice(1);
    },
    isUrl(val) {
      return this.$options.filters.isUrl(val);
    }
  },
  destroyed() {
    window.removeEventListener('keydown', this.navigateList);
  }
};
</script>

<style lang="scss" scoped>
  .c-dropdown {
    line-height: 1.3;
    z-index: 10;
    color: var(--navigationLinkColor) !important;
    a {
      color: var(--navigationLinkColor) !important;
    }
    .nav-link {
      color: var(--navigationLinkColor);
      width: 100%;
      &:hover {
        color: var(--navigationLinkColor);
      }
    }
    :deep(.c-dropdown-menu) {
      background: var(--navigation);
      overflow: auto;
      overflow: visible;
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
      scrollbar-width: none;
      .ul {
        position: absolute;
        left: 100%;
        top: 0;
        min-width: 300px;
        border-radius: 12px;
        margin-right: -106px;
        scrollbar-width: none;
        ::-webkit-scrollbar {
          display: none;  /* Safari and Chrome */
        }
        ul {
          margin-left: 10px;
          border-radius: 12px;
          background: var(--navigation);
          max-height: calc((var(--vh, 1vh) * 100) - 250px);
          overflow: auto;
          white-space: nowrap;
          list-style: none;
          height: 100%;
          box-shadow: 0 0 3px rgba(0,0,0,.1);
          scrollbar-width: none;
        }
        li {
          > .c-dropdown-menu {
            display: none;
          }
        }
      }
    }
    > .c-dropdown-menu {
      > .ul {
        top: calc(100% - 1px);
        left: 0;
      }
      .ul.ul-1 {
        > ul {
          margin-left: 0;
        }
      }
    }
  }
  .submenu-visible {
    display: block;
  }
  .visible {
    display: block !important;
  }
  @media (min-width: 992px) {
    .c-dropdown {
      .c-dropdown-menu {
        .ul {
          li {
            > .c-dropdown-menu {
              display: none;
            }
            &:hover {
              > a {
                text-decoration: none;
                color: var(--navigation) !important;
                background: var(--navigationLinkColor);
              }
            }
          }
        }
      }
      > .c-dropdown-menu {
        display: none;
      }
    }
  }
  @media (max-width: 991px) {
    .c-dropdown {
      > .main-link > .caret {
        transform: rotate(-90deg) scale(1.5);
      }
      .c-dropdown-menu {
        display: block !important;
        position: fixed;
        left: 100%;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        padding: 30px 37px 20px;
        transition: left .3s;
        &.active {
          left: 0;
        }
        > .ul {
          position: static;
          height: 100%;
          ul {
            box-shadow: none;
            max-height: 100%;
            margin-left: 0;
          }
        }
      }
    }
    li.nav-item .nav-link {
      line-height: 26px !important;
      font-size: 22px !important;
      line-height: 1.3 !important;
      padding: 14px 0 !important;
    }
    .caret {
      transform: scale(1.5);
    }
  }
  @media (max-width: 575px) {
    .c-dropdown {
      .c-dropdown-menu {
        padding-left: 22px;
        padding-right: 22px;
      }
    }
  }
</style>
