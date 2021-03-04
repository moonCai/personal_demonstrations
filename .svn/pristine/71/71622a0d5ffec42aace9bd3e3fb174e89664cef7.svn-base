/**
 * 加载模型
 * @param mapViewer 要添加模型的地图
 * */
export function loadModel(mapViewer, fileName, modelName, gltfUrl, longitude, latitude, height) {
    let position = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        height
    );

    let hpr = new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(176.45),
        0,
        0
    );

    let matrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        hpr,
        Cesium.Ellipsoid.WGS84,
        Cesium.Transforms.eastNorthUpToFixedFrame,
        new Cesium.Matrix4()
    );

    let modelEntity = Cesium.Model.fromGltf({
        url: gltfUrl + fileName + '/' + modelName + ".gltf",
        modelMatrix: matrix,
        id: modelName
    });

    let building = mapViewer.scene.primitives.add(modelEntity);

    Cesium.when(building.readyPromise)
        .then(() => {
            console.log(modelName + "模型加载成功");
        })
        .otherwise(function (error) {
            console.log(modelName + "模型加载失败error: ", error);
        });
    
    return building;
}