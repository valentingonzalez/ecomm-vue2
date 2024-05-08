<template>
  <b-modal id="lightbox-modal" ref="lightBox" @hidden="modalClosed">
    <template v-if="playing">
      <video-player
        v-if="!youtube"
        :options="playerConfig"
        class="video-player-box"/>

      <youtube
        v-else
        :video-id="youtube"
        :player-vars="youtubeConfig"/>
    </template>

    <div slot="modal-header"/>
    <div slot="modal-footer"/>
  </b-modal>
</template>

<script>
import VueVideoPlayer from 'vue-video-player';
import { playerConfig } from '@/config/modules';

export default {
  name: 'VideoLightbox',
  components: {videoPlayer: VueVideoPlayer},
  data() {
    return {
      playing: false,
      youtube: false,
      youtubeConfig: {
        autoplay: 1
      },
      playerConfig
    };
  },
  methods: {
    changeVideo(video) {
      let url = video.fileUrl;
      this.playerConfig.poster = video.thumbnail;
      this.playerConfig.sources[0].src = url;

      if (url.indexOf('youtube.com') > -1) {
        this.youtube = url.match(/([?&])vi?=([^&#]+)/)[2];
      }
      if (url.indexOf('youtu.be') > -1) {
        this.youtube = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/)[1];
      }

      this.$refs.lightBox.show();
      this.playing = true;
    },
    modalClosed() {
      this.playing = false;
      this.youtube = false;
    }
  }
};
</script>
