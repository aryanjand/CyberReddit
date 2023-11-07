import { HttpStatus, Injectable } from '@nestjs/common';
import { UserSession, ValidationException } from '../common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async find(session: UserSession, content_id: number) {
    try {
      const likeResult = await this.prisma.like.findMany({
        where: {
          user_id: session.user.id,
          content_id: content_id,
        },
      });

      return likeResult;
    } catch (err) {
      console.log(err);
    }
  }

  async create(session: UserSession, content_id: number) {
    try {
       await this.prisma.like.create({
        data: {
          user_id: session.user.id,
          content_id: content_id,
        },
      });

      return 'Like Created';
    } catch (err) {
      console.log(err);
    }
  }

  async delete(session: UserSession, content_id: number) {
    try {
      const likeResult = await this.prisma.like.deleteMany({
        where: {
          user_id: session.user.id,
          content_id: content_id,
        },
      });

    } catch (err) {
      console.log(err);
    }
  }
}
