<template>
  <div v-if="isOpen" class="login-modal-overlay" @click="closeModal">
    <div class="login-modal" @click.stop>
      <!-- 主登录界面 -->
      <div v-if="currentView === 'login'" class="login-modal-content">
        <div class="login-modal-header">
          <h3>登录</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <div class="login-modal-body">
          <div class="login-tabs">
            <button
              :class="['tab-btn', activeTab === 'password' ? 'active' : '']"
              @click="activeTab = 'password'"
            >
              密码登录
            </button>
            <button
              :class="['tab-btn', activeTab === 'code' ? 'active' : '']"
              @click="activeTab = 'code'"
            >
              验证码登录
            </button>
          </div>

          <!-- 密码登录表单 -->
          <form
            v-if="activeTab === 'password'"
            class="login-form"
            @submit.prevent="handleLogin"
          >
            <div class="form-group">
              <label for="username">用户名/手机号</label>
              <input
                id="username"
                v-model="loginForm.username"
                type="text"
                placeholder="请输入用户名或手机号"
                required
              />
            </div>

            <div class="form-group">
              <label for="password">密码</label>
              <input
                id="password"
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                required
              />
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="loginForm.remember" />
                <span>记住我</span>
              </label>
              <button
                type="button"
                class="text-btn forgot-password"
                @click="showForgotPassword"
              >
                忘记密码?
              </button>
            </div>

            <button
              type="submit"
              class="login-submit-btn"
              :disabled="isLoading"
            >
              {{ isLoading ? "登录中..." : "登录" }}
            </button>
          </form>

          <!-- 验证码登录表单 -->
          <form v-else class="login-form" @submit.prevent="handleCodeLogin">
            <div class="form-group">
              <label for="phone">手机号</label>
              <input
                id="phone"
                v-model="codeForm.phone"
                type="tel"
                placeholder="请输入手机号"
                required
              />
            </div>

            <div class="form-group code-group">
              <label for="code">验证码</label>
              <div class="code-input-group">
                <input
                  id="code"
                  v-model="codeForm.code"
                  type="text"
                  placeholder="请输入验证码"
                  required
                />
                <button
                  type="button"
                  class="send-code-btn"
                  :disabled="countdown > 0 || !codeForm.phone"
                  @click="sendCode"
                >
                  {{ countdown > 0 ? `${countdown}秒后重发` : "获取验证码" }}
                </button>
              </div>
            </div>

            <button
              type="submit"
              class="login-submit-btn"
              :disabled="isLoading"
            >
              {{ isLoading ? "登录中..." : "登录" }}
            </button>
          </form>

          <div class="other-login-options">
            <p>其他登录方式</p>
            <div class="social-login">
              <button class="social-btn wechat">
                <i class="icon-wechat"></i>
              </button>
              <button class="social-btn weibo">
                <i class="icon-weibo"></i>
              </button>
              <button class="social-btn qq">
                <i class="icon-qq"></i>
              </button>
            </div>
          </div>

          <div class="register-link">
            还没有账号?
            <button
              type="button"
              class="text-btn register-btn"
              @click="showRegister"
            >
              立即注册
            </button>
          </div>
        </div>
      </div>

      <!-- 忘记密码界面 -->
      <div
        v-else-if="currentView === 'forgotPassword'"
        class="login-modal-content"
      >
        <div class="login-modal-header">
          <h3>找回密码</h3>
          <button class="close-btn" @click="backToLogin">←</button>
        </div>

        <div class="login-modal-body">
          <form class="login-form" @submit.prevent="handleResetPassword">
            <div class="form-group">
              <label for="resetPhone">手机号</label>
              <input
                id="resetPhone"
                v-model="resetForm.phone"
                type="tel"
                placeholder="请输入注册手机号"
                required
              />
            </div>

            <div class="form-group code-group">
              <label for="resetCode">验证码</label>
              <div class="code-input-group">
                <input
                  id="resetCode"
                  v-model="resetForm.code"
                  type="text"
                  placeholder="请输入验证码"
                  required
                />
                <button
                  type="button"
                  class="send-code-btn"
                  :disabled="resetCountdown > 0 || !resetForm.phone"
                  @click="sendResetCode"
                >
                  {{
                    resetCountdown > 0
                      ? `${resetCountdown}秒后重发`
                      : "获取验证码"
                  }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="newPassword">新密码</label>
              <input
                id="newPassword"
                v-model="resetForm.password"
                type="password"
                placeholder="请输入新密码"
                required
              />
            </div>

            <div class="form-group">
              <label for="confirmPassword">确认密码</label>
              <input
                id="confirmPassword"
                v-model="resetForm.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                required
              />
            </div>

            <button
              type="submit"
              class="login-submit-btn"
              :disabled="isLoading"
            >
              {{ isLoading ? "提交中..." : "重置密码" }}
            </button>
          </form>

          <div class="back-to-login">
            <button type="button" class="text-btn" @click="backToLogin">
              返回登录
            </button>
          </div>
        </div>
      </div>

      <!-- 注册界面 -->
      <div v-else-if="currentView === 'register'" class="login-modal-content">
        <div class="login-modal-header">
          <h3>注册账号</h3>
          <button class="close-btn" @click="backToLogin">←</button>
        </div>

        <div class="login-modal-body">
          <form class="login-form" @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="regPhone">手机号</label>
              <input
                id="regPhone"
                v-model="registerForm.phone"
                type="tel"
                placeholder="请输入手机号"
                required
              />
            </div>

            <div class="form-group code-group">
              <label for="regCode">验证码</label>
              <div class="code-input-group">
                <input
                  id="regCode"
                  v-model="registerForm.code"
                  type="text"
                  placeholder="请输入验证码"
                  required
                />
                <button
                  type="button"
                  class="send-code-btn"
                  :disabled="regCountdown > 0 || !registerForm.phone"
                  @click="sendRegisterCode"
                >
                  {{
                    regCountdown > 0 ? `${regCountdown}秒后重发` : "获取验证码"
                  }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="regPassword">设置密码</label>
              <input
                id="regPassword"
                v-model="registerForm.password"
                type="password"
                placeholder="请设置登录密码"
                required
              />
            </div>

            <div class="form-group">
              <label for="regConfirmPassword">确认密码</label>
              <input
                id="regConfirmPassword"
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                required
              />
            </div>

            <div class="form-group">
              <label class="agreement-check">
                <input
                  type="checkbox"
                  v-model="registerForm.agreement"
                  required
                />
                <span
                  >我已阅读并同意 <a href="#" @click.prevent>用户协议</a> 和
                  <a href="#" @click.prevent>隐私政策</a></span
                >
              </label>
            </div>

            <button
              type="submit"
              class="login-submit-btn"
              :disabled="isLoading || !registerForm.agreement"
            >
              {{ isLoading ? "注册中..." : "注册" }}
            </button>
          </form>

          <div class="back-to-login">
            <button type="button" class="text-btn" @click="backToLogin">
              已有账号? 返回登录
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "login-success", "register-success"]);

// 视图控制
const currentView = ref("login"); // login, forgotPassword, register
const activeTab = ref("password");
const isLoading = ref(false);
const countdown = ref(0);
const resetCountdown = ref(0);
const regCountdown = ref(0);

// 密码登录表单
const loginForm = reactive({
  username: "",
  password: "",
  remember: false,
});

// 验证码登录表单
const codeForm = reactive({
  phone: "",
  code: "",
});

// 重置密码表单
const resetForm = reactive({
  phone: "",
  code: "",
  password: "",
  confirmPassword: "",
});

// 注册表单
const registerForm = reactive({
  phone: "",
  code: "",
  password: "",
  confirmPassword: "",
  agreement: false,
});

// 关闭弹窗
const closeModal = () => {
  currentView.value = "login"; // 重置视图
  emit("close");
};

// 返回登录界面
const backToLogin = () => {
  currentView.value = "login";
};

// 显示忘记密码界面
const showForgotPassword = () => {
  currentView.value = "forgotPassword";
};

// 显示注册界面
const showRegister = () => {
  currentView.value = "register";
};

// 密码登录处理
const handleLogin = async () => {
  try {
    isLoading.value = true;
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 登录成功
    emit("login-success", { username: loginForm.username });
    closeModal();

    // 重置表单
    loginForm.username = "";
    loginForm.password = "";
  } catch (error) {
    console.error("登录失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// 验证码登录处理
const handleCodeLogin = async () => {
  try {
    isLoading.value = true;
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 登录成功
    emit("login-success", { phone: codeForm.phone });
    closeModal();

    // 重置表单
    codeForm.phone = "";
    codeForm.code = "";
  } catch (error) {
    console.error("登录失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// 发送验证码
const sendCode = async () => {
  if (!codeForm.phone) return;

  try {
    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 500));

    // 开始倒计时
    countdown.value = 60;
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  } catch (error) {
    console.error("发送验证码失败:", error);
  }
};

// 发送重置密码验证码
const sendResetCode = async () => {
  if (!resetForm.phone) return;

  try {
    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 500));

    // 开始倒计时
    resetCountdown.value = 60;
    const timer = setInterval(() => {
      resetCountdown.value--;
      if (resetCountdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  } catch (error) {
    console.error("发送验证码失败:", error);
  }
};

// 发送注册验证码
const sendRegisterCode = async () => {
  if (!registerForm.phone) return;

  try {
    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 500));

    // 开始倒计时
    regCountdown.value = 60;
    const timer = setInterval(() => {
      regCountdown.value--;
      if (regCountdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  } catch (error) {
    console.error("发送验证码失败:", error);
  }
};

// 处理重置密码
const handleResetPassword = async () => {
  // 验证两次密码是否一致
  if (resetForm.password !== resetForm.confirmPassword) {
    alert("两次输入的密码不一致");
    return;
  }

  try {
    isLoading.value = true;
    // 模拟重置密码请求
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 重置成功
    alert("密码重置成功，请使用新密码登录");

    // 清空表单并返回登录界面
    resetForm.phone = "";
    resetForm.code = "";
    resetForm.password = "";
    resetForm.confirmPassword = "";

    backToLogin();
  } catch (error) {
    console.error("重置密码失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// 处理注册
const handleRegister = async () => {
  // 验证两次密码是否一致
  if (registerForm.password !== registerForm.confirmPassword) {
    alert("两次输入的密码不一致");
    return;
  }

  try {
    isLoading.value = true;
    // 模拟注册请求
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 注册成功
    emit("register-success", { phone: registerForm.phone });

    // 清空表单
    registerForm.phone = "";
    registerForm.code = "";
    registerForm.password = "";
    registerForm.confirmPassword = "";
    registerForm.agreement = false;

    // 返回登录界面
    backToLogin();
  } catch (error) {
    console.error("注册失败:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.login-modal {
  width: 400px;
  max-width: 90%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideIn 0.3s ease;
}

.login-modal-content {
  width: 100%;
}

.login-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.login-modal-header h3 {
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
  padding: 0;
  line-height: 1;
}

.login-modal-body {
  padding: 20px;
}

/* 文本按钮样式 */
.text-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  text-decoration: none;
}

.text-btn:hover {
  text-decoration: underline;
}

/* 其他样式保持不变 */
.login-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  padding: 10px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  position: relative;
}

.tab-btn.active {
  color: var(--primary-color);
  font-weight: 500;
}

.tab-btn.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--primary-color);
}

.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #666;
}

.agreement-check {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.agreement-check input {
  margin-top: 3px;
}

.agreement-check a {
  color: var(--primary-color);
  text-decoration: none;
}

.agreement-check a:hover {
  text-decoration: underline;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: var(--primary-color);
  outline: none;
}

.code-group .code-input-group {
  display: flex;
  gap: 10px;
}

.code-input-group input {
  flex: 1;
}

.send-code-btn {
  white-space: nowrap;
  padding: 0 12px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.send-code-btn:not(:disabled):hover {
  background-color: #eee;
}

.send-code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #666;
}

.forgot-password {
  color: #666;
}

.login-submit-btn {
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.login-submit-btn:hover {
  opacity: 0.9;
}

.login-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-to-login {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}

/* 其他样式保持不变 */
.other-login-options {
  margin-top: 24px;
  text-align: center;
}

.other-login-options p {
  color: #999;
  font-size: 14px;
  margin-bottom: 12px;
  position: relative;
}

.other-login-options p::before,
.other-login-options p::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 60px;
  height: 1px;
  background-color: #eee;
}

.other-login-options p::before {
  left: 50px;
}

.other-login-options p::after {
  right: 50px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.social-btn:hover {
  transform: scale(1.1);
}

.wechat {
  background-color: #07c160;
  color: white;
}

.weibo {
  background-color: #e6162d;
  color: white;
}

.qq {
  background-color: #12b7f5;
  color: white;
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

/* 图标样式 */
.icon-wechat::before {
  content: "微";
}

.icon-weibo::before {
  content: "微";
}

.icon-qq::before {
  content: "Q";
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
