import Cesium from "cesium/Cesium";
const THERE_MODEL_URL = "http://localhost:3000/Scene/go.json"


export const Model_there = {
    data: null,
}

Model_there.init = function (viewer) {
    let thereV = new Cesium.Cesium3DTileset({
        url: THERE_MODEL_URL,
        maximumScreenSpaceError: 2,
        maximumNumberOfLoadedTiles: 1000
    });
    this.data = viewer.scene.primitives.add(thereV);
}