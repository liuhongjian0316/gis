import zhCN from './zh-CN'
import enUS from './en-US'
import {createI18n} from 'vue-i18n'

export const messages = {
    'zh-CN': zhCN,
    'en-US': enUS
}
const locale = 'zh-CN'

export const i18n = createI18n({
    legacy: false,
    locale: locale as string,
    fallbackLocale: 'zh-CN',
    globalInjection: true,
    messages
})
