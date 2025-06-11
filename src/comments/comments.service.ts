import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class CommentsService{
  private comments: Comment[] = []
  private nextid = 1

  // constructor(private readonly postsService: PostsService){}
}