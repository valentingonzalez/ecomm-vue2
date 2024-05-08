<template>
  <main>
    <div class="container">
      <h1 class="font-weight-bold">Ecommerce Updates</h1>
      <div class="white-space"></div>
      <hr>
      <div v-if="!releaseNotesList.length" class="my-3 mb-2">
        <h3 class="text-center">A list with information about updates released for your Ecommerce will be displayed in this section!</h3>
      </div>
      <div v-else class="scroll-container">
        <div v-for="releaseNote in releaseNotesList" :key="releaseNote.id" class="my-3 mb-2">
          <div class="d-flex justify-content-between mb-2">
            <h6 class="m-0">Version {{ releaseNote.release_note_version }}</h6>
            <h6 class="fw-normal m-0">Released: {{ formatDate(releaseNote.date_added) }}</h6>
          </div>
          <div v-for="update in updates[releaseNote.updateArrayLength]" :key="update.id" class="mt-3">
            <div v-if="update.highlighted" class="highlighted-log mb-4 text-center">
              <h5 class="mb-3">{{ update.title }}</h5>
              <div class="image-cover-container flex-shrink-0 me-2 position-relative w-100 mb-3">
                <img style="object-fit: contain; cursor: pointer;" :src="update.image" :alt="update.title" @click="viewImage(update.image)" class="w-50 h-50">
              </div>
              <div class="mb-3">
                <p class="text-muted mb-0" v-html="update.description"></p>
              </div>
            </div>
            <div v-if="update.is_paragraph" class="highlighted-log mb-4 text-center">
              <div class="mb-3">
                <p class="text-muted mb-0" v-html="update.paragraph"></p>
              </div>
            </div>
            <template v-if="!update.highlighted && !update.is_paragraph">
              <svg class="me-1 flex-shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <small class="pb-0 ml-1 text-muted" style="font-size: 14px;" v-html="update.description"></small>
            </template>
          </div>
          <div class="mt-4"><hr></div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import AdminApiService from '@/api-services/admin.service';

export default {
  name: 'release-updates',
  data() {
    return {
      releaseNotesList: [],
      updates: []
    };
  },
  computed: {
    businessChannelId() {
      return this.$store.state.businessDetails.release_channel_id;
    },
    businessVersion() {
      return this.$store.state.businessDetails.release_version;
    }
  },
  async mounted() {
    this.getUpdates();
  },
  methods: {
    async getUpdates() {
      await AdminApiService.getReleaseNotes(this.businessChannelId, this.businessVersion).then(response => {
        this.releaseNotesList = response.data.release_notes.map(rNote => {
          let dataForUpdatesArray = JSON.parse(rNote.updates).map(mappedUpdates => {
            let upd = {
              highlighted:  mappedUpdates.highlighted,
              title: mappedUpdates.title,
              image: mappedUpdates.image,
              description: mappedUpdates.description,
              is_paragraph: mappedUpdates.is_paragraph,
              paragraph: mappedUpdates.paragraph
            };
            return upd;
          });
          this.updates.push(dataForUpdatesArray);
          rNote.updateArrayLength = this.updates.length - 1;
          return rNote;
        });
      });
    },
    viewImage(media) {
      window.open(media);
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
  max-width: 50%;
}

.white-space {
  padding-top: 20px;
}

</style>
