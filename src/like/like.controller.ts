import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Redirect,
  Session,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { AuthGuard, UserSession } from 'src/common';
import { LikesService } from './like.service';
import { CreateLikeDto } from './dto';

@UseGuards(AuthGuard)
@Controller('likes')
export class LikesController {
  constructor(private service: LikesService) { }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @Redirect() // Redirect to the 'threads' route
  create(
    @Session() session: UserSession,
    @Body() dto: CreateLikeDto
  ) {
    console.log("Likes ", session, dto.content_id)
    this.service.create(session, dto.content_id);
    return { url: `/threads/${dto.thread_id}` }
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Redirect("") // Redirect to the 'threads' route
  delete(
    @Session() session: UserSession,
    @Param('id', ParseIntPipe) id: number,
  ) { 
    console.log("Trying to delete like")
    return this.service.delete(session, id);
  }
}
