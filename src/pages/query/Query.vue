<template>
  <div id="query-cesium">
    <!-- 显示/隐藏网格 -->
    <input type="button" class="fine-grids" value="显示/隐藏网格" @click="showOrHiddenGrids">

    <!-- 单网格/多变形/路径查询 -->
    <select-grids @displayConfigWidth="displayConfigWidthEvent" />

    <!-- 路径宽度设置 -->
    <config-path-width v-show="showConfigWidth" @displayConfigWidth="displayConfigWidthEvent"/>
  </div>
</template>

<script>
  import {
    server
  } from "request/api.js"

  import {
    locationMixin
  } from "assets/js/mixin/mixin";
  import {
    defaultInitCesium, TIAN_DI_TU
  } from "assets/js/cesium/mapInit";
  import {
    getVisibleRegion
  } from "assets/js/cesium/regionAndLevel"
  import {
    draw2dOutlineGridsPrimitives
  } from "assets/js/cesium/drawGrids"

  import {
    getViewer
  } from "components/utilities/GridQuery/index"

  import SelectGrids from "components/utilities/GridQuery/SelectGrids"
  import ConfigPathWidth from "./children/ConfigPathWidth"

  export default {
    data() {
      return {
        showGrids: false,
        fine_grid_primitives: null,
        showConfigWidth: false
      }
    },
    mixins: [locationMixin],
    components: {
      SelectGrids,
      ConfigPathWidth
    },
    mounted() {
      this.initScene();

      // 屏蔽鼠标右键默认事件
      $(document).bind("contextmenu", () => false);

      getViewer(this.mapViewer);
    },
    methods: {
      initScene() {
        this.mapViewer = defaultInitCesium('query-cesium', TIAN_DI_TU, true);

        this.mapViewer.camera.setView({
          destination: Cesium.Rectangle.fromDegrees(
            ...this.hubeiGeoRect
          ),
        });

        // 精细网格
        this.fine_grid_primitives = this.mapViewer.scene.primitives.add(
          new Cesium.PrimitiveCollection()
        );

        this.mapMoveEndEvent()
      },

      // 地图移动结束, 更新精细网格
      mapMoveEndEvent() {
        this.mapViewer.scene.camera.moveEnd.addEventListener(() => {
          if (!this.showGrids) return;

          this.loadFineGridsData();
        });
      },

      displayConfigWidthEvent(display) {
        this.showConfigWidth = display
      },

      // 显示或隐藏网格
      showOrHiddenGrids() {
        this.showGrids = !this.showGrids;

        if (this.showGrids) {
          this.loadFineGridsData();
          return
        }

        for (let i = 0; i < this.fine_grid_primitives.length; i++) {
          this.fine_grid_primitives.get(i).show = this.showGrids;
        }
      },

      // 加载精细网格
      loadFineGridsData() {
        this.fine_grid_primitives.removeAll();

        let {
          ymin,
          ymax,
          xmin,
          xmax,
          height
        } = getVisibleRegion(this.mapViewer);

        let params = {
          lats: [ymin, ymin, ymax, ymax].join(","),
          lngs: [xmin, xmax, xmax, xmin].join(","),
          video_height: height,
        }

        server.getFineGridsDataInfo(params).then(response => {
          if (response.server_status != 200) return;

          let gridsData = response.geo_num_list;
          let primitives = this.fine_grid_primitives;
          let rgba = {
            red: 77 / 255,
            green: 149 / 255,
            blue: 240 / 255,
            alpha: 0.5
          }

          draw2dOutlineGridsPrimitives(
            gridsData,
            primitives,
            rgba
          );

        })
      }
    }
  }

</script>

<style scoped>
  #query-cesium {
   width: 100%;
   height: 100%;
  }

  .fine-grids {
    width: 160px;
    height: 40px;
    line-height: 40px;
    background: #0af;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1000;
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.4);
    outline: none;
    border: none;
    cursor: pointer;
  }

</style>
