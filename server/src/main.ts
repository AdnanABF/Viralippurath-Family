import { ValidationPipe, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import cookieParser from 'cookie-parser';

// Create the express instance for Vercel
const server = express();
let cachedNestApp: any;

/**
 * Shared setup logic for both Local and Production
 */
async function setupApp(app: INestApplication) {
  // 1. Trust Proxy (Crucial for Throttler on Vercel)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // 2. Cookie Parser Middleware
  // Required to read cookies from incoming requests
  app.use(cookieParser());

  // 3. CORS Configuration
  const corsOrigin = process.env.CORS_ORIGIN;
  app.enableCors({
    // When using credentials: true, origin cannot be '*'
    origin: corsOrigin ? corsOrigin.split(',').map((o) => o.trim()) : [],
    credentials: true, // Required for cookies to be sent/received
    maxAge: 86400,
  });

  // 4. Global Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}

/**
 * Vercel Entry Point
 */
export const bootstrapVercel = async () => {
  if (!cachedNestApp) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    await setupApp(app);
    await app.init();
    cachedNestApp = server;
  }
  return cachedNestApp;
};

/**
 * Local Development Entry Point
 */
if (process.env.NODE_ENV !== 'production') {
  async function bootstrapLocal() {
    const app = await NestFactory.create(AppModule);
    await setupApp(app);

    // Default to 3000 if PORT is not defined
    const port = process.env.PORT || 3000;

    await app.listen(port);
    console.log(`🚀 Local Server running on http://localhost:${port}`);
  }
  bootstrapLocal();
}

// Vercel Default Export
export default async (req: any, res: any) => {
  const app = await bootstrapVercel();
  app(req, res);
};
