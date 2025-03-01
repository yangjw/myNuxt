<template>
  <NuxtLayout name="error">
    <div class="server-error">
      <h1>500</h1>
      <p>服务器内部错误</p>
      <div class="error-details">
        <p>我们正在努力修复这个问题</p>
        <button @click="refreshPage">刷新页面</button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "error",
  title: "服务器错误",
  description: "抱歉，服务器出现错误",
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    { property: "og:title", content: "500 - 服务器错误" },
  ],
});

const refreshPage = () => {
  window.location.reload();
};
</script>

<style scoped>
.server-error {
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

.error-details {
  margin-top: 40px;
}

button {
  padding: 10px 20px;
  font-size: 1.1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

button:hover {
  opacity: 0.8;
}
</style>
