export default defineEventHandler(async () => {
  // 模拟文章数据
  const articles: Article[] = [
    {
      id: 1,
      title: "Vue3 和 Nuxt3 最佳实践",
      description: "探索 Vue3 和 Nuxt3 的新特性和最佳实践",
      content: "这是一篇关于 Vue3 和 Nuxt3 的详细教程...",
      author: "张三",
      date: "2024-01-15",
      tags: ["Vue3", "Nuxt3", "前端开发"],
      image: "/images/articles/vue3.jpg"
    },
    {
      id: 2,
      title: "TypeScript 高级技巧",
      description: "深入理解 TypeScript 的高级用法",
      content: "TypeScript 提供了许多高级特性...",
      author: "李四",
      date: "2024-01-20",
      tags: ["TypeScript", "JavaScript", "编程"],
      image: "/images/articles/typescript.jpg"
    },
    {
      id: 3,
      title: "现代化的状态管理",
      description: "比较不同的状态管理方案",
      content: "在现代前端开发中，状态管理是一个重要话题...",
      author: "王五",
      date: "2024-01-25",
      tags: ["Vuex", "Pinia", "状态管理"],
      image: "/images/articles/state-management.jpg"
    }
  ];

  return articles;
}); 