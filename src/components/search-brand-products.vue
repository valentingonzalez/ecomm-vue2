<template>
  <vue-autosuggest
    :id="id + '-autosuggest-'+index"
    class="search-bar"
    ref="autocomplete"
    @focus="onFocus"
    @input="getSuggestions"
    :suggestions="searchSuggestions"
    :sectionConfigs="sectionConfigs"
    :inputProps="inputProps"
    :getSuggestionValue="getSuggestionValue"
    v-model="key"
  >
    <template slot-scope="{suggestion}">
      <div class="d-flex align-items-center cursor-pointer">
        <div v-if="suggestion.name == 'products'" class="text-capitalize d-flex align-items-start">
          <div class="avatar d-flex align-items-center justify-content-center mr-3">
            <img class="w-auto h-100" :src="suggestion.item.image || '/images/default-img.svg'" alt="Item Image" />
          </div>
          <div class="d-flex flex-column">
            <h6 class="m-0" v-html="suggestion.item.name"></h6>
            <p class="m-0 text-muted" v-html="`Group: ${suggestion.item.group}`"></p>
            <p class="m-0 text-muted" v-html="`Code: ${suggestion.item.code}`"></p>
            <p class="m-0 text-muted" v-html="`Family: ${suggestion.item.family_clean_name}`"></p>
          </div>
        </div>        
      </div>
    </template>
  </vue-autosuggest>
</template>

<script>
export default {
  name: 'SearchBrandProduct',
  props: {
    placeholder: {
      default: 'Enter what you\'re looking for'
    },
    acceptURL: {
      default: false
    },
    hideProducts: {
      default: false
    },
    productsLimit: {
      default: false
    },
    value: {
      default: ''
    },
    id: {
      default: 'search'
    },
    index: {
      default: 0
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
        ariaLabel: 'Search',
        class: 'form-control',
        name: 'search',
        value: '',
        'aria-label': 'search',
        title: 'search',
        inputmode: 'search'
      },
      sectionConfigs: {
        products: {
          limit: this.productsLimit || 10,
          label: 'Products',
          onSelected: selected => {
            this.key = this.$options.filters.capitalize(selected.item.original_title);
            this.$emit('onSelected', selected, this.index);
          }
        },
        default: {
          onSelected: () => {
            this.$emit('onSelected');
          }

        }
      },
      selectedInput: false
    };
  },
  computed: {
    searchSuggestions() {
      let temp = [];
      if(this.acceptURL)
        temp.push({name: 'url', data: [{name: this.key}]});
      if(this.$store.state.searchBrandProductSuggestions) {
        let arr = this.$store.state.searchBrandProductSuggestions;
        if(!this.hideProducts) {
          const products = arr;
          products.length && temp.push({ name: 'products', data: products });
        }
      }
      return temp;
    }
  },
  methods: {
    getSuggestions(text) {
      text = text || '""';
      this.$store.dispatch('searchBrandProductSuggestion', text);
      this.$emit('onSuggestion', text);
    },
    getSuggestionValue(suggestion) {
      let { name, item } = suggestion;
      let ret = name == 'products' ? item.title : name == 'brands' ? item.brand_name : item.name;
      return ret;
    },
    onFocus() {
      this.selectedInput = true;
      this.$emit('onFocus');
    },
    onInputChange(searchKey) {
      this.$emit('onInputChange', searchKey);
      this.getSuggestions(searchKey);
    }
  },
  watch: {
    '$route'(to) {
      if(to.name == 'search' || to.name == 'department') return;
      this.$refs.autocomplete.searchInput = '';
    }
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
  width: 60px;
  height: 60px;
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
    &:first-of-type {
      max-height: 238px;
      overflow: auto;
    }
    &:nth-child(1) > .autosuggest__results-before {
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