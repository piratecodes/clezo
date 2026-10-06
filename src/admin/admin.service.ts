import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { MailService } from '@/mail/mail.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/admin.dto';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import { Role } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async getDashboardStats() {
    const totalLeads = await this.prisma.lead.count({ where: { status: { not: 'CANCELLED' } } });
    const newLeads = await this.prisma.lead.count({ where: { status: 'NEW' } });
    const activeCities = await this.prisma.serviceCategory.count({ where: { isActive: true } });
    const totalStaff = await this.prisma.admin.count({ where: { isActive: true } });

    return { totalLeads, newLeads, activeCities, totalStaff };
  }

  async createStaff(dto: CreateStaffDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const newStaff = await this.prisma.admin.create({
      data: {
        ...dto,
        password: hashedPassword,
        role: dto.role || 'SALES_AGENT',
      },
    });

    const { password, ...staffData } = newStaff;

    // Send the welcome email in the background
    this.mailService.sendWelcomeEmail(dto.email, dto.name, dto.username, newStaff.role)
      .catch(err => console.error("Failed to send welcome email:", err));

    return staffData;
  }

  async getAllAdmins(all: boolean = false) {
    const where = all ? {} : { isActive: true };
    const staff = await this.prisma.admin.findMany({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        designation: true,
        role: true,
        isActive: true,
        createdAt: true,
        profilePic: true,
      },
    });
    return staff;
  }

  async getAdminById(id: number) {
    const staff = await this.prisma.admin.findUnique({
      where: { id },
    });
    if (!staff) {
      throw new NotFoundException('No staff member found with that ID');
    }
    const { password, ...staffData } = staff;
    return staffData;
  }

  async updateStaff(id: number, dto: UpdateStaffDto, currentRole: Role, file?: Express.Multer.File) {
    // If not super-admin, strip role and isActive
    if (currentRole !== 'SUPER_ADMIN') {
      delete dto.role;
      delete dto.isActive;
    }

    if (file) {
      // 1. Upload to Cloudinary using memory buffer
      const folder = process.env.NODE_ENV === 'production' ? 'clezo/admins' : 'dev/admins';
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      
      dto.profilePic = (uploadResult as any).secure_url;
      
      // 2. Delete old image (Cloudinary or local)
      const oldUser = await this.prisma.admin.findUnique({ where: { id } });
      if (oldUser?.profilePic && oldUser.profilePic !== 'default-avatar.png') {
        if (oldUser.profilePic.includes('cloudinary.com')) {
          try {
            const parts = oldUser.profilePic.split('/upload/');
            if (parts.length > 1) {
              let pathString = parts[1];
              if (pathString.match(/^v\d+\//)) {
                pathString = pathString.substring(pathString.indexOf('/') + 1);
              }
              const publicId = pathString.substring(0, pathString.lastIndexOf('.'));
              await cloudinary.uploader.destroy(publicId);
            }
          } catch (e) {
            console.error('Failed to delete old cloudinary image', e);
          }
        } else if (!oldUser.profilePic.startsWith('http')) {
          const oldImagePath = path.join(process.cwd(), 'public', 'uploads', oldUser.profilePic);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }
    }

    const updatedStaff = await this.prisma.admin.update({
      where: { id },
      data: dto,
    });
    const { password, ...staffData } = updatedStaff;
    return staffData;
  }

  async deactivateStaff(id: number, currentUserId: number) {
    if (id === currentUserId) {
      throw new ForbiddenException('Action denied. You cannot deactivate your own account!');
    }
    return this.prisma.admin.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async deleteStaff(id: number, currentUserId: number) {
    if (id === currentUserId) {
      throw new ForbiddenException('Action denied. You cannot delete your own account!');
    }
    return this.prisma.admin.delete({ where: { id } });
  }

  async getLeadsHistory() {
    // In PostgreSQL / Prisma, we do group by
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); 
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const result = await this.prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM "createdAt") as month, 
        EXTRACT(YEAR FROM "createdAt") as year,
        COUNT(*) as leads
      FROM "Lead"
      WHERE "createdAt" >= ${sixMonthsAgo}
      GROUP BY year, month
      ORDER BY year ASC, month ASC
    `;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return (result as any[]).map((item) => ({
      month: monthNames[item.month - 1],
      leads: Number(item.leads),
    }));
  }
}
