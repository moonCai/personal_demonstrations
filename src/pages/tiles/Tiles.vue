<template>
  <div class id="mutiple-cesium"></div>
</template>

<script>
  import {
    defaultInitCesium, TIAN_DI_TU
  } from "assets/js/cesium/mapInit";
  import {
    locationMixin
  } from "assets/js/mixin/mixin";

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
        this.mapViewer = defaultInitCesium("mutiple-cesium", TIAN_DI_TU, true);

        this.videoProjectionTest();

        this.load3DTiles(this.mapViewer);
      },

      videoProjectionTest() {
        let video = document.createElement("video");
        video.muted = "muted";
        video.controls = "controls";
        video.className = "video";
        // video.id = `video-${videoData.camera_id}`;
        video.loop = "loop";
        video.crossOrigin = "anonymous";
        // video.style.display = "none";
        video.src = "../../../static/videos/output.mp4";
        video.play();

        document.getElementById("mutiple-cesium").appendChild(video);

        let entity = this.mapViewer.entities.add({
          // id: `entity-${videoData.camera_id}`,
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
              120.4861454,
              30.7463254,
              120.4859977,
              30.7460733,
              120.4859294,
              30.7460214,
              120.4858475,
              30.7460026,
              120.4858238,
              30.745933,
              120.4861638,
              30.7459923,
              120.4862334,
              30.746273,
            ]),
            // height: 3,
            // 左上 右上 右下 左下
            material: video,
            zIndex: 10,
          },
        });

        this.mapViewer.zoomTo(entity);
      },

      load3DTiles(viewer) {
        let tileset = new Cesium.Cesium3DTileset({
          url: "http://geoserver.iwhere.com/3d/wuzhen3DTILES/tileset.json",
        });

        tileset.readyPromise
          .then(function (tileset) {
            viewer.scene.primitives.add(tileset);
            // viewer.zoomTo(
            //   tileset,
            //   new Cesium.HeadingPitchRange(
            //     0.0,
            //     -0.5,
            //     tileset.boundingSphere.radius * 1
            //   )
            // );
          })
          .otherwise(function (error) {
            console.log(error);
          });
      },
    },
    beforeDestroy() {
      this.mapViewer && this.mapViewer.destroy();
    },
  };

</script>

<style scoped lang="scss">
  #mutiple-cesium {
    width: 100%;
    height: 100%;
    background: rgba(3, 195, 255, 0.1);
    overflow: hidden;
  }

  #mutiple-cesium>>>video {
    width: 320px;
    height: 180px;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 100;
  }
</style>
