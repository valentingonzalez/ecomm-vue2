<template>
  <main class="mt-0">
    <div v-if="loading" class="d-flex align-items-center justify-content-center mt-5">
      <div class="spinner spinner-border"></div>
    </div>
    <div v-else-if="coupon">
      <div class="heading w-100 d-flex align-items-center justify-content-center container-fluid" :style="{ backgroundImage: `url('${coupon.image}')` }">
        <div class="name text-center p-5">
          <h1 class="display-4 mb-0">{{ coupon.name }}</h1>
          <div v-if="false && isBenjaminMoore">
            <router-link to="/colors" type="button" class="btn btn-outline-primary btn-lg font-weight-bold mt-4">
              Explore Colors
            </router-link>
          </div>
        </div>
      </div>
      <div class="container pt-5 mt-3">
        <div class="px-xl-5">
          <h1 class="mb-4">Promotion Details</h1>
          <p class="h4" v-html="coupon.description" style="white-space: break-spaces;"></p>
        </div>
      </div>
    </div>
    <div v-else>
      Promotion not found
    </div>
  </main>
</template>

<script>
import AdminApiService from '@/api-services/admin.service';

export default {
  name: 'Promotions',
  data() {
    return {
      loading: false,
      coupon: null
    };
  },
  computed: {
    isBenjaminMoore() {
      return this.$root.$children[0].isBenjaminMoore;
    },
  },
  async mounted() {
    this.loading = true;
    let res = await AdminApiService.getCoupons();
    this.coupon = res.data.data.find(e => e.slug == this.$route.params.slug);
    this.loading = false;
  },
  methods: {}
};
</script>

<style scoped lang="scss">
  .heading {
    height: 600px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    .name {
      background: rgba(255,255,255,.7);
      max-width: 700px;
    }
  }
</style>
