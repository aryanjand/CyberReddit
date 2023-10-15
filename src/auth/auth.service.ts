import * as bcrypt from 'bcrypt';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto, SignUpDto } from './dto';

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

    const token = await this.jwt.signAsync(user, {
      secret: this.config.get('JWT_SECRET', 'DevSecret123'),
    });

    //  TODO: Implement Refresh Token and better response
    return { token };
  }

  async signUp(dto: SignUpDto) {
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
        throw new HttpException('Credentials taken', HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
