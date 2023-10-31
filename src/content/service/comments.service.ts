import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from '../dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCommentDto) {
    try {
      const contentResult = await this.prisma.content.create({
        data: {
          content_description: dto.content_description,
          owner_user_id: dto.owner_user_id,
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
}
