<template>
  <div v-if="$ezHasNoPermission('admin_account') || (!$store.state.businessDetails || !$store.state.businessDetails.can_show_synonyms)">
    <no-permission-truevalue page="Search Synonyms"></no-permission-truevalue>
  </div>
  <div class="bg-white  h-100" v-else>
    <div class="settings-header">
      <div class="settings-header-info">
        <h1>Search Synonyms</h1>
        <is-saved :param="saving" />
      </div>
      <span class="settings-description text-danger">
        <i class="fa fa-info-circle mr-1"></i> Changes may take up to <b>5 minutes</b> to apply
      </span>
    </div>

    <div class="settings-body">
      <div class="table-container">
        <table class="table border-gray border w-100 m-0">
          <thead>
            <tr>
              <th class="replacement-word">
                <b>Replacement Word</b>
                <i class="d-block font-weight-normal">* unique terms</i>
              </th>
              <th>
                <b>Search Words</b>
                <i class="d-block font-weight-normal">* to add multiple terms, separate by comma</i>
              </th>
              <th>
                <b>Match Type</b>
              </th>
              <th>
                <b>Direction</b>
              </th>
              <th>
                <b>Actions</b>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(searchSynonym, i) in searchSynonyms" :key="`synonym-${i}`">
              <td><input v-model="searchSynonym.searchWord" type="text" class="input-small" placeholder="Replacement Word" @blur="save" v-show="searchSynonym.synonymType !== 'two_way'"></td>
              <td class="w-100">
                <div class="tag-input">
                  <div v-for="(tag, u) in searchSynonym.synonymList" :key="`${i}-tag-${u}`" class="tag">
                    <span>{{ tag }}</span>
                    <button @click="removeTag(i, u)" class="remove" aria-label="Remove"></button>
                  </div>
                  <input v-model="searchSynonym.tagInput" type="text" placeholder="Search Words" @blur="() => { if (searchSynonym.tagInput) addTag(i); }" @keydown.enter.prevent.stop="addTag(i)" @keydown.188.prevent.stop="addTag(i)">
                </div>
              </td>
              <td>
                <select class="input-small" v-model="searchSynonym.matchType" @change="save">
                  <option value="exact">Exact</option>
                  <option value="broad">Broad</option>
                </select>
              </td>
              <td>
                <select class="input-small" v-model="searchSynonym.synonymType" @change="() => { save(); if (searchSynonym.synonymType === 'two_way') searchSynonym.searchWord = ''; }">
                  <option value="one_way">One Way</option>
                  <option value="two_way">Two Way</option>
                </select>
              </td>
              <td class="no-wrap">
                <button @click="duplicateSynonym(i)" class="action-button" type="button">Duplicate</button>
                <button @click="deleteSynonym(i)" class="action-button" type="button">Delete</button>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <button @click="addSynonym" class="btn btn-primary font-weight-bold" type="button"><i class="fa fa-plus mr-2"></i> Add Word</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import AdminService from '@/api-services/admin.service';
import NoPermissionTruevalue from "./no-permission-truevalue";

let saveTimeout;

export default {
  name: "SearchSynonyms",
  components: {
    NoPermissionTruevalue
  },
  data() {
    return {
      saving: false,
      searchSynonyms: []
    };
  },
  async mounted() {
    if(this.$ezHasNoPermission('admin_account')) return;

    await AdminService.getSearchSynonyms().then(result => {
      this.searchSynonyms = result.data.synonyms.map(synonym => {
        return {
          tagInput: '',
          searchWord: synonym.search_word,
          synonymList: synonym.synonym_list ? synonym.synonym_list.split(',') : [],
          matchType: synonym.match_type,
          synonymType: synonym.synonym_type
        };
      });
    });
  },
  methods: {
    addSynonym() {
      const synonym = { searchWord: '', tagInput: '', synonymList: [], matchType: 'exact', synonymType: 'one_way' };
      this.searchSynonyms.push(synonym);
    },
    addTag(index) {
      const tag = this.searchSynonyms[index].tagInput.trim();
      let updateReq = false;

      if (tag && tag.length > 1) {
        // Check for any special characters
        const specialCharsPattern = /[^a-z_\-0-9\s\',]/i;
        if(specialCharsPattern.test(tag)) {
          this.$swal({
            toast: true,
            position: 'top',
            type: 'error',
            html: `<div class="ml-2">All special characters such as $, %, & will automatically be replaced with an empty space (" ")</div>`,
            showConfirmButton: false,
            timer: 3000
          });
        } 

        const tagList =  tag.split(',');
        tagList.forEach(tagEntry => {
          tagEntry = tagEntry.trim();
          const alreadyExist = this.tagExists(tagEntry, index);
          if(!alreadyExist) {
            // Check if the word exists with some variation, keeping it seperate to show a seperate warning message
            // Hyphens and spaces would be considered the same 

            const alreadyExistWithVariation = this.tagExistsWithVariation(tagEntry, index);
            if(!alreadyExistWithVariation) {
              // Now Save it
              this.searchSynonyms[index].synonymList.push(tagEntry);
              updateReq = true;
            } else {
              this.$swal({
                toast: true,
                position: 'top',
                type: 'error',
                html: `<div class="ml-2">The provided keyword is already in use; hyphens will be treated as spaces.</div>`,
                showConfirmButton: false,
                timer: 5000
              });
            }
          } else {
            this.$swal({
              toast: true,
              position: 'top',
              type: 'error',
              html: `<div class="ml-2">Duplicated word</div>`,
              showConfirmButton: false,
              timer: 5000
            });
          }
        });
        if(updateReq) {
          this.save();
        }
      }

      this.searchSynonyms[index].tagInput = '';
    },
    tagExists(tagInput, i) {
      let tagExists = false;

      //for (let i = 0; i < this.searchSynonyms.length; i++) {
        if ((this.searchSynonyms[i].synonymList.findIndex(tag => tag.toLowerCase() === tagInput.trim().toLowerCase()) !== -1) || this.searchSynonyms[i].searchWord.toLowerCase() === tagInput.trim().toLowerCase()) tagExists = true;
      //}

      return tagExists;
    },
    tagExistsWithVariation(tagInput, i) {
      // Normalize the input string by replacing spaces and hyphens with a common delimiter
      const normalizedStr = tagInput.replace(/[\s-]+/g, '-').toLowerCase();

      // Check if the normalized string exists in the array
      const isDuplicate = this.searchSynonyms[i].synonymList.some(item => {
        // Normalize array item before comparison
        const normalizedItem = item.replace(/[\s-]+/g, '-').toLowerCase();
        return normalizedItem === normalizedStr;
      });

      return isDuplicate;
    },
    removeTag(synonymIndex, tagIndex) {
      this.searchSynonyms[synonymIndex].synonymList.splice(tagIndex, 1);
      
      this.save();
    },
    duplicateSynonym(index) {
      const synonym = JSON.parse(JSON.stringify(this.searchSynonyms[index]));

      this.searchSynonyms.push(synonym);
    },
    deleteSynonym(index) {
      this.searchSynonyms.splice(index, 1);

      this.save();
    },
    async save() {
      clearTimeout(saveTimeout);

      saveTimeout = setTimeout(async() => {
        this.saving = true;
  
        let formattedSearchSynonyms = {
          synonyms: this.searchSynonyms.map(synonym => {
            return {
              search_word: synonym.searchWord.trim(),
              synonym_list: synonym.synonymList.join(','),
              match_type: synonym.matchType,
              synonym_type: synonym.synonymType
            };
          })
        };
  
        await AdminService.updateSearchSynonyms(formattedSearchSynonyms)
        .then(() => {
          this.saving = false;
        })
        .catch(error => {
          if (error.response.data.errors) {
            this.$swal(error.response.data.errors.search_word || error.response.data.errors.synonym_list || 'Error while saving, please try again', '', 'error');
          } else {
            this.$swal('Error while saving, please try again', '', 'error');
          }
        });
      }, 800);
    }
  }
};
</script>

<style lang="scss">
  .swal2-title {
    overflow-wrap: anywhere;
  }

  .table-container {
    border-radius: 4px;
    border: 1px solid #dee2e6;
    background: white;
    
    table {
      border: none !important;

      tr {
        animation: newLine 800ms;

        th,
        td {
          border-top: none;
        }

        th {
          i {
            font-size: 0.8125rem;
          }
        }
        th {
          vertical-align: middle;
        }
      }
    }
  }

  .input-small {
    padding: 5px;
    width: 100%;
    min-width: 100px;

    &[type="text"] {
      min-width: 140px;
    }
  }

  .input-small,
  .tag-input {
    border: 1px solid #DEE2E6;
    border-radius: 4px;
  }

  .tag-input {
    display: inline-flex;
    flex-wrap: wrap;
    padding: 4px 4px 0;
    width: 100%;
    background: white;

    .tag {
      background: #D9E8EE;
      border-radius: 4px;
      margin-right: 6px;
      display: flex;
      align-items: center;
      padding: 2px 2px 2px 6px;

      span {
        color: #0E4D66;
        font-size: 0.8125rem;
        margin-right: 2px;
      }

      .remove {
        border: none;
        background: url("data:image/svg+xml,%3Csvg width='8px' height='8px' viewBox='0 0 8 8' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3EGroup 6%3C/title%3E%3Cg id='Symbols' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Tag' transform='translate(-80.000000, -7.000000)'%3E%3Crect id='Rectangle' opacity='0.149999991' x='0' y='0' width='95' height='22' rx='4'%3E%3C/rect%3E%3Cg id='Group-6' opacity='0.5' transform='translate(81.500000, 8.500000)' stroke='%23035271' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5'%3E%3Cline x1='0' y1='0' x2='5' y2='5' id='Path'%3E%3C/line%3E%3Cline x1='5' y1='0' x2='0' y2='5' id='Path'%3E%3C/line%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E") no-repeat center;
        width: 8px;
        height: 8px;
        padding: 8px;
      }
    }

    .tag,
    input {
      margin-bottom: 4px;
    }
    
    input {
      border: none;
      flex: 1;
    }
  }

  .action-button {
    border: none;
    background: none;
    color: var(--primary);
    padding: 0;
    margin-top: 5px;

    &:not(:last-child) {
      margin-right: 16px;
    }
  }

  .replacement-word {
    min-width: 160px;
  }

  @keyframes newLine {
    from {background-color: #E6F1F5;}
    to {background-color: transparent;}
  }

  @media (max-width: 767px) {
    .table-container {
      overflow-x: auto;
    }
  }
</style>
