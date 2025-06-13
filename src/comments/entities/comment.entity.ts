import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  author: string;

  @Column()
  email: string;

  @Column()
  postId: number;

  @Column({ nullable: true })
  parentId?: number;

  @Column({ default: true })
  approved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  replies?: Comment[];

  constructor(partial: Partial<Comment>) {
    Object.assign(this, partial);
    this.approved = this.approved ?? true;
    this.replies = [];
  }
}
