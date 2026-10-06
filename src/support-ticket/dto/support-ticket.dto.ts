import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray, Matches, Length } from 'class-validator';
import { TicketType, TicketStatus, TicketPriority, ComplaintCategory } from '@prisma/client';

export class CreateSupportTicketDto {
  @IsEnum(TicketType)
  @IsOptional()
  type?: TicketType;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @IsEnum(ComplaintCategory)
  @IsOptional()
  category?: ComplaintCategory;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[6-9]\d{9}$/, { message: 'Phone must be a 10-digit Indian number' })
  phone: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  message: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];

  @IsString()
  @IsOptional()
  orderNumber?: string;

  @IsString()
  @IsOptional()
  website?: string; // honeypot

  @IsNumber()
  @IsOptional()
  leadId?: number;

  @IsNumber()
  @IsOptional()
  leadItemId?: number;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  utmSource?: string;

  @IsString()
  @IsOptional()
  utmMedium?: string;

  @IsString()
  @IsOptional()
  utmCampaign?: string;

  @IsString()
  @IsOptional()
  landingPage?: string;
}

export class UpdateSupportTicketDto {
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @IsEnum(ComplaintCategory)
  @IsOptional()
  category?: ComplaintCategory;

  @IsNumber()
  @IsOptional()
  assignedToId?: number;

  @IsString()
  @IsOptional()
  resolutionNote?: string;

  @IsNumber()
  @IsOptional()
  claimAmount?: number;
}

export class CreateTicketMessageDto {
  @IsString()
  @IsNotEmpty()
  body: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];

  @IsBoolean()
  @IsOptional()
  isInternal?: boolean;
}
