<template>
  <b-modal size="lg" class="modal-box" ref="departmentSettingsModal"
    :lazy="false"
    :visible="false"
    @shown="getDepartmentSettings"
    @ok.prevent="saveSettings"
    @cancel="settings_fields = []"
    ok-title="Save"
    ok-variant="primary"
    cancel-variant="default"
    title="Settings"
    title-class="w-100 text-md-center">


    <div v-if="loading" class="d-flex justify-content-center">
      <b-spinner style="width: 3rem; height: 3rem;" class="text-center"></b-spinner>
    </div>
    <div v-else-if="settings_fields.length == 0">
      <h3 class="text-center">There aren't any settings fields.</h3>
    </div>
    <div v-else-if="saving">
      <div class="col text-center">
        <h3>Saving...</h3>
        <b-spinner style="width: 3rem; height: 3rem;" class="text-center"></b-spinner>
      </div>
    </div>
    <div v-cloak v-else>
      <div v-for="(field, i) in settings_fields" :key="field.key" class="mb-4">
        <div class="d-flex align-items-center">
          <b-form-checkbox v-if="field.type == 'bool'" v-model="settings_values[field.key]" switch class="mt-0" />
          <h6 class="my-0">{{ field.editorName }}</h6>
        </div>
        <p v-if="field.description" class="mt-1 mb-2 text-muted">{{ field.description }}</p>
        <b-input v-if="field.type == 'int'" v-model="settings_values[field.key]" :placeholder="field.editorName" type="number" class="mb-3"></b-input>
        <div v-if="field.key == 'departmentImage'" class="mt-3">
          <div v-if="!settings_values.customImage">
            <div class="row">
              <div class="col text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none"><path stroke="#9CA3AF" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M28 8H12a4 4 0 0 0-4 4v20m0 0v4a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4v-8M8 32l9.172-9.172a4 4 0 0 1 5.656 0L28 28m12-8v8m0 0-3.172-3.172a4 4 0 0 0-5.656 0L28 28m0 0 4 4m4-24h8m-4-4v8m-12 4h.02"/></svg>
              </div>
            </div>
            <div class="row justify-content-center mt-2">
              <div class="col-md-8">
                <b-input 
                  v-if="field.type == 'text' && field.key == 'departmentImage'" 
                  v-model="settings_values[field.key]" 
                  placeholder="Product SKU" 
                  :class="[validateTextarea(field.key)]"
                  >
                </b-input>
              </div>
            </div>
            <div class="row justify-content-center">
              <div class="col-md-4 pr-0" style="max-width: 225px;">
                <hr class="my-3 ml-auto mr-0">
              </div> 
              <div class="col-md-1 d-flex align-items-center py-1">
                <span class="bg-white px-2 text-muted">OR</span>
              </div>
              <div class="col-md-4 pl-0" style="max-width: 225px;">
                <hr class="my-3 mr-auto ml-0">
              </div>
            </div>
            <div class="row justify-content-center">
              <div class="col-md-8 text-center">
                <span class="mb-1" v-if="!loading">
                  <a href="#" style="color: #2563EB;" @click.prevent="$refs[`imageUploader-${i}`][0].click()"><b>Upload a Custom Image</b></a>
                </span>
                <br>
                <span class="text-muted" v-if="!loading">It will replace the product image you may have selected with a SKU.</span>
                <span v-else><div class="spinner-border spinner-border-sm" /></span>
                <input type="file" class="d-none" @change="uploadImage" :ref="`imageUploader-${i}`"/>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="row mt-3">
              <div class="col text-center position-relative">
                <img :src="settings_values.customImage" width="120" height="120" target="_blank" />
                <span class="position-absolute pt-1 badge badge-transparent badge-pill cursor-pointer text-white" style="left: 425px; top: 5px; background: #EF4444;" @click.prevent="deleteCustomImage(settings_values.customImage)">X</span>
              </div>
            </div>
            <div class="row mt-2">
              <div class="col text-center position-relative">
                <span>{{ extractFilenameFromUrl(settings_values.customImage) }}</span>
              </div>
            </div>
            <div class="row mt-2">
              <div class="col text-center position-relative">
                <button class="btn btn-sm btn-outline-dark" @click.prevent="$refs[`imageUploader-${i}`][0].click()">Upload a New Image</button>
              </div>
            </div>
          </div>
        </div>
        <!-- Add text limit to placeholder texts for disabled options -->
        <b-textarea 
          v-if="field.type == 'text' && field.key != 'departmentImage'" 
          v-model="settings_values[field.key]" 
          :placeholder="field.editorName" 
          :class="[validateTextarea(field.key)]"
          >
        </b-textarea>
      </div>
    </div>
  </b-modal>

</template>

<script>
import DepartmentService from '@/api-services/departments.service';
import AdminService from '@/api-services/admin.service';

export default {
  name: 'DepartmentSettings',
  props: {
    currentNode: {
      type: Object,
      default: null
    },
    selectedStore: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      settings_fields: [],
      settings_values: {},
      saving: false,
      loading: false,
      limit_text_fields: [
        'qtyMessage',
        'hidePriceText',
        'disableShippingText',
        'disableOrderingText',
        'disableDeliveryText',
      ]
    };
  },
  methods: {
    validateTextarea(key){
      if(this.settings_values[key] && this.limit_text_fields.includes(key)) {
        return this.settings_values[key].length > 50 ? 'is-invalid' : this.settings_values[key].length > 0 ? 'is-valid' : '';
      }
      return '';
    },
    async getDepartmentSettings() {
      this.loading = true;
      this.settings_fields = [];
      let departmentId = this.currentNode.dept_id;
      let response = await DepartmentService.getDepartmentSettings(departmentId, this.selectedStore);
      var fields = response.data.fields;
      if (response.data.values[0] != null) {
        this.settings_fields = fields;
        var values = JSON.parse(response.data.values[0]);
        this.createSettingsValues(this.settings_fields, values);
      } else {
        this.settings_fields = fields;
      }
      // don't show custom image field as we are displaying it alongside original departmentImage
      this.settings_fields = this.settings_fields.filter(field => field.key !== 'customImage');
      this.loading = false;
    },
    showModal() {
      this.settings_values = {};
      this.$refs.departmentSettingsModal.show();
    },
    createSettingsValues(fields, values) {
      fields.forEach(field => {
        this.settings_values[field.key] = values[field.key];
      });
    },
    getSettingsValues() {
      return;
    },
    cleanValues(obj) {
      for (var prop in obj) {
        if (obj[prop] === null || obj[prop] === undefined || obj[prop] === '') {
          delete obj[prop];
        }
      };
      return obj;
    },
    async saveSettings() {
      // validating the text lengths for placeholders text
      let validation = [];
      this.limit_text_fields.forEach(key => {
        if(this.settings_values[key] && this.settings_values[key].length > 50) {
          validation.push(`<b>${this.settings_fields.find(x => x.key == key).editorName}:</b> Character Length should be less than 50`);
        }
      });
      if(validation.length > 0) {
        this.$swal('Validation', validation.join('<br>'), 'error');
        return;
      }
      // validating the text lengths for placeholders text
      this.saving = true;
      this.$parent.saving = true;
      let settings = this.cleanValues(this.settings_values);
      const hideProducts = settings.hideProducts || false;
      settings = JSON.stringify(settings);
      const dept_id = this.currentNode.dept_id;
      let response = await DepartmentService.saveDepartmentSettings(dept_id, settings, this.selectedStore);
      if(response.data.status == 'error') {
        this.$swal('Product not found', 'The product you are trying to use for the department image was not found.', 'error');
        this.saving = false;
        // this.$parent.saving = false;
        return;
      }
      this.saving = false;
      this.$parent.saving = false;
      this.settings_fields = [];
      this.$refs.departmentSettingsModal.hide();

      this.currentNode.hide_products = hideProducts;
    },
    uploadImage(evt) {
      const file = this.checkFile(evt);
      if(file == 'not allowed') {
        this.$swal('Only JPG file formats are supported.', '', 'error');
        return;
      }
      this.loading = true;

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width < 130 || img.height < 130) {
          this.$swal('The image dimensions should be at least 130x130 pixels.', '', 'error');
          this.loading = false;
          return;
        }

        if (img.width !== img.height) {
          this.$swal('Your image may not look centered as it was not in a 1:1 aspect ratio. We recommend using 1:1 aspect ratio images.');
        }

        const MAX_SIZE = 130;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scale = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height);
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        canvas.toBlob((blob) => {
          const modifiedFile = new File([blob], file.name, { type: file.type });

          AdminService.uploadImage(modifiedFile)
            .then(response => {
              this.settings_values.customImage = response.data.url;
              this.loading = false;
            })
            .catch(() => {
              this.$swal('Something went wrong while uploading your image.', '', 'error');
            });
        }, file.type);
      };
    },
    checkFile(evt) {
      const file = evt.dataTransfer ? evt.dataTransfer.files[0] : evt.target.files[0];
      const allowedFormats = ['image/jpg', 'image/jpeg'];
      if (!allowedFormats.includes(file.type)) {
        return 'not allowed';
      }
      if(file.name.includes(' ')) {
        var newName = file.name.replace(/ /g, "_");
        var newFile = new File([file], newName, {type: file.type});
        return newFile;
      } else {
        return file;
      }
    },
    deleteCustomImage() {
      AdminService.deleteCustomImageForDepartment({dept_id: this.currentNode.dept_id}).then(() => {
        this.$refs.departmentSettingsModal.hide();
        this.$swal('Your custom image has been removed successfully.', '', 'success');
        this.$refs.departmentSettingsModal.show();
      });
    },
    extractFilenameFromUrl(url) {
      const segments = url.split('/');
      return segments[segments.length - 1];
    },
  }
};
</script>
