export default defineEventHandler(async (event) => {
  // 模拟数据库中的 SEO 配置
  const seoConfigs: PageSEO[] = [
    {
      path: '/',
      seo: {
        title: '首页 - 动态SEO标题',
        description: '这是从API获取的首页描述',
        keywords: '首页,主页,动态SEO',
        ogTitle: '欢迎访问我们的网站 - API',
        ogDescription: '这是一个动态SEO的示例',
        robots: 'index, follow'
      }
    },
    {
      path: '/about',
      seo: {
        title: '关于我们 - 动态SEO标题',
        description: '从API获取的关于我们页面描述',
        keywords: '关于我们,公司介绍,团队介绍,动态SEO',
        ogTitle: '关于我们 - 了解更多 - API',
        ogImage: '/images/about-banner.jpg',
        author: '动态获取的团队信息'
      }
    },
    {
      path: '/contact',
      seo: {
        title: '联系我们 - 动态SEO标题',
        description: '从API获取的联系页面描述',
        keywords: '联系方式,客户支持,联系我们,动态SEO',
        ogTitle: '联系我们 - 随时为您服务 - API',
        ogDescription: '欢迎联系我们获取支持'
      }
    }
  ];

  // 获取当前路径
  const path = event.path || '/';
  
  // 查找对应的 SEO 配置
  const config = seoConfigs.find(item => item.path === path) || seoConfigs[0];
  
  return config.seo;
}); 