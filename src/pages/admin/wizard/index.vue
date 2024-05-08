<template>
  <div class="d-flex align-items-center justify-content-center">
    <div class="wizard mt-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Wizard',
    data() {
      return {
      };
    },
  };
</script>

<style scoped lang="scss">
  .wizard {
    margin-left: auto;
    margin-right: auto;
    //--primary: var(--brandPrimary) !important;
    :deep(.wizard-wrapper) {
      min-height: 556px;
      width: 980px;
    }
  }
</style>
