import Icon from "./Icon";
import Vue from "vue";

const CameraIcon = {};

let isfirst = true;
let windowInfos = [];

/**
 * @targetViewer 底图
 * @position 点击点屏幕坐标
 */
CameraIcon.show = function (targetViewer, movement) {
  let position = movement.position;
  let ellipsoid = targetViewer.scene.globe.ellipsoid;
  let cartesian3 = targetViewer.camera.pickEllipsoid(position, ellipsoid);

  if (!cartesian3) return;

  // 1.创建组件构造器
  const PopOverConstructor = Vue.extend(Icon);

  // 2.根据组件构造器构建一个组件对象
  const icon = new PopOverConstructor();

  // 3.将组件对象手动挂载到某一个元素上
  icon.$mount(document.createElement("div"));

  // 4.popUp.$el对应的就是上面创建的div
  targetViewer.container.appendChild(icon.$el);

  Vue.prototype.$icon = icon;

  let randomNum1 = Math.floor(Math.random() * 100 + 1);
  let randomNum2 = Math.floor(Math.random() * 100 + 1);
  let randomNum3 = Math.floor(Math.random() * 100 + 1);
  let id = `icon-${randomNum1 * randomNum2 * randomNum3}`;

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
  $(`.pop-up-wrapper`).remove();
};

export default CameraIcon;
