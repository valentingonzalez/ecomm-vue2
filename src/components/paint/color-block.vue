<template>
  <div class="color-block position-relative cursor-pointer p-2 d-flex flex-column justify-content-end" :style="{ background: color.hex }" :class="{ 'text-light': lightText(color.hex), 'readonly': readonly }" @click="selectColor">
    <div class="mt-3 text-truncate">{{ color.name }}</div>
    <div>{{ color.code }}</div>
    <div class="cart-bt" @click.stop.prevent="addToCart">
      <svg width="24" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorBlock',
  props: {
    color: {
      default: null
    },
    readonly: {
      default: false
    }
  },
  data() {
    return {
    };
  },
  methods: {
    selectColor() {
      this.$emit('onSelect', this.color);
    },
    addToCart() {
      this.$emit('addToCart', this.color);
    },
    lightText(hex) {
      return !this.$root.$children[0].lightBackground(hex);
    }
  }
};
</script>

<style scoped lang="scss">
  .color-block {
    height: 100px;
    transition: all .2s;
    &:not(.readonly):hover {
      box-shadow: 4px 10px 20px rgba(0,0,0,.2);
      transform: scale(1.05);
      z-index: 10;
      .cart-bt {
        opacity: 1;
        pointer-events: all;
      }
    }
    &.readonly {
      .cart-bt {
        opacity: 1;
        pointer-events: all;
      }
    }
  }
  .cart-bt {
    position: absolute;
    right: 10px; 
    top: 10px;
    pointer-events: none;
    transition: opacity .2s;
    @media (min-width: 1200px) {
      opacity: 0;
    }
  }
</style>