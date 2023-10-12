import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({ minLength: 10, minSymbols: 1, minUppercase: 1 })
  password: string;
}
