import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Response as Res,
  Session,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthGuard, Public, UserSession } from '../common';
import { User as UserDecorator } from './auth.decorator';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { SignInExceptionFilter, SignUpExceptionFilter } from './filters';

@UseGuards(AuthGuard)
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseFilters(SignInExceptionFilter)
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

  @Public()
  @UseFilters(SignUpExceptionFilter)
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Res() res: Response, @Body() dto: SignUpDto) {
    await this.authService.signUp(dto);
    return res.redirect('/');
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('signout')
  signOut(@Req() req: Request, @Res() res: Response) {
    return this.authService.signOut(req, res);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  profile(@UserDecorator() user: User) {
    return this.authService.profile(user);
  }
}
