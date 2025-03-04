<template>
  <div class="login-container">
    <div class="login-box">
      <h1>登录</h1>

      <form class="login-form" @submit.prevent="handleLogin">
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

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="form.rememberMe" />
            记住我
          </label>
          <NuxtLink to="/forgot-password" class="forgot-password">
            忘记密码？
          </NuxtLink>
        </div>

        <button type="submit" class="login-btn" :disabled="isSubmitting">
          {{ isSubmitting ? "登录中..." : "登录" }}
        </button>

        <div class="register-link">
          还没有账号？
          <NuxtLink to="/register">立即注册</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();

// 表单数据
const form = ref({
  username: "",
  password: "",
  rememberMe: false,
});

// 密码显示控制
const showPassword = ref(false);

// 提交状态
const isSubmitting = ref(false);

// 检查是否刚刚注册成功
onMounted(() => {
  if (route.query.registered) {
    alert("注册成功，请登录！");
  }
});

// 表单提交处理
const handleLogin = async () => {
  try {
    isSubmitting.value = true;

    // 调用登录 API
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        username: form.value.username,
        password: form.value.password,
      },
    });

    // 登录成功后跳转
    await router.push("/");
  } catch (error: any) {
    console.error("登录失败:", error);
    alert(error.message || "登录失败，请检查用户名和密码");
  } finally {
    isSubmitting.value = false;
  }
};

// SEO 配置
useHead({
  title: "登录 - 我的网站",
  meta: [
    {
      name: "description",
      content: "登录您的账号，享受更多服务",
    },
  ],
});
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f5f5f5;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-box h1 {
  text-align: center;
  margin-bottom: 30px;
  color: var(--primary-color);
}

.login-form {
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  background-color: var(--primary-color);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.3s;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-btn:not(:disabled):hover {
  opacity: 0.9;
}

.register-link {
  text-align: center;
  font-size: 0.9rem;
}

.register-link a {
  color: var(--primary-color);
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-box {
    padding: 20px;
  }
}
</style>
