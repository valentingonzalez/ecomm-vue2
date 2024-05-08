<template>
  <div class="bg-white">
    <div v-if="page" class="settings-header">
      <div class="settings-header-info">
        <div class="d-flex align-items-center">
          <h1>{{ page }}</h1>
          <svg class="ml-2" width="12px" height="14px" viewBox="0 0 12 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="Lock" transform="translate(1.000000, 1.000000)" stroke="#000000" stroke-width="1.33333333"><g id="lock"><rect id="Rectangle" fill="#000000" x="0" y="5" width="10" height="7.33333333" rx="1.33333333"></rect><path d="M1.66666667,6 L1.66666667,3.33333333 C1.66666667,1.49238417 3.15905083,0 5,0 C6.84094917,0 8.33333333,1.49238417 8.33333333,3.33333333 L8.33333333,6" id="Path"></path></g></g></g></svg>
        </div>
      </div>
    </div>
    <div class="settings-body">
      <svg v-if="!page" class="lock-big" width="12px" height="14px" viewBox="0 0 12 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="Lock" transform="translate(1.000000, 1.000000)" stroke="#000000" stroke-width="1.33333333"><g id="lock"><rect id="Rectangle" fill="#000000" x="0" y="5" width="10" height="7.33333333" rx="1.33333333"></rect><path d="M1.66666667,6 L1.66666667,3.33333333 C1.66666667,1.49238417 3.15905083,0 5,0 C6.84094917,0 8.33333333,1.49238417 8.33333333,3.33333333 L8.33333333,6" id="Path"></path></g></g></g></svg>
      <div class="video-box">
        <video v-if="mainVideo" controls :poster="mainVideo.cover">
          <source :src="mainVideo.link" type="video/mp4">
        </video>
        <div>
          <b>Upgrade to the EZ-Commerce <span>PLUS</span> To Take Advantage Of This Feature!</b>
          <button v-b-modal.upgrade-modal class="btn btn-primary" type="button">Contact Me For More Info</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TutorialVideos from '@/assets/tutorials.json';

export default {
  name: 'NoPermissionTruevalue',
  data() {
    return {
      videos: []
    };
  },
  props: ['page'],
  mounted() {
    this.videos = TutorialVideos;
  },
  computed: {
    mainVideo() {
      return this.videos.find(video => video.page === this.$route.name);
    }
  }
};
</script>

<style lang="scss" scoped>
  .video-box {
    video {
      width: 100%;
      border-radius: 6px 6px 0 0;

      + div {
        border: 1px solid #EAEAEB;
        border-top: none;
        padding-top: 8px;
      }
    }

    > div {
      padding: 16px;
      display: flex;
      align-items: center;
      flex-direction: column;
      text-align: center;

      b {
        font-size: 1.125rem;
        margin-bottom: 8px;

        span {
          color: #DEA839;
        }
      }
    }
  }

  .lock-big {
    width: 24px;
    height: auto;
    margin: 0 auto;
    display: block;
  }
</style>
