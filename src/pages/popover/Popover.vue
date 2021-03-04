<template>
  <div id="pop-over-wrapper">
    <!-- header -->
    <header-component secondaryTitle="动态弹窗"></header-component>

    <!-- content -->
    <div class="" id="pop-over-cesium">
      <div class="remove" @click="removeEvent">移除所有气泡弹窗</div>
    </div>
  </div>
</template>

<script>
  import {
    defaultInitCesium
  } from "assets/js/cesium/mapInit";
  import {
    locationMixin
  } from "assets/js/mixin/mixin";

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
        this.mapViewer = defaultInitCesium("pop-over-cesium", "google", true);

        this.mapViewer.camera.setView({
          destination: Cesium.Rectangle.fromDegrees(
            this.hubeiGeoRect[0],
            this.hubeiGeoRect[1],
            this.hubeiGeoRect[2],
            this.hubeiGeoRect[3]
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
  #pop-over-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgb(7, 17, 43);
  }

  #pop-over-cesium {
    position: absolute;
    top: 90px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    background: rgba(3, 195, 255, 0.1);
    border: 1px solid rgb(60, 117, 219);
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
