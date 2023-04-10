import {createApp} from 'vue'
import './style.scss'
import App from './App.vue'
import {router} from '@router/router';
import "element-plus/theme-chalk/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import ElementPlus from 'element-plus';
import VueCesium from 'vue-cesium'
// cesium vue
import cesiumVue from './libs/cesium/cesium-vue'
import 'vue-cesium/dist/index.css'
import {i18n} from '@/i18n/index'
import {pinia} from '@/store/index'
import register from "@/components/index";
(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
const app = createApp(App)
app.use(router)
    .use(i18n)
    .use(pinia)
    .use(cesiumVue)
    // @ts-ignore
    .use(VueCesium)
    .use(ElementPlus)
register(app)
app.mount('#app')

