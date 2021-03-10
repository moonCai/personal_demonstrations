<template>
  <div class="icon-wrapper">
    <div class="camera-info">
      <div class="name">G98 45km 200m路段 定安海口方向</div>
      <img class="close" src="./images/close.png" @click="closeEvent">
      <video src="static/videos/origin.mp4" autoplay muted controls loop></video>
    </div>
    <div class="near">
      <img class="camera" src="./images/video.png" @click="showCameraInfo" />
      <div class="line"></div>
      <div class="item circle1"></div>
      <div class="item circle2"></div>
      <div class="item circle3"></div>
    </div>

    <div class="far"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    methods: {
      closeEvent() {
        $(`#${this.$el.id} .camera-info`).hide();
      },

      showCameraInfo() {
        $(`#${this.$el.id} .camera-info`).show();
      },
    },
  };
</script>

<style scoped>
  .icon-wrapper {
    width: 45px;
    height: 130px;
    position: absolute;
    transform: translateX(-50%);
    z-index: 100;
    box-sizing: content-box;
    pointer-events: none;
  }

  .camera-info {
    width: 250px;
    background: rgba(66, 31, 57, 0.8);
    border: 1px solid rgba(228, 57, 96, 0.6);
    position: absolute;
    left: 105%;
    bottom: 0;
    display: none;
    box-sizing: content-box;
    border-top-left-radius: 10px;
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.4);
  }

  .camera-info .name {
    width: 220px;
    height: 36px;
    line-height: 36px;
    color: #fff;
    font-size: 13px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .camera-info video {
    height: 141px;
    display: block;
    margin: auto;
    pointer-events: auto;
  }

  .camera-info .close {
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    pointer-events: auto;
  }

  .near,
  .far {
    width: 100%;
    height: 100%;
    display: none;
  }

  .far {
    width: 30px;
    height: 32px;
    margin: auto;
    background: url(~components/utilities/cameraIcons/images/video.png)
      no-repeat top / cover;
    background-size: 30px 30px;
    position: relative;
  }

  .far::after {
    content: "";
    width: 10px;
    height: 10px;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 50%);
    border-top: 5px solid #e43960;
    border-bottom: 5px solid transparent;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
  }

  .camera {
    width: 45px;
    position: absolute;
    top: 10px;
    left: 50%;
    margin-left: -23px;
    animation: jump 1.3s linear infinite forwards;
    cursor: pointer;
    pointer-events: auto;
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
