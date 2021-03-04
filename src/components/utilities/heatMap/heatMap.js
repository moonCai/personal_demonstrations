import {
  getLevelForHeight
} from "assets/js/cesium/regionAndLevel";

let configs = {
  heatEntity: null,
  heatData: [],
  bounds: [],
  canvasWidth: 800,
  canvasHeight: 600,
  heatColors: [{
      0: "rgb(255, 253, 196)"
    },
    {
      0.25: "rgb(255, 253, 84)"
    },
    {
      0.5: "rgb(242,184,64)"
    },
    {
      0.75: "rgb(236, 117, 47)"
    },
    {
      1: "rgb(232, 51, 35)"
    }
  ],
  pointRadius: 0,
  minCount: 0,
  maxCount: 0,
  pointsLength: 20000,
}

/**
 * @param {*} viewer 地图
 * @param {Array} heatData 热力图数据
 * @param {Array} bounds 热力图最小外包矩形
 * @param {Array} heatColors 热力图颜色
 * @param {Number} minCount 最小热力值
 * @param {Number} maxCount 最大热力值
 */
export function drawHeatMap(viewer, heatData, bounds, heatColors, minCount, maxCount) {

  configs.heatData = heatData;
  configs.bounds = bounds;

  let level = getLevelForHeight(viewer);

  if (level > 26) {
    // 26级为1米网格
    configs.pointRadius = 3;
  } else if (level > 15) {
    // 15级为2公里网格
    configs.pointRadius = 3 + (30 - level) / 4
  } else {
    configs.pointRadius = 30 - level
  }

  configs.heatColors = heatColors || configs.heatColors;

  if (heatData.length > configs.pointsLength) {
    // 热点数据过多，进行点聚合，减轻渲染压力
    pointsAggregation();
  } else {
    let counts = heatData.map((point) => point.count);
    configs.minCount = minCount || Math.min(...counts);
    configs.maxCount = maxCount || Math.max(...counts);
  }

  createHeatmapCanvasWrapper(viewer);

  drawGrayScaleOverlay();

  configs.heatEntity && viewer.entities.remove(configs.heatEntity);

  configs.heatEntity = viewer.entities.add({
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(
        bounds[0],
        bounds[1],
        bounds[2],
        bounds[3]
      ),
      material: new Cesium.ImageMaterialProperty({
        image: getHeatCanvas(),
        transparent: true,
      }),
    },
  });
}

// 聚合点
function pointsAggregation() {
  let {
    heatData,
    canvasWidth,
    canvasHeight,
    bounds
  } = configs;

  let gridWidth = 10;

  let xNums = Math.ceil(canvasWidth / gridWidth);
  let yNums = Math.ceil(canvasHeight / gridWidth);
  let diffLng = bounds[2] - bounds[0];
  let diffLat = bounds[3] - bounds[1];
  let intervalLng = diffLng / xNums;
  let intervalLat = diffLat / yNums;

  let grids = [];

  for (let x = 0; x < xNums; x++) {
    for (let y = 0; y < yNums; y++) {
      grids.push({
        lng: (x + 1 / 2) / xNums * diffLng + bounds[0],
        lat: (y + 1 / 2) / yNums * diffLat + bounds[1],
        arr: []
      });
    }
  }

  heatData.forEach((point) => {
    let cols = Math.floor((point.lng - bounds[0]) / intervalLng);
    let rows = Math.floor((point.lat - bounds[1]) / intervalLat);

    grids[rows * yNums + cols].arr.push(point);
  })

  let gridCounts = grids.map(grid => {
    if (grid.arr.length == 0) {
      grid.count = 0;
    } else {
      grid.count = grid.arr.reduce((pre, point) => {
        return pre + point.count
      }, 0)
    }

    return grid.count
  })

  configs.heatData = grids;
  configs.minCount = Math.min(...gridCounts);
  configs.maxCount = Math.max(...gridCounts);
}

// 绘制灰度叠加图
function drawGrayScaleOverlay() {
  let wrapperCanvas = document.querySelector(".heatmap-canvas");
  let ctx = wrapperCanvas.getContext("2d");

  let {
    heatData,
    bounds,
    canvasWidth,
    canvasHeight,
    pointRadius,
    minCount,
    maxCount
  } = configs;

  let baseCount = maxCount - minCount;

  heatData.map((point) => {
    let pointX = Math.round((point.lng - bounds[0]) * canvasWidth);
    let pointY = Math.round((point.lat - bounds[1]) * canvasHeight);

    drawGradientCircle(pointX, pointY, point.count);
  });

  function drawGradientCircle(pointX, pointY, pointValue) {
    ctx.beginPath();
    ctx.arc(pointX, pointY, pointRadius, 0, 2 * Math.PI);
    ctx.globalAlpha = (pointValue - minCount) / baseCount;

    let grad = ctx.createRadialGradient(pointX, pointY, 0, pointX, pointY, pointRadius)
    grad.addColorStop(0, "rgba(0,0,0,1)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }
}

// 获取热力图
function getHeatCanvas() {
  let {
    canvasWidth,
    canvasHeight
  } = configs;

  let canvasWrapper = document.querySelector(".heatmap-canvas");
  let ctx = canvasWrapper.getContext("2d");
  let img = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  let imageData = img.data;

  let palette = createHeatLengend();

  for (let i = 3; i < imageData.length; i += 4) {
    let alpha = imageData[i];

    if (!alpha) continue;

    // 映射颜色RGB值 -- 调色板长度为256（0-255), 根据当前像素点的透明度取一个色值。 
    let offset = alpha * 4;

    imageData[i - 3] = palette[offset];
    imageData[i - 2] = palette[offset + 1];
    imageData[i - 1] = palette[offset + 2];

    if (alpha > 0.5 * 255) {
      imageData[i] = 0.5 * 255;
    } else if (alpha > 0.4 * 255 && alpha < 0.5 * 255) {
      imageData[i] = alpha - 0.15 * 255;
    } else if (alpha > 0.05 * 255 && alpha < 0.2 * 255) {
      imageData[i] = alpha + 0.1 * 255;
    }
  }

  ctx.putImageData(img, 0, 0, 0, 0, canvasWidth, canvasHeight);

  return canvasWrapper;
}

// 创建热力图画布容器
function createHeatmapCanvasWrapper(viewer) {
  $('.heatmap-canvas').remove();

  let canvasWrapper = document.createElement("canvas");
  viewer.container.append(canvasWrapper);
  canvasWrapper.classList.add("heatmap-canvas");
  canvasWrapper.width = configs.canvasWidth;
  canvasWrapper.height = configs.canvasHeight;
  canvasWrapper.style.display = "none";

  return canvasWrapper
}

// 创建热力图例
function createHeatLengend() {
  let lengendWidth = 256;
  let lengendHeight = 1;

  let paletteCanvas = document.createElement("canvas");
  paletteCanvas.width = lengendWidth;
  paletteCanvas.height = lengendHeight;

  let paletteCtx = paletteCanvas.getContext("2d");
  let gradient = paletteCtx.createLinearGradient(0, 0, lengendWidth, lengendHeight);

  for (let colorInfo of configs.heatColors) {
    let key = Number(Object.keys(colorInfo)[0]);
    gradient.addColorStop(key, colorInfo[key]);
  }

  paletteCtx.fillStyle = gradient;
  paletteCtx.fillRect(0, 0, lengendWidth, lengendHeight);

  return paletteCtx.getImageData(0, 0, lengendWidth, lengendHeight).data;
}
