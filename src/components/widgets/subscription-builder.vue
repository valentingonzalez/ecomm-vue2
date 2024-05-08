<template>
  <div class="position-relative widget-builder">
    <div class="handle">
      <svg width="9" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M3 12v3H0v-3h3zm6 0v3H6v-3h3zM3 6v3H0V6h3zm6 0v3H6V6h3zM3 0v3H0V0h3zm6 0v3H6V0h3z" fill="#BCBCBC" fill-rule="evenodd"/></svg>
    </div>
    <Subscription
      :id="id"
      :title="title"
      :data="data"
      :editable="true"
      :hidden="hidden"
      :master="master"
      :associatedLocations="associatedLocations"
      @updateHidden="updateHidden"
      @updateTitle="updateTitle"
      @remove="remove"
      @onChange="onChange"
      @updateAssociatedLocations="updateAssociatedLocations"
    />
  </div>
</template>

<script>
import widgetsApiService from '@/api-services/widgets.service';
import Subscription from '@/components/widgets/subscription.vue';

export default {
  name: 'SubscriptionBuilder',
  components: {
    Subscription
  },
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
  data() {
    return {
      title: '',
      data: {},
      hidden: true,
      associatedLocations: null
    };
  },
  created() {
    let data = this.value ? typeof this.value == 'string' ? JSON.parse(this.value) : this.value : {};
    this.data = data.value || {};
    this.hidden = data.hidden;
    this.title = data.title;
    this.associatedLocations = this.widget.associated_locations || null;
  },
  methods: {
    remove() {
      this.$swal({
        title: 'Remove Subscription Widget',
        html: `Are you sure you want to remove Subscription Widget?`,
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
        this.onChange(this.data);
      }
    },
    updateAssociatedLocations(value) {
      if(this.associatedLocations != value) {
        this.associatedLocations = value;
        this.onChange(this.data);
      }
    },
    updateTitle(value) {
      if(this.title != value) {
        this.title = value;
        this.onChange(this.data);
      }
    },
    async onChange(data) {
      let ob = {
        id: this.id,
        value: JSON.stringify({ title: this.title, hidden: this.hidden, value: data }),
        associated_locations: this.associatedLocations
      };
      await widgetsApiService.update(ob);
      this.$swal({
        toast: true,
        position: 'top',
        type: 'success',
        html: `<div class="ml-2">Widget successfully updated</div>`,
        showConfirmButton: false,
        timer: 3000
      });
    }
  }
};
</script>


