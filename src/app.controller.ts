import { Controller, Get, Post, Body, Version, VERSION_NEUTRAL, Query, Ip, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/guards/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // 1. The Gateway Check -> http://localhost:3001/api
  @Version(VERSION_NEUTRAL) // This bypasses the 'v1' rule!
  @Get()
  getGateway() {
    return this.appService.getGatewayStatus();
  }

  // 2. The Engine Check -> http://localhost:3001/api/v1
  // Because '1' is our default version in main.ts, we don't need to do anything special here.
  @Get()
  getV1Engine() {
    return this.appService.getV1EngineStatus();
  }

  @Get('track')
  trackStatus(@Query('ref') ref: string, @Query('phone') phone: string, @Ip() ipAddress: string) {
    return this.appService.trackStatus(ref, phone, ipAddress);
  }

  @Get('cities')
  getCities() {
    return { success: true, data: { cities: [{ id: 1, name: 'Kolkata', slug: 'kolkata' }] } };
  }

  @Get('cities/slug/:slug')
  getCityBySlug() {
    return { success: true, data: { city: { id: 1, name: 'Kolkata', slug: 'kolkata' } } };
  }

  // Generic Media Endpoints
  @Post('cloudinary-signature')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  generateSignature(@Body() body: any) {
    return this.appService.generateCloudinarySignature(body);
  }

  @Post('delete-image')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  deleteImage(@Body('imageUrl') imageUrl: string) {
    return this.appService.deleteCloudinaryImage(imageUrl);
  }
}
