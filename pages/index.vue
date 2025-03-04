<script setup lang="ts">
// 定义基本的页面元数据
definePageMeta({
  layout: "default",
});

// 使用 SEO composable
const { seoMeta, seoTitle, seoDescription, loadSEO } = useSEO();
const route = useRoute();

// 导入所需的组件和函数
import { usePost } from "~/composables/usePost";
import { useDebouncedFn } from "~/composables/useDebounce";

// 分类数据
const categories = ref([
  { id: "recommend", name: "推荐" },
  { id: "fashion", name: "穿搭" },
  { id: "food", name: "美食" },
  { id: "makeup", name: "彩妆" },
  { id: "movie", name: "影视" },
  { id: "career", name: "职场" },
  { id: "emotion", name: "情感" },
  { id: "home", name: "家居" },
  { id: "game", name: "游戏" },
  { id: "travel", name: "旅行" },
  { id: "fitness", name: "健身" },
]);

// 当前选中的分类
const currentCategory = ref("recommend");

// 分页相关状态
const loading = ref(false);
const page = ref(1);
const hasMore = ref(true);
const pageSize = 15; // 每页显示15条数据
const loadingRef = ref(null); // 用于观察加载更多元素

// 监听滚动以添加阴影效果
const categoryNav = ref(null);
const isScrolled = ref(false);

onMounted(() => {
  // 分类导航阴影效果观察器
  const navObserver = new IntersectionObserver(
    ([entry]) => {
      isScrolled.value = !entry.isIntersecting;
    },
    {
      threshold: 1,
      rootMargin: `-${window.innerWidth <= 768 ? 50 : 60}px 0px 0px 0px`,
    }
  );

  if (categoryNav.value) {
    navObserver.observe(categoryNav.value);
  }

  // 加载更多观察器
  const loadMoreObserver = new IntersectionObserver(
    ([entry]) => {
      if (
        entry.isIntersecting &&
        !loading.value &&
        hasMore.value &&
        !searchQuery.value
      ) {
        loadMore();
      }
    },
    {
      rootMargin: "100px", // 提前100px触发加载
    }
  );

  if (loadingRef.value) {
    loadMoreObserver.observe(loadingRef.value);
  }

  onUnmounted(() => {
    navObserver.disconnect();
    loadMoreObserver.disconnect();
  });
});

// 修改加载更多函数
const loadMore = async () => {
  if (loading.value || !hasMore.value) return;

  try {
    loading.value = true;
    const newPosts = await fetchMorePosts(
      page.value + 1,
      currentCategory.value,
      pageSize
    );

    if (newPosts.length < pageSize) {
      hasMore.value = false;
    }

    posts.value.push(...newPosts);
    page.value++;
  } catch (error) {
    console.error("加载失败:", error);
    hasMore.value = false;
  } finally {
    loading.value = false;
  }
};

// 重置分页状态
const resetPagination = () => {
  page.value = 1;
  hasMore.value = true;
  posts.value = [];
};

// 修改分类切换处理
watch(currentCategory, async () => {
  try {
    resetPagination();
    loading.value = true;
    const newPosts = await fetchMorePosts(1, currentCategory.value, pageSize);
    posts.value = newPosts;
    hasMore.value = newPosts.length === pageSize;
  } catch (error) {
    console.error("加载分类数据失败:", error);
    hasMore.value = false;
  } finally {
    loading.value = false;
  }
});

// 帖子数据
const posts = ref([]);
const { fetchMorePosts } = usePost();

// 日期格式化函数
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("zh-CN");
};

// 在组件挂载时加载 SEO 配置
onMounted(async () => {
  await loadSEO(route.path);
  try {
    const initialPosts = await fetchMorePosts(1);
    posts.value = initialPosts;
  } catch (error) {
    console.error("初始化加载失败:", error);
  }
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

// 搜索相关
const searchQuery = ref("");
const isSearching = ref(false);
const searchResults = ref([]);

// 搜索处理函数
const handleSearch = useDebouncedFn(async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  try {
    isSearching.value = true;
    // 模拟搜索请求
    const results = await mockSearchPosts(searchQuery.value);
    searchResults.value = results;
  } catch (error) {
    console.error("搜索失败:", error);
  } finally {
    isSearching.value = false;
  }
}, 300);

// 模拟搜索请求
const mockSearchPosts = async (query: string) => {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  // 模拟搜索结果
  return Array.from({ length: 5 }, (_, i) => ({
    id: `search-${i}`,
    title: `搜索"${query}"的结果 ${i + 1}`,
    description: `这是一个包含"${query}"的搜索结果示例`,
    image: `https://picsum.photos/400/600?random=${i}`,
    author: {
      name: `用户${i}`,
      avatar: `https://i.pravatar.cc/100?u=search${i}`,
    },
    likes: Math.floor(Math.random() * 1000),
    type: ["image", "video", "live"][Math.floor(Math.random() * 3)],
    date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  }));
};

// 清除搜索
const clearSearch = () => {
  searchQuery.value = "";
  searchResults.value = [];
};

// 筛选相关
const showFilter = ref(false);
const sortBy = ref("latest");
const selectedTypes = ref([]);
const contentTypes = [
  { label: "图文", value: "image" },
  { label: "视频", value: "video" },
  { label: "直播", value: "live" },
];

// 筛选方法
const resetFilters = () => {
  sortBy.value = "latest";
  selectedTypes.value = [];
};

const applyFilters = () => {
  showFilter.value = false;
  // 实现筛选逻辑
};

// 计算属性：过滤后的帖子列表
const filteredPosts = computed(() => {
  let result = [...posts.value];

  // 搜索过滤
  if (searchQuery.value) {
    result = result.filter(post =>
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // 类型过滤
  if (selectedTypes.value.length) {
    result = result.filter(post => selectedTypes.value.includes(post.type));
  }

  // 排序
  if (sortBy.value === "popular") {
    result.sort((a, b) => b.likes - a.likes);
  } else {
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return result;
});

// 处理分类点击
const handleCategoryClick = (categoryId: string) => {
  if (searchQuery.value) {
    clearSearch();
  }
  currentCategory.value = categoryId;
};
</script>

<template>
  <div class="explore-container">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-input">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索你感兴趣的内容"
          @input="handleSearch"
        />
        <button v-if="searchQuery" class="clear-btn" @click="clearSearch">
          ×
        </button>
        <button class="search-btn">
          <span v-if="isSearching" class="searching-icon">⌛</span>
          <span v-else class="search-icon">🔍</span>
        </button>
      </div>

      <!-- 筛选按钮 -->
      <button class="filter-btn" @click="showFilter = true">
        筛选 <span class="filter-icon">⚡</span>
      </button>
    </div>

    <!-- 分类导航 -->
    <nav
      ref="categoryNav"
      class="category-nav"
      :class="{
        'hide-nav': searchQuery,
        scrolled: isScrolled,
      }"
    >
      <div class="nav-scroll">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="['category-btn', { active: currentCategory === category.id }]"
          @click="handleCategoryClick(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
    </nav>

    <!-- 搜索结果 -->
    <div v-if="searchQuery" class="content-section">
      <div v-if="isSearching" class="loading-state">
        <div class="loading-spinner"></div>
        <span>搜索中...</span>
      </div>

      <div v-else-if="searchResults.length > 0" class="search-results">
        <div class="section-header">
          <h2>搜索结果</h2>
          <button class="clear-search text-btn" @click="clearSearch">
            清除搜索
          </button>
        </div>
        <div class="results-grid">
          <div
            v-for="result in searchResults"
            :key="result.id"
            class="result-card"
          >
            <a
              :href="`/posts/${result.id}`"
              target="_blank"
              rel="noopener noreferrer"
              class="card-link"
            >
              <div class="result-image">
                <img :src="result.image" :alt="result.title" loading="lazy" />
              </div>
              <div class="result-content">
                <h3 class="result-title">{{ result.title }}</h3>
                <p class="result-description">{{ result.description }}</p>
                <div class="result-meta">
                  <div class="result-author">
                    <img
                      :src="result.author.avatar"
                      :alt="result.author.name"
                      class="author-avatar"
                    />
                    <span class="author-name">{{ result.author.name }}</span>
                  </div>
                  <span class="result-likes">{{ result.likes }}赞</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div v-else class="no-results">
        <p>未找到与"{{ searchQuery }}"相关的内容</p>
        <button class="clear-search" @click="clearSearch">清除搜索</button>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div v-else class="content-section">
      <div
        class="content-grid"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
      >
        <div v-for="post in filteredPosts" :key="post.id" class="post-card">
          <a
            :href="`/posts/${post.id}`"
            target="_blank"
            rel="noopener noreferrer"
            class="card-link"
          >
            <div class="post-image">
              <img :src="post.image" :alt="post.title" loading="lazy" />
            </div>
            <div class="post-content">
              <h3 class="post-title">{{ post.title }}</h3>
              <div class="post-author">
                <img
                  :src="post.author.avatar"
                  :alt="post.author.name"
                  class="author-avatar"
                />
                <span class="author-name">{{ post.author.name }}</span>
                <span class="post-likes">{{ post.likes }}赞</span>
              </div>
            </div>
          </a>
        </div>

        <!-- 加载状态 -->
        <div
          v-if="!searchQuery"
          ref="loadingRef"
          class="load-more"
          :class="{ 'no-more': !hasMore }"
        >
          <template v-if="loading">
            <div class="loading-spinner"></div>
            <span>加载中...</span>
          </template>
          <template v-else-if="hasMore">
            <span>向下滚动加载更多</span>
          </template>
          <template v-else>
            <span>没有更多内容了</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.explore-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.category-nav {
  position: sticky;
  top: var(--header-height, 60px);
  background: white;
  padding: 10px 0;
  margin-bottom: 20px;
  z-index: 90;
  border-bottom: 1px solid #eee;
  transition: transform 0.3s, opacity 0.3s;
}

.category-nav::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  height: 10px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05), transparent);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.category-nav.scrolled::after {
  opacity: 1;
}

.nav-scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 0 20px 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.nav-scroll::before,
.nav-scroll::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 10px;
  width: 20px;
  pointer-events: none;
}

.nav-scroll::before {
  left: 0;
  background: linear-gradient(to right, white, transparent);
}

.nav-scroll::after {
  right: 0;
  background: linear-gradient(to left, white, transparent);
}

.category-btn {
  padding: 8px 16px;
  border: none;
  background: none;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
  position: relative;
}

.category-btn.active {
  color: var(--primary-color);
  font-weight: bold;
}

.category-btn.active::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 3px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(180px, 1fr));
  gap: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.post-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.post-card:hover {
  transform: translateY(-4px);
}

.post-image {
  position: relative;
  padding-top: 133.33%;
  overflow: hidden;
}

.post-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  padding: 12px;
}

.post-title {
  font-size: 0.95rem;
  margin: 0 0 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.9rem;
  color: #666;
  flex: 1;
}

.post-likes {
  font-size: 0.9rem;
  color: #999;
}

@media (max-width: 1400px) {
  .content-grid {
    grid-template-columns: repeat(4, minmax(180px, 1fr));
  }
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: repeat(3, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 12px;
  }

  .post-content {
    padding: 8px;
  }

  .post-title {
    font-size: 0.9rem;
  }

  .category-nav {
    top: var(--header-height-mobile, 50px);
    padding: 8px 0;
  }

  .nav-scroll {
    padding: 0 12px 8px;
  }

  .category-btn {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

/* 搜索栏样式 */
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  position: relative;
}

.search-input input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input input:focus {
  border-color: var(--primary-color);
  outline: none;
}

.search-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.filter-btn {
  padding: 0 20px;
  border: 1px solid #ddd;
  border-radius: 24px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* 筛选弹窗样式 */
.filter-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.filter-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  position: relative;
}

.filter-section {
  margin: 20px 0;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.filter-actions button {
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
}

.apply-btn {
  background: var(--primary-color);
  color: white;
  border: none;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

/* 加载更多样式 */
.load-more {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-height: 100px; /* 确保有足够的高度被观察 */
}

.load-more.no-more {
  color: #999;
  padding: 40px 20px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 搜索相关样式 */
.clear-btn {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 18px;
  color: #999;
}

.searching-icon {
  animation: rotate 1s linear infinite;
}

.search-results {
  margin-top: 20px;
  animation: fadeIn 0.3s ease-out;
}

.search-results h2 {
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: #333;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.result-card {
  display: flex;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.result-image {
  width: 120px;
  height: 120px;
}

.result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-content {
  flex: 1;
  padding: 12px;
}

.result-title {
  margin: 0 0 8px;
  font-size: 1rem;
  line-height: 1.4;
}

.result-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.result-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
}

.clear-search {
  margin-top: 12px;
  padding: 8px 16px;
  border: 1px solid var(--primary-color);
  border-radius: 20px;
  background: none;
  color: var(--primary-color);
  cursor: pointer;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
}

/* 优化导航和内容区样式 */
.content-section {
  min-height: 200px;
  position: relative;
}

.loading-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #666;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.text-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.text-btn:hover {
  background-color: rgba(var(--primary-color-rgb), 0.1);
}

/* 优化搜索结果样式 */
.search-results {
  animation: fadeIn 0.3s ease-out;
}

.result-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片链接样式 */
.card-link {
  display: block;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.post-card .card-link {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.result-card .card-link {
  display: flex;
  width: 100%;
}

/* 卡片悬浮效果 */
.post-card:hover,
.result-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.post-card:hover .post-title,
.result-card:hover .result-title {
  color: var(--primary-color);
}

/* 图片悬浮效果 */
.post-image,
.result-image {
  overflow: hidden;
}

.post-image img,
.result-image img {
  transition: transform 0.3s ease-out;
}

.post-card:hover .post-image img,
.result-card:hover .result-image img {
  transform: scale(1.05);
}

/* 标题悬浮效果 */
.post-title,
.result-title {
  transition: color 0.3s;
}
</style>
