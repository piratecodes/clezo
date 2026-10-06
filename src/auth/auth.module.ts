import { Module, Global, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import rateLimit from 'express-rate-limit';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        rateLimit({
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 10, // Limit each IP to 10 login requests per 15 minutes
          message: 'Too many login attempts from this IP, please try again after 15 minutes.',
        }),
      )
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });
  }
}
