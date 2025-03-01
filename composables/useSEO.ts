export const useSEO = () => {
  // 创建响应式状态
  const seoMeta = useState('seo-meta', () => []);
  const seoTitle = useState('seo-title', () => '');
  const seoDescription = useState('seo-description', () => '');

  // 加载 SEO 配置
  const loadSEO = async (path: string) => {
    const { data: seoConfig } = await useFetch<SEOConfig>('/api/seo', {
      query: { path }
    });

    if (seoConfig.value) {
      // 更新标题和描述
      seoTitle.value = seoConfig.value.title;
      seoDescription.value = seoConfig.value.description;

      // 更新 meta 标签
      seoMeta.value = [
        { name: 'description', content: seoConfig.value.description },
        { name: 'keywords', content: seoConfig.value.keywords },
        { property: 'og:title', content: seoConfig.value.ogTitle || seoConfig.value.title },
        { property: 'og:description', content: seoConfig.value.ogDescription || seoConfig.value.description },
        ...(seoConfig.value.ogImage ? [{ property: 'og:image', content: seoConfig.value.ogImage }] : []),
        ...(seoConfig.value.robots ? [{ name: 'robots', content: seoConfig.value.robots }] : []),
        ...(seoConfig.value.author ? [{ name: 'author', content: seoConfig.value.author }] : [])
      ];
    }

    return seoConfig;
  };

  return {
    seoMeta,
    seoTitle,
    seoDescription,
    loadSEO
  };
}; 