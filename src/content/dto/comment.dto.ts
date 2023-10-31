import { IsNumber, IsString } from 'class-validator';

export class CommentDto {}

export class CreateCommentDto {
  @IsNumber()
  content_parent_id: number;

  @IsString()
  content_description: string;

  @IsNumber()
  owner_user_id: number;
}
