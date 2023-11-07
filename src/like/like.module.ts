import { Module } from '@nestjs/common';
import { LikesService } from './like.service';
import { LikesController } from './like.controller';

@Module({
  controllers: [LikesController], // Include the controllers from other modules
  providers: [LikesService],
})
export class LikeModule {}
