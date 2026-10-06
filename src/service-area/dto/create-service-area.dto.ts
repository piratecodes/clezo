import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateServiceAreaDto {
  @IsString()
  @IsNotEmpty()
  pincode: string;

  @IsString()
  @IsNotEmpty()
  areaName: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  localities?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
