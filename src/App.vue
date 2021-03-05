<template>
  <div id="app">
    <!-- header -->
    <header-component />

    <!-- content -->
    <div id="content-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script>
  import HeaderComponent from "components/common/Header";

export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    HeaderComponent,
  }
};
</script>

<style>
@import url(./assets/css/common/base.css);
@import url(./assets/css/common/scrollBar.css);
@import url(./assets/css/common/dropDown.css);
@import url(./assets/css/common/checkbox.css);
@import url(./assets/css/common/datePicker.css);

html,
body {
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;

  background-image: linear-gradient(
    90deg,
    rgb(7, 17, 43) 0%,
    rgb(26, 43, 88) 50%,
    rgb(7, 17, 43) 100%
  );
  min-width: 1200px;
  min-height: 675px;
  position: relative;
}

#content-wrapper {
  position: absolute;
  top: 100px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  border: 1px solid #0af;
  overflow: hidden;
}
</style>

