<template>
  <div v-if="$ezHasNoPermission('admin_account')">
    <no-permission-truevalue page="User Inputs"></no-permission-truevalue>
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="preloader"></div>
    <div class="settings-header">
      <div class="settings-header-info">
        <h1>User Inputs</h1>
        <button class="btn btn-primary save-btn" @click="saveData">
          <span v-if="saving" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
          {{ !saving ? 'Save' : 'Saving...' }}
        </button>
      </div>
      <div style="margin-right:auto">
        <a @click="$refs.tutorialModal.show()" class="btn btn-tutorial mt-2 btn-sm text-small bg-white btn-action">
          <i class="fa fa-play mr-1"></i>
          Click to Watch Tutorial Video
        </a>
      </div>
      <b-modal size="lg" ref="tutorialModal">
                <div slot="modal-header">
                  <h5>User Inputs</h5>
                </div>
                <div>
                  <video class="w-100" poster="/images/cover-user-inputs.png" controls>
                    <source src="https://storage.googleapis.com/content.ezadtv.com/2024/04/01/660ae0d5a8f51_User_Inputs_Feature.m4v" type="video/mp4">
                  </video>
                </div>
                <div slot="modal-footer">
                  <button type="button" class="btn btn-primary" @click="$refs.tutorialModal.hide()">Done</button>
                </div>
      </b-modal>
    </div>
    <div class="settings-body">
      <div class="dynamic-form" role="tablist">
        <!-- SIGN UP FORM FIELDS -->

        <b-card no-body>
          <b-card-header header-tag="header" role="tab">
            <b-button block v-b-toggle.accordion-signup variant="default">Sign Up</b-button>
          </b-card-header>
          <b-collapse id="accordion-signup" visible accordion="main-accordion" role="tabpanel">
            <b-card-body>
              <b-card-text>
                <admin-form-custom-fields :fields.sync="customFields.signup" category="signup"
                  @addField="saveField($event)" @updateField="updateField($event)" @removeField="removeField($event)" />
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>

        <!-- CART SECTION -->
        <b-card no-body>
          <b-card-header header-tag="header" role="tab">
            <b-button block v-b-toggle.accordion-cart variant="default">Cart</b-button>
          </b-card-header>
          <b-collapse id="accordion-cart" accordion="main-accordion" role="tabpanel">
            <b-card-body>
              <b-card-text>
                <admin-form-custom-fields :fields.sync="customFields.cart" category="cart" @addField="saveField($event)"
                  @updateField="updateField($event)" @removeField="removeField($event)" />
              </b-card-text>
              <div role="tablist">

                <!-- PICKUP -->
                <b-card no-body class="mb-1">
                  <b-card-header header-tag="header" role="tab">
                    <b-button block v-b-toggle.accordion-pickup variant="default">Pickup</b-button>
                  </b-card-header>
                  <b-collapse id="accordion-pickup" visible accordion="cart-accordion" role="tabpanel">
                    <b-card-body>
                      <admin-form-custom-fields :fields.sync="customFields.pickup" category="pickup"
                        @addField="saveField($event)" @updateField="updateField($event)"
                        @removeField="removeField($event)" />
                    </b-card-body>
                  </b-collapse>
                </b-card>

                <!-- DELIVERY -->
                <b-card no-body class="mb-1">
                  <b-card-header header-tag="header" role="tab">
                    <b-button block v-b-toggle.accordion-delivery variant="default">Delivery</b-button>
                  </b-card-header>
                  <b-collapse id="accordion-delivery" accordion="cart-accordion" role="tabpanel">
                    <b-card-body>
                      <admin-form-custom-fields :fields.sync="customFields.delivery" category="delivery"
                        @addField="saveField($event)" @updateField="updateField($event)"
                        @removeField="removeField($event)" />
                    </b-card-body>
                  </b-collapse>
                </b-card>

                <!-- SHIPPING -->
                <b-card no-body class="mb-1">
                  <b-card-header header-tag="header" role="tab">
                    <b-button block v-b-toggle.accordion-shipping variant="default">Shipping</b-button>
                  </b-card-header>
                  <b-collapse id="accordion-shipping" accordion="cart-accordion" role="tabpanel">
                    <b-card-body>
                      <admin-form-custom-fields :fields.sync="customFields.shipping" category="shipping"
                        @addField="saveField($event)" @updateField="updateField($event)"
                        @removeField="removeField($event)" />
                    </b-card-body>
                  </b-collapse>
                </b-card>
              </div>
            </b-card-body>
          </b-collapse>
        </b-card>

        <!-- RENTAL FORM FIELDS -->
        <b-card no-body>
          <b-card-header header-tag="header" role="tab">
            <b-button block v-b-toggle.accordion-rental variant="default">Rental</b-button>
          </b-card-header>
          <b-collapse id="accordion-rental" visible accordion="main-accordion" role="tabpanel">
            <b-card-body>
              <b-card-text>
                <admin-form-custom-fields :fields.sync="defaultFields.rental" category="rental_default"
                  :is_editable=false />
                <admin-form-custom-fields :fields.sync="customFields.rental" category="rental"
                  @addField="saveField($event)" @updateField="updateField($event)" @removeField="removeField($event)" />
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>

      </div>
    </div>
  </div>
</template>

<script>
import AdminApiService from '@/api-services/admin.service';
import NoPermissionTruevalue from "./no-permission-truevalue";

export default {
  name: 'DynamicForms',
  components: {
    NoPermissionTruevalue
  },
  data() {
    return {
      saving: false,
      save_cart: null,
      customFields: {
        'signup': [],
        'cart': [],
        'pickup': [],
        'delivery': [],
        'shipping': [],
        'rental':[]
      },
    defaultFields: {
      'signup': [],
      'cart': [],
      'pickup': [],
      'delivery': [],
      'shipping': [],
      'rental':[
      {
        "name": "yourname",
        "label": "Your Name",
        "type": "text",
        "placeholder": "Your Name",
        "required": true,
        "options": []
      },
      {
        "name": "youremail",
        "label": "Your Email",
        "type": "text",
        "placeholder": "Your Email",
        "required": true,
        "options": []
      },
      {
        "name": "phonenumber",
        "label": "Phone Number",
        "type": "text",
        "placeholder": "Phone Number",
        "required": true,
        "options": []
      },
      {
        "label": "Preferred Method of Contact",
        "type": "select",
        "placeholder": "",
        "required": true,
        "options": [
        {
          "value": "Email",
          "text": "Email"
        },
        {
          "value": "Phone",
          "text": "Phone"
        }
        ],
        "name": "preferred_method_of_contact"
      },
      {
        "label": "Which of our locations is most convenient for you?",
        "type": "select",
        "placeholder": "",
        "required": true,
        "options": [
        ],
        "name": "which_of_our_locations_is_most_convenient_for_you"
      },
      {
        "label": "Rental Dates",
        "type": "date",
        "placeholder": "",
        "required": true,
        "options": [],
        "name": "datepicker_rental_dates"
      }
      ]
    }
    };
  },
  created() {
    // Remove this options only for Allendale
    if(this.$store.state.businessDetails.business_slug == '36L2AHRD3ZM4SLWF') {
      this.$delete(this.defaultFields.rental, this.defaultFields.rental.findIndex(e => e.name == 'preferred_method_of_contact'));
      this.$delete(this.defaultFields.rental, this.defaultFields.rental.findIndex(e => e.name == 'which_of_our_locations_is_most_convenient_for_you'));
    }
  },
  async mounted() {
    if(this.$ezHasNoPermission('edit_user_inputs')) return;
    await this.getFormFields();
  },
  methods: {
    async getFormFields() {
      await AdminApiService.getFormFields().then(response => {
        if (response.data.custom_fields) {
          this.customFields = response.data.custom_fields;
          // Remove this options only for Allendale
          if(this.$store.state.businessDetails.business_slug == '36L2AHRD3ZM4SLWF') {
            this.$delete(this.customFields.rental, this.customFields.rental.findIndex(e => e.name == 'preferred_method_of_contact'));
            this.$delete(this.customFields.rental, this.customFields.rental.findIndex(e => e.name == 'which_of_our_locations_is_most_convenient_for_you'));
          }
        }
      });
    },
    saveData() {
      this.saving = true;
      AdminApiService.saveCart(this.save_cart).then(() => {
          this.$swal("Save Cart Updated", '', 'success');
          this.saving = false;
        }),
        AdminApiService.saveFormFields(this.customFields).then(() => {
          this.$swal("Form Data Updated", '', 'success');
          this.saving = false;
        });
    },
    saveField(data) {
      this.customFields[data.category].push(Object.assign({}, data.field));
    },
    updateField(data) {
      this.customFields[data.category][data.index] = Object.assign({}, data.field);
    },
    removeField(data) {
      this.customFields[data.category].splice(data.index, 1);
    }
  }
};
</script>

<style lang="scss">
.dynamic-form {
  .card {
    .card-body {
      .list-group-item.btn-group {
        padding: 0;
        border: none;
        margin-bottom: 0;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.dynamic-form {
  .card {
    margin-bottom: 8px !important;
    border-radius: 5px;
    border: 1px solid #e8e8e8;
    box-shadow: 0 2px 6px rgba(34, 44, 73, 0.05);
    .card-header {
      padding: 0;
      border: none;
      border-bottom: 1px solid #e8e8e8;
      button {
        border-radius: 5px 5px 0 0;
        background: white;
        font-weight: bold;
        text-transform: uppercase;
        justify-content: flex-start;
        border: none;
        &:before {
          content: '';
          width: 8px;
          height: 8px;
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          border-left: 4px solid var(--primary);
          margin-right: 8px;
        }
        &.collapsed {
          border-radius: 5px;
        }
        &:not(.collapsed) {
          &:before {
            border-top: 4px solid var(--primary);
            border-right: 4px solid transparent;
            border-left: 4px solid transparent;
            margin-top: 4px;
          }
        }
      }
    }
  }
}

.button {
  margin-top: 35px;
}

.close {
  float: right;
  padding-top: 8px;
  padding-bottom: 8px;
}

input {
  display: inline-block;
  width: 50%;
}

.text {
  margin: 15px;
  float: left;
}

.header {
  font-weight: bold;
}
</style>
