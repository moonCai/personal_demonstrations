<template>
  <div class="hot-map-wrapper">
    <!-- header start -->
    <header-component secondaryTitle="时间轴 + 热力图"></header-component>

    <div id="hot-cesium"></div>

    <!-- 日期选择器 -->
    <time-line />
  </div>
</template>

<script>
  import TimeLine from "components/utilities/timeLine/TimeLine";

  import {
  defaultInitCesium
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
    created() {},
    mounted() {
      this.initScene();

      this.mapMoveEnd();
    },
    methods: {
      initScene() {
        this.mapViewer = defaultInitCesium("hot-cesium", "google", true);

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
  .hot-map-wrapper {
    width: 100%;
    height: 100%;
  }

  #hot-cesium {
    position: absolute;
    top: 90px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 1px solid rgba(1, 115, 166, 1);
  }

</style>
