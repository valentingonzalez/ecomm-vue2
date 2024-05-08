<template>
    <b-modal size="md" class="modal-box"
    ref="brandAliasModal"
    :lazy="false"
    :visible="false"
    title="Create Alias"
    @shown="setAliasName"
    >
        <div>
            <p>The Alias will be the new name for the brand that will be visible to your customers.</p>
            
            <div class="form-group">
                <label for="Alias">Enter a name</label>
                <input type="text" placeholder="Name" class="form-control w-100" v-model="aliasInput">
            </div>
            <div class="form-group">
                <label for="AltTextLogo">Enter Alt Text for Logo</label>
                <input type="text" placeholder="Alt Text" class="form-control w-100" v-model="altTextLogo">
            </div>
        </div>
        <div slot="modal-footer">
            <button v-if="!hasAlias" type="button" class="btn btn-primary mr-2" :disabled="(!aliasInput || aliasInput.length < 2) && !altTextLogo" @click="addAlias"><i v-if="saving" class="fa fa-spin fa-spinner mr-1"></i> {{ saving ? 'Adding' : 'Add' }}</button>
            <button v-else type="button" class="btn btn-primary mr-2" @click="addAlias"><i v-if="saving" class="fa fa-spin fa-spinner mr-1"></i> {{ saving ? 'Updating' : 'Update'}}</button>
            <button type="button" class="btn btn-outline-primary" @click="removeAlias"><i v-if="removing" class="fa fa-spin fa-spinner mr-1"></i> {{ removing ? 'Removing' : 'Remove' }}</button>
        </div>
    </b-modal>
</template>

<script>
import AdminService from '@/api-services/admin.service';

export default {
    name: 'BrandAlias',
    props: {
        currentBrand: {
            type: Object,
            default: null
        }
    },
    data () {
        return {
            aliasInput: '',
            altTextLogo: '',
            saving: false,
            removing: false,
        };
    },
    methods: {
        showModal() {
            this.$refs.brandAliasModal.show();
        },
        async addAlias() {
            this.saving = true;
            let response = await AdminService.addBrandAlias(this.currentBrand.id, this.aliasInput, this.altTextLogo);
            if (response.data.status == 'ok') {
                this.saving = false;
                this.currentBrand.alias = this.aliasInput;
                this.currentBrand.altTextLogo = this.altTextLogo;                
                this.$swal('Alias added successfully!', '', 'success');
                this.$refs.brandAliasModal.hide();
            } else {
                this.saving = false;
                this.$swal('Something went wrong while trying to add alias.', '', 'error');
            }
        },
        async removeAlias() {
            this.removing = true;
            let response = await AdminService.deleteBrandAlias(this.currentBrand.id);
            if (response.data.status == 'ok') {
                this.removing = false;
                this.currentBrand.alias = null;
                this.currentBrand.altTextLogo = null;
                this.$swal('Alias removed successfully', '', 'success');
                this.$refs.brandAliasModal.hide();
            } else {
                this.removing = false;
                this.$swal('Something went wrong while trying to remove alias.', '', 'error');
            }
        },
        setAliasName() {
            this.aliasInput = this.currentBrand.alias ? this.currentBrand.alias : '';
            this.altTextLogo = this.currentBrand.altTextLogo ? this.currentBrand.altTextLogo : this.currentBrand.brand_name;
        }
    },
    computed: {
        hasAlias() {
            if (this.currentBrand) {
                if (this.currentBrand.alias) {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        }
    }
};
</script>