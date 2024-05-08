<template>
  <form @submit.prevent="toSearchPage" class="search-form">
    <search-suggestions
      id="search-departments"
      @onSelected="searchInputSelected"
      @onSuggestion="onSuggestion"
      @onInputChange="onSearchInputChange"
    />

    <button type="submit" class="btn-search-custom" aria-label="Search">
      <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" > <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" > <g id="search" transform="translate(1.000000, 1.000000)" stroke="#F46526" stroke-width="2" > <circle id="Oval" cx="6" cy="6" r="6"></circle> <line x1="14" y1="14" x2="10.242" y2="10.242" id="Path"></line> </g> </g> </svg>
    </button>
  </form>
</template>

<script>
import searchSuggestions from "@/components/search-suggestions";
import TrackerApiService from '@/api-services/tracker.service';

export default {
  name: "searchInput",
  components: {
    searchSuggestions
  },
  data() {
    return {
        searchKey: '',
    };
  },
  methods: {
    onSuggestion(text) {
      if (text == "" || text == undefined) return;
      this.searchKey = text;
    },
    searchInputSelected(selected) {
      if (!selected) {
        this.toSearchPage();
        return;
      }
      switch (selected.name) {
        case "products":
          this.searchKey = "";
          this.$router
            .push({
              name: "products-id",
              params: {
                id: selected.item.sku,
                title: selected.item.title.replace(/[ /]/g, "+")
              }
            })
            .catch(err => console.log(err));
          break;
        case "departments":
          this.$router
            .push({
              name: "department-products",
              params: { id: selected.item.dept_id, title: selected.item.name }
            })
            .catch(err => console.log(err));
          break;
        case "brands":
          this.searchKey = "";
          this.$router.push(`/brands/${selected.item.brand_id}`).catch(err => console.log(err));
          break;
        default:
          break;
      }
    },
    onSearchInputChange(searchKey) {
      this.searchKey = searchKey;
    },
    toSearchPage(id, type) {
      if (!this.searchKey) return;

      let showInStock = this.$store.state.settings.products.filterShowOutOfStock ? 0 : 1;
      let sortBy = this.$route.query.sort || this.$store.state.settings.products.defaultSorting;

      if (this.searchKey || (id && type)) {
        this.$store.dispatch("clearSearch");
        if (id) {
          const params = {
            search: "''",
            sort: sortBy,
            page: 1,
            in_stock_only: showInStock
          };
          if (type) {
            if (type === "brand") params["brands[]"] = id;
            else params.dept_id = id;
          }
          this.$store.dispatch("search", params);
        } else {
          this.$store.dispatch("search", {
            search: this.searchKey,
            sort: sortBy,
            page: 1,
            in_stock_only: showInStock
          });
        }

        TrackerApiService.trackSearch(this.searchKey);

        const queryParams = {
          keyword: this.searchKey,
          limit: 96,
          sort: sortBy,
          in_stock_only: showInStock
        };

        if (this.$store.state.settings.products.showThreeFiveDays) {
          queryParams.avail_35 = 1;
        }

        if (this.$store.state.settings.products.showThreeFiveDays) {
          queryParams.avail_35 = 1;
        }

        if (id) {
          queryParams.keyword = "''";

          if (type === "brand") {
            queryParams["brand_id"] = id;
          } else {
            queryParams["dept_id"] = id;
          }
        }

        this.$router
          .push({
            name: "search",
            params: { dummy: this.$ezSlugify(this.searchKey) },
            query: queryParams
          })
          .catch(err => console.log(err));
      }
    }
  }
};
</script>
