<template>
  <div class="testimonial card text-center h-100 justify-content-center" :class="{ 'p-2': editable, 'p-4': !editable }">
    <a href="#" class="remove-bt" @click.prevent="removeItem" tabindex="-1" v-if="editable" aria-label="Remove Item">
      <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-8 -7)" fill-rule="nonzero" fill="none"><circle fill="#E2E2E3" cx="15" cy="15" r="15"/><path d="M21 13v8c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2v-8h12zm-3-6c.6 0 1 .4 1 1v2h3v2H8v-2h3V8c0-.6.4-1 1-1zm-1 2h-4v1h4V9z" fill="#90939A"/></g></svg>
    </a>
    <div class="author">
      <template v-if="editable">
        <TextareaAutosize class="input p-3 input-message mb-3" type="text" v-model="message"></TextareaAutosize>
        <input class="input mb-1 text-primary font-weight-bold" type="text" v-model="author" />
        <input class="input small text-muted" type="text" v-model="role" />
      </template>
      <template v-else>
        <div ref="message" class="message" v-html="item.message"></div>
        <div ref="author" class="text-primary font-weight-bold mb-1" v-html="item.author"></div>
        <div ref="role" class="small text-muted" v-html="item.role"></div>
      </template>
    </div>
    <div class="rating">
      <b-form-rating v-if="editable" v-model="rating" variant="warning" inline no-border show-clear/>
      <b-form-rating v-if="!editable && hasRating" readonly v-model="item.rating" ref="rating" variant="warning" inline no-border/>
    </div>
  </div>
</template>

<script>
import { debounce } from 'debounce';

export default {
  name: 'TestimonialItem',
  props: {
    item: {
      default: null
    },
    editable: {
      default: false
    }
  },
  data() {
    return {
      message: '',
      author: '',
      role: '',
      rating: '',
      hasRating: false
    };
  },
  mounted() {
    this.message = this.item.message;
    this.author = this.item.author;
    this.role = this.item.role;
    this.rating = this.item.rating;
    this.hasRating = !this.item.rating ? false : true;
  },
  methods: {
    removeItem() {
      this.$emit('remove', this.item);
    },
    save() {
      if(this.editable) {
        let ob = {
          id: this.item.id,
          message: this.message,
          author: this.author,
          role: this.role,
          rating: this.rating
        };
        this.$emit('onChange', ob);
      }
    },
    onFocus(evt) {
      let cell = evt.target;
      let range, selection;
      if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(cell);
        range.select();
      } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(cell);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  },
  watch: {
    message: debounce(function() {
      this.save();
    }, 500),
    author: debounce(function() {
      this.save();
    }, 500),
    role: debounce(function() {
      this.save();
    }, 500),
    rating: debounce(function() {
      this.save();
    }, 500)
  }
};
</script>

<style scoped lang="scss">
  .input {
    font-size: 16px !important;
    border: 1px dashed #dadada;
    text-align: center;
    width: 100%;
    &:focus {
      border-color: var(--primary);
    }
  }
</style>
