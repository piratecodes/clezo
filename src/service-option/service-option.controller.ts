import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query, UseInterceptors } from '@nestjs/common';
import { ServiceOptionService } from './service-option.service';
import { CreateServiceOptionDto, UpdateServiceOptionDto } from './dto/service-option.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@Controller('service-options')
export class ServiceOptionController {
  constructor(private readonly serviceOptionService: ServiceOptionService) {}

  @Get('service/:serviceSlug')
  @UseInterceptors(CacheInterceptor)
  async getOptionsByService(@Param('serviceSlug') serviceSlug: string) {
    const options = await this.serviceOptionService.getOptionsByService(serviceSlug);
    return { success: true, message: 'Dynamic form options retrieved', data: { count: options.length, options } };
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async getAllOptions(@Query('serviceType') serviceType: string) {
    const options = await this.serviceOptionService.getAllOptions(serviceType);
    return { success: true, message: 'All service options retrieved', data: { count: options.length, options } };
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async createOption(@Body() dto: CreateServiceOptionDto) {
    const option = await this.serviceOptionService.createOption(dto);
    return { success: true, message: 'Service option category created successfully', data: { option } };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async updateOption(@Param('id') id: string, @Body() dto: UpdateServiceOptionDto) {
    const option = await this.serviceOptionService.updateOption(+id, dto);
    return { success: true, message: 'Service option updated successfully', data: { option } };
  }

  @Patch(':id/toggle')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async toggleOptionStatus(@Param('id') id: string) {
    const option = await this.serviceOptionService.toggleOptionStatus(+id);
    return { success: true, message: `Service option is now ${option.isActive ? 'Active' : 'Inactive'}`, data: { option } };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async deleteOption(@Param('id') id: string) {
    await this.serviceOptionService.deleteOption(+id);
    return { success: true, message: 'Service option permanently deleted', data: null };
  }
}
