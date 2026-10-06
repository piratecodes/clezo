import { Controller, Get, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { SessionService } from './session.service';
import { AuthGuard } from '@/auth/guards/auth.guard';
import type { Request } from 'express';

@Controller('sessions')
@UseGuards(AuthGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  async getActiveSessions(@Req() req: Request) {
    const adminId = (req as any).user.id;
    const currentSessionId = (req as any).user.sessionId;
    const sessions = await this.sessionService.getActiveSessions(adminId);
    
    return {
      success: true,
      data: {
        sessions,
        currentSessionId,
      },
    };
  }

  @Delete('others')
  async revokeAllOtherSessions(@Req() req: Request) {
    const adminId = (req as any).user.id;
    const currentSessionId = (req as any).user.sessionId;
    await this.sessionService.revokeAllOtherSessions(adminId, currentSessionId);
    return { success: true, message: 'All other sessions have been revoked.' };
  }

  @Delete(':id')
  async revokeSession(@Param('id') sessionId: string, @Req() req: Request) {
    const adminId = (req as any).user.id;
    await this.sessionService.revokeSession(adminId, sessionId);
    return { success: true, message: 'Session revoked successfully.' };
  }

  // --- GLOBAL STAFF SESSIONS MANAGEMENT ---
  @Get('admin/:adminId')
  async getAdminSessions(@Param('adminId') targetAdminId: string, @Req() req: Request) {
    const actingAdminId = (req as any).user.id;
    const currentSessionId = (req as any).user.sessionId;
    const sessions = await this.sessionService.getAdminSessions(actingAdminId, parseInt(targetAdminId, 10));
    
    return {
      success: true,
      data: { sessions, currentSessionId },
    };
  }

  @Delete('admin/:adminId/:sessionId')
  async revokeAdminSession(@Param('adminId') targetAdminId: string, @Param('sessionId') sessionId: string, @Req() req: Request) {
    const actingAdminId = (req as any).user.id;
    await this.sessionService.revokeAdminSession(actingAdminId, parseInt(targetAdminId, 10), sessionId);
    return { success: true, message: 'Session revoked successfully.' };
  }
}
