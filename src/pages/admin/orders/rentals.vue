<template>
    <div v-if="$ezHasNoPermission('manage_orders') && !showRentals" class="container d-flex align-items-center justify-content-center mt-3">
      <NoPermission :showContact="true" />
    </div>
    <div v-else-if="!showRentals" class="container d-flex align-items-center justify-content-center mt-3">
      <div class="bg-white container d-flex justify-content-center align-items-center" style="height: 600px">
        <div class="text-center">
          <h2 class="font-weight-bold">Get in touch with your account manager to learn more about this now!</h2>
          <button v-b-modal.upgrade-modal class="btn btn-primary" type="button">Contact Me For More Info</button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="pt-4">
        <div class="container">
          <h4 class="m-0 mb-3">Rentals</h4>
          <div class="mt-md-4">
            <div :class="!isMobileWidth ? 'card' : ''">              
              <div v-if="!isMobileWidth" class="p-3 d-flex flex-column flex-md-row justify-content-end align-items-md-center">
                <b-form-select
                  v-model="rentals.filters.status"
                  :options="statuses"
                  class="form-control m-1">
                </b-form-select>

                <b-form-datepicker
                  placeholder="From Date"
                  v-model="rentals.filters.from_date"
                  class="form-control datepicker m-1"
                >
                </b-form-datepicker>

                <b-form-datepicker
                  placeholder="To Date"
                  v-model="rentals.filters.to_date"
                  class="form-control datepicker m-1"
                >
                </b-form-datepicker>

                <button class="btn-action text-tiny m-1" @click="resetFilters()">
                  Clear
                </button>
              </div>
              <div v-else>
                <div class="d-md-flex align-items-md-center" :class="pageWidth > 470 ? 'row justify-content-between pl-3 pr-3' : 'pt-2 pr-2'">
                  <div class="mb-md-0" :style="{ ...(pageWidth > 470 ? { 'padding-right': '15px' } : { 'padding-right': '0px' }), flex: '1 0 0' }">
                    <b-form-datepicker 
                      :style="isMobileWidth && pageWidth < 576 ? { 'max-width': pageWidth - 40 + 'px !important' } : { 'max-width': pageWidth - 70 + 'px !important' }"
                      size="sm"
                      placeholder="From Date"
                      v-model="rentals.filters.from_date"
                      class="form-control datepicker m-1">
                    </b-form-datepicker>
                  </div>
                  <div class="mb-md-0" :style="{ ...(pageWidth > 470 ? { 'padding-right': '15px' } : { 'padding-right': '0px' }), flex: '1 0 0' }">
                    <b-form-datepicker 
                      :style="isMobileWidth && pageWidth < 576 ? { 'max-width': pageWidth - 40 + 'px !important' } : { 'max-width': pageWidth - 70 + 'px !important' }"
                      size="sm"
                      placeholder="To Date"
                      v-model="rentals.filters.end_date"
                      class="form-control datepicker m-1">
                    </b-form-datepicker>
                  </div>
                  <div class="mb-md-0">
                    <button class="btn btn-sm btn-action text-tiny m-1" @click="resetFilters()">
                      Clear
                    </button>
                  </div>
                </div>
                <div class="row mt-3 d-flex justify-content-between align-items-center pb-1" style="padding-left: 20px; padding-right: 20px;">
                  <div class="mb-md-0 mt-1" v-html="resultsText(rentals)" />
                  <div class="d-flex justify-content-end">
                    <div class="svg-container">
                      <svg class="svg-under cursor-pointer" @click="openMobileFiltersPanel" xmlns="http://www.w3.org/2000/svg" width="36" height="32" fill="none"><g filter="url(#a)"><rect width="32" height="28" x="2" y="1" fill="#fff" rx="4"/><path fill="#334155" fill-rule="evenodd" d="M12.4 9.4a.8.8 0 0 1 .8-.8h9.6a.8.8 0 0 1 .8.8v2.4a.8.8 0 0 1-.234.566L19.6 16.13V19a.8.8 0 0 1-.234.566l-1.6 1.6A.8.8 0 0 1 16.4 20.6v-4.469l-3.766-3.765a.8.8 0 0 1-.234-.566V9.4Z" clip-rule="evenodd"/><rect width="31" height="27" x="2.5" y="1.5" stroke="#CBD5E1" rx="3.5"/></g><defs><filter id="a" width="36" height="32" x="0" y="0" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="1"/><feGaussianBlur stdDeviation="1"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_971_131786"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_971_131786" result="shape"/></filter></defs></svg>
                    </div>
                  </div>
                </div>
              </div>
              <div class="table-wrapper text-center" :class="{'loading' : rentals.loading}">
                <div v-if="isMobileWidth" class="panel-container" :class="{ 'panel-open': isMobileFiltersPanelOpened }" @click.self="closeMobileFiltersPanel">
                  <div class="panel-content">
                    <div class="panel-header">
                      <h6 class="panel-heading">Filters</h6>
                      <button class="close-button" @click="closeMobileFiltersPanel">X</button>
                    </div>
                    <div class="spinner-wrapper">
                      <div class="spinner-border" role="status"></div>
                    </div>
                    <!-- Claimed section -->
                    <div class="filter-section">
                      <h6 class="filter-heading">From Date</h6>
                      <div class="container">
                        <div class="row mb-3 ml-1" v-for="fds in fromDateSort" :key="fds.id">
                          <input
                            class="styled-radio"
                            :id="`fds-${fds.id}`"
                            :value="fds.value"
                            type="radio"
                            v-model="selectedFromDateSort"
                          />
                          <label class="ml-2 mb-0" :for="`fds-${fds.id}`">{{ fds.label }}</label>
                        </div>
                      </div>
                      <h6 class="filter-heading">To Date</h6>
                      <div class="container">
                        <div class="row mb-3 ml-1" v-for="tds in toDateSort" :key="tds.id">
                          <input
                            class="styled-radio"
                            :id="`tds-${tds.id}`"
                            :value="tds.value"
                            type="radio"
                            v-model="selectedToDateSort"
                          />
                          <label class="ml-2 mb-0" :for="`tds-${tds.id}`">{{ tds.label }}</label>
                        </div>
                      </div>
                      <h6 class="filter-heading">Date Added</h6>
                      <div class="container">
                        <div class="row mb-3 ml-1" v-for="das in dateAddedSort" :key="das.id">
                          <input
                            class="styled-radio"
                            :id="`das-${das.id}`"
                            :value="das.value"
                            type="radio"
                            v-model="selectedDateAddedSort"
                          />
                          <label class="ml-2 mb-0" :for="`das-${das.id}`">{{ das.label }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="spinner-wrapper">
                  <div class="spinner-border" role="status"></div>
                </div>
  
                <vue-good-table class="p-0 m-0" @on-sort-change="onSortChange" styleClass="table" :columns="rentalsColumns" :rows="rentals.data">
                    <template slot="table-row" slot-scope="props">
                      <div :style="{ width: mobileRowWidth, maxWidth: mobileFirstRowWidth, paddingRight: '8px' }" v-if="props.column.field == 'product' && props.row.sku && isMobileWidth">
                        <div class="row mb-2 pt-2 d-flex justify-content-between" :style="{ width: mobileRowWidth, maxWidth: mobileRowWidth }">
                          <div class="col-4 d-flex justify-content-center align-items-center">
                            <img v-if="props.row.image_url" :src="props.row.image_url" class="border product-image" :style="isMobileWidth ? 'width: 60px; height: 60px;' : ''" @error="replaceByDefault">
                            <img v-else :src="defaultImage" class="border product-image" :style="isMobileWidth ? 'width: 60px; height: 60px;' : ''">
                          </div>
                            <div class="col-8 d-flex flex-column align-items-start justify-content-center">
                                <span class="mobile-column-field pb-1">Title: <span class="mobile-row-field"><a :href="`/p/${props.row.slug}`">{{ props.row.title }}</a></span></span>
                                <span class="mobile-column-field pb-1">SKU: <span class="mobile-row-field">{{ props.row.sku }}</span></span>
                                <span v-if="showLocations" class="mobile-column-field pb-1">Store: <span class="mobile-row-field">{{ storeName(props.row.store_id) }}</span></span>                            
                            </div>
                        </div>
                      </div>
                      <div :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'product' && isMobileWidth">
                        <div class="row pl-1 pt-3 pb-3 d-flex justify-content-between" :style="{ width: mobileRowWidth, maxWidth: mobileRowWidth }"></div>
                      </div>
                      <div class="row pl-2 pt-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'from_date' && isMobileWidth">
                        <div class="col-6 mobile-column-field d-flex justify-content-start ">From Date</div>
                        <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.row.from_date}}</div>
                      </div>
                      <div class="row pl-2 pt-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'to_date' && isMobileWidth">
                        <div class="col-6 mobile-column-field d-flex justify-content-start ">To Date</div>
                        <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.row.to_date}}</div>
                      </div>
                      <div class="row pl-2 pt-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'created_at' && isMobileWidth">
                        <div class="col-6 mobile-column-field d-flex justify-content-start ">Date Added</div>
                        <div class="col-6 mobile-row-field d-flex justify-content-end">{{props.row.created_at}}</div>
                      </div>
                      <div class="row pl-2 pt-2 pb-2 d-flex justify-content-between" :style="{ width: mobileRowWidth }" v-else-if="props.column.field == 'status' && isMobileWidth">
                        <div class="col-6 mobile-column-field d-flex justify-content-start ">Status</div>
                        <div class="col-6 mobile-row-field d-flex justify-content-end" :class="pageWidth < 360 ? 'mt-4' : ''">
                          <span class="text-capitalize">{{ props.row.status }}</span>
                          <br>
                          <template v-if="props.row.status != 'new'">
                            <span class="d-block text-danger ml-3" v-if="props.row.closed_by && props.row.closed_by != 0">By {{ `${props.row.closedBy_first} ${props.row.closedBy_last}` }}</span>
                            <span class="d-block text-danger ml-3" v-else-if="props.row.issued_to && props.row.issued_to != 0">By {{ `${props.row.issued_first} ${props.row.issued_last}` }}</span>
                          </template>
                        </div>
                      </div>
                      <div class="row d-flex pt-2 justify-content-end mobile-bottom-row" style="padding-right: 10px;" :style="{ width: mobileRowWidth }"  v-else-if="props.column.field == 'notes' && isMobileWidth">
                        <a href="#" class="notes-bt mr-3 pt-1" :style="{ background: props.row.notes_count > 0 ? '#E86767' : '#FEF3C7'}" @click.prevent="$refs.notesList.show(props.row.id)">
                          <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7822 8.04647C13.7822 10.1279 13.7822 12.2093 13.7822 14.2907C13.7822 15.1459 13.2844 15.8173 12.4967 16.0197C12.3282 16.0598 12.1553 16.0789 11.9821 16.0768C8.59706 16.0801 5.21178 16.0801 1.82626 16.0768C0.733518 16.0786 0 15.3461 0 14.2591C0 10.1147 0 5.97033 0 1.82593C0 0.86094 0.578489 0.165103 1.50077 0.0176101C1.60781 0.00347238 1.71581 -0.00216745 1.82375 0.00074349C5.20855 0.00074349 8.59383 0.00074349 11.9796 0.00074349C13.0476 -0.000333101 13.7804 0.732826 13.7804 1.80296C13.7823 3.88437 13.7823 5.96578 13.7804 8.04719L13.7822 8.04647ZM12.6338 8.05724C12.6338 5.98181 12.6338 3.9065 12.6338 1.83131C12.6338 1.36479 12.421 1.14947 11.9573 1.14947H1.83738C1.36368 1.14803 1.15016 1.36335 1.15016 1.84136C1.15016 5.98025 1.15016 10.1192 1.15016 14.258C1.15016 14.7095 1.36978 14.9298 1.82052 14.9298H11.9581C12.4221 14.9298 12.6334 14.7163 12.6334 14.248C12.6339 12.1843 12.6334 10.1207 12.632 8.05724H12.6338Z" :fill="props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.89194 8.61238C6.24024 8.61238 5.58854 8.61238 4.93685 8.61238C4.57224 8.61238 4.31027 8.37338 4.30776 8.04323C4.30525 7.71307 4.56757 7.46546 4.92823 7.4651C6.23737 7.46366 7.54674 7.46366 8.85636 7.4651C9.21809 7.4651 9.47648 7.7102 9.47396 8.04359C9.47145 8.37697 9.21307 8.61238 8.84703 8.61238C8.19533 8.61406 7.54363 8.61406 6.89194 8.61238Z" :fill="props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.87049 5.16732C6.22453 5.16732 5.57858 5.16732 4.93262 5.16732C4.56981 5.16732 4.3082 4.92508 4.30641 4.59313C4.30461 4.26118 4.56874 4.01895 4.93047 4.01895C6.23362 4.01895 7.53666 4.01895 8.83958 4.01895C9.21566 4.01895 9.47656 4.26011 9.47261 4.59995C9.46902 4.93047 9.2092 5.16445 8.84137 5.16516C8.18537 5.16947 7.52793 5.16732 6.87049 5.16732Z" :fill="props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.88483 12.0575C6.23888 12.0575 5.59292 12.0575 4.94697 12.0575C4.57196 12.0575 4.3064 11.816 4.3064 11.4812C4.30855 11.1532 4.57124 10.9113 4.93548 10.9109C6.24414 10.9095 7.55304 10.9095 8.86217 10.9109C9.18515 10.9109 9.43241 11.1187 9.46973 11.408C9.48805 11.5487 9.45359 11.6912 9.37301 11.8081C9.29242 11.9249 9.17142 12.0078 9.03335 12.0406C8.96308 12.0546 8.89142 12.0602 8.81983 12.0575C8.17555 12.0592 7.53055 12.0592 6.88483 12.0575Z" :fill="props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/></svg>
                        </a>
                        <button                                       
                          class="btn-action text-tiny ml-2"
                          @click="showDetails(props.row)"
                        >
                          <span class="text-danger">View</span>
                        </button>
                      </div>
                      <div class="d-flex" v-else-if="props.column.field == 'product' && props.row.sku && !isMobileWidth">
                          <img v-if="props.row.image_url" :src="props.row.image_url" class="mr-2 border product-image" @error="replaceByDefault">
                          <img v-else :src="defaultImage" class="mr-2 border product-image">
                          <div class="d-flex flex-column align-items-start justify-content-center">
                              <span>Title: <a :href="`/p/${props.row.slug}`">{{ props.row.title }}</a></span>
                              <span>SKU: {{ props.row.sku }}</span>
                              <span v-if="showLocations">Store: {{ storeName(props.row.store_id) }}</span>                                
                          </div>
                      </div> 
                                          
                      <button
                      v-else-if="props.column.field == 'actions' && !isMobileWidth"                        
                      class="btn-action text-tiny ml-2"
                      @click="showDetails(props.row)">
                        <span class="text-danger">View</span>
                      </button>
                      <span v-else-if="props.column.field == 'from_date' || props.column.field == 'to_date'  && !isMobileWidth">
                        {{ fromToDatesHandler(props.row, props.column.field) }}
                      </span>
                      <span v-else-if="props.column.field == 'status'  && !isMobileWidth">
                        <span class="text-capitalize">{{ props.row.status }}</span>
                        <template v-if="props.row.status != 'new'">
                          <span class="d-block text-tiny text-danger" v-if="props.row.closed_by && props.row.closed_by != 0">By {{ `${props.row.closedBy_first} ${props.row.closedBy_last}` }}</span>
                          <span class="d-block text-tiny text-danger" v-else-if="props.row.issued_to && props.row.issued_to != 0">By {{ `${props.row.issued_first} ${props.row.issued_last}` }}</span>
                        </template>
                      </span>
                      <div v-else-if="props.column.field == 'notes' && !isMobileWidth">
                        <a href="#" class="notes-bt" :style="{ background: props.row.notes_count > 0 ? '#E86767' : '#FEF3C7'}" @click.prevent="$refs.notesList.show(props.row.id)">
                          <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7822 8.04647C13.7822 10.1279 13.7822 12.2093 13.7822 14.2907C13.7822 15.1459 13.2844 15.8173 12.4967 16.0197C12.3282 16.0598 12.1553 16.0789 11.9821 16.0768C8.59706 16.0801 5.21178 16.0801 1.82626 16.0768C0.733518 16.0786 0 15.3461 0 14.2591C0 10.1147 0 5.97033 0 1.82593C0 0.86094 0.578489 0.165103 1.50077 0.0176101C1.60781 0.00347238 1.71581 -0.00216745 1.82375 0.00074349C5.20855 0.00074349 8.59383 0.00074349 11.9796 0.00074349C13.0476 -0.000333101 13.7804 0.732826 13.7804 1.80296C13.7823 3.88437 13.7823 5.96578 13.7804 8.04719L13.7822 8.04647ZM12.6338 8.05724C12.6338 5.98181 12.6338 3.9065 12.6338 1.83131C12.6338 1.36479 12.421 1.14947 11.9573 1.14947H1.83738C1.36368 1.14803 1.15016 1.36335 1.15016 1.84136C1.15016 5.98025 1.15016 10.1192 1.15016 14.258C1.15016 14.7095 1.36978 14.9298 1.82052 14.9298H11.9581C12.4221 14.9298 12.6334 14.7163 12.6334 14.248C12.6339 12.1843 12.6334 10.1207 12.632 8.05724H12.6338Z" :fill="props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.89194 8.61238C6.24024 8.61238 5.58854 8.61238 4.93685 8.61238C4.57224 8.61238 4.31027 8.37338 4.30776 8.04323C4.30525 7.71307 4.56757 7.46546 4.92823 7.4651C6.23737 7.46366 7.54674 7.46366 8.85636 7.4651C9.21809 7.4651 9.47648 7.7102 9.47396 8.04359C9.47145 8.37697 9.21307 8.61238 8.84703 8.61238C8.19533 8.61406 7.54363 8.61406 6.89194 8.61238Z" :fill="props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.87049 5.16732C6.22453 5.16732 5.57858 5.16732 4.93262 5.16732C4.56981 5.16732 4.3082 4.92508 4.30641 4.59313C4.30461 4.26118 4.56874 4.01895 4.93047 4.01895C6.23362 4.01895 7.53666 4.01895 8.83958 4.01895C9.21566 4.01895 9.47656 4.26011 9.47261 4.59995C9.46902 4.93047 9.2092 5.16445 8.84137 5.16516C8.18537 5.16947 7.52793 5.16732 6.87049 5.16732Z" :fill="props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/><path d="M6.88483 12.0575C6.23888 12.0575 5.59292 12.0575 4.94697 12.0575C4.57196 12.0575 4.3064 11.816 4.3064 11.4812C4.30855 11.1532 4.57124 10.9113 4.93548 10.9109C6.24414 10.9095 7.55304 10.9095 8.86217 10.9109C9.18515 10.9109 9.43241 11.1187 9.46973 11.408C9.48805 11.5487 9.45359 11.6912 9.37301 11.8081C9.29242 11.9249 9.17142 12.0078 9.03335 12.0406C8.96308 12.0546 8.89142 12.0602 8.81983 12.0575C8.17555 12.0592 7.53055 12.0592 6.88483 12.0575Z" :fill="props.row.notes_count > 0 ? '#FFFFFF' : '#B45309'"/></svg>
                        </a>
                      </div>
                      <span class="text-capitalize" v-else-if="!isMobileWidth">{{ props.formattedRow[props.column.field] }}</span>
                    </template> 
                </vue-good-table>

                <div v-if="rentals.data" class="p-md-2 pl-md-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center" :class="!isMobileWidth ? 'p-3 border-top border-gray' : ''">
                  <div v-if="!isMobileWidth" class="mb-2 mb-md-0" v-html="resultsText(rentals)" />
                  <VuePagination v-if="rentals.pageCount && rentals.pageCount > 1" :pages="rentals.pageCount" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TextViewModal ref="commentsModal" :title="`Details`" :bodyClass="`justify-content-start flex-column h-auto`">
        <button
          v-if="!rentalData.issued_at && !rentalData.issued_to"
          :disabled="loading[rentalData.id] === true || rentalData.issued_at"
          class="btn-claim btn btn-sm btn-primary mb-5"
          @click="claimRental(rental)">
            <span v-if="loading[rentalData.id] === true"><i class="fa fa-spinner fa-spin"></i></span>              
            <span v-else>Claim</span>
        </button>
        <p class="text-danger mb-5" v-else-if="rentalData.issued_at">
          Claimed by {{ rentalData.issued_first }} {{ rentalData.issued_last }}
          <span class="text-muted">
            on {{ formatDateTime(rentalData.issued_at) }}
          </span>
        </p> 
        <button
          v-if="!rentalData.closed_at && !rentalData.closed_by && rentalData.issued_at"
          :disabled="loading[rentalData.id] === true || rentalData.closed_at"
          class="btn-claim btn btn-sm btn-success mb-5"
          @click="closeRental(rental)">
            <span v-if="loading[rentalData.id] === true"><i class="fa fa-spinner fa-spin"></i></span>              
            <span v-else>Close</span>
        </button>
        <p class="text-success mb-5" v-else-if="rentalData.closed_at">
          Closed by {{ rentalData.closedBy_first }} {{ rentalData.closedBy_last }}
          <span class="text-muted">
            on {{ formatDateTime(rentalData.closed_at) }}
          </span>
        </p> 
        <div class="row w-100">                   
          <div class="col-12 col-md-4 mb-3">
            <p class="mb-0 c-label">Name:</p>
            <span class="text-dark ft-17">{{ rentalData.name }}</span>    
          </div>
          <div class="col-12 col-md-4 mb-3">
            <p class="mb-0 c-label">Email:</p>
            <span class="text-dark ft-17">
              <a :href="`mailto:${rentalData.email}`">{{ rentalData.email }}</a>
            </span>    
          </div>
          <div class="col-12 col-md-4 mb-3">
            <p class="mb-0 c-label">Contact:</p>
            <span class="text-dark ft-17">
              <a :href="`tel:${rentalData.phone}`">{{ rentalData.phone }}</a>
            </span>    
          </div>
          <div class="col-12 col-md-4 mb-3">
            <p class="mb-0 c-label">Convenient Location:</p>
            <span class="text-dark ft-17">{{ rentalData.convenient_location }}</span>    
          </div>          
          <div class="col-12 col-md-4 mb-3">
            <p class="mb-0 c-label">Preferred Contact:</p>
            <span class="text-dark ft-17">{{ rentalData.preferred_contact }}</span>    
          </div>
          <div class="col-12 col-md-4 mb-3" v-if="showLocations && rentalData.store_id">
            <p class="mb-0 c-label">Store:</p>
            <span class="text-dark ft-17">{{ storeName(rentalData.store_id) }}</span>    
          </div>
          <div class="col-12 col-md-4 mb-3" v-if="rentalData.best_time_to_call">
            <p class="mb-0 c-label">Best Time to Call:</p>
            <span class="text-dark ft-17">{{ rentalData.best_time_to_call }}</span>    
          </div>
        </div>
        <div class="row w-100" v-if="rentalData.custom_info">                   
          <div class="col-12 col-md-4 mb-3" v-for="(itm,idx) in Object.keys(rentalData.custom_info)" :key="idx">
            <p class="mb-0 c-label text-capitalize">{{ itm.replaceAll("_"," ") }}</p>
            <span class="text-dark ft-17 text-capitalize">{{ formatCustomInfo(rentalData.custom_info[itm]) }}</span>    
          </div>
        </div>
        <div class="row w-100 mb-3">                   
          <div v-if="rentalData.comments" class="col-12 overflow-hidden">          
            <p class="mb-0 c-label">Comment:</p>
            <span class="text-dark ft-17">{{ rentalData.comments }}</span>    
          </div>
        </div>        
      </TextViewModal>
      <NotesList ref="notesList" :rentals="true" @updateNotesCount="updateNotesCount" />
    </div>
  </template>
  
  <script>
  
    import AdminService from '@/api-services/admin.service';
    import debounce from 'debounce';
    import NoPermission from '../settings/no-permission';
    import {VueGoodTable} from 'vue-good-table';
    import TextViewModal from '@/components/modals/text-view-modal';
    import moment from 'moment-timezone';
    import NotesList from '@/components/admin/orders/notesList';
  
  export default {
    name: "rentals",
    components: {
      NoPermission,
      VueGoodTable,
      NotesList,
      TextViewModal
    },
    props: {
      orderId: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        rentals: {
          data: [],
          pages: null,
          perPage: 10,
          pageCount: 1,
          count: '',
          filters: {
            status: null
          },
          loading: false,
          sort: '',
          dir: ''
        },
        sortOptions: {
          enabled: true,
          multipleColumns: false,
          initialSortBy: { field: 'id', type: 'asc' }
        },
        bootstrapPaginationClasses: {
          ul: 'pagination justify-content-center',
          li: 'page-item',
          liActive: 'active',
          liDisable: 'disabled',
          button: 'page-link',
        },
        requestingRefund: null,
        rental: {},
        loading: {},
        defaultImage: "https://storage.googleapis.com/content.ezadtv.com/2023/04/26/6449acaee3144_placeholder.png",
        pageWidth: 0,
        // filters for mobile view
        isMobileFiltersPanelOpened: false,
        selectedFromDateSort: null,
        selectedToDateSort: null,
        selectedDateAddedSort: null,
        fromDateSort: [
          { id: 1, value: { field: 'from_date', type: 'desc' }, label: 'Newest to Oldest' },
          { id: 2, value: { field: 'from_date', type: 'asc' }, label: 'Oldest to Newest' }
        ],
        toDateSort: [
          { id: 1, value: { field: 'to_date', type: 'desc' }, label: 'Newest to Oldest' },
          { id: 2, value: { field: 'to_date', type: 'asc' }, label: 'Oldest to Newest' }
        ],
        dateAddedSort: [
          { id: 1, value: { field: 'created_at', type: 'desc' }, label: 'Newest to Oldest' },
          { id: 2, value: { field: 'created_at', type: 'asc' }, label: 'Oldest to Newest' }
        ],
        statuses: [
          { value: null, text: 'Select Status' },
          { value: 'new', text: 'New' },
          { value: 'Closed', text: 'Closed' },
          { value: 'Claimed/Received', text: 'Claimed/Received' }
        ]
      };
    },
    computed: {
      showLocations() {
        return this.$store.state.storeLocations && this.$store.state.storeLocations.length && this.$store.state.storeLocations.length > 1;
      }, 
      rentalsColumns() {
        let _self = this;
        return [
          { field: 'product', label: 'Product', html: true, sortable: false },          
          { field: 'from_date', label: 'From Date', html: true, sortable: true, formatFn: function(value) {return _self.formatDate(value);}},
          { field: 'to_date', label: 'To Date', html: true, sortable: true, formatFn: function(value) {return _self.formatDate(value);} },
          { field: 'created_at', label: 'Date Added', html: true, sortable: true, formatFn: function(value) {return _self.formatDate(value);} },
          { field: 'status', label: 'Status', html: true, sortable: false },
          { field: 'notes', label: '', tdClass: 'p-0', sortable: false },
          { field: 'actions', label: '', html: false, sortable: false }          
        ];
      },
      showRentals(){
        if(this.$store.state.businessDetails && typeof this.$store.state.businessDetails.rentals_tab != 'undefined'){
          let showRentals = this.$store.state.businessDetails.rentals_tab;
          return (showRentals === '1' || showRentals === 1);
        }
        return false;
      },
      subAccountSlug(){
        return this.$store.state.activeUser.data.customer.slug;
      },
      isMobileWidth() {
        return this.pageWidth < 769;
      },
      mobileRowWidth() {
        if (this.pageWidth < 577) {
          return `${this.pageWidth - 40}px`;
        } else {
          return `${this.pageWidth - 70}px`;
        }
      },
      mobileFirstRowWidth() {
        if (this.pageWidth < 577) {
          return `${this.pageWidth - 50}px`;
        } else {
          return `${this.pageWidth - 80}px`;
        }
      },
      rentalData(){
        let data = JSON.parse(JSON.stringify(this.rental));
        try {
          if(data.custom_info){
            data.custom_info = JSON.parse(data.custom_info);
          }
        } catch (error) {
          data.custom_info = null;          
        }
        return data;
      }
    },
    methods: {
      storeName(store_id){
        return this.showLocations && store_id ? this.$store.state.storeLocations.find(x => x.business_id == store_id).name : '';
      },
      setLoading(data) {
        this.$set(this.loading, data.id, data.loading);
      },
      showDetails(row) {
        this.rental = row;
        setTimeout(() => {
          this.$refs.commentsModal.showModal();
        }, 200);
      },
      resetFilters() {
        this.rentals.filters = {
          status: null
        };
      },
      resultsText(d) {
        let from = ((((Number(this.$route.query.page) - 1) * d.perPage) - d.perPage) + d.data.length + 1);
        let to = ((Number(this.$route.query.page) * d.perPage) - d.perPage) + d.data.length;
        return d.count ? `Showing  ${d.loading ? '...' : `<b>${from > 0 ? from : 1}</b> to <b>${!isNaN(to) ? to : this.rentals.perPage}</b> of <b>${d.count}</b> results`}` : '';
      },
      onSortChange(params) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { dir: params['0'].type }) }).catch(() => {});
        this.$router.push({ query: Object.assign({}, this.$route.query, { sort: params['0'].field }) }).catch(() => {});
      },
      async getRentals(data = {}) {        
        data.page = this.$route.query.page || 1;
        data.sort = this.rentals.sort;
        data.dir = this.rentals.dir;
        data.perPage = this.rentals.perPage;
        if(this.$route.query.status) {
          let status = this.$route.query.status;
          if(status.toLowerCase() == "new") {
            status = "new";
          }
          if(status.toLowerCase() == "closed") {
            status = "Closed";
          }
          if(status.toLowerCase() == "claimed" || status.toLowerCase() == "received") {
            status = "Claimed/Received";
          }
          if(this.statuses.map(x => x.value).includes(status)) {
            this.rentals.filters.status = status;
          }
        }
        for (const [key, value] of Object.entries(this.rentals.filters)) {
          if(value) {
            data[key] = value;
          }
        }
  
        this.rentals.loading = true;
        AdminService.getRentals(data).then(r => {
          this.rentals.data = r.data.rentalsData;
          this.rentals.count = r.data.count;
          this.rentals.pageCount = Math.ceil(this.rentals.count / this.rentals.perPage);
          this.rentals.loading = false;
          if (this.rentals.data.length) {
            this.$emit('showMoreLabelsButton');
          }
          if(this.$route.query.rental){
            let open = this.rentals.data.find(x => x.id == this.$route.query.rental);
            if(open)
              this.showDetails(open);
          }
        });
      },
      replaceByDefault(e) {
          e.target.src = this.defaultImage;
      },
      formatDateTime(dateTime){
        if(dateTime){
          return moment.utc(dateTime).local().format('MMM D, YYYY hh:mm A');
        }
        return '';
      },
      formatDate(date) {
        if(date){
          return moment(date).format('MMM DD, YYYY');
        }
        return '';
      },
      fromToDatesHandler(row,name){
        return moment(row[name]).isBefore(moment(row.created_at)) ? '-' : row[name];
      },
      async claimRental(data) {
        data.loading = true;
        this.setLoading(data);
        AdminService.rentalUpdate(data.id, this.subAccountSlug, 'claim').then(res => {
          data.loading = false;
          this.setLoading(data);
          if(res.data.status === 'success' && res.data.rental){
            this.rental = res.data.rental;
            let index = this.rentals.data.findIndex(x => x.id == data.id);
            this.$set(this.rentals.data, index, res.data.rental);
          }
        }).catch(() => {
          this.makeToast('error', 'Error', 'There was an error while trying to claim.');
          this.claiming = false;
        });
      },
      async closeRental(data) {
        data.loading = true;
        this.setLoading(data);
        AdminService.rentalUpdate(data.id, this.subAccountSlug, 'close').then(res => {
          data.loading = false;
          this.setLoading(data);
          if(res.data.status === 'success' && res.data.rental){
            this.rental = res.data.rental;
            let index = this.rentals.data.findIndex(x => x.id == data.id);
            this.$set(this.rentals.data, index, res.data.rental);
          }
        }).catch(() => {
          this.makeToast('error', 'Error', 'There was an error while trying to claim.');
          this.claiming = false;
        });
      },
      makeToast(variant, title, content) {
        this.$swal({
          toast: true,
          position: 'top',
          text: content,
          showConfirmButton: false,
          timer: 3000,
          type: variant,
          title: title
        });
      },
      updateNotesCount(notes_count,rental_id){
        let idx = this.rentals.data.findIndex(x => x.id == rental_id);
        if(idx > -1)
          this.rentals.data[idx].notes_count = notes_count;
      },
      formatCustomInfo(val){
        if(val){
          if(val.includes("_")){
            val = val.replaceAll("_"," ");
          }
          return this.convertTo12HourFormat(val);
        }
        return "";
      },
      convertTo12HourFormat(timeString) {
        // Regular expression pattern to match time in the format of HH:MM or HH:MM:SS
        const timeRegex = /^(0?[1-9]|1[0-9]):([0-5][0-9])(:([0-5][0-9]))?$/;

        // Check if the string matches the time pattern
        if (timeRegex.test(timeString)) {
          // Split the time string into hours, minutes, and seconds (if present)
          const [hours, minutes, , seconds] = timeString.split(':');
          let period = '';

          // Convert the hours to a number
          let hoursNum = parseInt(hours, 10);

          // Determine the period (AM or PM)
          if (hoursNum === 12) {
            period = 'PM';
          } else if (hoursNum > 12) {
            hoursNum -= 12;
            period = 'PM';
          } else {
            period = 'AM';
          }

          // Return the time in 12-hour format, including seconds if present
          if (seconds) {
            return `${hoursNum}:${minutes}:${seconds} ${period}`;
          } else {
            return `${hoursNum}:${minutes} ${period}`;
          }
        }

        // If the string is not in the format of HH:MM or HH:MM:SS, return the original string
        return timeString;
      },
      handleResize() {
        this.pageWidth = window.innerWidth;
      },      
      openMobileFiltersPanel() {
        this.isMobileFiltersPanelOpened = true;
        document.body.style.overflow = 'hidden';
      },
      closeMobileFiltersPanel() {
        this.isMobileFiltersPanelOpened = false;
        document.body.style.overflow = '';
      },
      clearAllSortingFilters(avoidClear = null) {
        if(avoidClear != 'avoid_from_date_filter') {
          this.selectedFromDateSort = null;
        }
        if(avoidClear != 'avoid_to_date_filter') {
          this.selectedToDateSort = null;
        }
        if(avoidClear != 'avoid_created_at_filter') {
          this.selectedDateAddedSort = null;
        }
      },
      applySelectedSort(val, avoidClear) {
        this.clearAllSortingFilters(avoidClear);
        const params = [{
          field: val.field,
          type: val.type
        }];
        this.onSortChange(params);
      }
    },
    mounted() {
      if(this.$ezHasNoPermission('manage_orders') && !this.showRentals) return;
      this.clearAllSortingFilters();
      this.getRentals();
      this.pageWidth = window.innerWidth;
      window.addEventListener('resize', this.handleResize);
    },
    watch: {
      'rentals.filters': {
        deep: true,
        handler: debounce(function() {
          this.getRentals();
        }, 500)
      },
      '$route.query.page'() {
        this.getRentals();
      },
      '$route.query.status'() {
        this.getRentals();
      },
      '$route.query.sort'(val) {
        this.rentals.sort = val;
        this.getRentals();
      },
      '$route.query.dir'(val) {
        this.rentals.dir = val;
        this.getRentals();
      },
      selectedFromDateSort(val) {
        if(val) {
          this.applySelectedSort(val, 'avoid_from_date_filter');
        }
      },
      selectedToDateSort(val) {
        if(val) {
          this.applySelectedSort(val, 'avoid_to_date_filter');
        }
      },
      selectedDateAddedSort(val) {
        if(val) {
          this.applySelectedSort(val, 'avoid_created_at_filter');
        }
      }
    }
  };
  </script>
  
  <style scoped lang="scss">
  .btn-claim {
    width: 489px;
    height: 48px;
    min-height: 48px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 6px;
    animation: anim-glow 1s ease infinite;
  }
  .product-image {
    min-width: 40px;
    width: 40px;
    height: 40px;
    object-fit: contain;
    padding: 2px;
  }
  .table-wrapper {
    position: relative;
    min-height: 100px;
    max-width: 100%;
    :deep(.vgt-responsive) {
      overflow-x: scroll;
      max-width: 100%;
      tr {
        td.index,
        th.index {
          position: sticky;
          left: 0;
          background: #fff;
        }
        th.index {
          background: #F8FAFC;
          z-index: 2;
        }
      }
    }
    .spinner-wrapper {
      position: absolute;
      display: none;
      left: 50%;
      margin: -32px 0 0 -16px;
      z-index: 8;
      top: 50%;
      transform: translateY(-50%);
    }
    &.loading {
      .spinner-wrapper {
        display: block;
      }
      :deep(.table) {
        opacity: .5;
      }
      :deep(.panel-content) {
        opacity: .8;
        cursor: not-allowed;
      }
    }
  }
  
  .heading--button{
    width: 100%;
    h3 {
      display: inline-block;
    }
  
    button:disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }
  }
  
  .search-input {
    max-width: 385px;
    background: url('/icons/search.svg') 12px center no-repeat;
    padding-left: 40px !important;
    height: 36px;
  }
  
  .datepicker {
    max-width: 385px;
    height: 36px;
  }
  
  .filters {
    .filter {
      background: #F3F4F6;
      height: 20px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      color: #334155;
      font-size: 12px;
      border-radius: 20px;
      margin: 0 5px;
    }
    .clear-all {
      font-size: 14px;
      color: #64748B;
      margin-right: 10px;
    }
  }

  .mobile-column-field {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    color: #64748B;
  }
  .mobile-row-field {
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 20px;
    text-align: right;
    color: #334155;
  }

  .separator {
    background: #F7F7F7;
    height: 30px;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
  }

  .panel-container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    transition: transform 0.2s ease-out;
    transform: translateX(100%);
    z-index: 9999;
    overflow-y: auto;
  }

  .panel-open {
    transform: translateX(0);
  }

  .panel-content {
    position: absolute;
    top: 0;
    right: 0;
    width: 55%;
    height: 100%;
    background-color: #fff;
    z-index: 1;
    animation: slideInRight 0.3s forwards;
    overflow: hidden; 
    overflow-y: auto; 
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #dee2e6;
  }

  .panel-heading {
    margin: 0;
  }

  .close-button {
    border: none;
    background: none;
    font-size: 14px;
    cursor: pointer;
  }

  .filter-heading {
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 24px;


    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 16px;
    gap: 8px;


    background: #F1F5F9;

    flex: none;
    order: 0;
    flex-grow: 0;
  }

  .filter-actions {
    margin-top: 1rem;
    text-align: center;
  }

  .mobile-column-field {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    color: #64748B;
  }
  .mobile-row-field {
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 20px;
    text-align: right;
    color: #334155;
    padding-right: 3px !important;
  }

  .mobile-bottom-row {
    margin-left: 1px !important;
  }

  @media (max-width: 768px) {
    .table-wrapper {
      :deep(.vgt-responsive) {
        overflow-x: clip;
      }
    }
    :deep(table) {
      border-collapse: separate;
      border-spacing: 0 15px;
      td {
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
      }
      td:first-child {
        border-top: 2px solid rgb(226, 232, 240);
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
        border-bottom: 1px solid rgb(226, 232, 240);
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        padding: 0.2rem;
      }
      td:nth-child(4) {
        border-bottom: 1px solid rgb(226, 232, 240);
      }
      td:last-child {
        border-left: 2px solid rgb(226, 232, 240);
        border-right: 2px solid rgb(226, 232, 240);
        border-bottom: 2px solid rgb(226, 232, 240);
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
      }
    }
    :deep(th) {
      display: none;
    }
    :deep(td) {
      display: flex;
      width: 100%;
      padding: .5rem;
      .email {
        display: none;
        margin-left: 10px;
      }
    }
  }
  .ft-17{
    font-size: 17px;
  }
  .c-label{
    font-size: 14px;
    font-weight: bold;
  }
  </style>
  
  