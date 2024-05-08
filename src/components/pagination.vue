<template>
  <div class="d-flex" v-if="pagesArray && pagesArray.length && pages > 1">
    <router-link rel="first" class="link" :to="{ path: $route.path, query: { ...$route.query, page: 1 }}" :class="{ 'disabled': currentPage == 1 }">
      <svg width="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" /></svg>
    </router-link>
    <router-link rel="prev" class="link" :to="{ path: $route.path, query: { ...$route.query, page: currentPage - 1 }}" :class="{ 'disabled': currentPage == 1 }">
      <svg width="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
    </router-link>
    <!-- Dynamic Pages-->
    <router-link class="link" v-for="(p, i) in filteredPages" :key="i" :to="{ path: $route.path, query: { ...$route.query, page: p }}" :class="{ 'active': p == currentPage, 'disabled': p == '...' }" :tabindex="p == '...' ? -1 : 0">{{ p }}</router-link>
    <!-- END Dynamic Pages-->
    <router-link rel="next" class="link" :to="{ path: $route.path, query: { ...$route.query, page: currentPage + 1 }}" :class="{ 'disabled': currentPage >= pages }">
      <svg width="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
    </router-link>
    <router-link rel="last" class="link" :to="{ path: $route.path, query: { ...$route.query, page: pages }}" :class="{ 'disabled': currentPage >= pages }">
      <svg width="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'VuePagination',
    props: {
      pages: {
        required: true
      },
      maxPages: {
        default: 3
      }
    },
    data() {
      return {
      };
    },
    computed: {
      currentPage() {
        return Number(this.$route.query.page) || 1;
      },
      filteredPages() {
        const startPage = Math.max(this.currentPage - this.maxPages + 1, 1);
        const endPage = Math.min(this.currentPage + this.maxPages - 1, this.pages);

        let arr = [];

        if (startPage > 1) {
          arr.push(1);
          if (startPage > 2) {
            arr.push('...');
          }
        }

        for (let i = startPage; i <= endPage; i++) {
          arr.push(i);
        }

        if (endPage < this.pages) {
          if (endPage < this.pages - 1) {
            arr.push('...');
          }
          arr.push(this.pages);
        }

        return arr;
      },
      pagesArray() {
        return [...Array(this.pages).keys()].map(e => e + 1);
      }
    },
  };
</script>

<style lang="scss" scoped>
  .link {
    position: relative;
    display: block;
    flex-grow: 1;
    margin-left: -1px;
    color: var(--primary);
    background: #fff;
    border: 1px solid #dee2e6;
    width: 36px;
    min-width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      text-decoration: none;
    }
    &.active {
      background: var(--primary);
      border-color: var(--primary);
      color: #fff;
    }
  }
</style>