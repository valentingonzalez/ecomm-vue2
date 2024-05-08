<template >
  <div :class="outerClass">
    <div :class="innerClass" :key="field.name" v-for="field in customFields">
      <label :for="field.name">
        {{ field.label }}
        <span v-if="requiredStarShow && field.required" class="text-danger">*</span>
      </label>

      <input v-if="field.type == 'text' || field.type == 'time'"
        :id="field.name"
        v-model="inputFields[field.name]"
        :type="field.type"
        class="form-control"
        :required="field.required"
        :placeholder="field.placeholder || ''"
      />

      <b-form-checkbox v-if="field.type == 'checkbox'"
        :id="field.name"
        v-model="inputFields[field.name]" switch>
        <b>{{ inputFields[field.name] ? 'Yes' : 'No' }}</b>
      </b-form-checkbox>

      <b-form-select v-if="field.type == 'select'"
        :id="field.name"
        v-model="inputFields[field.name]"
        :options="field.options"
        :required="field.required"
        class="form-control">
        <template v-slot:first>
          <b-form-select-option :value="null" disabled>Please select an option</b-form-select-option>
        </template>
      </b-form-select>

      <b-form-datepicker
        v-if="field.type == 'date'"
        :id="field.name"
        v-model="inputFields[field.name]"
        :required="field.required"
        class="form-control">
      </b-form-datepicker>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomInputFields',
  props: {
    customFields: {
      type: Array,
      default: () => []
    },
    customInfo: {
      type: Object
    },
    requiredStarShow: {
      type: Boolean,
      default: false
    },
    outerClass: {
      type: String
    },
    innerClass: {
      type: String
    }
  },
  computed: {
    inputFields: {
      get() {
        return this.customInfo;
      },
      set(value) {
        this.$emit('update:customInfo', value);
      }
    }
  },
};

</script>

