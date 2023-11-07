import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { UserSession } from '../../common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from '../dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findAllByContentParentId(id: number) {
    try {
      const contents = await this.prisma.content.findMany({
        where: { content_parent_id: id },
        include: {
          child_contents: true,
          owner_user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
      return contents;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async create(session: UserSession, dto: CreateCommentDto) {
    try {
      const contentResult = await this.prisma.content.create({
        data: {
          content_description: dto.content_description,
          owner_user_id: session.user.id,
          content_parent_id: dto.content_parent_id,
        },
      });
      await this.prisma.comment.create({
        data: {
          content_id: contentResult.id,
        },
      });
      return { url: `/threads/${dto.thread_id}` };
    } catch (err) {
      console.log(err);
    }
  }

  async delete(session: UserSession, contentId: number) {
    try {
      const content = await this.prisma.content.findUnique({
        where: { id: contentId },
        include: {
          content_parent: {
            select: {
              owner_user: { select: { id: true } },
            },
          },
        },
      });

      if (!content) {
        throw new BadRequestException('Content does not exist');
      }

      if (
        content.content_parent.owner_user.id !== session.user.id ||
        content.owner_user_id !== session.user.id
      ) {
        throw new UnauthorizedException('Comment does not belong to user');
      }

      await this.prisma.content.update({
        where: { id: contentId },
        data: {
          content_description: 'comment deleted',
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async update(
    session: UserSession,
    contentId: number,
    contentDescription: string,
  ) {
    try {
      await this.prisma.content.update({
        where: {
          id: contentId,
          owner_user_id: session.user.id,
        },
        data: { content_description: contentDescription },
      });
    } catch (err) {
      throw new BadRequestException();
    }
  }
}
