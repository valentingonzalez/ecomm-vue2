<template>
  <div class="tree-view">
    <div v-for="(sn, k) in data" :key="k" v-show="shouldRenderNode(sn)" class="tree-branch" :class="{'expanded': isNodeExpanded(sn)}">
      <div class="tree-node flex-wrap flex-md-nowrap" :class="{'has-children': hasChildren(sn)}">
        <div @click="toggleChildren(sn)" v-if="hasChildren(sn)" class="tree-node-icon"></div>
        <div class="tree-node-label flex-grow-1 text-capitalize" @click.prevent="onNodeSelect(sn)">
          {{sn[nodeLabelProp]}}
          <span v-if="sn.products_count" class="small">
            ( Products: <i>{{ sn.products_count }}</i> )
          </span>
          <span v-if="sn.alias.constructor.name == 'Object'" class="small">
            ( Alias: <i>{{sn.alias.name || 'none'}}</i> )
            <a class="text-danger cursor-pointer" @click="onRemoveAlias(sn)">Remove</a>
          </span>
          <div class="tree-label-note" v-if="sn.hide_products"><br>(Products hidden from search)</div>
          
          <div class="row" v-if="sn.settings">
            <div class="col-md-3 mt-3" v-for="(value,index) in JSON.parse(sn.settings)" :key="index" v-show="isDisplayable(index,value)"><i class="fa fa-check text-success"></i>&nbsp;<span class="setting-text">{{settingHumanDesc(index)}}</span></div>
          </div>

        </div>
        <div class="flex-column flex-md-row d-flex align-items-end align-items-md-center justify-content-end options">
          <span class="mr-md-3 d-none d-md-block" v-if="isDept(sn) && sn.source">{{ sn.source }}</span>
          <b-form-checkbox v-if="showHiddenToggle()" switch @change.native="enableChanged(sn)" class="mr-md-5 flex-grow-1 flex-grow-md-0" :checked="sn.enabled">
            Hidden
          </b-form-checkbox>
          <div class="d-flex flex-column flex-md-row align-items-end">
            <a href="#" class="mr-md-3" @click.prevent="deptSettings(sn)">Settings</a>
            <a href="#" @click.prevent="onAssignAlias(sn)">Assign Alias</a>
          </div>
        </div>
      </div>
       <!-- Render child nodes recursively -->
       <tree-view
        v-if="hasChildren(sn) && isNodeExpanded(sn)"
        :ref="`tree-view-${sn.dept_id}`"
        :parentDept="sn"
        :grandParentDept="parentDept"
        :nodeLabelProp="nodeLabelProp"
        :nodeChildrenProp="nodeChildrenProp"
        :data="sn[nodeChildrenProp]"
        :expanded="expanded"
        @nodeSelected="onNodeSelect"
        @assignAlias="onAssignAlias"
        @removeAlias="onRemoveAlias"
        @deptSettings="deptSettings"
        @enableChanged="enableChanged"
        :isHiddenDeptShow="isHiddenDeptShow"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeView',
  data() {
    return {
      settings: {
        "hideProducts": "Hide Products",
        'hidePrice': 'Hide Price',
        'disableOrdering': 'Disable Ordering',
        'disableDelivery': 'Disable Delivery',
        'disableShipping': 'Disable Shipping',
        'hideQuantity': 'Hide Quantity',
        'override_tax_rate': 'Override Tax Rate'
      }
    };
  },
  props: {
    grandParentDept: {
      type: Object,
      required: false
    },
    parentDept: {
      type: Object,
      required: false
    },
    data: {
      type: Array,
      required: true
    },
    isHiddenDeptShow: {
      type: Boolean,
      required: true
    },
    nodeLabelProp: {
      type: String,
      default: 'name'
    },
    nodeChildrenProp: {
      type: String,
      default: 'children'
    },
    expanded: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    showHiddenToggle() {
      if(!this.parentDept) {
        return true;
      } else if (this.parentDept && !this.parentDept.enabled && !this.grandParentDept){
        return true;
      } else if(this.grandParentDept && !this.parentDept.enabled && !this.grandParentDept.enabled){
        return true;
      }
      return false;
    },
    settingHumanDesc(key){
      return this.settings[key] ? this.settings[key] : '';
    },
    isDisplayable(key,value){
      return this.settings[key] && value ? true : false;
    },
    isHidden(enabled){
      if(this.isHiddenDeptShow){
        return true;
      }
      
      return !this.isHiddenDeptShow && !enabled ? true : false;
    },
    isDept(o) {
      return o.type === 'department' || o.type === 'class' || o.type === 'fineline';
    },
    onNodeSelect(node) {
      this.$emit('nodeSelected', node);
    },
    onAssignAlias(node) {
      this.$emit('assignAlias', node);
    },
    shouldRenderNode(node) {
      return this.isHidden(node.enabled) && (!this.parentDept || this.isNodeExpanded(this.parentDept));
    },
    hasChildren(node) {
      return node[this.nodeChildrenProp] && node[this.nodeChildrenProp].length;
    },
    isNodeExpanded(node) {
      return node.expand || (this.expanded && this.hasChildren(node));
    },
    toggleChildren(node) {
      // Toggle the expand property of the node
      this.$set(node, 'expand', !node.expand);
      event.currentTarget.parentNode.parentNode.classList.toggle('expanded');
    },
    onRemoveAlias(node) {
      this.$emit('removeAlias', node);
    },
    deptSettings(node) {
      this.$emit('deptSettings', node);
    },
    enableChanged(node) {
      this.$emit('enableChanged', node);
    }
  },
  mounted() {
  }
};
</script>
<style scoped lang="scss">
  .setting-text {
    color:gray;
    font-size: 12px;
  }
  .tree-view {
    font-size: 12px;
    .tree-branch {

      .tree-view {
        max-height: 0;
        overflow: hidden;
        transition: max-height .2s;
        &:hover {
          overflow: visible;
        }
      }
      .tree-node {
        display: flex;
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
        min-height: 50px;
        border: 1px solid #e8e8e8;
        border-radius: 5px;
        padding: 12px;
        margin-bottom: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

        .tree-node-label {
          font-size: 16px;
          font-weight: 500;
          margin-left: 4px;
        }
        .tree-node-icon {
          cursor: pointer;
          width: 8px;
          height: 8px;
          transition: transform .2s;
          transform-origin: 2px 3px;
          margin-left: 3px;
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          border-left: 4px solid var(--primary);
          z-index: 2;
        }
        .assign-button {
          border: 2px solid #a3a3a3;
          border-radius: 5px;
          padding: 3px 10px;
          background-color: #17a2b8;
          color: #FFFFFF;
          cursor: pointer;
        }

        .assign-button:hover {
          background-color: #FFFFFF;
          color: #17a2b8;
        }

        .settings-button {
          border: 2px solid #a3a3a3;
          border-radius: 5px;
          padding: 3px 10px;
          background-color:#FFFFFF;
          color: #17a2b8;
          cursor: pointer;
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

        .tree-label-note {
          font-size: 12px;
          color: #777;
          margin-top: -20px;
        }
      }
      > .tree-view {
        margin-left: 22px;
      }

      &.expanded {
        > .tree-view {
          max-height: 100% !important;
        }
        > .tree-node {
          .tree-node-icon {
            transform: rotate(90deg);
          }
        }
      }
    }

    .cursor-pointer {
      cursor: pointer;
    }
  }
  @media (max-width: 576px) {  
    .tree-view .tree-branch .tree-node {
      border: none;
      border-bottom: 1px solid #e8e8e8;
      border-radius: 0;
      padding-left: 0;
      padding-right: 0;
    }
  }
</style>
