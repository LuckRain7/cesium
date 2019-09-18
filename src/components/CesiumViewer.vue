<template>
  <div>
    <div class="legend">
      <!-- <div class="legend-select">
        <span>按年付费 </span>
        <el-switch v-model="value1" > </el-switch>
      </div> -->

      <!-- 全图例加载go -->
      <div class="legend-tree" style="overflow:scroll;max-height:500px; ">
        <el-tree
          :data="legendArray"
          show-checkbox
          @check-change="handleCheckChange"
        >
          <span slot-scope="{ node, data }">
            <span
              v-if="data.color"
              v-bind:style="{
                background: data.color
              }"
              style="width:20px;height:20px;"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span style="padding-left: 4px;">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <!-- 全图例加载 end -->

      <div class="zzy-legenditem" @click="upItem('grape')">
        &nbsp; &nbsp;
        <span style="background-color:red;">&nbsp;&nbsp;&nbsp;&nbsp;</span>
        &nbsp;
        <span>葡萄种植大棚</span>
        &nbsp;&nbsp;&nbsp;&nbsp;
      </div>
      <br />
      <div class="zzy-legenditem" @click="upItem('strawberry')">
        &nbsp; &nbsp;
        <span style="background-color:red;">&nbsp;&nbsp;&nbsp;&nbsp;</span>
        &nbsp;
        <span>草莓种植大棚</span>
      </div>
      <div>
        <button @click="ChangeBaseMap">地图切换</button>
      </div>
    </div>
    <!-- 地图div -->
    <div id="cesiumContainer"></div>
  </div>
</template>
<style lang="css">
.legend {
  /* width: 200px; */
  position: absolute;
  z-index: 99;
  color: white;
  background-color: rgba(11, 15, 52, 1);
}
.zzy-legenditem {
  text-align: left;
}
.el-tree {
  background-color: transparent;
}
.legend-select {
  background: white;
}
</style>
<script>
import Cesium from "cesium/Cesium";

import {
  relaxation_url,
  relaxation_color,
  scenery_url,
  scenery_color,
  planting_url,
  planting_color,
  accommodation_url,
  accommodation_color,
  producingDepartment_url,
  producingDepartment_color,
  restaurant_url,
  restaurant_color,
  grape_url,
  grape_color,
  server_url,
  server_color,
  bigDataCenter_url,
  bigDataCenter_color,
  strawberry_url,
  strawberry_color,
  intelligentGreenhouse_url,
  intelligentGreenhouse_color
} from "../mapConfig/url.js";

let viewer,
  relaxation_data,
  scenery_data,
  planting_data,
  accommodation_data,
  producingDepartment_data,
  restaurant_data,
  grape_data,
  server_data,
  bigDataCenter_data,
  strawberry_data,
  intelligentGreenhouse_data;
let legendArray = [];
let upItemOBJ = {};
let layers;
// let TDT_yingxiang;
// let TDT_shiliang;
// let TDT_zhuji;

export default {
  name: "CesiumViewer",
  mounted() {
    viewer = new Cesium.Viewer("cesiumContainer", {
      homeButton: false, //取消返回主视角按钮
      baseLayerPicker: false, //取消默认的底图切换按钮
      animation: false, //取消左下角动画圆盘按钮
      vrButton: false, //取消vr按钮
      geocoder: false, //是否显示地名查找控件
      sceneModePicker: true, //是否显示投影方式控件
      infoBox: true, //是否显示点击要素之后显示的信息
      // sceneModePicker:false //2d 3d 转换按钮
      selectionIndicator: false,
      timeline: false, //去除时间轴
      navigationHelpButton: false, //取消帮助按钮
      navigationInstructionsInitiallyVisible: false
    });

    viewer._cesiumWidget._creditContainer.style.display = "none"; //去除版权信息

    layers = viewer.imageryLayers;
    var entity;

    function viewerflyToLonLat(lon, lat, alt) {
      if (entity) viewer.entities.remove(entity);
      entity = new Cesium.Entity({
        id: "flyTmp",
        position: Cesium.Cartesian3.fromDegrees(lon, lat),
        point: {
          pixelSize: 10,
          color: Cesium.Color.WHITE.withAlpha(0.9),
          outlineColor: Cesium.Color.WHITE.withAlpha(0.9),
          outlineWidth: 1
        }
      });
      viewer.entities.add(entity);
      viewer.flyTo(entity, {
        offset: {
          // 以弧度为单位的航向角。
          heading: Cesium.Math.toRadians(0.0),
          // 以弧度表示的俯仰角。
          pitch: Cesium.Math.toRadians(-45),
          // 距离中心的距离以米为单位。
          range: alt
        }
      });
    }

    // 加载后1.5秒后 飞行到对一个位置
    setTimeout(function() {
      viewerflyToLonLat(117.356, 35.9, 500);
    }, 1500);

    // TDT_yingxiang = this.AddChineseTDT();
    // TDT_shiliang = this.AddTDTSL();
    // TDT_zhuji = this.AddChineseTDTSL();

    layers.addImageryProvider(this.AddChineseTDT(), 1); //加载全国天地图影像地图
    layers.addImageryProvider(this.AddTDTSL(), 2); //加载全国天地图 矢量地图
    layers.addImageryProvider(this.AddChineseTDTSL(), 3); //加载全国天地图中文注记图层
    // layers.addImageryProvider(this.AddCX()); //加载长兴正射影像图
    layers._layers[2].show = false; //将矢量影像设置为不可见

    this.ajaxInit(
      {
        id: "relaxation",
        legend: "休闲娱乐区",
        url: relaxation_url,
        color: relaxation_color
      },
      function(data) {
        relaxation_data = data;
      }
    );
    this.ajaxInit(
      {
        id: "scenery",
        legend: "景观",
        url: scenery_url,
        color: scenery_color
      },
      function(data) {
        scenery_data = data;
      }
    );

    this.ajaxInit(
      {
        id: "planting",
        legend: "种植区",
        url: planting_url,
        color: planting_color
      },
      function(data) {
        planting_data = data;
      }
    );

    this.ajaxInit(
      {
        id: "accommodation",
        legend: "住宿区",
        url: accommodation_url,
        color: accommodation_color
      },
      function(data) {
        accommodation_data = data;
      }
    );

    this.ajaxInit(
      {
        id: "producingDepartment",
        legend: "生产车间",
        url: producingDepartment_url,
        color: producingDepartment_color
      },
      function(data) {
        producingDepartment_data = data;
      }
    );

    this.ajaxInit(
      {
        id: "grape",
        legend: "葡萄区",
        url: grape_url,
        color: grape_color
      },
      function(data) {
        grape_data = data;
      }
    );
    this.ajaxInit(
      {
        id: "server",
        legend: "服务设施区",
        url: server_url,
        color: server_color
      },
      function(data) {
        server_data = data;
      }
    );
    this.ajaxInit(
      {
        id: "bigDataCenter",
        legend: "大数据中心",
        url: bigDataCenter_url,
        color: bigDataCenter_color
      },
      function(data) {
        bigDataCenter_data = data;
      }
    );

    this.ajaxInit(
      {
        id: "strawberry",
        legend: "草莓大棚",
        url: strawberry_url,
        color: strawberry_color
      },
      function(data) {
        strawberry_data = data;
      }
    );
    this.ajaxInit(
      {
        id: "intelligentGreenhouse",
        legend: "智能温室",
        url: intelligentGreenhouse_url,
        color: intelligentGreenhouse_color
      },
      function(data) {
        intelligentGreenhouse_data = data;
      }
    );
    this.ajaxInit(
      {
        id: "restaurant",
        legend: "餐厅",
        url: restaurant_url,
        color: restaurant_color
      },
      function(data) {
        restaurant_data = data;
      }
    );

    // 点击事件 获取当前位置坐标
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction(function(evt) {
      var cartesian = viewer.camera.pickEllipsoid(
        evt.position,
        viewer.scene.globe.ellipsoid
      );
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      var lng = Cesium.Math.toDegrees(cartographic.longitude); //经度值
      var lat = Cesium.Math.toDegrees(cartographic.latitude); //纬度值
      var mapPosition = { x: lng, y: lat, z: cartographic.height }; //cartographic.height的值始终为零。
      console.log(mapPosition);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  },
  methods: {
    upItem(id) {
      // 葡萄棚
      if (id === "grape") {
        if (!upItemOBJ[id]) {
          upItemOBJ[id] = true;
          grape_data.entities.values.forEach(item => {
            item.polygon.extrudedHeight = 1;
            let intercal = setInterval(() => {
              item.polygon.extrudedHeight += 10;
              if (item.polygon.extrudedHeight > 50) {
                clearInterval(intercal);
              }
            }, 80);
          });
        } else {
          upItemOBJ[id] = false;
          grape_data.entities.values.forEach(item => {
            let intercal = setInterval(() => {
              item.polygon.extrudedHeight -= 10;
              if (item.polygon.extrudedHeight == 1) {
                clearInterval(intercal);
              }
            }, 80);
          });
        }
      }
      // 草莓大棚
      else if (id === "strawberry") {
        strawberry_data.entities.values.push(
          strawberry_data.entities.values[0]
        );
        console.log(strawberry_data);
        console.log(grape_data.entities.values);

        // if (!upItemOBJ[id]) {
        //   upItemOBJ[id] = true;
        //   if (strawberry_data.entities.values.length === 1) {
        //     strawberry_data.entities.values.push(strawberry_data.entities.values[0]);
        //     let item = strawberry_data.entities.values[0];
        //     item.polygon.extrudedHeight = 1;
        //     let intercal = setInterval(() => {
        //       item.polygon.extrudedHeight += 10;
        //       if (item.polygon.extrudedHeight > 50) {
        //         clearInterval(intercal);
        //       }
        //     }, 80);
        //   }
        // } else {
        //   upItemOBJ[id] = false;
        //   let item = strawberry_data.entities.values[0];
        //   // item.polygon.extrudedHeight = 1;
        //   let intercal = setInterval(() => {
        //     item.polygon.extrudedHeight -= 10;
        //     if (item.polygon.extrudedHeight == 1) {
        //       clearInterval(intercal);
        //     }
        //   }, 80);
        // }
      }
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      handler.setInputAction(function(evt) {
        var cartesian = viewer.camera.pickEllipsoid(
          evt.position,
          viewer.scene.globe.ellipsoid
        );
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var lng = Cesium.Math.toDegrees(cartographic.longitude); //经度值
        var lat = Cesium.Math.toDegrees(cartographic.latitude); //纬度值
        var mapPosition = { x: lng, y: lat, z: cartographic.height }; //cartographic.height的值始终为零。
        console.log(mapPosition);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      // eval(go);
    },
    AddChineseTDT() {
      //加载全国天地图
      var tdtImageryProvider = new Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb",
        layer: "tdtBasicLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        maximumLevel: 18 //设置最大放大级数
      });
      return tdtImageryProvider;
    },
    AddChineseTDTSL() {
      //加载全国天地图 中文注记
      var tdtImageryProvider = new Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&tk=ebf64362215c081f8317203220f133eb",
        layer: "tiandituImgMarker",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "tiandituImgMarker",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        show: true,
        maximumLevel: 18
      });
      return tdtImageryProvider;
    },
    AddTDTSL() {
      //加载全国天地图 矢量地图
      var tdtImageryProvider = new Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb",
        layer: "tdtVecBasicLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"]
      });
      return tdtImageryProvider;
    },
    AddCX() {
      //加载正射影像
      let cxImageryProvider = new Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://192.168.1.165:8080/geoserver/gwc/service/wmts/rest/test:zhengshe/EPSG:900913/EPSG:900913:{TileMatrix}/{TileRow}/{TileCol}?format=image/png",
        layer: "test:zhengshe",
        style: "",
        format: "image/png",
        tileMatrixSetID: "EPSG:900913"
      });
      return cxImageryProvider;
    },
    setColor(options) {
      //设置颜色 都是256
      return Cesium.Color.fromBytes(
        options[0], //red
        options[1], //green
        options[2], //blue
        options[3] //alpha
      );
    },
    // 休闲娱乐地图加载模块
    relaxation_Fun(type) {
      switch (type) {
        case "ajax":
          Cesium.GeoJsonDataSource.load(relaxation_url).then(dataSource => {
            relaxation_data = dataSource;
            viewer.dataSources.add(dataSource);
            dataSource.entities.values.forEach(item => {
              item.polygon.material = this.setColor(relaxation_color); //设置颜色
              item.polygon.outline = true; //设置外边线
              // entity.polygon.outlineColor = ;//设置外边线颜色
            }); //拿到数据中的实体
          });
          break;
        case "destory":
          viewer.dataSources.remove(relaxation_data);
          break;
        case "raise":
          relaxation_data.entities.values.forEach((item, index) => {
            item.polygon.outline = false;
            item.polygon.extrudedHeight = 100 - 20 * index; //高度设为0
          });
          break;
        case "down":
          relaxation_data.entities.values.forEach(item => {
            item.polygon.outline = false;
            item.polygon.extrudedHeight = 0; //高度设为0
          });
          break;
      }
    },
    // 初始化模块化
    ajaxInit(options, callback) {
      // 定义图例
      let l = {
        id: "",
        label: "",
        color: "",
        children: []
      };
      l.id = options.id;
      l.color = this.hexify(
        `rgba(${options.color[0]},${options.color[1]},${options.color[2]},1)`
      );
      l.label = options.legend;
      // 进行图层初始化
      Cesium.GeoJsonDataSource.load(options.url).then(dataSource => {
        viewer.dataSources.add(dataSource);
        dataSource.entities.values.forEach((item, index) => {
          // 判断空值
          if (item.name) {
            l.children.push({
              label: item.name,
              parent: options.id,
              index: index
            });
          }
          item.polygon.material = this.setColor(options.color);
          item.polygon.outline = true;
        });
        this.legendArray.push(l);
        callback(dataSource);
      });
    },
    // 加载图例
    handleCheckChange(data, checked, indeterminate) {
      console.log("handleCheckChange");
      console.log(data, checked, indeterminate);
    },
    handleNodeClick(data) {
      console.log("handleNodeClick");
      console.log(data);
    },
    // rgba 转16进制
    hexify(color) {
      var values = color
        .replace(/rgba?\(/, "")
        .replace(/\)/, "")
        .replace(/[\s+]/g, "")
        .split(",");
      var a = parseFloat(values[3] || 1),
        r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
        g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
        b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
      return (
        "#" +
        ("0" + r.toString(16)).slice(-2) +
        ("0" + g.toString(16)).slice(-2) +
        ("0" + b.toString(16)).slice(-2)
      );
    },
    // 地图切换功能
    ChangeBaseMap() {
      // 使用这个变量进行底图的切换 和控制
      if (layers._layers[1].show) {
        layers._layers[1].show = false;
        layers._layers[2].show = true;
      } else {
        layers._layers[1].show = true;
        layers._layers[2].show = false;
      }
    }
  },
  data() {
    return {
      legendArray: [],
      count: 1,
      value1: true
    };
  }
};
</script>


