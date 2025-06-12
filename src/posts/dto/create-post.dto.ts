import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString({message: 'Title must be a string'})
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(200, { message: 'Title must be less than 200 characters' })
  title: string;

  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  @MinLength(10, { message: 'Content must be at least 10 characters long' })
  content: string;

  @IsString({ message: 'Author must be a string' })
  @IsNotEmpty({ message: 'Author is required' })
  @MinLength(2, { message: 'Author must be at least 2 characters long' })
  @MaxLength(100, { message: 'Author must be less than 100 characters' })
  author: string;

  @IsOptional()
  @IsBoolean({ message: 'Published must be a boolean' })
  published?: boolean;

  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Tags must be an array of strings' })
  tags?: string[];
}
