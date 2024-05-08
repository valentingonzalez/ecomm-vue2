<template>
    <nav class="navbar p-0 navbar-light main-nav" :class="{'fixed-nav': fixedNav}" id="mainNav2">
      <div class="container px-4 pb-lg-0 w-100 align-items-start">
        <div class="px-2 px-lg-0 w-100  justify-content-center">
          <ul class="navbar-nav flex-column flex-lg-row flex-wrap">
              <li class="nav-item" :key="`nav`" >
                <a class="nav-link pr-3 text-uppercase" @click="setStep(1)" :class="{'completed' : step > 1, 'active': step == 1}">
                    <span class="step">
                      <img v-if="step > 1" src="icons/check.svg" alt="completed">
                      <span v-else>1</span>
                    </span>    
                    <span>Cart</span>
                </a>
                <a class="nav-link px-3 text-uppercase cursor-pointer" @click="setStep(2)" :class="{'completed' : step > 2, 'active': step == 2}">
                    <span class="step">
                      <img v-if="step > 2" src="icons/check.svg" alt="completed">
                      <span v-else>2</span>
                    </span>    
                    <span>Information</span>
                </a>
                <a class="nav-link px-3 text-uppercase" @click="setStep(3)" :class="{'completed' : step > 3, 'active': step == 3}">
                    <span class="step">
                      <img v-if="step > 3" src="icons/check.svg" alt="completed">
                      <span v-else>3</span>    
                    </span>    
                    <span>Payment</span>
                </a>
                <a class="nav-link px-3 text-uppercase" :class="{'completed' : step > 4, 'active': step == 4}">
                    <span class="step">4</span>    
                    <span>Done</span>
                </a>
              </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
    import AuthApiService from '@/api-services/auth.service';
    import AuthController from '@/controllers/auth.controller';
    import DepartmentsService from '@/api-services/departments.service';
  
    export default {
      name: 'CheckoutNav',
      props: {
      },
      data() {
        return {
          fixedNav: false,
          activeMenuMobile: null,
          selectedClass: null,
          selectedFineline: null,
          menuTimeoutDelay: 200
        };
      },
      computed: {
        step(){
            return this.$store.state.cartStep;
        },
      },
      mounted(){
        var navBar = document.getElementById('mainNav2');
        var offsetTop = navBar.offsetTop;
        window.document.onscroll = () => {
          let abc = offsetTop;
          if(this.step > 1){
            abc = offsetTop - 51;
          }
          if(window.scrollY > abc){
            this.fixedNav = true;
          } 
          if(window.scrollY <= abc){
            this.fixedNav = false;
          }
        };
      },
      methods: {
        setStep(step){
            if(step < this.step || step <= 2)
                this.$store.commit('setCartStep', step);
        }
      },
      watch: {
        
      }
    };
  </script>
  
  
  <style lang="scss" scoped>
    .d-show-mobile{
      display: none;
    }
    @media (max-width: 550px) {
      .d-none-mobile{
        display: none;
      }
      .d-show-mobile{
        display: flex;
      }
    }
    nav.navbar {
      background: var(--navigation);
      min-height: 46px;
      padding: 0 !important;
      color: var(--navigationLinkColor);
      width: 100%;
      border-top: 1px solid rgba(0,0,0,.07);
      transition: 800ms;

      &.fixed-nav{
        top: 0;
        left: 0;
        width: 100%;
        z-index: 11;
        transition: opacity .3s;
        display: block;
        position: fixed;
      }
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
            color: #4B5563 !important;
            padding: 16px 0;
            font-family: 'Inter', sans-serif;
            font-style: normal;
            font-weight: 700;
            font-size: 13px;
            line-height: 16px;
            letter-spacing: 0.5px;
            position: relative;
            display: flex;
            align-items: center;
            cursor: not-allowed;
            .step{
                width: 24px;
                height: 24px;
                background: #9CA3AF;
                border-radius: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Inter', sans-serif;
                font-size: 12.8px;
                line-height: 14px;
                font-style: normal;
                font-weight: 700;
                color: #FFFFFF;
                margin-right: 12px;
                letter-spacing: 0;
            }
            &.active {
                cursor: pointer;
                color: #000000 !important;
                border-bottom: 1px solid var(--brandPrimary);
                .step{
                    background: var(--brandPrimary);
                }
            }
            &.completed {
              cursor: pointer;
                .step{
                    background: #10B981;
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
  
    @media (max-width: 991px) {
      nav.navbar {
        > .container {
          overflow: auto;
        }
        width: 100%;
        height: auto;
        z-index: 1;
        transition: opacity .3s;
        display: block;
        .navbar-nav {
          
          li.nav-item {
            display: flex;
            justify-content: center;
            margin: 0 !important;
            > * {
              font-size: 14px;
            }
            .nav-link {
              justify-content: space-between;
              padding: 14px 10px !important;
              font-size: 14px;
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
    }
    
    @media (max-width: 550px) {    
      nav.navbar {
      &.fixed-nav{
      }
      .navbar-nav {
          li.nav-item {
            > * {
              font-size: 13px;
            }
            .nav-link {
              padding: 7px 14px !important;
              font-size: 13px;
              display: flex;
              flex-direction: column;
              font-weight: 700;
              justify-content: space-between;
              svg {
                transform: scale(1.5);
              }
              a {
                font-size: 12px;
              }
              .step{
                width: 20px;
                height: 20px;
                margin-right: 0px;
                margin-bottom: 5px;
            }
            }
          }
        }
      }
    }

    @media (max-width: 370px) {    
      nav.navbar {
        .navbar-nav {
          li.nav-item {
            > * {
              font-size: 11px;
            }
            .nav-link {
              padding: 5px 10px !important;
              font-size: 11px;
              a {
                font-size: 11px;
              }
              .step{
                width: 17px;
                height: 17px;
                margin-bottom: 3px;
                margin-right: 0px;
                font-size: 11px;
            }
            }
          }
        }
      }
    }
  </style>
  
  