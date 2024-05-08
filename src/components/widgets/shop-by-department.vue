<template>
  <div class="position-relative swiper widget" :class="{'editable': editable}">
    <WidgetHeader name="Shop By Department" :id="id" @remove="remove" @updateHidden="updateHidden" :hidden="hidden" :master="master" @updateAssociatedLocations="updateAssociatedLocations" :associatedLocations="associatedLocations" v-if="editable" />
    <h2 class="widget-title mb-0 text-center swiper-container-customer" v-else-if="title" v-html="title"></h2>
    <div v-if="editable" class="row mt-2 mb-2">
      <div class="col-md-4">
        <h6 class="text-muted font-weight-bold text-uppercase" style="font-size: 13px;"><span style="color: #000;">1.</span> SET A <span class="span-primary">TITLE</span> FOR THIS WIDGET.</h6>
      </div>
      <div class="col-md-8">
        <h6 class="text-muted font-weight-bold text-uppercase" style="font-size: 13px;"><span style="color: #000;">2.</span> CREATE A NEW TILE BY SEARCHING FOR A <span class="span-primary">DEPARTMENT</span> OR BY ENTERING A <span class="span-secondary">CUSTOM URL</span>.</h6>
      </div>
    </div>
    <div class="row mt-2" v-if="editable">
      <div class="col-md-4">
        <input class="form-control mr-2" placeholder="Enter a title" v-model="intTitle" />
        <p style="font-size: 13px; text-align: left; color: #6c757d; margin-top: 7px;"><i class="fa fa-info-circle done-check-info-icon"></i> This title will be shown as a header above the tiles.</p>
      </div>
      <div class="col-md-8">
        <div class="d-flex align-items-center justify-content-center justify-content-sm-start text-center text-sm-left">
          <search-suggestions
            class="search-wrapper mr-4"
            style="width: 400px;"
            departmentsLabel="Departments, Classes and Finelines"
            hideProducts="true"
            hideBrands="true"
            hideFooter="true"
            departmentsLimit="300"
            ref="search"
            placeholder="Search and Select a Department"
            v-model="selectedDepartment"
            @onSelected="selectDepartment"
          />
          <button v-if="selectedDepartment" style="width: 250px; min-width: 217.083px;" class="btn btn-outline-primary d-flex align-items-center" @click.prevent="addDepartmentToDepartmentList()"><b>CREATE DEPARTMENT TILE</b></button>
          <button v-else style="width: 250px; min-width: 217.083px; cursor: not-allowed;" disabled class="btn btn-outline-primary d-flex align-items-center"><b>CREATE DEPARTMENT TILE</b></button>
        </div>
        <div class="d-flex align-items-center justify-content-center justify-content-sm-start text-center text-sm-left mt-2">
          <input class="form-control mr-4" style="width: 400px;" placeholder="Enter a Custom URL" v-model="customUrl" />
          <button v-if="customUrl" style="width: 250px; min-width: 217.083px;" class="btn btn-outline-primary d-flex align-items-center" @click.prevent="addCustomUrlToDepartmentList()"><b>CREATE CUSTOM URL TILE</b></button>
          <button v-else style="width: 250px; min-width: 217.083px; cursor: not-allowed;" disabled class="btn btn-outline-primary d-flex align-items-center"><b>CREATE CUSTOM URL TILE</b></button>
        </div>
      </div>
    </div>
    <div v-if="!loading && editable && (!filteredDepartments || (filteredDepartments && !filteredDepartments.length))" class="no-products">
      Please, add some departments to activate the swiper
    </div>
    <div v-if="loading" class="loading-wrapper">
      <div class="spinner-border"></div>
    </div>
    <div class="position-relative swiper-container">
      <div v-if="editable" class="row mt-4" style="margin-left: 1px;">
        <h6 class="text-muted font-weight-bold text-uppercase" style="font-size: 13px;"><span style="color: #000;">3.</span> CLICK ON THE SETTINGS BUTTON TO <span class="span-secondary">EDIT</span> YOUR TILES. YOU CAN <span class="span-secondary">DELETE</span> THEM OR <span class="span-secondary">DRAG</span> THEM OVER TO CHANGE THE TILE ORDER.</h6>
      </div>
      <draggable :ref="`pDraggable-${id}`" class="row d-flex justify-content-center" :class="!editable ? 'swiper-container-customer' : 'swiper-container-admin'" :list="swiperDepartments" :group="`departmentSwiperGroup-${id}`" :disabled="!editable" @change="onReorder">
        <div :class="editable ? 'swiper-slide-admin' : 'swiper-slide-container'" v-for="(item, index) in swiperDepartments" :key="`departmentswiper-${item.name}${index}`" :style="editable ? 'cursor: grab;' : ''">
          <DepartmentItemForWidget @updateIcon="updateIcon" @updateTileTitle="updateTileTitle" :target="target" :class="{'draggable-item' : editable}" @remove="removeItem" :editable="editable" :item="item" :add-start-stop-scroller="true" :swiper="true"/>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import DepartmentItemForWidget from '@/components/departments/department-item-for-departments-widget.vue';
import draggable from 'vuedraggable';
import searchSuggestions from '@/components/search-suggestions';
import { debounce } from 'debounce';
import { compute } from "@/plugins/rgbToFilter";

export default {
  name: 'DepartmentSwiper',
  props: {
    id: {
      default: null
    },
    departments: {
      default: null
    },
    editable: {
      default: false
    },
    title: {
      default: ''
    },
    itemsToShow: {
      default: null
    },
    loop: {
      default: true
    },
    autoPlay: {
      default: null
    },
    master: {
      default: false
    },
    hidden: {
      default: true
    },
    target: {
      default: '_self'
    },
    associatedLocations: {
      default: null
    }
  },
  components: {
    draggable,
    searchSuggestions,
    DepartmentItemForWidget
  },
  data() {
    return {
      testList: [],
      intTitle: '',
      intLoop: true,
      visible: true,
      loading: false,
      windowWidth: window.innerWidth,
      currentPage: 1,
      oneByOne: this.loop,
      loopInterval: null,
      departmentImages: [],
      customUrl: '',
      selectedDepartment: '',
    };
  },
  created() {
    this.intTitle = this.title ? this.title : 'SHOP BY DEPARTMENT';
    this.intLoop = this.loop;
    window.addEventListener('resize', () => this.windowWidth = window.innerWidth);
  },
  computed: {
    lastPage() {
      return Math.ceil(this.departments.length / this.visibleItems);
    },
    visibleItems() {
      return 30;
    },
    departmentList() {
      if(this.$store.state.departmentResults && this.$store.state.departmentResults.parent_departments) {
        let ret = this.$store.state.departmentResults.parent_departments;
        return ret.map(e => {
          const { name: text, dept_id: value, image_url: img_url } = {...e};
          return Object.assign({}, { text, value, img_url });
        });
      }
      return [];
    },
    filteredDepartments: {
      get() {
        let ret = [];
        ret = [...this.departments];
        return ret;
      },
      set(val) {
        return val;
      }
    },
    options() {
      return this.$store.state.homepage.find(x => x.widget_type === this.type);
    },
    swiperDepartments() {
      let ret = [];
      let start, end = 0;
      if(!this.oneByOne) {
        start = (this.currentPage - 1) * this.visibleItems;
        end = this.currentPage * this.visibleItems;
      } else {
        start = this.currentPage - 1;
        end = this.visibleItems + this.currentPage - 1;
      }
      ret = [...this.filteredDepartments].slice(start, end);
      return ret;
    }
  },
  methods: {
    onReorder() {
      this.$emit('onReorder', this.swiperDepartments);
    },
    selectDepartment(selected) {
      this.selectedDepartment = selected;
    },
    removeItem(item) {
      this.$emit('removeItem', item);
    },
    remove() {
      this.$emit('remove');
    },
    updateHidden(val) {
      this.$emit('updateHidden', val);
    },
    updateAssociatedLocations(val) {
      this.$emit('updateAssociatedLocations', val);
    },
    updateTileTitle(value) {
      this.$emit('updateTileTitle', value);
    },
    updateIcon(value) {
      this.$emit('updateIcon', value);
    },
    isUrl(val) {
      return this.$options.filters.isUrl(val);
    },
    checkExistingTileTitle(attemptedTitle) {
      for(let i = 0; i < this.swiperDepartments.length; i++){
        if (this.swiperDepartments[i].name.toLowerCase() === attemptedTitle.toLowerCase() ||
          (this.swiperDepartments[i].custom_tile_name && this.swiperDepartments[i].custom_tile_name.toLowerCase() === attemptedTitle.toLowerCase())
        ) {
          return true;
        };
      }
      return false;
    },
    addDepartmentToDepartmentList() {
      if(this.selectedDepartment !== '') {
        this.$emit('onSelected', this.selectedDepartment);
        this.selectedDepartment = '';
      } else {
        this.$swal({
          title: 'Please Enter a Valid Department',
          type: 'warning',
        });
      }
    },
    addCustomUrlToDepartmentList() {
      if(this.customUrl === '' || this.customUrl.trim() === '' || !this.isUrl(this.customUrl)) {
        this.$swal({
          title: 'Please Enter a Valid Custom URL',
          type: 'warning',
        });
        return;
      }

      this.$swal({
        title: `Custom URL Tile`,
        html: `<p style="font-size: 18px; margin-bottom: 0px;">Please, add a title for your tile:</p>
              <b>
              <input type="text" id="swal-input1" class="swal2-input" placeholder="Tile title" required>
              </b>
              <div style="margin-bottom: 15px;">
              <button type="button" id="new-tile-title" class="btn btn-sm btn-primary save-btn text-nowrap ml-2 mr-3 ml-md-0" style="width: 80px;">OK</button>
              <button type="button" id="cancel" class="btn btn-sm save-btn text-nowrap ml-2 ml-md-0" style="background-color: rgb(147, 147, 147); color: white; width: 80px; font-style: bold;">Cancel</button>
              </div>
              `,
        footer: `<div style="display: block;">
                <p style="font-size: 14px; text-align: left;"><i class="fa fa-info-circle done-check-info-icon"></i> This title will be visible below the tile.</p>
                </div>`,
        showCancelButton: false,
        showConfirmButton: false,
        customClass: {
          validationMessage: 'validation-message'
        },
        onBeforeOpen: () => {
          const newTileTitle = document.getElementById('new-tile-title');
          const cancel = document.getElementById('cancel');

          newTileTitle.addEventListener('click', () => {
            let title = document.querySelector('.swal2-input').value;

            if(!title) {
              this.$swal.showValidationMessage('Please add a title for your tile.');
              setTimeout(() => {
                this.$swal.resetValidationMessage();
              }, 4000);
              return;
            };

            if(this.checkExistingTileTitle(title) === true){
              this.$swal.showValidationMessage('This title is already in use. Please choose a different title.');
              setTimeout(() => {
                this.$swal.resetValidationMessage();
              }, 4000);
              return;
            };

            const departmentListObject = {
              type: "default-section",
              name: "departments",
              liClass: undefined,
              label: "Departments, Classes and Finelines",
              item: {
                dept_id: 0,
                image_url: null,
                name: this.customUrl,
                custom_tile_name: title,
                svg_custom_color: compute(this.$store.state.settings.colors.primary).result
              }
            };
            
            this.$emit('onSelected', departmentListObject);
            this.customUrl = '';
          }
        );

        cancel.addEventListener('click', () => {
          this.$swal.close();
        });
      }});
    }
  },
  watch: {
    intTitle: debounce(function(value) {
      this.$emit('updateTitle', value);
    }, 1500),
    visibleItems(val) {
      if(val >= this.filteredDepartments.length) {
        this.currentPage = 1;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
  .widget-title {
    font-family: 'Open Sans', 'Work Sans', montserrat, Arial, Helvetica, sans-serif;
    font-size: 45px;
    font-weight: 900;
  }

  @media (max-width: 793px) {
    .widget-title {
      font-size: 48px;
    }
  }

  @media (max-width: 385px) {
    .widget-title {
      font-size: 32px;
    }
  }

  @media (max-width: 280px) {
    .widget-title {
      font-size: 24px;
    }
  }

  .swiper.widget {
    min-height: 140px;
    margin-bottom: 30px;
    padding-bottom: 30px;
  }
  .swiper-container {
    overflow: visible;
  }

  .swiper-slide {
    animation: fadein .3s linear 1 normal forwards;
    opacity: 0;
    &:nth-child(2) {
      animation-delay: .05s;
    }
    &:nth-child(3) {
      animation-delay: .1s;
    }
    &:nth-child(4) {
      animation-delay: .15s;
    }
    &:nth-child(5) {
      animation-delay: .2s;
    }
    &:nth-child(6) {
      animation-delay: .25s;
    }
  }
  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .products-slider .swiper-wrapper {
    padding-bottom: 20px;
  }
  :deep(.draggable-item a.card) {
    cursor: move;
  }
  :deep(.search-wrapper) {
    input {
      width: 100%;
      font-size: 14px;
    }
    .autosuggest__results {
      right: 0;
      .autosuggest__results_item {
        font-size: 14px;
      }
    }
    .search-suggestion-footer {
      display: none;
    }
  }
  .widget-title {
    font-weight: bold;
  }
  .swiper-slide-admin {
    width: 135px !important;
    height: 240px;
  }
  .swiper-slide-container {
    height: 205px;
  }
  .swiper-button-disabled {
    opacity: 0;
  }

  .no-products {
    border: 1px dashed #ef8c8c;
    background: #fff6f6;
    top: 20px;
    height: 250px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .loading-wrapper {
    top: 20px;
    height: 250px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .span-primary {
    color: var(--primary);
  }
  .span-secondary {
    color: var(--secondary);
  }
  .button-primary {
    background-color: var(--primary);
  }

  .swiper-container-admin {
    padding-left: 35px;
    padding-right: 35px;
  }

  @media (max-width: 1479px) {
    .swiper-container-admin {
      padding-left: 0px;
      padding-right: 0px;
    }
  }

  @media (max-width: 575px) {
    .swiper-container {
      padding: 0 12px;
    }
    .widget-title {
      text-align: center;
    }
    .products-slider {
      margin: 0 -15px !important;
    }
    .swiper-slide {
      height: 140px;
      margin-bottom: 120px;
      :deep(.card) {
        margin: 0 auto !important;
        border-radius: 0;
        .button-prev,
        .button-next {
          display: none;
        }
        :deep(.product) {
          border-right: 1px solid #f3f3f3;
          .badge.badge-danger {
            padding: 0;
            height: auto;
            background: none;
            color: #dc3545;
            letter-spacing: -.4px;
          }
          .small-text {
            font-size: 12px;
            text-transform: uppercase;
          }
          .add-to-cart {
            .q {
              min-width: 24px;
              height: 24px;
              svg {
                transform: scale(.9);
              }
            }
          }
          img.product-image {
            margin-bottom: 0;
            max-height: 110px;
          }
          h6 {
            font-size: 12px;
            margin-bottom: 36px;
          }
        }
      }
    }
  }
</style>

