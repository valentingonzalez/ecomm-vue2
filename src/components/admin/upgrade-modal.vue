<template>
    <b-modal title="Fill out this form and a representative will contact you soon" size="lg" id="upgrade-modal" hide-footer>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="name">Name</label>
                <input id="name" v-model="name" class="form-control" type="text" placeholder="Name" required>
            </div>
            <div class="form-group">
                <label for="contact-number">Best Contact Number</label>
                <input id="contact-number" v-model="contactNumber" class="form-control" type="tel" placeholder="Contact Number" required>
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" v-model="message" class="form-control" rows="4" placeholder="Message" required></textarea>
            </div>
            
            <div v-if="loading" class="spinner-border mt-2"></div>

            <b-button type="submit" class="float-right font-weight-bold" variant="primary">Submit</b-button>
        </form>
    </b-modal>
</template>

<script>
import AdminService from '@/api-services/admin.service';

export default {
  name: 'UpgradeModal',
  data () {
    return {
        loading: false,
        name: '',
        contactNumber: '',
        message: ''
    };
  },
  methods: {
    submitForm() {
        if (this.name && this.contactNumber && this.message) {
            const form = new FormData();

            form.append("name", this.name);
            form.append("contact_no", this.contactNumber);
            form.append("message", this.message);

            this.loading = true;
            
            AdminService.sendUpgradeForm(form).then(() => {
                this.$swal("Your message has been sent", '', 'success');

                this.name = '';
                this.contactNumber = '';
                this.message = '';
                
                this.$bvModal.hide('upgrade-modal');

                this.loading = false;
            });
        } else {
            this.$swal("Please, fill in all fields", '', 'error');
        }
    }
  }
};
</script>

<style lang="scss">
    #upgrade-modal {
        .modal-header {
            padding: 12px 24px !important;
        }

        .modal-body {
            padding: 24px !important;
        }

        label {
            margin-bottom: 4px;
        }
    }
</style>
