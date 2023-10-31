import { IsNotEmpty } from 'class-validator';

export class CreateThreadDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content_description: string;
}
