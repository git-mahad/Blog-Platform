import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PostsModule } from './posts/posts.module'
import { AppService } from './app.service';
import { CommentModule } from './comments/comments.module'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345',
      database: 'blog_db',
      entities: [Post],
      autoLoadEntities: true,
      synchronize: true,
    }),    
    PostsModule, 
    CommentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
