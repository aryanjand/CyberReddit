import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { cwd } from 'process';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { NotFoundExceptionFilter } from './common/404.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(cwd(), '.env'),
    }),
    HttpModule,
    PrismaModule,
    HealthModule,
    AuthModule,
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
