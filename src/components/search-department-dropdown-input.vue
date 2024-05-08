<template>
  <div class="card filters rounded-0 mb-2">
    <div class="card-body">
      <h5 class="card-title" role="heading">Shop by Department</h5>
      <VSelect
        labelSearchPlaceholder="Product Areas"
        labelTitle="Product Areas"
        :searchable="true"
        :options="normalizedDepartments"
        v-model="department"
        @change="departmentSelected" />
    </div>
  </div>
</template>
<script>
  import VSelect from '@alfsnd/vue-bootstrap-select';
  export default {
    name: 'SearchDepartmentDropdownInput',
    components: {
      VSelect
    },
    watch: {
      department() {
        this.departmentSelected();
      }
    },
    computed: {
      departments() {
        if(this.$store.state.departmentResults && this.$store.state.departmentResults.parent_departments)
          return this.$store.state.departmentResults.parent_departments;
        return [];
      },
      normalizedDepartments() {
        return this.departments.map(d => {
          return {
            text: d.name,
            value: d
          };
        });
      }
    },
    data() {
      return {
        department: '',
      };
    },
    methods: {
      departmentSelected() {
        const url = encodeURI(this.department.value.target);
        this.$router.push(url);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .card-title {
    font-size: 18px;
    font-weight: bold;
  }
  .v-select {
    min-width: 20px;
  }
</style>
