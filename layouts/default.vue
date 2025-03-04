<template>
  <div>
    <header>
      <nav class="nav-container">
        <!-- 左侧导航链接 -->
        <div class="nav-left">
          <NuxtLink to="/" class="nav-link">首页</NuxtLink>
          <NuxtLink to="/about" class="nav-link">关于我们</NuxtLink>
          <NuxtLink to="/contact" class="nav-link">联系我们</NuxtLink>
        </div>

        <!-- 右侧功能区 -->
        <div class="nav-right">
          <NuxtLink to="/login" class="nav-link login-btn">登录</NuxtLink>
          <div class="app-download">
            <button class="nav-link app-btn">
              APP下载
              <span class="app-icon">📱</span>
            </button>
            <!-- 二维码浮层 -->
            <div class="qr-popup">
              <img
                :src="qrImage"
                alt="APP下载二维码"
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

    <main>
      <slot />
    </main>

    <footer>
      <p>© 2024 我的 Nuxt 应用</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import fallbackQR from "~/assets/images/qr-fallback.png";

definePageMeta({
  layout: "default",
});

const qrImage = ref(
  "https://pics4.baidu.com/feed/0b7b02087bf40ad1af32143b02550dd0abecce99.jpeg@f_auto?token=dcaa025ece8ec0990c6665d93326d780"
);

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = fallbackQR;
};
</script>

<style scoped>
header {
  padding: 1rem;
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
.app-download {
  position: relative;
}

.app-btn {
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

/* 二维码浮层样式 */
.qr-popup {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 200px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.app-download:hover .qr-popup {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.qr-code {
  width: 160px;
  height: 160px;
  object-fit: contain;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.qr-text {
  margin-top: 10px;
  color: #666;
  font-size: 0.9rem;
}

main {
  min-height: 80vh;
}

footer {
  padding: 1rem;
  text-align: center;
  background-color: #f5f5f5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 15px;
  }

  .nav-left,
  .nav-right {
    width: 100%;
    justify-content: center;
  }

  .qr-popup {
    right: 50%;
    transform: translateX(50%);
  }

  .qr-popup::before {
    right: 50%;
    transform: translateX(50%) rotate(45deg);
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
</style>
