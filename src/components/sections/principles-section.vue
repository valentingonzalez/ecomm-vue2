<template>
    <div class="container mt-4">
    <div v-if="principleItems" class="mb-3 justify-content-between row">
        <div v-for="(t, i) in principleItems" :key="i" class="col-md-4 col-sm-12 mb-2">
          <b-card style="box-shadow: none;" class="custom-card h-100">
            <b-card-title class="text-center custom-title">{{ t.heading }}</b-card-title>
            <b-card-body class="custom-text">{{ t.text }}</b-card-body>
          </b-card>
        </div>
    </div>
    </div>
</template>

<script>
export default {
    name: 'PrincipleSection',
    data() {
        return {
            principleItems: null
        };
    },
    mounted() {
        this.principleItems = this.$store.state.settings.principles;
    }
};
</script>

<style lang="scss">
.custom-card {
    .custom-title {
        color: var(--primary) !important;
    }
    .custom-text {
        color: black;
        // font-weight: bold;
        font-size: 16px;
    }
}
</style>