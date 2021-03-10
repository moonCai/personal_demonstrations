<template>
  <div id="hot-cesium">
    <!-- 日期选择器 -->
    <time-line />
  </div>
</template>

<script>
  import TimeLine from "components/utilities/timeLine/TimeLine";

  import {
    defaultInitCesium, TIAN_DI_TU
  } from "assets/js/cesium/mapInit";
  import heatData from "assets/js/data/data";
  import {
    drawHeatMap
  } from "components/utilities/heatMap/heatMap";

  import {
    locationMixin
  } from "assets/js/mixin/mixin";

  export default {
    data() {
      return {
        bounds: [],
        colors: {},
      };
    },
    components: {
      TimeLine,
    },
    mixins: [locationMixin],
    mounted() {
      this.initScene();

      this.mapMoveEnd();
    },
    methods: {
      initScene() {
        this.mapViewer = defaultInitCesium("hot-cesium", TIAN_DI_TU, true);

        this.drawHeatMap();
      },

      drawHeatMap() {
        let lngs = heatData.map((point) => point.lng);
        let lats = heatData.map((point) => point.lat);
        let minLng = Math.min(...lngs);
        let minLat = Math.min(...lats);
        let maxLng = Math.max(...lngs);
        let maxLat = Math.max(...lats);

        this.bounds = [minLng, minLat, maxLng, maxLat];

        this.colors = [{
            0: "rgb(0,0,255)"
          },
          {
            0.5: "rgb(0,255,0)"
          },
          {
            0.8: "rgb(255,255,0)"
          },
          {
            1: "rgb(255,0,0)"
          },
        ];

        drawHeatMap(this.mapViewer, heatData, this.bounds, this.colors);
      },

      mapMoveEnd() {
        let targetViewer = this.mapViewer;
        targetViewer.scene.camera.moveEnd.addEventListener(() => {
          drawHeatMap(targetViewer, heatData, this.bounds, this.colors);
        });
      },
    },
  };

</script>

<style lang="scss" scoped>
  #hot-cesium {
   width: 100%;
   height: 100%;
  }
</style>
