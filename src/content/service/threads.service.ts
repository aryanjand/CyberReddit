import { HttpStatus, Injectable } from '@nestjs/common';
import { ValidationException } from '../../common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateThreadDto } from '../dto/createThread.dto';
import { CommentsService } from './comments.service';

@Injectable()
export class ThreadsService {
  constructor(
    private prisma: PrismaService,
    private comment: CommentsService,
  ) {}

  async findAllThreads() {
    const content_threads = await this.prisma.thread.findMany({
      include: {
        content: true,
      },
    });
    if (!content_threads) {
      throw new ValidationException('No Threads Found', HttpStatus.NOT_FOUND);
    }
    return content_threads;
  }

  async findMyThreads(userId: number) {
    const content_thread = await this.prisma.content.findMany({
      where: { owner_user_id: userId },
      include: { thread: true },
    });
    if (!content_thread) {
      throw new ValidationException('No Threads Found', HttpStatus.NOT_FOUND);
    }
    return content_thread;
  }

  async findThread(id: number, search_user_id: number) {
    const content_threads = await this.prisma.thread.findUnique({
      where: { id },
      include: {
        content: {
          select: {
            owner_user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
              },
            },
            views: true,
            content_description: true,
            _count: {
              select: { like: true },
            },
          },
        },
      },
    });

    if (!content_threads) {
      throw new ValidationException('No Threads', HttpStatus.NOT_FOUND);
    }

    const liked = await this.prisma.like.findFirst({
      where: {
        content_id: content_threads.content_id,
        user_id: search_user_id,
      },
    });

    const comments = await this.comment.findAllByContentParentId(id);

    return {
      ...content_threads,
      liked,
      comments,
    };
  }

  // Should we make these transactions
  async createThread(postData: CreateThreadDto, userId: number) {
    const content = await this.prisma.content.create({
      data: {
        content_description: postData.content_description,
        owner_user_id: userId,
      },
    });
    if (!content) {
      throw new ValidationException('No Content', HttpStatus.NOT_FOUND);
    }
    const thread = await this.prisma.thread.create({
      data: {
        title: postData.title,
        content_id: content.id,
      },
    });
    if (!thread) {
      throw new ValidationException('No Threads', HttpStatus.NOT_FOUND);
    }
    return;
  }
  // updating just the view count
  async patchThreadView(id: number) {
    const content = await this.prisma.thread.update({
      where: { id },
      data: {
        content: { update: { views: { increment: 1 } } },
      },
    });

    if (!content) {
      throw new ValidationException('No Content', HttpStatus.NOT_FOUND);
    }
    return;
  }

  // Should we make these transactions
  async patchThread(putData: CreateThreadDto, id: number) {
    const content = await this.prisma.content.update({
      where: { id },
      data: { content_description: putData.content_description },
    });

    if (!content) {
      throw new ValidationException('No Content', HttpStatus.NOT_FOUND);
    }

    const thread = await this.prisma.thread.updateMany({
      where: { content_id: content.id },
      data: { title: putData.title },
    });

    if (!thread) {
      throw new ValidationException('No Thread', HttpStatus.NOT_FOUND);
    }
    return;
  }

  async deleteThread(id: number) {
    const content_threads = await this.prisma.content.delete({
      where: { id },
    });

    if (!content_threads) {
      throw new ValidationException('No Threads', HttpStatus.NOT_FOUND);
    }
    return `Thread with ID ${id} was successful deleted`;
  }
}
