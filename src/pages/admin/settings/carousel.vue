<template>
  <div :class="saving ? 'disabled' : ''">
    <div class="preloader"></div>
    <div class="px-md-5 d-flex pt-md-4 pb-3 mb-3 border-bottom justify-content-between align-items-center heading">
      <h1 class="h4 mb-0">Carousel</h1>
      <button class="btn btn-primary save-btn" @click="saveData">
        <span v-if="saving" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
        {{ !saving ? 'Save' : 'Saving...' }}
      </button>
    </div>
    <div class="px-md-5 pb-5">
      <template>
        <draggable v-model="slides" @start="drag=true" @end="onDrop" class="thumbs row small-gutters mb-2">
          <template v-for="(slide, key) in slides">
            <div class="thumb loading col-4 col-md-2 align-items-center justify-content-center d-flex" v-if="!slide" :key="`loading-${key}`">
              <span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
            </div>
            <div class="thumb col-4 col-md-2" :key="key" v-else>
              <a href="#" class="delete-bt" @click.prevent="deleteCarouselItem($event, key)" aria-label="Delete Item">
                <svg width="10" height="14" xmlns="http://www.w3.org/2000/svg"><g fill="#FFF" fill-rule="nonzero"><path d="M9.551 1.38H7.093V.45C7.093.2 6.892 0 6.643 0H3.357c-.248 0-.448.2-.448.449v.932H.449c-.248 0-.449.2-.449.448V3.21c0 .248.201.449.449.449h.136l.41 9.675c.01.24.209.43.449.43h7.112c.24 0 .438-.19.448-.43l.41-9.675h.137c.248 0 .449-.201.449-.45V1.83c0-.247-.201-.448-.449-.448zM3.805.899h2.39v.483h-2.39V.898zm4.32 11.968h-6.25l-.391-9.207h7.032l-.39 9.207zM9.103 2.76H.898v-.483h8.204v.483z"/><path d="M3.194 5.035c-.247 0-.448.201-.448.449v5.557a.449.449 0 00.897 0V5.484a.449.449 0 00-.449-.449zM5 5.035c-.248 0-.449.201-.449.449v5.557a.449.449 0 10.898 0V5.484a.449.449 0 00-.45-.449zM6.805 5.035c-.247 0-.448.201-.448.449v5.557a.449.449 0 00.897 0V5.484c0-.248-.2-.449-.449-.449z"/></g></svg>
              </a>
              <a href="#" class="edit-bt" @click.prevent="editCarouselItem($event, key)" aria-label="Edit Item">
                <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg"><g fill="#FFF" fill-rule="nonzero"><path d="M7.224 4.642a2.727 2.727 0 00-3.907 0L.807 7.2A2.84 2.84 0 000 9.185C-.001 10.74 1.235 12 2.76 12a2.72 2.72 0 001.952-.82l2.072-2.11a.203.203 0 00.058-.143.2.2 0 00-.198-.2h-.079a3.269 3.269 0 01-1.263-.25.195.195 0 00-.215.045l-1.49 1.519a1.17 1.17 0 01-1.675 0 1.222 1.222 0 010-1.706l2.52-2.564a1.169 1.169 0 011.673 0 .798.798 0 001.109 0 .81.81 0 00.229-.51.812.812 0 00-.229-.619z"/><path d="M11.191.824a2.725 2.725 0 00-3.905 0L5.218 2.93a.204.204 0 00-.042.22.197.197 0 00.186.123h.073c.432 0 .86.085 1.26.251a.195.195 0 00.215-.044l1.485-1.51a1.169 1.169 0 011.674 0 1.222 1.222 0 010 1.705L8.22 5.558l-.016.018-.646.655c-.462.47-1.21.47-1.673 0a.798.798 0 00-1.108 0 .81.81 0 000 1.133c.228.234.495.424.789.563.041.02.083.036.124.054.041.018.085.032.126.048.042.016.085.03.126.042l.117.032c.079.02.157.037.238.05.098.015.196.025.294.029H6.74l.118-.014c.044-.002.09-.012.14-.012h.067l.137-.02.063-.012.114-.025h.022c.484-.124.927-.38 1.28-.739l2.51-2.558a2.85 2.85 0 000-3.978z"/></g></svg>
              </a>
              <div class="img" :style="{backgroundImage: `url('${slide.image}')`}"></div>
            </div>
          </template>
          <button :disabled="uploadingImage" @click.prevent="$refs.fileUploader.click()" class="add-more col-4 col-md-2">
            Add Image
          </button>
        </draggable>
        <b-carousel v-if="slides && slides.length" class="mb-3 overflow-hidden" controls style="height: 230px;">
          <b-carousel-slide v-for="(slide, index) in slides" :key="index">
            <img slot="img" class="w-100 mh-100" :src="slide.image" alt="image slot" />
          </b-carousel-slide>
        </b-carousel>
      </template>
      <button class="btn btn-primary save-btn" @click="saveData">
        <span v-if="saving" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
        <span v-if="!saving">Save</span>
        <span v-else>Saving...</span>
      </button>
    </div>
  </div>
</template>

<script>
  import States from '@/assets/states.json';
  import AdminService from '@/api-services/admin.service';
  import draggable from 'vuedraggable';
  import axios from 'axios';
  import HomePageApiService from '@/api-services/homepage.service';

  class UploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }
    async upload() {
      return this.loader.file
        .then( uploadedFile => {
          return new Promise(( resolve, reject ) => {
          const data = new FormData();
          data.append( 'image', uploadedFile );
          axios({
            url: '/about-us/upload',
            method: 'post',
            data,
            headers: {
                'Content-Type': 'multipart/form-data;'
            },
            withCredentials: false
          }).then( response => {
            if ( response.data.status == 'ok' ) {
              resolve( {
                  default: response.data.url
              } );
            } else {
              reject( response.data.message );
            }
          }).catch( () => {
            reject('Upload failed');
          });
        });
      });
    }
    abort() {
    }
  }

  export default {
    name: 'AboutUs',
    components: {
      draggable
    },
    data() {
      return {
        info: {},
        sliders: [],
        saving: false,
        carousel: null,
        slides: null,
        uploadingImage: false,
        editorConfig: {
          extraPlugins: [ this.MyCustomUploadAdapterPlugin ],
        }
      };
    },
    computed: {
      states() {
        return States.regions;
      },
      slug() {
        return this.$store.state.business_slug;
      }
    },
    async mounted() {
      if(this.slug) {
        let response = await HomePageApiService.getAbout();
        this.info = response.data.data;
        let carousel = await AdminService.getCarouselImages();
        this.carousel = carousel.data.data;
      }
      if(this.carousel[0]){
        this.slides = this.carousel[0].images.sort((a, b) => (a.sequence > b.sequence) ? 1 : -1);
      }else{
        this.slides = [];
      }
    },
    methods: {
      onDrop() {
        this.slides.map((e, i) => e.sequence = i + 1);
      },
      async updateCarousel() {
        AdminService.updateCarousel({ active: 1, images: this.slides });
      },
      editCarouselItem(evt, key) {
        let slide = this.slides[key];
        this.$swal({
          title: "Redirect url",
          text: "Changes will not be saved until you press the save button",
          input: 'text',
          inputValue: slide.redirect_url,
          showCancelButton: true,
          confirmButtonText: 'Confirm'
        }).then(result => {
          if(result.value != undefined)
            slide.redirect_url = result.value;
        });
      },
      deleteCarouselItem(evt, key) {
        this.$swal({
          title: 'Do you want to remove this slide?',
          text: "Changes will not be saved until you press the save button",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes'
        }).then(result => {
          result.value == true && this.$delete(this.slides, key);
        });
      },
      MyCustomUploadAdapterPlugin (editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = loader => {
          return new UploadAdapter(loader);
        };
      },
      saveData() {
        this.saving = true;
        this.updateCarousel();
        AdminService.saveAbout(this.info).then(() => {
          this.saving = false;
        });
      },
      toggleStoreState(day) {
        day.closed = !day.closed;
      },
      editStoreName(evt) {
        let nameInput = evt.target.parentNode.querySelector('h4');
        let selection = window.getSelection();
        let range = document.createRange();

        nameInput.focus();

        range.selectNodeContents(nameInput);
        selection.removeAllRanges();
        selection.addRange(range);

        evt.preventDefault();
      }
    }
  };
</script>

<style lang="scss" scoped>

  .thumbs {
    .thumb {
      > .img {
        border: 1px solid transparent;
        cursor: move;
        height: 90px;
        width: 100%;
        background-size: cover;
        background-position: center;
        display: block;
        &.selected {
          border-color: var(--primary);
        }
      }
      .delete-bt,
      .edit-bt {
        position: absolute;
        border-radius: 100%;
        width: 20px;
        height: 20px;
        top: 5px;
        align-items: center;
        justify-content: center;
        display: none;
      }
      .delete-bt {
        background: rgba(214, 0, 0, .6);
        right: 5px;
      }
      .edit-bt {
        background: #518EFF;
        right: 30px;
      }
      &:hover {
        .delete-bt,
        .edit-bt {
          display: flex;
        }
      }
    }
    .add-more {
      border: 2px dashed lightblue;
      color: lightskyblue;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      height: 90px;
    }
  }


  .store-name .edit-bt {
    width: 21px;
    height: 20px;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjFweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjEgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iQWRtaW4tU2V0dGluZ3MtV2lyZWZyYW1lcyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkFkbWluLVZpZXdAMngtQ29weS0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTkzLjAwMDAwMCwgLTUxNy4wMDAwMDApIiBmaWxsPSIjRUQ2NzJGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTkzLjAwMDAwMCwgNTE3LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE3LjA1MTE0MjksOC4wMjE4NTcxNCBDMTYuODI1NzE0Myw4LjA5MjU3MTQzIDE1LjcwMDE0MjksOC4zMzM0Mjg1NyAxNS43NzA4NTcxLDguNTU5Mjg1NzEgQzE2LjAxNzcxNDMsOS4zNDYxNDI4NiAxNi4xNDI4NTcxLDEwLjE2NzI4NTcgMTYuMTQyODU3MSwxMSBDMTYuMTQyODU3MSwxNS40OTAxNDI5IDEzLjQ5MDE0MjksMTguMTQyODU3MSA5LDE4LjE0Mjg1NzEgQzQuNTA5ODU3MTQsMTguMTQyODU3MSAxLjg1NzE0Mjg2LDE1LjQ5MDE0MjkgMS44NTcxNDI4NiwxMSBDMS44NTcxNDI4Niw2LjUwOTg1NzE0IDQuNTA5ODU3MTQsMy44NTcxNDI4NiA5LDMuODU3MTQyODYgQzkuODMyNzE0MjksMy44NTcxNDI4NiAxMC42NTM0Mjg2LDMuOTgyMjg1NzEgMTEuNDM5LDQuMjI4NzE0MjkgQzExLjY2NTI4NTcsNC4yOTk0Mjg1NyAxMS45MDU3MTQzLDMuMTczNDI4NTcgMTEuOTc2NDI4NiwyLjk0ODQyODU3IEMxMi4wNDcxNDI5LDIuNzIyNTcxNDMgMTEuOTIxNTcxNCwyLjQ4MTcxNDI5IDExLjY5NjE0MjksMi40MTEgQzEwLjgyNzQyODYsMi4xMzggOS45MTk3MTQyOSwyIDksMiBDNC4wMzc1NzE0MywyIDAsNi4wMzc1NzE0MyAwLDExIEMwLDE1Ljk2MjQyODYgNC4wMzc1NzE0MywyMCA5LDIwIEMxMy45NjI0Mjg2LDIwIDE4LDE1Ljk2MjQyODYgMTgsMTEgQzE4LDEwLjA4MDI4NTcgMTcuODYxNTcxNCw5LjE3MjE0Mjg2IDE3LjU4ODU3MTQsOC4zMDIxNDI4NiBDMTcuNTE3ODU3MSw4LjA3NzE0Mjg2IDE3LjI3Nzg1NzEsNy45NTA3MTQyOSAxNy4wNTExNDI5LDguMDIxODU3MTQgWiIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoIiBwb2ludHM9IjE3LjEyNzA3NzEgMiA4LjgyOTYxMzg3IDkuNTQzMTQ4NDMgOCAxMiAxMC43MDI1MzY3IDExLjI0NTgwNTYgMTkgMy43MDI2NTcxNCI+PC9wb2x5Z29uPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE5Ljg0MDYxMzIsMyBMMjAuNjE4NTk5OSwyLjIyMjAxMzMxIEMyMS4xMjcxMzM0LDEuNzEzOTEzOCAyMS4xMjcxMzM0LDAuODg5NDk5NTY2IDIwLjYxODU5OTksMC4zODE0MDAwNTggQzIwLjExMDA2NjUsLTAuMTI3MTMzMzUzIDE5LjI4NjUyMDEsLTAuMTI3MTMzMzUzIDE4Ljc3Nzk4NjcsMC4zODE0MDAwNTggTDE4LDEuMTU5Mzg2NzUgTDE5Ljg0MDYxMzIsMyBaIiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
  }

  .save-btn {
    padding-right: 20px;
    padding-left: 20px;
  }

  .close-btn {
    border: none;
    background: none;
    padding: 0;
  }

  .schedule {
    .timepickers {
      width: 220px;
    }

    .label-open {
      text-align: center;
    }

    .label-close {
      text-align: center;
      margin-right: 30px;
    }
  }

  @media (max-width: 991px) {
    .schedule {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      width: 100%;
      align-items: flex-end;

      > * {
        max-width: 320px;
      }

      .label-open {
        margin-right: 22px;
        margin-right: 10px;
        width: 100px;
      }

      .label-close {
        margin-right: 22px;
        width: 100px;
      }
    }
    fieldset.form-group {
      margin-bottom: 20px;
    }
  }
</style>
