<template>
  <div>
    <h1 v-if="showTitle" class="display-4 mb-5 mt-3">Explore Color By Family</h1>
    <div v-if="colorFamilies" class="row" :class="{ 'small-gutters': small }">
      <div class="col-6 col-md-4 col-lg-3" v-for="color in colorFamilies" :key="color.name">
        <router-link :to="`/colors/family/${color.code}`" class="color-block d-flex flex-column mb-2" :class="{ 'mb-4': !small }">
          <div class="header d-flex align-items-center px-4" :style="{ background: color.hex, color: textColor(color.hex) }" v-html="color.name"></div>
          <div class="grid d-flex flex-grow-1 w-100">
            <div v-for="i in 7" class="h-100" :style="{ background: color.hex, opacity: `.${-i + 10}` }" :key="`${color.name}-${i}`"></div>
          </div>
        </router-link>
      </div>
    </div>
    <div v-else class="d-flex justify-content-center py-5">
      <div class="spinner-border"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showTitle: {
      default: true
    },
    small: {
      default: false
    }
  },
  data() {
    return {
    };
  },
  computed: {
    colorFamilies() {
      return this.$store.state.paint.families;
    }
  },
  mounted() {
    if(!this.colorFamilies) {
      this.$store.dispatch('setPaint');
    }
  },
  methods: {
    textColor(hex) {
      return this.$root.$children[0].lightBackground(hex) ? '#131313' : '#D6D6D6';
    }
  }
};
</script>

<style scoped lang="scss">
  .color-block {
    height: 300px;
    box-shadow: 0 0 20px rgba(0,0,0,.1);
    .header {
      font-size: 24px;
      height: 84px;
    }
    .grid {
      > div {
        width: 14.28%;
      }
    }
  }
  a:hover {
    text-decoration: none;
  }
  .editable {
    .header {
      font-size: 18px;
      height: 50px;
    }
    .color-block {
      height: 220px;
    }
  }
</style>