import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('dashboard')
@UseGuards(AuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60000) // 60 seconds caching
  async getSummary(@Query() query: any) {
    const data = await this.dashboardService.getSummary(query);
    return { success: true, data };
  }
}
