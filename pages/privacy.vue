<template>
  <div class="privacy-container">
    <div class="privacy-content">
      <h1>隐私政策</h1>

      <section class="privacy-section">
        <h2>1. 信息收集</h2>
        <p>我们收集的信息包括：</p>
        <ul>
          <li>您提供的个人信息（如姓名、邮箱、电话等）</li>
          <li>自动收集的信息（如 IP 地址、浏览器类型等）</li>
          <li>Cookie 和类似技术收集的信息</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>2. 信息使用</h2>
        <p>我们使用收集的信息用于：</p>
        <ul>
          <li>提供和改进我们的服务</li>
          <li>个性化您的使用体验</li>
          <li>发送服务通知和更新</li>
          <li>处理您的请求和反馈</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>3. 信息保护</h2>
        <p>
          我们采取适当的技术和组织措施来保护您的个人信息，防止未经授权的访问、使用或泄露。
        </p>
      </section>

      <section class="privacy-section">
        <h2>4. 信息共享</h2>
        <p>我们不会出售您的个人信息。我们仅在以下情况下共享您的信息：</p>
        <ul>
          <li>获得您的明确同意</li>
          <li>遵守法律要求</li>
          <li>保护我们的权利和财产</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>5. Cookie 政策</h2>
        <p>
          我们使用 Cookie 来改善您的浏览体验。您可以通过浏览器设置控制 Cookie
          的使用。
        </p>
      </section>

      <div class="privacy-footer">
        <p>最后更新时间：2024年1月1日</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "隐私政策 - 我的网站",
  meta: [
    {
      name: "description",
      content: "了解我们如何收集、使用和保护您的个人信息",
    },
  ],
});
</script>

<style scoped>
.privacy-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.privacy-content {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  color: var(--primary-color);
  margin-bottom: 40px;
  text-align: center;
}

.privacy-section {
  margin-bottom: 30px;
}

h2 {
  color: var(--secondary-color);
  margin-bottom: 15px;
  font-size: 1.4rem;
}

p {
  line-height: 1.6;
  color: #333;
  margin-bottom: 15px;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
  margin-bottom: 15px;
}

li {
  margin-bottom: 10px;
  line-height: 1.6;
  color: #333;
}

.privacy-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .privacy-content {
    padding: 20px;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1.2rem;
  }
}
</style>
