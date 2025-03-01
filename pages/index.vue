<script setup lang="ts">
// 定义基本的页面元数据
definePageMeta({
  layout: "default",
});

// 使用 SEO composable
const { seoMeta, seoTitle, seoDescription, loadSEO } = useSEO();
const route = useRoute();

// 获取文章列表
const { data: articles } = await useFetch<Article[]>("/api/articles");

// 日期格式化函数
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("zh-CN");
};

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

<template>
  <div class="home-container">
    <h1>欢迎来到我们的网站</h1>

    <div class="articles">
      <article
        v-for="article in articles"
        :key="article.id"
        class="article-card"
      >
        <img
          v-if="article.image"
          :src="article.image"
          :alt="article.title"
          class="article-image"
        />
        <div class="article-content">
          <h2>{{ article.title }}</h2>
          <p class="article-meta">
            <span>作者: {{ article.author }}</span>
            <span>发布于: {{ formatDate(article.date) }}</span>
          </p>
          <p class="article-description">{{ article.description }}</p>
          <div class="article-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{
              tag
            }}</span>
          </div>
          <NuxtLink :to="`/articles/${article.id}`" class="read-more">
            阅读更多
          </NuxtLink>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.articles {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.article-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.article-content {
  padding: 20px;
}

.article-meta {
  color: #666;
  font-size: 0.9rem;
  margin: 10px 0;
  display: flex;
  gap: 20px;
}

.article-description {
  margin: 15px 0;
  line-height: 1.6;
}

.article-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 15px 0;
}

.tag {
  background: var(--primary-color);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.read-more {
  display: inline-block;
  color: var(--primary-color);
  text-decoration: none;
  margin-top: 15px;
  font-weight: bold;
}

.read-more:hover {
  text-decoration: underline;
}
</style>
