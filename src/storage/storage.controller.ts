import {
  Controller,
  HttpCode,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Response as Res,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthGuard, UserSession } from '../common';
import { ProfilePicExceptionFilter } from './storage-profile-pic-upload.filter';
import { StorageService } from './storage.service';

@UseGuards(AuthGuard)
@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @HttpCode(HttpStatus.OK)
  @UseFilters(ProfilePicExceptionFilter)
  @UseInterceptors(FileInterceptor('file'))
  @Post('avatars/upload')
  async uploadFile(
    @Session() session: UserSession,
    @Res() res: Response,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image' })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    const user = await this.storageService.uploadAvatar(session.user.id, file);
    session.user = user;
    res.redirect('/profile');
  }
}
