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
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
