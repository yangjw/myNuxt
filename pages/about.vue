<template>
  <div class="about-container">
    <h1>关于我们</h1>
    <div class="content">
      <p>这是一个使用 Nuxt 3 构建的现代化网站。</p>
      <p>我们致力于提供最好的用户体验。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义基本的页面元数据
definePageMeta({
  layout: "custom",
  middleware: ["auth"],
  pageTransition: {
    name: "slide-fade",
  },
});

// 使用 SEO composable
const { seoMeta, seoTitle, seoDescription, loadSEO } = useSEO();
const route = useRoute();

// 在组件挂载时加载 SEO 配置
onMounted(async () => {
  await loadSEO(route.path);
});

// 使用 useHead 来动态设置页面头部
useHead(() => ({
  title: seoTitle.value,
  meta: [
    {
      name: "description",
      content: seoDescription.value,
    },
    ...seoMeta.value,
  ],
}));
</script>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content {
  margin-top: 20px;
  line-height: 1.6;
}

/* 页面过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
