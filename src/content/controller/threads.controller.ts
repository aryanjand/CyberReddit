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
  Res,
} from '@nestjs/common';
import { ThreadsService } from '../service/threads.service';

@Controller('threads')
export class ThreadsController {
  constructor(private threadsService: ThreadsService) {}

  // Get all threads
  @Get('')
  @Render('threads')
  findAll(): any {
    return { errors: [] };
  }

  // Get a specific post by ID
  @Get('/:id')
  @Render('threads-page')
  findOne(@Param('id') id: string): string {
    return `Get post with ID ${id}`;
  }

  // Create a new post
  @Post('')
  @Render('threads')
  create(@Res() res: Response, @Body() postData: any) {


    

  }

  // Update a post by ID
  @Put('content/threads/:id')
  update(@Param('id') id: string, @Body() postData: any): string {
    return `Update post with ID ${id}`;
  }

  // Delete a post by ID
  @Delete('content/threads/:id')
  remove(@Param('id') id: string): string {
    return `Delete post with ID ${id}`;
  }
}
