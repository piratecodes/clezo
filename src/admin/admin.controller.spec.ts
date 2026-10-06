import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { CreateStaffDto, UpdateStaffDto } from './dto/admin.dto';
import { BadRequestException, ExecutionContext } from '@nestjs/common';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  const mockAdminService = {
    getDashboardStats: jest.fn(),
    getLeadsHistory: jest.fn(),
    createStaff: jest.fn(),
    getAllAdmins: jest.fn(),
    getAdminById: jest.fn(),
    updateStaff: jest.fn(),
    deactivateStaff: jest.fn(),
    deleteStaff: jest.fn(),
  };

  const mockGuard = {
    canActivate: (context: ExecutionContext) => true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: AdminService, useValue: mockAdminService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return profile successfully', () => {
      const user = { id: 1, name: 'Admin User' };
      const res = controller.getMe(user);
      expect(res).toEqual({
        success: true,
        message: 'Profile fetched successfully',
        data: { user },
      });
    });
  });

  describe('updateMyPhoto', () => {
    it('should update photo successfully', async () => {
      const user = { id: 1, role: 'SUPER_ADMIN' };
      const dto: UpdateStaffDto = { name: 'Admin User' };
      const file = { filename: 'pic.png' } as Express.Multer.File;
      const updated = { id: 1, profilePic: 'pic.png' };

      mockAdminService.updateStaff.mockResolvedValueOnce(updated);

      const res = await controller.updateMyPhoto(user, dto, file);
      expect(res).toEqual({
        success: true,
        message: 'Staff profile updated successfully',
        data: { staff: updated },
      });
      expect(mockAdminService.updateStaff).toHaveBeenCalledWith(user.id, dto, user.role, file);
    });
  });

  describe('getDashboardStats', () => {
    it('should return dashboard stats', async () => {
      const stats = { totalLeads: 10, newLeads: 2, activeCities: 5, totalStaff: 3 };
      mockAdminService.getDashboardStats.mockResolvedValueOnce(stats);

      const res = await controller.getDashboardStats();
      expect(res).toEqual({
        success: true,
        message: 'Dashboard stats retrieved',
        data: { stats },
      });
    });
  });

  describe('getLeadsHistory', () => {
    it('should return leads history', async () => {
      const history = [{ month: 'Jun', leads: 5 }];
      mockAdminService.getLeadsHistory.mockResolvedValueOnce(history);

      const res = await controller.getLeadsHistory();
      expect(res).toEqual({
        success: true,
        message: 'History retrieved',
        data: { history },
      });
    });
  });

  describe('getAllAdmins', () => {
    it('should return all admins', async () => {
      const staff = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
      mockAdminService.getAllAdmins.mockResolvedValueOnce(staff);

      const res = await controller.getAllAdmins('true');
      expect(res).toEqual({
        success: true,
        message: 'Staff retrieved successfully',
        data: { count: 2, staff },
      });
      expect(mockAdminService.getAllAdmins).toHaveBeenCalledWith(true);
    });
  });

  describe('createStaff', () => {
    it('should create new staff member', async () => {
      const dto: CreateStaffDto = {
        name: 'Staff',
        username: 'staff',
        email: 'staff@example.com',
        phone: '123',
        password: 'pwd',
        designation: 'Sales',
        role: 'SALES_AGENT' as any,
      };
      const created = { id: 2, ...dto };
      mockAdminService.createStaff.mockResolvedValueOnce(created);

      const res = await controller.createStaff(dto);
      expect(res).toEqual({
        success: true,
        message: 'Staff member created successfully',
        data: { staff: created },
      });
    });
  });

  describe('getAdminById', () => {
    it('should return admin details', async () => {
      const staff = { id: 2, name: 'Staff' };
      mockAdminService.getAdminById.mockResolvedValueOnce(staff);

      const res = await controller.getAdminById('2');
      expect(res).toEqual({
        success: true,
        message: 'Staff profile retrieved',
        data: { staff },
      });
      expect(mockAdminService.getAdminById).toHaveBeenCalledWith(2);
    });
  });

  describe('updateStaff', () => {
    it('should throw BadRequestException if dto contains password', async () => {
      const dto: UpdateStaffDto = { name: 'Staff' };
      (dto as any).password = 'pwd';
      const user = { id: 1, role: 'SUPER_ADMIN' };

      await expect(controller.updateStaff('2', dto, user)).rejects.toThrow(BadRequestException);
    });

    it('should update staff details successfully', async () => {
      const dto: UpdateStaffDto = { name: 'New Name' };
      const user = { id: 1, role: 'SUPER_ADMIN' };
      const updated = { id: 2, name: 'New Name' };
      mockAdminService.updateStaff.mockResolvedValueOnce(updated);

      const res = await controller.updateStaff('2', dto, user);
      expect(res).toEqual({
        success: true,
        message: 'Staff profile updated successfully',
        data: { staff: updated },
      });
      expect(mockAdminService.updateStaff).toHaveBeenCalledWith(2, dto, user.role);
    });
  });

  describe('deactivateStaff', () => {
    it('should deactivate staff member', async () => {
      const user = { id: 1 };
      mockAdminService.deactivateStaff.mockResolvedValueOnce({});

      const res = await controller.deactivateStaff('2', user);
      expect(res).toEqual({
        success: true,
        message: 'Staff member deactivated.',
        data: null,
      });
      expect(mockAdminService.deactivateStaff).toHaveBeenCalledWith(2, user.id);
    });
  });

  describe('deleteStaff', () => {
    it('should delete staff member', async () => {
      const user = { id: 1 };
      mockAdminService.deleteStaff.mockResolvedValueOnce({});

      const res = await controller.deleteStaff('2', user);
      expect(res).toEqual({
        success: true,
        message: 'Staff member permanently deleted.',
        data: null,
      });
      expect(mockAdminService.deleteStaff).toHaveBeenCalledWith(2, user.id);
    });
  });
});
