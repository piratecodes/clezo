import { Test, TestingModule } from '@nestjs/testing';
import { ServiceOptionController } from './service-option.controller';
import { ServiceOptionService } from './service-option.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateServiceOptionDto, UpdateServiceOptionDto } from './dto/service-option.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExecutionContext } from '@nestjs/common';

describe('ServiceOptionController', () => {
  let controller: ServiceOptionController;
  let service: ServiceOptionService;

  const mockServiceOptionService = {
    getOptionsByService: jest.fn(),
    getAllOptions: jest.fn(),
    createOption: jest.fn(),
    updateOption: jest.fn(),
    toggleOptionStatus: jest.fn(),
    deleteOption: jest.fn(),
  };

  const mockGuard = {
    canActivate: (context: ExecutionContext) => true,
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceOptionController],
      providers: [
        { provide: ServiceOptionService, useValue: mockServiceOptionService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<ServiceOptionController>(ServiceOptionController);
    service = module.get<ServiceOptionService>(ServiceOptionService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOptionsByService', () => {
    it('should retrieve options by service slug successfully', async () => {
      const options = [{ id: 1, categoryName: 'Women' }];
      mockServiceOptionService.getOptionsByService.mockResolvedValueOnce(options);

      const res = await controller.getOptionsByService('house-shifting');
      expect(res).toEqual({
        success: true,
        message: 'Dynamic form options retrieved',
        data: { count: 1, options },
      });
      expect(mockServiceOptionService.getOptionsByService).toHaveBeenCalledWith('house-shifting');
    });
  });

  describe('getAllOptions', () => {
    it('should retrieve all options successfully', async () => {
      const options = [{ id: 1, categoryName: 'Women' }];
      mockServiceOptionService.getAllOptions.mockResolvedValueOnce(options);

      const res = await controller.getAllOptions('house-shifting');
      expect(res).toEqual({
        success: true,
        message: 'All service options retrieved',
        data: { count: 1, options },
      });
      expect(mockServiceOptionService.getAllOptions).toHaveBeenCalledWith('house-shifting');
    });
  });

  describe('createOption', () => {
    it('should create new service option successfully', async () => {
      const dto: CreateServiceOptionDto = {
        serviceType: 'house-shifting',
        categoryName: 'Women',
        order: 1,
      };
      const created = { id: 1, ...dto };
      mockServiceOptionService.createOption.mockResolvedValueOnce(created);

      const res = await controller.createOption(dto);
      expect(res).toEqual({
        success: true,
        message: 'Service option category created successfully',
        data: { option: created },
      });
      expect(mockServiceOptionService.createOption).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateOption', () => {
    it('should update service option successfully', async () => {
      const dto: UpdateServiceOptionDto = { categoryName: 'New Women' };
      const updated = { id: 1, categoryName: 'New Women' };
      mockServiceOptionService.updateOption.mockResolvedValueOnce(updated);

      const res = await controller.updateOption('1', dto);
      expect(res).toEqual({
        success: true,
        message: 'Service option updated successfully',
        data: { option: updated },
      });
      expect(mockServiceOptionService.updateOption).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('toggleOptionStatus', () => {
    it('should toggle service option status successfully', async () => {
      const option = { id: 1, isActive: true };
      mockServiceOptionService.toggleOptionStatus.mockResolvedValueOnce(option);

      const res = await controller.toggleOptionStatus('1');
      expect(res).toEqual({
        success: true,
        message: 'Service option is now Active',
        data: { option },
      });
      expect(mockServiceOptionService.toggleOptionStatus).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteOption', () => {
    it('should delete service option successfully', async () => {
      mockServiceOptionService.deleteOption.mockResolvedValueOnce({});

      const res = await controller.deleteOption('1');
      expect(res).toEqual({
        success: true,
        message: 'Service option permanently deleted',
        data: null,
      });
      expect(mockServiceOptionService.deleteOption).toHaveBeenCalledWith(1);
    });
  });
});
