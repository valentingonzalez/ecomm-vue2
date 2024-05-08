<template>
  <div v-if="$ezHasNoPermission('manage_custom_pages')">
    <NoPermission />
  </div>
  <div v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <div>
          <div>
            <h1>Custom Pages</h1>
            <dfn class="small">
              <b>August 1st 2022 Update:</b> You can now create custom pages and add widgets just like the landing page editor! Click “Add New Page” to begin
            </dfn>
          </div>
          <a href="#" @click.prevent="$refs.tutorialModal.show()" class="btn btn-tutorial btn-sm text-medium bg-white btn-action">
            <i class="fa fa-play mr-1"></i> Click to Watch Tutorial Video
          </a>
          <b-modal size="lg" ref="tutorialModal">
            <div slot="modal-header">
              <h5>Header and Footer</h5>
            </div>
            <div>
              <video class="w-100" poster="/images/cover-header-footer.png" controls>
                <source src="https://storage.googleapis.com/content.ezadtv.com/2024/03/12/65f0a017b2967_Header_Footer.m4v" type="video/mp4">
              </video>
            </div>
            <div slot="modal-footer">
              <button type="button" class="btn btn-primary" @click="$refs.tutorialModal.hide()">Done</button>
            </div>
          </b-modal>
        </div>
      </div>
    </div>
    <div class="settings-body">
      <div>
        <div class="d-flex pb-3 mb-3 border-bottom justify-content-between align-items-center">
          <div>
            <h2 class="h5 mb-0">Pages</h2>
            <dfn class="small">Individual custom pages where you can write a message show any image, video or add HTML snippets.</dfn>
          </div>
          <button @click="addNewPage" class="btn btn-primary save-btn text-nowrap ml-2 ml-md-0">
            Add New Page
          </button>
        </div>
        <table v-if="pages && pages.length" class="table border-gray border w-100">
          <thead>
            <tr>
              <th>Title</th>
              <th>Link</th>
              <th style="width: 80px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="page in pages" :key="page.id" :id="page.id">
              <td>{{ page.title }}</td>
              <td>{{ page.link }}</td>
              <td>
                <div>
                  <router-link class="small mr-3" :to="`/admin/settings/pages/edit/${page.id}`" v-b-tooltip.hover title="Edit" aria-label="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="22" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </router-link>
                  <a href="#"  @click.prevent="deletePage(page)" v-b-tooltip.hover title="Delete" aria-label="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="22" viewBox="0 0 24 24" stroke="#dc3545"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else-if="pages && pages.length == 0">
          There are no Custom pages yet
        </div>
        <div class="preloader d-flex justify-content-center align-items-center w-100 mt-5" v-else>
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import CustomPagesService from '@/api-services/custom-pages.service';
  import CustomNavigationService from '@/api-services/custom-navigation.service';
  import NoPermission from "../no-permission";

  export default {
    name: 'NewPage',
    components: {
      NoPermission
    },
    data() {
      return {
        loading: false,
        saving: false,
      };
    },
    computed: {
      pages() {
        return this.$store.state.customPages;
      }
    },
    methods: {
      addNewPage() {
        this.$swal({
          title: `Add New Page`,
          html: `Please, add a title for your page:
                <br> <br> <b>
                <input type="text" id="swal-input1" class="swal2-input" placeholder="Page title" required>
                 </b>
                <div style="margin-bottom: 15px;">
                <button type="button" id="new-widget-page" class="btn btn-sm btn-primary save-btn text-nowrap ml-2 mr-3 ml-md-0" style="width: 80px;">OK</button>
                <button type="button" id="cancel" class="btn btn-sm save-btn text-nowrap ml-2 ml-md-0" style="background-color: rgb(147, 147, 147); color: white; width: 80px; font-style: bold;">Cancel</button>
                </div>
                `,
          footer: `<div style="display: block;">
                  <p style="font-size: 13px; text-align: left;"><i class="fa fa-info-circle done-check-info-icon"></i> The Page Editor allows you to place widgets in your custom page. Start playing around!</p>
                  <p style="font-size: 13px; text-align: left;"><i class="fa fa-info-circle done-check-info-icon"></i> You can find the previous editor included as the "Classic HTML Editor" widget.</p>
                  </div>`,
          showCancelButton: false,
          showConfirmButton: false,
          customClass: {
            validationMessage: 'validation-message'
          },
          onBeforeOpen: () => {
              const newWidgetPage = document.getElementById('new-widget-page');
              const cancel = document.getElementById('cancel');

              newWidgetPage.addEventListener('click', async () => {
                let title = document.querySelector('.swal2-input').value;
                if(!title) {
                  this.$swal.showValidationMessage('Please add a title to your page.');
                  setTimeout(() => {
                    this.$swal.resetValidationMessage();
                  }, 4000);
                  return;
                };
                if(this.checkExistingPageTitle(title) === true){
                  this.$swal.showValidationMessage('This title is already in use. Please choose a different title.');
                  setTimeout(() => {
                    this.$swal.resetValidationMessage();
                  }, 4000);
                  return;
                };
                let permalink = title.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
                return await CustomPagesService.addPage({
                  title: title,
                  link: permalink,
                  page_type: 'widget',
                  nav_id: 0,
                  navigation: 0,
                }).then(response => {
                  this.$swal({
                    title: 'Redirecting to the page editor...',
                    showConfirmButton: false,
                  });
                  this.$router.push({name: 'edit-page', params: {id: response.data.id}}, () => this.$router.go(0));
                });
              });

              cancel.addEventListener('click', () => {
                this.$swal.close();
              });
              }});
            },
      deletePage(page) {
        this.$swal({
          title: "Delete Page",
          text: `Are you sure you want to delete ${page.title} page?`,
          showCancelButton: true,
          confirmButtonText: 'Delete'
        }).then(result => {
          if(result.value == true) {
            this.saving = true;
            let pageTitleParsed = page.title.toString().toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^\w\-]+/g, '')
              .replace(/\-\-+/g, '-')
              .replace(/^-+/, '')
              .replace(/-+$/, '');
            let navigationElement = this.$store.state.customNavigation.find(e => e.target.replace('/', '') == pageTitleParsed);
            if(navigationElement) {
              CustomNavigationService.deleteNavigation(navigationElement.id);
              this.$store.commit('deleteNavigation', navigationElement.id);
            }
            CustomPagesService.deletePage(page.id).then(() => this.saving = false);
            this.pages.splice(this.pages.findIndex(i => i.id == page.id ), 1);
            this.$swal({
              toast: true,
              position: 'top',
              type: 'success',
              html: `<div class="ml-2">Custom pages list updated!</div>`,
              showConfirmButton: false,
              timer: 3000
            });
          }
        });
      },
      checkExistingPageTitle(attemptedTitle) {
        for(let i = 0; i < this.pages.length; i++){
          if(this.pages[i].title.toLowerCase() === attemptedTitle.toLowerCase()){
            return true;
          };
        }
        return false;
      },
    }
  };
</script>

<style lang="scss" scoped>
  .delete-bt {
    svg, svg * {
      fill: rgba(214, 0, 0, .6);
    }
  }
  .validation-message::before {
    display: none;
  }
  .validation-message {
    color: rgb(123, 123, 123);
    font-size: 1em;
  }
</style>
