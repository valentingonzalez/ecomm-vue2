<template>
  <main class="department-wrapper">
    <div class="container search-container">
      <div class="row small-gutters">
        <div class="col-md-4">
          <h1 class="results-page-title">Departments</h1>
        </div>
        <div class="col-md-8">
          <div class="d-sm-flex align-items-center w-100 mb-2">
            <div style="flex: 1;">
              <input type="text" autocomplete="off" v-model="departmentSearch" aria-label="Search Department" :placeholder="`Search Department`" name="searchKey" class="form-control search-input mb-2" v-on:keyup.enter="doKeywordFilter(true)" />
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-center w-100" v-if="loaded && filterDepartments.length == 0">
          <div class="spinner-border mt-5"></div>
        </div>
        <div v-else-if="filterDepartments.length" v-for="item in filterDepartments" :key="item.dept_id" class="col-sm-6 col-md-4 col-xl-3 mb-2 department-item">
          <DepartmentItem :item="item" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import DepartmentItem from '@/components/departments/department-item.vue';
  import departmentServices from '@/api-services/departments.service';

  export default {
    name: 'DepartmentsPage',
    components: {
      DepartmentItem
    },
    data() {
      return {
        loaded: true,
        departmentSearch: '',
        departmentLists: []
      };
    },
    computed:{
      filterDepartments() {
        return this.departmentLists.filter(department => {
          return department.dept_name.toLowerCase().includes(this.departmentSearch.toLowerCase());
        });
      }
    },
    async mounted() {
      await this.findDeptImages();
    },
    methods: {
      findDeptImages() {
        departmentServices.searchDepartmentsImages()
        .then(res => {
          this.departmentLists = res.data.data.dept;
          this.loaded = false;
        });
      }
    }
  };
</script>


<style scoped lang="scss">
  .search-input {
    background-image: url('data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPGcgaWQ9IlN5bWJvbHMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9IjAuNSI+CiAgICAgICAgPGcgaWQ9IlNlYXJjaC1iYXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01MzYuMDAwMDAwLCAtMTMuMDAwMDAwKSIgZmlsbD0iIzJGMzU0MCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IlNlYXJjaC1CYXIiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTU0OC41MDgxMTQsMjYuNzQwNTQ4MSBDNTQ4Ljg0OTc5MSwyNy4wODY0ODQgNTQ5LjQwMjA2NiwyNy4wODY0ODQgNTQ5Ljc0Mzc0MywyNi43NDA1NDgxIEM1NTAuMDg1NDE5LDI2LjM5NDYxMjMgNTUwLjA4NTQxOSwyNS44MzQ5ODQ2IDU0OS43NDM3NDMsMjUuNDg5MDQ4NyBMNTQ3LjA0NzQ3NSwyMi43OTQzMTI3IEM1NDcuODEwMDMzLDIxLjc3MjI4MTEgNTQ4LjI2MTQ3MiwyMC41MDQ0NzE5IDU0OC4yNjE0NzIsMTkuMTMxMjE1MyBDNTQ4LjI2MTQ3MiwxNS43NDUwMzg2IDU0NS41MTY2NDgsMTMgNTQyLjEzMDczNiwxMyBDNTM4Ljc0NDgyNCwxMyA1MzYsMTUuNzQ1MDM4NiA1MzYsMTkuMTMxMjE1MyBDNTM2LDIyLjUxNzM5MiA1MzguNzQ0ODI0LDI1LjI2MjQzMDYgNTQyLjEzMDczNiwyNS4yNjI0MzA2IEM1NDMuNTA5MDUyLDI1LjI2MjQzMDYgNTQ0Ljc4MTEzMywyNC44MDc1NTMxIDU0NS44MDUwNzIsMjQuMDM5NzE4MiBMNTQ4LjUwODExNCwyNi43NDA1NDgxIFogTTUzNy43NTE2MzksMTkuMTMxMjE1MyBDNTM3Ljc1MTYzOSwxNi43MTI1MTc3IDUzOS43MTIyMjcsMTQuNzUxNzc1OCA1NDIuMTMwNzM2LDE0Ljc1MTc3NTggQzU0NC41NDkyNDQsMTQuNzUxNzc1OCA1NDYuNTA5ODMzLDE2LjcxMjUxNzcgNTQ2LjUwOTgzMywxOS4xMzEyMTUzIEM1NDYuNTA5ODMzLDIxLjU0OTkxMyA1NDQuNTQ5MjQ0LDIzLjUxMDY1NDggNTQyLjEzMDczNiwyMy41MTA2NTQ4IEM1MzkuNzEyMjI3LDIzLjUxMDY1NDggNTM3Ljc1MTYzOSwyMS41NDk5MTMgNTM3Ljc1MTYzOSwxOS4xMzEyMTUzIFoiIGlkPSJMb3VwZS1JY29uIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=');
    background-repeat: no-repeat;
    background-position: right 14px center;
    max-width: 450px;
    font-size: 14px;
    float: right;

    @media (max-width: 767px) {
      max-width: 100%;
    }
  }
</style>
