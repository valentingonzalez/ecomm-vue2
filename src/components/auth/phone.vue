<template>
  <div>
    <b-alert v-if="!newDesign" :show="true" style="font-size:14px; border-radius:0; border-width:2px">
      A code has been sent to your phone. Please enter it below.
    </b-alert>
    <div class="form-group" :class="{'d-none' : newDesign}">
      <label for="phone">Mobile Number Entered</label>
      <input
        id="phone"
        type="tel"
        :value="phone"
        @input="$emit('update:phone', $event.target.value)"
        class="form-control">
    </div>
    <div class="form-group">
      <label for="code">Verification code</label>
      <input
        id="code"
        type="number"
        :value="code"
        @input="$emit('update:code', $event.target.value)"
        class="form-control"
        placeholder="Enter the 4 digit code">
        <b-alert v-if="newDesign" :show="true" style="font-size: 12px;border-radius: 0px;border-width: 2px;margin: 5px 0 0 0;padding: 0px 5px;">
          A code has been sent to your phone. Please enter it.
        </b-alert>
    </div>    
  </div>
</template>

<script>
export default {
  name: 'AuthWithPhone',
  props: {
    phone: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    newDesign: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/auth.scss';
</style>
