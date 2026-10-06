import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateContactDto {
  @IsString()
  @IsOptional()
  primaryPhone?: string;

  @IsString()
  @IsOptional()
  whatsappNumber?: string;

  @IsString()
  @IsOptional()
  alternatePhone?: string;

  @IsEmail()
  @IsOptional()
  supportEmail?: string;

  @IsEmail()
  @IsOptional()
  salesEmail?: string;

  @IsString()
  @IsOptional()
  headOfficeAddress?: string;

  @IsString()
  @IsOptional()
  googleMapsLink?: string;

  @IsString()
  @IsOptional()
  facebookUrl?: string;

  @IsString()
  @IsOptional()
  instagramUrl?: string;

  @IsString()
  @IsOptional()
  twitterUrl?: string;

  @IsString()
  @IsOptional()
  linkedinUrl?: string;
}
