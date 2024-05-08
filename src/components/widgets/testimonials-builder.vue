<template>
  <div class="position-relative widget-builder">
    <div class="handle">
      <svg width="9" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M3 12v3H0v-3h3zm6 0v3H6v-3h3zM3 6v3H0V6h3zm6 0v3H6V6h3zM3 0v3H0V0h3zm6 0v3H6V0h3z" fill="#BCBCBC" fill-rule="evenodd"/></svg>
    </div>
    <Testimonials
      :ref="`testimonials-${id}`"
      :id="id"
      :title="title" @updateTitle="updateTitle"
      :testimonials="testimonials"
      :editable="true"
      :hidden="hidden"
      :master="master"
      :associatedLocations="associatedLocations"
      @updateHidden="updateHidden"
      @remove="remove"
      @removeItem="removeItem"
      @addItem="addItem"
      @onChange="onChange"
      @updateAssociatedLocations="updateAssociatedLocations"
    />
    <TestimonialModal @saveTestimonial="saveTestimonial" ref="testimonialModal" />
  </div>
</template>

<script>
import widgetsApiService from '@/api-services/widgets.service';
import TestimonialModal from '@/components/modals/add-testimonial';

export default {
  name: 'TestimonialsBuilder',
  props: {
    id: {
      default: null
    },
    value: {
      default: null
    },
    master: {
      default: false
    },
    widget: {
      default: null
    }
  },
  components: {
    TestimonialModal
  },
  data() {
    return {
      template:
      {
        id: 1,
        message: 'message',
        author: 'author',
        role: 'role',
        rating: 'rating'
      },
      title: '',
      testimonials: [],
      hidden: true,
      associatedLocations: null
    };
  },
  created() {
    let data = this.value ? typeof this.value == 'string' ? JSON.parse(this.value) : this.value : [];
    this.testimonials = data.testimonials || [];
    this.hidden = data.hidden;
    this.title = data.title;
    this.associatedLocations = this.widget.associated_locations || null;
  },
  methods: {
    remove() {
      this.$swal({
        title: 'Remove Testimonials',
        html: `Are you sure you want to remove this Testimonial widget?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          this.$emit('remove', this.id);
        }
      });
    },
    updateHidden(value) {
      if(this.hidden != value) {
        this.hidden = value;
        this.updateWidget();
      }      
    },
    updateAssociatedLocations(value) {
      if(this.associatedLocations != value) {
        this.associatedLocations = value;
        this.updateWidget();
      }
    },
    updateTitle(value) {
      if(this.title != value) {
        this.title = value;
        this.updateWidget();
      }      
    },
    async updateWidget(adding = false) {
      let ob = {
        id: this.id,
        value: JSON.stringify({ title: this.title, hidden: this.hidden, testimonials: this.testimonials }),
        associated_locations: this.associatedLocations
      };
      let validate = true;
      this.testimonials.forEach((itm,idx) => {
        if(validate){
          validate = this.validateTestimonial(itm);
        }
      });
      if(!validate){
        return;
      }
      await widgetsApiService.update(ob).then(() => {
        if(adding)
          this.$refs[`testimonials-${this.id}`].swiper.slideTo(this.$refs[`testimonials-${this.id}`].swiper.slides.length + 1);
      });
      this.$swal({
        toast: true,
        position: 'top',
        type: 'success',
        html: `<div class="ml-2">Widget successfully updated</div>`,
        showConfirmButton: false,
        timer: 3000
      });
    },
    removeItem(item) {
      this.$swal({
        title: 'Remove Testimonial',
        html: `Are you sure you want to remove this Testimonial from the Testimonials Swiper?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if(result.value) {
          this.testimonials.splice(this.testimonials.findIndex(i => i.id == item.id), 1);
          this.updateWidget();
        }
      });
    },
    validateTestimonial(data){
      let msg = [];
      if(!data.author || (data.author && data.author.trim() == "")) {
        msg.push("Testimonial Author's name is missing");
      }
      if(!data.message || (data.message && data.message.trim() == "")) {
        msg.push("Testimonial Message is missing");
      }    
      if(msg.length > 0){
        this.$swal('Error', msg.join('<br>'), 'error');
        return false;
      }  
      return true;
    },
    saveTestimonial(data) {
      if(!this.validateTestimonial(data)){
        return;
      }
      // this is the best way I found for creating ids. Such an amateur :/
      data.id = 0;
      let item = {...data},
          n    = {id: -1};
      if(this.testimonials.length)
        n = [...this.testimonials].reduce((p, c) => (p.id > c.id) ? p : c);
      item.id = n.id + 1;
      this.testimonials.push(item);
      this.updateWidget(true);
      this.$refs.testimonialModal.hideModal();
    },
    addItem() {
      this.$refs.testimonialModal.showModal();
    },
    onChange(item) {
      this.testimonials = this.testimonials.map(e => e.id === item.id ? item : e);
      this.updateWidget();
    }
  }
};
</script>


