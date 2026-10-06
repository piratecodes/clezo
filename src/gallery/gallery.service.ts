import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateGalleryDto, UpdateGalleryDto } from './dto/gallery.dto';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  async getPublicGalleries() {
    return this.prisma.gallery.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getGalleryBySlug(slug: string) {
    const gallery = await this.prisma.gallery.findUnique({
      where: { slug },
    });
    if (!gallery || !gallery.isPublished) {
      throw new NotFoundException('Gallery not found or is currently a draft');
    }
    return gallery;
  }

  async getAllAdminGalleries() {
    return this.prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createGallery(dto: CreateGalleryDto) {
    const existing = await this.prisma.gallery.findUnique({ where: { slug: dto.slug } });
    if (existing) {
      throw new BadRequestException('Slug already exists. Please try an alternative name.');
    }
    return this.prisma.gallery.create({
      data: {
        ...dto,
        featuredImage: dto.featuredImage as any,
        images: dto.images as any,
      },
    });
  }

  async updateGallery(id: number, dto: UpdateGalleryDto) {
    const data: any = { ...dto };
    if (dto.slug) {
      const existing = await this.prisma.gallery.findUnique({ where: { slug: dto.slug } });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Slug already exists. Please try an alternative name.');
      }
    }
    const gallery = await this.prisma.gallery.update({
      where: { id },
      data,
    });
    if (!gallery) {
      throw new NotFoundException('Gallery album not found');
    }
    return gallery;
  }

  private async destroyCloudinaryImage(imageUrl: string) {
    try {
      if (!imageUrl) return;
      const splitUrl = imageUrl.split('/');
      const uploadIndex = splitUrl.findIndex((part) => part === 'upload');
      const publicIdWithExtension = splitUrl.slice(uploadIndex + 2).join('/');
      const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error('Cloudinary deletion error:', err);
    }
  }

  async deleteGallery(id: number) {
    const gallery = await this.prisma.gallery.findUnique({ where: { id } });
    if (!gallery) {
      throw new NotFoundException('Gallery album not found');
    }

    if (gallery.featuredImage && (gallery.featuredImage as any).url) {
      await this.destroyCloudinaryImage((gallery.featuredImage as any).url);
    }

    if (gallery.images && Array.isArray(gallery.images)) {
      await Promise.all(
        gallery.images.map((img: any) => this.destroyCloudinaryImage(img.url))
      );
    }

    await this.prisma.gallery.delete({ where: { id } });
    return true;
  }
}
