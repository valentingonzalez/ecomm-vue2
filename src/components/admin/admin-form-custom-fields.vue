<template>
  <div>
    <div v-if="customFields.length >0">
      <h5 v-if="is_editable" class="text-center w-100">Custom</h5>
      <h5 v-else class="text-center w-100">Default</h5>
    </div>

    <draggable tag="ul" v-model="customFields" class="list-group" v-bind="dragOptions" @start="drag = true" @end="drag = false">
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <li
          class="list-group-item"
          v-for="(customField, index) in customFields"
          :key="category + '-' + index"
        >
          <div class="d-flex align-items-center">
            <div>
              <i class="fa fa-align-justify" @click="customField.fixed = !customField.fixed" aria-hidden="true"></i>
            </div>
            <div class="flex-grow-1 pl-3">
              <span> {{ customField.label }} </span>
            </div>
            <div v-if="customField.required" class="mr-3">
              <span>Required</span>
            </div>
            <div class="d-flex justify-content-end align-items-center">
              <i v-if="is_editable" class="fa fa-pencil link mr-3" @click="editField(index)" aria-hidden="true"></i>
              <i v-if="is_editable" class="fa fa-times link" @click="removeField(index)" aria-hidden="true"></i>
            </div>
          </div>
        </li>
      </transition-group>

      <div slot="footer" class="btn-group list-group-item" role="group" key="footer">
        <div v-if="showForm" class="border rounded p-2">
          <h6>{{ action | capitalize }} Field</h6>
          <b-form inline class="my-2">
            <b-input id="label" v-model="field.label" class="form-control mr-2" placeholder="Field Name"></b-input>
            <b-form-select v-model="field.type" :options="fieldTypes" style="padding: 10px 15px !important" class="form-control w-25 mr-2 p-2"></b-form-select>
            <b-input id="placeholder" v-model="field.placeholder" v-if="field.type == 'text'" class="form-control mr-2" placeholder="Field Placeholder"></b-input>
            <b-form-checkbox v-model="field.required">Required</b-form-checkbox>
          </b-form>

          <div v-if="field.type == 'select'" class="my-2">
            <h6>Options</h6>
            <div v-for="(option, index) in field.options" :key="index" class="mb-1">
              <span class="mr-3">Option {{ index + 1 }}: {{ option.text }}</span>
              <i class="fa fa-pencil link mr-3" @click="editOption(index)" aria-hidden="true"></i>
              <i class="fa fa-times link" @click="removeOption(index)" aria-hidden="true"></i>
            </div>

            <b-form inline class="my-2">
              <label class="mr-3">{{ optionAction | capitalize }} option</label>
              <b-input id="signup-label" v-model="option.text" class="mr-2" placeholder="Option"></b-input>
              <b-button variant="primary" v-if="optionAction == 'add'" :disabled="option.text == ''" @click="addOption">Add Option</b-button>
              <b-button variant="primary" v-if="optionAction == 'update'" :disabled="option.text == ''" @click="updateOption">Update Option</b-button>
            </b-form>
          </div>

          <button class="btn btn-primary mr-2" v-if="action == 'add'" @click="saveField('signup')">Save Field</button>
          <button class="btn btn-primary mr-2" v-if="action == 'update'" @click="updateField('signup')">Update Field</button>
          <button class="btn btn-default" @click="close('signup')">Cancel</button>
        </div>
        <div v-if="is_editable">
          <button  class="btn btn-primary" v-if="!showForm" @click="showForm = true">Add Field</button>
        </div>
      </div>
    </draggable>
  </div>
</template>


<script>
import draggable from 'vuedraggable';

export default {
  name: 'AdminFormCustomFields',
  components: { draggable },
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    category: {
      type: String,
      default: ""
    },
    is_editable:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
      drag: false,
      editingIndex: 0,
      editingOptionIndex: 0,
      showForm: false,
      option: {value: '', text: ''},
      action: 'add',
      optionAction: 'add',
      fieldTypes: [
        { value: "", text: "Select Field Type", disabled: true },
        { value: "text", text: "Text Field" },
        { value: "select", text: "Dropdown" },
        { value: "checkbox", text: "Checkbox" },
        { value: "date", text: "Datepicker" },
        { value: "time", text: "Timepicker" },
      ],
      field: {
        name: "", label: "", type: "", placeholder: "", required: false, options: []
      }
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },
    customFields: {
      get() {
        return this.fields;
      },
      set(value) {
        this.$emit('update:fields', value);
      }
    }
  },
  methods: {
    validateFieldData() {
      if(this.field.label == "") {
        this.$swal("Please enter field name", '', 'error');
        return false;
      } else if(this.field.type == "") {
        this.$swal("Please enter field type", '', 'error');
        return false;
      }
      return true;
    },
    clearField() {
      this.showForm = false;
      this.action = 'add';
      this.field = { label: "", type: "", placeholder: "", required: false, options: [] };
    },
    normalizeLabel(value) {
      return value.replace(/\s+/g, '_').replace(/[^A-Za-z0-9_]/g, '').toLowerCase();
    },
    saveField() {
      const validation = this.validateFieldData();
      if(validation) {
        this.field.name = this.normalizeLabel(this.field.label);
        var data = {
          field: this.field,
          category: this.category
        };
        this.$emit('addField', data);
        this.clearField();
      }
    },
    editField(index) {
      this.field = Object.assign({}, this.customFields[index]);
      this.showForm = true;
      this.action = 'update';
      this.editingIndex = index;
    },
    updateField() {
      const validation = this.validateFieldData();
      if(validation) {
        this.field.name = this.normalizeLabel(this.field.label);
        var data = {
          field: this.field,
          category: this.category,
          index: this.editingIndex
        };
        this.$emit('updateField', data);
        this.clearField();
      }
    },
    removeField() {
      var data = {
        category: this.category,
        index: this.editingIndex
      };
      this.$emit('removeField', data);
      this.clearField();
    },
    addOption() {
      this.option.value = this.normalizeLabel(this.option.text);
      this.field.options.push(this.option);
      this.option = {value: '', text: ''};
    },
    editOption(index) {
      this.editingOptionIndex = index;
      this.optionAction = 'update';
      this.option = Object.assign({}, this.field.options[index]);
    },
    updateOption() {
      this.option.value = this.normalizeLabel(this.option.text);
      this.field.options[this.editingOptionIndex] = this.option;
      this.option = {value: '', text: ''};
      this.optionAction = 'add';
    },
    removeOption(index) {
      this.field.options.splice(index, 1);
    },
    close() {
      this.clearField();
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  margin-top: 35px;
}

.handle {
  float: left;
  margin: 5px 15px;
}

.close {
  float: right;
  padding-top: 8px;
  padding-bottom: 8px;
}

input {
  display: inline-block;
  width: 50%;
}

.text {
  margin: 15px;
  float: left;
}

.header {
    font-weight: bold;
}

.link {
  cursor: pointer;
}

.list-group-item {
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  margin-bottom: 8px;
  border-radius: 4px;
}

.btn-default {
  background: #f1f1f1;
}
</style>
