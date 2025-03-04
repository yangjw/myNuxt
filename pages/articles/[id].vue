<template>
  <div class="page-container">
    <!-- 左侧文章列表 -->
    <aside class="article-list">
      <h3>所有文章</h3>
      <div class="article-links">
        <NuxtLink
          v-for="item in articles"
          :key="item.id"
          :to="`/articles/${item.id}`"
          class="article-link"
          :class="{ active: item.id === currentId }"
        >
          <div class="article-link-content">
            <h4>{{ item.title }}</h4>
            <p class="article-link-meta">
              <span>{{ formatDate(item.date) }}</span>
              <span>{{ item.author }}</span>
            </p>
          </div>
        </NuxtLink>
      </div>
    </aside>

    <!-- 右侧文章详情 -->
    <main class="article-container" v-if="article">
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
          <span v-for="tag in article.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>

        <div class="article-body">
          {{ article.content }}
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// SEO 配置
definePageMeta({
  layout: "default",
});
const route = useRoute();
const currentId = parseInt(route.params.id as string);

// 获取所有文章列表
const { data: articles } = await useFetch<Article[]>("/api/articles");

// 获取当前文章详情
const { data: article } = await useFetch<Article>(`/api/articles/${currentId}`);

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

const { seoMeta, seoTitle, seoDescription, loadSEO } = useSEO();

// 增强的 SEO 配置
useHead(() => ({
  title: article.value?.title || seoTitle.value,
  meta: [
    {
      name: "description",
      content: article.value?.description || seoDescription.value,
    },
    // 关键词
    {
      name: "keywords",
      content: article.value?.tags.join(",") || "",
    },
    // Open Graph 标签
    {
      property: "og:title",
      content: article.value?.title,
    },
    {
      property: "og:description",
      content: article.value?.description,
    },
    {
      property: "og:type",
      content: "article",
    },
    {
      property: "og:image",
      content: article.value?.image || "/images/default-article.jpg",
    },
    {
      property: "og:url",
      content: `${useRuntimeConfig().public.siteUrl}/articles/${currentId}`,
    },
    // Twitter 卡片
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: article.value?.title,
    },
    {
      name: "twitter:description",
      content: article.value?.description,
    },
    {
      name: "twitter:image",
      content: article.value?.image || "/images/default-article.jpg",
    },
    // 文章特定元数据
    {
      name: "article:published_time",
      content: article.value?.date,
    },
    {
      name: "article:author",
      content: article.value?.author,
    },
    {
      name: "article:section",
      content: article.value?.tags[0] || "技术",
    },
    {
      name: "article:tag",
      content: article.value?.tags.join(","),
    },
    // 其他 SEO 相关标签
    {
      name: "robots",
      content: "index, follow",
    },
    ...seoMeta.value,
  ],
  // 添加 JSON-LD 结构化数据
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.value?.title,
        description: article.value?.description,
        image: article.value?.image,
        datePublished: article.value?.date,
        author: {
          "@type": "Person",
          name: article.value?.author,
        },
        publisher: {
          "@type": "Organization",
          name: "我的网站",
          logo: {
            "@type": "ImageObject",
            url: "/images/logo.png",
          },
        },
      }),
    },
  ],
  // 添加规范链接
  link: [
    {
      rel: "canonical",
      href: `${useRuntimeConfig().public.siteUrl}/articles/${currentId}`,
    },
  ],
}));

// 监听路由变化，更新 SEO 配置
watch(
  () => route.params.id,
  async () => {
    await loadSEO(route.path);
  }
);
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
}

/* 左侧文章列表样式 */
.article-list {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.article-list h3 {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--primary-color);
}

.article-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.article-link {
  text-decoration: none;
  color: inherit;
  padding: 10px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.article-link:hover {
  background-color: #f5f5f5;
}

.article-link.active {
  background-color: var(--primary-color);
  color: white;
}

.article-link-content h4 {
  margin: 0;
  font-size: 1rem;
  line-height: 1.4;
}

.article-link-meta {
  margin-top: 5px;
  font-size: 0.8rem;
  color: #666;
  display: flex;
  gap: 10px;
}

.active .article-link-meta {
  color: rgba(255, 255, 255, 0.8);
}

/* 右侧文章详情样式 */
.article-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.article-hero {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.article-content {
  padding: 30px;
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
  flex-wrap: wrap;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .page-container {
    grid-template-columns: 1fr;
  }

  .article-list {
    order: 2;
  }

  .article-container {
    order: 1;
  }
}
</style>
