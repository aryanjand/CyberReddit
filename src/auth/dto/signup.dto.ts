import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { SignInDto } from './signin.dto';

export class SignUpDto extends SignInDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsUrl()
  @IsOptional()
  profilePicture: string;
}
