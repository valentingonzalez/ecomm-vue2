<template>
  <div>
    <div class="row px-4 d-flex pt-4 pb-3 justify-content-between align-items-center heading">
      <div class="col-md-9">
        <div class="mb-2">
          <a class="back" style="cursor: pointer; font-weight: bold;" v-if="currentPage === 'edit'" @click.prevent="backToMain">
            <svg data-v-305c56d9="" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 mb-1"><path data-v-305c56d9="" fill-rule="evenodd" clip-rule="evenodd" d="M5.70679 0.292787C5.89426 0.480314 5.99957 0.734622 5.99957 0.999786C5.99957 1.26495 5.89426 1.51926 5.70679 1.70679L2.41379 4.99979L5.70679 8.29279C5.88894 8.48139 5.98974 8.73399 5.98746 8.99619C5.98518 9.25838 5.88001 9.5092 5.6946 9.6946C5.5092 9.88001 5.25838 9.98518 4.99619 9.98746C4.73399 9.98974 4.48139 9.88894 4.29279 9.70679L0.292787 5.70679C0.105316 5.51926 0 5.26495 0 4.99979C0 4.73462 0.105316 4.48031 0.292787 4.29279L4.29279 0.292787C4.48031 0.105316 4.73462 0 4.99979 0C5.26495 0 5.51926 0.105316 5.70679 0.292787Z" fill="currentColor"></path></svg>
            Go Back
          </a>
        </div>
        <h4 style="margin-bottom: 0.2rem;">Product Suggesters</h4>
        <span v-if="suggesters.length" style="color: #6B7280;">Create tailored product suggestions that will be displayed at the bottom of the single product pages of your choice.</span>
        <a @click="$refs.tutorialModal.show()" class="btn btn-tutorial mt-2 btn-sm text-small bg-white btn-action">
                  <i class="fa fa-play mr-1"></i>
                  Click to Watch Tutorial Video
                </a>
      </div>
      <b-modal size="lg" ref="tutorialModal">
                <div slot="modal-header">
                  <h5>Products Suggesters</h5>
                </div>
                <div>
                  <video class="w-100" poster="/images/cover-product-suggester-new.PNG" controls>
                    <source src="https://storage.googleapis.com/content.ezadtv.com/2023/12/28/658dc0c445d13_Products_Suggester.mov" type="video/mp4">
                  </video>
                </div>
                <div slot="modal-footer">
                  <button type="button" class="btn btn-primary" @click="$refs.tutorialModal.hide()">Done</button>
                </div>
      </b-modal>
      <div class="col-md-3 d-flex justify-content-end">
        <button v-if="currentPage === 'main' && suggesters.length" :disabled="isLoading" class="btn btn-primary" @click="createNewSuggester"><b>Add New Suggester <div class="spinner-border spinner-border-sm" v-if="isLoading"></div></b></button>
      </div>
    </div>
    <hr>
    <div v-if="currentPage === 'main'">
      <div v-if="!suggesters.length" class="mt-5 justify-content-center text-center">
        <div class="h4 mb-4" style="font-style: italic; line-height: 1.7;">
          Enhance your customer's shopping experience!<br>Create tailored product suggestions that will be displayed<br>at the bottom of the single product pages they navigate.
        </div>
        <button class="btn btn-primary btn-block save-btn mt-2" style="max-width: 450px;" type="button" :disabled="isLoading" @click="createNewSuggester">
          <b>Create Your First Suggester <div class="spinner-border spinner-border-sm" v-if="isLoading"></div></b>
        </button>
      </div>
      <div v-for="(s, i) in suggesters" :key="s.id">
        <SuggesterBuilder
          :id="s.id"
          :value="s.suggester_content"
          @goToEditSuggester="goToEditSuggester"
          @deleteSuggester="deleteSuggester"
          :swiperEditable="true"
        />
        <hr v-if="i !== suggesters.length - 1" class="ml-4 mr-4">
      </div>
    </div>
    <div v-if="currentPage === 'edit'">
      <SuggesterBuilder :id="selectedSuggester.id" :value="selectedSuggester.suggester_content" :locations="selectedSuggester.associated_locations" @updateLocations="updateLocations" :editable="true" />
    </div>
  </div>
</template>

<script>
import SuggesterBuilder from '@/components/admin/product-suggesters/suggester-builder';
import SuggesterApiService from '@/api-services/suggester.service';

export default {
  name: 'ProductSuggesterIndex',
  components: {
    SuggesterBuilder,
  },
  data() {
    return {
      currentPage: 'main',
      isLoading: false,
      isDeleting: false,
      suggesters: [],
      selectedSuggester: {},
    };
  },
  async mounted() {
    await this.getBusinessSuggesters();
  },
  methods: {
    async getBusinessSuggesters() {
      await SuggesterApiService.getBusinessSuggesters().then(res => {
        res.data.business_suggesters.forEach((element) => {
          element.associated_locations = JSON.parse(element.associated_locations);
        });
        this.suggesters = res.data.business_suggesters;
      });
    },
    async createNewSuggester() {
      this.isLoading = true;
      await SuggesterApiService.createNewSuggester().then(res => {
        this.selectedSuggester = {id: res.data.new_suggester_id, value: null, associated_locations: [localStorage.getItem('selectedStore')]};
        this.isLoading = false;
      });
      this.currentPage = 'edit';
    },
    async goToEditSuggester(suggesterId) {
      await this.getBusinessSuggesters();
      this.selectedSuggester = this.suggesters.find(s => s.id === suggesterId);
      this.currentPage = 'edit';
    },
    async deleteSuggester(suggesterId) {
      if(this.selectedSuggester.id) {
        suggesterId = this.selectedSuggester.id;
      }
      this.isDeleting = true;
      this.$swal({
        title: "Are you sure you want to delete this Suggester?",
        type: 'warning',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
      }).then(async (result) => {
        if (result.value) {
          await SuggesterApiService.deleteSuggester({id: suggesterId}).then(() => {this.backToMain();});
        }
      });
      this.isDeleting = false;
    },
    async updateLocations(val) {
      await SuggesterApiService.updateSuggesterLocations({suggester_id: val.id, store_ids: val.locations}).then(
        () => {
          if(this.selectedSuggester) {
            this.selectedSuggester = this.suggesters.find(s => s.id === val.id);
            this.selectedSuggester.associated_locations = val.locations;
          }
        }
      );
    },
    async backToMain() {
      await this.getBusinessSuggesters();
      this.selectedSuggester = {};
      this.currentPage = 'main';
    },
    onDrop() {
      this.$emit('onReorder', this.selectedSuggester);
    },
  },
};
</script>

<style scoped lang="scss">
.back:hover {
  text-decoration: underline;
}
</style>
