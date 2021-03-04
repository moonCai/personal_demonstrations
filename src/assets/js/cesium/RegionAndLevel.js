export function getVisibleRegion(targetViewer) {
  if (targetViewer.scene.mode == Cesium.SceneMode.SCENE2D) {
    // 范围对象
    let extent = {};
    let canvas = targetViewer.scene.canvas;
    let num = 10
    let cartesian = undefined
    let cartesianmax = undefined

    for (let index = 0; index <= canvas.height; index += num) {
      let pickmin = new Cesium.Cartesian2(0, index);
      cartesian = targetViewer.scene.globe.pick(targetViewer.camera.getPickRay(pickmin), targetViewer.scene);
      if (cartesian !== undefined)
        break
    }

    if (cartesian !== undefined) {
      let cartographic = targetViewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
      extent.xmin = Cesium.Math.toDegrees(cartographic.longitude);
      extent.ymax = Cesium.Math.toDegrees(cartographic.latitude);
    } else {
      extent.xmin = -179.99;
      extent.ymax = 89.99;
    }

    for (let index = 0; index <= canvas.height; index += num) {
      let pickmax = new Cesium.Cartesian2(canvas.width, canvas.height - index);
      cartesianmax = targetViewer.scene.globe.pick(targetViewer.camera.getPickRay(pickmax), targetViewer.scene);

      if (cartesianmax !== undefined)
        break
    }


    if (cartesianmax !== undefined) {
      let cartographicmax = targetViewer.scene.globe.ellipsoid.cartesianToCartographic(cartesianmax);
      extent.ymin = Cesium.Math.toDegrees(cartographicmax.latitude);
      extent.xmax = Cesium.Math.toDegrees(cartographicmax.longitude);

    } else {
      extent.ymin = -89.99;
      extent.xmax = 179.99;
    }


    if (cartesianmax == undefined || cartesian == undefined) {
      extent.height = 14639381.0
    } else {
      extent.height = Math.ceil(targetViewer.camera.positionCartographic.height);
    }

    if (extent.ymax < extent.ymin) {
      let temple = extent.ymin;
      extent.ymin = extent.ymax;
      extent.ymax = temple;
    }

    if (extent.xmax < extent.xmin) {
      let temple = extent.xmin;
      extent.xmin = extent.xmax;
      extent.xmax = temple;
    }

    return extent;
  } else {
    let extent = {};
    let field_view = targetViewer.camera.computeViewRectangle();

    if (field_view != null) {
      extent.xmin = Cesium.Math.toDegrees(field_view.west);
      extent.xmax = Cesium.Math.toDegrees(field_view.east);
      extent.ymin = Cesium.Math.toDegrees(field_view.south);
      extent.ymax = Cesium.Math.toDegrees(field_view.north);
    }

    if (extent.xmin == -180 || extent.xmin == undefined) {
      extent.xmin = -179;
    }

    if (extent.xmax == 180 || extent.xmax == undefined) {
      extent.xmax = 179;
    }

    if (extent.ymin == -90 || extent.ymin == undefined) {
      extent.ymin = -89;
    }

    if (extent.ymax == 90 || extent.ymax == undefined) {
      extent.ymax = 89;
    }

    extent.height = Math.ceil(targetViewer.camera.positionCartographic.height);

    return extent;
  }
}

export function getLevelForHeight(targetViewer) {
  let tilesToRender = targetViewer.scene.globe._surface._tilesToRender;

  if (tilesToRender.length > 0) {
    let level = tilesToRender[0].level + 5;

    if (level < 6) {
      level = 6;
    }

    return level;
  } else {
    return 6;
  }
}
