<template>
  <footer class="site-footer">
    <div class="footer-content">
      <p class="copyright">© 2024 我的小红书</p>
      <div class="footer-links">
        <NuxtLink to="/about">关于我们</NuxtLink>
        <NuxtLink to="/terms">服务条款</NuxtLink>
        <NuxtLink to="/privacy">隐私政策</NuxtLink>
      </div>
      <p class="icp">沪ICP备XXXXXXXX号</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: white;
  padding: 20px;
  margin-top: 40px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.copyright {
  margin: 0;
  color: #666;
}

.footer-links {
  margin: 10px 0;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  margin: 0 10px;
}

.footer-links a:hover {
  color: var(--primary-color);
}

.icp {
  margin: 10px 0 0;
  color: #999;
  font-size: 0.9rem;
}
</style>
