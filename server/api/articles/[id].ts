export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id);
  
  // 模拟文章数据
  const articles = await $fetch('/api/articles');
  const article = articles.find(a => a.id === id);

  if (!article) {
    throw createError({
      statusCode: 404,
      message: '文章未找到'
    });
  }

  return article;
}); 