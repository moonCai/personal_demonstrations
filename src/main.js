// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "element-ui/lib/theme-chalk/index.css";
import ElementUI from "element-ui";
import Vue from "vue";
import router from "./router";
import $ from "jquery";
import App from "./App";
import bus from "assets/js/bus";

require("cesium/Widgets/widgets.css");
let Cesium = require("cesium/Cesium");

Vue.config.productionTip = false;
Vue.prototype.$bus = bus;

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3OGQzMWE0MS1lYTA2LTRiZTYtYjFhZi1lMzk5ZDFmMDIwYmEiLCJpZCI6NDM1MCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MDU0MTEyNH0.se2dXmT555bSEa8wk7X1nnSxcxoAt0r-ERj65H9sgEc";

window.$ = $;
window.Cesium = Cesium;

Vue.use(ElementUI, {
  size: "small",
  zIndex: 30000,
});

Vue.directive("enterNumber", {
  inserted: function (el) {
    el.addEventListener("keypress", function (e) {
      e = e || window.event;
      let charcode = typeof e.charCode === "number" ? e.charCode : e.keyCode;
      let re = /\d/;
      if (
        !re.test(String.fromCharCode(charcode)) &&
        charcode > 9 &&
        !e.ctrlKey
      ) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      }
    });
  },
});

new Vue({
  el: "#app",
  router,
  render: (h) => h(App),
});
