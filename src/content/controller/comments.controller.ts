// comments.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

@Controller('comments')
export class CommentsController {
  // Get all comments
  @Get()
  findAll(): string {
    return 'Get all comments';
  }

  // Get a specific comment by ID
  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `Get comment with ID ${id}`;
  }

  // Create a new comment
  @Post()
  create(@Body() commentData: any): string {
    return 'Create a new comment';
  }

  // Update a comment by ID
  @Put(':id')
  update(@Param('id') id: string, @Body() commentData: any): string {
    return `Update comment with ID ${id}`;
  }

  // Delete a comment by ID
  @Delete(':id')
  remove(@Param('id') id: string): string {
    return `Delete comment with ID ${id}`;
  }
}
