import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupportTicketDto, UpdateSupportTicketDto, CreateTicketMessageDto } from './dto/support-ticket.dto';
import { TicketStatus, TicketType, TicketPriority } from '@prisma/client';

@Injectable()
export class SupportTicketService {
  constructor(private prisma: PrismaService) {}

  // Generate a random ticket number like CLZ-T-1042
  private generateTicketNumber(): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `CLZ-T-${random}`;
  }

  private ticketRateLimits = new Map<string, { count: number, resetAt: number }>();

  async create(dto: CreateSupportTicketDto, ipAddress?: string) {
    if (dto.website) {
      return { success: true };
    }

    // Rate limiting: 5 per IP per hour
    if (ipAddress) {
      const now = Date.now();
      let limit = this.ticketRateLimits.get(ipAddress);
      if (!limit || limit.resetAt < now) {
        limit = { count: 0, resetAt: now + 3600 * 1000 };
      }
      if (limit.count >= 5) {
        throw new BadRequestException('Rate limit exceeded');
      }
      limit.count++;
      this.ticketRateLimits.set(ipAddress, limit);
    }

    if (dto.type === TicketType.COMPLAINT && !dto.category) {
      throw new BadRequestException('Category is required for complaints');
    }

    let ticketNumber = this.generateTicketNumber();
    
    // Ensure uniqueness
    let isUnique = false;
    while (!isUnique) {
      const exists = await this.prisma.supportTicket.findUnique({ where: { ticketNumber } });
      if (!exists) {
        isUnique = true;
      } else {
        ticketNumber = this.generateTicketNumber();
      }
    }

    const stripHtml = (text?: string) => text ? text.replace(/<[^>]*>?/gm, '') : text;

    let priority: TicketPriority = TicketPriority.NORMAL;
    if (dto.type === TicketType.COMPLAINT && (dto.category === 'DAMAGE' || dto.category === 'LOST_ITEM')) {
      priority = TicketPriority.HIGH;
    }

    let matchedLeadId: number | undefined = undefined;
    if (dto.orderNumber) {
      const lead = await this.prisma.lead.findUnique({ where: { leadNumber: dto.orderNumber } });
      if (lead && lead.customerPhone === dto.phone) {
        matchedLeadId = lead.id;
      }
    }

    const created = await this.prisma.supportTicket.create({
      data: {
        type: dto.type || TicketType.ENQUIRY,
        priority,
        category: dto.category,
        name: stripHtml(dto.name) || '',
        phone: dto.phone,
        email: stripHtml(dto.email),
        subject: stripHtml(dto.subject),
        message: stripHtml(dto.message) || '',
        leadId: matchedLeadId,
        ticketNumber,
        ipAddress,
        status: TicketStatus.PENDING,
      },
    });

    return { ticketNumber: created.ticketNumber, type: created.type };
  }

  async findAll(query?: { type?: TicketType; status?: TicketStatus }) {
    const where: any = {};
    if (query?.type) where.type = query.type;
    if (query?.status) where.status = query.status;

    return this.prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: {
          select: { id: true, name: true, profilePic: true }
        }
      }
    });
  }

  async findOne(id: number) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, profilePic: true }
        },
        lead: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { id: true, name: true, profilePic: true }
            }
          }
        }
      }
    });
    
    if (!ticket) throw new NotFoundException('Support ticket not found');
    return ticket;
  }

  async update(id: number, dto: UpdateSupportTicketDto) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Support ticket not found');

    const updateData: any = { ...dto };
    
    if (dto.status) {
      if (dto.status === TicketStatus.RESOLVED && ticket.status !== TicketStatus.RESOLVED) {
        updateData.resolvedAt = new Date();
      }
      if (dto.status === TicketStatus.CLOSED && ticket.status !== TicketStatus.CLOSED) {
        updateData.closedAt = new Date();
      }
    }

    return this.prisma.supportTicket.update({
      where: { id },
      data: updateData,
    });
  }

  async getCommandCenterStats(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activeStatuses = [TicketStatus.PENDING, TicketStatus.IN_PROGRESS, TicketStatus.WAITING_CUSTOMER];

    const [totalActive, pendingEnquiries, pendingComplaints] = await Promise.all([
      this.prisma.supportTicket.count({
        where: { status: { in: activeStatuses } }
      }),
      this.prisma.supportTicket.count({
        where: { type: TicketType.ENQUIRY, status: TicketStatus.PENDING }
      }),
      this.prisma.supportTicket.count({
        where: { type: TicketType.COMPLAINT, status: TicketStatus.PENDING }
      })
    ]);

    const recentTickets = await this.prisma.supportTicket.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, type: true }
    });

    const trendMap = new Map<string, { enquiries: number, complaints: number }>();
    
    // Initialize 0s
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      trendMap.set(dateStr, { enquiries: 0, complaints: 0 });
    }

    recentTickets.forEach(t => {
      const dateStr = t.createdAt.toISOString().split('T')[0];
      if (trendMap.has(dateStr)) {
        const stats = trendMap.get(dateStr)!;
        if (t.type === TicketType.ENQUIRY) stats.enquiries++;
        if (t.type === TicketType.COMPLAINT) stats.complaints++;
      }
    });

    const trendChart = Array.from(trendMap.entries())
      .map(([date, stats]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rawDate: date,
        ...stats 
      }))
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate));

    return {
      kpis: {
        totalActive,
        pendingEnquiries,
        pendingComplaints
      },
      trendChart
    };
  }

  async addMessage(ticketId: number, authorId: number | null, authorType: 'CUSTOMER' | 'STAFF', dto: CreateTicketMessageDto) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('Support ticket not found');

    return this.prisma.ticketMessage.create({
      data: {
        ...dto,
        ticketId,
        authorId,
        authorType,
      }
    });
  }
}
