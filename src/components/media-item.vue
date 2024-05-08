<template>
  <div class="media-item" :class="{ 'video': video }">
    <div class="image-wrapper">
      <img :alt="video ? media.name : media.title" :src="video ? media.thumbnail : media.image_url">
      <!-- @click="changeVideo(video)" -->
    </div>
    <div class="title">{{ video ? media.name : media.title }}</div>
  </div>
</template>

<script>
export default {
  name: 'MediaItem',
  props: {
    media: {
      type: Object,
      required: true
    },
    video: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
.media-item {
  width: 100%;

  &.video {
    .image-wrapper {
      padding-top: 62.5%;
      border: none;
      cursor: pointer;

      &:after {
        content: '';
        background: url('/icons/play.png') center center no-repeat;
      }

      img {
        object-fit: cover;
      }
    }
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    padding-top: 100%;
    border: 1px solid #eaeaeb;

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      object-fit: contain;
    }
  }

  .title {
    color: var(--text);
    margin-top: 5px;
    margin-bottom: 10px;
    line-height: 16px;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
