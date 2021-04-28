<template>
  <div id="video-cesium"></div>
</template>

<script>
  import {
    defaultInitCesium,
    A_MAP
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

      this.mapViewer.entities.add({
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            111.6696577537, 32.3860845421254,
            111.669578030629, 32.3860882254388,
            111.669555841262, 32.3860744355544,
            111.669541236867, 32.3860303597056,
            111.66952640249, 32.3859003497657,
            111.669471351983, 32.3858899810826,
            111.669472604809, 32.3860502738813,
            111.669462740851, 32.3860746455394,
            111.669444561691, 32.3860943978685,
            111.669268626396, 32.3861011020765,
            111.669416841524, 32.386239503648,
            111.669642884853, 32.3861977115576,
            111.6696577537, 32.3860845421254,
          ]),
          material: "../../static/source.png",
          height: 0,
          // rotation: Cesium.Math.toRadians(videoData.rotate),
          zIndex: 10,
        },
      });

      this.mapViewer.zoomTo(this.mapViewer.entities);
    },
    methods: {
      // 场景初始化
      initScene() {
        this.mapViewer = defaultInitCesium("video-cesium", A_MAP, true);

        // let cameraInfos = [
        //   {
        //     url: "../../static/videos/fz_01.mp4",
        //     height: 0,
        //     rotate: 0,
        //     rect: [
        //       112.85559599980972,
        //       32.22542166464191,
        //       112.88126558792408,
        //       32.228334693976315,
        //       112.86794853822715,
        //       32.21100176246591,
        //       112.85800674979589,
        //       32.21230545210992,
        //       112.85559599980972,
        //       32.22542166464191,
        //     ],
        //   },
        //   {
        //     url: "../../static/videos/fz_02.mp4",
        //     height: 0.4,
        //     rotate: 180,
        //     rect: [
        //       112.85213569976844,
        //       32.197190483562935,
        //       112.84286576750961,
        //       32.2175196295174,
        //       112.8591768335147,
        //       32.2205860081912,
        //       112.86394689082967,
        //       32.21437102986036,
        //       112.85213569976844,
        //       32.197190483562935,
        //     ],
        //   },
        //   {
        //     url: "../../static/videos/fz_03.mp4",
        //     height: 0.2,
        //     rotate: 0,
        //     rect: [
        //       112.89346167292162,
        //       32.18943146681602,
        //       112.85669646519236,
        //       32.19825237269494,
        //       112.85855478802513,
        //       32.21384380104021,
        //       112.86780036427353,
        //       32.21602834307125,
        //       112.89346167292162,
        //       32.18943146681602,
        //     ],
        //   },
        //   {
        //     url: "../../static/videos/fz_04.mp4",
        //     height: 0.3,
        //     rotate: 0,
        //     rect: [
        //       112.86074556399112,
        //       32.212754512885134,
        //       112.86933130488069,
        //       32.221228200301134,
        //       112.87344604254368,
        //       32.2169102656137,
        //       112.86965853576844,
        //       32.21144201262658,
        //       112.86074556399112,
        //       32.212754512885134,
        //     ],
        //   },
        // ];

        // cameraInfos.forEach((videoData) => {
        //   this.videoProjectionAndPlay(videoData);
        // });
      },

      // 视频投影
      videoProjectionAndPlay(videoData) {
        // 创建投影源标签
        let video = document.createElement("video");
        video.muted = "muted";
        video.controls = "controls";
        video.className = "video";
        video.loop = "loop";
        video.crossOrigin = "anonymous";
        video.style.display = "none";
        video.src = videoData.url;
        video.play();

        document.getElementById("video-cesium").appendChild(video);

        let entity = this.mapViewer.entities.add({
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(videoData.rect),
            material: video,
            height: videoData.height,
            rotation: Cesium.Math.toRadians(videoData.rotate),
            zIndex: 10,
          },
        });

        this.mapViewer.zoomTo(this.mapViewer.entities);
      },
    },
  };

</script>

<style scoped lang="scss">
  #video-cesium {
    width: 100%;
    height: 100%;
  }

  #video-cesium>>>video {
    width: 320px;
    height: 180px;
    position: absolute;
    right: 0;
    bottom: 0;
  }

</style>
