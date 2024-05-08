<template>
  <div :class="['editor', disabled ? 'disabled': '']">
    <editor-menu-bar editable="false" :editor="editor" v-slot="{ commands, isActive }">
      <div class="menubar">

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <VueIcon name="bold" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <VueIcon name="italic" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <VueIcon name="strike" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <VueIcon name="underline" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.code() }"
          @click="commands.code"
        >
          <VueIcon name="code" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.paragraph() }"
          @click="commands.paragraph"
        >
          <VueIcon name="paragraph" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 4 }) }"
          @click="commands.heading({ level: 4 })"
        >
          H4
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <VueIcon name="ul" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <VueIcon name="ol" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <VueIcon name="quote" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.code_block() }"
          @click="commands.code_block"
        >
          <VueIcon name="code" />
        </button>

        <button
          class="menubar__button"
          @click="commands.horizontal_rule"
        >
          <VueIcon name="hr" />
        </button>

        <button
          class="menubar__button"
          @click="commands.undo"
        >
          <VueIcon name="undo" />
        </button>

        <button
          class="menubar__button"
          @click="commands.redo"
        >
          <VueIcon name="redo" />
        </button>

      </div>
    </editor-menu-bar>
    <editor-content class="editor__content" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions';

export default {
  props: [
    'value',
    'disabled'
  ],
  components: {
    EditorContent,
    EditorMenuBar,
  },
  data() {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3, 4] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
        ],
        editable: !this.disabled,
        onUpdate: ({ getHTML }) => {
          this.$emit('input', getHTML());
        }
      }),
    };
  },
  mounted() {
    this.editor.setContent(this.value);
    let unwatch = this.$watch('value', function(newValue) {
      this.editor.setContent(newValue, true);
      unwatch();
    });
  },
  beforeDestroy() {
    this.editor.destroy();
  }
};
</script>
<style scoped lang="scss">
  .menubar {
    border: 1px solid #ccc;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    .menubar__button {
      font-weight: 700;
      display: -webkit-inline-box;
      display: -ms-inline-flexbox;
      display: inline-flex;
      background: transparent;
      border: 0;
      color: #000;
      padding: .2rem .7rem;
      cursor: pointer;
      &:not(:last-child) {
        border-right: 1px solid #ccc;
      }
    }
  }
  .editor__content {
    padding: 20px;
    border: 1px solid #ccc;
    border-top: none;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
  .disabled {
    pointer-events: none;
    opacity: .6;
    cursor: default;
  }
</style>