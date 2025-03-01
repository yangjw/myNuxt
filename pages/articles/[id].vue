<template>
  <div class="article-container" v-if="article">
    <img
      v-if="article.image"
      :src="article.image"
      :alt="article.title"
      class="article-hero"
    />

    <div class="article-content">
      <h1>{{ article.title }}</h1>

      <div class="article-meta">
        <span>作者: {{ article.author }}</span>
        <span>发布于: {{ formatDate(article.date) }}</span>
      </div>

      <div class="article-tags">
        <span v-for="tag in article.tags" :key="tag" class="tag">{{
          tag
        }}</span>
      </div>

      <div class="article-body">
        {{ article.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const id = parseInt(route.params.id as string);

// 获取文章详情
const { data: article } = await useFetch<Article>(`/api/articles/${id}`);

// 如果文章不存在，显示404页面
if (!article.value) {
  throw createError({
    statusCode: 404,
    message: "文章未找到",
  });
}

// 日期格式化函数
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("zh-CN");
};

// SEO 配置
definePageMeta({
  layout: "default",
});

const { seoMeta, seoTitle, seoDescription, loadSEO } = useSEO();

onMounted(async () => {
  await loadSEO(route.path);
});

useHead(() => ({
  title: article.value?.title || seoTitle.value,
  meta: [
    {
      name: "description",
      content: article.value?.description || seoDescription.value,
    },
    ...seoMeta.value,
  ],
}));
</script>

<style scoped>
.article-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.article-hero {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 30px;
}

.article-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.article-meta {
  color: #666;
  margin: 20px 0;
  display: flex;
  gap: 20px;
}

.article-tags {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.tag {
  background: var(--primary-color);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.article-body {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #333;
}
</style>
