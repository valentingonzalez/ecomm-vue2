<template>
  <div>
    <div class="loading d-flex align-items-center justify-content-center position-absolute" v-if="loading">
      <div class="spinner-border mr-2" />
    </div>
    <button @click="save" class="save-btn btn btn-primary" :disabled="saving">
      <div v-if="saving" class="spinner-border mr-2" />Save
    </button>
    <froala-editor ref="froalaEditor" id="froala-editor" />
  </div>
</template>

<script>
import FroalaEditor from '@/components/froala/froala-editor';
import AdminService from '@/api-services/admin.service';
import HomePageApiService from '@/api-services/homepage.service';
import widgetsApiService from '@/api-services/widgets.service';
import CustomPagesService from '@/api-services/custom-pages.service';

export default {
  name: "PageEditor",
  components: { FroalaEditor },
  data() {
    return {
      saving: false,
      loading: false,
      contents: null
    };
  },
  computed: {
    type() {
      return this.$route.params.type || null;
    },
    id() {
      return this.$route.params.id || null;
    }
  },
  async created() {
    this.loading = true;
    let data = null;
    switch(this.type) {
      case 'about':
        this.contents = await HomePageApiService.getAbout();
        data = this.contents.data.data.froala_data;
        break;
      case 'widget':
        this.contents = await widgetsApiService.getSingle(this.id);
        data = this.contents.data.widget.value;
        break;
      case 'page':
        if(this.id == 'new')
          break;
        this.contents = await CustomPagesService.getPage(this.id);
        data = this.contents.data.data.froala_data;
        break;
      default:
        return;
    }
    if(data) {
      await this.$refs.froalaEditor.editor.setJSON(!JSON.parse(data)[0] ? data : JSON.parse(data));
    }
    this.loading = false;

    localStorage.setItem('editingPage', true);
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('editingPage', false);
    });
  },
  methods: {
    async save() {
      this.saving = true;
      await this.$refs.froalaEditor.editor.getJSON().then(async resp => {
        switch(this.type) {
          case 'about':
            await AdminService.saveAbout({froala_data: JSON.stringify(resp)});
            break;
          case 'widget':
            await widgetsApiService.update({ id: this.id, value: resp });
            break;
          case 'page':
            if(this.id == 'new')
              await CustomPagesService.addPage(this.page);
            this.contents.data.data.froala_data = resp;
            await CustomPagesService.updatePage(this.contents.data.data);
            break;
        };
        if(this.type == 'widget') {
          this.$router.push(this.$route.query.redirect, () => {
            window.location.reload();
          });
        } else {
          this.$router.push(this.$route.query.redirect);
        }
        this.saving = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  :deep(#froala-editor) {
    min-height: 100vh !important;
    .fp-container {
      max-width: 1440px;
      margin: 0 auto;
      .fp-element {
        padding-right: 30px;
        padding-left: 30px;
      }
    }
  }
  .save-btn {
    position: absolute;
    top: 6px;
    right: 10px;
    z-index: 10;
  }
  .loading {
    z-index: 20;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255,255,255,.7);
  }
</style>
