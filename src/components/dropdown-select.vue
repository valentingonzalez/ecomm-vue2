<template >
  <div v-if="options.length" class="dropdown" ref="d" :class="{ 'dropdown-opened': opened }">
    <div class="dropdown-content" ref="dd" :style="{ height: opened ? `${targetHeight}px` : `48px` }" :class="{ 'opened': opened }" @focusout="() => opened = false" tabindex="0">
      <div class="d-flex align-items-center selected-option" @click="() => opened = !opened">
        <div class="mr-2 font-weight-bold">{{ label }}</div>
        <div class="lead text-primary"><b>{{ selectedOption.label }}</b></div>
        <svg class="ml-2" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8334 1.5L7.00002 7.33333L1.16669 1.5" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="option" v-for="o in options" :key="`option-${o.value}`" @click="selectOption(o)">
        {{ o.label }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropdownSelect',
  props: {
    options: {
      default: []
    },
    label: {
      default: ''
    }
  },
  data() {
    return {
      selectedOption: {},
      targetHeight: 0,
      opened: false
    };
  },
  mounted() {
    this.targetHeight = (this.options.length + 1) * 48;
    this.$emit('onLoad', this);
  },
  methods: {
    selectOption(option, internal = false) {
      this.opened = false;
      this.selectedOption = option;
      this.$emit('onSelect', option.value, internal);
    }
  }
};

</script>

<style scoped lang="scss">
  .dropdown {
    height: 48px;
    position: relative;
    background: #fff;
    z-index: 100;
    &.dropdown-opened {
      z-index: 10000;
    }
    .dropdown-content {
      background: #fff;
      transition: all .3s;
      overflow: hidden;
      cursor: pointer;
      border: 1px solid #e2e8f0;
      border-radius: 25px;
      color: #64748b;
      font-weight: 500;
      &.opened {
        box-shadow: 0 3px 5px rgba(0,0,0,.01), 0 3px 8px rgba(0,0,0,.06);
      }
      .selected-option {
        padding: 12px 22px;
        height: 48px;
        white-space: nowrap;
      }
      .option {
        padding: 12px 22px;
        height: 48px;
        white-space: nowrap;
        &:hover {
          background: #f8fafc;
        }
        &:not(:last-child) {
          border-bottom: 1px solid #e2e8f0;
        }
      }
    }
  }
</style>