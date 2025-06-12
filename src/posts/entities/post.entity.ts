export class Post {
  id: number;
  title: string;
  content: string;
  author: string;
  slug: string;
  published: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  commentsCount?: number;

  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date();
    this.published = this.published ?? false;
    this.tags = this.tags || [];
  }
}