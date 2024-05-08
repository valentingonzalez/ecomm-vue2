<template>
  <div v-if="$ezHasNoPermission('manage_promo_codes')">
    <no-permission-truevalue page="Promo Codes"></no-permission-truevalue>
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <div>
          <h1>Promo Codes</h1>
          <a @click="$refs.tutorialModal.show()" class="btn btn-tutorial btn-sm text-medium bg-white btn-action">
            <i class="fa fa-play mr-1"></i>
            Click to Watch Tutorial Video
          </a>
          <b-modal size="lg" ref="tutorialModal">
            <div slot="modal-header">
              <h5>Creating Promo Codes</h5>
            </div>
            <div>
              <video class="w-100" poster="/images/cover-promo-codes.jpg" controls>
                <source src="https://storage.googleapis.com/content.ezadtv.com/2023/12/28/658dc181f36d3_Promo_Codes.mov" type="video/mp4">
              </video>
            </div>
            <div slot="modal-footer">
              <button type="button" class="btn btn-primary" @click="$refs.tutorialModal.hide()">Done</button>
            </div>
          </b-modal>
        </div>
        <div>
          <router-link class="btn btn-outline-primary mr-2 analytics-btn" to="/admin/promo-codes-analytics">
            <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="4" y="11" width="2" height="7" rx="1"/>
              <rect x="8" y="6" width="2" height="12" rx="1"/>
              <rect x="12" y="9" width="2" height="9" rx="1"/>
              <rect x="16" y="3" width="2" height="15" rx="1"/>
            </svg>
            View Analytics
          </router-link>
          <button type="button" class="btn btn-primary" @click="addNewCouponModal">Add Promo</button>
        </div>
      </div>
    </div>

    <div class="settings-body">
      <div v-if="loadingPromos" class="d-flex mt-5 align-items-center justify-content-center">
        <div class="spinner spinner-border"></div>
      </div>

      <div v-else-if="!loadingPromos && currentPromos.length == 0" class="row justify-content-center align-items-center">
        <h3>No Promos to Show</h3>
      </div>

      <div v-else class="row">
        <div v-for="coupon in currentPromos" :key="coupon.id" class="col-md-6 mb-4">
          <admin-coupon :couponData="coupon" @deleteCoupon="deleteCoupon" @editCoupon="editCoupon"/>
        </div>
      </div>

      <add-edit-promo ref="addEditPromo" :currentPromo="currentPromo" :editing="editingPromo" :couponWidgets="couponWidgets" @dataCleared="editingPromo = false;" @updatePromos="refreshPromos" :activePopUp="activePopUp"></add-edit-promo>
    </div>
  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import addEditPromo from '@/components/modals/add-edit-promo';
  import adminCoupon from '@/components/admin/admin-coupon';
  import NoPermissionTruevalue from "./no-permission-truevalue";

  export default {
    name: 'PromoCodes',
    data() {
      return {
        currentPromos: [],
        currentPromo: {},
        editingPromo: false,
        loadingPromos: false,
        couponWidgets: []
      };
    },
    computed: {
      activePopUp() {
        return this.currentPromos.find(e => e.show_as_popup == true) ? this.currentPromos.find(e => e.show_as_popup == true) : {show_as_popup: false};
      }
    },
    validations: {
    },
    async mounted() {
      if (this.$ezHasNoPermission("manage_promo_codes")) return;

      this.loadingPromos = true;
      let coupons = await AdminService.getCouponsAdmin();
      this.currentPromos = coupons.data.data;
      let widgets = await AdminService.getCouponWidgets();
      this.couponWidgets = widgets.data.data;
      this.loadingPromos = false;
    },
    components: {
      addEditPromo,
      adminCoupon,
      NoPermissionTruevalue
    },
    methods: {
      addNewCouponModal: function () {
        this.currentPromo = {};
        this.editingPromo = false;
        this.$refs.addEditPromo.showModal();
      },
      editCoupon(data) {
        this.currentPromo = data;
        this.editingPromo = true;
        this.$refs.addEditPromo.showModal();
      },
      deleteCoupon(data) {
        AdminService.deactivateCoupon({'coupon_slug': data.slug}).then((response) => {
          if (response.status == 200) {
            this.$swal('Promo successfully deleted.', '', 'success');
            this.refreshPromos();
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      refreshPromos() {
        this.loadingPromos = true;
        this.currentPromos = [];
        AdminService.getCoupons().then((response) => {
          this.currentPromos = response.data.data;
          this.loadingPromos = false;
        }).catch(err => {
          console.log(err);
          this.currentPromos = [];
          this.loadingPromos = false;
        });
      }
    },

  };
</script>

<style lang="scss" scoped>
  .analytics-btn{
    svg {
      rect {
        fill: var(--primary);        
      }
    }
  }
</style>
