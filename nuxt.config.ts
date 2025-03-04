// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },

  typescript: {
    shim: false
  },

  css: ['~/assets/css/main.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: ''  // 如果需要全局导入变量，可以在这里添加
        }
      }
    }
  },

  modules: ['@nuxt/content'],

  // 路由配置
  routeRules: {
    // 静态页面预渲染
    '/': { prerender: true },
    '/about': { prerender: true },
    
    // API 路由的缓存策略
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'Access-Control-Allow-Origin': '*'
      }
    },

    // 重定向示例
    '/old-page': { redirect: '/new-page' },
    
    // SPA 模式的路由
    '/admin/**': { 
      ssr: false,
      // 管理后台的安全headers
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
      }
    },
    
    // 高级缓存策略
    '/blog/**': {
      swr: 3600,
      prerender: true
    },
    '/products/**': {
      cache: {
        maxAge: 3600,
        staleWhileRevalidate: 86400 // 1天
      }
    },
    '/static/**': {
      static: true, // 永久缓存
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    
    // API 缓存策略
    '/api/products': {
      cache: {
        maxAge: 60, // 1分钟
        staleWhileRevalidate: 3600 // 1小时
      }
    },
    '/api/categories': {
      swr: 7200 // 2小时
    }
  },

  // 应用配置
  app: {
    // 页面切换时的加载进度条
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },

    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: '我的 Nuxt 应用',
      meta: [
        { name: 'description', content: '默认的网站描述' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#41b883' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap' }
      ]
    }
  },

  // 路由中间件配置
  router: {
    options: {
      strict: true
    },
    middleware: ['auth'],
    // 自定义 404 处理
    statusCode: {
      404: '~/pages/404.vue'
    }
  },

  // 国际化配置
  i18n: {
    locales: [
      {
        code: 'zh',
        iso: 'zh-CN',
        file: 'zh.json',
        name: '简体中文'
      },
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.json',
        name: 'English'
      }
    ],
    defaultLocale: 'zh',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    },
    vueI18n: {
      legacy: false,
      locale: 'zh',
      fallbackLocale: 'zh',
      availableLocales: ['zh', 'en']
    }
  },

  // 安全配置
  security: {
    headers: {
      crossOriginEmbedderPolicy: 'require-corp',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginResourcePolicy: 'same-origin',
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"]
      }
    },
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 'hour'
    }
  },

  // 错误处理
  errorHandler: '~/error.vue',

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://your-site.com",
    }
  },

  plugins: [
    { src: '~/plugins/infinite-scroll.ts', mode: 'client' }
  ],
})