<template>
  <div class="d-flex align-items-center justify-content-center">
    <div class="container brand mt-4">
      <div v-if="$ezHasNoPermission('admin_account') || (!$store.state.businessDetails || !$store.state.businessDetails.paint_enabled)">
        <no-permission />
      </div>
      <router-view v-else></router-view>
    </div>
  </div>
</template>

<script>
  import NoPermission from "@/pages/admin/settings/no-permission";
  export default {
    name: 'BrandIntegrator',
    components: {
      NoPermission
    },
    data() {
      return {
      };
    }
  };
</script>

<style scoped lang="scss">
  .brand {
    margin-left: auto;
    margin-right: auto;
    --primary: var(--truevalue) !important;
    :deep(.wizard-wrapper) {
      min-height: 700px;
    }
  }
</style>
