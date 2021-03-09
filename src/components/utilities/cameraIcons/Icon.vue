<template>
  <div class="icon-wrapper">
    <div class="near">
      <img class="camera" src="./images/video.png" />
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
    methods: {},
  };
</script>

<style>
  .icon-wrapper {
    width: 45px;
    height: 130px;
    position: absolute;
    transform: translateX(-50%);
    z-index: 100;
    box-sizing: content-box;
    pointer-events: none;
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
