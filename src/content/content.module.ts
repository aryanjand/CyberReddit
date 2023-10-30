import { Module } from '@nestjs/common';
import { ThreadsController } from './controller/threads.controller';
import { CommentsController } from './controller/comments.controller';

@Module({
  controllers: [ThreadsController, CommentsController], // Include the controllers from other modules
})
export class ContentModule {}
