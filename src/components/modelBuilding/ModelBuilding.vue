<script setup lang="ts">
import {computed, ref} from "vue";
import {Cartesian3, Matrix4, Transforms} from "cesium";

const props = defineProps<{}>()
const appearance = ref(null as any)
const attributes = ref(null as any)
const modelMatrix = ref(null as any)

const init = () => {
  appearance.value = new Cesium.PerInstanceColorAppearance({
    flat: true
  })
  attributes.value = new Cesium.ColorGeometryInstanceAttribute(Math.random(), Math.random(), Math.random())
  modelMatrix.value = Matrix4.multiplyByTranslation(
      Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(119.842282, 40.014781)),
      new Cartesian3(0.0, 0.0, 0),
      new Matrix4()
  )
}

defineExpose({
  init: init,
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
