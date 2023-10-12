import { IsNotEmpty, IsString } from 'class-validator';
import { SignInDto } from './signin.dto';

export class SignUpDto extends SignInDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
