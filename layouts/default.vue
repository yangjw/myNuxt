<template>
  <div class="layout-container">
    <!-- 顶部固定导航 -->
    <div class="fixed-header">
      <header class="main-header">
        <nav class="nav-container">
          <!-- 左侧导航链接 -->
          <div class="nav-left">
            <NuxtLink to="/" class="nav-link">首页</NuxtLink>
            <NuxtLink to="/about" class="nav-link">关于我们</NuxtLink>
            <NuxtLink to="/contact" class="nav-link">联系我们</NuxtLink>
          </div>

          <!-- 右侧功能区 -->
          <div class="nav-right">
            <!-- 登录按钮 - 点击打开弹框 -->
            <button @click="showLoginModal = true" class="nav-link login-btn">
              登录
            </button>

            <!-- APP下载按钮和悬浮框 -->
            <div class="app-download-wrapper">
              <button
                class="app-download-btn"
                @mouseenter="showAppQR = true"
                @mouseleave="showAppQR = false"
              >
                APP下载
              </button>
              <div v-if="showAppQR" class="app-qr-popup">
                <img
                  :src="qrImage"
                  alt="APP二维码"
                  class="qr-code"
                  loading="lazy"
                  @error="handleImageError"
                />
                <p class="qr-text">扫码下载APP</p>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <!-- 分类导航 -->
      <nav class="category-nav">
        <slot name="category-nav" />
      </nav>
    </div>

    <!-- 主要内容 -->
    <main class="main-content">
      <slot />
    </main>

    <footer>
      <p>© 2024 我的 Nuxt 应用</p>
    </footer>

    <!-- 登录弹框 -->
    <LoginModal
      :is-open="showLoginModal"
      @close="showLoginModal = false"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import fallbackQR from "~/assets/images/qr-fallback.png";

const qrImage = ref(
  "https://pics4.baidu.com/feed/0b7b02087bf40ad1af32143b02550dd0abecce99.jpeg@f_auto?token=dcaa025ece8ec0990c6665d93326d780"
);

const showAppQR = ref(false);
const showLoginModal = ref(false);

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = fallbackQR;
};

// 处理登录成功
const handleLoginSuccess = userData => {
  // 这里可以处理登录成功后的逻辑，比如存储用户信息
  console.log("登录成功:", userData);
  // 可以使用 Pinia 或其他状态管理来存储用户状态
};
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-index-nav);
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.main-header {
  position: relative;
  z-index: 2;
  background: white;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.category-nav {
  position: relative;
  z-index: 1;
  background: white;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #eee;
}

.main-content {
  position: relative;
  z-index: 1;
  margin-top: 120px;
  flex: 1;
  padding: 20px;
}

.app-qr-popup {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1001;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
  margin-top: 10px;
  animation: fadeInUp 0.3s ease-out;
}

.qr-code {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.qr-text {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

footer {
  padding: 1rem;
  text-align: center;
  background-color: #f5f5f5;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-content {
    margin-top: 140px; /* 移动端可能需要更大的间距 */
  }

  .fixed-header {
    position: fixed;
  }
}

/* 添加加载动画 */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}

.qr-code:not([src]),
.qr-code[src=""] {
  animation: shimmer 1.2s infinite linear;
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200px 100%;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 左侧导航样式 */
.nav-left {
  display: flex;
  gap: 20px;
}

/* 右侧功能区样式 */
.nav-right {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-link {
  color: var(--primary-color);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: var(--primary-color);
  color: white;
}

/* 登录按钮样式 */
.login-btn {
  background-color: var(--primary-color);
  color: white;
}

.login-btn:hover {
  opacity: 0.9;
  background-color: var(--primary-color);
}

/* APP下载按钮样式 */
.app-download-wrapper {
  position: relative;
}

.app-download-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
}

.app-icon {
  font-size: 1.2rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
