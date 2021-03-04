/**
 * 绘制网格热力
 * @param grids 网格数据集合
 * @param grids_primitives
 * @param maxHotCount 最大的网格热值
 * */
export function drawGridsOfHotMap(grids, grids_primitives, maxHotCount) {

  let instanceGeometries = grids.map(gridData => {
    let rectangle = new Cesium.RectangleGeometry({
      rectangle: Cesium.Rectangle.fromDegrees(gridData.boundary[0], gridData.boundary[1], gridData.boundary[2], gridData.boundary[3]),
    });

    let fillColor = getGridColor(gridData.count, maxHotCount);

    let instanceGeometry = new Cesium.GeometryInstance({
      geometry: rectangle,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(fillColor)
      }
    });

    return instanceGeometry
  })

  grids_primitives.add(
    new Cesium.Primitive({
      geometryInstances: instanceGeometries,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true
      }),
      asynchronous: false
    })
  );

}

function getGridColor(count, maxHotCount) {

  if (count < maxHotCount * 0.25) {
    return Cesium.Color.BLUE.withAlpha(0.8)
  } else if (count < maxHotCount * 0.5) {
    return Cesium.Color.GREEN.withAlpha(0.8)
  } else if (count < maxHotCount * 0.75) {
    return Cesium.Color.YELLOW.withAlpha(0.8)
  } else {
    return Cesium.Color.RED.withAlpha(0.8)
  }

}
