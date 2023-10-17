import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserSession } from '../common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthException } from './auth-exception';
import { SignInDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;

  constructor(private prisma: PrismaService, private config: ConfigService) {
    this.saltRounds = this.config.get('SALT_ROUNDS', 12);
  }

  async signIn(session: UserSession, dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new AuthException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isValid = bcrypt.compareSync(dto.password, user.password);
    if (!isValid) {
      throw new AuthException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    delete user.password;

    session.authenticated = true;
    session.user = user;

    return;
  }

  async signUp(dto: SignUpDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new AuthException('Passwords do not match');
    }

    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          password: bcrypt.hashSync(dto.password, this.saltRounds),
          first_name: dto.firstName,
          last_name: dto.lastName,
          profile_pic_url: dto.profilePicture,
        },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new AuthException('Credentials taken');
      }
      throw new AuthException('Something went wrong');
    }
  }

  async signOut(session: UserSession, res: Response) {
    res.clearCookie('connect.sid');
    session.destroy((err) => {
      if (err) {
        throw new HttpException(err.message, HttpStatus.SERVICE_UNAVAILABLE);
      }
    });
    return res.redirect('/');
  }
}
