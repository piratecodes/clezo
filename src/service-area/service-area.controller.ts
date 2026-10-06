import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ServiceAreaService } from './service-area.service';
import { CreateServiceAreaDto } from './dto/create-service-area.dto';
import { UpdateServiceAreaDto } from './dto/update-service-area.dto';
import { CreateServiceAreaRangeDto } from './dto/create-service-area-range.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('service-areas')
export class ServiceAreaController {
  constructor(private readonly serviceAreaService: ServiceAreaService) {}

  @Get('check')
  async checkPincode(@Query('pincode') pincode: string) {
    if (!pincode) {
      return { success: true, data: { isServiceable: false } };
    }
    const result = await this.serviceAreaService.checkPincode(pincode);
    return { success: true, data: result };
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createServiceAreaDto: CreateServiceAreaDto) {
    const area = await this.serviceAreaService.create(createServiceAreaDto);
    return { success: true, message: 'Service area created', data: area };
  }

  @Post('range')
  @UseGuards(AuthGuard)
  async createRange(@Body() createServiceAreaRangeDto: CreateServiceAreaRangeDto) {
    const result = await this.serviceAreaService.createRange(createServiceAreaRangeDto);
    return { success: true, message: 'Service areas range created', data: result };
  }

  @Get()
  async findAll() {
    const areas = await this.serviceAreaService.findAll();
    return { success: true, data: areas };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const area = await this.serviceAreaService.findOne(+id);
    return { success: true, data: area };
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updateServiceAreaDto: UpdateServiceAreaDto) {
    const area = await this.serviceAreaService.update(+id, updateServiceAreaDto);
    return { success: true, message: 'Service area updated', data: area };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    await this.serviceAreaService.remove(+id);
    return { success: true, message: 'Service area deleted' };
  }
}
