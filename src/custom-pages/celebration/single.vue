<template>
  <div>
  </div>
</template>

<script>
  
  export default {
    name: 'BenjaminMooreSingle',
    data() {
      return {
      };
    }
  };
</script>

<style lang="scss" scoped>
.logo {
  max-width: 300px;
}
.paint-card {
  .view-more-bt {
    position: absolute;
    bottom: 15px;
    font-size: 14px;
    left: 50%;
    transform: translateX(-50%);
  }
}
.paint-img {
  max-height: 120px;
  width: auto;
}
.paragraph {
  font-size: 15px;
  line-height: 22px;
  color: #636363;
}
.videoWrapper {
  position: relative;
  // padding-bottom: 56.25%; /* 16:9 */
  // height: 0;
  height: calc((var(--vh, 1vh) * 100) - 130px);
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>