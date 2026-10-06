import { Test, TestingModule } from '@nestjs/testing';
import { GalleryService } from './gallery.service';
import { PrismaService } from '@/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    },
  },
}));

describe('GalleryService', () => {
  let service: GalleryService;
  let prisma: PrismaService;

  const mockGallery = {
    id: 1,
    categoryName: 'Men',
    slug: 'home-shift',
    featuredImage: { url: 'http://cloudinary.com/f.jpg' },
    images: [{ url: 'http://cloudinary.com/1.jpg' }, { url: 'http://cloudinary.com/2.jpg' }],
    isPublished: true,
    createdAt: new Date(),
  };

  const mockPrisma = {
    gallery: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    mockPrisma.gallery.findMany = jest.fn();
    mockPrisma.gallery.findUnique = jest.fn();
    mockPrisma.gallery.create = jest.fn();
    mockPrisma.gallery.update = jest.fn();
    mockPrisma.gallery.delete = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GalleryService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<GalleryService>(GalleryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPublicGalleries', () => {
    it('should retrieve published galleries only', async () => {
      mockPrisma.gallery.findMany.mockResolvedValueOnce([mockGallery]);
      const result = await service.getPublicGalleries();

      expect(result).toEqual([mockGallery]);
      expect(mockPrisma.gallery.findMany).toHaveBeenCalledWith({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getGalleryBySlug', () => {
    it('should throw NotFoundException if gallery not found or unpublished', async () => {
      mockPrisma.gallery.findUnique.mockResolvedValueOnce(null);
      await expect(service.getGalleryBySlug('home-shift')).rejects.toThrow(NotFoundException);

      const draft = { ...mockGallery, isPublished: false };
      mockPrisma.gallery.findUnique.mockResolvedValueOnce(draft);
      await expect(service.getGalleryBySlug('home-shift')).rejects.toThrow(NotFoundException);
    });

    it('should return published gallery by slug', async () => {
      mockPrisma.gallery.findUnique.mockResolvedValueOnce(mockGallery);
      const result = await service.getGalleryBySlug('home-shift');
      expect(result).toEqual(mockGallery);
    });
  });

  describe('getAllAdminGalleries', () => {
    it('should retrieve all galleries ordered by createdAt desc', async () => {
      mockPrisma.gallery.findMany.mockResolvedValueOnce([mockGallery]);
      const result = await service.getAllAdminGalleries();

      expect(result).toEqual([mockGallery]);
      expect(mockPrisma.gallery.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('createGallery', () => {
    it('should generate slug and create gallery album', async () => {
      mockPrisma.gallery.create.mockResolvedValueOnce(mockGallery);
      const dto = {
        categoryName: 'Men',
        slug: 'men',
        featuredImage: { url: 'http://cloudinary.com/f.jpg' },
        images: [{ url: 'http://cloudinary.com/1.jpg' }],
        isPublished: true,
      };

      const result = await service.createGallery(dto);
      expect(result).toEqual(mockGallery);
      expect(mockPrisma.gallery.create).toHaveBeenCalledWith({
        data: {
          categoryName: 'Men',
          featuredImage: dto.featuredImage,
          images: dto.images,
          isPublished: true,
          slug: '',
        },
      });
    });
  });

  describe('updateGallery', () => {
    it('should throw NotFoundException if update returns null', async () => {
      mockPrisma.gallery.update.mockResolvedValueOnce(null);
      const dto = { categoryName: 'New Category' };

      await expect(service.updateGallery(1, dto)).rejects.toThrow(NotFoundException);
    });

    it('should regenerate slug if category name changes, and update successfully', async () => {
      const updated = { ...mockGallery, categoryName: 'New Category', slug: 'w' };
      mockPrisma.gallery.update.mockResolvedValueOnce(updated);
      const dto = { categoryName: 'New Category' };

      const result = await service.updateGallery(1, dto);
      expect(result).toEqual(updated);
      expect(mockPrisma.gallery.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { categoryName: 'New Category', slug: 'w' },
      });
    });
  });

  describe('deleteGallery', () => {
    it('should throw NotFoundException if gallery not found', async () => {
      mockPrisma.gallery.findUnique.mockResolvedValueOnce(null);
      await expect(service.deleteGallery(1)).rejects.toThrow(NotFoundException);
    });

    it('should call cloudinary destroy for featured image and all images, and delete album', async () => {
      mockPrisma.gallery.findUnique.mockResolvedValueOnce(mockGallery);
      mockPrisma.gallery.delete.mockResolvedValueOnce(mockGallery);

      const result = await service.deleteGallery(1);

      expect(result).toBe(true);
      expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(3);
      expect(mockPrisma.gallery.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
