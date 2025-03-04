<script setup lang="ts">
// 页面元数据定义必须在最顶部
definePageMeta({
  layout: "default",
});
// 使用 SEO composable
const { seoMeta, seoTitle, seoDescription, loadSEO } = useSEO();
const route = useRoute();

// 导入所需的组件和函数
import { usePost } from "~/composables/usePost";
import { useDebouncedFn } from "~/composables/useDebounce";
import InfiniteLoader from "~/components/InfiniteLoader.vue";
import VideoModal from "~/components/VideoModal.vue";

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

// 监听分类变化并重新加载数据
watch(currentCategory, async newCategory => {
  try {
    // 重置页码和数据
    page.value = 1;
    loading.value = true;
    posts.value = [];

    // 加载新分类的数据
    const newPosts = await fetchMorePosts(1, newCategory);
    posts.value = newPosts;
    hasMore.value = true;
  } catch (error) {
    console.error("加载分类数据失败:", error);
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

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "w";
  }
  return num.toString();
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

// 状态管理
const loading = ref(false);
const page = ref(1);
const hasMore = ref(true);
const error = ref(false);
const loadingMore = ref(false);
const isLoadingLocked = ref(false);

// 预加载阈值
const PRELOAD_THRESHOLD = 0.5;

// 节流时间
const THROTTLE_DELAY = 200;

// 加载延迟时间
const LOADING_DELAY = 800;

// 修改 loadMore 函数
const loadMore = async () => {
  if (
    loading.value ||
    loadingMore.value ||
    !hasMore.value ||
    isLoadingLocked.value
  )
    return;

  try {
    isLoadingLocked.value = true;
    loadingMore.value = true;
    error.value = false;

    const startTime = Date.now();
    const newPosts = await fetchMorePosts(
      page.value + 1,
      currentCategory.value
    );

    // 计算剩余延迟时间
    const elapsed = Date.now() - startTime;
    if (elapsed < LOADING_DELAY) {
      await new Promise(resolve =>
        setTimeout(resolve, LOADING_DELAY - elapsed)
      );
    }

    if (newPosts.length > 0) {
      posts.value.push(...newPosts);
      page.value++;
    } else {
      hasMore.value = false;
    }
  } catch (err) {
    console.error("加载失败:", err);
    error.value = true;
  } finally {
    loadingMore.value = false;
    setTimeout(() => {
      isLoadingLocked.value = false;
    }, THROTTLE_DELAY);
  }
};

// 使用 Intersection Observer 监听滚动
onMounted(() => {
  let timeoutId: NodeJS.Timeout;

  const observer = new IntersectionObserver(
    entries => {
      const entry = entries[0];
      if (
        entry.isIntersecting &&
        (entry.intersectionRatio > PRELOAD_THRESHOLD ||
          entry.boundingClientRect.top <= window.innerHeight)
      ) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          loadMore();
        }, THROTTLE_DELAY);
      }
    },
    {
      rootMargin: "1000px",
      threshold: PRELOAD_THRESHOLD,
    }
  );

  const observeLastPost = () => {
    const posts = document.querySelectorAll(".post-card");
    if (posts.length > 0) {
      const lastPosts = Array.from(posts).slice(-5);
      lastPosts.forEach(post => {
        observer.observe(post);
      });
    }
  };

  const postsContainer = document.querySelector(".posts-grid");
  if (postsContainer) {
    const mutationObserver = new MutationObserver(() => {
      observer.disconnect();
      observeLastPost();
    });
    mutationObserver.observe(postsContainer, { childList: true });
  }

  observeLastPost();

  onUnmounted(() => {
    clearTimeout(timeoutId);
    observer.disconnect();
  });
});

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

// 视频弹框状态
const showVideoModal = ref(false);
const currentVideo = ref(null);

// 处理帖子点击
const handlePostClick = (post, event) => {
  if (post.type === "live") {
    // 直播类型跳转到详情页
    window.open(`/live/${post.id}`, "_blank");
  } else if (post.type === "video") {
    // 视频类型显示弹窗
    currentVideo.value = post;
    showVideoModal.value = true;
  } else {
    // 图文类型跳转到详情页
    window.open(`/posts/${post.id}`, "_blank");
  }
};

// 图片加载完成后触发重排
const handleImageLoad = () => {
  // 使用 requestAnimationFrame 优化性能
  requestAnimationFrame(() => {
    const grid = document.querySelector(".masonry-grid");
    if (grid) {
      grid.style.opacity = "1";
    }
  });
};
</script>

<template>
  <div>
    <div class="home-container">
      <nav class="categories-nav">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="['category-btn', { active: currentCategory === category.id }]"
          @click="currentCategory = category.id"
        >
          {{ category.name }}
        </button>
      </nav>
      <!-- 搜索和筛选 -->
      <div class="search-filter-bar">
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="搜索..."
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
            ×
          </button>
        </div>

        <button class="filter-btn" @click="showFilter = true">
          筛选
          <span class="filter-count" v-if="selectedTypes.length">
            {{ selectedTypes.length }}
          </span>
        </button>
      </div>

      <!-- 搜索结果 -->
      <div v-if="searchQuery && !isSearching" class="search-results">
        <div class="content-grid">
          <NuxtLink
            v-for="result in searchResults"
            :key="result.id"
            :to="`/posts/${result.id}`"
            class="post-card"
            target="_blank"
          >
            <div class="post-image">
              <img :src="result.image" :alt="result.title" loading="lazy" />
              <div class="post-type-tag" :class="result.type">
                {{
                  result.type === "video"
                    ? "视频"
                    : result.type === "live"
                    ? "直播"
                    : "图文"
                }}
              </div>
            </div>
            <div class="post-content">
              <h3 class="post-title">{{ result.title }}</h3>
              <div class="post-meta">
                <div class="author-info">
                  <img
                    :src="result.author.avatar"
                    :alt="result.author.name"
                    class="author-avatar"
                  />
                  <span>{{ result.author.name }}</span>
                </div>
                <div class="post-stats">
                  <span>{{ formatNumber(result.likes) }}赞</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- 帖子列表 -->
      <div class="posts-grid">
        <div
          v-for="post in filteredPosts"
          :key="post.id"
          class="post-card clickable"
          @click="handlePostClick(post, $event)"
        >
          <!-- 添加视频标识 -->
          <div v-if="post.type === 'video'" class="video-badge">
            <i class="video-icon">▶</i>
          </div>
          <div class="post-image">
            <img :src="post.image" :alt="post.title" loading="lazy" />
            <div class="post-type-tag" :class="post.type">
              {{
                post.type === "video"
                  ? "视频"
                  : post.type === "live"
                  ? "直播"
                  : "图文"
              }}
            </div>
          </div>
          <!-- 帖子内容 -->
          <div class="post-content">
            <h3 class="post-title">{{ post.title }}</h3>
            <div class="post-info">
              <div class="author-info">
                <img
                  :src="post.author.avatar"
                  :alt="post.author.name"
                  class="author-avatar"
                />
                <span class="author-name">{{ post.author.name }}</span>
              </div>
              <div class="post-stats">
                <span>{{ formatNumber(post.likes) }} 赞</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 无更多内容提示 -->
      <div v-if="!hasMore && !loading" class="no-more">没有更多内容了</div>

      <!-- 筛选弹窗 -->
      <div v-if="showFilter" class="filter-modal">
        <div class="filter-content">
          <h3>筛选</h3>

          <div class="filter-section">
            <h4>排序方式</h4>
            <div class="sort-options">
              <label>
                <input
                  type="radio"
                  v-model="sortBy"
                  value="latest"
                  name="sort"
                />
                最新
              </label>
              <label>
                <input
                  type="radio"
                  v-model="sortBy"
                  value="popular"
                  name="sort"
                />
                最热
              </label>
            </div>
          </div>

          <div class="filter-section">
            <h4>内容类型</h4>
            <div class="type-options">
              <label v-for="type in contentTypes" :key="type.value">
                <input
                  type="checkbox"
                  v-model="selectedTypes"
                  :value="type.value"
                />
                {{ type.label }}
              </label>
            </div>
          </div>

          <div class="filter-actions">
            <button class="reset-btn" @click="resetFilters">重置</button>
            <button class="apply-btn" @click="applyFilters">确定</button>
          </div>

          <button class="close-btn" @click="showFilter = false">×</button>
        </div>
      </div>

      <!-- 无限加载组件 -->
      <InfiniteLoader
        :loading="loading"
        :loading-more="loadingMore"
        :no-more="!hasMore"
        :error="error"
        @retry="loadMore"
      />

      <!-- 视频播放弹框 -->
      <VideoModal
        v-if="currentVideo"
        :is-open="showVideoModal"
        :title="currentVideo.title"
        :video-url="currentVideo.videoUrl"
        :author="currentVideo.author"
        :views="currentVideo.views"
        :likes="currentVideo.likes"
        :content="currentVideo.content"
        :date="currentVideo.date"
        :tags="currentVideo.tags"
        @close="showVideoModal = false"
      />
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1800px;
  margin: 0 auto;
  padding: 20px;
}

.categories-nav {
  position: sticky;
  top: 0;
  background: white;
  padding: 10px 0;
  margin-bottom: 20px;
  z-index: 100;
  border-bottom: 1px solid #eee;
  transition: opacity 0.3s, transform 0.3s;
}

.categories-nav.hide-nav {
  opacity: 0.5;
  pointer-events: none;
}

.nav-scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 0 20px 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.nav-scroll::-webkit-scrollbar {
  display: none;
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
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  padding: 20px;
  max-width: 1800px;
  margin: 0 auto;
}

.post-card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.post-image {
  position: relative;
  width: 100%;
  flex: 1;
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
  background: #fff;
}

.post-title {
  font-size: 14px;
  color: #333;
  margin: 0 0 8px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 12px;
  color: #666;
}

.post-likes {
  font-size: 0.9rem;
  color: #999;
}

@media (max-width: 1800px) {
  .content-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1400px) {
  .content-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 640px) {
  .content-grid {
    grid-template-columns: 1fr;
    padding: 12px;
  }
}

/* 搜索栏样式 */
.search-filter-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding: 0 20px;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-box input:focus {
  border-color: var(--primary-color);
  outline: none;
}

.filter-btn {
  padding: 0 20px;
  border: 1px solid #ddd;
  border-radius: 24px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-count {
  background: var(--primary-color);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.8rem;
}

/* 内容类型标签样式 */
.post-type-tag {
  position: absolute;
  left: 8px;
  top: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1;
}

.post-type-tag.video {
  background: rgba(255, 36, 66, 0.8);
}

.post-type-tag.live {
  background: rgba(64, 158, 255, 0.8);
}

.post-type-tag.image {
  background: rgba(103, 194, 58, 0.8);
}

/* 作者信息样式 */
.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.post-stats {
  font-size: 12px;
  color: #999;
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

/* 加载更多相关样式 */
.load-more-trigger {
  width: 100%;
  height: 20px;
  margin: 20px 0;
}

.loading-more {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 20px;
  color: #666;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.no-more {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 0.9rem;
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

/* 视频帖子样式 */
.post-card {
  position: relative;
}

.video-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.video-icon {
  font-size: 14px;
}

.clickable {
  cursor: pointer;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  padding: 20px;
  margin: 0 auto;
  max-width: 1800px;
}

.post-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
  aspect-ratio: 3/4;
}

.post-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

/* 响应式布局 */
@media (max-width: 1600px) {
  .posts-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 1200px) {
  .posts-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .posts-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .posts-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
