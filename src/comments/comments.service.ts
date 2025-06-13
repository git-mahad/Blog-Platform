import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { PostsService } from '../posts/posts.service';
import { ApiResponse, PaginatedResponse } from '../common/interfaces/response.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private readonly postsService: PostsService,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<ApiResponse<Comment>> {
    try {
      await this.postsService.findOne(createCommentDto.postId);
    } catch (error) {
      throw new BadRequestException('Post not found');
    }

    if (createCommentDto.parentId) {
      const parentComment = await this.commentsRepository.findOne({ where: { id: createCommentDto.parentId } });
      if (!parentComment) {
        throw new BadRequestException('Parent comment not found');
      }

      if (parentComment.postId !== createCommentDto.postId) {
        throw new BadRequestException('Parent comment must belong to the same post');
      }
    }

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      approved: true,
    });

    const savedComment = await this.commentsRepository.save(comment);

    return {
      success: true,
      message: 'Comment created successfully',
      data: savedComment,
    };
  }

  async findAll(page = 1, limit = 10, approved?: boolean): Promise<PaginatedResponse<Comment>> {
    const queryBuilder = this.commentsRepository.createQueryBuilder('comment');

    if (approved !== undefined) {
      queryBuilder.where('comment.approved = :approved', { approved });
    }

    const [comments, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: 'Comments retrieved successfully',
      data: comments,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  async findByPost(postId: number): Promise<ApiResponse<Comment[]>> {
    try {
      await this.postsService.findOne(postId);
    } catch (error) {
      throw new BadRequestException('Post not found');
    }

    const comments = await this.commentsRepository.find({
      where: { postId },
      order: { createdAt: 'DESC' }
    });

    const topLevelComments = comments.filter(comment => !comment.parentId);
    const nestedComments = this.buildCommentTree(topLevelComments, comments);

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
    const comment = await this.commentsRepository.findOne({ where: { id } });
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
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    Object.assign(comment, updateCommentDto);
    const updatedComment = await this.commentsRepository.save(comment);

    return {
      success: true,
      message: 'Comment updated successfully',
      data: updatedComment,
    };
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    const result = await this.commentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return {
      success: true,
      message: 'Comment deleted successfully',
    };
  }

  async findByAuthor(author: string): Promise<ApiResponse<Comment[]>> {
    const comments = await this.commentsRepository
      .createQueryBuilder('comment')
      .where('LOWER(comment.author) LIKE LOWER(:author)', { author: `%${author}%` })
      .getMany();

    return {
      success: true,
      message: `Comments by "${author}" retrieved successfully`,
      data: comments,
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
