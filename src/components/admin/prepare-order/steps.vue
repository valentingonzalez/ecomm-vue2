<template>
  <div>
    <div class="step-wrapper">
      <div
        v-if="tabs[0] && ($route.query.step == tabs[0].step || $route.query.step == '#' || $route.query.step == '' || !$route.query.step)">
        <prepareOrderList :parcelType="parcelType" :order="order" :loading="loading" @getOrder="getOrder" />
      </div>
      <div class="steps" v-if="tabs[1] && $route.query.step == tabs[1].step && $route.query.step == 'evaluation'">
        <prepareOrderEvaluation :parcelType="parcelType" :order="order" />
      </div>
      <div class="steps" v-if="tabs[2] && $route.query.step == tabs[2].step && $route.query.step == 'package'">
        <prepareOrderPackage :parcelType="parcelType" :order="order" />
      </div>
      <div class="steps" v-if="tabs[3] && $route.query.step == tabs[3].step && $route.query.step == 'enterInPos'">
        <prepareOrderEnterInPos ref="pos" :order="order" v-if="order" />
      </div>
      <div class="steps"
        v-if="tabs[tabs.length - 1] && $route.query.step == tabs[tabs.length - 1].step && $route.query.step == 'markAsPrepared'">
        <prepareOrderMarkAsPrepared ref="pos" :order="order" />
      </div>
      <!--<div v-if="tabs[2] && $route.query.step == tabs[2].step || $route.query.step == '#markAsPrepared'">
        <div class="success-box">
          <div class="img-suc">
            <img src="/icons/success.png"/>
            <h5>Success!</h5>
            <p>
              You’ve finished preparing your order.
              You may now mark your order as prepared and inform the customer.
              Job well done!
            </p>
          </div>
          <div v-if="parcelType == 'delivery' && $store.state.settings.businessSlug != 'jLNYdkQ91o5x78Da'" class="col-auto mb-3">
            <label class="sr-only" for="inlineFormInputGroup">Username</label>
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <div class="input-group-text flex flex-column">
                  <span>Delivery Time</span>
                  <span class="text-muted"><small>(minutes)</small></span>
                </div>
              </div>
              <input type="number" v-model="deliveryTime" class="form-control py-0 h-auto delivery-time" id="inlineFormInputGroup" placeholder="00">
            </div>
          </div>
          <button class="btn btn-primary w-100" @click="markAsPrepared()" :disabled="parcelType == 'delivery' && (deliveryTime == null || deliveryTime == '')  && $store.state.settings.businessSlug != 'jLNYdkQ91o5x78Da'">
            <b-spinner v-if="preparing" label="Spinning" style="width: 1rem; height: 1rem"></b-spinner>
            <span v-else-if="order.order_type == 'doitbest' && false">Send order to Doitbest</span>
            <span v-else>Mark as Prepared</span>
          </button>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>

  import prepareOrderList from '@/components/admin/prepare-order/list.vue';
  import prepareOrderPackage from '@/components/admin/prepare-order/package.vue';
  import prepareOrderEvaluation from '@/components/admin/prepare-order/evaluation.vue';
  import prepareOrderEnterInPos from '@/components/admin/prepare-order/pos.vue';
  import prepareOrderMarkAsPrepared from '@/components/admin/prepare-order/markAsPrepared.vue';


  export default {
    name: 'prepareOrderSteps',
    props: ['tabs', 'parcelType', 'order', 'loading'],
    components: {
      prepareOrderList,
      prepareOrderEvaluation,
      prepareOrderPackage,
      prepareOrderEnterInPos,
      prepareOrderMarkAsPrepared,
    },
    methods: {
      getOrder() {
        this.$emit('getOrder');
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
