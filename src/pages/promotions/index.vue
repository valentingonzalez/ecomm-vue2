<template>
  <main>
    <div class="container pt-3">      
      <div class="d-flex flex-column mb-4">
        <h1>
          Promotions
          <router-link v-if="isAdmin" :to="`/admin/settings/promo-codes`" class="btn btn-primary btn-xs">
            Edit
          </router-link>
        </h1>
        <p>Discover the joy of savings with our fantastic offers! Act fast, the best deals are waiting!</p>
      </div>
      <div v-if="loading" class="d-flex align-items-center justify-content-center">
        <div class="spinner spinner-border"></div>
      </div>
      <div v-else-if="coupons && coupons.length">
        <div class="row">
          <div v-for="coupon in coupons" :key="coupon.slug" class="col-md-3 my-2 my-lg-3">            
            <router-link :to="`/promotions/single/${coupon.slug}`" class="card h-100 coupon overflow-hidden text-decoration-none">
              <div class="thumb">
                <img class="w-100 h-100" :src="coupon.image" :alt="coupon.name">
              </div>
              <div class="p-3">
                <div class="name h4">
                  {{ coupon.name }}
                </div>
                <div class="description lead" v-html="coupon.description"></div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div v-else>
        No promotions to display
      </div>
    </div>
  </main>
</template>

<script>
import AdminApiService from '@/api-services/admin.service';

export default {
  name: 'Promotions',
  data() {
    return {
      coupons: null,
      loading: false
    };
  },
  computed: {
    isAdmin() {
      return this.$store.state.activeUser && this.$store.state.activeUser.is_admin;
    }
  },
  async mounted() {
    this.loading = true;
    let res = await AdminApiService.getCoupons();
    this.coupons = res.data.data.filter(e => e.image && e.name && e.description);
    this.loading = false;
  },
  methods: {}
};
</script>

<style scoped lang="scss">
  .coupon {
    .thumb {
      height: 268px;
      img {
        object-fit: cover;
      }
    }
    .description {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }
  }
</style>
