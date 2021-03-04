import PopUp from "./PopUpWindow";
import Vue from "vue"

const PopUpWindow = {}

let isfirst = true;
let windowInfos = [];

/**
 * @targetViewer 底图
 * @position 点击点屏幕坐标
 */
PopUpWindow.popOver = function (targetViewer, movement) {

  let position = movement.position;
  let ellipsoid = targetViewer.scene.globe.ellipsoid;
  let cartesian3 = targetViewer.camera.pickEllipsoid(position, ellipsoid);

  if (!cartesian3) return;

  // 1.创建组件构造器
  const PopOverConstructor = Vue.extend(PopUp);

  // 2.根据组件构造器构建一个组件对象
  const popUp = new PopOverConstructor();

  // 3.将组件对象手动挂载到某一个元素上
  popUp.$mount(document.createElement('div'));

  // 4.popUp.$el对应的就是上面创建的div
  targetViewer.container.appendChild(popUp.$el);

  Vue.prototype.$popUp = popUp;

  let randomNum1 = Math.floor(Math.random() * 100 + 1);
  let randomNum2 = Math.floor(Math.random() * 100 + 1);
  let randomNum3 = Math.floor(Math.random() * 100 + 1);
  let id = `popup-${randomNum1 * randomNum2 * randomNum3}`;

  popUp.$el.id = id;

  windowInfos.push({
    id,
    cartesian3,
    popUp
  });

  if (isfirst) {
    isfirst = false;
    popUp.mapChangedEvent(targetViewer);
  }

  popUp.show(position, id, windowInfos);
}

PopUpWindow.removeAll = function() {
  $(`.pop-up-wrapper`).remove();
}

export default PopUpWindow;
