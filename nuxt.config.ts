// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-03-04',
  devtools: { enabled: true },

  app: {
    head: {
      title: '我的小红书',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '分享生活，发现美好' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  css: [
    '@/assets/styles/main.scss'
  ],

  modules: [
    '@nuxt/content',
    '@nuxtjs/sitemap'
  ],

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://your-site.com'
    }
  },

  nitro: {
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*'
        }
      }
    }
  },

  plugins: [
    { src: '~/plugins/infinite-scroll.ts', mode: 'client' }
  ],

  sitemap: {
    hostname: process.env.NUXT_PUBLIC_SITE_URL || 'https://m.yixiaozu.com/'
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: ''
        }
      }
    }
  }
})