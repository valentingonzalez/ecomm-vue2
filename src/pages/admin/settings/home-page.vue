<template>
  <div class="bg-white  h-100">
    <div class="px-md-5 d-flex pt-md-4 pb-3 mb-3 border-bottom justify-content-between align-items-center heading">
      <h1 class="h4 mb-0">Home Page Settings</h1>
      <button class="btn btn-primary save-btn" @click="saveData">
        <span v-if="saving" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
        <span v-if="!saving">Save</span>
        <span v-else>Saving...</span>
      </button>
    </div>
    <div class="px-5 pb-5 mt-4">
      <p>
        Set what you'd like to have appear on your front page.
      </p>
      <form id="socialInputs">
        <div class="row">
          <div class="form-group col-sm-6">
            <label>Enter Brand You'd Like To Display</label>
            <multiselect
              v-model="selectedBrands"
              :options="brands"
              :multiple="true"
              placeholder="Enter Brand You'd Like To Display"
              label="brand_name"
              track-by="brand_id">
            </multiselect>
          </div>
          <div class="form-group col-sm-6">
            <label>Enter Departments You'd Like To Display</label>
            <multiselect
              v-model="selectedDepartments"
              :options="departments"
              :multiple="true"
              placeholder="Enter Departments You'd Like To Display"
              label="name"
              track-by="dept_id">
            </multiselect>
          </div>
        </div>
        <div class="row mt-4 border-top border-gray pt-5">
          <div class="form-group col-sm-6">
            <label>Number Of Products To Display Per Category</label>
            <input type="number" class="form-control" v-model="settingsValue.products_per_category" placeholder="Enter number greater than zero" />
          </div>
          <div class="form-group col-sm-6">
            <label>Minimum Price A Product Must Be To Display</label>
            <input type="number" class="form-control" v-model="settingsValue.minimum_price" placeholder="Minimum Product Price (ex: .50 or 2.00)" />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import Multiselect from 'vue-multiselect';
  
  export default {
    name: 'HomePageSettings',
    components: { Multiselect },
    data() {
      return {
        settingsValue: {
          products_per_category: 8,
          departments: [],
          brands: [],
          minimum_price: 1
        },
        brands: [],
        departments: [],
        enteredBrands: "",
        Brands: "",
        enteredDepartments: "",
        selectedBrands: [],
        selectedDepartments: [],
        saving: false
      };
    },
    async mounted() {
      await this.getBrands();
      await this.getDepartments();
      await this.getSettings();
    },
    methods: {
      async getSettings(){
        AdminService.getHomePageSettings()
        .then((resp) => {
          let data = resp.data;
          this.selectedBrands = data.settings.brands;
          this.selectedDepartments = data.settings.departments;
          this.settingsValue = data.settings;
        });
      },
      getBrands(){
        AdminService.getHomePageBrands().then((resp) => {
          let data = resp.data.data;
          this.brands = data;
        });
      },
      getDepartments(){
        AdminService.getHomePageDepartments().then((resp) => {
          let data = resp.data;
           this.departments = data.departments;
        });
      },
      saveData() {
        this.saving = true;
        let data = {
          products_per_category: this.settingsValue.products_per_category, 
          minimum_price: this.settingsValue.minimum_price, 
          departments: this.selectedDepartments, 
          brands: this.selectedBrands
        };
        AdminService.updateHomePageSettings(data).then(() => {
          this.getSettings();
          this.saving = false;
        });
       //   AdminService.updateSocialLink({type: evt.target.id, url: evt.target.value});
      }
    }
  };
</script>

<style lang="scss" scoped>
  
  #socialInputs {
    input[type=text] {
      width: 100%;
    }
    .social-img {
      width: 100px;
      display: flex;
      justify-content: center;
      + .form-group {
        width: 290px;
      }
    }
  }
  .valid input {
    border-color: var(--primary);
  }
  .form-group--error input {
    border-color: red;
  }

  @media (max-width: 500px) {
    #socialInputs {
      .social-img {
        width: 40px;
        display: none;
        img {
          width: 100%;
        }
      }
      .social-img + .form-group {
        flex: 1;
      }
    }
  }
</style>

