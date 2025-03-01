export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  date: string;
  image?: string;
  tags: string[];
} 