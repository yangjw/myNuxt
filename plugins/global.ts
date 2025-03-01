export default defineNuxtPlugin((nuxtApp) => {
  // 添加全局方法
  nuxtApp.provide('formatDate', (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN').format(date)
  })
}) 