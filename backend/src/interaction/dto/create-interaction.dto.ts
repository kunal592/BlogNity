import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInteractionDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  userId: string;

  @IsString()
  postId: string;
}
