import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto, UpdateLeadStatusDto } from './dto/lead.dto';
import { LEAD_TRANSITIONS, ALL_MODE_STATUSES } from './lead.config';

@Injectable()
export class LeadService {
  constructor(private prisma: PrismaService) {}

  async createLead(dto: CreateLeadDto) {
    const { items, pickupDate, ...rest } = dto;
    const leadNumber = 'CLZ-' + Math.floor(100000 + Math.random() * 900000).toString();
    
    const leadData: any = {
      ...rest,
      leadNumber,
      status: rest.source === 'WALK_IN' ? 'RECEIVED_AT_STORE' : 'NEW',
    };

    if (pickupDate) {
      leadData.pickupDate = new Date(pickupDate);
    }

    if (items && items.length > 0) {
      leadData.items = {
        create: items,
      };
    }

    const lead = await this.prisma.lead.create({
      data: leadData,
      include: {
        items: true,
      },
    });

    // Create history
    await this.prisma.leadStatusHistory.create({
      data: {
        leadId: lead.id,
        toStatus: leadData.status,
      }
    });

    return lead;
  }

  async createAdminLead(dto: CreateLeadDto, adminId: number) {
    const { items, pickupDate, forceSave, initialStatus, ...rest } = dto;
    const leadNumber = 'CLZ-' + Math.floor(100000 + Math.random() * 900000).toString();
    
    const leadData: any = {
      ...rest,
      leadNumber,
      status: initialStatus || (rest.serviceMode === 'PICKUP_DROP' ? 'CONFIRMED' : 'RECEIVED_AT_STORE'),
      assignedToId: String(adminId),
    };

    if (rest.serviceMode === 'PICKUP_DROP') {
      if (!rest.pincode || !rest.addressLine || !rest.locality || !pickupDate) {
        throw new Error('Pickup & Drop requires address, locality, pincode, and pickup date.');
      }
      const serviceArea = await this.prisma.serviceArea.findUnique({ where: { pincode: rest.pincode } });
      const isValidLocality = serviceArea?.localities.includes(rest.locality) || (serviceArea?.localities.length === 0 && serviceArea?.areaName === rest.locality);
      if (!serviceArea || !serviceArea.isActive || !isValidLocality) {
        throw new Error(`Pincode ${rest.pincode} or locality ${rest.locality} is not serviceable.`);
      }
      leadData.serviceAreaId = serviceArea.id;
      leadData.pickupDate = new Date(pickupDate);

      // Duplicate Check
      if (!forceSave) {
        const startOfDay = new Date(leadData.pickupDate);
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date(leadData.pickupDate);
        endOfDay.setHours(23,59,59,999);
        const existing = await this.prisma.lead.findFirst({
          where: {
            customerPhone: rest.customerPhone,
            pickupDate: { gte: startOfDay, lte: endOfDay }
          }
        });
        if (existing) {
          throw new Error('DUPLICATE_WARNING: A lead with this phone number and pickup date already exists. Enable forceSave to bypass.');
        }
      }
    } else if (rest.expectedVisitAt) {
      leadData.expectedVisitAt = new Date(rest.expectedVisitAt);
    }

    if (items && items.length > 0) {
      const processedItems: any[] = [];
      let calculatedSubtotal = 0;

      for (const item of items) {
        let finalPrice = item.price;
        // Re-calculate price if not overridden
        if (item.itemId && !item.overrideReason) {
          const option = await this.prisma.serviceOption.findUnique({ where: { id: item.itemId } });
          if (option) {
            finalPrice = (option.isOfferActive && option.offerPrice != null) ? option.offerPrice : (option.basePrice || 0);
          }
        }
        
        const totalPrice = finalPrice * item.quantity;
        calculatedSubtotal += totalPrice;
        
        processedItems.push({
          itemName: item.itemName || 'Unknown Item',
          serviceName: item.serviceName || 'Unknown Service',
          serviceId: item.serviceId,
          itemId: item.itemId,
          unitPrice: finalPrice,
          quantity: item.quantity,
          brand: item.brand,
          notes: item.notes,
          images: item.images || [],
          quoteStatus: item.quoteStatus || 'NOT_REQUIRED'
        });
      }
      
      leadData.items = { create: processedItems };
      
      // Override total logic from backend
      leadData.subtotal = calculatedSubtotal;
      let calculatedDiscount = rest.discount || 0;
      if (rest.discountType === 'PERCENTAGE') {
        calculatedDiscount = calculatedSubtotal * (rest.discount || 0) / 100;
      }
      leadData.total = Math.max(0, calculatedSubtotal - calculatedDiscount);
    }

    // Force PENDING_QUOTE if any item is marked PENDING
    if (leadData.items?.create?.some(i => i.quoteStatus === 'PENDING')) {
      leadData.status = 'PENDING_QUOTE';
    }

    const lead = await this.prisma.lead.create({
      data: leadData,
      include: {
        items: true,
      },
    });

    await this.prisma.leadStatusHistory.create({
      data: {
        leadId: lead.id,
        toStatus: leadData.status,
        changedBy: String(adminId),
        note: 'Lead created by Admin',
      }
    });

    return lead;
  }

  async getAllLeads(query: any) {
    const { 
      search, mode, status, source, pincode, quoteStatus, 
      createdFrom, createdTo, pickupFrom, pickupTo, 
      visitFrom, visitTo, page = 1, limit = 50 
    } = query;

    // Validation
    if (mode && mode !== 'All' && status && status !== 'All') {
      const allowedStatuses = LEAD_TRANSITIONS[mode as keyof typeof LEAD_TRANSITIONS];
      if (allowedStatuses && !Object.keys(allowedStatuses).includes(status)) {
        throw new BadRequestException(`Status ${status} is not valid for mode ${mode}`);
      }
    }

    const where: any = {};

    // Mode & Status
    if (mode && mode !== 'All') {
      where.serviceMode = mode;
    }
    
    if (status && status !== 'All') {
      where.status = status;
    } else if (!status || status === 'All') {
      where.status = { not: 'CANCELLED' };
    }

    // Other filters
    if (source && source !== 'All Sources') where.source = source;
    if (pincode && pincode !== 'All') where.pincode = pincode;
    
    // Quote Status (requires checking items)
    if (quoteStatus && quoteStatus !== 'Any') {
      where.items = { some: { quoteStatus } };
    }

    // Search
    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
        { leadNumber: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Date Filters
    if (createdFrom || createdTo) {
      where.createdAt = {};
      if (createdFrom) where.createdAt.gte = new Date(createdFrom);
      if (createdTo) where.createdAt.lte = new Date(createdTo);
    }
    if (pickupFrom || pickupTo) {
      where.pickupDate = {};
      if (pickupFrom) where.pickupDate.gte = new Date(pickupFrom);
      if (pickupTo) where.pickupDate.lte = new Date(pickupTo);
    }
    if (visitFrom || visitTo) {
      where.expectedVisitAt = {};
      if (visitFrom) where.expectedVisitAt.gte = new Date(visitFrom);
      if (visitTo) where.expectedVisitAt.lte = new Date(visitTo);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          history: { orderBy: { createdAt: 'desc' } }
        }
      }),
      this.prisma.lead.count({ where })
    ]);

    return { 
      data, 
      total, 
      page: Number(page), 
      limit: Number(limit) 
    };
  }

  async getLeadById(id: number) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        items: true,
        history: {
          orderBy: { createdAt: 'desc' },
        }
      }
    });
    if (!lead) {
      throw new NotFoundException('No lead found with that ID');
    }
    return lead;
  }

  async updateLead(id: number, dto: UpdateLeadDto, adminId?: number) {
    const existing = await this.prisma.lead.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('No lead found with that ID');

    const { items, pickupDate, expectedVisitAt, ...otherRest } = dto;
    const rest: any = { ...otherRest };
    if (pickupDate) rest.pickupDate = new Date(pickupDate);
    if (expectedVisitAt) rest.expectedVisitAt = new Date(expectedVisitAt);

    if (items) {
      let subtotal = 0;
      const processedItems = items.map(item => {
        const finalPrice = item.price || 0;
        const total = finalPrice * (item.quantity || 1);
        subtotal += total;
        return {
          itemName: item.itemName || 'Custom Item',
          serviceName: item.serviceName || 'Unknown Service',
          serviceId: item.serviceId,
          itemId: item.itemId,
          unitPrice: finalPrice,
          quantity: item.quantity,
          brand: item.brand,
          notes: item.notes,
          images: item.images || [],
          quoteStatus: item.quoteStatus || 'NOT_REQUIRED'
        };
      });

      let calculatedDiscount = existing.discount ? Number(existing.discount) : 0;
      if (existing.discountType === 'PERCENTAGE') {
        calculatedDiscount = subtotal * calculatedDiscount / 100;
      }
      const total = Math.max(0, subtotal - calculatedDiscount);

      return this.prisma.$transaction(async (tx) => {
        await tx.leadItem.deleteMany({ where: { leadId: id } });

        const lead = await tx.lead.update({
          where: { id },
          data: {
            ...rest,
            subtotal,
            total,
            items: { create: processedItems }
          },
          include: {
            items: true,
            history: { orderBy: { createdAt: 'desc' } }
          }
        });
        
        await tx.leadStatusHistory.create({
          data: {
            leadId: id,
            toStatus: lead.status,
            note: 'Admin dynamically updated ticket items and pricing',
            changedBy: adminId ? String(adminId) : null
          }
        });
        
        return lead;
      });
    }

    return this.prisma.lead.update({
      where: { id },
      data: rest,
      include: {
        items: true,
        history: {
          orderBy: { createdAt: 'desc' },
        }
      }
    });
  }

  async updateLeadStatus(id: number, adminId: number, dto: UpdateLeadStatusDto) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    // Validate Transition against all valid statuses for the mode
    const allowedStatuses = ALL_MODE_STATUSES[lead.serviceMode] || [];
    if (!allowedStatuses.includes(dto.status)) {
      throw new Error(`Invalid status ${dto.status} for service mode ${lead.serviceMode}`);
    }

    if (dto.status === 'CANCELLED' && (!dto.cancelReason || dto.cancelReason.trim().length < 3)) {
      throw new Error('A cancel reason of at least 3 characters is required to cancel a lead.');
    }

    // Perform Update
    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: {
        status: dto.status,
        cancelReason: dto.status === 'CANCELLED' ? dto.cancelReason : lead.cancelReason,
      },
      include: {
        items: true,
        history: {
          orderBy: { createdAt: 'desc' },
        }
      }
    });

    // Log History
    await this.prisma.leadStatusHistory.create({
      data: {
        leadId: lead.id,
        fromStatus: lead.status,
        toStatus: dto.status,
        changedBy: String(adminId),
        note: dto.note,
      }
    });

    return this.getLeadById(id);
  }

  async updateLeadHistory(leadId: number, historyId: number, createdAt: string) {
    const history = await this.prisma.leadStatusHistory.findUnique({
      where: { id: historyId }
    });

    if (!history || history.leadId !== leadId) {
      throw new NotFoundException('Timeline record not found');
    }

    await this.prisma.leadStatusHistory.update({
      where: { id: historyId },
      data: { createdAt: new Date(createdAt) }
    });

    return this.getLeadById(leadId);
  }

  async deleteLeadHistory(leadId: number, historyId: number) {
    const history = await this.prisma.leadStatusHistory.findUnique({
      where: { id: historyId }
    });

    if (!history || history.leadId !== leadId) {
      throw new NotFoundException('Timeline record not found');
    }

    // Delete the history record
    await this.prisma.leadStatusHistory.delete({
      where: { id: historyId }
    });

    // We must update the lead's current status to match the NEW latest history record
    const latestHistory = await this.prisma.leadStatusHistory.findFirst({
      where: { leadId },
      orderBy: { createdAt: 'desc' }
    });

    // If there is still a history record, revert to its toStatus. 
    // Otherwise, fallback to 'NEW' (or 'RECEIVED_AT_STORE' based on serviceMode but 'NEW' is safe fallback)
    const newStatus = latestHistory ? latestHistory.toStatus : 'NEW';

    await this.prisma.lead.update({
      where: { id: leadId },
      data: { status: newStatus as any }
    });

    return this.getLeadById(leadId);
  }

  async deleteLead(id: number) {
    // LeadStatusHistory and LeadItem have onDelete: Cascade in prisma so they get deleted too
    const lead = await this.prisma.lead.delete({
      where: { id },
    });
    if (!lead) {
      throw new NotFoundException('No lead found with that ID');
    }
    return lead;
  }
}
