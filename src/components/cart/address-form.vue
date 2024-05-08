<template>
  <div>
    <h6 class="card-title font-weight-bold">{{ `${type} Address` }}</h6>
    <div class="row">
      <div class="col-sm-6 col-xs-12">
        <label class="form-check-label" for="Addressline1">
          Address line 1
        </label>
        <input :disabled="isSubmitting" id="Addressline1" v-model="addressModel.address" type="text" class="form-control" name="address" placeholder="Address line 1" required />
      </div>
      <div class="col-sm-6 col-xs-12">
        <label class="form-check-label" for="Addressline2">
          Address line 2 (optional)
        </label>
        <input :disabled="isSubmitting" id="Addressline2" v-model="addressModel.address2" type="text" class="form-control" name="address2" placeholder="Address line 2">
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6 col-xs-12">
        <label for="city" class="mb-0 mt-3">City</label>
        <input :disabled="isSubmitting" type="text" v-model="addressModel.city" class="form-control" id="city" name="city" placeholder="City" required />
      </div>
      <div class="col-sm-6 col-xs-12">
        <label for="state" class="mb-0 mt-3">State/Province/Region: </label>
        <select v-if="addressModel.country == 'USA' || !addressModel.country" :disabled="isSubmitting" v-model="addressModel.state" id="state" class="form-control" name="state" required>
          <option v-for="state in this.states" :value="state.shortname" :key="state.shortname">
            {{ state.name }}
          </option>
        </select>
        <input v-else :disabled="isSubmitting" v-model="addressModel.state" type="text" class="form-control" id="state" name="state" placeholder="State">
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6 col-xs-12">
        <label for="inputCountry" class="mb-0 mt-3">Country/Region </label>
        <select :disabled="isSubmitting" v-model="addressModel.country" id="inputCountry" class="form-control" name="country" required>
          <template v-if="$store.state.settings.cart.additionalCountries">
            <option v-for="(country,key) in $store.state.settings.cart.additionalCountries" :key="key" :value="key">{{country}}</option>
          </template>
          <option value="USA" selected>USA</option>
        </select>
      </div>
      <div class="col-sm-6 col-xs-12">
        <label class="mb-0 mt-3" for="AddressZip">Zip</label>
        <input :disabled="isSubmitting" id="AddressZip" v-model="addressModel.postal_code" type="number" class="form-control" name="postal_code" placeholder="ZIP Code" required />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AddressForm',
  props: ['type'],
  data() {
    return {
      addressModel: {
        address: '',
        address2: '',
        city: '',
        country: '',
        state: '',
        postal_code: '',
      }
    };
  }
};
</script>
