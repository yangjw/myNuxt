export default defineNuxtRouteMiddleware((to, from) => {
  // 这里添加实际的认证逻辑
  const isAuthenticated = true; // 临时示例

  if (!isAuthenticated && to.path !== '/login') {
    return navigateTo('/login');
  }
}); 