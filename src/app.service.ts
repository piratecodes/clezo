import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  private trackRateLimits = new Map<string, { count: number, resetAt: number }>();

  // 1. The Lightweight Gateway Check (for /api)
  getGatewayStatus() {
    return {
      system: "Clezo Express Laundry Gateway",
      status: "online 🟢",
      message: "Watchdog is awake and secure.",
      developer: {
        agency: "Straxcel Business Solutions",
        website: "https://straxcel.com"
      },
      timestamp: new Date().toISOString(),
    };
  }

  // 2. The Detailed V1 Engine Check (for /api/v1)
  getV1EngineStatus() {
    return {
      success: true,
      system: "Clezo Express Laundry Core API v1",
      status: "operational 🟢",
      version: "1.0.0",
      message: "Watchdog is awake and secure.",
      developer: {
        agency: "Straxcel Business Solutions",
        website: "https://straxcel.com"
      },
      timestamp: new Date().toISOString(),
    };
  }

  async trackStatus(ref: string, phone: string, ipAddress?: string) {
    if (!ref || !phone) throw new NotFoundException('Not found');

    if (ipAddress) {
      const now = Date.now();
      let limit = this.trackRateLimits.get(ipAddress);
      if (!limit || limit.resetAt < now) {
        limit = { count: 0, resetAt: now + 3600 * 1000 };
      }
      if (limit.count >= 10) {
        throw new BadRequestException('Rate limit exceeded');
      }
      limit.count++;
      this.trackRateLimits.set(ipAddress, limit);
    }

    if (ref.startsWith('CLZ-T-')) {
      const ticket = await this.prisma.supportTicket.findUnique({ 
        where: { ticketNumber: ref },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      });
      if (!ticket || ticket.phone !== phone) throw new NotFoundException('Not found');
      return { 
        type: 'ticket', 
        number: ticket.ticketNumber, 
        status: ticket.status, 
        createdAt: ticket.createdAt,
        messages: ticket.messages.filter(m => !m.isInternal).map(m => ({
          body: m.body,
          isAdmin: m.authorType !== 'CUSTOMER',
          createdAt: m.createdAt,
          attachments: m.attachments
        }))
      };
    } else {
      const lead = await this.prisma.lead.findUnique({ where: { leadNumber: ref } });
      if (!lead || lead.customerPhone !== phone) throw new NotFoundException('Not found');
      return { type: 'order', number: lead.leadNumber, status: lead.status, mode: lead.serviceMode, createdAt: lead.createdAt };
    }
  }

  generateCloudinarySignature(paramsToSign: any) {
    const apiSecret = cloudinary.config().api_secret;
    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret || '');
    return { signature };
  }

  async deleteCloudinaryImage(imageUrl: string) {
    try {
      if (!imageUrl) return { success: true };
      const splitUrl = imageUrl.split('/');
      const uploadIndex = splitUrl.findIndex((part) => part === 'upload');
      const publicIdWithExtension = splitUrl.slice(uploadIndex + 2).join('/');
      const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
      await cloudinary.uploader.destroy(publicId);
      return { success: true };
    } catch (err) {
      console.error('Cloudinary deletion error:', err);
      return { success: false };
    }
  }
}