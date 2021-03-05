import Icon from "./Icon";
import Vue from "vue";
import {
  degrees_to_cartesian3,
  cartesian3_to_windowCoordinates,
} from "assets/js/cesium/coordinateTransforms";

const CameraIcon = {};

let isfirst = true;
let windowInfos = [];

/**
 * @targetViewer 底图
 * @position 点击点屏幕坐标
 */
CameraIcon.show = function (targetViewer, iconInfo) {
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
    icon,
  });

  if (isfirst) {
    isfirst = false;
    icon.mapChangedEvent(targetViewer);
  }

  icon.display(position, id, windowInfos);
};

CameraIcon.removeAll = function () {
  $(`.icon-wrapper`).remove();
};

export default CameraIcon;
