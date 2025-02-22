import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { cwd } from 'process';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { NotFoundExceptionFilter } from './common';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { ContentModule } from './content/content.module';
import { LikeModule } from './like/like.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(cwd(), '.env'),
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    ContentModule,
    LikeModule,
    StorageModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: NotFoundExceptionFilter,
    },
  ],
})
export class AppModule {}
