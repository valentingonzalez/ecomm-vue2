<template>
  <div ref="summary">
    <div class="text" :class="{full : 'full'}" v-html="text"></div>
    <a class="show-more-bt" v-if="full" href="#" @click="showLess">Show less</a>
    <a class="show-less-bt" v-else href="#" @click="showMore">Show more</a>
  </div>
</template>

<script>
export default {
  name: 'SummaryText',
  props: {
    text: {
      type: String,
      default: ''
    },
    lines: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      textWrapper: null,
      fullHeight: 0,
      summarizedHeight: 0,
      full: false
    };
  },
  mounted() {
    this.textWrapper = this.$refs.summary.querySelector('.text');
    let lineHeight = this.getStyle(this.textWrapper, 'line-height');
    this.fullHeight = this.textWrapper.clientHeight;
    this.summarizedHeight = parseInt(lineHeight) * this.lines;
    this.showLess();
  },
  methods: {
    showMore($event) {
      if($event)
        $event.preventDefault();
      this.full = true;
      this.textWrapper.style.height = `${this.fullHeight}px`;
    },
    showLess($event) {
      if($event)
        $event.preventDefault();
      this.full = false;
      this.textWrapper.style.height = `${this.summarizedHeight}px`;
    },
    getStyle(el,styleProp) {
      if (el.currentStyle)
        var y = el.currentStyle[styleProp];
      else if (window.getComputedStyle)
        var y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
      return y;
    }
  }
};
</script>
<style lang="scss" scoped>
  .text {
    overflow: hidden;
    text-overflow: ellipsis;
    transition: height .4s;
    position: relative;
    &::after {
      position: absolute;
      content: '...';
      bottom: 0;
      right: 0;
      z-index: 1;
      background: #fff;
    }
    &.full::after {
      display: none;
    }
  }
  .show-more-bt,
  .show-less-bt {
    font-weight: bold;
  }
</style>