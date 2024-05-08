<template>
  <b-modal size="lg" class="modal-box" ref="departmentAliasModal"
    :lazy="false"
    :visible="false"
    @shown="getPreviousAliases"
    title="Create Alias"
  >
    <div>
      <p>Create alias to better organise and clean the department names that display to your customers. We have provided alias suggestions based on your input.</p>

      <label for="Alias">Enter a name</label>
      <input type="text" placeholder="name" class="form-control w-100 search-input" v-model="nameInput">

      <div class="my-3 suggestions-holder" v-if="suggestedAlias && suggestedAlias.length > 0">
        <h5>Suggestions</h5>
        <div v-for="(alias, index) in suggestedAlias" :key="alias.id">
          <div class="suggestion-select-option">
            <span>{{alias.name}}</span>
            <button class="btn btn-xs btn-outline-primary" @click="selectOption($event, index, alias.name)">Select</button>
          </div>
        </div>
      </div>
      <div class="my-3 suggestions-holder" v-if="previousAliases.length > 0">
        <h5>Previously Used</h5>
        <div v-for="(alias, index) in previousAliases" :key="alias.id">
          <div class="suggestion-select-option">
            <span>{{ alias.name }}</span>
            <button class="btn btn-xs btn-outline-primary" @click="selectOption($event, index, alias.name)">Select</button>
          </div>
        </div>
      </div>
    </div>
    <div slot="modal-footer">
      <button type="button" class="btn btn-primary" :disabled="nameInput.length < 2" @click="addAlias">Complete</button>
    </div>
  </b-modal>
</template>

<script>
  import DepartmentService from '@/api-services/departments.service';
  import { debounce } from 'debounce';

  export default {
    name: 'DepartmentAlias',
    props: {
      currentNode: {
        type: Object,
        default: null
      },
      selectedStore: {
        type: Number,
        default: -1
      }
    },
    data() {
      return {
        nameInput: "",
        suggestedAlias: [],
        previousAliases: []
      };
    },
    methods: {
      clearAliasButtonStyles() {
        var btns = document.querySelectorAll('.assign-button');
        for (var i = 0; i < btns.length; i++) {
          btns[i].style.backgroundColor = '#FFFFFF';
          btns[i].style.color = '#000000';
        }
      },
      showModal() {
        this.$refs.departmentAliasModal.show();
      },

      selectOption(e, index, optionName) {
        this.clearAliasButtonStyles();
        this.nameInput = optionName;
        e.target.style.backgroundColor = '#17a2b8';
        e.target.style.color = '#FFFFFF';
        this.addAlias();
      },

      async getAliasSuggestions() {
        let response = await DepartmentService.getAliases(this.nameInput, this.currentNode.type, this.selectedStore);
        this.suggestedAlias = response.data.data;
      },

      async getPreviousAliases() {
        this.nameInput = "";
        this.previousAliases = [];
        let type = this.currentNode.type;
        let response = await DepartmentService.getPreviousAliases(type, this.selectedStore);
        this.previousAliases = response.data.data;
      },

      async addAlias() {
        let response = await DepartmentService.addAlias(this.nameInput, this.currentNode.type, this.currentNode.dept_id, this.selectedStore);
        let alias = {id: response.data.alias_mapped_id, alias_id: response.data.alias_id, name: this.nameInput, dept_id: this.currentNode.dept_id};
        // this.currentNode.alias = alias;
        this.$set(this.currentNode, 'alias', alias);
        this.$set(this.$parent.currentNode, 'alias', alias);
        this.$refs.departmentAliasModal.hide();
      }
    },
    watch: {
      nameInput: debounce(function() {
        if (this.nameInput.length > 1) {
          this.getAliasSuggestions();
        }
      }, 450)
    },
  };
</script>

<style scoped lang="scss">
  .suggestions-holder {
    max-height: 210px;
    overflow: scroll;
  }
  .suggestion-select-option {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border: 1px solid #e2e2e7;
    margin-bottom: 5px;
  }
  .assign-button {
    border: 2px solid #a3a3a3;
    border-radius: 5px;
    padding: 2px 5px;
    cursor: pointer;
  }

  .assign-button:hover {
    background-color: #17a2b8;
    color: #FFFFFF;
  }
</style>
