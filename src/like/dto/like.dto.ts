import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class LikeDto {}

export class CreateLikeDto { 
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  content_id: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  thread_id: number;
}