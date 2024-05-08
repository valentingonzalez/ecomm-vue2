<template>
  <div class="main-banner alert border-0 rounded-0 py-2 py-md-3 text-center mb-0" role="alert" v-html="text" :style="style">
  </div>
</template>

<script>
  export default {
    name: 'RentalItem',
    props: {
      text: {
        default: ''
      },
      options: {
        default: ''
      }
    },
    data() {
      return {
      };
    },
    computed: {
      style() {
        const { ...obj } = this.options;
        obj.color = `var(--${obj.textColor})`;
        obj.background = `var(--${obj.background})`;
        obj.fontSize = `${obj.fontSize}px`;
        delete obj.textColor;
        return obj;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .main-banner {
    line-height: 1.3;
    font-weight: bold;
    background-color: var(--primary);
    color: #fff;
    font-size: 14px;
  }
  @media (max-width: 475px) {
    .main-banner {
      font-size: 12px !important;
      font-weight: bold !important;
    }
  }
</style>
