<template>
  <div>
    <h1 v-if="showTitle" class="display-4 mb-5 mt-3">Benjamin Moore Color Tools</h1>
    <div class="row">
      <div class="col-4" v-for="color in colorTools" :key="color.name">
        <router-link :to="`/colors/tools/${color.name.toLowerCase().replaceAll(' ', '-')}`" class="d-flex flex-column mb-4 color-tool text-decoration-none" :style="{ background: color.hex }">
          <img :src="color.image" :alt="color.name" />
          <div class="p-4">
            <h4 class="name mb-0">{{ color.name }}</h4>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showTitle: {
      default: true
    }
  },
  data() {
    return {
      colorTools: [
        { id: 1, name: 'Color a Room', hex: '#366161',image: 'https://storage.googleapis.com/content.ezadtv.com/2023/08/02/64cab41d660d8_image_210.png' },
        { id: 2, name: 'Color Portfolio App', hex: '#293057',image: 'https://storage.googleapis.com/content.ezadtv.com/2023/08/02/64cab42495ecc_image_208.png' },
        { id: 3, name: 'Personal Color Viewer', hex: '#8B3C38',image: 'https://storage.googleapis.com/content.ezadtv.com/2023/08/02/64cab42926c90_image_209.png' }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
  .color-tool {
    overflow: hidden;
    border-radius: 6px;
    .name {
      color: #fff;
    }
  }
</style>