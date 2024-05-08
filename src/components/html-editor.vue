<template>
  <div>
    <yimo-vue-editor @onchange="onDropPanel" ref="yimoEditor" v-model="localValue"></yimo-vue-editor>
  </div>
</template>

<script>

  export default {
    name: 'HtmlEditor',
    props: ['value'],
    data() {
      return {
        localValue: this.value
      };
    },
    mounted() {
    // Assuming the yimo-vue-editor exposes the editor instance
    // Attach focus event listener to the editor's content-editable area
    this.$nextTick(() => {
    const editorContent = this.$refs.yimoEditor.$el;
      if(editorContent) {
        editorContent.addEventListener('focus', this.onFocus);
      }
    });
  },
    methods: {
      onDropPanel() {
      },

      onFocus() {
        this.$emit('editor-focus');
    }
    },
    watch: {
      localValue (newValue) {
        this.$emit('input', newValue);
      },
      value (value) {
        this.localValue = value;
      }
    }
  };
</script>

<style lang="scss" scoped>
  :deep(.wangEditor-container) {
    .wangEditor-menu-container {
      position: sticky;
      top: 0;
    }
    .txt-toolbar .color-item, .wangEditor-drop-panel .color-item {
      width: 23px;
      height: 23px;
      border: 1px solid #ccc;
      margin: 1px;
    }
    .code-textarea {
      max-height: 400px;
    }
    .yimo-vue-editor {
      max-height: 400px;
    }
  }
</style>
