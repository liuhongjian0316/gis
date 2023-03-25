import {defineConfig} from 'vite'
import path from "path";
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
// import vitePluginCesium from "vite-plugin-cesium";
// @ts-ignore
import Components from 'unplugin-vue-components/vite'
// @ts-ignore
import AutoImport from 'unplugin-auto-import/vite'
// @ts-ignore
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
// @ts-ignore
import vitePluginCesium from './plugins/vite.plugin.cesium'

// https://vitejs.dev/config/
export default defineConfig({
    base: "/gis",
    server: {
        host: "0.0.0.0",
    },
    plugins: [
        vue(),
        // vitePluginCesium(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@views": path.resolve(__dirname, "./src/views"),
            "@router": path.resolve(__dirname, "./src/router"),
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/assets/mixin.scss";`
            }
        }
    }
})
