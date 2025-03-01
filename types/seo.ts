export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
  author?: string;
}

export interface PageSEO {
  path: string;
  seo: SEOConfig;
} 