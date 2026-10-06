import { Controller, Get, Post, Body, Patch, Param, Query, Req, UseGuards, Ip } from '@nestjs/common';
import { SupportTicketService } from './support-ticket.service';
import { CreateSupportTicketDto, UpdateSupportTicketDto, CreateTicketMessageDto } from './dto/support-ticket.dto';
import { TicketType, TicketStatus } from '@prisma/client';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Request } from 'express';

@Controller('support-tickets')
export class SupportTicketController {
  constructor(private readonly supportTicketService: SupportTicketService) {}

  // Public endpoint for submitting tickets/enquiries
  @Post()
  create(
    @Body() createDto: CreateSupportTicketDto,
    @Ip() ipAddress: string
  ) {
    return this.supportTicketService.create(createDto, ipAddress);
  }

  // Admin endpoint: List all tickets
  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('type') type?: TicketType,
    @Query('status') status?: TicketStatus,
  ) {
    return this.supportTicketService.findAll({ type, status });
  }

  // Admin endpoint: Command Center stats
  @UseGuards(AuthGuard)
  @Get('stats/command-center')
  getCommandCenterStats(@Query('days') days?: string) {
    return this.supportTicketService.getCommandCenterStats(days ? parseInt(days) : 30);
  }

  // Admin endpoint: Get specific ticket with messages
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportTicketService.findOne(+id);
  }

  // Admin endpoint: Update ticket (assign, change status, etc)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSupportTicketDto
  ) {
    return this.supportTicketService.update(+id, updateDto);
  }

  // Add message (Staff replies/internal notes)
  @UseGuards(AuthGuard)
  @Post(':id/messages/staff')
  addStaffMessage(
    @Param('id') id: string,
    @Body() dto: CreateTicketMessageDto,
    @Req() req: any
  ) {
    return this.supportTicketService.addMessage(+id, req.user.id, 'STAFF', dto);
  }

  // Public endpoint: Add message (Customer replies using ticket link)
  @Post(':id/messages/customer')
  addCustomerMessage(
    @Param('id') id: string,
    @Body() dto: CreateTicketMessageDto
  ) {
    // Force isInternal to false for customer
    dto.isInternal = false;
    return this.supportTicketService.addMessage(+id, null, 'CUSTOMER', dto);
  }
}
