<template>
  <div>
    <input type="color" v-model="localColor" @change="updateColor" />
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#ffffff'
    }
  },
  data() {
    return {
      localColor: this.color
    };
  },
  watch: {
    color(newColor) {
      this.localColor = newColor;
    }
  },
  methods: {
    updateColor(event) {
      this.$emit('update-color', event.target.value);
    }
  }
};
</script>

<style scoped>
  .color-box {
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    cursor: pointer;
    box-shadow: 2px 2px 8px 0px rgba(0,0,0,0.62);
  }
</style>
