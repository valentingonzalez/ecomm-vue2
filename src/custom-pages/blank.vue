<template>
  <main v-if="page">
    <div class="container d-flex w-100 justify-content-between pb-2">
      <h2>{{ page.title }}</h2>
      <div v-if="isAdmin">
        <router-link class="mr-3" :to="`/admin/settings/pages/edit/${page.id}`" v-b-tooltip.hover title="Edit">
          Edit in page editor
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="22" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </router-link>
      </div>
    </div>
    <template v-if="page.page_type == 'widget'">
      <template v-for="e in widgets">
        <div class="container" v-if="e && e.widget_type_id == 1 && e.value.value &&  e.value.value.length && !e.value.hidden" :key="e.id">
          <Carousel :id="e.id" :title="e.value.title" :slides="e.value.value" :responsive="e.value.responsive" />
        </div>
        <div class="container" v-if="e && e.widget_type_id == 2 && e.value.productList && !e.value.hidden" :key="e.id">
          <ProductSwiper :id="e.id" :products="e.value.productList" :widget="e" :autoPlay="5000" :title="e.value.title" :loop="e.value.loop" />
        </div>
        <div class="container" v-if="e && e.widget_type_id == 3 && e.value.testimonials && e.value.testimonials.length && !e.value.hidden" :key="e.id">
          <Testimonials :id="e.id" :testimonials="e.value.testimonials" :title="e.value.title" />
        </div>
        <div class="container" v-if="e && e.widget_type_id == 4 && e.value.value && !e.value.hidden" :key="e.id">
          <Subscription :id="e.id" :data="e.value.value" :title="e.value.title" />
        </div>
        <div class="container" v-if="e && e.widget_type_id == 5 && e.value.slides && e.value.slides.length && !e.value.hidden" :key="e.id">
          <ImageSwiper :id="e.id" :title="e.value.title" :slides="e.value.slides" />
        </div>
        <div class="container" v-if="e && e.widget_type_id == 6 && !e.value.hidden && favouriteProducts && favouriteProducts.length" :key="e.id">
          <FeaturedProductsSwiper :id="e.id" :autoPlay="5000" :loop="e.value.loop" />
        </div>
        <div class="container" v-if="e && e.widget_type_id == 7 && !e.value.hidden" :key="e.id">
          <classic-html-editor :id="e.id" :data="e.value.value" :body="e.value.body" :editable="false"/>
        </div>
        <div class="container" v-if="e && e.widget_type_id == 8" :key="e.id">
          <HtmlWrapper :id="e.id" :value="e.value" />
        </div>
        <div class="container" v-if="e && e.widget_type_id == 9 && e.value.departmentList && !e.value.hidden" :key="e.id">
          <ShopByDepartment :id="e.id" :departments="e.value.departmentList" :autoPlay="5000" :title="e.value.title" :loop="e.value.loop" :editable="false"/>
        </div>
      </template>
    </template>
    <div v-else class="container">
      <div v-if="!page.froala" v-html="page.body"></div>
      <HtmlWrapper v-else-if="page.froala" :value="JSON.parse(page.froala_data)" />
    </div>
  </main>
</template>

<script>
  import widgetsApiService from '@/api-services/widgets.service';
  import CustomPagesService from '@/api-services/custom-pages.service';
  import ProductApiService from '@/api-services/product.service';

  export default {
    name: 'BlankPage',
    props: {
      id: { type: Number, default: null }
    },
    data() {
      return {
        widgets: [],
        page: null
      };
    },
    computed: {
      isAdmin() {
        return this.$store.state.activeUser && this.$store.state.activeUser.is_admin;
      },
      favouriteProducts() {
        return this.$store.state.favouriteProducts;
      }
    },
    async mounted() {
      const res = await CustomPagesService.getPage(this.id);
      if ( res.data.data ) {
        this.page = res.data.data;
      }

      if(this.page.page_type == 'widget') {
        let resp = await widgetsApiService.get({ custom_page_id: this.page.id, skip_process_product_slider: true });
        this.widgets = resp.data.widgets.map(e => {
          e.value = e.value == '' || typeof e.value != 'string' ? e.value : JSON.parse(e.value);
          return e;
        }).sort((a, b) => (a.order > b.order) ? 1 : -1);
      }

      if(this.favouriteProducts == null || !this.favouriteProducts.length) {
        this.getFavouriteProducts();
      }
    },
    methods: {
      async getFavouriteProducts() {
        const response = await ProductApiService.getFavouriteProducts();

        let allProducts = [];

        response.data.data.forEach(item => {
          item.competitors = null;
          item.similars = null;
          item.videos = null;

          allProducts.push(item);
        });

        this.$store.commit('setFavouriteProducts', allProducts);
      }
    }
  };
</script>

<style lang="scss" scoped>
  :deep(figure > div),
  :deep(iframe),
  :deep(.iframely-embed),
  :deep(.iframely-responsive) {
    width: 100%;
    max-width: 100%;
    min-height: 500px;
  }
</style>
