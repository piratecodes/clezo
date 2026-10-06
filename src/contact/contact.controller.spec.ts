import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { UpdateContactDto } from './dto/contact.dto';
import { ExecutionContext } from '@nestjs/common';

describe('ContactController', () => {
  let controller: ContactController;
  let service: ContactService;

  const mockContactService = {
    getContactInfo: jest.fn(),
    updateContactInfo: jest.fn(),
  };

  const mockGuard = {
    canActivate: (context: ExecutionContext) => true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        { provide: ContactService, useValue: mockContactService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<ContactController>(ContactController);
    service = module.get<ContactService>(ContactService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getContactInfo', () => {
    it('should retrieve global contact info successfully', async () => {
      const contact = { id: 1, phone: '123' };
      mockContactService.getContactInfo.mockResolvedValueOnce(contact);

      const res = await controller.getContactInfo();
      expect(res).toEqual({
        success: true,
        message: 'Global contact info retrieved',
        data: { contact },
      });
      expect(mockContactService.getContactInfo).toHaveBeenCalled();
    });
  });

  describe('updateContactInfoPatch', () => {
    it('should update global contact info via PATCH successfully', async () => {
      const dto: UpdateContactDto = { primaryPhone: '123' };
      const contact = { id: 1, primaryPhone: '123' };
      mockContactService.updateContactInfo.mockResolvedValueOnce(contact);

      const res = await controller.updateContactInfoPatch(dto);
      expect(res).toEqual({
        success: true,
        message: 'Global contact info updated successfully',
        data: { contact },
      });
      expect(mockContactService.updateContactInfo).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateContactInfoPost', () => {
    it('should update global contact info via POST successfully', async () => {
      const dto: UpdateContactDto = { primaryPhone: '123' };
      const contact = { id: 1, primaryPhone: '123' };
      mockContactService.updateContactInfo.mockResolvedValueOnce(contact);

      const res = await controller.updateContactInfoPost(dto);
      expect(res).toEqual({
        success: true,
        message: 'Global contact info updated successfully',
        data: { contact },
      });
      expect(mockContactService.updateContactInfo).toHaveBeenCalledWith(dto);
    });
  });
});
