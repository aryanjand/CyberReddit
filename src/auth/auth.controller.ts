import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Session,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { AuthService } from './auth.service';
import { User as UserDecorator } from './auth.decorator';
import { User } from '@prisma/client';
import { Session as SessionRecord } from '../common/session';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Session() session: SessionRecord, @Body() dto: SignInDto) {
    return this.authService.signIn(session, dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  profile(@UserDecorator() user: User) {
    return this.authService.profile(user);
  }
}
