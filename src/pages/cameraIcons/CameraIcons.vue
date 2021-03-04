<template>
  <div id="camera-icons">
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
  #camera-icons {
    width: 100%;
    height: 100%;
  }
</style>
