<template>
  <div class="header-wrapper">
    <div id="header">PERSONAL DEMONSTRATION</div>
    <div class="breadcrumb" v-if="secondaryTitle">
      <img src="~assets/images/common/home.png" />

      <router-link to="/">首页</router-link>
      <strong>></strong>
      <span>{{ secondaryTitle }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["secondaryTitle"],
};
</script>

<style scoped lang="scss">
.header-wrapper {
  width: 100%;
  height: 70px;
  position: absolute;
  top: 10px;
  left: 0;

  #header {
    width: 100%;
    font-size: 24px;
    max-width: 1439px;
    height: 71px;
    line-height: 71px;
    color: #8ccbff;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: url(~assets/images/header/system_title.png) center / cover;
  }

  .breadcrumb {
    width: 300px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #85ceff;
    letter-spacing: 0;
    position: absolute;
    left: 20px;
    bottom: 0;
    text-align: left;
    padding-left: 18px;

    img {
      width: 14px;
      height: 14px;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-55%);
    }

    a {
      color: #85ceff;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
</style>
