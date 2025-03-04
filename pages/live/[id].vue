<script setup lang="ts">
const route = useRoute();
const liveId = route.params.id;

// 直播间数据
const liveData = reactive({
  id: liveId,
  title: "直播标题",
  streamer: {
    name: "主播昵称",
    avatar: "https://i.pravatar.cc/100",
    followers: 12345,
  },
  viewers: 2345,
  likes: 5678,
  status: "live", // live, ended, upcoming
  cover: "https://picsum.photos/800/450",
  description: "直播间简介...",
});

// SEO 配置
const { seoMeta, seoTitle, seoDescription } = useSEO();

// 在组件挂载前获取 SEO 数据
const { data: seoConfig } = await useFetch<SEOConfig>("/api/seo", {
  query: { path: route.path },
  server: true, // 在服务端获取数据
});

// 设置页面元数据
useHead(() => ({
  title: seoTitle.value || `${liveData.title} - 直播间`,
  meta: [
    {
      name: "description",
      content: seoDescription.value || liveData.description,
    },
    ...seoMeta.value,
  ],
}));

// 获取直播数据
const fetchLiveData = async () => {
  try {
    const { data } = await useFetch(`/api/live/${liveId}`);
    if (data.value) {
      Object.assign(liveData, data.value);
    }
  } catch (error) {
    console.error("获取直播数据失败:", error);
  }
};

// 在客户端获取实时数据
onMounted(() => {
  fetchLiveData();
});

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "w";
  }
  return num.toString();
};
</script>

<template>
  <div class="live-container">
    <!-- 直播画面区域 -->
    <div class="live-player-section">
      <div class="live-player">
        <img :src="liveData.cover" alt="直播封面" class="live-cover" />
        <div class="live-status" :class="liveData.status">
          {{ liveData.status === "live" ? "直播中" : "未开播" }}
        </div>
      </div>
    </div>

    <!-- 直播信息区域 -->
    <div class="live-info-section">
      <div class="live-header">
        <h1 class="live-title">{{ liveData.title }}</h1>
        <div class="live-stats">
          <span class="viewers">
            {{ formatNumber(liveData.viewers) }} 观看
          </span>
          <span class="likes"> {{ formatNumber(liveData.likes) }} 点赞 </span>
        </div>
      </div>

      <!-- 主播信息 -->
      <div class="streamer-info">
        <img
          :src="liveData.streamer.avatar"
          :alt="liveData.streamer.name"
          class="streamer-avatar"
        />
        <div class="streamer-details">
          <div class="streamer-name">{{ liveData.streamer.name }}</div>
          <div class="follower-count">
            {{ formatNumber(liveData.streamer.followers) }} 粉丝
          </div>
        </div>
        <button class="follow-btn">关注</button>
      </div>

      <!-- 直播简介 -->
      <div class="live-description">
        {{ liveData.description }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.live-player-section {
  margin-bottom: 24px;
}

.live-player {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 比例 */
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}

.live-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.live-status {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
}

.live-status.live {
  background: rgba(255, 36, 66, 0.9);
}

.live-info-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.live-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.live-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  margin-right: 20px;
}

.live-stats {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
}

.streamer-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.streamer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.streamer-details {
  flex: 1;
}

.streamer-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.follower-count {
  font-size: 14px;
  color: #666;
}

.follow-btn {
  padding: 8px 24px;
  border-radius: 20px;
  background: var(--primary-color, #ff2442);
  color: white;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.follow-btn:hover {
  opacity: 0.9;
}

.live-description {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

@media (max-width: 768px) {
  .live-container {
    padding: 10px;
  }

  .live-info-section {
    padding: 16px;
  }

  .live-title {
    font-size: 20px;
  }

  .live-header {
    flex-direction: column;
    gap: 12px;
  }

  .live-stats {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
