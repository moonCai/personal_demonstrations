<template>
  <div class="" id="lengend">
    <div id="top-trangle"></div>
    <div id="bottom-trangle"></div>
    <div id="max">{{ max }}</div>
    <div id="min">{{ min }}</div>
    <div id="color-bar"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    max: {
      default: 0,
      type: Number,
    },
    min: {
      default: 0,
      type: Number,
    },
  },
};
</script>

<style scoped lang="scss">
#lengend {
  width: 90px;
  height: 120px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #999;
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 99;
  border-radius: 5px;
  box-shadow: 0 5px 10px 5px rgba(0, 0, 0, 0.3);

  #color-bar {
    width: 20px;
    height: 80px;
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    background: linear-gradient(
      rgb(255, 0, 0),
      rgb(255, 255, 0),
      rgb(0, 255, 0),
      rgb(0, 0, 255)
    );
  }

  #top-trangle,
  #bottom-trangle {
    width: 10px;
    height: 10px;
    position: absolute;
    left: 30px;
  }

  #top-trangle {
    background: url("~assets/images/hotMap/red_trangle.png") center / cover;
    top: 10px;
  }

  #bottom-trangle {
    background: url("~assets/images/hotMap/blue_trangle.png") center / cover;
    bottom: 10px;
  }

  #max,
  #min {
    color: #111;
    font-size: 14px;
    position: absolute;
    left: 45px;
  }

  #max {
    top: 5px;
  }

  #min {
    bottom: 5px;
  }
}
</style>