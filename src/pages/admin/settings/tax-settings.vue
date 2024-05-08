<template>
  <div class="bg-white  h-100">
    <div class="px-md-5 d-flex pt-md-4 pb-3 mb-3 border-bottom justify-content-between align-items-center heading">
      <h1 class="h4 mb-0">Tax Settings</h1>
    </div>
    <div class="px-5 pb-5 mt-4 store-box">
      <h2 class="h3 mb-4">Choose one of the following Tax options</h2>
      <div class="row align-items-stretch mb-5">
        <div class="col-lg-4 mb-3 mb-lg-0 pr-lg-1">
          <div class="card h-100" @click="selectTax(1)" :class="{'selected': (selected == 1)}">
            <div class="card-body text-center px-3">
              <b>Excluding Tax</b>
              <p class="small mt-1">Tax is added in checkout.</p>
              <p class="small">
                Example: The price of a product is displayed in the cart as $100. 
                The price of tax is added to the total in checkout ($100 + $20 = $120).
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 mb-3 mb-lg-0 px-lg-1">
          <div class="card h-100" @click="selectTax(2)" :class="{'selected': (selected == 2)}">
            <div class="card-body text-center px-3">
              <b>Including tax automatically</b>
              <p class="small mt-1">Including tax in the product price by computer automation.</p>
              <p class="small">
                Example: The price of a product in your POS System is $100, and tax will be automatically 
                added to the product price. With $20 of tax, $120 will be the price shown for the product 
                on the website. There will be no tax added in the checkout.
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 pl-lg-1">
          <div class="card h-100" @click="selectTax(3)" :class="{'selected': (selected == 3)}">
            <div class="card-body text-center px-3">
              <b>Including tax manually</b>
              <p class="small mt-1">Product prices include tax in the POS System.</p>
              <p class="small">
                Example: The original price of a product is $100 but you manually enter the price as $120 
                through your POS System to include $20 of tax. The price of the product on the website will 
                be $120. There will be no tax added by the website.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 class="border-top border-gray py-4">Set Tax Percentage</h2>
      <div class="d-flex mb-3 align-items-start align-items-sm-center flex-column flex-sm-row">
        <div class="input-group" style="width: 150px;">
          <input type="number" max="100" class="form-control" placeholder="Tax" v-model="tax" @input="updateValue">
          <div class="input-group-append">
            <span class="input-group-text">%</span>
          </div>
        </div>
        <div class="ml-sm-5 mt-3 mt-sm-0">A product priced at <b>${{ example }}</b> will have <b>${{ tax | toDollar(example) }}</b> of tax</div>
      </div>
    </div>
  </div>
</template>

<script>
  
  export default {
    name: 'TaxSettings',
    data() {
      return {
        selected: 1,
        tax: 5,
        example: 50
      };
    },
    filters: {
      toDollar: function(value, example) {
        return (value * example) / 100;
      }
    },
    methods: {
      selectTax(val) {
        this.selected = val;
      },
      updateValue(evt) {
        const value = evt.target.value;
          this.tax = value > 100 ? 100 : value;
      }
    }
  };
</script>

<style lang="scss" scoped>
  
  
  .card {
    cursor: pointer;
    .small:first-of-type {
      height: 35px;   
    }
    .small + .small {
      font-size: 75%;
    }
    &.selected {
      border: 1px solid #2c9911;
      box-shadow: 0 0 0 2px #2c9911 !important;
      cursor: default;
    }
  }
</style>
