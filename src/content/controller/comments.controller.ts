import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Public, UserSession } from 'src/common';
import { CreateCommentDto } from '../dto';
import { CommentsService } from '../service/comments.service';

@UseGuards(AuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private service: CommentsService) {}
  // Get all comments
  @Public()
  @Get()
  findAll(): string {
    return 'Get all comments';
  }

  // Get a specific comment by ID
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `Get comment with ID ${id}`;
  }

  @Post()
  create(@Session() session: UserSession, @Body() dto: CreateCommentDto) {
    return this.service.create(session, dto);
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
