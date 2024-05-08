<template>
  <main >
    <div class="container">
      <div class="text-center d-flex flex-column align-items-center pb-5 pt-2">
        <h1 class="display-5 mb-3">Featured Color Samples</h1>
        <p class="h5 description">
          High-quality brush-on samples allow you to see exactly how colors look in your space so you can choose 
          your hue with confidence.
        </p>
      </div>
    </div>
    <div class="bg-white pt-md-5">
      <div class="container">
        <template v-if="categories">
          <v-select v-if="menuOptions && menuOptions.length" class="d-block d-md-none" :options="menuOptions" v-model="currentCategory" />
          <nav class="d-none d-md-block">
            <ul class="navbar-nav flex-row w-100">
              <li class="flex-grow-1 px-1" v-for="category in categories" :key="category.name">
                <router-link class="btn btn-outline-primary w-100 px-2" :to="category.url">{{ category.name }}</router-link>
              </li>
            </ul>
          </nav>
        </template>

        <div v-if="products" class="py-5">
          <div class="row py-5">
            <div class="col-sm-6 col-lg-4 col-xl-3 mb-4" v-for="item in products" :key="item.sku">
              <ProductItem :item="item" :showAddCart="false" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import VSelect from '@alfsnd/vue-bootstrap-select';
  import PaintService from '../../api-services/paint.service';
  
  export default {
    name: 'PaintProductsPage',
    components: {
      VSelect
    },
    data() {
      return {
        currentCategory: null,
        loading: false,
        products: null
      };
    },
    computed: {
      categories() {
        return this.$store.state.paint.productCategories;
      },
      menuOptions() {
        return this.categories ? this.categories.map(e => ({ text: e.name, code: e.code, value: e.target })) : [];
      }
    },
    async mounted() {
      if(!this.categories)
        await this.$store.dispatch('setPaintCategories');
      this.currentCategory = this.menuOptions.find(e => e.value == `/paint-products/${this.$route.params.category}`);
    },
    watch: {
      async currentCategory(val) {
        if(val) {
          this.loading = true;
          this.$router.push(val.value).catch(() => {});
          let res = await PaintService.getProducts({ type: val.code });
          this.products = res.data.products.map(e => ({ ...e, title: e.name }));
          this.loading = false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .description {
    max-width: 700px;
  }
  .router-link-exact-active {
    background: var(--primary);
    color: #fff;
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
</style>