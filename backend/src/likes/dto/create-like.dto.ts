import { IsOptional, IsString } from 'class-validator';

export class CreateLikeDto {
  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  postId?: string;

  @IsString()
  @IsOptional()
  commentId?: string;
}
