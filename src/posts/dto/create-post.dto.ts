import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto{
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  author: string

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(200)
  description: string

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsBoolean()
  published?: string
  

}