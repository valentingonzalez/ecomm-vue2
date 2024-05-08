<template>
  <div v-if="$ezHasNoPermission('manage_special_fees')">
    <NoPermission />
  </div>
    <section v-else class="upload-sec p-0 bg-white">

      <div class="settings-header">
        <div class="settings-header-info">
          <h1 class="mb-2">
            Special Fees
          </h1>
          <div class="upload-navigation-btns d-flex">
            <button @click.prevent="openManualRecordModal" class="btn btn-outline-secondary add-record border-btn-plain">
              <svg class="navigation-btn-icon mr-2" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 4V4.5H6H9C9.13261 4.5 9.25978 4.55268 9.35355 4.64645C9.44732 4.74022 9.5 4.86739 9.5 5C9.5 5.13261 9.44732 5.25978 9.35355 5.35355C9.25978 5.44732 9.13261 5.5 9 5.5H6H5.5V6V9C5.5 9.13261 5.44732 9.25978 5.35355 9.35355C5.25978 9.44732 5.13261 9.5 5 9.5C4.86739 9.5 4.74022 9.44732 4.64645 9.35355C4.55268 9.25978 4.5 9.13261 4.5 9V6V5.5H4H1C0.867392 5.5 0.740215 5.44732 0.646447 5.35355C0.552678 5.25978 0.5 5.13261 0.5 5C0.5 4.86739 0.552678 4.74022 0.646447 4.64645C0.740215 4.55268 0.867392 4.5 1 4.5H4H4.5V4V1C4.5 0.867392 4.55268 0.740215 4.64645 0.646447C4.74022 0.552678 4.86739 0.5 5 0.5C5.13261 0.5 5.25978 0.552678 5.35355 0.646447C5.44732 0.740215 5.5 0.867392 5.5 1V4Z" fill="#64748B" stroke="#64748B"/>
              </svg>
              Add Record Manual
            </button>
            <button @click.prevent="showUploadForm" class="btn btn-danger upload-csv btn-red">
              <svg class="navigation-btn-icon mr-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.00001 1.33331V11.3333V1.33331Z" fill="white"/>
                <path d="M1.33334 11.3333V12.1666C1.33334 12.8297 1.59674 13.4656 2.06558 13.9344C2.53442 14.4033 3.1703 14.6666 3.83334 14.6666H12.1667C12.8297 14.6666 13.4656 14.4033 13.9344 13.9344C14.4033 13.4656 14.6667 12.8297 14.6667 12.1666V11.3333M11.3333 4.66665L8.00001 1.33331M8.00001 1.33331L4.66668 4.66665M8.00001 1.33331V11.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Upload CSV
            </button>
          </div>
        </div>
      </div>

      <div class="upload-header-box pt-5 px-4 mb-3">
        <div class="d-flex justify-content-between align-items-center flex-wrap">
          <div class="upload-search-box mb-2 d-flex flex-row align-items-start">
            <div class="form-group mb-0">
              <input type="text" class="form-control bg-white" placeholder="Search UPC/SKU" v-model="search.input" />
            </div>
          </div>
          <div class="upload-navigation-btns d-flex">
            <button @click.prevent="$refs.deleteAllRecordsModal.show" :disabled="!archivedItems.list.length" class="btn btn-outline-danger delete-all-record border-btn-red mb-2">
              <svg class="upload-header-btn-icon mr-2" width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.33333 8.16667V13.1667M9.66666 8.16667V13.1667M1.33333 4.83333H14.6667M13.8333 4.83333L13.1108 14.9517C13.0809 15.3722 12.8927 15.7657 12.5843 16.053C12.2758 16.3403 11.8699 16.5 11.4483 16.5H4.55166C4.13011 16.5 3.72422 16.3403 3.41573 16.053C3.10725 15.7657 2.91909 15.3722 2.88916 14.9517L2.16666 4.83333H13.8333ZM10.5 4.83333V2.33333C10.5 2.11232 10.4122 1.90036 10.2559 1.74408C10.0996 1.5878 9.88768 1.5 9.66666 1.5H6.33333C6.11231 1.5 5.90035 1.5878 5.74407 1.74408C5.58779 1.90036 5.49999 2.11232 5.49999 2.33333V4.83333H10.5Z" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg> Delete All Records
            </button>
            <button :disabled="isExporting || !getItems" @click="exportToCsv" class="btn btn-outline-secondary export-csv border-btn-plain mb-2">
              <div class="spinner-border spinner-border-sm mr-2" v-if="isExporting"></div> <svg v-else class="upload-header-btn-icon mr-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.00001 11.3333V1.33331V11.3333Z" fill="#64748B"/>
              <path d="M1.33334 11.3333V12.1666C1.33334 12.8297 1.59674 13.4656 2.06558 13.9344C2.53442 14.4033 3.1703 14.6666 3.83334 14.6666H12.1667C12.8297 14.6666 13.4656 14.4033 13.9344 13.9344C14.4033 13.4656 14.6667 12.8297 14.6667 12.1666V11.3333M11.3333 7.99998L8.00001 11.3333M8.00001 11.3333L4.66668 7.99998M8.00001 11.3333V1.33331" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
              Export CSV
            </button>
          </div>
        </div>
        <div v-if="totalItems > 0" class="d-flex justify-content-end">
          Total Records: {{ totalItems }}
        </div>
      </div>


      <div class="upload-table-box px-4 position-relative">
        <div class="d-none text-white bg-warning text-center circle p-2 mt-2 m-4 justify-content-start align-items-start" ref="tableErr">
          Please wait, we are working on your query...
        </div>
        <div class="d-flex align-items-center justify-content-center spinner" v-if="itemsIsLoading">
          <div class="spinner-border"></div>
        </div>
        <div class="table-responsive">
          <b-table small :fields="fields" :items="getItems" responsive="sm" class="text-center">
            <template v-slot:head(select-row)>
              <input type="checkbox" class="table-checkbox" v-model="archivedItems.allSelected" @click="selectAll" />
            </template>
            <template v-slot:head(afterFees)="data">
              <span v-html="data.label"></span>
            </template>
            <template #cell(select-row)="data">
              <input type="checkbox" v-model="archivedItems.list" :value="data.item.identifier" class="table-checkbox" />
            </template>
            <template #cell(product)="data">
              <router-link class="name text-dark" :to="{ name: 'products-slug', params: { slug: data.item.slug } }" target="_blank">
                {{ data.item.identifier }}
              </router-link>
            </template>
            <template #cell(value)="data">
              ${{ data.item.price }}
            </template>
            <template #cell(rate)="data">
              ${{ getTotalFees(data.item) }}
            </template>
            <template #cell(afterFees)="data">
              ${{ getAmountAfterAllFees( data.item ) }}
            </template>
            <template #cell(action)="data">
              <button class="btn btn-link border-0 text-decoration-none" @click="data.toggleDetails">
                {{ data.detailsShowing ? 'Hide' : 'Show'}} Details <i :class="{'rotate': data.detailsShowing}" class="transition fa fa-angle-down ml-2"></i>
              </button>
              <button class="btn btn-sm table-trash-btn" @click.prevent="archivedItems.list.push(data.item.identifier); $refs.deleteAllRecordsModal.show();" aria-label="Archive Item">
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 9V15M11 9V15M1 5H17M16 5L15.133 17.142C15.0971 17.6466 14.8713 18.1188 14.5011 18.4636C14.1309 18.8083 13.6439 19 13.138 19H4.862C4.35614 19 3.86907 18.8083 3.49889 18.4636C3.1287 18.1188 2.90292 17.6466 2.867 17.142L2 5H16ZM12 5V2C12 1.73478 11.8946 1.48043 11.7071 1.29289C11.5196 1.10536 11.2652 1 11 1H7C6.73478 1 6.48043 1.10536 6.29289 1.29289C6.10536 1.48043 6 1.73478 6 2V5H12Z" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </template>
            <template v-slot:row-details="data" class="p-0">
              <div class="more-details">
                <div class="px-3 pb-0 pt-3">
                  <b-row class="mb-3">
                    <b-col sm="3" class="text-black-50 text-uppercase">
                      Additional Fee
                    </b-col>
                    <b-col sm="1" class="text-black-50 text-uppercase">
                    </b-col>
                    <b-col sm="2" class="text-black-50 text-uppercase">
                      Taxable
                    </b-col>
                    <b-col sm="2" class="text-black-50 text-uppercase">
                      Fee + applicable tax
                    </b-col>
                    <b-col sm="3" class="text-black-50 text-uppercase">
                      Fee Message
                    </b-col>
                    <b-col sm="1" class="text-black-50 text-uppercase">
                    </b-col>
                  </b-row>
                  <b-row v-for="(customFee, i) in data.item.fees" :key="`customFee-${i}`" class="mb-3 align-items-center">
                    <b-col sm="3" class="">
                      <div class="rate-box d-flex justify-content-between align-items-center">
                        <input class="rate-digit w-50 border-0" @blur="updateProductFees(data.item.identifier, data.index, i)" v-model="customFee.fee" :disabled="customFee.loading === true" />
                        <div class="rate-switch">
                          <label class="switch m-0">
                            <input type="checkbox" :checked="customFee.fee_type == 'percentage'" @change="toggleFeeType(data.item.identifier, data.index, i)" :disabled="customFee.loading === true" />
                            <div class="slider d-flex justify-content-between">
                              <span class="d-flex justify-content-center align-items-center"> $ </span>
                              <span class="d-flex justify-content-center align-items-center"> % </span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </b-col>
                    <b-col sm="1" class="pl-0">
                      <div v-if="customFee.loading" class="spinner-border spinner-border-sm ml-1"></div>
                    </b-col>
                    <b-col sm="2" class="">
                      <div class="custom-control custom-switch mt-2">
                        <input type="checkbox" v-model="customFee.is_taxable" class="custom-control-input" :id="`taxable_${data.index}_${i}`" @change="updateProductFees(data.item.identifier, data.index, i)">
                        <label class="custom-control-label" :for="`taxable_${data.index}_${i}`" v-html="customFee.is_taxable ? 'Yes' : 'No'" />
                      </div>
                    </b-col>
                    <b-col sm="2" class="">
                      ${{ calculateFeeImpact(data.item.price, customFee) }}
                    </b-col>
                    <b-col sm="3" class="">
                      <input class="form-control" v-model="customFee.message" @blur="updateProductFees(data.item.identifier, data.index, i)" />
                    </b-col>
                    <b-col sm="1" class="pl-0">
                      <button class="btn btn-sm table-trash-btn" @click="removeFee(data.item.identifier, data.index, i)" aria-label="Remove Fee">
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 9V15M11 9V15M1 5H17M16 5L15.133 17.142C15.0971 17.6466 14.8713 18.1188 14.5011 18.4636C14.1309 18.8083 13.6439 19 13.138 19H4.862C4.35614 19 3.86907 18.8083 3.49889 18.4636C3.1287 18.1188 2.90292 17.6466 2.867 17.142L2 5H16ZM12 5V2C12 1.73478 11.8946 1.48043 11.7071 1.29289C11.5196 1.10536 11.2652 1 11 1H7C6.73478 1 6.48043 1.10536 6.29289 1.29289C6.10536 1.48043 6 1.73478 6 2V5H12Z" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </b-col>
                  </b-row>
                </div>
                <div class="add-another-tax mb-3 pt-3 px-3">
                  <button class="bg-transparent btn-link border-0" @click.prevent="addNewCustomFee(data.item)">
                    <i class="fa fa-plus mr-2"></i> Add Another Fee
                  </button>
                </div>
              </div>
            </template>
          </b-table>
        </div>
      </div>
      <div class="px-4 d-flex justify-content-end mb-4">
        <VuePagination :pages="items.last_page" v-if="items.total" />
      </div>

      <!-- display none for now -->
      <div v-if="false" class="d-none justify-content-center align-items-center actions-con px-4">
        <button @click.prevent="$refs.deleteAllRecordsModal.show" class="btn btn-danger delete-all-record btn-red mt-2 mb-2">
          <svg class="actions-btn-icon mr-2" width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.33333 8.16667V13.1667M9.66666 8.16667V13.1667M1.33333 4.83333H14.6667M13.8333 4.83333L13.1108 14.9517C13.0809 15.3722 12.8927 15.7657 12.5843 16.053C12.2758 16.3403 11.8699 16.5 11.4483 16.5H4.55166C4.13011 16.5 3.72422 16.3403 3.41573 16.053C3.10725 15.7657 2.91909 15.3722 2.88916 14.9517L2.16666 4.83333H13.8333ZM10.5 4.83333V2.33333C10.5 2.11232 10.4122 1.90036 10.2559 1.74408C10.0996 1.5878 9.88768 1.5 9.66666 1.5H6.33333C6.11231 1.5 5.90035 1.5878 5.74407 1.74408C5.58779 1.90036 5.49999 2.11232 5.49999 2.33333V4.83333H10.5Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg> Delete All Records
        </button>
      </div>

      <b-modal size="lg" ref="uploadCsvModal" footer-class="border-top-0 justify-content-start modal-footer-padding" header-class="border-bottom bg-white modal-header-padding align-items-center" dialog-class="modal-border-radius" body-class="modal-body-padding" hide-footer>
        <template #modal-header="{ close }">
          <h5>Upload CSV</h5>
          <b-button class="border-0 times-icon bg-transparent" @click="close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.15164 1.15162C1.37667 0.926659 1.68184 0.80028 2.00004 0.80028C2.31823 0.80028 2.6234 0.926659 2.84844 1.15162L8.00004 6.30322L13.1516 1.15162C13.2623 1.03701 13.3947 0.945593 13.5412 0.882703C13.6876 0.819812 13.845 0.786708 14.0044 0.785324C14.1637 0.783939 14.3217 0.814301 14.4692 0.874638C14.6167 0.934975 14.7506 1.02408 14.8633 1.13675C14.976 1.24942 15.0651 1.3834 15.1254 1.53088C15.1858 1.67835 15.2161 1.83637 15.2147 1.99571C15.2134 2.15504 15.1802 2.3125 15.1174 2.45891C15.0545 2.60531 14.963 2.73773 14.8484 2.84842L9.69684 8.00002L14.8484 13.1516C15.067 13.3779 15.188 13.6811 15.1852 13.9957C15.1825 14.3103 15.0563 14.6113 14.8338 14.8338C14.6113 15.0563 14.3104 15.1825 13.9957 15.1852C13.6811 15.188 13.378 15.067 13.1516 14.8484L8.00004 9.69682L2.84844 14.8484C2.62211 15.067 2.31899 15.188 2.00435 15.1852C1.68972 15.1825 1.38874 15.0563 1.16625 14.8338C0.943765 14.6113 0.817562 14.3103 0.814828 13.9957C0.812093 13.6811 0.933047 13.3779 1.15164 13.1516L6.30324 8.00002L1.15164 2.84842C0.926672 2.62339 0.800293 2.31822 0.800293 2.00002C0.800293 1.68183 0.926672 1.37666 1.15164 1.15162Z" fill="#64748B"/>
            </svg>
          </b-button>
        </template>
        <template #default>
          <div class="d-flex flex-column form-group justify-content-center align-items-center">
            <label class="label px-4 mx-2">
              If the CSV file contains SKUs that contain special fees, would you like to append the new special fee values or override (delete) the existing fees?
            </label>
            <div class="custom-control custom-switch mt-2">
              <input type="checkbox" v-model="overrideExisting" class="custom-control-input" id="overrideExistingCB">
              <label class="custom-control-label" for="overrideExistingCB" v-html="overrideExisting ? 'Override' : 'Append'" />
            </div>
          </div>
          <div class="bg-danger text-white p-2 mb-3 rounded d-none m-3" ref="fileSelectionErr">
            File type must be CSV
          </div>
          <div class="d-block set-max-width mx-auto py-4">
            <div class="progress mb-3" v-if="file.isLoading">
              <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :aria-valuenow="file.uploadingPercentage" aria-valuemin="0" aria-valuemax="100" :style="`width: ${file.uploadingPercentage}%`">{{ file.uploadingPercentage }}%</div>
            </div>
            <div class="cursor-pointer drag-drop-file-box mx-auto my-0 d-flex justify-content-center align-items-center overflow-hidden flex-column" @dragover="dragover" @dragleave="dragleave" @drop="drop" @click="$refs.file.click()">
              <input type="file" name="fields[assetsFieldHandle][]" id="assetsFieldHandle" class="d-none" @change="onChange($event)" ref="file" accept=".csv" />
              <div class="d-block mb-4">
                <svg width="44" height="58" viewBox="0 0 44 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.399994 7.4C0.399994 5.49044 1.15856 3.65909 2.50882 2.30883C3.85909 0.958566 5.69044 0.199997 7.59999 0.199997H24.1096C26.019 0.200405 27.85 0.959241 29.2 2.3096L41.4904 14.6C42.8407 15.9499 43.5996 17.781 43.6 19.6904V50.6C43.6 52.5096 42.8414 54.3409 41.4912 55.6912C40.1409 57.0414 38.3096 57.8 36.4 57.8H7.59999C5.69044 57.8 3.85909 57.0414 2.50882 55.6912C1.15856 54.3409 0.399994 52.5096 0.399994 50.6V7.4Z" fill="#64748B"/>
                </svg>
              </div>
              <h5 class="mb-1 text-center">
                Select a CSV file to <span> upload </span>
              </h5>
              <p class="p-o text-center">
                or drag and drop it here
              </p>
            </div>
          </div>
          <ul class="list-group mt-4" v-if="file.list.length" v-cloak>
            <li class="list-group-item d-flex justify-content-between align-items-center text-sm p-1" v-for="f in file.list" :key="f.name">
              {{ f.name }}
              <button class="badge bg-danger rounded-pill shadow-none border-0 text-white px-2 py-1 ml-2" type="button" @click="remove(file.list.indexOf(f))" title="Remove file">remove</button>
            </li>
          </ul>
          <div class="d-flex justify-content-center align-items-center">
            <a href="https://storage.googleapis.com/content.ezadtv.com/2022/09/26/633205ad8a1df_sample_product-fees.csv" class="btn-link font-weight-bold h5 mb-4" download>
              Download Sample CSV
            </a>
          </div>
        </template>
      </b-modal>

      <b-modal size="xl" @hide="removeEmptyRates" ref="addRecordModal" footer-class="border-top-0 justify-content-start" header-class="border-bottom bg-white align-items-center" dialog-class="modal-border-radius" body-class="modal-body-padding">
        <template #modal-header="{ close }">
          <h5>Add a Record</h5>
          <b-button class="border-0 times-icon bg-transparent mr-n3" @click="close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.15164 1.15162C1.37667 0.926659 1.68184 0.80028 2.00004 0.80028C2.31823 0.80028 2.6234 0.926659 2.84844 1.15162L8.00004 6.30322L13.1516 1.15162C13.2623 1.03701 13.3947 0.945593 13.5412 0.882703C13.6876 0.819812 13.845 0.786708 14.0044 0.785324C14.1637 0.783939 14.3217 0.814301 14.4692 0.874638C14.6167 0.934975 14.7506 1.02408 14.8633 1.13675C14.976 1.24942 15.0651 1.3834 15.1254 1.53088C15.1858 1.67835 15.2161 1.83637 15.2147 1.99571C15.2134 2.15504 15.1802 2.3125 15.1174 2.45891C15.0545 2.60531 14.963 2.73773 14.8484 2.84842L9.69684 8.00002L14.8484 13.1516C15.067 13.3779 15.188 13.6811 15.1852 13.9957C15.1825 14.3103 15.0563 14.6113 14.8338 14.8338C14.6113 15.0563 14.3104 15.1825 13.9957 15.1852C13.6811 15.188 13.378 15.067 13.1516 14.8484L8.00004 9.69682L2.84844 14.8484C2.62211 15.067 2.31899 15.188 2.00435 15.1852C1.68972 15.1825 1.38874 15.0563 1.16625 14.8338C0.943765 14.6113 0.817562 14.3103 0.814828 13.9957C0.812093 13.6811 0.933047 13.3779 1.15164 13.1516L6.30324 8.00002L1.15164 2.84842C0.926672 2.62339 0.800293 2.31822 0.800293 2.00002C0.800293 1.68183 0.926672 1.37666 1.15164 1.15162Z" fill="#64748B"/>
            </svg>
          </b-button>
        </template>

        <template #default>
          <div v-if="!form.productId">
            <h5>Please search for product by UPC/SKU</h5>
          </div>
          <div class="card top-add p-3 mb-4">
            <div class="row">
              <div class="col-sm-12 col-md-6 form-group mb-3 mb-md-0">
                <label class="label">
                  Product UPC/SKU
                </label>
                <div class="d-flex justify-content-start flex-row align-items-center">
                  <input type="number" class="form-control" placeholder="" :disabled="form.isLoading" v-model="form.identifier" />
                  <div class="d-block ml-3" v-if="form.isLoading">
                    <div class="spinner-border spinner-border-sm"></div>
                  </div>
                </div>
                <span ref="productErr" class="d-none text-danger">
                  Product is required
                </span>
                <span ref="productNumericErr" class="d-none text-danger">
                  Only Numeric allowed
                </span>
                <span class="d-none text-danger mt-2 pl-2 justify-content-start align-items-start" ref="productSearchErr">
                  Please wait, we are working on your query...
                </span>
              </div><!-- col end -->
              <div class="col-sm-12 col-md-6 form-group mb-0">
                <label class="label">
                  Price
                </label>
                <input type="number" class="form-control" placeholder="" v-model="form.price" readonly />
                <span ref="valueErr" class="d-none text-danger">
                  Amount field is required
                </span>
              </div><!-- col end -->
            </div>
          </div>
          <div v-if="productNotFound" class="text-center mb-4">
            <h6>Unable to find Product</h6>
          </div>
          <div ref="taxCollection">
            <div v-for="(tax, index) in form.fees" class="mb-3 border-bottom pb-3 d-xl-flex align-items-end" :key="index">
              <div class="row flex-grow-1">
                <div class="mb-3 col-md-6 col-xl-3">
                  <div class="form-group position-relative m-0">
                    <label class="label">
                      Rate
                    </label>
                    <input type="number" class="form-control" :disabled="form.isLoading" placeholder="" v-model="tax.fee" @keyup="setAmountAfterFeeAdded('form', index)" />
                    <div class="rate-box d-flex justify-content-between align-items-center p-0 border-0">
                      <label class="switch m-0">
                        <input type="checkbox" :disabled="form.isLoading" :checked="tax.fee_type == 'percentage'" @change="toggleType('form', index)" />
                        <div class="slider d-flex justify-content-between">
                          <span class="d-flex justify-content-center align-items-center"> $ </span>
                          <span class="d-flex justify-content-center align-items-center"> % </span>
                        </div>
                      </label>
                    </div>
                  </div><!-- form group end -->
                  <div class="d-flex flex-column">
                    <span :ref="`fee${index}Err`" class="d-none text-danger">
                        Rate field is required
                    </span>
                    <span :ref="`fee_type${index}Err`" class="d-none text-danger">
                        Fee Amount is required
                    </span>
                  </div>
                </div><!-- col end -->
                <div class="mb-3 col-md-6 col-xl-3 form-group">
                  <label class="label">
                    Total Amount
                  </label>
                  <input type="number" class="form-control" placeholder="" v-model="tax.totalValue" readonly />
                  <span :ref="`totalValue${index}Err`" class="d-none text-danger">
                    Total Amount field is required
                </span>
                </div><!-- col end -->
                <div class="col-4 col-md-6 col-xl-2 form-group">
                  <label class="label">
                    Taxable
                  </label>
                  <div class="custom-control custom-switch mt-2">
                    <input type="checkbox" v-model="tax.is_taxable" class="custom-control-input" :id="`new_${index}`" @change="setAmountAfterFeeAdded('form', index)" >
                    <label class="custom-control-label" :for="`new_${index}`" v-html="tax.is_taxable ? 'Yes' : 'No'" />
                  </div>
                </div>
                <div class="col-8 col-md-6 form-group" :class="{'col-xl-3': form.fees.length > 1, 'col-xl-4': form.fees.length <= 1}">
                  <label class="label">
                    Fee Message
                  </label>
                  <input :disabled="form.isLoading" class="form-control" placeholder="" v-model="tax.message" />
                  <span :ref="`message${index}Err`" class="d-none text-danger">
                    Fee Message field is required
                </span>
                </div><!-- col end -->
              </div>
              <button v-if="form.fees.length" class="btn btn-danger mb-3 ml-2 d-none d-xl-block" :disabled="form.isLoading" @click.prevent="removeMultipleTaxes(index)" aria-label="Remove Multiple Taxes">
                <svg class="upload-header-btn-icon" width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.33333 8.16667V13.1667M9.66666 8.16667V13.1667M1.33333 4.83333H14.6667M13.8333 4.83333L13.1108 14.9517C13.0809 15.3722 12.8927 15.7657 12.5843 16.053C12.2758 16.3403 11.8699 16.5 11.4483 16.5H4.55166C4.13011 16.5 3.72422 16.3403 3.41573 16.053C3.10725 15.7657 2.91909 15.3722 2.88916 14.9517L2.16666 4.83333H13.8333ZM10.5 4.83333V2.33333C10.5 2.11232 10.4122 1.90036 10.2559 1.74408C10.0996 1.5878 9.88768 1.5 9.66666 1.5H6.33333C6.11231 1.5 5.90035 1.5878 5.74407 1.74408C5.58779 1.90036 5.49999 2.11232 5.49999 2.33333V4.83333H10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div class="d-flex justify-content-center d-xl-none">
                <a href="#" @click.prevent="removeMultipleTaxes(index)">Remove Fee</a>
              </div>
            </div>
          </div>

          <div v-if="form.productId">
            <button class="btn-link bg-transparent border-0 text-decoration-none d-flex align-items-center lead" :disabled="form.isLoading" @click.prevent="addMultipleFees">
              <div v-if="form.isLoading" class="spinner-border spinner-border-sm mr-3"></div>
              <svg v-else class="mr-2" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 0C4.21217 0 4.41566 0.0842856 4.56569 0.234315C4.71571 0.384344 4.8 0.587827 4.8 0.8V3.2H7.2C7.41217 3.2 7.61566 3.28429 7.76569 3.43431C7.91571 3.58434 8 3.78783 8 4C8 4.21217 7.91571 4.41566 7.76569 4.56569C7.61566 4.71571 7.41217 4.8 7.2 4.8H4.8V7.2C4.8 7.41217 4.71571 7.61566 4.56569 7.76569C4.41566 7.91571 4.21217 8 4 8C3.78783 8 3.58434 7.91571 3.43431 7.76569C3.28429 7.61566 3.2 7.41217 3.2 7.2V4.8H0.8C0.587827 4.8 0.384344 4.71571 0.234315 4.56569C0.0842856 4.41566 0 4.21217 0 4C0 3.78783 0.0842856 3.58434 0.234315 3.43431C0.384344 3.28429 0.587827 3.2 0.8 3.2H3.2V0.8C3.2 0.587827 3.28429 0.384344 3.43431 0.234315C3.58434 0.0842856 3.78783 0 4 0Z" fill="#3B82F6"/></svg>
              <span class="font-weight-normal">
                Add Another Fee
              </span>
            </button>
          </div>
        </template>

        <template #modal-footer>
          <button class="btn btn-danger d-flex delete-all-record btn-red mt-2 mb-2 w-100 lead" :disabled="form.isLoading" @click.prevent="submitFeeProduct">
            <div v-if="form.isLoading" class="spinner-border spinner-border-sm mr-3"></div> Submit Record
          </button>
        </template>

      </b-modal>

      <b-modal size="md" ref="deleteAllRecordsModal" hide-header footer-class="border-0 pt-0">
        <template #default>
          <div class="card border-0 delete-all-card mt-2">
            <div class="card-body p-0">
              <div class="d-flex justify-content-start align-items-start flex-column flex-lg-row">
                <div class="d-block del-alert-img mr-3 mb-3 mb-lg-0">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z" fill="#FEE2E2"/>
                    <path d="M20 17V19M20 23H20.01M13.0718 27H26.9282C28.4678 27 29.4301 25.3333 28.6603 24L21.7321 12C20.9623 10.6667 19.0378 10.6667 18.268 12L11.3398 24C10.57 25.3333 11.5322 27 13.0718 27Z" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="d-block">
                  <h5 class="card-title">
                    Delete {{ archivedItems.list.length > 1 ? "all records" : "record"}}
                  </h5>
                  <p class="card-text p-0 m-0">
                    Are you sure you want to delete? All of your data will be permanently deleted. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #modal-footer="{ cancel }">
          <button @click="cancel" class="btn btn-outline-secondary add-record border-btn-plain mr-2" :disabled="archivedItems.isLoading">
            Cancel
          </button>
          <button class="btn btn-danger upload-csv btn-red" @click="archiveTaxProduct" :disabled="!archivedItems.list.length || archivedItems.isLoading">
            <div class="d-flex justify-content-sm-center" v-if="archivedItems.isLoading">
              <div class="spinner-border" role="status">
                <span class="sr-only"></span>
              </div>
            </div>
            <span v-else>Delete All Records</span>
          </button>
        </template>
      </b-modal>

    </section>
</template>

<script>
import { paginationConfig } from '@/config/modules';
import CustomFeeService from '@/api-services/special-fee.service';
import {debounce} from "debounce";
import NoPermission from './no-permission';

export default {
  name: "SpecialFees",
  components: { NoPermission },
  data() {
    return {
      ...paginationConfig,
      currentPage: 1,
      fields: [
        { key: 'select-row', label: ``, thStyle: { width: '70px' }, thClass: 'border-top-0 text-uppercase' },
        { key: 'product', label: 'UPC/SKU', thStyle: { width: '250px' }, thClass: 'border-top-0 text-uppercase' },
        { key: 'value', label: 'Price', thStyle: { width: '110px' }, thClass: 'border-top-0 text-uppercase' },
        { key: 'rate', label: 'Total Additional Fee', thStyle: { width: '210px' }, thClass: 'border-top-0 text-uppercase' },
        { key: 'afterFees', label: 'Amount After Fees + <br>APPLICABLE TAX', thStyle: { width: '198px' }, thClass: 'border-top-0 text-uppercase'},
        { key: 'action', label: '', sortable: false, thClass: 'border-top-0 text-uppercase' }
      ],
      items: [],
      detailsMask: [],
      archivedItems: {
        list: [],
        allSelected: false,
        isLoading: false,
      },
      itemsIsLoading: false,
      file: {
        list: [],
        isLoading: false,
        uploadingPercentage: 0,
      },
      form: {
        identifier: null,
        productId: null,
        price: null,
        fees: [],
        isLoading: false
      },
      search: {
        input: null,
        isLoading: false
      },
      isExporting: false,
      isUpdating: false,
      limit: 10,
      totalItems: 0,
      overrideExisting: true,
      productNotFound:false,
    };
  },
  watch: {
    '$route.query.page'() {
      this.getProductsWithFees();
    },
    "search.input": debounce(function() {
      this.getProductsWithFees();
    }, 900),
    "form.identifier": debounce(function() {
      if( this.form.identifier != null && this.form.identifier != "" ) {
        this.getProductDetails();
      }
    }, 900),
  },
  computed: {
    getItems() {
      return this.items.data;
    },
    taxRate() {
      const d = this.$store.state.businessDetails;
      return Number(d.tax_rate);
    },
  },
  mounted() {
    if(this.$ezHasNoPermission('manage_special_fees')) return;
    this.getProductsWithFees();
  },
  methods: {
    removeEmptyRates() {
      this.form.fees = this.form.fees.filter(tax => {
        return Boolean(tax.fee);
      });
    },
    openManualRecordModal() {
      this.emptyInputs('form');
      this.$refs.addRecordModal.show();
    },
    showUploadForm() {
      this.$refs.uploadCsvModal.show();
    },
    onChange() {
      // this.file.list = [...this.$refs.file.files];
      // this.$refs.file.value = null;
      this.file.list = this.$refs.file.files[0];
      this.uploadTaxProductsFile();
    },
    remove(i) {
      this.file.list.splice(i, 1);
    },
    dragover(event) {
      event.preventDefault();
      if (!event.currentTarget.classList.contains('bg-warning')) {
        event.currentTarget.classList.remove('bg-gray-100');
        event.currentTarget.classList.add('bg-warning');
      }
    },
    dragleave(event) {
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-warning');
    },
    drop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if((file.type === 'text/csv' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        this.$refs.file.files = event.dataTransfer.files;
        this.onChange();
        this.$refs.fileSelectionErr.classList.add("d-none");
      } else {
        this.$refs.fileSelectionErr.classList.remove("d-none");
      }
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-warning');
    },
    async getProductsWithFees() {
      if(this.itemsIsLoading === false) {
        this.itemsIsLoading = true;

        let form = {
          page: this.$route.query.page || 1,
          input: this.search.input,
          limit: this.limit
        };
        await CustomFeeService.getProductsWithFees(form).then(res => {
          res = res.data;
          if(res.status === 'success') {
            this.items = res.data;
            this.totalItems = res.data.total;
          } else {
            this.alertBox('Product SKU required', 'error');
          }
        }).catch((err) => {
          this.alertBox(err.message, 'error');
        }).finally(() => {
          this.itemsIsLoading = false;
          this.$refs['tableErr'].classList.add('d-none');
        });
      } else {
        this.$refs['tableErr'].classList.remove('d-none');
      }
    },
    async getProductDetails() {
      if(typeof this.form.identifier == 'string') {
        this.form.identifier.trim();
      }
      const newFee = [{
          fee: null,
          fee_type: 'flat',
          is_taxable: false,
          message: '',
        }
      ];

      if(this.form.identifier != null && this.isNumber(this.form.identifier) ) {
        if(this.form.isLoading === false) {
          this.form.isLoading = true;
          this.productNotFound = false;
          let form = {"product": this.form.identifier};
          await CustomFeeService.getProductDetails(form).then(res => {
              res = res.data;
              if(res.status === 'success') {
                this.form.productId = res.product.product_id;
                this.form.price = res.product.price;
                this.form.fees = res.product.fees && res.product.fees.length > 0 ? res.product.fees : newFee;
                this.productNotFound = false;
                this.calculateExistingFees('form');
              } else if (res.product == null ) {
                this.productNotFound = true;
                this.alertBox('Unable to find product.', 'warning');
              } else {
                this.form.productId = null;
                this.form.price = null;
                this.alertBox('Product SKU required', 'error');
              }
            })
            .catch((err) => {
              if( err.res.data.status == 'error' ) {
                this.alertBox(err.res.data.errors.product[0], 'error');
              } else {
                this.alertBox(err.message, 'error');
              }
            }).finally(() => {
              this.form.isLoading = false;
              this.$refs['productSearchErr'].classList.add('d-none');
              this.$refs['productNumericErr'].classList.add('d-none');
            });
        } else {
          this.$refs['productSearchErr'].classList.remove('d-none');
        }
      } else {
        this.$refs['productNumericErr'].classList.remove('d-none');
      }
    },
    toggleType(arrName, index) {
      this[arrName].fees[index].fee_type = this[arrName].fees[index].fee_type == "flat" ? "percentage" : "flat";
      this.setAmountAfterFeeAdded(arrName, index);
    },
    calculateExistingFees(arrName){
      if(this[arrName].fees) {
        this[arrName].fees.forEach((val, i) => {
          this.setAmountAfterFeeAdded(arrName,i);
        });
      }
    },
    setAmountAfterFeeAdded(arrName, index){
      let newFee = {
        fee: this[arrName].fees[index].fee,
        fee_type: this[arrName].fees[index].fee_type,
        is_taxable: this[arrName].fees[index].is_taxable,
      };
      if( this.isNumber(newFee.fee) ) {
        let getTaxAmount = parseFloat(this.calculateFeeImpact(this[arrName].price, newFee));
        getTaxAmount += parseFloat(this[arrName].price);
        this.$set(this[arrName].fees[index], "totalValue", getTaxAmount.toFixed(2));
      }
    },
    calculateFeeImpact(itemPrice, itemFee) {
      let amount = 0;
      const fee = itemFee.fee && itemFee.fee !== "" ? parseFloat(itemFee.fee) : 0;
      if(fee <= 0) {
        return amount;
      }
      if(itemFee.fee_type == "flat") {
        amount = fee;
      } else if (itemFee.fee_type == "percentage") {
        amount = itemPrice * fee / 100;
      }

      if(itemFee.is_taxable == true) {
        amount += (amount * this.taxRate / 100);
      }
      return amount.toFixed(2);
    },
    getAmountAfterAllFees(data) {
      return (this.getItemPriceAfterTax(parseFloat(data.price)) + parseFloat(this.getTotalFees(data))).toFixed(2);
    },
    getItemPriceAfterTax(price) {
      return price > 0 ? price + (price * this.taxRate / 100) : 0;
    },
    getTotalFees(data) {
      let total = 0;
      data.fees.forEach(fee => {
        total += parseFloat(this.calculateFeeImpact(data.price, fee));
      });
      return total;
    },
    async submitFeeProduct() {
      this.form.isLoading = true;
      let checkValidation = this.validateInputs('form');
      console.log("checkValidation", checkValidation);
      if( checkValidation === true) {
        let form = { identifier: this.form.identifier, productId: this.form.productId, fees: this.form.fees };
        await CustomFeeService.addFee(form).then(res => {
          res = res.data;
          if(res.status === 'success') {
            this.getProductsWithFees();
            this.$refs.addRecordModal.hide();
            this.alertBox(res.message, 'success');
          } else if (res.data == null ) {
            this.alertBox('No data found.', 'warning');
          } else {
            this.alertBox('Something went wrong', 'error');
          }
        }).catch(err => {
          if(err.res.data.status == 'error') {
            this.alertBox(err.res.data.errors.message, 'error');
          } else {
            this.alertBox(err.message, 'error');
          }
        }).finally(() => {
          this.form.isLoading = false;
          this.emptyInputs('form');
        });
      } else {
        this.form.isLoading = false;
      }
    },
    addMultipleFees() {
      this.form.fees.push({
        fee: null,
        fee_type: "flat",
        message: null,
        is_taxable: false,
        totalValue: null
      });
      setTimeout(() => {
        const el = this.$refs.taxCollection;
        if(el) {
          el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
        }
      }, 200);
    },
    removeMultipleTaxes(index) {
      this.form.fees.splice(index, 1);
    },
    toggleFeeType(identifier, pIndex, index) {
      this.items.data[pIndex].fees[index].fee_type = this.items.data[pIndex].fees[index].fee_type == "flat" ? "percentage" : "flat";
      this.updateProductFees(identifier, pIndex, index);
    },
    removeFee(identifier, pIndex, index) {
      this.items.data[pIndex].fees.splice(index);
      this.updateProductFees(identifier, pIndex, index, true);
    },
    async updateProductFees(identifier, pIndex, index, isDeleted=false) {
      let product = this.getItems.find(i => i.identifier == identifier);
      if( (isDeleted || this.items.data[pIndex].fees[index].loading !== true) && product != undefined ) {
        if(!isDeleted) {
          this.$set(this.items.data[pIndex].fees[index], 'loading', true);
        }
        this.isUpdating = true;
        await CustomFeeService.addFee({ "productId": product.product_id, "identifier": identifier, "fees": product.fees })
        .then((res) => {
          res = res.data;
          if (res.status === 'success' && res.data !== null) {
            // this.items = res.data;
            this.alertBox(res.message, 'success');
          } else if (res.data == null ) {
            this.alertBox("No data found.", 'warning');
          } else {
            this.alertBox("Something went wrong", 'error');
          }
        })
        .catch((err) => {
          if( err.res.data.status == 'error' ) {
            this.alertBox(err.res.data.errors.message, 'error');
          } else {
            this.alertBox(err.message, 'error');
          }
        })
        .finally(() => {
          if(!isDeleted) {
            this.$set(this.items.data[pIndex].fees[index], 'loading', false);
          }
        });
      }
    },
    async archiveTaxProduct() {
      if( this.archivedItems.isLoading === false && this.archivedItems.list.length) {
        this.archivedItems.isLoading = true;
        await CustomFeeService.deleteFee(this.archivedItems)
        .then((res) => {
          res = res.data;
          if (res.status === 'success' && res.data !== null) {
            this.getProductsWithFees();
            this.alertBox(res.message, 'success');
          } else if (res.data == null ) {
            this.alertBox("No data found.", 'warning');
          } else {
            this.alertBox("Something went wrong", 'error');
          }
        })
        .catch((err) => {
          if( err.res.data.status == 'error' ) {
            this.alertBox(err.res.data.errors.message, 'error');
          } else {
            this.alertBox(err.message, 'error');
          }
        })
        .finally(() => {
          this.archivedItems.isLoading = false;
          this.emptyInputs("form");
          this.archivedItems.list = [];
          this.archivedItems.allSelected = false;
          this.$refs.deleteAllRecordsModal.hide();
        });
      }
    },
    uploadTaxProductsFile() {
      let formData = new FormData(),
      self = this;
      formData.append('overrideExisting', this.overrideExisting);
      formData.append('file', this.file.list);
      if( this.file.isLoading === false ) {
        this.file.isLoading = true;
        CustomFeeService.doUploadTaxProductsFile(formData, self)
        .then((res) => {
          res = res.data;
          if (res.status) {
            this.$refs.uploadCsvModal.hide();
            this.alertBox(res.message, 'success');
            this.getProductsWithFees();
          }
        })
        .catch(() => {
          this.alertBox("Unable to upload fee file, please contact support", 'error');
        })
        .finally(() => {
          this.file.isLoading = false;
          this.file.list = [];
          this.file.uploadingPercentage = 0;
        });
      }
    },
    validateInputs(getArr) {
      let count = 0;
      Object.keys(this[getArr]).forEach(val => {
        if(val != 'isLoading' && val != 'productId') {
          if(val != 'fees') {
            let setRef = `${val}Err`;
            if(this[getArr][val] == null || this[getArr][val] == '') {
              this.$refs[setRef] && this.$refs[setRef].classList.remove('d-none');
              count++; 
            } else {
              this.$refs[setRef] && this.$refs[setRef].classList.add('d-none');
            }
          } else {
            Object.keys(this[getArr][val]).forEach((index) => {
              Object.keys(this[getArr][val][index]).forEach((taxKey) => {
                if(taxKey !== 'fee_type' && taxKey != 'loading' && taxKey != 'is_taxable') {
                  let setRef = `${taxKey}${index}Err`;
                  if(this[getArr][val][index][taxKey] == null || this[getArr][val][index][taxKey] == '') {
                    this.$refs[setRef] && this.$refs[setRef][0].classList.remove('d-none');
                    count++;
                  } else {
                    this.$refs[setRef] && this.$refs[setRef][0].classList.add('d-none');
                  }
                }
              });
            });
          }
        }
      });
      if( count > 0 ) return false;
      else return true;
    },
    emptyInputs(getArr){
      Object.keys(this[getArr]).forEach((key) => {
        if( key != "isLoading" ) {
          if( key == "fee_type" ) this.$set(this[getArr], key, "flat");
          else if (key == "fees" ) {
            this.$set(this[getArr], key, []);
          }
          else this.$set(this[getArr], key, null);
        }
      });
    },
    selectAll() {
      this.archivedItems.list = [];
      if (!this.archivedItems.allSelected) {
        this.getItems.forEach((val, key) => {
          this.archivedItems.list.push(this.getItems[key].identifier);
        });
      } else {
        this.archivedItems.list = [];
      }
    },
    exportToCsv() {
      if(this.isExporting === false) {
        this.isExporting = true;
        let form = {
          "list":   this.archivedItems.list,
          "search": this.search.input != null ? this.search.input : ''
        };
        CustomFeeService.exportToCsv(form)
          .then((res) => {
            res = res.data;

            if (!res.status) {
              this.alertBox(res.message, 'error');
              return;
            }

            let reportContent = "";
            let columns = "";

            Object.keys(res.data[0]).forEach(function (column) {
              columns += column.replaceAll('-', '_') + ',';
            });
            reportContent += columns + "\r\n";

            res.data.forEach(function (e) {
              let row = "";
              let value = "";
              Object.keys(res.data[0]).forEach(function (column) {
                value = e[column] ? e[column].toString().trim()  : '';
                value = value.replace(/"/g, '""');
                value = value.replace(/(\r\n|\n|\r|\t)/gm, "");
                if (value.search(/("|,|\n)/g) >= 0) {
                  value = '"' + value + '"';
                }
                row += value + ',';
              });
              reportContent += row + "\r\n";
            });

            let pom = document.createElement('a');
            let blob = new Blob([reportContent],{type: 'text/csv;charset=utf-8;'});
            let url = URL.createObjectURL(blob);
            pom.href = url;
            pom.setAttribute('download', 'specialFees');
            pom.click();
          })
          .catch((err) => {
            if( err.res.data.status == 'error' ) {
              let msg = err.res.data.errors.message ? err.res.data.errors.message : err.res.data.message;
              this.alertBox(msg, 'error');
            } else {
              this.alertBox(err.message, 'error');
            }
          })
          .finally(() => {
            this.$refs["tableErr"].classList.add("d-none");
            this.archivedItems.list = [];
            this.archivedItems.allSelected = false;
            this.isExporting = false;
          });
      } else {
        this.$refs["tableErr"].classList.remove("d-none");
      }
    },
    addNewCustomFee(data) {
      this.emptyInputs('form');
      let form = JSON.parse(JSON.stringify({
        identifier: data.identifier,
        productId: data.product_id,
        price: data.price,
        fees: data.fees,
        isLoading: false
      }));
      this.form = form;
      setTimeout(()=>{
        if(this.form.isLoading == false) {
          this.$refs.addRecordModal.show();
        }
      }, 900);
    },
    alertBox(msg, type) {
      this.$swal({
        toast: true,
        position: 'top',
        type: `${type}`,
        html: `<div class="ml-2">${msg}</div>`,
        showConfirmButton: false,
        timer: 3000
      });
    },
    isNumber(str) {
      let pattern = /^\d+\.?\d*$/;
      return pattern.test(str);  // returns a boolean
    },
  }
};
</script>

<style scoped lang="scss">
// full red btn
$btn-red-bg: #EF4444;
$btn-red-clr: #fff;
// red border btn
$btn-red-light-bg: #FECACA;
$border-btn-red: 1px solid $btn-red-light-bg;
$border-btn-red-clr: #DC2626;
$border-btn-red-bg: #FEF2F2;
// plain border btn
$border-btn-plain-light-bg: #CBD5E1;
$border-btn-plain: 1px solid $border-btn-plain-light-bg;
$border-btn-plain-clr: #1E293B;
$border-btn-plain-bg: #FFFFFF;
// all btn default
$btn-radius: 10px;
$btn-padding: 12px 24px;
// input radius
$input-radius: 15px;
$input-bg: #fff;
$input-color: #94A3B8;
// default shadow
$box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
// all border bottoms
$border-line: 1px solid #E2E8F0;
// table default
$th-color: #64748B;
$height: 48px;

  .more-details {
    background: #F8FAFC;
    border: $border-line;
    border-radius: 10px;
  }
  .add-another-tax {
    border-top: $border-line;
  }
  .transition {
    transition: all ease-in-out 300ms;
  }
  .rotate {
    transform: rotate(180deg);
  }
  .top-add {
    background: #F1F5F9;
    border: 1px solid #E2E8F0;
  }
  .rate-box {
    width: 177px;
    height: 40px;
    padding: 4px 4px 4px 15px;
    background: #FFFFFF;
    border: $border-line;
    box-shadow: $box-shadow;
    border-radius: 10px;
    line-height: 0;
    .rate-digit {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: $border-btn-plain-clr;
    }
  }
  .switch {
    position: relative;
    display: inline-block;
    width: 110px;
    height: 34px;
    input {
      opacity: 0;
      width: 0;
      height: 0;
      &:checked + .slider span:last-of-type,
      &:not(:checked) + .slider span:first-of-type {
        color: #fff;
      }
      &:checked + .slider:before {
        border-radius: 0 12px 12px 0;
        -webkit-transform: translateX(55px);
        -ms-transform: translateX(55px);
        transform: translateX(55px);
      }
    }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #fff;
      border: 1px solid #E2E8F0;
      z-index: 7;
      border-radius: 12px;
      -webkit-transition: .4s;
      transition: .4s;
      &:before {
        position: absolute;
        content: "";
        height: 34px;
        width: 55px;
        left: -1px;
        bottom: 0;
        top: -1px;
        z-index: -1;
        background-color: #475569;
        border: 1px solid #E2E8F0;
        border-radius: 12px 0 0 12px;
        -webkit-transition: .4s;
        transition: .4s;
      }
      span {
        flex: 0 0 55px;
        -webkit-transition: .4s;
        transition: .4s;
      }
    }
  }
  .navigation-box .container, .upload-navigation-btns, .upload-header-btns {
    gap: 8px;
  }
  .navigation-box {
    border-bottom: $border-line;
    h1 {
      font-weight: 600;
      font-size: 24px;
      line-height: 32px;
      color: #334155;
    }
  }
  .actions-con {
    background-color: $btn-red-light-bg;
  }
  .upload-search-box {
    input {
      max-width: 451px;
      width: 100%;
    }
  }
  .form-group {
    .rate-box {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: auto;
      .switch {
        height: 41px;
        .slider {
          &:before {
            height: 41px;
          }
        }
      }
    }
    label {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: $border-btn-plain-clr;
    }
    input,
    textarea {
      height: $height;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: $input-color;
      padding: 12px 24px !important;
      border: $border-line;
      box-shadow: $box-shadow;
      border-radius: $input-radius;
      &::placeholder {
        color: $input-color;
      }
    }
  }
  .upload-table-box {
    table {
      &.table-striped tbody tr:nth-of-type(odd),
      thead {
        background: transparent;
      }
      thead th, tbody td {
        font-weight: 500;
        padding-top: 24px;
        padding-bottom: 24px;
        font-size: 16px;
        button {
          font-size: 16px;
        }
      }
      thead {
        th {
          font-size: 14px;
          line-height: 20px;
          color: $th-color;
          border-color: #E2E8F0;
        }
      }
      tbody {
        tr {
          &:last-of-type td {
            border-bottom: $border-line;
          }
        }
        td {
          color: $border-btn-plain-clr;
          border-color: #E2E8F0;
        }
      }
    }
  }
  .card-body {
    h5 {
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      color: $border-btn-plain-clr;
    }
    p {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: $th-color;
    }
  }
  .bg-gray-100 {
    background: #F8FAFC;
  }
  .set-max-width {
    max-width: 546px;
  }
  .drag-drop-file-box {
    min-height: 265px;
    background: #F8FAFC;
    border: 2px dashed $border-btn-plain-light-bg;
    border-radius: $input-radius;
    h5 {
      font-weight: 600;
      font-size: 20px;
      line-height: 28px;
      color: #334155;
      span {
        color: #2563EB;
      }
    }
    p {
      font-weight: 500;
      color: $th-color;
    }
  }
  :deep(.modal-content) {
    max-height: calc((var(--vh, 1vh) * 100) - 1rem);
    .modal-body {
      overflow: auto;
    }
  }
  @media (min-width: 576px ) {
    :deep(.modal-content) {
      max-height: calc((var(--vh, 1vh) * 100) - 3.5rem);
    }
  }
  .spinner {
    position: absolute;
    width: 100%;
    left: 0;
    height: 100%;
    background: rgba(255,255,255,.6);
  }
</style>
