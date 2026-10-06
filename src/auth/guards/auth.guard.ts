import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);
    
    if (!token) {
      throw new UnauthorizedException('You are not logged in! Please log in to get access.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const [currentUser, session] = await Promise.all([
        this.prisma.admin.findUnique({
          where: { id: payload.id },
        }),
        payload.sessionId ? this.prisma.session.findUnique({
          where: { id: payload.sessionId },
        }) : Promise.resolve(null)
      ]);

      if (!session && payload.sessionId) {
        throw new UnauthorizedException('Your session has been revoked or expired.');
      }

      if (!currentUser) {
        throw new UnauthorizedException('The user belonging to this token no longer exists.');
      }

      if (!currentUser.isActive) {
        throw new UnauthorizedException('This user account is deactivated.');
      }

      request.user = { ...currentUser, sessionId: payload.sessionId };
    } catch {
      throw new UnauthorizedException('You are not logged in! Please log in to get access.');
    }
    return true;
  }

  private extractTokenFromRequest(request: any): string | undefined {
    // 1. Try to get token from HttpOnly cookies (via cookie-parser)
    if (request.cookies && request.cookies['access_token']) {
      return request.cookies['access_token'];
    }

    // 2. Fallback manual parsing (in case cookie-parser is missing/failing)
    if (request.headers && request.headers.cookie) {
      const match = request.headers.cookie.match(/(?:^|;)\s*access_token=([^;]+)/);
      if (match) return match[1];
    }

    // 3. Fallback to Authorization Bearer header
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
