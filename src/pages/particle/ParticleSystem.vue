<template>
  <div id="particle-cesium"></div>
</template>

<script>
  import { server } from "request/api.js";

  import { locationMixin } from "assets/js/mixin/mixin";
  import { defaultInitCesium, TIAN_DI_TU } from "assets/js/cesium/mapInit";

  export default {
    data() {
      return {};
    },
    mixins: [locationMixin],

    mounted() {
      this.initScene();
    },
    methods: {
      initScene() {
        this.mapViewer = defaultInitCesium("query-cesium", TIAN_DI_TU, true);

        this.mapViewer.camera.setView({
          destination: Cesium.Rectangle.fromDegrees(...this.hubeiGeoRect),
        });

        // 精细网格
        this.fine_grid_primitives = this.mapViewer.scene.primitives.add(
          new Cesium.PrimitiveCollection()
        );

        this.mapMoveEndEvent();
      },
    },
  };
</script>

<style scoped>
  #particle-cesium {
    width: 100%;
    height: 100%;
    background: yellowgreen;
  }
</style>
