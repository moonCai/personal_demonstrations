let tilesUrl = "http://geoserver.iwhere.com/3d/wuzhen3DTILES/tileset.json";

export function load3DTiles(targetViewer) {
  let tileset = new Cesium.Cesium3DTileset({
    url: tilesUrl
  });

  tileset.readyPromise
    .then(function (tileset) {
      targetViewer.scene.primitives.add(tileset);
      // targetViewer.zoomTo(
      //   tileset,
      //   new Cesium.HeadingPitchRange(
      //     0.0,
      //     -0.5,
      //     tileset.boundingSphere.radius * 1
      //   )
      // );
    })
    .otherwise(function (error) {
      console.log(error);
    });
}
