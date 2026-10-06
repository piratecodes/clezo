import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class FaqDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  authorId?: number;

  @IsString()
  @IsOptional()
  customAuthor?: string;

  @IsString()
  @IsOptional()
  coverImageAlt?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FaqDto)
  @IsOptional()
  faqs?: FaqDto[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

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
}

export class UpdateBlogDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  authorId?: number;

  @IsString()
  @IsOptional()
  customAuthor?: string;

  @IsString()
  @IsOptional()
  coverImageAlt?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FaqDto)
  @IsOptional()
  faqs?: FaqDto[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

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
}
