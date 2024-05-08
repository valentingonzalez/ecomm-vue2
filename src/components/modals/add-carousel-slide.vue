<template>
  <b-modal size="xxl" class="carousel-modal" ref="carouselModal" title="Add New Carousel Slide" title-class="center-title" :hide-footer="activeView === 'template'">
    <template v-if="activeView !== 'template'">
      <div>
        <div class="w-100">
          <label class="mb-1">Image link</label>
          <div class="d-flex">
            <input type="text" class="form-control mb-4" v-model="link" placeholder="Image link (optional)">
            <button @click="activeView = 'template'" class="btn btn-outline-primary ml-3 text-nowrap">View Slide Library</button>
          </div>
        </div>

        <input type="file" ref="desktopFileUploader" class="d-none" @change="uploadDesktopImage"/>
        <input type="file" ref="mobileFileUploader" class="d-none" @change="uploadMobileImage"/>
      </div>

      <div class="row mb-3">
        <div class="col-lg-7 d-flex flex-column">
          <div class="preview desktop-preview">
            <div class="d-flex align-items-center p-2">
              <div class="fake-logo"></div>
              <div class="fake-menu flex-1"></div>
            </div>

            <div class="image-wrapper d-flex align-items-stretch" @dragover.prevent @drop.prevent="uploadDesktopImage">
              <div v-if="!uploadingImageDesktop" class="text-center hoverable cursor-pointer d-flex align-items-center justify-content-center w-100 flex-column" :class="{ 'cursor-pointer': newSlideImgDesktop }" @click="$refs.desktopFileUploader.click()">
                <template v-if="!newSlideImgDesktop">
                  <svg class="mb-2" width="40" height="37" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="nonzero"><path d="M32.304 10.244C30.953 3.35 24.363-1.126 17.584.248c-4.958 1.005-8.834 4.946-9.826 9.988-4.806.564-8.253 4.984-7.7 9.873.51 4.5 4.257 7.894 8.71 7.891h6.257c.69 0 1.251-.57 1.251-1.273s-.56-1.273-1.251-1.273H8.767c-3.456-.02-6.24-2.887-6.22-6.403.02-3.515 2.838-6.348 6.294-6.327a1.26 1.26 0 001.244-1.133C10.721 6.004 15.688 2 21.181 2.645c4.618.543 8.261 4.249 8.795 8.946a1.333 1.333 0 001.318 1.133c3.456 0 6.257 2.85 6.257 6.365s-2.801 6.365-6.257 6.365h-6.257c-.692 0-1.252.57-1.252 1.273S24.345 28 25.037 28h6.257c4.838-.03 8.736-4.045 8.706-8.966-.028-4.482-3.323-8.245-7.696-8.79z"/><path d="M24.873 22.668a1.199 1.199 0 001.75.032 1.337 1.337 0 00.03-1.83h-.03l-5.247-5.49a1.2 1.2 0 00-1.75-.002l-.002.002-5.246 5.49a1.337 1.337 0 00-.03 1.83 1.2 1.2 0 001.779 0l3.136-3.282v16.288c0 .715.554 1.294 1.237 1.294s1.237-.58 1.237-1.294v-16.32l3.136 3.282z"/></g></svg>
                  <div class="h6 mb-0">Drag and Drop Image Here or Click to Upload</div>
                  <div class="font-weight-normal mb-0 mt-1">Recommended Size: 1110x300</div>
                </template>

                <template v-else>
                  <div class="hover-img d-flex flex-column align-items-center justify-content-center position-absolute w-100 h-100">
                    <svg class="mb-2" width="40" height="37" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="nonzero"><path d="M32.304 10.244C30.953 3.35 24.363-1.126 17.584.248c-4.958 1.005-8.834 4.946-9.826 9.988-4.806.564-8.253 4.984-7.7 9.873.51 4.5 4.257 7.894 8.71 7.891h6.257c.69 0 1.251-.57 1.251-1.273s-.56-1.273-1.251-1.273H8.767c-3.456-.02-6.24-2.887-6.22-6.403.02-3.515 2.838-6.348 6.294-6.327a1.26 1.26 0 001.244-1.133C10.721 6.004 15.688 2 21.181 2.645c4.618.543 8.261 4.249 8.795 8.946a1.333 1.333 0 001.318 1.133c3.456 0 6.257 2.85 6.257 6.365s-2.801 6.365-6.257 6.365h-6.257c-.692 0-1.252.57-1.252 1.273S24.345 28 25.037 28h6.257c4.838-.03 8.736-4.045 8.706-8.966-.028-4.482-3.323-8.245-7.696-8.79z"/><path d="M24.873 22.668a1.199 1.199 0 001.75.032 1.337 1.337 0 00.03-1.83h-.03l-5.247-5.49a1.2 1.2 0 00-1.75-.002l-.002.002-5.246 5.49a1.337 1.337 0 00-.03 1.83 1.2 1.2 0 001.779 0l3.136-3.282v16.288c0 .715.554 1.294 1.237 1.294s1.237-.58 1.237-1.294v-16.32l3.136 3.282z"/></g></svg>
                    <div class="h6 mb-0">Drag and Drop Image Here or Click to Replace Image</div>
                    <div class="font-weight-normal mb-0 mt-1">Recommended Size: 1110x300</div>
                  </div>
                  <img :src="newSlideImgDesktop" alt="New Slide Image" />
                </template>
              </div>

              <div v-else class="text-center d-flex align-items-center justify-content-center flex-column w-100">
                <b-spinner variant="info" style="width: 3rem; height: 3rem;"></b-spinner>
                <h3>Uploading...</h3>
              </div>
            </div>
          </div>

          <h5 class="mt-3 text-center">Desktop</h5>
        </div>

        <div class="col-lg-5 d-flex flex-column mt-4 mt-lg-0">
          <div class="preview mobile-preview">
            <div class="d-flex align-items-center justify-content-between p-2">
              <div class="fake-menu">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
              </div>
              <div class="fake-logo"></div>
              <div class="fake-menu"></div>
            </div>

            <div class="image-wrapper d-flex align-items-stretch" @dragover.prevent @drop.prevent="uploadMobileImage">
              <div v-if="!uploadingImageMobile" class="text-center hoverable cursor-pointer d-flex align-items-center justify-content-center w-100 flex-column" :class="{ 'cursor-pointer': newSlideImgDesktop }" @click="$refs.mobileFileUploader.click()">
                <template v-if="!newSlideImgMobile">
                  <svg class="mb-2" width="40" height="37" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="nonzero"><path d="M32.304 10.244C30.953 3.35 24.363-1.126 17.584.248c-4.958 1.005-8.834 4.946-9.826 9.988-4.806.564-8.253 4.984-7.7 9.873.51 4.5 4.257 7.894 8.71 7.891h6.257c.69 0 1.251-.57 1.251-1.273s-.56-1.273-1.251-1.273H8.767c-3.456-.02-6.24-2.887-6.22-6.403.02-3.515 2.838-6.348 6.294-6.327a1.26 1.26 0 001.244-1.133C10.721 6.004 15.688 2 21.181 2.645c4.618.543 8.261 4.249 8.795 8.946a1.333 1.333 0 001.318 1.133c3.456 0 6.257 2.85 6.257 6.365s-2.801 6.365-6.257 6.365h-6.257c-.692 0-1.252.57-1.252 1.273S24.345 28 25.037 28h6.257c4.838-.03 8.736-4.045 8.706-8.966-.028-4.482-3.323-8.245-7.696-8.79z"/><path d="M24.873 22.668a1.199 1.199 0 001.75.032 1.337 1.337 0 00.03-1.83h-.03l-5.247-5.49a1.2 1.2 0 00-1.75-.002l-.002.002-5.246 5.49a1.337 1.337 0 00-.03 1.83 1.2 1.2 0 001.779 0l3.136-3.282v16.288c0 .715.554 1.294 1.237 1.294s1.237-.58 1.237-1.294v-16.32l3.136 3.282z"/></g></svg>
                  <div class="h6 mb-0">Drag and Drop Image Here or Click to Upload</div>
                  <div class="font-weight-normal mb-0">Recommended Size: 480x360</div>
                </template>

                <template v-else>
                  <div class="hover-img d-flex flex-column align-items-center justify-content-center position-absolute w-100 h-100">
                    <svg class="mb-2" width="40" height="37" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="nonzero"><path d="M32.304 10.244C30.953 3.35 24.363-1.126 17.584.248c-4.958 1.005-8.834 4.946-9.826 9.988-4.806.564-8.253 4.984-7.7 9.873.51 4.5 4.257 7.894 8.71 7.891h6.257c.69 0 1.251-.57 1.251-1.273s-.56-1.273-1.251-1.273H8.767c-3.456-.02-6.24-2.887-6.22-6.403.02-3.515 2.838-6.348 6.294-6.327a1.26 1.26 0 001.244-1.133C10.721 6.004 15.688 2 21.181 2.645c4.618.543 8.261 4.249 8.795 8.946a1.333 1.333 0 001.318 1.133c3.456 0 6.257 2.85 6.257 6.365s-2.801 6.365-6.257 6.365h-6.257c-.692 0-1.252.57-1.252 1.273S24.345 28 25.037 28h6.257c4.838-.03 8.736-4.045 8.706-8.966-.028-4.482-3.323-8.245-7.696-8.79z"/><path d="M24.873 22.668a1.199 1.199 0 001.75.032 1.337 1.337 0 00.03-1.83h-.03l-5.247-5.49a1.2 1.2 0 00-1.75-.002l-.002.002-5.246 5.49a1.337 1.337 0 00-.03 1.83 1.2 1.2 0 001.779 0l3.136-3.282v16.288c0 .715.554 1.294 1.237 1.294s1.237-.58 1.237-1.294v-16.32l3.136 3.282z"/></g></svg>
                    <div class="h6 mb-0">Drag and Drop Image Here or Click to Replace Image</div>
                    <div class="font-weight-normal mb-0">Recommended Size: 480x360</div>
                  </div>
                  <img :src="newSlideImgMobile" alt="New Slide Image" />
                </template>
              </div>

              <div v-else class="text-center d-flex align-items-center justify-content-center flex-column w-100">
                <b-spinner variant="info" style="width: 3rem; height: 3rem;"></b-spinner>
                <h3>Uploading...</h3>
              </div>
            </div>
          </div>

          <h5 class="mt-3 text-center">Mobile <span class="font-weight-normal text-muted h6">(Optional)</span></h5>
        </div>
      </div>

      <template slot="modal-footer">
        <button type="button" class="btn btn-primary" :disabled="!newSlideImgDesktop" @click="updateItem">Add</button>
      </template>
    </template>

    <template v-else>
      <template slot="modal-header">
        <div class="d-flex align-items-end justify-content-between w-100">
          <div>
            <a @click.prevent="activeView = 'upload'" class="d-flex align-items-center cursor-pointer">
              <svg width="8" height="12" xmlns="http://www.w3.org/2000/svg" class="mr-2"><path d="M2.38 6.003l4.49-4.49a.65.65 0 00.191-.464.651.651 0 00-.191-.464L6.476.192A.651.651 0 006.012 0a.651.651 0 00-.464.192L.203 5.537a.651.651 0 00-.191.465c0 .177.067.342.191.466l5.34 5.34a.651.651 0 00.464.192c.176 0 .341-.068.465-.192l.393-.393a.657.657 0 000-.928L2.38 6.003z" fill="#000" fill-rule="nonzero"></path></svg> 
              Add New Slide
            </a>
            <h5 class="modal-title center-title">Select Carousel Slide</h5>
          </div>
          <div class="ml-3 d-flex align-items-center position-relative">
              <i class="fa fa-search position-absolute ml-3" style="z-index: 11;"></i>
              <input type="search" class="form-control ml-1" placeholder="Search Carousels..." v-model="search" style="padding-left: 1.8rem !important;" />
          </div>
        </div>

        <button type="button" aria-label="Close" class="close" @click="closeModal">×</button>
      </template>
      <div class="pb-4" style="min-height: 350px;">
        <div class="template-holder row" v-if="carouselDesktopTemplates && carouselDesktopTemplates.length > 0">
          <div class="col-md-6 mb-4" v-for="(template, index) in carouselDesktopTemplates" :key="index">
            <a href="#" class="my-1 text-decoration-none" @click.prevent="selectTemplate(template, index)">
              <div class="preview p-2 template-item">
                <div class="row small-gutters bg-transparent">
                  <div class="mb-3 mb-sm-0" :class="template.imageMobile ? 'col-sm-7' : 'col-12'">
                    <div class="desktop-preview preview p-0">
                      <small class="text-uppercase text-center font-weight-bold bg-secondary text-light d-block">
                        Desktop Version
                      </small>

                      <div class="image-wrapper d-flex align-items-stretch">
                        <img class="template-img mw-100" :src="template.image || template" alt="Image Desktop">
                      </div>
                    </div>
                  </div>
                  <div v-if="template.imageMobile" class="col-sm-5">
                    <div class="mobile-preview preview p-0">
                      <small class="text-uppercase text-center font-weight-bold bg-secondary text-light d-block">
                        Mobile Version
                      </small>

                      <div class="image-wrapper d-flex align-items-stretch">
                        <img class="template-img mw-100" :src="template.imageMobile" alt="Image Mobile">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
        <p class="text-center" v-else>
          No carousels found.
        </p>
      </div>
    </template>
  </b-modal>
</template>

<script>
import AdminService from '@/api-services/admin.service';

export default {
  name: 'CarouselModal',
  data() {
    return {
      loading: false,
      uploadingImageDesktop: false,
      uploadingImageMobile: false,
      newSlideImgDesktop: null,
      newSlideImgMobile: null,
      link: null,
      id: null,
      activeView: 'upload',
      search: ''      
    };
  },
  methods: {
    async uploadDesktopImage(evt) {
      const file = this.checkFile(evt);

      this.uploadingImageDesktop = this.loading = true;

      AdminService.uploadImage(file).then(response => {
        this.uploadingImageDesktop = this.loading = false;
        this.newSlideImgDesktop = response.data.url;
      })
      .catch(() => {
        this.$swal('Error', 'Error while uploading image', 'error');
        return false;
      });
    },
    async uploadMobileImage(evt) {
      const file = this.checkFile(evt);

      this.uploadingImageMobile = this.loading = true;

      AdminService.uploadImage(file).then(response => {
        this.uploadingImageMobile = this.loading = false;
        this.newSlideImgMobile = response.data.url;
      })
      .catch(() => {
        this.$swal('Error', 'Error while uploading image', 'error');
        return false;
      });
    },
    updateItem() {
      this.$emit('updateItem', {
        image: this.newSlideImgDesktop,
        imageMobile: this.newSlideImgMobile,
        redirect_url: this.link,
        id: this.id
      });

      this.hideModal();
    },
    closeModal() {
      this.$refs.carouselModal.hide();
    },
    hideModal() {
      this.$refs.carouselModal.hide();

      this.$swal({
        toast: true,
        position: 'top',
        type: 'success',
        html: `<div class="ml-2">Slide added to carousel!</div>`,
        showConfirmButton: false,
        timer: 3000
      });
    },
    showModal(slide = null) {
      if(slide) {
        this.id = slide.id;
        this.newSlideImgDesktop = slide.image;
        this.newSlideImgMobile = slide.imageMobile;
        this.link = slide.redirect_url;
      } else {
        this.newSlideImgDesktop = this.link = this.id = null;
        this.newSlideImgMobile = null;
      }
      this.$refs.carouselModal.show();
    },
    checkFile(evt) {
      const file = evt.dataTransfer ? evt.dataTransfer.files[0] : evt.target.files[0];

      if (file.name.includes(' ')) {
        var newName = file.name.replace(/ /g, "_");
        var newFile = new File([file], newName, {type: file.type});

        return newFile;
      } else {
        return file;
      }
    },
    selectTemplate(template, index) {
      this.newSlideImgDesktop = template;
      this.newSlideImgMobile = this.carouselMobileTemplates[index];
      this.activeView = 'upload';
    }
  },
  async mounted() {
    let templates = await AdminService.getCarouselTemplates();
    this.carouselTemplatesData = templates.data.images;
  },
  computed: {
    carouselDesktopTemplates() {
      return this.carouselTemplatesData.filter(template => {
        let tags = template.tags ? template.tags : '';
        return tags.toLowerCase().includes(this.search.toLowerCase());
      }).map(template => {
        return template.desktop_image;
      });
    },
    carouselMobileTemplates() {
      return this.carouselTemplatesData.filter(template => {
        let tags = template.tags ? template.tags : '';
        return tags.toLowerCase().includes(this.search.toLowerCase());
      }).map(template => {
        return template.mobile_image;
      });
    }
  },
  watch: {
    activeView(newVal, oldVal) {
      if(newVal === 'template') {
        this.search = '';
      }     
    }
  }
};
</script>

<style scoped lang="scss">
  :deep(.modal .modal-body) {
    padding-bottom: 0 !important;
  }
  label {
    font-weight: bold;
  }
  .template-holder {
    max-height: 600px;
    overflow: auto;

    .template-item {
      transition: 200ms;

      &:hover {
        background: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
      }
    }

    .image-wrapper {
      height: 160px;
    }
  }
  .image-wrapper {
    height: 240px;
    position: relative;
    overflow: hidden;
    background: #f5f5f5;

    > .hoverable {
      border: 1.5px dashed #7dcefa;
      color: #04679e;
      background: rgba(4, 103, 158, 0.04);

      g {
        fill: #04679e;
      }
    }

    &:hover {
      .hover-img {
        opacity: 1;
      }
    }
    .hover-img {
      pointer-events: none;
      transition: opacity .2s;
      opacity: 0;
      background: rgba(255, 255, 255, .9);
      z-index: 1;
    }
    img {
      width: 100%;
      height: auto;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>

