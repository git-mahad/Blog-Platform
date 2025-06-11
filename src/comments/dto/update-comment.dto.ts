import { IsString, IsOptional, IsEmail, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  content?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  author?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  approved?: boolean;
}