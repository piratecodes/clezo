import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceAreaDto } from './dto/create-service-area.dto';
import { UpdateServiceAreaDto } from './dto/update-service-area.dto';
import { CreateServiceAreaRangeDto } from './dto/create-service-area-range.dto';

@Injectable()
export class ServiceAreaService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceAreaDto: CreateServiceAreaDto) {
    try {
      return await this.prisma.serviceArea.create({
        data: createServiceAreaDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Pincode already exists');
      }
      throw error;
    }
  }

  async createRange(dto: CreateServiceAreaRangeDto) {
    const from = parseInt(dto.fromPincode, 10);
    const to = parseInt(dto.toPincode, 10);

    if (isNaN(from) || isNaN(to) || from > to) {
      throw new ConflictException('Invalid pincode range');
    }

    let createdCount = 0;
    for (let i = from; i <= to; i++) {
      const pinStr = i.toString();
      // Skip if already exists
      const existing = await this.prisma.serviceArea.findUnique({ where: { pincode: pinStr } });
      if (!existing) {
        await this.prisma.serviceArea.create({
          data: {
            pincode: pinStr,
            areaName: dto.areaName,
            localities: dto.localities || [],
          },
        });
        createdCount++;
      }
    }
    return { created: createdCount };
  }

  findAll() {
    return this.prisma.serviceArea.findMany({
      orderBy: { pincode: 'asc' },
    });
  }

  async findOne(id: number) {
    const area = await this.prisma.serviceArea.findUnique({ where: { id } });
    if (!area) throw new NotFoundException('Service Area not found');
    return area;
  }
  
  async checkPincode(pincode: string) {
    const area = await this.prisma.serviceArea.findUnique({ where: { pincode } });
    if (!area) return { isServiceable: false };
    if (!area.isActive) return { isServiceable: false, areaName: area.areaName, reason: 'Currently inactive' };
    
    return { 
      isServiceable: true, 
      areaName: area.areaName,
      localities: area.localities
    };
  }

  async update(id: number, updateServiceAreaDto: UpdateServiceAreaDto) {
    try {
      return await this.prisma.serviceArea.update({
        where: { id },
        data: updateServiceAreaDto,
      });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Service Area not found');
      if (error.code === 'P2002') throw new ConflictException('Pincode already exists');
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.serviceArea.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Service Area not found');
      throw error;
    }
  }
}
