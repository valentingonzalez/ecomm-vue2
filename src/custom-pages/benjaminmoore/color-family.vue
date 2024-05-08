<template>
  <main class="mt-5">
    <div class="container">
      <template v-if="colors">
        <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-4">
          <h1>{{ familyName }} Paint Colors</h1>
          <div class="lead">
            Sort
            <select class="form-control lead" v-model="sortBy">
              <option value="light-dark">Light to Dark</option>
              <option value="dark-light">Dark to Light</option>
              <option value="A-Z">Alphabetically, A-Z</option>
              <option value="Z-A">Alphabetically, Z-A</option>
            </select>
          </div>
        </div>
        <div class="row small-gutters">
          <div class="special-column col-sm-6 col-md-4 col-lg-2 mb-1" v-for="color in sortedColors" :key="color.name">
            <ColorBlock :color="color" @onSelect="onSelectColor" @addToCart="addToCart" />
          </div>
        </div>
      </template>
      <div v-else class="d-flex justify-content-center py-5">
        <div class="spinner-border"></div>
      </div>
      <transition name="fade">
        <div v-if="selectedColor" class="viewer" @click="selectedColor = null">
          <ColorBlock :color="selectedColor" :readonly="true" @addToCart="addToCart" />
        </div>
      </transition>
    </div>
    <ColorsCart ref="colorsCart" />
  </main>
</template>

<script>
  import ColorBlock from '@/components/paint/color-block';
  import ColorsCart from '@/components/paint/colors-cart';

  export default {
    name: 'ColorFamilyPage',
    components: {
      ColorBlock,
      ColorsCart
    },
    data() {
      return {
        sortBy: this.$route.query.sort_by || 'light-dark',
        selectedColor: null
      };
    },
    computed: {
      familyName() {
        return {
          YEL: 'Yellow',
          ORA: 'Orange',
          RED: 'Red',
          PUR: 'Purple',
          BLU: 'Blue',
          GRE: 'Green',
          BRO: 'Brown',
          NEU: 'Neutral',
          WHI: 'White',
          GRA: 'Gray',
          BLA: 'Blac',
          PIN: 'Pink'
        }[this.$route.params.color];
      },
      colors() {
        return this.$store.state.paint.colors[this.$route.params.color] || null;
      },
      sortedColors() {
        if(!this.colors) return null;
        let sortFunction = () => {};
        if(this.sortBy == 'A-Z') sortFunction = (a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        if(this.sortBy == 'Z-A') sortFunction = (a, b) => a.name < b.name ? 1 : a.name > b.name ? -1 : 0;
        //if(this.sortBy == 'light-dark') sortFunction = (a, b) => a.hex < b.hex ? 1 : a.hex > b.hex ? -1 : 0;
        //if(this.sortBy == 'dark-light') sortFunction = (a, b) => a.hex < b.hex ? -1 : a.hex > b.hex ? 1 : 0;
        return this.sortBy == 'dark-light' ? [...this.colors].sort(sortFunction).reverse() : [...this.colors].sort(sortFunction);
      }
    },
    mounted() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if(!this.colors)
        this.$store.dispatch('setColor', this.$route.params.color);
    },
    methods: {
      onSelectColor(color) {
        this.selectedColor = color;
      },
      addToCart(color) {
        this.selectedColor = null;
        this.$refs.colorsCart.show(color);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .grid {
    > div {
      width: 14.28%;
    }
  }
  /* Really weird numbers for a 7 cols row */
  @media (min-width: 1200px) {
    .special-column {
      &.col-xl-3 {
        -ms-flex: 0 0 14.285714285714286%;
        flex: 0 0 14.285714285714286%;
        max-width: 14.285714285714286%;
      }
    }
  }
  .viewer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,.7);
    z-index: 1000000;
    padding: 50px 40px;
    .color-block {
      width: 100%;
      height: 100%;
      max-width: 450px;
      max-height: 600px;
      @media (max-width: 600px) {
        max-height: 100%;
        max-width: 100%;
      }
    }
  }
</style>
