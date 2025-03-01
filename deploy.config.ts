export default {
  // PM2 配置
  apps: [
    {
      name: 'nuxt-app',
      exec_mode: 'cluster',
      instances: 'max',
      script: '.output/server/index.mjs',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      }
    }
  ]
} 