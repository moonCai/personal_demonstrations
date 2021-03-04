<template>
  <div class="pop-up-wrapper" ref="popup">
    <!-- 起点圆 -->
    <div class="start-circle"></div>
    <div class="plus"></div>
    <div class="plus1"></div>

    <!-- 连线 -->
    <div class="line"></div>

    <!-- 终点圆 -->
    <div class="end-circle"></div>

    <!-- 信息弹窗 -->
    <div class="pop-up">
      <div class="border-left"></div>
      <div class="border-top"></div>

      <!-- 关闭 -->
      <img
        src="./images/close.png"
        alt=""
        class="close"
        @click="hide(id, true)"
      />

      <!-- 标题 -->
      <div class="title">北京市</div>

      <ul class="info-wrapper">
        <li>
          <span class="icon"></span>
          <span class="info">概述：万科·西庐</span>
        </li>
        <li>
          <span class="icon"></span>
          <span class="info">已经使用人工：1744</span>
        </li>
        <li>
          <span class="icon"></span>
          <span class="info">剩余人工：310</span>
        </li>
        <li>
          <span class="icon"></span>
          <span class="info">概述：万科·西庐</span>
        </li>
        <li>
          <span class="icon"></span>
          <span class="info">已经使用人工：1744</span>
        </li>
        <li>
          <span class="icon"></span>
          <span class="info">剩余人工：310</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      windowInfos: [],
      id: "",
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
            windowInfo.popUp.hide(windowInfo.id);
            return;
          }

          let windowPoint = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            scene,
            windowInfo.cartesian3
          );

          windowInfo.popUp.show(windowPoint, windowInfo.id);
        });
      });
    },

    // 显示或移动
    show(point, popUpId, windowInfos) {
      this.id = popUpId;
      windowInfos && (this.windowInfos = windowInfos);

      let $popUpWindow = $(`#${popUpId}`);
      $popUpWindow
        .css({
          left: `${point.x}px`,
          top: `${point.y - $popUpWindow.height()}px`,
        })
        .show();
    },

    // 隐藏或移除
    hide(popUpId, isRemove) {
      $(`#${popUpId}`).hide();

      if (!isRemove) return;

      let index = this.windowInfos.findIndex(
        (windowInfo) => windowInfo.id == popUpId
      );

      this.windowInfos.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.pop-up-wrapper {
  width: 1px;
  height: 150px;
  position: absolute;
  z-index: 100;
  box-sizing: border-box;
  pointer-events: none;
  display: none;
}
.close {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 13px;
  right: 13px;
  pointer-events: fill;
  cursor: pointer;
}
.start-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: translate(-50%, 50%);
  background: url("./images/circle.png") no-repeat center / cover;
}
.plus {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: translate(-50%, 50%);
  box-sizing: content-box;
  background: rgba(0, 170, 255, 1);
  animation: warn 1.2s linear forwards 0.2s infinite;
  z-index: 1;
}
.plus1 {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: translate(-50%, 50%);
  box-sizing: content-box;
  background: rgba(0, 170, 255, 1);
  animation: warn1 1.2s linear forwards infinite;
  z-index: 2;
}

.line {
  width: 1px;
  height: 130px;
  position: absolute;
  left: 103px;
  top: 25px;
  background: rgba(0, 170, 255, 1);
  transform: translate(-54px, 3px) rotate(40deg);
  opacity: 0;
  animation: animation02 0.25s forwards 0.25s;
  z-index: 10;
}

.end-circle {
  width: 20px;
  height: 20px;
  background: url("./images/map.png");
  background-size: 200px;
  border-radius: 50%;
  transform: translateY(50%);
  position: absolute;
  left: 100px;
  top: 3px;
  opacity: 0;
  animation: animation03 1s linear 0.5s infinite;
  z-index: 20;
}

.pop-up {
  width: 260px;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(90px, 0);
  border: 1px solid #0af;
  background: rgba(0, 20, 60, 0.8);
  opacity: 0;
  animation: animation02 0.25s forwards 0.75s;
  border-radius: 8px;
  box-shadow: inset 0 0 10px 5px rgba(0, 170, 255, 0.8);
}

.title {
  color: #fff;
  font-size: 14px;
  font-weight: 460;
  height: 25px;
  line-height: 25px;
  text-align: left;
  padding-left: 25px;
  margin-top: 10px;
  background: linear-gradient(120deg, transparent 20px, #0af 0);
  margin-left: 20px;
  position: relative;
  opacity: 0;
  animation: animation04 0.75s forwards 1.25s;
}
.title::before {
  content: "";
  width: 0;
  height: 1px;
  background: #0af;
  position: absolute;
  right: 0;
  bottom: -5px;
  animation: animation05 0.75s forwards 1.25s;
}
.info-wrapper {
  margin-top: 15px;
  margin-bottom: 10px;
  opacity: 0;
  animation: animation06 0.5s forwards 1.75s;
}
.info-wrapper li {
  height: 22px;
  line-height: 22px;
  padding-left: 20px;
  text-align: left;
}
.info-wrapper li .icon {
  width: 10px;
  height: 10px;
  display: inline-block;
  background: url(./images/item.png) no-repeat center / cover;
  border-radius: 50%;
}
.info-wrapper li .info {
  color: #fff;
  font-size: 12px;
}

@keyframes animation02 {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes animation03 {
  0% {
    opacity: 1;
    background-position-x: 0px;
  }
  100% {
    opacity: 1;
    background-position-x: -20px;
  }
}

@keyframes animation04 {
  0% {
    opacity: 0;
    width: 0;
  }
  50% {
    opacity: 0.5;
    width: 200px;
  }
  100% {
    opacity: 1;
    width: 195px;
  }
}

@keyframes animation05 {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

@keyframes animation06 {
  0% {
    opacity: 0;
    transform: scale(1);
  }
  80% {
    opacity: 0.8;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes warn {
  0% {
    transform: translate(-50%, 50%) scale(1);
    opacity: 0;
  }
  25% {
    transform: translate(-50%, 50%) scale(2);
    opacity: 0.4;
  }
  50% {
    transform: translate(-50%, 50%) scale(3);
    opacity: 0.3;
  }
  75% {
    transform: translate(-50%, 50%) scale(4);
    opacity: 0.2;
  }
  100% {
    transform: translate(-50%, 50%) scale(5);
    opacity: 0.1;
  }
}
@keyframes warn1 {
  0% {
    transform: translate(-50%, 50%) scale(0);
    opacity: 0;
  }
  25% {
    transform: translate(-50%, 50%) scale(0.5);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, 50%) scale(1);
    opacity: 0.6;
  }
  75% {
    transform: translate(-50%, 50%) scale(1.5);
    opacity: 0.4;
  }
  100% {
    transform: translate(-50%, 50%) scale(2);
    opacity: 0.1;
  }
}
</style>