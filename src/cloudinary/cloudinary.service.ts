import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  /**
   * Uploads a file to Cloudinary
   * @param {string} buf - The file buffer
   * @param {string} fileId - The file id
   * @param {number} id - The user id
   */
  async uploadFile(buf: string, fileId: string, id: number) {
    const response = await cloudinary.uploader.upload(
      `data:image/png;base64,${buf}`,
      {
        resource_type: 'image',
        public_id: `avatars/${id}/${fileId}`,
      },
    );
    return response;
  }
}
