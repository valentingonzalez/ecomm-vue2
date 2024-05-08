<template>
  <div v-if="$ezHasNoPermission('edit_carousel_ads')">
    <NoPermission />
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="px-md-5 d-flex pt-md-4 pb-3 mb-3 border-bottom justify-content-between align-items-center heading">
      <h1 class="h4 mb-0">Carousel</h1>
      <div>
        <b-button variant="success" class="float-right" v-b-modal.newItemModal><i class="fa fa-plus mr-1 "></i> Add New</b-button>
        <b-button variant="primary" class="float-right mr-2" @click="saveData"><i v-if="saving" class="fa fa-spin fa-spinner mr-1"></i> {{ saving ? 'Saving' : 'Save' }}</b-button>
      </div>
    </div>
    <div class="px-md-5 pb-5">
      <p>
        To re-arrange the carousel items, drag and drop them into the desired order.
        <br>
        When you are finished, click save to have your changes reflected on the live site.
      </p>

      <div class="d-flex justify-content-center mt-5" v-if="loadingCarouselData">
        <b-spinner style="width: 5rem; height: 5rem;"></b-spinner>
      </div>
      <div v-else>
        <h2 class="text-center mt-5" v-if="carouselImages.length === 0">You Have No Carousel Ads!</h2>
        <draggable v-model="carouselImages" @start="drag = true" @end="onDrop" class="row small-gutters">
          <template v-for="(item, index) in carouselImages">
            <admin-carousel-card :key="index" :itemData="item" :selectOptions="sequenceSelectOptions"
            @sequenceChanged="updateSequences($event, item)" @deleteItem="deleteCarouselItem($event, index)" @linkChanged="updateRedirectLink($event, index)" @itemUpdated="saveData"/>
          </template>
        </draggable>
      </div>
      <b-modal class="new-item-modal" id="newItemModal" title="Add New" title-class="center-title" ref="newItemModal" cancel-variant="default">
        <b-row align-h="center" align-v="center" style="height: 30vh; border: 2px dashed lightblue;"  @dragover.prevent @drop.prevent="uploadImage" v-if="!newSlideImg">
          <b-col class="text-center hoverable" v-if="!uploadingImage" @click="$refs.fileUploader.click()">
            <h3>Drag and Drop Image Here or Click to Upload</h3>
            <h3>Recommended Size: 1110x300</h3>
            <input type="file" ref="fileUploader" class="d-none" @change="uploadImage"/>
          </b-col>
          <b-col v-else class="text-center">
            <b-spinner variant="info" style="width: 3rem; height: 3rem;"></b-spinner>
            <h3>Uploading...</h3>
          </b-col>
        </b-row>
        <b-row v-if="newSlideImg" align-h="center" align-v="center" style="">
          <b-img fluid :src="newSlideImg"></b-img>
        </b-row>
        <b-row align-h="center" class="mt-3">
          <b-col class="text-center">
            <h4>Or Select From Pre-Made Templates</h4>
            <div class="template-holder">
              <b-img class="template-img my-1 col-6"  v-for="(template, index) in carouselTemplates" :key="index" :src="template.desktop_image" @click="addCarouselItem($event, index)"></b-img>
            </div>
          </b-col>
        </b-row>
      </b-modal>
    </div>
  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import draggable from 'vuedraggable';
  import NoPermission from './no-permission';

  export default {
    name: 'carousel-new',
    components: {
      draggable,
      NoPermission
    },
    data() {
      return {
        info: {},
        loadingCarouselData: false,
        carousel: null,
        carouselImages: [],
        sequenceSelectOptions: [],
        newSlideImg: null,
        uploadingImage: false,
        carouselTemplates: [],
        saving: false
      };
    },
    methods: {
      saveData() {
        this.saving = true;
        AdminService.updateCarousel({ active: 1, images: this.carouselImages }).then((response) => {
          if (response.data.status != 'success') {
            this.showErrorAlert(err);
          }
          this.saving = false;
        }).catch((err) => {
          this.showErrorAlert(err);
        });
      },
      showErrorAlert(err) {
        this.$swal({
          title: 'Error',
          text: `Something went wrong while saving: ${err}`,
          type: 'error'
        });
      },
      async getCarouselData() {
        this.loadingCarouselData = true;
        let carousel = await AdminService.getCarouselImages();
        this.carousel = carousel.data.data;
        if (this.carousel[0]) {
          this.carouselImages = this.carousel[0].images;
          this.carouselImages = this.sortSlides(this.carouselImages);
        }
        this.loadingCarouselData = false;
      },
      addCarouselItem($event, index) {
        this.$refs.newItemModal.hide();
        this.carouselImages.push({
          image: this.carouselTemplates[index].desktop_image,
          redirect_url: '',
          sequence: this.carouselImages.length + 1
        });
      },
      deleteCarouselItem($event, index) {
        this.$swal({
          title: 'Are you sure you want to remove this slide?',
          text: 'Changes will be saved as soon as you accept.',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes'
        }).then(result => {
          if (result.value == true) {
            this.$delete(this.carouselImages, index);
            this.saveData();
          }
        });
      },
      onDrop() {
        this.carouselImages.map((e, i) => {
          e.sequence = i + 1;
        });
      },
      updateRedirectLink($event, index) {
        if ($event == '') {
          delete this.carouselImages[index].redirect_url;
        } else {
          this.carouselImages[index].redirect_url = $event;
        }
      },
      uploadImage(evt) {
        if (evt.dataTransfer) {
          var file = evt.dataTransfer.files[0];
        } else {
          var file = evt.target.files[0];
        }
        this.uploadingImage = true;
        AdminService.uploadImage(file).then(response => {
          this.uploadingImage = false;
          //this.newSlideImg = response.data.url;
          this.carouselImages.push({
            image: response.data.url,
            redirect_url: '',
            sequence: this.carouselImages.length + 1
          });
          this.saveData();
          this.$refs.newItemModal.hide();
        })
        .catch(err => {
          alert('Something went wrong while uploading your image.');
        });
      },
      sortSlides(arr) {
        arr.sort((a,b) => (a.sequence > b.sequence) ? 1 : -1);
        return arr;
      }
    },
    computed: {
      slug() {
        return this.$store.state.business_slug;
      },
    },
    async mounted() {
      if (this.slug && !this.$ezHasNoPermission('edit_carousel_ads')) {
        await this.getCarouselData();
        let templates = await AdminService.getCarouselTemplates();
        this.carouselTemplates = templates.data.images;
      }
    }
  };
</script>

<style lang="scss">
.modal-dialog {
  max-width: 60%;
  height: 50vh;
}
.center-title {
  margin: 0 auto;
}
.template-holder {
  max-height: 400px;
  overflow-y: scroll;
}
.template-img {
  height: auto;
  cursor: pointer;
}
.hoverable:hover {
  cursor: pointer;
}
.overlay-wrap {
  height: 200px;
  display: flex !important;
  align-items: center;
  justify-content: center;
}
</style>
