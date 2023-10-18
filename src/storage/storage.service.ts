import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Util } from '../common/';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StorageService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async uploadAvatar(id: number, file: Express.Multer.File) {
    const fileId = Util.generateId(20);
    const buf = file.buffer.toString('base64');
    const response = await this.cloudinary.uploadFile(buf, fileId, id);
    const user = await this.prisma.user.update({
      where: { id },
      data: { profile_pic_url: response.secure_url },
    });
    delete user.password;
    return user;
  }
}
