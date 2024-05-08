<template>
  <main class="checkout mt-0 pt-0" ref="checkout">
    <section v-show="!isOrderSubmitted">
      <div class="container">
        <!-- HEADER -->
        <div class="mb-2 mb-md-3 d-flex flex-column flex-sm-row align-items-center justify-content-between">
          <h4 class="d-flex align-items-center mb-0">
            Your Cart
            <span v-if="cart" class="badge badge-number ml-2">{{ totalItems }}</span>
          </h4>        
        </div>
        <!-- COLUMNS -->
        <div class="row" v-if="totalItems > 0">
          <div class="mb-3 mb-lg-0 col-lg-8 d-flex flex-column cart-items" >
            <!-- NORMAL ITEMS -->
            <CartItems 
              :hideItems="step > 1" 
              :hideTabs="step != 2" 
              :title="'Your order'" 
              ref="cartItemNormal" 
              v-if="cart && cart.parcels && cart.parcels.length" 
              :items="cart.parcels" 
              :is-submitting="isSubmitting" 
              @onTabChange="onTabChange" />          
             
            <template v-if="step == 1">
                <!-- TOTALS -->
              <div class="text-danger mt-2" v-if="settings.cart.refundInfo" v-html="settings.cart.refundInfo" />
              <div class="text-danger mt-2" v-if="settings.cart.disclaimer" v-html="settings.cart.disclaimer" />   
            </template>             
            <template v-if="step > 1">
              <div class="card mb-3 user-select-none" v-show="step == 2 && !loggedInUser">
                <div class="card-body p-3 p-md-4">
                  <div class="d-flex align-items-start justify-content-between" :class="{'mb-2' : showLoginForm}">
                      <div class="d-flex flex-column w-100">
                        <h6 class="card-title font-weight-bold">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M16.364 3.63603C14.6641 1.93617 12.4039 1 10 1C7.59605 1 5.33589 1.93617 3.63603 3.63603C1.93617 5.33589 1 7.59605 1 10C1 12.4039 1.93617 14.6641 3.63603 16.364C5.33589 18.0638 7.59605 19 10 19C12.4039 19 14.6641 18.0638 16.364 16.364C18.0638 14.6641 19 12.4039 19 10C19 7.59605 18.0638 5.33589 16.364 3.63603ZM4.90605 16.0925C5.20323 13.5354 7.40173 11.5612 10 11.5612C11.3697 11.5612 12.6577 12.0948 13.6266 13.0635C14.4451 13.8822 14.9613 14.951 15.0941 16.0923C13.7139 17.2482 11.9369 17.9453 10 17.9453C8.06311 17.9453 6.28621 17.2484 4.90605 16.0925ZM10 10.4749C8.49281 10.4749 7.26646 9.24854 7.26646 7.74135C7.26646 6.23402 8.49281 5.00781 10 5.00781C11.5072 5.00781 12.7335 6.23402 12.7335 7.74135C12.7335 9.24854 11.5072 10.4749 10 10.4749ZM16.0018 15.2008C15.7331 14.1173 15.1726 13.1182 14.3723 12.3178C13.7241 11.6696 12.9572 11.1834 12.1209 10.8786C13.1263 10.1968 13.7882 9.04488 13.7882 7.74135C13.7882 5.65257 12.0888 3.95312 10 3.95312C7.91122 3.95312 6.21178 5.65257 6.21178 7.74135C6.21178 9.04556 6.87425 10.1979 7.88046 10.8796C7.11101 11.16 6.39896 11.5936 5.78633 12.1643C4.89919 12.9905 4.28313 14.0439 3.99748 15.2C2.78775 13.8054 2.05469 11.9867 2.05469 10C2.05469 5.61893 5.61893 2.05469 10 2.05469C14.3811 2.05469 17.9453 5.61893 17.9453 10C17.9453 11.9872 17.212 13.8062 16.0018 15.2008Z" fill="black" stroke="black" stroke-width="0.4"/>
                          </svg>
                          Have an account?      
                        </h6>
                        <div class="d-flex align-items-start align-items-md-center justify-content-start justify-content-md-between flex-column flex-md-row w-100">
                          <p class="m-0 cursor-pointer" @click="showLoginForm = !showLoginForm">  
                            <a class="text-underline font-weight-bold">Sign In</a>
                            to checkout more quickly and easily
                            <i class="fa animated" :class="showLoginForm ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                          </p> 
                          <div class="mt-2 mt-md-0" v-if="showLoginForm">
                            Don’t have an account?
                            <a @click="$refs.newLogin.register()" class="ml-2 text-primary font-weight-bold cursor-pointer text-decoration-none">
                            Sign Up
                            </a>
                          </div> 
                        </div>                                                     
                      </div>      
                  </div>       
                  <div class="row" v-if="showLoginForm">
                    <div class="col-12">
                      <new-login-form ref="newLogin" :simpleLayout="true" :loginFromCart="true" :minimizeMargins="true" />            
                    </div> 
                  </div> 
                </div>
              </div>
              <div class="card user-select-none" v-show="step != 3">
                <div class="card-body p-3 p-md-4">
                  <cart-member v-if="step == 2 || step == 4"
                    ref="cartMember" 
                    @userInfo="memberInfo" 
                    @loggedIn="loggedIn" 
                    @memberInfoChanged="updateMember" 
                    @allowForRegister="allowForRegister" 
                    :isGuestCheckout="isGuestCheckout" 
                    :showOptInForRegister="isGuestCheckout" 
                    :optInForRegister="optInForRegister" 
                    :loggedInUser="loggedInUser" 
                    :memberInfoProp="memberInfo"                     
                    :reviewInfo="step == 4"                     
                    :isDisabled="isSubmitting && step != 4" />
                  <div class="mt-4 py-4 border-top border-bottom" v-if="step == 4 && (activeTab != 0)">
                    <h6 class="card-title font-weight-bold">
                      {{activeTab === 2 ? 'Shipping ' : 'Delivery '}} Information
                      <button @click="goToStep(2)" class="btn btn-sm btn-primary p-1 text-tiny h-auto ml-2">Edit</button>
                    </h6>
                    <div class="card rounded p-3 p-md-4">
                      <ul class="my-0 my-md-2 p-0 ml-0 ml-md-2 radio-list">
                        <li>{{ addressInfo }}</li>  
                      </ul>   
                    </div> 
                  </div>
                  <div class="mt-4 pb-4 border-bottom" v-if="step == 4 && (activeTab != 0 || (activeTab === 0 && pickupPaymentOption == 'website'))">
                    <h6 class="card-title font-weight-bold">
                      Billing Address
                      <button @click="goToStep(3)" class="btn btn-sm btn-primary p-1 text-tiny h-auto ml-2">Edit</button>
                    </h6>                    
                    <div v-if="activeTab != 0 || (activeTab === 0 && pickupPaymentOption == 'website')" class="card rounded p-3 p-md-4">
                      <ul class="my-0 my-md-2 p-0 ml-0 ml-md-2 radio-list">
                        <li>{{ isSameBillingAddress && activeTab != 0 ? addressInfo : billingAddressInfo }}</li>  
                      </ul>   
                    </div> 
                  </div>                  
                  <div class="pb-4 mt-4" v-if="step == 4">
                    <h6 class="card-title font-weight-bold">
                      Payment
                      <button @click="goToStep(3)" v-if="!paypalCheckout" class="btn btn-sm btn-primary p-1 text-tiny h-auto ml-2">Edit</button>
                    </h6>
                    <div class="card rounded p-3 p-md-4">
                      <ul class="my-0 my-md-2 p-0 ml-0 ml-md-2 radio-list">
                        <li v-if="showCard">
                          <div class="d-flex align-items-center justify-content-between w-100">
                            <div>
                              <span class="mr-5">*{{ selectedCard.lastfour || selectedCard.last4 }}</span> 
                              <span class="text-dark">{{ selectedCard.exp_month }}/{{ selectedCard.exp_year }}</span>
                            </div>
                            <div>
                              <img class="c-card-img" :src="selectedCard.brand.toLowerCase() | cardType" width="50" height="30">
                            </div>
                          </div> 
                        </li>  
                        <li v-else class="text-capitalize">{{ paymentMethod }}</li>  
                      </ul>   
                    </div> 
                  </div> 
                  <div class="d-flex justify-content-end w-100" v-if="step == 4 && !showRecurringOrdersSection">
                    <button v-if="loggedInUser && totalItems > 0 && save_cart" id="submit" @click="saveCurrentCart" type="button" class="btn btn-outline-primary p-2 p-sm-3 mr-2" :disabled="!loggedInUser || isSubmitting || saving">
                      <span v-if="saving" class="spinner-border spinner-border-sm mr-3" role="status" aria-hidden="true"></span>Save Cart
                    </button>
                    <button :disabled="isSubmitting" class="btn btn-primary text-uppercase text-left d-flex align-items-center justify-content-center justify-content-sm-between mx-auto mx-sm-0 pull-right w-100 w-sm-auto" @click="completeStep(step)">
                      <span class="mr-5">Place Order</span>
                      <i class="fa fa-spin fa-spinner mr-1" v-if="isSubmitting"></i>
                      <img src="/icons/button-arrow.svg" v-else>   
                    </button> 
                  </div>                 

                  <template v-if="step == 2">
                    <div v-if="loggedInUser || isGuestCheckout">
                      <div class="alert alert-danger mt-2 mb-3 font-weight-bold py-2 text-center" v-if="step == 2 && activeTab === 0 && businessDetails.pickup_payment === 'store'" :key="'pickup'">
                        Payment will be due at time of item pickup.
                      </div>
                      <div v-if="step == 2 && activeTab === 1 && businessDetails.delivery_payment === 'cod'" class="mt-3">
                        Payment will be due at time of item delivery.
                      </div>

                      <div v-if="step == 2 && activeTab != 0" :key="activeTab === 1 ? 'delivery' : 'shipping'" class="mt-3">
                        <h6 class="card-title font-weight-bold">{{activeTab === 2 ? 'Shipping ' : 'Delivery '}}Address</h6>
                        <div class="row">
                          <div class="col-sm-6 col-xs-12">
                            <label class="form-check-label">
                              Address line 1
                            </label>
                            <input :disabled="isSubmitting" @change="onAddressChange('address',true)" :class="{'is-invalid':addressErrors.address}" v-model="addressModel.address" type="text" class="form-control" name="address" placeholder="Address line 1" required />
                            <div v-if="addressErrors.address" class="invalid-feedback">
                              {{ addressErrors.address[0] }}
                            </div>
                          </div>
                          <div class="col-sm-6 col-xs-12">
                            <label class="form-check-label">
                              Address line 2 (optional)
                            </label>
                            <input :disabled="isSubmitting" v-model="addressModel.address2" type="text" class="form-control" name="address2" placeholder="Address line 2">
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-sm-6 col-xs-12">
                            <label for="city" class="mb-0 mt-3">City</label>
                            <input :disabled="isSubmitting" @change="onAddressChange('city',true)" :class="{'is-invalid':addressErrors.city}" type="text" v-model="addressModel.city" class="form-control" id="city" name="city" placeholder="City" required />
                            <div v-if="addressErrors.city" class="invalid-feedback">
                              {{ addressErrors.city[0] }}
                            </div>
                          </div>
                          <div class="col-sm-6 col-xs-12">
                            <label for="state" class="mb-0 mt-3">State/Province/Region: </label>
                            <select v-if="addressModel.country == 'USA' || !addressModel.country" :disabled="isSubmitting" v-model="addressModel.state" id="state" class="form-control" name="state" @change="validateAddressState(true)" :class="{'is-invalid':addressErrors.state}" required>
                              <option v-for="(state,key) in this.businessDetails.states" :value="key" :key="key">{{state}}</option>
                            </select>
                            <input v-else :disabled="isSubmitting" @change="onAddressChange('state',true)" :class="{'is-invalid':addressErrors.state}" v-model="addressModel.state" type="text" class="form-control" id="state" name="state" placeholder="State">
                            <div v-if="addressErrors.state" class="invalid-feedback">
                              {{ addressErrors.state[0] }}
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-sm-6 col-xs-12">
                            <label for="inputCountry" class="mb-0 mt-3">Country/Region </label>
                            <select :disabled="isSubmitting" @change="onAddressChange('country',true)" :class="{'is-invalid':addressErrors.country}" v-model="addressModel.country" id="inputCountry" class="form-control" name="country" required>
                              <template v-if="settings.cart.additionalCountries">
                                <option v-for="(country,key) in settings.cart.additionalCountries" :key="key" :value="key">{{country}}</option>
                              </template>
                              <option value="USA" selected>USA</option>
                            </select>
                            <div v-if="addressErrors.country" class="invalid-feedback">
                              {{ addressErrors.country[0] }}
                            </div>
                          </div>
                          <div v-if="activeTab === 1 && !settings.cart.hideDeliveryZipcode" class="col-sm-6 col-xs-12">
                            <label class="mb-0 mt-3">Zip</label>
                            <input :disabled="isSubmitting" v-model="addressModel.delivery_postal_code" type="text" class="form-control" name="postal_code" placeholder="ZIP Code" :class="{'is-invalid': showDeliveryZipError }" @blur="checkZipcode()" required />
                            <div v-if="showDeliveryZipError && $refs.cartTotals && $refs.cartTotals.$refs.deliveryLocationsModal" class="invalid-feedback">
                              Use a zip code within the <a href="#" @click.prevent="$refs.cartTotals.$refs.deliveryLocationsModal.show()">delivery area</a>.
                            </div>
                          </div>
                          <div v-if="activeTab === 2 && !hidePickupZipcode" class="col-sm-6 col-xs-12">
                            <label class="mb-0 mt-3">Zip</label>
                            <input :disabled="isSubmitting || validatingAddress" v-model="addressModel.postal_code" type="text" :class="{'is-invalid':addressErrors.postal_code}"  @change="onAddressChange('postal_code',true)" class="form-control" name="postal_code" placeholder="ZIP Code" required />
                            <div v-if="addressErrors.postal_code" class="invalid-feedback">
                                {{ addressErrors.postal_code[0] }}
                            </div>
                          </div>
                          <div class="mt-3 col-sm-6 col-xs-12" v-if="activeTab === 1 && businessDetails.delivery_settings.delivery_datepicker">
                            <h6 class="card-title font-weight-bold">
                              <template v-if="settings.navigationLayout == 'secondary'">Requested Delivery Date</template>
                              <template v-else>Delivery Date</template>
                            </h6>
                            <VueCtkDateTimePicker
                              :behaviour="{time: {nearestIfDisabled: true}}"
                              :time="{nearestIfDisabled:true}"
                              :disabled-hours="disabledHours"
                              v-model="deliveryDate"
                              :disabled-weekly="businessDetails.delivery_settings.closed_on_sundays ? [0] : []"
                              :no-weekends-days="!businessDetails.delivery_settings.delivery_on_weekends"
                              :color="settings.colors.secondary"
                              :button-color="settings.colors.primary"
                              :only-date="!businessDetails.delivery_settings.enable_time"
                              no-header
                              no-button-now
                              :min-date="minDate"
                              :format="dateFormat"
                              :formatted="dateFormatted"
                              :error="addressErrors.deliveryDate"
                              :label="`Select date${businessDetails.delivery_settings.enable_time ? ` & time` : ``}`"                              
                              @input="onDeliveryDateInput"
                              /> 
                              <div v-if="addressErrors.deliveryDate" class="invalid-feedback" :class="{'d-block':addressErrors.deliveryDate}">
                                {{ addressErrors.deliveryDate[0] }}
                              </div>                             
                          </div>
                        </div> 
                        <!-- <div class="row mt-3" v-if="activeTab === 2 && enabledTabs.shipping && shippingCarriersAvailable && shippingAddressValidationMsg">
                          <div class="col-sm-12 col-xs-12">
                            <p class="text-danger text-center m-0 h5">{{ shippingAddressValidationMsg }}</p>  
                             <button @click="validateAddress()" :disabled="validatingAddress || $store.state.cartFetchingShippingQuotes" class="btn btn-primary" style="width: 136px;" type="button">
                              Get Rates
                              <span v-if="validatingAddress || $store.state.cartFetchingShippingQuotes" class="spinner-border spinner-border-sm mr-0 ml-3" role="status" aria-hidden="true"></span>
                            </button> 
                          </div>
                        </div>                                              -->
                      </div>
                      
                      <div class="mb-3" v-if="step == 2">
                        <!-- Custom Fields for Pickup only -->
                        <template v-if="step == 2 && activeTab === 0 && $store.state.businessDetails.custom_fields && $store.state.businessDetails.custom_fields.pickup">
                          <custom-input-fields
                            :customFields="$store.state.businessDetails.custom_fields.pickup"
                            :customInfo.sync="customInfo"
                            outerClass="row"
                            innerClass="col-12"/>
                        </template>

                        <!-- Custom Fields for Delivery only -->
                        <template v-if="step == 2 && activeTab === 1 && $store.state.businessDetails.custom_fields && $store.state.businessDetails.custom_fields.delivery">
                          <custom-input-fields
                            :customFields="$store.state.businessDetails.custom_fields.delivery"
                            :customInfo.sync="customInfo"
                            outerClass="row mt-2"
                            innerClass="col-12"/>
                        </template>

                        <!-- Custom Fields for Shipping only -->
                        <template v-if="step == 2 && activeTab === 2 && $store.state.businessDetails.custom_fields && $store.state.businessDetails.custom_fields.shipping">
                          <custom-input-fields
                            :customFields="$store.state.businessDetails.custom_fields.shipping"
                            :customInfo.sync="customInfo"
                            outerClass="row"
                            innerClass="col-12"/>
                        </template>

                        <!-- Custom Fields for cart -->
                        <template v-if="step == 2 && $store.state.businessDetails.custom_fields && $store.state.businessDetails.custom_fields.cart">
                          <custom-input-fields
                            :customFields="$store.state.businessDetails.custom_fields.cart"
                            :customInfo.sync="customInfo"
                            outerClass="row mb-3"
                            innerClass="col-12"/>
                        </template>
                      </div>

                      <div class="row mt-2" v-if="step == 2 && settings.cart.taxExemptionCheck">
                        <div class="col-12">
                          <input type="checkbox" id="tax-exempt" v-model="customInfo.tax_exempt" class="mr-2">
                          <label for="tax-exempt">I am tax exempt in Petersburg AK</label>
                        </div>
                      </div>

                      <div class="row" v-if="step == 2 && settings.cart.discountEligibilityCheck">
                        <div class="col-12">
                          <input type="checkbox" id="senior-citizen" v-model="customInfo.senior_citizen" class="mr-2">
                          <label for="senior-citizen">I am eligible for a senior citizen or military discount</label>
                        </div>
                      </div>                                                                                      
                    </div>                    
                    <div class="dlvry_optn-con" v-if="step == 2 && activeTab === 2 && availableShippingQuotes.length && enabledTabs.shipping">
                      <div class="dlvry_optn-box">
                        <div class="dlvry_optn-hdng">
                          <h2>
                            Choose your Shipping & Handling Option
                          </h2>
                          <span v-if="specialItems && specialItems.length">Shipping date will be after the arrival of product in store from warehouse which is 3-8 day</span>
                        </div>

                        <template v-if="fetchingQuotes">
                          <div class="spinner-wrapper text-center">
                            <div class="spinner-border" role="status"></div>
                          </div>
                        </template>
                        <template v-else-if="!availableShippingQuotes.length">
                          no shipping quotes available
                        </template>
                        <template v-else>
                          <div class="dlvry_optn-card custom-radio" v-for="(quote, index) in availableShippingQuotes" :key="quote.id">
                            <input type="radio" name="shippingLabel" class="custom-control-input"
                              :checked="selectedShippingQuote && quote.carrier == selectedShippingQuote.carrier && quote.service == selectedShippingQuote.service ? 'checked' : ''"
                              @change="selectShippingQuote($event, index)"
                              :id="`shippingLabel_${quote.id}`">
                            <label class="custom-control-label dlvry_optn-card-box d-block" :for="`shippingLabel_${quote.id}`">
                              <div class="dlvry_optn-card-content d-flex justify-content-between align-items-start">
                                <div class="d-flex justify-content-start align-items-start flex-column flex-wrap">
                                  <div class="dlvry_optn-card-title">
                                    {{ quote.carrier }}
                                  </div>
                                  <div class="dlvry_optn-srvc-box d-flex justify-content-start align-items-center flex-wrap">
                                    <div class="dlvry_optn-srvc">
                                      Service: <span> {{ quote.service.split('_').join(" ") | styleTitle }} </span>
                                    </div>
                                    <div class="dlvry_optn-srvc">
                                      Delivery:
                                      <span v-if="quote.delivery_days"> {{quote.delivery_days}} {{ (quote.delivery_days > 1) ? 'Days' : 'Day' }} </span>
                                      <span v-else> N/A </span>
                                    </div>
                                    <div class="dlvry_optn-srvc border-0 p-0" v-if="quote.delivery_date">
                                      Delivery Date:
                                      <span> {{ formatDate(quote.delivery_date) }} </span>
                                    </div>
                                  </div>
                                </div>
                                <div class="dlvry_optn-price_box align-self-center">
                                  ${{ parseFloat(quote.handling_fee) }}
                                </div>
                              </div>
                            </label>
                          </div>
                        </template>
                      </div>
                    </div>   
                    <div v-else-if="step == 2 && activeTab === 2 && fetchingQuotes && enabledTabs.shipping">
                      <div class="spinner-wrapper text-center">
                        <div class="spinner-border" role="status"></div>
                      </div>
                    </div>                  
                  </template>
                  <div class="d-flex justify-content-center justify-content-sm-end flex-column flex-sm-row w-100">
                    <button v-if="step == 2" :disabled="isSubmitting || fetchingQuotes || validatingAddress" class="btn btn-primary w-300px text-uppercase text-left d-flex align-items-center justify-content-between mx-auto mx-sm-0 pull-right" @click="completeStep(step)">
                      <span v-if="paypalCheckout">Continue to Review</span>
                      <span v-else>Continue to PAYMENT</span>
                      <i class="fa fa-spin fa-spinner mr-1" v-if="isSubmitting"></i>
                      <img src="/icons/button-arrow.svg" v-else>   
                    </button>
                  </div> 
                <div v-if="step == 4 && (loggedInUser || isGuestCheckout)">
                  <template>
                    <h6 class="card-title font-weight-bold mb-2 mb-md-3">Order notes</h6>
                    <b-form-textarea rows="3" v-model="customInfo.order_notes" placeholder="Notes for your order (optional)" />
                  </template>
                </div>                
                </div>
              </div>                
              <div v-if="step == 4 && showRecurringOrdersSection" class="card p-4 mt-3" :class="{'border-primary': displayRecurringOrdersSectionBorder}">
                <RecurringOrderSetup 
                  ref="recurringOrderSetupRef"
                  @save-recurring-order="handleRecurringOrderDetails"
                />
              </div> 
              <div v-if="step == 4 && showRecurringOrdersSection" class="d-flex justify-content-end w-100">
                <button v-if="loggedInUser && totalItems > 0 && save_cart" id="submit" @click="saveCurrentCart" type="button" class="btn btn-outline-primary p-2 p-sm-3 mt-3 mr-2" :disabled="!loggedInUser || isSubmitting || saving">
                  <span v-if="saving" class="spinner-border spinner-border-sm mr-3" role="status" aria-hidden="true"></span>Save Cart
                </button>
                <button :disabled="isSubmitting" class="btn mt-3 btn-primary text-uppercase text-left d-flex align-items-center justify-content-center justify-content-sm-between mx-sm-0 pull-right w-auto" @click="completeStep(step)">
                  <span class="mr-5">Place Order</span>
                  <i class="fa fa-spin fa-spinner mr-1" v-if="isSubmitting"></i>
                  <img src="icons/button-arrow.svg" v-else>   
                </button>
              </div>              
            </template>   
            <template v-if="step == 2">
              <reward-members :customInfo="customInfo" class="mobile-only mt-3" :style="{display: totalItems > 0 ? 'block' : 'none'}" v-if="loggedInUser && settings.cart.rewardMembers" />
              <redeem-promo v-if="promos"  class="mobile-only" :style="{display: totalItems > 0 ? 'block' : 'none'}" />
              <div v-if="$store.state.hasTrueValueRewards" class="card p-3 p-md-4 mt-3 mobile-only">
                <h6 class="card-title text-uppercase font-weight-bold mb-3">{{ $ezTVRName() }} Number</h6>
                <div v-if="isTVRValid" style="font-size:14px;border-radius:0;border-width:2px">
                  You're earning rewards with this order!
                </div>
                <b-form-input v-model="customInfo.tvr_number" maxlength="10" placeholder="Optional. Enter your 10-digit rewards number." />
                <div class="mt-2 mb-3 pb-3 border-bottom" v-if="!isTVRValid">
                  <!-- open a modal to subscribe -->
                  <a href="#" class="font-weight-bold "  @click.prevent="openTvrModal(false)">Forgot your rewards number?</a>
                </div>

                <div v-if="!isTVRValid">
                  <h6 class="mb-2">Not A Rewards Member?</h6>
                  <a href="#" class="font-weight-bold " @click.prevent="openTvrModal(true)">Sign Up for {{ $ezTVRName() }} now!</a>
                </div>
              </div> 
            </template>     
            <div v-show="step == 3">     
              <div v-if="step == 3" class="card p-3 p-md-4">
                <h6 class="text-uppercase font-weight-bold pb-2 pb-md-3 pt-0 border-bottom mb-2 mb-md-3">Payment Information</h6>
                <template v-if="contractorNumber.length > 0 && ((isPaymentModuleVisible || isPickupPaymentCustomersChoice) && !hasOffsitePayment)">
                  <h6 class="card-title font-weight-bold">
                    Bill to Account
                    <span class="account-number">{{ contractorNumber }}</span>
                  </h6>
                  <p>Your order will be billed the account you have on file with this business.</p>
                </template>
                <template v-else>  
                  <div class="">
                    <template v-if="paypalCheckout">
                      <div class="card rounded p-4">
                        <ul class="my-0 my-md-2 p-0 ml-0 ml-md-2 radio-list">
                          <li class="text-capitalize">{{ paymentMethod }}</li>  
                        </ul>   
                      </div> 
                    </template> 
                    <template v-if="activeTab == 0 && (isPickupPaymentCustomersChoice || businessDetails.pickup_payment === 'store') && !paypalCheckout">
                      
                      <div class="row mb-3 justify-content-start mx-0">
                        <div class="col-12 d-flex">
                          <div v-if="isPaymentEnabled" class="tab-radio custom-control custom-radio mr-3">
                            <input name="pickupPayment" v-model="pickupPaymentOption" type="radio" value="website" class="custom-control-input" id="onlinePayent">
                            <label class="custom-control-label d-flex align-items-center dark-checkbox" for="onlinePayent">
                              Pay Online
                            </label>
                          </div>
                          <div class="tab-radio custom-control custom-radio">
                            <input name="pickupPayment" v-model="pickupPaymentOption" type="radio" value="store" class="custom-control-input" id="storePayment">
                            <label class="custom-control-label d-flex align-items-center dark-checkbox" for="storePayment">
                              Pay in Store
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="px-2 px-sm-3 pt-0 ft-16" v-if="pickupPaymentOption == 'store'">
                        You will be required to pay at the store when picking up your products. <br> Please bring your <b>Order Confirmation Number</b>
                        when picking up the products.
                      </div>
                    </template>  
                    <div class="row justify-content-center w-100 mx-0" v-if="paypalEnabled && !paypalCheckout && isPaymentEnabled">
                      <div class="col-12">
                        <div class="d-flex flex-column align-items-center justify-content-center">  
                          <paypal-checkout ref="paypalCheckoutStep3" :elem="`paypalCheckoutStep3`" v-if="!paypalCheckout && step == 3" /> 
                          <div v-if="isPaymentModuleVisible" class="my-3 w-100 position-relative d-flex align-items-center justify-content-center">
                            <hr class="w-100" >
                            <span class="position-absolute px-3 py-2 bg-white">OR</span>    
                          </div>
                        </div>
                      </div>
                    </div>                 
                    
                    <template v-if="!paypalCheckout && isPaymentEnabled && isPaymentModuleVisible">
                      <div class="d-flex px-3">
                        <h6 class="d-flex card-title font-weight-bold w-100">Pay with Credit Card</h6>
                      </div>
                      <PaymentModule
                        ref="paymentModule"
                        :customInfo="customInfo"
                        :isPaymentVisible="isPaymentModuleVisible"
                        :addressModel="billingAddress"
                        :typeName="typeName"
                        :showTitle="false"
                        :memberInfo="memberInfo"
                        :showCardProviders="settings.cart.showCardProviders"
                        :isGuestCheckout="isGuestCheckout"
                        :optInForRegister="optInForRegister"
                        :isSameBillingAddress="isSameBillingAddress"
                        :billingAddress="addressModel"
                        @onSubmit="reviewBeforeSubmit"
                        @selectedCard="paymentModuleSelectedCard"
                      />
                    </template> 
                  </div>                       
                             
                </template>                
                <div class="p-3" v-if="step == 3 && (activeTab != 0) || (activeTab === 0 && (pickupPaymentOption == 'website' || businessDetails.pickup_payment == 'website'))">
                  <!-- Billing Address fields -->
                  <div class="">
                    <h6 class="card-title font-weight-bold ">Billing Address</h6>
                    <div v-if="step == 3 && activeTab != 0" class="custom-control custom-checkbox mb-2 pl-3 ml-1">
                      <input type="checkbox" v-model="isSameBillingAddress" class="custom-control-input" id="isSameBillingAddress" >
                      <label class="custom-control-label" for="isSameBillingAddress">Same as {{activeTab === 2 ? 'shipping' : 'delivery'}} address.</label>
                    </div>
                  </div>                                         
                  <div class="" v-if="step == 3 && (activeTab != 0 && !isSameBillingAddress) || (activeTab === 0 && (pickupPaymentOption == 'website' || businessDetails.pickup_payment == 'website'))" :key="'billing'" >
                      <div class="row">
                        <div class="col-12">
                          <label for="inputCountry" class="mb-1">Country/Region </label>
                          <select :disabled="isSubmitting" v-model="billingAddress.country" :class="{'is-invalid':billingAddressErrors.country}" @change="onAddressChange('country')" id="inputCountry" class="form-control" name="country" required>
                            <template v-if="additionalCountries">
                              <option v-for="(country,key) in additionalCountries" :key="key" :value="key">{{country}}</option>
                            </template>
                            <option value="USA" selected>USA</option>
                          </select>
                          <div v-if="billingAddressErrors.country" class="invalid-feedback">
                              {{ billingAddressErrors.country[0] }}
                          </div>
                        </div>
                        <div class="col-12">
                          <label class="form-check-label mb-1 mt-2">
                            Address line 1
                          </label>
                          <input :disabled="isSubmitting" v-model="billingAddress.address" @change="onAddressChange('address')" :class="{'is-invalid':billingAddressErrors.address}" type="text" class="form-control" name="address" placeholder="Address line 1" required />
                          <div v-if="billingAddressErrors.address" class="invalid-feedback">
                            {{ billingAddressErrors.address[0] }}
                          </div>
                        </div>
                        <div class="col-12">
                          <label class="form-check-label mb-1 mt-2">
                            Address line 2 (optional)
                          </label>
                          <input :disabled="isSubmitting" v-model="billingAddress.address2" @change="onAddressChange" type="text" class="form-control" name="address2" placeholder="Address line 2">
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-12 col-md-4">
                          <label for="city" class="mb-1 mt-2">City</label>
                          <input :disabled="isSubmitting" type="text" v-model="billingAddress.city" @change="onAddressChange('city')" :class="{'is-invalid':billingAddressErrors.city}" class="form-control" id="city" name="city" placeholder="City" required />
                          <div v-if="billingAddressErrors.city" class="invalid-feedback">
                            {{ billingAddressErrors.city[0] }}
                          </div>
                        </div>
                        <div class="col-12 col-md-4">
                          <label for="state" class="mb-1 mt-2">State/Province/Region: </label>
                          <select v-if="billingAddress.country == 'USA' || !billingAddress.country" :disabled="isSubmitting" v-model="billingAddress.state" id="state" class="form-control" name="state" @change="validateAddressState(false,true)" :class="{'is-invalid':billingAddressErrors.state}" required>
                            <option v-for="(state,key) in this.businessDetails.states" :value="key" :key="key">{{state}}</option>
                          </select>
                          <input v-else :disabled="isSubmitting" v-model="billingAddress.state" type="text" class="form-control" id="state" name="state" placeholder="State" @change="validateAddressState(false,true)" :class="{'is-invalid':billingAddressErrors.state}">
                          <div v-if="billingAddressErrors.state" class="invalid-feedback">
                              {{ billingAddressErrors.state[0] }}
                          </div>
                        </div>
                        <div class="col-12 col-md-4" v-if="!settings.cart.hideDeliveryZipcode">
                          <label class="mb-1 mt-2">Postal Code</label>
                          <input :disabled="isSubmitting" v-model="billingAddress.postal_code" type="text" :class="{'is-invalid':billingAddressErrors.postal_code}"  @change="onAddressChange('postal_code')" class="form-control" name="postal_code" placeholder="Postal Code" required />
                          <div v-if="billingAddressErrors.postal_code" class="invalid-feedback">
                              {{ billingAddressErrors.postal_code[0] }}
                          </div>
                        </div>
                      </div>                        
                  </div>
                  <div class="" v-if="step == 3 && (activeTab != 0 && isSameBillingAddress)" :key="'sameBilling'" >
                    <p class="m-0">
                      {{ addressModel.address }}
                      <br>
                      {{ addressModel.city }},
                      {{ addressModel.state }} 
                      <template v-if="!settings.cart.hideDeliveryZipcode">
                        {{ addressModel.postal_code }}
                      </template>
                      {{ addressModel.country }}
                    </p>
                  </div>
                </div> 

                <div class="d-flex justify-content-end">
                  <button v-if="step == 3 && (isPaymentModuleVisible || !paypalEnabled || (pickupPaymentOption == 'store' && businessDetails.pickup_payment != 'website') || paypalCheckout)" :disabled="isSubmitting" class="btn btn-primary text-uppercase w-300px mt-3 text-left d-flex align-items-center justify-content-between pull-right" @click="completeStep(3)">
                    <span>Continue</span>
                    <i class="fa fa-spin fa-spinner mr-1" v-if="isSubmitting"></i>
                    <img src="/icons/button-arrow.svg" v-else>   
                  </button>
                </div>
              </div>         
            </div>                        
            <img v-if="!cart" src="/icons/loader.gif" class="loader py-3">            
          </div>
          <div class="col-lg-4 d-flex flex-column">
            <div class="card mb-3 checkout-options">
              <div class="card-body d-flex flex-column p-3 p-md-4">                                   
                <div class="order-2 order-sm-1">
                  <button v-if="step == 1 && !loggedInUser" @click="loginPopup" :class="{'mb-2 mb-sm-4' : !guestCheckoutWithPaypalOnly || paypalCheckout || loggedInUser}" class="login-link btn btn-primary w-100 d-flex align-items-center justify-content-center mt-0">Login and checkout</button>
                  <button v-if="step == 1 && (!guestCheckoutWithPaypalOnly || paypalCheckout || loggedInUser)" class="btn checkout-btn btn-primary w-100 d-flex align-items-center justify-content-center text-uppercase" @click="guestCheckout">
                    <span class="mr-3" v-if="paypalCheckout">Continue Checkout</span>
                    <span class="mr-3" v-else>{{!loggedInUser ? 'Guest' : ''}} Checkout</span>
                    <img src="/icons/button-arrow.svg">   
                  </button>
                  <div v-if="step == 1 && paypalEnabled && !paypalCheckout && isPaymentEnabled">
                    <div class="d-flex flex-column align-items-center">  
                      <span class="my-2 my-sm-4" v-show="!paypalCheckout">OR</span>
                      <paypal-checkout ref="paypalCheckout" :elem="`paypalCheckout`" v-if="!paypalCheckout" />              
                    </div>
                  </div>
                </div>                   
                <div class="order-1 order-sm-2">
                  <h6 class="card-title font-weight-bold text-uppercase" :class="{'mt-0 mt-sm-4' : step == 1}">Order Summary</h6>
                  <cart-totals ref="cartTotals" :typeName="typeName" :zipcode="addressModel.delivery_postal_code" :taxes-calculated="!taxesError && !zipCodeError" @checkZipcode="checkZipcode" @setDeliveryZipCode="setDeliveryZipCode" />
                </div> 
              </div>
            </div>
            <form v-if="step > 1" @submit.prevent="() => {}">              
              <reward-members :customInfo="customInfo" :class="{ 'hide-on-mobile' : step >= 2 }" :style="{display: totalItems > 0 ? 'block' : 'none'}" v-if="loggedInUser && settings.cart.rewardMembers" />
              <redeem-promo v-if="promos" :class="{ 'hide-on-mobile' : step >= 2 }" :style="{display: totalItems > 0 ? 'block' : 'none'}" />
              <div v-if="$store.state.hasTrueValueRewards" class="card p-4 mb-3" :class="{ 'hide-on-mobile' : step >= 2 }">
                <h6 class="card-title text-uppercase font-weight-bold mb-3">{{ $ezTVRName() }} Number</h6>
                <div v-if="isTVRValid" style="font-size:14px;border-radius:0;border-width:2px">
                  You're earning rewards with this order!
                </div>
                <b-form-input v-model="customInfo.tvr_number" maxlength="10" placeholder="Optional. Enter your 10-digit rewards number." />
                <div class="mt-2 mb-3 pb-3 border-bottom" v-if="!isTVRValid">
                  <!-- open a modal to subscribe -->
                  <a href="#" class="font-weight-bold "  @click.prevent="openTvrModal(false)">Forgot your rewards number?</a>
                </div>

                <div v-if="!isTVRValid">
                  <h6 class="mb-2">Not A Rewards Member?</h6>
                  <a href="#" class="font-weight-bold " @click.prevent="openTvrModal(true)">Sign Up for {{ $ezTVRName() }} now!</a>
                </div>
              </div>             
              <!-- NORMAL ITEMS -->
              <CartItems 
              :compactView="true" 
              :readOnly="true" 
              :hideItems="false" 
              :hideTabs="true" 
              :title="'order details'" 
              ref="cartItemNormal" 
              v-if="cart && cart.parcels && cart.parcels.length" 
              :items="cart.parcels"
              :is-submitting="isSubmitting" 
              @onTabChange="onTabChange" />
                            
            </form>
          </div>
        </div>
        <div v-else>
          {{ settings.cart.empty }}
        </div>
      </div>
    </section>
    <section v-if="isOrderSubmitted">
      <div class="success-box px-3 px-md-0 mx-auto d-flex flex-column align-items-center justify-content-center">
        <div class="img-suc d-flex justify-content-center align-items-center flex-column">
          <img :src="settings.cart.submittedOrderImage || '/icons/success.png'" style="max-width: 500px;" alt="Submit Order" />
          <div class="my-3 text-center" v-html="successText"></div>
          <p v-if="loggedInUser" class="font-weight-bold text-center">Click on the Review Order button to print a copy of your order.</p>
        </div>
        <div class="d-flex flex-column flex-md-row w-100" :class="loggedInUser ? 'justify-content-between' : 'justify-content-center'">
          <router-link v-if="loggedInUser" to="/orders" class="btn btn-primary mb-3 mb-md-0 p-3">
            Review My Orders
          </router-link>
          <router-link to="/" class="btn btn-outline-primary p-3">
            Back To Shopping
          </router-link>
        </div>
      </div>
    </section>

    <VFooter v-if="settings.navigationLayout == 'secondary'"></VFooter>

    <TrueValueRewardsModal :tvr-data="tvrData" ref="tvrModal" @signup="tvrSignup"></TrueValueRewardsModal>

    <ValidatedAddress @getRates="getRates" ref="validatedAddressModal" :validatedAddress="validatedAddress"/>

    <b-modal no-close-on-backdrop :hide-header="true" class="modal-box modal-lg" modal-class="validated_address-con" dialog-class="modal-lg" footer-class="d-flex justify-content-between align-items-center validated_address-footer-box" ref="restrictedItemsModal">

      <div class="validated_address-box">
        <div class="validated_address-title">
          <h5>
            Restricted Items
          </h5>
        </div>
        <div class="validated_address-content-box">
          <div class="card-body items">
            <div v-for="(first, i) in firstLoop" :key="i">
              <template v-for="item in first.items">
                <template v-if="item.is_restricted">
                  <cart-item  :key="item.sku" :item="item" :special="false" :class="{'disabled': isSubmitting}" />
                  <div :key="item.sku+'_'">
                    <span class="text-danger">
                      According to your State & Local Laws, This item is restricted from shipping to your area. We apologize for the inconvenience.
                    </span>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>

      <template slot="modal-footer">
        <button class="btn btn-sm cancel-btn" @click="$refs.restrictedItemsModal.hide()">Cancel</button>
      </template>

    </b-modal>

    <b-modal no-close-on-backdrop :title="'Login'" header-class="bg-white" :hide-footer="true" class="modal-box modal-lg" footer-class="d-flex justify-content-between align-items-center validated_address-footer-box" ref="loginModal">
      <login-form :simpleLayout="true" :loginFromCart="true" />            
    </b-modal>
  </main>
</template>

<script>
  import OrderApiService from '@/api-services/order.service';
  import CartApiService from '@/api-services/cart.service';
  import HomePageService from '@/api-services/homepage.service';
  import UserApiService from '@/api-services/user.service';
  import AuthController from '@/controllers/auth.controller';
  import TrueValueRewardsModal from '@/components/modals/true-value-rewards';
  import VFooter from '../custom-pages/gerretsen/components/Footer';
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
  import PaymentModule from '@/components/cart/payment-module';
  import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
  import ValidatedAddress from "../components/modals/validated-address";
  import PaypalCheckout from "../components/cart/paypal-checkout";
  import moment from "moment";
  import LoginForm from '@/components/login-form.vue';
  import NewLoginForm from '@/components/login-form-new.vue';
  import CartItems from '@/components/cart/cart-items.vue';
  import RecurringOrderSetup from '@/components/cart/recurring-order-setup';
  
  export default {
    name: 'CheckoutPage',
    data() {
      return {
        deliveryDate: null,
        activeTab: 0,
        displayNewAccountSection: false,
        isSubmitting: false,
        memberInfo: {},
        saved: null,
        save_cart: null,
        saving: false,
        loggedInUser: AuthController.checkAuthStatus(),
        cardError: '',
        isOrderSubmitted: false,
        promos: false,
        customInfo: {
          loyality_lookup_field: '',
          order_notes: '',
          tax_exempt: false,
          senior_citizen: false,
          tvr_number: '',
        },
        showDeliveryZipError: false,
        addressModel: {},
        zipCodeError: null,
        taxesError: null,
        calculatingTaxes: false,
        hasTvrNumber: false,
        tvrData: {
          first_name: '',
          last_name: '',
          address: '',
          address2: '',
          city: '',
          state: '',
          postal_code: '',
          telephone: '',
          email: '',
          receive_marketing: false,
        },
        allItems: [],
        storeDistance: null,
        validatedAddress: {
          "street1": "",
          "street2": "",
          "city": "",
          "state": "",
          "country": "",
          "zip": ""
        },
        billingAddress: { address: '', address2: '', postal_code: '', city: '', state: '', country: 'USA' },
        addressValidated: false,
        validatingAddress: false,
        countriesList: null,
        pickupPaymentOption: "store",
        optInForRegister: false,
        internalSubmitOtherProps: {},
        selectedCard: null,
        addressErrors: {},
        billingAddressErrors: {},
        isSameBillingAddress: true,
        paymentErrorMssg: "",
        shippingAddressValidationMsg: null,
        shippingAddressChanged: false,
        showLoginForm: false,
        recurringOrder: null,
      };
    },
    components: {
      ValidatedAddress,
      VFooter,
      VueCtkDateTimePicker,
      TrueValueRewardsModal,
      PaymentModule,
      LoginForm,
      PaypalCheckout,
      CartItems,
      NewLoginForm,
      CartItems,
      RecurringOrderSetup
    },
    computed: {
      isGuestCheckout: {
        // getter
        get: function () {
          if(this.loggedInUser){
            return false;
          }
          return true;
        },
        // setter
        set: function (newValue) {
          return newValue;
        }
      },
      addressInfo(){
        if(this.addressModel && this.addressModel.address){
          return `${this.addressModel.address}, ${this.addressModel.city}, ${this.addressModel.state}, ${this.addressModel.country} ${this.addressModel.postal_code}`;
        }
        return '';
      },
      billingAddressInfo(){
        if(this.billingAddress && this.billingAddress.address){
          return `${this.billingAddress.address}, ${this.billingAddress.city}, ${this.billingAddress.state}, ${this.billingAddress.country} ${this.billingAddress.postal_code}`;
        }
        return '';
      },
      billingAddressIsEmpty(){
        return !this.billingAddress.address && !this.billingAddress.address2 && !this.billingAddress.city && !this.billingAddress.state && !this.billingAddress.country && !this.billingAddress.postal_code;
      },
      addressIsNotEmpty(){
        return this.addressModel.address && this.addressModel.city && this.addressModel.state && this.addressModel.country && this.addressModel.postal_code;
      },
      step(){
        return this.$store.state.cartStep;
      },
      enabledTabs() {
        if (this.cart && this.cart.checkout_types) {
          return {
            pickup: this.cart.checkout_types.includes('pickup'),
            delivery: this.cart.checkout_types.includes('delivery'),
            shipping: this.cart.checkout_types.includes('shipping')
          };
        } else {
          // default to business details at first
          return {
            pickup: this.businessDetails.pickup_enabled,
            delivery: this.businessDetails.delivery_enabled,
            shipping: this.businessDetails.shipping_enabled
          };
        }
      },
      firstLoop() {
        if(!this.normalItems) {
          return;
        }

        this.checkItemsRestriction();
        if (!this.$store.state.cartItemsRestricted) {
          this.$refs.restrictedItemsModal && this.$refs.restrictedItemsModal.hide();
        }
        return this.normalItems.items ? [this.normalItems] : this.normalItems;
      },
      availableShippingQuotes() {
        return this.$store.state.cartShippingQuotes;
      },
      fetchingQuotes() {
        return this.$store.state.cartFetchingShippingQuotes;
      },
      selectedShippingQuote() {
        return this.$store.state.cartSelectedShippingQuote;
      },
      settings() {
        return this.$store.state.settings;
      },
      showTaxJar() {
        if(this.settings.cart.hideDeliveryZipcode)
          return false;
        let taxJar = this.settings.cart.taxJar;
        if(taxJar == true) {
          return true;
        } else if(Array.isArray(taxJar)) {
          if([...taxJar].find(e => e == 'pickup') && this.activeTab == 0 ||
          [...taxJar].find(e => e == 'delivery') && this.activeTab == 1 ||
          [...taxJar].find(e => e == 'shipping') && this.activeTab == 2)
            return true;
        }
        return false;
      },
      allowedZipsByStore() {
        if(!this.settings.cart.allowedZips || !localStorage.getItem('selectedStore'))
          return null;
        let ret = Object.entries(this.settings.cart.allowedZips).find(e => e[0] == localStorage.getItem('selectedStore'));
        return ret ? ret[1] : null;
      },
      hasOffsitePayment() {
        return ['plugnpay', 'stripe_checkout', 'fiserv'].includes(this.$store.state.payment_provider);
      },
      completeOrderText() {
        return this.hasOffsitePayment ? 'Proceed to Payment' : 'Complete Order';
      },
      showPaymentResponse() {
        return ['fiserv'].includes(this.$store.state.payment_provider) && this.paymentErrorMssg.length > 0;
      },
      dateFormat() {
        return this.businessDetails.delivery_settings.enable_time ? 'YYYY-MM-DD HH' : 'YYYY-MM-DD';
      },
      dateFormatted() {
        return this.businessDetails.delivery_settings.enable_time ? 'ddd, MMM Do, YYYY, h a' : 'ddd, MMM Do, YYYY';
      },
      minDate() {
        // FUCK THIS, I JUST WANTED TO FINISH THE DATEPICKER WEEKEND STUFF
        let weekendsOffset = 0,
            weekendsOffset2 = 0;
        let date = new Date(Date.now());
        let minDate = Number(this.businessDetails.delivery_settings.delivery_datepicker_min_date) || 0;
        for(let i = 1; i <= minDate; i++) {
          date.setDate(date.getDate() + 1);
          if(!this.businessDetails.delivery_settings.delivery_on_weekends) {
            if(date.getDay() == 0 || date.getDay() == 6) {
              weekendsOffset += 1;
            }
          }
        }
        for(let i = 1; i <= weekendsOffset; i++) {
          date.setDate(date.getDate() + 1);
          if(!this.businessDetails.delivery_settings.delivery_on_weekends) {
            if(date.getDay() == 0 || date.getDay() == 6) {
              weekendsOffset2 += 1;
            }
          }
        }
        date.setDate(date.getDate() + (weekendsOffset2));
        return date.toISOString().slice(0,10).replace(/-/g,"-");
      },
      contractorNumber() {
        return this.cart.ar_account_number || '';
      },
      isPaymentModuleVisible() {
        if(!this.loggedInUser && !this.isGuestCheckout) {
          return false;
        }
        if(this.$store.state.payment_provider === 'none') {
          return false;
        }
        if(this.activeTab === 0) {
          // if only pay on website allowed from business
          return this.businessDetails.pickup_payment === 'website'
          ||
          // if both allowed from business and user selected pay on website 
          (this.businessDetails.pickup_payment === 'both' && this.pickupPaymentOption === 'website');
        } else if(this.activeTab !== 0) {
          return this.businessDetails.delivery_payment !== 'cod';
        }
        return true;
      },
      specialItems() {
        const cartItems = this.cart.parcels;
        if(cartItems && cartItems.length) {
          const specialItems = cartItems.filter(item => {
            return item.type === 'special';
          });
          return specialItems;
        }
        return [];
      },
      typeName() {
        switch (this.activeTab) {
          case 0: return 'pickup';
          case 1: return 'delivery';
          case 2: return 'shipping';
        }
        return '';
      },
      successText() {
        let text = {
          shipping: `<h5>Thanks for shopping! Your order hasn't been shipped yet, but we will send you an email when it is.</h5>`,
          pickup: `Thank you for your order! Don't head to the store just yet. We'll reach out soon to let you know your order is ready for pickup. Keep an eye on your email inbox. <br><small>For questions regarding your order, please contact us and be sure to include your order number and name.</small>`,
          delivery: `<h5>Thanks for shopping! Your order hasn't been prepared yet, but we will send you an email when it's on the road.</h5>`
        };
        return text[this.typeName] || '';
      },
      normalItems() {
        return this.cart.parcels && this.cart.parcels.length ? this.cart.parcels.find(item => item.type === 'pickup') : [];
      },
      cart() {
        return this.$store.state.cart;
      },
      totalItems() {
        return this.$store.state.cartItemCount;
      },
      businessDetails: {
        get() {
          return this.$store.state.businessDetails;
        },
        set(val) {
          return val;
        }
      },
      couponRemovedMessage() {
        return this.cart.coupon_removed;
      },
      enabledHours() {
        let enabledHours = [];
        let timeRange = this.deliveryDate && this.businessDetails.delivery_settings.time_ranges[new Date(this.deliveryDate.split(' ')[0]).getDay()];
        if(!timeRange.from || !timeRange.to)
          return null;
        for(let i = this.to24hr(timeRange.from); i <= this.to24hr(timeRange.to); i++) {
          enabledHours.push(i.toString().padStart(2, 0));
        }
        return enabledHours;
      },
      disabledHours() {
        let disabledHours = [];
        if(this.deliveryDate && this.deliveryDate.split(' ')[0] == this.minDate) {
          for(let i = 0; i <= new Date(Date.now()).getHours(); i++) {
            disabledHours.push(i.toString().padStart(2, 0));
          }
        }
        if(!this.businessDetails.delivery_settings.limit_time || !this.deliveryDate || !this.enabledHours)
          return disabledHours;
        // add hours from 0 to 23
        for(let i = 0; i < 24; i++) {
          disabledHours.push(i.toString().padStart(2, 0));
        }
        disabledHours = disabledHours.filter(e => !this.enabledHours.includes(e));
        return disabledHours;
      },
      isTVRValid() {
        return this.$store.state.hasTrueValueRewards
          && this.customInfo.tvr_number && this.$ezCheckTVRCode(this.customInfo.tvr_number);
      },
      isAdvancedShippingEnabled() {
        return this.businessDetails.advanced_shipping_enabled == 1;
      },
      shippingCarriersAvailable() {
        return this.isAdvancedShippingEnabled && this.$store.state.activeShippingCarriers.length;
      },
      additionalCountries() {
        return this.settings.cart.additionalCountries || this.countriesList;
      },
      isPickupPaymentCustomersChoice() {
        return this.activeTab === 0 && this.businessDetails.pickup_payment === 'both';
      },
      isPaymentEnabled() {
        return (
          (this.activeTab === 0 && (this.businessDetails.pickup_payment === 'both' || this.businessDetails.pickup_payment === 'website'))
          ||
          (this.activeTab !== 0 && this.businessDetails.delivery_payment !== 'cod')
        );
      },
      shippingErrorMssg() {
        let mssg = "Error in calculating shipping cost, please contact us";
        mssg += this.businessDetails.contact_email ? " at " + this.businessDetails.contact_email : ".";
        return mssg;
      },
      paypalEnabled(){
        return this.$store.state.businessDetails && typeof this.$store.state.businessDetails.paypal_checkout_enabled != "undefined" ? (this.$store.state.businessDetails.paypal_checkout_enabled * 1) : 0;        
      },
      cartTotals(){
        return this.$store.state.cartTotals;
      },
      paypalCheckoutOrder() {
        return this.$store.state.paypalCheckoutOrder;
      },
      paypalCheckout(){
        return this.paypalCheckoutOrder && this.paypalCheckoutOrder.id && this.paypalCheckoutOrder.status == "APPROVED" && this.paypalCheckoutOrder.purchase_units[0].amount.value == this.cartTotals.toFixed(2);
      },
      paymentMethod(){
        if(this.paypalCheckout){
          return 'PayPal Checkout';
        }
        if(this.internalSubmitOtherProps && this.internalSubmitOtherProps.provider){
          return this.internalSubmitOtherProps.provider.replaceAll('_', ' ').replaceAll('-', ' ');
        }
        else if(this.pickupPaymentOption == 'store'){
          return 'Pay at Pickup';
        }        
        return '';
      },
      showCard(){
        if(!this.paypalCheckout && this.selectedCard && this.isPaymentModuleVisible){
          return true;
        }
        return false;
      },
      guestCheckoutWithPaypalOnly(){
        if(typeof this.settings.cart.guestCheckoutWithPaypalOnly != 'undefined' && this.settings.cart.guestCheckoutWithPaypalOnly === true){
          return true;
        }
        return false;
        // return this.settings.cart.guestCheckoutWithPaypalOnly;
      },
      allowRecurringOrders() {
        return this.$store.state.businessDetails && typeof this.$store.state.businessDetails.enable_recurring_orders != "undefined" ? (this.$store.state.businessDetails.enable_recurring_orders * 1) : 0;        
      }, 
      showRecurringOrdersSection() {
        // Since stripe card info is saved by default
        return (this.loggedInUser || (!this.loggedInUser && this.optInForRegister)) && this.allowRecurringOrders && (['stripe'].includes(this.$store.state.payment_provider));
      },
      deliveryPromoEnabled() {
        return this.businessDetails.delivery_promos || false;
      },
      displayRecurringOrdersSectionBorder() {
        return this.settings.cart.displayRecurringOrdersSectionBorder && this.settings.cart.displayRecurringOrdersSectionBorder === true || false;
      },
      hidePickupZipcode() {
        return this.settings.cart.hidePickupZipcode && this.settings.cart.hidePickupZipcode === true || false;
      },
    },
    filters: {
      cardType(type) {
        let types = {
            'visa' : 'https://storage.googleapis.com/content.ezadtv.com/2020/08/27/5f4834826fd00_visa.png',
            'mastercard' : 'https://storage.googleapis.com/content.ezadtv.com/2020/08/27/5f48352f74e77_master-card.png',
            'discover' : 'https://storage.googleapis.com/content.ezadtv.com/2020/08/27/5f48353cac10f_discover.png',
            'amex' : 'https://storage.googleapis.com/content.ezadtv.com/2020/08/27/5f483548c5dd1_american-express.png',
            'jcb' : 'https://storage.googleapis.com/content.ezadtv.com/2020/09/02/5f4fd6eed8ea2_jcb.png'
        };
        return types[type];
      }
    },
    created:function() {
      this.setActiveTab();
    },
    async mounted() {
      this.$root.$children[0].$refs.CartSidebar.hide();
      // refresh cart steps on mounted
      // var prevCartStep = localStorage.getItem("cartStep");
      this.guestCheckout();
      // if(prevCartStep && prevCartStep > 1 && !this.guestCheckoutWithPaypalOnly){
      //   this.goToStep(prevCartStep <= 2 ? prevCartStep : 2);
      // }else{
      //   this.goToStep(1);
      // }
      //console.log('cart');
      //window.fbq.push('track', 'Even Name goes here', {value: 1.00, currency: 'USD'});
      this.$ezSetTitle('Cart');
      this.tryInitialModal();
      this.$store.commit('setPaypalCheckoutOrder', null);
      let address;
      var memberInfo =  localStorage.getItem("memberInfo");
      if(!this.loggedInUser && memberInfo){
        this.memberInfo = JSON.parse(memberInfo);

        if(this.settings.cart.enableMarketingEmailsByDefault && this.settings.cart.enableMarketingEmailsByDefault === true) {
          this.memberInfo.receive_marketing = true;
        }
      }
      if(this.loggedInUser){
        this.memberInfo.first_name = this.loggedInUser.data.customer.first_name;
        this.memberInfo.last_name = this.loggedInUser.data.customer.last_name;
        this.memberInfo.telephone = this.loggedInUser.data.customer.telephone;
        this.memberInfo.email = this.loggedInUser.data.customer.email;
        this.memberInfo.receive_sms = this.loggedInUser.data.customer.receive_sms;
        this.memberInfo.receive_marketing = this.loggedInUser.data.customer.receive_marketing == 0 ? 0 : 1;
      }
      var addressModel =  localStorage.getItem("addressModel");
      if(this.loggedInUser && this.$store.state.activeUser && this.$store.state.activeUser.data.customer.customer_addresses){
        address = this.$store.state.activeUser.data.customer.customer_addresses[0];
      }
      if(this.loggedInUser && address) {
        this.addressModel =  {
          address: address.address,
          address2: address.address2,
          postal_code: address.postal_code,
          delivery_postal_code: address.delivery_postal_code,
          city: address.city,
          state: address.state,
          country: address.country,
        };
        this.tvrData.address = address.address;
        this.tvrData.address2 = address.address2;
        this.tvrData.city = address.city;
        this.tvrData.state = address.state;
        this.tvrData.postal_code = address.postal_code;
      } else if(addressModel) {
        this.addressModel = JSON.parse(addressModel);
        if(this.addressModel.country == '') {
          this.addressModel.country = 'USA';
        }
        this.setCountry();
      } else {
        this.addressModel = { address: '', address2: '', postal_code: '', city: '', state: '', country: 'USA', delivery_postal_code: '' };
        // Check for business location
        this.setCountry();
      }      
      if(this.activeTab == 0){
        this.billingAddress = JSON.parse(JSON.stringify(this.addressModel));
      }
      var deliveryDate =  localStorage.getItem("deliveryDate");
      if(deliveryDate){
        this.deliveryDate = deliveryDate;
      }

      if(this.$store.state.activeUser && this.$store.state.activeUser.data.customer) {
        const c = this.$store.state.activeUser.data.customer;
        this.tvrData.first_name = c.first_name;
        this.tvrData.last_name = c.last_name;
        this.tvrData.email = c.email;
        this.tvrData.telephone = c.telephone;
        // maybe leave this false since the marketing option for the store is not the same
        //this.tvrData.receive_marketing = c.receive_marketing === 1;
      }

      if(this.$store.state.activeUser && this.$store.state.activeUser.data.customer.custom_info) {
        Object.entries(this.$store.state.activeUser.data.customer.custom_info).forEach(([key, value]) => {
          this.customInfo[key] = !['order_notes'].includes(key) ? value : this.customInfo[key];
        });
      }
      if(this.cart.tvr_number) {
        this.customInfo.tvr_number = this.cart.tvr_number;
      }
      this.hasTvrNumber = this.$store.state.hasTrueValueRewards && this.customInfo.tvr_number && this.$ezCheckTVRCode(this.customInfo.tvr_number);

      // allow redirect to success page for shitty payment providers like plugnpay
      if(this.$route.query.submitted === '1') {
        this.clearCartInfo();
        this.isOrderSubmitted = true;
      }

      if(this.$route.query.payment_denied === '1') {
        this.paymentErrorMssg = "Your transaction has been denied, Please try again..";
        if(this.showPaymentResponse) {
          this.$swal({
            customClass: {
              container: 'add-to-cart-toast-container',
              popup: 'add-to-cart-toast',
            },
            text: this.paymentErrorMssg,
            type: 'error'
          });
        }
      }

      let promosObj = await CartApiService.checkActiveCoupons();
      this.promos = promosObj.data.available;
      // Setting businessDetails again from API to Vuex Store if undefined (sorry good js)
      if(!Object.keys(this.businessDetails).length) {
        let details = await HomePageService.getBusinessDetails();
        this.$store.commit('setBusinessDetails', details.data.data);
      }

      if(this.isAdvancedShippingEnabled) {
        let _self = this;
        await this.getActiveShippingCarriers().then(() => {
          if(_self.step == 2 && _self.activeTab == 2 && _self.shippingCarriersAvailable) {
            _self.validateAddress();
          }
        });
      }      
      await this.afterCartLoaded();

      // after login page refresh
      if(localStorage.getItem('goToStep')){
        this.goToStep(localStorage.getItem('goToStep'));
        localStorage.removeItem('goToStep');
      }      
      
    },
    methods: {      
      setActiveTab(){
        var prevActiveTab =  localStorage.getItem("prevActiveTab");
        if( prevActiveTab ) {
          prevActiveTab = prevActiveTab * 1;
          if( this.enabledTabs.pickup && prevActiveTab == 0 )
            this.activeTab = prevActiveTab;
          else if ( this.enabledTabs.delivery && prevActiveTab == 1 )
            this.activeTab = prevActiveTab;
          else if ( this.enabledTabs.shipping && prevActiveTab == 2 )
            this.activeTab = prevActiveTab;
          else
            this.activeTab = 0;
        } else {
          this.activeTab = 0;        
        }
      },
      goToStep(step){
        this.$store.commit('setCartStep', step);
        window.scrollTo(0,0);      
        if(this.activeTab === 2 && this.enabledTabs.shipping && this.shippingCarriersAvailable && step == 2) {
          this.validateAddress();
        }        
      },
      guestCheckout(){
        if(!this.loggedInUser){
          this.isGuestCheckout = true;
        }
        this.goToStep(2);
      },
      loginPopup(){
        this.$refs.loginModal.show();
      },
      formatDate(value) {
        return value ? moment(String(value)).format('MM/DD/YY [\r\n] hh:mm A') : '';
      },
      // Run afterCartLoaded on mounted and also when cart changes, should hopefully fix
      // issue of missing payment field if cart loads after the page loads
      async afterCartLoaded() {
        if(this.cart.tvr_number) {
          this.customInfo.tvr_number = this.cart.tvr_number;
        }
        this.hasTvrNumber = this.isTVRValid;
        if(this.totalItems > 0) {
          this.save_cart = this.businessDetails.save_cart;
          // Setting the active tab based on fulfillment options
          // this.activeTab = this.businessDetails.pickup_enabled ? 0 : this.businessDetails.delivery_enabled ? 1 : 2;
        }
        // BEGIN CHECKOUT - Start Google analytics
        setTimeout(() => {
          this.allItems = this.cart.parcels ? [].concat.apply([], this.cart.parcels.map(e => e.items)).map(e => {
            return {
              item_id: e.store_product_id,
              item_name: e.title,
              price: e.price,
              quantity: e.quantity
            };
          }) : [];
          window.gtag && window.gtag('event', 'begin_checkout', {currency: 'USD',items: this.allItems,value: this.cart.total});
        }, 1000);
      },
      async openTvrModal(signup) {
        const address = this.addressModel;
        this.tvrData.address = address.address || '';
        this.tvrData.address2 = address.address2 || '';
        this.tvrData.city = address.city || '';
        this.tvrData.state = address.state || '';
        this.tvrData.postal_code = address.postal_code || '';

        // if this isn't signup, first try and look up the details inline.
        // if it's successful, don't even show a modal, just display the "you're earning rewards" message
        // above the input field.
        let showError = false;
        if(!signup) {
          const t = this.tvrData;
          if(t.last_name && t.email && t.telephone && t.postal_code) {
            const result = await CartApiService.doTvrLookup({
              last_name: t.last_name,
              email: t.email,
              telephone: t.telephone,
              zip: t.postal_code
            });

            if(result.data.status === 'success') {
              this.customInfo.tvr_number = result.data.tvr_number;
              return;
            } else {
              showError = true;
            }
          }
        }
        this.$refs.tvrModal.showTvrModal(signup, showError);
      },
      hideTvrModal() {
        this.$refs.tvrModal.hideTvrModal();
      },
      tvrSignup(number) {
        this.customInfo.tvr_number = number;
      },
      async saveCurrentCart() {
        this.saving = true;
        let response = await CartApiService.saveCart();
        this.saving = false;
        if(response.data.status == 'success') {
          this.$swal({
            title: 'Cart Saved',
            html: 'Cart saved successfully. Do you want to continue adding items to this cart, or clear it?',
            type: 'success',
            showCancelButton: true,
            cancelButtonText: 'Continue Shopping',
            confirmButtonText: 'Clear'
          }).then(async (result) => {
            // clear cart after save when Clear button is clicked
            if(result.value) {
              await CartApiService.emptyCart();
              this.clearCartInfo();
            } else {
              await CartApiService.updateCart(this.cart.order_id);
              await this.$store.dispatch('fetchCartItemsDetails');
              return;
            }
          });
        }
      },
      calculatePrice(item) {
        return item.line_price;
      },
      checkDeliveryLocationStatus() {
        let allowedZips = this.allowedZipsByStore || this.$store.state.businessDetails.delivery_locations;
        const postal_code = this.addressModel.delivery_postal_code;

        if(allowedZips && allowedZips.length > 0) {
          let zipInfo = allowedZips.filter(zip => zip.code == postal_code);

          if(zipInfo && zipInfo.length > 0) {
            this.$store.commit('setDeliveryFee', zipInfo[0].fee.length > 0 ? zipInfo[0].fee : this.cart.default_delivery_fee);
            return true;
          } else {
            this.$store.commit('setDeliveryFee', this.cart.default_delivery_fee);
            return false;
          }
        } else {
          // If no specific zip found then allow anyways
          this.$store.commit('setDeliveryFee', this.cart.default_delivery_fee);
          return true;
        }
      },
      checkZipcode() {
        this.showDeliveryZipError = this.typeName === 'delivery' && !this.checkDeliveryLocationStatus();
        if(!this.showDeliveryZipError) {
          this.handlePostalCodeChange();
        }
        return !this.showDeliveryZipError;
      },
      setDeliveryZipCode(deliveryZipCode){
        this.addressModel.delivery_postal_code = deliveryZipCode;
        this.$forceUpdate();
      },
      loggedIn(value) {
        if(value.status == 'success') {
          this.loggedInUser = value;
        }
      },
      onTabChange(n) {
        this.activeTab = parseInt(n);
        this.onAddressChange(null, n == 2);
        this.validateAddressState();
        if(n == 0 && this.billingAddressIsEmpty) {
          this.billingAddress = JSON.parse(JSON.stringify(this.addressModel));
        }
      },
      allowForRegister(val){
        this.optInForRegister = val;
      },
      updateMember(member) {
        this.memberInfo = member;
        this.tvrData.first_name = member.first_name;
        this.tvrData.last_name = member.last_name;
        this.tvrData.email = member.email;
        this.tvrData.telephone = member.telephone;
      },
      async getRates(override = true, fromPopup = false) {
        if(this.$store.state.cartShippingAddressValidated && this.activeTab == 2) {
          // this.$store.commit('setCartSelectedShippingQuote', null);
          if (!override) {
            this.$store.state.cartShippingAddressValidated = true;
            let data = {
              'street1': this.addressModel.address,
              'street2': this.addressModel.address2,
              'city': this.addressModel.city,
              'state': this.addressModel.state,
              'country': this.addressModel.country,
              'zip': this.addressModel.postal_code,
            };
            this.$store.commit('setCartShippingAddress', data);
          } else {
            if(this.validatedAddress.additionalCountries) {
              this.countriesList = this.validatedAddress.additionalCountries;
            }

            this.addressModel.address = this.validatedAddress.street1;
            this.addressModel.address2 = this.validatedAddress.street2;
            this.addressModel.city = this.validatedAddress.city;
            this.addressModel.state = this.validatedAddress.state;
            this.addressModel.country = this.validatedAddress.country;
            this.addressModel.postal_code = this.validatedAddress.zip;
            this.$store.commit('setCartShippingAddress', this.validatedAddress);
          }
          if(fromPopup) {
            this.$refs.validatedAddressModal.hideModel();
          }

          setTimeout(async () => {
            this.$store.state.cartShippingAddressValidated = true;
            await this.checkItemsRestriction();
            if (this.$store.state.cartItemsRestricted) {
              this.doRestrictedThing();
            } else {
              await this.$store.dispatch('fetchShippingQuotes').then(() => {
                if (this.$store.state.activeShippingCarriers.length && !this.$store.state.cartShippingQuotes.length) {
                  this.$swal({
                    customClass: {
                      container: 'add-to-cart-toast-container',
                      popup: 'add-to-cart-toast',
                    },
                    text: this.shippingErrorMssg,
                    type: 'error'
                  });
                }
              });
            }
          }, 500);
        }
      },
      async validateAddress() {
        if(this.totalItems > 0) {
          this.shippingAddressValidationMsg = null;
          this.addressValidated = false;        
          let errors = false;
          let addErrorMsgs = {};
          Object.keys(this.addressModel).forEach(e => {
            let el = document.getElementsByName(e)[0];
            if(el && el.hasAttribute('required') && !this.addressModel[e]) {
              let label = e.charAt(0).toUpperCase() + e.slice(1);
              addErrorMsgs[e] = [`${label} is required`];
              errors = true;
            }
          });
          this.addressErrors = addErrorMsgs;
          if (errors || !this.addressIsNotEmpty) {
            return;
          };
          this.validatingAddress = true;
          let data = {
            'street1': this.addressModel.address,
            'street2': this.addressModel.address2,
            'city': this.addressModel.city,
            'state': this.addressModel.state,
            'country': this.addressModel.country,
            'zip': this.addressModel.postal_code,
          };
          await OrderApiService.validateAddressOnCart(data)
            .then(async resp => {
              resp = resp.data;
              if (resp.status === 'success') {
                Object.assign(this.validatedAddress, resp.validatedAddress);
                if(this.shippingAddressChanged && this.activeTab == 2){
                  this.$refs.validatedAddressModal.showModal();
                  this.shippingAddressChanged = false;
                }
              } else {
                this.$store.commit('setCartShippingAddress', data);
                if(resp && resp.message) {
                  // this.$swal(resp.message, ` You can still continue if you are sure..`, 'error');
                  this.shippingAddressValidationMsg = `${resp.message} You can still continue if you are sure..`;
                }
              }
            }).catch(async error => {
              error = error.response.data;
              this.$store.commit('setCartShippingAddress', data);

              await this.checkItemsRestriction();
              if (this.$store.state.cartItemsRestricted) {
                this.doRestrictedThing();
              }
            }).finally(async () => {
              this.validatingAddress = false;
              this.$store.state.cartShippingAddressValidated = true;
              this.getRates(false);
            });
        }
      },
      onAddressChange(addressErrorkey = null, isShippingAddress = false) {        
        if(this.activeTab == 2 && this.isAdvancedShippingEnabled && isShippingAddress) {
          // If address is changed, reset existing shipping rate selection
          this.$store.commit('setCartSelectedShippingQuote', null);
        }
        if(this.activeTab === 2 && this.enabledTabs.shipping && isShippingAddress && this.shippingCarriersAvailable) {
          this.validateAddress();
        }
        if(addressErrorkey){
          if(isShippingAddress) {
            this.clearAddressError(addressErrorkey);
          } else {
            this.clearBillingAddressError(addressErrorkey);
          }
        }
      },
      async checkItemsRestriction() {
        if (this.normalItems == undefined || this.normalItems.items == undefined) {
          this.$store.state.cartItemsRestricted = false;
          return;
        }
        this.normalItems.items.forEach((item, index) => {
          this.$set(this.normalItems.items[index], 'is_restricted', false);
          this.$store.state.cartItemsRestricted = false;
        });
        this.normalItems.items.forEach((item, index) => {
          if (item.extra) {
            let extra = JSON.parse(item.extra);
            if (extra.shipping_restrictions && extra.shipping_restrictions != 'null') {
              extra.shipping_restrictions.forEach(restriction => {
                if (restriction.city && restriction.city != '' && this.validatedAddress.city == restriction.city) {
                  this.$set(this.normalItems.items[index], 'is_restricted', true);
                  this.$store.state.cartItemsRestricted = true;
                }
                if (restriction.state && restriction.state != '' && this.validatedAddress.state == restriction.state) {
                  this.$set(this.normalItems.items[index], 'is_restricted', true);
                  this.$store.state.cartItemsRestricted = true;
                }
                if (restriction.country && restriction.country != '' && this.validatedAddress.country == restriction.country) {
                  this.$set(this.normalItems.items[index], 'is_restricted', true);
                  this.$store.state.cartItemsRestricted = true;
                }
              });
            }
          }
        });
      },      
      doRestrictedThing() {
        // forcefully rerender the active tab
        this.$refs.cartItemNormal.activeTab = 0;
        this.$refs.cartItemNormal.activeTab = 2;
        this.$swal({
          toast: true,
          position: 'top',
          type: 'error',
          html: `<div class="ml-2">There are some items that can't be shipped at your location.</div>`,
          showConfirmButton: false,
          timer: 5000
        });
        this.$refs.restrictedItemsModal.show();
      },
      selectShippingQuote(e, index) {
        this.$store.commit('setCartSelectedShippingQuote', this.$store.state.cartShippingQuotes[index]);
      },
      async getActiveShippingCarriers() {
        let res = await OrderApiService.getActiveShippingCarriers();
        if (res && res.data && res.data.status == "success") {
          this.$store.commit('setActiveShippingCarriers', res.data.carriers);
        }
      },
      paymentModuleSelectedCard(card){
        this.selectedCard = card;
      },
      reviewBeforeSubmit(submitProps){
        this.internalSubmitOtherProps = submitProps;
        this.goToStep(4);
      },
      async completeStep(step){
        this.isSubmitting = true;        
        if(step == 2 || step == 3){
          if(step == 2){
            await this.checkItemsRestriction();
            if (this.$store.state.cartItemsRestricted) {
              this.doRestrictedThing();
              this.isSubmitting = false;
              return;
            }
          }
          // just make this always true now?
          // Check for errors
          let errors = false;
          let errorMsgs = {};
          if(step == 2) {
              let member = {
                'first_name': 'First Name',
                'last_name': 'Last Name',
                'telephone': 'Phone Number', 
                'email': 'Email'            
              };
              Object.keys(member).forEach(e => {
                if(!this.memberInfo[e] || this.memberInfo[e].trim() == '') {
                  let label = member[e];
                  errorMsgs[e] = [`${label} is required`];
                  errors = true;
                }
                if((e == "first_name" || e == "last_name") && this.memberInfo[e] && (this.memberInfo[e].length < 3 || this.memberInfo[e].length > 255)) {
                  let label = member[e];
                  errorMsgs[e] = [`${label} must be 3 to 255 characters`];
                  errors = true;
                }
              });
              if(this.isGuestCheckout && this.optInForRegister){
                if(!this.memberInfo.password){
                  errorMsgs.password = ["Password must be at least 6 characters long."];
                  errors = true;
                }else if(this.memberInfo.confirmPassword !== this.memberInfo.password) {
                  errors = true;
                  errorMsgs.c_password = ["Password doesn't match"];
                }
              }
                // if(errors) return;
            this.$refs.cartMember.errors = errorMsgs;
            if(this.memberInfo.email && !this.validateEmail(this.memberInfo.email)){
              errorMsgs.email = ["Email address must be valid."];
              errors = true;
            }
            if(this.memberInfo.telephone){
              this.memberInfo.telephone = this.memberInfo.telephone.replace(/[^0-9]/g, '');
              if(!this.validatePhone(this.memberInfo.telephone)){
                errorMsgs.telephone = ["Phone number must be 10 digits."];
                errors = true;
              }
            }
            if(this.typeName === 'delivery') {
              this.addressModel.postal_code = !this.settings.cart.hideDeliveryZipcode ? this.addressModel.delivery_postal_code : '0';
            }

            if(this.loggedInUser) {
              this.$refs.cartMember.saveInfo();
            }
          }
          let addErrorMsgs = {};
          if((this.typeName == 'delivery' && step == 2)
            || (!this.settings.cart.hideShipping && this.typeName === 'shipping' && step == 2)) {
            Object.keys(this.addressModel).forEach(e => {
              let el = document.getElementsByName(e)[0];
              if(el && el.hasAttribute('required') && !this.addressModel[e]) {
                let label = e.charAt(0).toUpperCase() + e.slice(1);
                addErrorMsgs[e] = [`${label} is required`];
                errors = true;
              }
            });
            if(this.businessDetails.delivery_settings.delivery_datepicker && this.typeName == 'delivery' && !this.deliveryDate) {
              addErrorMsgs.deliveryDate = ["Please enter a delivery date."];
              errors = true;
            }
            if(!this.settings.cart.hideDeliveryZipcode) {
              this.showDeliveryZipError = false;
              if(this.typeName === 'delivery' && !this.checkZipcode()) {
                this.showDeliveryZipError = true;                
              }
              if(this.typeName === 'delivery' || this.typeName === 'shipping') {
                if(addErrorMsgs.postal_code && addErrorMsgs.postal_code.length > 0)
                  addErrorMsgs.postal_code[0] = addErrorMsgs.postal_code[0].replaceAll("Postal", "Zip").replaceAll("_", " ");
              }
            }
          }
          this.addressErrors = addErrorMsgs;
          // billing address validation
          let billingAddErrorMsgs = {};
          if(step == 3 && ((this.activeTab != 0 && !this.isSameBillingAddress) || (this.activeTab === 0 && (this.pickupPaymentOption == 'website' || this.businessDetails.pickup_payment === 'website')))) {
            Object.keys(this.billingAddress).forEach(e => {
              let el = document.getElementsByName(e)[0];
              if(el && el.hasAttribute('required') && !this.billingAddress[e]) {
                let label = e.charAt(0).toUpperCase() + e.slice(1);
                label = label.replaceAll("_"," ");
                billingAddErrorMsgs[e] = [`${label} is required`];
              }
            });
            this.billingAddressErrors = billingAddErrorMsgs;          
          }

          if(Object.keys(billingAddErrorMsgs).length > 0) {
            this.isSubmitting = false;
            let all = null;
            all = {...this.billingAddressErrors };
            let allErrors = Object.keys(all);
            if(allErrors.length > 1){
              allErrors = allErrors.filter(x => {
                  if(x && all[x]){
                      return x;
                  }
              });
            }
            
            if(allErrors.length == 1){
              this.$swal(all[allErrors[0]][0], '', 'error');
            }else{
              this.$swal(`Please fill the required Information`, '', 'error');
            }
            return;
          }

          var validateMemberInfo = null;
          if(step == 2){
            // server side member info validation handling
            validateMemberInfo = await this.validateMemberInfo();
          }
          // client side validation handling
          if(Object.keys(addErrorMsgs).length > 0 || errors || validateMemberInfo || this.showDeliveryZipError) {
            this.isSubmitting = false;
            if(validateMemberInfo && this.step != 2){
              this.goToStep(2);                                    
            }
            let all = null;
            if(this.$refs.cartMember){
              all = {...this.addressErrors, ...this.$refs.cartMember.errors};
            }else{
              all = {...this.addressErrors };
            }
            let allErrors = Object.keys(all);
            if(allErrors.length > 1){
              allErrors = allErrors.filter(x => {
                  if(x && all[x]){
                      return x;
                  }
              });
            }
            
            if(allErrors.length == 1){
              this.$swal(all[allErrors[0]][0], '', 'error');
            }else{
              this.$swal(`Please fill the required Information`, '', 'error');
            }
            return;
          }
          
          if(step == 2){

            if(this.showTaxJar && this.activeTab != 0){
              let calculateTaxesDone = await this.calculateTaxes();
              if(!calculateTaxesDone){
                this.isSubmitting = false;
                return;
              }
            }
                                  
            if(this.$store.state.hasTrueValueRewards && this.customInfo.tvr_number && this.customInfo.tvr_number.length && !this.$ezCheckTVRCode(this.customInfo.tvr_number)) {
              this.isSubmitting = false;
              this.$swal('Error', 'Invalid ' + this.$ezTVRName() + ' account number.', 'error');
              this.customInfo.tvr_number = '';
              return;
            }            

            if(this.loggedInUser){
              let result = await this.validateRedeemedCoupons();
              if(!result) {
                this.isSubmitting = false;
                return;
              }
            }
          }
          // Check to make sure any required custom fields are filled in
          const cf = this.$store.state.businessDetails.custom_fields || {};
            let customFieldErrors = false;
            ['pickup', 'delivery', 'shipping', 'cart'].forEach(typeName => {
              const fields = cf[typeName];
              if((typeName === 'cart' || this.typeName === typeName) && fields && fields.length > 0) {
                fields.every(field => {
                  if(field.required && !this.customInfo[field.name]) {
                    this.$swal('Error', `"${field.label}" must be filled in.`, 'error');
                    if(this.step != 2){
                      // bcs custom fields are on step 2
                      this.isSubmitting = false;
                      this.goToStep(2);
                    }
                    customFieldErrors = true;
                    return false;
                  }
                  return true;
                });
              }
            });

            if(customFieldErrors) {
              this.isSubmitting = false;
              return;
            }
           
          if(step == 3){
            if(!this.paypalCheckout && this.isPaymentModuleVisible) {
              // payment from module and then go to review
              if(this.cart.checkout_types.includes('pickup') && this.typeName === 'pickup' && ((this.isPickupPaymentCustomersChoice && this.pickupPaymentOption == "website") || !this.isPickupPaymentCustomersChoice)) {
                this.checkDistance();
              } else {
                this.pay();
              }
            } else if (!this.paypalCheckout && !this.isPaymentModuleVisible && this.pickupPaymentOption == "website") {
              this.isSubmitting = false;
              this.$swal(`Please continue with Paypal Checkout`, '', 'error');
              return;
            } else if (this.paypalCheckout && this.isPaymentModuleVisible && this.typeName === 'pickup' && ((this.isPickupPaymentCustomersChoice && this.pickupPaymentOption == "website") || !this.isPickupPaymentCustomersChoice)) {
              this.isSubmitting = false;
              this.checkDistance();
            } else {
              this.isSubmitting = false;
              this.goToStep(4);                      
            }        
          }else if(step == 2){
            this.isSubmitting = false;
            this.goToStep(3);                      
          }          
        }    
        if(this.typeName == 'shipping' && this.shippingCarriersAvailable) {
          if(!this.selectedShippingQuote) {
            this.isSubmitting = false;
            this.$swal(`Please select shipping rate.`, '', 'error');
            if(this.availableShippingQuotes.length == 0) {
              this.$store.state.cartShippingAddressValidated = true;
              this.getRates(false);
            }
            if(this.step != 2){
              this.goToStep(2);
            }
            return;
          }
        }    
        if(step == 4){
          if(this.paypalCheckout){
            this.internalSubmit({
              isPayPalCheckout: 1, 
              provider: 'credit-card',
              custom_info: this.customInfo,
              isEmailFromPaypal: this.paypalCheckoutOrder.payer.email_address == this.memberInfo.email
            });
            return;
          }
          // after review submit the order
          this.internalSubmit(this.internalSubmitOtherProps);
        }
      },
      async checkDistance(){
        let zip = this.billingAddress.postal_code;
        if(zip && !this.settings.cart.hideDeliveryZipcode) {
          let distance = await UserApiService.getStoreDistance(zip);
          this.storeDistance = distance.data;
          if(this.storeDistance.status === 'error') {
            this.$swal(this.storeDistance.message, '', 'error');
            this.isSubmitting = false;
          } else {
            this.showPickupModal();
            this.isSubmitting = false;
          }
          return;
        } else {
          this.pay();
        }
      },
      validateEmail(email){
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      },
      validatePhone(phone){
        if(phone){
          phone = phone.replace(/[^0-9]/g, '');
          return phone.length == 10;
        }
        return false;
      },
      async validateMemberInfo(){
        let errors = false;
        let request = { 
          isEmailFromPaypal: this.paypalCheckout ? this.paypalCheckoutOrder.payer.email_address == this.memberInfo.email : false
         };
        if(!this.loggedInUser && this.memberInfo.email && this.validateEmail(this.memberInfo.email)){
          request.email = this.memberInfo.email;
        }
        if(!this.loggedInUser && this.memberInfo.telephone && this.validatePhone(this.memberInfo.telephone)){
          request.telephone = this.memberInfo.telephone;
        }
        if(Object.keys(request).length > 0){
          await OrderApiService.validateMemberInfoOnCart(request)
            .then(async resp => {
              resp = resp.data;
              if (resp.status == 'success'){
                if(this.$refs.cartMember){
                  Object.keys(request).forEach((itm,idx) => {
                    this.$refs.cartMember.clearError(itm);
                  });
                  this.$refs.cartMember.$forceUpdate();
                }                
              }
              if (resp.status != 'success' && resp.errors) {
                errors = true;
                if(this.$refs.cartMember){
                  Object.keys(resp.errors).forEach((itm,idx) => {
                    this.$refs.cartMember.errors[itm] = resp.errors[itm];
                  });
                  this.$refs.cartMember.$forceUpdate();
                }
              } 
            }).catch(async error => {
              errors = true;
              error = error.response && error.response.data ? error.response.data : { errors: {} };
              Object.keys(error.errors).forEach((itm,idx) => {
                this.$refs.cartMember.errors[itm] = error.errors[itm];
              });
              if(this.$refs.cartMember)
                this.$refs.cartMember.$forceUpdate();
            });
          return errors;
        }
      },
      pay() {     
        if(this.paypalCheckout) {
          this.goToStep(4);
          return;
        }   
        if(!this.isPaymentModuleVisible || this.contractorNumber.length > 0) {
          this.cardError = '';
          this.isSubmitting = true;
          this.reviewBeforeSubmit({ custom_info: this.customInfo });
          return;
        }

        this.$refs.paymentModule.pay(this.$store.state.payment_provider);
      },
      showPickupModal() {
        if(this.storeDistance && this.storeDistance.distance > this.storeDistance.limit) {
          let header = '';
          let body = '';
          if(this.settings.cart.distanceModal) {
            header = this.settings.cart.distanceModal.header;
            body = this.settings.cart.distanceModal.body
              ? this.settings.cart.distanceModal.body.replace(new RegExp('\{\{(?:\\s+)?(limit)(?:\\s+)?\}\}'), `<b>${this.storeDistance.distance}</b>`) : null;
          }
          const dist = Math.round(this.storeDistance.distance);
          this.$swal({
            type: 'warning',
            title: header || `Pickup order!`,
            html: body || `This order is for in-store pick up. You are <b>${dist}</b> miles away, would you like to proceed?`,
            showCancelButton: true,
            cancelButtonText: 'Go back',
            confirmButtonText: 'Continue',
          }).then(result => {
            /* Read more about isConfirmed, isDenied below */
            if(result.value) {
              if(this.paypalCheckout) {
                this.goToStep(4);
              } else {
                this.pay();
              }
            }
          });
        } else {
          this.pay();
        }
      },
      async internalSubmit(otherProps) {
        this.isSubmitting = true;
        // SIPPING AND PAYMENT METHOD - Start Google analytics
        this.typeName === 'shipping' && window.gtag && window.gtag('event', 'add_shipping_info',
          { currency: 'USD', items: this.allItems, shipping_tier: 'Air', value: this.cart.total });
        otherProps.provider === 'credit-card' && window.gtag && window.gtag('event', 'add_payment_info',
          { currency: 'USD', items: this.allItems, payment_type: 'Credit Card', value: this.cart.total });

        // i don't know WTF is going on here but the server expects zip, and the frontend
        // is always using postal_code??? how the fuck has this ever worked????????
        // so just set zip to postal_code before sending
        this.addressModel.zip = this.addressModel.postal_code;

        // NOTE TO THE INEVITABLE MERGE CONFLICT:
        // on taxjar, delivery address field uses "address" and "delivery_postal_code"
        // while on merged-project, it uses "address" and "postal_code"
        // the server expects address and zip.

        // force override these to the delivery information if we have delivery selected?
        // because not doing this means the data is just fucking GONE and ignored and all the
        // wrong stuff happens.
        // don't set delivery_address here because the delivery fields use "address" and
        // "delivery_postal_code". i don't know why the fuck we even have delivery_address
        // sending to the server????
        if(this.typeName === 'delivery') {
          // ok on merged project this isn't necessary? on taxjar it's delivery_postal_code but
          // on merged-project the delivery zip just uses postal_code.
          // manually merged this related code in so now uncommented.
          this.addressModel.zip = !this.settings.cart.hideDeliveryZipcode ? this.addressModel.delivery_postal_code : '0';
          this.addressModel.postal_code = !this.settings.cart.hideDeliveryZipcode ? this.addressModel.delivery_postal_code : '0';
        }

        let ob = {
          type: this.typeName,
          member: this.memberInfo, // first_name, last_name, telephone, email
          address: this.addressModel, // address, address2, city, state, zip, country
          pickup_payment_option: this.pickupPaymentOption,
          isGuestCheckout: this.isGuestCheckout,
          optInForRegister: this.optInForRegister,
          isSameBillingAddress: this.isSameBillingAddress,
          billing: this.billingAddress,
          ...otherProps
        };
        if(this.deliveryDate)
          ob.delivery_date = this.deliveryDate;

        if(this.customInfo.order_notes != '') {
          ob.order_notes = this.customInfo.order_notes;
        }
        if(this.recurringOrder) {
          ob.recurring_order = this.recurringOrder;
        }

        ob.custom_shipping = this.selectedShippingQuote;
        var _self = this;
        return await OrderApiService.submitCustomerOrder(ob).then(res => {
          if(_self.$refs.paymentModule) {
            _self.$refs.paymentModule.updateCard();
          }
          if(res.data.status == 'error') {
            if(_self.$refs.paymentModule) {
              _self.$refs.paymentModule.cardError = res.data.message;
            } 
            _self.$swal(res.data.message, '', 'error');
            _self.isSubmitting = false;
            return;
          }
          if(res.data.order) {
            let response = JSON.parse(JSON.stringify(res)); // copy of response to return in case of paypal checkout
            const stripeCheckoutUrl = res.data.order.stripe_checkout_url || null;
            res.data.loginKeep = false;
            res.data.order = {}; // pointless to have this in auth data
            if(!_self.isGuestCheckout || (_self.isGuestCheckout && _self.optInForRegister)){
            // Manually pushing address (I f*** hate this!)
              res.data.data.customer.customer_addresses = [_self.addressModel];
              AuthController.login(res.data);
            }
            if(ob.provider === 'stripe_checkout' && stripeCheckoutUrl) {
              // take user to stripe checkout workflow
              window.location = stripeCheckoutUrl;
              return;
            } 
            if(ob.isPayPalCheckout && _self.paypalCheckout) {
              _self.captureOrAuthPayment(response.data.order.id);                         
              return response;
            }           
            _self.clearCartInfo();
            _self.isOrderSubmitted = true;
          }
        }).catch(err => {
          this.isSubmitting = false;
          if(this.$refs.paymentModule) {
            this.$refs.paymentModule.updateCard();
          }
          this.$refs.cartMember.showErrors(err.response.data.errors);
        });
      },
      captureOrAuthPayment(orderId){
          let _self = this;
          OrderApiService.authOrCapturePaypal({
            paypal_order_id: _self.paypalCheckoutOrder.id,
            business_slug: _self.$store.state.business_slug,
            order_id: orderId
          }).then(async resp => {
            _self.clearCartInfo();
            _self.isOrderSubmitted = true;           
            _self.$store.commit('setPaypalCheckoutOrder', null);
          });
      },
      clearCartInfo() {
        // reset cart step
        this.goToStep(1);
        this.$store.commit('setCartItems', {});        
        this.$store.commit('setCartTotals', 0);        
        // this.memberInfo = {};
        this.isSubmitting = false;
        if(this.$refs.cartMember) {
          this.$refs.cartMember.clearFields();
        }
        if(this.$refs.memberDelivery) {
          this.$refs.memberDelivery.clearFields();
        }
        if(this.$refs.memberShipping) {
          this.$refs.memberShipping.clearFields();
        }
        if(localStorage.getItem('cartStep')){
          localStorage.removeItem("cartStep");
        }
        if(localStorage.getItem('deliveryDate')){
          localStorage.removeItem("deliveryDate");
        }
        // if(localStorage.getItem('memberInfo')){
        //   localStorage.removeItem("memberInfo");
        // }
        if(localStorage.getItem('addressModel')){
          localStorage.removeItem("addressModel");
        }
      },
      async calculateTaxes() {
        let done = false;
        //const verify = ['address','city','state','postal_code'];
        const verify = ['address', 'postal_code'];
        if(this.typeName === 'delivery') {
          this.addressModel.postal_code = this.addressModel.delivery_postal_code;
        }
        for(let i = 0; i < verify.length; i++) {
          if(!this.addressModel[verify[i]]) {
            this.$swal(`Please input your ${verify[i].replace(/_/g, ' ')}`, '', 'error');
            return done;
          }
        }
        await CartApiService.calculateTaxes(this.addressModel, this.typeName).then((res) => {
          if(res.data.status === 'success') {
            const oldTax = parseFloat(this.cart.tax);
            this.cart.tax = res.data.tax;
            const diff = res.data.tax - oldTax;
            const delivery = parseFloat(this.cart.total_with_delivery) + diff;
            const shipping = parseFloat(this.cart.total_with_shipping) + diff;
            const pickup = parseFloat(this.cart.total_with_pickup) + diff;
            //console.log('nan checks', oldTax, this.cart.tax, delivery, shipping, pickup);
            // can't figure out how these can be NaN, saw it once then could never reproduce. so just don't touch it
            // if it's nan.
            // think i figured it out but leaving it here anyway. total_with_x were strings.
            if(!isNaN(delivery)) {
                this.cart.total_with_delivery = delivery;
            }
            if(!isNaN(shipping)) {
                this.cart.total_with_shipping = shipping;
            }
            if(!isNaN(pickup)) {
                this.cart.total_with_pickup = pickup;
            }
            this.cart.total = res.data.total;
            done = true;
          } else {
            this.$swal(res.data.message, '', 'error');            
          }
        }).catch((err) => {
          this.$swal('Failed to calculate taxes. Please check your address.', '', 'error');
        });
        return done;
      },
      handlePostalCodeChange() {
        if(this.typeName !== 'delivery' || !this.deliveryPromoEnabled || !this.cart.coupons) {
          return;
        }
        if(this.typeName === 'delivery') {
          this.addressModel.postal_code = this.addressModel.delivery_postal_code;
        }
        
        CartApiService.assignAddress(this.addressModel, this.typeName).then((res) => {
          if(res.data.status === 'success') {
            this.$store.dispatch('fetchCartItemsDetails');
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      async validateRedeemedCoupons() {
        let couponsValidation = await OrderApiService.verifyCouponsQualifications();
        if(couponsValidation.data.errors && couponsValidation.data.errors.length > 0) {
          let mssg = ['Some of the coupons in your cart could not be applied.'];
          couponsValidation.data.errors.forEach(error => {
            mssg.push(`Promo ${error.title} requires ${error.reason}`);
          });

          let result = await this.$swal({
            title: 'Coupon Error!',
            html: mssg.join('<br/>'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Remove Coupons!',
            cancelButtonText: 'Continue Shopping',
          });
          return result.value ? true : false;
        } else {
          return true;
        }
      },
      to24hr(h) {
        if(h == '12 PM') return '12';
        if(h == '12 AM') return '0';
        if(h.indexOf(' AM') > 0)
          return h.replace(' AM', '');
        else if(h.indexOf(' PM') > 0)
          return String(Number(h.replace(' PM', '')) + 12);
        return h;
      },
      to12hr(h) {
        if(h == '12') return '12 PM';
        if(h == '0' || h == '00') return '12 AM';
        if(Number(h) > 12) {
          h = `${String(Number(h) - 12)} PM`;
        } else {
          h = `${h} AM`;
        }
        return h;
      },
      onDeliveryDateInput(a) {
        this.clearAddressError('deliveryDate');
        let date = a.split(' ')[0];
        let time = `${a.split(' ')[1]}`;
        let now = new Date(Date.now()).getHours();
        if(this.deliveryDate.split(' ')[0] == this.minDate && time <= now) {
          this.deliveryDate = `${date} ${this.to12hr(now + 1).toLowerCase()}`;
        }
        if(this.enabledHours) {
          if(this.enabledHours.indexOf(time) == -1)
            this.deliveryDate = `${date} ${this.to12hr(this.enabledHours[0]).toLowerCase()}`;
        }
      },
      tryInitialModal() {
        if(this.settings.cart.cartModal)
				this.$swal({
					title: this.settings.cart.cartModal.title || '',
					html: this.settings.cart.cartModal.body || '',
					type: this.settings.cart.cartModal.type || 'info',
          showCloseButton: true,
          showConfirmButton: false,
          customClass: {
            content: 'mb-3'
          }
        });
      },
      validateAddressState(isShippingAddress = false,clearBillingAddressError = false) {
        if(clearBillingAddressError) {
          this.clearBillingAddressError('state');          
        } else {
          this.clearAddressError('state');
        }
        if(this.typeName === 'shipping') {
          if(this.settings.cart.restrictedStatesForShipping && Array.isArray(this.settings.cart.restrictedStatesForShipping)) {
            if(this.settings.cart.restrictedStatesForShipping.includes(this.addressModel.state)) {
              this.addressModel.state = '';
              const errorMessage = this.settings.cart.restrictedStatesMessage || 'Shipping is currently not available for this state';
              this.$swal(errorMessage, '', 'error');
            }
          }
          this.onAddressChange(null, isShippingAddress);
        }
      },
      clearAddressError(index){
        this.addressErrors[index] = null;
      },
      clearBillingAddressError(index){
        this.billingAddressErrors[index] = null;
      },
      handleRecurringOrderDetails(details) {
        this.recurringOrder = details;
      },
      setCountry() {
        // In case the stors's country is not USA and that country is also available in additional countries, then set that country as default
        try {
          const storeCountry = this.businessDetails.business_country;
          const countries = this.settings.cart.additionalCountries || {};
          if(storeCountry && !['US', 'USA'].includes(storeCountry) && Object.keys(countries).includes(storeCountry)) {
            this.addressModel.country = storeCountry;
          }
        } catch(err) {
          // do nothing
        }
      }
    },
    watch: {
      couponRemovedMessage (newMessage) {
        if(newMessage && newMessage != '') {
          this.$swal(newMessage, '', 'error');
        }
      },
      cart(newCart) {
        if(newCart.tvr_number) {
          this.customInfo.tvr_number = newCart.tvr_number;
        }
        this.hasTvrNumber = this.isTVRValid;
        this.afterCartLoaded();
      },
      'customInfo.tvr_number': function() {
        //console.log('TVR: ' + newNumber);
      },
      cartTotals(){
        // update paypal order details in any change in cart totals 
        if(this.$refs.paypalCheckout) {
          this.$refs.paypalCheckout.orderUpdate();
        }
        if(this.$refs.paypalCheckoutStep3) {
          this.$refs.paypalCheckoutStep3.orderUpdate();
        }
      },
      addressModel: {
        deep: true,
        handler: function (newValue, oldValue) {
          this.$store.state.cartShippingAddressValidated = false;
          this.shippingAddressChanged = true;
          this.$store.commit('setCartShippingQuotes', []);
          localStorage.setItem("addressModel",JSON.stringify(newValue));
        }
      },
      step(newVal){
        localStorage.setItem("cartStep",newVal);
        this.isSubmitting = false;
      },
      deliveryDate(newVal){
        localStorage.setItem("deliveryDate",newVal);
      },
      isSameBillingAddress(newVal){
        this.billingAddressErrors = {};
      },
      enabledTabs(){
        this.setActiveTab();
      }
    }
  };
</script>


<style lang="scss" scoped>
.cart-items {
  :deep(.cart) {
    &:nth-child(2) {
      .card {
        border-top: none !important;
      }
    }
  }
}
:deep(.time-picker) {
  .time-picker-column-hours {
    .time-picker-column-item {
      overflow: hidden;
      position: relative;
      text-indent: -999px;
      &::before { position: absolute; text-indent: 0; }
      &.active::before {
        color: #fff;
        z-index: 2;
      }
      &.disabled::before {
        opacity: .3;
      }
      &:nth-of-type(1)::before { content:'12am'}
      &:nth-of-type(2)::before { content:'1am'}
      &:nth-of-type(3)::before { content:'2am'}
      &:nth-of-type(4)::before { content:'3am'}
      &:nth-of-type(5)::before { content:'4am'}
      &:nth-of-type(6)::before { content:'5am'}
      &:nth-of-type(7)::before { content:'6am'}
      &:nth-of-type(8)::before { content:'7am'}
      &:nth-of-type(9)::before { content:'8am'}
      &:nth-of-type(10)::before { content:'9am'}
      &:nth-of-type(11)::before { content:'10am'}
      &:nth-of-type(12)::before { content:'11am'}
      &:nth-of-type(13)::before { content:'12pm'}
      &:nth-of-type(14)::before { content:'1pm'}
      &:nth-of-type(15)::before { content:'2pm'}
      &:nth-of-type(16)::before { content:'3pm'}
      &:nth-of-type(17)::before { content:'4pm'}
      &:nth-of-type(18)::before { content:'5pm'}
      &:nth-of-type(19)::before { content:'6pm'}
      &:nth-of-type(20)::before { content:'7pm'}
      &:nth-of-type(21)::before { content:'8pm'}
      &:nth-of-type(22)::before { content:'9pm'}
      &:nth-of-type(23)::before { content:'10pm'}
      &:nth-of-type(24)::before { content:'11pm'}
    }
  }
    .time-picker-column-minutes{
      display: none !important;
    }
  }
  
  .StripeElement {
    height: 42px;
    color: var(--text);
    border: 1px solid #E8E8E8;
    border-radius: .25rem;
    padding: 12px 12px;
  }

  div.card-error {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
    font-size: 14px;
    position: relative;
    padding: .75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: .25rem;
    margin-top: 10px;
  }

  .c-card-img {
    border-radius: 5px;
  }

  .success-box {
    max-width: 550px;
    padding: 50px 0 100px;
    .img-suc {
      font-size: 16px;
      font-weight: normal;
      b {
        font-size: 18px;
      }
      h5 {
        font-size: 23px;
        line-height: 27px;
        text-align: center;
        color: #2F3540;
      }
      p {
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        color: #2F3540;
        margin-bottom: 24px;
      }
    }
  }
  .invalid-feedback a {
    text-decoration: underline;
  }

  .was-validated .form-control:invalid,
  .form-control.is-invalid {
    border-color: #C74918;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23C74918' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23C74918' stroke='none'/%3e%3c/svg%3e");
  }
  .login-link,.checkout-btn{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .w-300px{
    width: 300px;
  }

  @media (min-width: 475px) {
    .mobile-only{
      display: none !important;
    }
  }

  @media (max-width: 475px) {
    .btn{
      font-size: 12px;
      padding: 9px 15px;
      height: 33px;
    }
    .login-link,.checkout-btn{
      font-weight: 700;
      font-size: 12px;
      line-height: 15px;
      letter-spacing: 0.5px;
      text-transform: uppercase;      
    }
    .hide-on-mobile{
      display: none !important;
    }
    .w-300px{
      width: 100%;
    }
    :deep(.datetimepicker:not(.inline)) {
       .datepicker {
        top: unset !important;
        left: unset !important;
        right: unset !important;
        width: 80vw !important;
        height: auto !important;
        min-width: unset !important;
        max-width: unset !important;
        position: absolute;
      }
    }
  }

  .radio-list{
    list-style: none;
    li{
      padding-left: 25px;
      padding-top: 1px;
      position: relative;
      &::before{
        content: '';
        display: flex;
        width: 17px;
        height: 17px;
        border: 5px solid var(--primary);
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: calc(50% - 9px);
      }
    }
  }
  .ft-16{
    font-size: 16px;
  }
  
</style>
