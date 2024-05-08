<template>
  <main v-if="updateModalShouldShow" style="position: absolute;">
    <b-modal class="modal-box" size="lg" ref="updatesModal" hide-footer hide-header no-close-on-esc no-close-on-backdrop scrollable>
      <div class="row float-right">
        <b-button class="btn-xs mr-1" variant="danger" v-b-tooltip.hover title="Close" @click="closeUpdatesPopup()">X</b-button>
      </div>
      <div class="text-center ml-2">
        <svg class="mx-auto d-block mb-2" width="72" height="56" viewBox="0 0 72 56" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_18_15)"> <path class="update-icon" d="M8 29.6C8 15.4615 19.4615 4 33.6 4C47.7385 4 59.2 15.4615 59.2 29.6C59.2 43.7385 47.7385 55.2 33.6 55.2C19.4615 55.2 8 43.7385 8 29.6Z"/> <g opacity="0.5" filter="url(#filter0_i_18_15)"> <path opacity="0.7" d="M47.04 16.8H20.16C18.0392 16.8 16.32 18.5192 16.32 20.64V38.56C16.32 40.6808 18.0392 42.4 20.16 42.4H47.04C49.1608 42.4 50.88 40.6808 50.88 38.56V20.64C50.88 18.5192 49.1608 16.8 47.04 16.8Z" fill="white"/> <path opacity="0.5" d="M47.04 17.2H20.16C18.2601 17.2 16.72 18.7401 16.72 20.64V38.56C16.72 40.4599 18.2601 42 20.16 42H47.04C48.9399 42 50.48 40.4599 50.48 38.56V20.64C50.48 18.7401 48.9399 17.2 47.04 17.2Z" stroke="url(#paint2_linear_18_15)"/> </g> <path d="M26.8 24.4C27.4627 24.4 28 23.8627 28 23.2C28 22.5373 27.4627 22 26.8 22C26.1373 22 25.6 22.5373 25.6 23.2C25.6 23.8627 26.1373 24.4 26.8 24.4Z" fill="white"/> <path d="M26.8 30.8C27.4627 30.8 28 30.2627 28 29.6C28 28.9373 27.4627 28.4 26.8 28.4C26.1373 28.4 25.6 28.9373 25.6 29.6C25.6 30.2627 26.1373 30.8 26.8 30.8Z" fill="white"/> <path d="M26.8 37.2C27.4627 37.2 28 36.6627 28 36C28 35.3373 27.4627 34.8 26.8 34.8C26.1373 34.8 25.6 35.3373 25.6 36C25.6 36.6627 26.1373 37.2 26.8 37.2Z" fill="white"/> <path d="M32 23.2H41.6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M32 29.6H41.6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M32 36H41.6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.4" d="M54.8 52C55.2434 52.8577 55.9423 53.5566 56.8 54C55.9423 54.4434 55.2434 55.1423 54.8 56C54.3566 55.1423 53.6577 54.4434 52.8 54C53.6577 53.5566 54.3566 52.8577 54.8 52Z" fill="white"/> <path d="M14 44C14.7982 45.5438 16.0562 46.8018 17.6 47.6C16.0562 48.3982 14.7982 49.6562 14 51.2C13.2018 49.6562 11.9438 48.3982 10.4 47.6C11.9438 46.8018 13.2018 45.5438 14 44Z" fill="none"/> <path d="M2.8 13.6C3.42086 14.8008 4.39923 15.7791 5.6 16.4C4.39923 17.0209 3.42086 17.9992 2.8 19.2C2.17914 17.9992 1.20077 17.0209 0 16.4C1.20077 15.7791 2.17914 14.8008 2.8 13.6Z" fill="white"/> <path d="M68.8 28.8C69.3322 29.8292 70.1708 30.6678 71.2 31.2C70.1708 31.7322 69.3322 32.5708 68.8 33.6C68.2678 32.5708 67.4292 31.7322 66.4 31.2C67.4292 30.6678 68.2678 29.8292 68.8 28.8Z" fill="white"/> <path opacity="0.5" d="M40 0C40.3548 0.686154 40.9138 1.24522 41.6 1.6C40.9138 1.95478 40.3548 2.51385 40 3.2C39.6452 2.51385 39.0862 1.95478 38.4 1.6C39.0862 1.24522 39.6452 0.686154 40 0Z" fill="white"/> </g> <defs> <filter id="filter0_i_18_15" x="16.22" y="16.7" width="34.76" height="30.6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"/> <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/> <feOffset dy="6.4"/> <feGaussianBlur stdDeviation="2.4"/> <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/> <feBlend mode="normal" in2="shape" result="effect1_innerShadow_18_15"/> </filter> <linearGradient id="paint0_linear_18_15" x1="55.36" y1="49.12" x2="12.169" y2="44.0311" gradientUnits="userSpaceOnUse"> <stop stop-color="#FF17F6"/> <stop offset="1" stop-color="#FF4FF8"/> </linearGradient> <linearGradient id="paint1_linear_18_15" x1="3.84002" y1="4" x2="63.4706" y2="2.99113" gradientUnits="userSpaceOnUse"> <stop stop-color="white"/> <stop offset="1" stop-color="white" stop-opacity="0"/> </linearGradient> <linearGradient id="paint2_linear_18_15" x1="16.32" y1="15.239" x2="46.539" y2="36.8566" gradientUnits="userSpaceOnUse"> <stop stop-color="white"/> <stop offset="1" stop-color="white" stop-opacity="0"/> </linearGradient> <clipPath id="clip0_18_15"> <rect width="71.2" height="56" fill="white"/> </clipPath> </defs> </svg>
      </div>
      <div class="text-center mb-3">
        <h3 class="d-block mb-0">New Update!</h3>
      </div>
      <div class="scroll-container">
        <hr>
        <div v-for="update in updates" :key="update.id" class="my-3 mb-2">
          <div class="d-flex justify-content-between mb-2">
            <h6 class="m-0">Version {{ update.release_note_version }}</h6>
            <h6 class="fw-normal m-0">Released: {{ formatDate(update.date_added) }}</h6>
          </div>
          <div v-for="updateData in featureUpdates[update.updateArrayLength]" :key="updateData.id" class="mt-3">
            <div v-if="updateData.highlighted" class="highlighted-log mb-4 text-center">
              <h5 class="mb-3">{{ updateData.title }}</h5>
              <div class="image-cover-container flex-shrink-0 me-2 position-relative w-100 mb-3">
                <img style="object-fit: contain; cursor: pointer;" :src="updateData.image" :alt="updateData.title" @click="viewImage(updateData.image)" class="w-75 h-75">
              </div>
              <div class="mb-3">
                <p class="text-muted mb-0" v-html="updateData.description"></p>
              </div>
            </div>
            <div v-if="updateData.is_paragraph" class="highlighted-log mb-4">
              <div class="mb-3">
                <p class="text-muted mb-0" v-html="updateData.paragraph"></p>
              </div>
            </div>
            <template v-if="!updateData.highlighted && !updateData.is_paragraph">
              <svg class="me-1 flex-shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <small class="pb-0 ml-1 text-muted" style="font-size: 14px;" v-html="updateData.description"></small>
            </template>
          </div>
          <div class="mt-4"><hr></div>
        </div>
        <div v-if="loadingUpdates" class="spinner-border spinner-border-sm d-block mx-auto mt-4"></div>
        <button v-else-if="!lastUpdatesPage" @click="viewMoreLogs()" type="button" class="btn btn-sm d-block mx-auto business-background mt-2" style="color: white;">View More</button>
        <div v-else-if="lastUpdatesPage" class="text-center">No more updates to show.</div>
      </div>
    </b-modal>
  </main>
</template>

<script>
import AdminApiService from '@/api-services/admin.service';
import HomePageApiService from '@/api-services/homepage.service';

export default {
  name: 'UpdatesModal',
  data() {
    return {
      updateModalShouldShow: false,
      adminAccountIdentifier: '',
      foundIdentifier: false,
      updates: [],
      featureUpdates: [],
      loadingUpdates: false,
      updatesPage: 0,
      lastUpdatesPage: false,
    };
  },
  computed: {
    businessChannelId() {
      return this.$store.state.businessDetails.release_channel_id;
    },
    businessVersion() {
      return this.$store.state.businessDetails.release_version;
    },
  },
  async mounted() {
    if(!this.businessChannelId || !this.businessVersion) {
      let r = await HomePageApiService.getBusinessDetails();
      this.$store.commit('setBusinessDetails', r.data.data);
    }
    this.showNewUpdatesModal();
  },
  methods: {
    async showNewUpdatesModal() {
      // always set updateModalShouldShow to false at mounting so when is set to true, it will not persist as such on page reload
      this.updateModalShouldShow = false;
      // get admin account data
      const getSubAccOrMasterAcc = JSON.parse(localStorage.getItem('user')).data.customer.id ? JSON.parse(localStorage.getItem('user')).data.customer.id : JSON.parse(localStorage.getItem('user')).is_admin;
      if(getSubAccOrMasterAcc !== null) {
        if(getSubAccOrMasterAcc === true) {
          this.adminAccountIdentifier = 'masterAdmin';
        } else {
          this.adminAccountIdentifier = getSubAccOrMasterAcc;
        }
      }
      // search admin account data in localStorage
      // set foundIdentifier to false if the logged account is not found in localStorage
      const currentIdentifiers = JSON.parse(localStorage.getItem("adminIdentifierForReleaseNotes"));
      this.foundIdentifier = currentIdentifiers !== null ? currentIdentifiers.find(element => element == this.adminAccountIdentifier) : false;
      // if admin account is not found in localStorage, update localStorage after setting foundIdentifier to false
      if(!this.foundIdentifier) {
        if(currentIdentifiers === null) {
          localStorage.setItem('adminIdentifierForReleaseNotes', JSON.stringify([this.adminAccountIdentifier]));
        } else {
          currentIdentifiers.push(this.adminAccountIdentifier.toString());
          localStorage.setItem('adminIdentifierForReleaseNotes', JSON.stringify(currentIdentifiers));
        }
        // change lastReleaseId to show the same release again since the logged admin account hasn't seen it
        localStorage.setItem('lastReleaseId', localStorage.getItem('lastReleaseId') - 1);
      }
      // if it doesn't exist, create last release id item in local storage and set it to 0 so it will always be minor than lastReleaseId from feature release table
      if(localStorage.getItem('lastReleaseId') === null) {
        localStorage.setItem('lastReleaseId', 0);
      }
      // ask for the latest release data corresponding to this ecommerce channel id
      await AdminApiService.getShowReleaseData(this.businessChannelId, this.businessVersion).then(response => {
        let showReleaseData = response.data.show_release_data;
        if(showReleaseData){
          // if the latest release for the corresponding channel is a second draft, set lastReleaseId to 0 to make the next condition always true
          if(showReleaseData && showReleaseData.is_second_draft === 1) {
            localStorage.setItem('lastReleaseId', 0);
            const secondDraftData = {id: showReleaseData.id};
            AdminApiService.changeReleaseSecondDraftStatus(secondDraftData);
          }
          const comingReleaseNoteDate = new Date(showReleaseData.date_added).getTime();
          const existingReleaseNoteDate = new Date(localStorage.getItem('lastReleaseDate')).getTime();
          // if the latest release note in db is newer than the one in localStorage, reset identifier data before the modal show check
          if(comingReleaseNoteDate > existingReleaseNoteDate) {
            localStorage.setItem('adminIdentifierForReleaseNotes', JSON.stringify([this.adminAccountIdentifier]));
            this.foundIdentifier = false;
          }
          localStorage.setItem('lastReleaseDate', showReleaseData.date_added);
          // if there is a release for this channel and its lastReleaseId is bigger (newer) than the existing one, show the modal
          if(showReleaseData && showReleaseData != false && showReleaseData.id > localStorage.getItem('lastReleaseId')) {
            // foundIdentifier will be reset when a new release is created (check getUpdates function)
            if(!this.foundIdentifier) {
              this.updateModalShouldShow = true;
              this.getUpdates();
            }
          }
        }
      });
    },
    async getUpdates() {
      this.lastUpdatesPage = false;
      this.loadingUpdates = true;
      await AdminApiService.getReleaseNotesForModal(this.updatesPage, this.businessChannelId, this.businessVersion).then(response => {
        let data = response.data;
        this.loadingUpdates = false;
        if (data.change_log && data.change_log.length) {
          data = data.change_log.map(log => {
            let parsedUpdates = JSON.parse(log.updates);
            this.featureUpdates.push(parsedUpdates);
            log.updateArrayLength = this.featureUpdates.length - 1;
            return log;
          });
          if (this.updates.length) {
            this.updates = this.updates.concat(data);
          } else {
            localStorage.setItem('lastReleaseId', data[0].id);
            if(localStorage.getItem('lastReleaseDate') === null) {
              localStorage.setItem('lastReleaseDate', data[0].date_added);
            }
            this.updates = data;
          }
          this.showUpdatesPopup();
        } else {
          this.lastUpdatesPage = true;
        }
      });
    },
    viewImage(media) {
      window.open(media);
    },
    async viewMoreLogs() {
      this.updatesPage++;
      this.getUpdates();
    },
    showUpdatesPopup() {
      this.$refs.updatesModal.show();
    },
    closeUpdatesPopup() {
      this.$refs.updatesModal.hide();
    },
    formatDate(date) {
      var date_els = date.split(/-|:| /);
      var newDate = date_els[1] + '-' + date_els[2] + '-' + date_els[0];
      return newDate;
    },
  }
};
</script>

<style scoped>
.update-icon {
  fill: var(--primary);
}
.business-background{
  background-color: var(--primary);
}
.card {
  line-height: 26px;
}
.scrollable-col {
  overflow-y: scroll;
  height: 100vh;
}

.sidenav-item {
  text-decoration: none;
  color: black;
  font-weight: bold;
}

.ck-editor {
  width: 100% !important;
  height: 50vh;
}

.modal-dialog {
  max-width: 60%;
}

</style>
