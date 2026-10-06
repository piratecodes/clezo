import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto, UpdateLeadDto, UpdateLeadStatusDto } from './dto/lead.dto';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Req } from '@nestjs/common';

@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createLead(@Body() dto: CreateLeadDto) {
    const lead = await this.leadService.createLead(dto);
    return { 
      success: true, 
      message: 'Order created successfully.', 
      data: { orderId: lead.leadNumber, leadId: lead.id } 
    };
  }

  @Post('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  async createAdminLead(@Body() dto: CreateLeadDto, @Req() req: any) {
    try {
      const lead = await this.leadService.createAdminLead(dto, req.user.id);
      return { 
        success: true, 
        message: 'Lead created successfully.', 
        data: { lead } 
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to create lead', data: null };
    }
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async getAllLeads(@Query() query: any) {
    const result = await this.leadService.getAllLeads(query);
    return { success: true, message: 'Leads retrieved', data: result };
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async getLeadById(@Param('id') id: string) {
    const lead = await this.leadService.getLeadById(+id);
    return { success: true, message: 'Lead details retrieved', data: { lead } };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async updateLead(@Param('id') id: string, @Body() dto: UpdateLeadDto, @Req() req: any) {
    console.log("Data:", dto)
    const lead = await this.leadService.updateLead(+id, dto, req.user?.id);
    return { success: true, message: 'Lead updated successfully', data: { lead } };
  }
  @Patch(':id/status')
  @UseGuards(AuthGuard, RolesGuard)
  async updateLeadStatus(@Param('id') id: string, @Body() dto: UpdateLeadStatusDto, @Req() req: any) {
    try {
      const lead = await this.leadService.updateLeadStatus(+id, req.user.id, dto);
      return { success: true, message: 'Status updated successfully', data: { lead } };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to update status', data: null };
    }
  }

  @Patch(':id/history/:historyId')
  @UseGuards(AuthGuard, RolesGuard)
  async updateLeadHistory(
    @Param('id') id: string,
    @Param('historyId') historyId: string,
    @Body() body: { createdAt: string }
  ) {
    try {
      const lead = await this.leadService.updateLeadHistory(+id, +historyId, body.createdAt);
      return { success: true, message: 'Timeline updated successfully', data: { lead } };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to update timeline', data: null };
    }
  }

  @Delete(':id/history/:historyId')
  @UseGuards(AuthGuard, RolesGuard)
  async deleteLeadHistory(
    @Param('id') id: string,
    @Param('historyId') historyId: string,
  ) {
    try {
      const lead = await this.leadService.deleteLeadHistory(+id, +historyId);
      return { success: true, message: 'Timeline record deleted successfully', data: { lead } };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to delete timeline record', data: null };
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async deleteLead(@Param('id') id: string) {
    await this.leadService.deleteLead(+id);
    return { success: true, message: 'Lead permanently deleted.', data: null };
  }
}
