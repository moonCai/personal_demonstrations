<template>
  <div id="draw-modes">
    <!-- 单网格 / 多边形 / 矩形 -->
    <select-grids />
  </div>
</template>

<script>
  import { defaultInitCesium, A_MAP } from "assets/js/cesium/mapInit";
  import { locationMixin } from "assets/js/mixin/mixin";
  
  import SelectGrids from "components/utilities/drawModes/SelectGrids"
  import {
    getViewer
  } from "components/utilities/drawModes/index"

  export default {
    data() {
      return {};
    },
    mixins: [locationMixin],
    components: {
        SelectGrids
    },
    mounted() {
      this.initScene();

      getViewer(this.mapViewer);
    },
    methods: {
      initScene() {
        this.mapViewer = defaultInitCesium("draw-modes", A_MAP, true);
        this.mapViewer.scene.globe.depthTestAgainstTerrain = true
      },
    },
  };
</script>

<style lang="scss" scoped>
  #draw-modes {
    width: 100%;
    height: 100%;
  }
</style>
