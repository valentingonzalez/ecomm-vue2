<template>
  <div class="position-relative widget-builder">
    <div class="handle">
      <svg width="9" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M3 12v3H0v-3h3zm6 0v3H6v-3h3zM3 6v3H0V6h3zm6 0v3H6V6h3zM3 0v3H0V0h3zm6 0v3H6V0h3z" fill="#BCBCBC" fill-rule="evenodd"/></svg>
    </div>
    <ClassicHtmlEditor
      :id="id"
      :body="body"
      :data="data"
      :page="page"
      :editable="true"
      :hidden="hidden"
      :master="master"
      :associatedLocations="associatedLocations"
      @updateHidden="updateHidden"
      @updateBody="updateBody"
      @remove="remove"
      @onChange="onChange"
      @updateAssociatedLocations="updateAssociatedLocations"
    />
  </div>
</template>

<script>
import widgetsApiService from '@/api-services/widgets.service';
import { debounce } from 'debounce';

export default {
  name: 'ClassicHtmlEditorBuilder',
  props: {
    id: {
      default: null
    },
    value: {
      default: null
    },
    master: {
      default: false
    },
    page: {
      default: []
    },
    widget: {
      default: null
    }
  },
  data() {
    return {
      body: '',
      data: {},
      hidden: true,
      associatedLocations: null
    };
  },
  created() {
    let data = this.value ? typeof this.value == 'string' ? JSON.parse(this.value) : this.value : {};
    this.data = data.value || {};
    this.hidden = data.hidden;
    this.body = data.body;
    this.associatedLocations = this.widget.associated_locations || null;
  },
  methods: {
    remove() {
      this.$swal({
        title: 'Remove Classic HTML Editor Widget',
        html: `Are you sure you want to remove the Classic HTML Editor Widget?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          this.$emit('remove', this.id);
        }
      });
    },
    updateBody: debounce(function(value) {
      if(this.body != value) {
        this.body = value;
        this.onChange();
      }
    }, 1000),
    updateHidden(value) {
      if(this.hidden != value) {
        this.hidden = value;
        this.onChange();
      }
    },
    updateAssociatedLocations(value) {
      if(this.associatedLocations != value) {
        this.associatedLocations = value;
        this.onChange();
      }
    },
    async onChange() {
      let ob = {
        id: this.id,
        value: JSON.stringify({ hidden: this.hidden, body: this.body }),
        associated_locations: this.associatedLocations
      };
      await widgetsApiService.update(ob);
      this.$swal({
        toast: true,
        position: 'top',
        type: 'success',
        html: `<div class="ml-2">Widget successfully updated</div>`,
        showConfirmButton: false,
        timer: 3000
      });
    },
  }
};
</script>


