// threads.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Render,
  Response as Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  Session,
  ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ThreadsService } from '../service/threads.service';
import { AuthGuard, UserSession } from '../../common';
import { CreateThreadDto } from '../dto/createThread.dto';

@Controller('threads')
export class ThreadsController {
  constructor(private threadsService: ThreadsService) {}

  // Get all threads
  @HttpCode(HttpStatus.OK)
  @Render('threads')
  @Get('')
  async findAll(): Promise<any> {
    const threads = await this.threadsService.findAllThreads();
    return { threads: threads };
  }

  // Get threads by user id
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Render('threads')
  @Get('my-threads')
  async findMyThreads(@Session() session: UserSession): Promise<any> {
    const threads = await this.threadsService.findMyThreads(session.user.id);
    return { threads: threads };
  }

  // Get a specific post by ID
  @HttpCode(HttpStatus.OK)
  @Render('threads-page')
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const thread = await this.threadsService.findThread(id);
    return { thread: thread };
  }

  // Create a new post
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Render('threads')
  @Post('')
  async create(
    @Session() session: UserSession,
    @Res() res: Response,
    @Body() dto: CreateThreadDto,
  ) {
    await this.threadsService.createThread(dto, session.user.id);
    return res.redirect('/threads');
  }

  // Update a post by ID
  @Put(':id')
  async update(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() putData: CreateThreadDto,
  ) {
    await this.threadsService.patchThread(putData, id);
    return res.redirect('/threads');
  }

  // Delete a post by ID
  // @Delete(':id')
  // async remove(@Param('id') id: number): Promise<string> {
  //   await this.threadsService.deleteThread(id);
  //   return `Delete post with ID ${id}`;
  // }
}
