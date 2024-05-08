<template>
  <div v-if="$ezHasNoPermission('manage_header_and_footer')">
    <NoPermission />
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <div>
          <h1>Top Banner</h1>
        </div>

        <button class="btn btn-primary save-btn d-none d-md-block" :disabled="saving" @click="updateBusinessSettings">
          <i v-if="saving" class="fa fa-spin fa-spinner mr-1"></i>
          Save
        </button>
      </div>
      <div style="margin-right:auto">
        <a @click="$refs.tutorialModal.show()" class="btn btn-tutorial mt-2 btn-sm text-small bg-white btn-action">
          <i class="fa fa-play mr-1"></i>
          Click to Watch Tutorial Video
        </a>
      </div>
    </div>
     <b-modal size="lg" ref="tutorialModal">
                <div slot="modal-header">
                  <h5>Top Banner</h5>
                </div>
                <div>
                  <video class="w-100" poster="/images/cover-top-banner.png" controls>
                    <source src="https://storage.googleapis.com/content.ezadtv.com/2024/04/04/660edb51bc1c0_Top_Banner.m4v" type="video/mp4">
                  </video>
                </div>
                <div slot="modal-footer">
                  <button type="button" class="btn btn-primary" @click="$refs.tutorialModal.hide()">Done</button>
                </div>
      </b-modal>
    <div class="settings-body">
      <div class="pb-3 mb-3 border-bottom">
        <div class="d-flex justify-content-between align-items-end mb-3">
          <h5 class="mb-0 font-weight-bold">Preview</h5>
          <div class="custom-control custom-switch">
            <input type="checkbox" v-model="settings.visible" class="custom-control-input" id="show-banner">
            <label class="custom-control-label" for="show-banner"
              v-html="settings.visible && settings.visible === true ? 'Show' : 'Hide'">
            </label>
          </div>
        </div>
        <AlertBanner v-if="settings.visible" :options="settings" :text="settings.text" />
        <div v-else>
          <dfn class="small">Banner Hidden</dfn>
        </div>
      </div>
      <div class="form-group">
        <label class="label">Banner Text</label>
        <input class="form-control" type="text" v-model="settings.text" placeholder="Banner Text" />
      </div>
      <div class="d-flex" style="gap: 30px;">
        <div class="form-group">
          <label for="bg-color">Background Color</label>
          <div class="d-flex align-items-center color-radios">
            <div class="color-radio mr-1" v-for="color in colors" :key="`bg-${color}`">
              <input type="radio" name="bgColor" v-model="settings.background" :id="`bg-${color}`" :value="color" />
              <label :for="`bg-${color}`" :style="{ background: parseColor(color) }" v-b-tooltip.hover
                :title="color"></label>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="bg-color">Text Color</label>
          <div class="d-flex align-items-center color-radios">
            <div class="color-radio mr-1" v-for="color in colors" :key="`text-${color}`">
              <input type="radio" name="textColor" v-model="settings.textColor" :id="`text-${color}`" :value="color" />
              <label :for="`text-${color}`" :style="{ background: parseColor(color) }" v-b-tooltip.hover
                :title="color"></label>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="label">Font Size</label>
          <input class="form-control" type="text" v-model="settings.fontSize" placeholder="HomeAlert FontSize" />
        </div>
        <div class="form-group">
          <label for="bg-color">Font Weight</label>
          <select class="form-control" id="text-color" v-model="settings.fontWeight">
            <option v-for="(key, label) in fontWeights" :key="key" :value="key">
              {{ label }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import NoPermission from './no-permission';
  import AlertBanner from '@/components/alert-banner';

  export default {
    name: 'topBanner',
    components: { NoPermission, AlertBanner },
    data() {
      return {
        saving: false,
        settings: {
          visible: false,
          text: '',
          background: '',
          textColor: '',
          fontSize: '',
          fontWeight: ''
        },
        colors: [
          'black',
          'dark',
          'muted',
          'white',
          'primary',
          'secondary',
          'success',
          'danger',
          'warning',
          'info'
        ],
        fontWeights: {
          light: 100,
          regular: 400,
          bold: 700
        }
      };
    },
    computed: {
    },
    async mounted() {
      if(this.$ezHasNoPermission("manage_header_and_footer")) return;
      await AdminService.getBusinessSettings({ category: 'homeAlert' }).then(response => {

        this.settings = Object.keys(response.data.settings).reduce((acc, key) => (
          {...acc, ...{ [key.replace('homeAlert-', '')]: response.data.settings[key] }}
        ), {});
      });
    },
    methods: {
      updateBusinessSettings() {
        //this.saving = true;
        let settings = Object.keys(this.settings).reduce((acc, key) => (
          {...acc, ...{ [`homeAlert-${key}`]: this.settings[key] }}
        ), {});
        AdminService.updateBusinessSettings({settings: settings}).then((res) => {
          if (res.data.status === 'success') {
            this.saving = false;
            this.$swal({
              toast: true,
              position: 'top',
              type: 'success',
              html: `<div class="ml-2">${res.data.message}</div>`,
              showConfirmButton: false,
              timer: 3000
            });
          }
        });
      },
      parseColor(color) {
        let re = /^#([0-9A-F]{3}){1,2}$/i;
        return re.test(color) ? color : `var(--${color})`;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .color-preview {
    height: 1.5rem;
  }
  label {
    font-weight: bold;
  }
  .color-radios {
    height: 43px;
    .color-radio {
      height: 20px;
      input {
        display: none;
        &:checked ~ label {
          border: 3px solid #000;
        }
      }
      label {
        width: 20px;
        height: 20px;
        border: 1px solid #ccc;
        cursor: pointer;
      }
    }
  }
</style>
