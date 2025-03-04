<template>
  <div class="terms-container">
    <div class="terms-content">
      <h1>服务条款</h1>

      <section class="terms-section">
        <h2>1. 接受条款</h2>
        <p>
          欢迎使用我们的服务。通过访问和使用本网站，您同意遵守这些条款和条件。如果您不同意这些条款，请不要使用本网站。
        </p>
      </section>

      <section class="terms-section">
        <h2>2. 用户责任</h2>
        <p>您同意：</p>
        <ul>
          <li>提供真实、准确、完整的个人信息</li>
          <li>妥善保管您的账号和密码</li>
          <li>对您账号下的所有活动负责</li>
          <li>遵守所有适用的法律和法规</li>
        </ul>
      </section>

      <section class="terms-section">
        <h2>3. 隐私保护</h2>
        <p>
          我们重视您的隐私。请查看我们的
          <NuxtLink to="/privacy" class="inline-link">隐私政策</NuxtLink>
          ，了解我们如何收集、使用和保护您的个人信息。
        </p>
      </section>

      <section class="terms-section">
        <h2>4. 知识产权</h2>
        <p>
          本网站的所有内容，包括但不限于文字、图片、音频、视频、软件、程序、设计等，均为我们或我们的许可方所有。未经许可，不得复制、修改、传播或使用。
        </p>
      </section>

      <section class="terms-section">
        <h2>5. 免责声明</h2>
        <p>
          我们提供的服务按"现状"提供，不提供任何明示或暗示的保证。我们不对服务的中断或任何损失承担责任。
        </p>
      </section>

      <section class="terms-section">
        <h2>6. 条款修改</h2>
        <p>
          我们保留随时修改这些条款的权利。修改后的条款将在本页面上发布。继续使用本网站即表示您接受修改后的条款。
        </p>
      </section>

      <section class="terms-section">
        <h2>7. 联系我们</h2>
        <p>
          如果您对这些条款有任何问题，请
          <NuxtLink to="/contact" class="inline-link">联系我们</NuxtLink>。
        </p>
      </section>

      <div class="terms-footer">
        <p>最后更新时间：2024年1月1日</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO 配置
useHead({
  title: "服务条款 - 我的网站",
  meta: [
    {
      name: "description",
      content: "请仔细阅读我们的服务条款，了解您的权利和义务",
    },
    {
      name: "robots",
      content: "index, follow",
    },
  ],
});
</script>

<style scoped>
.terms-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.terms-content {
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

.terms-section {
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

.inline-link {
  color: var(--primary-color);
  text-decoration: none;
}

.inline-link:hover {
  text-decoration: underline;
}

.terms-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .terms-content {
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
