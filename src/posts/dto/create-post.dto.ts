import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString({message: 'Title must be a string'})
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @IsString()
  @IsNotEmpty({ message: 'Author is required' })
  @MinLength(2)
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
