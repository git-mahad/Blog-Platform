export class CommentModule{}import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [PostsModule], // Import PostsModule to access PostsService
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}