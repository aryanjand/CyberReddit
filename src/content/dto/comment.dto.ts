import { IsNumber, IsString } from 'class-validator';

export class CommentDto {}

export class CreateCommentDto {
  @IsNumber()
  content_id: number;

  @IsString()
  content_description: string;

  @IsNumber()
  user_id: number;
}
