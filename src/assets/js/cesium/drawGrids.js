/**
 * 绘制实心轨迹网格
 * @param grids 网格数据集合
 * @param gridsPrimitives
 * */
export function draw2dGridsPrimitives(grids, gridsPrimitives, rgba) {
  let linesGeometries = grids.map((grid) => {
    let instanceGeometry = new Cesium.GeometryInstance({
      geometry: drawOne2dRectangleGeometry(grid.boundary, 0),
      id: grid.geo_num,
      attributes: {
        color: new Cesium.ColorGeometryInstanceAttribute(
          rgba.red,
          rgba.green,
          rgba.blue,
          rgba.alpha
        ),
      },
    });

    return instanceGeometry;
  });

  addGeometries(gridsPrimitives, linesGeometries);
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
 * 绘制二维网格
 * @param grids 网格数据集合
 * @param gridsPrimitives
 * */
export function draw2dGridsWithOutlinePrimitives(
  grids,
  gridsPrimitives,
  fillRgba,
  borderRgba
) {
  let instanceGeometries = [];
  let linesGeometries = [];

  grids.forEach((grid) => {
    let instanceGeometry = new Cesium.GeometryInstance({
      geometry: drawOne2dRectangleGeometry(grid.boundary, 0),
      attributes: {
        color: new Cesium.ColorGeometryInstanceAttribute(
          fillRgba.red,
          fillRgba.green,
          fillRgba.blue,
          fillRgba.alpha
        ),
      },
    });
    instanceGeometries.push(instanceGeometry);

    let instanceLineGeometry = new Cesium.GeometryInstance({
      geometry: drawOne2dRectangleOutlineGeometry(grid.boundary),
      attributes: {
        color: new Cesium.ColorGeometryInstanceAttribute(
          borderRgba.red,
          borderRgba.green,
          borderRgba.blue,
          borderRgba.alpha
        ),
      },
    });
    linesGeometries.push(instanceLineGeometry);
  });

  addGeometries(gridsPrimitives, instanceGeometries);
  addGeometries(gridsPrimitives, linesGeometries);
}

/**
 * 绘制单个二维网格
 * @param boundary
 * */
function drawOne2dRectangleGeometry(boundary, gridHeight) {
  let height = gridHeight || 0;

  return new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(...boundary),
    height: height,
  });
}

/**
 * 绘制单个二维网格(边线)
 * @param boundary
 * */
function drawOne2dRectangleOutlineGeometry(boundary, gridHeight) {
  let height = gridHeight || 0;

  return new Cesium.RectangleOutlineGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(
      boundary[0],
      boundary[1],
      boundary[2],
      boundary[3]
    ),
    height: height,
  });
}

/**
 * 绘制三维网格(边框+填充色)
 * @param grids 网格数据集合
 * @param gridsPrimitives
 * */
export function draw3dGridsPrimitives(
  grids,
  gridsPrimitives,
  fillRgba,
  borderRgba
) {
  let instanceGeometries = [];
  let linesGeometries = [];

  grids.forEach((grid) => {
    let instanceGeometry = new Cesium.GeometryInstance({
      geometry: drawOne3dRectangleGeometry(grid),
      id: grid.code,
      attributes: {
        color: new Cesium.ColorGeometryInstanceAttribute(
          fillRgba.red,
          fillRgba.green,
          fillRgba.blue,
          fillRgba.alpha
        ),
      },
    });
    instanceGeometries.push(instanceGeometry);

    let instanceLineGeometry = new Cesium.GeometryInstance({
      geometry: drawOne3dRectangleOutlineGeometry(grid),
      attributes: {
        color: new Cesium.ColorGeometryInstanceAttribute(
          borderRgba.red,
          borderRgba.green,
          borderRgba.blue,
          borderRgba.alpha
        ),
      },
    });
    linesGeometries.push(instanceLineGeometry);
  });

  addGeometries(gridsPrimitives, instanceGeometries);
  addGeometries(gridsPrimitives, linesGeometries);
}

/**
 * 绘制单个三维网格
 * @param gridsPrimitives
 * @param geometries
 */
function drawOne3dRectangleGeometry(gridData) {
  let rectangle = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(
      gridData.lblng,
      gridData.lblat,
      gridData.rblng,
      gridData.rblat
    ),
    height: gridData.hb,
    extrudedHeight: gridData.ht,
  });

  return rectangle;
}

/**
 * 绘制单个三维网格边线
 * @param gridsPrimitives
 * @param geometries
 */
function drawOne3dRectangleOutlineGeometry(gridData) {
  let outline = new Cesium.RectangleOutlineGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(
      gridData.lblng,
      gridData.lblat,
      gridData.rblng,
      gridData.rblat
    ),
    height: gridData.hb,
    extrudedHeight: gridData.ht,
  });

  return outline;
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
