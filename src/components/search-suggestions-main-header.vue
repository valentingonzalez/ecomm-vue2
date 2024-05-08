<template>
  <vue-autosuggest
    :id="id + '-autosuggest'"
    class="search-bar"
    ref="autocomplete"
    @focus="onFocus"
    @blur="onBlur"
    @input="getSuggestions"
    @keydown.enter.prevent="searchOnKeyboardEnter"
    :suggestions="searchSuggestions"
    :sectionConfigs="sectionConfigs"
    :inputProps="inputProps"
    :getSuggestionValue="getSuggestionValue"
    v-model="key"     
  >
    <template slot="before-suggestions">
      <div class="d-flex w-100 align-items-center justify-content-center px-3 pt-5" v-if="isLoadingSuggestions">
        <b-spinner></b-spinner>
      </div>
    </template>
    <template slot-scope="{suggestion}">
      <div class="d-flex align-items-center cursor-pointer" v-if="!isLoadingSuggestions">
        <template v-if="acceptURL && key">
          <div v-if="suggestion.name == 'url'">
            <div class="py-1">
              <b class="mr-1">To url:</b> {{ suggestion.item.name | toURL }}
            </div>
          </div>
        </template>
        <div v-if="suggestion.name == 'top-search-terms'" class="d-flex flex-row text-capitalize">
          {{ suggestion.item.title }}?
        </div>
        <div v-else style="display: none;"></div>
        <div v-if="suggestion.name == 'products'" class="text-capitalize d-flex align-items-center">
          <div class="avatar d-flex align-items-center justify-content-center mr-3">
            <img class="w-auto h-100" :src="suggestion.item.image_url || '/images/default-img.svg'" />
          </div>
          {{ suggestion.item.title }}
        </div>
        <div v-if="suggestion.name == 'brands'" class="text-capitalize d-flex align-items-center">
          <div class="avatar d-flex align-items-center justify-content-center mr-3">
            <img class="w-auto h-100" :src="suggestion.item.image" />
          </div>
          {{ suggestion.item.brand_name }}
        </div>
        <div v-if="suggestion.name == 'departments'" class="text-capitalize d-flex align-items-center">
          <span>{{ suggestion.item.name }}</span>
          <div v-if="suggestion.item.parent">
            <span style="color: grey;"> in </span>
            <span style="color: grey; font-size: 11px;">{{ suggestion.item.parent.name }}</span>
          </div>
        </div>
      </div>
      <div v-else></div>
    </template>
    <template slot="after-suggestions" v-if="!hideFooter && key.length > 2">
      <div class="search-suggestion-footer px-3 py-2">
        None of the results match? <a href="#" class="d-inline search-link" @click.stop.prevent="() => this.$emit('onSelected')">Click here</a>
      </div>
    </template>
  </vue-autosuggest>
</template>

<script>
export default {
  name: 'SearchSuggestions',
  props: {
    placeholder: {
      default: 'Enter what you\'re looking for'
    },
    departmentsLabel: {
      default: 'Departments'
    },
    brandsLabel: {
      default: 'Brands'
    },
    acceptURL: {
      default: false
    },
    hideProducts: {
      default: false
    },
    hideDepartments: {
      default: false
    },
    hideBrands: {
      default: false
    },
    hideTopSearchTerms: {
      default: false
    },
    hideFooter: {
      default: false
    },
    productsLimit: {
      default: false
    },
    departmentsLimit: {
      default: false
    },
    brandsLimit: {
      default: false
    },
    value: {
      default: ''
    },
    id: {
      default: 'search'
    }
  },
  filters: {
    toURL(val) {
      var pattern = new RegExp('(^tel?:)|(^http[s]?:\/{2})|(^www)');
      return pattern.test(val) ? val : `https://${val.replace(/ /g, '-').toLowerCase()}`;
    }
  },
  data() {
    return {
      key: '',
      selectedItem: false,
      inputProps: {
        id: this.id,
        placeholder: this.placeholder,
        onInputChange: this.onInputChange,
        class: 'form-control text-capitalize',
        name: 'search',
        value: '',
        'aria-label': 'search',
        title: 'search',
        inputmode: 'search',
        "aria-label" : "Enter what you're looking for"
      },
      sectionConfigs: {
        products: {
          limit: this.productsLimit || 10,
          label: 'Products',
          onSelected: selected => {
            this.$emit('onSelected', selected);
          }
        },
        departments: {
          limit: this.departmentsLimit || 2,
          label: this.departmentsLabel,
          onSelected: selected => {
            this.$emit('onSelected', selected);
          }
        },
        brands: {
          limit: this.brandsLimit || 2,
          label: this.brandsLabel,
          onSelected: selected => {
            this.$emit('onSelected', selected);
          }
        },
        url: {
          onSelected: () => {
            this.key = this.$options.filters.toURL(this.key);
            this.$emit('onSelected', {name: 'url', item: [{name: this.$options.filters.toURL(this.key), original_title: this.$options.filters.toURL(this.key)}]});
          }
        },
        default: {
          onSelected: () => {
            return;
          }
        }
      },
      selectedInput: false,
      timeout: 0,
      isLoadingSuggestions: false,
    };
  },
  computed: {
    searchSuggestions() {
      let temp = [];
      if(this.acceptURL)
        temp.push({name: 'url', data: [{name: this.key}]});
      if(this.$store.state.searchSuggestions && this.key.length > 2) {
        let arr = this.$store.state.searchSuggestions;
        if(!this.hideTopSearchTerms && arr.top_search_terms != null) {
          const topSearchTerms = arr.top_search_terms && arr.top_search_terms.items;
          topSearchTerms.length && temp.push({ name: 'top-search-terms', data: topSearchTerms });
        }
        if(!this.hideProducts) {
          const products = arr.products && arr.products.items;
          products && products.length && temp.push({ name: 'products', data: products });
        }
        if(!this.hideDepartments) {
          const departments = arr.departments && arr.departments.items;
          departments && departments.length && temp.push({ name: 'departments', data: departments });
        }
        if(!this.hideBrands) {
          const brands = arr.brands && arr.brands.items;
          brands && brands.length && temp.push({ name: 'brands', data: brands });
        }
      }
      return temp;
    },
  },
  methods: {
    getSuggestions(text) {
      this.$parent.searchKey = text;
      text = text || '""';
      if(text.length < 3){
        return;
      }
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout( async () => {
        this.isLoadingSuggestions = true;
        let top_search_terms = this.$store.state.searchSuggestions && this.$store.state.searchSuggestions.top_search_terms ? this.$store.state.searchSuggestions.top_search_terms : {items: [], total: 0};
        this.$store.commit('saveSearchSuggestions', {top_search_terms: top_search_terms, products: {items: [], total: 0}, brands: {items: [], total: 0}, departments: {items: [], total: 0}});
        await this.$store.dispatch('searchSuggestion', text);
        this.isLoadingSuggestions = false;
        this.$emit('onSuggestion', text);
      }, 350);
    },
    getSuggestionValue(suggestion) {
      let { name, item } = suggestion;
      let ret = name == 'products' ? item.title : name == 'brands' ? item.brand_name : item.name;
      if(name == 'top-search-terms') {
        ret = this.$options.filters.capitalize(item.title);
        this.$parent.toSearchPage(null, null, ret);
      }
      return ret;
    },
    onFocus() {
      this.selectedInput = true;
      this.$emit('onFocus');
    },
    onBlur() {
      this.selectedInput = false;
      this.$emit('onBlur');
    },
    onInputChange(searchKey) {
      this.$emit('onInputChange', searchKey);
      this.getSuggestions(searchKey);
    },
    searchOnKeyboardEnter() {
      this.$parent.toSearchPage(null, null, this.key);
    }
  },
  watch: {
    '$route'(to) {
      if(to.name == 'search' || to.name == 'department') return;
      this.$refs.autocomplete.searchInput = '';
    },
    searchSuggestions(newSugg, oldSugg) {
      if (newSugg != oldSugg) {
        // this.isLoadingSuggestions = false;
      }
    },
  },
  mounted() {
    let input = this.$refs.autocomplete.$el.querySelector('#' + this.id);
    this.value = this.$options.filters.isUrl(this.value) ? this.value : this.value;
    setTimeout(() => { input.value = this.value; }, 100);
    this.key = this.value;
  }
};

</script>

<style lang="scss">
.autosuggest__results-container .avatar {
  height: 32px;
  border-radius: 4px;
  img {
    text-indent: -10000px;
    max-width: 100% !important;
    max-height: 100% !important;
    height: auto !important;
  }
}

.autosuggest__results-container {
  color: black;
  position: relative;
  width: 100%;
}

.autosuggest__results {
  font-size: 14px;
  position: absolute;
  z-index: 10000001;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background: white;
  padding: 0px;
  overflow-y: auto;

  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
    max-height: 350px;
    overflow: auto;
    &:nth-child(1) {
      -webkit-box-orient: horizontal !important;
      -webkit-box-direction: normal !important;
      flex-direction: row !important;
      display: flex !important;
      flex-wrap: wrap !important;
    }
    &:nth-child(2) {
      max-height: 238px;
      overflow: auto;
    }
    &:nth-child(2) > .autosuggest__results-before {
      border-top: none;
      position: sticky;
      top: 0;
      background: white;
      width: 100%;
    }
  }

  .autosuggest__results-before,
  .autosuggest__results_title {
    color: gray;
    font-size: 14px;
    margin-left: 0;
    padding: 10px 13px 5px;
    border-top: 1px solid #f0f0f0;
  }

  .autosuggest__results-item,
  .autosuggest__results_item {
    cursor: pointer;
    padding: 8px 20px;

    &:active,
    &:hover,
    &:focus,
    &.autosuggest__results-item-highlighted {
      background-color: #f6f6f6;
    }
    > * {
      display: flex;
      align-items: center;
    }
  }

  .url-selector:hover {
    background-color: #f6f6f6;
  }

  [data-section-name=top-search-terms] {
    padding-left: 10px;
    padding: 4px 10px !important;
    color: #555;
  }
}
</style>

<style lang="scss" scoped>
.form-control {
outline: none;
position: relative;
display: block;
padding: 10px;
width: 100%;
box-sizing: border-box;
-webkit-box-sizing: border-box;
-moz-box-sizing: border-box;
border-radius: 5px;
text-transform: capitalize;
}

.form-control.autosuggest__input-open {
border-bottom-left-radius: 0;
border-bottom-right-radius: 0;
}
</style>
