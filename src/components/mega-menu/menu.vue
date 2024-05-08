<template>
  <div class="megamenu h-100" tabindex="0" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" @keypress="onKeyPress" @focusout="onBlur" :style="{zIndex: isVisible ? '100' : '0'}">
    <div class="d-flex align-items-center h-100 nav-link" :style="{fontSize: navFontSize}" @click="onClick">
      <div class="flex-grow-1">{{ title }}</div>
      <div>
        <svg width="10" height="6" xmlns="http://www.w3.org/2000/svg" class="ml-1 caret"><g data-v-0aa462e6="" fill="none" fill-rule="evenodd"><path data-v-0aa462e6="" data-v-37000717="" d="M-226-22h1440v1459H-226z"></path><path data-v-0aa462e6="" data-v-37000717="" d="M-226-24h1440v53H-226z"></path><path data-v-0aa462e6="" data-v-37000717="" d="M7.5 1.5l-3 3-3-3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></g></svg>
      </div>
    </div>
    <div class="menu text pt-3 pb-4" :style="{ background: parseColor(menu.background) }" :class="{ 'light': darkBackground, 'd-none': !isVisible, 'mobile': isMobile, 'visible': isVisible }">
      <a v-if="isMobile" href="#" class="back-bt d-flex align-items-center text font-weight-bold text-uppercase" @click.prevent="closeDropdown" @keydown.enter.prevent.stop="closeDropdown">
        <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" width="16" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        Back
      </a>
      <div class="container">
        <div class="row flex-grow-1">
          <div class="col-md-3" v-for="(c, i) in columns" :key="`c-${i}`">
            <ul v-if="c.links && c.links.length">
              <li class="my-1" v-for="(l, ii) in c.links" :key="`l-${i}-${ii}`">
                <template v-if="l.image">
                  <div class="position-relative">
                    <img class="mw-100" :src="l.image" :alt="`Megamenu image for ${c.title}`">
                  </div>
                </template>
                <template v-else>
                  <a v-if="l.link" :href="l.link" target="_blank" :class="{ 'd-inline-block' : l.title, 'mt-4' : ii }">
                    <span v-if="l.title" class="h6 font-weight-bold text-uppercase">{{ l.name }}</span>
                    <span v-else>{{ l.name }}</span>
                  </a>
                  <template v-else>
                    <h6 v-if="l.title" class="font-weight-bold text-uppercase" :class="{ 'mt-4' : ii }">{{ l.name }}</h6>
                    <span v-else>{{ l.name }}</span>
                  </template>
                </template>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="menu.callToAction && menu.callToAction.label" class="d-flex justify-content-center mt-3">
        <a class="btn btn-primary" :href="menu.callToAction.link" target="_blank">
          {{ menu.callToAction.label }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MegaMenu',
    props: {
      title: {
        default: ''
      },
      menu: {
        default: null
      }
    },
    data() {
      return {
        isVisible: false,
        isMobile: window.innerWidth <= 991,
      };
    },
    computed: {
      columns() {
        return this.menu.columns.filter(e => e.title || e.links.length || e.image);
      },
      darkBackground() {
        if(!this.menu.background) return false;
        let bg = this.menu.background == 'white' ? 'ffffff' : this.menu.background == 'black' ? '000000' : this.menu.background;
        var r, g, b, hsp;
        let color = +(`0x${bg.slice(1).replace(bg.length < 5 && /./g, '$&$&')}`);
        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
        hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
        console.log(bg, hsp>127.5 ? false : true);
        return hsp>127.5 ? false : true;
      },
      navFontSize(){
        if(this.$store.state.settings && this.$store.state.settings.navStyle && this.$store.state.settings.navStyle.links && this.$store.state.settings.navStyle.links.fontSize){
          return `${this.$store.state.settings.navStyle.links.fontSize}px !important`;
        }
        return '';
      }
    },
    mounted() {
      window.addEventListener('resize', () => this.resizeDropdown());
      this.resizeDropdown();
    },
    methods: {
      closeDropdown() {
        this.isVisible = false;
      },
      resizeDropdown() {
        this.isMobile = window.innerWidth <= 991;
      },
      parseColor(color) {
        let re = /^([0-9A-F]{3}){1,2}$/i;
        return re.test(color) ? `#${color}` : `var(--${color})`;
      },
      onKeyPress(evt) {
        if(evt.which == 13) {
          this.isVisible = !this.isVisible;
        }
      },
      onMouseEnter() {
        if(!this.isMobile)
          this.isVisible = true;
      },
      onClick() {
        if(this.isMobile)
          this.isVisible = true;
      },
      onMouseLeave() {
        if(!this.isMobile)
          this.isVisible = false;
      },
      onBlur(evt) {
        if(!this.isMobile && !evt.currentTarget.contains(evt.relatedTarget)) {
          this.isVisible = false;
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .megamenu {
    z-index: 10;
    > .nav-link,
    > .nav-link:hover {
      color: var(--navigationLinkColor);
    }
    .menu {
      cursor: auto !important;
      font-size: 14px;
      position: absolute;
      background: #fff;
      width: 100%;
      left: 0;
      min-height: calc(var(--vh, 1vh) * 50 - 100px);
      z-index: 10;
      box-shadow: 0 5px 10px rgba(0,0,0,.1);
      color: #000 !important;
      &.light {
        color: #fff !important;
        .nav-link {
          color: #fff !important;
          background: none;
        }
        a {
          color: #fff !important;
        }
        .text-primary {
          color: #fff !important;
        }
      }
      ul {
        list-style: none;
        padding: 0;
      }
    }
  }
  @media (max-width: 991px) {
    .megamenu {
      width: 100%;
      .nav-link {
        font-size: 22px;
        width: 100%;
        padding: 14px 0 !important;
        .caret {
          transform: scale(1.5);
        }
      }
    }
    .menu {
      &.mobile {
        padding-top: 0 !important;
        display: block !important;
        position: fixed;
        left: 100%;
        top: 0;
        width: 100%;
        height: calc(var(--vh, 1vh) * 100);
        z-index: 100;
        padding: 30px 37px 20px;
        transition: left 0.3s;
        &.visible {
          left: 0 !important;
        }
        > .container {
          padding: 0 0 60px !important;
          margin-top: 60px !important;
          height: calc(var(--vh, 1vh) * 100 - 60px);
          overflow: auto;
        }
      }
      .back-bt {
        position: absolute;
        top: 32px;
      }
    }
  }
</style>
