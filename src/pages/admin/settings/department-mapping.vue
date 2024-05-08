<template>
  <div v-if="$ezHasNoPermission('edit_department_mapping')">
    <no-permission-truevalue page="Department Mapping"></no-permission-truevalue>
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <div>
          <h1>Department Mapping</h1>
          <a href="#" @click.prevent="$refs.tutorialModal.show()" class="btn btn-tutorial btn-sm text-medium bg-white btn-action">
            <i class="fa fa-play mr-1"></i> Click to Watch Tutorial Video
          </a>
          <b-modal size="lg" ref="tutorialModal">
            <div slot="modal-header">
              <h5>How To Map Departments</h5>
            </div>
            <div>
              <video class="w-100" poster="/images/cover-department-mapping.jpg" controls>
                <source src="https://storage.googleapis.com/content.ezadtv.com/2024/03/06/65e8be93202f7_Departments_Mapping.m4v" type="video/mp4">
              </video>
            </div>
            <div slot="modal-footer">
              <button type="button" class="btn btn-primary" @click="$refs.tutorialModal.hide()">Done</button>
            </div>
          </b-modal>
        </div>
        <is-saved :param="saving" />
      </div>
    </div>
    <div class="settings-body">
      <p>This page allows you to manage your departments, classes & finelines. You can group multiple categories into one alias which will display on your E-commerce website. EZ-commerce is based on a 3 level max taxonomy broken down into 1) Departments, 2) Classes, 3) Finelines</p>
      <div class="d-flex justify-content-between align-items-sm-end mb-4 flex-column flex-sm-row align-items-stretch">
        <div v-if="stores.length > 1">
          <select @input="storeChanged" class="form-control" v-model="selectedStore">
            <option v-for="s in stores" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <input type="text" class="form-control mb-3 mb-sm-0" id="filterInput" v-model="filterPre" placeholder="Filter by name" />
        </div>
        <div class="d-flex justify-content-end">
          <b-form-checkbox @change="showHiddenDepartments" class="mr-md-5 flex-grow-1 flex-grow-md-0 mt-3">
            Show Hidden Departments
          </b-form-checkbox>

          <button type="button" class="btn btn-secondary mr-3" @click="expandAllNodes">Expand All</button>
          <button type="button" class="btn btn-primary" @click="collapseAllNodes">Collapse All</button>
        </div>
      </div>

      <!-- DEPARTMENT FILTERS -->
      <div class="mb-3" v-if="filteredDepartmentList && filteredDepartmentList.length">
        <h6>Departments</h6>
        <div class="department-alias-holder">
          <tree-view
            ref="DepartmentsTreeview"
            nodeLabelProp="dept_name"
            nodeChildrenProp="sub_depts"
            :data="filteredDepartmentList"
            :expanded="treeviewExpanded"
            @nodeSelected="selectDepartment"
            @assignAlias="assignAlias"
            @removeAlias="removeAlias"
            @deptSettings="editDeptSettings"
            @enableChanged="changeEnableState"
            :isHiddenDeptShow="isHiddenDeptShow"
          >
          </tree-view>

          <div  v-show="filter === ''" class="row justify-content-end">
            <div class="col-8">
              <ul class="pagination">
                <li class="page-item" :class="[pActivePage == 0 ? 'disabled': '']">
                  <a class="page-link" href="javascript:void(0)" aria-label="Previous" @click="prevPage">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                  </a>
                </li>
                <li class="page-item" v-for="(list,i) in paginationList" :key="i" :class="[i==pActivePage ? 'active': '']"><a class="page-link" href="javascript:void(0)" @click="setDepartmentList(list,i)">{{ i + 1 }}</a></li>
                <li class="page-item" :class="[pActivePage == paginationList.length - 1 ? 'disabled': '']">
                  <a class="page-link" href="javascript:void(0)" aria-label="Next" @click="nextPage">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>


        </div>
      </div>
      <div v-else-if="filterPre" class="loader-wrapper">
        There are no departments matching {{ filter }}
      </div>
      <div v-else class="loader-wrapper">
        <img src="/icons/loader.gif" class="loader" alt="Loading...">
      </div>


    </div>

    <department-alias ref="deptAliasModal" :currentNode="currentNode" :selectedStore="selectedStore"
                      @fetchAliasesData="fetchAliasesData"/>
    <department-settings ref="deptSettingsModal" :currentNode="currentNode" :selectedStore="selectedStore"/>
  </div>
</template>

<script>
  import DepartmentService from '@/api-services/departments.service';
  import TreeView from '@/pages/admin/settings/tree-view.vue';
  import NoPermissionTruevalue from "./no-permission-truevalue";
  import { debounce } from 'debounce';

  export default {
    name: 'DepartmentMapping',
    components: {
      TreeView,
      NoPermissionTruevalue
    },
    data() {
      return {
        departmentList: null,
        currentNode: null,
        currentNodePrevAliases: [],
        treeviewExpanded: false,
        filter: '',
        filterPre: '',
        saving: false,
        stores: [],
        selectedStore: -1,
        isHiddenDeptShow: false,
        paginationThreshold: 25,
        pDeptList: [...Array(25).keys()],
        paginationList: [],
        pActivePage: 0
      };
    },
    computed: {
      filteredDepartmentList() {
        if(!this.departmentList)
          return [];

        if(this.filter === '') {

          var deptList = this.pDeptList;
          return this.departmentList.filter(function(dept,index){
            if( deptList.indexOf(index) !== -1 )
              return dept;
          });

          // return this.departmentList;
        }

        return JSON.parse(JSON.stringify(this.departmentList)).filter(e => {
          let dept = e.dept_name.toLowerCase().includes(this.filter.toLowerCase());
          if(dept) {
            // e.dept_name = e.dept_name.toLowerCase().replace(this.filter.toLowerCase(), m => `<mark>${m}</mark>`);
            return e;
          }

          // Classes
          let sub = [...e.sub_depts].filter(x => x.dept_name.toLowerCase().includes(this.filter.toLowerCase()));
          if(sub.length) {
            e.sub_depts = sub;
            e.expand = true;
            return e;
          }

          // Finelines
          let finelines = [...e.sub_depts].filter((c) => {
            let fineline = c.sub_depts.filter(x => x.dept_name.toLowerCase().includes(this.filter.toLowerCase()));
            if(fineline.length) {
              c.sub_depts = fineline;
              c.expand = true;
              return c;
            }
          });

          if(finelines.length) {
            e.sub_depts = finelines;
            e.expand = true;
            return e;
          }

        });
      }
    },
    watch: {
      filterPre: debounce(function(val)  {
        this.filter = val;
      }, 500),
      currentNode(val) {
        if (val) {
          this.updateNode(val);
          this.reRenderTree();
        }
      }
    },
    mounted() {
      this.fetchAliasesData();
    },
    methods: {
      updateNode(node, sub_depts = this.departmentList) {
        // loop through this.departmentList and sub_depts to find the node when found update it
        for (let i = 0; i < sub_depts.length; i++) {
          if (sub_depts[i].dept_id === node.dept_id) {
            sub_depts[i] = node;
            return;
          }
          if (sub_depts[i].sub_depts) {
            this.updateNode(node, sub_depts[i].sub_depts);
          }
        }        
      },
      reRenderTree() {
        // force update computed property
        this.$forceUpdate();
        this.$refs.DepartmentsTreeview.$forceUpdate();
        this.departmentList.forEach((node) => {
          if(this.$refs.DepartmentsTreeview.$refs[`tree-view-${node.dept_id}`]) {
                this.$refs.DepartmentsTreeview.$refs[`tree-view-${node.dept_id}`][0].$forceUpdate();
          }
        });
      },
      showHiddenDepartments(){
        this.isHiddenDeptShow = !this.isHiddenDeptShow ? true : false ;
        this.fetchAliasesData();
      },
      setDepartmentList(deptList,pageNumber){

        this.pDeptList = deptList;
        this.pActivePage = pageNumber;

      },
      nextPage(){

        this.setDepartmentList( this.paginationList[this.pActivePage + 1],  this.pActivePage + 1);

      },
      prevPage(){

        this.setDepartmentList( this.paginationList[this.pActivePage - 1],  this.pActivePage - 1);

      },
      storeChanged() {
        // delay for selectedStore to update
        setTimeout(() => this.fetchAliasesData(), 100);
      },
      async fetchAliasesData() {

        this.departmentList = null;
        this.paginationList = [];

        let response = await DepartmentService.getDepartmentsWithAliases(this.selectedStore,this.isHiddenDeptShow ? 1 : 0);

        this.departmentList = response.data.data;

        var deptKeys = [...Array(this.departmentList.length).keys()];
        while(deptKeys.length > 0) {

            this.paginationList.push(deptKeys.splice(0, this.paginationThreshold));
        }

        this.stores = response.data.stores;
        this.selectedStore = response.data.selectedStore;

      },
      assignAlias(currentNode) {
        this.currentNode = currentNode;
        this.$refs.deptAliasModal.showModal();
      },
      async removeAlias(node) {
        const removed = node.alias;
        node.alias = []; // stupid tree view checks if it's an object to see if an alias exists so make it an array
        this.currentNode = node;
        if ( removed && removed.id ) {
          await DepartmentService.removeAlias(removed.id, this.selectedStore);
        }
      },
      selectDepartment(node) {
        console.log(node);
      },
      expandAllNodes () {
        this.treeviewExpanded = true;
      },
      collapseAllNodes() {
        this.treeviewExpanded = false;
      },
      editDeptSettings(node) {
        this.currentNode = node;
        this.$refs.deptSettingsModal.showModal();
      },
      async changeEnableState(node) {
        node.enabled = !node.enabled;
        this.saving = true;
        await DepartmentService.updateDepartmentHidden(node.dept_id, node.enabled, this.selectedStore);
        this.saving = false;
      }
    }
  };
</script>

<style scoped lang="scss">
  #filterInput {
    min-width: 300px;
  }
  @media (max-width: 991px) {
    #filterInput {
      min-width: 200px;
    }
  }
  @media (max-width: 768px) {
    :deep(.department-alias-holder) {
      .tree-view .tree-branch .tree-node {
        margin-bottom: 0 !important;
      }
      > .tree-view > .tree-branch > .tree-node {
        .custom-switch {
          transform: scale(.9);
          transform-origin: 100% 50%;
        }
      }
      .tree-view .tree-branch > .tree-view {
        padding-left: 10px;
        margin: 0;
      }
      .tree-node-label {
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px !important;
      }
    }
  }
</style>
