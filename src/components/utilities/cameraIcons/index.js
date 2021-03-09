import Icon from "./Icon";
import Vue from "vue";
import {
  degrees_to_cartesian3,
  cartesian3_to_windowCoordinates,
} from "assets/js/cesium/coordinateTransforms";

const IconColletion = {};

let viewer = null;
let windowInfos = [];
let isNear = false;
let isfirst = true;

/**
 * @targetViewer 底图
 * @iconInfos 摄像头信息集合
 */
IconColletion.addIcons = function (targetViewer, iconInfos) {
  viewer = targetViewer;
  windowInfos = [];

  iconInfos.forEach((iconInfo) => {
    let cartesian3 = degrees_to_cartesian3(viewer, iconInfo.lon, iconInfo.lat);

    if (!cartesian3) return;

    // 1.创建组件构造器
    const IconConstructor = Vue.extend(Icon);

    // 2.根据组件构造器构建一个组件对象
    const icon = new IconConstructor();

    // 3.将组件对象手动挂载到某一个元素上
    icon.$mount(document.createElement("div"));

    // 4.popUp.$el对应的就是上面创建的div
    viewer.container.appendChild(icon.$el);

    Vue.prototype.$icon = icon;

    let id = iconInfo.id;
    icon.$el.id = id;

    let position = cartesian3_to_windowCoordinates(viewer, cartesian3);

    windowInfos.push({
      id,
      cartesian3,
      position,
      icon,
    });
  });

  if (isfirst) {
    isfirst = false;
    mapChangedEvent();
  }

  display();
};

// 地图移动事件
function mapChangedEvent() {
  let scene = viewer.scene;
  scene.camera.percentageChanged = 0.00001;

  scene.camera.changed.addEventListener(() => {
    if (windowInfos.length == 0) return;

    let viewerHeight = heightMoreThanTarget();

    windowInfos.forEach((windowInfo) => {
      // 判断某个cartesian3是否出现在地球背面
      const occluder = new Cesium.EllipsoidalOccluder(
        scene.globe.ellipsoid,
        viewer.camera.position
      );

      let { id, cartesian3 } = windowInfo;
      const visible = occluder.isPointVisible(cartesian3);

      if (!visible) {
        $(`#${id}`).hide();
        return;
      }

      let { x, y } = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        scene,
        cartesian3
      );

      $(`#${id}`)
        .css({
          left: x,
          bottom: viewerHeight - y,
        })
        .show();
    });
  });
}

function display() {
  let viewerHeight = heightMoreThanTarget();

  windowInfos.forEach((info) => {
    let { id, position } = info;

    $(`#${id}`)
      .css({
        left: position.x,
        bottom: viewerHeight - position.y,
      })
      .show();
  });
}

function heightMoreThanTarget() {
  let height = Math.ceil(viewer.camera.positionCartographic.height);
  isNear = height < 30000;

  $(".icon-wrapper").css({
    height: isNear ? 130 : 30,
  });

  if (isNear) {
    $(".near").show();
    $(".far").hide();
  } else {
    $(".near").hide();
    $(".far").show();
  }

  return $(viewer.container).height();
}

IconColletion.removeAll = function () {
  $(`.icon-wrapper`).remove();
};

export default IconColletion;
