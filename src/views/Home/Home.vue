<script setup lang="ts">
import {inject, ref} from 'vue'
import {VcConfigProvider, VcViewerRef} from 'vue-cesium'
import {VcReadyObject} from 'vue-cesium/es/utils/types'
import {CESIUM_REF_KEY, CesiumRef} from '@/libs/cesium/cesium-vue'
import TopBar from "@/components/topBar/TopBar.vue";
import {Cartesian3, Matrix4, Transforms} from "cesium";

const emit = defineEmits(['viewerReady', 'cesiumReady', 'leftClick', 'destroyed'])
const viewerRef = ref<VcViewerRef>(null as any)
const cesiumRef = inject<CesiumRef>(CESIUM_REF_KEY)
const flyToTiger = () => {
  cesiumRef?.viewer?.camera?.flyTo({
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
const flyToTigerAndConvertView = () => {
  cesiumRef?.viewer?.camera?.flyTo({
    duration: 1,
    destination: Cesium.Cartesian3.fromDegrees(
        119.841900,
        40.011900,
        111.58
    ),
    orientation: {
      heading: Cesium.Math.toRadians(10),
      pitch: Cesium.Math.toRadians(-17.9),
      roll: 0.0,
    },
  })
}

// state
const geometryRef = ref(null as any)
const appearance = ref(null as any)
const attributes = ref(null as any)
const modelMatrix = ref(null as any)
// methods
const onViewerReady = (readyObj: VcReadyObject) => {
  // 加载的同时将 全局$cesiumRef初始化
  if (!cesiumRef) {
    throw new Error('No cesium reference exist.')
  }
  cesiumRef.viewer = readyObj.viewer as any
  // eslint-disable-next-line
  cesiumRef.viewerContainer = (readyObj.viewer as any)._element

  appearance.value = new Cesium.PerInstanceColorAppearance({
    flat: true
  })
  attributes.value = {
    color: new Cesium.ColorGeometryInstanceAttribute(Math.random(), Math.random(), Math.random())
  }

  modelMatrix.value = Matrix4.multiplyByTranslation(
      Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(119.842282, 40.014781)),
      new Cartesian3(0.0, 0.0, 0),
      new Matrix4()
  )

  console.log(
      Matrix4.multiplyByTranslation(
          Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(119.842282, 40.014781)),
          new Cartesian3(0.0, 0.0, 0),
          new Matrix4()
      )
  )

  emit('viewerReady', readyObj)
}


const onCesiumReady = (readyObj: any) => {
  emit('cesiumReady', readyObj)
}
const onDestroyed = (e: any) => {
  emit('destroyed', e)
}


// 高德地图
const mapStyle = ref(7)
const projectionTransforms = ref({
  form: "BD09",
  to: "WGS84",
})
const topVisible = ref(true)


</script>
<template>
  <div class="home-container">
    <top-bar class="top-bar" :visible="topVisible">
      <el-button type="primary" text size="small" @click="flyToTiger">泰德尔</el-button>
      <el-button type="primary" text size="small" @click="flyToTigerAndConvertView">转换视图</el-button>
    </top-bar>
    <div class="main">
      <vc-config-provider :cesium-path="'/CesiumUnminified/Cesium.js'"
                          :access-token="'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5Y2U0ZTk2Ni1jNzdkLTQ3OWYtYjVmYS0yMGM3YTk3NjgzMmUiLCJpZCI6Njk5Nywic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0ODA1MTc0OH0.Csy6yyAnv6JSBppH0Ou3ahshqcHFEhP27iOz5gjQMEo'">
        <!--
            :cesium-path="'https://www.supermapol.com/earth/Build/Cesium/Cesium.js'"
        -->
        <vc-viewer ref="viewerRef" class="main-viewer" @ready="onViewerReady" @cesiumReady="onCesiumReady"
                   :show-credit="false"
                   :fullscreen-button="true"
                   :vr-button="true"
                   :scene-mode-picker="true"
                   :selection-indicator="true"
        >
          <!--导航相关控件-->
          <vc-navigation
              :offset="[-20,120]"
              :otherOpts="{ position: 'bottom' }"
          >
          </vc-navigation>
          <!--描边-->
          <vc-primitive :appearance="appearance" >
            <vc-geometry-instance :attributes="attributes">
              <vc-geometry-simple-polyline
                  ref="geometryRef"
                  :positions="[
            { lng: 119.841660, lat: 40.015759 },
            { lng: 119.844402, lat: 40.014502 },
            { lng: 119.843387, lat: 40.013100 },
            { lng: 119.840481, lat: 40.013706 },
            { lng: 119.840325, lat: 40.014051 },
            { lng: 119.841660, lat: 40.015759 },
          ]" ,
              ></vc-geometry-simple-polyline>
            </vc-geometry-instance>
          </vc-primitive>

          <model-building :cesium="Cesium"/>

<!--          <vc-primitive :appearance="appearance">-->
<!--            <vc-geometry-instance :attributes="attributes" :modelMatrix="modelMatrix" v-for="(fr,index) in 32" :key="fr">-->
<!--              <vc-geometry-box :dimensions="{x: 50.0, y: 50.0, z: 5.0 * (index+1)}"></vc-geometry-box>-->
<!--            </vc-geometry-instance>-->
<!--          </vc-primitive>-->


          <!--高德图层-->
          <vc-layer-imagery>
            <!--高德地图-->
            <vc-imagery-provider-amap
                :map-style="mapStyle"
                :projection-transforms="projectionTransforms"
            />
          </vc-layer-imagery>
          <!-- 请求进度条 -->
          <vc-ajax-bar position="bottom" color="#21BA45" size="3px" positioning="fixed"></vc-ajax-bar>
          <slot/>
        </vc-viewer>
      </vc-config-provider>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;


  .top-bar {
    position: relative;
    top: 0;
    left: 0;
    height: $top-bar-height;
    line-height: $top-bar-height;
  }

  .main {
    width: 100%;
    height: calc(100% - $top-bar-height);
  }


}
</style>
