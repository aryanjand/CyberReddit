import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
} from 'class-validator';
import { SignInDto } from './signin.dto';

export class SignUpDto extends PartialType(
  OmitType(SignInDto, ['password'] as const),
) {
  @IsStrongPassword({ minLength: 10, minSymbols: 1, minUppercase: 1 })
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsUrl()
  @IsOptional()
  profilePicture: string;
}
