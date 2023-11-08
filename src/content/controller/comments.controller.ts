import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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

  @Get(':id')
  findAllByContentParentId(@Param('id', ParseIntPipe) id: number) {
    return this.service.findAllByContentParentId(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Redirect()
  @Post()
  create(@Session() session: UserSession, @Body() dto: CreateCommentDto) {
    return this.service.create(session, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(
    @Session() session: UserSession,
    @Param('id', ParseIntPipe) id: number,
    @Body('content_description') content: string,
  ) {
    return this.service.update(session, id, content);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(
    @Session() session: UserSession,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.delete(session, id);
  }
}
