<template>
  <Teleport to="body">
    <div v-if="isOpen" class="video-modal-overlay" @click="closeModal">
      <div class="video-modal video-article-layout" @click.stop>
        <div class="video-modal-header">
          <h3>{{ title }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <div class="modal-content">
          <!-- 左侧视频区域 -->
          <div class="video-section">
            <div class="video-modal-body">
              <video
                ref="videoPlayer"
                class="video-player"
                controls
                autoplay
                :src="videoUrl"
                @error="handleVideoError"
              >
                您的浏览器不支持视频播放
              </video>
            </div>

            <!-- 视频信息 -->
            <div class="video-info">
              <div class="author-info">
                <img
                  :src="author.avatar"
                  :alt="author.name"
                  class="author-avatar"
                />
                <span class="author-name">{{ author.name }}</span>
              </div>
              <div class="video-stats">
                <span class="views">{{ formatNumber(views) }} 播放</span>
                <span class="likes">{{ formatNumber(likes) }} 赞</span>
              </div>
            </div>
          </div>

          <!-- 右侧文章内容区域 -->
          <div class="article-section">
            <div class="article-content">
              <h2 class="article-title">{{ title }}</h2>
              <div class="article-meta">
                <time>{{ formatDate(date) }}</time>
                <div class="article-tags">
                  <span v-for="tag in tags" :key="tag" class="tag">
                    #{{ tag }}
                  </span>
                </div>
              </div>
              <div class="article-text">{{ content }}</div>

              <!-- 互动区域 -->
              <div class="interaction-section">
                <button class="action-btn like-btn">
                  <i class="icon">❤</i>
                  <span>{{ formatNumber(likes) }}</span>
                </button>
                <button class="action-btn share-btn">
                  <i class="icon">↗</i>
                  <span>分享</span>
                </button>
                <button class="action-btn collect-btn">
                  <i class="icon">⭐</i>
                  <span>收藏</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { PropType } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  author: {
    type: Object,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  tags: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const emit = defineEmits(["close"]);

const videoPlayer = ref<HTMLVideoElement | null>(null);

const closeModal = () => {
  if (videoPlayer.value) {
    videoPlayer.value.pause();
  }
  emit("close");
};

const handleVideoError = (e: Event) => {
  console.error("视频加载失败:", e);
};

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "w";
  }
  return num.toString();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// 在组件卸载时停止视频播放
onBeforeUnmount(() => {
  if (videoPlayer.value) {
    videoPlayer.value.pause();
  }
});
</script>

<style scoped>
.video-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}

.video-modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  animation: zoomIn 0.3s ease-out;
}

.video-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  position: relative;
}

.video-modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0 8px;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #666;
}

.video-modal-body {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 比例 */
  background: #000;
}

.video-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-info {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 14px;
  color: #333;
}

.video-stats {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.video-article-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  transform: translateZ(0);
  will-change: transform;
}

.modal-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  transform: translateZ(0);
}

.video-section {
  flex: 1;
  max-width: 60%;
  display: flex;
  flex-direction: column;
  background: #000;
  z-index: 2;
}

.article-section {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #fff;
  border-left: 1px solid #eee;
  z-index: 1;
}

.article-content {
  max-width: 680px;
  margin: 0 auto;
}

.article-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  color: #666;
  font-size: 14px;
}

.article-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  color: var(--primary-color);
  font-size: 13px;
}

.article-text {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 32px;
}

.interaction-section {
  display: flex;
  gap: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #eee;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #f5f5f5;
  border-color: #ddd;
}

.like-btn:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.video-modal-body {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  flex: 1;
}

.video-info {
  padding: 16px;
  background: #fff;
}

@media (max-width: 768px) {
  .video-modal {
    width: 100%;
    height: 100vh;
    border-radius: 0;
  }

  .modal-content {
    flex-direction: column;
  }

  .video-section {
    max-width: 100%;
  }

  .article-section {
    border-left: none;
    border-top: 1px solid #eee;
  }
}
</style>
