import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto';

@Injectable()
export class AuthService {
  // TODO: Implement Sign up
  private readonly saltRounds;
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    this.saltRounds = this.config.get('SALT_ROUNDS', 12);
  }

  async signIn(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = bcrypt.compareSync(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwtToken = await this.jwt.signAsync(user, {
      secret: this.config.get('JWT_SECRET', 'DevSecret123'),
    });

    //  TODO: Implement Refresh Token and better response
    return jwtToken;
  }
}
