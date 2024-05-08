<template>
    <b-modal no-close-on-backdrop :hide-header="true" class="modal-box modal-lg" modal-class="validated_address-con" dialog-class="modal-lg" footer-class="d-flex justify-content-between align-items-center validated_address-footer-box" ref="validatedAddressModal">
  
        <div class="validated_address-box">
          <div class="validated_address-title">
            <h5>
              Matched Address
            </h5>
          </div>
          <div class="validated_address-content-box">
              <div class="validated_address-content d-flex justify-content-start align-items-center" v-for="(value, key) in validatedAddress" v-bind:key="key">
                <template v-if="key != 'additionalCountries'">
                  <span class="content-title">
                    {{ key.replace('_', ' ') }}:
                  </span>
                  <span class="content">
                    {{ value ? value : '-' }}
                  </span>
                </template>
              </div>
          </div>
        </div>
  
        <template slot="modal-footer">
          <button class="btn btn-sm cancel-btn" @click="hideModel">Cancel</button>
          <div class="d-flex justify-content-end">
            <button class="btn btn-sm btn-secondary" @click="$emit('getRates', true, true)">Override</button>
            <button class="btn btn-sm btn-primary ml-3" @click="$emit('getRates', false, true)">
              Keep Original
            </button>
          </div>
        </template>
  
    </b-modal>
  </template>
  
  <script>
  export default {
    name: "validated-address",
    props: ['validatedAddress'],
    data() {
      return {
  
      };
    },
    methods: {
      showModal() {
        this.$refs.validatedAddressModal.show();
      },
      hideModel() {
        this.$refs.validatedAddressModal.hide();
      }
    }
  };
  </script>
  
  <style scoped>
  .text-grey-m2 {
    color: #888a8d!important;
  }
  
  .text-110 {
    font-size: 110%!important;
  }
  .text-blue {
    color: #478fcc!important;
  }
  .font-bolder, .text-600 {
    font-weight: 600!important;
  }
  </style>
  