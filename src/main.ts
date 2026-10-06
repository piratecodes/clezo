import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { winstonLogger } from './common/logger/winston.logger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: winstonLogger,
  });

  // Enable trust proxy for Nginx/VPS reverse proxies (needed for rate-limit)
  app.set('trust proxy', 1);

  // Enable Cookie Parser
  app.use(cookieParser());

  // Serve static files from the "public/uploads" directory at "/uploads"
  app.useStaticAssets(join(process.cwd(), 'public', 'uploads'), {
    prefix: '/uploads/',
  });

  // Security Headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // CORS
  const allowedOrigins = [
    'https://clezo.in',
    'https://www.clezo.in',
    'https://staging.clezo.in',
    'https://admin.clezo.in',
    'https://api.clezo.in',
    // Local development origins
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:5000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Rate Limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
    }),
  );

  // Global Prefix for API
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global Pipes & Filters
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.useGlobalFilters(new AllExceptionsFilter());

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  console.log(`🚀 Clezo Express Laundry Gateway is running on: ${await app.getUrl()}`);
  console.log(`📚 Access the API Docs at: ${await app.getUrl()}/api/docs`);
}
bootstrap();

// Trigger restart

// Trigger restart for Prisma Client & Rate Limiter
// Trigger restart for Prisma Client & Rate Limiter & Cookie Config
