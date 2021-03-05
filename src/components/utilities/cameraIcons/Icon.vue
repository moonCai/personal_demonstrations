<template>
  <div class="icon-wrapper">
    <img class="camera" src="./images/video.png" />
    <div class="line"></div>
    <div class="item circle1"></div>
    <div class="item circle2"></div>
    <div class="item circle3"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        windowInfos: [],
      };
    },
    methods: {
      // 地图移动事件
      mapChangedEvent(targetViewer) {
        let scene = targetViewer.scene;
        scene.camera.percentageChanged = 0.00001;

        scene.camera.changed.addEventListener(() => {
          if (this.windowInfos.length == 0) return;

          this.windowInfos.forEach((windowInfo) => {
            // 判断某个cartesian3是否出现在地球背面
            const occluder = new Cesium.EllipsoidalOccluder(
              scene.globe.ellipsoid,
              targetViewer.camera.position
            );
            const visible = occluder.isPointVisible(windowInfo.cartesian3);

            if (!visible) {
              windowInfo.icon.hide(windowInfo.id);
              return;
            }

            let windowPoint = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              scene,
              windowInfo.cartesian3
            );

            windowInfo.icon.display(windowPoint, windowInfo.id);
          });
        });
      },

      display(point, iconId, windowInfos) {
        windowInfos && (this.windowInfos = windowInfos);

        let $cameraIcon = $(`#${iconId}`);
        $cameraIcon
          .css({
            left: `${point.x}px`,
            top: `${point.y - $cameraIcon.height()}px`,
          })
          .show();
      },

      // 隐藏或移除
      hide(iconId, isRemove) {
        $(`#${iconId}`).hide();

        if (!isRemove) return;

        let index = this.windowInfos.findIndex(
          (windowInfo) => windowInfo.id == iconId
        );

        this.windowInfos.splice(index, 1);
      },
    },
  };
</script>

<style>
  .icon-wrapper {
    width: 60px;
    height: 130px;
    position: absolute;
    transform: translateX(-50%);
    z-index: 100;
    box-sizing: content-box;
    pointer-events: none;
  }

  .camera {
    width: 45px;
    position: absolute;
    top: 10px;
    left: 50%;
    margin-left: -23px;
    animation: jump 1.3s linear infinite forwards;
  }

  .line {
    width: 4px;
    height: 71px;
    border-radius: 2px;
    background: url(./images/line.png) no-repeat center / cover;
    position: absolute;
    top: 55px;
    left: 50%;
    margin-left: -2px;
    margin-top: 0;
    animation: jump 1.3s linear infinite forwards;
  }

  .item {
    width: 10px;
    height: 6px;
    border-radius: 50%;
    background: rgba(228, 57, 96, 1);
    position: absolute;
    left: 50%;
    top: 127px;
    transform: translateX(-50%);
  }

  .circle2 {
    opacity: 0;
    animation: spread1 1.3s linear infinite;
  }

  .circle3 {
    opacity: 0;
    animation: spread1 1.3s linear 0.4s infinite;
  }

  @keyframes spread1 {
    0% {
      transform: translateX(-50%) scale(1.5);
      opacity: 0;
    }

    40% {
      transform: translateX(-50%) scale(3);
      opacity: 0.5;
    }

    100% {
      transform: translateX(-50%) scale(6);
      opacity: 0.1;
    }
  }

  @keyframes jump {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-10px);
    }

    100% {
      transform: translateY(0);
    }
  }
</style>
