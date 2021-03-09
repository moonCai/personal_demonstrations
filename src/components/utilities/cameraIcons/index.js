import Icon from "./Icon";
import Vue from "vue";
import {
  degrees_to_cartesian3,
  cartesian3_to_windowCoordinates,
} from "assets/js/cesium/coordinateTransforms";

const CameraIcon = {};

let isfirst = true;
let windowInfos = [];
let viewer = null;
let isNear = false;

/**
 * @targetViewer 底图
 * @position 点击点屏幕坐标
 */
CameraIcon.show = function (targetViewer, iconInfos) {
  viewer = targetViewer;

  iconInfos.forEach((iconInfo) => {
    let cartesian3 = degrees_to_cartesian3(
      targetViewer,
      iconInfo.lon,
      iconInfo.lat
    );
    let position = cartesian3_to_windowCoordinates(targetViewer, cartesian3);

    if (!cartesian3) return;

    // 1.创建组件构造器
    const IconConstructor = Vue.extend(Icon);

    // 2.根据组件构造器构建一个组件对象
    const icon = new IconConstructor();

    // 3.将组件对象手动挂载到某一个元素上
    icon.$mount(document.createElement("div"));

    // 4.popUp.$el对应的就是上面创建的div
    targetViewer.container.appendChild(icon.$el);

    Vue.prototype.$icon = icon;

    let id = iconInfo.id;
    icon.$el.id = id;

    windowInfos.push({
      id,
      cartesian3,
      position,
      icon,
    });
  });

  console.log("windowInfos======:", windowInfos);

  if (isfirst) {
    isfirst = false;
    mapChangedEvent();
  }

  display();
};

function heightMoreThanTarget() {
  let height = Math.ceil(viewer.camera.positionCartographic.height);
  isNear = height < 30000;
  let iconHeight = isNear ? "130px" : "30px";

  $(".icon-wrapper").css({
    height: iconHeight,
  });

  if (isNear) {
    $(".near").show();
    $(".far").hide();
  } else {
    $(".near").hide();
    $(".far").show();
  }
}

// 地图移动事件
function mapChangedEvent() {
  let scene = viewer.scene;
  scene.camera.percentageChanged = 0.00001;

  scene.camera.changed.addEventListener(() => {
    if (windowInfos.length == 0) return;

    windowInfos.forEach((windowInfo) => {
      // 判断某个cartesian3是否出现在地球背面
      const occluder = new Cesium.EllipsoidalOccluder(
        scene.globe.ellipsoid,
        viewer.camera.position
      );
      const visible = occluder.isPointVisible(windowInfo.cartesian3);

      if (!visible) {
        windowInfo.icon.hide(windowInfo.id);
        return;
      }

      heightMoreThanTarget();

      let windowPoint = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        scene,
        windowInfo.cartesian3
      );

      $(`#${windowInfo.id}`)
        .css({
          left: `${windowPoint.x}px`,
          bottom: `${$(viewer.container).height() - windowPoint.y}px`,
        })
        .show();
    });
  });
}

function display() {
  heightMoreThanTarget();

  windowInfos.forEach((info) => {
    $(`#${info.id}`)
      .css({
        left: `${info.position.x}px`,
        bottom: `${$(viewer.container).height() - info.position.y}px`,
      })
      .show();
  });
}

CameraIcon.removeAll = function () {
  $(`.icon-wrapper`).remove();
};

export default CameraIcon;
