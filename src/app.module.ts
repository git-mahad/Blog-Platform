import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PostsModule } from './posts/posts.module'
import { AppService } from './app.service';
import { CommentModule } from './comments/comments.module'

@Module({
  imports: [PostsModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
