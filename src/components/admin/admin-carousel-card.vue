<template>
  <b-col lg="6" sm="12">
    <b-card class="hoverable mt-2">
      <div class="overlay-wrap">
        <b-card-img :src="itemData.image" img-height="200px" img-alt="Image" img-top class="mb-1"></b-card-img>
        <svg width="28px" height="27px" viewBox="0 0 24 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Symbols" stroke="none">
              <g id="Group">
                  <g id="drag">
                      <rect id="background" stroke="#EAEAEB" fill="#FFFFFF" x="0.5" y="0.5" width="24" height="23" rx="4"></rect>
                      <path d="M11,15 L11,18 L8,18 L8,15 L11,15 Z M16,15 L16,18 L13,18 L13,15 L16,15 Z M11,10 L11,13 L8,13 L8,10 L11,10 Z M16,10 L16,13 L13,13 L13,10 L16,10 Z M11,5 L11,8 L8,8 L8,5 L11,5 Z M16,5 L16,8 L13,8 L13,5 L16,5 Z" id="drag-icon" fill="red"></path>
                  </g>
              </g>
          </g>
        </svg>
      </div>
      <form>
        <label class="font-weight-bold" for="link">Link</label>
        <input id="link" class="form-control" v-model="currentRedirUrl" type="text" placeholder="Link" required @change="redirUrlChanged" />
      </form>
      <b-row align-h="center" class="pt-4">
        <b-button variant="danger" @click="deleteItem" class="mx-1">Delete</b-button>
      </b-row>
    </b-card>
  </b-col>
</template>

<script>
export default {
  name: 'AdminCarouselCard',
  props: {
    itemData: {
      type: Object,
      default: null
    },
    selectOptions: {
      type: Array,
      default: null
    },
  },
  data() {
    return {
      newRedirUrl: this.itemData.redirect_url,
      newSequence: this.itemData.sequence,
      newImage: this.itemData.image,
    };
  },
  computed: {
    currentSequence: {
      get() {
        return this.itemData.sequence;
      },
      set(newValue) {
        this.newSequence = newValue;
      }
    },
    currentRedirUrl: {
      get() {
        return this.itemData.redirect_url;
      },
      set(newValue) {
        this.newRedirUrl = newValue;
      }
    },
  },
  methods: {
    deleteItem() {
      this.$emit('deleteItem');
    },
    redirUrlChanged() {
      this.$emit('linkChanged', this.newRedirUrl);
    }
  }
};
</script>

<style scoped lang="scss">
.overlay-wrap {
  position: relative;
  display: inline-block;
  transition: transform 150ms ease-in-out;
}

.overlay-wrap img {
  display: block;
  max-width: 100%;
  height: auto;
}

.overlay-wrap svg {
  position: absolute;
  top: 0;
  right: 0;
}

.hoverable:hover {
  cursor: pointer;
}

.card {
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>