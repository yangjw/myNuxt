export default defineContentConfig({
  // 文档集合配置
  documentDriven: {
    // 启用文档驱动模式
    enabled: true,
    // 页面路由配置
    navigation: true,
    // 默认本地化
    defaultLocale: "zh",
  },

  // 内容目录配置
  sources: {
    // 默认内容源
    content: {
      driver: "fs",
      base: "./content",
    },
    // 博客内容源
    blog: {
      driver: "fs",
      base: "./content/blog",
    },
    // 帮助文档内容源
    help: {
      driver: "fs",
      base: "./content/help",
    },
  },

  // Markdown 解析配置
  markdown: {
    // 启用代码高亮
    highlighter: "shiki",
    // 代码高亮主题
    shiki: {
      theme: "github-light",
    },
    // 启用 GitHub 风格的 Markdown
    remarkPlugins: ["remark-gfm"],
    // 启用标题锚点
    anchorLinks: true,
  },

  // 内容解析配置
  parsers: {
    // 启用 YAML 解析
    yaml: {
      parse: true,
    },
    // 启用 JSON 解析
    json: {
      parse: true,
    },
    // 启用 CSV 解析
    csv: {
      parse: true,
    },
  },

  // 内容索引配置
  ignores: [
    // 忽略草稿文件
    "drafts",
    // 忽略临时文件
    "temp",
    // 忽略以点开头的文件
    path => path.startsWith("."),
  ],
});
