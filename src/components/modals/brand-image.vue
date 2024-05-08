<template>
  <b-modal size="lg" class="modal-box" ref="brandImageModal" :lazy="false" :visible="false" title="Update Brand Image" @hidden="clearModal">
    <div>
      <p>Upload a new image to use as the logo for this brand</p>
      <div class="row align-items-center justify-content-center" style="height: 30vh; border: 2px dashed lightblue;" @dragover.prevent @drop.prevent="uploadImage">
        <div class="col text-center hoverable" v-if="!uploadingImage && !newImage" @click="$refs.fileUploader.click()">
          <h3>Drag and Drop Image Here or Click to Upload</h3>
          <h3>Recommended Size: 256x256</h3>
          <input type="file" ref="fileUploader" class="d-none" @change="uploadImage"/>
        </div>
        <div v-else-if="newImage && !uploadingImage" class="col text-center">
          <img :src="newImage" height="50" width="50"/>
        </div>
        <div v-else class="col text-center">
          <b-spinner variant="primary" style="width: 3rem; height: 3rem;"/>
          <h3>Uploading...</h3>
        </div>
      </div>
    </div>
    <div slot="modal-footer">
      <button type="button" class="btn btn-primary" :disabled="!newImage" @click="saveBrandLogo"><i v-if="saving" class="fa fa-spin fa-spinner mr-1"></i> {{ saving ? 'Saving' : 'Save'}}</button>
    </div>
  </b-modal>
</template>

<script>
import AdminService from '@/api-services/admin.service';
export default {
  name: 'BrandImage',
  props: {
    currentBrand: {
      type: Object,
      default: null
    },
    brandIndex: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      newImage: '',
      saving: false,
      uploadingImage: false
    };
  },
  methods: {
    showModal() {
      this.$refs.brandImageModal.show();
    },
    async uploadImage(e) {
      let file = e.dataTransfer ? e.dataTransfer.files : e.target.files[0];
      file = this.checkFile(file); //checks if file has spaces and replaces name if it does
      this.uploadingImage = true;
      let response = await AdminService.uploadImage(file);
      this.uploadingImage = false;
      if(response.data.status == 'success') {
        this.newImage = response.data.url;
      } else {
        this.$swal('An error occured while trying to upload the image: ' + response.data.message, '', 'error');
      }
    },
    async saveBrandLogo() {
      this.saving = true;
      let response = await AdminService.updateBrandLogo(this.currentBrand.brand_id, this.newImage);
      this.saving = false;
      if (response.data.status == 'success') {
        var emitData = {
          id: this.currentBrand.id,
          newImage: this.newImage,
          index: this.brandIndex
        };
        this.$emit('updateImage', emitData);
        this.$swal('Brand logo updated', '', 'success');
        this.$refs.brandImageModal.hide();
      } else {
        this.$swal('Something went wrong while saving the logo', '', 'error');
      }
    },
    checkFile(file) {
      if (file.name.includes(' ')) {
        var newName = file.name.replace(/ /g, "_");
        var newFile = new File([file], newName, {type: file.type});
        return newFile;
      } else {
        return file;
      }
    },
    clearModal() {
      this.newImage = '';
    }
  }
};
</script>

<style lang="scss">
.hoverable:hover {
  cursor: pointer;
}
</style>