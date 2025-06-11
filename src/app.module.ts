import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {PostModule} from './posts/posts.module'
import { AppService } from './app.service';
import {CommentModule} from './comments/comments.module'

@Module({
  imports: [PostModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
