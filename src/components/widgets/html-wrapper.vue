<template>
  <section class="html widget">
    <div v-html="html" />
  </section>
</template>
<script>

export default {
  name: 'HtmlWrapper',
  props: {
    id: {
      default: null
    },
    value: {
      default: null
    }
  },
  data() {
    return {
    };
  },
  computed: {
    html() {
      let ret = '';
      if(this.value && this.value.blocks)
        this.value.blocks.forEach(e => ret += e);
      return ret;
    }
  },
  created() {
  },
};
</script>
<style scoped src="../../assets/scss/froala.scss" lang="scss" />

