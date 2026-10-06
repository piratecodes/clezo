import { Controller, Post, Body, Get, Patch, Param, UseGuards, HttpCode, HttpStatus, Res, Req, UnauthorizedException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SetupAdminDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions: any = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax', // Use 'none' in prod for cross-origin, 'lax' for local
    };

    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  private clearCookies(res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions: any = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    };
    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);
  }

  @Post('setup')
  @HttpCode(HttpStatus.CREATED)
  async setupFirstAdmin(@Body() dto: SetupAdminDto) {
    const data = await this.authService.setupFirstAdmin(dto);
    return { success: true, message: 'Super Admin created successfully!', data };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = req.ip || req.socket.remoteAddress || 'Unknown IP';
    
    const { accessToken, refreshToken, admin } = await this.authService.login(dto, userAgent, ipAddress);
    this.setCookies(res, accessToken, refreshToken);
    return { success: true, message: 'Logged in successfully', data: { admin } };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionId = (req as any).user?.sessionId;
    if (sessionId) {
      await this.authService.logout(sessionId);
    }
    this.clearCookies(res);
    return { success: true, message: 'Logged out securely' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    let refreshToken = req.cookies?.['refresh_token'];
    
    // Fallback manual parsing if cookie-parser fails
    if (!refreshToken && req.headers.cookie) {
      const match = req.headers.cookie.match(/(?:^|;)\s*refresh_token=([^;]+)/);
      if (match) refreshToken = match[1];
    }
    
    // In a real scenario, you'd decode the JWT to get the user ID first, 
    // or rely on a guard. To keep it simple, we decode it manually.
    try {
      if (!refreshToken) {
        throw new UnauthorizedException('No refresh token');
      }

      const base64Payload = refreshToken.split('.')[1];
      if (!base64Payload) throw new Error('Invalid token');
      
      const payloadBuffer = Buffer.from(base64Payload, 'base64');
      const { id, sessionId } = JSON.parse(payloadBuffer.toString());

      if (!sessionId) {
        throw new UnauthorizedException('Invalid token format: Missing session ID');
      }

      const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshTokens(id, sessionId, refreshToken);
      this.setCookies(res, accessToken, newRefreshToken);
      return { success: true, message: 'Token refreshed' };
    } catch (error) {
      this.clearCookies(res);
      throw new UnauthorizedException(error.message || 'Session expired or revoked');
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getMe(@GetUser() user: any) {
    return { success: true, message: 'User is logged in', data: { admin: user } };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const data = await this.authService.forgotPassword(dto);
    return { success: true, message: 'Token sent to email!', data };
  }

  @Patch('reset-password/:token')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Param('token') token: string, @Body() dto: ResetPasswordDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, admin } = await this.authService.resetPassword(token, dto);
    this.setCookies(res, accessToken, refreshToken);
    return { success: true, message: 'Password reset successful. You are now logged in.', data: { admin } };
  }

  @UseGuards(AuthGuard)
  @Patch('update-password')
  async updatePassword(@Body() dto: any, @Req() req: Request) {
    const adminId = (req as any).user.id;
    const currentSessionId = (req as any).user.sessionId;
    const result = await this.authService.updatePassword(adminId, dto, currentSessionId);
    return { success: true, ...result };
  }
}
