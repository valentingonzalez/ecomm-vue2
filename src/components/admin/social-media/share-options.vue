<template>
    <b-form-group v-slot="{ ariaDescribedby }">
        <b-form-checkbox-group
            id="share-options"
            v-model="selected"
            :aria-describedby="ariaDescribedby"
            :disabled="loading"
            name="share-options"
            @change="updateSocialShareOptions"
        >
            <b-form-checkbox
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                class="bordered-checkbox" 
            >
                {{ option.text }}
            </b-form-checkbox>
        </b-form-checkbox-group>
    </b-form-group>
</template>

<script>
import AdminService from '@/api-services/admin.service';
import HomePageService from '@/api-services/homepage.service';

export default {
    name: 'ShareOptions',
    data() {
        return {
            loading: false,
            selected: [],
            options: [
                { text: 'Facebook', value: 'fb' },
                /* { text: 'Instagram', value: 'ig' }, */
                { text: 'LinkedIn', value: 'ln' },
                { text: 'Pinterest', value: 'pt' },
                { text: 'WhatsApp', value: 'wp' },
                { text: 'X (Twitter)', value: 'x' },
                { text: 'Copy Link', value: 'cl' },
            ]
        };
    },
    mounted() {
        this.getSelectedOptions();
    },
    methods: {
        getSelectedOptions() {
            const socialShareOpts = JSON.parse(this.$store.state.businessDetails.social_share_opts);
            this.selected = Array.isArray(socialShareOpts) ? socialShareOpts : [];
        },
        async updateSocialShareOptions() {
            this.loading = true;
            await AdminService.updateSocialShareOptions({opts: this.selected}).then(async () => {
                let r = await HomePageService.getBusinessDetails();
                this.$store.commit('setBusinessDetails', r.data.data);
                this.$swal({
                    toast: true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 2000,
                    type: 'success',
                    title: 'Share options updated!'
                });
            });
            this.loading = false;
        }
    },
};
</script>

<style scoped lang="scss">
.bordered-checkbox {
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 13px;
    padding-left: 33px;
    border: 1px solid #E2E8F0;
    border-radius: 7px;
    margin: 4px;
}
</style>