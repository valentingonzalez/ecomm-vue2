<template>
  <div class="d-flex justify-content-between align-items-center">
    <div class="title flex-grow-1 d-flex align-items-start mb-3">
      <div v-if="ai">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 15 15" fill="none">
          <path d="M2.5 10.25V14.25C2.5 14.5263 2.72375 14.75 3 14.75H4.5V10.25H2.5Z" fill="#CED7DD"/>
          <path d="M12.5 10.25V14.25C12.5 14.5263 12.2763 14.75 12 14.75H10.5V10.25H12.5Z" fill="#CED7DD"/>
          <path d="M4 11.1975C3.88 11.2325 3.755 11.25 3.625 11.25C2.865 11.25 2.25 10.635 2.25 9.875C2.25 9.115 2.865 8.5 3.625 8.5C4.0525 8.5 4.4325 8.6925 4.6825 8.9975L4 11.1975Z" fill="#B3C1C9"/>
          <path d="M10.3175 8.9975C10.5675 8.6925 10.9475 8.5 11.375 8.5C12.135 8.5 12.75 9.115 12.75 9.875C12.75 10.635 12.135 11.25 11.375 11.25C11.245 11.25 11.12 11.2325 11 11.1975L10.3175 8.9975Z" fill="#B3C1C9"/>
          <path d="M2.855 5.25H2.75C2.1975 5.25 1.75 4.8025 1.75 4.25V3.75C1.75 3.1975 2.1975 2.75 2.75 2.75H2.855V5.25Z" fill="#CED7DD"/>
          <path d="M12.145 2.75H12.25C12.8025 2.75 13.25 3.1975 13.25 3.75V4.25C13.25 4.8025 12.8025 5.25 12.25 5.25H12.145V2.75Z" fill="#CED7DD"/>
          <path d="M6.25 7H8.75V8.75H6.25V7Z" fill="#CED7DD"/>
          <path d="M9.5 0.75H5.5C3.98122 0.75 2.75 1.98122 2.75 3.5V4.5C2.75 6.01878 3.98122 7.25 5.5 7.25H9.5C11.0188 7.25 12.25 6.01878 12.25 4.5V3.5C12.25 1.98122 11.0188 0.75 9.5 0.75Z" fill="#E4EAEF"/>
          <path d="M9.5 2.25H5.5C4.5335 2.25 3.75 3.0335 3.75 4C3.75 4.9665 4.5335 5.75 5.5 5.75H9.5C10.4665 5.75 11.25 4.9665 11.25 4C11.25 3.0335 10.4665 2.25 9.5 2.25Z" fill="#122359"/>
          <path d="M6 8.5H9C10.1037 8.5 11 9.39625 11 10.5V14.25C11 14.526 10.776 14.75 10.5 14.75H4.5C4.224 14.75 4 14.526 4 14.25V10.5C4 9.39625 4.89625 8.5 6 8.5Z" fill="#E4EAEF"/>
          <path d="M9.03001 1.9165C9.24276 1.62825 9.49926 1.19025 9.50001 0.75225C9.50051 0.476 9.27626 0.25 9.00001 0.25H5.99976C5.72351 0.25 5.49926 0.476 5.49976 0.75225C5.50051 1.1905 5.75701 1.6285 5.96976 1.9165C6.12601 2.12825 6.37526 2.25 6.63851 2.25H8.36101C8.62426 2.25 8.87376 2.12825 9.03001 1.9165Z" fill="#CED7DD"/>
          <path d="M5.5 4.5C5.77614 4.5 6 4.27614 6 4C6 3.72386 5.77614 3.5 5.5 3.5C5.22386 3.5 5 3.72386 5 4C5 4.27614 5.22386 4.5 5.5 4.5Z" fill="#71FFE4"/>
          <path d="M9.5 4.5C9.77614 4.5 10 4.27614 10 4C10 3.72386 9.77614 3.5 9.5 3.5C9.22386 3.5 9 3.72386 9 4C9 4.27614 9.22386 4.5 9.5 4.5Z" fill="#71FFE4"/>
        </svg>
      </div>
      <div>
        <h4 class="mb-0">{{ name }}</h4>
        <div v-if="ai" class="font-weight-bold text-danger">
          Added by AI Widgets Builder
        </div>
        <div v-else-if="master" class="small font-weight-bold text-warning">
          Added by EZ-AD Representative
        </div>
      </div>
      <div class="edit-buttons ml-3">
        <a href="#" class="remove-bt" @click.prevent="remove" aria-label="Remove">
          <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-8 -7)" fill-rule="nonzero" fill="none"><circle fill="#E2E2E3" cx="15" cy="15" r="15"/><path d="M21 13v8c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2v-8h12zm-3-6c.6 0 1 .4 1 1v2h3v2H8v-2h3V8c0-.6.4-1 1-1zm-1 2h-4v1h4V9z" fill="#90939A"/></g></svg>
        </a>
      </div>
    </div>
    <div class="d-flex flex-column align-items-end border-right border-dark pr-3 mr-3">
      <div class="custom-control custom-switch">
        <input type="checkbox" v-model="loop" class="custom-control-input" :id="`loop-${id}`" @change="updateLoop">
        <label class="custom-control-label" :for="`loop-${id}`">Loop</label>
      </div>
    </div>
    <div class="d-flex flex-column align-items-end">
      <div class="custom-control custom-switch">
        <input type="checkbox" v-model="visible" class="custom-control-input" :id="`hidden-${id}`" @change="updateHidden">
        <label class="custom-control-label" :for="`hidden-${id}`">Visible</label>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'WidgetHeader',
  components: {
  },
  props: {
    id: {
      default: null
    },
    name: {
      default: ''
    },
    hidden: {
      default: false
    },
    loop: {
      default: false
    },
    master: {
      default: false
    },
    associatedLocations: {
      default: null
    },
    ai: {
      default: null
    },
  },
  data() {
    return {
      visible: !this.hidden
    };
  },
  computed: {
    stores() {
      const st = this.$store.state.storeLocations || [];
      return st.map(e => {
        const { name, id } = {...e};
        return Object.assign({}, { id, name });
      });
    }
  },
  methods: {
    remove() {
      this.$emit('remove');
    },
    updateHidden() {
      this.$emit('updateHidden', !this.visible);
    },
    updateLoop() {
      this.$emit('updateLoop', this.loop);
    },
  }
};
</script>

<style scoped lang="scss">
  .delete-bt {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 20px;
  }
</style>
