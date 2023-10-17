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
import { Response } from 'express';
import {
  AuthGuard,
  ErrorsExceptionFilter,
  SessionExceptionFilter,
  UserSession,
} from '../common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('signin')
  @Render('signin')
  signin() {
    return { errors: [] };
  }

  @UseFilters(ErrorsExceptionFilter)
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

  @UseFilters(ErrorsExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(
    @Session() session: UserSession,
    @Res() res: Response,
    @Body() dto: SignUpDto,
  ) {
    await this.authService.signUp(session, dto);
    return res.redirect('/');
  }

  @HttpCode(HttpStatus.OK)
  @Get('signout')
  signOut(@Session() session: UserSession, @Res() res: Response) {
    return this.authService.signOut(session, res);
  }

  @UseGuards(AuthGuard)
  @UseFilters(SessionExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @Render('profile')
  @Get('profile')
  profile(@Session() session: UserSession) {
    return { user: session.user, errors: [] };
  }
}
