export class Comment {
  id: number;
  content: string;
  author: string;
  email: string;
  postId: number;
  parentId?: number; // For nested comments
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
  replies?: Comment[];

  constructor(partial: Partial<Comment>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date();
    this.approved = this.approved ?? true;
    this.replies = [];
  }
}
