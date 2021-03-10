import {
  cartesian3_to_degrees
} from "assets/js/cesium/coordinateTransforms"
import {
  server
} from "request/api.js"
import {
  DynamicDrawTool
} from "./drawTool"
import {
  draw2dOutlineGridsPrimitives
} from "assets/js/cesium/drawGrids"
import {
  getLevelForHeight
} from "assets/js/cesium/regionAndLevel"

import bus from "assets/js/bus";

let targetViewer;
let handler;
let singleGrid;
let polygonPrimitives;

let pathPrimitives;
let activeShapePoints = []
let floatingPoint = null;
let floatingPoints = [];
let activeShape = null;
let path = null;
let lineWidth = 8;

export function getViewer(viewer) {
  targetViewer = viewer;

  polygonPrimitives = viewer.scene.primitives.add(
    new Cesium.PrimitiveCollection()
  );

  pathPrimitives = viewer.scene.primitives.add(
    new Cesium.PrimitiveCollection()
  );

  handler = new Cesium.ScreenSpaceEventHandler(
    viewer.scene.canvas
  );
}

bus.$on("queryType", query => {
  queryTypeEvent(query)
})

bus.$on("lineWidth", width => {
  lineWidth = width;
})

// 查询方式
function queryTypeEvent(query) {
  switch (query.type) {
    case 'single':
      if (query.isDraw) {
        clearDrawPolygon();
        clearDrawPath();
        drawSingleGrid();
        return
      }

      clearDrawSingleGrid();
      break;
    case 'polygon':
      if (query.isDraw) {
        clearDrawSingleGrid();
        drawPolygonLines();
        clearDrawPath();
        return
      }

      clearDrawPolygon();
      break;
    case 'path':
      if (query.isDraw) {
        clearDrawSingleGrid();
        clearDrawPolygon();
        drawPath();
        return
      }

      clearDrawPath();
      break;
  }
}

// 单网格绘制
function drawSingleGrid() {
  let scene = targetViewer.scene;
  handler.setInputAction((movement) => {
    let ray = targetViewer.camera.getPickRay(movement.position);
    let cartesian3 = scene.globe.pick(ray, scene);

    if (!cartesian3) return;

    let degrees = cartesian3_to_degrees(targetViewer, cartesian3);
    let params = {
      lng: degrees.longitude,
      lat: degrees.latitude,
      video_height: targetViewer.camera.positionCartographic.height
    }

    loadSingleGridInfo(movement.position, params);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 加载单网格
function loadSingleGridInfo(position, params) {
  if (singleGrid) {
    targetViewer.entities.remove(singleGrid);
    singleGrid = null;
  }

  let level = getLevelForHeight(targetViewer);

  bus.$emit('endDraw', {
    x: position.x,
    y: position.y,
    lngs: params.lng,
    lats: params.lat,
    level: level
  })

  server.getSingleGridInfo(params).then(response => {
    if (response.server_status != 200) return;

    createSingleGrid(response.geo_num_list[0]);
  })
}

// 创建单网格
function createSingleGrid(info) {
  let {
    lbLng,
    lbLat,
    rtLng,
    rtLat
  } = info;

  singleGrid = targetViewer.entities.add({
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(lbLng, lbLat, rtLng, rtLat),
      outline: true,
      outlineColor: Cesium.Color.RED.withAlpha(0.8),
      // 只有设置高度 outline才有效         
      height: 0,
      zIndex: 200,
      material: Cesium.Color.RED.withAlpha(0.3),
    },
  })
}

// 取消绘制单网格
function clearDrawSingleGrid() {
  handler && handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

  if (!singleGrid) return;

  targetViewer.entities.remove(singleGrid);
  singleGrid = null;

  bus.$emit('clearDraw', false);
}

// 加载多边形网格
function loadPolygonGridsInfo(cartesians) {
  let lngs = [];
  let lats = [];

  cartesians.forEach(cartesian => {
    let point = cartesian3_to_degrees(targetViewer, cartesian);
    lats.push(point.latitude)
    lngs.push(point.longitude)
  });

  let params = {
    lngs: lngs.join(","),
    lats: lats.join(","),
    video_height: targetViewer.camera.positionCartographic.height
  }

  let position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    targetViewer.scene,
    cartesians[cartesians.length - 2]
  );

  let level = getLevelForHeight(targetViewer);

  bus.$emit('endDraw', {
    x: position.x,
    y: position.y,
    lngs: params.lngs,
    lats: params.lats,
    level: level
  })

  server.getPolygonGrids(params).then(response => {
    if (response.server_status != 200) return;

    let gridsData = response.geo_num_list;
    let rgba = {
      red: 77 / 255,
      green: 149 / 255,
      blue: 240 / 255,
      alpha: 0.8
    }

    draw2dOutlineGridsPrimitives(
      gridsData,
      polygonPrimitives,
      rgba
    );
  })
}

// 绘制多边形框
function drawPolygonLines() {
  let gonOption = {
    width: 3,
    geodesic: true
  };

  DynamicDrawTool.startDrawingPolyshape(targetViewer, false, gonOption, cartesians => {
    loadPolygonGridsInfo(cartesians);
  }, () => {
    drawPolygonLines()
  });
}

// 移除多边形
export function clearPolygonEntity() {
  polygonPrimitives.removeAll();
}

// 移除多边形绘制
function clearDrawPolygon() {
  polygonPrimitives.removeAll();
  DynamicDrawTool.startDrawingClear(targetViewer);

  bus.$emit('clearDraw', false);
}

// 绘制路径
function drawPath() {

  handler.setInputAction((event) => {
    // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
    // we get the correct point when mousing over terrain.
    let earthPosition = targetViewer.camera.pickEllipsoid(event.position);

    if (!Cesium.defined(earthPosition)) return;

    if (path) {
      targetViewer.entities.remove(path);
      path = null;
    }

    pathPrimitives.removeAll();

    if (activeShapePoints.length === 0) {
      floatingPoint = createPoint(earthPosition);
      floatingPoints.push(floatingPoint);
      activeShapePoints.push(earthPosition);

      let dynamicPositions = new Cesium.CallbackProperty(() => activeShapePoints, false);
      activeShape = drawPathShape(dynamicPositions);
    }

    floatingPoints.push(createPoint(earthPosition));
    activeShapePoints.push(earthPosition);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction((event) => {

    if (!Cesium.defined(floatingPoint)) return;

    let newPosition = targetViewer.camera.pickEllipsoid(event.endPosition);

    if (!Cesium.defined(newPosition)) return;

    floatingPoint.position.setValue(newPosition);
    activeShapePoints.splice(activeShapePoints.length - 1, 1, newPosition);
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction((event) => {
    let earthPosition = targetViewer.camera.pickEllipsoid(event.position);
    floatingPoints.push(createPoint(earthPosition));
    terminateShape();
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

  function createPoint(worldPosition) {
    return targetViewer.entities.add({
      position: worldPosition,
      point: {
        color: Cesium.Color.SKYBLUE,
        pixelSize: 10,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    });
  }
}

// 绘制路径
function drawPathShape(positionData) {
  return targetViewer.entities.add({
    corridor: {
      positions: positionData,
      width: lineWidth,
      cornerType: Cesium.CornerType.ROUNDED,
      material: new Cesium.ColorMaterialProperty(
        Cesium.Color.RED.withAlpha(0.5)
      ),
      height: 0
    }
  });
}

function terminateShape() {
  path = drawPathShape(activeShapePoints);

  loadGridsInPolyline();

  clearDynamicPath();
}

function clearDynamicPath() {
  targetViewer.entities.remove(floatingPoint);
  floatingPoint = null;

  targetViewer.entities.remove(activeShape);
  activeShape = null;

  activeShapePoints = [];

  floatingPoints.forEach((point) => {
    targetViewer.entities.remove(point);
  });
  floatingPoints = [];
}

// 清除绘制路径
function clearDrawPath() {
  if (path) {
    targetViewer.entities.remove(path);
    path = null;
  }

  pathPrimitives.removeAll();

  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);

  bus.$emit('clearDraw', false);
}

// 加载路径绘制区域网格
function loadGridsInPolyline() {
  let lats = [];
  let lons = [];

  activeShapePoints.forEach(cartesian => {
    let point = cartesian3_to_degrees(targetViewer, cartesian);
    lats.push(point.latitude);
    lons.push(point.longitude);
  })

  let params = {
    lats: lats.join(","),
    lngs: lons.join(","),
    distance: lineWidth / 2,
    video_height: Math.ceil(
      targetViewer.camera.positionCartographic.height
    ),
  };

  let position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    targetViewer.scene,
    activeShapePoints[activeShapePoints.length - 1]
  );

  let level = getLevelForHeight(targetViewer);

  bus.$emit('endDraw', {
    x: position.x,
    y: position.y,
    lngs: params.lngs,
    lats: params.lats,
    level: level
  })

  server.getPathGrids(params).then(response => {
    if (response.server_status != 200) return;

    let gridsData = response.geo_num_list;
    let rgba = {
      red: 77 / 255,
      green: 149 / 255,
      blue: 240 / 255,
      alpha: 0.8
    }

    draw2dOutlineGridsPrimitives(
      gridsData,
      pathPrimitives,
      rgba
    );
  })
}
