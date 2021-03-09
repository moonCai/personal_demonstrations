<template>
  <div id="camera-icons">
    <div class="svg-wrapper">
      <svg height="40" width="200" xmlns="http://www.w3.org/2000/svg">
        <rect id="shape" height="40" width="200" />
      </svg>
      <div id="text" @click="removeIcons">
        移除/显示摄像头图标
      </div>
    </div>
  </div>
</template>

<script>
  import { defaultInitCesium } from "assets/js/cesium/mapInit";
  import { locationMixin } from "assets/js/mixin/mixin";

  import CameraIcon from "components/utilities/cameraIcons/index";

  export default {
    data() {
      return {
        show: true,
      };
    },
    mixins: [locationMixin],
    mounted() {
      this.mapViewer = defaultInitCesium("camera-icons", "tiandiTu", true);

      this.mapViewer.camera.setView({
        destination: Cesium.Rectangle.fromDegrees(...this.hubeiGeoRect),
      });

      this.addCameraIcons();
    },
    methods: {
      addCameraIcons() {
        let cameraInfos = [
          {
            lon: 113.8,
            lat: 30.5,
            id: "camera01",
          },
          {
            lon: 113.6,
            lat: 30.2,
            id: "camera02",
          },
          {
            lon: 113.5,
            lat: 30.7,
            id: "camera03",
          },
        ];

        CameraIcon.show(this.mapViewer, cameraInfos);

        // cameraInfos.forEach((info) => {
        //   CameraIcon.show(this.mapViewer, info);
        // });
      },

      removeIcons() {
        if (this.show) {
          CameraIcon.removeAll();
        } else {
          this.addCameraIcons();
        }

        this.show = !this.show;
      },
    },
  };
</script>

<style scoped>
  #camera-icons {
    width: 100%;
    height: 100%;
  }

  .svg-wrapper {
    width: 200px;
    height: 40px;
    line-height: 40px;
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 100;
    background: rgb(66, 31, 58);
    border-radius: 5px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
  }

  #shape {
    stroke-width: 3px;
    fill: transparent;
    stroke: #e43960;
    stroke-dasharray: 260 400;
    stroke-dashoffset: -240;
    transition: 1s all ease;
  }

  .svg-wrapper:hover #shape {
    stroke-dasharray: 50 0;
    stroke-width: 3px;
    stroke-dashoffset: 0;
    stroke: #e43960;
  }

  #text {
    font-size: 14px;
    color: #fff;
    font-weight: 340;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }
</style>
