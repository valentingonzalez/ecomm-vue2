<template>
  <div>
    <main v-if="widgets && widgets.length">
      <div v-for="e in widgets" :key="e.id">
        <div class="container" v-if="e && e.widget_type_id == 1 && e.value.value &&  e.value.value.length && !e.value.hidden && isEnabledForLocation(e)">
          <Carousel :id="e.id" :title="e.value.title" :slides="e.value.value" :responsive="e.value.responsive" />
        </div>
        <div class="container" v-if="e && e.widget_type_id == 2 && e.value.productList && !e.value.hidden && showProductSwiper(e) && isEnabledForLocation(e)">
          <div class="d-flex justify-content-between" v-if="isAdmin && !isTruevalue">
            <div class="d-flex align-items-center">
              <div v-if="e.ai" class="font-weight-bold text-danger mr-2 d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 15 15" fill="none">
                  <path d="M2.5 10.25V14.25C2.5 14.5263 2.72375 14.75 3 14.75H4.5V10.25H2.5Z" fill="#CED7DD"/>
                  <path d="M12.5 10.25V14.25C12.5 14.5263 12.2763 14.75 12 14.75H10.5V10.25H12.5Z" fill="#CED7DD"/>
                  <path d="M4 11.1975C3.88 11.2325 3.755 11.25 3.625 11.25C2.865 11.25 2.25 10.635 2.25 9.875C2.25 9.115 2.865 8.5 3.625 8.5C4.0525 8.5 4.4325 8.6925 4.6825 8.9975L4 11.1975Z" fill="#B3C1C9"/>
                  <path d="M10.3175 8.9975C10.5675 8.6925 10.9475 8.5 11.375 8.5C12.135 8.5 12.75 9.115 12.75 9.875C12.75 10.635 12.135 11.25 11.375 11.25C11.245 11.25 11.12 11.2325 11 11.1975L10.3175 8.9975Z" fill="#B3C1C9"/>
                  <path d="M2.855 5.25H2.75C2.1975 5.25 1.75 4.8025 1.75 4.25V3.75C1.75 3.1975 2.1975 2.75 2.75 2.75H2.855V5.25Z" fill="#CED7DD"/>
                  <path d="M12.145 2.75H12.25C12.8025 2.75 13.25 3.1975 13.25 3.75V4.25C13.25 4.8025 12.8025 5.25 12.25 5.25H12.145V2.75Z" fill="#CED7DD"/>
                  <path d="M6.25 7H8.75V8.75H6.25V7Z" fill="#CED7DD"/>
                  <path d="M9.5 0.75H5.5C3.98122 0.75 2.75 1.98122 2.75 3.5V4.5C2.75 6.01878 3.98122 7.25 5.5 7.25H9.5C11.0188 7.25 12.25 6.01878 12.25 4.5V3.5C12.25 1.98122 11.0188 0.75 9.5 0.75Z" fill="#E4EAEF"/>
                  <path d="M9.5 2.25H5.5C4.5335 2.25 3.75 3.0335 3.75 4C3.75 4.9665 4.5335 5.75 5.5 5.75H9.5C10.4665 5.75 11.25 4.9665 11.25 4C11.25 3.0335 10.4665 2.25 9.5 2.25Z" fill="#122359"/>
                  <path d="M6 8.5H9C10.1037 8.5 11 9.39625 11 10.5V14.25C11 14.526 10.776 14.75 10.5 14.75H4.5C4.224 14.75 4 14.526 4 14.25V10.5C4 9.39625 4.89625 8.5 6 8.5Z" fill="#E4EAEF"/>
                  <path d="M9.03001 1.9165C9.24276 1.62825 9.49926 1.19025 9.50001 0.75225C9.50051 0.476 9.27626 0.25 9.00001 0.25H5.99976C5.72351 0.25 5.49926 0.476 5.49976 0.75225C5.50051 1.1905 5.75701 1.6285 5.96976 1.9165C6.12601 2.12825 6.37526 2.25 6.63851 2.25H8.36101C8.62426 2.25 8.87376 2.12825 9.03001 1.9165Z" fill="#CED7DD"/>
                  <path d="M5.5 4.5C5.77614 4.5 6 4.27614 6 4C6 3.72386 5.77614 3.5 5.5 3.5C5.22386 3.5 5 3.72386 5 4C5 4.27614 5.22386 4.5 5.5 4.5Z" fill="#71FFE4"/>
                  <path d="M9.5 4.5C9.77614 4.5 10 4.27614 10 4C10 3.72386 9.77614 3.5 9.5 3.5C9.22386 3.5 9 3.72386 9 4C9 4.27614 9.22386 4.5 9.5 4.5Z" fill="#71FFE4"/>
                </svg>
                <span>Added by AI Widgets Builder</span>
              </div>
              <button class="btn btn-primary btn-xs" v-if="e.ai" @click="redirectToWidget(e.id)" type="button" >Edit</button>
            </div>
            <button type="button" @click="copyIframeToClipboard($event, e.widget_type_id)" class="btn btn-primary btn-xs copyIframeBtn">Copy Iframe</button>
          </div>
          <ProductSwiper :id="e.id" :products="e.value.productList" :widget="e" :autoPlay="5000" :title="e.value.title" :loop="e.value.loop" />
        </div>
        <div class="container" v-if="e && e.widget_type_id == 3 && e.value.testimonials && e.value.testimonials.length && !e.value.hidden && isEnabledForLocation(e)">
          <Testimonials :id="e.id" :testimonials="e.value.testimonials" :title="e.value.title" />
        </div>
        <div class="container" v-if="e && e.widget_type_id == 4 && e.value.value && !e.value.hidden && isEnabledForLocation(e)">
          <Subscription :id="e.id" :data="e.value.value" :title="e.value.title" />
        </div>
        <div class="container" v-if="e && e.widget_type_id == 5 && e.value.slides && e.value.slides.length && !e.value.hidden && isEnabledForLocation(e)">
          <div class="d-flex justify-content-end" v-if="isAdmin && !isTruevalue">
            <button type="button" @click="copyIframeToClipboard($event, e.widget_type_id)" class="btn btn-primary btn-xs copyIframeBtn">Copy Iframe</button>
          </div>
          <ImageSwiper :id="e.id" :title="e.value.title" :slides="e.value.slides" />
        </div>
        <div class="container" v-if="e && e.widget_type_id == 6 && !e.value.hidden && isEnabledForLocation(e)">
          <div class="d-flex justify-content-end" v-if="isAdmin && !isTruevalue">
            <button type="button" @click="copyIframeToClipboard($event, e.widget_type_id)" class="btn btn-primary btn-xs copyIframeBtn">Copy Iframe</button>
          </div>
          <FeaturedProductsSwiper :id="e.id" :autoPlay="5000" :loop="e.value.loop" />
        </div>
        <div class="container" v-if="e && e.widget_type_id == 7 && !e.value.hidden && isEnabledForLocation(e)" :key="e.id">
            <classic-html-editor :id="e.id" :data="e.value.value" :body="e.value.body" :editable="false" :keepBody="true"/>
          </div>

        <div class="container" v-if="e && e.widget_type_id == 8">
          <HtmlWrapper :id="e.id" :value="e.value" />
        </div>
        <div class="container" v-if="e && e.widget_type_id == 9 && !e.hidden && !e.value.hidden && isEnabledForLocation(e)">
          <div class="d-flex justify-content-end" v-if="isAdmin && !isTruevalue">
            <button type="button" @click="copyIframeToClipboard($event, e.widget_type_id)" class="btn btn-primary btn-xs copyIframeBtn">Copy Iframe</button>
          </div>
          <div v-if="e.value.departmentList">
            <ShopByDepartment :id="e.id" :departments="e.value.departmentList" :autoPlay="5000" :title="e.value.title" :loop="e.value.loop" :editable="false"/>
          </div>
          <div v-if="e.value.productList">
            <BomSwiper :id="e.id" :products="e.value.productList" title="Bargains of the month" :loop="e.value.loop" />
          </div>
        </div>
        <div class="container" v-if="e && e.widget_type_id == 16 && recentlyViewedItems">              
          <recent-viewed-swiper :id="e.id" :key="recentlyViewedItems.length" :autoPlay="5000" :loop="e.value.loop" />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  
  
  export default {
    name: 'HomeMain',
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
      },
      recentlyViewedItems(){
        if(this.$store.state.recentVieweditems)
          return this.$store.state.recentVieweditems;
        return null;
      },
      stores() {
        return this.$store.state.storeLocations || [];
      },
      selectedStore() {
        return localStorage.getItem('selectedStore') || null;
      }
    },
    async mounted() {
      this.$ezSetTitle('');
      this.$store.dispatch('recentViewedItems');
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
      },
      isEnabledForLocation(e) {
        let associatedLocations = e.associated_locations || null;
        if (this.stores.length > 0 && this.selectedStore && associatedLocations && Array.isArray(associatedLocations) && associatedLocations.length > 0) {
          return associatedLocations.some((location) => location.id == this.selectedStore);
        }
        return true;
      },
      redirectToWidget(widget_id) {
        this.$router.push({ name: "admin-settings-widgets", query: { widget_id: widget_id } }).catch(err => console.log(err));
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
