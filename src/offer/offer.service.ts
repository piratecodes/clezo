import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateOfferDto, UpdateOfferDto } from './dto/offer.dto';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class OfferService {
  constructor(private prisma: PrismaService) {}

  async getPublicOffers() {
    return this.prisma.offer.findMany({
      where: { isActive: true },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async getOfferBySlug(slug: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { slug },
    });
    if (!offer || !offer.isActive) {
      throw new NotFoundException('Offer not found or has expired');
    }
    return offer;
  }

  async getAllAdminOffers() {
    return this.prisma.offer.findMany({
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createOffer(dto: CreateOfferDto) {
    const existingSlug = await this.prisma.offer.findUnique({ where: { slug: dto.slug } });
    if (existingSlug) {
      throw new BadRequestException('Slug already exists. Please choose a unique title or slug.');
    }

    const existingCode = await this.prisma.offer.findUnique({ where: { code: dto.code.toUpperCase().trim() } });
    if (existingCode) {
      throw new BadRequestException('Coupon code already exists. Please choose a different code.');
    }

    const isLimitedTime = dto.isLimitedTime !== undefined ? dto.isLimitedTime : true;
    const showInUrgencyTicker = isLimitedTime ? (dto.showInUrgencyTicker ?? true) : false;

    return this.prisma.offer.create({
      data: {
        ...dto,
        isLimitedTime,
        showInUrgencyTicker,
        code: dto.code.toUpperCase().trim(),
        terms: dto.terms as any,
        faqs: dto.faqs as any,
        bannerImage: dto.bannerImage as any,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async updateOffer(id: number, dto: UpdateOfferDto) {
    if (dto.slug) {
      const existingSlug = await this.prisma.offer.findUnique({ where: { slug: dto.slug } });
      if (existingSlug && existingSlug.id !== id) {
        throw new BadRequestException('Slug already exists. Please choose a unique title or slug.');
      }
    }

    if (dto.code) {
      const existingCode = await this.prisma.offer.findUnique({ where: { code: dto.code.toUpperCase().trim() } });
      if (existingCode && existingCode.id !== id) {
        throw new BadRequestException('Coupon code already exists. Please choose a different code.');
      }
    }

    const data: any = { ...dto };
    if (dto.code) data.code = dto.code.toUpperCase().trim();
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    if (dto.terms !== undefined) data.terms = dto.terms as any;
    if (dto.faqs !== undefined) data.faqs = dto.faqs as any;
    if (dto.bannerImage !== undefined) data.bannerImage = dto.bannerImage as any;

    // Enforce business rule: Permanent/Lifetime offers cannot have urgency ticker
    if (dto.isLimitedTime === false) {
      data.showInUrgencyTicker = false;
    }

    const offer = await this.prisma.offer.update({
      where: { id },
      data,
    });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    return offer;
  }

  private async destroyCloudinaryImage(imageUrl: string) {
    try {
      if (!imageUrl) return;
      const splitUrl = imageUrl.split('/');
      const uploadIndex = splitUrl.findIndex((part) => part === 'upload');
      if (uploadIndex === -1) return;
      const publicIdWithExtension = splitUrl.slice(uploadIndex + 2).join('/');
      const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error('Cloudinary deletion error:', err);
    }
  }

  async deleteOffer(id: number) {
    const offer = await this.prisma.offer.findUnique({ where: { id } });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    if (offer.bannerImage && (offer.bannerImage as any).url) {
      await this.destroyCloudinaryImage((offer.bannerImage as any).url);
    }

    await this.prisma.offer.delete({ where: { id } });
    return true;
  }
}
