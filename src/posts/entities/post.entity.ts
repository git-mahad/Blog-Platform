import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm'

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  author: string;

  @Column() 
  published: boolean;

  @Column('simple-array')
  tags: string[];

  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);
    this.published = this.published ?? false;
    this.tags = this.tags || [];
  }
}