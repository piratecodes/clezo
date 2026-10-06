import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async getActiveSessions(adminId: number) {
    const sessions = await this.prisma.session.findMany({
      where: { adminId },
      orderBy: { lastActive: 'desc' },
      select: {
        id: true,
        deviceInfo: true,
        ipAddress: true,
        lastActive: true,
        createdAt: true,
      },
    });

    return sessions;
  }

  async revokeSession(adminId: number, sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.adminId !== adminId) {
      throw new ForbiddenException('You do not have permission to revoke this session');
    }

    await this.prisma.session.delete({
      where: { id: sessionId },
    });
  }

  async revokeAllOtherSessions(adminId: number, currentSessionId: string) {
    await this.prisma.session.deleteMany({
      where: {
        adminId,
        id: { not: currentSessionId },
      },
    });
  }

  // --- GLOBAL STAFF SESSIONS MANAGEMENT ---
  
  private async checkHierarchy(actingAdminId: number, targetAdminId: number) {
    if (actingAdminId === targetAdminId) return true; // Can always manage oneself

    const actingAdmin = await this.prisma.admin.findUnique({ where: { id: actingAdminId } });
    const targetAdmin = await this.prisma.admin.findUnique({ where: { id: targetAdminId } });

    if (!actingAdmin || !targetAdmin) {
      throw new NotFoundException('Admin not found');
    }

    if (actingAdmin.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only Super Admins can manage other users\' sessions');
    }

    return true;
  }

  async getAdminSessions(actingAdminId: number, targetAdminId: number) {
    await this.checkHierarchy(actingAdminId, targetAdminId);

    const sessions = await this.prisma.session.findMany({
      where: { adminId: targetAdminId },
      orderBy: { lastActive: 'desc' },
      select: {
        id: true,
        deviceInfo: true,
        ipAddress: true,
        lastActive: true,
        createdAt: true,
      },
    });

    return sessions;
  }

  async revokeAdminSession(actingAdminId: number, targetAdminId: number, sessionId: string) {
    await this.checkHierarchy(actingAdminId, targetAdminId);

    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.adminId !== targetAdminId) {
      throw new NotFoundException('Session not found for this user');
    }

    await this.prisma.session.delete({
      where: { id: sessionId },
    });
  }
}
