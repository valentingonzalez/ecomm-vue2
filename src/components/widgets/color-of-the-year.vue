<template>
  <div>
    <section class="widget pb-0 mb-0" :class="{'editable mb-4': editable}">
      <WidgetHeader name="Color Of The Year" :id="id" @remove="remove" @updateHidden="updateHidden" :hidden="hidden" :master="master" @updateAssociatedLocations="updateAssociatedLocations" :associatedLocations="associatedLocations" v-if="editable" />
      <div class="wrapper">
        <div :class="{ 'container': !editable }">
          <div class="row">
            <div class="col-md-6 col-wrapper">
              <div class="h-100 d-flex flex-column justify-content-center column px-3 py-5">
                <div class="h3">Shop Benjamin Moore's 2023</div>
                <div class="display-5 mb-3 font-weight-normal">Color of the Year</div>
                <div class="textarea">
                  A vivacious shade of coral tinged with pink, Raspberry Blush enlivens the senses with an electric optimism.
                </div>
              </div>
            </div>
            <div class="col-md-6 col-wrapper">
              <div class="d-flex align-items-center justify-content-center h-100 column px-2 py-5">
                <img class="main-img" src="https://storage.googleapis.com/content.ezadtv.com/media/7731/Screen Shot 2023-07-26 at 7.30.30.png" alt="Colo of the Year" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import 'verte/dist/verte.css';

export default {
  name: 'ColorOfTheYear',
  props: {
    id: {
      default: null
    },
    editable: {
      default: false
    },
    hidden: {
      default: true
    },
    master: {
      default: false
    },
    associatedLocations: {
      default: null
    }
  },
  data() {
    return {
    };
  },
  methods: {
    remove() {
      this.$emit('remove');
    },
    updateHidden(val) {
      this.$emit('updateHidden', val);
    },
    updateAssociatedLocations(val) {
      this.$emit('updateAssociatedLocations', val);
    }
  }
};
</script>
<style scoped lang="scss">
  .wrapper {
    background: #D76059;
  }
  .col.active {
    z-index: 10;
  }
  .textarea {
    font-size: 22px;
  }
  .column {
    min-height: 300px;
  }
  .main-img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
</style>