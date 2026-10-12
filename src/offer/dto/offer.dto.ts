import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDateString, MaxLength } from 'class-validator';

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  headline?: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsBoolean()
  @IsOptional()
  showCouponCode?: boolean;

  @IsString()
  @IsNotEmpty()
  discount: string;

  @IsString()
  @IsOptional()
  discountType?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsString()
  @IsOptional()
  bodyText?: string;

  @IsOptional()
  terms?: any;

  @IsOptional()
  faqs?: any;

  @IsOptional()
  bannerImage?: any;

  @IsString()
  @IsOptional()
  bannerImageAlt?: string;

  @IsString()
  @IsOptional()
  appStoreUrl?: string;

  @IsString()
  @IsOptional()
  playStoreUrl?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  claimedCount?: number;

  @IsNumber()
  @IsOptional()
  maxClaims?: number;

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

  @IsBoolean()
  @IsOptional()
  isLimitedTime?: boolean;

  @IsBoolean()
  @IsOptional()
  showInUrgencyTicker?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}

export class UpdateOfferDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  headline?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsBoolean()
  @IsOptional()
  showCouponCode?: boolean;

  @IsString()
  @IsOptional()
  discount?: string;

  @IsString()
  @IsOptional()
  discountType?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsString()
  @IsOptional()
  bodyText?: string;

  @IsOptional()
  terms?: any;

  @IsOptional()
  faqs?: any;

  @IsOptional()
  bannerImage?: any;

  @IsString()
  @IsOptional()
  bannerImageAlt?: string;

  @IsString()
  @IsOptional()
  appStoreUrl?: string;

  @IsString()
  @IsOptional()
  playStoreUrl?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  claimedCount?: number;

  @IsNumber()
  @IsOptional()
  maxClaims?: number;

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

  @IsBoolean()
  @IsOptional()
  isLimitedTime?: boolean;

  @IsBoolean()
  @IsOptional()
  showInUrgencyTicker?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}
