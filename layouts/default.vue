<template>
  <div>
    <header>
      <nav class="nav-container">
        <NuxtLink to="/" class="nav-link">首页</NuxtLink>
        <NuxtLink to="/about" class="nav-link">关于我们</NuxtLink>
        <NuxtLink to="/contact" class="nav-link">联系我们</NuxtLink>
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

<script setup lang="ts"></script>

<style scoped>
header {
  padding: 1rem;
  background-color: #f5f5f5;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
}

.nav-link {
  color: var(--primary-color);
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: var(--primary-color);
  color: white;
}

main {
  min-height: 80vh;
}

footer {
  padding: 1rem;
  text-align: center;
  background-color: #f5f5f5;
}
</style>
