import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/admin.dto';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

const storage = diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  },
});

@Controller('admins')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('me')
  getMe(@GetUser() user: any) {
    return { success: true, message: 'Profile fetched successfully', data: { user } };
  }

  @Patch('me/upload-photo')
  @UseInterceptors(FileInterceptor('photo', { storage }))
  async updateMyPhoto(@GetUser() user: any, @Body() dto: UpdateStaffDto, @UploadedFile() file: Express.Multer.File) {
    const updated = await this.adminService.updateStaff(user.id, dto, user.role, file);
    return { success: true, message: 'Staff profile updated successfully', data: { staff: updated } };
  }

  @Get('dashboard-stats')
  async getDashboardStats() {
    const stats = await this.adminService.getDashboardStats();
    return { success: true, message: 'Dashboard stats retrieved', data: { stats } };
  }

  @Get('leads-history')
  async getLeadsHistory() {
    const history = await this.adminService.getLeadsHistory();
    return { success: true, message: 'History retrieved', data: { history } };
  }

  // --- Collection Routes ---
  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN')
  async getAllAdmins(@Query('all') all: string) {
    const staff = await this.adminService.getAllAdmins(all === 'true');
    return { success: true, message: 'Staff retrieved successfully', data: { count: staff.length, staff } };
  }

  @Post()
  @Roles('SUPER_ADMIN')
  async createStaff(@Body() dto: CreateStaffDto) {
    const staff = await this.adminService.createStaff(dto);
    return { success: true, message: 'Staff member created successfully', data: { staff } };
  }

  // --- Specific User Routes ---
  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async getAdminById(@Param('id') id: string) {
    const staff = await this.adminService.getAdminById(+id);
    return { success: true, message: 'Staff profile retrieved', data: { staff } };
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async updateStaff(@Param('id') id: string, @Body() dto: UpdateStaffDto, @GetUser() user: any) {
    if ((dto as any).password || (dto as any).passwordConfirm) {
      throw new BadRequestException('This route is NOT for password updates.');
    }
    const staff = await this.adminService.updateStaff(+id, dto, user.role);
    return { success: true, message: 'Staff profile updated successfully', data: { staff } };
  }

  @Patch(':id/deactivate')
  @Roles('SUPER_ADMIN')
  async deactivateStaff(@Param('id') id: string, @GetUser() user: any) {
    await this.adminService.deactivateStaff(+id, user.id);
    return { success: true, message: 'Staff member deactivated.', data: null };
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  async deleteStaff(@Param('id') id: string, @GetUser() user: any) {
    await this.adminService.deleteStaff(+id, user.id);
    return { success: true, message: 'Staff member permanently deleted.', data: null };
  }
}
