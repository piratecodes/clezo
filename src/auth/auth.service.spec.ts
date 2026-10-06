import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockAdmin = {
    id: 1,
    name: 'Super Admin',
    username: 'superadmin',
    email: 'admin@example.com',
    phone: '1234567890',
    password: 'hashed_password',
    role: 'SUPER_ADMIN',
    designation: 'Founder / CEO',
    isActive: true,
    passwordResetToken: null,
    passwordResetExpires: null,
  };

  const mockPrisma = {
    admin: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_token'),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock_value'),
  };

  beforeEach(async () => {
    mockPrisma.admin.findFirst = jest.fn();
    mockPrisma.admin.findUnique = jest.fn();
    mockPrisma.admin.create = jest.fn();
    mockPrisma.admin.update = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setupFirstAdmin', () => {
    it('should throw ForbiddenException if an admin already exists', async () => {
      mockPrisma.admin.findFirst.mockResolvedValueOnce(mockAdmin);
      const dto = {
        name: 'Admin',
        username: 'admin',
        email: 'a@a.com',
        phone: '12345',
        password: 'pwd',
      };

      await expect(service.setupFirstAdmin(dto)).rejects.toThrow(ForbiddenException);
      expect(mockPrisma.admin.findFirst).toHaveBeenCalled();
    });

    it('should successfully create first admin', async () => {
      mockPrisma.admin.findFirst.mockResolvedValueOnce(null);
      mockPrisma.admin.create.mockResolvedValueOnce(mockAdmin);

      const dto = {
        name: 'Admin',
        username: 'admin',
        email: 'a@a.com',
        phone: '12345',
        password: 'pwd',
      };

      const result = await service.setupFirstAdmin(dto);
      expect(result).toEqual({ admin: expect.any(Object) });
      expect((result.admin as any).password).toBeUndefined();
      expect(mockPrisma.admin.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if admin not found', async () => {
      mockPrisma.admin.findUnique.mockResolvedValueOnce(null);
      const dto = { username: 'invalid', password: 'pwd' };

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password incorrect', async () => {
      mockPrisma.admin.findUnique.mockResolvedValueOnce(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const dto = { username: 'superadmin', password: 'wrong' };
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException if admin is inactive', async () => {
      const inactiveAdmin = { ...mockAdmin, isActive: false };
      mockPrisma.admin.findUnique.mockResolvedValueOnce(inactiveAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const dto = { username: 'superadmin', password: 'pwd' };
      await expect(service.login(dto)).rejects.toThrow(ForbiddenException);
    });

    it('should sign token and return admin info on successful login', async () => {
      mockPrisma.admin.findUnique.mockResolvedValueOnce(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const dto = { username: 'superadmin', password: 'pwd' };
      const result = await service.login(dto);

      expect(result).toEqual({
        token: 'mock_token',
        admin: expect.any(Object),
      });
      expect((result.admin as any).password).toBeUndefined();
      expect(jwtService.sign).toHaveBeenCalledWith({ id: mockAdmin.id });
    });
  });

  describe('forgotPassword', () => {
    it('should throw NotFoundException if admin not found by email', async () => {
      mockPrisma.admin.findUnique.mockResolvedValueOnce(null);
      const dto = { email: 'wrong@example.com' };

      await expect(service.forgotPassword(dto)).rejects.toThrow(NotFoundException);
    });

    it('should create token and return URL if admin found', async () => {
      mockPrisma.admin.findUnique.mockResolvedValueOnce(mockAdmin);
      mockPrisma.admin.update.mockResolvedValueOnce(mockAdmin);

      const dto = { email: 'admin@example.com' };
      const result = await service.forgotPassword(dto);

      expect(result).toHaveProperty('resetURL');
      expect(mockPrisma.admin.update).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should throw BadRequestException if token is invalid or expired', async () => {
      mockPrisma.admin.findFirst.mockResolvedValueOnce(null);
      const dto = { password: 'pwd' };

      await expect(service.resetPassword('invalid_token', dto)).rejects.toThrow(BadRequestException);
    });

    it('should reset password successfully and return a token', async () => {
      mockPrisma.admin.findFirst.mockResolvedValueOnce(mockAdmin);
      mockPrisma.admin.update.mockResolvedValueOnce(mockAdmin);

      const dto = { password: 'new_password' };
      const result = await service.resetPassword('valid_token', dto);

      expect(result).toEqual({
        token: 'mock_token',
        admin: expect.any(Object),
      });
      expect(mockPrisma.admin.update).toHaveBeenCalled();
    });
  });
});
