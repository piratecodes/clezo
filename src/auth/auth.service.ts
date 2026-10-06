import { Injectable, ForbiddenException, BadRequestException, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { SetupAdminDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  private async getTokens(adminId: number, sessionId: string) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id: adminId, sessionId },
        {
          secret: jwtSecret,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { id: adminId, sessionId },
        {
          secret: jwtSecret,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async createSession(adminId: number, refreshToken: string, deviceInfo?: string, ipAddress?: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await this.prisma.session.create({
      data: {
        adminId,
        refreshTokenHash: hashedRefreshToken,
        deviceInfo,
        ipAddress,
        expiresAt,
      },
    });

    return session.id;
  }

  private async updateSessionToken(sessionId: string, newRefreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        refreshTokenHash: hashedRefreshToken,
        lastActive: new Date(),
        expiresAt,
      },
    });
  }

  async setupFirstAdmin(dto: SetupAdminDto) {
    const adminExists = await this.prisma.admin.findFirst();
    if (adminExists) {
      throw new ForbiddenException('An admin already exists. Please log in.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const newAdmin = await this.prisma.admin.create({
      data: {
        name: dto.name,
        username: dto.username,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        designation: 'Founder / CEO',
      },
    });

    const { password, ...adminData } = newAdmin;
    return { admin: adminData };
  }

  async login(dto: LoginDto, deviceInfo?: string, ipAddress?: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { username: dto.username },
    });

    if (!admin || !(await bcrypt.compare(dto.password, admin.password))) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    if (!admin.isActive) {
      throw new ForbiddenException('This account has been deactivated. Contact the Super Admin.');
    }

    // 1. Generate temp session ID
    const tempSessionId = crypto.randomUUID();

    // 2. Generate tokens with this session ID
    const tokens = await this.getTokens(admin.id, tempSessionId);

    // 3. Create session in DB but force its ID to be tempSessionId
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await this.prisma.session.create({
      data: {
        id: tempSessionId,
        adminId: admin.id,
        refreshTokenHash: hashedRefreshToken,
        deviceInfo,
        ipAddress,
        expiresAt,
      },
    });

    const { password, ...adminData } = admin;

    return { ...tokens, admin: adminData };
  }

  async logout(sessionId: string) {
    try {
      await this.prisma.session.delete({
        where: { id: sessionId },
      });
    } catch (e) {
      // Ignored if session already deleted
    }
  }

  async refreshTokens(adminId: number, sessionId: string, refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.adminId !== adminId) {
      throw new ForbiddenException('Access Denied: Invalid Session');
    }

    if (session.expiresAt < new Date()) {
      throw new ForbiddenException('Access Denied: Session Expired');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!refreshTokenMatches) {
      // Possible token theft/replay! Revoke session to be safe.
      await this.logout(sessionId);
      throw new ForbiddenException('Access Denied: Invalid Token');
    }

    const tokens = await this.getTokens(adminId, sessionId);
    await this.updateSessionToken(sessionId, tokens.refreshToken);

    return tokens;
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    if (!admin) {
      throw new NotFoundException('There is no user with that email address.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    });

    const adminUrl = process.env.ADMIN_PANEL_URL || 'http://localhost:5173';
    const resetURL = `${adminUrl}/reset-password/${resetToken}`;
    
    await this.mailService.sendPasswordResetEmail(admin.email, admin.username || 'Admin', resetToken);

    return { message: 'Password reset link has been sent to your email address.' };
  }

  async resetPassword(token: string, dto: ResetPasswordDto) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const admin = await this.prisma.admin.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!admin) {
      throw new BadRequestException('Token is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const updatedAdmin = await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    // Delete all old sessions for security
    await this.prisma.session.deleteMany({
      where: { adminId: updatedAdmin.id },
    });

    const tempSessionId = crypto.randomUUID();
    const tokens = await this.getTokens(updatedAdmin.id, tempSessionId);
    
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.session.create({
      data: {
        id: tempSessionId,
        adminId: updatedAdmin.id,
        refreshTokenHash: hashedRefreshToken,
        deviceInfo: 'Password Reset Login',
        expiresAt,
      },
    });

    const { password: pw, ...adminData } = updatedAdmin;

    return { ...tokens, admin: adminData };
  }

  async updatePassword(adminId: number, dto: any, currentSessionId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const passwordMatches = await bcrypt.compare(dto.currentPassword, admin.password);
    if (!passwordMatches) {
      throw new BadRequestException('Incorrect current password');
    }

    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedNewPassword },
    });

    if (dto.logoutOtherDevices) {
      await this.prisma.session.deleteMany({
        where: {
          adminId,
          id: { not: currentSessionId },
        },
      });
    }

    return { message: 'Password updated successfully' };
  }
}
