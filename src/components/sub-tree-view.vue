<template>
  <div class="tree-view" v-if="data">
    <div v-for="(sn, k) in data" :key="k" class="tree-branch" :class="isExpanded(sn.dept_id)">
      <div class="tree-node" :class="{'has-children': (sn[nodeChildrenProp] && sn[nodeChildrenProp].length)}">
        <div @click="toggleChildren" v-if="sn[nodeChildrenProp] && sn[nodeChildrenProp].length" class="tree-node-icon"></div>
        <router-link v-if="!avoidNavigation" :to="{ path: $route.path, query: { ...$route.query, exsubdept: subParent || sn.dept_id, exdept: parentId, dept_id: sn.dept_id, page: 1 }}" class="tree-node-label text-capitalize" @click.prevent="onNodeSelect(sn,k)" @keypress.enter="onNodeSelect(sn,k)" @keydown.left="sn[nodeChildrenProp] && sn[nodeChildrenProp].length && collapse($event)" @keydown.right="sn[nodeChildrenProp] && sn[nodeChildrenProp].length && expand($event)" :tabindex="tabIndex ? 0 : -1">
          {{ sn[nodeLabelProp] }}
        </router-link>
        <div v-else class="tree-node-label text-capitalize" @click.prevent="onNodeSelect(sn,k)" @keypress.enter="onNodeSelect(sn,k)" @keydown.left="sn[nodeChildrenProp] && sn[nodeChildrenProp].length && collapse($event)" @keydown.right="sn[nodeChildrenProp] && sn[nodeChildrenProp].length && expand($event)" :tabindex="tabIndex ? 0 : -1">
          {{ sn[nodeLabelProp] }}
        </div>
      </div>
      <SubTreeView
        isChild="true"
        v-if="sn[nodeChildrenProp] && departmentsHirarchy > 2"
        :nodeLabelProp="nodeLabelProp"
        :nodeChildrenProp="nodeChildrenProp"
        :data="sn[nodeChildrenProp]"
        :expanded="expanded"
        :expandedSubDepartment="expandedSubDepartment"
        :parentId="parentId"
        :avoidNavigation="avoidNavigation"
        :subParent="sn.dept_id"
        @nodeSelected="onNodeSelect"
        :tabIndex="exp"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SubTreeView',
    props: {
      parentId: {
      },
      subParent: {
      },
      expandedDepartment: {
      },
      expandedSubDepartment: {
      },
      data: {
        type: Array,
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
      avoidNavigation: {
        type: Boolean,
        default: false
      },
      tabIndex: {
        default: true
      },
      departmentsHirarchy:{
        type: Number,
        default: null
      }
    },
    data() {
      return {
        exp: true
      };
    },
    methods: {
      isExpanded(id) {
        if(this.expanded || this.expandedSubDepartment == id)
          return 'expanded';
      },
      onNodeSelect(node) {
        this.$emit('nodeSelected', node);
      },
      toggleChildren(evt) {
        evt.currentTarget.parentNode.parentNode.classList.toggle('expanded');
        this.exp = evt.currentTarget.parentNode.parentNode.classList.contains('expanded');;
      },
      expand(evt) {
        evt.currentTarget.parentNode.parentNode.classList.add('expanded');
        this.exp = true;
      },
      collapse(evt) {
        evt.currentTarget.parentNode.parentNode.classList.remove('expanded');
        this.exp = false;
      }
    },
    mounted() {

    }
  };
</script>
<style scoped lang="scss">
  .tree-view {
    font-size: 14px;
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
        overflow: hidden;

        .tree-node-label {
          padding: 1px 3px;
          border-radius: 2px;
          margin: 2px;
          color: var(--text);
          text-decoration: none;
          cursor: pointer;
          &.router-link-exact-active {
            background: var(--primary);
            color: #fff;
          }
        }
        &:hover {
          overflow: visible;
          .tree-node-label {
            background: var(--primary);
            color: #fff;
          }
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
      }
      > .tree-view {
        margin-left: 22px;
      }

      &.expanded {
        > .tree-view {
          max-height: 10000px !important;
        }
        > .tree-node {
          .tree-node-icon {
            transform: rotate(90deg);
          }
        }
      }
    }
  }
</style>
