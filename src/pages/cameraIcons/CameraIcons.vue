<template>
  <div id="camera-icon-wrapper">
    <!-- header start -->
    <header-component secondaryTitle="摄像头图标"></header-component>

    <div class="" id="content"></div>
  </div>
</template>

<script>
  import { locationMixin } from "assets/js/mixin/mixin";

  export default {
    data() {
      return {};
    },
    mixins: [locationMixin],
  };
</script>

<style scoped>
  #camera-icon-wrapper {
    width: 100%;
    height: 100%;
  }

  #content {
      position: absolute;
      top: 100px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 1px solid #E43960;
  }
</style>
