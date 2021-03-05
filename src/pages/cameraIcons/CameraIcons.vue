<template>
  <div id="camera-icons">
    <!-- <icon x="200" y="200" iconId="1" /> -->
    <!-- <icon x="130" y="120" iconId="2" /> 
      <icon x="280" y="230" iconId="3" />
      <icon x="330" y="204" iconId="4" />
      <icon x="430" y="600" iconId="5" />
      <icon x="940" y="120" iconId="6" />
      <icon x="740" y="260" iconId="7" />
      <icon x="640" y="660" iconId="8" />
      <icon x="530" y="460" iconId="9" />
      <icon x="840" y="600" iconId="10" />
      <icon x="550" y="680" iconId="11"/>  -->
  </div>
</template>

<script>
  import { defaultInitCesium } from "assets/js/cesium/mapInit";
  import { locationMixin } from "assets/js/mixin/mixin";

  //   import Icon from "components/utilities/cameraIcons/Icon"
  import CameraIcon from "components/utilities/cameraIcons/index";

  export default {
    data() {
      return {};
    },
    mixins: [locationMixin],
    // components: {
    //   Icon,
    // },
    mounted() {
      this.mapViewer = defaultInitCesium("camera-icons", "tiandiTu", true);

      this.mapViewer.camera.setView({
        destination: Cesium.Rectangle.fromDegrees(...this.hubeiGeoRect),
      });

      this.leftClickOnMapEvent();
    },
    methods: {
      leftClickOnMapEvent() {
        let targetViewer = this.mapViewer;

        let handler = new Cesium.ScreenSpaceEventHandler(
          targetViewer.scene.canvas
        );

        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction((movement) => {
          CameraIcon.show(targetViewer, movement);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      },
    },
  };
</script>

<style scoped>
  #camera-icons {
    width: 100%;
    height: 100%;
  }
</style>
