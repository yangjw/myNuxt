export const usePost = () => {
  // 模拟获取帖子列表
  const fetchMorePosts = async (page: number, category?: string) => {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 只加载前3页数据
    if (page > 20) {
      return [];
    }

    // 每页生成12条数据
    return Array.from({ length: 100 }, (_, i) => {
      const id = (page - 1) * 100 + i;
      return {
        id: `post-${id}`,
        title: `${category || "推荐"} ${page}-${i + 1}`,
        content: `这是第 ${page} 页的第 ${i + 1} 条内容`,
        image: `https://picsum.photos/400/600?random=${id}`,
        author: {
          name: `用户${id}`,
          avatar: `https://i.pravatar.cc/100?u=${id}`,
        },
        likes: Math.floor(Math.random() * 10000),
        comments: Math.floor(Math.random() * 1000),
        type: ["image", "video", "live"][Math.floor(Math.random() * 3)],
        date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      };
    });
  };

  return {
    fetchMorePosts,
  };
}; 