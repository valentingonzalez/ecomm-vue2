<template>
  <b-modal size="lg" class="modal-box" ref="testimonialModal">
    <div slot="modal-header">
      <h5>Add Testimonial</h5>
    </div>
    <div>
      <div class="form-group form-row">
        <div class="col-md-6">
          <label for="author">Author <span class="text-danger">*</span></label>
          <input required type="text" class="form-control" name="author" v-model="data.author" />
        </div>
        <div class="col-md-6">
          <label for="role">Role</label>
          <input required type="text" class="form-control" name="role" v-model="data.role" />
        </div>
      </div>
      <div class="form-group">
        <label for="message">Message <span class="text-danger">*</span></label>
        <textarea required class="form-control" name="message" id="message" rows="3" v-model="data.message"></textarea>
      </div>
      <div class="form-group">
        <label for="rating">Rating (will show only if applied)</label>
        <div class="row">
          <b-form-rating id="rating" v-model="data.rating" variant="warning" inline no-border show-clear></b-form-rating>
        </div>
      </div>
    </div>
    <div slot="modal-footer">
      <button type="submit" class="btn btn-primary" @click="saveTestimonial">Add</button>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'TestimonialModal',
  data() {
    return {
      data: {
        message: '',
        author: '',
        role: '',
        rating: ''
      }
    };
  },
  methods: {
    hideModal() {
      this.resetParams();
      this.$refs.testimonialModal.hide();
    },
    showModal() {
      this.resetParams();
      this.$refs.testimonialModal.show();
    },
    resetParams() {
      this.data.message = '';
      this.data.author = '';
      this.data.role = '';
      this.data.rating = '';
    },
    saveTestimonial() {
      this.$emit('saveTestimonial', this.data);
    }
  }
};
</script>

<style scoped lang="scss">
  label {
    font-weight: bold;
  }
</style>

