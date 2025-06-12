import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { PostsService } from '../posts/posts.service';
import { ApiResponse, PaginatedResponse } from '../common/interfaces/response.interface';

@Injectable()
export class CommentsService {
  private comments: Comment[] = [];
  private nextId = 1;

  constructor(private readonly postsService: PostsService) {}

  async create(createCommentDto: CreateCommentDto): Promise<ApiResponse<Comment>> {
    // Verify that the post exists
    try {
      await this.postsService.findOne(createCommentDto.postId);
    } catch (error) {
      throw new BadRequestException('Post not found');
    }

    // If parentId is provided, verify that the parent comment exists
    if (createCommentDto.parentId) {
      const parentComment = this.comments.find(c => c.id === createCommentDto.parentId);
      if (!parentComment) {
        throw new BadRequestException('Parent comment not found');
      }
      
      // Ensure parent comment belongs to the same post
      if (parentComment.postId !== createCommentDto.postId) {
        throw new BadRequestException('Parent comment must belong to the same post');
      }
    }

    const comment = new Comment({
      id: this.nextId++,
      ...createCommentDto,
    });

    this.comments.push(comment);
    
    // Increment comment count for the post
    this.postsService.incrementCommentsCount(createCommentDto.postId);

    return {
      success: true,
      message: 'Comment created successfully',
      data: comment,
    };
  }

  async findAll(page = 1, limit = 10, approved?: boolean): Promise<PaginatedResponse<Comment>> {
    let filteredComments = this.comments;

    if (approved !== undefined) {
      filteredComments = this.comments.filter(comment => comment.approved === approved);
    }

    const total = filteredComments.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedComments = filteredComments.slice(offset, offset + limit);

    return {
      success: true,
      message: 'Comments retrieved successfully',
      data: paginatedComments,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findByPost(postId: number): Promise<ApiResponse<Comment[]>> {
    // Verify that the post exists
    try {
      await this.postsService.findOne(postId);
    } catch (error) {
      throw new BadRequestException('Post not found');
    }

    const postComments = this.comments.filter(comment => comment.postId === postId);
    
    // Organize comments into hierarchical structure
    const topLevelComments = postComments.filter(comment => !comment.parentId);
    const nestedComments = this.buildCommentTree(topLevelComments, postComments);

    return {
      success: true,
      message: `Comments for post ${postId} retrieved successfully`,
      data: nestedComments,
    };
  }

  private buildCommentTree(parentComments: Comment[], allComments: Comment[]): Comment[] {
    return parentComments.map(parent => {
      const replies = allComments.filter(comment => comment.parentId === parent.id);
      return {
        ...parent,
        replies: replies.length > 0 ? this.buildCommentTree(replies, allComments) : [],
      };
    });
  }

  async findOne(id: number): Promise<ApiResponse<Comment>> {
    const comment = this.comments.find(c => c.id === id);
    
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return {
      success: true,
      message: 'Comment retrieved successfully',
      data: comment,
    };
  }

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<ApiResponse<Comment>> {
    const commentIndex = this.comments.findIndex(c => c.id === id);
    
    if (commentIndex === -1) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    const existingComment = this.comments[commentIndex];
    const updatedComment = new Comment({
      ...existingComment,
      ...updateCommentDto,
      id: existingComment.id, // Ensure ID doesn't change
      postId: existingComment.postId, // Ensure postId doesn't change
      parentId: existingComment.parentId, // Ensure parentId doesn't change
      createdAt: existingComment.createdAt, // Preserve original creation date
    });

    this.comments[commentIndex] = updatedComment;

    return {
      success: true,
      message: 'Comment updated successfully',
      data: updatedComment,
    };
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    const commentIndex = this.comments.findIndex(c => c.id === id);
    
    if (commentIndex === -1) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    const comment = this.comments[commentIndex];
    
    // Remove the comment and all its replies
    this.removeCommentAndReplies(id);
    
    // Decrement comment count for the post
    this.postsService.decrementCommentsCount(comment.postId);

    return {
      success: true,
      message: 'Comment deleted successfully',
    };
  }

  private removeCommentAndReplies(commentId: number): void {
    // Find all replies to this comment
    const replies = this.comments.filter(c => c.parentId === commentId);
    
    // Recursively remove all replies
    replies.forEach(reply => {
      this.removeCommentAndReplies(reply.id);
    });
    
    // Remove the comment itself
    const commentIndex = this.comments.findIndex(c => c.id === commentId);
    if (commentIndex !== -1) {
      this.comments.splice(commentIndex, 1);
    }
  }

  async findByAuthor(author: string): Promise<ApiResponse<Comment[]>> {
    const authorComments = this.comments.filter(comment => 
      comment.author.toLowerCase().includes(author.toLowerCase())
    );

    return {
      success: true,
      message: `Comments by "${author}" retrieved successfully`,
      data: authorComments,
    };
  }

  async approve(id: number): Promise<ApiResponse<Comment>> {
    const result = await this.update(id, { approved: true });
    return {
      ...result,
      message: 'Comment approved successfully',
    };
  }

  async reject(id: number): Promise<ApiResponse<Comment>> {
    const result = await this.update(id, { approved: false });
    return {
      ...result,
      message: 'Comment rejected successfully',
    };
  }
}