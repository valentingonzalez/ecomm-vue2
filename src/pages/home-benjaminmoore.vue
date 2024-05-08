<template>
  <div>
    <div v-if="widgets && widgets.length">
      <div v-for="e in widgets" :key="e.id">
        <div class="container" v-if="e && e.widget_type_id == 1 && e.value.value &&  e.value.value.length && !e.value.hidden">
          <Carousel :id="e.id" :title="e.value.title" :slides="e.value.value" :responsive="e.value.responsive" />
        </div>
        <BmooreHero v-if="e && e.widget_type_id == 10" :id="e.id" :data="e.value.value" />
        <ColorOfTheYear v-if="e && e.widget_type_id == 11" :id="e.id" :data="e.value.value" />
        <ServicesList v-if="e && e.widget_type_id == 14" :id="e.id" :data="e.value.value" />
        <div class="bg-alt py-5" v-if="e && e.widget_type_id == 15">
          <div class="container my-5">
            <ColorGrid :id="e.id" :data="e.value.value" />
          </div>
        </div>
        <div class="container my-3" v-if="e && e.widget_type_id == 2 && e.value.productList && !e.value.hidden && showProductSwiper(e)">
          <div class="d-flex justify-content-end" v-if="isAdmin && !isTruevalue">
            <button type="button" @click="copyIframeToClipboard($event, e.widget_type_id)" class="btn btn-primary btn-xs copyIframeBtn">Copy Iframe</button>
          </div>        
          <ProductSwiper :id="e.id" :products="e.value.productList" :widget="e" :autoPlay="5000" :title="e.value.title" :loop="e.value.loop" />
        </div>
        <div class="container my-3" v-if="e && e.widget_type_id == 3 && e.value.testimonials && e.value.testimonials.length && !e.value.hidden">
          <Testimonials :id="e.id" :testimonials="e.value.testimonials" :title="e.value.title" />
        </div>
        <div class="container my-3" v-if="e && e.widget_type_id == 4 && e.value.value && !e.value.hidden">
          <Subscription :id="e.id" :data="e.value.value" :title="e.value.title" />
        </div>
        <div class="container my-3" v-if="e && e.widget_type_id == 5 && e.value.slides && e.value.slides.length && !e.value.hidden">
          <div class="d-flex justify-content-end" v-if="isAdmin && !isTruevalue">
            <button type="button" @click="copyIframeToClipboard($event, e.widget_type_id)" class="btn btn-primary btn-xs copyIframeBtn">Copy Iframe</button>
          </div>
          <ImageSwiper :id="e.id" :title="e.value.title" :slides="e.value.slides" />
        </div>
        <div class="container my-3" v-if="e && e.widget_type_id == 6 && !e.value.hidden">
          <div class="d-flex justify-content-end" v-if="isAdmin && !isTruevalue">
            <button type="button" @click="copyIframeToClipboard($event, e.widget_type_id)" class="btn btn-primary btn-xs copyIframeBtn">Copy Iframe</button>
          </div>
          <FeaturedProductsSwiper :id="e.id" :autoPlay="5000" :loop="e.value.loop" />
        </div>
        <div class="container my-3" v-if="e && e.widget_type_id == 8">
          <HtmlWrapper :id="e.id" :value="e.value" />
        </div>
        <div class="container my-3" v-if="e && e.widget_type_id == 9 && !e.hidden && !e.value.hidden">
          <div class="d-flex justify-content-end" v-if="isAdmin && !isTruevalue">
            <button type="button" @click="copyIframeToClipboard($event, e.widget_type_id)" class="btn btn-primary btn-xs copyIframeBtn">Copy Iframe</button>
          </div>
          <div v-if="e.value.departmentList">
            <ShopByDepartment :id="e.id" :departments="e.value.departmentList" :autoPlay="5000" :title="e.value.title" :loop="e.value.loop" :editable="false"/>
          </div>
          <BomSwiper :id="e.id" :products="e.value.productList" title="Bargains of the month" :loop="e.value.loop" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BmooreHero from '@/components/widgets/bmoore-hero.vue';
  import ServicesList from '@/components/widgets/services-list.vue';
  import ColorOfTheYear from '@/components/widgets/color-of-the-year.vue';
  import ColorGrid from '@/components/widgets/color-grid.vue';

  export default {
    name: 'HomeBenjaminMoore',
    components: {
      BmooreHero,
      ServicesList,
      ColorOfTheYear,
      ColorGrid
    },
    data() {
      return {};
    },
    computed: {
      widgets() {
        if(this.$store.state.widgets)
          return this.$store.state.widgets.map(e => {
            e.value = e.value == '' || typeof e.value != 'string' ? e.value : JSON.parse(e.value);
            return e;
          }).sort((a, b) => (a.order > b.order) ? 1 : -1);
        return null;
      },
      isAdmin() {
        return this.$store.state.activeUser && this.$store.state.activeUser.is_admin;
      },
      isTruevalue() {
        return this.$root.$children[0].isTruevalue;
      }
    },
    async mounted() {
      this.$ezSetTitle('');
      //console.log(this.$store.state.departments);
    },
    methods: {
      copyIframeToClipboard(evt, id) {
        let button = evt.currentTarget;
        let btnHTML = button.innerHTML;

        let iframe = `<iframe style="overflow: hidden;padding-top:15px;" src="${window.location.protocol}//${window.location.host}/all-products-iframe/${id}?iframe=true" width="100%" height="350"></iframe>`;
        let textArea = document.createElement("textarea");
        textArea.classList = 'shadow-elm';
        textArea.value = iframe;

        document.body.appendChild(textArea);
        // textArea.focus();
        textArea.select();

        document.execCommand('copy');
        button.innerHTML = 'Copied!';
        setTimeout(() => button.innerHTML = btnHTML, 3000);
        document.body.removeChild(textArea);
      },
      showProductSwiper(e) {
        return Array.isArray(e.value.productList) ? e.value.productList.length > 0 : true;
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@/assets/scss/home.scss';
  main {
    padding-bottom: 0;
  }
</style>
