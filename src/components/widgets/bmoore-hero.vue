<template>
  <div>
    <section class="widget pb-0 mb-0" :class="{'editable mb-4': editable}">
      <div class="d-flex justify-content-between align-items-center" v-if="editable">
        <div class="title flex-grow-1 d-flex align-items-start mb-3">
          <div>
            <h4 class="mb-0">
              {{ isBenjaminMoore ? 'Benjamin Moore Hero' : 'Text & Image' }}
            </h4>
            <div v-if="editable && master" class="small font-weight-bold text-warning">
              Added by EZ-AD Representative
            </div>
          </div>
          <div class="edit-buttons ml-3">
            <a href="#" class="remove-bt" @click.prevent.stop="remove" aria-label="Remove">
              <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-8 -7)" fill-rule="nonzero" fill="none"><circle fill="#E2E2E3" cx="15" cy="15" r="15"/><path d="M21 13v8c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2v-8h12zm-3-6c.6 0 1 .4 1 1v2h3v2H8v-2h3V8c0-.6.4-1 1-1zm-1 2h-4v1h4V9z" fill="#90939A"/></g></svg>
            </a>
          </div>
        </div>
        <div class="mr-4 d-flex" v-if="editable">
          <div class="custom-control custom-switch" v-if="editable">
            <input type="checkbox" v-model="intHidden" class="custom-control-input" :id="`hidden${id}`" @change="updateHidden">
            <label class="custom-control-label" :for="`hidden${id}`">Hide</label>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-between mb-3" v-if="editable">
        <div class="d-flex align-items-center">
          <div class="mr-2 font-weight-bold">Background</div>
          <Verte :value="intData.background" model="hex" :enableAlpha="false" :showHistory="false" @input="onColorPicker">
            <div class="color-box" :style="{ background: intData.background }"></div>
          </Verte>
        </div>
        <button v-if="isBenjaminMoore" type="button" @click="() => $refs.templatesModal.show()" class="btn btn-outline-secondary btn-sm">Templates</button>
      </div>
      <div :class="{'full': intData.fullImage, 'dark': lightText(intData.background)}" class="wrapper" :style="{ backgroundColor: intData.background, backgroundImage: intData.fullImage ? `url(${intData.columns.find(e => e.type == 'image').img})` : '' }">
        <div :class="{ 'container': !editable }">
          <VueDraggable :disabled="!editable" :class="{ 'row': !intData.fullImage }" class="cont no-gutters" v-model="intData.columns" @start="drag = true" @end="onDragEnd">
            <div v-for="col in (!intData.fullImage ? intData.columns : intData.columns.filter(e => e.type != 'image'))" :class="intData.fullImage ? '' : `col-md-6`" class="col-wrapper" :key="`col-${col.type}`">
              <div class="h-100 d-flex flex-column justify-content-center column p-5" v-if="col.type=='content'">
                <template v-if="editable">
                  <TextareaAutosize @input="debounceOnChange" v-model="col.tagline" type="text" class="border-0 h3 bg-transparent p-0" placeholder="Tagline" rows="1" />
                  <TextareaAutosize @input="debounceOnChange" v-model="col.title" type="text" class="display-5 mb-3 font-weight-normal border-0 bg-transparent p-0" placeholder="Title" rows="1" />
                  <TextareaAutosize @input="debounceOnChange" v-model="col.text" class="border-0 textarea bg-transparent p-0" placeholder="Add some text here..." rows="1" />
                </template>
                <template v-else>
                  <div v-if="col.tagline" type="text" class="h3" >{{ col.tagline }}</div>
                  <div v-if="col.title" type="text" class="display-5 mb-3 font-weight-normal" >{{ col.title }}</div>
                  <div v-if="col.text" class="border-0 textarea" v-html="col.text"></div>
                </template>

                <VueDraggable class="row mt-4" v-if="intData.buttons && intData.buttons.length" :class="{ 'small-gutters': editable }" :disabled="!editable" v-model="intData.buttons" @start="drag = true" @end="onDragEnd">
                  <template v-for="(btn, i) in editable ? intData.buttons : intData.buttons.filter(e => e.text)">
                    <div v-if="i / 2 % 1 == 0" class="w-100" :key="`btns-${i}`"></div>
                    <div v-if="btn" class="col mb-2 position-relative mt-5" :key="`btn-${i}`" :class="{ 'active': selectedButton == i }">
                      <div class="btn-cta btn btn-outline-primary w-100 d-flex" v-if="editable">
                        <div class="text-center flex-grow-1">
                          <input v-model="btn.text" @input="debounceOnChange" placeholder="Call to Action" class="w-100 text-center bg-transparent border-0 font-weight-bold" />
                        </div>
                        <div class="d-flex align-items-center mr-n3">
                          <div class="mr-2" @click="editButton(i)">
                            <svg width="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8536 0.146447C12.6583 -0.0488155 12.3417 -0.0488155 12.1465 0.146447L10.5 1.7929L14.2071 5.50001L15.8536 3.85355C16.0488 3.65829 16.0488 3.34171 15.8536 3.14645L12.8536 0.146447Z" fill="currentColor"/><path d="M13.5 6.20711L9.7929 2.50001L3.29291 9H3.5C3.77614 9 4 9.22386 4 9.5V10H4.5C4.77614 10 5 10.2239 5 10.5V11H5.5C5.77614 11 6 11.2239 6 11.5V12H6.5C6.77614 12 7 12.2239 7 12.5V12.7071L13.5 6.20711Z" fill="currentColor"/><path d="M6.03166 13.6755C6.01119 13.6209 6 13.5617 6 13.5V13H5.5C5.22386 13 5 12.7761 5 12.5V12H4.5C4.22386 12 4 11.7761 4 11.5V11H3.5C3.22386 11 3 10.7761 3 10.5V10H2.5C2.43827 10 2.37915 9.98881 2.32455 9.96835L2.14646 10.1464C2.09858 10.1943 2.06092 10.2514 2.03578 10.3143L0.0357762 15.3143C-0.0385071 15.5 0.00502989 15.7121 0.146461 15.8536C0.287892 15.995 0.500001 16.0385 0.68571 15.9642L5.68571 13.9642C5.74858 13.9391 5.80569 13.9014 5.85357 13.8536L6.03166 13.6755Z" fill="currentColor"/></svg>
                          </div>
                          <div @click="deleteButton(i)">
                            <svg width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                          </div>
                        </div>
                      </div>
                      <a :href="btn.link" @input="debounceOnChange" class="btn btn-outline-primary w-100 btn-cta" target="_blank" v-else>
                        {{ btn.text }}
                      </a>
                      <div class="edit-link card p-2 position-absolute" v-if="selectedButton == i" tabindex="0" @focusout="selectedButton = null">
                        <input @input="debounceOnChange" :ref="`linkInput-${i}`" type="text" class="border-0 bg-transparent" placeholder="Link" v-model="btn.link" />
                      </div>
                    </div>
                  </template>
                </VueDraggable>
                <div class="mt-5" v-if="editable">
                  <button type="button" @click.prevent="addButton" href="#" class="btn btn-primary lead">Add Call To Action</button>
                </div>
              </div>
              <div v-if="col.type=='image'" :class="`d-flex align-items-center justify-content-center cursor-pointer h-100 column ${col.type}`" @dragover.prevent @drop.prevent="onImageSelect" @click="onImageClick">
                <div v-if="uploadingImage" class="spinner-border"></div>
                <template v-else>
                  <img class="main-img" v-if="col.img" :src="col.img" alt="" />
                  <div class="d-flex flex-column justify-content-center h-100 align-items-center" v-else>
                    Drop an image here
                    <svg width="50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    Or click to select
                  </div>
                </template>
              </div>
            </div>
            <input class="d-none" type="file" ref="imageUpload" accept="image/*" @change="onImageSelect" />
          </VueDraggable>
        </div>
      </div>
    </section>

    <b-modal size="xl" ref="templatesModal">
      <div slot="modal-header">
        <h5>Select a template</h5>
      </div>
      <div>
        <div class="row small-gutters">
          <div class="col-3 mb-3 cursor-pointer" v-for="(template, i) in templates" :key="`template-${i}`" @click="selectTemplate(template)">
            <img :src="template.preview" class="object-fit-cover" alt="">
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-primary">Done</button>
      </div>
    </b-modal>
  </div>
</template>
<script>
import AdminService from '@/api-services/admin.service';
import VueDraggable from 'vuedraggable';
import debounce from 'debounce';
import Verte from 'verte';
import 'verte/dist/verte.css';

export default {
  name: 'BmooreHero',
  props: {
    id: {
      default: null
    },
    editable: {
      default: false
    },
    hidden: {
      default: true
    },
    master: {
      default: false
    },
    data: {
      default: {}
    }
  },
  components: {
    VueDraggable,
    Verte
  },
  data() {
    return {
      drag: false,
      loading: false,
      intHidden: true,
      uploadingImage: false,
      intData: {
        buttons: []
      },
      colorTimeout: null,
      selectedButton: null,
      templates: [
        {
          buttons: [
            { text: 'Explore Colors', link: '' },
            { text: 'Learn More', link: '' }
          ],
          background: '#8BCBA8',
          preview: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650097735f230_BMOORE_1.webp',
          columns: [
            { type: 'content', tagline: '', title: 'Save 50% Off Paint Color Samples', text: 'Save 50% Off Paint Color Samples' },
            { type: 'image', img: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/6500953cb3229_bmoore_1.png' },
          ],
        },
        {
          buttons: [
            { text: 'Visit Us', link: '' },
            { text: 'Learn More', link: '' }
          ],
          background: '#E0C4B8',
          preview: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/6500977f069a5_BMOORE_2.webp',
          columns: [
            { type: 'content', tagline: '', title: 'Your Local NYC Benjamin Moore Paint Store', text: 'Expect professional, 1:1 service from our experienced team members.' },
            { type: 'image', img: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650095482a660_bmoore_2.png' },
          ],
        },
        {
          fullImage: true,
          background: '#FFFFFF',
          buttons: [
            { text: 'Schedule a Consultation', link: '' },
            { text: 'Learn More', link: '' }
          ],
          preview: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650097896cb89_BMOORE_3.webp',
          columns: [
            { type: 'content', tagline: '', title: 'Transform Your Space', text: `Speak to our Design Consultants, we're here to help bring your ideas to life` },
            { type: 'image', img: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/65009552a62dc_bmoore_3.png' },
          ],
        },
        {
          buttons: [
            { text: 'Visit Us', link: '' },
            { text: 'Learn More', link: '' }
          ],
          background: '#A9C2A7',
          preview: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/65009794c4322_BMOORE_4.webp',
          columns: [
            { type: 'content', tagline: '', title: 'Your Local NYC Benjamin Moore Paint Store', text: 'Expect professional, 1:1 service from our experienced team members.' },
            { type: 'image', img: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/6500955c90308_bmoore_4.png' },
          ],
        },
        //
        {
          buttons: [
            { text: 'Explore Colors', link: '' },
            { text: 'Learn More', link: '' }
          ],
          background: '#1D645C',
          preview: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650097af738ee_BMOORE_5.webp',
          columns: [
            { type: 'content', tagline: '', title: '$5 Off Benjamin Moore Ben Paint', text: 'Premium Paint for Easy and Flawless Results. Offer ends 2/27/2021' },
            { type: 'image', img: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/6500956524994_bmoore_5.png' },
          ],
        },
        {
          buttons: [
            { text: 'Visit Us', link: '' },
            { text: 'Learn More', link: '' }
          ],
          background: '#E8F4DE',
          preview: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650097bab7920_BMOORE_6.webp',
          columns: [
            { type: 'content', tagline: '', title: 'Your Local NYC Benjamin Moore Paint Store', text: 'Expect professional, 1:1 service from our experienced team members.' },
            { type: 'image', img: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650095709289f_bmoore_6.png' },
          ],
        },
        {
          fullImage: true,
          buttons: [
            { text: 'Schedule a Consultation', link: '' },
            { text: 'Learn More', link: '' }
          ],
          background: '#FFFFFF',
          preview: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650097c8aa0f2_BMOORE_7.webp',
          columns: [
            { type: 'content', tagline: '', title: 'Transform Your Space', text: `Speak to our Design Consultants, we're here to help bring your ideas to life` },
            { type: 'image', img: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/65009585beb6d_bmoore_7.png' },
          ],
        },
        {
          buttons: [
            { text: 'Visit Us', link: '' },
            { text: 'Learn More', link: '' }
          ],
          background: '#E2AE92',
          preview: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650097d434027_BMOORE_8.webp',
          columns: [
            { type: 'content', tagline: '', title: 'Your Local NYC Benjamin Moore Paint Store', text: 'Expect professional, 1:1 service from our experienced team members.' },
            { type: 'image', img: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/6500958f25534_bmoore_8.png' },
          ],
        },
        {
          buttons: [
            { text: 'Explore Hardware', link: '' },
            { text: 'Learn More', link: '' }
          ],
          background: '#727F75',
          preview: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650097e01ea05_BMOORE_9.webp',
          columns: [
            { type: 'content', tagline: '', title: 'Hardware Happy Hour Save 10%', text: 'Every Weekday from 4pm to 6pm' },
            { type: 'image', img: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650095973c77c_bmoore_9.png' },
          ],
        },
        {
          buttons: [
            { text: 'Visit Us', link: '' },
            { text: 'Learn More', link: '' }
          ],
          background: '#D9D4DF',
          preview: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650098088fc06_BMOORE_10.webp',
          columns: [
            { type: 'content', tagline: '', title: 'Your Local NYC Benjamin Moore Paint Store', text: 'Expect professional, 1:1 service from our experienced team members.' },
            { type: 'image', img: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650095a30fc1f_bmoore_10.png' },
          ],
        },
        {
          fullImage: true,
          buttons: [
            { text: 'Visit Us', link: '' },
            { text: 'Learn More', link: '' }
          ],
          background: '#FFFFFF',
          preview: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650097fadcbf1_BMOORE_11.webp',
          columns: [
            { type: 'content', tagline: '', title: 'We Have the Supplies for Any Construction Work', text: 'Trusted by professionals and do-it-yourselfers, striking a balance between affordability and quality' },
            { type: 'image', img: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650095ab7b94d_bmoore_11.png' },
          ],
        },
        {
          buttons: [
            { text: 'Explore Products', link: '' },
            { text: 'Learn More', link: '' }
          ],
          background: '#D8CFBE',
          preview: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/6500981388b7b_BMOORE_12.webp',
          columns: [
            { type: 'content', tagline: '', title: 'Your Local NYC Benjamin Moore Paint Store', text: 'Expect professional, 1:1 service from our experienced team members.' },
            { type: 'image', img: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650095b5ccac3_bmoore_12.png' },
          ],
        },
        {
          buttons: [
            { text: 'Explore Hardware', link: '' },
            { text: 'Learn More', link: '' }
          ],
          background: '#355192',
          preview: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/6500982080288_BMOORE_13.webp',
          columns: [
            { type: 'content', tagline: '', title: 'Hardware Happy Hour Save 10%', text: 'Every Weekday from 4pm to 6pm' },
            { type: 'image', img: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650095c11c50b_bmoore_13.png' },
          ],
        },
        {
          buttons: [
            { text: 'Visit Us', link: '' },
            { text: 'Learn More', link: '' }
          ],
          background: '#355192',
          preview: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/6500982c8c86f_BMOORE_14.webp',
          columns: [
            { type: 'content', tagline: '', title: 'Your Local NYC Benjamin Moore Paint Store', text: 'Expect professional, 1:1 service from our experienced team members.' },
            { type: 'image', img: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650095d2103a5_bmoore_14.png' },
          ],
        },
        {
          buttons: [
            { text: 'Visit Us', link: '' },
            { text: 'Learn More', link: '' }
          ],
          background: '#E7C581',
          preview: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650098377bc05_BMOORE_15.webp',
          columns: [
            { type: 'content', tagline: '', title: 'Your Local NYC Benjamin Moore Paint Store', text: 'Expect professional, 1:1 service from our experienced team members.' },
            { type: 'image', img: 'https://storage.googleapis.com/content.ezadtv.com/2023/09/12/650095dcc00e7_bmoore_15.png' },
          ],
        }
      ]
    };
  },
  computed: {
    isBenjaminMoore() {
      return this.$root.$children[0].isBenjaminMoore;
    },
  },
  created() {
    this.intData = {
      buttons: [],
      background: '#6eb8e5',
      columns: [
        { type: 'content', tagline: '', title: '', text: '' },
        { type: 'image', img: '' },
      ],
      ...this.data
    };
    this.intHidden = this.hidden;
  },
  methods: {
    lightText(hex) {
      if(!hex) return;
      return !this.$root.$children[0].lightBackground(hex);
    },
    selectTemplate(template) {
      this.$refs.templatesModal.hide();
      this.intData = template;
    },
    editButton(i) {
      this.selectedButton = i;
      setTimeout(() => this.$refs[`linkInput-${i}`][0].focus(), 0);
    },
    deleteButton(i) {
      this.$delete(this.intData.buttons, i);
    },
    addButton() {
      this.intData.buttons.push({});
    },
    onDragEnd() {
      this.drag = false;
      this.onChange();
    },
    onColorPicker(e) {
      this.colorTimeout && clearTimeout(this.colorTimeout);
      this.intData.background = e;
      this.colorTimeout = setTimeout(() => this.onChange(), 2000);
    },
    onImageClick() {
      if(this.drag) return;
      this.$refs.imageUpload.click();
    },
    async onImageSelect(evt) {
      if(this.drag) return;
      let file = evt.target.files || evt.dataTransfer.files;
      this.uploadingImage = true;
      let res = await AdminService.uploadImage(file[0]);
      this.intData.columns.forEach(e => {
        if(e.hasOwnProperty('img')) {
          e.img = res.data.url;
        }
      });
      this.uploadingImage = false;
      this.onChange();
    },
    remove() {
      this.$emit('remove');
    },
    onChange() {
      this.$emit('onChange', this.intData);
    },
    updateHidden() {
      this.$emit('updateHidden', this.intHidden);
    },
    debounceOnChange: debounce(function () {
      this.onChange();
    }, 1500),
  },
  watch: {
    'intData.buttons'() {
      this.onChange();
    }
  }
};
</script>
<style scoped lang="scss">
  .col.active {
    z-index: 10;
  }
  .textarea {
    font-size: 22px;
    white-space: break-spaces;
  }
  .column {
    min-height: 300px;
  }
  .main-img {
    object-fit: contain;
    width: 100%;
    height: 100%;
    margin: 0 -30px;
  }
  .btn-cta {
    font-size: 20px;
    font-weight: bold;
  }
  .color-box {
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    cursor: pointer;
  }
  .edit-link {
    right: -10px;
    margin-top: 10px;
    &::after {
      bottom: 100%;
      right: 45px;
      border: solid transparent;
      content: "";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-color: rgba(255, 255, 255, 0);
      border-bottom-color: #ffffff;
      border-width: 8px;
      margin-left: -8px;
    }
  }
  .editable {
    .col-wrapper:first-child .column {
      border-right: 0;
    }
    .column {
      border: 2px dashed rgba(0,0,0,.15);
    }
  }
  @media (min-width: 992px) {
    .widget:not(.editable) {
      .col-wrapper:first-child .column {
        margin-right: 30px !important;
      }
      .col-wrapper:nth-child(2) .column {
        margin-left: 30px !important;
      }
      .wrapper:not(.full) .column.image {
        margin: 0 -30px !important;
      }
    }
  }
  .wrapper {
    background-size: cover;
    &.full {
      .column {
        max-width: 700px;
        padding: 0 60px !important;
        min-height: 650px;
      }
    }
    &.dark {
      color: #fff !important;
      textarea,button,input {
        color: #fff !important;
      }
      .btn-cta {
        border-color: #fff !important;
        color: #fff !important;
      }
      *::placeholder {
        color: #9e9e9e;
      }
    }
    .btn-cta:hover {
      background: inherit !important;
      color: inherit !important;
    }
  }
</style>