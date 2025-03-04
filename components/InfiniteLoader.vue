<template>
  <div class="infinite-loader">
    <!-- 加载中状态 -->
    <div v-if="loading" class="loading-state">
      <svg class="loading-icon" viewBox="0 0 24 24">
        <circle
          class="loading-circle"
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
      <span>加载中</span>
    </div>

    <!-- 没有更多数据状态 -->
    <div v-if="!loading && noMore" class="end-state">
      <div class="divider">
        <div class="end-content">
          <svg class="end-icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              stroke="currentColor"
              stroke-width="1.5"
            />
          </svg>
          <span>没有更多内容了</span>
        </div>
      </div>
    </div>

    <!-- 加载失败状态 -->
    <div v-if="!loading && error && !noMore" class="error-state">
      <span class="error-message">加载失败，请稍后再试</span>
      <button @click="$emit('retry')" class="retry-btn">重试</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  noMore: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["retry"]);
</script>

<style scoped>
.infinite-loader {
  padding: 16px;
  text-align: center;
}

/* 加载中状态 */
.loading-state {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #999;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.loading-icon {
  width: 16px;
  height: 16px;
  animation: rotate 1s linear infinite;
}

.loading-circle {
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  animation: dash 1.2s ease-in-out infinite;
}

/* 结束状态 */
.end-state {
  padding: 16px 0;
  margin: 0 auto;
  max-width: 360px;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #999;
  font-size: 12px;
  position: relative;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  max-width: 100px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(153, 153, 153, 0.2) 50%,
    transparent
  );
}

.end-content {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  white-space: nowrap;
  font-size: 13px;
  color: #999;
  border: 1px solid rgba(153, 153, 153, 0.2);
}

.end-icon {
  width: 14px;
  height: 14px;
  color: #999;
  opacity: 0.8;
  animation: twinkle 1.5s ease-in-out infinite;
}

.divider span {
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
}

.error-message {
  color: #ff6b6b;
  font-size: 14px;
}

.retry-btn {
  padding: 6px 16px;
  border: 1px solid var(--primary-color, #ff2442);
  border-radius: 16px;
  background: transparent;
  color: var(--primary-color, #ff2442);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: var(--primary-color, #ff2442);
  color: white;
}

/* 动画 */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 60;
  }
  50% {
    stroke-dashoffset: 30;
  }
  100% {
    stroke-dashoffset: 60;
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}
</style>
