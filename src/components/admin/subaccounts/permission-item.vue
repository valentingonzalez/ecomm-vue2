<template>
  <div class="col-lg-6 col-sm-12 mt-2">
    <div
      class="d-flex justify-content-between align-items-center pl-3 pr-2"
      :class="[isEnabled ? 'container-enabled' : 'container-disabled']"
    >
      <span :class="[isEnabled ? 'name-enabled' : 'name-disabled']">{{ name }}</span>
      <button class="btn" @click="setEnabled" :disabled="disableAction">
        {{ !isEnabled ? "Enable" : "Remove" }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PermissionItem",
  props: {
    name: {
      type: String,
      default: null
    },
    isEnabled: {
      type: Boolean,
      default: false
    },
    enable: {
      type: Function,
      default: () => {}
    },
    disableAction: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    setEnabled() {
      this.enable();
    }
  }
};
</script>

<style scoped lang="scss">
.container-enabled,
.container-disabled {
  border-radius: 4px;
  border: solid 1px #dee2e6;
  background: var(--background);
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.02);
  min-height: 44px;

  .btn {
    color: var(--background);
    background: var(--primary);
    height: 32px;
    width: 84px;
    &:disabled {
      opacity: .4;
    }
  }
}

.container-enabled {
  border: solid 1px rgba(0, 103, 143, 0.1);
  background: rgba(0, 103, 143, 0.1);

  .btn {
    color: var(--primary);
    background: var(--background);
    border-color: var(--primary) !important;
  }
}

span {
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  vertical-align: middle;
  margin-right: 8px;
}
</style>
