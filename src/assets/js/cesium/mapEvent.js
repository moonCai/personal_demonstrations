/**
 *  监听地图移动结束
 * */
export function mapMoveEnd(targetViewer) {

  targetViewer.scene.camera.moveEnd.addEventListener(() => {
    let cartographic = targetViewer.scene.globe.ellipsoid.cartesianToCartographic(
      targetViewer.camera.position
    );

    //将弧度转为度的十进制度表示
    let longitude = Cesium.Math.toDegrees(
      cartographic.longitude
    );
    let latitude = Cesium.Math.toDegrees(cartographic.latitude);
    let height = Math.ceil(targetViewer.camera.positionCartographic.height);

    let rectangle = targetViewer.camera.computeViewRectangle();
    let west = (rectangle.west / Math.PI) * 180;
    let north = (rectangle.north / Math.PI) * 180;
    let east = (rectangle.east / Math.PI) * 180;
    let south = (rectangle.south / Math.PI) * 180;

    let bounds = {
      southwest: {
        lng: west,
        lat: south
      },
      northeast: {
        lng: east,
        lat: north
      }
    };

    console.log(
      "照相机: ",
      bounds,
      longitude,
      latitude,
      height
    );
    console.log("heading: ", targetViewer.scene.camera.heading);
    console.log("pitch: ", targetViewer.scene.camera.pitch);
    console.log("roll: ", targetViewer.scene.camera.roll);
  });
}
