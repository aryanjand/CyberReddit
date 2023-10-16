import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Render,
  Response as Res,
  Session,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthGuard, UserSession } from '../common';
import { User as UserDecorator } from './auth.decorator';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { AuthExceptionFilter } from './filters/';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('signin')
  @Render('signin')
  signin() {
    return { errors: [] };
  }

  @UseFilters(AuthExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Session() session: UserSession,
    @Res() res: Response,
    @Body() dto: SignInDto,
  ) {
    await this.authService.signIn(session, dto);
    return res.redirect('/');
  }

  @Get('signup')
  @Render('signup')
  signup() {
    return { errors: [] };
  }

  @UseFilters(AuthExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Res() res: Response, @Body() dto: SignUpDto) {
    await this.authService.signUp(dto);
    return res.redirect('/');
  }

  @HttpCode(HttpStatus.OK)
  @Get('signout')
  signOut(@Session() session: UserSession, @Res() res: Response) {
    return this.authService.signOut(session, res);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  profile(@UserDecorator() user: User) {
    return this.authService.profile(user);
  }
}
