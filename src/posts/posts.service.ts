import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { ApiResponse, PaginatedResponse } from '../common/interfaces/response.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async create(createPostDto: CreatePostDto): Promise<ApiResponse<Post>> {
    const post = new Post(createPostDto);
    const savedPost = await this.postsRepository.save(post);

    return {
      success: true,
      message: 'Post created successfully',
      data: savedPost,
    };
  }

  async findAll(page = 1, limit = 10, published?: boolean): Promise<PaginatedResponse<Post>> {
    const queryBuilder = this.postsRepository.createQueryBuilder('post');

    if (published !== undefined) {
      queryBuilder.where('post.published = :published', { published });
    }

    const [posts, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: 'Posts retrieved successfully',
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  async findOne(id: number): Promise<ApiResponse<Post>> {
    const post = await this.postsRepository.findOne({ where: { id } });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return {
      success: true,
      message: 'Post retrieved successfully',
      data: post,
    };
  }

  async findBySlug(slug: string): Promise<ApiResponse<Post>> {
    return {
      success: true,
      message: 'Post retrieved successfully',
    };
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<ApiResponse<Post>> {
    const post = await this.postsRepository.findOne({ where: { id } });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    Object.assign(post, updatePostDto);
    const updatedPost = await this.postsRepository.save(post);

    return {
      success: true,
      message: 'Post updated successfully',
      data: updatedPost,
    };
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    const result = await this.postsRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return {
      success: true,
      message: 'Post deleted successfully',
    };
  }

  async findByAuthor(author: string): Promise<ApiResponse<Post[]>> {
    const posts = await this.postsRepository
      .createQueryBuilder('post')
      .where('LOWER(post.author) LIKE LOWER(:author)', { author: `%${author}%` })
      .getMany();

    return {
      success: true,
      message: `Posts by "${author}" retrieved successfully`,
      data: posts,
    };
  }

  async findByTag(tag: string): Promise<ApiResponse<Post[]>> {
    const posts = await this.postsRepository
      .createQueryBuilder('post')
      .where('LOWER(post.tags) LIKE LOWER(:tag)', { tag: `%${tag}%` })
      .getMany();

    return {
      success: true,
      message: `Posts tagged with "${tag}" retrieved successfully`,
      data: posts,
    };
  }
}

