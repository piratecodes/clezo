import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { SetupAdminDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    setupFirstAdmin: jest.fn(),
    login: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: (context: ExecutionContext) => true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('setupFirstAdmin', () => {
    it('should create the first admin successfully', async () => {
      const dto: SetupAdminDto = {
        name: 'Admin',
        username: 'admin',
        email: 'a@a.com',
        phone: '12345',
        password: 'pwd',
      };
      const mockResult = { admin: { id: 1, name: 'Admin' } };
      mockAuthService.setupFirstAdmin.mockResolvedValueOnce(mockResult);

      const result = await controller.setupFirstAdmin(dto);
      expect(result).toEqual({
        success: true,
        message: 'Super Admin created successfully!',
        data: mockResult,
      });
      expect(mockAuthService.setupFirstAdmin).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const dto: LoginDto = { username: 'admin', password: 'pwd' };
      const mockResult = { token: 'tok', admin: { id: 1 } };
      mockAuthService.login.mockResolvedValueOnce(mockResult);

      const mockReq = {} as any;
      const mockRes = { cookie: jest.fn() } as any;
      const result = await controller.login(dto, mockReq, mockRes);
      expect(result).toEqual({
        success: true,
        message: 'Logged in successfully',
        data: mockResult,
      });
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('getMe', () => {
    it('should return the logged in user profile', () => {
      const mockUser = { id: 1, name: 'Admin' };
      const result = controller.getMe(mockUser);
      expect(result).toEqual({
        success: true,
        message: 'User is logged in',
        data: { admin: mockUser },
      });
    });
  });

  describe('forgotPassword', () => {
    it('should trigger forgot password successfully', async () => {
      const dto: ForgotPasswordDto = { email: 'a@a.com' };
      const mockResult = { message: 'token sent' };
      mockAuthService.forgotPassword.mockResolvedValueOnce(mockResult);

      const result = await controller.forgotPassword(dto);
      expect(result).toEqual({
        success: true,
        message: 'Token sent to email!',
        data: mockResult,
      });
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(dto);
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const dto: ResetPasswordDto = { password: 'new' };
      const mockResult = { token: 'new_tok', admin: { id: 1 } };
      mockAuthService.resetPassword.mockResolvedValueOnce(mockResult);

      const mockRes = { cookie: jest.fn() } as any;
      const result = await controller.resetPassword('some_token', dto, mockRes);
      expect(result).toEqual({
        success: true,
        message: 'Password reset successful. You are now logged in.',
        data: mockResult,
      });
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith('some_token', dto);
    });
  });
});
