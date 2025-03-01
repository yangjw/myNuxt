<template>
  <div class="error-layout">
    <header>
      <NuxtLink to="/" class="home-link">返回首页</NuxtLink>
    </header>

    <main class="error-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.error-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.error-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  margin: 20px;
  color: var(--primary-color);
  text-decoration: none;
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.home-link:hover {
  background-color: var(--primary-color);
  color: white;
}
</style>
