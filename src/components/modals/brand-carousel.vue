<template>
  <b-modal size="xl" class="modal-box" ref="modal" :lazy="false" :visible="false" :hide-footer="activeView === 'template'" title="Brand Carousel" @hidden="clearModal">
    <template v-if="activeView !== 'template'">
      <div>
        <div class="d-flex justify-content-between flex-column flex-md-row text-center text-md-left mb-3 mb-md-0">
          <p>You can edit the brand carousel from here</p>
          <button @click="activeView = 'template'" class="btn btn-outline-primary ml-3 text-nowrap">View Slide Library</button>
        </div>
          <div class="d-flex justify-content-center">            
            <div :class="{ 'disabled' : addingSlide }" @click.prevent="$refs.fileUploader.click()" class="d-flex align-items-center flex-column justify-content-center cursor-pointer text-primary mb-4">
              <b>Upload{{ addingSlide ? 'ing' : '' }} images</b>
              <div class="add-bt mt-2">
                <div v-if="addingSlide" class="spinner-border spinner-border-sm"></div>
                <svg v-else width="34" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              </div>
              <p class="mb-0 mt-3 p-0">Recommended Size: 1110x300</p>
            </div>
          </div>
          <div v-if="loadingCarousel" class="d-flex align-items-center justify-content-center py-3">
            <div class="spinner-border"></div>
          </div>
          <hooper ref="carousel" :settings="hooperSettings" :infiniteScroll="false" v-else-if="carousel && carousel.length" :wheelControl="false"  class="mx-auto" :style="`width: auto`">
            <slide v-for="(slide, i) in carousel" :key="i" :index="i" class="slide-item-hooper d-flex align-items-center justify-content-center overflow-hidden bg-dark border">
              <div class="mh-100 mw-100 position-relative">
                <div class="delete-bt position-absolute align-items-center w-100 h-100 justify-content-center" >
                  <a :href="slide" target="_blank" class="mr-4" style="transform: scale(2.5); transform-origin: 0 0; width: 12px; height: 20px">
                    <svg class="position-absolute" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.6 122.88" xml:space="preserve"><g fill="#FFF" fill-rule="nonzero"><path d="M110.6,72.58c0-3.19,2.59-5.78,5.78-5.78c3.19,0,5.78,2.59,5.78,5.78v33.19c0,4.71-1.92,8.99-5.02,12.09 c-3.1,3.1-7.38,5.02-12.09,5.02H17.11c-4.71,0-8.99-1.92-12.09-5.02c-3.1-3.1-5.02-7.38-5.02-12.09V17.19 C0,12.48,1.92,8.2,5.02,5.1C8.12,2,12.4,0.08,17.11,0.08h32.98c3.19,0,5.78,2.59,5.78,5.78c0,3.19-2.59,5.78-5.78,5.78H17.11 c-1.52,0-2.9,0.63-3.91,1.63c-1.01,1.01-1.63,2.39-1.63,3.91v88.58c0,1.52,0.63,2.9,1.63,3.91c1.01,1.01,2.39,1.63,3.91,1.63h87.95 c1.52,0,2.9-0.63,3.91-1.63s1.63-2.39,1.63-3.91V72.58L110.6,72.58z M112.42,17.46L54.01,76.6c-2.23,2.27-5.89,2.3-8.16,0.07 c-2.27-2.23-2.3-5.89-0.07-8.16l56.16-56.87H78.56c-3.19,0-5.78-2.59-5.78-5.78c0-3.19,2.59-5.78,5.78-5.78h26.5 c5.12,0,11.72-0.87,15.65,3.1c2.48,2.51,1.93,22.52,1.61,34.11c-0.08,3-0.15,5.29-0.15,6.93c0,3.19-2.59,5.78-5.78,5.78 c-3.19,0-5.78-2.59-5.78-5.78c0-0.31,0.08-3.32,0.19-7.24C110.96,30.94,111.93,22.94,112.42,17.46L112.42,17.46z"></path></g></svg>
                  </a>
                  <svg class="ml-2" @click="deleteSlide(i)" style="transform: scale(2.5); transform-origin: 0 0;" width="20" height="28" xmlns="http://www.w3.org/2000/svg"><g fill="#FFF" fill-rule="nonzero"><path d="M9.551 1.38H7.093V.45C7.093.2 6.892 0 6.643 0H3.357c-.248 0-.448.2-.448.449v.932H.449c-.248 0-.449.2-.449.448V3.21c0 .248.201.449.449.449h.136l.41 9.675c.01.24.209.43.449.43h7.112c.24 0 .438-.19.448-.43l.41-9.675h.137c.248 0 .449-.201.449-.45V1.83c0-.247-.201-.448-.449-.448zM3.805.899h2.39v.483h-2.39V.898zm4.32 11.968h-6.25l-.391-9.207h7.032l-.39 9.207zM9.103 2.76H.898v-.483h8.204v.483z"/><path d="M3.194 5.035c-.247 0-.448.201-.448.449v5.557a.449.449 0 00.897 0V5.484a.449.449 0 00-.449-.449zM5 5.035c-.248 0-.449.201-.449.449v5.557a.449.449 0 10.898 0V5.484a.449.449 0 00-.45-.449zM6.805 5.035c-.247 0-.448.201-.448.449v5.557a.449.449 0 00.897 0V5.484c0-.248-.2-.449-.449-.449z"/></g></svg>
                </div>
                <img class="mw-100 mh-100" :src="slide" />
              </div>
            </slide>
            <hooper-navigation slot="hooper-addons"></hooper-navigation>
          </hooper>
        <input type="file" class="d-none" ref="fileUploader" @change="uploadImage" multiple accept="image/*"  />
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-primary" :disabled="addingSlide" @click="save">
          <div v-if="saving" class="spinner-border spinner-border-sm mr-1"></div> {{ saving ? 'Saving' : 'Save'}}
        </button>
      </div>
    </template>
    <template v-else>
      <template slot="modal-header">
        <div class="d-flex align-items-end justify-content-between w-100">
          <div>
            <a @click.prevent="activeView = 'upload'" class="d-flex align-items-center cursor-pointer"><svg width="8" height="12" xmlns="http://www.w3.org/2000/svg" class="mr-2"><path d="M2.38 6.003l4.49-4.49a.65.65 0 00.191-.464.651.651 0 00-.191-.464L6.476.192A.651.651 0 006.012 0a.651.651 0 00-.464.192L.203 5.537a.651.651 0 00-.191.465c0 .177.067.342.191.466l5.34 5.34a.651.651 0 00.464.192c.176 0 .341-.068.465-.192l.393-.393a.657.657 0 000-.928L2.38 6.003z" fill="#000" fill-rule="nonzero"></path></svg> Add New Slide</a>
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
        <div class="template-holder row" v-if="carouselTemplates && carouselTemplates.length > 0">          
          <div class="col-md-6 mb-4" v-for="(template, index) in carouselTemplates" :key="index">
            <a href="#" class="my-1 text-decoration-none" @click.prevent="selectTemplate(template)">
              <div class="preview p-2 template-item">
                <div class="row small-gutters bg-transparent">
                  <div class="mb-3 mb-sm-0" :class="template.imageMobile ? 'col-sm-7' : 'col-12'">
                    <div class="desktop-preview preview p-0">
                      <small class="text-uppercase text-center font-weight-bold bg-secondary text-light d-block">
                        Desktop Version
                      </small>

                      <div class="image-wrapper d-flex align-items-stretch">
                        <img class="template-img mw-100" :src="template.image || template">
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
import BrandsService from '@/api-services/brands.service';
import { Hooper, Slide, Navigation as HooperNavigation } from 'hooper';
import 'hooper/dist/hooper.css';

export default {
  name: 'BrandCarousel',
  components: {
    Hooper,
    Slide,
    HooperNavigation
  },
  props: {
    brand: {
      type: Object,
      default: null
    },
    brandIndex: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      search: '',
      newImage: '',
      saving: false,
      uploadingImage: false,
      carousel: null,
      addingSlide: false,
      loadingCarousel: false,
      carouselWidth: '100%',
      carouselSlideWidth: '25%',
      carouselTemplatesData: [],
      activeView: 'upload',
      hooperSettings: {
        itemsToShow: 4,
        centerMode: false,
        breakpoints: {
          210: {
            centerMode: false,
            itemsToShow: 1
          },
          560: {
            centerMode: false,
            itemsToShow: 2
          },
          800: {
            centerMode: false,
            itemsToShow: 4
          }
        }
      }
    };
  },
  computed: {
    carouselTemplates() {
      return this.carouselTemplatesData.filter(template => {
        let tags = template.tags ? template.tags : '';
        return tags.toLowerCase().includes(this.search.toLowerCase());
      }).map(template => {
        return template.desktop_image;
      });
    }
  },
  async mounted() {
    let templates = await AdminService.getCarouselTemplates();
    this.carouselTemplatesData = templates.data.images;
  },
  created() {
    window.addEventListener("resize", this.resizeCarousel());
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeCarousel());
  },
  methods: {
    async showModal() {
      this.$refs.modal.show();
      this.carousel = null;
      this.itemsToShow = 4;
      this.carouselWidth = '100%';
      this.carouselSlideWidth = '25%';
      this.loadingCarousel = true;
      let brand = await BrandsService.getBrandById(this.brand.brand_id);
      this.carousel = brand.data.data.carousel ? [...brand.data.data.carousel] : [];
      this.loadingCarousel = false;
      setTimeout(() => {
        if(this.$refs.carousel) {
          this.resizeCarousel();
        }
      }, 400);
    },
    async uploadImage(e) {
      this.addingSlide = true;
      for (var i = e.target.files.length - 1; i >= 0; i--) {
        let file = e.target.files[i];
        file = file.name.includes(' ') ? new File([file], file.name.replace(/ /g, "_"), {type: file.type}) : file;
        this.uploadingImage = true;
        let response = await AdminService.uploadImage(file);
        this.uploadingImage = false;
        if(response.data.status == 'success') {
          this.carousel = this.carousel ? [...this.carousel, response.data.url] : [response.data.url];
        } else {
          this.$swal('An error occured while trying to upload the image: ' + response.data.message, '', 'error');
        }
        if(this.carousel.length > 4) {
          this.$refs.carousel.slideTo(this.carousel.length - 4);
        }
      }
      setTimeout(() => this.resizeCarousel(), 10);
      this.addingSlide = false;
    },
    deleteSlide(idx) {
      this.carousel.splice(idx, 1);
      this.resizeCarousel();
      if(this.carousel.length < 4) {
        this.$refs.carousel.slideTo(1);
      }
    },
    resizeCarousel() {
      if(this.$refs.carousel) {
        this.$refs.carousel.update();
      }
    },
    async save() {
      this.saving = true;
      await AdminService.updateBrandCarousel({ brand_id: this.brand.brand_id, carousel: this.carousel});
      this.saving = false;
      this.$refs.modal.hide();
      this.$refs.carousel.restart();
      this.$emit('onUpdateBrandCarousel', this.brand.brand_id, this.carousel);
    },
    clearModal(){
      this.activeView = 'upload';
      this.carousel = null;
      this.itemsToShow = 4;
      this.carouselWidth = '100%';
      this.loadingCarousel = false;
      this.addingSlide = false;
      this.uploadingImage = false;
      this.newImage = '';
    },
    selectTemplate(template) {
      this.carousel = this.carousel ? [...this.carousel, template.image || template] : [template.image || template];
      this.activeView = 'upload';
    },
    closeModal() {
      this.$refs.modal.hide();
    },

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

<style lang="scss" scoped>
  .file-uploader {
    width: 200px;
    min-width: 200px;
    height: 200px;
    border: 2px dashed gray;
  }
  .add-bt {
    border: 3px solid var(--primary);
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  .hooper-slide {
    .delete-bt {
      display: none;
      cursor: pointer;
      top:0;
      background: rgba(0,0,0,.5);
    }
    &:hover {
      .delete-bt {
        display: flex;
      }
    }
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
</style>