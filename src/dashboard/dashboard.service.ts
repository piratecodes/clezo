import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeadStatus, ServiceMode } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary(query: any) {
    const { range, from, to } = query;
    const now = new Date();
    let startDate = new Date();
    
    if (range === 'custom') {
      if (!from || !to) throw new BadRequestException('from and to dates required for custom range');
      startDate = new Date(from);
      const endDate = new Date(to);
      if (startDate > endDate) throw new BadRequestException('from must be before to');
      if (endDate > now) throw new BadRequestException('cannot query future dates');
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays > 366) throw new BadRequestException('max range is 366 days');
    } else if (range === '4w') {
      startDate.setDate(now.getDate() - 28);
    } else if (range === '3m') {
      startDate.setMonth(now.getMonth() - 3);
    } else if (range === '6m') {
      startDate.setMonth(now.getMonth() - 6);
    } else {
      // default 7d
      startDate.setDate(now.getDate() - 7);
    }

    const previousStartDate = new Date(startDate);
    const duration = now.getTime() - startDate.getTime();
    previousStartDate.setTime(startDate.getTime() - duration);

    // Fetch data for current period
    const leadsCreated = await this.prisma.lead.count({
      where: { createdAt: { gte: startDate, lte: now } }
    });
    
    const prevLeadsCreated = await this.prisma.lead.count({
      where: { createdAt: { gte: previousStartDate, lt: startDate } }
    });

    const activeOrders = await this.prisma.lead.count({
      where: { status: { in: ['CONFIRMED', 'PICKED_UP', 'RECEIVED_AT_STORE', 'PROCESSING', 'READY', 'OUT_FOR_DELIVERY'] } }
    });

    const pendingQuotes = await this.prisma.lead.count({
      where: { status: 'PENDING_QUOTE' }
    });

    // Completed value
    const completedHistory = await this.prisma.leadStatusHistory.findMany({
      where: { 
        toStatus: { in: ['DELIVERED', 'COLLECTED'] },
        createdAt: { gte: startDate, lte: now } 
      },
      include: { lead: { select: { total: true } } }
    });
    
    const completedValue = completedHistory.reduce((sum, h) => sum + (Number(h.lead?.total) || 0), 0);
    const completedOrders = completedHistory.length;

    const prevCompletedHistory = await this.prisma.leadStatusHistory.findMany({
      where: { 
        toStatus: { in: ['DELIVERED', 'COLLECTED'] },
        createdAt: { gte: previousStartDate, lt: startDate } 
      },
      include: { lead: { select: { total: true } } }
    });
    const prevCompletedValue = prevCompletedHistory.reduce((sum, h) => sum + (Number(h.lead?.total) || 0), 0);
    const prevCompletedOrders = prevCompletedHistory.length;

    // Cancellations
    const cancelledOrders = await this.prisma.leadStatusHistory.count({
      where: { toStatus: 'CANCELLED', createdAt: { gte: startDate, lte: now } }
    });
    
    const cancellationRate = (completedOrders + cancelledOrders) > 0 ? (cancelledOrders / (completedOrders + cancelledOrders)) * 100 : 0;
    
    const avgOrderValue = completedOrders > 0 ? completedValue / completedOrders : 0;

    // Open Tickets
    const openTickets = await this.prisma.supportTicket.count({
      where: { status: { in: ['PENDING', 'IN_PROGRESS', 'WAITING_CUSTOMER'] } }
    });
    const openComplaints = await this.prisma.supportTicket.count({
      where: { type: 'COMPLAINT', status: { in: ['PENDING', 'IN_PROGRESS', 'WAITING_CUSTOMER'] } }
    });

    // Mode Split (created in range)
    const storeVisitCount = await this.prisma.lead.count({ where: { serviceMode: 'STORE_VISIT', createdAt: { gte: startDate, lte: now } } });
    const pickupDropCount = await this.prisma.lead.count({ where: { serviceMode: 'PICKUP_DROP', createdAt: { gte: startDate, lte: now } } });

    // Raw Lead Creation for chart
    const leadsRaw = await this.prisma.lead.findMany({
      where: { createdAt: { gte: startDate, lte: now } },
      select: { createdAt: true, serviceMode: true }
    });
    const prevLeadsRaw = await this.prisma.lead.findMany({
      where: { createdAt: { gte: previousStartDate, lt: startDate } },
      select: { createdAt: true, serviceMode: true }
    });

    // Today Action Lists
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const pickupsWhereClause = {
      serviceMode: ServiceMode.PICKUP_DROP, 
      pickupDate: { gte: todayStart, lt: todayEnd },
      status: { in: [LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.PENDING_QUOTE, LeadStatus.QUOTED, LeadStatus.CONFIRMED] }
    };

    const pickups = await this.prisma.lead.findMany({
      where: pickupsWhereClause as any,
      take: 8,
      include: { items: true }
    });
    const pickupsCount = await this.prisma.lead.count({
      where: pickupsWhereClause as any
    });

    const ready = await this.prisma.lead.findMany({
      where: { status: 'READY' },
      take: 8
    });
    const readyCount = await this.prisma.lead.count({ where: { status: 'READY' } });

    const overdueWhereClause = {
      OR: [
        {
          serviceMode: ServiceMode.STORE_VISIT,
          expectedVisitAt: { lt: now },
          status: { in: [LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.PENDING_QUOTE, LeadStatus.QUOTED, LeadStatus.CONFIRMED] }
        },
        {
          serviceMode: ServiceMode.PICKUP_DROP,
          pickupDate: { lt: now },
          status: { in: [LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.PENDING_QUOTE, LeadStatus.QUOTED, LeadStatus.CONFIRMED] }
        }
      ]
    };

    const overdue = await this.prisma.lead.findMany({
      where: overdueWhereClause as any,
      take: 8
    });
    const overdueCount = await this.prisma.lead.count({
      where: overdueWhereClause as any
    });

    const pendingQuotesList = await this.prisma.lead.findMany({
      where: { status: 'PENDING_QUOTE' },
      orderBy: { createdAt: 'asc' },
      take: 8
    });

    return {
      kpis: {
        leads: { current: leadsCreated, previous: prevLeadsCreated },
        activeOrders,
        pendingQuotes,
        completedValue: { current: completedValue, previous: prevCompletedValue },
        completedOrders: { current: completedOrders, previous: prevCompletedOrders },
        cancelledOrders,
        cancellationRate,
        avgOrderValue,
        openTickets,
        openComplaints
      },
      raw: {
        startDate,
        now,
        previousStartDate,
        leadsRaw,
        prevLeadsRaw
      },
      modeSplit: {
        storeVisit: storeVisitCount,
        pickupDrop: pickupDropCount
      },
      today: {
        pickups: { rows: pickups, count: pickupsCount },
        ready: { rows: ready, count: readyCount },
        overdue: { rows: overdue, count: overdueCount },
        pendingQuotes: { rows: pendingQuotesList, count: pendingQuotes }
      }
    };
  }
}
