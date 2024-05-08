<template>
  <div class="tree-view" v-if="data">
    <div v-for="(sn, k) in data" :key="k" class="tree-branch" :class="isExpanded(sn.dept_id)">
      <div class="tree-node" :class="{'has-children': (sn[nodeChildrenProp] && sn[nodeChildrenProp].length)}">
        <div @click="toggleChildren" v-if="sn[nodeChildrenProp] && sn[nodeChildrenProp].length" class="tree-node-icon"></div>
        <router-link class="tree-node-label text-capitalize" v-if="!avoidNavigation" :to="{ path: $route.path, query: { ...$route.query, ...newRouteQuery, exdept: sn.dept_id, dept_id: sn.dept_id, page: 1 }}" @click="onNodeSelect(sn,k)" @keypress.enter="onNodeSelect(sn,k)" @keydown.left="sn[nodeChildrenProp] && sn[nodeChildrenProp].length && collapse($event)" @keydown.right="sn[nodeChildrenProp] && sn[nodeChildrenProp].length && expand($event)" tabindex="0">
          {{ sn[nodeLabelProp] }}
        </router-link>
        <div v-else class="tree-node-label text-capitalize" @click="onNodeSelect(sn,k)" @keypress.enter="onNodeSelect(sn,k)" @keydown.left="sn[nodeChildrenProp] && sn[nodeChildrenProp].length && collapse($event)" @keydown.right="sn[nodeChildrenProp] && sn[nodeChildrenProp].length && expand($event)" tabindex="0">
          {{ sn[nodeLabelProp] }}
        </div>
      </div>
      <SubTreeView
        :parentId="sn.dept_id"
        v-if="sn[nodeChildrenProp] && departmentsHirarchy > 1"
        :expandedSubDepartment="expandedSubDepartment"
        :nodeLabelProp="nodeLabelProp"
        :nodeChildrenProp="nodeChildrenProp"
        :data="sn[nodeChildrenProp]"
        :expanded="expanded"
        :avoidNavigation="avoidNavigation"
        :tabIndex="exp"
        :departmentsHirarchy="departmentsHirarchy"
        @nodeSelected="onNodeSelect"
      />
    </div>
  </div>
</template>
<script>
  import SubTreeView from '@/components/sub-tree-view.vue';

  export default {
  name: 'TreeView',
    components: {
      SubTreeView
    },
  props: {
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
  computed: {
    newRouteQuery() {
      let newRouteQuery = {};
      Object.keys(this.$route.query).forEach(key => { if (key != 'exsubdept') newRouteQuery[key] = this.$route.query[key]; });
      return newRouteQuery;
    }
  },
  mounted() {
  },
  methods: {
    isExpanded(id) {
      if(this.expanded || this.expandedDepartment == id)
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
        margin: 4px 0;
        line-height: 1.4;
        .tree-node-label {
          padding: 1px 3px;
          margin: 2px 0;
          border-radius: 2px;
          cursor: pointer;
          color: var(--text);
          text-decoration: none;
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
        border-radius: 5px;
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
