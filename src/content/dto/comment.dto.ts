import { Transform } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class CommentDto {}

export class CreateCommentDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  content_parent_id: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  thread_id: number;

  @IsString()
  content_description: string;
}
