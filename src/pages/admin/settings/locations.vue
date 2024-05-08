<template>
  <div v-if="$ezHasNoPermission('edit_locations')">
    <no-permission-truevalue page="Locations"></no-permission-truevalue>
  </div>
  <div class="bg-white  h-100" v-else :class="saving ? 'disabled' : ''">
    <div class="preloader"></div>
    <div class="settings-header">
      <div class="settings-header-info">
        <h1>Locations</h1>
        <button class="btn btn-primary save-btn" @click="saveData">
          <span v-if="saving" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
          {{ !saving ? 'Save' : 'Saving...' }}
        </button>
      </div>
    </div>
    <div class="settings-body">
      <div v-if="isTruevalue" class="instructions pr-5">
        <h5>
          Instructions for store openings and closings hours
        </h5>
        <ol>
          <li>Updates made in this admin will be overwritten by the data stored in True Value Database on a nightly basis. Only update here for changes that need to reflect quicker than overnight.</li>            
          <li>
            In order to ensure store hour changes are reflected accross all properties (store locator, Google, Store sites, and more) Navigate to Netwarehouse > Business Tools > Store Operations > Select "Store Hours Tool"
          </li>
        </ol>
      </div>
      <div class="stores">
        <div v-for="(store, key) in info.locations" :key="`store-${key}`" class="store mb-4">
          <div class="row align-items-center">
            <div class="col-12 col-lg-6">
              <div class="d-flex mb-4 store-name">
                <input class="form-control" type="text" v-model="store.name" ref="nameInput" />
              </div>
              <form class="needs-validation" novalidate="">
                <fieldset class="form-group">
                  <legend>Store Address</legend>
                  <div class="form-row">
                    <div class="col-md-6 form-group" :class="{'col-md-12' : countries}">
                      <input type="text" class="form-control" id="address" placeholder="Address" v-model="store.address" @blur="saveData">
                    </div>
                    <div class="col-md-6 form-group" v-if="countries">
                      <select class="form-control" id="state" v-model="store.country" @change="() => store.state = ''">
                        <option disabled selected hidden :value="undefined">Select Country</option>
                        <option value="USA">USA</option>
                        <option v-for="country in countries" :key="country" :value="country">
                          {{ country }}
                        </option>
                      </select>
                    </div>
                    <div class="col-md-6 form-group">
                      <select class="form-control" id="state" placeholder="State" v-model="store.state" v-if="store.country == 'USA'">
                        <option disabled selected hidden value="">Select State</option>
                        <option v-for="state in states" :key="state.shortCode" :value="state.shortCode">{{ state.name }}</option>
                      </select>
                      <input v-else placeholder="State" type="text" class="form-control" v-model="store.state" />
                    </div>
                    <div class="col-md-6 form-group mb-3 mb-md-0">
                      <input type="text" class="form-control" id="city" placeholder="City" v-model="store.city">
                    </div>
                    <div class="col-md-6 form-group mb-0">
                      <input type="text" class="form-control" id="zip" placeholder="Zip Code" v-model="store.zip">
                    </div>
                  </div>
                </fieldset>
                <fieldset class="form-group">
                  <legend>Store Information</legend>
                  <div class="form-row">
                    <div class="col-md-6 form-group">
                      <input type="text" class="form-control" id="phone" placeholder="Store Phone Number" v-model="store.phone">
                    </div>
                    <div class="col-md-6 form-group">
                      <input type="text" class="form-control" id="email" placeholder="Store Email" v-model="store.email">
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
            <!-- Store Hours -->
            <div class="col-12 col-lg-6 schedule">
              <div class="d-flex w-100 mb-1 text-uppercase font-weight-bold small">
                <div style="width: 28px;"></div>
                <div style="flex: 1" class="d-flex justify-content-center">
                  <div class="status label-open">Open</div>
                  <div class="status label-close">Close</div>
                </div>
              </div>
              <div v-for="(day, key, index) in store.hours" :key="index" class="d-flex w-100 align-items-center justify-content-center mb-2">
                <b class="day text-uppercase">{{ key }}</b>
                <div class="d-flex timepickers">
                  <div v-if="day.closed" class="text-center w-100">Closed</div>
                  <timepicker v-if="!day.closed" :time="day.open" @update="day.open = $event;" />
                  <timepicker v-if="!day.closed" :time="day.close" @update="day.close = $event;" />
                </div>
                <button class="close-btn" @click="toggleStoreState(day)" aria-label="Toggle Store State">
                  <svg v-if="!day.closed" width="11px" height="11px" viewBox="0 0 11 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="Admin-Settings-Wireframes" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="Admin-View@2x-Copy-3" transform="translate(-1294.000000, -559.000000)" fill="#FF4E4E">
                        <path d="M1301.89779,564.5 L1305,567.602214 L1302.60221,570 L1299.5,566.897786 L1296.39779,570 L1294,567.602214 L1297.10221,564.5 L1294,561.397786 L1296.39779,559 L1299.5,562.102214 L1302.60221,559 L1305,561.397786 L1301.89779,564.5 Z" id="Combined-Shape"></path>
                      </g>
                    </g>
                  </svg>
                  <svg v-else width="13px" height="10px" viewBox="0 0 13 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="Admin-Settings-Wireframes" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="Admin-View@2x-Copy-3" transform="translate(-1293.000000, -604.000000)" fill="#41B241">
                        <polygon id="Rectangle" transform="translate(1299.492706, 607.100954) rotate(-45.000000) translate(-1299.492706, -607.100954) " points="1297.56415 608.022902 1304.57044 608.022902 1304.57044 611.223933 1294.41497 611.223933 1294.47371 602.977974 1297.65229 603.000617"></polygon>
                      </g>
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  import Timepicker from '@/components/timepicker';
  import AdminService from '@/api-services/admin.service';
  import axios from 'axios';
  import NoPermissionTruevalue from "./no-permission-truevalue";
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
      Timepicker,
      NoPermissionTruevalue
    },
    data() {
      return {
        info: {},
        sliders: [],
        saving: false,
        slides: null,
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
      },
      countries() {
        return this.$store.state.settings.cart.additionalCountries || null;
      },
      isTruevalue() {
        return this.$root.$children[0].isTruevalue;
      }
    },
    async mounted() {
      if(this.slug && !this.$ezHasNoPermission('edit_locations')) {
        let response = await HomePageApiService.getAbout();
        this.info = response.data.data || { locations: [] };
      }
    },
    methods: {
      editNameInput() {
        this.$refs.nameInput[0].focus();
      },
      onDrop() {
        this.slides.map((e, i) => e.sequence = i + 1);
      },
      MyCustomUploadAdapterPlugin (editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = loader => {
          return new UploadAdapter(loader);
        };
      },
      saveData() {
        this.saving = true;
        AdminService.saveAbout(this.info).then(() => {
          this.saving = false;
        });
      },
      toggleStoreState(day) {
        day.closed = !day.closed;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .store-name svg * {
    fill: var(--primary);
  }
  .day {
    width: 40px;
    font-size: 14px;
  }
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

  .status {
    width: 50%;
    max-width: 140px;
    margin: 0 4px;
  }

  .schedule {
    .label-open {
      text-align: center;
    }

    .label-close {
      text-align: center;
    }
  }

  @media (max-width: 991px) {
    .schedule {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      width: 100%;
      align-items: flex-end;
    }
    fieldset.form-group {
      margin-bottom: 20px;
    }
  }
</style>
