import {
  Controller,
  HttpCode,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard, UserSession } from '../common';
import { StorageService } from './storage.service';

@UseGuards(AuthGuard)
@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @Post('avatars/upload')
  uploadFile(
    @Session() session: UserSession,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image' })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    console.log({ session, file });

    return this.storageService.uploadAvatar(session.user.id, file);
  }
}
