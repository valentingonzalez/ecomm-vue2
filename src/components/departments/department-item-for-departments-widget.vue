<template>
  <div class="departments-wrapper h-100">
    <router-link class="text-decoration-none" v-if="!editable && !item.name.startsWith('https://') && !item.name.startsWith('http://')"
    :to="{name: 'department-products-slug', params: {slug: this.$ezSlugify(item.name) + '-' + item.dept_id}, query: {name: item.name, in_stock_only: inStockOnlyParam} }">
      <div class="card-body">
        <div class="departments">
          <div v-if="!loaded" class="d-flex loader-wrapper align-items-center justify-content-center">
            <img src="/icons/loader.gif" class="loader">
          </div>
          <img
            ref="departmentImageCustomer"
            width="64"
            height="64"
            :src="item.image_url"
            :alt="item.name | lowerCase"
            @load="loaded = true"
            :class="{ 'd-none': !loaded, 'no-invert' : (!colorFilter || (typeof colorFilter == 'object' && colorFilter.filter.trim() == '')) }"
            class="department-image img-fluid mt-1 text-capitalize"
            :style="colorFilter"
          >
        </div>
        <h6 class="text-capitalize mt-2 text-center" style="width:120px; font-size: 0.90rem; color: #000;">{{ item.custom_tile_name ? item.custom_tile_name : item.name }}</h6>
      </div>
    </router-link>
    <a class="text-decoration-none" v-if="!editable && (item.name.startsWith('https://') || item.name.startsWith('http://'))" :href="item.name">
      <div class="card-body">
        <div class="departments">
          <div v-if="!loaded" class="d-flex loader-wrapper align-items-center justify-content-center">
            <img src="/icons/loader.gif" class="loader">
          </div>
          <img
            ref="departmentImageCustomer2"
            width="64"
            height="64"
            :src="item.image_url"
            :alt="item.name | lowerCase"
            @load="loaded = true"
            :class="{ 'd-none': !loaded, 'no-invert' : (!colorFilter || (typeof colorFilter == 'object' && colorFilter.filter.trim() == '')) }"
            class="department-image img-fluid mt-1 text-capitalize"
            :style="colorFilter"
          >
        </div>
        <h6 class="text-capitalize mt-2 text-center" style="width:120px; font-size: 0.90rem; color: #000;">{{ item.custom_tile_name ? item.custom_tile_name : item.name }}</h6>
      </div>
    </a>
    <div class="card-body" v-if="editable">
      <div class="d-flex justify-content-around mb-3" style="width: 127px;">
        <b-button id="show-btn" style="margin-top: 2px;" class="btn-xs d-flex justify-content-around" @click="showModal(item)"><i class="fa fa-cog" aria-hidden="true"></i></b-button>
        <div class="edit-buttons">
          <a href="#" class="remove-bt" @click.stop.prevent="remove(item)">
            <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-8 -7)" fill-rule="nonzero" fill="none"><circle fill="#E2E2E3" cx="15" cy="15" r="15"/><path d="M21 13v8c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2v-8h12zm-3-6c.6 0 1 .4 1 1v2h3v2H8v-2h3V8c0-.6.4-1 1-1zm-1 2h-4v1h4V9z" fill="#90939A"/></g></svg>
          </a>
        </div>
      </div>
      <div class="departments">
        <div v-if="!loaded" class="d-flex loader-wrapper align-items-center justify-content-center">
          <img src="/icons/loader.gif" class="loader">
        </div>
        <img
          ref="departmentImageAdmin"
          width="64"
          height="64"
          :src="item.image_url"
          :alt="item.name ? item.name : 'Your image goes here'"
          @load="loaded = true"
          :class="{ 'd-none': !loaded, 'no-invert' : (!colorFilter || (typeof colorFilter == 'object' && colorFilter.filter.trim() == '')) }"
          class="department-image img-fluid mt-1"
          :style="colorFilter"
        >
      </div>
      <h6 class="text-capitalize mt-2 text-center" style="width:115px; font-size: 0.90rem; color: #000;">{{ item.custom_tile_name ? item.custom_tile_name : item.name }}</h6>
      <b-modal ref="my-modal" size="xl" hide-footer :title="`Edit ${item.custom_tile_name ? item.custom_tile_name : item.name} Tile`">
        <b-tabs v-model="tabIndex" content-class="mt-3" justified>
          <b-tab active>
            <template #title>
              <h6 class="text-muted font-weight-bold text-uppercase mt-1" style="font-size: 14px;">Choose an icon</h6>
            </template>
            <div class="row mb-1" style="margin-left: 1px;">
              <div class="col-md-10 d-flex flex-wrap icons-container mb-3 pl-4" style="overflow: overlay; height: 300px; max-height: 300px; border: 1px solid rgb(170, 170, 170); box-sizing: border-box; box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05); border-radius: 10px;">
                <div v-for="(d, index) in defaultIcons" :key="index" class="default-icon-container">
                  <div class="default-icon-wrapper">
                    <img :style="defaultIconFilter" :src="d.iconUrl" :alt="d.iconName" :title="d.iconName" @click.prevent="prepareIconForUpdate($event, item.name)">
                  </div>
                  <span class="default-icon-text">{{ d.iconName }}</span>
                </div>
              </div>
              <div class="col-md-2 text-center pr-2 mt-4" v-if="modalSelectedIconPlaceholder">
                <p class="mb-4" style="margin-bottom: 10px; font-weight: bold;">Selected Icon:</p>
                <img :style="defaultIconFilter" :src="modalSelectedIconPlaceholder" style="max-width: 64px; min-width: 64px;">
                <hr class="mt-4 mb-2">
                <!-- <p class="mt-4 mb-4" style="margin-bottom: 10px; font-weight: bold;">Pick a Color:</p> -->
                <!-- <color-picker :color="modalCustomColorPlaceholder" @update-color="handleColorChange" /> -->
              </div>
            </div>
          </b-tab>
          <b-tab>
            <template #title>
              <h6 class="text-muted font-weight-bold text-uppercase mt-1" style="font-size: 14px;">Upload an image</h6>
            </template>
            <b-row class="hoverable" @dblclick="$refs.fileUploader.click()" v-b-hover="handleImageBoxHovered" :class="imageBoxIsHovered ? 'bg-light' : ''" align-h="center" align-v="center" style="height: 41vh; border: 1px solid lightgray; margin-top: 20px; margin-bottom: 20px; margin-left: 1px; margin-right: 5px; box-shadow: 8px 8px 5px -5px rgba(0,0,0,0.75);"  @dragover.prevent @drop.prevent="uploadImage($event, item.name)">
              <b-col class="text-center mt-2" v-if="!uploadingImage">
                <h6>Double Click This Box to Upload an Image or Drag and Drop it Here</h6>
                <h6 style="color: red;">Before uploading an image, please note the following: </h6>
                <h6>Make sure to use SVG or PNG files to get one colour icons like the default ones!</h6>
                <h6>Make sure your icon takes full width and height and is centered within the image.</h6>
                <h6>Recommended Size: Any 1:1 Aspect Radio. Image will be shrinked to 64x64. </h6>
                <h6>Images smaller than 64px width or height are not allowed. </h6>
                <input type="file" ref="fileUploader" class="d-none" @change="uploadImage"/>
              </b-col>
              <b-col v-else class="text-center">
                <b-spinner variant="info" style="width: 3rem; height: 3rem;"></b-spinner>
                <h3>Uploading...</h3>
              </b-col>
            </b-row>
          </b-tab>
        </b-tabs>
        <div class="row d-flex">
          <h5 class="mb-1 mt-1 ml-4">Set a custom name for the tile (optional):</h5>
          <div class="col-md-5">
            <b-form-input class="mb-2" size="sm" v-model="customTileTitle" placeholder="Enter a custom name (changes will be reflected on refresh)"></b-form-input>
          </div>
        </div>
        <hr class="mt-2 mb-3">
        <div class="d-flex justify-content-end">
          <b-button v-if="tabIndex === 0" class="ml-3" variant="primary" @click.prevent="updateIcon()">Apply Changes</b-button>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import AdminApiService from '@/api-services/admin.service';
import WidgetsApiService from '@/api-services/widgets.service';
import { compute } from "@/plugins/rgbToFilter";
// import ColorPicker from '@/components/color-picker.vue';

export default {
  name: 'DepartmentItemForWidget',
  props: {
    item: {
      type: Object,
      default: null
    },
    swiper: {
      default: false
    },
    editable: {
      default: false
    }
  },
  components: {
    // 'color-picker': ColorPicker
  },
  data() {
    return {
      loaded: false,
      selectedIcon: '',
      filteredColor: '',
      uploadingImage: false,
      colorFilter: '',
      customTileTitle: '',
      selectedCustomSvgFilter: '',
      modalSelectedIconPlaceholder: '',
      modalCustomColorPlaceholder: this.$store.state.settings.colors.primary,
      selectedIconEvent: '',
      selectedIconName: '',
      tabIndex: 0,
      imageBoxIsHovered: false,
      defaultIcons: [],
    };
  },
  created() {
    this.intSelectedIcon = this.selectedIcon;
  },
  async mounted() {
    if(this.swiper) {
      this.loaded = true;
    }
    this.getColorFilter(this.$store.state.settings.colors.primary);
    if(this.editable) {
      this.setColorFilterAdminSide();
    }
    if(!this.editable) {
      this.setColorFilterCustomerSide();
    }
  },
  computed: {
    defaultIconFilter() {
      return {
        'filter': this.filteredColor.filterRaw
      };
    },
    inStockOnlyParam() {
      return this.$store.state.settings.products.filterShowOutOfStock ? 0 : 1;    
    },
  },
  methods: {
    async getDefaultIcons() {
      const res = await WidgetsApiService.getDefaultIconsForDepartmentsWidget();
      const iconPromises = res.data.icons.map(async e => {
        const iconUrl = e.icon_url;
        const iconName = e.icon_name;
        return { iconUrl, iconName };
      });
      this.defaultIcons = await Promise.all(iconPromises);
    },
    handleImageBoxHovered(hovered) {
      this.imageBoxIsHovered = hovered;
    },
    handleColorChange(color) {
      this.modalCustomColorPlaceholder = color;
    },
    getColorFilter(color) {
      do {
        this.filteredColor = compute(color).result;
      } while (this.filteredColor.loss > 2);
    },
    setColorFilterAdminSide(color = null) {
      if(color) {
        return this.colorFilter = color;
      }
      if(this.$refs.departmentImageAdmin.attributes.src != undefined && this.$refs.departmentImageAdmin.attributes.src.value.endsWith('svg')) {
        return this.colorFilter = {'filter': this.filteredColor.filterRaw};
      }
      return this.colorFilter = {'filter': ''};
    },
    setColorFilterCustomerSide(color = null) {
      if(color) {
        return this.colorFilter = color;
      }
      if(this.$refs.departmentImageCustomer && this.$refs.departmentImageCustomer.attributes.src != undefined && this.$refs.departmentImageCustomer.attributes.src.value.endsWith('svg')) {
        return this.colorFilter = {'filter': this.filteredColor.filterRaw};
      }
      if(this.$refs.departmentImageCustomer2 && this.$refs.departmentImageCustomer2.attributes && this.$refs.departmentImageCustomer2.attributes.src != undefined && this.$refs.departmentImageCustomer2.attributes.src.value.endsWith('svg')) {
        return this.colorFilter = {'filter': this.filteredColor.filterRaw};
      }
      return this.colorFilter = {'filter': ''};
    },
    urlFriendly(value) {
      return value.replace(/[ /]/g, '+');
    },
    async showModal(item) {
      await this.getDefaultIcons();
      if(item.hex_color) {
        this.modalCustomColorPlaceholder = item.hex_color;
      }
      this.modalSelectedIconPlaceholder = this.selectedIconEvent.target ? this.selectedIconEvent.target.src : item.image_url;
      this.selectedIconName = item.name;
      this.$refs['my-modal'].show();
    },
    hideModal() {
      this.$refs['my-modal'].hide();
      this.selectedCustomSvgFilter = '';
      this.selectedIconEvent = '';
      this.selectedIconName = '';
      this.modalSelectedIconPlaceholder = '';
    },
    prepareIconForUpdate($event, name) {
      this.selectedIconEvent = $event;
      this.selectedIconName = name;
      this.modalSelectedIconPlaceholder = this.selectedIconEvent.target.src;
    },
    updateTileTitle(name){
      const emitData = {
        customTileName: this.customTileTitle,
        departmentName: name
      };
      this.$emit('updateTileTitle', emitData);
    },
    updateIcon(imgUrl = null){
      if(this.selectedIconEvent === '' && imgUrl === null && this.modalSelectedIconPlaceholder === '') {
        this.$swal({
          title: 'Please select either an icon or an image of your own',
          type: 'warning',
        });
        return;
      }
      if(imgUrl != null) {
        this.modalSelectedIconPlaceholder = '';
      }
      const emitData = {
        selectedIcon: this.modalSelectedIconPlaceholder.length ? this.modalSelectedIconPlaceholder : imgUrl,
        departmentName: this.selectedIconName
      };
      this.selectedIcon = emitData.selectedIcon;

      // this.selectedCustomSvgFilter = compute(this.modalCustomColorPlaceholder).result;
      this.selectedCustomSvgFilter = '';
      // if(this.selectedCustomSvgFilter != '') {
      //   emitData.hexColor = this.modalCustomColorPlaceholder;
      //   emitData.colorFilter = this.selectedCustomSvgFilter.filter;
      //   this.setColorFilterAdminSide(this.selectedCustomSvgFilter.filter);
      //   this.setColorFilterCustomerSide(this.selectedCustomSvgFilter.filter);
      // }

      this.$emit('updateIcon', emitData);
      if(this.customTileTitle !== '') {
        this.updateTileTitle(emitData.departmentName);
      }
      this.colorFilter = {'filter': this.filteredColor.filterRaw};

      this.hideModal();
    },
    uploadImage(evt) {
      const file = this.checkFile(evt);
      if(file == 'not allowed') {
        this.$swal('Only PNG and SVG file formats are supported.', '', 'error');
        return;
      }
      this.uploadingImage = true;

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width < 64 || img.height < 64) {
          this.$swal('The image dimensions should be at least 64x64 pixels.', '', 'error');
          this.uploadingImage = false;
          return;
        }

        if (img.width !== img.height) {
          this.$swal('Your image may not look centered as it was not in a 1:1 aspect ratio. We recommend using 1:1 aspect ratio images.');
        }

        const MAX_SIZE = 64;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scale = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height);
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        canvas.toBlob((blob) => {
          const modifiedFile = new File([blob], file.name, { type: file.type });

          AdminApiService.uploadImage(modifiedFile).then(response => {
              this.updateIcon(response.data.url);
              this.colorFilter = { filter: '' };
              this.uploadingImage = false;
            }).catch(() => {
              this.$swal('Something went wrong while uploading your image.', '', 'error');
            });
        }, file.type);
      };
    },
    checkFile(evt) {
      const file = evt.dataTransfer ? evt.dataTransfer.files[0] : evt.target.files[0];
      const allowedFormats = ['image/png', 'image/svg+xml'];
      if (!allowedFormats.includes(file.type)) {
        return 'not allowed';
      }
      if(file.name.includes(' ')) {
        var newName = file.name.replace(/ /g, "_");
        var newFile = new File([file], newName, {type: file.type});
        return newFile;
      } else {
        return file;
      }
    },
    remove(item) {
      this.$emit('remove', item);
    },
  },
};
</script>

<style lang="scss" scoped>
  .edit-buttons {
    background: gainsboro;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    transform: scale(0.85);
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
  }
  .department-item {
    position: relative;
    width: auto;
    height: 100%;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    cursor: pointer;

    &:hover{
      text-decoration: none;
    }
  }

  .departments {
    display: flex;
    width: 120px;
    height: 120px;
    text-align: center;
    padding: 20px 10px;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 15px;
    background-color: white;
    box-shadow: 0 14px 10px 0 rgba(34,44,73,.04);

    .loader-wrapper {
      height: 150px;
    }

    img.department-image {
      display: block;
      max-height: 130px;
      // min-height: 130px;
      margin: 0 auto;
      margin-bottom: 30px;
    }

    h6 {
      color: var(--text);
      font-weight: 600;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 0;
    }
    transition: 0.25s ease-in-out;
    &:hover{
      background: var(--primary);
      .department-image:not(.no-invert){
        filter: invert(1) !important;
      }
    }
  }
  .card {
    border: none;
    box-shadow: 0 14px 10px 0 rgba(34,44,73, .04);
    border-radius: 13px;
    border: 1px solid #E8E8E8;

    .card-body {
      .product {
        .edit-product {
          position: relative;
          top: -10px;
          left: 0;
          margin-left: 5px !important;

          a {
            margin: 0 3px;

            img {
              width: 25px;
              height: 25px;
            }
          }
        }
      }
    }
  }

  .icons-container {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .icons-container > * {
    padding: 15px;
    cursor: pointer;
  }

  .default-icon-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .default-icon-wrapper {
    width: 64;
    height: 64;
    overflow: hidden;
  }

  .default-icon-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .default-icon-text {
    text-align: center;
    margin-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 10ch;
    max-width: 10ch;
  }

  .color-box {
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    cursor: pointer;
    box-shadow: 2px 2px 8px 0px rgba(0,0,0,0.62);
  }

  .upload-image.box:hover {
    background-color: gray;
  }

  @media screen and (max-width: 576px) {
    .departments {
      img.department-image {
        margin-bottom: 0;
      }
      h6 {
        margin-top: 12px;
        margin-bottom: 0;
      }
    }
  }

  @media (max-width: 315px) {
    h6 {
      padding-right: 7px;
    }
    .card-body {
      padding: 0.5rem;
    }
    .departments {
      width: 90%;
      height: 90%;
      img.department-image {
        width: 60%;
      }
    }
  }
</style>
