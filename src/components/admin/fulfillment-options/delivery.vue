<template>
  <div v-if="options">
    <div>
      <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
        <div v-if="readOnly && wizard_enabled">
          <h5 class="mb-0 font-weight-bold">Local Delivery</h5>
          <div class="text-muted mr-0 mr-sm-5">
            Offer local delivery to your customers which means that you or one of your staff members 
            will drive out the order to the address listed on the cart. Customize delivery options 
            and messaging when enabling this.
          </div>
        </div>
        <div v-if="stores.length == 1" class="custom-control custom-switch flex-column">
          <input type="checkbox" v-model="options.delivery_enabled" class="custom-control-input" id="delivery" @change="saveData">
          <label class="custom-control-label" for="delivery">{{options.delivery_enabled ? 'Enabled' : 'Disabled'}}</label>
        </div>
        <button v-if="readOnly && wizard_enabled" :disabled="configureLoading" class="btn btn-outline-primary btn-xs ml-0 ml-sm-3 mt-2 mt-sm-0" type="button" @click="configureSettings">
          <span v-if="configureLoading" class="spinner-border spinner-border-sm mr-2"></span>
          Configure
        </button>
      </div>
    </div>
    <slot v-if="configure || (!readOnly || !wizard_enabled)"></slot>
    <div v-if="stores.length > 1 && (configure || (!readOnly || !wizard_enabled))" class="d-flex justify-content-between align-items-center">
      <div class="custom-control custom-switch flex-column">
        <input type="checkbox" v-model="options.delivery_enabled" class="custom-control-input" id="delivery" @change="saveData">
        <label class="custom-control-label" for="delivery">{{options.delivery_enabled ? 'Enabled' : 'Disabled'}}</label>
      </div>
    </div>  
    <transition v-if="configure || (!readOnly || !wizard_enabled)" name="fadeHeight">
      <div v-if="configure || options.delivery_enabled" :class="{ 'disabled': !options.delivery_enabled }">
        <div class="card p-4 mt-3">
          <div class="row">
            <div class="col-xl-6 border-right section">
              <!-- DELIVERY AREA AND CHARGE -->
              <div class="delivery-area">
                <h6 class="font-weight-bold">Delivery Area and Charge</h6>
                <form class="d-flex mt-3 mb-2" @submit.prevent="addZipcode">
                  <div class="mr-2">
                    <label>Zip Code</label>
                    <input type="number" ref="zip_code" id="zip_code" class="form-control" v-model="zipcode.code" required />
                  </div>
                  <div class="mr-2">
                    <label>Charge (optional)</label>
                    <div class="input-group" style="width: 150px;">
                      <div class="input-group-prepend">
                        <span class="input-group-text">$</span>
                      </div>
                      <input type="number" class="form-control" min="0" @keypress="isNumber($event)"  v-model="zipcode.fee" />
                    </div>
                  </div>
                  <div class="input-group d-flex flex-column justify-content-end align-items-start">
                    <button type="submit" class="btn btn-outline-primary">Add</button>
                  </div>
                </form>
                <div v-if="zipCodeAlert" class="text-danger">{{ zipCodeAlert }}</div>
                <template v-if="options.delivery_locations && options.delivery_locations.length">
                  <div class="label font-weight-bold mt-3 mb-2">
                    Active Delivery Areas
                  </div>
                  <table class="table">
                    <tr>
                      <td>Code</td>
                      <td>Charge</td>
                      <td width="90"></td>
                    </tr>
                    <tr v-for="(zip, index) in options.delivery_locations" :key="`del_${index}`">
                      <td>
                        <input :ref="`zipInput_${index}`" v-if="editingZip == index" type="text" class="form-control" v-model="zip.code" />
                        <span v-if="editingZip != index">{{zip.code}}</span>
                      </td>
                      <td>
                        <input v-if="editingZip == index" type="text" class="form-control" v-model="zip.fee" />
                        <span v-if="editingZip != index">{{zip.fee}}</span>
                      </td>
                      <td>
                        <div class="d-inline-flex align-items-center">
                          <a v-if="editingZip == index" href="#" @click.prevent="editZipcode(zip, index)">Save</a>
                          <a v-else href="#" @click.prevent="startEditingZip(index)">Edit</a>
                          <a class="ml-3" href="#" @click.prevent="removeZipcode(index)" aria-label="Remove Zipcode">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </a>
                        </div>
                      </td>
                    </tr>
                  </table>
                </template>
              </div>

              <!-- RENTAL DELIVERY AREA AND CHARGE -->
              <div class="delivery-area" v-if="options.delivery_enabled && allowRentalDeliveryLocations">
                <h6 class="font-weight-bold">Delivery Area and Charge for Rental Products</h6>
                <form class="d-flex mt-3 mb-2" @submit.prevent="addRentalDeliveryZip">
                  <div class="mr-2">
                    <label>Zip Code</label>
                    <input type="number" ref="rental_zip_code" id="rental_zip_code" class="form-control" v-model="rentalZipCode.code" required />
                  </div>
                  <div class="mr-2">
                    <label>Charge (optional)</label>
                    <div class="input-group" style="width: 150px;">
                      <div class="input-group-prepend">
                        <span class="input-group-text">$</span>
                      </div>
                      <input type="number" class="form-control" v-model="rentalZipCode.fee" />
                    </div>
                  </div>
                  <div class="input-group d-flex flex-column justify-content-end align-items-start">
                    <button type="submit" class="btn btn-outline-primary">Add</button>
                  </div>
                </form>
                <div v-if="rentailZipCodeAlert" class="text-danger">{{ rentailZipCodeAlert }}</div>
                <template v-if="rentalLocations && rentalLocations.length">
                  <div class="label font-weight-bold mt-3 mb-2">
                    Active Rental Delivery Areas
                  </div>
                  <table class="table">
                    <tr>
                      <td>Code</td>
                      <td>Charge</td>
                      <td width="90"></td>
                    </tr>
                    <tr v-for="(zip, index) in rentalLocations" :key="`rental_${index}`">
                      <td>
                        <input :ref="`rentalZipInput_${index}`" v-if="editingRentalZip == index" type="text" class="form-control" v-model="zip.code" />
                        <span v-if="editingRentalZip != index">{{zip.code}}</span>
                      </td>
                      <td>
                        <input v-if="editingRentalZip == index" type="text" class="form-control" v-model="zip.fee" />
                        <span v-if="editingRentalZip != index">{{zip.fee}}</span>
                      </td>
                      <td>
                        <div class="d-inline-flex align-items-center">
                          <a v-if="editingRentalZip == index" href="#" @click.prevent="editRentalZipcode(zip, index)">Save</a>
                          <a v-else href="#" @click.prevent="startEditingRentalZip(index)">Edit</a>
                          <a class="ml-3" href="#" @click.prevent="removeRentalZipcode(index)" aria-label="Remove Rental Zipcode">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </a>
                        </div>
                      </td>
                    </tr>
                  </table>
                </template>
              </div>
            </div>
            <div class="col-xl-6 section">
              <div class="mb-4" v-if="false">
                <h6 class="font-weight-bold">Delivery Fee</h6>
                <label>Fee</label>
                <div class="input-group" style="width: 150px;">
                  <div class="input-group-prepend">
                    <span class="input-group-text">$</span>
                  </div>
                  <input type="number" :disabled="!enabled" class="form-control" v-model="options.delivery_fee" @change="saveData">
                </div>
              </div>
              <!-- DELIVERY MESSAGE -->
              <div class="delivery-message">
                <h6 class="font-weight-bold">Local Delivery Product Page Message</h6>
                Add customer message shown on product pages for in-stock items.
                <div class="border flex-grow-1 mt-3">
                  <div class="border-bottom font-weight-bold text-uppercase py-2 px-3">How to get it</div>
                  <div class="py-2 px-3">
                    <div class="d-flex align-items-center">
                      <div class="mr-3 text-primary">
                        <svg width="38" height="38" viewBox="0 0 50 50" class="d-none d-sm-inline" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fill-rule="evenodd"><path d="M49.025 49.18H.778A.773.773 0 010 48.412c0-.424.348-.769.778-.769h48.247c.43 0 .778.345.778.769a.773.773 0 01-.778.768z"/><path d="M3.89 49.18a.773.773 0 01-.777-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM45.912 49.18a.773.773 0 01-.778-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM48.247 15.37a.778.778 0 01-.739-.526L43.017 1.537H6.787L2.294 14.844a.78.78 0 01-.985.485.766.766 0 01-.492-.972L5.488.525A.777.777 0 016.224 0h37.353c.335 0 .632.212.738.525l4.669 13.832a.766.766 0 01-.492.972.784.784 0 01-.246.04z"/><path d="M15.563 10.758h-1.556a.773.773 0 01-.778-.768c0-.425.348-.769.778-.769h1.556a.774.774 0 00.779-.768.774.774 0 00-.779-.769c-1.287 0-2.334-1.034-2.334-2.305 0-1.271 1.047-2.305 2.334-2.305h1.557c.43 0 .778.344.778.768a.773.773 0 01-.778.769h-1.557a.774.774 0 00-.778.768c0 .424.35.769.778.769 1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305zM20.232 10.758a.773.773 0 01-.778-.768V3.842c0-.424.349-.768.778-.768.43 0 .779.344.779.768V9.99a.773.773 0 01-.779.768z"/><path d="M23.345 7.684h-3.113a.773.773 0 01-.778-.768c0-.424.349-.768.778-.768h3.113c.43 0 .778.344.778.768a.773.773 0 01-.778.768z"/><path d="M23.345 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768.43 0 .778.344.778.768V9.99a.773.773 0 01-.778.768zM28.014 10.758c-1.287 0-2.334-1.034-2.334-2.305V5.379c0-1.271 1.047-2.305 2.334-2.305 1.287 0 2.335 1.034 2.335 2.305v3.074c0 1.271-1.048 2.305-2.335 2.305zm0-6.147a.774.774 0 00-.778.768v3.074c0 .423.35.768.778.768a.774.774 0 00.778-.768V5.379a.774.774 0 00-.778-.768zM32.683 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768h1.556c1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305h-.778V9.99a.773.773 0 01-.778.768zm.778-4.61h.778a.774.774 0 00.779-.769.774.774 0 00-.779-.768h-.778v1.537zM3.89 19.98c-1.715 0-3.112-1.38-3.112-3.074V14.6c0-.424.349-.768.778-.768.43 0 .779.344.779.768v2.306c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M8.56 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M13.229 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M17.898 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M22.567 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M27.236 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M31.905 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M36.574 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M41.243 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M45.912 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537V14.6c0-.424.349-.768.779-.768.43 0 .778.344.778.768v2.306c0 1.695-1.397 3.074-3.113 3.074zM47.725 13.832H2.078a.773.773 0 01-.779-.768c0-.425.349-.769.779-.769h45.647c.43 0 .778.344.778.769a.773.773 0 01-.778.768zM41.243 49.18H30.349a.773.773 0 01-.779-.768V29.969c0-.424.349-.768.779-.768h10.894c.43 0 .778.344.778.768v18.443a.773.773 0 01-.778.768zm-10.116-1.537h9.338V30.738h-9.338v16.905zM27.236 41.496H8.56a.773.773 0 01-.778-.769V29.97c0-.424.348-.768.778-.768h18.676c.43 0 .778.344.778.768v10.758a.773.773 0 01-.778.769zM9.338 39.959h17.12v-9.221H9.338v9.221z"/><g><path d="M11.673 35.348a.78.78 0 01-.55-.225.761.761 0 010-1.086l1.556-1.537c.304-.3.796-.3 1.1 0 .304.3.304.786 0 1.086l-1.556 1.537a.78.78 0 01-.55.225z"/></g><g><path d="M13.229 37.654a.78.78 0 01-.55-.225.761.761 0 010-1.087l3.112-3.074c.304-.3.797-.3 1.1 0 .305.3.305.787 0 1.087l-3.112 3.074a.78.78 0 01-.55.225z"/></g><g><path d="M38.13 41.496a.824.824 0 01-.552-.223.802.802 0 01-.226-.546c0-.2.086-.4.226-.545.295-.285.817-.285 1.105 0 .14.146.225.345.225.545 0 .2-.085.4-.225.546a.825.825 0 01-.553.223z"/></g><g><path d="M38.908 7.684a.824.824 0 01-.552-.222.802.802 0 01-.226-.546c0-.208.086-.4.226-.546.296-.284.817-.284 1.105 0 .14.146.226.346.226.546 0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"/></g><g><path d="M10.894 7.684a.788.788 0 01-.552-.222.802.802 0 01-.226-.546c0-.2.086-.4.226-.546.288-.284.817-.284 1.105 0a.79.79 0 01.226.546c0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"/></g></g></svg>
                      </div>
                      <div class="flex-grow-1" v-if="$store.state.currentStore && options.delivery_settings">
                        <h6 class="font-weight-bold mb-1">Local Delivery</h6>
                        <a href="#" v-if="options.delivery_locations && options.delivery_locations.length">View Delivery Area</a>
                        <span v-else>Delivery</span>
                        for {{selectedStoreLoc.name}}, {{selectedStoreLoc.zip}}
                        <b-form-textarea v-model="options.delivery_settings.delivery_pdp_message" placeholder="Optional message" class="mt-2" rows="1" max-rows="6" @blur="saveData" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- DELIVERY DISCLAIMER -->
              <div class="delivery-disclaimer border-top mt-4 pt-4">
                <h6 class="font-weight-bold">Delivery Disclaimer - Checkout Message</h6>
                Edit or remove default delivery disclaimer shown on checkout.
                <b-form-textarea rows="2" max-rows="6" placeholder="Add a Disclamer..." v-model="options.delivery_settings.delivery_disclaimer" class="form-control mt-2" id="delivery-disclaimer" @blur="saveData"></b-form-textarea>
              </div>

              <!-- DELIVERY DATEPICKER -->
              <div class="delivery-datepicker border-top mt-4 pt-4">
                <h6 class="font-weight-bold">Datepicker</h6>
                <div class="row">
                  <div class="col-sm-6 col-xl-12">
                    <label>Datepicker for choosing delivery day</label>
                    <div class="custom-control custom-switch">
                      <input type="checkbox" v-model="options.delivery_settings.delivery_datepicker" class="custom-control-input" id="deliveryDatepicker" @change="saveData">
                      <label class="custom-control-label" for="deliveryDatepicker" v-html="options.delivery_settings.delivery_datepicker ? 'Enabled' : 'Disabled'"></label>
                    </div>
                  </div>
                  <template v-if="options.delivery_settings.delivery_datepicker">
                    <div class="mt-3 col-sm-6 col-xl-12">
                      <label>Offset Earliest Delivery Date</label>
                      <input :disabled="!options.delivery_settings.delivery_datepicker" class="form-control" v-model="options.delivery_settings.delivery_datepicker_min_date" type="number" @change="saveData" />
                    </div>
                    <div class="mt-3 col-sm-6">
                      <label>Allow delivery on weekends</label>
                      <div class="custom-control custom-switch">
                        <input type="checkbox" :disabled="!options.delivery_settings.delivery_datepicker" v-model="options.delivery_settings.delivery_on_weekends" class="custom-control-input" id="deliveryOnWeekends" @change="saveData">
                        <label
                          class="custom-control-label"
                          for="deliveryOnWeekends"
                          v-html="options.delivery_settings.delivery_on_weekends ? 'Enabled' : 'Disabled'">
                        </label>
                      </div>
                    </div>
                    <div class="mt-3 col-sm-6">
                      <label>Allow customers to Pick Time</label>
                      <div class="custom-control custom-switch">
                        <input type="checkbox" :disabled="!options.delivery_settings.delivery_datepicker" v-model="options.delivery_settings.enable_time" class="custom-control-input" id="enableTime" @change="saveData">
                        <label
                          class="custom-control-label"
                          for="enableTime"
                          v-html="options.delivery_settings.enable_time ? 'Enabled' : 'Disabled'">
                        </label>
                      </div>
                    </div>
                    <div class="mt-3 col-sm-6" v-if="options.delivery_settings.delivery_datepicker">
                      <div class="custom-control custom-checkbox ml-n1">
                        <input type="checkbox" class="custom-control-input" id="limit-time" v-model="options.delivery_settings.limit_time" @change="saveData">
                        <label class="custom-control-label" for="limit-time">
                          Limit time
                        </label>
                      </div>
                    </div>
                    <div class="mt-3 col-sm-6" v-if="options.delivery_settings.delivery_on_weekends">
                      <div class="custom-control custom-checkbox ml-n1">
                        <input type="checkbox" class="custom-control-input" id="closed-sundays" v-model="options.delivery_settings.closed_on_sundays" @change="saveData">
                        <label class="custom-control-label" for="closed-sundays">
                          Closed on Sundays
                        </label>
                      </div>
                    </div>
                  </template>
                </div>

                <div class="d-flex justify-content-between mt-4" v-if="options.delivery_settings.delivery_datepicker && options.delivery_settings.limit_time">
                  <div class="text-center flex-grow-1" v-for="t in options.delivery_settings.time_ranges" :key="t.day">
                    <div class="font-weight-bold text-uppercase">{{t.day}}</div>
                    <vue-timepicker format="hh A" placeholder="from" v-model="t.from" />
                    <vue-timepicker format="hh A" placeholder="to" v-model="t.to" :hour-range="[[simplifyTimeFormat(t.from), '11p']]" />
                  </div>
                </div>

              </div>
            </div>
            <div v-if="false" class="col-12">
              <div class="timerange-selector mt-3" v-if="options.delivery_settings.limit_time">
                <div class="d-flex flex-wrap">
                  <div v-for="t in options.delivery_settings.time_ranges" :key="t.day" class="mr-3">
                    <div class="text-uppercase font-weight-bold">{{t.day}}</div>
                    <div class="d-flex align-items-center mb-2">
                      <div class="input-group from mr-3">
                        <span class="input-group-prepend input-group-text text-small font-weight-bold">From</span>
                        <!--<input type="time" class="form-control" v-model="t.from">-->
                        <vue-timepicker input-class="form-control" format="hh A" v-model="t.from" />
                      </div>
                      <div class="input-group to">
                        <span class="input-group-prepend input-group-text text-small font-weight-bold">To</span>
                        <!--<input type="time" class="form-control" v-model="t.to">-->
                        <vue-timepicker input-class="form-control" format="hh A" v-model="t.to" :hour-range="[[simplifyTimeFormat(t.from), '11p']]" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="text-uppercase font-weight-bold text-white">Save</div>
                    <button :disabled="saving" @click="saveData" class="btn btn-primary">Save time limit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import HomePageService from '@/api-services/homepage.service';
  import WizardApiService from '@/api-services/wizard.service';
  import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue';

  export default {
    name: 'fulfillmentOptionsDelivery',
    props: {
      autosave: {
        default: true
      },
      options: {
        default: null
      },
      readOnly: {
        default: null
      },
      wizard_enabled:{
        default: false
      },
      stores:{
        default: []
      },
      selectedStore: {
        default: null
      }
    },
    components: {
      VueTimepicker
    },
    data() {
      return {
        rentalLocations: [],
        zipcode: { code: '', fee: '' },
        rentalZipCode: { code: '', fee: '' },
        zipCodeAlert: null,
        rentailZipCodeAlert: null,
        editingZip: null,
        editingRentalZip: null,
        configure: false,
        configureLoading: false,
      };
    },
    computed: {
      businessDetails() {
        return Object.entries(this.$store.state.businessDetails).length ? this.$store.state.businessDetails : null;
      },
      settings() {
        return this.$store.state.settings;
      },
      allowRentalDeliveryLocations() {
        return this.$store.state.settings.rentals && this.$store.state.settings.rentals.allowDeliveryLocations && this.$store.state.settings.rentals.allowDeliveryLocations === true || false;
      },
      selectedStoreLoc() {
        if(!this.selectedStore) {
          return {};
        }
        const selectedLoc = this.$store.state.storeLocations.find(loc => loc.id === this.selectedStore);
        return selectedLoc ? selectedLoc:{};
      }
    },
    async mounted() {
      if(!this.businessDetails) {
        let r = await HomePageService.getBusinessDetails();
        this.$store.commit('setBusinessDetails', r.data.data);
      }
    },
    methods: {
      async configureSettings(){
        if(this.stores.length > 1) {
          this.configureLoading = true;
          var _self = this;
          await WizardApiService.getSettings(2).then(e => {
            _self.configureLoading = false;
            _self.configure = true;
            _self.$parent.applyToAll = e.data.settings.apply_to_all == 1;
            setTimeout(() => {
              _self.$parent.$refs['storeListDelivery'].applyToAll = e.data && e.data.settings ? e.data.settings.apply_to_all == 1 : false;              
            }, 500);  
          });
        } else {
          this.configure = true;
        }

        this.$emit('closeSettings');
      },
      closeSettings(){
        this.configure = false;
      },
      saveData() {
        if(this.autosave)
          this.$emit('onSave');
          // this.save();
      },
      save(args = { applyToAll: 0 }) {
        let businessId = args.settings && args.settings[0].business_id || localStorage.getItem('selectedStore');
        let data = {
          ...args,
          settings: [{
            enabled: Boolean(this.options.delivery_enabled),
            delivery_enabled: Boolean(this.options.delivery_enabled),
            fee: Number(this.options.delivery_fee),
            delivery_locations: this.options.delivery_locations ? this.options.delivery_locations.map(l => ({...l, fee: Number(l.fee)})) : [],
            delivery_settings: this.options.delivery_settings,
            rental_delivery_locations: this.options.rental_delivery_locations ? this.options.rental_delivery_locations.map(l => ({...l, fee: Number(l.fee)})) : [],
            business_id: businessId
          }]
        };
        this.$store.commit('setBusinessDetails', { ...this.businessDetails, ...data.settings[0], delivery_enabled: data.settings[0].enabled });
        let callback = AdminService.updateFulfillmentDelivery(data);
        this.$emit('onSave', callback);
        return callback;
      },
      addZipcode() {
        let zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;
        if(zipCodePattern.test(this.zipcode.code)) {
          // Only checking if user havent entered negative, its ok if left blank
          if(this.zipcode.fee && this.zipcode.fee <= 0) {
            this.zipCodeAlert = 'Please enter valid delivery cost';
            return;
          }
          if(this.options.delivery_locations.some(e => e.code === this.zipcode.code)) {
            this.zipCodeAlert = 'This Zip Code is already added';
            return;
          }
          this.options.delivery_locations.push({...this.zipcode});
          this.zipCodeAlert = null;
          // Once a valid zip location is added
          this.saveData();
        }
        else
          this.zipCodeAlert = 'The zip is not valid';
      },
      startEditingZip(index) {
        setTimeout(() => {
          this.$refs[`zipInput_${index}`][0].focus();
        }, 100);
        this.editingZip = index;
      },
      startEditingRentalZip(index) {
        setTimeout(() => {
          this.$refs[`rentalZipInput_${index}`][0].focus();
        }, 100);
        this.editingRentalZip = index;
      },
      addRentalDeliveryZip() {
        let zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;
        if(zipCodePattern.test(this.rentalZipCode.code)) {
          // Only checking if user havent entered negative, its ok if left blank
          if(this.rentalZipCode.fee && this.rentalZipCode.fee <= 0) {
            this.rentailZipCodeAlert = 'Please enter valid delivery cost';
            return;
          }
          if(this.rentalLocations.some(e => e.code === this.rentalZipCode.code)) {
            this.rentailZipCodeAlert = 'This Zip Code is already added';
            return;
          }
          this.rentalLocations.push(this.rentalZipCode);
          this.rentailZipCodeAlert = null;
          // Once a valid zip location is added
          this.saveData();
        }
        else {
          this.rentailZipCodeAlert = 'Entered Zip Code is Invalid';
        }
      },
      editZipcode(zip, index) {
        let zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;
        if(zipCodePattern.test(zip.code)) {
          // Only checking if user havent entered negative, its ok if left blank
          if(zip.fee && zip.fee <= 0) {
            this.zipCodeAlert = 'Please enter valid delivery cost';
            return;
          }
          if(this.options.delivery_locations.some((zipCode, i) => zipCode.code === zip.code && i != index)) {
            this.zipCodeAlert = 'This Zip Code is already added';
            return;
          }
          this.options.delivery_locations[index]['code'] = zip.code;
          this.options.delivery_locations[index]['fee'] = zip.fee;

          this.zipCodeAlert = null;
          // Once a valid zip location is added
          this.saveData();
          this.editingZip = null;
        }
        else {
          this.zipCodeAlert = 'The zip is not valid';
        }
      },
      editRentalZipcode(zip, index) {
        let zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;
        if(zipCodePattern.test(zip.code)) {
          // Only checking if user havent entered negative, its ok if left blank
          if(zip.fee && zip.fee <= 0) {
            this.rentailZipCodeAlert = 'Please enter valid delivery cost';
            return;
          }
          if(this.rentalLocations.some((e, i) => e.code === zip.code && i != index)) {
            this.rentailZipCodeAlert = 'This Zip Code is already added';
            return;
          }
          this.rentalLocations[index]['code'] = zip.code;
          this.rentalLocations[index]['fee'] = zip.fee;

          this.rentailZipCodeAlert = null;
          // Once a valid zip location is added
          this.saveData();
          this.editingRentalZip = null;
        }
        else {
          this.rentailZipCodeAlert = 'Entered Zip Code is Invalid';
        }
      },
      removeZipcode(index) {
        this.options.delivery_locations.splice(index, 1);
        this.saveData();
      },
      removeRentalZipcode(index) {
        this.rentalLocations.splice(index, 1);
        this.saveData();
      },
      simplifyTimeFormat(time) {
        return time.replace(' AM', 'a').replace(' PM', 'p');
      },
      showError() {
      },
      isNumber(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
          evt.preventDefault();;
        } else {
          return true;
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .main-container {
    border: 1px solid #E2E8F0;
    background: #f8fafc;
    border-radius: 10px;
    h5 {
      font-size: 18px !important;
    }
  }
  .text-muted {
    color: #475569 !important;
  }
  .fadeHeight-enter-active,
  .fadeHeight-leave-active {
    transition: all 0.2s;
    max-height: 800px;
  }
  .fadeHeight-enter,
  .fadeHeight-leave-to
  {
    opacity: 0;
    max-height: 0px;
  }


  :deep(.vue__time-picker) {
    font-family: var(--font);
    width: auto;
    input.display-time {
      width: 56px;
      border: none;
      padding: 0;
      text-align: center;
      color: var(--brandPrimary);
      cursor: pointer;
    }
    .controls {
      display: none;
    }
    .select-list {
      .active,
      .active:hover {
        background: var(--brandPrimary) !important;
      }
    }
  }
  .timerange-selector {
    .input-group {
      flex-wrap: nowrap;
    }
    .input-group-text {
      padding: 0;
      width: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .zipcode {
    display: flex;
    margin-right: 10px;
    background: var(--primary);
    color: #fff;
    border-radius: 4px;
    font-size: 13px;
    font-weight: bold;
    padding-left: 8px;
    height: 40px;
    align-items: center;
    cursor: pointer;
    button {
      background: none;
    }
  }
</style>