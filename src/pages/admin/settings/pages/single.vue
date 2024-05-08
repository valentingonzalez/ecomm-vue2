<template>
  <form :class="saving || loading ? 'disabled' : ''"  @submit.prevent="save">
    <div class="preloader" v-if="loading || saving" />
    <div class="settings-header">
      <div class="settings-header-info">
        <div>
          <div class="small"><router-link to="/admin/settings/pages">Custom pages</router-link><span class="text-muted"> > {{id ? 'Edit' : 'New'}} page</span></div>
          <h1 class="h4 mb-0">
            {{id ? 'Edit' : 'New'}} Page
          </h1>
        </div>
        <div class="d-flex align-items-center">
          <template v-if="!page.froala">
            <a v-if="page.page_type != 'widget'" class="mr-4 text-muted" href="#" @click.prevent="upgrade">Upgrade to new version <i class="fa fa-level-up" aria-hidden="true"></i></a>
          </template>
          <template v-else>
            <a :href="`/admin/page-editor/page/${page.id || 'new'}`" target="_blank" @click.prevent="editPage" class="btn btn-outline-primary mr-3 save-btn">
              Edit Page
            </a>
          </template>
          <router-link :to="`/${page.link}`" target="_blank" class="btn btn-secondary save-btn mr-2">
            Preview
          </router-link>
          <button type="submit" class="btn btn-primary save-btn">
            <span v-if="saving" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
            {{ !saving ? 'Save' : 'Saving...' }}
          </button>
        </div>
      </div>
    </div>
    <div class="px-md-4 pt-4">
      <div class="small mb-2">
        Page Title:
      </div>
      <div class="mb-1">
        <input type="text" class="form-control lead" placeholder="Page Title" required v-model="page.title">
      </div>
      <div class="d-flex justify-content-between mt-2 align-items-center">
        <div class="small mb-3">
            URL: <span>{{storeUrl}}/{{permaLink}}</span>
        </div>
        <div v-if="page.page_type == 'widget'" class="custom-control custom-checkbox ml-4">
          <input v-model="addToHeader" type="checkbox" class="custom-control-input" id="is-loop" checked>
          <label class="custom-control-label pl-1" for="is-loop">Add to header</label>
        </div>
      </div>
      <hr>
      <template v-if="page.page_type == 'widget'">
        <div class="d-flex w-100 justify-content-between my-4 border-bottom pb-2">
          <h2>Widgets</h2>
          <button v-if="widgets && widgets.length" class="btn btn-primary save-btn d-md-block" type="button" @click="showAddWidgetModal">
            Add Widget
          </button>
        </div>
        <WidgetList class="pl-4" v-if="widgets" ref="widgetList" :widgets="widgets" :page="page" @onReorder="onDrop" @onAdd="onAddWidget" @onRemove="onRemoveWidget" @onEditHTML="save" />
      </template>
      <template v-else-if="!page.froala && page.page_type != 'html-viewer'">
        <HtmlEditor v-if="page && page.body != null" v-model="page.body" />
        <button type="submit" class="btn btn-primary save-btn mt-5">
          <span v-if="saving" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
          <span v-if="!saving">Save</span>
          <span v-else>Saving...</span>
        </button>
      </template>
      <template v-else>
        <template v-if="page.froala_data">
          <html-wrapper :value="JSON.parse(page.froala_data)" />
        </template>
        <div v-else>
          <div class="display-3"><small class="font-weight-light">There are no contents yet.</small></div>
          <div class="display-4"><small><small class="font-weight-light">Please, click on Edit Page button to add some content.</small></small></div>
        </div>
      </template>
    </div>
  </form>
</template>

<script>
  import CustomPagesService from '@/api-services/custom-pages.service';
  import CustomNavigationService from '@/api-services/custom-navigation.service';
  import widgetsApiService from '@/api-services/widgets.service';
  import WidgetList from '@/components/widgets/widget-list';

  export default {
    name: 'NewPage',
    components: {
      WidgetList
    },
    data() {
      return {
        saving: false,
        loading: true,
        widgets: null,
        addToHeader: false,
        page: {
          title: '',
          link: '',
          body: '',
          nav_id: false,
          navigation: 0,
          page_type: ''
        },
      };
    },
    computed: {
      navElement: {
        get() {
          return this.$store.state.customNavigation.find(e => e.target.replace('/', '') == this.permaLink);
        },
        set(val) {
          return val;
        }
      },
      id() {
        return this.$route.params.id || null;
      },
      editingPage() {
        return localStorage.getItem('editingPage');
      },
      navigationGroups() {
        return this.$store.state.customNavigationGroups;
      },
      storeUrl() {
        return window.location.origin;
      },
      pages() {
        return this.$store.state.customPages;
      },
      permaLink: {
        get() {
          let permalink = this.page.title.toString().toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '');
          return permalink;
        },
        set(val) {
          return val;
        }
      },
    },
    async mounted() {
      let pageResponse = await CustomPagesService.getPage(this.id);
      if(pageResponse.data.data)
      this.page = pageResponse.data.data;
      if(this.navElement) {
        this.addToHeader = true;
      }
      this.loading = false;
      let resp = await widgetsApiService.get({ custom_page_id: this.page.id, view_as_admin: true, skip_process_product_slider: true });
      this.widgets = resp.data.widgets.map(e => {
        e.value = e.value == '' || typeof e.value != 'string' ? e.value : JSON.parse(e.value);
        return e;
      }).sort((a, b) => (a.order > b.order) ? 1 : -1);
    },
    methods: {
      onDrop() {
        this.widgets = this.widgets.map((e, i) => {
          e.order = i;
          return e;
        });
        this.widgets.forEach(e => widgetsApiService.update({id: e.id, order: e.order}));
      },
      showAddWidgetModal() {
        this.$refs.widgetList.showAddWidgetModal();
      },
      editPage(evt) {
        if(this.id) {
          let win = window.open(evt.target.getAttribute('href'), '_blank');
          win.focus();
          return;
        }
        this.$swal({
          type: 'warning',
          html: `<div class="d-flex flex-column align-items-center h2">You have to save your page before editing it</div>`,
          confirmButtonText: 'OK',
          showLoaderOnConfirm: true,
          showCancelButton: false
        });
      },
      async save() {
        this.saving = true;
        if(this.checkExistingPageTitle(this.page.title) === true){
          this.$swal('This title is already being used in another custom page. Please choose a different title.', '', 'error');
          this.saving = false;
          return;
        };
        this.page.link = this.permaLink;
        /* if(!this.page.navigation) {
          this.page.nav_id = 0;
          this.page.navigation = 0;
        } */
        if(!this.page.id)
          CustomPagesService.addPage(this.page).then(response => {
            this.$router.push({name: 'edit-page', params: {id: response.data.id}});
          });
        else {
          // this.page.navigation = this.page.navigation || 0;
          CustomPagesService.updatePage(this.page).then(() => {
            this.saving = false;
            this.$store.commit('updateCustomPage', this.page);
          });
        }
        if(this.addToHeader) {
          if(this.navElement)
            return;
          let order = Math.max(...this.$store.state.customNavigation.map(e => Number(e.order))) + 1;
          let nav = { align: 'left', name: this.page.title, show_in_header: 0, target: this.permaLink, order: order };
          await CustomNavigationService.postNavigation(nav).then(res => {
            if(res.data && res.data.id) {
              nav.id = res.data.id;
              this.$store.commit('addNavigation', nav);
            }
          });
        } else {
          if(this.navElement) {
            await CustomNavigationService.deleteNavigation(this.navElement.id);
            this.$store.commit('deleteNavigation', this.navElement.id);
          }
        }
        this.$swal({
          toast: true,
          position: 'top',
          type: 'success',
          html: `<div class="ml-2">Saved!</div>`,
          showConfirmButton: false,
          timer: 3000
        });
        this.saving = false;
      },
      upgrade() {
        this.$swal({
          type: 'info',
          html: `
            <div style="line-height: 25px;" class="d-flex flex-column align-items-center">
              <p>You are about to change this page to use the widgets based newer system. Please note the following in advance:</p>
              <br>
              <div style="text-align: left;">
                <p><i class="fa fa-info-circle done-check-info-icon"></i> Any existing HTML content in this page will be available inside of a Classic HTML Editor widget.</p>
                <p><i class="fa fa-info-circle done-check-info-icon"></i> This action can't be reversed.</p>
              </div>
            </div>`,
          confirmButtonText: 'Yes, upgrade',
          showLoaderOnConfirm: true,
          showCancelButton: true,
          preConfirm: async response => {
            if(response) {
              this.page.page_type = 'widget';
              this.loading = true;
              if(this.id) {
                await CustomPagesService.updatePage(this.page);
                this.onAddWidget({ widget_type_id: 7, order: 1, value: JSON.stringify({hidden: false}), master: this.$store.state.activeUser.data.is_developer });
              }
              this.loading = false;
            }
          }
        });
      },
      onAddWidget(widget) {
        widgetsApiService.create({ ...widget, custom_page_id: this.page.id }).then(resp => {
          widget.id = resp.data.id;
          this.widgets.push(widget);
          setTimeout(() => {
            let target = document.querySelectorAll('.allWidgets > .wrapper > .w')[document.querySelectorAll('.allWidgets > .wrapper > .w').length - 1];
            window.scroll({ top: target.offsetTop, left: 0, behavior: 'smooth' });
          }, 100);
        });
      },
      onRemoveWidget(id) {
        this.widgets = this.widgets.filter(e => e.id != id);
      },
      checkExistingPageTitle(attemptedTitle) {
        for(let i = 0; i < this.pages.length; i++){
          if(this.pages[i].title.toLowerCase() === attemptedTitle.toLowerCase() && this.pages[i].id != this.page.id){
            return true;
          };
        }
        return false;
      },
    }
  };
</script>

<style lang="scss" scoped>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background: rgba(255,255,255,.7);
    z-index: 20000;
    display: flex;
    align-items: center;
    font-size: 28px;
    justify-content: center;
  }
</style>
