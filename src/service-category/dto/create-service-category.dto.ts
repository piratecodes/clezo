import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateServiceCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  seoMetaTitle?: string;

  @IsString()
  @IsOptional()
  seoMetaDescription?: string;

  @IsString()
  @IsOptional()
  seoMetaKeywords?: string;

  @IsString()
  @IsOptional()
  seoCanonicalUrl?: string;

  @IsBoolean()
  @IsOptional()
  seoIsNoIndex?: boolean;

  @IsString()
  @IsOptional()
  seoJsonLdSchema?: string;

  @IsString()
  @IsOptional()
  headerTitle?: string;

  @IsString()
  @IsOptional()
  headerIntroText?: string;

  @IsOptional()
  sections?: any;

  @IsOptional()
  faqs?: any;

  @IsString()
  @IsOptional()
  orderAction?: string;
}
