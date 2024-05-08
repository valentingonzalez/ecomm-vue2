<template>
  <b-modal class="modal-box" ref="addImageSwiperModal">
    <div slot="modal-header">
      <h5>Add Image Slide</h5>
    </div>
    <div>
      Link slide to:
      <search-suggestions
        class="search-wrapper mb-3"
        departmentsLabel="Departments"
        brandsLabel="Brands"
        placeholder="Search for a product, department or brand"
        :ref="`search-${data.id}`"
        :acceptURL="true"
        @onSelected="onAdd"
        :value="this.data.link"
        :productsLimit="100"
        />
      <div>
        <div class="image" @click="$refs.fileUploader.click()" :class="{'has-image' : data.image && !loading}" :style="{backgroundImage: data.image && !loading ? `url(${data.image})` : ''}">
          <div class="upload-icon">
            <svg height="512pt" viewBox="0 -24 512 512" width="512pt" xmlns="http://www.w3.org/2000/svg"><path d="M413.492 128.91C396.2 42.145 311.844-14.172 225.078 3.121 161.618 15.77 111.996 65.36 99.308 128.813 37.79 135.903-6.34 191.52.747 253.043c6.524 56.621 54.48 99.34 111.477 99.3h80.093c8.848 0 16.02-7.171 16.02-16.019 0-8.847-7.172-16.02-16.02-16.02h-80.093c-44.239-.261-79.883-36.331-79.625-80.566.261-44.234 36.332-79.883 80.57-79.625 8.164.004 15.023-6.14 15.922-14.254 8.133-70.308 71.722-120.71 142.031-112.578 59.11 6.84 105.738 53.465 112.574 112.578 1.344 8.258 8.5 14.309 16.867 14.254 44.239 0 80.098 35.86 80.098 80.098 0 44.234-35.86 80.094-80.098 80.094H320.47c-8.848 0-16.02 7.172-16.02 16.02 0 8.847 7.172 16.019 16.02 16.019h80.097c61.926-.387 111.817-50.899 111.434-112.828-.352-56.395-42.531-103.754-98.508-110.606zm0 0"/><path d="M313.02 287.465c6.148 6.367 16.289 6.543 22.652.394 6.363-6.144 6.539-16.285.394-22.648a12.523 12.523 0 00-.394-.395l-67.938-67.953c-6.246-6.265-16.39-6.277-22.656-.031-.008.012-.02.02-.027.031l-67.938 67.953c-6.363 6.145-6.539 16.286-.394 22.649 6.148 6.363 16.289 6.539 22.652.394.133-.129.266-.261.395-.394l40.609-40.625v201.617c0 8.848 7.172 16.02 16.02 16.02 8.843 0 16.015-7.172 16.015-16.02V246.84zm0 0"/></svg>
          </div>
          <template v-if="!data.image || loading">
            <div class="spinner-border-sm spinner-border mr-3" v-if="loading"></div>
            Upload{{loading ? 'ing' : ' an'}} Image
          </template>
        </div>

        <h6 class="text-center mt-2">Recommended Size: 800x600</h6>

        <input type="text" class="form-control mt-2" placeholder="title" v-model="data.title" />
        <input type="file" ref="fileUploader" class="d-none" @change="uploadImage" v-if="!loading" accept="image/*" />
      </div>
    </div>
    <div slot="modal-footer">
      <button type="submit" class="btn btn-primary" @click="saveImageSwiperSlide" :disabled="loading || !data.image">
        {{ editing ? 'Save' : 'Add' }}
      </button>
    </div>
  </b-modal>
</template>

<script>
import AdminService from '@/api-services/admin.service';
import searchSuggestions from '@/components/search-suggestions';

export default {
  name: 'AddImageSwiperSlideModal',
  components: {
    searchSuggestions
  },
  data() {
    return {
      loading: false,
      uploadingImage: false,
      data: {
        title: '',
        link: '',
        image: null,
        selectedSuggestion: ''
      },
      editing: false
    };
  },
  methods: {
    uploadImage(evt) {
      if(!this.loading) {
        let file = evt.dataTransfer ? evt.dataTransfer.files[0] : evt.target.files[0];
        this.loading = true;
        AdminService.uploadImage(file).then(response => {
          this.loading = false;
          this.data.image = encodeURI(response.data.url);
        })
        .catch(() => {
          this.loading = false;
          this.$swal('Error', 'Error while uploading image', 'error');
        });
      }
    },
    onAdd(selected) {
      this.data.selectedSuggestion = this.$options.filters.capitalize(selected.item.original_title);
      switch(selected.name) {
        case 'products':
          this.searchKey = "";
          this.data.link = `/products/${selected.item.sku}/${selected.item.title.replace(/[ /]/g, '+')}`;
          break;
        case 'departments':
          this.data.link = `/department/${selected.item.dept_id}/${selected.item.name}`;
          break;
        case 'brands':
          this.data.link = `/brands/${selected.item.brand_id }`;
          break;
        case 'url':
          this.data.link = selected.item[0].name;
          break;
        default:
          break;
      }
    },
    hideModal() {
      this.resetParams();
      this.$refs.addImageSwiperModal.hide();
    },
    showModal(item = null) {
      this.resetParams();
      this.editing = false;
      if(item) {
        this.editing = true;
        this.data = {...item};
      }
      setTimeout(() => {
        this.$refs[`search-${this.data.id}`].$el.getElementsByTagName('input')[0].value = this.data.selectedSuggestion || '';
      }, 100);
      this.$refs.addImageSwiperModal.show();
    },
    resetParams() {
      this.data = {
        title: '',
        link: '',
        image: null
      };
    },
    saveImageSwiperSlide() {
      this.$emit('saveImageSwiperSlide', this.data);
    }
  }
};
</script>

<style scoped lang="scss">
  label {
    font-weight: bold;
  }
  .image {
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px dashed #ef8c8c;
    color: #ef8c8c;
    background: #fff6f6;
    background-position: center;
    background-size: cover;
    &.has-image {
      border: none;
      &:hover {
        .upload-icon {
          opacity: 1;
        }
      }
    }
    .upload-icon {
      pointer-events: none;
      transition: opacity .2s;
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, .7);
      svg {
        transform: scale(.3);
        * {
          fill: var(--primary);
        }
      }
    }
  }
  :deep(.search-wrapper) {
    .search-suggestion-footer {
      display: none;
    }
  }
</style>

