<template>
  <div class="register-container">
    <div class="register-box">
      <h1>注册账号</h1>

      <form class="register-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            required
            placeholder="请输入用户名"
          />
        </div>

        <div class="form-group">
          <label for="email">邮箱</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            placeholder="请输入邮箱"
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <div class="password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              required
              placeholder="请输入密码"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? "👁️" : "👁️‍🗨️" }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <div class="password-input">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="form.confirmPassword"
              required
              placeholder="请再次输入密码"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              {{ showConfirmPassword ? "👁️" : "👁️‍🗨️" }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.agreeTerms" required />
            我已阅读并同意
            <NuxtLink to="/terms" class="terms-link">服务条款</NuxtLink>
            和
            <NuxtLink to="/privacy" class="terms-link">隐私政策</NuxtLink>
          </label>
        </div>

        <button type="submit" class="register-btn" :disabled="isSubmitting">
          {{ isSubmitting ? "注册中..." : "注册" }}
        </button>

        <div class="login-link">
          已有账号？
          <NuxtLink to="/login">立即登录</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

// 表单数据
const form = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
});

// 密码显示控制
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 提交状态
const isSubmitting = ref(false);

// 表单提交处理
const handleRegister = async () => {
  try {
    // 表单验证
    if (form.value.password !== form.value.confirmPassword) {
      throw new Error("两次输入的密码不一致");
    }

    isSubmitting.value = true;

    // 调用注册 API
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        username: form.value.username,
        email: form.value.email,
        password: form.value.password,
      },
    });

    // 注册成功后跳转
    await router.push("/login?registered=true");
  } catch (error: any) {
    console.error("注册失败:", error);
    alert(error.message || "注册失败，请稍后重试");
  } finally {
    isSubmitting.value = false;
  }
};

// SEO 配置
useHead({
  title: "注册 - 我的网站",
  meta: [
    {
      name: "description",
      content: "注册成为我们的会员，享受更多服务",
    },
  ],
});
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f5f5f5;
}

.register-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-box h1 {
  text-align: center;
  margin-bottom: 30px;
  color: var(--primary-color);
}

.register-form {
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

.form-group input:not([type="checkbox"]) {
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

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 1.2rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.terms-link {
  color: var(--primary-color);
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.register-btn {
  background-color: var(--primary-color);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.3s;
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-btn:not(:disabled):hover {
  opacity: 0.9;
}

.login-link {
  text-align: center;
  font-size: 0.9rem;
}

.login-link a {
  color: var(--primary-color);
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-box {
    padding: 20px;
  }
}
</style>
