<template>
  <section class="widget pb-0 mb-0" :class="{'editable pb-4 mb-4': editable}">
    <WidgetHeader name="Color Grid" :id="id" @remove="remove" @updateHidden="updateHidden" :hidden="hidden" :master="master" @updateAssociatedLocations="updateAssociatedLocations" :associatedLocations="associatedLocations" v-if="editable" />
    <div v-if="editable" class="d-flex mb-3 align-items-center">
      <div class="font-weight-bold mr-3">Grid Type</div>
      <v-select labelTitle="Select a grid" :options="types" v-model="type" style="max-width: 200px" />
    </div>
    <ColorFamilies :small="true" :showTitle="!editable" v-if="type.value == 'families'" />
    <ColorCollection :showTitle="!editable" v-if="type.value == 'collections'" />
    <ColorTools :showTitle="!editable" v-if="type.value == 'tools'" />
  </section>
</template>

<script>
import ColorFamilies from '@/components/benjaminmoore/color-families';
import ColorCollection from '@/components/benjaminmoore/color-collection';
import ColorTools from '@/components/benjaminmoore/color-tools';
import VSelect from '@alfsnd/vue-bootstrap-select';
export default {
  name: 'ColorGrid',
  props: {
    id: {
      default: null
    },
    editable: {
      default: false
    },
    hidden: {
      default: true
    },
    master: {
      default: false
    },
    data: {
      default: null
    },
    associatedLocations: {
      default: null
    }
  },
  components: {
    VSelect,
    ColorFamilies,
    ColorCollection,
    ColorTools
  },
  data() {
    return {
      intHidden: true,
      types: [
        { text: 'Families', value: 'families' },
        { text: 'Collections', value: 'collections' },
        { text: 'Tools', value: 'tools' }
      ],
      type: { text: 'Families', value: 'families' }
    };
  },
  computed: {
    colorFamilies() {
      return this.$store.state.paint.families;
    }
  },
  created() {
    this.intHidden = this.hidden;
  },
  mounted() {
    if(!this.colorFamilies) {
      this.$store.dispatch('setPaint');
    }
    if(this.data) {
      if(this.data.type) {
        this.type = this.data.type;
      }
    }
  },
  methods: {
    remove() {
      this.$emit('remove');
    },
    updateHidden() {
      this.$emit('updateHidden', this.intHidden);
    },
    textColor(hex) {
      return this.$root.$children[0].lightBackground(hex) ? '#131313' : '#D6D6D6';
    },
    updateAssociatedLocations(val) {
      this.$emit('updateAssociatedLocations', val);
    }
  },
  watch: {
    type(val) {
      this.$emit('onChange', { type: val });
    }
  }
};
</script>

<style scoped lang="scss">
.color-block {
  height: 300px;
    .header {
      font-size: 24px;
      height: 84px;
    }
    .grid {
      > div {
        width: 14.28%;
      }
    }
  }
  a:hover {
    text-decoration: none;
  }
  .editable {
    .header {
      font-size: 18px;
      height: 50px;
    }
    .color-block {
      height: 220px;
    }
  }
</style>