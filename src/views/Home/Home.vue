<script setup lang="ts">
import {onMounted} from "@vue/runtime-core";
import {ref} from "vue";
import MousePosition from "@/libs/myMap/mousePosition/mousePosition";
import * as Cesium from "cesium";
import {Color} from "cesium";
import CesiumNavigation from "cesium-navigation-es6";

// 全局参数
const viewer = ref(null as any)
const viewerOfEye = ref(null as any)

const init = () => {
  try {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZTVhNDRlYS0xZGQ3LTRlYjQtYTdiNS05YjM2MDlmMWQxYWUiLCJpZCI6MTMxMjYwLCJpYXQiOjE2ODAxMzk4MTR9.4TWaeCbQiiAUdxp4OmEkacpXXFHDxrW0hDbEk24Etwo';
    viewer.value = new Cesium.Viewer("cesiumContainer", {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: true,
      vrButton: true,
      geocoder: true,
      homeButton: false,
      infoBox: true,
      sceneModePicker: true, // 2d切3d
      selectionIndicator: true,
      timeline: false,
      navigationHelpButton: false, // 帮助按钮
      navigationInstructionsInitiallyVisible: false,
      creditContainer: 'creditContainer',
      shouldAnimate: true,
    }) as any;

    initEye(viewer.value);
    // 加载罗盘导航
    initCompass(viewer.value);
    // 测试时显示帧数
    viewer.value.scene.debugShowFramesPerSecond = true;
    // 隐藏版权信息
    hideCreditContent(viewer.value)
    // 加载高德矢量图
    loadAMapImageryLayer(viewer.value)
    // 加载地形
    // loadTerrain(viewer.value)
    // 鼠标位置
    const MP = new MousePosition(viewer.value);
    // 添加 entity
    // 通过czml
    addEntityByCzml(viewer.value)
    // 绘制各种图形
    addEntityAllCategory(viewer.value)

    // 动态czml czml中的物体沿着czml的路径做运动
    dynamicCzml(viewer.value);

    // 动态图片
    dynamicImg(viewer.value);


    // documentTest()
  } catch (e: any) {
    console.error("发生异常：", e)
  }
}


// 隐藏版权信息
const hideCreditContent = (viewer: any) => {
  const cesiumWidgetCredits = viewer._cesiumWidget._creditContainer.querySelectorAll('.cesium-widget-credits')
  if (cesiumWidgetCredits && cesiumWidgetCredits.length > 0) {
    cesiumWidgetCredits[0].style.display = 'none'
  }
}
// 加载高德适量图
const loadAMapImageryLayer = (viewer: any) => {
  let aMapLayer = new Cesium.UrlTemplateImageryProvider({
    url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    minimumLevel: 3,
    maximumLevel: 20
  }) as any
  viewer.imageryLayers.addImageryProvider(aMapLayer);
}

const loadTerrain = (viewer: any) => {
  // 添加地形
  var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
    url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
    requestVertexNormals: true
  });
  viewer.terrainProvider = cesiumTerrainProviderMeshes;
}

const initCompass = (viewer: any) => {
  // https://github.com/cesium-plugin/cesium-navigation-es6
  const options = {} as any;
  // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
// options.defaultResetView = Rectangle.fromDegrees(80, 22, 130, 50)
  options.defaultResetView = new Cesium.Cartographic(Cesium.Math.toRadians(111.50623801848565), Cesium.Math.toRadians(2.8997206760441205), 8213979.400955964)
//相机方向
  options.orientation = {
    heading: Cesium.Math.toRadians(350.94452087411315),
    pitch: Cesium.Math.toRadians(-66.6402342251215),
    roll: Cesium.Math.toRadians(360)
  }
//相机延时
  options.duration = 4//默认为3s

// 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
  options.enableCompass = true;
// 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
  options.enableZoomControls = true;
// 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
  options.enableDistanceLegend = true;
// 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
  options.enableCompassOuterRing = true;

//修改重置视图的tooltip
  options.resetTooltip = "重置视图";
//修改放大按钮的tooltip
  options.zoomInTooltip = "放大";
//修改缩小按钮的tooltip
  options.zoomOutTooltip = "缩小"

  new CesiumNavigation(viewer, options);
}

const initEye = (viewer: any) => {
  // 在鹰眼box中加载一个"副地球"  然后"主地球"通过事件实现副随主同步 效果还可以 只是简单实现
  viewerOfEye.value = new Cesium.Viewer('eye', {
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: true,
    vrButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false, // 2d切3d
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false, // 帮助按钮
    navigationInstructionsInitiallyVisible: false,
    creditContainer: 'eyeCredit',
    shouldAnimate: true,
  });
  const cesiumWidgetCredits = viewerOfEye.value._cesiumWidget._creditContainer.querySelectorAll('.cesium-widget-credits')
  if (cesiumWidgetCredits && cesiumWidgetCredits.length > 0) {
    cesiumWidgetCredits[0].style.display = 'none'
  }
  let control = viewerOfEye.value.scene.screenSpaceCameraController;
  control.enableRotate = false;
  control.enableTranslate = false;
  control.enableZoom = false;
  control.enableTilt = false;
  control.enableLook = false;
  let syncViewer = function () {
    viewerOfEye.value.camera.flyTo({
      destination: viewer.camera.position,
      orientation: {
        heading: viewer.camera.heading,
        pitch: viewer.camera.pitch,
        roll: viewer.camera.roll
      },
      duration: 0.0
    });
  }
  // 双球同步
  viewer.scene.preRender.addEventListener(syncViewer);
}

// 通过czml添加entity
const addEntityByCzml = (viewer: any) => {
  // 红色盒子带黑线
  const czml = [{
    "id": "document",
    "name": "box",
    "version": "1.0"
  }, {
    "id": "shape2",
    "name": "Red box with black outline",
    "position": {
      "cartographicDegrees": [119.842342, 40.014292, 300000.0]
    },
    "box": {
      "dimensions": {
        "cartesian": [40.0, 30.0, 50.0]
      },
      "material": {
        "solidColor": {
          "color": {
            "rgba": [255, 0, 0, 128]
          }
        }
      },
      "outline": true,
      "outlineColor": {
        "rgba": [0, 0, 0, 255]
      }
    }
  }];
  const dataSourcePromise = Cesium.CzmlDataSource.load(czml);
  viewer.dataSources.add(dataSourcePromise);
  // viewer.zoomTo(dataSourcePromise);
}

const addEntityPoint = (viewer: any) => {
  const entityData = {
    position: Cesium.Cartesian3.fromDegrees(119.842342, 40.014292, 0),
    point: new Cesium.PointGraphics({
      show: true,
      pixelSize: 80.0,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      color: Color.GREEN,
      outlineColor: Color.GREEN,
      outlineWidth: 1,
    })
  }
  viewer.entities.add(entityData);
}
const addEntityBox = (viewer: any) => {
  const entityData = {
    position: Cesium.Cartesian3.fromDegrees(119.842342, 40.014292, 0),
    box: new Cesium.BoxGraphics({
      show: true,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      dimensions: new Cesium.Cartesian3(20.0, 15.0, 25.0),
      fill: true,
      material: Color.CORAL,
      outline: true,
      outlineColor: Color.GREEN,
      outlineWidth: 2.0,
      shadows: Cesium.ShadowMode.DISABLED
    })
  }
  viewer.entities.add(entityData)
}

const addEntityLine = (viewer: any) => {
  const line1 = {
    position: Cesium.Cartesian3.fromDegrees(119.842342, 40.014292, 0),
    name: 'line1',
    polyline: {
      show: true,
      loop: true,
      positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
      material: Cesium.Color.RED,
      clampToGround: true,
      width: 5,
    },
  }
  const line2 = {
    position: Cesium.Cartesian3.fromDegrees(119.842342, 40.014292, 0),
    name: 'line2',
    polyline: {
      show: true,
      loop: true,
      positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
      width: 5,
      arcType: Cesium.ArcType.RHUMB,
      material: Cesium.Color.GREEN,
    },
  }
  const line3 = {
    position: Cesium.Cartesian3.fromDegrees(119.842342, 40.014292, 0),
    name: 'line3',
    polyline: {
      show: true,
      loop: true,
      positions: Cesium.Cartesian3.fromDegreesArray([-75, 37, -125, 37]),
      width: 10,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.8,
        taperPower: 0.1,
        color: Cesium.Color.CORNFLOWERBLUE,
      }),
    },
  }
  const line4 = {
    position: Cesium.Cartesian3.fromDegrees(119.842342, 40.014292, 0),
    name: 'line4',
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        -75,
        39,
        250000,
        -125,
        39,
        250000,
      ]),
      width: 10,
      material: new Cesium.PolylineOutlineMaterialProperty({
        color: Cesium.Color.ORANGE,
        outlineWidth: 6.0,
        outlineColor: Cesium.Color.ROSYBROWN,
      }),
    },
  }
  const line5 = {
    position: Cesium.Cartesian3.fromDegrees(119.842342, 40.014292, 0),
    name: 'line5',
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        -75,
        43,
        500000,
        -125,
        43,
        500000,
      ]),
      width: 10,
      arcType: Cesium.ArcType.NONE,
      material: new Cesium.PolylineArrowMaterialProperty(
          Cesium.Color.PURPLE
      ),
    },
  }
  const line6 = {
    position: Cesium.Cartesian3.fromDegrees(119.842342, 40.014292, 0),
    name: 'line6',
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        -75,
        45,
        500000,
        -125,
        45,
        500000,
      ]),
      width: 4,
      material: new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.CYAN,
        dashLength: 2,
        gapColor: Cesium.Color.BLACK,
        dashPattern: 255.0,
      }),
    },
  }

  // 只需将polyline更改为corridor 便可将线贴地

  viewer.entities.add(line1)
  viewer.entities.add(line2)
  viewer.entities.add(line3)
  viewer.entities.add(line4)
  viewer.entities.add(line5)
  viewer.entities.add(line6)

  // viewer.zoomTo(viewer.entities);
}

const addEntityPolygon = (viewer: any) => {
  const polygon = {  // 面
    name: "polygon",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        -115.0,
        37.0,
        -115.0,
        32.0,
        -107.0,
        33.0,
        -102.0,
        31.0,
        -102.0,
        35.0,
      ]),
      material: Cesium.Color.CYAN,
    },
  };

  viewer.entities.add(polygon)
}

const addEntityLabel = (viewer: any) => {
  const labelEntity = {
    name: 'label',
    position: Cesium.Cartesian3.fromDegrees(119.842342, 40.014292, 20),
    label: { //文字标签
      text: '文字标签',
      font: '14pt Source Han Sans CN',    //字体样式
      fillColor: Cesium.Color.BLACK,        //字体颜色
      backgroundColor: Cesium.Color.AQUA,    //背景颜色
      showBackground: true,                //是否显示背景颜色
      style: Cesium.LabelStyle.FILL,        //label样式
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,//水平位置
      pixelOffset: new Cesium.Cartesian2(10, 0)            //偏移
    },
    billboard: { // 广告牌
      image: '/test.jpg',
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      scale: 0.5,
      height: 300,
      width: 300,
    }
  }
  viewer.entities.add(labelEntity)
  // viewer.zoomTo(viewer.entities);
}

const addEntityBillboard = (viewer: any) => {
  const billboardEntity = {
    name: '广告牌',
    position: Cesium.Cartesian3.fromDegrees(119.842342, 40.014292, 30),
    billboard: {
      image: 'test2.jpg',
      // 图像地址，URI或Canvas的属性
      // 设置颜色和透明度
      color: Cesium.Color.WHITE.withAlpha(0.8),
      // 高度（以像素为单位）
      height: 150,
      // 宽度（以像素为单位）
      width: 150,
      // 逆时针旋转
      rotation: 0,
      // 大小是否以米为单位
      sizeInMeters: false,
      // 相对于坐标的垂直位置
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      // 相对于坐标的水平位置
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
      pixelOffset: new Cesium.Cartesian2(0, -10),
      // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
      scale: 1.0,
      // 是否显示
      show: true
    }
  }

  viewer.entities.add(billboardEntity)

}

const addEntityDescription = (viewer: any) => {
  const descriptionEntity = {
    position: Cesium.Cartesian3.fromDegrees(119.842342, 40.014292, 30),
    name: '我是infobox的标题',
    description: '我是infobox的内容',
    label: {
      text: "我是标签带描述",
      font: "24px Helvetica",
      fillColor: Cesium.Color.SKYBLUE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      backgroundColor: Cesium.Color.PINK,
      showBackground: true,
    },
  }

  // 重写信息infoBox内容
  descriptionEntity.description = `
<img
  width="50%"
  style="float:left; margin: 0 1em 1em 0;"
  src="/test.jpg"/>
<p>
  Wyoming is a state in the mountain region of the Western
  United States.
</p>
<p>
  Wyoming is the 10th most extensive, but the least populous
  and the second least densely populated of the 50 United
  States. The western two thirds of the state is covered mostly
  with the mountain ranges and rangelands in the foothills of
  the eastern Rocky Mountains, while the eastern third of the
  state is high elevation prairie known as the High Plains.
  Cheyenne is the capital and the most populous city in Wyoming,
  with a population estimate of 62,448 in 2013.
</p>
<p>
  Source:
  <a style="color: WHITE"
    target="_blank"
    href="">xxxxxx</a>
</p>
  `

  viewer.entities.add(descriptionEntity)
  viewer.zoomTo(viewer.entities);

}

const addEntityCircle = (viewer: any) => {
  const entityData = {
    position: Cesium.Cartesian3.fromDegrees(117, 32, 0),
  }
}

const addEntityOfStickToGroundLines = (viewer: any) => {
  // 普通线
  const ordinaryLine = viewer.entities.add({
    name: 'Red line on the surface',
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        112.82436,
        23.071506,
        112.82742,
        23.067512,
        112.828878,
        23.064659,
        112.830799,
        23.060947,
        112.832166,
        24.058329
      ]),
      width: 2,
      material: Cesium.Color.YELLOW
    }
  });
  //第一种 将polyline换成corridor
  const oneCorridor = viewer.entities.add({
    name: 'Red corridor on surface with rounded corners',
    corridor: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        112.82436,
        23.071506,
        112.82742,
        23.067512,
        112.828878,
        23.064659,
        112.830799,
        23.060947,
        112.832166,
        23.058329
      ]),
      width: 20.0,
      material: Cesium.Color.YELLOW
    }
  });

  // 第二种
  viewer.dataSources.add(Cesium.GeoJsonDataSource.load('line.json', {
    clampToGround: true
  }));

  const cartographics = [new Cesium.Cartographic(112.82536, 23.071506),
    new Cesium.Cartographic(112.832166, 23.058329),
    new Cesium.Cartographic(112.833166, 23.059329),
    new Cesium.Cartographic(112.82636, 23.072506)
  ];
  const rectangle = Cesium.Rectangle.fromCartographicArray(cartographics);


  const rectanglePrimitive = viewer.scene.primitives.add(new Cesium.GroundPrimitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.CorridorGeometry({
        vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
        positions: Cesium.Cartesian3.fromDegreesArray([112.82536, 23.071506, 112.82742, 23.067512, 112.828878, 23.064659, 112.830799, 23.060947, 112.832166, 23.058329]),
        width: 40
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 1.0, 0.0, 0.5))
      }
    }),
    /*
    // 添加地形
    classificationType: Cesium.ClassificationType.TERRAIN
    */
  }));

  //点云
  const url2 = 'tileset2.json';
  const tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: url2
    //url : 'https://beta.cesium.com/api/assets/1460?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMzk2YzJiOS1jZGFmLTRlZmYtYmQ4MS00NTA3NjEwMzViZTkiLCJpZCI6NDQsImFzc2V0cyI6WzE0NjBdLCJpYXQiOjE0OTkyNjQ3NTV9.oWjvN52CRQ-dk3xtvD4e8ZnOHZhoWSpJLlw115mbQJM'
  }));

  let style = {
    color: "color('#ff0000')"
  } as any;
  style.pointSize = Cesium.defaultValue(style.pointSize, 5.0);
  tileset.style = new Cesium.Cesium3DTileStyle(style);

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(112.82536, 23.071506, 500.0),
    orientation: {
      heading: Cesium.Math.toRadians(145.0),
      pitch: Cesium.Math.toRadians(-35.0),
      roll: 0.0
    }
  });


  // var entity = viewer.entities.add({
  //     position: Cesium.Cartesian3.fromDegrees(112.82536, 23.071506, 100),
  //     ellipse: {
  //         semiMinorAxis: 300.0,
  //         semiMajorAxis: 300.0,
  //         material: Cesium.Color.BLUE.withAlpha(1.0) //可设置不同的MaterialProperty
  //     }
  // });

  // viewer.entities.add({
  //     position: Cesium.Cartesian3.fromDegrees(112.82742, 23.067512, 200),
  //     ellipse: {
  //         semiMinorAxis: 300.0,
  //         semiMajorAxis: 300.0,
  //         material: Cesium.Color.AQUA.withAlpha(1.0) //可设置不同的MaterialProperty
  //     }
  // });

}

const addEntityGlobalTexture = (viewer: any) => {
  // 创建一个rectangle类型的geometry添加到地球上 范围是 (-180.0,-90.0,180.0,90.0)
  // 获取video标签 并播放
  const videoElement = document.getElementById('trailer') as any;
  if (videoElement) {
    videoElement.play();
  }
  // 添加rect
  const rect = viewer.entities.add({
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
      material: videoElement
    }
  });
  viewer.trackedEntity = rect;
}


function addEntityAllCategory(viewer: any) {
  // 2 dimension
  addEntityPoint(viewer)
  addEntityLine(viewer)
  addEntityPolygon(viewer)

  addEntityLabel(viewer)
  addEntityBillboard(viewer)
  addEntityDescription(viewer)

  // 贴底线
  addEntityOfStickToGroundLines(viewer);

  // 全球纹理
  addEntityGlobalTexture(viewer);

  // 3 dimension
  addEntityBox(viewer)
  addEntityCircle(viewer)

  //绘制扇形
  addEntitySector(viewer)

  // 纹理
  addEntityColorTextural(viewer)

  // 动态纹理
  addEntityDynamicColorTextural(viewer)


  // 飞向最终
  viewer?.camera?.flyTo({
    duration: 1,
    destination: Cesium.Cartesian3.fromDegrees(
        119.842342,
        40.014292,
        592.66
    ),
    orientation: {
      heading: Cesium.Math.toRadians(10),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0.0,
    },
  })
}

const dynamicCzml = (viewer: any) => {
  // czml数据
  const czml = [{
    "id": "document",
    "name": "polygon",
    "version": "1.0",
    "clock": {
      "interval": "2012-08-04T16:00:00Z/2012-08-04T18:00:00Z",
      "currentTime": "2012-08-04T16:00:00Z",
      "multiplier": 10
    }
  }, {
    "id": "shape2",
    "name": "Red box with black outline",
    "availability": "2012-08-04T16:00:00Z/2012-08-04T18:00:00Z",
    /*"position" : {
      "cartographicDegrees" : [-66.62557, 516.92809, 100.0]
    },*/
    "box": {
      "dimensions": {
        "cartesian": [30.0, 30.0]
      },
      "material": {
        "stripe": {
          "orientation": "VERTICAL",
          "evenColor": {
            "rgba": [10, 211, 250, 0]
          },
          "oddColor": {
            "rgba": [10, 211, 250, 255]
          },
          "offset": {
            "number": 1
          },
          "repeat": 0.5
        }
      },
    },
    "path": {
      "material": {
        "solidColor": {
          "color": {
            "interval": "2012-08-04T16:00:00Z/2012-08-04T18:00:00Z",
            "rgba": [255, 0, 0, 128]
          }
        }
      },
      "width": [{
        "interval": "2012-08-04T16:00:00Z/2012-08-04T18:00:00Z",
        "number": 3.0
      }],
      "show": [{
        "interval": "2012-08-04T16:00:00Z/2012-08-04T18:00:00Z",
        "boolean": true
      }]
    },
    "position": {
      "interpolationAlgorithm": "LAGRANGE",
      "interpolationDegree": 1,
      "epoch": "2012-08-04T16:00:00Z",
      "cartographicDegrees": [
        0.0, 118.87841653400005, 30.95679870500004, 0.0,
        10.0, 118.87826541800007, 30.95680770900003, 0.0,
        20.0, 118.8774481050001, 30.956860625000047, 0.0,
        30.0, 118.87660414600009, 30.956910105000077, 0.0,
        40.0, 118.8759846580001, 30.95694296000005, 0.0,
        50.0, 118.87542502500003, 30.956978761000073, 0.0,
        60.0, 118.87473380100005, 30.957024103000037, 0.0

      ]
    }
  }] as any;
  let dataSourcePromise;
  let i = 30.957024;
  let a = 60;
  setInterval(function () {
    i += 0.0001;
    a += 10;
    czml[1].position.cartographicDegrees.push(a, 118.8747338, i, 0);
    czml[0].clock.currentTime = viewer.clock.currentTime.toString();
    viewer.entities.removeAll();
    viewer.dataSources.add(Cesium.CzmlDataSource.load(czml));
  }, 1000);
  dataSourcePromise = Cesium.CzmlDataSource.load(czml);
  viewer.dataSources.add(dataSourcePromise);
  viewer.zoomTo(dataSourcePromise);
}


let curCanvas = 'a'
let i = 0;

function drawCanvasImage(time: any, result: any) {
  let canvas = document.getElementById("canvas-" + curCanvas) as any;
  let cWidth = 700;
  let cHeight = 100;
  let imgWidth = 60;
  let imgHeight = 34;
  let ctx = canvas.getContext("2d");
  let img = new Image();
  img.src = "arrow.png";
  img.onload = function () {
    if (i <= cWidth) {
      ctx.clearRect(0, 0, cWidth, cHeight);
      ctx.drawImage(img, i, 0, imgWidth, imgHeight);
    } else{
      i = 0
    }
    i += 3;
  }
  curCanvas = curCanvas === 'a' ? 'b' : 'a';
  return canvas;
}

function drawCanvas(time: any, result: any) {
  var canvas = document.getElementById("canvas-" + curCanvas) as any;
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = 'italic 40pt Calibri';
  context.fillStyle = "red";
  context.fillText(Cesium.JulianDate.toDate(Cesium.JulianDate.now()).getTime(), 20, 100);
  curCanvas = curCanvas === 'a' ? 'b' : 'a';
  return canvas;
}

const dynamicImg = (viewer: any) => {
  var startTime = Cesium.JulianDate.now();

  var rotation = Cesium.Math.toRadians(30);

  function getRotationValue() {
    rotation += 0.005;
    return rotation;
  }

  viewer.entities.add({
    name: 'Rotating rectangle with rotating texture coordinate',
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(-90.0, 30.0, -70.0, 35.0),
      material: new Cesium.ImageMaterialProperty({
        // image: new Cesium.CallbackProperty(drawCanvas, false), // 文字
        // image: "/arrow.png", // 静态图片
        // image: canvas, // 静态图片
        image: new Cesium.CallbackProperty(drawCanvasImage, false), // 动态图片
        transparent: true
      }),
      // rotation: new Cesium.CallbackProperty(getRotationValue, false),
      // stRotation: new Cesium.CallbackProperty(getRotationValue, false)
    }
  });

  viewer.zoomTo(viewer.entities);
}


// 世界坐标转经纬度
const cartesian3ToLatAndLng: any = (viewer: any, params: any) => {
  try {
    if (Array.isArray(params)) {
      return params.map((item: any) => cartesian3ToLatAndLng(viewer, item));
    } else {
      const ellipsoid = viewer.scene.globe.ellipsoid;
      const cartographic = ellipsoid.cartesianToCartographic(params);
      const lng = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      const height = cartographic.height;
      return [lng, lat, height];
    }
  } catch (e: any) {
    console.error("cartesian3ToLatAndLng：", e)
  }

}

// 跳转的到一个区域，且最后得到的图形是整个范围的 1/3
function flyToRectangle(viewer: any, position: any, time: any) {
  const WE = position.east - position.west;
  const NS = position.north - position.south;
  viewer.camera.flyTo({
    destination: Cesium.Rectangle.fromDegrees(
        position.west - WE,
        position.south - NS,
        position.east + WE,
        position.north + NS
    ),
    duration: time || 0.8,
  });
};

const documentTest = () => {
  // 平面坐标系
  new Cesium.Cartesian2(10, 20)
  // 世界坐标
  new Cesium.Cartesian3(10, 10, 10,)
  // 弧度
  new Cesium.Cartographic(119.842342, 40.014292, 592.66); // 经度 维度 高度

  // 经纬度转为世界坐标
  Cesium.Cartesian3.fromDegrees(119.842342,
      40.014292,
      592.66);

  //世界坐标转经纬度
  cartesian3ToLatAndLng(viewer.value, Cesium.Cartesian3.fromDegrees(119.842342,
      40.014292,
      592.66))
  cartesian3ToLatAndLng(viewer.value, [
    Cesium.Cartesian3.fromDegrees(119.842342,
        40.014292,
        592.66),
    Cesium.Cartesian3.fromDegrees(119.842342,
        40.014292,
        592.66),
    Cesium.Cartesian3.fromDegrees(119.842342,
        40.014292,
        592.66)
  ])
  // 屏幕坐标转为世界坐标
  // new Cesium.Cartesian2(0, 0);
  // const cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(new Cesium.Cartesian2(0, 0)), viewer.scene);
  // // 世界坐标转为屏幕坐标
  // Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian)
  // // 弧度转为经纬度
  // Cesium.Math.toRadians(10);
  // 经纬度转为弧度
  // Cesium.Math.toDregees(radians)

  // 返回指定经度和纬度的二维区域
  // new Cesium.Rectangle.fromDegrees(
  //     Number, // 最西的经度
  //     Number, // 最南端的纬度
  //     Number, // 最东的经度
  //     Number // 最北端的纬度
  // );
// 返回颜色
//   Cesium.Color.fromCssColorString(
//       color // css 的颜色样式
//   ).withAlpha(
//       Number // 颜色的透明度，0 - 1
//   );

  // 切换为三维
  // viewer.scene.morphTo3D({
  //   duration: Number // 切换花费的时间
  // });
// 切换为二维
//   viewer.scene.morphTo2D({
//     duration: Number // 切换花费的时间
//   });
  // 跳转设置点或区域
//   viewer.camera.flyTo({
//     // destination: position, 跳转到某一点时，格式为 Cartesian3 的位置
//     destination: Rectangle, // 跳转到某一区域
//     duration： Number, // 镜头飞行时长
// });
// // 跳转某一实体
//   viewer.flyTo(
//       target, // 实体
//       {
//         duration: Number, // 镜头飞行时长
//         maximumHeight: Number, // 镜头飞行的最大高度
//         offset: new Cesium.HeadingPitchRangce(
//             Number, // 航向角，格式为弧度
//             Number, // 俯仰角，格式为弧度
//             Number, // 据中心的距离
//         ),
//       },
//   );

  // 跳转某一实体，且可以设置航向角，俯仰角和据中心距离
  // viewer.zommTo(
  //     target, // 实体
  //     new Cesium.HeadingPitchRange(
  //         Number, // 航向角，格式为弧度
  //         Number, // 俯仰角，格式为弧度
  //         Number, // 据中心的距离
  //     ),
  // );

  // 导入数据源 GeoJsonDataSource

  // 导入格式为 GeoJSON 或 TopoJSON 的实体
  // viewer.dataSources.add(Cesium.GeoJsonDataSource.load(data, { // data 为需要加载的数据
  //   markerSize: Number, // 为每个点创建的地图图钉的默认大小
  //   stroke: Color, // 折线和多边形轮廓的默认颜色
  //   strokeWidth: Number, // 折线和多边形轮廓的默认宽度
  //   fill: Color, // 多边形内部的默认颜色
  //   clampToGround: Boolean, // 是否固定在地面
  // })).then(dataSourcre => {
  //   console.log(dataSourcre);
  // });
  // 导入数据源 KmlDataSource kml
  // 导入格式为 KML 的实体
  // viewer.dataSources.add(data, { // data 为需要加载的数据
  //   camera: camera, // 用于viewRefreshModes并将摄像机属性发送到网络链接的摄像机
  //   canvas: canvas, // 用于将查看器属性发送到网络链接的画布
  //   clampToGround: Boolean, // 是否固定在地面
  // }).then(dataSource => {
  //   console.log(dataSource);
  // });

  // 长度计算
  // positions 需要计算线状实体的位置信息，是一个数组，每个元素是经纬度
  // const polyline = turf.lineString(positions);
  // const length = turf.length(polyline);
  //根据点经纬度计算面积
  // hierarchy 需要计算面状实体的位置信息，是一个数组，每个元素是经纬度，且第一个元素与最后一个元素要相同
  // const polygon = turf.polygon([hirerachy]);
  // const area = turf.area(polygon);

  // 其它
  // 开启抗锯齿
//   viewer.scene.postProcessStages.fxaa.enabled = true;
// // 取消默认的左键双击事件
//   viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

  // modelMatrix 矩阵

}

const computeCirclularFlight = (lon: any, lat: any, radius: any) => {
  let Ea = 6378137;      //   赤道半径
  let Eb = 6356725;      // 极半径
  let positionArr = [];
  positionArr.push(lon);
  positionArr.push(lat);
  //需求正北是0° cesium正东是0°
  for (let i = 0; i <= 90; i++) {
    let dx = radius * Math.sin(i * Math.PI / 180.0);
    let dy = radius * Math.cos(i * Math.PI / 180.0);

    let ec = Eb + (Ea - Eb) * (90.0 - lat) / 90.0;
    let ed = ec * Math.cos(lat * Math.PI / 180);

    let BJD = lon + (dx / ed) * 180.0 / Math.PI;
    let BWD = lat + (dy / ec) * 180.0 / Math.PI;

    positionArr.push(BJD);
    positionArr.push(BWD);
  }
  console.log(positionArr);
  return positionArr;
}

const addEntitySector = (viewer: any) => {
  let positionArr = computeCirclularFlight(-112.210693, 36.0994841, 3000);
  viewer.entities.add({
    polygon: {
      hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(
          positionArr
      )),
      height: 0.0,
      extrudedHeight: 1000.0,
      outline: true,
      outlineColor: Cesium.Color.WHITE.withAlpha(0.0),
      outlineWidth: 1,
      material: Cesium.Color.WHITE.withAlpha(0.5)
    }
  });

  for (let i = 0; i < positionArr.length; i = i + 2) {
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(positionArr[i], positionArr[i + 1]),
      point: {
        show: true, // default
        color: Cesium.Color.SKYBLUE, // default: WHITE
        pixelSize: 10, // default: 1
        outlineColor: Cesium.Color.YELLOW, // default: BLACK
        outlineWidth: 3 // default: 0
      }
    });
  }

  viewer.zoomTo(viewer.entities);
}


//纹理图绘制
function getColorRamp(elevationRamp: any, flag = false) {
  var ramp = document.createElement('canvas');
  ramp.width = 1;
  ramp.height = 100;
  var ctx = ramp.getContext('2d') as any;
  var values = elevationRamp;
  var grd = ctx.createLinearGradient(0, 0, 0, 100);
  grd.addColorStop(values[0], '#000000'); //black
  grd.addColorStop(values[1], '#2747E0'); //blue
  grd.addColorStop(values[2], '#D33B7D'); //pink
  grd.addColorStop(values[3], '#D33038'); //red
  grd.addColorStop(values[4], '#FF9742'); //orange
  grd.addColorStop(values[5], '#ffd700'); //yellow
  grd.addColorStop(values[6], '#ffffff'); //white

  // 透明纹理
  // grd.addColorStop(values[5], 'transparent'); //yellow


  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 1, 100);
  return ramp;
}

const addEntityColorTextural = (viewer: any) => {
  var redWall = viewer.entities.add({
    name: 'Red wall at height',
    wall: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        121.444409, 31.247417, 200.0,
        121.533521, 31.235685, 200.0,
        121.563273, 31.190347, 200.0,
        121.546744, 31.194054, 200.0,
        121.516705, 31.191459, 200.0,
        121.502188, 31.203074, 200.0
      ]),
      minimumHeights: [3000.0, 2000.0, 2000, 2000, 2000, 3000],
      material: getColorRamp([0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0], true)
    }
  });
  //

}

function computeCircle(radius: any) {
  var positions = [];
  for (var i = 0; i < 360; i++) {
    var radians = Cesium.Math.toRadians(i);
    positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
  }
  return positions;
}

const addEntityDynamicColorTextural = (viewer: any) => {
  viewer.entities.add({
    name: 'Red tube with rounded corners',
    polylineVolume: {
      positions: Cesium.Cartesian3.fromDegreesArray([-85.0, 32.0, -85.0, 36.0, -89.0, 36.0]),
      shape: computeCircle(6000.0),
      //颜色回调
      material: new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function () {
        return Cesium.Color.fromRandom({
          minimumRed: 0.75,
          minimumGreen: 0.75,
          minimumBlue: 0.75,
          alpha: 1.0
        });

      }, false))
    }
  })
}


onMounted(() => {
  init()
})


</script>

<template>
  <el-scrollbar style="height: 100%;width: 100%;">
    <!--视频纹理-->
    <video id="trailer" style="display: none;" muted autoplay loop crossorigin controls>
      <source src="tt.mp4" type="video/mp4">
      Your browser does not support the <code>video</code> element.
    </video>

    <!--动态切换-->
    <canvas id="canvas-a" class="canvas" width="700" height="100"></canvas>
    <canvas id="canvas-b" class="canvas" width="700" height="100"></canvas>


    <div id="cesiumContainer">
      <!--credit-->
      <div id="creditContainer">泰德尔GIS</div>

      <!--鹰眼-->
      <div id="eye">
        <div id="eyeCredit"></div>
      </div>
    </div>


  </el-scrollbar>
</template>


<style scoped lang="scss">


#cesiumContainer {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  #creditContainer {
    position: absolute;
    bottom: 0;
    left: 0;
    color: red;
    font-size: 1.2em;
    z-index: 1;
    display: block;
  }

  #eye {
    position: absolute;
    width: 20%;
    height: 20%;
    bottom: 0;
    right: 0;
    z-index: 999;
    background: red;
    border: solid blue 1px;
  }
}

.canvas {
  position: absolute;
  left: 10px;
  top: 10px;
  display: none;
}

#canvas-a {
  top: 10px;
}

#canvas-b {
  top: 120px;
}

</style>
