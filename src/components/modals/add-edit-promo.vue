<template>
  <b-modal size="lg" class="modal-box" ref="addEditPromo" :lazy="false" :visible="false" @shown="setData" @hide="editingCompleted" :title="promoText() + ' Promo'">
    <div class="row">
      <div class="col-12 mb-3">
        <div class="d-flex">
          <div class="flex-grow-1">
            <div class="mb-3">
              <label for="name-input">Promo Name</label>
              <input id="name-input" type="text" placeholder="Name of the promo" class="form-control w-100 search-input" v-model="activePromo.name">
            </div>
            <div class="mb-3">
              <label for="description-input">Description</label>
              <TextareaAutosize ref="description" id="description-input" rows="1" placeholder="Description of the promo" class="form-control w-100 search-input" v-model="activePromo.description" />
            </div>
          </div>
          <div class="pl-4">
            <label>Image</label>
            <div class="thumb-preview border border-dashed cursor-pointer" @click="$refs.imageUpload.click()">
              <img class="w-100 h-100" v-if="previewImage" :src="previewImage" style="object-fit: cover" />
              <div v-else class="d-flex flex-column align-items-center justify-content-center h-100">
                <svg class="mb-2 text-primary me-2" width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.75 8.4541C0.75 9.53751 0.963392 10.6103 1.37799 11.6112C1.7926 12.6122 2.40029 13.5216 3.16637 14.2877C3.93245 15.0538 4.84193 15.6615 5.84286 16.0761C6.8438 16.4907 7.91659 16.7041 9 16.7041C10.0834 16.7041 11.1562 16.4907 12.1571 16.0761C13.1581 15.6615 14.0675 15.0538 14.8336 14.2877C15.5997 13.5216 16.2074 12.6122 16.622 11.6112C17.0366 10.6103 17.25 9.53751 17.25 8.4541C17.25 7.3707 17.0366 6.2979 16.622 5.29696C16.2074 4.29603 15.5997 3.38655 14.8336 2.62047C14.0675 1.85439 13.1581 1.2467 12.1571 0.832096C11.1562 0.417494 10.0834 0.204102 9 0.204102C7.91659 0.204102 6.8438 0.417494 5.84286 0.832096C4.84193 1.2467 3.93245 1.85439 3.16637 2.62047C2.40029 3.38655 1.7926 4.29603 1.37799 5.29696C0.963392 6.2979 0.75 7.3707 0.75 8.4541Z" fill="currentColor"/><path d="M5 8.4541H13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 4.4541V12.4541" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Upload image
              </div>
            </div>
            <input @change="selectImage" ref="imageUpload" class="d-none" type="file" accept="image/*" />
          </div>
        </div>
      </div>
      <div class="col-12 mb-3">
        <label for="code-input">Promo Code <span class="text-danger">*</span></label>
        <small>Name of the promo, customers will enter this to redeem promo</small>
        <input id="code-input" type="text" placeholder="SUMMER20" class="form-control w-100 search-input" v-model="activePromo.coupon">
      </div>
      <div class="col-12 mb-3">
        <label for="type-select">Promo Type <span class="text-danger">*</span></label>
        <small>Specifies when the promo will be applied</small>
        <select id="type-select" type="text" class="form-control w-100 search-input" v-model="activePromo.widget_id">
          <option value="" disabled>Select</option>
          <option v-for="widget in couponWidgets" :key="widget.id" :value="widget.id">{{ widget.name }}</option>
        </select>
      </div>

      <div class="col-12 mb-3" v-if="activePromo.widget_id == 1">
        <label for="bundle-item-input">Bundle Items <span class="text-danger">*</span></label>
        <small>All the items in this bundle must be added to cart</small>
        <div class="row align-items-center">
          <div class="col">
            <input type="text" id="bundle-item-input" placeholder="Item SKU" class="form-control search-input" v-model="newBundleItem.sku">
          </div>
          <div class="col">
            <input type="number" id="bundle-quantity-input" placeholder="Quantity" class="form-control search-input" v-model="newBundleItem.quantity">
          </div>
          <b-button variant="success" @click="addBundleItem" class="my-2">
            <i v-if="verifying" class="fa fa-spin fa-spinner mr-1"></i> {{ verifying ? 'Verifying' : 'Add Item'}}
          </b-button>
        </div>

        <div class="row justify-content-start" style="margin-top: 15px">
          <div v-for="(item, index) in activePromo.bundle" :key="index" class="mx-1 col-5">
            <b-card :title="item.title" :img-src="item.image_url" img-alt="Product Image" title-tag="h6"
              img-left img-height="200px" img-width="150px" style="box-shadow: none;">
              <div class="item-description">SKU: {{ item.sku }}</div>
              <div class="item-description">Quantity: {{ item.quantity }}</div>
              <b-btn variant="danger" @click="deleteBundleItem(index)" class="mx-5 my-4">Delete</b-btn>
            </b-card>
          </div>
        </div>

        <div class="row align-items-center">
          <div class="col">
             <label for="bundle-price-input">Bundle Price <span class="text-danger">*</span></label>
            <input type="number" id="bundle-price-input" placeholder="Bundle Price" class="form-control search-input" v-model="activePromo.bundle_price">
          </div>
        </div>
      </div>

      <template v-else>
        <div class="col-12 mb-3" v-if="activePromo.widget_id == 2">
          <label for="sku-input">Product SKU <span class="text-danger">*</span></label>
          <small> SKU number for which product this promo belongs to</small>
          <div class="row align-items-center">
            <div class="col">
              <input type="text" class="form-control search-input" placeholder="#SKU" v-model="skuInput" @blur="verifyProduct(skuInput)">
            </div>
            <div class="col-1">
              <i class="fa fa-close my-0" style="color: red;" v-if="!skuExists && !verifying && skuInput.length > 0"></i>
              <i class="fa fa-spin fa-spinner" v-else-if="verifying"></i>
              <i class="fa fa-check" style="color: green;" v-else-if="skuExists"></i>
            </div>
          </div>
        </div>
        <div class="col-12 mb-3" v-if="activePromo.widget_id == 3">
          <label for="exclude-promo-products">Exclude Products with Promo Prices</label>
          <b-form-checkbox switch v-model="activePromo.exclude_promo_products" class="mb-2">
            {{ activePromo.exclude_promo_products ? 'Yes' : 'No'}}
          </b-form-checkbox>

          <label for="restrict-depts">Restrict Discount to Departments</label>
          <small> Discount would be applied only to products in these departments</small>
          <b-form-checkbox switch v-model="activePromo.restrict_departments" class="mb-2">
            {{ activePromo.restrict_departments ? 'Yes' : 'No'}}
          </b-form-checkbox>

          <template v-if="activePromo.restrict_departments">
            <div class="search-wrapper flex-grow-1 d-flex justify-content-center">
              <div class="search d-flex">
                <search-suggestions
                  class="search-bar"
                  :hideBrands="true"
                  :hideProducts="true"
                  :hideFooter="true"
                  :departmentsLimit="50"
                  placeholder="Search for a Department"
                  ref="search-departments"
                  @onSelected="onAddDepartment"
                  />
              </div>
            </div>

            <div class="d-flex flex-wrap mt-1">
              <div v-for="(department, key) in activePromo.departments" :key="key" class="m-1 department">
                {{ department.dept_name | capitalize }}
                <button @click="removeDepartment(key)" class="multiselect__tag-icon position-relative border-0 ml-1" aria-label="Remove Department">
                </button>
              </div>
            </div>
          </template>

          <label for="restrict-depts">Exclude Departments from Discount</label>
          <small>Discount would be applied to all products EXCEPT products in these departments</small>
          <b-form-checkbox switch v-model="activePromo.exclude_departments" class="mb-2">
            {{ activePromo.exclude_departments ? 'Yes' : 'No'}}
          </b-form-checkbox>

          <template v-if="activePromo.exclude_departments">
            <div class="search-wrapper flex-grow-1 d-flex justify-content-center">
              <div class="search d-flex">
                <search-suggestions
                  class="search-bar"
                  :hideBrands="true"
                  :hideProducts="true"
                  :hideFooter="true"
                  :departmentsLimit="50"
                  placeholder="Search for a Department"
                  ref="search-departments"
                  @onSelected="onAddExemptionDepartment"
                  />
              </div>
            </div>

            <div class="d-flex flex-wrap mt-1">
              <div v-for="(department, key) in activePromo.excluded_departments" :key="`excluded-${key}`" class="m-1 department">
                {{ department.dept_name | capitalize }}
                <button @click="removeExemptedDepartment(key)" class="multiselect__tag-icon position-relative border-0 ml-1">
                </button>
              </div>
            </div>
          </template>
        </div>
        <div class="col-12 mb-3">
          <label for="amount-type-select">Discount Type <span class="text-danger">*</span></label>
          <b-form-radio-group id="amount-type-select" class="mb-0" v-model="activePromo.discount_type">
            <div class="row justify-content-start ml-1">
              <b-form-radio value="flat">Flat Amount</b-form-radio>
              <b-form-radio value="percentage">Percent</b-form-radio>
            </div>
          </b-form-radio-group>
        </div>
        <div class="col-md-6 mb-3" v-if="activePromo.discount_type">
          <label for="discount-amount">{{ activePromo.discount_type == 'flat' ? 'Discount Amount' : 'Discount Percentage' }} <span class="text-danger">*</span></label>
          <small>{{ activePromo.discount_type == 'flat' ? 'ex: ($2 off)' : 'ex: 20% Off' }}</small>
          <input id="discount-amount" type="number" class="form-control w-100 search-input" v-model="activePromo.discount">
        </div>

        <div class="col-md-6 mb-3" v-if="activePromo.widget_id != 2">
          <label for="cart-minimum-input">Minimum Order Balance to qualify</label>
          <input id="cart-minimum-input" type="number" class="form-control w-100 search-input" v-model="activePromo.cart_minimum">
        </div>
      </template>

      <div class="col-12 mb-3">
        <label for="disclaimer-input">Disclaimer</label>
        <input id="disclaimer-input" type="text" placeholder="Disclaimer" class="form-control w-100 search-input" v-model="activePromo.disclaimer">
      </div>

      <!--<label for="auto-apply-check">Auto Apply <span class="text-danger">*</span></label>
      <b-form-checkbox switch v-model="activePromo.auto_apply" class="mb-2" @change="showAuto">
        {{ activePromo.auto_apply ? 'Yes' : 'No'}}
      </b-form-checkbox>-->

      <div class="col-6 mb-3">
        <label for="date-start-select">Start Date <span class="text-danger">*</span></label>
        <VueCtkDateTimePicker
          id="startDatepicker"
          v-model="activePromo.date_start"
          :color="$store.state.settings.colors.secondary"
          :button-color="$store.state.settings.colors.primary"
          :only-date="true"
          no-header
          noClearButton
          no-button-now
          label="Select date"
          format="YYYY-MM-DD"
          formatted="ddd, MMM Do, YYYY" />
      </div>
      <div class="col-6 mb-3">
        <label for="date-end-select">End Date <span class="text-danger">*</span></label>
        <VueCtkDateTimePicker
          id="endDatepicker"
          v-model="activePromo.date_end"
          :color="$store.state.settings.colors.secondary"
          :button-color="$store.state.settings.colors.primary"
          :only-date="true"
          no-header
          noClearButton
          no-button-now
          label="Select date"
          format="YYYY-MM-DD"
          formatted="ddd, MMM Do, YYYY" />
      </div>

      <div class="col-12 mb-3">
        <label for="disclaimer-input">Show As Pop-Up In Landing Page<span class="text-danger">*</span></label>
        <small>Only one promo can be selected</small>
        <b-form-checkbox switch v-model="activePromo.show_as_popup">
          {{ activePromo.show_as_popup ? 'Yes' : 'No'}}
        </b-form-checkbox>
      </div>

      <div class="col-12 mb-3" v-if="activePromo.show_as_popup">
        <label for="disclaimer-input">Select seperate dates to show promo Pop-Up<span class="text-danger">*</span></label>
        <small>Otherwise promo start and end dates would be used</small>
        <b-form-checkbox switch v-model="activePromo.popup_dates_separate" class="mb-2">
          {{ activePromo.popup_dates_separate ? 'Yes' : 'No'}}
        </b-form-checkbox>
      </div>

      <div class="col-12 mb-3" v-if="activePromo.show_as_popup">
        <label for="disclaimer-input">Hide Promo text on Pop-Up<span class="text-danger">*</span></label>
        <b-form-checkbox switch v-model="activePromo.hide_popup_text" class="mb-2">
          {{ activePromo.hide_popup_text ? 'Yes' : 'No'}}
        </b-form-checkbox>
      </div>

      <div class="col-12 mb-3" v-if="activePromo.show_as_popup">
        <label for="popup-redirect">Pop-Up Redirect URL</label>
        <input id="popup-redirect" type="text" placeholder="Redirect URL" class="form-control w-100 search-input" v-model="activePromo.popup_redirect_url">
      </div>

      <template v-if="activePromo.show_as_popup && activePromo.popup_dates_separate">
        <div class="col-6 mb-3">
          <label for="date-start-select">Pop-Up Start Date <span class="text-danger">*</span></label>
          <VueCtkDateTimePicker
            id="popupstartDatepicker"
            v-model="activePromo.popup_date_start"
            :color="$store.state.settings.colors.secondary"
            :button-color="$store.state.settings.colors.primary"
            :only-date="true"
            no-header
            noClearButton
            no-button-now
            label="Select date"
            format="YYYY-MM-DD"
            formatted="ddd, MMM Do, YYYY" />
        </div>
        <div class="col-6 mb-3">
          <label for="date-end-select">Pop-Up End Date <span class="text-danger">*</span></label>
          <VueCtkDateTimePicker
            id="endDatepicker"
            v-model="activePromo.popup_date_end"
            :color="$store.state.settings.colors.secondary"
            :button-color="$store.state.settings.colors.primary"
            :only-date="true"
            no-header
            noClearButton
            no-button-now
            label="Select date"
            format="YYYY-MM-DD"
            formatted="ddd, MMM Do, YYYY" />
        </div>
      </template>

    </div>


    <div slot="modal-footer" v-if="!editing">
      <button type="button" class="btn btn-primary" @click="addNewCoupon" aria-label="Add New Coupon">
        <i v-if="submitting" class="fa fa-spin fa-spinner mr-1"></i>{{ submitting ? 'Saving' : promoText() }} Promo
      </button>
    </div>
    <div slot="modal-footer" v-else>
      <button type="button" class="btn btn-primary" @click="updateCoupon" aria-label="Update Coupon">
        <i v-if="submitting" class="fa fa-spin fa-spinner mr-1"></i>{{ submitting ? 'Saving' : promoText() }} Promo
      </button>
    </div>
  </b-modal>
</template>

<script>
  import searchSuggestions from '@/components/search-suggestions';
  import AdminService from '@/api-services/admin.service';
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
  import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

  export default {
    name: 'AddEditPromo',
    props: {
      currentPromo: {
        type: Object,
      },
      editing: {
        type: Boolean
      },
      couponWidgets: {
        type: Array
      },
      activePopUp: {
        type: Object
      },
    },
    data() {
      return {
        newBundleItem: {
          sku: '',
          quantity: ''
        },
        activePromo: {},
        verifying: false,
        skuExists: false,
        skuInput: '',
        submitting: false,
        changeCategory: false,
        isSearching: false,
        searchKey: null,
        showDropDown: false,
        image: null,
        restrictedZipCode: ""
      };
    },
    components: {
      searchSuggestions,
      VueCtkDateTimePicker
    },
    computed: {
      previewImage() {
        return this.image ? URL.createObjectURL(this.image) : this.activePromo.image;
      },
      searchSuggestions() {
        if(this.$store.state.searchSuggestions) {
          let arr = this.$store.state.searchSuggestions;
          let temp = [];
          const departments = arr.departments && arr.departments.items;
          departments.length && temp.push({ name: 'departments', data: departments });
          return temp;
        }
        else
          return [];
      }
    },
    methods: {
      selectImage(evt) {
        let files = evt.target.files || evt.dataTransfer.files;
        this.image = files[0];
      },
      onAddDepartment(selected) {
        let dept = {
          'dept_id': selected.item.dept_id,
          'dept_name': selected.item.name
        };
        this.searchKey = "";
        this.$refs['search-departments'].key = "";
        this.activePromo.departments.push(dept);
      },
      onAddExemptionDepartment(selected) {
        let dept = {
          'dept_id': selected.item.dept_id,
          'dept_name': selected.item.name
        };
        this.searchKey = "";
        this.$refs['search-departments'].key = "";
        this.activePromo.excluded_departments.push(dept);
      },
      showModal() {
        this.$refs.addEditPromo.show();
        setTimeout(() => {
        this.$refs.description.$el.focus();
        this.$refs.description.$el.blur();
        }, 100);
      },
      setData() {
        this.clearData();

        if(this.editing) {
          this.activePromo = this.currentPromo;
          this.activePromo.auto_apply = this.currentPromo.auto_apply == 1 ? true : false;
          this.activePromo.restrict_departments = this.currentPromo.restrict_departments == 1 ? true : false;
          this.activePromo.exclude_departments = this.currentPromo.exclude_departments == 1 ? true : false;
          this.activePromo.exclude_promo_products = this.currentPromo.exclude_promo_products && this.currentPromo.exclude_promo_products == 1 ? true : false;
          this.activePromo.departments = this.currentPromo.departments ? this.currentPromo.departments : [];
          this.activePromo.excluded_departments = this.currentPromo.excluded_departments ? this.currentPromo.excluded_departments : [];
          this.activePromo.restrict_zipcodes = this.currentPromo.restrict_zipcodes == 1 ? true : false;
          this.activePromo.zipcodes = this.currentPromo.zipcodes ? this.currentPromo.zipcodes : [];
          this.activePromo.show_as_popup = this.currentPromo.show_as_popup == 1 ? true : false;
          this.activePromo.popup_dates_separate = this.currentPromo.popup_dates_separate == 1 ? true : false;
          this.activePromo.hide_popup_text = this.currentPromo.hide_popup_text == 1 ? true : false;

          if (this.currentPromo.sku) {
            this.skuInput = this.currentPromo.sku;
            this.skuExists = true;
          }
        }
      },
      promoText() {
        return this.editing ? 'Update' : 'Add';
      },
      clearData() {
        this.activePromo = {
          'widget_id': '',
          'coupon': '',
          'auto_apply': false,
          'disclaimer': '',
          'discount_type': 'flat',
          'discount': '',
          'bundle': [],
          'bundle_price': '',
          'cart_minimum': '',
          'date_start': '',
          'date_end': '',
          'restrict_departments': false,
          'exclude_promo_products': false,
          'exclude_departments': false,
          'departments': [],
          'excluded_departments': [],
          'restrict_zipcodes': false,
          'zipcodes': [],
          'show_as_popup': false,
          'hide_popup_text': false,
          'popup_dates_separate': false,
          'popup_date_start': '',
          'popup_date_end': '',
          'popup_redirect_url': ''
        };
        this.image = null;
        this.skuInput = '';
        this.newBundleItem = {
          sku: '',
          quantity: ''
        };
      },
      editingCompleted() {
        this.clearData();
        this.verifying = false;
        this.$emit('dataCleared');
      },
      async addBundleItem() {
        if(this.newBundleItem.quantity == '' || this.newBundleItem.quantity <= 0) {
          this.$swal('Please enter valid product quantity.', '', 'error');
          return;
        }

        // Shouldnt be a float
        if(this.newBundleItem.quantity % 1 !== 0) {
          this.$swal('Please enter valid product quantity.', '', 'error');
          return;
        }

        // Confirm if this product is not already part of bundle
        var exists = this.activePromo.bundle && this.activePromo.bundle.some(this.confirmProductStatus);
        if(exists) {
          this.$swal('This product is already part of bundle', '', 'error');
          return;
        }

        let verify = await this.verifyProduct(this.newBundleItem.sku);
        if (verify) {
          this.newBundleItem.title = verify.data.product.title;
          this.newBundleItem.image_url = verify.data.product.image_url;
          if(this.activePromo.bundle)
            this.activePromo.bundle.push(this.newBundleItem);
          else
            this.activePromo.bundle = [this.newBundleItem];
          this.newBundleItem = {};
        } else {
          this.$swal('Product Not Found.', '', 'error');
        }
      },
      confirmProductStatus(product) {
        return product.sku === this.newBundleItem.sku;
      },
      async verifyProduct(sku) {
        this.verifying = true;
        let response = await AdminService.getProductData({ type: 'sku', code: sku });
        if (response.data.status == 'error') {
          this.verifying = false;
          this.skuExists = false;
          return null;
        } else {
          this.verifying = false;
          this.skuExists = true;
          return response;
        }
      },
      deleteBundleItem(index) {
        this.activePromo.bundle.splice(index, 1);
      },
      checkExistingPopUp() {
        if(this.activePromo.show_as_popup == true && this.activePopUp.show_as_popup != false) {
          this.$swal({
            title: `There is a Promo (${this.activePopUp.coupon}) already being shown as Pop-Up. If you ${this.promoText().toLowerCase()} this Promo with Pop-Up option, you will replace the previous Promo.`,
            type: 'warning',
            confirmButtonText: 'Got It!',
            showCancelButton: false
          });
        };
      },
      validateData() {
        if (this.activePromo.coupon == '') {
          return 'Please enter Promo code';
        }

        if (this.activePromo.coupon.includes(' ')) {
          return 'Promo code cannot have spaces.';
        }

        if (this.activePromo.widget_id == '') {
          return 'Please select Promo Type';
        }

        if (this.activePromo.widget_id == 1) {
          if (this.activePromo.bundle.length === 0) {
            return 'Please add bundle Items';
          }

          if (this.activePromo.bundle_price == '' || this.activePromo.bundle_price <= 0) {
            return 'Please enter valid bundle price';
          }
        } else {
          if (this.activePromo.discount_type == '') {
            return 'Please select discount type';
          }

          if (this.activePromo.discount_type == 'percentage' && this.activePromo.discount >= 100) {
            return 'Discount should be less than 100';
          }

          if (this.activePromo.discount == '') {
            return 'Please enter discount';
          }
        }

        if (this.activePromo.widget_id == 2) {
          if (!this.skuExists || this.skuInput == '') {
            return 'Please enter product SKU';
          }
        }

        if (this.activePromo.widget_id == 3 && this.activePromo.restrict_departments && this.activePromo.departments.length == 0) {
          return 'Please select department';
        }

        if (this.activePromo.widget_id == 3 && this.activePromo.exclude_departments && this.activePromo.excluded_departments.length == 0) {
          return 'Please select department which is excluded from this discount';
        }

        if (this.activePromo.widget_id == 4 && this.activePromo.restrict_zipcodes && this.activePromo.zipcodes.length == 0) {
          return 'Please select zip codes for those this discount would apply';
        }

        if (this.activePromo.date_start == '') {
          return 'Please select Promo start date';
        }

        if (this.activePromo.date_end == '') {
          return 'Please select Promo end date';
        }

        if (this.activePromo.show_as_popup == true && (!this.activePromo.image && !this.image)) {
          return 'Please upload an Image for this Promo in order to show it as Pop-Up';
        }

        if (this.activePromo.show_as_popup == true && this.activePromo.popup_dates_separate == true 
          && (this.activePromo.popup_date_start == null || this.activePromo.popup_date_start == '' )) {
          return 'Please select date from which promo pop-up should start display';
        }

        if (this.activePromo.show_as_popup == true && this.activePromo.popup_dates_separate == true 
          && (this.activePromo.popup_date_end == null || this.activePromo.popup_date_end == '')) {
          return 'Please select date after which promo pop-up should stop display';
        }

        return 'success';
      },
      async addNewCoupon() {
        var status = this.validateData();
        if (status == 'success') {
          this.submitting = true;
          let image = null;
          if(this.image) {
            let res = await AdminService.uploadImage(this.image);
            image = res.data.url;
          }
          var data = {
            name: this.activePromo.name,
            description: this.activePromo.description,
            widget_id: this.activePromo.widget_id,
            coupon: this.activePromo.coupon,
            date_start: this.activePromo.date_start,
            date_end: this.activePromo.date_end,
            auto_apply: this.activePromo.auto_apply,
            disclaimer: this.activePromo.disclaimer,
            cart_minimum: this.activePromo.cart_minimum,
            category_id: this.activePromo.category_id,
            restrict_departments: this.activePromo.restrict_departments,
            exclude_departments: this.activePromo.exclude_departments,
            exclude_promo_products: this.activePromo.exclude_promo_products,
            departments: this.activePromo.departments,
            excluded_departments: this.activePromo.excluded_departments,
            restrict_zipcodes: this.activePromo.restrict_zipcodes,
            zipcodes: this.activePromo.zipcodes,
            show_as_popup: this.activePromo.show_as_popup,
            popup_dates_separate: this.activePromo.popup_dates_separate,
            hide_popup_text: this.activePromo.hide_popup_text,
            popup_date_start: this.activePromo.popup_date_start,
            popup_date_end: this.activePromo.popup_date_end,
            popup_redirect_url: this.activePromo.popup_redirect_url
          };

          if(image) data.image = image;

          // Bundle Promo
          if (this.activePromo.widget_id == 1) {
            data.bundle_price = this.activePromo.bundle_price;
            data.bundle = this.activePromo.bundle;
          } else {
            data.discount = this.activePromo.discount;
            data.discount_type = this.activePromo.discount_type;
          }

          // SKU required for widget 2
          if (this.skuExists && this.skuInput != '' && this.activePromo.widget_id != 1) {
            data.sku = this.skuInput;
          }

          AdminService.addNewCoupon(data).then((response) => {
            if (response.data.status == 'success') {
              this.$swal('Promo successfully added.', '', 'success');
              this.submitting = false;
              this.clearData();
              this.$emit('updatePromos');
              this.$refs.addEditPromo.hide();
            } else {
              this.submitting = false;
              this.$swal('Something went wrong while trying to add promo', '', 'error');
            }
          }).catch((err) => {
            this.$swal(err.response.data.message, '', 'error');
            this.submitting = false;
          });
        } else {
          this.$swal(status, '', 'error');
        }
      },
      async updateCoupon() {
        var status = this.validateData();
        if(status == 'success') {
          this.submitting = true;
          let image = null;
          if(this.image) {
            let res = await AdminService.uploadImage(this.image);
            image = res.data.url;
          }

          var data = {
            name: this.activePromo.name,
            description: this.activePromo.description,
            coupon_slug: this.activePromo.slug,
            widget_id: this.activePromo.widget_id,
            coupon: this.activePromo.coupon,
            date_start: this.activePromo.date_start,
            date_end: this.activePromo.date_end,
            auto_apply: this.activePromo.auto_apply,
            disclaimer: this.activePromo.disclaimer,
            cart_minimum: this.activePromo.cart_minimum,
            category_id: this.activePromo.category_id,
            restrict_departments: this.activePromo.restrict_departments,
            exclude_departments: this.activePromo.exclude_departments,
            exclude_promo_products: this.activePromo.exclude_promo_products,
            departments: this.activePromo.departments,
            excluded_departments: this.activePromo.excluded_departments,
            restrict_zipcodes: this.activePromo.restrict_zipcodes,
            zipcodes: this.activePromo.zipcodes,
            show_as_popup: this.activePromo.show_as_popup,
            popup_dates_separate: this.activePromo.popup_dates_separate,
            hide_popup_text: this.activePromo.hide_popup_text,
            popup_date_start: this.activePromo.popup_date_start,
            popup_date_end: this.activePromo.popup_date_end,
            popup_redirect_url: this.activePromo.popup_redirect_url
          };

          if(image) data.image = image;

          // Bundle Promo
          if (this.activePromo.widget_id == 1) {
            data.bundle_price = this.activePromo.bundle_price;
            data.bundle = this.activePromo.bundle;
          } else {
            data.discount = this.activePromo.discount;
            data.discount_type = this.activePromo.discount_type;
          }

          // SKU required for widget 2
          if (this.skuExists && this.skuInput != '' && this.activePromo.widget_id != 1) {
            data.sku = this.skuInput;
          }

          AdminService.updateCoupon(data).then((response) => {
            if (response.data.status == 'success') {
              this.$swal('Promo successfully updated.', '', 'success');
              this.submitting = false;
              this.clearData();
              this.$emit('updatePromos');
              this.$refs.addEditPromo.hide();
            } else {
              this.submitting = false;
              this.$swal('Something went wrong while trying to update promo', '', 'error');
            }
          }).catch((err) => {
            this.$swal(err.response.data.message, '', 'error');
            this.submitting = false;
          });
        } else {
          this.$swal(status, '', 'error');
        }
      },
      removeDepartment(index) {
        this.activePromo.departments.splice(index, 1);
      },
      removeExemptedDepartment(index) {
        this.activePromo.excluded_departments.splice(index, 1);
      },
      searchInputFocus() {
        let targetScroll = document.getElementById('search').getBoundingClientRect().top - 10;
        this.isSearching = true;
        this.isMobile && window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      },
      searchInputBlur() {
        //const keyword = document.getElementById('search').value;
        document.getElementById('search').value = '';
        this.isSearching = false;
        this.searchKey = '';
      },
      getSuggestions(text) {
        if(text == '' || text == undefined) return;
        this.searchKey = text;
        this.$store.dispatch("searchSuggestion", this.searchKey);
      },
      renderSuggestion(suggestion) {
        const item = suggestion.item;
        if(item.parent) {
          return (
            <div>
            <span>{ item.name }</span>
            <span style="color: grey;"> in </span>
            <span style="color: grey; font-size: 11px;">{ item.parent.name }</span>
            </div>
          );
        } else
          return (
            <div>
            <span>{ item.name }</span>
            </div>
          );
      },
      getSuggestionValue(suggestion) {
        let { name, item } = suggestion;
        return name == 'products' ? item.title : item.name;
      },
      removeZipCode(code) {
        const index = this.activePromo.zipcodes.indexOf(code);
        this.activePromo.zipcodes.splice(index, 1);
      },
      addZipCode() {
        if(!this.restrictedZipCode) return;
        this.activePromo.zipcodes.push(this.restrictedZipCode);
        this.restrictedZipCode = "";
      },
    }
  };
</script>

<style scoped lang="scss">

  label {
    font-size: 16px;
    font-weight: bold;
    margin-right: 10px;
  }
  .suggestions-holder {
    max-height: 210px;
    overflow: scroll;
  }
  .suggestion-select-option {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border: 1px solid #e2e2e7;
    margin-bottom: 5px;
  }
  .assign-button {
    border: 2px solid #a3a3a3;
    border-radius: 5px;
    padding: 2px 5px;
    cursor: pointer;
  }

  .assign-button:hover {
    background-color: #17a2b8;
    color: #FFFFFF;
  }

  .bundle-item {
    border: 1px solid lightgray;
    border-radius: 5px;
    padding: 5px;
  }

  .item-description {
    font-size: 14px;
  }

  .department {
    display: flex;
    margin-right: 10px;
    background: var(--primary);
    color: #fff;
    border-radius: 4px;
    font-size: 13px;
    font-weight: bold;
    padding-left: 8px;
    height: 28px;
    align-items: center;
    button {
      background: none;
    }
  }

  .search-wrapper {
    position: relative;
    display: inline-flex;
    flex: 2;

    .search {
      width: 100%;
      position: relative;

      .search-bar {
        width: 100%;
      }
    }
  }

  .zipcode-input {
    border: 1px solid #DEE2E6;
    border-radius: 4px;
  }

  .zipcode-input {
    display: inline-flex;
    flex-wrap: wrap;
    padding: 4px;
    width: 100%;
    background: white;

    .code {
      background: #D9E8EE;
      border-radius: 4px;
      margin: 3px;
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
        background: url("data:image/svg+xml,%3Csvg width='8px' height='8px' viewBox='0 0 8 8' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3EGroup 6%3C/title%3E%3Cg id='Symbols' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Tag' transform='translate(-80.000000, -7.000000)'%3E%3Crect id='Rectangle' opacity='0.149999991' x='0' y='0' width='95' height='22' rx='4'%3E%3C/rect%3E%3Cg id='Group-6' opacity='0.5' transform='translate(81.500000, 8.500000)' stroke='%23035271' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5'%3E%3Cline x1='0' y1='0' x2='5' y2='5' id='Path'%3E%3C/line%3E%3Cline x1='5' y1='0' x2='0' y2='5' id='Path'%3E%3C/line%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E") no-repeat center;
        width: 8px;
        height: 8px;
        padding: 8px;
      }
    }

    .zipcode,
    input {
      margin-bottom: 4px;
    }

    input {
      border: none;
      flex: 1;
    }
  }

  @media screen and (max-width: 415px) {
    :deep(.datetimepicker:not(.inline)) {
       .datepicker {
        position: absolute;
        bottom: 50px !important;
        top: auto !important;
      }
    }
    :deep(#endDatepicker-wrapper) {
      .datetimepicker:not(.inline) {
        .datepicker {
          right: 0 !important;
          left: auto !important;
        }
      }
    }
  }
  .thumb-preview {
    width: 134px;
    height: 134px;
  }
</style>
