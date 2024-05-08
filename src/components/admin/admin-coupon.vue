<template>
  <div class="card p-3 pt-2 h-100">
    <div class="border-bottom pb-2 mb-2 d-flex justify-content-between align-items-center">
      <div>
        <h4 class="mb-0">{{ couponData.coupon }}</h4>
        <div class="lead">{{ couponData.coupon_widget.name }}</div>
      </div>
      <h5 class="font-weight-bold" v-if="discount">{{ discount }}</h5>
    </div>
    <div class="d-flex flex-column flex-grow-1">
      <div v-if="couponData.cart_minimum">Applies on orders <b>${{ couponData.cart_minimum }}</b> or more</div>
      <div class="d-flex flex-column flex-sm-row">
        <div class="mb-0"><b>Starts:</b> {{ formatDate(couponData.date_start)}}</div>
        <div class="mb-0 ml-sm-2"><b>Ends:</b> {{ formatDate(couponData.date_end)}}</div>
        <a href="javascript:void(0)" class="mb-0 ml-sm-2" @click="openDetails(couponData.id)" v-if="couponData.coupon_availed"><b>Availed:</b> {{ couponData.coupon_availed }}</a>
      </div>
    </div>
    <div class="d-flex flex-column flex-sm-row align-items-stretch mt-md-4">
      <button class="btn btn-primary mb-2 mb-sm-0" @click="editPromo">Edit</button>
      <button class="ml-sm-3 btn btn-outline-primary" @click="deletePromo">Delete</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminCoupon',
  props: {
    couponData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      editablecoupon: {}
    };
  },
  computed: {
    discount() {
      return this.couponData.discount_type == 'percentage' ? `${this.couponData.discount}%` : 
      this.couponData.discount_type == 'flat' ? `$${this.couponData.discount}` : null;
    }
  },
  methods: {
    openDetails(id){
      this.$router.push({ path: `/admin/promo-codes-analytics?coupon=${id}` }).catch(err => console.log(err));                
    },
    formatDate(date) {
      let parts = date.split('-');
      return `${parts[1]}/${parts[2]}/${parts[0]}`;
    },
    editPromo() {
      this.editablecoupon = Object.assign({}, this.couponData); 
      this.$emit('editCoupon', this.editablecoupon);
    },
    deletePromo() {
      this.$emit('deleteCoupon', this.couponData);
    }
  }
};
</script>

<style scoped lang="scss">
  .date {
    font-size: 16px; 
  }
  @media (max-width: 576px) {
    .card-title {
      font-size: 20px;
    }
    h5 {
      font-size: 18px;
    }
    .date {
      font-size: 14px;
    }
  }
</style>