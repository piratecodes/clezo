import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateServiceOptionDto {
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsString()
  @IsNotEmpty()
  serviceType: string;

  @IsString()
  @IsOptional()
  productTag?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  basePrice?: number;

  @IsString()
  @IsOptional()
  pricingUnit?: string;

  @IsNumber()
  @IsOptional()
  offerPrice?: number;

  @IsBoolean()
  @IsOptional()
  isOfferActive?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsString()
  @IsOptional()
  orderAction?: string;

  @IsBoolean()
  @IsOptional()
  isCustomPricing?: boolean;

  @IsString()
  @IsOptional()
  customPriceLabel?: string;
}

export class UpdateServiceOptionDto {
  @IsString()
  @IsOptional()
  categoryName?: string;

  @IsString()
  @IsOptional()
  serviceType?: string;

  @IsString()
  @IsOptional()
  productTag?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  basePrice?: number;

  @IsString()
  @IsOptional()
  pricingUnit?: string;

  @IsNumber()
  @IsOptional()
  offerPrice?: number;

  @IsBoolean()
  @IsOptional()
  isOfferActive?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsString()
  @IsOptional()
  orderAction?: string;

  @IsBoolean()
  @IsOptional()
  isCustomPricing?: boolean;

  @IsString()
  @IsOptional()
  customPriceLabel?: string;
}
