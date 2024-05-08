<template >
  <div v-if="options.length" class="dropdown" ref="d">
    <div class="dropdown-content" ref="dd" :class="{ 'opened': opened }" @focusout="() => opened = false" tabindex="0">
      <div class="option font-weight-bold">
        <div class="option-wrapper selected-option">
          <div class="d-flex align-items-center">
            <svg class="mr-2" width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.399994 1.4001C0.399994 1.18792 0.484279 0.984441 0.634308 0.834412C0.784338 0.684383 0.987821 0.600098 1.19999 0.600098H10.8C11.0122 0.600098 11.2157 0.684383 11.3657 0.834412C11.5157 0.984441 11.6 1.18792 11.6 1.4001V3.8001C11.5999 4.01225 11.5156 4.2157 11.3656 4.3657L7.59999 8.1313V11.0001C7.59995 11.2123 7.51563 11.4157 7.36559 11.5657L5.76559 13.1657C5.65371 13.2775 5.51118 13.3537 5.35602 13.3846C5.20086 13.4154 5.04003 13.3996 4.89387 13.339C4.74771 13.2785 4.62278 13.176 4.53487 13.0445C4.44697 12.9129 4.40003 12.7583 4.39999 12.6001V8.1313L0.634394 4.3657C0.484354 4.2157 0.400039 4.01225 0.399994 3.8001V1.4001Z" fill="#64748B"/></svg>
            <span class="text-muted mr-1">{{ label }}: </span>{{ selectedOption.name || 'All' }}
          </div>
          <svg class="ml-3" width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.234412 0.834563C0.384435 0.684586 0.587881 0.600333 0.800012 0.600333C1.01214 0.600333 1.21559 0.684586 1.36561 0.834563L4.00001 3.46896L6.63441 0.834563C6.70821 0.758155 6.79649 0.697209 6.89409 0.655282C6.99169 0.613354 7.09667 0.591285 7.20289 0.590362C7.30912 0.589439 7.41446 0.60968 7.51278 0.649905C7.61109 0.69013 7.70041 0.749532 7.77553 0.824646C7.85064 0.899761 7.91004 0.989082 7.95027 1.0874C7.99049 1.18572 8.01074 1.29106 8.00981 1.39728C8.00889 1.50351 7.98682 1.60848 7.94489 1.70609C7.90297 1.80369 7.84202 1.89196 7.76561 1.96576L4.56561 5.16576C4.41559 5.31574 4.21214 5.39999 4.00001 5.39999C3.78788 5.39999 3.58443 5.31574 3.43441 5.16576L0.234412 1.96576C0.0844355 1.81574 0.000183105 1.61229 0.000183105 1.40016C0.000183105 1.18803 0.0844355 0.984585 0.234412 0.834563V0.834563Z" fill="#64748B"/></svg>
        </div>
      </div>
      <div class="options">
        <div class="option" v-for="option in options" :key="option.id">
          <div class="option-wrapper">
            {{ option.name }}
            <svg v-if="option.children && option.children.length" class="ml-3" width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.234412 0.834563C0.384435 0.684586 0.587881 0.600333 0.800012 0.600333C1.01214 0.600333 1.21559 0.684586 1.36561 0.834563L4.00001 3.46896L6.63441 0.834563C6.70821 0.758155 6.79649 0.697209 6.89409 0.655282C6.99169 0.613354 7.09667 0.591285 7.20289 0.590362C7.30912 0.589439 7.41446 0.60968 7.51278 0.649905C7.61109 0.69013 7.70041 0.749532 7.77553 0.824646C7.85064 0.899761 7.91004 0.989082 7.95027 1.0874C7.99049 1.18572 8.01074 1.29106 8.00981 1.39728C8.00889 1.50351 7.98682 1.60848 7.94489 1.70609C7.90297 1.80369 7.84202 1.89196 7.76561 1.96576L4.56561 5.16576C4.41559 5.31574 4.21214 5.39999 4.00001 5.39999C3.78788 5.39999 3.58443 5.31574 3.43441 5.16576L0.234412 1.96576C0.0844355 1.81574 0.000183105 1.61229 0.000183105 1.40016C0.000183105 1.18803 0.0844355 0.984585 0.234412 0.834563V0.834563Z" fill="#64748B"/></svg>
          </div>
          <template v-if="option.children && option.children.length">
            <div class="children options">
              <div class="option" v-for="child in option.children" :key="child.id">
                <div class="option-wrapper">
                  {{ child.name }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <!--<div class="d-flex align-items-center selected-option" @click="() => opened = !opened">
        <div class="lead text-primary"><b>{{ selectedOption.label }}</b></div>
        <svg class="ml-2" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8334 1.5L7.00002 7.33333L1.16669 1.5" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="option" v-for="o in options" :key="`option-${o.value}`" @click="selectOption(o)">
        {{ o.label }}
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterDropdown',
  props: {
    options: {
      default: []
    },
    label: {
      default: 'Select an option'
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
    /*this.selectOption(this.options[0]);
    this.targetHeight = (this.options.length + 1) * 48;*/
  },
  methods: {
    selectOption(option) {
      this.opened = false;
      this.selectedOption = option;
      this.$emit('onSelect', option.value);
    }
  }
};

</script>

<style scoped lang="scss">
  .dropdown {
    height: 48px;
    position: relative;
    background: #fff;
    z-index: 1000;
    border-radius: 8px;
    .option {
      cursor: pointer;
      .option-wrapper {
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        height: 38px;
        &.selected-option {
          border: 1px solid #e2e8f0;
          font-size: 15px;
          border-radius: 8px;
        }
      }
    }
    .options {
      border: 1px solid #e2e8f0;
      max-height: 400px;
      overflow-y: auto;
      .option {
        > .children {
          position: absolute;
          margin-top: -220px;
          right: 100%;
          white-space: nowrap;
          display: none;
        }
        &:hover {
          > .children {
            display: block;
          }
        }
        .option-wrapper {
          &:hover {
            background: #f8fafc;
          }
        }
      }
    }
  }
</style>