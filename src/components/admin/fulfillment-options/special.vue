<template>
  <div v-if="$store.state.settings.layout != 'catalog'">
    <template v-if="order">
      <div>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-0 font-weight-bold">Special Order Items</h5>
            <div class="text-muted mr-5">
              Allow customers to order products available in your DC. You will need order the items from the warehouse and notifiy
              the customers when they arrive at your store.
            </div>
          </div>
          <div class="custom-control custom-switch">
            <input type="checkbox" v-model="order.special_enabled" class="custom-control-input" :id="`special_enabled-${store}`" @change="saveData">
            <label class="custom-control-label" :for="`special_enabled-${store}`" v-html="order.special_enabled ? 'Enabled' : 'Disabled'"></label>
          </div>
        </div>
      </div>
      <transition name="fadeHeight">
        <div class="overflow-hidden" v-if="order.special_enabled">
          <div class="card p-4 mt-3">
            <div>
              <div class="label font-weight-bold">Day Range to Pick Up Special Order</div>
              <p>
                Set Minimum and Maximum days for expected delivery from the Distribution Center to the store, including order processing. <small>Suggested default is 3-8 days, (15-30 AK/HI.)</small>
              </p>
            </div>
            <div class="my-2">
              <div class="label font-weight-bold mb-2">Edit Day Range</div>
              <div class="d-flex">
                <div class="mr-3">
                  <label :for="`specialMinDays-${store}`">Min Days</label>
                  <select :id="`specialMinDays-${store}`" class="form-control" v-model="order.special_order_sla_fields.min" @change="saveData">
                    <option v-for="i in 99" :value="i" :key="`minDays-${i}`">{{ i }}</option>
                  </select>
                </div>
                <div>
                  <label :for="`specialMaxDays-${store}`">Max Days</label>
                  <select :id="`specialMaxDays-${store}`" class="form-control" v-model="order.special_order_sla_fields.max" @change="saveData">
                    <option :disabled="i <= order.special_order_sla_fields.min" v-for="i in 99" :value="i" :key="`minDays-${i}`">{{ i }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 d-flex flex-column">
                <div class="label font-weight-bold mb-2">Customer Message on Special Order Product page</div>
                <div class="border flex-grow-1">
                  <div class="border-bottom font-weight-bold text-uppercase py-2 px-3">How to get it</div>
                  <div class="py-2 px-3">
                    <div class="d-flex align-items-center">
                      <div class="mr-3 text-primary">
                        <svg width="38" height="38" viewBox="0 0 50 50" class="d-none d-sm-inline" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fill-rule="evenodd"><path d="M49.025 49.18H.778A.773.773 0 010 48.412c0-.424.348-.769.778-.769h48.247c.43 0 .778.345.778.769a.773.773 0 01-.778.768z"/><path d="M3.89 49.18a.773.773 0 01-.777-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM45.912 49.18a.773.773 0 01-.778-.768v-29.2c0-.425.348-.77.778-.77.43 0 .778.345.778.77v29.2a.773.773 0 01-.778.768zM48.247 15.37a.778.778 0 01-.739-.526L43.017 1.537H6.787L2.294 14.844a.78.78 0 01-.985.485.766.766 0 01-.492-.972L5.488.525A.777.777 0 016.224 0h37.353c.335 0 .632.212.738.525l4.669 13.832a.766.766 0 01-.492.972.784.784 0 01-.246.04z"/><path d="M15.563 10.758h-1.556a.773.773 0 01-.778-.768c0-.425.348-.769.778-.769h1.556a.774.774 0 00.779-.768.774.774 0 00-.779-.769c-1.287 0-2.334-1.034-2.334-2.305 0-1.271 1.047-2.305 2.334-2.305h1.557c.43 0 .778.344.778.768a.773.773 0 01-.778.769h-1.557a.774.774 0 00-.778.768c0 .424.35.769.778.769 1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305zM20.232 10.758a.773.773 0 01-.778-.768V3.842c0-.424.349-.768.778-.768.43 0 .779.344.779.768V9.99a.773.773 0 01-.779.768z"/><path d="M23.345 7.684h-3.113a.773.773 0 01-.778-.768c0-.424.349-.768.778-.768h3.113c.43 0 .778.344.778.768a.773.773 0 01-.778.768z"/><path d="M23.345 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768.43 0 .778.344.778.768V9.99a.773.773 0 01-.778.768zM28.014 10.758c-1.287 0-2.334-1.034-2.334-2.305V5.379c0-1.271 1.047-2.305 2.334-2.305 1.287 0 2.335 1.034 2.335 2.305v3.074c0 1.271-1.048 2.305-2.335 2.305zm0-6.147a.774.774 0 00-.778.768v3.074c0 .423.35.768.778.768a.774.774 0 00.778-.768V5.379a.774.774 0 00-.778-.768zM32.683 10.758a.773.773 0 01-.778-.768V3.842c0-.424.348-.768.778-.768h1.556c1.288 0 2.335 1.034 2.335 2.305 0 1.271-1.047 2.305-2.335 2.305h-.778V9.99a.773.773 0 01-.778.768zm.778-4.61h.778a.774.774 0 00.779-.769.774.774 0 00-.779-.768h-.778v1.537zM3.89 19.98c-1.715 0-3.112-1.38-3.112-3.074V14.6c0-.424.349-.768.778-.768.43 0 .779.344.779.768v2.306c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M8.56 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M13.229 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M17.898 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M22.567 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M27.236 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M31.905 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M36.574 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M41.243 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.778-.768.43 0 .779.344.779.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 1.695-1.397 3.074-3.113 3.074z"/><path d="M45.912 19.98c-1.716 0-3.113-1.38-3.113-3.074v-.769c0-.424.349-.768.779-.768.43 0 .778.344.778.768v.769c0 .847.698 1.537 1.556 1.537.858 0 1.556-.69 1.556-1.537V14.6c0-.424.349-.768.779-.768.43 0 .778.344.778.768v2.306c0 1.695-1.397 3.074-3.113 3.074zM47.725 13.832H2.078a.773.773 0 01-.779-.768c0-.425.349-.769.779-.769h45.647c.43 0 .778.344.778.769a.773.773 0 01-.778.768zM41.243 49.18H30.349a.773.773 0 01-.779-.768V29.969c0-.424.349-.768.779-.768h10.894c.43 0 .778.344.778.768v18.443a.773.773 0 01-.778.768zm-10.116-1.537h9.338V30.738h-9.338v16.905zM27.236 41.496H8.56a.773.773 0 01-.778-.769V29.97c0-.424.348-.768.778-.768h18.676c.43 0 .778.344.778.768v10.758a.773.773 0 01-.778.769zM9.338 39.959h17.12v-9.221H9.338v9.221z"/><g><path d="M11.673 35.348a.78.78 0 01-.55-.225.761.761 0 010-1.086l1.556-1.537c.304-.3.796-.3 1.1 0 .304.3.304.786 0 1.086l-1.556 1.537a.78.78 0 01-.55.225z"/></g><g><path d="M13.229 37.654a.78.78 0 01-.55-.225.761.761 0 010-1.087l3.112-3.074c.304-.3.797-.3 1.1 0 .305.3.305.787 0 1.087l-3.112 3.074a.78.78 0 01-.55.225z"/></g><g><path d="M38.13 41.496a.824.824 0 01-.552-.223.802.802 0 01-.226-.546c0-.2.086-.4.226-.545.295-.285.817-.285 1.105 0 .14.146.225.345.225.545 0 .2-.085.4-.225.546a.825.825 0 01-.553.223z"/></g><g><path d="M38.908 7.684a.824.824 0 01-.552-.222.802.802 0 01-.226-.546c0-.208.086-.4.226-.546.296-.284.817-.284 1.105 0 .14.146.226.346.226.546 0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"/></g><g><path d="M10.894 7.684a.788.788 0 01-.552-.222.802.802 0 01-.226-.546c0-.2.086-.4.226-.546.288-.284.817-.284 1.105 0a.79.79 0 01.226.546c0 .2-.086.4-.226.546a.825.825 0 01-.553.222z"/></g></g></svg>
                      </div>
                      <div>
                        <h6 class="font-weight-bold mb-1">In-Store Pickup</h6>
                        Available for Special Order. Pickup in store in <b>{{ order.special_order_sla_fields.min }}-{{ order.special_order_sla_fields.max }} days</b>.
                        <!--<b-form-textarea v-model="options.pickup_pdp_message" placeholder="Optional message" class="mt-2" rows="1" max-rows="6" @blur="saveData('pickup')" />-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 d-flex flex-column">
                <div class="label font-weight-bold mb-2">Customer Mesage on Checkout</div>
                <div class="border flex-grow-1">
                  <div class="border-bottom font-weight-bold text-uppercase py-2 px-3">Special order items</div>
                  <div class="py-2 px-3">
                    Your item(s) will arrive in <b>{{ order.special_order_sla_fields.min }}-{{ order.special_order_sla_fields.max }} days</b>.
                    Subject to availability from our suppliers. If we cannot get the item, you will be notified and refunded.
                    <!--<b-form-textarea v-model="options.special_disclaimer" placeholder="Optional message" class="mt-2" rows="1" max-rows="6" @blur="saveData('special')" />-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
  import AdminService from '@/api-services/admin.service';
  import HomePageService from '@/api-services/homepage.service';
  export default {
    name: 'fulfillmentOptionsSpecial',
    props: {
      specialOrder: null,
      store: null,
      autosave: {
        default: true
      }
    },
    data() {
      return {
        order: null
      };
    },
    computed: {
      businessDetails() {
        return Object.entries(this.$store.state.businessDetails).length ? this.$store.state.businessDetails : null;
      }
    },
    async mounted() {
      if(!this.businessDetails) {
        let r = await HomePageService.getBusinessDetails();
        this.$store.commit('setBusinessDetails', r.data.data);
      }
      this.order = this.specialOrder ? { ...this.specialOrder } : {
        special_enabled: this.businessDetails.special_enabled,
        special_disclaimer: this.businessDetails.special_disclaimer,
        special_order_sla_fields: this.businessDetails.special_order_sla_fields
      };
      this.order.special_enabled = Number(this.order.special_enabled);
    },
    methods: {
      saveData() {
        if(this.autosave)
          this.save();
      },
      async save() {
        let callback = () => {};
        let data = this.order;
        await AdminService.updateFulfillmentSpecial({ enabled: this.order.special_enabled, disclaimer: this.order.special_disclaimer });
        callback = AdminService.updateSpecialSla(this.order.special_order_sla_fields);

        this.$store.commit('setBusinessDetails', { ...this.businessDetails, ...data });
        this.$emit('onSave', callback);
        return callback;
      },
      showError() {

      }
    }
  };
</script>

<style scoped lang="scss">
  .main-container {
    border: 1px solid #E2E8F0;
    background: #f8fafc;
    border-radius: 10px;
    h5 {
      font-size: 18px !important;
    }
  }
  .text-muted {
    color: #475569 !important;
  }
  .fadeHeight-enter-active,
  .fadeHeight-leave-active {
    transition: all 0.2s;
    max-height: 500px;
  }
  .fadeHeight-enter,
  .fadeHeight-leave-to
  {
    opacity: 0;
    max-height: 0px;
  }
</style>