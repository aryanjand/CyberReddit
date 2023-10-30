import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { UserSession, ValidationException } from '../../common';
import { User, Thread } from '@prisma/client';

@Injectable()
export class ThreadsService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async findAllThreads() {
    const threads = await this.prisma.thread.findMany();
    if (!threads) {
      throw new ValidationException('No Threads', HttpStatus.NOT_FOUND);
    }
    return threads;
  }

  async findThread(id: number) {
    const thread = await this.prisma.thread.findUnique({
      where: { id },
    });
    if (!thread) {
      throw new ValidationException('No Threads', HttpStatus.NOT_FOUND);
    }
    return thread;
  }

  async createThread(postData: any) {
    const thread = await this.prisma.thread.create({
      data: postData,
    });
    if (!thread) {
      throw new ValidationException('No Threads', HttpStatus.NOT_FOUND);
    }
    return thread;
  }

  async patchThread(postData: any, id: number) {
    const thread = await this.prisma.thread.update({
      where: { id },
      data: postData,
    });

    if (!thread) {
      throw new ValidationException('No Threads', HttpStatus.NOT_FOUND);
    }
    return thread;
  }

  async deleteThread(id: number) {
    const thread = await this.prisma.thread.delete({
      where: { id },
    });

    if (!thread) {
      throw new ValidationException('No Threads', HttpStatus.NOT_FOUND);
    }
    return `Thread with ID ${id} was successful deleted`;
  }
}
