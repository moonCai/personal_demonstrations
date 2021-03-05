<template>
  <div class="icon" :id="iconId">
    <img class="camera" src="./images/video.png" />
    <div class="line"></div>
    <div class="item circle1"></div>
    <div class="item circle2"></div>
    <div class="item circle3"></div>
    <div class="item circle4"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    props: ["y", "x", "iconId"],
    mounted() {
      $(`#${this.iconId}`).css({
        top: `${this.y}px`,
        left: `${this.x}px`,
      });
    },
  };
</script>

<style>
  .icon {
    width: 60px;
    height: 150px;
    /* border: 1px solid coral; */
    position: absolute;
    z-index: 100;
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
    /* background-size: 8px 70px; */
    border-radius: 2px;
    background: url(./images/line.png) no-repeat center / cover;
    /* background-image: url(./images/gradient.png); */
    position: absolute;
    top: 55px;
    left: 50%;
    margin-left: -2px;
    margin-top: 0;
    animation: jump 1.3s linear infinite forwards;
  }

  .item {
    width: 10px;
    height: 5px;
    margin: auto;
    border-radius: 50%;
    background: rgba(228, 57, 96, 0.6);
    position: absolute;
    left: 50%;
    top: 130px;
    margin-left: -5px;
  }

  .circle2 {
    opacity: 0;
    animation: spread1 1.3s linear infinite;
  }

  .circle3 {
    opacity: 0;
    animation: spread1 1.3s linear 0.2s infinite;
  }

  .circle4 {
    opacity: 0;
    animation: spread1 1.3s linear 0.4s infinite;
  }

  @keyframes spread1 {
    0% {
      transform: scale(1);
      opacity: 0;
    }

    50% {
      transform: scale(3);
      opacity: 0.6;
    }

    100% {
      transform: scale(6);
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

  @keyframes jump1 {
    0% {
      margin-top: 0;
      background-position-x: 0px;
    }

    50% {
      margin-top: -10px;
      background-position-x: 4px;
    }

    100% {
      margin-top: 0;
      background-position-x: 8px;
    }
  }
</style>
