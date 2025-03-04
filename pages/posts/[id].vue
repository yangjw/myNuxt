<script setup lang="ts">
const route = useRoute();
const router = useRouter();

// 帖子数据
const post = ref<any>(null);
const loading = ref(true);
const error = ref(null);

// 评论系统
const comments = ref([]);
const commentText = ref("");
const isSubmitting = ref(false);
const replyTo = ref<any>(null);
const replyText = ref("");

// 相关推荐
const recommendations = ref([]);

// 图片预览
const showPreview = ref(false);
const currentImage = ref("");
const currentImageIndex = ref(0);

// 模拟获取帖子详情
const fetchPostDetail = async (id: string) => {
  // 模拟 API 请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));

  // 模拟帖子数据
  return {
    id,
    title: `这是帖子 ${id} 的详细内容`,
    content: `这是一段详细的描述文字，描述了帖子 ${id} 的具体内容。包含了很多有趣的细节和信息。`,
    images: [
      `https://picsum.photos/800/600?random=${id}-1`,
      `https://picsum.photos/800/600?random=${id}-2`,
      `https://picsum.photos/800/600?random=${id}-3`,
    ],
    author: {
      id: `user-${id}`,
      name: `作者${id}`,
      avatar: `https://i.pravatar.cc/100?u=${id}`,
      followers: Math.floor(Math.random() * 10000),
    },
    stats: {
      likes: Math.floor(Math.random() * 10000),
      comments: Math.floor(Math.random() * 1000),
      shares: Math.floor(Math.random() * 500),
    },
    tags: ["生活方式", "探索", "分享"],
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  };
};

// 模拟加载评论
const loadComments = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  comments.value = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    author: {
      name: `评论用户${i}`,
      avatar: `https://i.pravatar.cc/40?u=comment${i}`,
    },
    content: `这是第 ${i + 1} 条评论，分享了一些想法和观点。`,
    likes: Math.floor(Math.random() * 100),
    isLiked: false,
    replies: Array.from({ length: Math.floor(Math.random() * 3) }, (_, j) => ({
      id: `${i}-${j}`,
      author: {
        name: `回复用户${j}`,
        avatar: `https://i.pravatar.cc/40?u=reply${i}${j}`,
      },
      content: `回复 @评论用户${i}：这是第 ${j + 1} 条回复。`,
      createdAt: new Date(
        Date.now() - Math.random() * 1000000000
      ).toISOString(),
    })),
    createdAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
  }));
};

// 处理回复
const handleReply = (comment: any) => {
  replyTo.value = comment;
  replyText.value = "";
};

// 提交回复
const submitReply = async () => {
  if (!replyText.value.trim() || !replyTo.value) return;

  try {
    isSubmitting.value = true;
    // 模拟提交回复
    await new Promise(resolve => setTimeout(resolve, 500));

    const newReply = {
      id: `${replyTo.value.id}-${replyTo.value.replies.length}`,
      author: {
        name: "当前用户",
        avatar: "https://i.pravatar.cc/40?u=current",
      },
      content: `回复 @${replyTo.value.author.name}：${replyText.value}`,
      createdAt: new Date().toISOString(),
    };

    replyTo.value.replies.push(newReply);
    replyText.value = "";
    replyTo.value = null;
  } finally {
    isSubmitting.value = false;
  }
};

// 取消回复
const cancelReply = () => {
  replyTo.value = null;
  replyText.value = "";
};

// 点赞评论
const toggleLike = (comment: any) => {
  comment.isLiked = !comment.isLiked;
  comment.likes += comment.isLiked ? 1 : -1;
};

// 提交评论
const submitComment = async () => {
  if (!commentText.value.trim()) return;

  try {
    isSubmitting.value = true;
    // 模拟提交评论
    await new Promise(resolve => setTimeout(resolve, 500));

    comments.value.unshift({
      id: comments.value.length,
      author: {
        name: "当前用户",
        avatar: "https://i.pravatar.cc/40?u=current",
      },
      content: commentText.value,
      likes: 0,
      isLiked: false,
      replies: [],
      createdAt: new Date().toISOString(),
    });

    commentText.value = "";
  } finally {
    isSubmitting.value = false;
  }
};

// 模拟加载推荐
const loadRecommendations = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  recommendations.value = Array.from({ length: 4 }, (_, i) => ({
    id: `rec-${i}`,
    title: `推荐帖子 ${i + 1}`,
    image: `https://picsum.photos/400/300?random=rec${i}`,
    author: {
      name: `推荐作者${i}`,
      avatar: `https://i.pravatar.cc/40?u=rec${i}`,
    },
    likes: Math.floor(Math.random() * 1000),
  }));
};

const previewImage = (index: number) => {
  currentImageIndex.value = index;
  currentImage.value = post.value.images[index];
  showPreview.value = true;
};

const closePreview = () => {
  showPreview.value = false;
};

const nextImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value + 1) % post.value.images.length;
  currentImage.value = post.value.images[currentImageIndex.value];
};

const prevImage = () => {
  currentImageIndex.value =
    currentImageIndex.value - 1 < 0
      ? post.value.images.length - 1
      : currentImageIndex.value - 1;
  currentImage.value = post.value.images[currentImageIndex.value];
};

// 分享功能
const showShare = ref(false);
const shareOptions = [
  { icon: "📱", name: "微信", action: () => handleShare("weixin") },
  { icon: "💬", name: "微博", action: () => handleShare("weibo") },
  { icon: "✉️", name: "复制链接", action: () => handleShare("copy") },
];

const handleShare = async (type: string) => {
  switch (type) {
    case "copy":
      await navigator.clipboard.writeText(window.location.href);
      alert("链接已复制");
      break;
    case "weixin":
    case "weibo":
      window.open(
        `https://service.weibo.com/share/share.php?url=${encodeURIComponent(
          window.location.href
        )}&title=${encodeURIComponent(post.value.title)}`
      );
      break;
  }
  showShare.value = false;
};

// 在组件挂载时加载数据
onMounted(async () => {
  try {
    post.value = await fetchPostDetail(route.params.id as string);
    await Promise.all([loadComments(), loadRecommendations()]);
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "w";
  }
  return num.toString();
};

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// SEO 配置
useHead(() => ({
  title: post.value ? `${post.value.title} - 我的小红书` : "加载中...",
  meta: [
    {
      name: "description",
      content: post.value?.content || "",
    },
  ],
}));
</script>

<template>
  <div class="post-detail">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="router.back()" class="back-btn">返回上一页</button>
    </div>

    <!-- 帖子内容 -->
    <div v-else-if="post" class="post-content">
      <!-- 作者信息 -->
      <div class="author-section">
        <div class="author-info">
          <img
            :src="post.author.avatar"
            :alt="post.author.name"
            class="author-avatar"
          />
          <div class="author-details">
            <h3 class="author-name">{{ post.author.name }}</h3>
            <p class="author-followers">
              {{ formatNumber(post.author.followers) }}粉丝
            </p>
          </div>
        </div>
        <button class="follow-btn">关注</button>
      </div>

      <!-- 帖子标题 -->
      <h1 class="post-title">{{ post.title }}</h1>

      <!-- 图片轮播 -->
      <div class="image-gallery">
        <img
          v-for="(image, index) in post.images"
          :key="index"
          :src="image"
          :alt="`图片 ${index + 1}`"
          loading="lazy"
        />
      </div>

      <!-- 帖子正文 -->
      <div class="post-text">
        {{ post.content }}
      </div>

      <!-- 标签 -->
      <div class="post-tags">
        <span v-for="tag in post.tags" :key="tag" class="tag">
          # {{ tag }}
        </span>
      </div>

      <!-- 互动数据 -->
      <div class="interaction-stats">
        <div class="stat-item">
          <span class="stat-icon">❤️</span>
          <span class="stat-number">{{ formatNumber(post.stats.likes) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">💬</span>
          <span class="stat-number">{{
            formatNumber(post.stats.comments)
          }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🔄</span>
          <span class="stat-number">{{ formatNumber(post.stats.shares) }}</span>
        </div>
      </div>

      <!-- 发布时间 -->
      <div class="post-meta">
        <time :datetime="post.createdAt">{{ formatDate(post.createdAt) }}</time>
      </div>

      <!-- 分享按钮 -->
      <div class="share-section">
        <button class="share-btn" @click="showShare = true">分享 📤</button>
      </div>

      <!-- 分享弹窗 -->
      <div v-if="showShare" class="share-modal" @click="showShare = false">
        <div class="share-content" @click.stop>
          <h3>分享到</h3>
          <div class="share-options">
            <button
              v-for="option in shareOptions"
              :key="option.name"
              class="share-option"
              @click="option.action"
            >
              <span class="share-icon">{{ option.icon }}</span>
              <span>{{ option.name }}</span>
            </button>
          </div>
          <button class="close-btn" @click="showShare = false">×</button>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="comments-section">
        <h2>评论 {{ comments.length }}</h2>

        <!-- 评论输入框 -->
        <div class="comment-form">
          <textarea
            v-model="commentText"
            placeholder="写下你的评论..."
            :disabled="isSubmitting"
          ></textarea>
          <button
            class="submit-btn"
            @click="submitComment"
            :disabled="!commentText.trim() || isSubmitting"
          >
            {{ isSubmitting ? "发送中..." : "发送" }}
          </button>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="comment-item"
          >
            <img
              :src="comment.author.avatar"
              :alt="comment.author.name"
              class="comment-avatar"
            />
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">{{ comment.author.name }}</span>
                <span class="comment-time">
                  {{ formatDate(comment.createdAt) }}
                </span>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
              <div class="comment-actions">
                <button
                  class="like-btn"
                  :class="{ liked: comment.isLiked }"
                  @click="toggleLike(comment)"
                >
                  {{ comment.isLiked ? "❤️" : "🤍" }} {{ comment.likes }}
                </button>
                <button class="reply-btn" @click="handleReply(comment)">
                  回复
                </button>
              </div>

              <!-- 回复列表 -->
              <div v-if="comment.replies?.length" class="replies-list">
                <div
                  v-for="reply in comment.replies"
                  :key="reply.id"
                  class="reply-item"
                >
                  <img
                    :src="reply.author.avatar"
                    :alt="reply.author.name"
                    class="reply-avatar"
                  />
                  <div class="reply-content">
                    <div class="reply-header">
                      <span class="reply-author">{{ reply.author.name }}</span>
                      <span class="reply-time">
                        {{ formatDate(reply.createdAt) }}
                      </span>
                    </div>
                    <p class="reply-text">{{ reply.content }}</p>
                  </div>
                </div>
              </div>

              <!-- 回复输入框 -->
              <div v-if="replyTo?.id === comment.id" class="reply-form">
                <textarea
                  v-model="replyText"
                  :placeholder="`回复 @${comment.author.name}`"
                  :disabled="isSubmitting"
                ></textarea>
                <div class="reply-form-actions">
                  <button class="cancel-btn" @click="cancelReply">取消</button>
                  <button
                    class="submit-btn"
                    @click="submitReply"
                    :disabled="!replyText.trim() || isSubmitting"
                  >
                    {{ isSubmitting ? "发送中..." : "发送" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 相关推荐 -->
      <div class="recommendations-section">
        <h2>相关推荐</h2>
        <div class="recommendations-grid">
          <NuxtLink
            v-for="rec in recommendations"
            :key="rec.id"
            :to="`/posts/${rec.id}`"
            class="recommendation-card"
            target="_blank"
          >
            <img
              :src="rec.image"
              :alt="rec.title"
              class="rec-image"
              loading="lazy"
            />
            <div class="rec-content">
              <h3 class="rec-title">{{ rec.title }}</h3>
              <div class="rec-meta">
                <div class="rec-author">
                  <img
                    :src="rec.author.avatar"
                    :alt="rec.author.name"
                    class="rec-avatar"
                  />
                  <span>{{ rec.author.name }}</span>
                </div>
                <span class="rec-likes">{{ formatNumber(rec.likes) }}赞</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <!-- 图片预览模态框 -->
  <div v-if="showPreview" class="image-preview" @click="closePreview">
    <div class="preview-content" @click.stop>
      <img :src="currentImage" :alt="post.title" />
      <button class="prev-btn" @click="prevImage">←</button>
      <button class="next-btn" @click="nextImage">→</button>
      <button class="close-preview" @click="closePreview">×</button>
    </div>
  </div>
</template>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

.back-btn {
  margin-top: 20px;
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.author-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.author-followers {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: #666;
}

.follow-btn {
  padding: 8px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.follow-btn:hover {
  opacity: 0.9;
}

.post-title {
  font-size: 1.8rem;
  margin: 0 0 24px;
  line-height: 1.4;
}

.image-gallery {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.image-gallery img {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.post-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 24px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.tag {
  color: var(--primary-color);
  font-size: 0.9rem;
  cursor: pointer;
}

.interaction-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding: 16px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-icon {
  font-size: 1.2rem;
}

.stat-number {
  color: #666;
}

.post-meta {
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

@media (max-width: 768px) {
  .post-detail {
    padding: 16px;
  }

  .post-title {
    font-size: 1.5rem;
  }

  .image-gallery {
    gap: 12px;
  }
}

/* 分享相关样式 */
.share-modal {
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

.share-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  position: relative;
}

.share-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 20px;
}

.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: none;
  background: none;
  cursor: pointer;
}

.share-icon {
  font-size: 24px;
}

/* 评论相关样式 */
.comments-section {
  margin-top: 40px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.comment-form {
  margin: 20px 0;
}

.comment-form textarea {
  width: 100%;
  height: 100px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  margin-bottom: 12px;
}

.submit-btn {
  float: right;
  padding: 8px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.comment-item {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 500;
}

.comment-time {
  color: #999;
  font-size: 0.9rem;
}

.comment-actions {
  margin-top: 8px;
}

.comment-actions button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  margin-right: 16px;
}

/* 推荐相关样式 */
.recommendations-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.recommendations-section h2 {
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: #333;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.recommendation-card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.rec-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recommendation-card:hover .rec-image {
  transform: scale(1.05);
}

.rec-content {
  padding: 12px;
}

.rec-title {
  margin: 0 0 12px;
  font-size: 1rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.rec-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
}

.rec-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rec-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.rec-likes {
  color: #999;
}

@media (max-width: 768px) {
  .recommendations-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .rec-image {
    height: 120px;
  }

  .rec-content {
    padding: 8px;
  }

  .rec-title {
    font-size: 0.9rem;
    margin-bottom: 8px;
  }

  .rec-meta {
    font-size: 0.8rem;
  }
}

/* 图片预览相关样式 */
.image-preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.preview-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.preview-content img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}

.prev-btn,
.next-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 16px;
  cursor: pointer;
  font-size: 24px;
}

.prev-btn {
  left: 16px;
}

.next-btn {
  right: 16px;
}

.close-preview {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
}

/* 评论点赞样式 */
.like-btn {
  transition: all 0.3s;
}

.like-btn.liked {
  color: var(--primary-color);
}

/* 回复相关样式 */
.replies-list {
  margin-top: 12px;
  padding-left: 56px;
}

.reply-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.reply-content {
  flex: 1;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.reply-author {
  font-weight: 500;
  font-size: 0.9rem;
}

.reply-time {
  color: #999;
  font-size: 0.8rem;
}

.reply-text {
  font-size: 0.95rem;
  margin: 0;
  color: #333;
}

.reply-form {
  margin-top: 12px;
  padding-left: 56px;
}

.reply-form textarea {
  width: 100%;
  height: 80px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.reply-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 8px 16px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 20px;
  color: #666;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #f5f5f5;
}

@media (max-width: 768px) {
  .replies-list {
    padding-left: 40px;
  }

  .reply-form {
    padding-left: 40px;
  }
}
</style>
