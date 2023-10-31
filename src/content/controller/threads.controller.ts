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
} from '@nestjs/common';
import { Response } from 'express';
import { ThreadsService } from '../service/threads.service';
import { AuthGuard, UserSession } from '../../common';

@Controller('threads')
export class ThreadsController {
  constructor(private threadsService: ThreadsService) {}

  // Get all threads
  @HttpCode(HttpStatus.OK)
  @Render('threads')
  @Get('')
  async findAll(@Res() res: Response): Promise<any> {
    const threads = await this.threadsService.findAllThreads();
    console.log('Threads ', threads[0].thread);
    return { threads: threads };
  }

  // Get a specific post by ID
  @HttpCode(HttpStatus.OK)
  @Render('threads-page')
  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: number) {
    const thread = await this.threadsService.findThread(id);
    return { thread: thread };
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Render('threads')
  @Get('/my-threads')
  async findMyThreads(@Res() res: Response, @Session() session: UserSession) {
    const threads = await this.threadsService.findMyThreads(session.user.id);
    return { threads: threads };
  }
  // Create a new post
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Render('threads')
  @Post('')
  async create(@Res() res: Response, @Body() postData: any) {
    await this.threadsService.createThread(postData);
    return res.redirect('/threads');
  }

  // Update a post by ID
  @Put(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() postData: any,
  ) {
    await this.threadsService.patchThread(id, postData);
    return res.redirect('/threads');
  }

  // Delete a post by ID
  // @Delete(':id')
  // async remove(@Param('id') id: number): Promise<string> {
  //   await this.threadsService.deleteThread(id);
  //   return `Delete post with ID ${id}`;
  // }
}
