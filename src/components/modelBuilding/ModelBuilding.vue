<script setup lang="ts">
import {computed, ref} from "vue";
import {Cartesian3, Matrix4, Transforms} from "cesium";

const props = defineProps<{
  Cesium:any,
}>()
const appearance = computed(() => {
  if (props.Cesium) {
    return new props.Cesium.PerInstanceColorAppearance({
      flat: true
    })
  } else {
    return null
  }
})
const attributes = computed(() => {
  if (props.Cesium) {
    return {
      color: new props.Cesium.ColorGeometryInstanceAttribute(Math.random(), Math.random(), Math.random())
    }
  } else {
    return null
  }
})
const modelMatrix = ref(Matrix4.multiplyByTranslation(
    Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(119.842282, 40.014781)),
    new Cartesian3(0.0, 0.0, 0),
    new Matrix4()
))

const init = () => {
  appearance.value = new props.Cesium.PerInstanceColorAppearance({
    flat: true
  })
}

defineExpose({
  init:init,
})

</script>
<template>
  <vc-primitive :appearance="appearance">
    <vc-geometry-instance :attributes="attributes" :modelMatrix="modelMatrix" v-for="(fr,index) in 32" :key="fr">
      <vc-geometry-box :dimensions="{x: 50.0, y: 50.0, z: 5.0 * (index+1)}"></vc-geometry-box>
    </vc-geometry-instance>
  </vc-primitive>
</template>


<style scoped lang="scss">

</style>
