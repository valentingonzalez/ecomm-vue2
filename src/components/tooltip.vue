<template>
    <div class="custom-tooltip">{{ text }}</div>
</template>

<script>
    export default {
        name: 'Tooltip',
        props: ['text']
    };
</script>

<style lang="scss">
    .custom-tooltip {
        opacity: 0;
        position: absolute;
        bottom: 100%;
        left: 50%;
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 2px 8px;
        border-radius: .25rem;
        transition: 200ms;
        white-space: nowrap;
        visibility: hidden;
        font-size: 0.875rem;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
    }

    * {
        &:hover > .custom-tooltip {
            opacity: 1;
            visibility: visible;
        }
    }
</style>