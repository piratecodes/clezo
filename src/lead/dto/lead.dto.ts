import { IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LeadStatus, ServiceMode } from '@prisma/client';

export class CreateLeadItemDto {
  @IsString()
  @IsOptional()
  itemName?: string;

  @IsString()
  @IsOptional()
  serviceName?: string;

  @IsNumber()
  @IsOptional()
  serviceId?: number;

  @IsNumber()
  @IsOptional()
  itemId?: number;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  totalPrice: number;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  overrideReason?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  quoteStatus?: string;
}

export class CreateLeadDto {
  @IsEnum(ServiceMode)
  @IsNotEmpty()
  serviceMode: ServiceMode;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsOptional()
  customerComment?: string;

  @IsString()
  @IsOptional()
  addressLine?: string;

  @IsString()
  @IsOptional()
  landmark?: string;

  @IsString()
  @IsOptional()
  locality?: string;

  @IsString()
  @IsOptional()
  pincode?: string;

  @IsDateString()
  @IsOptional()
  pickupDate?: string;

  @IsString()
  @IsOptional()
  pickupSlot?: string;

  @IsNumber()
  @IsOptional()
  total?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLeadItemDto)
  @IsOptional()
  items?: CreateLeadItemDto[];

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  initialStatus?: string;

  @IsOptional()
  forceSave?: boolean;

  @IsOptional()
  expectedVisitAt?: string | Date;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  discountType?: string;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}

export class UpdateLeadDto {
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsString()
  @IsOptional()
  adminNotes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLeadItemDto)
  @IsOptional()
  items?: CreateLeadItemDto[];

  @IsDateString()
  @IsOptional()
  pickupDate?: string;

  @IsOptional()
  expectedVisitAt?: string | Date;

  @IsString()
  @IsOptional()
  pickupSlot?: string;
}

export class UpdateLeadStatusDto {
  @IsEnum(LeadStatus)
  @IsNotEmpty()
  status: LeadStatus;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  customerNote?: string;

  @IsString()
  @IsOptional()
  cancelReason?: string;
}
