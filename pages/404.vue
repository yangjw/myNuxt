<template>
  <div class="not-found">
    <h1>404</h1>
    <p>抱歉，页面不存在</p>
    <div class="suggestions">
      <p>您可以：</p>
      <ul>
        <li>检查网址是否正确</li>
        <li>返回<NuxtLink to="/">首页</NuxtLink></li>
        <li>联系<NuxtLink to="/about">客服支持</NuxtLink></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO 配置
useHead({
  title: "404 - 页面未找到",
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    { name: "description", content: "抱歉，您访问的页面不存在" },
  ],
});
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 40px 20px;
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: 8rem;
  margin: 0;
  color: var(--primary-color);
  line-height: 1;
  opacity: 0.8;
}

p {
  font-size: 1.5rem;
  color: #666;
  margin: 20px 0;
}

.suggestions {
  margin-top: 40px;
  text-align: left;
  max-width: 400px;
  margin: 40px auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 15px 0;
  color: #666;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  margin: 0 5px;
  transition: opacity 0.3s;
}

a:hover {
  opacity: 0.8;
}
</style>
