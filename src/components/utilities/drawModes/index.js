import { cartesian3_to_degrees } from "./utilitiesMethods";
import { draw2dOutlineGridsPrimitives } from "./utilitiesMethods";
import { DynamicDrawTool } from "./drawTool";

import { server } from "request/api";
import bus from "assets/js/bus";

let targetViewer;
let handler;
let singleGrid;
let polygonPrimitives;
let rectangle = null;
let rectanglePrimitives;
let activeShapePoints = [];
let floatingPoint = null;
let floatingPoints = [];
let activeShape = null;
let boundary = [];

export function getViewer(viewer) {
  targetViewer = viewer;

  $(document).bind("contextmenu", () => false);

  polygonPrimitives = viewer.scene.primitives.add(
    new Cesium.PrimitiveCollection()
  );

  rectanglePrimitives = viewer.scene.primitives.add(
    new Cesium.PrimitiveCollection()
  );

  handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
}

bus.$on("queryType", (query) => {
  queryTypeEvent(query);
});

// 查询方式
function queryTypeEvent(query) {
  switch (query.type) {
    case "single":
      if (query.isDraw) {
        clearDrawPolygon();
        clearDrawRectangle();
        drawSingleGrid();
        return;
      }

      clearDrawSingleGrid();
      break;
    case "polygon":
      if (query.isDraw) {
        clearDrawSingleGrid();
        drawPolygonLines();
        clearDrawRectangle();
        return;
      }

      clearDrawPolygon();
      break;
    case "rectangle":
      if (query.isDraw) {
        clearDrawSingleGrid();
        clearDrawPolygon();
        drawRectangle();
        return;
      }

      clearDrawRectangle();
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
      video_height: targetViewer.camera.positionCartographic.height,
    };

    loadSingleGridInfo(params);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 加载单网格
function loadSingleGridInfo(params) {
  if (singleGrid) {
    targetViewer.entities.remove(singleGrid);
    singleGrid = null;
  }

  server.getSingleGridInfo(params).then((response) => {
    if (response.server_status != 200) return;

    createSingleGrid(response.geo_num_list[0]);
  });
}

// 创建单网格
function createSingleGrid(info) {
  let { lbLng, lbLat, rtLng, rtLat } = info;

  singleGrid = targetViewer.entities.add({
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(lbLng, lbLat, rtLng, rtLat),
      outline: true,
      outlineColor: Cesium.Color.RED.withAlpha(0.8),
      // 只有设置高度 outline才有效
      height: 0,
      zIndex: 20000,
      material: Cesium.Color.RED.withAlpha(0.3),
    },
  });
}

// 取消绘制单网格
function clearDrawSingleGrid() {
  handler && handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

  if (singleGrid) {
    targetViewer.entities.remove(singleGrid);
    singleGrid = null;
  }
}

// 加载多边形网格
function loadPolygonGridsInfo(cartesians) {
  let lngs = [];
  let lats = [];

  cartesians.forEach((cartesian) => {
    let point = cartesian3_to_degrees(targetViewer, cartesian);
    lats.push(point.latitude);
    lngs.push(point.longitude);
  });

  let params = {
    lngs: lngs.join(","),
    lats: lats.join(","),
    video_height: targetViewer.camera.positionCartographic.height,
  };

  server.getPolygonGrids(params).then((response) => {
    if (response.server_status != 200) return;

    let gridsData = response.geo_num_list;
    let rgba = [77 / 255, 149 / 255, 240 / 255, 200 / 255];

    draw2dOutlineGridsPrimitives(gridsData, polygonPrimitives, rgba);
  });
}

// 绘制多边形框
function drawPolygonLines() {
  let gonOption = {
    width: 3,
    geodesic: true,
  };

  DynamicDrawTool.startDrawingPolyshape(
    targetViewer,
    false,
    gonOption,
    (cartesians) => {
      loadPolygonGridsInfo(cartesians);
    },
    () => {
      drawPolygonLines();
    }
  );
}

// 移除多边形
export function clearPolygonEntity() {
  polygonPrimitives.removeAll();
}

// 移除多边形绘制
function clearDrawPolygon() {
  polygonPrimitives.removeAll();
  DynamicDrawTool.startDrawingClear(targetViewer);

  bus.$emit("clearDraw", false);
}

// 绘制矩形
function drawRectangle() {
  handler.setInputAction((event) => {
    // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
    // we get the correct point when mousing over terrain.
    let earthPosition = targetViewer.camera.pickEllipsoid(event.position);

    if (!Cesium.defined(earthPosition)) return;

    if (rectangle) {
      targetViewer.entities.remove(rectangle);
      rectangle = null;
    }

    rectanglePrimitives.removeAll();

    if (activeShapePoints.length === 0) {
      floatingPoint = createPoint(earthPosition);
      floatingPoints.push(floatingPoint);
      activeShapePoints.push(earthPosition);

      let dynamicPositions = new Cesium.CallbackProperty(
        () => activeShapePoints,
        false
      );
      activeShape = drawRectangleShape(dynamicPositions);
    }

    floatingPoints.push(createPoint(earthPosition));
    activeShapePoints.push(earthPosition);

    if (activeShapePoints.length > 2) {
      terminateShape();
    } else {
      activeShape = drawRectangleShape(activeShapePoints);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction((event) => {
    if (!Cesium.defined(floatingPoint)) return;

    let newPosition = targetViewer.camera.pickEllipsoid(event.endPosition);

    if (!Cesium.defined(newPosition)) return;

    floatingPoint.position.setValue(newPosition);
    activeShapePoints.splice(activeShapePoints.length - 1, 1, newPosition);
    activeShape = drawRectangleShape(activeShapePoints);
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
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
  }
}

// 绘制矩形
function drawRectangleShape(positionData) {
  activeShape && targetViewer.entities.remove(activeShape);

  let degrees = [];
  for (let i = 0; i < positionData.length; i++) {
    degrees.push(cartesian3_to_degrees(targetViewer, positionData[i]));
  }

  if (degrees.length < 2) return;

  degrees.splice(2, degrees.length - 2);

  let lng1 = Math.min(degrees[0].longitude, degrees[1].longitude);
  let lng2 = Math.max(degrees[0].longitude, degrees[1].longitude);
  let lat1 = Math.min(degrees[0].latitude, degrees[1].latitude);
  let lat2 = Math.max(degrees[0].latitude, degrees[1].latitude);
  boundary = [lng1, lat1, lng2, lat2];

  return targetViewer.entities.add({
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(...boundary),
      height: 0,
      heightReference: Number.CLAMP_TO_GROUND,
      outline: true,
      outlineColor: Cesium.Color.RED,
      outlineWidth: 1,
      material: Cesium.Color.RED.withAlpha(0.3),
    },
  });
}

function terminateShape() {
  rectangle = drawRectangleShape(activeShapePoints);
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

// 清除绘制矩形
function clearDrawRectangle() {
  if (rectangle) {
    targetViewer.entities.remove(rectangle);
    rectangle = null;
  }

  boundary = [];
  rectanglePrimitives.removeAll();

  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

// 加载矩形区域网格
function loadGridsInPolyline() {
  let params = {
    lats: `${boundary[1]}, ${boundary[1]}, ${boundary[3]}, ${boundary[3]}, ${boundary[1]}`,
    lngs: `${boundary[0]}, ${boundary[2]}, ${boundary[2]}, ${boundary[0]}, ${boundary[0]}`,
    video_height: Math.ceil(targetViewer.camera.positionCartographic.height),
  };

  server.getPolygonGrids(params).then((response) => {
    if (response.server_status != 200) return;

    let gridsData = response.geo_num_list;
    let rgba = [77 / 255, 149 / 255, 240 / 255, 200 / 255];

    draw2dOutlineGridsPrimitives(gridsData, rectanglePrimitives, rgba);
  });
}
