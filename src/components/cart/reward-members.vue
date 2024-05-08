<template>
  <div class="card p-3 p-md-4 mb-3">
    <div class="card-body">
      <div class="card-title"><small class="font-weight-bold">Rooster Rewards Loyalty Customers</small></div>
      <div class="small">
        <label for="loyality_lookup_field">If you have an Agway card, or know that you have a rewards account with us (if even if you’re not sure) provide your Agway card number, or how we normally look you up.</label>
        <input v-model="customInfo.loyality_lookup_field" type="text" class="form-control p-2 mt-2" placeholder="Card#, Last Name, First Name, Phone Number">
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'RewardMembers',
    props: {
      customInfo: {
        default: { loyality_lookup_field: '' }
      }
    },
  };
</script>

