<template>
  <div class="bg-white container d-flex justify-content-center align-items-center">
    <div class="text-center">
      <h2 class="font-weight-bold">You do not have permission to view this page</h2>
      <h4 class="text-muted">Please speak with your system administrator to unlock this setting</h4>
      <button v-if="showContact" v-b-modal.upgrade-modal class="btn btn-primary" type="button">Contact Me For More Info</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'NoPermission',
  props: {
    showContact: {
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 600px;
}
</style>
