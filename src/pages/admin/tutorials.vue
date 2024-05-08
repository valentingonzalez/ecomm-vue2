<template>
    <main>
        <div class="container">
            <h1 class="font-weight-bold">Help Videos</h1>

            <div class="row mb-0">
                <div class="col-lg-4 col-md-6" v-for="(video, index) in videos" :key="index">
                    <div class="single--video">
                        <video controls :poster="video.cover">
                            <source :src="video.link" type="video/mp4">
                        </video>
                        <h5>{{ video.name }}</h5>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
    import TutorialVideos from '@/assets/tutorials.json';

    export default {
        name: 'AdminTutorials',
        data() {
            return {
                videos: [],
            };
        },
        created() {
            this.getVideos();
        },
        methods: {
            getVideos() {
                this.videos = TutorialVideos;
            }
        }
    };
</script>

<style lang="scss" scoped>
    h1 {
        margin-bottom: 24px;
    }

    .single--video {
        max-width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        video {
            width: 100%;
            border-radius: 6px;
            flex: 1;
            box-shadow: 0 4px 2px rgba(0, 0, 0, 0.1);
            object-fit: cover;
            cursor: pointer;
        }

        h5 {
            text-align: center;
            font-weight: bold;
            margin: 8px 0 24px;
        }
    }
</style>
