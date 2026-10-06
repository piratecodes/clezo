import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('ContactService', () => {
  let service: ContactService;
  let prisma: PrismaService;

  const mockContact = {
    id: 1,
    primaryPhone: '1234567890',
    supportEmail: 'contact@example.com',
    headOfficeAddress: 'Kolkata, West Bengal',
    facebookUrl: 'fb.com',
    twitterUrl: 'twitter.com',
    instagramUrl: 'insta.com',
    linkedinUrl: 'linkedin.com',
  };

  const mockPrisma = {
    contact: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    mockPrisma.contact.findFirst = jest.fn();
    mockPrisma.contact.update = jest.fn();
    mockPrisma.contact.create = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getContactInfo', () => {
    it('should return empty object if no contact info exists', async () => {
      mockPrisma.contact.findFirst.mockResolvedValueOnce(null);
      const result = await service.getContactInfo();
      expect(result).toEqual({});
    });

    it('should return contact info if exists', async () => {
      mockPrisma.contact.findFirst.mockResolvedValueOnce(mockContact);
      const result = await service.getContactInfo();
      expect(result).toEqual(mockContact);
    });
  });

  describe('updateContactInfo', () => {
    it('should update existing contact info if it exists', async () => {
      mockPrisma.contact.findFirst.mockResolvedValueOnce(mockContact);
      const dto = { primaryPhone: '9999999999' };
      const updatedContact = { ...mockContact, primaryPhone: '9999999999' };
      mockPrisma.contact.update.mockResolvedValueOnce(updatedContact);

      const result = await service.updateContactInfo(dto);
      expect(result).toEqual(updatedContact);
      expect(mockPrisma.contact.update).toHaveBeenCalledWith({
        where: { id: mockContact.id },
        data: dto,
      });
    });

    it('should create new contact info if none exists', async () => {
      mockPrisma.contact.findFirst.mockResolvedValueOnce(null);
      const dto = { primaryPhone: '1234567890', supportEmail: 'c@c.com', headOfficeAddress: 'Kolkata' };
      mockPrisma.contact.create.mockResolvedValueOnce(mockContact);

      const result = await service.updateContactInfo(dto);
      expect(result).toEqual(mockContact);
      expect(mockPrisma.contact.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });
});
