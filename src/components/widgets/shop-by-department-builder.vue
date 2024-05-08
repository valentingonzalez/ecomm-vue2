<template>
  <div class="position-relative widget-builder">
    <div class="handle">
      <svg width="9" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M3 12v3H0v-3h3zm6 0v3H6v-3h3zM3 6v3H0V6h3zm6 0v3H6V6h3zM3 0v3H0V0h3zm6 0v3H6V0h3z" fill="#BCBCBC" fill-rule="evenodd"/></svg>
    </div>
    <ShopByDepartment
      :departments="departmentList"
      :ref="`swiper-${id}`"
      :id="id"
      :editable="true"
      :title="title"
      :loop="false"
      :hidden="hidden"
      :master="master"
      :associatedLocations="associatedLocations"
      @updateIcon="updateIcon"
      @updateTileTitle="updateTileTitle"
      @updateHidden="updateHidden"
      @updateAssociatedLocations="updateAssociatedLocations"
      @updateTitle="updateTitle"
      @remove="remove"
      @removeItem="removeItem"
      @onSelected="onAdd"
      @onReorder="onReorder" />
  </div>
</template>

<script>
import DepartmentsService from '@/api-services/departments.service';
import widgetsApiService from '@/api-services/widgets.service';
import { defaultParentDepartments } from '@/plugins/data-sets/deptsWidgetDefaultParentDepts';
import ShopByDepartment from '@/components/widgets/shop-by-department.vue';

export default {
  name: 'DepartmentWidgetBuilder',
  props: {
    id: {
      default: null
    },
    value: {
      default: null
    },
    master: {
      default: false
    },
    widget: {
      default: null
    }
  },
  components: {
    ShopByDepartment
  },
  data() {
    return {
      selectedParentDepartment: 0,
      selectedDepartment: 0,
      selectedChildDepartment: 0,
      loading: false,
      departmentList: [],
      title: '',
      loop: true,
      hidden: true,
      associatedLocations: null
    };
  },
  created() {
    this.$store.state.searchResults = '';
    let data = this.value ? typeof this.value == 'string' ? JSON.parse(this.value) : this.value : [];
    this.departmentList = data.departmentList || [];
    this.title = data.title;
    this.loop = data.loop;
    this.hidden = data.hidden;
    this.associatedLocations = this.widget.associated_locations || null;
  },
  computed: {
    parentDepartments() {
      return this.$store.state.departments || null;
    },
    departments() {
      let ret = [];
      if(this.parentDepartments && this.parentDepartments.filter(e => e.dept_id == this.selectedParentDepartment)[0])
        ret = this.parentDepartments.filter(e => e.dept_id == this.selectedParentDepartment)[0].children || [];
      return [{dept_id: 0, name: 'All'}, ...ret];
    },
    childrenDepartments() {
      let ret = [];
      if(this.departments && this.departments.filter(e => e.dept_id == this.selectedDepartment)[0])
        ret = this.departments.filter(e => e.dept_id == this.selectedDepartment)[0].children || [];
      return [{dept_id: 0, name: 'All'}, ...ret];
    },
  },
  methods: {
    reset() {
      this.departmentList = [];
      this.updateWidget();
    },
    addItems(items) {
      items = Object.prototype.toString.call(items) == '[object Array]' ? items : [items];
      this.departmentList.push(...items);
      if(items.length == 1 && this.$refs.length) {
        if(this.$refs[`swiper-${this.id}`].loop) {
          if(this.$refs[`swiper-${this.id}`].currentPage < this.departmentList.length - (this.$refs[`swiper-${this.id}`].visibleItems - 1))
            this.$refs[`swiper-${this.id}`].currentPage = this.departmentList.length - (this.$refs[`swiper-${this.id}`].visibleItems - 1);
        } else {
          this.$refs[`swiper-${this.id}`].currentPage = this.$refs[`swiper-${this.id}`].lastPage;
        }
      }
      this.$swal({
        toast: true,
        position: 'top',
        type: 'success',
        html: `<div class="ml-2">Department${items.length > 1 ? 's' : ''} added to widget</div>`,
        showConfirmButton: false,
        timer: 3000
      });
      this.updateWidget(true);
    },
    async onAdd(selected) {
      if(this.departmentList.find(element => element.name == selected.item.name)){
        this.$swal({
          title: 'This tile has been added already',
          type: 'error',
        });
        return;
      };
      if(selected.item.image_url === null) {
        selected.item.image_url = "https://storage.googleapis.com/content.ezadtv.com/2023/03/21/6419e0523a17b_img_placeholder.svg";
      }
      if(Array.isArray(this.departmentList)) {
        this.addItems(selected.item);
      }
      if(this.$refs.length) {
        this.$refs[`swiper-${this.id}`].$refs.search.$refs.autocomplete.searchInput = '';
      }
    },
    remove() {
      this.$swal({
        title: 'Remove Widget',
        html: `Are you sure you want to remove this widget?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          this.$emit('remove', this.id);
        }
      });
    },
    updateTitle(value) {
      if(this.title != value) {
        this.title = value;
        this.updateWidget();
      }
    },
    updateLoop(value) {
      if(this.loop != value) {
        this.loop = value;
        this.updateWidget();
      }
    },
    updateHidden(value) {
      if(this.hidden != value) {
        this.hidden = value;
        this.updateWidget();
      }
    },
    updateAssociatedLocations(value) {
      if(this.associatedLocations != value) {
        this.associatedLocations = value;
        this.updateWidget();
      }
    },
    updateTileTitle(value) {
      this.departmentList.find(element => element.name == value.departmentName);
      this.departmentList = this.departmentList.map((item) => {
          if (item.name === value.departmentName) {
            item.custom_tile_name = value.customTileName;
          }
          return item;
      });
      this.updateWidget();
    },
    updateIcon(value) {
      this.departmentList.find(element => element.name == value.departmentName);
      this.departmentList = this.departmentList.map((item) => {
          if (item.name === value.departmentName) {
            item.image_url = value.selectedIcon;
            item.svg_custom_color = value.colorFilter;
            item.hex_color = value.hexColor;
          }
          return item;
      });
      this.updateWidget();
    },
    async updateWidget(adding) {
      let ob = {
        id: this.id,
        value: JSON.stringify({ title: this.title, loop: this.loop, hidden: this.hidden, departmentList: this.departmentList }),
        associated_locations: this.associatedLocations
      };
      await widgetsApiService.update(ob).then(() => {
        if(adding) {
          //this.$refs[`swiper-${this.id}`].swiper.slideTo(this.departmentList.length);
        }
      });
      this.$store.commit('updateWidget', ob);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
      this.$swal({
        toast: true,
        position: 'top',
        type: 'success',
        html: `<div class="ml-2">Widget successfully updated</div>`,
        showConfirmButton: false,
        timer: 3000
      });
    },
    removeItem(item) {
      this.$swal({
        title: 'Remove Tile',
        html: `Are you sure you want to remove this tile from the widget?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          this.departmentList.splice(this.departmentList.findIndex(i => i.name == item.name), 1);
          this.updateWidget();
        }
      });
    },
    onReorder(list) {
      this.departmentList = list;
      this.updateWidget();
    },
    async searchByDepartment(id) {
      this.loading = true;
      await this.$store.dispatch('clearSearch');
      await this.$store.dispatch('search', { dept_id: id, search: '""' });
      this.loading = false;
    },
    mapDeptIdsToDefaultParentDepts(defaultParentDepartments, parentDepartments) {
      const mappedTiles = defaultParentDepartments.map((tile) => {
        const dept = parentDepartments.find(
          (department) => department.name.toLowerCase() === tile.item.name.toLowerCase()
        );
        if (dept) {
          return {
            ...tile,
            type: 'default-section',
            name: 'departments',
            liClass: undefined,
            label: 'Departments, Classes and Finelines',
            item: {
            ...tile.item,
            dept_id: dept.dept_id,
            },
          };
        }
      });
      return mappedTiles.filter(e => e !== undefined);
    },
    async getDefaultTiles() {
      const transformedTiles = this.mapDeptIdsToDefaultParentDepts(defaultParentDepartments, this.parentDepartments);
      transformedTiles.forEach(department => this.onAdd(department));
    }
  },
  async mounted() {
    if(!this.parentDepartments) {
      let response = await DepartmentsService.getAllDepartments();
      this.$store.commit('saveDepartments', response.data.data.departments);
    }
    this.selectedParentDepartment = this.parentDepartments[0].dept_id;
    if(!this.departmentList.length) {
      this.getDefaultTiles();
    }
  },
  watch: {
    async selectedParentDepartment() {
      this.selectedDepartment = 0;
      this.searchByDepartment(this.selectedParentDepartment);
    },
    async selectedDepartment(val) {
      this.selectedChildDepartment = 0;
      if(val != 0) {
        this.searchByDepartment(this.selectedDepartment);
      }
    },
    async selectedChildDepartment(val) {
      if(val != 0) {
        this.searchByDepartment(this.selectedChildDepartment);
      }
    },
    async selectedCategory(val) {
      await this.$store.dispatch('clearSearch');
      if(val == 'departments') {
        this.selectedDepartment = 0;
        this.selectedChildDepartment = 0;
        this.selectedParentDepartment = this.parentDepartments[0].dept_id;
        this.searchByDepartment(this.selectedParentDepartment);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
  :deep(.swiper) {
    .swiper-button-prev,
    .swiper-button-next {
      width: 30px;
      height: 30px;
      background-size: 30px 30px;
    }
    .swiper-button-prev {
      left: -38px;
    }
    .swiper-button-next {
      right: -38px;
    }
  }
  .spinner-wrapper {
    min-height: 150px;
  }
</style>

