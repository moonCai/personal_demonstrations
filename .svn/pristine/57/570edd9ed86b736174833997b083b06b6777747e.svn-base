// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 放在App前引用， 放在打包时自定义的样式被覆盖
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI, {
  Loading,
  Message
} from 'element-ui'
let Cesium = require('cesium/Cesium');
let widgets = require('cesium/Widgets/widgets.css');
import Vue from 'vue';
import router from './router';
import $ from 'jquery'
import App from './App';
import store from './store/index'

Vue.config.productionTip = false;

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3OGQzMWE0MS1lYTA2LTRiZTYtYjFhZi1lMzk5ZDFmMDIwYmEiLCJpZCI6NDM1MCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MDU0MTEyNH0.se2dXmT555bSEa8wk7X1nnSxcxoAt0r-ERj65H9sgEc";

window.$ = $;
window.Loading = Loading;
window.Message = Message;
window.Cesium = Cesium;
window.widgets = widgets;

Vue.use(ElementUI, {
  size: 'small',
  zIndex: 30000
});

Vue.directive('enterNumber', {
  inserted: function (el) {
    el.addEventListener("keypress", function (e) {
      e = e || window.event;
      let charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode;
      let re = /\d/;
      if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      }
    });
  }
});

router.beforeEach((to, from, next) => {

  // const nextRoute = ['User', 'Cart', 'GoodsDetail'] // 需要登录的页面
  // let isLogin = localTake('userMsg') // 判断是否登录，本地存储有用户数据则视为已经登录
  // // 未登录状态；当路由到 nextRoute 指定页时，跳转至 UserLogIn
  // if (nextRoute.indexOf(to.name) >= 0) { // 检测是否登录的页面
  //   if (!isLogin) { // 如果未登录（本地存储无用户数据），并且要跳到登录页面
  //     if (from.name === 'UserLogIn') {
  //       next('/')
  //       return
  //     }
  //     // 登录后，跳到到当前页面
  //     router.push({
  //       name: 'UserLogIn',
  //       params: {
  //         redirect: to.fullPath
  //       }
  //     })
  //   }
  // }
  // // 已登录状态；当路由到 UserLogIn 时，跳转至 Home
  // if (to.name === 'UserLogIn') {
  //   if (isLogin) {
  //     next('/')
  //     return
  //   }
  // }
  next() // 必须使用 next ,执行效果依赖 next 方法的调用参数
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
