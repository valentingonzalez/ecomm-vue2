<template>
  <section class="p-0">
    <div class="category-wrapper">
      <h5 class="pb-3 text-capitalize">{{department.grand_parent.name.toLowerCase()}}</h5>
      <div class="card card-primary mb-4"
           v-for="parent in ((showMoreDepartments && department.grand_parent.parent.length > 2) ? department.grand_parent.parent.slice(0, 2) : department.grand_parent.parent)"
           :key="parent.dept_id">
        <div class="card-header d-flex justify-content-between bg-white">
          <h6 class="text-capitalize">{{parent.name.toLowerCase()}}</h6>
        </div>
        <department-slider :parent="parent"></department-slider>
      </div>
    </div>
    <button class="expand-btn" v-if="department.grand_parent.parent.length > 2" @click="showMoreDepartments = !showMoreDepartments">
      {{(showMoreDepartments) ? 'Expand' : 'Collapse'}}
      <img :class="{'show-more': showMoreDepartments, 'show-less': !showMoreDepartments}" src="/icons/arrow-right-green.svg" class="ml-2" alt="Toggle Show Departments">
    </button>
  </section>

</template>

<script>
  export default {
    name: 'departmentCategory',
    props: ['department'],
    data() {
      return {
        showMoreDepartments: true
      };
    }
  };
</script>
