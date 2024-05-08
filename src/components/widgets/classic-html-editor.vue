<template>
  <div>
    <section class="htmleditor widget" :class="{'editable': editable}" v-if="editable">
      <WidgetHeader name="Classic HTML Editor" :id="id" @remove="remove" @updateHidden="updateHidden" :hidden="hidden" :master="master" @updateAssociatedLocations="updateAssociatedLocations" :associatedLocations="associatedLocations" v-if="editable" />
      <div class="mt-3">
        <HtmlEditor v-model="intBody" @input="updateBody" />
      </div>
    </section>
    <div v-if="body && !editable" v-html="body"></div>
  </div>
</template>
<script>

import { debounce } from 'debounce';
export default {
  name: 'ClassicHtmlEditor',
  props: {
    id: {
      default: null
    },
    editable: {
      default: false
    },
    body: {
      default: ''
    },
    hidden: {
      default: true
    },
    master: {
      default: false
    },
    page: {
      default: null
    },
    keepBody: {
      default: false
    },
    associatedLocations: {
      default: null
    }
  },
  data() {
    return {
      loading: false,
      intBody: '',
      intData: {}
    };
  },
  created() {
    this.intData = this.data;
    this.intBody = this.body;
    this.intHidden = this.hidden;
  },
  mounted() {
    if(this.keepBody = false) {
      if(this.page && this.page.body != '') {
        this.intBody = this.page.body;
        this.page.body = '';
      }
    }
  },
  methods: {
    remove() {
      this.$emit('remove');
    },
    onChange(data) {
      this.$emit('onChange', data);
    },
    updateHidden(val) {
      this.$emit('updateHidden', val);
    },
    updateAssociatedLocations(val) {
      this.$emit('updateAssociatedLocations', val);
    },
    updateBody: debounce(function() {
      this.$emit('updateBody', this.intBody);
    }, 1000),
  },
};
</script>
