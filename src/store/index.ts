import { createPinia } from 'pinia'

export const pinia = createPinia()

/**
 * 项目全局 store。
 * 组件内使用不需要传 pinia，组件外使用需要传 pinia。
 */
export const store = {
  system: {

  },
  viewer: {

  }
}
