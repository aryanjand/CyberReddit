import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { UserSession, ValidationException } from '../../common';
import { User, Thread, Content } from '@prisma/client';

@Injectable()
export class ThreadsService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async findAllThreads() {
    const content_threads = await this.prisma.content.findMany({
      include: {
        thread: true,
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
    const content_threads = await this.prisma.content.findUnique({
      where: { id },
      include: {
        thread: true,
      },
    });
    if (!content_threads) {
      throw new ValidationException('No Threads', HttpStatus.NOT_FOUND);
    }
    return content_threads;
  }

  // Should we make these transactions
  async createThread(postData: any) {
    const content = await this.prisma.content.create({
      data: {
        content_description: postData.content_description,
        owner_user_id: postData.owner_user_id,
        content_parent_id: null,
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
  // Should we make these transactions
  async patchThread(putData: any, id: number) {
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
