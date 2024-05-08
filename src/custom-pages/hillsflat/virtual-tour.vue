<template>
  <div class="container pt-2 pb-5">
    <div class="row page-header">
      <div class="col-md-12">
        <span class="page-title">Welcome to Hills Flat Lumber Co.</span>
      </div>
    </div>
    <gmap-street-view-panorama
      class="pano"
      :position="{lat: 39.2217666, lng: -121.0481834}"
      :pov="pov" :zoom="1"
      @pano_changed="updatePano"
      @pov_changed="updatePov">
    </gmap-street-view-panorama>
  </div>
</template>

<script>
  export default  {
    name: 'VirtualTour',
    data() {
      return {
        pov: null,
        pano: null,
      };
    },
    methods: {
      updatePov(pov) {
        this.pov = pov;
      },
      updatePano(pano) {
        this.pano = pano;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .page-header {
    text-align: center;
    padding: 10px 0;
    .page-title {
      color: var(--primary);
      font-size: 24px;
      font-weight: bold;
    }
  }

  .pano {
    width: 100%;
    height: 500px;
  }
</style>
