import { Test, TestingModule } from '@nestjs/testing';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { CreateGalleryDto, UpdateGalleryDto } from './dto/gallery.dto';
import { ExecutionContext } from '@nestjs/common';

describe('GalleryController', () => {
  let controller: GalleryController;
  let service: GalleryService;

  const mockGalleryService = {
    getPublicGalleries: jest.fn(),
    getGalleryBySlug: jest.fn(),
    getAllAdminGalleries: jest.fn(),
    createGallery: jest.fn(),
    updateGallery: jest.fn(),
    deleteGallery: jest.fn(),
  };

  const mockGuard = {
    canActivate: (context: ExecutionContext) => true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GalleryController],
      providers: [
        { provide: GalleryService, useValue: mockGalleryService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<GalleryController>(GalleryController);
    service = module.get<GalleryService>(GalleryService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPublicGalleries', () => {
    it('should retrieve public galleries successfully', async () => {
      const galleries = [{ id: 1, slug: 'home' }];
      mockGalleryService.getPublicGalleries.mockResolvedValueOnce(galleries);

      const res = await controller.getPublicGalleries();
      expect(res).toEqual({
        success: true,
        message: 'Published galleries retrieved',
        data: { count: 1, galleries },
      });
    });
  });

  describe('getGalleryBySlug', () => {
    it('should retrieve gallery by slug', async () => {
      const gallery = { id: 1, slug: 'home' };
      mockGalleryService.getGalleryBySlug.mockResolvedValueOnce(gallery);

      const res = await controller.getGalleryBySlug('home');
      expect(res).toEqual({
        success: true,
        message: 'Gallery retrieved',
        data: { gallery },
      });
      expect(mockGalleryService.getGalleryBySlug).toHaveBeenCalledWith('home');
    });
  });

  describe('getAllAdminGalleries', () => {
    it('should retrieve all galleries for admin', async () => {
      const galleries = [{ id: 1, slug: 'home' }];
      mockGalleryService.getAllAdminGalleries.mockResolvedValueOnce(galleries);

      const res = await controller.getAllAdminGalleries();
      expect(res).toEqual({
        success: true,
        message: 'All admin galleries retrieved',
        data: { count: 1, galleries },
      });
    });
  });

  describe('createGallery', () => {
    it('should create a gallery album successfully', async () => {
      const dto: CreateGalleryDto = {
        categoryName: 'Men',
        slug: 'men',
        featuredImage: { url: 'img' },
        images: [],
        isPublished: true,
      };
      const created = { id: 1, ...dto };
      mockGalleryService.createGallery.mockResolvedValueOnce(created);

      const res = await controller.createGallery(dto);
      expect(res).toEqual({
        success: true,
        message: 'Gallery album created successfully!',
        data: { gallery: created },
      });
      expect(mockGalleryService.createGallery).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateGallery', () => {
    it('should update gallery successfully', async () => {
      const dto: UpdateGalleryDto = { categoryName: 'New Category' };
      const updated = { id: 1, categoryName: 'New Category' };
      mockGalleryService.updateGallery.mockResolvedValueOnce(updated);

      const res = await controller.updateGallery('1', dto);
      expect(res).toEqual({
        success: true,
        message: 'Gallery updated successfully',
        data: { gallery: updated },
      });
      expect(mockGalleryService.updateGallery).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('deleteGallery', () => {
    it('should delete gallery successfully', async () => {
      mockGalleryService.deleteGallery.mockResolvedValueOnce(true);

      const res = await controller.deleteGallery('1');
      expect(res).toEqual({
        success: true,
        message: 'Album and all Cloudinary images permanently deleted!',
        data: null,
      });
      expect(mockGalleryService.deleteGallery).toHaveBeenCalledWith(1);
    });
  });
});
