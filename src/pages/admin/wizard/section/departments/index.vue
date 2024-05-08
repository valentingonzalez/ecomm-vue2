<template>
  <div>
    <template v-if="currentStep == 1">
      <WizardDepartmentsHierarchy :ref="`step-${currentStep}`" />
    </template>
    <template v-if="currentStep == 2">
      <WizardDepartmentsDisplayed :ref="`step-${currentStep}`" />
    </template>
    <template v-if="currentStep == 3">
      <WizardDepartmentsRenameAndMerge :ref="`step-${currentStep}`" />
    </template>
    <template v-if="(currentStep == 4)">
      <WizardDepartmentsGenericSettings :settingsKey="'hidePrice'" :ref="`step-${currentStep}`" :key="`step-${currentStep}`" />
    </template>
    <template v-if="(currentStep == 5)">
      <WizardDepartmentsGenericSettings :settingsKey="'disableOrdering'" :ref="`step-${currentStep}`" :key="`step-${currentStep}`" />
    </template>
    <template v-if="(currentStep == 6)">
      <WizardDepartmentsGenericSettings :settingsKey="'disableDelivery'" :ref="`step-${currentStep}`" :key="`step-${currentStep}`" />
    </template>
    <template v-if="(currentStep == 7)">
      <WizardDepartmentsGenericSettings :settingsKey="'hideQuantity'" :ref="`step-${currentStep}`" :key="`step-${currentStep}`" />
    </template>
    <template v-if="(currentStep == 8)">
      <WizardDepartmentsGenericSettings :settingsKey="'disableShipping'" :ref="`step-${currentStep}`" :key="`step-${currentStep}`" />
    </template>
  </div>
</template>

<script>
  import WizardDepartmentsHierarchy from '@/components/admin/departments/hierarchy';
  import WizardDepartmentsDisplayed from '@/components/admin/departments/displayed';
  import WizardDepartmentsRenameAndMerge from '@/components/admin/departments/rename-and-merge';
  import WizardDepartmentsGenericSettings from '@/components/admin/departments/generic-settings';

  export default {
    name: 'WizardDepartmentsOptions',
    components: {
      WizardDepartmentsHierarchy,
      WizardDepartmentsDisplayed,
      WizardDepartmentsRenameAndMerge,
      WizardDepartmentsGenericSettings
    },
    props: {
      id: {
        default: null
      }
    },
    data() {
      return {
      };
    },
    computed: {
      currentStep() {
        return (this.$parent.step ? this.$parent.step.order : null) || 1;
      }
    },
    methods: {
      async save() {
        return await this.$refs[`step-${this.currentStep}`].save();
      },
    }
  };
</script>

