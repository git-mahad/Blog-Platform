import { IsString, IsNotEmpty, IsEmail, IsNumber, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  content: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  author: string;

  @IsEmail()
  email: string;

  @IsNumber()
  postId: number;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}