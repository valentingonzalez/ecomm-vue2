<template>
  <div class="tutorial-sidebar">
    <div v-if="mainVideo" class="main-video">
        <div class="video" @click="openModal(mainVideo)">
            <img :src="mainVideo.cover" :alt="mainVideo.name">
            <b>{{ mainVideo.name }}</b>
        </div>
    </div>
    <div class="videos">
        <div v-for="(video, index) in videos" class="video" :key="index" @click="openModal(video)">
            <img :src="video.cover" :alt="video.name">
            <b>{{ video.name }}</b>
        </div>
    </div>

    <b-modal size="lg" ref="tutorialModal">
        <div slot="modal-header">
            <h4>{{ selectedVideo.name }}</h4>
        </div>
        <video controls :poster="selectedVideo.cover">
            <source :src="selectedVideo.link" type="video/mp4">
        </video>
        <div slot="modal-footer">
            <b-button @click="$refs.tutorialModal.hide()" variant="primary">Done</b-button>
        </div>
    </b-modal>
  </div>
</template>

<script>
import TutorialVideos from '@/assets/tutorials.json';

export default {
  name: 'TutorialSidebar',
  data () {
    return {
        videos: [],
        selectedVideo: {}
    };
  },
  mounted() {
    this.videos = TutorialVideos;
  },
  computed: {
    mainVideo() {
        return this.videos.find(video => video.page === this.$route.name);
    }
  },
  methods: {
    openModal(video) {
        this.selectedVideo = video;

        this.$refs.tutorialModal.show();
    }
  }
};
</script>

<style lang="scss" scoped>
    .modal-body {
        video {
            width: 100%;
        }
    }
    .tutorial-sidebar {
        .main-video,
        .videos {
            padding: 12px;
            background: #FFFFFF;
            border: 1px solid #EAEAEB;
        }

        .main-video {
            box-shadow: 0 4px 2px 0 rgba(0,0,0,0.03);
            margin-bottom: 8px;

            .video {
                margin-bottom: 0;
            }
        }

        .videos {
            display: flex;
            flex-wrap: wrap;
            overflow-y: auto;
            max-height: 140vh;
        }

        .video {
            text-align: center;
            width: 100%;
            margin-bottom: 12px;

            img {
                width: 100%;
                border-radius: 3px;
                margin-bottom: 4px;
                transition: 200ms;
            }

            b {
                font-size: 0.8125rem;
                line-height: 1.2;
                display: block;
            }

            &:hover {
                cursor: pointer;

                img {
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                }
            }
        }
    }

    @media (max-width: 991px) {
        .tutorial-sidebar {
            .videos {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                grid-gap: 16px;
            }
        }
    }

    @media (max-width: 575px) {
        .tutorial-sidebar {
            .videos {
                grid-template-columns: 1fr;
                grid-gap: 4px;
            }
        }
    }
</style>
