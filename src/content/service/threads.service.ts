import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { UserSession, ValidationException } from '../../common';
import { User, Thread, Content } from '@prisma/client';
import { CreateThreadDto } from '../dto/createThread.dto';

@Injectable()
export class ThreadsService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

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

  async findThread(id: number) {
    const content_threads = await this.prisma.thread.findUnique({
      where: { id },
      include: {
        content: {
          select: {
            views: true,
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
    return content_threads;
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
