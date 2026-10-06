import { Test, TestingModule } from '@nestjs/testing';
import { ServiceOptionService } from './service-option.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ServiceOptionService', () => {
  let service: ServiceOptionService;
  let prisma: PrismaService;

  const mockOption = {
    id: 1,
    serviceType: 'house-shifting',
    categoryName: 'Women',
    order: 1,
    isActive: true,
  };

  const mockPrisma = {
    serviceOption: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    mockPrisma.serviceOption.create = jest.fn();
    mockPrisma.serviceOption.findMany = jest.fn();
    mockPrisma.serviceOption.findUnique = jest.fn();
    mockPrisma.serviceOption.update = jest.fn();
    mockPrisma.serviceOption.delete = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceOptionService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ServiceOptionService>(ServiceOptionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOption', () => {
    it('should create a service option category successfully', async () => {
      mockPrisma.serviceOption.create.mockResolvedValueOnce(mockOption);
      const dto = {
        serviceType: 'house-shifting',
        categoryName: 'Women',
        order: 1,
      };

      const result = await service.createOption(dto);
      expect(result).toEqual(mockOption);
      expect(mockPrisma.serviceOption.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('getAllOptions', () => {
    it('should query all options when serviceType is not provided', async () => {
      mockPrisma.serviceOption.findMany.mockResolvedValueOnce([mockOption]);
      const result = await service.getAllOptions();

      expect(result).toEqual([mockOption]);
      expect(mockPrisma.serviceOption.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: [
          { serviceType: 'asc' },
          { order: 'asc' },
        ],
      });
    });

    it('should query options filtered by serviceType', async () => {
      mockPrisma.serviceOption.findMany.mockResolvedValueOnce([mockOption]);
      const result = await service.getAllOptions('house-shifting');

      expect(result).toEqual([mockOption]);
      expect(mockPrisma.serviceOption.findMany).toHaveBeenCalledWith({
        where: { serviceType: 'house-shifting' },
        orderBy: [
          { serviceType: 'asc' },
          { order: 'asc' },
        ],
      });
    });
  });

  describe('getOptionsByService', () => {
    it('should query active options for a specific service slug', async () => {
      mockPrisma.serviceOption.findMany.mockResolvedValueOnce([mockOption]);
      const result = await service.getOptionsByService('house-shifting');

      expect(result).toEqual([mockOption]);
      expect(mockPrisma.serviceOption.findMany).toHaveBeenCalledWith({
        where: {
          serviceType: 'house-shifting',
          isActive: true,
        },
        orderBy: { order: 'asc' },
      });
    });
  });

  describe('updateOption', () => {
    it('should throw NotFoundException if update returns null', async () => {
      mockPrisma.serviceOption.update.mockResolvedValueOnce(null);
      await expect(service.updateOption(1, { categoryName: 'New Women' })).rejects.toThrow(NotFoundException);
    });

    it('should update option successfully', async () => {
      const updated = { ...mockOption, categoryName: 'New Women' };
      mockPrisma.serviceOption.update.mockResolvedValueOnce(updated);

      const result = await service.updateOption(1, { categoryName: 'New Women' });
      expect(result).toEqual(updated);
    });
  });

  describe('toggleOptionStatus', () => {
    it('should throw NotFoundException if option not found', async () => {
      mockPrisma.serviceOption.findUnique.mockResolvedValueOnce(null);
      await expect(service.toggleOptionStatus(1)).rejects.toThrow(NotFoundException);
    });

    it('should toggle option active status successfully', async () => {
      mockPrisma.serviceOption.findUnique.mockResolvedValueOnce(mockOption);
      const toggled = { ...mockOption, isActive: false };
      mockPrisma.serviceOption.update.mockResolvedValueOnce(toggled);

      const result = await service.toggleOptionStatus(1);
      expect(result.isActive).toBe(false);
      expect(mockPrisma.serviceOption.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isActive: false },
      });
    });
  });

  describe('deleteOption', () => {
    it('should throw NotFoundException if delete returns null', async () => {
      mockPrisma.serviceOption.delete.mockResolvedValueOnce(null);
      await expect(service.deleteOption(1)).rejects.toThrow(NotFoundException);
    });

    it('should delete option successfully', async () => {
      mockPrisma.serviceOption.delete.mockResolvedValueOnce(mockOption);
      const result = await service.deleteOption(1);

      expect(result).toEqual(mockOption);
      expect(mockPrisma.serviceOption.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
