<template>
  <button  class="filter-item mr-2 mb-1">
    {{ filterVal }}
    <VueIcon name="times" class="ml-1" />
  </button>
</template>

<script>
export default {
  name: "FilterItem",
  props: [
    'filterVal'
  ],
};
</script>

<style lang="scss">
  .filter-item {
    display: inline-block;
    border-radius: 4px;
    font-size: 13px;
    letter-spacing: -.2px;
    background: var(--primary);
    color: white;
    border: none;
    font-weight: bold;
    svg {
      opacity: 0.8;
      width: 8px;
    }
  }
</style>

