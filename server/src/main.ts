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
  // 1. Trust Proxy (Crucial for Throttler and secure cookies on Vercel)
  // This tells Express to trust the headers set by Vercel's proxy (like x-forwarded-proto)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // 2. Cookie Parser Middleware
  app.use(cookieParser());

  // 3. CORS Configuration
  const corsOrigin = process.env.CORS_ORIGIN;

  app.enableCors({
    // Important: origin cannot be '*' when credentials is true
    origin: corsOrigin
      ? corsOrigin.split(',').map((o) => o.trim())
      : ['http://localhost:5173'], // Default dev fallback
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'x-skip-toast',
      'Correlation-Id',
    ],
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
