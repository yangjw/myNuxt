<template>
  <div class="custom-layout">
    <header class="custom-header">
      <nav class="nav-container">
        <NuxtLink to="/" class="nav-link">首页</NuxtLink>
        <NuxtLink to="/about" class="nav-link">关于我们</NuxtLink>
        <NuxtLink to="/contact" class="nav-link">联系我们</NuxtLink>
      </nav>
    </header>

    <main class="custom-main">
      <slot />
    </main>

    <footer class="custom-footer">
      <p>这是自定义布局的页脚</p>
    </footer>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.custom-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.custom-header {
  background-color: var(--secondary-color);
  padding: 1rem;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.custom-main {
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
}

.custom-footer {
  background-color: var(--secondary-color);
  color: white;
  padding: 1rem;
  text-align: center;
}
</style>
