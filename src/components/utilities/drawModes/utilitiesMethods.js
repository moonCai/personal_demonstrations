/**
 * @世界坐标转化为经纬度
 */
export function cartesian3_to_degrees(targetViewer, cartesian3) {
  let ellipsoid = targetViewer.scene.globe.ellipsoid;

  // 将世界坐标转化为弧度
  let cartographic = ellipsoid.cartesianToCartographic(cartesian3);

  // 将弧度转化为经纬度
  let longitude = Cesium.Math.toDegrees(cartographic.longitude);
  let latitude = Cesium.Math.toDegrees(cartographic.latitude);
  let height = cartographic.height;

  return {
    longitude,
    latitude,
    height,
  };
}

/**
 * 绘制二维网格边线
 * @param grids 网格数据集合
 * @param gridsPrimitives
 * */
export function draw2dOutlineGridsPrimitives(grids, gridsPrimitives, rgba) {
  let linesGeometries = grids.map((grid) => {
    let boundary = [grid.lbLng, grid.lbLat, grid.rtLng, grid.rtLat];

    let instanceLineGeometry = new Cesium.GeometryInstance({
      geometry: drawOne2dRectangleOutlineGeometry(boundary),
      attributes: {
        color: new Cesium.ColorGeometryInstanceAttribute(
          rgba.red,
          rgba.green,
          rgba.blue,
          rgba.alpha
        ),
      },
    });

    return instanceLineGeometry;
  });

  addGeometries(gridsPrimitives, linesGeometries);
}

/**
 * 绘制单个二维网格(边线)
 * @param boundary
 * */
function drawOne2dRectangleOutlineGeometry(boundary, gridHeight) {
  let height = gridHeight || 0;

  return new Cesium.RectangleOutlineGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(...boundary),
    height: height,
  });
}

/**
 * 添加geometry集合
 * @param gridsPrimitives
 * @param geometries
 */
function addGeometries(gridsPrimitives, geometries) {
  gridsPrimitives.add(
    new Cesium.Primitive({
      geometryInstances: geometries,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true,
      }),
      asynchronous: false,
    })
  );
}

export function getLevelForHeight(targetViewer) {
  let tilesToRender = targetViewer.scene.globe._surface._tilesToRender;

  if (tilesToRender.length > 0) {
    let level = tilesToRender[0].level + 5;

    if (level < 6) {
      level = 6;
    }

    return level;
  }

  return 6;
}
