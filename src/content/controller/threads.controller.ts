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
  UseGuards,
  HttpCode,
  HttpStatus,
  Session,
  ParseIntPipe,
  Redirect,
  Query,
} from '@nestjs/common';
import { ThreadsService } from '../service/threads.service';
import { AuthGuard, UserSession } from '../../common';
import { CreateThreadDto } from '../dto/createThread.dto';

@Controller('threads')
export class ThreadsController {
  constructor(private threadsService: ThreadsService) {}

  // Get all threads
  @HttpCode(HttpStatus.OK)
  @Render('threads')
  @Get()
  async findAll(@Session() session: UserSession): Promise<any> {
    const threads = await this.threadsService.findAllThreads();
    return { threads: threads, authenticated: session.authenticated };
  }

  // Get threads by user id
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Render('threads')
  @Get('my-threads')
  async findMyThreads(@Session() session: UserSession): Promise<any> {
    const threads = await this.threadsService.findMyThreads(session.user.id);
    return { threads: threads, authenticated: true };
  }

  // Search comments
  @HttpCode(HttpStatus.OK)
  @Render('threads')
  @Get('search')
  async search(@Session() session: UserSession, @Query('word') word: string) {
    const threads = await this.threadsService.searchComments(word);
    console.log('Search for the word ', threads);
    return { threads: threads, authenticated: session.authenticated };
  }

  // Get a specific post by ID
  @HttpCode(HttpStatus.OK)
  @Render('thread-page')
  @Get(':id')
  async findOne(
    @Session() session: UserSession,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.threadsService.patchThreadView(id);
    const thread = await this.threadsService.findThread(
      id,
      session.user ? session.user.id : 0,
    );
    // console.dir(thread, { depth: null });
    return {
      thread: thread,
      authenticated: session.authenticated,
      user: session.user,
    };
  }
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Redirect('/threads')
  @Render('threads')
  @Post()
  async create(@Session() session: UserSession, @Body() dto: CreateThreadDto) {
    await this.threadsService.createThread(dto, session.user.id);
    return this.findAll(session);
  }

  // Update a post by ID
  @Redirect('/threads')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() putData: CreateThreadDto,
  ) {
    return this.threadsService.patchThread(putData, id);
  }

  // Delete a post by ID
  // @Delete(':id')
  // async remove(@Param('id') id: number): Promise<string> {
  //   await this.threadsService.deleteThread(id);
  //   return `Delete post with ID ${id}`;
  // }
}
