import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import MongoStore from 'connect-mongo';
import 'dotenv/config';
import session from 'express-session';
import helmet from 'helmet';
import { join } from 'path';
import { cwd } from 'process';
import { AppModule } from './app.module';

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

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      // Secure set to true when HTTPS is enabled
      cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 },
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        crypto: { secret: process.env.MONGO_SECRET },
      }),
    }),
  );

  await app.listen(process.env.PORT || 3000);

  console.log(`Serving on: ${await app.getUrl()}`);
}
bootstrap();
