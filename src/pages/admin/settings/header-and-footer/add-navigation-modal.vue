<template>
  <b-modal ref="modal" size="xxl" no-close-on-backdrop>
    <div slot="modal-header">
      <h4>Add Navigation</h4>
    </div>
    <form id="navigationForm" @submit.prevent="confirmNavigation" :class="saving || loading ? 'disabled' : ''">
      <ul class="nav nav-tabs">
        <li class="nav-item lead">
          <button type="button" @click="targetType = 'external'" class="nav-link px-4" :class="{ 'active': targetType == 'external' }">External link</button>
        </li>
        <li class="nav-item lead">
          <button type="button" @click="targetType = 'custompage'" class="nav-link px-4" :class="{ 'active': targetType == 'custompage' }">Custom Page</button>
        </li>
        <li class="nav-item lead">
          <button type="button" @click="targetType = 'dropdown'" class="nav-link px-4" :class="{ 'active': targetType == 'dropdown' }">Dropdown</button>
        </li>
        <li class="nav-item lead">
          <button type="button" @click="targetType = 'megamenu'" class="nav-link px-4" :class="{ 'active': targetType == 'megamenu' }">Mega Menu</button>
        </li>
      </ul>
      <div class="wrapper">
        <div class="py-4 custom-width">
          <div class="form-group">
            <div class="d-flex mt-md-2 mt-n1 flex-md-row text-right align-radio-btns" v-if="$store.state.settings.navigationLayout != 'secondary'">
              <label for="navigation-align" class="mr-3">Align: </label>
              <div class="custom-control custom-radio">
                <input id="alignLeft" type="radio" v-model="localNav.align" value="left" name="alignment" class="custom-control-input">
                <label class="custom-control-label" for="alignLeft">
                  Left
                </label>
              </div>
              <div class="custom-control custom-radio ml-md-3">
                <input id="alignRight" type="radio" v-model="localNav.align" value="right" name="alignment" class="custom-control-input">
                <label class="custom-control-label" for="alignRight">
                  Right
                </label>
              </div>
            </div>
            <div class="row small-gutters">
              <div :class="(targetType == 'megamenu' && (!stores && stores.length <= 1)) ? 'col-md-12':'col-md-6'">
                <label for="navigation-name">{{targetType == 'dropdown' ? 'Dropdown Title':'Title' }}</label>
                <input id="navigation-name" type="text" class="form-control" v-model="localNav.name" required placeholder="Title" />
              </div>
              <div class="col-md-6" v-if="$store.state.settings.navigationLayout == 'secondary'">
                <label for="navigation-position">Position</label>
                <select v-model="localNav.show_in_header" class="form-control" id="navigation-position">
                  <option value="0">Bottom</option>
                  <option value="1">Top</option>
                </select>
              </div>
              <div v-if="stores && stores.length > 1" class="col-md-6 mt-sm-2-custom">
                <label>Hide on Locations</label>
                <multiselect
                  v-model="localNav.hide_on_locations"
                  :options="stores"
                  :multiple="true"
                  placeholder="None"
                  label="name"
                  track-by="id">
                </multiselect>
              </div>
              <div :class="(stores && stores.length > 1) ? 'col-md-12 mt-sm-2-custom mt-md-2':'col-md-6 mt-sm-2-custom'" v-if="targetType == 'external'">
                <label for="external-link">Link</label>
                <input id="external-link" type="text" class="form-control" v-model="localNav.target" placeholder="Paste link here" />
                <div class="small text-danger" v-if="showError && showError.error == 'external-link'">{{ showError.message }}</div>
              </div>
              <div :class="(stores && stores.length > 1) ? 'col-md-12 mt-sm-2-custom mt-md-2':'col-md-6 mt-sm-2-custom'" v-if="targetType == 'custompage'">
                <label for="custom-page">Select Page</label>
                <select id="custom-page" class="form-control" v-model="localNav.target" @change="customPageSelect">
                  <option value="" disabled selected>Select</option>
                  <option v-for="(page, i) in allPages" :key="`page-${page.link}-${i}`" :value="page.link" :data-title="page.title">
                    {{ page.title }}
                  </option>
                </select>
                <template v-if="localNav.isDepartment || localNav.target == '/departments'">
                  <div class="mt-2">
                    <b>Pointing to {{localNav.sub_target && localNav.real_name || `all departments`}}.</b>
                    To {{localNav.real_name && `change the`|| `add a specific`}} department click <a href="#" @click.prevent="showDeptModal()">here</a>
                  </div>
                </template>
              </div>
              <template v-if="targetType == 'dropdown'">
                <div :class="(stores && stores.length > 1) ? 'col-md-12 mt-sm-2-custom mt-md-2':'col-md-6 mt-sm-2-custom'">
                  <label for="linkDropdownTo">Dropdown Link</label>
                  <input id="linkDropdownTo" type="text" class="form-control mb-1 mb-md-0" placeholder="Link" v-model="localNav.target" required />
                </div>
                <div class="col-md-12 mt-3">
                  <div class="row">
                    <div class="col-md">
                      <label for="systemPageSelect">Add System Page</label>
                      <select id="pagesSelect" class="form-control" @change="addToDropdown(allPages.find(e => e.link == $event.target.value))">
                        <option value="">Select a Page</option>
                        <option v-for="(page, i) in filteredPages" :key="`page-${i}`" :value="page.link">
                          {{ page.title }}
                        </option>
                      </select>
                    </div>
                    <div class="col-auto d-flex mt-md-6 mt-sm-2-custom">
                      OR
                    </div>
                    <div class="col-md-8">
                      <form id="addDropdownItem" class="row small-gutters overflow-hidden" @submit.prevent="addToDropdown(null)">
                        <div class="row w-100" style="margin-left:-10px">
                          <div class="col-md-5 mt-sm-2-custom">
                            <label for="externalLinkTitle">External Link Title</label>
                            <input id="linkTitle" type="text" class="form-control" placeholder="Title" v-model="localDropdownLink.title" required />
                          </div>
                          <div class="col-md-5 mt-sm-2-custom">
                            <label for="externalLink">External Link</label>
                            <input id="linkTarget" type="text" class="form-control" placeholder="https://" v-model="localDropdownLink.link" required @input="() => showError = null" />
                            <div class="small text-danger" v-if="showError && showError.error == 'dropdown-link'">{{ showError.message }}</div>
                          </div>

                          <div class="col-auto d-flex align-items-end mt-sm-2-custom">
                            <button type="submit" class="btn btn-outline-primary font-weight-bold ml-md-2" form="addDropdownItem">
                              Add
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="border-top mt-4 pt-3">
                    <div class="label mb-2">Dropdown</div>
                    <draggable class="list-group dropdown-list" :list="localDropdown" group="pages" handle=".handle">
                      <div class="list-group-item d-flex justify-content-between align-items-center" v-for="(item, index) in localDropdown" :key="item.id">
                        <div class="flex-grow-1 d-flex align-items-center">
                          <div class="handle mr-3">
                            <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.75008 14.7292C1.44619 14.7292 1.15474 14.6084 0.939855 14.3936C0.724969 14.1787 0.604248 13.8872 0.604248 13.5833C0.604248 13.2794 0.724969 12.988 0.939855 12.7731C1.15474 12.5582 1.44619 12.4375 1.75008 12.4375H9.08342C9.38731 12.4375 9.67876 12.5582 9.89364 12.7731C10.1085 12.988 10.2292 13.2794 10.2292 13.5833C10.2292 13.8872 10.1085 14.1787 9.89364 14.3936C9.67876 14.6084 9.38731 14.7292 9.08342 14.7292H1.75008Z" fill="#94A3B8"/><path d="M1.75008 8.31251C1.44619 8.31251 1.15474 8.19179 0.939855 7.9769C0.724969 7.76202 0.604248 7.47057 0.604248 7.16668C0.604248 6.86278 0.724969 6.57134 0.939855 6.35645C1.15474 6.14156 1.44619 6.02084 1.75008 6.02084H10.9167C11.2206 6.02084 11.5121 6.14156 11.727 6.35645C11.9419 6.57134 12.0626 6.86278 12.0626 7.16668C12.0626 7.47057 11.9419 7.76202 11.727 7.9769C11.5121 8.19179 11.2206 8.31251 10.9167 8.31251H1.75008Z" fill="#94A3B8"/><path d="M1.75008 2.81251C1.44619 2.81251 1.15474 2.69179 0.939855 2.4769C0.724969 2.26202 0.604248 1.97057 0.604248 1.66668C0.604248 1.36278 0.724969 1.07134 0.939855 0.85645C1.15474 0.641565 1.44619 0.520844 1.75008 0.520844H18.2501C18.554 0.520844 18.8454 0.641565 19.0603 0.85645C19.2752 1.07134 19.3959 1.36278 19.3959 1.66668C19.3959 1.97057 19.2752 2.26202 19.0603 2.4769C18.8454 2.69179 18.554 2.81251 18.2501 2.81251H1.75008Z" fill="#94A3B8"/><path d="M16.8972 17.4792C16.7467 17.4796 16.5976 17.4502 16.4585 17.3925C16.3194 17.3349 16.1932 17.2503 16.0871 17.1435L13.3371 14.3935C13.2304 14.2872 13.1457 14.1609 13.0878 14.0218C13.03 13.8827 13.0001 13.7336 13 13.5829C12.9999 13.4323 13.0294 13.2831 13.087 13.1439C13.1446 13.0047 13.2291 12.8782 13.3356 12.7717C13.4421 12.6652 13.5686 12.5807 13.7078 12.5231C13.847 12.4656 13.9961 12.436 14.1468 12.4361C14.2974 12.4363 14.4466 12.4661 14.5856 12.524C14.7247 12.5818 14.8511 12.6665 14.9574 12.7732L16.8972 14.7131L18.8371 12.7732C18.9434 12.6665 19.0697 12.5818 19.2088 12.524C19.3479 12.4661 19.497 12.4363 19.6477 12.4361C19.7983 12.436 19.9475 12.4656 20.0867 12.5231C20.2259 12.5807 20.3524 12.6652 20.4589 12.7717C20.5654 12.8782 20.6499 13.0047 20.7075 13.1439C20.765 13.2831 20.7946 13.4323 20.7945 13.5829C20.7943 13.7336 20.7645 13.8827 20.7066 14.0218C20.6488 14.1609 20.5641 14.2872 20.4574 14.3935L17.7074 17.1435C17.6013 17.2503 17.475 17.3349 17.336 17.3925C17.1969 17.4502 17.0478 17.4796 16.8972 17.4792Z" fill="#94A3B8"/><path d="M16.8972 3.99999C16.7467 3.99956 16.5976 4.02901 16.4585 4.08664C16.3194 4.14426 16.1932 4.22891 16.0871 4.33569L13.3371 7.08569C13.2304 7.19201 13.1457 7.31832 13.0878 7.45741C13.03 7.5965 13.0001 7.74563 13 7.89627C12.9999 8.04691 13.0294 8.1961 13.087 8.3353C13.1446 8.47449 13.2291 8.60097 13.3356 8.70749C13.4421 8.81401 13.5686 8.89847 13.7078 8.95605C13.847 9.01363 13.9961 9.0432 14.1468 9.04306C14.2974 9.04292 14.4466 9.01307 14.5856 8.95523C14.7247 8.89739 14.8511 8.81268 14.9574 8.70597L16.8972 6.76611L18.8371 8.70597C18.9434 8.81268 19.0697 8.89739 19.2088 8.95523C19.3479 9.01307 19.497 9.04292 19.6477 9.04306C19.7983 9.0432 19.9475 9.01363 20.0867 8.95605C20.2259 8.89847 20.3524 8.81401 20.4589 8.70749C20.5654 8.60097 20.6499 8.47449 20.7075 8.3353C20.765 8.1961 20.7946 8.04691 20.7945 7.89627C20.7943 7.74563 20.7645 7.5965 20.7066 7.45741C20.6488 7.31832 20.5641 7.19201 20.4574 7.08569L17.7074 4.33569C17.6013 4.22891 17.475 4.14426 17.336 4.08664C17.1969 4.02901 17.0478 3.99956 16.8972 3.99999Z" fill="#94A3B8"/><path d="M16.8973 16.5625C16.5935 16.5622 16.3022 16.4414 16.0874 16.2266C15.8726 16.0118 15.7517 15.7205 15.7515 15.4167V7.16668C15.7515 6.86278 15.8722 6.57134 16.0871 6.35645C16.302 6.14156 16.5934 6.02084 16.8973 6.02084C17.2012 6.02084 17.4926 6.14156 17.7075 6.35645C17.9224 6.57134 18.0431 6.86278 18.0431 7.16668V15.4167C18.0428 15.7205 17.922 16.0118 17.7072 16.2266C17.4924 16.4414 17.2011 16.5622 16.8973 16.5625Z" fill="#94A3B8"/></svg>
                          </div>
                          <div class="w-100">
                            <input v-model="item.title" type="text" class="border-0" />
                            <input v-model="item.link" type="text" class="text-muted mt-n2 italic d-block dropdown-input-border w-70" />
                          </div>
                        </div>
                        <div class="d-flex align-items-center justify-content-end">
                          <a v-if="item.isDepartment" @click="editDepartmentLink(item)" class="small text-right" href="#">Add Specific Deparment</a>
                          <a href="#" class="ml-3 d-flex align-items-center" @click.prevent="deleteFromDropdown(index)">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="28" rx="4" fill="#F1F5F9"/><path d="M9 19L19 9M9 9L19 19" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          </a>
                        </div>
                      </div>
                    </draggable>
                  </div>
                </div>
              </template>
              <div class="col-12 mt-3" v-if="targetType == 'megamenu'">
                <MegaMenuEditor ref="megamenu" :menu="localNav.megamenu" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <div slot="modal-footer" class="mt-n3">
      <button class="btn btn-outline-secondary mr-3" @click.prevent="hide" :class="saving || loading ? 'disabled' : ''">Cancel</button>
      <button class="btn btn-primary lead" type="submit" form="navigationForm" :disabled="saving || loading"><b>Save</b></button>
    </div>
  </b-modal>
</template>

<script>
  import draggable from 'vuedraggable';
  import CustomNavigationService from '@/api-services/custom-navigation.service';
  import MegaMenuEditor from '@/components/mega-menu/editor.vue';
  import Multiselect from 'vue-multiselect';

  const navigationModel = {
    id: null,
    name: '',
    target: '',
    dropdown: null,
    megamenu: null,
    align: 'left',
    show_in_header: 0,
    sub_target: null,
    real_name: null,
    hide_on_locations: null
  };
  export default {
    name: 'AddNavigationModal',
    props: ['navigationModel'],
    components: {
      draggable,
      MegaMenuEditor,
      Multiselect
    },
    data() {
      return {
        targetType: null,
        loading: false,
        saving: false,
        showError: null,
        localDropdown: null,
        localDropdownLink: {
          title: null,
          link: null
        },
        localNav: { ...navigationModel },
        editingDepartmentLink: null,
        customNavigation: []
      };
    },
    computed: {
      isBenjaminMoore() {
        return this.$root.$children[0].isBenjaminMoore;
      },
      pages() {
        return this.$store.state.customPages;
      },
      allPages() {
        let ret = [
          { title: 'Home', link: '/' },
          { title: 'Departments', link: '/departments' },
          { title: 'Brands', link: '/brands' },
          { title: 'Store Info', link: '/store-info'},
          { title: 'Promotions', link: '/promotions' }
        ];
        let additionalPages = [];
        if(this.isBenjaminMoore) {
          additionalPages = [{ title: 'Colors', link: '/colors' }, { title: 'Products', link: '/paint-products' }];
        }
        return [...ret, ...this.pages.map(e => ({ ...e, link: `/${e.link}` })), ...additionalPages];
      },
      filteredPages() {
        return this.allPages.filter(e => !this.localDropdown.some(obj => obj.link === e.link));
      },
      navigation: {
        get() {
          let cmp = (a, b) => (a > b) - (a < b);
          let r = [...this.customNavigation].filter(e => this.$store.state.settings.navigationLayout == 'secondary' ? e.show_in_header != 1 : e.target != "/local-ad");
          r.sort((a, b) => cmp(a.order,b.order));
          if(this.$store.state.settings.navigationLayout != 'secondary')
            r.sort((a, b) => cmp(a.align, b.align));
          return r;
        },
        set(val) {
          return val;
        }
      },
      topNavigation: {
        get() {
          let cmp = (a, b) => (a > b) - (a < b);
          let r = [...this.customNavigation].filter(e => e.show_in_header == 1);
          r.sort((a, b) => cmp(a.order,b.order));
          if(this.$store.state.settings.navigationLayout != 'secondary')
            r.sort((a, b) => cmp(a.align,b.align));
          return r;
        },
        set(val) {
          return val;
        }
      },
      order() {
        return Math.max(...this.navigation.map(e => +e.order).filter(p => !isNaN(p))) + 1;
      },
      stores() {
        if(this.$store.state.businessDetails && this.$store.state.businessDetails.about_us)
          return this.$store.state.businessDetails.about_us.locations;
        return null;
      }
    },
    methods: {
      customPageDeptSelectedInParent(data) {
        this.localNav.sub_target = data.sub_target;
        this.localNav.name = data.name;
        this.localNav.real_name = data.real_name;
      },
      showDeptModal(){
        this.$emit('showDepartmentAddModal');
      },
      customPageSelect(evt) {
        this.localNav.name = evt.target.options[evt.target.options.selectedIndex].dataset.title;
      },
      updateLocalModel() {
        this.navigationModel = { ...this.getDefaultModel(), ...this.navigationModel };
      },
      isUrl(val) {
        return this.$options.filters.isUrl(val);
      },
      async show(id = null) {
        let ret = await CustomNavigationService.getNavigation();
        this.customNavigation = ret.data.data;
        this.localDropdown = [];
        this.localDropdownLink = { title: null, link: null };
        this.localNav = { ...navigationModel };
        if(id) {
          this.$emit('update-id-event', { id: id });
          this.localNav = this.navigation.filter(e => e.id == id).length ? {...this.navigation.filter(e => e.id == id)[0]} : {...this.topNavigation.filter(e => e.id == id)[0]};
          if (this.localNav.hide_on_locations && this.stores) {
            this.localNav.hide_on_locations = this.stores.filter(x => this.localNav.hide_on_locations.split(',').map(x => x * 1).includes(x.id));
          }
          if(this.localNav.dropdown)
            this.localDropdown = [...this.localNav.dropdown.items];
        }else {
          this.$emit('update-id-event', { id: null });
        }
        this.targetType = this.localNav.dropdown ? 'dropdown' : this.localNav.megamenu ? 'megamenu' : this.allPages.find(e => e.link == this.localNav.target) ? 'custompage' : 'external';
        this.$refs.modal.show();
      },
      hide() {
        this.$refs.modal.hide();
      },
      addToDropdown(p) {
        this.showError = null;
        let page = {...p};
        if(!page || !Object.entries(page).length) {
          // add an external link
          if(!this.isUrl(this.localDropdownLink.link)) {
            this.showError = {
              error: 'dropdown-link',
              message: 'Please, enter a valid URL.'
            };
            return;
          }
          this.localDropdownLink.link = this.modifyTargetLink(this.localDropdownLink.link);
          this.localDropdown.push({...this.localDropdownLink});
          this.localDropdownLink = { title: null, link: null };
        } else {
          if([...this.localDropdown].filter(e => e.link == page.link).length) {
            // remove the page
            this.localDropdown = this.localDropdown.filter(e => e.link != page.link);
          } else {
            // add the page
            if(page.link == '/departments') {
              page.isDepartment = true;
            }
            this.localDropdown.push(page);
          }
          this.$swal({
            toast: true,
            position: 'top',
            type: 'success',
            html: `<div class="ml-2">${page.title} Page Added</div>`,
            showConfirmButton: false,
            timer: 5000
          });
          document.getElementById('pagesSelect').value = '';
        }
      },
      deleteFromDropdown(index) {
        this.$delete(this.localDropdown, index);
      },
      editDepartmentLink(item) {
        this.$emit('onEditDepartmentLink', item);
      },
      modifyTargetLink(url) {
        const domainPattern = /^www\..+\..+$|^[^\/\s]+?\.[^\/\s]+$/;

        if (!url.startsWith('http://') && !url.startsWith('https://') && !domainPattern.test(url)) {
          return url;
        }
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return url;
        }

        return `https://${url}`;
      },
      confirmNavigation() {
        this.saving = true;
        this.showError = null;
        if(this.targetType == 'external') {
          this.localNav.target = this.modifyTargetLink(this.localNav.target);
        }
        if(this.targetType == 'dropdown') {
          this.localNav.target = this.modifyTargetLink(this.localNav.target);
          this.localNav.dropdown = {
            config: { width: 500 },
            items: this.localDropdown
          };
          this.localNav.target = this.localNav.target || '/';
          this.$delete(this.localNav, 'megamenu');
        } else if(this.targetType == 'megamenu') {
          this.localNav.megamenu = {
            background: this.$refs.megamenu.background,
            columns: this.$refs.megamenu.columns,
            callToAction: this.$refs.megamenu.callToAction
          };
          this.$delete(this.localNav, 'dropdown');
          this.localNav.target = this.localNav.target || '/';
          this.localNav.megamenu.callToAction.link = this.modifyTargetLink(this.localNav.megamenu.callToAction.link);
        } else {
          this.$delete(this.localNav, 'megamenu');
          this.$delete(this.localNav, 'dropdown');
        }
        if(!this.localNav.id)
          this.localNav.order = this.order;
        CustomNavigationService.postNavigation(this.localNav).then(res => {
          if(res.status === 200) {
            if(res.data.id) {
              this.localNav.id = res.data.id;
              this.$store.commit('addNavigation', this.localNav);
            } else {
              this.$store.commit('updateNavigation', this.localNav);
            }
            this.hide();
            this.localNav = { ...navigationModel };
          }
          this.saving = false;
        }).catch(() => {
          this.$swal('Failed to save the navigation item.', '', 'error');
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .nav-tabs {
    .nav-link {
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--text);
      &.active {
        border-bottom-color: var(--primary);
        color: var(--primary);
      }
    }
  }
  .handle {
    cursor: move;
  }
  .custom-width{
    max-width: 95%;
  }
  .dropdown-list {
    border: 1px solid #ddd;
    height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    &.pages {
      max-height: 255px;
    }
    .list-group-item {
      margin: -1px;
      margin-bottom: 1px;
    }
  }
  .fadeHeight-enter-active,
  .fadeHeight-leave-active {
    transition: all 0.2s;
    max-height: 100px;
  }
  .fadeHeight-enter,
  .fadeHeight-leave-to {
    max-height: 0px;
  }
  @media (min-height: 620px) and (max-height: 919px){
    .wrapper {
      height: calc((var(--vh, 1vh) * 100) - 347px);
      overflow: auto;
    }
  }
  @media (min-height: 920px) and (max-height: 1100px){
    .wrapper {
      height: calc((var(--vh, 1vh) * 95) - 347px);
      overflow: auto;
    }
  }
  @media (min-height: 1101px) and (max-height: 1400px){
    .wrapper {
      height: calc((var(--vh, 1vh) * 70) - 347px);
      overflow: auto;
    }
  }
  @media (min-height: 1401px) and (max-height: 1700px){
    .wrapper {
      height: calc((var(--vh, 1vh) * 60) - 347px);
      overflow: auto;
    }
  }
  @media (min-height: 1701px) and (max-height: 2000px){
    .wrapper {
      height: calc((var(--vh, 1vh) * 50) - 347px);
      overflow: auto;
    }
  }
  @media (min-height: 2001px){
    .wrapper {
      height: calc((var(--vh, 1vh) * 40) - 347px);
      overflow: auto;
    }
  }
  @media (max-height: 619px) {
    .wrapper {
      overflow: auto;
      height: 271px;
    }
  }
  .align-radio-btns {
    justify-content: flex-end;
    margin-top: 18px !important;
    margin-bottom: -33px !important;
    margin-right: 6px;
  }
  .custom-radio label.custom-control-label:before, .custom-radio label.custom-control-label:after, .custom-checkbox label.custom-control-label:before, .custom-checkbox label.custom-control-label:after {
    top: 40% !important;
    -webkit-transform: translateY(-50%) !important;
    transform: translateY(-50%) !important;
  }
  .dropdown-input-border {
    margin-top: 0px !important;
    border: 1px solid #6c757d6b !important;
  }
  @media (max-width: 750px) {
    .mt-sm-2-custom {
      margin-top:5px;
    }
  }
  .w-70 {
    width: 70% !important;
  }
  @media (min-width: 768px){
    .mt-md-6, .my-md-6 {
        margin-top: 2.5rem!important;
    }
  }
</style>
