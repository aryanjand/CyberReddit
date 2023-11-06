import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Redirect,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, UserSession } from 'src/common';
import { CreateCommentDto } from '../dto';
import { CommentsService } from '../service/comments.service';

@UseGuards(AuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private service: CommentsService) {}

  @Redirect()
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
