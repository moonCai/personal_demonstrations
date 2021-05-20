<template>
  <div id="draw-modes"></div>
</template>

<script>
  import { defaultInitCesium, A_MAP } from "assets/js/cesium/mapInit";
  import { locationMixin } from "assets/js/mixin/mixin";

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
        this.mapViewer = defaultInitCesium("draw-modes", A_MAP, true);
      },
    },
  };
</script>

<style lang="scss" scoped>
  #draw-modes {
    width: 100%;
    height: 100%;
    background: yellowgreen;
  }
</style>
