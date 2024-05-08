<template>
    <b-modal size="sm" ref="imageAltModal" title="Alt Tag" @shown="setValues" @hidden="saveAltChange">
        <input type="text" class="form-control" placeholder="Enter an alt value for the image" v-model="alt_tag">
    </b-modal>
</template>

<script>

export default {
    name: 'ImageAltModal',
    props: {
        productImageAlt: {
            type: String,
            default: null
        },
        index: {
            type: Number,
            default: null
        }
    },
    data () {
        return {
            loading: false,
            alt_tag: null
        };
    },
    methods: {
        showModal() {
            this.$refs.imageAltModal.show();
        },
        hideModal() {
            this.$refs.imageAltModal.hide();
        },
        removeMainImg() {
            this.$emit('altModalHidden');
        },
        saveAltChange() {
            this.$emit('altChanged', {alt_tag: this.alt_tag, index: this.index});
        },
        setValues() {
            this.alt_tag = this.productImageAlt;
        }
    }
};
</script>