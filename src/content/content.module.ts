import { Module } from '@nestjs/common';
import { ThreadsController } from './controller/threads.controller';
import { CommentsController } from './controller/comments.controller';
import { ThreadsService } from './service/threads.service';

@Module({
  controllers: [ThreadsController, CommentsController], // Include the controllers from other modules
  providers: [ThreadsService], // Include the services from other modules
})
export class ContentModule {}
