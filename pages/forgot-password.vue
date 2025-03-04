<template>
  <div class="forgot-password-container">
    <div class="forgot-password-box">
      <h1>找回密码</h1>

      <form class="forgot-password-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">邮箱地址</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="请输入您的注册邮箱"
          />
        </div>

        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? "发送中..." : "发送重置链接" }}
        </button>

        <div class="form-footer">
          <NuxtLink to="/login" class="back-link">返回登录</NuxtLink>
        </div>
      </form>

      <!-- 成功提示 -->
      <div v-if="showSuccess" class="success-message">
        <p>重置链接已发送到您的邮箱</p>
        <p class="small">请检查您的邮箱并按照提示重置密码</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref("");
const isSubmitting = ref(false);
const showSuccess = ref(false);

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    // 调用重置密码 API
    await $fetch("/api/auth/forgot-password", {
      method: "POST",
      body: { email: email.value },
    });

    // 显示成功消息
    showSuccess.value = true;
    email.value = "";
  } catch (error: any) {
    console.error("发送失败:", error);
    alert(error.message || "发送失败，请稍后重试");
  } finally {
    isSubmitting.value = false;
  }
};

// SEO 配置
useHead({
  title: "找回密码 - 我的网站",
  meta: [
    {
      name: "description",
      content: "通过邮箱找回您的账号密码",
    },
  ],
});
</script>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f5f5f5;
}

.forgot-password-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: var(--primary-color);
}

.forgot-password-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: var(--primary-color);
  outline: none;
}

.submit-btn {
  background-color: var(--primary-color);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.3s;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  opacity: 0.9;
}

.form-footer {
  text-align: center;
  margin-top: 10px;
}

.back-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link:hover {
  text-decoration: underline;
}

.success-message {
  text-align: center;
  margin-top: 20px;
  padding: 20px;
  background-color: #e8f5e9;
  border-radius: 4px;
  color: #2e7d32;
}

.success-message .small {
  font-size: 0.9rem;
  margin-top: 8px;
  opacity: 0.8;
}

@media (max-width: 480px) {
  .forgot-password-box {
    padding: 20px;
  }
}
</style>
