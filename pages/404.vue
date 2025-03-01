<template>
  <NuxtLayout name="error">
    <div class="not-found">
      <h1>404</h1>
      <p>抱歉，页面不存在</p>
      <div class="suggestions">
        <p>您可以：</p>
        <ul>
          <li>检查网址是否正确</li>
          <li>返回<NuxtLink to="/">首页</NuxtLink></li>
          <li>查看<NuxtLink to="/sitemap">网站地图</NuxtLink></li>
        </ul>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "error",
  title: "页面未找到",
  description: "抱歉，您访问的页面不存在",
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    { property: "og:title", content: "404 - 页面未找到" },
  ],
});
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 8rem;
  margin: 0;
  color: var(--primary-color);
}

p {
  font-size: 1.5rem;
  color: var(--secondary-color);
  margin: 20px 0;
}

.suggestions {
  margin-top: 40px;
  text-align: left;
  max-width: 400px;
  margin: 40px auto;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  margin: 0 5px;
}

a:hover {
  text-decoration: underline;
}
</style>
