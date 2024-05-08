<template>
  <router-link :to="urlFriendly" class="card card-primary item mb-1 p-3">
    <div v-if="!loaded" class="d-flex align-items-center justify-content-center w-100">
      <img src="/icons/loader.gif" class="loader" alt="Loading...">
    </div>
    <div :class="`flex-grow-1 align-items-center d-flex mb-3 justify-content-center ${!loaded ? 'd-none' : ''}`">
      <img
        :src="internalApi ? (item.image || '/images/default-img.svg') : (item.image_url || '/images/default-img.svg')"
        :alt="item.title | styleTitle" @load="loaded = true" class="product-image img-fluid"
      />
    </div>
    <div class="text-dark font-weight-bold mb-2">{{ item.title | styleTitle }}</div>
    <div class="small text-primary">
    </div>
  </router-link>
</template>

<script>
  export default {
    name: 'RentalItem',
    props: ['item', 'internalApi'],
    data() {
      return {
        loaded: false,
      };
    },
    computed: {
      urlFriendly() {
        return `/products/${this.item.slug}`;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .item {
    line-height: 1;
    height: 260px;
    &:hover {
      text-decoration: none;
    }
    cursor: pointer;
    img {
      max-height: 174px;
    }
  }
</style>
