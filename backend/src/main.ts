import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let isAppInitialized = false;
let initPromise: Promise<void> | null = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors({
    origin: [
      'https://hiring-platform-app.vercel.app',
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.init();
  isAppInitialized = true;
}

// Default export for Vercel handler
export default async (req: any, res: any) => {
  if (!isAppInitialized) {
    if (!initPromise) {
      initPromise = bootstrap();
    }
    await initPromise;
  }
  server(req, res);
};

if (!process.env.VERCEL) {
  bootstrap().then(() => {
    const port = process.env.PORT || 4000;
    server.listen(port, () => {
      console.log(`Server running locally on port ${port}`);
    });
  });
}


