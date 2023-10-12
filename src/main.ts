import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { join } from 'path';
import { cwd } from 'process';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(cwd(), 'public'));
  app.setBaseViewsDir(join(cwd(), 'views'));
  app.setViewEngine('ejs');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // TODO: set origin to the frontend url once it's deployed.
  app.enableCors({
    origin: '*',
  });

  app.use(helmet());

  await app.listen(process.env.PORT || 3000);

  console.log(`Serving on: ${await app.getUrl()}`);
}
bootstrap();
