import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceOptionDto, UpdateServiceOptionDto } from './dto/service-option.dto';

@Injectable()
export class ServiceOptionService {
  constructor(private prisma: PrismaService) {}

  async createOption(dto: CreateServiceOptionDto) {
    const createData = { ...dto } as any;
    const orderAction = createData.orderAction || 'push';

    if (dto.order) {
      if (orderAction === 'swap') {
        const itemToSwap = await this.prisma.serviceOption.findFirst({
          where: { serviceType: dto.serviceType, order: dto.order }
        });
        if (itemToSwap) {
          const maxOrderObj = await this.prisma.serviceOption.aggregate({
            where: { serviceType: dto.serviceType },
            _max: { order: true }
          });
          const nextOrder = (maxOrderObj._max.order || 0) + 1;
          await this.prisma.serviceOption.update({
            where: { id: itemToSwap.id },
            data: { order: nextOrder }
          });
        }
      } else {
        // Push down existing options with the same or greater order
        await this.prisma.serviceOption.updateMany({
          where: {
            serviceType: dto.serviceType,
            order: { gte: dto.order },
          },
          data: {
            order: { increment: 1 },
          },
        });
      }
    }

    delete createData.orderAction;

    return this.prisma.serviceOption.create({
      data: createData,
    });
  }

  async getAllOptions(serviceType?: string) {
    const where = serviceType ? { serviceType } : {};
    return this.prisma.serviceOption.findMany({
      where,
      orderBy: [
        { serviceType: 'asc' },
        { order: 'asc' },
      ],
    });
  }

  async getOptionsByService(serviceSlug: string) {
    return this.prisma.serviceOption.findMany({
      where: {
        serviceType: serviceSlug,
        isActive: true,
      },
      orderBy: { order: 'asc' },
    });
  }

  async updateOption(id: number, dto: UpdateServiceOptionDto) {
    const updateData = { ...dto } as any;
    const orderAction = updateData.orderAction;
    delete updateData.orderAction;

    const existing = await this.prisma.serviceOption.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('No service option found with that ID');
    }

    if (updateData.order && updateData.order !== existing.order) {
      if (orderAction === 'swap') {
        // Find the item that currently has the target order in the same category
        const itemToSwap = await this.prisma.serviceOption.findFirst({
          where: { 
            serviceType: updateData.serviceType || existing.serviceType,
            order: updateData.order 
          }
        });
        if (itemToSwap) {
          // Move the existing item to our old order
          await this.prisma.serviceOption.update({
            where: { id: itemToSwap.id },
            data: { order: existing.order }
          });
        }
      } else {
        // Auto-Push (default)
        await this.prisma.serviceOption.updateMany({
          where: {
            serviceType: updateData.serviceType || existing.serviceType,
            order: { gte: updateData.order },
            id: { not: id } // Exclude the current item
          },
          data: {
            order: { increment: 1 },
          },
        });
      }
    }

    return this.prisma.serviceOption.update({
      where: { id },
      data: updateData,
    });
  }

  async toggleOptionStatus(id: number) {
    const option = await this.prisma.serviceOption.findUnique({ where: { id } });
    if (!option) {
      throw new NotFoundException('No service option found with that ID');
    }

    return this.prisma.serviceOption.update({
      where: { id },
      data: { isActive: !option.isActive },
    });
  }

  async deleteOption(id: number) {
    const option = await this.prisma.serviceOption.delete({
      where: { id },
    });
    if (!option) {
      throw new NotFoundException('No service option found with that ID');
    }
    return option;
  }
}
