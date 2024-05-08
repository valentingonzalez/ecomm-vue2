<template>
  <div v-if="$ezHasNoPermission('edit_products')">
    <no-permission-truevalue page="Product Editor"></no-permission-truevalue>
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <div>
          <h1>Product Editor</h1>

          <a href="#" @click.prevent="$refs.tutorialModal.show()" class="btn btn-tutorial btn-sm text-medium bg-white btn-action">
            <i class="fa fa-play mr-1"></i> Click to Watch Tutorial Video
          </a>
          <b-modal size="lg" ref="tutorialModal">
            <div slot="modal-header">
              <h5>Editing Products</h5>
            </div>
            <div>
              <video class="w-100" poster="/images/cover-product-editor.jpg" controls>
                <source src="https://storage.googleapis.com/content.ezadtv.com/2024/03/06/65e8c14d98b88_Products_Editor.m4v" type="video/mp4">
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
      <p>
        <!--Search for a product in order to edit it.-->
        Edit your product details by starting with a sku or upc number.
        <br>
        <span class="text-muted small">We will automatically show you product details that allow you to edit.</span>
      </p>
      <div class="pb-3 mb-3 border-bottom">
        <div class="row">
          <div v-if="storeLocations.length > 1" class="d-flex justify-content-start mb-4 col-12 col-sm-5">
            <div class="w-100">
              <label for="">Store</label>
              <select @change="getProductData" class="form-control" v-model="selectedStore">
                <option value="-1">All</option>
                <option v-for="s in storeLocations" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
              <template v-if="productLoaded">
                <span class="text-danger d-block py-2">
                  <i class="fa fa-info-circle mr-1"></i>
                  {{ storeWarningText }}
                </span>
              </template>
            </div>
          </div>

          <search-suggestions @onSelected="searchInputSelected" hideFooter="true" hideDepartments="true" hideBrands="true" placeholder="Product Name" v-if="false" />
          <form @submit.prevent="getProductData" class="col-md-7">
            <div class="row small-gutters">
              <div class="col-12 col-sm-9 col-xl-9">
                <label for="">Product</label>
                <div class="d-flex">
                  <select v-model="type" class="form-control w-40 remove-right-rounded" :disabled="productLoading">
                    <option value="sku">SKU</option>
                    <option value="upc">UPC</option>
                  </select>
                  <input class="form-control remove-left-rounded" type="text" v-model="product_code" :placeholder="placeholderText" :disabled="productLoading" />
                </div>
              </div>
              <div class="col-12 col-sm-3 col-xl-3 mt-3 mt-sm-0">
                <label for=""> &nbsp;</label>
                <button type="submit" class="btn btn-outline-primary w-100" :disabled="lookUpButtonDisabled">
                  <span v-if="productLoading" class="spinner-border spinner-border-sm" />
                  <svg class="look-up-icon" width="21" height="21" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 12C9.26142 12 11.5 9.76142 11.5 7C11.5 4.23858 9.26142 2 6.5 2C3.73858 2 1.5 4.23858 1.5 7C1.5 9.76142 3.73858 12 6.5 12Z" stroke="var(--brandPrimary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.5002 15.0002L10.0352 10.5352" stroke="var(--brandPrimary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Look Up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="position-relative card" v-if="productLoaded">
        <div class="preloader position-absolute d-flex justify-content-center pt-5" v-if="productLoading">
          <div class="spinner-border spinner-border mt-5"></div>
        </div>
        <div class="d-flex pb-3 justify-content-between align-items-center custom-card-header">
          <h2 class="h5 mb-0 heading">Product Info</h2>
          <button type="button" @click="saveData" class="btn btn-primary" :disabled="saving">
            <span class="spinner-border spinner-border-sm mr-2" v-if="saving" />
            Save
          </button>
        </div>
        <div :class="['card-body', { 'disabled': saving }]">
          <div class="row mb-4">
            <div class="col-md-6 d-flex flex-column justify-content-between mb-3 mb-md-0">
              <div class="position-relative border border-gray mb-2 flex-grow-1 d-flex align-items-center">
                <template v-if="allImages.length > 1 || allImages[0].image">
                  <a href="#" class="remove-bt" @click.prevent="deleteCurrentImage" aria-label="Delete Image">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1615_7827)"><path d="M4 7H20" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11V17" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11V17" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_1615_7827"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
                  </a>
                  <a href="#" :class="[carouselSlide == 0 ? 'edit-tag-bt-main' : 'edit-tag-bt']" v-if="$refs.imgCarousel" @click.prevent="updateCurrentImageAlt" aria-label="Edit Tag">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1615_7847)"><path d="M6 7.5C6 7.89782 6.15804 8.27936 6.43934 8.56066C6.72064 8.84196 7.10218 9 7.5 9C7.89782 9 8.27936 8.84196 8.56066 8.56066C8.84196 8.27936 9 7.89782 9 7.5C9 7.10218 8.84196 6.72064 8.56066 6.43934C8.27936 6.15804 7.89782 6 7.5 6C7.10218 6 6.72064 6.15804 6.43934 6.43934C6.15804 6.72064 6 7.10218 6 7.5Z" fill="#1E293B"/><path d="M3 6V11.172C3.00011 11.7024 3.2109 12.211 3.586 12.586L11.296 20.296C11.748 20.7479 12.3609 21.0017 13 21.0017C13.6391 21.0017 14.252 20.7479 14.704 20.296L20.296 14.704C20.7479 14.252 21.0017 13.6391 21.0017 13C21.0017 12.3609 20.7479 11.748 20.296 11.296L12.586 3.586C12.211 3.2109 11.7024 3.00011 11.172 3H6C5.20435 3 4.44129 3.31607 3.87868 3.87868C3.31607 4.44129 3 5.20435 3 6Z" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_1615_7847"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
                  </a>
                </template>
                <b-carousel indicators ref="imgCarousel" :interval="0" v-model="carouselSlide" class="w-100">
                  <b-carousel-slide v-for="(img, i) in allImages" :key="'img-' + i">
                    <div class="item" slot="img">
                      <img class="img-fluid" alt="image slot" :src="img.image || '/images/default-img.svg'">
                    </div>
                  </b-carousel-slide>
                </b-carousel>
                <template v-if="allImages.length != 1">
                  <a class="button-prev" href="#" @click.prevent="slidePrev" aria-label="Previous Slide">
                    <svg xmlns='http://www.w3.org/2000/svg' fill='#000' width='8' height='8' viewBox='0 0 8 8'><path d='M5.25 0l-4 4 4 4 1.5-1.5L4.25 4l2.5-2.5L5.25 0z'/></svg>
                  </a>
                  <a class="button-next" href="#" @click.prevent="slideNext" aria-label="Next Slide">
                    <svg xmlns='http://www.w3.org/2000/svg' fill='#000' width='8' height='8' viewBox='0 0 8 8'><path d='M2.75 0l-1.5 1.5L3.75 4l-2.5 2.5L2.75 8l4-4-4-4z'/></svg>
                  </a>
                </template>
              </div>
              <div class="d-flex">
                <b-dropdown id="main-image-dropdown" :class="product.image_url ? 'w-50' : 'w-100'" :disabled="imageLoading || extraLoading">
                  <template #button-content>
                    <div v-if="imageLoading" class="spinner-border spinner-border-sm mr-2" />
                    <svg class="mr-2" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1621_5491)"><path d="M6.75016 14L4.0835 11.3333M4.0835 11.3333L6.75016 8.66667M4.0835 11.3333H13.4168" stroke="var(--primary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.7497 2.00065L13.4163 4.66732M13.4163 4.66732L10.7497 7.33398M13.4163 4.66732H4.08301" stroke="var(--primary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_1621_5491"><rect width="16" height="16" fill="white" transform="matrix(0 -1 1 0 0.75 16)"/></clipPath></defs></svg>
                      Change Main Image
                  </template>
                  <b-dropdown-item href="javascript:void(0)" @click="triggerFileUpload('image-file-upload')">Upload Image</b-dropdown-item>
                  <b-dropdown-item href="javascript:void(0)" @click="uploadImageUrl = true;uploadExtraImageUrl = false">Copy & Paste URL</b-dropdown-item>
                </b-dropdown>
                <b-dropdown id="extra-image-dropdown" v-if="product.image_url" :disabled="imageLoading || extraLoading" class="w-50 ml-1">
                  <template #button-content>
                    <div v-if="extraLoading" class="spinner-border spinner-border-sm mr-2" />
                    <svg class="mr-2" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1621_5479)"><path d="M8.25 3.33398V12.6673" stroke="var(--primary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5835 8H12.9168" stroke="var(--primary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_1621_5479"><rect width="16" height="16" fill="white" transform="translate(0.25)"/></clipPath></defs></svg>
                      Add Another Image
                  </template>
                  <b-dropdown-item href="javascript:void(0)" @click="triggerFileUpload('extra-image-upload')">Upload Image</b-dropdown-item>
                  <b-dropdown-item href="javascript:void(0)" @click="uploadExtraImageUrl = true;uploadImageUrl = false">Copy & Paste URL</b-dropdown-item>
                </b-dropdown>
              </div>
              <input type="file" accept="image/*" class="d-none" ref="image-file-upload" @change="subscriptionFileUpload" />
              <input type="file" accept="image/*" class="d-none" ref="extra-image-upload" @change="extraImageUpload"/>
              <input v-if="uploadImageUrl" :disabled="imageLoading" placeholder="Paste Main Image URL" class="form-control mt-2" type="text" v-model="mainImageUrl" @change="uploadMainImageFromUrl()">
              <input v-if="uploadExtraImageUrl" :disabled="imageLoading" placeholder="Paste Another Image URL" class="form-control mt-2" type="text" v-model="extraImageUrl" @change="uploadExtraImageFromUrl()">
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="label">Title
                  <i v-if="resetAvailable('title')" class="fa fa-refresh ml-1" @click="resetField('title')" v-b-tooltip.hover title="This action will reset the data back to your Point Of Sale value for this field" ></i>
                </label>
                <input class="form-control" type="text" v-model="product.title" placeholder="Title" />
              </div>
              <div class="form-group">
                <label class="label">UPC</label>
                <input class="form-control" disabled="disabled" type="text" v-model="product.upc" placeholder="-" />
              </div>
              <div class="form-group mb-0">
                <label class="label">SKU</label>
                <input class="form-control" disabled="disabled" type="text" v-model="product.sku" placeholder="-" />
              </div>
              <div class="row mt-3">
                <div class="col-md-6 col-sm-3">
                  <div class="custom-control custom-switch">
                    <input type="checkbox" v-model="product.hide_price" class="custom-control-input" id="hide-price">
                    <label class="custom-control-label" for="hide-price" v-html="'Hide Price'"></label>
                  </div>
                </div>
                <div class="col-md-6 col-sm-3">
                  <div class="custom-control custom-switch">
                    <input type="checkbox" v-model="product.hide_product" class="custom-control-input" id="hide-product">
                    <label class="custom-control-label" for="hide-product" v-html="'Hide Product'"></label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group mb-3 col-12 border-bottom font-weight-bold fs-6 pl-0">
            Product Type
          </div>
          <div class="form-group mb-0">
            <ul class="pl-0 d-flex my-2">
              <li class="custom-control custom-radio text-center mr-3">
                <input id="for-sale" type="radio" class="custom-control-input" name="is_rental" v-model="rentalRadio" value="0">
                <label for="for-sale" class="custom-control-label">For Sale</label>
              </li>
              <li class="custom-control custom-radio text-center mr-3">
                <input id="rental" type="radio" class="custom-control-input" name="is_rental" v-model="rentalRadio" value="1">
                <label for="rental" class="custom-control-label">Rental</label>
              </li>
            </ul>
          </div>

          <div class="form-group mb-3 col-12 border-bottom font-weight-bold fs-6 pl-0 mt-4">
            Product Info
          </div>
          <div class="row">
            <div class="form-group col-6 col-sm-4">
              <label class="label">POS Price
                <i v-if="resetAvailable('price')" class="fa fa-refresh ml-1" @click="resetField('price')" v-b-tooltip.hover title="This action will reset the data back to your Point Of Sale value for this field"></i>
              </label>
              <input class="form-control" type="number" v-model="product.price" placeholder="-" min="0" @keydown.189="stopEvents" />
            </div>
            <div class="form-group col-6 col-sm-4">
              <label class="label">Online Price
                <i v-if="resetAvailable('online_price')" class="fa fa-refresh ml-1" @click="resetField('online_price')" v-b-tooltip.hover title="This action will reset the data back to your Point Of Sale value for this field"></i>
              </label>
              <input class="form-control" type="number" v-model="product.online_price" placeholder="-" min="0" @keydown.189="stopEvents" />
            </div>
            <div class="form-group col-6 col-sm-4">
              <label class="label">Cost</label>
              <input class="form-control" type="number" disabled="disabled" v-model="product.cost" placeholder="-" min="0" @keydown.189="stopEvents" />
            </div>
            <template v-if="product.is_rental">
              <div class="form-group col-6 col-sm-4">
              <label class="label">Rental Deposit Amount
              </label>
              <input class="form-control" type="number" v-model="product.rental_deposit_amount" placeholder="Rental Deposit Amount" min="0" @keydown.189="stopEvents" />
            </div>
              <div class="form-group col-6 col-sm-4" v-for="(r, key) in rentalRates" :key="key">
                <div class="d-flex justify-content-between align-items-center">
                    <label class="label">{{ r.header }}</label>
                    <button class="btn btn-outline-primary w-20 h-50 pt-1 pb-1 border-0" v-if="r.custom" @click="removeCustomRate(key)">
                        <svg class="mr-1 cursor-pointer" width="17" height="19" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.667 5.5L15.8 17.642C15.7641 18.1466 15.5383 18.6188 15.1681 18.9636C14.7979 19.3083 14.3109 19.5 13.805 19.5H5.52899C5.02313 19.5 4.53606 19.3083 4.16588 18.9636C3.7957 18.6188 3.56991 18.1466 3.53399 17.642L2.66699 5.5M7.66699 9.5V15.5M11.667 9.5V15.5M12.667 5.5V2.5C12.667 2.23478 12.5616 1.98043 12.3741 1.79289C12.1866 1.60536 11.9322 1.5 11.667 1.5H7.66699C7.40178 1.5 7.14742 1.60536 6.95989 1.79289C6.77235 1.98043 6.66699 2.23478 6.66699 2.5V5.5M1.66699 5.5H17.667" stroke="var(--brandPrimary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        <span class="pt-1">Remove</span>
                    </button>
                </div>

                <input class="form-control" type="text" v-model="r.price" @change="sanitizeNumericInput($event, key)" :placeholder="r.header" />
              </div>
              <div class="form-group col-6 col-sm-4">
                <b-modal size="lg" ref="addCustomRateModal" @hidden="resetNewCustomRateModal" hide-footer>
                  <div slot="modal-header">
                    <h5>
                      Add Custom Rate
                      <button type="button" class="close" @click="$refs.addCustomRateModal.hide()">×</button>
                    </h5>
                  </div>
                  <form @submit.prevent="addNewCustomRate">
                    <div>
                      <div class="form-group mb-4">
                        <label for="title" class="form-label"><b>Add Title</b></label>
                        <input type="text" class="form-control" v-model="newCustomRentalRateTitle" required>
                      </div>
                      <div class="form-group mb-4">
                        <label for="title" class="form-label"><b>Add Rate</b></label>
                        <input type="text" class="form-control" v-model="newCustomRentalRate">
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-outline-secondary" @click="$refs.addCustomRateModal.hide()">Cancel</button>
                      <button type="submit" class="btn btn-primary">Add Custom Rate</button>
                    </div>
                  </form>
                </b-modal>
                <label class="label"> &nbsp;</label>
                <button class="btn btn-outline-primary w-100 ml-1" @click="$refs.addCustomRateModal.show()">
                  <svg class="mr-2" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1621_5479)"><path d="M8.25 3.33398V12.6673" stroke="var(--primary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5835 8H12.9168" stroke="var(--primary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_1621_5479"><rect width="16" height="16" fill="white" transform="translate(0.25)"/></clipPath></defs></svg>
                  Add Custom Rate
                </button>
              </div>
            </template>
            <div class="form-group col-6 col-sm-4">
              <label class="label">Location
                <i v-if="resetAvailable('location')" class="fa fa-refresh ml-1" @click="resetField('location')" v-b-tooltip.hover title="This action will reset the data back to your Point Of Sale value for this field"></i>
              </label>
              <input class="form-control" type="text" v-model="product.location" max="12" placeholder="Product Location" />
            </div>
            <div class="form-group col-6 col-sm-4">
              <label class="label">Model Number
                <i v-if="resetAvailable('model_number')" class="fa fa-refresh ml-1" @click="resetField('model_number')" v-b-tooltip.hover title="This action will reset the data back to your Point Of Sale value for this field"></i>
              </label>
              <input class="form-control" type="text" v-model="product.model_number" placeholder="Model Number" />
            </div>
            <div class="form-group col-6 col-sm-4">
              <label class="label">Limit Order Quantity
                <i class="fa fa-question-circle" v-b-tooltip.hover title="Limit max number"></i>
              </label>
              <input class="form-control" type="number" v-model="product.max_order_quantity" placeholder="Limit Order Quantity" min="0" @keydown.189="stopEvents" />
            </div>
            <div class="form-group mb-2 col-12">
              <label class="label">Description
                <i v-if="resetAvailable('description')" class="fa fa-refresh ml-1" @click="resetField('description')" v-b-tooltip.hover title="This action will reset the data back to your Point Of Sale value for this field"></i>
              </label>
              <ckeditor class="ck-editor" :editor="editor" v-model="product.description" :config="editorConfig"/>
            </div>
          </div>

          <div class="form-group mb-3 col-12 border-bottom font-weight-bold fs-6 pl-0 mt-4" v-if="!product.is_rental">
            Promo Settings
          </div>
          <div class="row" v-if="!product.is_rental">
            <div class="form-group col-6 col-sm-4">
              <label class="label">Promo Unit Price
                <i v-if="resetAvailable('promo_price')" class="fa fa-refresh ml-1" @click="resetField('promo_price')" v-b-tooltip.hover title="This action will reset the data back to your Point Of Sale value for this field"></i>
              </label>
              <input class="form-control" type="number" v-model="product.promo_price" placeholder="-" :disabled="product.online_price != '' && product.online_price != null" min="0" @keydown.189="stopEvents" />
            </div>

            <div class="form-group col-6 col-sm-4">
              <label class="label">Promo Quantity
                <i class="fa fa-question-circle" v-b-tooltip.hover title="If the following quantity is meet, the product will be charged at the 'Promo Unit Price'"></i>
                <i v-if="resetAvailable('promo_quantity')" class="fa fa-refresh ml-1" @click="resetField('promo_quantity')" v-b-tooltip.hover title="This action will reset the data back to your Point Of Sale value for this field"></i>
              </label>
              <input class="form-control" type="number" v-model="product.promo_quantity" placeholder="-" :disabled="product.online_price != ''  && product.online_price != null" min="0" @keydown.189="stopEvents" />
            </div>

            <div class="form-group col-12 col-sm-4">
              <label class="label">Promo Message
                <i class="fa fa-question-circle" v-b-tooltip.hover title="If the following quantity is meet, the product will be charged at the 'Promo Unit Price'"></i>
                <i v-if="resetAvailable('promo_message')" class="fa fa-refresh ml-1" @click="resetField('promo_message')" v-b-tooltip.hover title="This action will reset the data back to your Point Of Sale value for this field"></i>
              </label>
              <input class="form-control" type="text" v-model="product.promo_message" placeholder="Promo Message" :disabled="product.online_price != ''  && product.online_price != null" />
            </div>
          </div>

          <div class="form-group mb-3 col-12 border-bottom font-weight-bold fs-6 pl-0 mt-4" v-if="!product.is_rental">
            Product Dimensions
          </div>
          <div class="row" v-if="!product.is_rental">
            <div class="form-group col-6 col-sm-4">
              <label class="label">Product Weight (lbs)
              </label>
              <input class="form-control" type="number" v-model="product.weight" placeholder="Product Weight (lbs)" min="0" @keydown.189="stopEvents" />
            </div>
            <div class="form-group col-6 col-sm-4">
              <label class="label">Product Width (in)
              </label>
              <input class="form-control" type="number" v-model="product.width" placeholder="Product Width (in)" min="0" @keydown.189="stopEvents" />
            </div>
            <div class="form-group col-6 col-sm-4">
              <label class="label">Product Length (in)
              </label>
              <input class="form-control" type="number" v-model="product.length" placeholder="Product Length (in)" min="0" @keydown.189="stopEvents" />
            </div>
            <div class="form-group col-6 col-sm-4">
              <label class="label">Product Height (in)
              </label>
              <input class="form-control" type="number" v-model="product.height" placeholder="Product Height (in)" min="0" @keydown.189="stopEvents" />
            </div>
          </div>

          <div class="form-group mb-3 col-12 border-bottom font-weight-bold fs-6 pl-0 mt-4" v-if="!product.is_rental">
            Product Settings
          </div>
          <div class="row" v-if="!product.is_rental">
            <div class="form-group mb-3 col-6 col-sm-4">
              <div class="custom-control custom-switch">
                <input type="checkbox" v-model="product.disable_order" class="custom-control-input" id="stop-purchase">
                <label class="custom-control-label" for="stop-purchase" v-html="'Disable Order'">
                </label>
              </div>
            </div>

            <div class="form-group mb-3 col-6 col-sm-4">
              <div class="custom-control custom-switch">
                <input type="checkbox" v-model="product.disable_delivery" class="custom-control-input" id="disable-delivery">
                <label class="custom-control-label" for="disable-delivery" v-html="'Disable Delivery'">
                </label>
              </div>
            </div>

            <div class="form-group mb-3 col-6 col-sm-4">
              <div class="custom-control custom-switch">
                <input type="checkbox" v-model="product.disable_shipping" class="custom-control-input" id="disable-shipping">
                <label class="custom-control-label" for="disable-shipping" v-html="'Disable Shipping'"></label>
              </div>
            </div>

            <div class="form-group col-6 col-sm-4">
              <div class="custom-control custom-switch">
                <input type="checkbox" v-model="product.override_tax_rate" class="custom-control-input" id="override-tax-rate">
                <label class="custom-control-label" for="override-tax-rate" v-html="'Override Tax Rate?'"></label>
              </div>
            </div>

            <div class="form-group col-6 col-sm-4">
              <label class="label">Custom Tax Rate</label>
              <input class="form-control" type="number" v-model="product.tax_rate" :disabled="product.override_tax_rate != true" placeholder="" min="0" @keydown.189="stopEvents" />
            </div>

            <div class="form-group mb-3 col-6 col-sm-3">
              <div class="custom-control custom-switch">
                <input type="checkbox" v-model="product.always_allow_special_order" class="custom-control-input" id="allow-special-order">
                <label class="custom-control-label" for="allow-special-order" v-html="'Always Allow Special Order'"></label>
              </div>
            </div>
          </div>

          <div class="form-group mb-3 col-12 border-bottom font-weight-bold fs-6 pl-0 mt-4">
            Advanced Settings
          </div>
          <div class="row">
            <div class="form-group mb-4 col-12 col-sm-12">
              <label class="label">Available Quantity Buffer
                <i class="fa fa-question-circle" v-b-tooltip.hover title="Products will appear as out of stock/Special Order if the available quantity drops below this value"></i>
              </label>
              <input class="form-control" type="number" v-model="product.cut_off_quantity" placeholder="Available Quantity Buffer" min="0" @keydown.189="stopEvents" />
            </div>

            <div class="form-group mb-4 col-12 col-sm-12">
              <label class="ml-1">Meta Page Description</label>
              <textarea class="form-control" type="text" v-model="product.meta_description" rows="5"></textarea>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end w-100">
          <button type="button" @click="saveData" class="btn btn-primary m-3" :disabled="saving">
            <span class="spinner-border spinner-border-sm mr-2" v-if="saving" />Save
          </button>
        </div>
      </div>
      <template v-if="editedProducts">
        <p class="mt-3">Or pick a product that has been edited before:</p>
        <div class="d-sm-flex">
          <input class="form-control mb-3" type="text" @input="() => searchingEditedProducts = true" v-model="editedProductsSearch" placeholder="Search a product" />
          <VuePagination class="mb-2 mb-sm-0 ml-sm-3" v-if="editedProducts && editedProducts.totalPages > 1" :pages="editedProducts.totalPages" />
        </div>
        <div>
          Filters:
          <ul class="pl-0 d-flex my-2">
            <li class="custom-control custom-radio text-center mr-3">
              <input @change="filterEditedProductsList" id="all" type="radio" autocomplete="off" class="custom-control-input" name="filters" v-model="productFilter" value="" :disabled="searchingEditedProducts">
              <label for="all" class="custom-control-label">All</label>
            </li>
            <li class="custom-control custom-radio text-center mr-3">
              <input @change="filterEditedProductsList" id="hidden" type="radio" autocomplete="off" class="custom-control-input" name="filters" v-model="productFilter" value="hidden" :disabled="searchingEditedProducts">
              <label for="hidden" class="custom-control-label">Marked hidden</label>
            </li>
            <li class="custom-control custom-radio text-center mr-3">
              <input @change="filterEditedProductsList" id="price" type="radio" autocomplete="off" class="custom-control-input" name="filters" v-model="productFilter" value="price" :disabled="searchingEditedProducts">
              <label for="price" class="custom-control-label">Changed price</label>
            </li>
            <li class="custom-control custom-radio text-center mr-3">
              <input @change="filterEditedProductsList" id="promo" type="radio" autocomplete="off" class="custom-control-input" name="filters" v-model="productFilter" value="promo_price" :disabled="searchingEditedProducts">
              <label for="promo" class="custom-control-label">Changed promo</label>
            </li>
            <li class="custom-control custom-radio text-center mr-3">
              <input @change="filterEditedProductsList" id="title" type="radio" autocomplete="off" class="custom-control-input" name="filters" v-model="productFilter" value="title" :disabled="searchingEditedProducts">
              <label for="title" class="custom-control-label">Changed title</label>
            </li>
          </ul>
        </div>
        <div class="position-relative edited-products">
          <div v-if="searchingEditedProducts" class="spinner-border spinner-border position-absolute mr-2" />
          <template v-if="editedProducts.products && editedProducts.products.length">
            <table class="d-none d-lg-table table" :class="{'disabled': searchingEditedProducts}">
              <thead>
                <tr>
                  <th class="border-0"></th>
                  <th class="border-0">Name</th>
                  <th class="border-0">SKU</th>
                  <th class="border-0"></th>
                </tr>
              </thead>
              <tbody>
                <tr class="cursor-pointer" @click="editedProductClick(product.sku)" v-for="product in editedProducts.products" :key="product.sku">
                  <td align="center">
                    <img :src="product.image_url || '/images/default-img.svg'" style="max-width: 50px; max-height: 50px;" alt="Product Image" />
                  </td>
                  <td>
                    <div class="name text-capitalize text-wrap" :data-tooltip="product.title">{{product.title}}</div>
                  </td>
                  <td>{{product.sku}}</td>
                  <td class="text-danger">{{product.c_hidden ? 'hidden' : ''}}</td>
                </tr>
              </tbody>
            </table>
            <div class="row small-gutters d-lg-none" v-if="editedProducts.products.length" :class="{'disabled': searchingEditedProducts}">
              <div class="col-6 mb-2" v-for="product in editedProducts.products" :key="product.sku">
                <div class="card p-4 h-100">
                  <div />
                  <div class="mb-2 text-center flex-grow-1">
                    <img :src="product.image_url || '/images/default-img.svg'" style="max-width: 50px; max-height: 50px;" alt="Product Image" />
                    <div class="data">{{ product.title }}</div>
                  </div>
                  <div class="d-flex align-items-center justify-content-between w-100 mb-1">
                    <b>SKU</b><div class="data">{{ product.sku }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-else-if="!searchingEditedProducts && editedProductsSearch && editedProductsSearch.length">There are no results for <b>{{ editedProductsSearch }}</b></div>
          <div v-else-if="!editedProducts.length">There are no products to show</div>
        </div>
      </template>
    </div>
    <alt-images ref="altImageModal" :productImageAlt="currentImageAlt" :index="currentImageIndex" @altChanged="setImgAlt"/>
  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import NoPermissionTruevalue from "./no-permission-truevalue";
  import ProductService from '@/api-services/product.service';
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
  import searchSuggestions from '@/components/search-suggestions';
  import { debounce } from 'debounce';

  export default {
    name: 'productEditor',
    components: {
      NoPermissionTruevalue,
      searchSuggestions,
    },
    data() {
      return {
        type: 'sku',
        saving: false,
        product_code: "",
        product: {
          id: "",
          business_id: "",
          price: "",
          cost: "",
          location: "",
          title: "",
          promo_price: "",
          promo_quantity: "",
          promo_message: "",
          description: "This is a very very long description of some stuff I want to tell everyone but can't so if you know me",
          image_url: "",
          model_number: "",
          online_price: "",
          hide_product: false,
          hide_price: false,
          hide_quantity: false,
          disable_order: false,
          disable_delivery: false,
          disable_shipping: false,
          max_order_quantity: null,
          meta_description: null,
          cut_off_quantity: null,
          is_rental: null,
          override_tax_rate: false,
          always_allow_special_order: false,
          tax_rate: null,
          weight: null,
          length: null,
          width: null,
          height: null,
          rental_deposit_amount: null,
        },
        origProduct: {
          price: "",
          cost: "",
          location: "",
          title: "",
          promo_price: "",
          promo_quantity: "",
          description: "",
          image_url: "",
          model_number: "",
          online_price: "",

        },
        productLoaded: false,
        productLoading: false,
        imageLoading: false,
        extraLoading: false,
        extraImages: [],
        extraImagesToDelete: [],
        extraSourceImages: [],
        carouselSlide: 0,
        errors: {},
        fieldsRequired: ['title', 'price'],
        editor: ClassicEditor,
        editorConfig: {
          removePlugins: ['Heading'],
          toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList']
        },
        mainImgAlt: null,
        currentImageAlt: null,
        currentImageIndex: null,
        editedProducts: null,
        editedProductsSearch: '',
        searchingEditedProducts: false,
        editedProductsPage: 1,
        watchEditedProductsSearch: false,
        productFilter: '',
        selectedStore: -1,
        newCustomRentalRateTitle: null,
        newCustomRentalRate: '',
        mainImageUrl: '',
        uploadImageUrl: false,
        extraImageUrl: '',
        uploadExtraImageUrl: false,
        source_image_url: "",
      };
    },
    computed: {
      rentalRadio: {
        get() {
          return this.product.is_rental ? '1' : '0';
        },
        set(value) {
          this.product.is_rental = value === '1';
        },
      },
      // isTruevalue() {
      //   return this.$root.$children[0].isTruevalue;
      // },
      rentalOptions() {
        return this.product.original_location ? this.product.original_location.substr(0, 3) != '_ez' : true;
      },
      rentalRates() {
        let ret = JSON.parse(this.product.rental_rates);
        return ret.length && JSON.parse(this.product.rental_rates) || [
          { header: '4Hour', price: '' },
          { header: 'Day', price: '' },
          { header: 'Weekend', price: '' },
          { header: 'Week', price: '' }
        ];
      },
      lookUpButtonDisabled() {
        return this.productLoading || this.$route.query.code == this.product_code;
      },
      placeholderText(){
        return this.type === 'sku' ? 'Enter Product Sku' : 'Enter Product UPC';
      },
      allImages() {
        let extraImages = this.extraImages || [];
        return [{image: this.product.image_url}, ...extraImages];
      },
      storeLocations() {
        return this.$store.state.storeLocations;
      },
      selectedStoreName() {
        return this.selectedStore != -1 ? this.storeLocations.find(s => s.business_id == this.selectedStore).name : "";
      },
      storeWarningText() {
        return this.selectedStore == -1 ? "The product edits here will be applied to all of your store locations" :
          "You are currently only editing this product for the " + this.selectedStoreName + " location";
      }
    },
    async mounted() {
      if (this.$ezHasNoPermission("edit_products")) return;

      if(this.$route.params.random == 'random') {
        this.type = 'sku';
        this.productLoading = true;
        let x = await ProductService.getRandomProducts({dept_id: 1,limit: 1});
        this.product_code = x.data.data.data[0].sku;
        this.fetchProductData();
      }
      else if(this.$route.query.code) {
        this.product_code = this.$route.query.code;
        this.selectedStore = this.$route.query.store || -1;
        this.fetchProductData();
      }
      this.editedProductsSearch = this.$route.query.search;
      await this.getEditedProducts();
    },
    methods: {
      sanitizeNumericInput(event, key) {
        let rentalRates = JSON.parse(this.product.rental_rates);

        rentalRates[key].price = event.target.value;
        this.product.rental_rates = JSON.stringify(rentalRates);

        const sanitizedValue = event.target.value.replace(/[^0-9.]/g, '');
        rentalRates[key].price = sanitizedValue;
        this.product.rental_rates = JSON.stringify(rentalRates);
      },
      addNewCustomRate() {
        const rates = this.rentalRates;
        rates.push({ header: this.newCustomRentalRateTitle, price: this.newCustomRentalRate, custom: true });
        this.product.rental_rates = JSON.stringify(rates);
        this.$refs.addCustomRateModal.hide();
      },
      resetNewCustomRateModal() {
        this.newCustomRentalRate = '';
        this.newCustomRentalRateTitle = null;
      },
      removeCustomRate(rateIndex) {
        const rates = this.rentalRates.filter((r, index) => index !== rateIndex);
        this.product.rental_rates = JSON.stringify(rates);
      },
      filterEditedProductsList() {
        this.getEditedProducts(this.productFilter);
      },
      async getEditedProducts(filter = null) {
        this.searchingEditedProducts = true;
        let params = { page: this.$route.query.page || 1, search: this.editedProductsSearch };
        if(filter)
          params.filter = filter;
        return await AdminService.getEditedProducts(params).then(resp => {
          this.searchingEditedProducts = false;
          if(resp.data.status == 'success')
            this.editedProducts = resp.data.data;
        });
      },
      stopEvents(evt) {
        evt.stopPropagation();
        evt.preventDefault();
      },
      slidePrev() {
        this.$refs.imgCarousel.prev();
      },
      slideNext() {
        this.$refs.imgCarousel.next();
      },
      searchInputSelected(selected) {
        this.type = 'sku';
        this.product_code = selected.item.sku;
        this.getProductData();
      },
      editedProductClick(sku) {
        this.type = 'sku';
        this.product_code = sku;
        window.scrollTo({top: 245, behavior: 'smooth'});
        this.getProductData();
      },
      getProductData(){
        this.$router.push({ query: Object.assign({}, this.$route.query, { code: this.product_code, type: this.type, store: this.selectedStore }) }).catch(err => console.log(err));
      },
      fetchProductData() {
        this.productLoading = true;
        AdminService.getProductData({ type: this.$route.query.type || this.type, code: this.$route.query.code || this.product_code, business_id: this.$route.query.store || this.selectedStore }).then(result => {
          this.productLoading = false;
          if(result.data.status === 'error') {
            this.$swal(result.data.message, '', 'error');
         } else {
            this.productLoaded = true;
            this.product = result.data.product;
            this.mainImgAlt = this.product.main_img_alt ? this.product.main_img_alt : null;
            this.origProduct = result.data.original;
            this.extraImages = result.data.images || [];
            this.rentalRadio = this.product.is_rental ? '1' : '0';
            this.extraSourceImages = [];
            this.source_image_url = "";
            this.extraImagesToDelete = [];
          }
        }, error => {
          console.log('error', error);
        }).catch(error => {
          console.log('catch error', error);
        });
      },
      async saveData() {
        this.saving = true;
        let validationField = "";
        this.fieldsRequired.forEach(field => {
          if(!this.product[field]){
            validationField = field;
          }
        });

        if(validationField != "") {
          this.$swal(`${validationField} cannot be set to empty`, '', 'error');
          this.saving = false;
          return;
        }

        if((this.product.price && this.product.price <= 0) && (!this.product.is_rental || this.product.is_rental != 1)) {
          this.$swal('Price should be greater than 0', '', 'error');
          this.saving = false;
          return;
        }

        if(this.product.promo_message && (!this.product.promo_quantity)) {
          this.$swal('Please specify the promo quantity', '', 'error');
          this.saving = false;
          return;
        }

        if(this.product.promo_quantity && (!this.product.promo_message)) {
          this.$swal('Please specify the promo message', '', 'error');
          this.saving = false;
          return;
        }

        if((this.product.promo_message || this.product.promo_quantity) && (!this.product.promo_price)) {
          this.$swal('Please specify the promo price', '', 'error');
          this.saving = false;
          return;
        }

        if(this.product.location && this.product.location.length > 12) {
          this.$swal('Location must be less than 12 characters.', '', 'error');
          this.saving = false;
          return;
        }

        await AdminService.updateProductData({
          id: this.product.id,
          business_id: this.product.business_id,
          selected_store: this.selectedStore != -1 ? this.selectedStore : null,
          title: this.product.title,
          price: this.product.price,
          cost: this.product.cost,
          location: this.product.location,
          description: this.product.description,
          model_number: this.product.model_number,
          promo_price: this.product.promo_price,
          promo_quantity: this.product.promo_quantity,
          promo_message: this.product.promo_message,
          online_price: this.product.online_price,
          image_url: this.product.image_url,
          extra_images: this.extraImages,
          extra_source_images: this.extraSourceImages,
          extra_images_to_delete: this.extraImagesToDelete,
          rental_rates: JSON.stringify(this.rentalRates),
          is_rental: this.product.is_rental,
          source_image_url: this.source_image_url,
          extra: {
            hide_product: this.product.hide_product,
            hide_price: this.product.hide_price,
            hide_quantity: this.product.hide_quantity,
            disable_order: this.product.disable_order,
            disable_delivery: this.product.disable_delivery,
            disable_shipping: this.product.disable_shipping,
            max_order_quantity: this.product.max_order_quantity,
            meta_description: this.product.meta_description,
            main_img_alt: this.mainImgAlt ? this.mainImgAlt : '',
            cut_off_quantity: this.product.cut_off_quantity,
            override_tax_rate: this.product.override_tax_rate,
            always_allow_special_order: this.product.always_allow_special_order,
            tax_rate: this.product.tax_rate,
            weight: this.product.weight,
            width: this.product.width,
            length: this.product.length,
            height: this.product.height,
            rental_deposit_amount: this.product.rental_deposit_amount,
          }
        })
        .then(result => {
          if(result.data.status === 'success') {
            this.extraImagesToDelete.forEach(data => AdminService.deleteProductImage(data));
            this.$swal('Success', 'Product Updated!', 'success');
            if(this.$route.query.redirect_back == '1') {
              this.$router.go(-1);
            }
          } else if(result.data.status === 'error') {
            this.$swal(result.data.errors, 'Unable to update product', 'error');
          }
        })
        .catch(error =>this.$swal('Error', error.response.data.message ? error.response.data.message : 'Unable to update product', 'error'));

        this.saving = false;
        this.productLoaded = false;
        this.$router.replace({ ...this.$router.currentRoute, query: {code: undefined, type: undefined}});
        this.product_code = null;
        this.type = 'sku';

        if(!this.editedProducts.products.find(e => e.sku == this.product.sku))
          this.editedProducts.products.push(this.product);

        this.editedProducts.products.find(e => e.sku == this.product.sku).image_url = this.product.image_url;
      },
      triggerFileUpload(id) {
        this.uploadImageUrl = false;
        this.$refs[id].click();
      },
      subscriptionFileUpload() {
        this.imageLoading = true;
        const files = this.$refs['image-file-upload'].files;
        AdminService.uploadProductImage(files[0]).then((result)=> {
          this.imageLoading = false;
          this.mainImageUrl = result.data.url;
          this.uploadMainImageFromUrl('no');
        }).catch(err => {
          console.log(err);
          this.$swal('Error', err.response.data.errors.image.join('.<br>'), 'error');
          this.imageLoading = false;
        });
      },
      uploadMainImageFromUrl(uploadSource = 'yes') {
        if(!this.mainImageUrl.startsWith("http")) {
          this.$swal('Error', 'Please enter a valid URL', 'error');
          return;
        }
        this.imageLoading = true;
        
        let formData = new FormData();
        formData.append('image_url', this.mainImageUrl);
        formData.append('upload_source', uploadSource);

        AdminService.uploadImageFromUrl(formData)
          .then(result => {
            if(result.data.status == 'success') {
              this.product.image_url = result.data.url;
              this.source_image_url = result.data.source_image_url;
              this.uploadImageUrl = false;
            } else {
              this.$swal('Error', result.data.message, 'error');
            }
          })
          .catch(err => {
            this.$swal('Error', err.response.data.errors.image.join('.<br>'), 'error');
          }).finally(() => {
            this.mainImageUrl = '';
            this.imageLoading = false;
          });
      },
      extraImageUpload() {
        this.extraLoading = true;
        const files = this.$refs['extra-image-upload'].files;
        AdminService.uploadProductImage(files[0]).then((result) => {
          this.extraLoading = false;
          this.extraImageUrl = result.data.url;
          this.uploadExtraImageFromUrl('no');
          setTimeout(() => {
            this.carouselSlide = this.extraImages.length;
          }, 100);
        }).catch(err => {
          console.log(err);
          this.$swal('Error', err.response.data.errors.image.join('.<br>'), 'error');
          this.imageLoading = false;
        });
      },
      uploadExtraImageFromUrl(uploadSource = 'yes') {
        if(!this.extraImageUrl.startsWith("http")) {
          this.$swal('Error', 'Please enter a valid URL', 'error');
          return;
        }
        this.extraLoading = true;

        let formData = new FormData();
        formData.append('image_url', this.extraImageUrl);
        formData.append('upload_source', uploadSource);

        AdminService.uploadImageFromUrl(formData)
            .then(result => {
              if(result.data.status == 'success') {
                this.uploadExtraImageUrl = false;
                var newImage = {
                  sku: this.product.sku,
                  image: result.data.url
                };
                let newExtraImage = {
                  result_image_url: result.data.url,
                  source_image_url: result.data.source_image_url
                };
                this.extraSourceImages.push(newExtraImage);
                this.extraImages.push(newImage);
                setTimeout(() => {
                  this.carouselSlide = this.extraImages.length;
                }, 100);
              } else {
                this.$swal('Error', result.data.message, 'error');
              }
            })
            .catch(err => {
              this.$swal('Error', err.response.data.errors.image.join('.<br>'), 'error');
            }).finally(() => {
              this.extraImageUrl = '';
              this.extraLoading = false;
            });
      },
      resetAvailable(field) {
        return this.product[field] != this.origProduct[field];
      },
      resetField(field) {
        this.product[field] = this.origProduct[field];
      },
      async deleteCurrentImage() {
        var index = Number(this.$refs.imgCarousel.value) - 1;
        let img = index < 0 ? this.product.image_url : this.extraImages[index].image;
        this.$swal({
          title: 'Delete Image',
          html: "<div class='row justify-content-center mb-1'>Are you sure you want to delete this image?</div><div class='container'><img src='" + img + "' class='img-fluid'></div",
          showCloseButton: true,
          showCancelButton: true
        }).then((result) => {
          if (result.value) {
            if(index < 0) {
              if(this.extraImages.length) {
                this.extraImagesToDelete.push({
                  id: this.extraImages[0].id,
                  sku: this.product.sku,
                  image: this.extraImages[0].image
                });
              }
              this.product.image_url = this.extraImages.length ? this.extraImages.shift().image : null;
            } else {
              if (this.extraImages[index].id) {
                this.extraImagesToDelete.push({
                  id: this.extraImages[index].id,
                  sku: this.product.sku,
                  image: this.extraImages[index].image
                });
              }
              const image = this.extraImages[index]['image'];
              this.extraSourceImages = this.extraSourceImages.filter(extraImage => extraImage.result_image_url !== image);
              
              if(index > 0 && index > this.extraImages.length - 2) {
                this.carouselSlide = index;
              }
              if(this.extraImages.length == 1) {
                this.carouselSlide = -1;
              }
              setTimeout(() => {
                this.extraImages.splice(index, 1);
              }, 1000);
            }

            /*
              AdminService.deleteProductImage(data).then((response) => {
                if (response.status == 200) {
                  this.extraImages.splice(index, 1);
                  this.carouselSlide = 0;
                  this.$swal('Deleted', 'Successfully deleted image', 'success');
                }
              }).catch((err) => {
                this.$swal("Error", err.response.data.message, "error");
              });
            if (this.extraImages[index].id) {
              var data = {
                id: this.extraImages[index].id,
                sku: this.product.sku,
                image: this.extraImages[index].image
              };
            } else {
              this.extraImages.splice(index, 1);
              this.carouselSlide = 0;
              this.$swal('Deleted', 'Successfully deleted image', 'success');
            }
            */
          }
        });
      },
      updateCurrentImageAlt() {
        var index = Number(this.$refs.imgCarousel.value) - 1;
        if (index == -1) {
          this.currentImageAlt = this.mainImgAlt;
          this.currentImageIndex = index;
        } else {
          this.currentImageAlt = this.extraImages[index].alt_tag;
          this.currentImageIndex = index;
        }
        this.$refs.altImageModal.showModal();
      },
      setImgAlt(value) {
        if (value.index == -1) {
          this.mainImgAlt = value.alt_tag;
        } else {
          this.extraImages[value.index].alt_tag = value.alt_tag;
        }
      },
      gotoPage() {
        this.$router.push({ query: Object.assign({}, this.$route.query, { search: this.editedProductsSearch, page: this.editedProductsPage }) }).catch(err => console.log(err));
        this.getEditedProducts();
      }
    },
    watch: {
      editedProductsSearch: debounce(async function() {
        if(!this.watchEditedProductsSearch) {
          this.watchEditedProductsSearch = true;
          return;
        }
        this.editedProductsPage = 1;
        this.gotoPage();
      }, 1500),
      type(val) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { type: val }) }).catch(err => console.log(err));
      },
      '$route.query.page'() {
        this.getEditedProducts();
      },
      $route(to, from) {
        if((to.query.code == from.query.code && to.query.store == from.query.store)|| !to.query.code || !to.query.type) {
          return;
        } else {
          this.fetchProductData();
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  :deep(.ck-editor__editable) {
    min-height: 250px;
  }
  label.label {
    margin-bottom: 5px;
  }
  #socialInputs {
    input[type=text] {
      width: 100%;
    }
    .social-img {
      width: 100px;
      display: flex;
      justify-content: center;
      + .form-group {
        width: 290px;
      }
    }
  }
  .preloader {
    z-index: 16;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,.7);
  }
  .valid input {
    border-color: var(--secondary);
  }
  .form-group--error input {
    border-color: red;
  }
  .carousel.slide {
    height: 100%;
    align-items: center;
    display: flex;
    :deep(.carousel-indicators) {
      li {
        width: 8px;
        height: 8px;
        background: var(--primary);
        padding: 0;
        border-radius: 50%;
        border: none;
      }
    }
  }
  .carousel-item {
    .item {
      height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        max-height: 100%;
      }
    }
  }
  .remove-bt {
    position: absolute;
    top: 10px;
    right: 38px;
    transform: translateX(-50%);
    z-index: 2;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .edit-tag-bt {
    position: absolute;
    top: 10px;
    right: 0px;
    transform: translateX(-50%);
    z-index: 2;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .edit-tag-bt-main {
    position: absolute;
    top: 10px;
    right: 0px;
    transform: translateX(-50%);
    z-index: 2;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button-prev,
  .button-next {
    filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, .2));
    position: absolute;
    top: 50%;
    svg {
      transform: scale(2.5) translateY(-50%) !important;
      fill: var(--primary);
    }
  }
  .button-prev {
    left: 10px;
  }
  .button-next {
    right: 10px;
  }

  :deep(.pagination) {
    .page-link {
      height: 43px;
      min-width: 40px;
    }
  }

  .single {
    :deep(.carousel-control-prev),
    :deep(.carousel-control-next) {
      display: none;
    }
  }
  .edited-products {
    .spinner-border {
      top: 30px;
      left: 50%;
      transform: transitionX(-50%);
      z-index: 1;
    }
    td {
      vertical-align: middle;
      padding: .5rem;
    }
  }

  @media (max-width: 500px) {
    #socialInputs {
      .social-img {
        width: 40px;
        display: none;
        img {
          width: 100%;
        }
      }
      .social-img + .form-group {
        flex: 1;
      }
    }
  }
  .custom-control-input ~ label.custom-control-label {
    cursor: pointer;
    color:#212529
  }
  .fs-6 {
      font-size: 1rem!important;
  }
  .custom-card-header {
      padding: 0.75rem 1.25rem;
      margin-bottom: 0;
      background-color: transparent !important;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  }
  .w-40 {
    width: 40%
  }
  .remove-left-rounded {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .remove-right-rounded {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .look-up-icon {
    margin-left: -33px;
    margin-right: 18px;
  }
  .modal-footer {
      border: none !important;
  }
  .modal-header .close {
      font-size: 1.5rem;
      font-weight: 500;
      line-height: 1;
      color: #161e2e;
      opacity: .5;
      position: absolute;
      right: 42px;
      font-size: 30px;
  }
  #main-image-dropdown ::v-deep button {
    background: transparent !important;
    border: 1px solid !important;
    font-weight: 100 !important;
    border: 1px solid var(--primary) !important;
    color: var(--primary) !important;
  }
  #main-image-dropdown ::v-deep button:hover {
    background: #f3ebec !important;
    border: 1px solid !important;
    font-weight: 100 !important;
    border: 1px solid var(--primary) !important;
    color: var(--primary) !important;
  }
  #main-image-dropdown ::v-deep ul {
    width: 100% !important;
  }
  #extra-image-dropdown ::v-deep button {
    background: transparent !important;
    border: 1px solid !important;
    font-weight: 100 !important;
    border: 1px solid var(--primary) !important;
    color: var(--primary) !important;
  }
  #extra-image-dropdown ::v-deep button:hover {
    background: #f3ebec !important;
    border: 1px solid !important;
    font-weight: 100 !important;
    border: 1px solid --var('primary') !important;
    color: --var('primary') !important;
  }
  #extra-image-dropdown ::v-deep ul {
    width: 100% !important;
  }
</style>
