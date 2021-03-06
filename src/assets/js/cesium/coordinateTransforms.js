/**
 * @ cesium —— js编写的基于webgl的地图引擎
 * @ 支持的坐标系：WGS84 和 WGS84 Web Mercator
 * @ 常用的几种坐标系：
 *      1. 平面坐标系（笛卡尔二维坐标系 —— Cartesian2）new Cesium.Cartesian2(x, y)
 *      2. 笛卡尔空间直角坐标系 （笛卡尔三维坐标系 Cartesian3,也即世界坐标）new Cesium.Cartesian3(x, y, z)
 *      3. 经纬度（longitude，latitude），地理坐标系，坐标原点在椭球的质心。Cesium中没有具体的经纬度对象，要得到
 *         经纬度首先要计算弧度，再进行转换。
 *      4. 弧度（Cartographic)
 *         new Cesium.Cartographic(longitude, latitude, height)  
 *         注：这里的经纬度是用弧度表示的。而地理坐标系中的经纬度是角度。 角度 = 弧度 / 2π  * 360；
 * */

/**
 * @经纬度转化为世界坐标 
 */
export function degrees_to_cartesian3(targetViewer, longitude, latitude, height) {
  let ellipsoid = targetViewer.scene.globe.ellipsoid;
  let cartesian3 = Cesium.Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid);

  return cartesian3;
}

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
    height
  }
}

/**
 * @屏幕坐标转化为世界坐标
 */
export function windowCoordinates_to_cartesian3(targetViewer, x, y) {
  let pick = new Cesium.Cartesian2(x, y);
  let scene = targetViewer.scene;
  let cartesian = scene.globe.pick(targetViewer.camera.getPickRay(pick), scene);

  console.log("世界坐标：", cartesian);
}

/**
 *@世界坐标转化为屏幕坐标 
 */
export function cartesian3_to_windowCoordinates(targetViewer, cartesian3) {
  let windowPoint = Cesium.SceneTransforms.wgs84ToWindowCoordinates(targetViewer.scene, cartesian3);

  return windowPoint;
}
