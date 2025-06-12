import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { ApiResponse, PaginatedResponse } from '../common/interfaces/response.interface';

@Injectable()
export class PostsService {
  private posts: Post[] = [];
  private nextId = 1;

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async create(createPostDto: CreatePostDto): Promise<ApiResponse<Post>> {
    const slug = this.generateSlug(createPostDto.title);
    
    // Check for duplicate slug
    const existingPost = this.posts.find(post => post.slug === slug);
    if (existingPost) {
      throw new BadRequestException('A post with similar title already exists');
    }

    const post = new Post({
      id: this.nextId++,
      ...createPostDto,
      slug,
      commentsCount: 0,
    });

    this.posts.push(post);

    return {
      success: true,
      message: 'Post created successfully',
      data: post,
    };
  }

  async findAll(page = 1, limit = 10, published?: boolean): Promise<PaginatedResponse<Post>> {
    let filteredPosts = this.posts;

    if (published !== undefined) {
      filteredPosts = this.posts.filter(post => post.published === published);
    }

    const total = filteredPosts.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedPosts = filteredPosts.slice(offset, offset + limit);

    return {
      success: true,
      message: 'Posts retrieved successfully',
      data: paginatedPosts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: number): Promise<ApiResponse<Post>> {
    const post = this.posts.find(p => p.id === id);
    
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
    const post = this.posts.find(p => p.slug === slug);
    
    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    return {
      success: true,
      message: 'Post retrieved successfully',
      data: post,
    };
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<ApiResponse<Post>> {
    const postIndex = this.posts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const existingPost = this.posts[postIndex];
    
    // Generate new slug if title is being updated
    let newSlug = existingPost.slug;
    if (updatePostDto.title && updatePostDto.title !== existingPost.title) {
      newSlug = this.generateSlug(updatePostDto.title);
      
      // Check for duplicate slug (excluding current post)
      const duplicatePost = this.posts.find(post => post.slug === newSlug && post.id !== id);
      if (duplicatePost) {
        throw new BadRequestException('A post with similar title already exists');
      }
    }

    const updatedPost = new Post({
      ...existingPost,
      ...updatePostDto,
      slug: newSlug,
      id: existingPost.id, // Ensure ID doesn't change
      createdAt: existingPost.createdAt, // Preserve original creation date
    });

    this.posts[postIndex] = updatedPost;

    return {
      success: true,
      message: 'Post updated successfully',
      data: updatedPost,
    };
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    const postIndex = this.posts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    this.posts.splice(postIndex, 1);

    return {
      success: true,
      message: 'Post deleted successfully',
    };
  }

  async findByAuthor(author: string): Promise<ApiResponse<Post[]>> {
    const authorPosts = this.posts.filter(post => 
      post.author.toLowerCase().includes(author.toLowerCase())
    );

    return {
      success: true,
      message: `Posts by "${author}" retrieved successfully`,
      data: authorPosts,
    };
  }

  async findByTag(tag: string): Promise<ApiResponse<Post[]>> {
    const taggedPosts = this.posts.filter(post => 
      post.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );

    return {
      success: true,
      message: `Posts tagged with "${tag}" retrieved successfully`,
      data: taggedPosts,
    };
  }

  // Helper method for comments service
  incrementCommentsCount(postId: number): void {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.commentsCount = (post.commentsCount || 0) + 1;
    }
  }

  decrementCommentsCount(postId: number): void {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.commentsCount = (post.commentsCount || 0) - 1;
    }
  }
}

