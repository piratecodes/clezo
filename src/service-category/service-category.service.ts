import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import slugify from 'slugify';

@Injectable()
export class ServiceCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateServiceCategoryDto) {
    const createData = dto as any;
    const orderAction = createData.orderAction || 'push';
    let slug = createData.slug;
    if (!slug) {
      slug = slugify(createData.name, { lower: true, strict: true });
    }
    if (createData.order) {
      if (orderAction === 'swap') {
        const itemToSwap = await this.prisma.serviceCategory.findFirst({
          where: { order: createData.order }
        });
        if (itemToSwap) {
          const maxOrderObj = await this.prisma.serviceCategory.aggregate({ _max: { order: true } });
          const nextOrder = (maxOrderObj._max.order || 0) + 1;
          await this.prisma.serviceCategory.update({
            where: { id: itemToSwap.id },
            data: { order: nextOrder }
          });
        }
      } else {
        await this.prisma.serviceCategory.updateMany({
          where: { order: { gte: createData.order } },
          data: { order: { increment: 1 } },
        });
      }
    }

    const createPayload = { ...(dto as any), slug };
    delete createPayload.orderAction;

    return this.prisma.serviceCategory.create({
      data: createPayload,
    });
  }

  async findAll() {
    return this.prisma.serviceCategory.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number) {
    const cat = await this.prisma.serviceCategory.findUnique({
      where: { id },
      include: { options: { orderBy: { order: 'asc' } } }
    });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }
  
  async findBySlug(slug: string) {
    const cat = await this.prisma.serviceCategory.findUnique({
      where: { slug },
      include: { options: { orderBy: { order: 'asc' } } }
    });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async update(id: number, dto: UpdateServiceCategoryDto) {
    let slug: string | undefined = undefined;
    const updateData = { ...dto } as any;
    const orderAction = updateData.orderAction;
    delete updateData.orderAction;

    if (updateData.slug) {
      slug = updateData.slug;
    } else if (updateData.name) {
      slug = slugify(updateData.name, { lower: true, strict: true });
    }
    const existing = await this.prisma.serviceCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Category not found');

    if (updateData.order && updateData.order !== existing.order) {
      if (orderAction === 'swap') {
        // Find the item that currently has the target order
        const itemToSwap = await this.prisma.serviceCategory.findFirst({
          where: { order: updateData.order }
        });
        if (itemToSwap) {
          // Move the existing item to our old order
          await this.prisma.serviceCategory.update({
            where: { id: itemToSwap.id },
            data: { order: existing.order }
          });
        }
      } else {
        // Auto-Push (default)
        await this.prisma.serviceCategory.updateMany({
          where: { order: { gte: updateData.order }, id: { not: id } },
          data: { order: { increment: 1 } },
        });
      }
    }

    const cat = await this.prisma.serviceCategory.update({
      where: { id },
      data: { ...updateData, ...(slug && { slug }) },
    });
    return cat;
  }

  async remove(id: number) {
    return this.prisma.serviceCategory.delete({
      where: { id },
    });
  }
}
