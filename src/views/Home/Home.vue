<script setup lang="ts">
import {computed, inject, ref} from 'vue'
import {VcConfigProvider, VcViewerRef} from 'vue-cesium'
import {VcReadyObject} from 'vue-cesium/es/utils/types'
import {CESIUM_REF_KEY, CesiumRef} from '@/libs/cesium/cesium-vue'

const emit = defineEmits(['viewerReady', 'cesiumReady', 'leftClick', 'destroyed'])
const viewerRef = ref<VcViewerRef>(null as any)
const cesiumRef = inject<CesiumRef>(CESIUM_REF_KEY)
const flyToChina = () => {
  cesiumRef?.viewer?.camera?.flyTo({
    duration: 1,
    destination: Cesium.Cartesian3.fromDegrees(
        120.028463,
        40.336929,
        100
    ),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-78),
      roll: 0.0,
    },
  })
}

// methods
const onViewerReady = (readyObj: VcReadyObject) => {
  // 加载的同时将 全局$cesiumRef初始化
  if (!cesiumRef) {
    throw new Error('No cesium reference exist.')
  }
  cesiumRef.viewer  = readyObj.viewer as any
  // eslint-disable-next-line
  cesiumRef.viewerContainer = (readyObj.viewer as any)._element
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


</script>
<template>
  <div class="home-container">
    <el-button @click="flyToChina">中国</el-button>
    <vc-config-provider :cesium-path="'/CesiumUnminified/Cesium.js'"
                        :access-token="'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5Y2U0ZTk2Ni1jNzdkLTQ3OWYtYjVmYS0yMGM3YTk3NjgzMmUiLCJpZCI6Njk5Nywic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0ODA1MTc0OH0.Csy6yyAnv6JSBppH0Ou3ahshqcHFEhP27iOz5gjQMEo'">
      <vc-viewer ref="viewerRef" class="main-viewer" @ready="onViewerReady" @cesiumReady="onCesiumReady"
                 :cesium-path="'https://www.supermapol.com/earth/Build/Cesium/Cesium.js'"
                 :show-credit="false"
                 :fullscreen-button="true"
                 :vr-button="true"
                 :scene-mode-picker="true"
                 :selection-indicator="true"
      >
        <vc-navigation
            :offset="[-20,40]"
        ></vc-navigation>
        <vc-layer-imagery :sort-order="10">
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
</template>

<style scoped lang="scss">
.home-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
</style>