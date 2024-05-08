<template>
  <div v-if="$ezHasNoPermission('edit_fulfillment_options')">
    <no-permission-truevalue page="Special Order Items"></no-permission-truevalue>
  </div>
  <div v-else>
    <div class="settings-header bg-white mb-3">
      <div class="settings-header-info">
        <h1>Special Order Items</h1>
        <is-saved :param="saving" />
      </div>
    </div>
    <div class="bg-white p-4">
      <FulfillmentOptionsSpecial class="mb-3" @onSave="saveCallback" />
    </div>
  </div>
</template>

<script>
  import NoPermissionTruevalue from "./no-permission-truevalue";
  import FulfillmentOptionsSpecial from '@/components/admin/fulfillment-options/special';

  export default {
    name: 'SpecialOrderItems',
    components: {
      NoPermissionTruevalue,
      FulfillmentOptionsSpecial
    },
    data() {
      return {
        saving: false,
        save_cart: false,
        paymentProcessing: false
      };
    },
    async mounted() {
      if(this.$ezHasNoPermission('edit_fulfillment_options')) return;
    },
    methods: {
      saveCallback(callback) {
        this.saving = true;
        callback.then(() => this.saving = false);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .main-container {
    border: 1px solid #E2E8F0;
    background: #f8fafc;
    border-radius: 10px;
    h5 {
      font-size: 18px !important;
    }
  }
  .text-muted {
    color: #475569 !important;
  }
  .content.h-100 {
    border: none !important;
  }
  :deep(.vue__time-picker) {
    font-family: var(--font);
    width: auto;
    input.display-time {
      width: 60px;
      border: none;
      padding: 0;
      text-align: center;
      color: var(--brandPrimary);
      cursor: pointer;
    }
    .controls {
      display: none;
    }
    .select-list {
      .active,
      .active:hover {
        background: var(--brandPrimary) !important;
      }
    }
  }
  .timerange-selector {
    /*:deep(.vue__time-picker) {
      font-family: var(--font);
      width: auto;
      .form-control {
        width: auto;
        max-width: 60px;
        height: 36px;
        padding: 0 8px !important;
        background: #fff !important;
      }
      .controls {
        display: none;
      }
      .select-list {
        .active,
        .active:hover {
          background: var(--primary);
        }
      }
    }*/
    .input-group{
      flex-wrap: nowrap;
    }
    .input-group-text {
      padding: 0;
      width: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .zipcode {
    display: flex;
    margin-right: 10px;
    background: var(--primary);
    color: #fff;
    border-radius: 4px;
    font-size: 13px;
    font-weight: bold;
    padding-left: 8px;
    height: 40px;
    align-items: center;
    cursor: pointer;
    button {
      background: none;
    }
  }

  .disabled-label {
    color: #ccc;
  }
  .custom-control-label.always-on {
    color: var(--primary) !important;
    &::before {
      color: #fff !important;
      border-color: var(--primary) !important;
      background-color: var(--primary) !important;
    }
  }
  .custom-control-input:disabled {
    ~ .custom-control-label {
      color: #ccc !important;
      &::before {
        background-color: #e9ecef !important;
      }
    }
  }
</style>
