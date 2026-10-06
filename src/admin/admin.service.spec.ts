import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '@/prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';

jest.mock('fs');
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

describe('AdminService', () => {
  let service: AdminService;
  let prisma: PrismaService;

  const mockAdmin = {
    id: 1,
    name: 'Staff Name',
    username: 'staff',
    email: 'staff@example.com',
    phone: '1234567890',
    password: 'hashed_password',
    role: 'SALES_AGENT',
    designation: 'Sales Executive',
    isActive: true,
    createdAt: new Date(),
    profilePic: 'default-avatar.png',
  };

  const mockPrisma = {
    lead: {
      count: jest.fn(),
    },
    city: {
      count: jest.fn(),
    },
    admin: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboardStats', () => {
    it('should return combined counts of leads, active cities, and active staff', async () => {
      mockPrisma.lead.count.mockResolvedValueOnce(10).mockResolvedValueOnce(2);
      mockPrisma.city.count.mockResolvedValueOnce(5);
      mockPrisma.admin.count.mockResolvedValueOnce(3);

      const stats = await service.getDashboardStats();

      expect(stats).toEqual({
        totalLeads: 10,
        newLeads: 2,
        activeCities: 5,
        totalStaff: 3,
      });
      expect(mockPrisma.lead.count).toHaveBeenCalledTimes(2);
      expect(mockPrisma.city.count).toHaveBeenCalled();
      expect(mockPrisma.admin.count).toHaveBeenCalled();
    });
  });

  describe('createStaff', () => {
    it('should hash password and create new staff member', async () => {
      mockPrisma.admin.create.mockResolvedValueOnce(mockAdmin);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed_password');

      const dto = {
        name: 'Staff Name',
        username: 'staff',
        email: 'staff@example.com',
        phone: '1234567890',
        password: 'password123',
        designation: 'Sales Executive',
        role: 'SALES_AGENT' as any,
      };

      const result = await service.createStaff(dto);

      expect(result).not.toHaveProperty('password');
      expect(result.username).toBe('staff');
      expect(mockPrisma.admin.create).toHaveBeenCalled();
    });
  });

  describe('getAllAdmins', () => {
    it('should return active admins by default', async () => {
      mockPrisma.admin.findMany.mockResolvedValueOnce([mockAdmin]);
      const result = await service.getAllAdmins(false);

      expect(result).toEqual([mockAdmin]);
      expect(mockPrisma.admin.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        select: expect.any(Object),
      });
    });

    it('should return all admins when all is true', async () => {
      mockPrisma.admin.findMany.mockResolvedValueOnce([mockAdmin]);
      const result = await service.getAllAdmins(true);

      expect(result).toEqual([mockAdmin]);
      expect(mockPrisma.admin.findMany).toHaveBeenCalledWith({
        where: {},
        select: expect.any(Object),
      });
    });
  });

  describe('getAdminById', () => {
    it('should throw NotFoundException if admin is not found', async () => {
      mockPrisma.admin.findUnique.mockResolvedValueOnce(null);
      await expect(service.getAdminById(99)).rejects.toThrow(NotFoundException);
    });

    it('should return admin details (excluding password) if admin exists', async () => {
      mockPrisma.admin.findUnique.mockResolvedValueOnce(mockAdmin);
      const result = await service.getAdminById(1);

      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe(1);
    });
  });

  describe('updateStaff', () => {
    it('should strip role and isActive if current user is not SUPER_ADMIN', async () => {
      mockPrisma.admin.update.mockResolvedValueOnce(mockAdmin);
      const dto = { name: 'New Name', role: 'SUPER_ADMIN' as any, isActive: false };

      await service.updateStaff(1, dto, 'SALES_AGENT');

      expect(dto.role).toBeUndefined();
      expect(dto.isActive).toBeUndefined();
      expect(mockPrisma.admin.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'New Name' },
      });
    });

    it('should process profile image and delete old profile pic if it is custom', async () => {
      const oldAdmin = { ...mockAdmin, profilePic: 'old-pic.png' };
      mockPrisma.admin.findUnique.mockResolvedValueOnce(oldAdmin);
      mockPrisma.admin.update.mockResolvedValueOnce({ ...mockAdmin, profilePic: 'new-pic.png' });

      (fs.existsSync as jest.Mock).mockReturnValueOnce(true);

      const file = { filename: 'new-pic.png' } as Express.Multer.File;
      const dto = { name: 'New Name' };

      const result = await service.updateStaff(1, dto, 'SUPER_ADMIN', file);

      expect(result.profilePic).toBe('new-pic.png');
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(mockPrisma.admin.update).toHaveBeenCalled();
    });
  });

  describe('deactivateStaff', () => {
    it('should throw ForbiddenException if trying to deactivate self', async () => {
      await expect(service.deactivateStaff(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should successfully deactivate other staff member', async () => {
      mockPrisma.admin.update.mockResolvedValueOnce({ ...mockAdmin, isActive: false });
      const result = await service.deactivateStaff(2, 1);

      expect(result.isActive).toBe(false);
      expect(mockPrisma.admin.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { isActive: false },
      });
    });
  });

  describe('deleteStaff', () => {
    it('should throw ForbiddenException if trying to delete self', async () => {
      await expect(service.deleteStaff(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should delete staff member successfully', async () => {
      mockPrisma.admin.delete.mockResolvedValueOnce(mockAdmin);
      await service.deleteStaff(2, 1);

      expect(mockPrisma.admin.delete).toHaveBeenCalledWith({ where: { id: 2 } });
    });
  });

  describe('getLeadsHistory', () => {
    it('should query leads and map months correctly', async () => {
      const mockResult = [
        { month: 6, year: 2026, leads: 5 },
        { month: 5, year: 2026, leads: 12 },
      ];
      mockPrisma.$queryRaw.mockResolvedValueOnce(mockResult);

      const history = await service.getLeadsHistory();

      expect(history).toEqual([
        { month: 'Jun', leads: 5 },
        { month: 'May', leads: 12 },
      ]);
      expect(mockPrisma.$queryRaw).toHaveBeenCalled();
    });
  });
});
