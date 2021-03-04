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

import bus from "assets/js/bus"

let targetViewer;
let handler;
let singleGrid;
let polygonPrimitives;

let activeShapePoints = []
let floatingPoint;
let activeShape = null;
let shape = null;

export function getViewer(viewer) {
  targetViewer = viewer;

  polygonPrimitives = viewer.scene.primitives.add(
    new Cesium.PrimitiveCollection()
  );
  handler = new Cesium.ScreenSpaceEventHandler(
    viewer.scene.canvas
  );
}

bus.$on("queryType", query => {
  queryTypeEvent(query)
})

// 查询方式
function queryTypeEvent(query) {
  switch (query.type) {
    case 'single':
      if (query.isDraw) {
        polygonPrimitives.removeAll();
        DynamicDrawTool.startDrawingClear(targetViewer);

        leftClickOnMapEvent();
        return
      }

      clearSingleGrid();
      break;
    case 'polygon':
      if (query.isDraw) {
        clearSingleGrid();
        drawPolygonLines();
        return
      }

      polygonPrimitives.removeAll();
      DynamicDrawTool.startDrawingClear(targetViewer);
      break;
    case 'path':
      if (query.isDraw) {

        clearSingleGrid();
        polygonPrimitives.removeAll();
        DynamicDrawTool.startDrawingClear(targetViewer);

        drawPath();

        return
      }

      alert("取消绘制路径")
      endDrawPath();
      break;
  }
}

// 左键单击
function leftClickOnMapEvent() {
  let scene = targetViewer.scene;

  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

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
    loadSingleGridInfo(params);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 加载单网格
function loadSingleGridInfo(params) {
  if (singleGrid) {
    targetViewer.entities.remove(singleGrid);
    singleGrid = null;
  }

  server.getSingleGridInfo(params).then(response => {
    if (response.server_status != 200) return;

    drawSingleGrid(response.geo_num_list[0]);
  })
}

// 绘制单网格
function drawSingleGrid(info) {
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

// 移除单网格
function clearSingleGrid() {
  handler && handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

  if (!singleGrid) return;

  targetViewer.entities.remove(singleGrid);
  singleGrid = null;
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

  server.getPolygonGrids(params).then(response => {
    if (response.server_status != 200) return;

    let gridsData = response.geo_num_list;
    let rgba = {
      red: 77 / 255,
      green: 149 / 255,
      blue: 240 / 255,
      alpha: 0.5
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

// 绘制路径
function drawPath() {
  handler.setInputAction((event) => {
    // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
    // we get the correct point when mousing over terrain.
    let earthPosition = targetViewer.camera.pickEllipsoid(event.position);

    if (!Cesium.defined(earthPosition)) return;

    if (activeShapePoints.length === 0) {
      floatingPoint = createPoint(earthPosition);
      activeShapePoints.push(earthPosition);

      let dynamicPositions = new Cesium.CallbackProperty(() => activeShapePoints, false);
      activeShape = drawPathShape(dynamicPositions);
    }

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
    terminateShape();
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

function createPoint(position) {
  return targetViewer.entities.add({
    position: position,
    point: {
      color: Cesium.Color.WHITE,
      pixelSize: 10,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  });
}

function terminateShape() {
  endDrawPath();
  drawPathShape(activeShapePoints);

  let lats = [];
  let lons = [];

  activeShapePoints.forEach(cartesian3 => {
    let point = cartesian3_to_degrees(targetViewer, cartesian3);
    lats.push(point.lat);
    lons.push(point.lng);
  })

  let params = {
    lats: lats.join(","),
    lngs: lons.join(","),
    video_height: Math.ceil(
      targetViewer.camera.positionCartographic.height
    ),
  };

  params.distance = 10;
  //this.lineWidth / 2;
  // this.loadGridsInPolyline(params);

  targetViewer.entities.remove(floatingPoint);
  floatingPoint = null;

  targetViewer.entities.remove(activeShape);
  activeShape = null;
  activeShapePoints = [];
}

function endDrawPath() {
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

// 绘制路径
function drawPathShape(positionData) {
  shape = targetViewer.entities.add({
    corridor: {
      positions: positionData,
      width: 200,
      cornerType: Cesium.CornerType.ROUNDED,
      material: new Cesium.ColorMaterialProperty(
        Cesium.Color.RED.withAlpha(0.5)
      ),
      height: 3
    }
  });
}
