import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { AuthService } from './auth.service';
import { Public } from './auth.metadata';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }
}
