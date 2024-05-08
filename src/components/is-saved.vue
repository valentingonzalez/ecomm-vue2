<template>
  <div class="is-saved">
    <div class="small d-flex align-items-center" v-if="param">
      <div class="spinner-border spinner-border-sm mr-2" />
      {{ savingText }}
    </div>
    <div class="small" v-else>
      <svg class="mr-1" width="10" height="7" xmlns="http://www.w3.org/2000/svg"><path d="M4.527 6.68a1.215 1.215 0 01-1.643 0L.34 4.293a1.044 1.044 0 010-1.542 1.215 1.215 0 011.642 0l1.516 1.423c.115.107.3.107.415 0L8.018.32a1.215 1.215 0 011.642 0c.218.205.34.482.34.771 0 .29-.122.567-.34.77L4.527 6.68z" fill="#429F21" fill-rule="nonzero"/></svg>
      {{ savedText }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'IsSaved',
  props: {
    param: { default: null },
    toastMessage: { default: 'Saved!' },
    savingText: { default: 'Saving...' },
    savedText: { default: 'Saved' }
  },
  data() {
    return {
    };
  },
  watch: {
    param(val, newVal) {
      if(val == false && newVal == true) {
        this.$swal({
          toast: true,
          position: 'top',
          type: 'success',
          html: `<div class="ml-2">${this.toastMessage}</div>`,
          showConfirmButton: false,
          timer: 3000
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .spinner-border {
    border-color: var(--primary);
    border-right-color: transparent;
  }
</style>

