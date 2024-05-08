<template>
    <b-modal size="lg" ref="textViewModal" id="textViewModal" :body-class="bodyClass" centered hide-footer :title="title">
        <slot></slot>
    </b-modal>
  </template>
  
  <script>
  
  export default {
    name: 'TextViewModal',
    props:{
        title: {
            default: ''
        },
        bodyClass: {
            default: ''
        }  
    },
    data() {
      return {
      };
    },
    methods: {
      hideModal() {
        this.$refs.textViewModal.hide();
      },
      showModal() {
        this.$refs.textViewModal.show();
      }
    }
  };
  </script>
  
  <style lang="scss" scoped>
    :deep(.modal-dialog) {
      max-width: 1110px !important;      
    }
    :deep(.modal-content) {
      border: none;
      background-position: center 80px, center center;
      font-size: 22px;      
      .modal-body {
        display: flex;
        align-items: center;
        max-height: 80vh;
        overflow: auto;
      }
      .circle {
        width: 64px;
        height: 64px;
        border-radius: 64px;
        background: #fff;
      }
      .close-bt {
        position: absolute;
        top: 6px;
        right: 16px;
      }
    }
    @media (max-width: 576px) {
      :deep(.modal) {
        display: flex !important;
        align-items: center;
        justify-content: center;
      }
      :deep(.modal-content) {
        min-height: 345px;
        .btn {
          width: 100%;
        }
      }
    }
  </style>
  
  