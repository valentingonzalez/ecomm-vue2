<template>
  <main class="mt-5">
    <div class="container">
      <div class="d-flex mb-5">
        <div class="mr-5 d-flex flex-column align-items-start">
          <h1 class="display-4">{{ collection.name }}</h1>
          <div class="h3 flex-grow-1">{{ collection.description }}</div>
          <button class="btn btn-primary btn-lg">
            <svg class="mr-2" width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.83594 17.79C4.45726 17.79 4.96094 17.2864 4.96094 16.665C4.96094 16.0437 4.45726 15.54 3.83594 15.54C3.21462 15.54 2.71094 16.0437 2.71094 16.665C2.71094 17.2864 3.21462 17.79 3.83594 17.79Z" fill="#D6D6D6"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0 1.25C0 0.835786 0.335786 0.5 0.75 0.5H6.91667C7.33088 0.5 7.66667 0.835786 7.66667 1.25V16.6667C7.66667 18.7838 5.95043 20.5 3.83333 20.5C1.71624 20.5 0 18.7838 0 16.6667V1.25ZM1.5 2V16.6667C1.5 17.9553 2.54467 19 3.83333 19C5.122 19 6.16667 17.9553 6.16667 16.6667V2H1.5Z" fill="#D6D6D6"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19.7803 13.0532C19.921 13.1938 20 13.3846 20 13.5835L20 19.7502C20 20.1644 19.6642 20.5002 19.25 20.5002L3.83333 20.5002C3.41912 20.5002 3.08333 20.1644 3.08333 19.7502C3.08333 19.3359 3.41912 19.0002 3.83333 19.0002L18.5 19.0002L18.5 14.3335L12.1198 14.3335C11.7056 14.3335 11.3698 13.9977 11.3698 13.5835C11.3698 13.1693 11.7056 12.8335 12.1198 12.8335L19.25 12.8335C19.4489 12.8335 19.6397 12.9125 19.7803 13.0532Z" fill="#D6D6D6"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.7182 2.09707C11.9785 1.77769 12.4476 1.72801 12.7689 1.98581L17.9568 6.14755C18.1125 6.2725 18.212 6.45442 18.2332 6.65299C18.2544 6.85155 18.1955 7.05037 18.0697 7.20538L7.49823 20.2222C7.2371 20.5437 6.76476 20.5927 6.44322 20.3316C6.12169 20.0705 6.07272 19.5981 6.33385 19.2766L16.4296 6.84545L12.4109 3.62159L7.49747 9.65172C7.23582 9.97284 6.7634 10.021 6.44229 9.7594C6.12117 9.49775 6.07297 9.02533 6.33461 8.70421L11.7182 2.09707Z" fill="#D6D6D6"/></svg>
            Buy Fan Deck
          </button>
        </div>
        <div>
          <iframe width="486" height="273" src="https://www.youtube-nocookie.com/embed/kGjx0bEol8g?controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="lead">
          Color
          <select class="form-control lead" v-model="filterBy">
            <option :value="''">All Colors</option>
            <option v-for="color in colorCollections" :key="color" :value="color">{{ color }}</option>
          </select>
        </div>
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
        <div class="special-column col-sm-4 col-md-2 col-xl-3 mb-1" v-for="color in sortedColors" :key="color.name">
          <ColorBlock :color="color" @onSelect="onSelectColor" @addToCart="addToCart" />
        </div>
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
    name: 'ColorCollectionPage',
    components: {
      ColorBlock,
      ColorsCart
    },
    data() {
      return {
        collection: {
          name: 'Affinity  Color Collection',
          description: 'The colors in the Affinity® Collection have been meticulously curated to complement one another, no matter what colors are chosen.'
        },
        sortBy: this.$route.query.sort_by || 'light-dark',
        filterBy: this.$route.query.filter_by || '',
        selectedColor: null
      };
    },
    computed: {
      colors() {
        return this.$store.state.paint.colors[this.$route.params.color] || null;
      },
      colorCollections() {
        return this.colors ? [...new Map(this.colors.map(e => [e.family, e])).values()].map(e => e.family) : [];
      },
      sortedColors() {
        if(!this.colors) return;
        let sortFunction = () => {};
        if(this.sortBy == 'A-Z') sortFunction = (a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        if(this.sortBy == 'Z-A') sortFunction = (a, b) => a.name < b.name ? 1 : a.name > b.name ? -1 : 0;
        if(this.sortBy == 'light-dark') sortFunction = (a, b) => a.hex < b.hex ? 1 : a.hex > b.hex ? -1 : 0;
        if(this.sortBy == 'dark-light') sortFunction = (a, b) => a.hex < b.hex ? -1 : a.hex > b.hex ? 1 : 0;
        return [...this.colors].sort(sortFunction).filter(e => e.family.includes(this.filterBy));
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
    },
    watch: {
      sortBy(val) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { sort_by: val }) }).catch(() => {});
      },
      filterBy(val) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { filter_by: val }) }).catch(() => {});
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
