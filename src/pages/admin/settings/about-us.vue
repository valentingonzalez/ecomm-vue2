<template>
  <div v-if="$ezHasNoPermission('edit_about_us')">
    <no-permission-truevalue page="About Us"></no-permission-truevalue>
  </div>
  <div class="bg-white  h-100" v-else-if="infoLoaded" :class="saving ? 'disabled' : ''">
    <div class="preloader"></div>
    <div class="settings-header">
      <div class="settings-header-info">
        <h1>About Us</h1>
        <div class="d-flex align-items-center" v-if="!info.froala">
          <a class="mr-4 text-muted" href="#" @click.prevent="upgrade">Upgrade</a>
          <button class="btn btn-primary save-btn" @click="saveData">
            <span v-if="saving" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
            {{ !saving ? 'Save' : 'Saving...' }}
          </button>
        </div>
        <div class="d-flex flex-column flex-md-row align-items-end align-items-md-center" v-else>
          <a class="mr-md-4 text-muted order-1 order-md-0 mt-2 mt-md-0" href="#" @click.prevent="downgrade">Downgrade</a>
          <a href="/admin/page-editor/about" target="_blank" class="btn btn-primary save-btn">
            Edit page
          </a>
        </div>
      </div>
    </div>
    <div class="settings-body">
      <template v-if="!info.froala">
        <HtmlEditor v-model="info.description" />
        <button class="btn btn-primary save-btn mt-4" @click="saveData">
          <span v-if="saving" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
          <span v-if="!saving">Save</span>
          <span v-else>Saving...</span>
        </button>
      </template>
      <template v-else>
        <template v-if="info.froala_data">
          <html-wrapper :value="JSON.parse(JSON.parse(info.froala_data))" />
        </template>
        <div v-else>
          <div class="display-3"><small class="font-weight-light">There are no contents yet.</small></div>
          <div class="display-4"><small><small class="font-weight-light">Please, click on Edit Page button to add some content.</small></small></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import States from '@/assets/states.json';
  import AdminService from '@/api-services/admin.service';
  import NoPermissionTruevalue from "./no-permission-truevalue";
  import HomePageApiService from '@/api-services/homepage.service';


  export default {
    name: 'AboutUs',
    components: {
      NoPermissionTruevalue
    },
    data() {
      return {
        info: {},
        sliders: [],
        saving: false,
        slides: null,
        infoLoaded: false
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
      if(this.$ezHasNoPermission('edit_about_us')) return;
      if(this.slug) {
        let response = await HomePageApiService.getAbout();
        this.info = response.data.data || { description: '', froala_data: '', froala: false };
        this.infoLoaded = true;
      }
      if(!window.localStorage.getItem('upgradeFroalaModalShown'))
        if(!this.info.froala) {
          //this.upgrade();
          //window.localStorage.setItem('upgradeFroalaModalShown', true);
        };
    },
    methods: {
      downgrade() {
        this.$swal({
          type: 'info',
          html: `<div class="d-flex flex-column align-items-center">Are you sure do you want to go back to the old system?</div>`,
          confirmButtonText: 'Yes',
          showCancelButton: true,
          showLoaderOnConfirm: true,
          preConfirm: response => {
            if(response) {
              this.info.description = '';
              AdminService.updateFroala({ enabled: false }).then(response => {
                if(response.status == '200')
                  window.location.reload();
              });
            }
          }
        });
      },
      upgrade() {
        this.$swal({
          type: 'info',
          html: `
            <div class="d-flex flex-column align-items-center">
              Do you want to upgrade to our new Page editor?
              <div class="text-small font-weight-bold">(you'll have to copy your data to the new system)</div>
            </div>`,
          confirmButtonText: 'Yes, update it!',
          showLoaderOnConfirm: true,
          showCancelButton: false,
          preConfirm: response => {
            if(response) {
              this.info.description = '';
              AdminService.updateFroala({ enabled: true }).then(response => {
                if(response.status == '200')
                  window.location.reload();
              });
            }
          }
        });
      },
      openFroalaPage() {
        this.$router.push('/admin/page-editor');
      },
      onDrop() {
        this.slides.map((e, i) => e.sequence = i + 1);
      },
      saveData() {
        this.saving = true;
        return AdminService.saveAbout(this.info).then(() => this.saving = false);
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
  @media (max-width: 375px) {
    :deep(.html.widget) {
      margin-left: -15px;
      margin-right: -15px;
    }
  }
</style>
