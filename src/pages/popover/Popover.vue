<template>
  <div id="pop-over-cesium">
    <div class="remove" @click="removeEvent">移除所有气泡弹窗</div>
  </div>
</template>

<script>
  import { defaultInitCesium, TIAN_DI_TU } from "assets/js/cesium/mapInit";
  import { locationMixin } from "assets/js/mixin/mixin";

  import PopUp from "components/utilities/popUp/index";

  export default {
    data() {
      return {};
    },
    mixins: [locationMixin],
    mounted() {
      this.initScene();
    },
    methods: {
      // 场景初始化
      initScene() {
        this.mapViewer = defaultInitCesium("pop-over-cesium", TIAN_DI_TU, true);

        this.mapViewer.camera.setView({
          destination: Cesium.Rectangle.fromDegrees(
            ...this.hubeiGeoRect
          ),
        });

        this.mapViewer.zoomTo(this.mapViewer.entities);

        this.leftClickOnMapEvent();
      },

      // 左键单击
      leftClickOnMapEvent() {
        let targetViewer = this.mapViewer;

        let handler = new Cesium.ScreenSpaceEventHandler(
          targetViewer.scene.canvas
        );

        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction((movement) => {
          PopUp.popOver(targetViewer, movement);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      },

      removeEvent() {
        PopUp.removeAll();
      },
    },
  };
</script>

<style scoped lang="scss">
  #pop-over-cesium {
    width: 100%;
    height: 100%;
    background: rgba(3, 195, 255, 0.1);
    overflow: hidden;
  }

  .remove {
    width: 160px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    background: #0af;
    font-size: 16px;
    position: absolute;
    top: 20px;
    left: 20px;
    border-radius: 4px;
    z-index: 1000;
    cursor: pointer;
  }
</style>
