<template>
  <div>
    <div class="d-flex align-items-between mb-3 w-100">
      <div class="d-flex align-items-center flex-grow-1">
        <verte class="mr-2" :key="verteKey" :value="background" model="hex" :enableAlpha="false" :showHistory="false" @input="onColorPicker">
          <div class="color-box" :style="{ background: parseColor(background) }"></div>
        </verte>
        <div>
          <div class="mr-2">Background Color</div>
          <div class="text-muted small">
            {{ /^([0-9A-F]{3}){1,2}$/i.test(background) ? `#${background}` : background }}
          </div>
        </div>
      </div>
      <div class="log-info text-info d-none">
        <svg v-if="logInfo" width="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
        {{ logInfo }}
      </div>
    </div>
    <div class="megamenu mx-n4 px-4">
      <div class="h6 font-weight-bold">
        Add Mega Menu Items
      </div>
      <div class="row md-gutters">
        <div class="col-sm-6 col-lg-3" v-for="(column, i) in columns" :key="`col-${i}`">
          <div class="mb-2">
            Column #{{ i + 1 }}
          </div>
          <div :class="{ 'disabled' : uploadingImage === i }">
            <div class="form-control d-flex align-items-center">
              <input :ref="`titleInput-${i}`" :class="{'font-weight-bold text-uppercase': isTitle[i]}" @keypress.enter="newItem(i, $event)" class="p-0 border-0 flex-grow-1" placeholder="Title" type="text" />
              <button @click="toggleTitle(i)" type="button" class="bg-transparent p-0 border-0 ml-2" tabindex="-1">
                <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.382 2H8V11V12V13.2792C8 13.7097 8.27545 14.0918 8.68378 14.2279L11 15V16H7H3V15L5.31622 14.2279C5.72455 14.0918 6 13.7097 6 13.2792V12V11V2H2.61804C2.23926 2 1.89301 2.21399 1.72363 2.5528L1 4H0V0H7H14V4H13L12.2764 2.5528C12.107 2.21399 11.7607 2 11.382 2Z" fill="#94A3B8"/><path d="M15.9284 15V14.658L15.6097 14.534L13.6243 13.7619C13.5003 13.7137 13.357 13.5423 13.357 13.2793L13.3571 7.5H15.756C15.8483 7.5 15.9831 7.56319 16.063 7.74972L16.063 7.74977L16.6833 9.19697L16.8132 9.5H17.1429H18H18.5V9V5V4.5H18H6H5.5V5V9V9.5H6H6.85714H7.18684L7.31671 9.19697L7.93697 7.74977L7.93698 7.74974C8.01692 7.56318 8.15166 7.5 8.24403 7.5H10.6428L10.6427 13.2792C10.6427 13.5423 10.4994 13.7137 10.3754 13.7619L10.5566 14.2279L10.3754 13.7619L8.39006 14.534L8.07129 14.658V15V16V16.5H8.57129H15.4284H15.9284V16V15Z" fill="#94A3B8" stroke="white"/></svg>
              </button>
            </div>
            <input :ref="`linkInput-${i}`" @keypress.enter="newItem(i, $event)" class="form-control mt-1" placeholder="https://" type="text" />
          </div>
          <div class="or lead my-1">OR</div>
          <button type="button" class="bg-white upload-image-bt" @click.prevent="$refs[`imageUploader-${i}`][0].click()">
            <svg width="30" height="29" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 4H4.5C3.70435 4 2.94129 4.31607 2.37868 4.87868C1.81607 5.44129 1.5 6.20435 1.5 7V22M1.5 22V25C1.5 25.7956 1.81607 26.5587 2.37868 27.1213C2.94129 27.6839 3.70435 28 4.5 28H22.5C23.2956 28 24.0587 27.6839 24.6213 27.1213C25.1839 26.5587 25.5 25.7956 25.5 25V19M1.5 22L8.379 15.121C8.94158 14.5586 9.70451 14.2426 10.5 14.2426C11.2955 14.2426 12.0584 14.5586 12.621 15.121L16.5 19M25.5 13V19M25.5 19L23.121 16.621C22.5584 16.0586 21.7955 15.7426 21 15.7426C20.2045 15.7426 19.4416 16.0586 18.879 16.621L16.5 19M16.5 19L19.5 22M22.5 4H28.5M25.5 1V7M16.5 10H16.515" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ uploadingImage === i ? 'Uploading image...' : 'Upload Image' }}
          </button>
          <input type="file" class="d-none" @change="uploadImage($event, i)" :ref="`imageUploader-${i}`" />
          <button @click="newItem(i)" type="button" class="btn btn-outline-primary w-100 lead mt-2">
            <b>Add Item</b>
          </button>
        </div>
      </div>
      <div class="mt-4 pt-4 border-top" v-if="columns.map(e => e.links).flat().length">
        <div class="h6 font-weight-bold">
          Your items
        </div>
        <div class="row md-gutters">
          <div class="col-3" v-for="(column, i) in columns" :key="`col-${i}`">
            <!--<div class="d-flex justify-content-end mb-2 small mr-1"><button type="button" class="edit-link" @click="hideAllLinks(i)" v-if="showingAllLinks.includes(i)">Edit all names<svg class="ml-2" width="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button><button type="button" class="edit-link" @click="showAllLinks(i)" v-else>Edit all links<svg class="ml-2" width="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg></button></div>-->
            <draggable @start="onStartDragging" class="column mb-3" handle=".handle" v-if="column.links && column.links.length" :move="() => {}" @change="() => {}" tag="div" :list="column.links" ghost-class="ghost">
              <div class="d-flex mb-1 item position-relative" v-for="(link, ii) in column.links" :key="`link-${i}-${ii}`">
                <div class="handle mr-3 d-flex align-items-center">
                  <svg width="9" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M3 12v3H0v-3h3zm6 0v3H6v-3h3zM3 6v3H0V6h3zm6 0v3H6V6h3zM3 0v3H0V0h3zm6 0v3H6V0h3z" fill="#BCBCBC" fill-rule="evenodd"/></svg>
                </div>
                <div v-if="link.name" :ref="`link-${i}-${ii}`" class="flip-inputs flex-grow-1" :class="{ 'font-weight-bold': link.title }">
                  {{ link.name }}
                </div>
                <div v-else-if="link.image" class="image flex-grow-1">
                  <img :src="link.image" alt="Image" width="100%" height="100%" class="object-fit-contain">
                </div>

                <button type="button" class="delete-bt" @click="deleteItem(i, ii)" v-log-info="'Delete Item'">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 11L11 1M1 1L11 11" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div class="border-top mt-3 pt-3">
        <div class="h6 font-weight-bold mb-1">Call to Action Button</div>
        <div class="d-flex align-items-end w-100">
          <div class="flex-grow-1">
            <label class="mb-1" for="ctaLabel">Label</label>
            <input id="ctaLabel" type="text" v-model="callToAction.label" class="form-control form-control" placeholder="Label" />
          </div>
          <div class="flex-grow-1 ml-2">
            <label class="mb-1" for="ctaLink">Link</label>
            <input id="ctaLink" type="text" v-model="callToAction.link" class="form-control form-control" placeholder="https://" />
          </div>
          <div class="d-flex flex-column ml-3">
            Preview
            <button type="button" class="btn btn-primary lead mt-1" :disabled="!callToAction.label">
              <b>{{ callToAction.label || 'Preview' }}</b>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import draggable from 'vuedraggable';
  import Verte from 'verte';
  import 'verte/dist/verte.css';

  export default {
    name: 'MegaMenuEditor',
    props: {
      menu: {
        default: {
          callToAction: {
            label: '',
            link: ''
          },
          columns: Array.from({length:4}, () => ({
            title: '',
            type: 'list',
            image: null,
            links: []
          }))
        }
      }
    },
    components: {
      draggable,
      Verte
    },
    data() {
      return {
        verteKey: false,
        selectedColumn: 0,
        uploadingImage: false,
        itemModel: {
          name: '',
          link: ''
        },
        isTitle: {},
        callToAction: {
          label: '',
          link: ''
        },
        titleModel: {
          title: '',
          link: ''
        },
        editingItem: null,
        columnsModel: Array.from({length:4}, () => ({
          title: '',
          type: 'list',
          image: null,
          links: []
        })),
        showingLinks: [],
        showingAllLinks: [],
        background: this.menu ? this.menu.background && this.menu.background || 'white' : 'white',
        logInfo: ''
      };
    },
    directives: {
      'log-info': {
        bind: function(el, b, c) {
          el.__over__ = (() => { c.context.logInfo = b.value; });
          el.__leave__ = (() => { c.context.logInfo = ''; });

          el.addEventListener('mouseover', el.__over__);
          el.addEventListener('mouseleave', el.__leave__);
        }
      }
    },
    computed: {
      darkBackground() {
        if(!this.background) return false;
        let bg = this.background == 'white' ? 'ffffff' : this.background == 'black' ? '000000' : this.background;
        var r, g, b, hsp;
        let color = +(`0x${bg.slice(1).replace(bg.length < 5 && /./g, '$&$&')}`);
        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
        hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
        return hsp>127.5 ? false : true;
      },
      columns() {
        return this.menu && this.menu.columns ? [...this.menu.columns] : this.columnsModel;
      }
    },
    mounted() {
      if(this.menu && this.menu.callToAction) {
        this.callToAction = this.menu.callToAction;
      }
      setTimeout(() => this.verteKey = Math.random(), 500);
    },
    methods: {
      modifyTargetLink(url) {
        const domainPattern = /^www\..+\..+$|^[^\/\s]+?\.[^\/\s]+$/;

        if (!url.startsWith('http://') && !url.startsWith('https://') && !domainPattern.test(url)) {
          return url;
        }
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return url;
        }

        return `https://${url}`;
      },
      toggleTitle(i) {
        this.$refs[`titleInput-${i}`][0].focus();
        this.$set(this.isTitle, i, !this.isTitle[i]);
      },
      toggleTitle2(i, ii) {
        this.$set(this.columns[i].links[ii], 'title', this.columns[i].links[ii].title ? false : true);
      },
      onStartDragging(evt) {
        console.log(evt);
      },
      toggleShowLink(ref) {
        if(this.showingLinks.includes(ref)) {
          this.showingLinks = this.showingLinks.filter(e => e != ref);
        } else {
          this.showingLinks.push(ref);
        }
        //this.$refs[ref][0].classList.toggle('showLink');
      },
      showAllLinks(i) {
        this.showingAllLinks.push(i);
      },
      hideAllLinks(i) {
        this.showingAllLinks = this.showingAllLinks.filter(e => e != i);
      },
      onColorPicker(e) {
        this.background = e.slice(1);
      },
      async uploadImage(evt, i) {
        const file = this.checkFile(evt);
        this.uploadingImage = i;
        this.uploadingImageDesktop = this.loading = true;
        await AdminService.uploadImage(file).then(response => {
          this.columns[i].links.push({
            image: response.data.url
          });
        });
        this.uploadingImage = false;
      },
      checkFile(evt) {
        const file = evt.dataTransfer ? evt.dataTransfer.files[0] : evt.target.files[0];
        if(file.name.includes(' ')) {
          var newName = file.name.replace(/ /g, "_");
          var newFile = new File([file], newName, {type: file.type});
          return newFile;
        } else {
          return file;
        }
      },
      newItem(i, evt) {
        if(!this.$refs[`titleInput-${i}`][0].value) return;
        if(evt) {
          evt.preventDefault();
          evt.stopPropagation();
        }
        this.columns[i].links.push({
          name: this.$refs[`titleInput-${i}`][0].value, link: this.modifyTargetLink(this.$refs[`linkInput-${i}`][0].value), title: this.isTitle && this.isTitle[i]
        });
        this.$refs[`titleInput-${i}`][0].focus();
        this.$refs[`titleInput-${i}`][0].value = '';
        this.$refs[`linkInput-${i}`][0].value = '';
      },
      deleteItem(i, ii) {
        this.columns[i].links.splice(ii, 1);
      },
      parseColor(color) {
        return /^([0-9A-F]{3}){1,2}$/i.test(color) ? `#${color}` : `var(--${color})`;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .megamenu {
    .nav-tabs .nav-link {
      border: none;
    }
    &.light {
      color: #fff;
      .nav-link {
        color: #fff;
        background: none;
      }
      a {
        color: #fff;
        text-decoration: underline;
      }
      .text-primary {
        color: #fff !important;
      }
    }
    ul {
      list-style: none;
      padding: 0;
    }
    .items-list {
      max-height: 250px;
      overflow-y: auto;
    }
    .image-uploader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .remove-img-bt {
      position: absolute;
      border: none;
      background: #fff;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      box-shadow: 0 2px 2px rgba(0,0,0,.2);
      top: 10px;
      right: 10px
    }

    .color-radio {
      height: 20px;
      input {
        display: none;
        &:checked ~ label {
          border: 3px solid #000;
        }
        &.c-000:checked ~ label {
          border: 3px solid #fff;
        }
      }
      label {
        width: 20px;
        height: 20px;
        border: 1px solid #ccc;
        cursor: pointer;
      }
    }
  }
  :deep(.verte__guide) {
    width: auto;
    height: auto;
    .color-box {
      width: 38px;
      height: 38px;
      border: 1px solid #E1E3E5;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .add-bt {
    min-width: 36px;
    height: 36px;
    border: 2px solid #23c98e;
    color: #23c98e;
    border-radius: 4px;
  }
  .link-options {
    position: absolute;
    top: 3px;
    right: 3px;
    z-index: 10;
    display: none;
    .edit-link {
      background: transparent;
      border: none;
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      padding: 0;
      height: 30px;
    }
  }
  .flip-inputs {
    perspective: 1000px;
    transition: transform 0.8s;
    &.showLink {
      .input-wrapper {
        transform: rotateY(180deg);
        .link-input {
          display: block;
        }
      }
    }
    .input-wrapper {
      position: relative;
      transition: transform .3s;
      transform-style: preserve-3d;
      height: 36px;
      .name-input,
      .link-input {
        position: absolute;
        width: 100%;
        -webkit-backface-visibility: hidden; /* Safari */
        backface-visibility: hidden;
      }
      .name-input:hover {
        input {
          padding-right: 65px !important;
        }
      }
      .link-input:hover {
        input {
          padding-right: 45px !important;
        }
      }
      .link-input {
        transform: rotateY(180deg);
        display: none;
        input {
          color: #3a69b7;
          border: 1px solid #6da4ff;
        }
      }
    }
  }
  .log-info {
    height: 30px;
    display: flex;
    align-items: center;
    font-size: 13px;
  }
  .handle {
    cursor: move;
  }
  .image {
    &:hover {
      .link-options {
        display: block;
        background: #fff;
        border-radius: 50%;
        padding: 0 5px;
        top: 5px;
        right: 5px;
      }
    }
  }
  .or {
    display: flex;
    width: 100%;
    align-items: center;
    color: #94A3B8;
    &::before,
    &::after {
      content: '';
      position: relative;
      background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMSIgdmlld0JveD0iMCAwIDEyIDEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYiIGhlaWdodD0iMSIgZmlsbD0iI0UyRThGMCIvPjwvc3ZnPg==");
      background-repeat: repeat-x;
      height: 1px;
      flex-grow: 1;
      top: 1px;
      border-spacing: 10px;
    }
    &::before {
      margin-right: 10px;
    }
    &::after {
      margin-left: 10px;
    }
  }
  .upload-image-bt {
    border: 1px solid #D1D5DB;
    border-radius: 6px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: #475569;
  }
  .item {
    background: #F8FAFC;
    padding: 12px 16px;
    font-size: 16px;
    border-radius: 6px;
    max-height: 100px;
    .delete-bt {
      background: #E2E8F0;
      border-radius: 4px;
      min-width: 28px;
      width: 28px;
      height: 28px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
