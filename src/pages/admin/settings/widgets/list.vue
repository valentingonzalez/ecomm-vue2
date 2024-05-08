<template>
  <div v-if="$ezHasNoPermission('edit_landing_page')">
    <no-permission page="Landing Page"></no-permission>
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <div class="d-flex align-items-center w-100">
          <h1>Landing Page</h1>
          <div class="badge badge-danger">
            Beta
          </div>
        </div>
        <button class="btn btn-primary save-btn d-none d-md-block mr-3" v-if="isPageEdit && !isSavingMaster" @click="saveAsMasterTemplate">
          Save&nbsp;As&nbsp;Master
        </button>
        <button class="btn btn-primary save-btn d-none d-md-block mr-3"  v-if="isPageEdit && isSavingMaster" disabled="true">
          Saving...
        </button>
        <button class="btn btn-primary save-btn d-none d-md-block" @click="showAddWidgetModal">
          Add
        </button>
      </div>

      <span class="settings-description">
        <a href="#" @click.prevent="$refs.tutorialModal.show()" class="btn btn-tutorial btn-sm text-medium bg-white btn-action">
          <i class="fa fa-play mr-1"></i> Click to Watch Tutorial Video
        </a>
        <b-modal size="lg" ref="tutorialModal">
          <div slot="modal-header">
            <h5>Home Page Editor</h5>
          </div>
          <div>
            <video class="w-100" poster="/images/cover-home-page-editor.jpg" controls>
              <source src="https://storage.googleapis.com/content.ezadtv.com/2024/03/06/65e8c56a0bac7_Homepage_Editor.m4v" type="video/mp4">
            </video>
          </div>
          <div slot="modal-footer">
            <button type="button" class="btn btn-primary" @click="$refs.tutorialModal.hide()">Done</button>
          </div>
        </b-modal>
      </span>
    </div>
    <div class="px-5 pb-5 d-none d-md-block">
      <div class="py-4">
        <WidgetList ref="widgetList" :widgets="widgets" @onReorder="onDrop" @onAdd="onAddWidget" />
      </div>
    </div>
    <div class="d-md-none py-4">
      <div class="alert-danger alert">Please, use a computer or tablet in order to edit widgets.</div>
    </div>
  </div>
</template>

<script>
  import widgetsApiService from '@/api-services/widgets.service';
  import WidgetList from '@/components/widgets/widget-list';
  import NoPermission from "../no-permission";

  // widgets="widgets" onReorder="onDrop"
  export default {
    name: 'WidgetListPage',
    components: {
      NoPermission,
      WidgetList
    },
    data() {
      return {
        saving: false,
        isSavingMaster: false,
        isPageEdit: false,
        pageId: null,
      };
    },
    filters: {
      order(val) {
        return val;
      }
    },
    computed: {
      widgets: {
        get() {
          if(this.$store.state.widgets)
            return this.$store.state.widgets.map(e => {
              e.value = e.value == '' || typeof e.value != 'string' ? e.value : JSON.parse(e.value);
              return e;
            }).sort((a, b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
          return [];
        },
        set(val) {
          return val.sort((a, b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
        }
      },
    },
    async mounted() {
      if (this.$ezHasNoPermission("edit_landing_page")) return;
      this.widgets = this.widgets.sort((a, b) => (a.order > b.order) ? 1 : -1);

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const pageId = urlParams.get('page-id') ? urlParams.get('page-id') :  sessionStorage.getItem("page-id");
      if( pageId ){
        this.pageId = pageId;
        this.isPageEdit = true;
        sessionStorage.setItem("page-id",pageId);
      }
    },
    created() {
      if(!this.$store.state.widgets) {
        widgetsApiService.get({ skip_process_product_slider: true }).then(res => {
          this.$store.commit('saveWidgets', res.data.widgets);
        });
      }
    },
    methods: {
      saveAsMasterTemplate() {
        let self = this;
        self.isSavingMaster = true;

        widgetsApiService.saveWidgetAsTemplate({page_id: this.pageId }).then(() => {
          self.isSavingMaster = false;
          this.$swal({
            toast: true,
            position: 'top',
            type: 'success',
            html: `<div class="ml-2">Saved!</div>`,
            showConfirmButton: false,
            timer: 3000
          });
        });
      },
      showAddWidgetModal() {
        this.$refs.widgetList.showAddWidgetModal();
      },
      onDrop() {
        this.widgets = this.widgets.map((e, i) => {
          e.order = i;
          return e;
        });
        this.widgets.forEach(e => {
          widgetsApiService.update({id: e.id, order: e.order});
        });
      },
      onAddWidget(widget) {
        widgetsApiService.create(widget).then(resp => {
          widget.id = resp.data.id;
          this.$store.commit('addWidget', widget);
          setTimeout(() => {
            let target = document.querySelectorAll('.allWidgets > .wrapper > .w')[document.querySelectorAll('.allWidgets > .wrapper > .w').length - 1];
            window.scroll({ top: target.offsetTop, left: 0, behavior: 'smooth' });
          }, 100);
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
</style>
