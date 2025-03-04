# 短视频社交应用

一个基于 Nuxt 3 开发的现代化短视频社交平台。

## 功能特点

- 📱 响应式设计，完美适配移动端和桌面端
- 🎥 支持视频播放和图文展示
- 🔍 实时搜索和筛选功能
- 🔄 无限滚动加载
- 👤 用户认证系统
- 🌈 现代化 UI 设计
- 🚀 优化的性能和加载体验

## 技术栈

- **前端框架**: Nuxt 3
- **UI 框架**: 自定义组件
- **状态管理**: Vue Composition API
- **样式方案**: SCSS + CSS Variables
- **构建工具**: Vite
- **TypeScript**: 是 ✅

## 主要依赖

### 核心框架

```json
{
  "nuxt": "^3.9.0",
  "vue": "^3.4.0",
  "typescript": "^5.3.0"
}
```

### UI 组件

```json
{
  "@nuxtjs/tailwindcss": "^6.10.0",
  "@headlessui/vue": "^1.7.0",
  "@heroicons/vue": "^2.1.0",
  "sass": "^1.69.0",
  "sass-loader": "^13.3.0"
}
```

### 工具库

```json
{
  "lodash-es": "^4.17.21",
  "dayjs": "^1.11.10",
  "axios": "^1.6.0",
  "pinia": "^2.1.0",
  "@vueuse/core": "^10.7.0"
}
```

### 开发工具

```json
{
  "eslint": "^8.56.0",
  "prettier": "^3.1.0",
  "husky": "^8.0.3",
  "lint-staged": "^15.2.0",
  "commitlint": "^18.4.0"
}
```

## 项目结构

```
├── assets/            # 静态资源
│   ├── images/       # 图片资源
│   └── styles/       # 全局样式
├── plugins/          # 插件配置
│   ├── axios.ts      # Axios 配置
│   └── pinia.ts      # Pinia 配置
├── components/       # 通用组件
│   ├── VideoModal.vue    # 视频播放弹窗
│   ├── LoginModal.vue    # 登录注册弹窗
│   └── InfiniteLoader.vue # 无限滚动加载器
├── composables/      # 组合式函数
│   ├── usePost.ts    # 帖子相关逻辑
│   └── useDebounce.ts # 防抖函数
├── stores/           # Pinia 状态管理
│   ├── user.ts       # 用户状态
│   └── app.ts        # 应用状态
├── layouts/          # 布局组件
│   └── default.vue   # 默认布局
├── pages/           # 页面组件
│   ├── index.vue    # 首页
│   └── live/[id].vue # 直播间页面
├── utils/           # 工具函数
│   ├── format.ts    # 格式化工具
│   └── validate.ts  # 验证工具
└── types/           # TypeScript 类型定义
```

## 核心功能

### 1. 视频播放系统

- 支持视频全屏播放
- 自动播放控制
- 视频信息展示
- 弹幕互动功能

### 2. 社交互动

- 点赞功能
- 评论系统
- 分享功能
- 关注机制

### 3. 内容发现

- 分类浏览
- 智能推荐
- 实时搜索
- 标签系统

### 4. 用户系统

- 账号注册/登录
- 个人主页
- 内容管理
- 消息通知

## 开发指南

### 环境要求

- Node.js 16+
- npm 或 yarn
- Git

### 快速开始

```bash
# 克隆项目
git clone [repository-url]

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 性能优化

1. **加载优化**

   - 图片懒加载
   - 组件按需加载
   - 资源预加载

2. **渲染优化**

   - 虚拟滚动
   - 防抖节流
   - 组件缓存

3. **用户体验**
   - 骨架屏加载
   - 平滑过渡动画
   - 响应式设计

## 代码规范

- 使用 ESLint 进行代码检查
- 遵循 Vue 3 组合式 API 最佳实践
- TypeScript 类型检查
- Git Commit 规范

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 开发团队

- 前端开发: [开发者名字]
- UI 设计: [设计师名字]
- 产品经理: [产品经理名字]

## 版本历史

- v1.0.0 (2024-01-20)
  - 初始版本发布
  - 实现基础功能

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系我们

- 邮箱: support@example.com
- 微信: example_wechat
- QQ 群: 123456789

## 致谢

感谢以下开源项目：

- [Nuxt.js](https://nuxt.com/)
- [Vue.js](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.com/)
- [Heroicons](https://heroicons.com/)
- [Pinia](https://pinia.vuejs.org/)
- [VueUse](https://vueuse.org/)
- [Day.js](https://day.js.org/)
- [Axios](https://axios-http.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## 开发规范

### Git 提交规范

```bash
feat:     新功能
fix:      修复
docs:     文档变更
style:    代码格式
refactor: 重构
perf:     性能优化
test:     增加测试
chore:    构建过程或辅助工具的变动
```

### 代码风格

项目使用 ESLint + Prettier 进行代码规范和格式化：

```bash
# 运行 ESLint 检查
npm run lint

# 运行 Prettier 格式化
npm run format
```
