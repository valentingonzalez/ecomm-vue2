<template>
    <div>
      <b-modal centered size="xl" ref="createLabelModal" id="createLabelModal" hide-footer hide-header
               no-close-on-backdrop no-close-on-esc>
        <div class="position-relative">
          <button class="btn close-btn" @click="hideModal()" aria-label="Close">
            <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M.869.869a1.6 1.6 0 0 1 2.262 0L10 7.738l6.869-6.87a1.599 1.599 0 1 1 2.262 2.263L12.262 10l6.87 6.869a1.6 1.6 0 0 1-2.263 2.262L10 12.262l-6.869 6.87A1.6 1.6 0 0 1 .87 16.868L7.738 10 .868 3.131a1.6 1.6 0 0 1 0-2.262z" fill="#64748B"/></svg>
          </button>
          <div v-if="step == 1">
            <div class="row">
              <div class="col-md-8">
                <div class="p-4">
                  <h4 class="mb-4">Your Account(s)</h4>
                  <div class="text-danger mb-2">
                    <!-- <span>If you are not receiving the correct rates, you need to make sure that your account is enabled to receive your negotiated rates via APIs. You can reach out to your Carrier Account Manager to confirm this.</span> -->
                    Confirm correct rates with your Carrier Account Manager.
                  </div>
                  <input type="search" v-model="searchCarrier" class="form-control lead font-weight-normal" placeholder="Search" />
                  <div class="card card-alt my-3 py-3 px-4" v-for="(c, key) in searchFilteredCarriers" :key="`carrier-${key}`">
                    <div class="d-flex justify-content-between mb-3">
                      <div>
                        <img :src="`/images/${c.carrier}.svg`" :alt="c.carrier" />
                      </div>
                      <div class="d-flex">
                        <button class="btn btn-secondary btn-sm text-medium mr-2" @click="deleteCarrier(c.carrier_id)">
                          Delete
                        </button>
                        <button class="btn btn-action btn-sm text-medium" @click="showUpdateCarrierModal(c)">
                          Edit
                        </button>
                      </div>
                    </div>
                    <div class="mb-2">
                      <div class="text-muted text-tiny">Description</div>
                      {{ c.carrier }}
                    </div>
                    <div class="mb-2">
                      <div class="text-muted text-tiny">Account ID</div>
                      {{ c.carrier_id }}
                    </div>
                  </div>
  
                  <div class="d-flex justify-content-end mt-4" v-if="!onlyAccounts">
                    <button class="btn btn-sm btn-secondary">Cancel</button>
                    <button class="btn btn-sm btn-primary ml-3" :disabled="!carriers.length" @click="nextStep">
                      Create Label
                      <svg class="ml-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292787 9.70704C0.105316 9.51951 0 9.26521 0 9.00004C0 8.73488 0.105316 8.48057 0.292787 8.29304L3.58579 5.00004L0.292787 1.70704C0.110629 1.51844 0.00983372 1.26584 0.0121121 1.00364C0.0143906 0.741443 0.11956 0.490631 0.304968 0.305223C0.490376 0.119815 0.741189 0.0146453 1.00339 0.0123669C1.26558 0.0100885 1.51818 0.110883 1.70679 0.293041L5.70679 4.29304C5.89426 4.48057 5.99957 4.73488 5.99957 5.00004C5.99957 5.26521 5.89426 5.51951 5.70679 5.70704L1.70679 9.70704C1.51926 9.89451 1.26495 9.99983 0.999786 9.99983C0.734622 9.99983 0.480314 9.89451 0.292787 9.70704Z" fill="white"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="pt-3 sidebar">
                  <div class="p-4">
                    <h5 class="my-3 pt-3">Add Carrier Account</h5>
                    <div v-if="!availableCarriers" class="d-flex mt-2 justify-content-center">
                      <div class="spinner spinner-border"></div>
                    </div>
                    <div v-else class="row small-gutters carrier-list">
                      <div class="col-md-6 mb-2" v-for="(c, i) in availableCarriersFiltered"
                           :key="`availableCarrier-${i}`" @click="showAddCarrierModal(c)">
                        <div class="card carrier">
                          <img :src="`/images/${c.name}.svg`" class="carriers-image" :alt="c.name">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="step == 2">
            <div class="row">
              <div class="col-md-4">
                <div class="p-4">
                  <ul class="tabs-menu mr-n3">
                    <li v-for="(section, i) in sections" :key="`tab-${i}`" :class="{'current' : tabIndex == i, 'done' : tabIndex > i}">
                      {{ section.name }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-md-8">
                <div class="sidebar">
                  <div class="p-4 h-100 d-flex flex-column">
                    <h4 class="mb-4">Create Shipping Label</h4>
                    <div class="mr-5 flex-grow-1">
                      <div v-if="tabIndex == 0" class="d-flex flex-column h-100 position-relative">
                        <h5 class="mb-3">To Address</h5>
                        <div
                          class="d-flex autofilling-message position-absolute align-items-center justify-content-center"
                          v-if="toAddress.loading">
                          <div class="spinner spinner-border mr-3"/>
                          Autofilling form
                        </div>
                        <div
                          class="d-flex autofilling-message position-absolute align-items-center justify-content-center"
                          v-if="validatedToAddress.loading">
                          <div class="spinner spinner-border mr-3"></div>
                          Validating address
                        </div>
                        <form ref="toAddressForm" @submit.prevent="validateForm($event, toAddress)" :class="{ 'was-validated' : toAddress.validated, 'disabled': (toAddress.loading || validatedToAddress.loading) }" novalidate>
                          <div class="row">
                            <div class="col-md-6 form-group">
                              <label for="toaddress-firstname">First Name</label>
                              <input v-model="toAddress.fields.first_name" id="toaddress-firstname" type="text" class="form-control" required/>
                            </div>
                            <div class="col-md-6 form-group">
                              <label for="toaddress-lastname">Last Name</label>
                              <input v-model="toAddress.fields.last_name" id="toaddress-lastname" type="text" class="form-control" required>
                            </div>
                            <div class="col-md-6 form-group">
                              <label for="toaddress-telephone">Phone Number</label>
                              <input v-model="toAddress.fields.phone" id="toaddress-telephone" type="tel" class="form-control" required>
                            </div>
                            <div class="col-md-6 form-group">
                              <label for="toaddress-email">Email</label>
                              <input v-model="toAddress.fields.email" id="toaddress-email" type="email" class="form-control" required>
                            </div>
                            <div class="col-md-12 form-group">
                              <label for="toaddress-address">Street 1</label>
                              <input v-model="toAddress.fields.street1" id="toaddress-address" type="text" class="form-control" required>
                            </div>
                            <div class="col-md-12 form-group">
                              <label for="toaddress-address1">Street 2</label>
                              <input v-model="toAddress.fields.street2" id="toaddress-address1" type="text" class="form-control">
                            </div>
                            <div class="col-md-6 form-group">
                              <label for="toaddress-city">City</label>
                              <input v-model="toAddress.fields.city" id="toaddress-city" type="text" class="form-control" required>
                            </div>
                            <div class="col-md-3 form-group">
                              <label for="toaddress-state">State</label>
                              <v-select :options="states" v-model="toAddress.fields.state" id="toAddress-state" name="state1" required @input="validateSelect('toAddress-state', $event)"/>
                            </div>
                            <div class="col-md-3 form-group">
                              <label for="toaddress-zip">Zip</label>
                              <input v-model="toAddress.fields.zip" id="toaddress-zip" type="text" class="form-control" required>
                            </div>
                            <div class="col-md-6 form-group">
                              <label for="toaddress-country">Country</label>
                              <v-select :options="countries" v-model="toAddress.fields.country" id="toAddress-country" name="country1" required @input="validateSelect('toAddress-country', $event)"/>
                            </div>
                          </div>
                          <div class="text-danger" v-if="validatedToAddress.error">*
                            {{ validatedToAddress.error }}
                          </div>
                          <div class="text-danger" v-if="toAddress.validated">* Please, complete all
                            the required fields
                          </div>
                          <div class="d-flex justify-content-end mt-4">
                            <button class="btn btn-sm btn-secondary not-color-btn" type="button" @click="prevTab">
                              <svg class="mr-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.70679 0.293031C5.89426 0.480558 5.99957 0.734866 5.99957 1.00003C5.99957 1.26519 5.89426 1.5195 5.70679 1.70703L2.41379 5.00003L5.70679 8.29303C5.88894 8.48163 5.98974 8.73423 5.98746 8.99643C5.98518 9.25863 5.88001 9.50944 5.6946 9.69485C5.5092 9.88026 5.25838 9.98543 4.99619 9.9877C4.73399 9.98998 4.48139 9.88919 4.29279 9.70703L0.292787 5.70703C0.105316 5.5195 0 5.26519 0 5.00003C0 4.73487 0.105316 4.48056 0.292787 4.29303L4.29279 0.293031C4.48031 0.10556 4.73462 0.000244141 4.99979 0.000244141C5.26495 0.000244141 5.51926 0.10556 5.70679 0.293031Z" fill="currentColor"/></svg>
                              Previous
                            </button>
                            <button class="btn btn-sm btn-primary color-btn ml-3" type="submit">
                              {{ validatedToAddress.validated ? 'Next' : 'Validate' }}
                              <svg class="ml-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292787 9.70704C0.105316 9.51951 0 9.26521 0 9.00004C0 8.73488 0.105316 8.48057 0.292787 8.29304L3.58579 5.00004L0.292787 1.70704C0.110629 1.51844 0.00983372 1.26584 0.0121121 1.00364C0.0143906 0.741443 0.11956 0.490631 0.304968 0.305223C0.490376 0.119815 0.741189 0.0146453 1.00339 0.0123669C1.26558 0.0100885 1.51818 0.110883 1.70679 0.293041L5.70679 4.29304C5.89426 4.48057 5.99957 4.73488 5.99957 5.00004C5.99957 5.26521 5.89426 5.51951 5.70679 5.70704L1.70679 9.70704C1.51926 9.89451 1.26495 9.99983 0.999786 9.99983C0.734622 9.99983 0.480314 9.89451 0.292787 9.70704Z" fill="white"/></svg>
                            </button>
                          </div>
                        </form>
                      </div>
                      <div v-else-if="tabIndex == 1" class="d-flex flex-column h-100">
                        <h5 class="mb-3">From Address</h5>
                        <form ref="fromAddressForm"
                              @submit.prevent="validateForm($event, fromAddress)"
                              :class="{ 'was-validated' : fromAddress.validated }" novalidate>
                          <div class="row">
                            <div class="col-md-12 form-group">
                              <label for="fromaddress-name">Name</label>
                              <input v-model="fromAddress.fields.name" id="fromaddress-name" type="text" class="form-control" required/>
                            </div>
                            <div class="col-md-6 form-group">
                              <label for="fromaddress-telephone">Phone Number</label>
                              <input v-model="fromAddress.fields.phone" id="fromaddress-telephone" type="tel" class="form-control" required>
                            </div>
                            <div class="col-md-6 form-group">
                              <label for="fromaddress-email">Email</label>
                              <input v-model="fromAddress.fields.email" id="fromaddress-email" type="email" class="form-control" required>
                            </div>
                            <div class="col-md-6 form-group">
                              <label for="fromaddress-address">Street 1</label>
                              <input v-model="fromAddress.fields.street1" id="fromaddress-address" type="text" class="form-control" required>
                            </div>
                            <div class="col-md-6 form-group">
                              <label for="fromaddress-address2">Street 2</label>
                              <input v-model="fromAddress.fields.street2" id="fromaddress-address2" type="text" class="form-control">
                            </div>
                            <div class="col-md-6 form-group">
                              <label for="fromaddress-city">City</label>
                              <input v-model="fromAddress.fields.city" id="fromaddress-city" type="text" class="form-control" required>
                            </div>
                            <div class="col-md-3 form-group">
                              <label for="fromaddress-state">State</label>
                              <v-select :options="states" v-model="fromAddress.fields.state" id="fromAddress-state" name="state2" required @input="validateSelect('fromAddress-state', $event)"/>
                            </div>
                            <div class="col-md-3 form-group">
                              <label for="fromaddress-zip">Zip</label>
                              <input v-model="fromAddress.fields.zip" id="fromaddress-zip" type="text" class="form-control" required>
                            </div>
                            <div class="col-md-6 form-group">
                              <label for="fromaddress-country">Country</label>
                              <v-select :options="countries" v-model="fromAddress.fields.country" id="fromAddress-country" name="country2" required @input="validateSelect('fromAddress-country', $event)"/>
                            </div>
                          </div>
                          <div class="text-danger" v-if="fromAddress.validated">* Please, complete all
                            the required fields
                          </div>
                          <div class="d-flex justify-content-end mt-4">
                            <button class="btn btn-sm btn-secondary not-color-btn" type="button" @click="prevTab">
                              <svg class="mr-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.70679 0.293031C5.89426 0.480558 5.99957 0.734866 5.99957 1.00003C5.99957 1.26519 5.89426 1.5195 5.70679 1.70703L2.41379 5.00003L5.70679 8.29303C5.88894 8.48163 5.98974 8.73423 5.98746 8.99643C5.98518 9.25863 5.88001 9.50944 5.6946 9.69485C5.5092 9.88026 5.25838 9.98543 4.99619 9.9877C4.73399 9.98998 4.48139 9.88919 4.29279 9.70703L0.292787 5.70703C0.105316 5.5195 0 5.26519 0 5.00003C0 4.73487 0.105316 4.48056 0.292787 4.29303L4.29279 0.293031C4.48031 0.10556 4.73462 0.000244141 4.99979 0.000244141C5.26495 0.000244141 5.51926 0.10556 5.70679 0.293031Z" fill="currentColor"/></svg>
                              Previous
                            </button>
                            <button class="btn btn-sm btn-primary color-btn ml-3" type="submit">
                              Next
                              <svg class="ml-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292787 9.70704C0.105316 9.51951 0 9.26521 0 9.00004C0 8.73488 0.105316 8.48057 0.292787 8.29304L3.58579 5.00004L0.292787 1.70704C0.110629 1.51844 0.00983372 1.26584 0.0121121 1.00364C0.0143906 0.741443 0.11956 0.490631 0.304968 0.305223C0.490376 0.119815 0.741189 0.0146453 1.00339 0.0123669C1.26558 0.0100885 1.51818 0.110883 1.70679 0.293041L5.70679 4.29304C5.89426 4.48057 5.99957 4.73488 5.99957 5.00004C5.99957 5.26521 5.89426 5.51951 5.70679 5.70704L1.70679 9.70704C1.51926 9.89451 1.26495 9.99983 0.999786 9.99983C0.734622 9.99983 0.480314 9.89451 0.292787 9.70704Z" fill="white"/></svg>
                            </button>
                          </div>
                        </form>
                      </div>
                      <div v-else-if="tabIndex == 2" class="d-flex flex-column h-100">
                        <div class="d-flex justify-content-between">
                          <h5 class="mb-3">Return Address</h5>
                          <a @click.prevent="useSameFromAddress()" href="#" class="h5">Use Same "From
                            Address"</a>
                        </div>
                        <form ref="returnAddressForm" @submit.prevent="validateForm($event, returnAddress)" :class="{ 'was-validated' : returnAddress.validated }" novalidate>
                          <div class="row">
                            <div class="col-md-12 form-group">
                              <label for="returnaddress-name">First Name</label>
                              <input v-model="returnAddress.fields.name" id="returnaddress-name" type="text" class="form-control" required/>
                            </div>
                            <div class="col-md-6 form-group">
                              <label for="returnaddress-telephone">Phone Number</label>
                              <input v-model="returnAddress.fields.phone" id="returnaddress-telephone" type="tel" class="form-control" required>
                            </div>
                            <div class="col-md-6 form-group">
                              <label for="returnaddress-email">Email</label>
                              <input v-model="returnAddress.fields.email" id="returnaddress-email"
                                     type="email" class="form-control" required>
                            </div>
                            <div class="col-md-12 form-group">
                              <label for="returnaddress-address">Street 1</label>
                              <input v-model="returnAddress.fields.street1" id="returnaddress-address"
                                     type="text" class="form-control" required>
                            </div>
                            <div class="col-md-12 form-group">
                              <label for="returnaddress-address2">Street 2</label>
                              <input v-model="returnAddress.fields.street2"
                                     id="returnaddress-address2" type="text" class="form-control">
                            </div>
                            <div class="col-md-6 form-group">
                              <label for="returnaddress-city">city</label>
                              <input v-model="returnAddress.fields.city" id="returnaddress-city"
                                     type="text" class="form-control" required>
                            </div>
                            <div class="col-md-3 form-group">
                              <label for="returnaddress-state">State</label>
                              <v-select :options="states" v-model="returnAddress.fields.state"
                                        id="returnAddress-state" name="state3" required
                                        @input="validateSelect('returnAddress-state', $event)"/>
                            </div>
                            <div class="col-md-3 form-group">
                              <label for="returnaddress-zip">Zip</label>
                              <input v-model="returnAddress.fields.zip" id="returnaddress-zip"
                                     type="text" class="form-control" required>
                            </div>
                            <div class="col-md-6 form-group">
                              <label for="returnaddress-country">Country</label>
                              <v-select :options="countries" v-model="returnAddress.fields.country"
                                        id="returnAddress-country" name="country3" required
                                        @input="validateSelect('returnAddress-country', $event)"/>
                            </div>
                          </div>
                          <div class="text-danger" v-if="returnAddress.validated">* Please, complete
                            all the required fields
                          </div>
                          <div class="d-flex justify-content-end mt-4">
                            <button class="btn btn-sm btn-secondary not-color-btn" type="button" @click="prevTab">
                              <svg class="mr-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.70679 0.293031C5.89426 0.480558 5.99957 0.734866 5.99957 1.00003C5.99957 1.26519 5.89426 1.5195 5.70679 1.70703L2.41379 5.00003L5.70679 8.29303C5.88894 8.48163 5.98974 8.73423 5.98746 8.99643C5.98518 9.25863 5.88001 9.50944 5.6946 9.69485C5.5092 9.88026 5.25838 9.98543 4.99619 9.9877C4.73399 9.98998 4.48139 9.88919 4.29279 9.70703L0.292787 5.70703C0.105316 5.5195 0 5.26519 0 5.00003C0 4.73487 0.105316 4.48056 0.292787 4.29303L4.29279 0.293031C4.48031 0.10556 4.73462 0.000244141 4.99979 0.000244141C5.26495 0.000244141 5.51926 0.10556 5.70679 0.293031Z" fill="currentColor"/></svg>
                              Previous
                            </button>
                            <button class="btn btn-sm btn-primary color-btn ml-3" type="submit">
                              Next
                              <svg class="ml-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292787 9.70704C0.105316 9.51951 0 9.26521 0 9.00004C0 8.73488 0.105316 8.48057 0.292787 8.29304L3.58579 5.00004L0.292787 1.70704C0.110629 1.51844 0.00983372 1.26584 0.0121121 1.00364C0.0143906 0.741443 0.11956 0.490631 0.304968 0.305223C0.490376 0.119815 0.741189 0.0146453 1.00339 0.0123669C1.26558 0.0100885 1.51818 0.110883 1.70679 0.293041L5.70679 4.29304C5.89426 4.48057 5.99957 4.73488 5.99957 5.00004C5.99957 5.26521 5.89426 5.51951 5.70679 5.70704L1.70679 9.70704C1.51926 9.89451 1.26495 9.99983 0.999786 9.99983C0.734622 9.99983 0.480314 9.89451 0.292787 9.70704Z" fill="white"/></svg>
                            </button>
                          </div>
                        </form>
                      </div>
                      <div v-else-if="tabIndex == 3" class="d-flex flex-column h-100">
                        <div v-if="customShippingObject">
                          <label class="mb-3 custom-shipping-label">Customer Selected Shipping</label>
                          <template>
                            <div class="dlvry_optn-card custom-radio">
                              <label class="dlvry_optn-card-box d-block"
                                     for="customShippingObject">
                                <div
                                  class="dlvry_optn-card-content d-flex justify-content-between align-items-start">
                                  <div
                                    class="d-flex justify-content-start align-items-start flex-column flex-wrap">
                                    <div class="dlvry_optn-card-title">
                                      {{ customShippingObject.carrier }}
                                    </div>
                                    <div
                                      class="dlvry_optn-srvc-box d-flex justify-content-start align-items-center flex-wrap">
                                      <div class="dlvry_optn-srvc">
                                        Service: <span> {{ customShippingObject.service }} </span>
                                      </div>
                                      <div class="dlvry_optn-srvc">
                                        Delivery:
                                        <span
                                          v-if="customShippingObject.delivery_days"> {{ customShippingObject.delivery_days }} {{
                                            (customShippingObject.delivery_days > 1) ? 'Days' : 'Day'
                                          }} </span>
                                        <span v-else> N/A </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="dlvry_optn-price_box">
                                    ${{ customShippingObject.rate }}
                                  </div>
                                </div>
                              </label>
                            </div>
                            <hr class="mb-4 hr">
                          </template>
                        </div>
                        <div class="flex-grow-1">
                          <h6>
                            <span v-if="orderMeta">
                              <span v-if="orderMeta.weight">Estimated Order Weight: <span class="text-muted">{{ orderMeta.weight }} oz</span></span> <br>
                              <span v-if="orderMeta.volume">Estimated Order Volume: <span class="text-muted">{{ orderMeta.volume }} in<sup>3</sup> </span></span>
                            </span>
                            <hr class="mt-4 hr">
                          </h6>
                        </div>
                        <label class="mb-3 custom-shipping-label">Parcel</label>
                        <form ref="parcelForm" @submit.prevent="validateForm($event, parcel)"
                              :class="{ 'was-validated' : parcel.validated, 'disabled': (fetchingShippingQuotes) }"
                              class="d-flex flex-column flex-grow-1" novalidate>
                          <div
                            class="d-flex autofilling-message position-absolute align-items-center justify-content-center"
                            v-if="fetchingShippingQuotes">
                            <div class="spinner spinner-border mr-3"/>
                            Fetching Packages
                          </div>
                          <div class="flex-grow-1">
                            <div class="border-bottom border-gray mb-4 pb-4">
                              <div class="row">
                                <div class="col-md-3">
                                  <label for="parcel-length">Length</label>
                                  <b-input-group append="in">
                                    <input id="parcel-length" type="number" step="any" class="form-control"
                                           v-model="parcel.fields.length"/>
                                  </b-input-group>
                                </div>
                                <div class="col-md-3">
                                  <label for="parcel-width">Width</label>
                                  <b-input-group append="in">
                                    <input id="parcel-width" type="number" step="any" class="form-control"
                                           v-model="parcel.fields.width"/>
                                  </b-input-group>
                                </div>
                                <div class="col-md-3">
                                  <label for="parcel-height">Height</label>
                                  <b-input-group append="in">
                                    <input id="parcel-height" type="number" step="any" class="form-control"
                                           v-model="parcel.fields.height"/>
                                  </b-input-group>
                                </div>
                                <div class="col-md-3">
                                  <label for="parcel-weight">Weight</label>
                                  <b-input-group append="oz">
                                    <input id="parcel-weight" type="number" step="any" class="form-control"
                                           v-model="parcel.fields.weight" required/>
                                  </b-input-group>
                                </div>
                              </div>
                            </div>
                            <div class="form-group">
                              <b-form-checkbox v-model="fetchPredefinedPackages"
                                               class="mb-4 mr-md-5 flex-grow-1 flex-grow-md-0">
                                <span class="text-muted">(Optional)</span> Predefined Package
                              </b-form-checkbox>
                            </div>
                            <template v-if="fetchPredefinedPackages && !fetchingShippingQuotes">
                              <template v-if="Object.keys(predefinedPackages).length">
                                <div class="form-group">
                                  <h5 class="mb-3">Choose Carrier</h5>
                                  <div class="d-flex">
                                    <v-select :options="Object.keys(predefinedPackages)"
                                              v-model="choosedCarrierForPackage"
                                              textProp="carrier" valueProp="carrier"/>
                                  </div>
                                </div>
                                <div class="form-group">
                                  <label>Predefined Package</label>
                                  <v-select :options="predefinedPackages[choosedCarrierForPackage]"
                                            v-model="parcel.fields.predefined_package"/>
                                </div>
                              </template>
                              <template v-else>
                                <div class="form-group">
                                  <p>There are no available carriers for your setting. Please review
                                    your address or parcel settings.</p>
                                </div>
                              </template>
                            </template>
                            <div class="text-danger" v-if="returnAddress.validated">* Please, complete
                              all the required fields
                            </div>
                          </div>
                          <div class="d-flex justify-content-end mt-4">
                            <button class="btn btn-sm btn-secondary not-color-btn" type="button" @click="prevTab">
                              <svg class="mr-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.70679 0.293031C5.89426 0.480558 5.99957 0.734866 5.99957 1.00003C5.99957 1.26519 5.89426 1.5195 5.70679 1.70703L2.41379 5.00003L5.70679 8.29303C5.88894 8.48163 5.98974 8.73423 5.98746 8.99643C5.98518 9.25863 5.88001 9.50944 5.6946 9.69485C5.5092 9.88026 5.25838 9.98543 4.99619 9.9877C4.73399 9.98998 4.48139 9.88919 4.29279 9.70703L0.292787 5.70703C0.105316 5.5195 0 5.26519 0 5.00003C0 4.73487 0.105316 4.48056 0.292787 4.29303L4.29279 0.293031C4.48031 0.10556 4.73462 0.000244141 4.99979 0.000244141C5.26495 0.000244141 5.51926 0.10556 5.70679 0.293031Z" fill="currentColor"/></svg>
                              Previous
                            </button>
                            <button class="btn btn-sm btn-primary color-btn ml-3" type="submit">
                              Next
                              <svg class="ml-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292787 9.70704C0.105316 9.51951 0 9.26521 0 9.00004C0 8.73488 0.105316 8.48057 0.292787 8.29304L3.58579 5.00004L0.292787 1.70704C0.110629 1.51844 0.00983372 1.26584 0.0121121 1.00364C0.0143906 0.741443 0.11956 0.490631 0.304968 0.305223C0.490376 0.119815 0.741189 0.0146453 1.00339 0.0123669C1.26558 0.0100885 1.51818 0.110883 1.70679 0.293041L5.70679 4.29304C5.89426 4.48057 5.99957 4.73488 5.99957 5.00004C5.99957 5.26521 5.89426 5.51951 5.70679 5.70704L1.70679 9.70704C1.51926 9.89451 1.26495 9.99983 0.999786 9.99983C0.734622 9.99983 0.480314 9.89451 0.292787 9.70704Z" fill="white"/></svg>
                            </button>
                          </div>
                        </form>
                      </div>
                      <div v-else-if="false" class="d-flex flex-column h-100">
                        <h5 class="mb-3">Options</h5>
                        <form ref="optionsForm" @submit.prevent="validateForm($event, options)"
                              :class="{ 'was-validated' : options.validated }" novalidate>
                          <div class="row">
                            <div class="col-xl-8">
                              <div class="form-group">
                                <label for="options-id">Reference Id</label>
                                <input v-model="options.fields.id" id="options-id" type="text"
                                       class="form-control" required/>
                                <div class="text-muted mt-1">A Custom ID you can use to refer to your
                                  shippments in the API
                                </div>
                              </div>
                              <h5 class="my-3">Label and Rate Options</h5>
                              <div class="form-group">
                                <label for="options-format">Label Format</label>
                                <v-select :options="formats" v-model="options.fields.format"
                                          id="options-format" name="format" required
                                          @input="validateSelect('options-format', $event)"/>
                              </div>
                              <div class="form-group">
                                <label for="options-date">Label Date</label>
                                <VueCtkDateTimePicker
                                  v-model="options.fields.date"
                                  :color="$store.state.settings.colors.secondary"
                                  :button-color="$store.state.settings.colors.primary"
                                  :only-date="true"
                                  no-header
                                  no-button-now
                                  :format="dateFormat"
                                  :formatted="dateFormatted"
                                  label="MM-DD-YY"
                                  @input="() => {}"
                                  id="options-date"
                                />
                                <div class="text-muted mt-1">To set the date which appear on the
                                  postage label
                                </div>
                              </div>
                              <div class="form-group">
                                <label for="options-level">Address Verification Level</label>
                                <v-select :options="levels" v-model="options.fields.level"
                                          id="options-level" name="level" required
                                          @input="validateSelect('options-level', $event)"/>
                              </div>
                              <div class="form-group">
                                <label for="options-invoice">Invoice Number</label>
                                <input v-model="options.fields.invoice" id="options-invoice"
                                       type="text" class="form-control" required/>
                              </div>
                            </div>
                          </div>
                          <div class="text-danger" v-if="toAddress.validated">* Please, complete all
                            the required fields
                          </div>
                          <div class="d-flex justify-content-end mt-4">
                            <button class="btn btn-sm btn-secondary not-color-btn" type="button" @click="prevTab">
                              <svg class="mr-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.70679 0.293031C5.89426 0.480558 5.99957 0.734866 5.99957 1.00003C5.99957 1.26519 5.89426 1.5195 5.70679 1.70703L2.41379 5.00003L5.70679 8.29303C5.88894 8.48163 5.98974 8.73423 5.98746 8.99643C5.98518 9.25863 5.88001 9.50944 5.6946 9.69485C5.5092 9.88026 5.25838 9.98543 4.99619 9.9877C4.73399 9.98998 4.48139 9.88919 4.29279 9.70703L0.292787 5.70703C0.105316 5.5195 0 5.26519 0 5.00003C0 4.73487 0.105316 4.48056 0.292787 4.29303L4.29279 0.293031C4.48031 0.10556 4.73462 0.000244141 4.99979 0.000244141C5.26495 0.000244141 5.51926 0.10556 5.70679 0.293031Z" fill="currentColor"/></svg>
                              Previous
                            </button>
                            <button class="btn btn-sm btn-primary color-btn ml-3" type="submit">
                              Next
                              <svg class="ml-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292787 9.70704C0.105316 9.51951 0 9.26521 0 9.00004C0 8.73488 0.105316 8.48057 0.292787 8.29304L3.58579 5.00004L0.292787 1.70704C0.110629 1.51844 0.00983372 1.26584 0.0121121 1.00364C0.0143906 0.741443 0.11956 0.490631 0.304968 0.305223C0.490376 0.119815 0.741189 0.0146453 1.00339 0.0123669C1.26558 0.0100885 1.51818 0.110883 1.70679 0.293041L5.70679 4.29304C5.89426 4.48057 5.99957 4.73488 5.99957 5.00004C5.99957 5.26521 5.89426 5.51951 5.70679 5.70704L1.70679 9.70704C1.51926 9.89451 1.26495 9.99983 0.999786 9.99983C0.734622 9.99983 0.480314 9.89451 0.292787 9.70704Z" fill="white"/></svg>
                            </button>
                          </div>
                        </form>
                      </div>
                      <div v-else-if="tabIndex == 4" class="d-flex flex-column h-100">
                        <template>
                          <div class="dlvry_optn-card custom-radio" v-if="customShippingObject">
                            <label class="mb-3 custom-shipping-label">Customer Selected Shipping</label>
                            <label class="dlvry_optn-card-box d-block"
                                   for="customShippingObject">
                              <div
                                class="dlvry_optn-card-content d-flex justify-content-between align-items-start">
                                <div
                                  class="d-flex justify-content-start align-items-start flex-column flex-wrap">
                                  <div class="dlvry_optn-card-title">
                                    {{ customShippingObject.carrier }}
                                  </div>
                                  <div
                                    class="dlvry_optn-srvc-box d-flex justify-content-start align-items-center flex-wrap">
                                    <div class="dlvry_optn-srvc">
                                      Service: <span> {{ customShippingObject.service }} </span>
                                    </div>
                                    <div class="dlvry_optn-srvc">
                                      Delivery:
                                      <span
                                        v-if="customShippingObject.delivery_days"> {{ customShippingObject.delivery_days }} {{
                                          (customShippingObject.delivery_days > 1) ? 'Days' : 'Day'
                                        }} </span>
                                      <span v-else> N/A </span>
                                    </div>
                                  </div>
                                </div>
                                <div class="dlvry_optn-price_box">
                                  ${{ customShippingObject.rate }}
                                </div>
                              </div>
                            </label>
                          </div>
                        </template>
                        <div class="flex-grow-1">
                          <h6>
                            <span v-if="orderMeta">
                              <span v-if="orderMeta.weight">Estimated Order Weight: <span class="text-muted">{{ orderMeta.weight }} oz</span></span> <br>
                              <span v-if="orderMeta.volume">Estimated Order Volume: <span class="text-muted">{{ orderMeta.volume }} in<sup>3</sup> </span></span>
                            </span>
                            <hr class="mt-4 hr">
                          </h6>
                        </div>
                        <div
                          class="d-flex autofilling-message position-absolute align-items-center justify-content-center"
                          v-if="fetchingShippingQuotes">
                          <div class="spinner spinner-border mr-3"/>
                          Fetching Shipping Quotes
                        </div>
                        <div
                          class="d-flex autofilling-message position-absolute align-items-center justify-content-center"
                          v-if="buyingShippingLabel">
                          <div class="spinner spinner-border mr-3"/>
                          Buying
                        </div>
                        <form ref="checkoutForm" class="flex-grow-1"
                              :class="{'disabled': (fetchingShippingQuotes || buyingShippingLabel)}">
                          <template v-if="quotes">
                            <div class="form-group">
                              <template v-if="parcel.fields.predefined_package">
                                <h5 class="mb-3">Choose Rate for {{ choosedCarrierForPackage }}</h5>
                                <div class="mt-2">
                                  <template v-if="quotes && Object.keys(quotes).length">
                                    <b-form-radio v-for="rate in quotes[choosedCarrierForPackage]"
                                                  v-bind:key="rate.id"
                                                  @change="setRateAndShipment($event, rate)"
                                                  class="mb-2 radio-special mr-2" name="rate"
                                                  :value="rate.id"
                                                  :class="{'checked' : buyLabel.rate_id == rate.id}">
                                      {{ rate.service }} - {{ rate.rate }}
                                    </b-form-radio>
                                  </template>
                                  <template v-else>
                                    <p>There are no quotes available for your setting. Please go back
                                      to choose different package or carrier.</p>
                                  </template>
                                </div>
                              </template>
                              <template v-else>
                                <h5 class="mb-3">Choose Carrier and Rate</h5>
                                <div
                                  class="career-rate-box d-flex justify-content-start align-items-center flex-wrap">
                                  <v-select :options="carrierNames" v-model="choosedCarrier" textProp="carrier" valueProp="carrier"/>
                                </div>
                                <div class="mt-2">
                                  <template v-if="quotes && Object.keys(quotes).length">
                                    <b-form-radio v-for="rate in quotes[choosedCarrier]" v-bind:key="rate.id" @change="setRateAndShipment($event, rate)" class="mb-2 radio-special mr-2" name="rate" :value="rate.id" :class="{'checked' : buyLabel.rate_id == rate.id}">
                                      {{ rate.service }} - {{ rate.rate }}
                                    </b-form-radio>
                                  </template>
                                  <template v-else>
                                    <p>There are no quotes available for your setting. Please go back
                                      to choose different package or carrier.</p>
                                  </template>
                                </div>
                              </template>
                            </div>
                            <div class="form-group">
                              <h5 class="shipping-hdng weight-600 gnrl-font">Add Shipping Insurance
                                <span>(Recommended)</span></h5>
                              <p class="shipping-cntnt gnrl-font">
                                Ship with confidence. Purchase full coverage of your shipment for
                                just 1% of insured value a $1.00 minimum. view our insurance policy to
                                learn more
                              </p>
  
                              <b-form-checkbox v-model="buyLabel.is_insuranced"
                                               class="mb-4 mr-md-5 flex-grow-1 flex-grow-md-0 gnrl-font">
                                Yes, Protect my Shipment
                              </b-form-checkbox>
                              <div
                                class="shipment-rate-box d-flex justify-content-start align-items-center mb-4"
                                v-if="buyLabel.is_insuranced">
                                <div class="shipment-rate-card shipment-value-box">
                                  <div class="shipment-value">
                                    <p class="shipment-title">
                                      Shipment Value (USD)
                                    </p>
                                    <p>
                                      <span class="dollar-sign">$</span> {{ orderAmount }}
                                    </p>
                                  </div>
                                </div>
                                <div class="shipment-qual">
                                  =
                                </div>
                                <div class="shipment-rate-card shipment-cost-box">
                                  <div class="shipment-cost">
                                    <p class="shipment-title">
                                      Your Cost
                                    </p>
                                    <p>
                                      <span class="dollar-sign"> $ </span>
                                      <i v-if="calculatingInsuranceRate"
                                         class="fa fa-spinner fa-spin"></i>
                                      <span v-else>{{ insuranceRate }}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <hr>
                              <div class="row mt-4">
                                <div class="col-md-11">
                                  <label for="" class="shipment-total-box float-right">
                                    <span class="shipment-total-title"> Total </span>
                                    ${{ totalCost }}
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div class="d-flex justify-content-end mt-4">
                              <button class="btn btn-sm btn-secondary not-color-btn" type="button" @click="prevTab">
                                <svg class="mr-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.70679 0.293031C5.89426 0.480558 5.99957 0.734866 5.99957 1.00003C5.99957 1.26519 5.89426 1.5195 5.70679 1.70703L2.41379 5.00003L5.70679 8.29303C5.88894 8.48163 5.98974 8.73423 5.98746 8.99643C5.98518 9.25863 5.88001 9.50944 5.6946 9.69485C5.5092 9.88026 5.25838 9.98543 4.99619 9.9877C4.73399 9.98998 4.48139 9.88919 4.29279 9.70703L0.292787 5.70703C0.105316 5.5195 0 5.26519 0 5.00003C0 4.73487 0.105316 4.48056 0.292787 4.29303L4.29279 0.293031C4.48031 0.10556 4.73462 0.000244141 4.99979 0.000244141C5.26495 0.000244141 5.51926 0.10556 5.70679 0.293031Z" fill="currentColor"/></svg>
                                Previous
                              </button>
                              <button :disabled="buyingShippingLabel" class="btn btn-sm btn-primary ml-3 color-btn" type="button" @click="buyShippingLabel">
                                Buy Label
                                <svg class="ml-3" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292787 9.70704C0.105316 9.51951 0 9.26521 0 9.00004C0 8.73488 0.105316 8.48057 0.292787 8.29304L3.58579 5.00004L0.292787 1.70704C0.110629 1.51844 0.00983372 1.26584 0.0121121 1.00364C0.0143906 0.741443 0.11956 0.490631 0.304968 0.305223C0.490376 0.119815 0.741189 0.0146453 1.00339 0.0123669C1.26558 0.0100885 1.51818 0.110883 1.70679 0.293041L5.70679 4.29304C5.89426 4.48057 5.99957 4.73488 5.99957 5.00004C5.99957 5.26521 5.89426 5.51951 5.70679 5.70704L1.70679 9.70704C1.51926 9.89451 1.26495 9.99983 0.999786 9.99983C0.734622 9.99983 0.480314 9.89451 0.292787 9.70704Z" fill="white"/></svg>
                              </button>
                            </div>
                          </template>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-modal>
      <b-modal centered size="md" ref="addCarrierModal" id="addCarrierModal" hide-footer hide-header>
        <div class="p-4">
          <form v-if="selectedCarrier" @submit.prevent="addCarrier">
            <h3 class="mb-3">{{ this.updatingCarrier ? 'Update' : 'Add' }} {{ selectedCarrier.name }}
              Carrier</h3>
            
            <div class="text-danger mb-4 p-1" v-if="selectedCarrier.name == 'UPS'">
              Please take note that the data you enter in the following fields must EXACTLY match the data that was saved in your UPS account at the time of registration. 
              You can copy the information from your profile by logging into your UPS account.
            </div>
            <div class="mb-3" v-for="(credential, key) in selectedCarrier.fields" :key="`d-${key}`">
              <label :for="`c-${key}`">{{ credential.label }}</label>
              <input :disabled="addingCarrier" v-model="selectedCarrier.credentials[key]" 
                :type="key == 'password' ? 'password' : 'text'" :id="`c-${key}`" 
                :placeholder="credential.placeholder" class="form-control" :required="credential.required"/>
            </div>
            <div class="form-group mb-3">
              <b-form-checkbox v-model="selectedCarrier.is_active" class="mb-4 mr-md-5 flex-grow-1 flex-grow-md-0">
                <span class="text-muted"></span> Active
              </b-form-checkbox>
            </div>
            <div class="d-flex justify-content-end">
              <button :disabled="addingCarrier" class="btn btn-primary" type="submit">
                <div class="spinner-border spinner-border-sm mr-2" v-if="addingCarrier"/>
                {{ this.updatingCarrier ? 'Update' : 'Add' }}
              </button>
            </div>
          </form>
        </div>
      </b-modal>
      <ValidatedAddress @getRates="setAddress()" ref="validatedAddressModal" :validatedAddress="validatedToAddress.fields"/>
      <PrintLabelModal ref="shippingLabelPrint" :orderId="orderId" :label="label"/>
  
    </div>
  </template>
  
  <script>
  import VSelect from '@alfsnd/vue-bootstrap-select';
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
  import OrdersService from '@/api-services/order.service';
  import ValidatedAddress from '@/components/modals/validated-address';
  import PrintLabelModal from '@/components/modals/print-label-modal';
  
  export default {
    name: 'createLabelModal',
    components: {PrintLabelModal, VSelect, VueCtkDateTimePicker, ValidatedAddress},
    props: ['orderId', 'orderAmount', 'show', 'onlyAccounts', 'customShipping'],
    data() {
      return {
        addingCarrier: false,
        updatingCarrier: false,
        step: 2,
        tabIndex: 0,
        availableCarriers: null,
        carriers: [],
        selectedCarrier: {},
        sections: [
          {name: 'To Address'},
          {name: 'Form Address'},
          {name: 'Return Address'},
          {name: 'Parcel'},
          {name: 'Checkout'}
        ],
        formats: [
          {text: 'PDF', value: 'PDF'}
        ],
        levels: [
          {text: 'Full', value: 'full'}
        ],
        toAddress: {
          validated: false,
          loading: false,
          fields: {
            first_name: '',
            last_name: '',
            phone: '',
            email: '',
            street1: '',
            street2: '',
            city: '',
            state: null,
            zip: '',
            country: {'text': 'USA', 'value': 'USA'}
          }
        },
        validatedToAddress: {
          loading: false,
          validated: false,
          error: null,
          fields: {
            first_name: null,
            last_name: null,
            phone: '',
            email: '',
            street1: '',
            street2: '',
            city: '',
            state: null,
            zip: '',
            country: {'text': 'USA', 'value': 'USA'}
          }
        },
        fromAddress: {
          validated: false,
          fields: {
            name: '',
            phone: '',
            email: '',
            street1: '',
            street2: '',
            city: '',
            state: null,
            zip: '',
            country: {'text': 'USA', 'value': 'USA'}
          }
        },
        returnAddress: {
          validated: false,
          fields: {
            name: '',
            phone: '',
            email: '',
            street1: '',
            street2: '',
            city: '',
            state: null,
            zip: '',
            country: {'text': 'USA', 'value': 'USA'}
          }
        },
        options: {
          validated: false,
          fields: {
            format: '',
            date: '',
            level: '',
            invoice: ''
          }
        },
        parcel: {
          validated: false,
          fields: {
            length: '',
            width: '',
            height: '',
            weight: ''
          }
        },
        quotes: null,
        choosedCarrier: {},
        choosedCarrierRate: null,
        buyLabel: {
          shipment_id: null,
          rate_id: null,
          is_insuranced: false,
          amount: this.orderAmount
        },
        insuranceRate: null,
        fetchingShippingQuotes: false,
        calculatingInsuranceRate: false,
        buyingShippingLabel: false,
        fetchPredefinedPackages: false,
        choosedCarrierForPackage: null,
        predefinedPackages: null,
        searchCarrier: '',
        label: null,
        orderMeta: null
      };
    },
    async mounted() {
      this.step = this.onlyAccounts ? 1 : 2;
      if (this.show !== false && !this.onlyAccounts) {
        this.showModal();
      }
      if (!this.onlyAccounts) {
        let lastTabIndex = window.localStorage.getItem(this.orderId+"_shippingLabeltabIndex");
        if(lastTabIndex) {
          this.tabIndex = lastTabIndex * 1;
          if (this.sections[this.tabIndex].name == 'Checkout') {
            this.quotes = null;
            this.choosedCarrier = {};
            this.buyLabel.rate_id = null;
            this.buyLabel.shipment_id = null;
            this.getShippingLabelQuotes();
          }
        }
      }
    },
    watch: {
      'buyLabel.is_insuranced': function (val) {
        if (val) {
          this.getInsuranceRate();
        } else {
          this.insuranceRate = null;
        }
      },
      'toAddress.fields': {
        deep: true,
        handler() {
          if (this.validatedToAddress.validated) {
            this.validatedToAddress.error = null;
            this.validatedToAddress.validated = false;
          }
          this.resetPredefinedPackages();
        }
      },
      'fromAddress.fields': {
        deep: true,
        handler() {
          this.resetPredefinedPackages();
        }
      },
      'returnAddress.fields': {
        deep: true,
        handler() {
          this.resetPredefinedPackages();
        }
      },
      'parcel.fields': {
        deep: true,
        handler() {
          this.resetPredefinedPackages();
        }
      },
      choosedCarrier() {
        this.buyLabel.rate_id = null;
        this.buyLabel.shipment_id = null;
      },
      fetchPredefinedPackages(val) {
        if (val) {
          this.getShippingLabelQuotes(true);
        } else {
          this.resetPredefinedPackages();
        }
      },
      choosedCarrierForPackage(val) {
        //console.log(val);
      }
    },
    computed: {
      customShippingObject() {
        if (this.customShipping) {
          return JSON.parse(this.customShipping);
        }
        return null;
      },
      searchFilteredCarriers() {
        return this.carriers.filter(val => val.carrier.toLowerCase().match(this.searchCarrier.toLowerCase()));
      },
      availableCarriersFiltered() {
        if(!this.carriers.length)
          return this.availableCarriers;
        else {
          let carriers = this.carriers.map(i => i.carrier);
          return Object.values(this.availableCarriers).filter(e => !carriers.includes(e.name));
        }
      },
      states() {
        if (!this.$store.state.businessDetails.states) return [];
        let s = this.$store.state.businessDetails.states;
        return Object.keys(s).map(k => ({text: s[k], value: k}));
      },
      countries() {
        let s = this.$store.state.settings.cart.additionalCountries || [];
        return [{text: 'USA', value: 'USA'}, ...Object.keys(s).map(k => ({text: s[k], value: k}))];
      },
      dateFormat() {
        return 'MM-DD-YY';
      },
      dateFormatted() {
        return 'MM-DD-YY';
      },
      carrierNames() {
        if (this.quotes) {
          return Object.keys(this.quotes);
        }
        return [];
      },
      totalCost() {
        let insuranceAmount = this.insuranceRate ? this.insuranceRate : '0';
        let choosedCarrierRate = this.choosedCarrierRate ? this.choosedCarrierRate : '0';
        return (parseFloat(insuranceAmount) + parseFloat(choosedCarrierRate)).toFixed(2);
      }
    },
    filters: {
      parseKey(val) {
        return val.replace('_', ' ');
      }
    },
    methods: {
      printLabel() {
        const iframe = document.createElement('iframe');
  
      // Make it hidden
        iframe.style.height = 0;
        iframe.style.visibility = 'hidden';
        iframe.style.width = 0;
  
      // Set the iframe's source
        iframe.setAttribute('srcdoc', '<html><body></body></html>');
  
        document.body.appendChild(iframe);
  
        // const image = self.$refs.labelImage.cloneNode();
  
        iframe.addEventListener('load', function () {
          // Clone the image
          const image = document.getElementById('labelImage').cloneNode();
          image.style.maxWidth = '100%';
          image.style.maxHeight = '100%';
  
          // Append the image to the iframe's body
          const body = iframe.contentDocument.body;
          body.style.textAlign = 'center';
          body.appendChild(image);
          image.addEventListener('load', function() {
            // Invoke the print when the image is ready
            iframe.contentWindow.print();
          });
  
          iframe.contentWindow.addEventListener('afterprint', function () {
            iframe.parentNode.removeChild(iframe);
          });
        });
      },
      resetPredefinedPackages() {
        this.predefinedPackages = {};
        this.choosedCarrierForPackage = null;
        this.parcel.fields.predefined_package = null;
        this.fetchPredefinedPackages = false;
      },
      autofillForms() {
        let lastFilledDetails = window.localStorage.getItem(this.orderId+"_FilledDetails");
        if(lastFilledDetails) {
          lastFilledDetails = JSON.parse(lastFilledDetails);
          this.toAddress = lastFilledDetails.toAddress;
          this.fromAddress = lastFilledDetails.fromAddress;
          this.returnAddress = lastFilledDetails.returnAddress;
          this.parcel = lastFilledDetails.parcel;
        } else {
          this.toAddress.loading = true;
          OrdersService.getShippingInfo(this.orderId).then(resp => {
            this.orderMeta = resp.data.order.orderMeta;
            //Filling To Address
            this.toAddress.loading = false;
            resp.data.order.customerAddress.state = this.states.find(e => e.value == resp.data.order.customerAddress.state);
            this.toAddress.fields = {...this.toAddress.fields, ...resp.data.order.customerAddress};
            this.toAddress.fields.street1 = this.toAddress.fields.address;
            this.toAddress.fields.street2 = this.toAddress.fields.address2;
            this.toAddress.fields.phone = this.toAddress.fields.telephone;
            delete this.toAddress.fields.address;
            delete this.toAddress.fields.address2;
            delete this.toAddress.fields.telephone;
    
            //Filling From Address
            Object.keys(resp.data.order.businessAddress).map(key => {
              resp.data.order.businessAddress[key.replace('business_', '')] = resp.data.order.businessAddress[key];
              if (key == 'business_address') {
                resp.data.order.businessAddress.street1 = resp.data.order.businessAddress[key];
                delete resp.data.order.businessAddress['address'];
              } else if (key == 'business_zipcode') {
                resp.data.order.businessAddress.zip = resp.data.order.businessAddress[key];
              } else if (key == 'business_telephone') {
                resp.data.order.businessAddress.phone = resp.data.order.businessAddress[key];
                delete resp.data.order.businessAddress['telephone'];
              }
              delete resp.data.order.businessAddress[key];
            });
            resp.data.order.businessAddress.state = this.states.find(e => e.value == resp.data.order.businessAddress.state);
            this.fromAddress.fields = {...this.fromAddress.fields, ...resp.data.order.businessAddress};
            
            // Setting the return address to business address by default now
            this.returnAddress.fields = {...this.returnAddress.fields, ...this.fromAddress.fields};
            this.parcel.fields = resp.data.order.parcel;
    
          });
        }
      },
      useSameFromAddress() {
        this.returnAddress.fields = {...this.returnAddress.fields, ...this.fromAddress.fields};
      },
      // pass true to this method if you are using it to fetch predefined packages
      async getShippingLabelQuotes(predefinedPackages = false) {
        this.fetchingShippingQuotes = true;
        let data = {
          businessAddress: JSON.parse(JSON.stringify(this.fromAddress.fields)),
          customerAddress: JSON.parse(JSON.stringify(this.toAddress.fields)),
          returnAddress: JSON.parse(JSON.stringify(this.returnAddress.fields)),
          parcel: this.parcel.fields
        };
        data.customerAddress.name = data.customerAddress.first_name + ' ' + data.customerAddress.last_name;
        data.customerAddress.state = data.customerAddress.state.value;
        data.businessAddress.state = data.businessAddress.state.value;
        data.returnAddress.state = data.returnAddress.state.value;
        await OrdersService.getShippingLabelQuotes(this.orderId, data)
          .then(resp => {
            this.fetchingShippingQuotes = false;
            if (predefinedPackages) {
              this.predefinedPackages = resp.data.predefinedPackages;
            } else {
              this.quotes = resp.data.quotes;
            }
          }).catch(error => {
            this.fetchingShippingQuotes = false;
            this.$swal({
              toast: true,
              position: 'top',
              type: 'error',
              html: `<div class="ml-2">` + error.response.data.message + `</div>`,
              showConfirmButton: false,
              timer: 3000
            });
          });
      },
      async getInsuranceRate() {
        this.calculatingInsuranceRate = true;
        await OrdersService.getInsuranceRate({amount: this.orderAmount})
          .then(resp => {
            this.calculatingInsuranceRate = false;
            this.insuranceRate = resp.data.insurance;
          });
      },
      async buyShippingLabel() {
        this.buyingShippingLabel = true;
        this.buyLabel.amount = this.orderAmount;
        await OrdersService.buyShippingLabel(this.buyLabel, this.orderId)
          .then(resp => {
            resp = resp.data;
            if (resp.status !== 'error') {
              this.$swal({
                toast: true,
                position: 'top',
                type: 'success',
                html: `<div class="ml-2">` + resp.message + `</div>`,
                showConfirmButton: false,
                timer: 3000
              });
              this.hideModal();
              let lastFilledDetails = window.localStorage.getItem(this.orderId+"_FilledDetails");
              if(lastFilledDetails) {
                window.localStorage.removeItem(this.orderId+"_FilledDetails");
                window.localStorage.removeItem(this.orderId+"_shippingLabeltabIndex");
              }
              this.$emit("shippingSettings", resp.data);
              this.label = resp.data;
              setTimeout(() => {
                this.$refs.shippingLabelPrint.showModalPrint();
              }, 200);
            } else {
              this.$swal({
                toast: true,
                position: 'top',
                type: 'error',
                html: `<div class="ml-2">` + resp.message + `</div>`,
                showConfirmButton: false,
                timer: 3000
              });
            }
          }).catch(err => {
            this.$swal('Error', Object.keys(err.response.data.errors).map(key => err.response.data.errors[key]).join('<br />'), 'error');
          }).finally(() => {
            this.buyingShippingLabel = false;
          });
      },
      deleteCarrier(id) {
        this.$swal({
          title: 'Delete Carrier',
          text: 'Are you sure you want to delete this Carrier?',
          type: 'warning',
          showCancelButton: true,
          allowEscapeKey: true,
        }).then(async result => {
          if (result.value) {
            await OrdersService.deleteCarrier(id);
            this.carriers = this.carriers.filter(e => e.carrier_id != id);
          }
        });
      },
      addCarrier() {
        this.addingCarrier = true;
        this.selectedCarrier.carrier = this.selectedCarrier.name;
        this.selectedCarrier.is_active = this.selectedCarrier.is_active ? this.selectedCarrier.is_active : 0;
        OrdersService.addCarrier(this.selectedCarrier).then(resp => {
          if (resp.data.status == 'success') {
            this.$refs.addCarrierModal.hide();
            if (!this.updatingCarrier) {
              this.carriers.push({...this.selectedCarrier, carrier_id: resp.data.carrier_id});
            }
            this.getCarriers();
            this.$swal(resp.data.message, '', 'success');
          } else {
            this.$swal(resp.data.message, '', 'error');
          }
          this.addingCarrier = false;
        });
      },
      showAddCarrierModal(carrier) {
        this.updatingCarrier = false;
        this.selectedCarrier = carrier;
        this.selectedCarrier.credentials = {};
        Object.keys(this.selectedCarrier.fields).map(k => this.selectedCarrier.credentials[k] = '');
        this.$refs.addCarrierModal.show();
      },
      showUpdateCarrierModal(carrier) {
        this.updatingCarrier = true;
        this.selectedCarrier = carrier;
        this.selectedCarrier.name = carrier.carrier;
        this.selectedCarrier.is_active = this.selectedCarrier.is_active === 1 ? true : false;
        this.selectedCarrier.fields = this.availableCarriers[this.selectedCarrier.name].fields;
        this.$refs.addCarrierModal.show();
      },
      validateForm(evt, ob) {
        let valid = true;
        [...evt.target.getElementsByClassName('v-select')].forEach(e => {
          if (!e.getAttribute('required')) return;
          let id = e.getAttribute('id');
          let o = id.split('-')[0];
          let prop = id.split('-')[1];
          if (!this.$data[o].fields[prop]) {
            [...e.getElementsByClassName('v-select-toggle')][0].classList.add('form-control', 'is-invalid');
            valid = false;
          }
        });
        if (!evt.target.checkValidity() || !valid) {
          ob.validated = true;
          return;
        }
  
        ob.validated = false;
  
        if (this.sections[this.tabIndex].name == 'To Address' && !this.validatedToAddress.validated) {
          this.validateAddress();
        } else {
          this.nextTab();
        }
      },
      setAddress(override = true) {
        if (override) {
          this.toAddress.fields = JSON.parse(JSON.stringify(this.validatedToAddress.fields));
          // map state as object from available states to preselect in vue-select
          this.toAddress.fields.state = this.states.find(e => e.value == this.toAddress.fields.state);
          setTimeout(() => {
            this.validatedToAddress.validated = true;
          }, 500);
        } else {
          this.validatedToAddress.validated = true;
        }
        this.$refs.validatedAddressModal.hideModel();
      },
      async validateAddress() {
        this.validatedToAddress.loading = true;
        let data = JSON.parse(JSON.stringify(this.toAddress.fields));
        data.state = data.state.value;
        await OrdersService.validateAddress(data)
          .then(resp => {
            resp = resp.data;
            this.validatedToAddress.loading = false;
            if (resp.status !== 'error') {
              this.validatedToAddress.fields = resp.validatedAddress;
              delete this.validatedToAddress.fields.id;
              this.$refs.validatedAddressModal.showModal();
  
              // let html = '<div class="row">\n' +
              //   '      <div class="col-md-12 mb-2">\n' +
              //   '        Would you like to accept our change ?\n' +
              //   '      </div>\n';
              //
              // for (const property in this.validatedToAddress.fields) {
              //   if (property == 'id') continue;
              //   html += '<div class="col-md-6">' +
              //     '<label><b>'+property+'</b></label>' +
              //     '<p>'+this.validatedToAddress.fields[property]+'</p></div>';
              // }
              // html += '</div>';
              // this.$swal({
              //   title: 'Address Matched',
              //   html: html,
              //   type: 'warning',
              //   showCancelButton: true,
              // }).then(result => {
              //   if(result.value) {
              //     this.toAddress.fields = JSON.parse(JSON.stringify(this.validatedToAddress.fields));
              //     // map state as object from available states to preselect in vue-select
              //     this.toAddress.fields.state  = this.states.find(e => e.value == this.toAddress.fields.state);
              //     setTimeout(() => {this.validatedToAddress.validated = true;}, 1000);
              //   } else {
              //     this.validatedToAddress.validated = true;
              //   }
              // });
            } else {
              this.validatedToAddress.loading = false;
              this.validatedToAddress.validated = true;
              this.$swal({
                toast: true,
                position: 'top',
                type: 'error',
                html: `<div class="ml-2">` + resp.message + `</div>`,
                showConfirmButton: false,
                timer: 3000
              });
              this.validatedToAddress.error = 'Your given address is not validated by us. Do you still want to continue just in case you know the address better.';
            }
          }).catch(error => {
            this.validatedToAddress.loading = false;
            this.validatedToAddress.validated = true;
            error = error.response.data;
            this.$swal({
              toast: true,
              position: 'top',
              type: 'error',
              html: `<div class="ml-2">` + error.message + `</div>`,
              showConfirmButton: false,
              timer: 3000
            });
            this.validatedToAddress.error = 'Your given address is not validated by us. Do you still want to continue just in case you know the address better.';
          });
      },
      validateSelect(id) {
        if (!document.getElementById(id)) return;
        let el = [...document.getElementById(id).getElementsByClassName('v-select-toggle')][0];
        if (el.classList.contains('is-invalid')) {
          el.classList.add('is-valid');
          el.classList.remove('is-invalid');
        }
      },
      prevStep() {
        this.step -= 1;
      },
      nextStep() {
        if (this.step == 1 && !this.carriers.length) {
          this.$swal({
            toast: true,
            position: 'top',
            type: 'error',
            html: `<div class="ml-2">You must add a carrier to continue.</div>`,
            showConfirmButton: false,
            timer: 3000
          });
          return;
        }
        this.step += 1;
      },
      prevTab() {
        if (this.tabIndex > 0)
          this.tabIndex -= 1;
        else {
          this.tabIndex = 0;
          this.prevStep();
        }
        window.localStorage.setItem(this.orderId+"_shippingLabeltabIndex", this.tabIndex);
      },
      nextTab() {
        this.tabIndex += 1;
        window.localStorage.setItem(this.orderId+"_shippingLabeltabIndex", this.tabIndex);
        let FilledDetails = {
          "fromAddress" : this.fromAddress,
          "toAddress" : this.toAddress,
          "returnAddress" : this.returnAddress,
          "parcel" : this.parcel,
        };
        window.localStorage.setItem(this.orderId+"_FilledDetails", JSON.stringify(FilledDetails));
        if (this.sections[this.tabIndex].name == 'Checkout') {
          this.quotes = null;
          this.choosedCarrier = {};
          this.buyLabel.rate_id = null;
          this.buyLabel.shipment_id = null;
          this.getShippingLabelQuotes();
        }
      },
      hideModal() {
        this.$refs.createLabelModal.hide();
        Object.assign(this.$data, this.$options.data.apply(this));
        this.step = this.onlyAccounts ? 1 : 2;

        if(this.onlyAccounts) {
          this.$emit("updateSettings");
        }
      },
      showModal() {
        // calling all the services to fill the forms
        // Duplicate, this value is getting returned in getcarriers as well
        //OrdersService.getAvailableCarriers().then(resp => this.availableCarriers = resp.data.carriers);
        this.getCarriers();
        this.$refs.createLabelModal.show();
        if (!this.onlyAccounts) {
          this.autofillForms();
        }
      },
      getCarriers() {
        OrdersService.getCarriers().then(resp => {
          this.availableCarriers = resp.data.supported;
          this.carriers = resp.data.carriers;
          if (!this.carriers.length) {
            this.step = 1;
          }
        });
      },
      setRateAndShipment(e, rate) {
        this.buyLabel.rate_id = rate.id;
        this.choosedCarrierRate = rate.rate;
        this.buyLabel.shipment_id = rate.shipment_id;
      }
    }
  };
  </script>
  
  <style scoped lang="scss">
  
  :deep(.modal-content) {
    .modal-body {
      padding: 0 !important;
  
      .career-rate-box {
        margin-bottom: 16px;
  
        .add-carrer-acc {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
          color: #DC2626;
          padding: 8px 12px;
          margin: 0 0 0 24px;
          border-color: #FEF2F2;
          background-color: #FEF2F2;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }
      }
  
      .color-btn {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        padding: 8px 12px;
        border-radius: 6px;
      }
  
      .not-color-btn {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        padding: 8px 12px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        border-radius: 4px;
      }
  
      .sidebar {
        height: 100%;
        background: #F8FAFC;
        border-left: 1px solid #E2E8F0;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }
    }
  
    .close-btn {
      position: absolute;
      right: 15px;
      top: 20px;
      z-index: 2;
    }
  
    input[type=search] {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE5IDE5TDEzIDEzTTE1IDhDMTUgOC45MTkyNSAxNC44MTg5IDkuODI5NTEgMTQuNDY3MiAxMC42Nzg4QzE0LjExNTQgMTEuNTI4MSAxMy41OTk4IDEyLjI5OTcgMTIuOTQ5NyAxMi45NDk3QzEyLjI5OTcgMTMuNTk5OCAxMS41MjgxIDE0LjExNTQgMTAuNjc4OCAxNC40NjcyQzkuODI5NTEgMTQuODE4OSA4LjkxOTI1IDE1IDggMTVDNy4wODA3NSAxNSA2LjE3MDUgMTQuODE4OSA1LjMyMTIyIDE0LjQ2NzJDNC40NzE5NCAxNC4xMTU0IDMuNzAwMjYgMTMuNTk5OCAzLjA1MDI1IDEyLjk0OTdDMi40MDAyNCAxMi4yOTk3IDEuODg0NjMgMTEuNTI4MSAxLjUzMjg0IDEwLjY3ODhDMS4xODEwNiA5LjgyOTUxIDEgOC45MTkyNSAxIDhDMSA2LjE0MzQ4IDEuNzM3NSA0LjM2MzAxIDMuMDUwMjUgMy4wNTAyNUM0LjM2MzAxIDEuNzM3NSA2LjE0MzQ4IDEgOCAxQzkuODU2NTIgMSAxMS42MzcgMS43Mzc1IDEyLjk0OTcgMy4wNTAyNUMxNC4yNjI1IDQuMzYzMDEgMTUgNi4xNDM0OCAxNSA4WiIgc3Ryb2tlPSIjNjQ3NDhCIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K');
      background-repeat: no-repeat;
      background-position: 15px center;
      padding-left: 46px !important;
    }
  
    .card-alt {
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
    }
  
    .btn-action {
      background: #FFF;
    }
  
    .carrier-list {
      .carrier {
        padding: 10px;
        cursor: pointer;
      }
    }
  
    .tabs-menu {
      list-style: none;
      padding: 0;
      border: 1px solid #CBD5E1;
      border-radius: 6px;
  
      li {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
      }
  
      @for $i from 1 through 10 {
        li:nth-child(#{$i}) {
          color: #64748B;
          display: flex;
          align-items: center;
          font-weight: 500;
          padding: 15px 20px;
  
          &::before {
            content: '0#{$i}';
            margin-right: 16px;
            width: 40px;
            height: 40px;
            border-radius: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #CBD5E1;
          }
  
          &:not(:last-of-type) {
            border-bottom: 1px solid #CBD5E1;
          }
  
          &.current {
            color: var(--primary);
  
            &::before {
              border-color: var(--primary);
            }
          }
  
          &.done {
            color: #334155;
  
            &::before {
              content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxNCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy43MDcxIDAuMjkyODkzQzE0LjA5NzYgMC42ODM0MTcgMTQuMDk3NiAxLjMxNjU4IDEzLjcwNzEgMS43MDcxMUw1LjcwNzExIDkuNzA3MTFDNS4zMTY1OCAxMC4wOTc2IDQuNjgzNDIgMTAuMDk3NiA0LjI5Mjg5IDkuNzA3MTFMMC4yOTI4OTMgNS43MDcxMUMtMC4wOTc2MzExIDUuMzE2NTggLTAuMDk3NjMxMSA0LjY4MzQyIDAuMjkyODkzIDQuMjkyODlDMC42ODM0MTcgMy45MDIzNyAxLjMxNjU4IDMuOTAyMzcgMS43MDcxMSA0LjI5Mjg5TDUgNy41ODU3OUwxMi4yOTI5IDAuMjkyODkzQzEyLjY4MzQgLTAuMDk3NjMxMSAxMy4zMTY2IC0wLjA5NzYzMTEgMTMuNzA3MSAwLjI5Mjg5M1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=');
              border-color: var(--primary);
              background: var(--primary);
            }
          }
        }
      }
    }
  }
  
  :deep(.v-select) {
    max-width: 372px;
    height: 43px !important;
    background: #FFF;
    border: none;
  
    button {
      height: 43px;
      align-items: center;
      border: 1px solid #CBD5E1;
  
      &.focus-visible {
        border-color: var(--primary);
        box-shadow: 0 0 0 1px #dc3545 !important;
      }
  
      .arrow-down {
        height: 10px;
      }
    }
  
    ul {
      font-size: 14px;
    }
  }
  
  :deep(.date-time-picker) {
    .field.has-value {
      .field-input {
        padding-top: 0 !important;
      }
  
      .field-label {
        display: none;
      }
    }
  }
  
  .autofilling-message {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  
  .custom-shipping-label {
    width: auto;
    height: 28px;
    left: 353px;
    top: 88px;
  
    /* Font - Inter/lg/Semibold */
  
    font-weight: 600;
    font-size: 18px;
    line-height: 28px;
    /* identical to box height, or 156% */
  
  
    /* Blue Gray / 700 */
  
    color: #334155;
  }
  
  .dlvry_optn-card {
    &:last-of-type {
      .dlvry_optn-card-box {
        border-bottom: 0 solid transparent;
      }
    }
  
    &.custom-radio,
    &.custom-checkbox {
      display: initial;
      display: initial;
      display: initial;
      -ms-flex-wrap: initial;
      flex-wrap: initial;
      -webkit-box-pack: initial;
      -ms-flex-pack: initial;
      justify-content: initial;
      -webkit-box-align: initial;
      -ms-flex-align: initial;
      align-items: initial;
      height: auto;
  
      label.custom-control-label:before,
      label.custom-control-label:after,
      label.custom-control-label:before,
      label.custom-control-label:after {
        top: 3px;
        left: 0;
        -webkit-transform: translateY(0px);
        transform: translateY(0px);
      }
  
      label.custom-control-label:after,
      label.custom-control-label:after {
        left: 2px !important;
        top: 4.6px !important;
      }
    }
  
    .dlvry_optn-card-box {
      border-bottom: 1px solid #E2E8F0;
      padding: 0 0 16px 0;
      margin: 0 0 16px 0;
      position: relative;
  
      .radio_btn {
        position: absolute;
        left: 0;
        top: 3px;
        margin: 0 auto;
        width: 16px;
        height: 16px;
        border: 1px solid #CBD5E1;
      }
  
      .dlvry_optn-card-content {
        .dlvry_optn-card-title {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 14px;
          line-height: 20px;
          color: #1E293B;
          margin: 0 0 8px;
        }
  
        .dlvry_optn-srvc-box {
          position: relative;
  
          .dlvry_optn-srvc {
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 14px;
            line-height: 20px;
            color: #64748B;
            padding: 0 8px;
  
            &:first-of-type {
              padding-left: 0;
            }
  
            &:last-of-type {
              padding-right: 0;
            }
  
            + .dlvry_optn-srvc {
              border-left: 3px solid #E2E8F0;
            }
  
            span {
              color: #1E293B;
            }
          }
        }
  
        .dlvry_optn-price_box {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 16px;
          line-height: 24px;
          color: #1E293B;
        }
      }
    }
  }
  .carriers-image {
    height: 48px;
  }
  </style>
  
  