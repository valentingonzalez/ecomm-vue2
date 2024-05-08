<template>
  <div class="position-relative row" :class="{'editable swiper widget': editable}">
    <div v-if="editable && windowWidth > 768" class="col-md-1" style="max-width: 4.3%;">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"><circle cx="16" cy="16" r="16" fill="#e8e8e8"/><circle cx="16" cy="16" r="12" :fill="businessPrimaryColor"/><path fill="#fff" d="M17.569 11.273V20h-1.845v-6.976h-.052l-1.998 1.253v-1.636l2.16-1.368h1.735Z"/></svg>
      <div class="vertical-line" :style="{ height: verticalLineHeightSection1 }"></div>
    </div>
    <div :class="editable && windowWidth > 768 ? 'col-md-11 mt-1' : 'col-md-12'" ref="section1Content">
      <div class="title d-flex mb-3" v-if="editable">
        <h5>Select the <b>Products</b> you'd like to suggest</h5>
      </div>
      <div v-if="editable" class="row mt-2">
        <div class="col-md-6">
          <h6 class="font-weight-bold" style="font-size: 13px;">Section Title</h6>
          <input v-if="editable" class="form-control mr-3" :class="windowWidth < 768 ? 'mb-2' : ''" placeholder="Title for the Suggester" v-model="intTitle" style="height: 36px;"/>
        </div>
        <div class="col-md-6">
          <h6 class="font-weight-bold" style="font-size: 13px;">Add Products to Suggest</h6>
          <search-suggestions
            :disabled="isLoading"
            hideDepartments="true"
            hideBrands="true"
            hideFooter="true"
            ref="searchforsuggester"
            debounceOnGetSuggestions="500"
            placeholder=" "
            @onSelected="onAdd" 
            class="search-wrapper"
            v-if="editable"
          />
        </div>
      </div>
      <div v-if="!editable" class="row" style="padding-right: 14px;">
        <div class="col-md-8">
          <div class="row">
            <h4 class="pt-1" style="margin-left: 14px; margin-bottom: 0px;" v-html="title" />
            <div class="edit-buttons ml-3" style="margin-top: 3px;">
              <a href="#" class="remove-bt pb-1" :class="{disabled: isDeleting}" @click.prevent="deleteSuggester" tabindex="-1" v-if="swiperEditable">
                <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-8 -7)" fill-rule="nonzero" fill="none"><circle fill="#E2E2E3" cx="15" cy="15" r="15"/><path d="M21 13v8c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2v-8h12zm-3-6c.6 0 1 .4 1 1v2h3v2H8v-2h3V8c0-.6.4-1 1-1zm-1 2h-4v1h4V9z" fill="#90939A"/></g></svg>
              </a>
            </div>
          </div>
          <div v-if="swiperEditable && filteredProducts.length" :class="`${suggesterIsHidden ? 'text-danger' : 'text-success'}`">This suggester is {{ suggesterVisibleOrHiddenText }}</div>
        </div>
        <div class="col-md-4 d-flex justify-content-end">
          <button style="margin-top: 4px; margin-right: 20px;" class="btn btn-outline-primary d-flex align-items-center" @click.prevent="goToEditSuggester" >Edit Suggester</button>
          <div class="custom-control custom-switch ml-4" style="margin-right: 20px;">
            <input type="checkbox" v-model="suggesterIsHidden" class="custom-control-input" :id="`hidden${id}`" @change="updateHidden" :disabled="isLoading">
            <label class="custom-control-label" :for="`hidden${id}`">Hide</label>
          </div>
        </div>
      </div>
      <div v-if="title || editable" class="row d-flex align-items-center justify-between w-100 title-bar">
        <div class="col-md-6 mb-1">
        </div>
        <div class="col-md-6 mb-1" style="padding-left: 24px;">

        </div>
      </div>
      <div v-if="editable" style="font-size: 13px;" class="col-md-6 offset-md-6 mt-1">
        <span style="color: #6B7280;">You can search by Product Name, UPC, SKU</span>
      </div>
      <div v-if="(!filteredProducts || (filteredProducts && !filteredProducts.length))" class="no-products" :class="!editable ? 'no-products-main mr-4' : ''">
        <h4 align="center" style="font-style: italic; ">Please, add products to activate this Suggester. {{!editable ? 'To get started, click on the "Edit Suggester" button above and follow the instructions.' : ''}}</h4>
      </div>
      <div v-else class="position-relative swiper-container mt-3 mb-3 pt-3" :class="!editable ? 'mr-4' : ''" @mouseenter="pauseLoop" @mouseleave="doLoop">
        <div v-if="editable" class="row container mt-1" style="padding-right: 0px !important;">
          <div v-if="editable" class="col-md-6" style="padding-left: 3px !important;">
            <h6>Added Products<span class="ml-2 p-1" style="background: #E5E7EB; border-radius: 4px; font-weight: bold;">{{filteredProducts.length}}</span></h6>
          </div>
          <div class="col-md-6 d-flex justify-content-end" style="padding-right: 3px;">
            <h6 class="remove-all-products" @click="removeAllProductsFromSuggester">Remove All Products</h6>
          </div>
        </div>
        <div class="mt-2">
          <draggable :ref="`pDraggable-${id}`" class="row small-gutters mb-3 pl-3 pr-3" :list="swiperProducts" :group="`productSwiperGroup-${id}`" :disabled="!editable && !swiperEditable" @change="onReorder">
            <div :class="`col-6 col-sm-${12 / visibleItems} mb-2 swiper-slide`" v-for="(item, index) in swiperProducts" :key="`productswiper-${item.title}${index}`">
              <ProductItem :target="target" :class="{'draggable-item' : editable}" @remove="removeItem" :editable="editable || swiperEditable" :item="item" :internal-api="internalApi" :add-start-stop-scroller="true" :show-add-cart="showAddCart" />
            </div>
          </draggable>
        </div>
        <template v-if="visibleItems < filteredProducts.length">
          <div :ref="`product-swiper-${id}-prev`" class="swiper-button-prev" @click="prevPage" v-if="showPrevPage" />
          <div :ref="`product-swiper-${id}-next`" class="swiper-button-next" @click="nextPage" v-if="showNextPage" />
        </template>
      </div>
    </div>
    <div v-if="editable && windowWidth > 768 && $store.state.storeLocations.length > 1" class="col-md-1" style="max-width: 4.3%;">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"><circle cx="16" cy="16" r="16" fill="#e8e8e8"/><circle cx="16" cy="16" r="12" :fill="businessPrimaryColor"/><path fill="#fff" d="M12.928 20v-1.33l3.107-2.876c.264-.256.485-.486.664-.69a2.62 2.62 0 0 0 .414-.601c.093-.199.14-.414.14-.644 0-.255-.058-.476-.174-.66a1.147 1.147 0 0 0-.478-.43 1.495 1.495 0 0 0-.686-.154c-.267 0-.5.054-.699.162a1.116 1.116 0 0 0-.46.465 1.506 1.506 0 0 0-.162.72h-1.751c0-.571.13-1.067.388-1.488a2.59 2.59 0 0 1 1.086-.975c.466-.23 1.003-.346 1.611-.346.625 0 1.17.111 1.632.333a2.59 2.59 0 0 1 1.087.912c.258.389.388.835.388 1.338 0 .33-.066.655-.196.976-.128.32-.357.677-.686 1.07-.33.389-.794.856-1.394 1.401l-1.274 1.249v.06h3.665V20h-6.222Z"/></svg>
      <div class="vertical-line" :style="{ height: verticalLineHeightSection2 }"></div>
    </div>
    <div :class="editable && windowWidth > 768 && $store.state.storeLocations.length > 1 ? 'col-md-11 mt-1' : 'col-md-12'" ref="section2Content">
      <div class="title d-flex mb-2" v-if="editable && $store.state.storeLocations.length > 1">
        <h5>Specify the <b>Stores</b> where the suggester will be implemented</h5>
      </div>
      <div class="mt-2 ml-3" v-if="editable && $store.state.storeLocations.length > 1">
        <div class="row">
          <div v-for="store in $store.state.storeLocations" :key="store.id">
            <input :id="`${store.id}-checkbox-${id}-suggester`" :value="store.id" type="checkbox" v-model="locationsCopy" @click="handleCheckboxClick($event, store.name)"/>
            <label :for="`${store.id}-checkbox-${id}-suggester`" class="label-checkbox"><i v-if="locationsCopy.includes(store.id)" class="fa fa-check tab-check mr-2" aria-hidden="true"></i>{{store.name}}</label>
          </div>
        </div>
      </div>
    </div>
    <div v-if="editable && windowWidth > 768" class="col-md-1" style="max-width: 4.3%;">
      <svg v-if="$store.state.storeLocations.length > 1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"><circle cx="16" cy="16" r="16" fill="#e8e8e8"/><circle cx="16" cy="16" r="12" :fill="businessPrimaryColor"/><path fill="#fff" d="M15.978 20.12c-.636 0-1.203-.11-1.7-.329-.494-.221-.885-.525-1.172-.912a2.292 2.292 0 0 1-.439-1.346h1.858a.97.97 0 0 0 .209.562c.13.16.304.283.52.37.216.089.459.133.728.133.282 0 .53-.05.746-.15.216-.099.385-.236.507-.413.122-.176.184-.379.184-.609a1.02 1.02 0 0 0-.197-.618 1.253 1.253 0 0 0-.553-.426 2.154 2.154 0 0 0-.853-.153h-.814v-1.355h.814c.279 0 .524-.049.737-.145.216-.097.384-.23.503-.4a1.04 1.04 0 0 0 .18-.606 1.047 1.047 0 0 0-.593-.967c-.185-.094-.4-.14-.648-.14-.25 0-.478.045-.686.135a1.2 1.2 0 0 0-.498.38.998.998 0 0 0-.2.58h-1.77c.01-.504.153-.947.431-1.33a2.794 2.794 0 0 1 1.125-.9c.475-.218 1.01-.328 1.607-.328.602 0 1.129.11 1.58.329.452.218.803.514 1.053.886.253.37.378.784.375 1.244.003.489-.149.896-.456 1.223-.304.327-.7.534-1.189.622v.069c.642.082 1.131.305 1.466.669.338.36.506.812.503 1.355.003.497-.14.939-.43 1.325-.287.386-.683.69-1.19.912-.505.222-1.084.332-1.738.332Z"/></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"><circle cx="16" cy="16" r="16" fill="#e8e8e8"/><circle cx="16" cy="16" r="12" :fill="businessPrimaryColor"/><path fill="#fff" d="M12.928 20v-1.33l3.107-2.876c.264-.256.485-.486.664-.69a2.62 2.62 0 0 0 .414-.601c.093-.199.14-.414.14-.644 0-.255-.058-.476-.174-.66a1.147 1.147 0 0 0-.478-.43 1.495 1.495 0 0 0-.686-.154c-.267 0-.5.054-.699.162a1.116 1.116 0 0 0-.46.465 1.506 1.506 0 0 0-.162.72h-1.751c0-.571.13-1.067.388-1.488a2.59 2.59 0 0 1 1.086-.975c.466-.23 1.003-.346 1.611-.346.625 0 1.17.111 1.632.333a2.59 2.59 0 0 1 1.087.912c.258.389.388.835.388 1.338 0 .33-.066.655-.196.976-.128.32-.357.677-.686 1.07-.33.389-.794.856-1.394 1.401l-1.274 1.249v.06h3.665V20h-6.222Z"/></svg>
    </div>
    <div v-if="editable" :class="editable && windowWidth > 768 ? 'col-md-11 mt-1' : 'col-md-12'">
      <div class="title d-flex mb-2">
        <h5>On which products you'd like to get this suggester applied</h5>
      </div>
      <div class="mr-3">
        <div class="tab-container">
          <div class="row mb-4" style="margin-left: 0px;">
            <span class="tab-title" :class="{ active: currentTab === 'departments' }" @click="currentTab = 'departments'"><i v-if="currentTab === 'departments'" class="fa fa-check tab-check mr-2" aria-hidden="true"></i>Under Departments</span>
            <span class="tab-title" :class="{ active: currentTab === 'classes' }" @click="currentTab = 'classes'"><i v-if="currentTab === 'classes'" class="fa fa-check tab-check mr-2" aria-hidden="true"></i>Under Classes</span>
            <span class="tab-title" :class="{ active: currentTab === 'finelines' }" @click="currentTab = 'finelines'"><i v-if="currentTab === 'finelines'" class="fa fa-check tab-check mr-2" aria-hidden="true"></i>Under Finelines</span>
            <span class="tab-title" :class="{ active: currentTab === 'single' }" @click="currentTab = 'single'"><i v-if="currentTab === 'single'" class="fa fa-check tab-check mr-2" aria-hidden="true"></i>Single Product</span>
          </div>
          <div class="tab">
            <div class="tab-content" v-if="currentTab === 'departments'">
              <div class="row mb-3 pt-1 pb-1">
                <div class="col-md-4">
                  <h6 class="font-weight-bold" style="font-size: 13px;">Select Department</h6>
                  <VSelect
                    ref="vselect1"
                    :disabled="isLoading"
                    labelSearchPlaceholder="Select Department"
                    labelTitle="Search Departments"
                    :searchable="true"
                    :options="normalizedParentDepartments"
                    v-model="selectedParentDepartment"
                  />
                  <button :disabled="isLoading || !selectedParentDepartment" class="mt-3 btn btn-sm btn-primary" :style="windowWidth > 450 ? 'min-width: 425px;' : ''" @click="parentDepartmentSelected">Apply Suggester to all Products under the Selected Department</button>
                </div>
              </div>
            </div>
          </div>
          <div class="tab">
            <div class="tab-content" v-if="currentTab === 'classes'">
              <div class="row mb-3 pt-1 pb-1">
                <div class="col-md-4">
                  <h6 class="font-weight-bold" style="font-size: 13px;">Select Department</h6>
                  <VSelect
                    ref="vselect2"
                    :disabled="isLoading"
                    labelSearchPlaceholder="Select Department"
                    labelTitle="Search Departments"
                    :searchable="true"
                    :options="normalizedParentDepartments"
                    v-model="selectedParentDepartmentForSelectingClass"
                    @change="parentDepartmentSelectedForSelectingClass"
                  />
                  <button :disabled="isLoading || !selectedDepartmentClassForSelectingClass" class="mt-3 btn btn-sm btn-primary" :style="windowWidth > 450 ? 'min-width: 425px;' : ''" @click="departmentClassSelectedForSelectingClass">Apply Suggester to all Products under the Selected Class</button>
                </div>
                <div class="col-md-4">
                  <h6 class="font-weight-bold" style="font-size: 13px;">Select Class</h6>
                  <VSelect
                    ref="vselect3"
                    :disabled="!selectedParentDepartmentClassesForSelectingClass.length || isLoading"
                    labelSearchPlaceholder="Select Class"
                    labelTitle="Search Classes"
                    :searchable="true"
                    :options="normalizedDepartmentClassesForSelectingClass"
                    v-model="selectedDepartmentClassForSelectingClass"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="tab">
            <div class="tab-content" v-if="currentTab === 'finelines'">
              <div class="row mb-3 pt-1 pb-1">
                <div class="col-md-4">
                  <h6 class="font-weight-bold" style="font-size: 13px;">Select Department</h6>
                  <VSelect
                    ref="vselect4"
                    :disabled="isLoading"
                    labelSearchPlaceholder="Select Department"
                    labelTitle="Search Departments"
                    :searchable="true"
                    :options="normalizedParentDepartments"
                    v-model="selectedParentDepartmentForSelectingFineline"
                    @change="parentDepartmentSelectedForSelectingFineline"
                  />
                  <button :disabled="isLoading || !selectedFineline" class="mt-3 btn btn-sm btn-primary" :style="windowWidth > 450 ? 'min-width: 425px;' : ''" @click="finelineSelected">Apply Suggester to all Products under the Selected Fineline</button>
                </div>
                <div class="col-md-4">
                  <h6 class="font-weight-bold" style="font-size: 13px;">Select Class</h6>
                  <VSelect
                    ref="vselect5"
                    :disabled="!selectedParentDepartmentClassesForSelectingFineline.length || isLoading"
                    labelSearchPlaceholder="Select Class"
                    labelTitle="Search Classes"
                    :searchable="true"
                    :options="normalizedDepartmentClassesForSelectingFineline"
                    v-model="selectedDepartmentClassForSelectingFineline"
                    @change="departmentClassSelectedForSelectingFineline"
                  />
                </div>
                <div class="col-md-4">
                  <h6 class="font-weight-bold" style="font-size: 13px;">Select Fineline</h6>
                  <VSelect
                    ref="vselect6"
                    :disabled="!selectedFinelines.length || isLoading"
                    labelSearchPlaceholder="Select Fineline"
                    labelTitle="Search Finelines"
                    :searchable="true"
                    :options="normalizedFinelines"
                    v-model="selectedFineline"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="tab">
            <div class="tab-content" v-if="currentTab === 'single'">
              <div class="row mb-3 pt-1" style="padding-bottom: 32px;">
                <div class="col-md-4">
                  <h6 class="font-weight-bold" style="font-size: 13px;">Select Product</h6>
                  <search-suggestions
                    :disabled="isLoading"
                    hideDepartments="true"
                    hideBrands="true"
                    hideFooter="true"
                    ref="searchproductssuggestto"
                    debounceOnGetSuggestions="500"
                    placeholder=" "
                    @onSelected="addProductByUPCOrSKU"
                    class="search-wrapper"
                    v-if="editable"
                  />
                  <div v-if="editable" style="font-size: 13px;" class="mt-1">
                    <span style="color: #6B7280;">You can search by Product Name, UPC, SKU</span>
                  </div>
               </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr v-if="editable" class="mb-3 mr-3">
      <div class="row" style="max-width: 98.5%; border-radius: 10px 10px 0px 0px; border: 1px solid rgba(203, 213, 225, 0.57); padding: 8px; margin: 1px;" v-if="editable">
        <div class="d-flex align-items-center col-md-3" style="border-right: 1px solid rgba(203, 213, 225, 0.57);">
          <span>Selected Departments:</span>
        </div>
        <div class="col-md-9">
          <div v-if="!suggestToDepts">
            <span style="font-style: italic;">Your Selected Departments Will Be Summarized Here.</span>
          </div>
          <div v-else class="suggest-to-elements-container">
            <div v-for="(sd, index) in suggestToDepts" :key="index" class="suggest-to-element">
              <a :href="sd.target">{{ sd.name }}</a>
              <button @click="removeFromSuggestToList(sd.dept_id[0], 'Department')" class="remove"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="row" style="max-width: 98.5%; border: 1px solid rgba(203, 213, 225, 0.57); border-top: 0px; border-bottom: 0px; padding: 8px; margin: 1px;" v-if="editable">
        <div class="d-flex align-items-center col-md-3" style="border-right: 1px solid rgba(203, 213, 225, 0.57);">
          <span>Selected Classes:</span>
        </div>
        <div class="col-md-9">
          <div v-if="!suggestToClasses">
            <span style="font-style: italic;">Your Selected Classes Will Be Summarized Here.</span>
          </div>
          <div v-else class="suggest-to-elements-container">
            <div v-for="(sc, index) in suggestToClasses" :key="index" class="suggest-to-element">
              <a :href="sc.target">{{ sc.name }}</a>
              <button @click="removeFromSuggestToList(sc.dept_id[0], 'Class')" class="remove"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="row" style="max-width: 98.5%; border: 1px solid rgba(203, 213, 225, 0.57); border-bottom: 0px; padding: 8px; margin: 1px;" v-if="editable">
        <div class="d-flex align-items-center col-md-3" style="border-right: 1px solid rgba(203, 213, 225, 0.57);">
          <span>Selected Finelines:</span>
        </div>
        <div class="col-md-9">
          <div v-if="!suggestToFinelines">
            <span style="font-style: italic;">Your Selected Finelines Will Be Summarized Here.</span>
          </div>
          <div v-else class="suggest-to-elements-container">
            <div v-for="(sf, index) in suggestToFinelines" :key="index" class="suggest-to-element">
              <a :href="sf.target">{{ sf.name }}</a>
              <button @click="removeFromSuggestToList(sf.dept_id[0], 'Fineline')" class="remove"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="row" style="max-width: 98.5%; border-radius: 0px 0px 10px 10px; border: 1px solid rgba(203, 213, 225, 0.57); padding: 8px; margin: 1px;" v-if="editable">
        <div class="d-flex align-items-center col-md-3" style="border-right: 1px solid rgba(203, 213, 225, 0.57);">
          <span>Selected Products:</span>
        </div>
        <div class="col-md-9">
          <div v-if="!suggestToSpecificProducts">
            <span style="font-style: italic;">Your Selected Products Will Be Summarized Here.</span>
          </div>
          <div v-else class="suggest-to-elements-container">
            <div v-for="sp in suggestToSpecificProducts" :key="sp.sku" class="suggest-to-element">
              <router-link :to="{name: 'products-slug', params: {slug: sp.slug}}">{{ sp.title }}</router-link>
              <button @click="removeFromSuggestToList(sp.sku, 'Product')" class="remove"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import searchSuggestions from '@/components/search-suggestions';
import SuggesterApiService from '@/api-services/suggester.service';
import VSelect from '@alfsnd/vue-bootstrap-select';
import { debounce } from 'debounce';

export default {
  name: 'SuggesterSwiper',
  props: {
    id: {
      default: null
    },
    products: {
      default: null
    },
    internalApi: {
      default: false
    },
    showAddCart: {
      default: true
    },
    editable: {
      default: false
    },
    swiperEditable: {
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
    hidden: {
      default: true
    },
    target: {
      default: '_self'
    },
    locations: {
      default: null
    }
  },
  components: {
    draggable,
    searchSuggestions,
    VSelect
  },
  data() {
    return {
      intTitle: '',
      intLoop: true,
      suggesterIsHidden: false,
      locationsCopy: [],
      windowWidth: window.innerWidth,
      currentPage: 1,
      oneByOne: this.loop,
      loopInterval: null,
      isLoading: false,
      isDeleting: false,
      suggesterData: null,
      currentTab: 'departments',
      verticalLineHeightSection1: 0,
      verticalLineHeightSection2: 0,
      // DEPARTMENTS
      selectedParentDepartment: '',
      selectedParentDepartmentClasses: [],
      suggestToDepts: null,
      // CLASSES
      selectedDepartmentClassForSelectingClass: '',
      selectedParentDepartmentForSelectingClass: '',
      selectedParentDepartmentClassesForSelectingClass: [],
      suggestToClasses: null,
      // FINELINES
      selectedDepartmentClassForSelectingFineline: '',
      selectedParentDepartmentForSelectingFineline: '',
      selectedParentDepartmentClassesForSelectingFineline: [],
      selectedFinelines: [],
      selectedFineline: '',
      suggestToFinelines: null,
      // SPECIFIC PRODUCT
      selectedProductToShowSuggestions: '',
      suggestToSpecificProducts: null,
    };
  },
  created() {
    this.intTitle = this.title ? this.title : 'Other Recommendations';
    this.intLoop = this.loop;
    if(this.locations) {
      this.locationsCopy = this.locations.map(location => parseInt(location));
    }
    window.addEventListener('resize', () => this.windowWidth = window.innerWidth);
  },
  computed: {
    suggesterVisibleOrHiddenText() {
      if (this.suggesterIsHidden) {
        return 'hidden';
      } 
      return 'visible';
    },
    showPrevPage() {
      if(this.swiperEditable && this.currentPage == 1) {
        return false;
      }
      if((this.loop && !this.editable) || this.currentPage > 1) {
        return true;
      }
      return false;
    },
    showNextPage() {
      if(this.swiperEditable && this.swiperProducts.some(e => e.id === this.filteredProducts[this.filteredProducts.length - 1].id)) {
        return false;
      }
      if((this.loop && !this.editable) || !this.swiperProducts.some(e => e.id === this.filteredProducts[this.filteredProducts.length - 1].id)) {
        return true;
      }
      return false;
    },
    isTruevalue() {
      return this.$root.$children[0].isTruevalue;
    },
    settings() {
      return this.$store.state.settings;
    },
    departmentList() {
      return this.$store.state.departments;
    },
    parentDepartments() {
      var showInStock = 1;
      if(this.settings.products.filterShowOutOfStock) {
        showInStock = 0;
      }
      let departments = this.departmentList.map(e => {
        let dRoute = 'department';
        if(e.children && e.children.length) {
          e.children.forEach(c => {
            if(c.children && c.children.length) {
              c.children.forEach(f => {
                f.target = `/${dRoute}/${this.$ezSlugify(f.name)}-${f.dept_id}?name=${encodeURIComponent(f.name)}&in_stock_only=${showInStock}`;
                return f;
              });
            }
            c.target = `/${dRoute}/${this.$ezSlugify(c.name)}-${c.dept_id}?name=${encodeURIComponent(c.name)}&in_stock_only=${showInStock}`;
            return c;
          });
        }
        e.target = `/${dRoute}/${this.$ezSlugify(e.name)}-${e.dept_id}?name=${encodeURIComponent(e.name)}&in_stock_only=${showInStock}`;
        return e;
      });
      return departments;
    },
    // DEPARTMENTS
    normalizedParentDepartments() {
      return this.parentDepartments.map(d => {
        return {
          target: d.target,
          text: d.name.toUpperCase(),
          value: d
        };
      });
    },
    // CLASSES
    normalizedDepartmentClassesForSelectingClass() {
      return this.selectedParentDepartmentClassesForSelectingClass.map(d => {
        return {
          target: d.target,
          text: d.name.toUpperCase(),
          value: d
        };
      });
    },
    // FINELINES
    normalizedDepartmentClassesForSelectingFineline() {
      return this.selectedParentDepartmentClassesForSelectingFineline.map(d => {
        return {
          target: d.target,
          text: d.name.toUpperCase(),
          value: d
        };
      });
    },
    normalizedFinelines() {
      return this.selectedFinelines.map(d => {
        return {
          target: d.target,
          text: d.name.toUpperCase(),
          value: d
        };
      });
    },
    lastPage() {
      return Math.ceil(this.products.length / this.visibleItems);
    },
    visibleItems() {
      return this.itemsToShow ? this.itemsToShow
           : this.windowWidth > 1200 ? 6
           : this.windowWidth > 992  ? 4
           : this.windowWidth > 768  ? 3
           : this.windowWidth > 577  ? 2
           :                           2;
    },
    filteredProducts: {
      get() {
        let ret = [];
        ret = [...this.products];
        return ret;
      },
      set(val) {
        return val;
      }
    },
    swiperProducts() {
      let ret = [];
      let start, end = 0;

      if(!this.oneByOne) {
        start = (this.currentPage - 1) * this.visibleItems;
        end = this.currentPage * this.visibleItems;
      } else {
        start = this.currentPage - 1;
        end = this.visibleItems + this.currentPage - 1;
      }

      ret = [...this.filteredProducts].slice(start, end);

      if(this.loop && this.visibleItems < this.filteredProducts.length) {
        ret = ret.concat([...this.filteredProducts].slice(0, this.visibleItems - ret.length));
      }
      return ret;
    },
    businessPrimaryColor() {
      return this.$store.state.settings.colors.primary;
    }
  },
  async mounted() {
    this.getSelectedSuggesterData();
    this.setVerticalLineHeight();
    window.addEventListener("resize", this.setVerticalLineHeight);
    if(this.editable){
      this.$refs.searchforsuggester.$el.children[0].children[0].style = 'height: 36px;';
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setVerticalLineHeight);
  },
  methods: {
    setVerticalLineHeight() {
      this.verticalLineHeightSection1 = `${this.$refs.section1Content.offsetHeight * 95/100}px`;
      this.verticalLineHeightSection2 = `${this.$refs.section2Content.offsetHeight * 75/100}px`;
    },
    removeAllProductsFromSuggester() {
      this.$swal({
        title: 'Remove All Products',
        html: `Are you sure you want to remove all the products from this Suggester?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          this.$emit('removeAllItems');
          this.$emit('getBusinessSuggesters');
          this.filteredProducts = [];
          this.currentPage = 1;
        }
      });
    },
    onReorder(e) {
      const movedElement = e.moved.element;
      const oldIndex = e.moved.oldIndex + this.currentPage - 1;
      const newIndex = e.moved.newIndex + this.currentPage - 1;
      this.filteredProducts.splice(oldIndex, 1);
      this.filteredProducts.splice(newIndex, 0, movedElement);

      this.$emit('onReorder', this.filteredProducts);
    },
    onAdd(selected) {
      this.$emit('onSelected', selected);
      this.$emit('getBusinessSuggesters');
    },
    removeItem(item) {
      this.$swal({
        title: 'Remove Product',
        html: `Are you sure you want to remove <div class="font-weight-bold text-capitalize">${item.title}</div> from the Product Swiper?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          this.$emit('removeItem', item);
          this.$emit('getBusinessSuggesters');
          if(!this.loop && !this.swiperProducts.length) {
            this.currentPage = this.currentPage - 1;
          }
          if(this.loop && !this.showNextPage) {
            this.currentPage = this.currentPage - 1;
          }
          if(this.currentPage < 1) {
            this.currentPage = 1;
          }
        }
      });
    },
    prevPage() {
      this.currentPage = this.currentPage > 1 ? this.currentPage : this.filteredProducts.length + 1;
      this.currentPage = this.currentPage - 1;
      this.pauseLoop();
      this.doLoop();
    },
    nextPage() {
      let max = this.loop ? this.filteredProducts.length : Math.ceil(this.filteredProducts.length / this.visibleItems);
      this.currentPage = this.currentPage < max ? this.currentPage : 0;
      this.currentPage = this.currentPage + 1;
      this.pauseLoop();
      this.doLoop();
    },
    doLoop() {
      if(this.autoPlay && this.visibleItems < this.swiperProducts.length)
        this.loopInterval = setInterval(() => this.nextPage(), this.autoPlay);
    },
    pauseLoop() {
      this.autoPlay && clearInterval(this.loopInterval);
    },
    updateLoop() {
      this.currentPage = 1;
      this.oneByOne = this.intLoop;
      this.$emit('updateLoop', this.intLoop);
    },
    async updateHidden() {
      this.isLoading = true;
      await SuggesterApiService.updateSuggesterHidden({id: this.id, hidden: this.suggesterIsHidden}).then(() => {
        this.isLoading = false;
      });
    },
    goToEditSuggester() {
      this.$emit('goToEditSuggester', this.id);
    },
    handleCheckboxClick(e, storeName) {
      const enabledOrDisabled = e.target.checked === true ? 'enabled' : 'disabled';
      this.$swal({
        toast: true,
        position: 'top',
        type: 'success',
        html: `<div class="ml-2">This Suggester is now ${enabledOrDisabled} in ${storeName}.</div>`,
        showConfirmButton: false,
        timer: 5000
      });
    },
    deleteSuggester() {
      this.isDeleting = true;
      this.$emit('deleteSuggester', this.id);
      this.isDeleting = false;
    },
    async getSelectedSuggesterData() {
      this.isLoading = true;
      await SuggesterApiService.getSelectedSuggesterData(this.id).then(res => {
        this.suggestToDepts = res.data.suggest_to_depts;
        this.suggestToClasses = res.data.suggest_to_classes;
        this.suggestToFinelines = res.data.suggest_to_finelines;
        this.suggestToSpecificProducts = res.data.suggest_to_products;
        this.suggesterIsHidden = res.data.suggester_hidden;
        this.isLoading = false;
      });
    },
    async removeFromSuggestToList(identifier, category) {
      this.isLoading = true;
      await SuggesterApiService.updateSuggesterRemove({id: this.id, category_identifier: identifier, category: category}).then(() => {
        this.getSelectedSuggesterData();
        this.$swal({
          toast: true,
          position: 'top',
          type: 'success',
          html: `<div class="ml-2">${category} Removed From Suggestions List.</div>`,
          showConfirmButton: false,
          timer: 3000
        });
        this.isLoading = false;
      });
    },
    // DEPARTMENTS
    async parentDepartmentSelected() {
      if(this.selectedParentDepartment == null) {
        return;
      };
      this.$refs.vselect1.$el.children[0].children[0].style = 'overflow:hidden;';
      if(this.suggestToDepts !== null && this.suggestToDepts.find(e => e.name === this.selectedParentDepartment.value.name)) {
        this.$swal({
          toast: true,
          position: 'top',
          type: 'error',
          html: `<div class="ml-2">This Department Was Already Selected.</div>`,
          showConfirmButton: false,
          timer: 3000
        });
        return;
      }
      this.isLoading = true;

      let suggestToDepts = {
        id: this.id,
        category: 'Department',
        suggest_to: JSON.stringify({
          target: this.selectedParentDepartment.target,
          name: this.selectedParentDepartment.value.name,
          dept_id: [this.selectedParentDepartment.value.dept_id]
        })
      };

      await SuggesterApiService.updateSuggesterAdd(suggestToDepts).then(res => {
        this.suggestToDepts = JSON.parse(res.data.suggest_to_depts);
        this.$swal({
          toast: true,
          position: 'top',
          type: 'success',
          html: `<div class="ml-2">Department Added To Suggestions List.</div>`,
          showConfirmButton: false,
          timer: 3000
        });
        this.isLoading = false;

        // reset input
        this.selectedParentDepartment = null;
        this.$refs.vselect1.$emit('change', null);
      });
    },
    // CLASSES
    parentDepartmentSelectedForSelectingClass() {
      this.$refs.vselect2.$el.children[0].children[0].style = 'overflow:hidden;';
      this.getDepartmentClassesForSelectingClass(this.selectedParentDepartmentForSelectingClass.value.name);
    },
    getDepartmentClassesForSelectingClass(parentDepartmentName) {
      const departmentClass = this.parentDepartments.find(d => d.name === parentDepartmentName);
      this.selectedParentDepartmentClassesForSelectingClass = departmentClass ? departmentClass.children : [];
    },
    async departmentClassSelectedForSelectingClass() {
      this.$refs.vselect3.$el.children[0].children[0].style = 'overflow:hidden;';
      if(this.suggestToClasses !== null && this.suggestToClasses.find(e => e.name === this.selectedDepartmentClassForSelectingClass.value.name)) {
        this.$swal({
          toast: true,
          position: 'top',
          type: 'error',
          html: `<div class="ml-2">This Class Was Already Selected.</div>`,
          showConfirmButton: false,
          timer: 3000
        });
        return;
      }
      this.isLoading = true;

      let suggestToClasses = {
        id: this.id,
        category: 'Class',
        suggest_to: JSON.stringify({
          target: this.selectedDepartmentClassForSelectingClass.target,
          name: this.selectedDepartmentClassForSelectingClass.value.name,
          dept_id: [this.selectedDepartmentClassForSelectingClass.value.dept_id]
        })
      };

      await SuggesterApiService.updateSuggesterAdd(suggestToClasses).then(res => {
        this.suggestToClasses = JSON.parse(res.data.suggest_to_classes);
        this.$swal({
          toast: true,
          position: 'top',
          type: 'success',
          html: `<div class="ml-2">Class Added To Suggestions List.</div>`,
          showConfirmButton: false,
          timer: 3000
        });
        this.isLoading = false;

        // reset inputs
        this.$refs.vselect3.$el.children[0].children[0].innerText = 'Search Classes';
        this.selectedParentDepartmentClassesForSelectingClass = [];
        this.$refs.vselect2.$emit('change', this.selectedParentDepartmentForSelectingClass);
      });
    },
    // FINELINES
    parentDepartmentSelectedForSelectingFineline() {
      this.$refs.vselect4.$el.children[0].children[0].style = 'overflow:hidden;';
      this.getDepartmentClassesForSelectingFineline(this.selectedParentDepartmentForSelectingFineline.value.name);
    },
    getDepartmentClassesForSelectingFineline(parentDepartmentName) {
      const departmentClass = this.parentDepartments.find(d => d.name === parentDepartmentName);
      this.selectedParentDepartmentClassesForSelectingFineline = departmentClass ? departmentClass.children : [];
    },
    departmentClassSelectedForSelectingFineline() {
      this.$refs.vselect5.$el.children[0].children[0].style = 'overflow:hidden;';
      this.getFinelines(this.selectedParentDepartmentForSelectingFineline.value.name, this.selectedDepartmentClassForSelectingFineline.value.name);
    },
    getFinelines(parentDepartmentName, departmentClassName) {
      const departmentClass = this.parentDepartments.find(d => d.name === parentDepartmentName);
      const finelines = departmentClass.children.find(d => d.name === departmentClassName);
      this.selectedFinelines = finelines ? finelines.children : [];
      this.selectedFineline = '';
      this.$refs.vselect6.$el.children[0].children[0].innerText = 'Search Finelines';
    },
    async finelineSelected() {
      this.$refs.vselect6.$el.children[0].children[0].style = 'overflow:hidden;';
      if(this.suggestToFinelines !== null && this.suggestToFinelines.find(e => e.name === this.selectedFineline.value.name)) {
        this.$swal({
          toast: true,
          position: 'top',
          type: 'error',
          html: `<div class="ml-2">This Fineline Was Already Selected.</div>`,
          showConfirmButton: false,
          timer: 3000
        });
        return;
      }
      this.isLoading = true;

      let suggestToFinelines = {
        id: this.id,
        category: 'Fineline',
        suggest_to: JSON.stringify({
          target: this.selectedFineline.target,
          name: this.selectedFineline.value.name,
          dept_id: [this.selectedFineline.value.dept_id]
        })
      };

      await SuggesterApiService.updateSuggesterAdd(suggestToFinelines).then(res => {
        this.suggestToFinelines = JSON.parse(res.data.suggest_to_finelines);
        this.$swal({
          toast: true,
          position: 'top',
          type: 'success',
          html: `<div class="ml-2">Fineline Added To Suggestions List.</div>`,
          showConfirmButton: false,
          timer: 3000
        });
        this.isLoading = false;

        // reset inputs
        this.$refs.vselect6.$el.children[0].children[0].innerText = 'Search Finelines';
        this.selectedParentDepartmentClassesForSelectingFineline = [];
        this.selectedFinelines = [];
        this.$refs.vselect4.$emit('change', this.selectedParentDepartmentForSelectingFineline);
        this.$refs.vselect5.$emit('change', this.selectedDepartmentClassForSelectingFineline);
      });
    },
    async addProductByUPCOrSKU(selected) {
      this.selectedProductToShowSuggestions = selected.item;

      if(this.suggestToSpecificProducts !== null && this.suggestToSpecificProducts.find(e => e.sku == this.selectedProductToShowSuggestions.sku)) {
        this.$swal({
          toast: true,
          position: 'top',
          type: 'error',
          html: `<div class="ml-2">This Product Was Already Selected.</div>`,
          showConfirmButton: false,
          timer: 3000
        });
        return;
      }
      this.isLoading = true;

      let suggestToSpecificProduct = {
        id: this.id,
        category: 'Product',
        suggest_to: JSON.stringify({
          slug: this.selectedProductToShowSuggestions.slug,
          title: this.selectedProductToShowSuggestions.original_title,
          sku: this.selectedProductToShowSuggestions.sku
        })
      };

      await SuggesterApiService.updateSuggesterAdd(suggestToSpecificProduct).then(res => {
        this.suggestToSpecificProducts = JSON.parse(res.data.suggest_to_products);
        this.$swal({
          toast: true,
          position: 'top',
          type: 'success',
          html: `<div class="ml-2">Product Added To Suggestions List.</div>`,
          showConfirmButton: false,
          timer: 3000
        });
        this.isLoading = false;
      });
    },
  },
  watch: {
    intTitle: debounce(function(value) {
      this.$emit('updateTitle', value);
    }, 1500),
    visibleItems(val) {
      if(val >= this.filteredProducts.length) {
        this.currentPage = 1;
      }
    },
    currentTab(val) {
      if(val == 'single') {
        this.$nextTick(() => {
          this.$refs.searchproductssuggestto.$el.children[0].children[0].style = 'max-height: 36px !important;';
        });
      }
    },
    // CLASSES
    selectedParentDepartmentForSelectingClass() {
      this.$refs.vselect2.$el.children[0].children[0].innerText = this.selectedParentDepartmentForSelectingClass.text;
      this.parentDepartmentSelectedForSelectingClass();
      if(this.$refs.vselect2.$el.children[0].children[0].innerText != 'Search Departments' && this.$refs.vselect3.$el.children[0].children[0].innerText != 'Search Classes') {
        this.$refs.vselect3.$el.children[0].children[0].innerText = 'Search Classes';
      }
      this.selectedDepartmentClassForSelectingClass = '';
    },
    selectedDepartmentClassForSelectingClass() {
      if(this.$refs.vselect3.$el.children[0].children[0].innerText == 'Search Classes') {
        this.$refs.vselect3.$el.children[0].children[0].innerText = this.selectedDepartmentClassForSelectingClass.text;
      }
      if(this.$refs.vselect3.$el.children[0].children[0].innerText == 'undefined') {
        this.$refs.vselect3.$el.children[0].children[0].innerText = 'Search Classes';
      }
    },
    // FINELINES
    selectedParentDepartmentForSelectingFineline() {
      this.$refs.vselect4.$el.children[0].children[0].innerText = this.selectedParentDepartmentForSelectingFineline.text;
      this.parentDepartmentSelectedForSelectingFineline();
      if(this.selectedParentDepartmentForSelectingFineline != '' && this.selectedDepartmentClassForSelectingFineline != '') {
        this.$refs.vselect5.$el.children[0].children[0].innerText = 'Search Classes';
        this.$refs.vselect6.$el.children[0].children[0].innerText = 'Search Finelines';
        this.selectedFinelines = [];
      };
    },
    selectedDepartmentClassForSelectingFineline() {
      this.$refs.vselect5.$el.children[0].children[0].innerText = this.selectedDepartmentClassForSelectingFineline.text;
      this.departmentClassSelectedForSelectingFineline();
      if(this.$refs.vselect6.$el.children[0].children[0].innerText == 'undefined') {
        this.$refs.vselect6.$el.children[0].children[0].innerText = 'Search Finelines';
      }
    },
    selectedFineline() {
      if(this.selectedFineline.text != undefined) {
        this.$refs.vselect6.$el.children[0].children[0].innerText = this.selectedFineline.text;
      }
    },
    locationsCopy: {
      handler: async function(locations) {
        if(this.$store.state.storeLocations.length > 1) {
          const locationsAsString = locations.map(String);
          this.$emit('updateLocations', {id: this.id, locations: locationsAsString});
        }
      },
      deep: true
    },
  }
};
</script>

<style lang="scss" scoped>
  .swiper-button-prev {
    left: 3px !important;
    width: 30px;
  }
  .swiper-button-next {
    right: 3px !important;
    width: 30px;
  }

  input[type="checkbox"] {
    display: none;
  }

  .label-checkbox {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 10px;
    border: 1px solid #CBD5E1;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
    margin-right: 8px;
    cursor: pointer;
  }

  input[type="checkbox"]:checked + .label-checkbox {
    background-color: #F9FAFB;
    color: var(--primary);
  }
  .tab-check {
    color: var(--primary);
  }
  .active {
    background: #F9FAFB;
    color: var(--primary);
  }
  .tab-title {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 10px;
    border: 1px solid #CBD5E1;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
    margin-right: 8px;
    cursor: pointer;
  }

  .tab-title:last-child {
    margin-right: 0;
  }
  .remove-all-products {
    color: #EF4444; 
    cursor: pointer;
  }
  .remove-all-products:hover {
    text-decoration: underline,
  }
  .vertical-line {
    border-left: 2px dashed #CBD5E1;
    margin-left: 15px;
  }
  .suggest-to-elements-container {
    display: inline-flex;
    flex-wrap: wrap;
    width: 100%;
    background: white;

    .suggest-to-element {
      background: #D9E8EE;
      border-radius: 4px;
      margin-right: 6px;
      display: flex;
      align-items: center;
      padding: 2px 2px 2px 6px;

      span {
        color: #0E4D66;
        font-size: 0.8125rem;
        margin-right: 2px;
      }

      .remove {
        border: none;
        background: url("data:image/svg+xml,%3Csvg width='8px' height='8px' viewBox='0 0 8 8' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3EGroup 6%3C/title%3E%3Cg id='Symbols' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Tag' transform='translate(-80.000000, -7.000000)'%3E%3Crect id='Rectangle' opacity='0.149999991' x='0' y='0' width='95' height='22' rx='4'%3E%3C/rect%3E%3Cg id='Group-6' opacity='0.5' transform='translate(81.500000, 8.500000)' stroke='red' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5'%3E%3Cline x1='0' y1='0' x2='5' y2='5' id='Path'%3E%3C/line%3E%3Cline x1='5' y1='0' x2='0' y2='5' id='Path'%3E%3C/line%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E") no-repeat center;
        width: 8px;
        height: 8px;
        padding: 8px;
      }
    }

    .suggest-to-element,
    input {
      margin-top: 4px;
      margin-bottom: 4px;
    }

    input {
      border: none;
      flex: 1;
    }
  }
  .edit-buttons {
    background: gainsboro;
    width: 32px;
    height: 30px;
    border-radius: 30px;
    transform: scale(0.85);
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
  }
  .swiper.widget {
    min-height: 280px;
    padding-bottom: 30px;
  }
  .widget {
    margin-bottom: 0px;
    border-bottom: 0px;
  }
  .swiper-container {
    padding: 0 20px;
    overflow: visible;
    background: #F9FAFB;
    border: 1px solid #E5E7EB;
    border-radius: 10px;
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
  .search-wrapper {
    height: 36px !important;
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
      width: 400px;
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
  .swiper-slide {
    width: auto !important;
    min-height: 332px;
    height: auto;
  }
  .swiper-button-disabled {
    opacity: 0;
  }

  .no-products {
    border: 1px dashed #ef8c8c;
    background: #fff6f6;
    top: 20px;
    height: 420px;
    margin-top: 10px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .no-products-main {
    height: 250px !important;
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
      height: 280px;
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

