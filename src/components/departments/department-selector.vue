<template>
<div>
  <nav class="navbar py-0 px-2 navbar-light">
    <div class="flex-column flex-lg-row justify-content-between">
      <ul class="navbar-nav">
        <li class="nav-item" v-for="(nav, index) in myNavigation" :key="`nav${index}`" :class="[nav.dropdown && 'b-nav-dropdown dropdown', $store.state.settings.navigationLayout != 'secondary' ? nav.align || 'left' : 'right', nav.name.toLowerCase() === 'departments' ? 'nav-mega-menu' : '']">
          <div @click="activeMenuMobile = activeMenuMobile === nav.id ? null : nav.id" class="nav-link" :class="{ 'expanded': activeMenuMobile === nav.id && $store.state.settings.navigationLayout === 'secondary' }">
            {{ selectedDepartment || nav.override || nav.name }}  
            <div v-if="!selectedDepartment">
              <svg class="ml-1" width="10" height="6" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M-226-22h1440v1459H-226z"/><path d="M-226-24h1440v53H-226z"/><path d="M7.5 1.5l-3 3-3-3" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></svg>
            </div>
            <VueIcon v-else @click.native="removeFilter()" name="times" class="ml-1" />
          </div>

          <div v-if="!selectedDepartment" :class="[nav.name.toLowerCase() === 'departments' ? 'mega-menu--header' : 'dropdown-menu', activeMenuMobile === nav.id && 'show-mega-menu-mobile']">
            <ul>
              <li class="d-flex" v-if="nav.dropdown.config && nav.dropdown.config.search">
                <input type="text" placeholder="Search..." class="form-control search-input" v-model="departmentDropdownSearch">
              </li>

              <template v-for="(d, i) in nav.dropdown.items">
                <li class="mega-class-submenu" :key="i + '-sumenu'" v-if="d.children && d.children.length">
                  <ul>
                    <li class="heading">All Classes {{ d.override || d.name || d.title }}</li>

                    <template v-for="(c, ci) in d.children">

                      <li class="mega-fileline-submenu" :key="ci + '-fileline-submenu'">
                        <ul>
                          <li class="heading">All Filters {{ c.override || c.name || c.title }}</li>
                          <li v-for="(f, fi) in c.children" :key="fi" @click="selectDepartment(f.name, d.dept_id, c.dept_id, f.dept_id)">
                            <a class="dropdown-item">
                              {{ f.name }}
                            </a>
                          </li>
                        </ul>
                      </li>
                    </template>
                  </ul>
                </li>
              </template>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</div>
</template>

<script>
let classTimer = null;
let finelineTimer = null;

import DepartmentsService from '@/api-services/departments.service';

  export default {
    name: 'DepartmentSelector',
    props: {
    },
    data() {
      return {
        departmentDropdownSearch: '',
        activeMenuMobile: null,
        selectedClass: null,
        selectedFineline: null,
        selectedDepartment: null,
        menuTimeoutDelay: 200
      };
    },
    async mounted() {
      let ret = await DepartmentsService.getAllDepartments();
      this.$store.commit('saveFullDepartments', ret.data.data);
    },
    computed: {
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
      myNavigation() {      
        let customNavigation = [
          {
            align: "left",
            dropdown: null,
            id: 1,
            name: "departments",
            target: "departments"
          }
        ]; // Hardcoded to get it done

        let finalNavigation = customNavigation.map((i) => {
          let elem = this.navigationItems.filter(e => {
            return e.target.toLowerCase() == i.target.toLowerCase();
          })[0];
          if(elem) {
            elem.name = i.name;
            elem.align = i.align;
            elem.show_in_header = i.show_in_header;
            elem.hide = i.hide;
          }

          i.dropdown && i.dropdown.items.map(e => {
            e.target = e.link ? e.link : e.target;
          });

          let final = elem && elem || i;
          return final;
        });

        return finalNavigation;
      },
      navigationItems() {
        let departments = this.filteredDepartmentList.map(e => {
          if (e.children && e.children.length) {
            e.children.forEach(c => {
              if (c.children && c.children.length) {
                c.children.forEach(f => {
                  f.target = `${f.dept_id}`;
                  return f;
                });
              }
              c.target = `${c.dept_id}`;
              return c;
            });
          }
          e.target = `${e.dept_id}`;
          return e;
        });

        return [
          {
            target: 'departments',
            dropdown: {
              items: departments,
              config: {
                "search": true,
                "width": 500
              }
            },
          },
        ];
      },
    },
    methods: {
      setClassTimer(classId, hasChildren) {
        if (hasChildren) {
          if (classId !== this.selectedClass) {
            classTimer = setTimeout(() => {
              this.selectedClass = classId;
            }, this.menuTimeoutDelay);
          }
        } else {
          if (this.selectedClass) this.selectedClass = null;
        }
      },
      setFinelineTimer(finelineId, hasChildren) {
        if (hasChildren) {
          if (finelineId !== this.selectedFineline) {
            finelineTimer = setTimeout(() => {
              this.selectedFineline = finelineId;
            }, this.menuTimeoutDelay);
          }
        } else {
          if (this.selectedFineline) this.selectedFineline = null;
        }
      },
      clearMenuTimeout(hasChildren) {
        if (hasChildren) {
          clearTimeout(classTimer);
          clearTimeout(finelineTimer);
        }
      },
      selectDepartment(dept_name, dept_id, class_id, fineline_id) {
        this.selectedDepartment = dept_name;
        const dept = {
          dept: dept_id,
          class: class_id,
          fineline: fineline_id,
        };

        this.selectedClass = null;
        this.selectedFineline = null;
        this.$emit('deptChanged', dept);
      },
      removeFilter() {
        this.selectedDepartment = null;
        const dept = {
          dept: '',
          class: '',
          fineline: '',
        };

        this.selectedClass = null;
        this.selectedFineline = null;
        this.$emit('deptChanged', dept);
      }
    }
  };
</script>

<style lang="scss">
  .filter-items {
    .filter-item {
      flex-wrap: nowrap;
      display: flex;
      align-items: center;
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

.filter-items {
  > div {
    display: inline-block;
  }

  @media (max-width: 1023px) {
    margin-top: 4px;
  }
}

nav.navbar {
  min-height: 41px;
  background-color: var(--navigation);
  color: var(--navigationLinkColor);
  width: 100%;
  flex: 1;

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
        @media (min-width: 1023px) {
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
        padding: 8px 0;
        font-size: var(--navigationFontSize);
        line-height: 1.3;
        letter-spacing: 0.5px;
        position: relative;
        text-transform: capitalize;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;

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

        @media (max-width: 1023px) {
          span {
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

          @media (max-width: 1023px) {
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

@media (max-width: 1023px) {
  nav.navbar {
    padding: 0 !important;

    .navbar-nav {
      li.nav-item {
        &.right ~ .nav-item.right {
          margin-left: 20px;
        }
        .nav-link {
          font-size: 14px;
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
    transition: opacity .3s;
    display: block;

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
        > * {
          font-size: 16px;
        }
        .nav-link {
          svg {
            transform: scale(1.5);
          }
        }
        .nav-link,
        .nav-link a {
          font-size: 16px;

          &:first-child {
            padding: 8px;
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

      .nav-mega-menu {
        li.show-child-menu + .mega-class-submenu,
        li.show-child-menu + .mega-fileline-submenu {
          max-height: 2000px !important;
        }

        .mega-menu--header {
          width: 100%;

          &.show-mega-menu-mobile {
            display: block !important;
            border: 1px solid #e8e8e8;
            border-radius: 0 0 4px 4px;
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
              font-size: 0.875rem;
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
}
</style>


<style v-if="$store.state.settings.layout && $store.state.settings.layout == 'secondary'" lang="scss">
#app {
  > .alert {
    border-bottom: 2px solid #fff !important;
  }
}
</style>
