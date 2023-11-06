import { Injectable } from '@nestjs/common';
import { UserSession } from '../../common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from '../dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

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
    } catch (err) {
      console.log(err);
    }
  }

  async findAllByThreadId(threadId: number) {
    try {
      const comments = await this.prisma.thread.findUnique({
        where: { id: threadId },
        include: {
          content: {
            select: {
              child_contents: true,
            },
          },
        },
      });
      console.dir(comments, { depth: null });
      return comments;
    } catch (err) {
      console.error(err);
    }
  }
}
