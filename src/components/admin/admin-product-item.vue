<template>
  <li class="list-group-item">
    <div class="d-flex align-items-center">
      <div class="thumb mr-3">
        <img :src="product.image_url" :alt="product.title" />
      </div>
      <div class="pr-2 w-100">
        <div class="name font-weight-bold">{{ product.title | capitalize }}</div>
        <div class="d-flex justify-content-between text-muted">
          <div>{{ product.sku }}</div>
          <div class="cursor-pointer" v-if="showPings && product.ping_count" title="Product Ping Count">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.9831 6.05138L16.965 1.97662C16.8401 1.476 16.3901 1.125 15.8737 1.125H2.12738C1.611 1.125 1.161 1.476 1.035 1.97662L0.016875 6.05138C0.005625 6.09525 0 6.14138 0 6.1875C0 7.73775 1.19813 9 2.67188 9C3.528 9 4.29187 8.57363 4.78125 7.91213C5.27063 8.57363 6.0345 9 6.89062 9C7.74675 9 8.51062 8.57363 9 7.91213C9.48938 8.57363 10.2521 9 11.1094 9C11.9666 9 12.7294 8.57363 13.2188 7.91213C13.7081 8.57363 14.4709 9 15.3281 9C16.8019 9 18 7.73775 18 6.1875C18 6.14138 17.9944 6.09525 17.9831 6.05138Z" fill="#64748B"/><path d="M15.3281 10.125C14.562 10.125 13.8341 9.891 13.2188 9.4635C11.988 10.3196 10.2308 10.3196 9 9.4635C7.76925 10.3196 6.012 10.3196 4.78125 9.4635C4.16587 9.891 3.438 10.125 2.67188 10.125C2.1195 10.125 1.59863 9.99563 1.125 9.77513V15.75C1.125 16.371 1.629 16.875 2.25 16.875H6.75V12.375H11.25V16.875H15.75C16.371 16.875 16.875 16.371 16.875 15.75V9.77513C16.4014 9.99563 15.8805 10.125 15.3281 10.125Z" fill="#64748B"/></svg> 
            {{ product.ping_count }}
          </div>  
          <div class="cursor-pointer" v-if="showViews && product.views" title="Product Viewed Count"><i class="fa fa-eye"></i> {{ product.views }}</div>  
        </div>
      </div>
      <div v-click-outside="hideOptions" class="options">
        <button @click="showOptions = !showOptions" aria-label="Show Options">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="#a0a0ba"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></g></svg>
        </button>
        <div v-if="showOptions" class="menu">
          <router-link :to="getProductUrl(product)">View Product Page</router-link>
          <router-link :to="`/admin/settings/product-editor?type=sku&code=${product.sku}`">Edit Product</router-link>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
  import AdminApiService from '@/api-services/admin.service';

  export default {
    name: 'AdminProductItem',
    props: {
      product: {
        type: Object,
        default: null
      },
      showViews: {
        type: Boolean,
        default: false
      },
      showFeatured: {
        type: Boolean,
        default: true
      },
      showPings: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        showOptions: false
      };
    },
    methods: {
      getProductUrl(i) {
        return `/products/${i.sku}/${this.$ezSlugify(i.title)}`;
      },
      hideOptions() {
        this.showOptions = false;
      },
    }
  };
</script>

<style lang="scss" scoped>
  .code {
    font-size: 13px;
    color: #7e8695;
  }

  .name {
    font-size: 14px;
  }

  .featured {
    margin-right: 8px;
    border: none;
    background: none;
    
    svg {
      polygon {
        transition: 200ms;
      }
    }

    &:hover {
      &:not(.active) {
        fill-opacity: 0.5
      }
    }
    
    &:hover,
    &:active,
    &.active {
      svg {
        polygon {
          transition: 200ms;
          fill: var(--primary);
          stroke: var(--primary);
        }
      }
    }
  }

  .thumb {
    padding: 2px;
    border: 1px solid #E8E8E8;
    border-radius: 4px;
    width: 50px;
    height: 50px;
    min-width: 50px;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
    max-width: calc(100% - 4px);
    max-height: calc(100% - 4px);
    text-indent: -9999999px;
    overflow: hidden;
    }
  }

  .options {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    position: relative;
    button {
      border: none;
      background: none;
      padding: 4px;
      border-radius: 50%;
      transition: 200ms;
      &:hover {
        background: #ececef;
      }
    }

    .menu {
      background: #fff;
      box-shadow: 2px 3px 6px 0 rgba(0,0,0,.1);
      border-radius: 8px;
      position: absolute;
      top: -30px;
      right: 40px;
      width: 180px;
      padding: 8px 0;
      z-index: 100000;
      border: 1px solid #e7e7e7;
      a {
        display: block;
        padding: 4px 16px;
        font-size: 13px;
        font-weight: bold;
      }
    }
  }
</style>