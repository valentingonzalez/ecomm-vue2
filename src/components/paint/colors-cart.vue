<template>
  <div class="cart" :class="{'visible': visible}">
    <div class="sidebar d-flex flex-column px-4 pt-5 px-md-5">
      <div class="d-flex justify-content-between mb-4 mb-md-5">
        <h3 class="mb-0">{{ color ? 'Select Options' : 'No Color Selected' }}</h3>
        <button class="bg-transparent border-0 p-0" @click="hide">
          <svg width="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="Icon-sc-1vqff2m-0 bTVdEh" focusable="false" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.692 17.621a.75.75 0 01-1.061 0L6.378 7.368a.75.75 0 011.06-1.06L17.692 16.56a.75.75 0 010 1.061z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M6.377 17.692a.75.75 0 010-1.061L16.63 6.378a.75.75 0 111.06 1.06L7.439 17.692a.75.75 0 01-1.061 0z"></path></svg>
        </button>
      </div>
      <div v-if="color" class="color-options flex-grow-1">
        <div class="d-flex align-items-center mb-4">
          <div class="color-circle mr-3" :style="{ background: color.hex }"></div>
          <div>
            <h2 class="title mb-0">{{ color.name }}</h2>
            <h6 class="mb-0">{{ color.code }}</h6>
          </div>
        </div>
        <v-select :options="productCategories" v-model="selectedProductType" textProp="name" valueProp="code" labelTitle="Select a product type..." />
        <div v-if="loading" class="d-flex align-items-center justify-content-center mt-5">
          <div class="spinner-border"></div>
        </div>
        <div v-else-if="products && products.length" class="products row small-gutters mt-4">
          <div class="col-sm-6 mb-2" v-for="item in products" :key="item.sku">
            <ProductItem class="border" :card="true" selectable @onSelect="selectItem" :class="{'selected' : item == selectedProduct}" :item="item" :showAddCart="false" />
          </div>
        </div>
        <div class="mt-4" v-else>
          No products to show...
        </div>

        <div class="mt-4 border-top pt-4" v-if="selectedProduct">
          <div class="row small-gutters">
            <div class="col-md-6">
              <label for="sheen">Sheen</label>
              <v-select id="sheen" :options="sheens" v-model="selectedSheen" />
            </div>
            <div class="col-md-6">
              <div class="row small-gutters">
                <div class="col-md-6">
                  <label for="size">Size</label>
                  <v-select id="size" :options="sizes" v-model="selectedSize" labelTitle="" />
                </div>
                <div class="col-md-6">
                  <label>Quantity</label>
                  <change-quantity class="mt-2" :cartItem="selectedProduct" />
                </div>
              </div>
            </div>
          </div>
          <h3 class="mt-4 font-weight-bold">
            Item Price: ${{ currentPrice }}
          </h3>
          <button class="btn btn-primary btn-lg mt-4">
            Next
          </button>
        </div>
      </div>
    </div>
    <div class="overlay" @click="hide"></div>
  </div>
</template>

<script>
  import VSelect from '@alfsnd/vue-bootstrap-select';
  import PaintService from '../../api-services/paint.service';

  export default {
    name: 'ColorsCart',
    components: {
      VSelect
    },
    data() {
      return {
        visible: false,
        color: null,
        selectedProductType: null,
        products: [],
        loading: false,
        selectedProduct: null,
        sheens: [
          { text: 'Flat', value: '' },
          { text: 'Matte/Ulti-Matte', value: '' },
          { text: 'Eggshell', value: '' },
          { text: 'Low Lustre', value: '' },
          { text: 'Pearl/Satin', value: '' },
          { text: 'Semi-Gloss/Soft Gloss', value: '' },
          { text: 'Gloss/High-Gloss', value: '' }
        ],
        sizes: [
          { text: '1 Gallon', value: '1gal' }, { text: '1 Quart', value: '1quart' }
        ],
        selectedSheen: null,
        selectedSize: null,
        currentPrice: null,
      };
    },
    computed: {
      productCategories() {
        return this.$store.state.paint.productCategories;
      }
    },
    methods: {
      selectItem(val) {
        this.selectedProduct = val;

        // update available sheens
        this.sheens = val.sheens.map(s => {
          return { text: s.name, value: s.code };
        });

        this.selectedSheen = this.sheens[0];
        this.selectedSize = this.sizes[0];
      },
      show(color) {
        this.products = null;
        this.loading = false;
        this.selectedProduct = null;
        this.selectedProductType = null;
        this.color = color;
        this.visible = true;
      },
      hide() {
        this.visible = false;
        setTimeout(() => {
          this.color = null;
        }, 400);
      },
    },
    watch: {
      selectedSheen(val) {
        const sheen = this.selectedProduct.sheens.find(s => s.code === val.value);
        if ( sheen ) {
          this.sizes = sheen.sizes.map(sz => {
            return {text: sz.name, value: sz.id};
          });
          this.selectedSize = this.sizes[0];
        }
      },
      selectedSize(val) {
        const sheen = this.selectedProduct.sheens.find(s => s.code === this.selectedSheen.value);
        const size = sheen.sizes.find(sz => sz.id === val.value);
        this.currentPrice = size.price;
      },
      async selectedProductType(val) {
        if(!val) return;
        this.loading = true;
        let res = await PaintService.getProducts({ type: val.code, color: this.color.code });
        this.products = res.data.products.map(e => ({ ...e, title: e.name }));
        this.loading = false;
      }
    }
  };
</script>

<style scoped lang="scss">
  .cart {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1050;
    pointer-events: none;
    .overlay {
      opacity: 0;
      position: absolute;
      z-index: -1;
      background: rgba(255,255,255,.7);
      transition: opacity .3s;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
    .sidebar {
      position: absolute;
      width: 100%;
      max-width: 640px;
      height: 100%;
      right: -100%;
      background: #fff;
      transition: right .4s;
      .color-circle {
        width: 60px;
        min-width: 60px;
        height: 60px;
        border-radius: 60px;
      }
      .color-options {
        overflow: auto;
      }
      :deep(.v-select) {
        height: 47px !important;
        .v-select-toggle {
          height: 47px;
          padding-top: 0;
          padding-bottom: 0;
          align-items: center;
          .arrow-down {
            margin: 0;
          }
        }
        .v-dropdown-item {
          font-size: 14px;
        }
      }
      .products {
        padding: 2px;
      }
      .product-item-wrapper {
        border-radius: 14px;
        &.selected {
          outline: 2px solid var(--primary);
        }
      }
    }
    &.visible {
      pointer-events: all;
      .overlay {
        opacity: 1;
      }
      .sidebar {
        right: 0;
      }
    }
  }
  @media (max-width: 575px) {
    .cart {
      .sidebar {
        .title {
          font-size: 20px;
        }
        .color-circle {
          width: 46px;
          min-width: 46px;
          height: 46px;
        }
      }
    }
  }
</style>
