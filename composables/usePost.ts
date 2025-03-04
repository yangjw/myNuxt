export function usePost() {
  const fetchMorePosts = async (
    page: number,
    category: string = 'recommend',
    pageSize: number = 15
  ) => {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 模拟数据
    return Array.from({ length: pageSize }, (_, i) => ({
      id: page * pageSize + i,
      title: `${category} - 第 ${page} 页的第 ${i + 1} 篇文章`,
      image: `https://picsum.photos/400/600?random=${page * pageSize + i}`,
      author: {
        name: `用户${page * pageSize + i}`,
        avatar: `https://i.pravatar.cc/100?u=${page * pageSize + i}`,
      },
      likes: Math.floor(Math.random() * 1000),
      type: ["image", "video", "live"][Math.floor(Math.random() * 3)],
      date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      category,
    }));
  };

  return {
    fetchMorePosts,
  };
} 